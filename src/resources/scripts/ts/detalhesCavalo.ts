interface CavaloDetalhes {
    id: string;
    nome: string;
    raca: string;
    idade: number;
    descricao: string;
    imagens: string[];
    proprietario: {
        nome: string;
        foto: string;
        localizacao: string;
    };
}

const imgPrincipal = document.querySelector(".detalhes-img img") as HTMLImageElement;
const galeriaMini = document.querySelector(".galeria-mini") as HTMLElement;

const nomeElemento = document.querySelector(".detalhes-info h2") as HTMLElement;
const racaElemento = document.querySelector(".raça") as HTMLElement;
const idadeElemento = document.querySelector(".idade") as HTMLElement;
const descricaoElemento = document.querySelector(".descricao") as HTMLElement;

const propImg = document.querySelector(".proprietario img") as HTMLImageElement;
const propNome = document.querySelector(".proprietario strong") as HTMLElement;
const propLocal = document.querySelector(".proprietario p:nth-child(2)") as HTMLElement;

const parametros = new URLSearchParams(window.location.search);
const idCavalo = parametros.get("id");

// Se não tiver ID, exibe erro
if (!idCavalo) {
    alert("Erro: nenhum ID de cavalo informado.");
} else {
    carregarDetalhes(idCavalo);
}

async function carregarDetalhes(id: string) {
    try {
        const resposta = await fetch(`http://localhost:8080/api/cavalos/${id}`);

        if (!resposta.ok) {
            alert("Cavalo não encontrado.");
            return;
        }

        const cavalo: CavaloDetalhes = await resposta.json();
        preencherPagina(cavalo);

    } catch (erro) {
        console.error(erro);
        alert("Erro ao conectar com o servidor.");
    }
}

function preencherPagina(cavalo: CavaloDetalhes) {

    // IMAGEM PRINCIPAL
    if (cavalo.imagens && cavalo.imagens.length > 0 && cavalo.imagens[0]) {
        imgPrincipal.src = cavalo.imagens[0]!;
    }

    // MINI GALERIA
    if (galeriaMini) {
        galeriaMini.innerHTML = "";

        cavalo.imagens.forEach((imgUrl) => {
            const mini = document.createElement("img");
            mini.src = imgUrl;
            mini.alt = "Miniatura";

            mini.addEventListener("click", () => {
                imgPrincipal.src = imgUrl;
            });

            galeriaMini.appendChild(mini);
        });
    }

    // TEXTO PRINCIPAL
    nomeElemento.innerText = cavalo.nome;
    racaElemento.innerText = `Raça: ${cavalo.raca}`;
    idadeElemento.innerText = `Idade: ${cavalo.idade} anos`;
    descricaoElemento.innerText = cavalo.descricao;

    // PROPRIETÁRIO
    propImg.src = cavalo.proprietario.foto;
    propNome.innerText = cavalo.proprietario.nome;
    propLocal.innerText = cavalo.proprietario.localizacao;
}
