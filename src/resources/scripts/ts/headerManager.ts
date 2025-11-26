function initializeHeader(): void {
  const token = localStorage.getItem("authToken");
  const isLoggedIn = !!token;

  const logoImg = document.querySelector(
    ".navbar .logo img"
  ) as HTMLImageElement | null;
  if (logoImg) {
    logoImg.style.cursor = "pointer";
    logoImg.addEventListener("click", () => {
      window.location.href = "paginaInicial.html";
    });
  }

  const nav = document.querySelector(".navbar nav") as HTMLElement | null;
  if (!nav) return;

  if (isLoggedIn) {
    nav.innerHTML = `
            <a href="paginaInicial.html">Início</a>
            <a href="listagemCavalo.html">Cavalos</a>
            <a href="sobre.html">Sobre</a>
            <a href="contato.html">Contato</a>
            <a href="batePapo.html">Mensagens</a>
            <a href="#" class="btn-login" id="logout-btn">Sair</a>
        `;

    setTimeout(() => {
      const logoutBtn = document.getElementById("logout-btn");
      if (logoutBtn) {
        logoutBtn.addEventListener("click", (e) => {
          e.preventDefault();
          localStorage.removeItem("authToken");
          localStorage.removeItem("userId");
          alert("Você saiu da sua conta.");
          window.location.href = "login.html";
        });
      }
    }, 100);
  } else {
    nav.innerHTML = `
            <a href="paginaInicial.html">Início</a>
            <a href="listagemCavalo.html">Cavalos</a>
            <a href="sobre.html">Sobre</a>
            <a href="contato.html">Contato</a>
            <a href="login.html" class="btn-login">Entrar</a>
        `;
  }

  highlightActivePage();
}

function highlightActivePage(): void {
  const currentPage =
    window.location.pathname.split("/").pop() || "paginaInicial.html";
  const links = document.querySelectorAll(".navbar nav a");

  links.forEach((link) => {
    const href = link.getAttribute("href");
    if (
      href === currentPage ||
      (currentPage === "paginaInicial.html" && href === "paginaInicial.html") ||
      (currentPage.includes("Cavalo") && href === "listagemCavalo.html") ||
      (currentPage === "batePapo.html" &&
        link.textContent?.trim() === "Mensagens")
    ) {
      link.classList.add("ativo");
    } else {
      link.classList.remove("ativo");
    }
  });
}

export function isUserLoggedIn(): boolean {
  return !!localStorage.getItem("authToken");
}

export function requireLogin(
  message: string = "Você precisa estar logado para acessar esta página."
): boolean {
  if (!isUserLoggedIn()) {
    alert(message);
    window.location.href = "login.html";
    return false;
  }
  return true;
}

document.addEventListener("DOMContentLoaded", initializeHeader);
