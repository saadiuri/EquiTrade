const token = localStorage.getItem("authToken");
if (!token) {
  alert("Você precisa estar logado para acessar as mensagens.");
  window.location.href = "login.html";
  throw new Error("Não autenticado");
}

interface Mensagem {
  id: string;
  remetenteId: string;
  destinatarioId: string;
  conteudo: string;
  enviadoEm: string;
}

const inputMensagem = document.getElementById(
  "mensagemInput"
) as HTMLInputElement;
const chatContainer = document.getElementById("chatBox") as HTMLDivElement;
const btnEnviar = document.getElementById("enviarBtn") as HTMLButtonElement;

const destinatarioId = localStorage.getItem("destinatarioId");

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

const usuarioLogadoId = pegarUsuarioId(token);

if (!usuarioLogadoId) {
  alert("Erro ao identificar usuário. Faça login novamente.");
}

async function carregarMensagens() {
  if (!destinatarioId || !usuarioLogadoId) {
    chatContainer.innerHTML = "<p>Nenhuma conversa selecionada.</p>";
    return;
  }

  try {
    const resposta = await fetch(
      `http://localhost:3000/api/mensagens?destinatarioId=${destinatarioId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    if (!resposta.ok) {
      throw new Error("Erro ao carregar mensagens");
    }

    const dados = await resposta.json();
    const mensagens: Mensagem[] = dados.data || [];

    exibirMensagens(mensagens);
  } catch (erro) {
    console.error("Erro ao carregar mensagens:", erro);
    chatContainer.innerHTML = "<p class='erro'>Erro ao carregar mensagens.</p>";
  }
}

function exibirMensagens(mensagens: Mensagem[]) {
  chatContainer.innerHTML = "";

  if (mensagens.length === 0) {
    chatContainer.innerHTML =
      "<p>Nenhuma mensagem ainda. Comece a conversa!</p>";
    return;
  }

  mensagens.forEach((msg) => {
    const divMensagem = document.createElement("div");
    divMensagem.classList.add("mensagem");

    if (msg.remetenteId === usuarioLogadoId) {
      divMensagem.classList.add("enviada");
    } else {
      divMensagem.classList.add("recebida");
    }

    const dataFormatada = new Date(msg.enviadoEm).toLocaleTimeString("pt-BR", {
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

  if (!destinatarioId || !usuarioLogadoId) {
    alert("Erro ao identificar destinatário.");
    return;
  }

  try {
    const resposta = await fetch("http://localhost:3000/api/mensagens", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        destinatarioId,
        conteudo,
      }),
    });

    if (!resposta.ok) {
      throw new Error("Erro ao enviar mensagem");
    }

    inputMensagem.value = "";
    await carregarMensagens();
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

carregarMensagens();

setInterval(carregarMensagens, 5000);
