//  sobre.ts - EquiTrade
//  Preenche dados da página "Sobre"
//  e deixa pronto para futura API

interface SobreInfo {
    quemSomos: string;
    missao: string;
    diferenciais: string[];
    email: string;
    instagram: string;
}

// Carrega dados ao abrir a página
document.addEventListener("DOMContentLoaded", carregarDadosSobre);

async function carregarDadosSobre(): Promise<void> {

    try {
        // Endpoint futuro do backend
        const resposta = await fetch("http://localhost:3333/api/sobre");

        if (!resposta.ok) {
            console.warn("API /api/sobre ainda não está implementada. Usando conteúdo padrão.");
            return; // Mantém o conteúdo estático do HTML
        }

        const dados: SobreInfo = await resposta.json();

        preencherConteudo(dados);

    } catch (erro) {
        console.warn("Backend não disponível. Conteúdo estático será usado.");
    }
}

// Atualiza a página com dados vindos da API
function preencherConteudo(info: SobreInfo): void {
    const quemSomos = document.querySelector(".sobre-container .sobre-card:nth-child(1) p");
    const missao = document.querySelector(".sobre-container .sobre-card:nth-child(2) p");
    const listaDiferenciais = document.querySelector(".sobre-container .sobre-card:nth-child(3) ul");
    const email = document.querySelector(".sobre-container .sobre-card:nth-child(4) p:nth-of-type(2)");
    const instagram = document.querySelector(".sobre-container .sobre-card:nth-child(4) p:nth-of-type(3)");

    if (quemSomos) quemSomos.textContent = info.quemSomos;
    if (missao) missao.textContent = info.missao;

    if (listaDiferenciais) {
        listaDiferenciais.innerHTML = "";
        info.diferenciais.forEach((dif) => {
            const li = document.createElement("li");
            li.textContent = dif;
            listaDiferenciais.appendChild(li);
        });
    }

    if (email) email.innerHTML = `<strong>Email:</strong> ${info.email}`;
    if (instagram) instagram.innerHTML = `<strong>Instagram:</strong> ${info.instagram}`;
}
