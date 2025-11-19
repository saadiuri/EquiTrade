//   login.ts - EquiTrade

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

    // Validação simples
    if (!email || !senha) {
        alert("Por favor, preencha todos os campos.");
        return;
    }

    try {
        const resposta = await fetch("http://localhost:3333/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ email, senha })
        });

        if (!resposta.ok) {
            alert("E-mail ou senha incorretos.");
            return;
        }

        const usuario: LoginResponse = await resposta.json();

        // Salva no localStorage
        localStorage.setItem("usuarioLogado", JSON.stringify(usuario));

        // Redireciona
        window.location.href = "paginaInicial.html";

    } catch (erro) {
        console.error(erro);
        alert("Erro ao tentar fazer login. Tente novamente mais tarde.");
    }
}

// Permite login com Enter
document.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
        const botao = document.getElementById("btnLogin") as HTMLButtonElement;
        if (botao) botao.click();
    }
});
