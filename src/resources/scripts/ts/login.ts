import { API_BASE_URL } from "./config.js";

interface LoginResponse {
  id: number;
  nome: string;
  email: string;
  token: string;
}

async function logarUsuario(): Promise<void> {
  const emailInput = document.getElementById("emailLogin") as HTMLInputElement;
  const senhaInput = document.getElementById("senhaLogin") as HTMLInputElement;

  const email = emailInput.value.trim();
  const senha = senhaInput.value.trim();

  if (!email || !senha) {
    alert("Por favor, preencha todos os campos.");
    return;
  }

  try {
    const resposta = await fetch(`${API_BASE_URL}/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, senha }),
    });

    const json = await resposta.json();

    if (!json.success) {
      alert("E-mail ou senha incorretos.");
      return;
    }

    const token = json.data.token;

    localStorage.setItem("authToken", token);

    window.location.href = "paginaInicial.html";
  } catch (erro) {
    console.error(erro);
    alert("Erro ao tentar fazer login. Tente novamente mais tarde.");
  }
}

document.addEventListener("DOMContentLoaded", () => {
  const form = document.querySelector("form") as HTMLFormElement;

  if (form) {
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      logarUsuario();
    });
  }

  document.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      const botao = document.getElementById("btnLogin") as HTMLButtonElement;
      if (botao) botao.click();
    }
  });
});

export {};
