import { API_BASE_URL } from "./config.js";
import { requireAuth } from "./autenticacao.js";

(function () {
  if (!requireAuth()) return;

  const API_URL = `${API_BASE_URL}/cavalos`;

  function extractToken(): string {
    return localStorage.getItem("authToken") || "";
  }

  function extractUserId(): string {
    try {
      const token = extractToken();
      if (!token) return "";

      // Decode JWT token to read the payload
      const parts = token.split(".");
      if (parts.length !== 3 || !parts[1]) return "";

      const payload = JSON.parse(atob(parts[1]));
      return payload.userId || payload.id || "";
    } catch (error) {
      console.error("Erro ao extrair userId do token:", error);
      return "";
    }
  }

  function safeInput(id: string) {
    return document.getElementById(id) as
      | HTMLInputElement
      | HTMLTextAreaElement
      | null;
  }

  document.addEventListener("DOMContentLoaded", function () {
    const form = document.getElementById(
      "cadastroCavalo"
    ) as HTMLFormElement | null;
    const btn = document.getElementById(
      "btnCadastrar"
    ) as HTMLButtonElement | null;

    if (!form) {
      console.error("Formulário #cadastroCavalo não encontrado.");
      return;
    }

    const handler = async function () {
      const nome = safeInput("nome")?.value.trim() || "";
      const idadeStr = safeInput("idade")?.value || "";
      const raca = safeInput("raca")?.value.trim() || "";
      const precoStr = safeInput("preco")?.value || "";
      const descricao = safeInput("descricao")?.value.trim() || "";
      const premios = safeInput("premios")?.value.trim() || "";
      const foto = safeInput("foto")?.value.trim() || "";
      const disponivel =
        (document.getElementById("disponivel") as HTMLInputElement)?.checked ||
        false;

      // validações
      const faltando = [];
      if (!nome) faltando.push("nome");
      if (!idadeStr) faltando.push("idade");
      if (!raca) faltando.push("raça");
      if (!precoStr) faltando.push("preço");

      if (faltando.length > 0) {
        alert("Preencha: " + faltando.join(", "));
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

      const payload: any = {
        nome,
        idade,
        raca,
        preco,
        descricao,
        disponivel,
        premios,
      };

      if (foto) {
        payload.foto = foto;
      }

      // TOKEN CORRETO AQUI 🚀
      const token = extractToken();
      const headers = {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      };

      console.log("➡ Enviando payload:", payload);
      console.log("➡ Token:", token || "<VAZIO>");

      try {
        const res = await fetch(API_URL, {
          method: "POST",
          headers,
          body: JSON.stringify(payload),
        });

        if (res.status === 201) {
          alert("Cavalo cadastrado com sucesso!");
          form.reset();
          return;
        }

        // captura msg do backend
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
    };

    // botão ou submit
    if (btn) {
      btn.addEventListener("click", handler);
    }

    form.addEventListener("submit", (e) => {
      e.preventDefault();
      handler();
    });
  });
})();
