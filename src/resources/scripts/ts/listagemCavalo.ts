interface CavaloListagem {
    id: string;
    nome: string;
    raca: string;
    idade: number;
    descricao: string;
    preco: number;
    proprietario: {
        nome: string;
        localizacao: string;
    };
}

// Seleciona o corpo da tabela
const tabelaBody = document.querySelector("tbody") as HTMLTableSectionElement;

async function carregarCavalos() {
    try {
        const token = localStorage.getItem("authToken"); // caso a rota exija autenticação
        const resposta = await fetch("http://localhost:3000/api/cavalos", {
            headers: token ? { "Authorization": `Bearer ${token}` } : {}
        });

        if (!resposta.ok) {
            throw new Error(`Erro ao buscar cavalos: ${resposta.status}`);
        }

        const dados = await resposta.json(); // Espera { success: true, data: CavaloListagem[] }

        // Verifica se o backend retornou um array
        const cavalos: CavaloListagem[] = Array.isArray(dados.data) ? dados.data : [];

        if (cavalos.length === 0) {
            tabelaBody.innerHTML = `
                <tr><td colspan="6" class="vazio">Nenhum cavalo encontrado.</td></tr>
            `;
            return;
        }

        // Monta a tabela dinamicamente
        tabelaBody.innerHTML = cavalos.map(cavalo => `
            <tr>
                <td>${cavalo.id}</td>
                <td>${cavalo.nome}</td>
                <td>${cavalo.raca}</td>
                <td>${cavalo.idade} anos</td>
                <td>R$ ${cavalo.preco.toLocaleString("pt-BR")}</td>
                <td><button class="btn-ver" data-id="${cavalo.id}">Ver</button></td>
            </tr>
        `).join("");

        // Adiciona os eventos aos botões
        adicionarEventosNosBotoes();

    } catch (erro) {
        console.error("Erro ao carregar cavalos:", erro);
        tabelaBody.innerHTML = `
            <tr><td colspan="6" class="erro">Erro ao carregar a listagem.</td></tr>
        `;
    }
}

// Função para lidar com os botões "Ver"
function adicionarEventosNosBotoes() {
    const botoes = document.querySelectorAll(".btn-ver");

    botoes.forEach(botao => {
        botao.addEventListener("click", () => {
            const id = (botao as HTMLElement).getAttribute("data-id");
            if (id) {
                window.location.href = `detalhesCavalo.html?id=${id}`;
            }
        });
    });
}

// Executa ao carregar a página
document.addEventListener("DOMContentLoaded", carregarCavalos);
