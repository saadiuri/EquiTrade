// Estrutura para enviar mensagens
interface MensagemFormData {
    remetenteId: string;
    destinatarioId: string;
    conteudo: string;
}

// Estrutura retornada pelo backend (quando existir)
interface MensagemResponse {
    id: string;
    remetenteId: string;
    destinatarioId: string;
    conteudo: string;
    enviadoEm: string;
}

// Estrutura para mensagens no histórico
interface HistoricoResponse {
    mensagens: MensagemResponse[];
}

// Seletores do HTML
const form = document.getElementById("form-batepapo") as HTMLFormElement;
const inputMensagem = document.getElementById("mensagem") as HTMLInputElement;
const chatContainer = document.getElementById("chat-container") as HTMLDivElement;

// IDs dos usuários (quando integrar com login, isso virá da sessão)
const remetenteId = localStorage.getItem("usuarioId") || "1";
const destinatarioId = localStorage.getItem("destinatarioId") || "2";

// Enviar mensagem
if (form) {
    form.addEventListener("submit", async (event) => {
        event.preventDefault();

        const texto = inputMensagem.value.trim();
        if (texto.length === 0) return;

        const mensagem: MensagemFormData = {
            remetenteId,
            destinatarioId,
            conteudo: texto
        };

        try {
            const response = await fetch("http://localhost:8080/api/batepapo/enviar", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(mensagem)
            });

            if (!response.ok) {
                alert("Erro ao enviar mensagem.");
                return;
            }

            const novaMensagem: MensagemResponse = await response.json();

            adicionarMensagemNaTela(novaMensagem);

            inputMensagem.value = "";

        } catch (error) {
            console.error(error);
            alert("Falha ao enviar mensagem.");
        }
    });
}

// Carregar histórico do chat
async function carregarHistorico() {
    try {
        const response = await fetch(
            `http://localhost:8080/api/batepapo/historico?usuario=${remetenteId}`
        );

        if (!response.ok) {
            console.warn("Não foi possível carregar o histórico.");
            return;
        }

        const historico: HistoricoResponse = await response.json();

        historico.mensagens.forEach((msg) => adicionarMensagemNaTela(msg));

    } catch (error) {
        console.error(error);
    }
}

// Renderizar mensagens no HTML
function adicionarMensagemNaTela(msg: MensagemResponse) {
    const div = document.createElement("div");
    div.classList.add("mensagem");

    const classe = msg.remetenteId === remetenteId ? "minha" : "dele";
    div.classList.add(classe);

    div.innerHTML = `
        <p><strong>${msg.remetenteId === remetenteId ? "Você" : "Ele"}:</strong> ${msg.conteudo}</p>
        <span class="horario">${formatarHorario(msg.enviadoEm)}</span>
    `;

    chatContainer.appendChild(div);

    chatContainer.scrollTop = chatContainer.scrollHeight;
}

function formatarHorario(data: string) {
    const d = new Date(data);
    return d.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" });
}

// Carrega o histórico assim que o TS rodar
carregarHistorico();
