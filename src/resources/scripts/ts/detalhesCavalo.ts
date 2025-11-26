interface CavaloDetalhes {
    id: string;
    nome: string;
    raca: string;
    idade: number;
    descricao: string;
    preco: number;
    foto?: string;
    proprietario?: {
        nome: string;
        endereco: string;
    };
}

// Seletores do DOM
const nomeElemento = document.querySelector(".detalhes-info h2") as HTMLElement;
const fotoElemento = document.querySelector(".cavalo-foto") as HTMLImageElement;
const racaElemento = document.querySelector(".raça") as HTMLElement;
const idadeElemento = document.querySelector(".idade") as HTMLElement;
const descricaoElemento = document.querySelector(".descricao") as HTMLElement;
const precoElemento = document.querySelector(".preco") as HTMLElement;
const propNomeElemento = document.querySelector(".proprietario .nome-proprietario") as HTMLElement;
const propLocalElemento = document.querySelector(".proprietario .localizacao") as HTMLElement;

// Pega ID do cavalo da URL
const parametros = new URLSearchParams(window.location.search);
const idCavalo = parametros.get("id");

if (!idCavalo) {
    alert("Erro: nenhum ID de cavalo informado.");
} else {
    carregarDetalhes(idCavalo);
}

async function carregarDetalhes(id: string) {
    try {
        // Pega token do localStorage
        const token = localStorage.getItem("authToken");
        if (!token) {
            alert("Você precisa estar logado para ver os detalhes do cavalo.");
            return;
        }

        const resposta = await fetch(`http://localhost:3000/api/cavalos/${id}`, {
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json"
            }
        });

        if (!resposta.ok) {
            alert("Cavalo não encontrado ou você não tem permissão.");
            return;
        }

        const dados = await resposta.json();
        const cavalo: CavaloDetalhes = dados.data;

        preencherPagina(cavalo);

    } catch (erro) {
        console.error("Erro ao conectar com o servidor:", erro);
        alert("Erro ao conectar com o servidor. Verifique se o backend está rodando.");
    }


    function preencherPagina(cavalo: CavaloDetalhes) {
        // Preencher informações básicas
        if (nomeElemento) nomeElemento.innerText = cavalo.nome || "Sem nome";
        if (fotoElemento) {
            fotoElemento.src = cavalo.foto || "/assets/Imagens/logoSemFundo.png";
            fotoElemento.alt = `Foto de ${cavalo.nome}`;
        }
        if (racaElemento) racaElemento.innerText = `Raça: ${cavalo.raca || "Desconhecida"} `;
        if (idadeElemento) idadeElemento.innerText = `Idade: ${cavalo.idade ?? "Desconhecida"} anos`;
        if (descricaoElemento) descricaoElemento.innerText = cavalo.descricao || "Sem descrição";
        if (precoElemento) precoElemento.innerText = `Preço: R$ ${cavalo.preco?.toLocaleString("pt-BR") || "0"} `;


        // Preencher informações do proprietário
        if (cavalo.proprietario) {
            if (propNomeElemento) propNomeElemento.innerText = cavalo.proprietario.nome || "Desconhecido";
            if (propLocalElemento) propLocalElemento.innerText = `Localização: ${cavalo.proprietario.endereco || "Não informada"}`;
        } else {
            if (propNomeElemento) propNomeElemento.innerText = "Desconhecido";
            if (propLocalElemento) propLocalElemento.innerText = "Localização não informada";
        }
    }
}
