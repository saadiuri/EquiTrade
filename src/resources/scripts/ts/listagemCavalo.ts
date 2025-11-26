(function () {
  interface CavaloListagem {
    id: string;
    nome: string;
    raca: string;
    idade: number;
    descricao: string;
    preco: number;
    foto?: string;
    proprietario?: {
      nome: string;
      localizacao: string;
    };
  }

  interface FiltrosBusca {
    nome?: string;
    raca?: string;
    idadeMin?: number;
    idadeMax?: number;
    precoMin?: number;
    precoMax?: number;
  }

  const tabelaBody = document.querySelector(
    "tbody"
  ) as HTMLTableSectionElement | null;
  const formBusca = document.getElementById(
    "form-busca-cavalo"
  ) as HTMLFormElement | null;
  const btnLimpar = document.getElementById(
    "btn-limpar-busca"
  ) as HTMLButtonElement | null;

  async function carregarCavalos(filtros: FiltrosBusca = {}) {
    if (!tabelaBody) return;

    try {
      const token = localStorage.getItem("authToken");

      // Constrói a URL com query parameters
      const url = new URL("http://localhost:3000/api/cavalos");
      
      if (filtros.nome) {
        url.searchParams.append("nome", filtros.nome);
      }
      if (filtros.raca) {
        url.searchParams.append("raca", filtros.raca);
      }
      if (filtros.idadeMin !== undefined) {
        url.searchParams.append("idadeMin", filtros.idadeMin.toString());
      }
      if (filtros.idadeMax !== undefined) {
        url.searchParams.append("idadeMax", filtros.idadeMax.toString());
      }
      if (filtros.precoMin !== undefined) {
        url.searchParams.append("precoMin", filtros.precoMin.toString());
      }
      if (filtros.precoMax !== undefined) {
        url.searchParams.append("precoMax", filtros.precoMax.toString());
      }

      const headers: HeadersInit = {};
      if (token) {
        headers["Authorization"] = `Bearer ${token}`;
      }

      const resposta = await fetch(url.toString(), { headers });

      if (!resposta.ok) {
        throw new Error(`Erro ao buscar cavalos: ${resposta.status}`);
      }

      const dados = await resposta.json();
      const cavalos: CavaloListagem[] = Array.isArray(dados.data)
        ? dados.data
        : [];

      exibirCavalos(cavalos);
    } catch (erro) {
      console.error("Erro ao carregar cavalos:", erro);
      tabelaBody.innerHTML = `
                <tr><td colspan="6" class="erro">Erro ao carregar a listagem.</td></tr>
            `;
    }
  }

  function exibirCavalos(cavalos: CavaloListagem[]) {
    if (!tabelaBody) return;

    if (cavalos.length === 0) {
      tabelaBody.innerHTML = `
                <tr><td colspan="6" class="vazio">Nenhum cavalo encontrado.</td></tr>
            `;
      return;
    }

    tabelaBody.innerHTML = cavalos
      .map(
        (cavalo) => `
            <tr>
                <td>${cavalo.id.substring(0, 8)}...</td>
                <td>${cavalo.nome}</td>
                <td>${cavalo.raca}</td>
                <td>${cavalo.idade} anos</td>
                <td>R$ ${cavalo.preco.toLocaleString("pt-BR", {
                  minimumFractionDigits: 2,
                })}</td>
                <td><a href="detalhesCavalo.html?id=${
                  cavalo.id
                }" class="btn-ver">Ver</a></td>
            </tr>
        `
      )
      .join("");
  }

  if (formBusca) {
    formBusca.addEventListener("submit", async (e) => {
      e.preventDefault();
      
      const formData = new FormData(formBusca);
      const filtros: FiltrosBusca = {};

      const nome = formData.get("nome")?.toString().trim();
      const raca = formData.get("raca")?.toString().trim();
      const idadeMin = formData.get("idadeMin")?.toString();
      const idadeMax = formData.get("idadeMax")?.toString();
      const precoMin = formData.get("precoMin")?.toString();
      const precoMax = formData.get("precoMax")?.toString();

      if (nome) filtros.nome = nome;
      if (raca) filtros.raca = raca;
      if (idadeMin) filtros.idadeMin = Number(idadeMin);
      if (idadeMax) filtros.idadeMax = Number(idadeMax);
      if (precoMin) filtros.precoMin = Number(precoMin);
      if (precoMax) filtros.precoMax = Number(precoMax);

      await carregarCavalos(filtros);
    });
  }

  if (btnLimpar && formBusca) {
    btnLimpar.addEventListener("click", async () => {
      formBusca.reset();
      await carregarCavalos();
    });
  }

  document.addEventListener("DOMContentLoaded", () => {
    carregarCavalos();
  });
})();
