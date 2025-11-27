import { API_BASE_URL } from "./config.js";

interface Cavalo {
  id: string;
  nome: string;
  raca: string;
  foto: string;
}

document.addEventListener("DOMContentLoaded", carregarCavalosDestaque);

async function carregarCavalosDestaque(): Promise<void> {
  const container = document.querySelector(".cards") as HTMLDivElement;
  const feedback = document.querySelector(".cavalos-destaque h2");

  if (!container) return;

  const token = localStorage.getItem("authToken");

  try {
    if (feedback) feedback.textContent = "Carregando Cavalos em Destaque...";

    const headers: HeadersInit = {};
    if (token) {
      headers["Authorization"] = `Bearer ${token}`.trim();
    }

    const resposta = await fetch(`${API_BASE_URL}/cavalos`, {
      headers,
    });

    if (!resposta.ok) {
      console.error(`Falha ao buscar cavalos: Status ${resposta.status}`);
      if (feedback)
        feedback.textContent =
          "Erro ao carregar cavalos. Tente recarregar a página.";
      return;
    }

    const dadosResposta = await resposta.json();
    const cavalos: Cavalo[] = Array.isArray(dadosResposta)
      ? dadosResposta
      : dadosResposta && Array.isArray(dadosResposta.data)
      ? dadosResposta.data
      : [];

    container.innerHTML = "";

    if (cavalos.length === 0) {
      if (feedback)
        feedback.textContent =
          "Nenhum cavalo em destaque encontrado no momento.";
      return;
    }

    if (feedback) feedback.textContent = "Cavalos em Destaque";

    cavalos.forEach((cavalo) => {
      const card = document.createElement("div");
      card.className = "card";
      card.innerHTML = `
                <img src="${
                  cavalo.foto || "/assets/Imagens/logoSemFundo.png"
                }" alt="${cavalo.nome}" loading="lazy"> 
                <div class="info">
                    <h3>${cavalo.nome}</h3>
                    <p>Raça: ${cavalo.raca}</p>
                    <button data-id="${cavalo.id}">Ver detalhes</button>
                </div>
            `;
      container.appendChild(card);
    });

    adicionarEventosVerDetalhes();
  } catch (erro) {
    console.error("Erro ao conectar com a API de cavalos:", erro);
    if (feedback)
      feedback.textContent = "Erro de conexão. Verifique o servidor backend.";
  }
}

function adicionarEventosVerDetalhes(): void {
  const botoes = document.querySelectorAll(
    "button[data-id]"
  ) as NodeListOf<HTMLButtonElement>;
  botoes.forEach((btn) => {
    btn.addEventListener("click", () => {
      const id = btn.getAttribute("data-id");
      if (id) {
        window.location.href = `detalhesCavalo.html?id=${id}`;
      }
    });
  });
}
