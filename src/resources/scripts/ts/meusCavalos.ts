import { API_BASE_URL } from "./config.js";
import { requireAuth } from "./autenticacao.js";

(function () {
  if (!requireAuth()) return;

  const API_URL = `${API_BASE_URL}/cavalos`;

  interface CavaloListagem {
    id: string;
    nome: string;
    raca: string;
    idade: number;
    descricao: string;
    preco: number;
    disponivel: boolean;
    foto?: string;
  }

  const tabelaBody = document.querySelector(
    "tbody"
  ) as HTMLTableSectionElement | null;
  const formCadastro = document.getElementById(
    "cadastroCavalo"
  ) as HTMLFormElement | null;

  function extractToken(): string {
    return localStorage.getItem("authToken") || "";
  }

  function extractUserId(): string {
    try {
      const token = extractToken();
      if (!token) return "";

      // Decode JWT token (without verification - just to read the payload)
      const parts = token.split(".");
      if (parts.length !== 3 || !parts[1]) return "";

      const payload = JSON.parse(atob(parts[1]));
      console.log("🔑 Token payload:", payload);

      return payload.userId || payload.id || "";
    } catch (error) {
      console.error("❌ Erro ao extrair userId do token:", error);
      return "";
    }
  }

  function safeInput(
    id: string
  ): HTMLInputElement | HTMLTextAreaElement | null {
    return document.getElementById(id) as
      | HTMLInputElement
      | HTMLTextAreaElement
      | null;
  }

  // Carregar cavalos do usuário
  async function carregarMeusCavalos() {
    if (!tabelaBody) return;

    try {
      const token = extractToken();
      const userId = extractUserId();

      if (!userId) {
        throw new Error("Usuário não identificado");
      }

      const url = `${API_URL}?donoId=${encodeURIComponent(userId)}`;

      const headers: HeadersInit = {
        Authorization: `Bearer ${token}`,
      };

      const resposta = await fetch(url, { headers });

      if (!resposta.ok) {
        const errorData = await resposta.json().catch(() => ({}));
        throw new Error(`Erro ao buscar cavalos: ${resposta.status}`);
      }

      const dados = await resposta.json();

      const cavalos: CavaloListagem[] = Array.isArray(dados.data)
        ? dados.data
        : [];

      exibirCavalos(cavalos);
    } catch (erro) {
      tabelaBody.innerHTML = `
        <tr><td colspan="6" class="erro">Erro ao carregar seus cavalos. Verifique o console para mais detalhes.</td></tr>
      `;
    }
  }

  function exibirCavalos(cavalos: CavaloListagem[]) {
    if (!tabelaBody) return;

    if (cavalos.length === 0) {
      tabelaBody.innerHTML = `
        <tr><td colspan="6" class="vazio">Você ainda não cadastrou nenhum cavalo.</td></tr>
      `;
      return;
    }

    tabelaBody.innerHTML = cavalos
      .map(
        (cavalo) => `
        <tr>
            <td>${cavalo.nome}</td>
            <td>${cavalo.raca}</td>
            <td>${cavalo.idade} anos</td>
            <td>R$ ${cavalo.preco.toLocaleString("pt-BR", {
              minimumFractionDigits: 2,
            })}</td>
            <td><span class="status-badge ${
              cavalo.disponivel ? "disponivel" : "indisponivel"
            }">
                ${cavalo.disponivel ? "Sim" : "Não"}
            </span></td>
            <td>
                <a href="detalhesCavalo.html?id=${
                  cavalo.id
                }" class="btn-ver">Ver</a>
                <button class="btn-delete" data-id="${cavalo.id}" data-nome="${
          cavalo.nome
        }">Excluir</button>
            </td>
        </tr>
    `
      )
      .join("");

    // Adicionar event listeners aos botões de excluir
    const botoesExcluir = document.querySelectorAll(".btn-delete");
    botoesExcluir.forEach((botao) => {
      botao.addEventListener("click", async (e) => {
        const btn = e.target as HTMLButtonElement;
        const id = btn.dataset.id;
        const nome = btn.dataset.nome;

        if (
          id &&
          confirm(
            `Tem certeza que deseja excluir o cavalo "${nome}"?\n\nEsta ação não pode ser desfeita.`
          )
        ) {
          await excluirCavalo(id);
        }
      });
    });
  }

  async function excluirCavalo(id: string) {
    try {
      const token = extractToken();
      const headers: HeadersInit = {
        Authorization: `Bearer ${token}`,
      };

      const resposta = await fetch(`${API_URL}/${id}`, {
        method: "DELETE",
        headers,
      });

      if (!resposta.ok) {
        throw new Error(`Erro ao excluir cavalo: ${resposta.status}`);
      }

      alert("Cavalo excluído com sucesso!");
      await carregarMeusCavalos();
    } catch (erro) {
      console.error("Erro ao excluir cavalo:", erro);
      alert("Erro ao excluir cavalo. Tente novamente.");
    }
  }

  async function handleCadastro() {
    const nome = safeInput("nome")?.value.trim() || "";
    const idadeStr = safeInput("idade")?.value || "";
    const raca = safeInput("raca")?.value.trim() || "";
    const precoStr = safeInput("preco")?.value || "";
    const descricao = safeInput("descricao")?.value.trim() || "";
    const premios = safeInput("premios")?.value.trim() || "";
    const disponivel =
      (document.getElementById("disponivel") as HTMLInputElement)?.checked ||
      false;

    const faltando = [];
    if (!nome) faltando.push("nome");
    if (!idadeStr) faltando.push("idade");
    if (!raca) faltando.push("raça");
    if (!precoStr) faltando.push("preço");
    if (!descricao) faltando.push("descrição");

    if (faltando.length > 0) {
      alert("Preencha os campos obrigatórios: " + faltando.join(", "));
      return;
    }

    const idade = Number(idadeStr);
    const preco = Number(precoStr);

    if (!Number.isFinite(idade) || idade <= 0) {
      alert("Idade inválida.");
      return;
    }

    if (!Number.isFinite(preco) || preco <= 0) {
      alert("Preço inválido.");
      return;
    }

    const payload = {
      nome,
      idade,
      raca,
      preco,
      descricao,
      disponivel,
      premios,
    };

    const token = extractToken();
    const headers = {
      "Content-Type": "application/json",
      Authorization: "Bearer " + token,
    };

    try {
      const res = await fetch(API_URL, {
        method: "POST",
        headers,
        body: JSON.stringify(payload),
      });

      if (res.status === 201) {
        alert("Cavalo cadastrado com sucesso!");
        formCadastro?.reset();

        await carregarMeusCavalos();
        return;
      }

      let errText = `${res.status} ${res.statusText}`;
      try {
        const body = await res.json();
        errText = body.message || body.error || JSON.stringify(body);
      } catch {}

      alert("Falha ao cadastrar cavalo: " + errText);
      console.error("Erro ao cadastrar cavalo:", res.status, errText);
    } catch (err) {
      alert("Erro de rede. Verifique o backend.");
      console.error("Erro de rede:", err);
    }
  }

  document.addEventListener("DOMContentLoaded", () => {
    if (formCadastro) {
      formCadastro.addEventListener("submit", (e) => {
        e.preventDefault();
        handleCadastro();
      });
    }

    carregarMeusCavalos();
  });
})();
