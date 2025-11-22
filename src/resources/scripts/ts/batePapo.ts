
// Tipos
interface Mensagem {
    id: string;
    remetenteId: string;
    destinatarioId: string;
    conteudo: string;
    enviadoEm: string;
}

// Elementos do DOM
const inputMensagem = document.getElementById("mensagemInput") as HTMLInputElement;
const chatContainer = document.getElementById("chatBox") as HTMLDivElement;
const btnEnviar = document.getElementById("enviarBtn") as HTMLButtonElement;

// Token e IDs
const token = localStorage.getItem("authToken");
const destinatarioId = localStorage.getItem("destinatarioId");

// Decodificar JWT
function pegarUsuarioId(jwt: string | null): string | null {
    if (!jwt) return null;

    try {
        const base64Url = jwt.split(".")[1];
        if (!base64Url) return null;
        const payload = JSON.parse(atob(base64Url));
        return payload.userId || null;
    } catch {
        return null;
    }
}

const remetenteId = pegarUsuarioId(token);

// LOG DEBUG
console.log("CHAT:", { remetenteId, destinatarioId });

// Enviar mensagem
async function enviarMensagem(texto: string) {
    if (!texto.trim()) return;

    if (!token) return console.error("Token ausente!");
    if (!remetenteId) return console.error("remetenteId ausente!");
    if (!destinatarioId) return console.error("destinatarioId ausente!");

    const payload = {
        remetente_id: remetenteId,
        destinatario_id: destinatarioId,
        conteudo: texto
    };


    const res = await fetch("http://localhost:3000/api/mensagens", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(payload)
    });

    const data = await res.json();

    console.log("ENVIO:", data);

    if (!data.success) {
        console.error("Erro ao enviar:", data.message);
        return;
    }

    adicionarMensagem(data.data);
}

// Carregar histórico
async function carregarHistorico() {
    if (!token) return;
    if (!destinatarioId) return console.error("destinatarioId ausente!");

    const res = await fetch(
        `http://localhost:3000/api/mensagens/conversation/${destinatarioId}`,
        {
            headers: { "Authorization": `Bearer ${token}` }
        }
    );

    const data = await res.json();

    console.log("HISTÓRICO:", data);

    if (!data.success) {
        console.error("Erro histórico:", data.message);
        return;
    }

    const mensagens: Mensagem[] = Array.isArray(data.data)
        ? data.data
        : data.data.mensagens || [];

    mensagens.forEach(msg => adicionarMensagem(msg));
}

// Renderizar mensagem
function adicionarMensagem(msg: Mensagem) {
    const div = document.createElement("div");
    div.className = msg.remetenteId === remetenteId
        ? "mensagem enviada"
        : "mensagem recebida";

    div.innerHTML = `
        <p><strong>${msg.remetenteId === remetenteId ? "Você" : "Ele"}:</strong> ${msg.conteudo}</p>
        <span>${new Date(msg.enviadoEm).toLocaleTimeString("pt-BR", {
        hour: "2-digit",
        minute: "2-digit"
    })}</span>
    `;

    chatContainer.appendChild(div);
    chatContainer.scrollTop = chatContainer.scrollHeight;
}

// Eventos
btnEnviar.addEventListener("click", () => {
    enviarMensagem(inputMensagem.value);
    inputMensagem.value = "";
});

inputMensagem.addEventListener("keydown", e => {
    if (e.key === "Enter") {
        enviarMensagem(inputMensagem.value);
        inputMensagem.value = "";
    }
});

// Auto-load
document.addEventListener("DOMContentLoaded", carregarHistorico);
