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