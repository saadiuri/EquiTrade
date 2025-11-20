export function isLoggedIn(): boolean {
    const token = localStorage.getItem("authToken");
    return !!token;
}

export function getLoggedUser(): any {
    const user = localStorage.getItem("usuarioLogado");
    return user ? JSON.parse(user) : null;
}

// Logout function
export function logout(): void {
    localStorage.removeItem("authToken");
    localStorage.removeItem("usuarioLogado");
    window.location.href = "login.html";
}

export function updateAuthHeader(): void {
    const loginBtn = document.querySelector('.btn-login') as HTMLAnchorElement;
    
    if (!loginBtn) return;

    if (isLoggedIn()) {
        const user = getLoggedUser();
        loginBtn.textContent = "Sair";
        loginBtn.href = "#";
        loginBtn.onclick = (e) => {
            e.preventDefault();
            logout();
        };
        
        if (user && user.nome) {
            loginBtn.title = `Logado como ${user.nome}`;
        }
    } else {
        loginBtn.textContent = "Entrar";
        loginBtn.href = "login.html";
        loginBtn.onclick = null;
    }
}

export async function fetchAutenticado(url: string, options: RequestInit = {}): Promise<any> {
    const token = localStorage.getItem("authToken");
    if (!token) {
        alert("Você precisa estar logado!");
        window.location.href = "login.html";
        return;
    }
    const headers = options.headers ? options.headers as Record<string, string> : {};
    headers["Authorization"] = `Bearer ${token}`;
    headers["Content-Type"] = "application/json";
    options.headers = headers;

    const resposta = await fetch(url, options);
    if (!resposta.ok) throw new Error("Erro na requisição");
    return resposta.json();
}

// Auto-run on page load
if (typeof document !== 'undefined') {
    document.addEventListener('DOMContentLoaded', updateAuthHeader);
}