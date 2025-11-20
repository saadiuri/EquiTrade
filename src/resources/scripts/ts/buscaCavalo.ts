// Interface alinhada com o backend
interface Cavalo {
    id: string;
    nome: string;
    idade: number;
    raca: string;
    descricao?: string;
    preco: number;
    disponivel: boolean;
    premios?: string;
    imagemUrl?: string;
    dono: {
        id: string;
        nome: string;
        email: string;
    };
}

interface CavaloResponse {
    success: boolean;
    data: Cavalo[];
}

// Seletores do HTML
const formBusca = document.getElementById("form-busca-cavalo") as HTMLFormElement;
const inputBusca = document.getElementById("busca") as HTMLInputElement;
const resultadosContainer = document.getElementById("resultados-cavalo") as HTMLDivElement;

if (formBusca) {
    formBusca.addEventListener("submit", async (event) => {
        event.preventDefault();

        const termo = inputBusca.value.trim();
        if (!termo) {
            alert("Digite algo para buscar.");
            return;
        }

        buscarCavalos(termo);
    });
}

// Função que consulta o backend
async function buscarCavalos(termo: string) {
    try {
        const token = localStorage.getItem("authToken");
        if (!token) {
            alert("Você precisa estar logado!");
            return;
        }

        const response = await fetch(
            `http://localhost:3000/api/cavalos?nome=${encodeURIComponent(termo)}`,
            {
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "application/json"
                }
            }
        );

        if (!response.ok) {
            resultadosContainer.innerHTML = `<p class="erro">Erro ao buscar cavalos.</p>`;
            return;
        }

        const json: CavaloResponse = await response.json();

        if (!json.success || json.data.length === 0) {
            resultadosContainer.innerHTML = `<p class="nenhum">Nenhum cavalo encontrado.</p>`;
            return;
        }

        exibirResultados(json.data);

    } catch (error) {
        console.error(error);
        resultadosContainer.innerHTML = `<p class="erro">Falha na conexão com o servidor.</p>`;
    }
}

// Função para montar os resultados na tela
function exibirResultados(lista: Cavalo[]) {
    resultadosContainer.innerHTML = "";

    lista.forEach((cavalo) => {
        const card = document.createElement("div");
        card.classList.add("card-cavalo");

        card.innerHTML = `
            <img src="${cavalo.imagemUrl || "img/default-horse.png"}" class="foto-cavalo" alt="Cavalo">
            <h3>${cavalo.nome}</h3>
            <p><strong>Raça:</strong> ${cavalo.raca}</p>
            <p><strong>Idade:</strong> ${cavalo.idade} anos</p>
            <p><strong>Preço:</strong> R$ ${cavalo.preco.toFixed(2)}</p>
            <p class="descricao">${cavalo.descricao || ""}</p>
            <p><strong>Dono:</strong> ${cavalo.dono.nome} (${cavalo.dono.email})</p>
            <p><strong>Disponível:</strong> ${cavalo.disponivel ? "Sim" : "Não"}</p>
        `;

        resultadosContainer.appendChild(card);
    });
}
