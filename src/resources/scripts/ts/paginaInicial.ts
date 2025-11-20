import { API_BASE_URL } from './config.js';

interface Cavalo {
    id: string;
    nome: string;
    raca: string;
    foto: string;
}

document.addEventListener("DOMContentLoaded", carregarCavalosDestaque);

async function carregarCavalosDestaque(): Promise<void> {
    const container = document.querySelector(".cards");
    if (!container) return;

    const token = localStorage.getItem("authToken");
    if (!token) {
        alert("Você precisa fazer login para acessar esta página.");
        window.location.href = "login.html";
        return;
    }

    try {
        const resposta = await fetch(`${API_BASE_URL}/cavalos/paginaInicial`, {
            headers: {
                "Authorization": `Bearer ${token} `
            }
        });

        if (!resposta.ok) {
            console.warn("API de cavalos em destaque indisponível ou token inválido.");
            return;
        }

        const cavalos: Cavalo[] = await resposta.json();
        container.innerHTML = "";

        cavalos.forEach((cavalo) => {
            const card = document.createElement("div");
            card.className = "card";
            card.innerHTML = `
        < img src = "${cavalo.foto}" alt = "${cavalo.nome}" >
            <div class="info" >
                <h3>${cavalo.nome} </h3>
                    < p > Raça: ${cavalo.raca} </p>
                        < button data - id="${cavalo.id}" > Ver detalhes </button>
                            </div>
                                `;
            container.appendChild(card);
        });

        adicionarEventosVerDetalhes();

    } catch (erro) {
        console.error("Erro ao carregar cavalos:", erro);
    }


}

function adicionarEventosVerDetalhes(): void {
    const botoes = document.querySelectorAll("button[data-id]");

    botoes.forEach((btn) => {
        btn.addEventListener("click", () => {
            const id = btn.getAttribute("data-id");
            if (id) {
                window.location.href = `detalhesCavalo.html ? id = ${id} `;
            }
        });
    });
}

export {};
