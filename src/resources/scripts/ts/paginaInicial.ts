import { API_BASE_URL } from './config.js';

interface Cavalo {
    id: string;
    nome: string;
    raca: string;
    foto: string;
}

// URL base da sua API is provided by ./config.js (do not redeclare API_BASE_URL here)

document.addEventListener("DOMContentLoaded", carregarCavalosDestaque);

async function carregarCavalosDestaque(): Promise<void> {
    const container = document.querySelector(".cards") as HTMLDivElement;
    // Elemento de feedback visual (opcional, mas recomendado)
    const feedback = document.querySelector(".cavalos-destaque h2");

    if (!container) return;

    // 1. Verificar Autenticação
    const token = localStorage.getItem("authToken");

    if (!token) {
        console.warn("Usuário não autenticado. Redirecionando para login.");
        if (feedback) feedback.textContent = "Você precisa fazer login para ver os destaques. Redirecionando...";
        // Redirecionamento silencioso em vez de alert()
        setTimeout(() => {
            window.location.href = "login.html";
        }, 1500);
        return;
    }

    try {
        if (feedback) feedback.textContent = "Carregando Cavalos em Destaque...";

        // 2. Requisição à API
        const resposta = await fetch(`${API_BASE_URL}/cavalos`, {
            headers: {
                // Remove espaços extras com .trim()
                "Authorization": `Bearer ${token}`.trim()
            }
        });

        if (!resposta.ok) {
            console.error(`Falha ao buscar cavalos: Status ${resposta.status}`);
            if (feedback) feedback.textContent = "Erro ao carregar cavalos. Tente recarregar a página.";
            return;
        }

        // Converte o corpo da resposta em JSON e lida com formatos diferentes:
        // - resposta diretamente como array de cavalos
        // - objeto { data: [...] }
        const dadosResposta = await resposta.json();
        const cavalos: Cavalo[] = Array.isArray(dadosResposta)
            ? dadosResposta
            : (dadosResposta && Array.isArray(dadosResposta.data) ? dadosResposta.data : []);

        container.innerHTML = ""; // Limpa os cards de demonstração do HTML

        if (cavalos.length === 0) {
            if (feedback) feedback.textContent = "Nenhum cavalo em destaque encontrado no momento.";
            return;
        }

        if (feedback) feedback.textContent = "Cavalos em Destaque";

        // 3. Renderização dos Cards
        cavalos.forEach((cavalo) => {
            const card = document.createElement("div");
            card.className = "card";
            card.innerHTML = `
                <img src="${cavalo.foto}" alt="${cavalo.nome}" loading="lazy"> 
                <div class="info">
                    <h3>${cavalo.nome}</h3>
                    <p>Raça: ${cavalo.raca}</p>
                    <button data-id="${cavalo.id}">Ver detalhes</button>
                </div>
            `;
            container.appendChild(card);
        });

        // 4. Adicionar Event Listeners
        adicionarEventosVerDetalhes();

    } catch (erro) {
        console.error("Erro ao conectar com a API de cavalos:", erro);
        if (feedback) feedback.textContent = "Erro de conexão. Verifique o servidor backend.";
    }
}

function adicionarEventosVerDetalhes(): void {
    const botoes = document.querySelectorAll("button[data-id]") as NodeListOf<HTMLButtonElement>;
    botoes.forEach((btn) => {
        btn.addEventListener("click", () => {
            const id = btn.getAttribute("data-id");
            if (id) {
                // Redireciona para a página de detalhes, usando o ID
                window.location.href = `detalhesCavalo.html?id=${id}`;
            }
        });
    });

}

