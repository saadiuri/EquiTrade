interface Cavalo {
    id: string;
    nome: string;
    raca: string;
    idade: number;
    preco: number;
    fotoUrl: string;
}

// Seleciona o corpo da tabela
const tabelaBody = document.querySelector("tbody") as HTMLTableSectionElement;

// Função principal: Carrega cavalos
async function carregarCavalos() {
    try {
        const resposta = await fetch("http://localhost:3333/cavalos");

        if (!resposta.ok) {
            throw new Error("Erro ao buscar cavalos");
        }

        const cavalos: Cavalo[] = await resposta.json();

        // Caso nenhum cavalo encontrado
        if (cavalos.length === 0) {
            tabelaBody.innerHTML = `
                <tr><td colspan="7" class="vazio">Nenhum cavalo encontrado.</td></tr>
            `;
            return;
        }

        // Renderizar linhas
        tabelaBody.innerHTML = cavalos.map(cavalo => `
            <tr>
                <td>${cavalo.id}</td>
                <td><img src="${cavalo.fotoUrl}" alt="${cavalo.nome}" /></td>
                <td>${cavalo.nome}</td>
                <td>${cavalo.raca}</td>
                <td>${cavalo.idade} anos</td>
                <td>R$ ${cavalo.preco.toLocaleString("pt-BR")}</td>
                <td><button class="btn-ver" data-id="${cavalo.id}">Ver</button></td>
            </tr>
        `).join("");

        adicionarEventosNosBotoes();

    } catch (erro) {
        console.error(erro);
        tabelaBody.innerHTML = `
            <tr><td colspan="7" class="erro">Erro ao carregar a listagem.</td></tr>
        `;
    }
}

// Eventos dos botões "Ver"
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
