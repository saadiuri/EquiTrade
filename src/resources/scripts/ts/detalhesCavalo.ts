(function () {
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

  document.addEventListener("DOMContentLoaded", () => {
    const parametros = new URLSearchParams(window.location.search);
    const idCavalo = parametros.get("id");

    if (!idCavalo) {
      alert("Erro: nenhum ID de cavalo informado.");
    } else {
      carregarDetalhes(idCavalo);
    }

    const btnEnviarMensagem = document.getElementById("enviar-mensagem-btn");
    if (btnEnviarMensagem) {
      btnEnviarMensagem.addEventListener("click", () => {
        const token = localStorage.getItem("authToken");
        if (!token) {
          alert("Você precisa estar logado para enviar mensagens.");
          window.location.href = "login.html";
        } else {
          window.location.href = "batePapo.html";
        }
      });
    }
  });

  async function carregarDetalhes(id: string): Promise<void> {
    try {
      const token = localStorage.getItem("authToken");

      const headers: HeadersInit = {
        "Content-Type": "application/json",
      };

      if (token) {
        headers["Authorization"] = `Bearer ${token}`;
      }

      const resposta = await fetch(`http://localhost:3000/api/cavalos/${id}`, {
        headers,
      });

      if (!resposta.ok) {
        alert("Cavalo não encontrado.");
        return;
      }

      const dados = await resposta.json();
      const cavalo: CavaloDetalhes = dados.data;

      preencherPagina(cavalo);
    } catch (erro) {
      console.error("Erro ao conectar com o servidor:", erro);
      alert(
        "Erro ao conectar com o servidor. Verifique se o backend está rodando."
      );
    }
  }

  function preencherPagina(cavalo: CavaloDetalhes): void {
    const nomeElemento = document.querySelector(
      ".detalhes-info h2"
    ) as HTMLElement | null;
    const fotoElemento = document.querySelector(
      ".cavalo-foto"
    ) as HTMLImageElement | null;
    const racaElemento = document.querySelector(".raça") as HTMLElement | null;
    const idadeElemento = document.querySelector(
      ".idade"
    ) as HTMLElement | null;
    const descricaoElemento = document.querySelector(
      ".descricao"
    ) as HTMLElement | null;
    const precoElemento = document.querySelector(
      ".preco"
    ) as HTMLElement | null;
    const propNomeElemento = document.querySelector(
      ".proprietario .nome-proprietario"
    ) as HTMLElement | null;
    const propLocalElemento = document.querySelector(
      ".proprietario .localizacao"
    ) as HTMLElement | null;

    if (nomeElemento) nomeElemento.innerText = cavalo.nome || "Sem nome";
    if (fotoElemento) {
      fotoElemento.src = cavalo.foto || "/assets/Imagens/logoSemFundo.png";
      fotoElemento.alt = `Foto de ${cavalo.nome}`;
    }
    if (racaElemento)
      racaElemento.innerText = `Raça: ${cavalo.raca || "Desconhecida"} `;
    if (idadeElemento)
      idadeElemento.innerText = `Idade: ${cavalo.idade ?? "Desconhecida"} anos`;
    if (descricaoElemento)
      descricaoElemento.innerText = cavalo.descricao || "Sem descrição";
    if (precoElemento)
      precoElemento.innerText = `Preço: R$ ${
        cavalo.preco?.toLocaleString("pt-BR") || "0"
      } `;

    if (cavalo.proprietario) {
      if (propNomeElemento)
        propNomeElemento.innerText = cavalo.proprietario.nome || "Desconhecido";
      if (propLocalElemento)
        propLocalElemento.innerText = `Localização: ${
          cavalo.proprietario.endereco || "Não informada"
        }`;
    } else {
      if (propNomeElemento) propNomeElemento.innerText = "Desconhecido";
      if (propLocalElemento)
        propLocalElemento.innerText = "Localização não informada";
    }
  }
})();
