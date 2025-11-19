//  paginaInicial.ts - EquiTrade
//  Carrega cavalos em destaque

interface Cavalo {
    id: string;
    nome: string;
    raca: string;
    foto: string;
}

// Busca cavalos em destaque assim que a página carregar
document.addEventListener("DOMContentLoaded", carregarCavalosDestaque);

async function carregarCavalosDestaque(): Promise<void> {
    const container = document.querySelector(".cards");

    if (!container) return;

    try {
        // Endpoint de cavalos em destaque (a ser implementado no backend)
        const resposta = await fetch("http://localhost:3333/api/cavalos/destaque");

        if (!resposta.ok) {
            console.warn("API de cavalos em destaque ainda não disponível.");
            return;
        }

        const cavalos: Cavalo[] = await resposta.json();

        container.innerHTML = "";

        cavalos.forEach((cavalo) => {
            const card = document.createElement("div");
            card.className = "card";

            card.innerHTML = `
                <img src="${cavalo.foto}" alt="${cavalo.nome}">
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
        console.error("Erro ao carregar cavalos:", erro);
    }
}

// Ativa botões "Ver detalhes"
function adicionarEventosVerDetalhes(): void {
    const botoes = document.querySelectorAll("button[data-id]");

    botoes.forEach((btn) => {
        btn.addEventListener("click", () => {
            const id = btn.getAttribute("data-id");
            if (id) {
                window.location.href = `detalhesCavalo.html?id=${id}`;
            }
        });
    });
}
