
interface MensagemFormData {
    remetenteId: string;
    destinatarioId: string;
    conteudo: string;
}

interface MensagemResponse {
    id: string;
    remetenteId: string;
    destinatarioId: string;
    conteudo: string;
    enviadoEm: string;
}

interface HistoricoResponse {
    mensagens: MensagemResponse[];
}

// Seletores do HTML
const inputMensagem = document.getElementById("mensagemInput") as HTMLInputElement;
const chatContainer = document.getElementById("chatBox") as HTMLDivElement;
const btnEnviar = document.getElementById("enviarBtn") as HTMLButtonElement;

// Token de autenticação
const token = localStorage.getItem("authToken");

// Função para decodificar JWT e pegar o userId
function pegarUsuarioIdDoToken(jwt: string | null): string | null {
    if (!jwt) return null;
    try {
        const parts = jwt.split('.');
        const payload = parts[1];
        if (typeof payload !== "string") return null;
        // Convert base64url to base64
        const base64 = payload.replace(/-/g, "+").replace(/_/g, "/");
        // Add padding if necessary
        const padded = base64 + "=".repeat((4 - (base64.length % 4)) % 4);
        // atob expects a base64 string
        const binary = atob(padded);
        // Handle potential UTF-8 in the decoded string
        const decoded = decodeURIComponent(binary.split('').map((c) => {
            const code = c.charCodeAt(0).toString(16).toUpperCase();
            return '%' + (code.length % 2 ? '0' + code : code);
        }).join(''));
        const obj = JSON.parse(decoded);
        return obj.userId || obj.usuarioId || null;
    } catch {
        return null;
    }
}

// IDs do usuário e destinatário
const remetenteId = pegarUsuarioIdDoToken(token);
const destinatarioId = localStorage.getItem("destinatarioId");

// DEBUG: verificar valores
console.log("DEBUG login:", { remetenteId, destinatarioId, token });

// Validação de login (não bloqueia testes)
if (!token || !remetenteId) {
    console.warn("Usuário não logado ou token ausente. Redirecionamento bloqueado para testes.");
    // alert("Você precisa estar logado para acessar o chat.");
    // window.location.href = "login.html";
}

// Função para enviar mensagem
async function enviarMensagem(texto: string) {
    if (!texto.trim() || !remetenteId || !destinatarioId) return;


    const mensagem: MensagemFormData = {
        remetenteId,
        destinatarioId,
        conteudo: texto
    };

    try {
        const res = await fetch("http://localhost:3000/api/mensagens", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`.trim()
            },
            body: JSON.stringify(mensagem)
        });

        if (!res.ok) {
            console.error("Erro ao enviar mensagem:", res.status, res.statusText);
            alert("Erro ao enviar mensagem.");
            return;
        }

        const novaMensagem: MensagemResponse = await res.json();
        adicionarMensagemNaTela(novaMensagem);

    } catch (erro) {
        console.error("Erro ao enviar mensagem:", erro);
        alert("Falha ao enviar mensagem.");
    }


}

// Função para carregar histórico
async function carregarHistorico() {
    if (!destinatarioId) return;


    try {
        const res = await fetch(`http://localhost:3000/api/mensagens/conversation/${destinatarioId}`, {
            headers: { "Authorization": `Bearer ${token}`.trim() }
        });

        if (!res.ok) {
            console.warn("Não foi possível carregar o histórico:", res.status, res.statusText);
            return;
        }

        const historico: HistoricoResponse = await res.json();
        historico.mensagens.forEach(msg => adicionarMensagemNaTela(msg));

    } catch (erro) {
        console.error("Erro ao carregar histórico:", erro);
    }


}

// Renderiza mensagem no chat
function adicionarMensagemNaTela(msg: MensagemResponse) {
    if (!chatContainer) return;


    const div = document.createElement("div");
    div.classList.add("mensagem", msg.remetenteId === remetenteId ? "enviada" : "recebida");

    div.innerHTML = `
    <p><strong>${msg.remetenteId === remetenteId ? "Você" : "Outro"}:</strong> ${msg.conteudo}</p>
    <span>${formatarHorario(msg.enviadoEm)}</span>
`;

    chatContainer.appendChild(div);
    chatContainer.scrollTop = chatContainer.scrollHeight;


}

// Formata horário da mensagem
function formatarHorario(data: string) {
    const d = new Date(data);
    return d.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" });
}


// Eventos de envio
btnEnviar?.addEventListener("click", () => {
    const texto = inputMensagem.value;
    enviarMensagem(texto);
    inputMensagem.value = "";
});

inputMensagem?.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
        e.preventDefault();
        const texto = inputMensagem.value;
        enviarMensagem(texto);
        inputMensagem.value = "";
    }
});

// Carrega histórico ao iniciar a página
document.addEventListener("DOMContentLoaded", () => carregarHistorico());

