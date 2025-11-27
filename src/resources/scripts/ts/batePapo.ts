import { API_BASE_URL } from "./config.js";
import { requireAuth } from "./autenticacao.js";

(function () {
  if (!requireAuth()) return;

  const API_URL = `${API_BASE_URL}/mensagens`;

  interface Mensagem {
    id: string;
    conteudo: string;
    createAt: string;
    remetente: {
      id: string;
      nome: string;
      email: string;
    };
    destinatario: {
      id: string;
      nome: string;
      email: string;
    };
  }

  interface Conversation {
    otherUser: {
      id: string;
      nome: string;
      email: string;
    };
    messages: Mensagem[];
    totalMessages: number;
  }

  const inputMensagem = document.getElementById(
    "mensagemInput"
  ) as HTMLInputElement;
  const chatContainer = document.getElementById("chatBox") as HTMLDivElement;
  const btnEnviar = document.getElementById("enviarBtn") as HTMLButtonElement;
  const nomeUsuarioEl = document.getElementById("nomeUsuario");
  const emailUsuarioEl = document.getElementById("emailUsuario");

  const urlParams = new URLSearchParams(window.location.search);
  const otherUserId = urlParams.get("userId");

  if (!otherUserId) {
    alert("Nenhuma conversa selecionada.");
    window.location.href = "mensagens.html";
    throw new Error("No userId in URL");
  }

  function extractToken(): string {
    return localStorage.getItem("authToken") || "";
  }

  function extractUserId(): string {
    try {
      const token = extractToken();
      if (!token) return "";

      const parts = token.split(".");
      if (parts.length !== 3 || !parts[1]) return "";

      const payload = JSON.parse(atob(parts[1]));
      return payload.userId || payload.id || "";
    } catch (error) {
      console.error("Erro ao extrair userId do token:", error);
      return "";
    }
  }

  const usuarioLogadoId = extractUserId();

  if (!usuarioLogadoId) {
    alert("Erro ao identificar usuário. Faça login novamente.");
    window.location.href = "login.html";
    throw new Error("Cannot identify logged user");
  }

  async function carregarConversa() {
    try {
      const token = extractToken();
      const url = `${API_URL}/conversation/${otherUserId}`;

      const headers: HeadersInit = {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      };

      const resposta = await fetch(url, { headers });

      if (!resposta.ok) {
        throw new Error("Erro ao carregar conversa");
      }

      const dados = await resposta.json();
      const conversation: Conversation = dados.data;

      if (nomeUsuarioEl) nomeUsuarioEl.textContent = conversation.otherUser.nome;
      if (emailUsuarioEl) emailUsuarioEl.textContent = conversation.otherUser.email;
// Enable input and button
      inputMensagem.disabled = false;
      btnEnviar.disabled = false;

      exibirMensagens(conversation.messages);
    } catch (erro) {
      console.error("Erro ao carregar conversa:", erro);
      chatContainer.innerHTML =
        "<p class='erro'>Erro ao carregar conversa.</p>";
    }
  }

  function exibirMensagens(mensagens: Mensagem[]) {
    chatContainer.innerHTML = "";

    if (mensagens.length === 0) {
      chatContainer.innerHTML =
        "<p class='vazio'>Nenhuma mensagem ainda. Comece a conversa!</p>";
      return;
    }

    mensagens.forEach((msg) => {
      const divMensagem = document.createElement("div");
      divMensagem.classList.add("mensagem");

      if (msg.remetente.id === usuarioLogadoId) {
        divMensagem.classList.add("enviada");
      } else {
        divMensagem.classList.add("recebida");
      }

      const dataFormatada = new Date(msg.createAt).toLocaleString("pt-BR", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });

      divMensagem.innerHTML = `
        <p>${msg.conteudo}</p>
        <span>${dataFormatada}</span>
      `;

      chatContainer.appendChild(divMensagem);
    });

    chatContainer.scrollTop = chatContainer.scrollHeight;
  }

  async function enviarMensagem() {
    const conteudo = inputMensagem.value.trim();

    if (!conteudo) {
      alert("Digite uma mensagem antes de enviar.");
      return;
    }

    if (!otherUserId) {
      alert("Erro ao identificar destinatário.");
      return;
    }

    try {
      const token = extractToken();
      const resposta = await fetch(API_URL, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          destinatario_id: otherUserId,
          conteudo,
        }),
      });

      if (!resposta.ok) {
        throw new Error("Erro ao enviar mensagem");
      }

      inputMensagem.value = "";
      await carregarConversa();
    } catch (erro) {
      console.error("Erro ao enviar mensagem:", erro);
      alert("Erro ao enviar mensagem. Tente novamente.");
    }
  }

  btnEnviar.addEventListener("click", enviarMensagem);

  inputMensagem.addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
      enviarMensagem();
    }
  });

  carregarConversa();

  setInterval(carregarConversa, 5000);
})();
