export { }; // <-- Isso transforma o arquivo em módulo

// Define a estrutura dos dados do formulário que será enviada.
interface CavaloFormData {
    nome: string;
    raca: string;
    idade: number;
    preco: number;
    descricao: string;
}

// Define estrutura de resposta da API (quando existir).
interface CavaloResponseData extends CavaloFormData {
    id: string;
    createdAt: string;
}

// Seleciona o formulário no HTML
const form = document.getElementById("cavalo-form") as HTMLFormElement;

if (form) {
    form.addEventListener("submit", async (event) => {
        event.preventDefault();

        // Captura os dados dos inputs do HTML
        const formData: CavaloFormData = {
            nome: (document.getElementById("nome") as HTMLInputElement).value,
            raca: (document.getElementById("raca") as HTMLInputElement).value,
            idade: Number((document.getElementById("idade") as HTMLInputElement).value),
            preco: Number((document.getElementById("preco") as HTMLInputElement).value),
            descricao: (document.getElementById("descricao") as HTMLInputElement).value,
        };

        try {
            const response = await fetch("http://localhost:8080/api/cavalos", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(formData),
            });

            if (response.ok) {
                const data: CavaloResponseData = await response.json();
                alert("Cavalo cadastrado com sucesso!");
                console.log("Cavalo cadastrado:", data);

                // Redirecionar (quando quiser habilitar)
                // window.location.href = "meusCavalos.html";
            } else {
                const errorText = await response.text();
                alert("Erro ao cadastrar cavalo: " + errorText);
            }
        } catch (error) {
            console.error("Erro:", error);
            alert("Erro inesperado ao cadastrar cavalo.");
        }
    });
}
