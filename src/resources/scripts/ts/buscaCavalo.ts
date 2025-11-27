(function () {
  interface Cavalo {
    id: string;
    nome: string;
    idade: number;
    raca: string;
    descricao?: string;
    preco: number;
    disponivel: boolean;
    premios?: string;
    foto?: string;
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

  const formBusca = document.getElementById(
    "form-busca-cavalo"
  ) as HTMLFormElement | null;
  const inputBusca = document.getElementById(
    "busca"
  ) as HTMLInputElement | null;
  const resultadosContainer = document.getElementById(
    "resultados-cavalo"
  ) as HTMLDivElement | null;

  if (formBusca && inputBusca && resultadosContainer) {
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

  async function buscarCavalos(termo: string) {
    if (!resultadosContainer) return;

    try {
      const token = localStorage.getItem("authToken");

      const headers: HeadersInit = {
        "Content-Type": "application/json",
      };
      if (token) {
        headers["Authorization"] = `Bearer ${token}`;
      }

      const response = await fetch(
        `http://localhost:3000/api/cavalos?nome=${encodeURIComponent(termo)}`,
        { headers }
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

  function exibirResultados(lista: Cavalo[]) {
    if (!resultadosContainer) return;

    resultadosContainer.innerHTML = "";

    lista.forEach((cavalo) => {
      const card = document.createElement("div");
      card.classList.add("card");

      card.innerHTML = `
                <img src="${
                  cavalo.foto || "/assets/Imagens/logoSemFundo.png"
                }" alt="${cavalo.nome}">
                <div class="info">
                    <h3>${cavalo.nome}</h3>
                    <p><strong>Raça:</strong> ${cavalo.raca}</p>
                    <p><strong>Idade:</strong> ${cavalo.idade} anos</p>
                    <p><strong>Preço:</strong> R$ ${cavalo.preco.toFixed(2)}</p>
                    <button data-id="${cavalo.id}">Ver detalhes</button>
                </div>
            `;

      const btn = card.querySelector("button");
      if (btn) {
        btn.addEventListener("click", () => {
          window.location.href = `detalhesCavalo.html?id=${cavalo.id}`;
        });
      }

      resultadosContainer.appendChild(card);
    });
  }
})();
