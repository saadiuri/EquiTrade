interface ContatoFormData {
    nome: string;
    email: string;
    mensagem: string;
}

interface ContatoResponse {
    sucesso: boolean;
    mensagem: string;
}

// Seletores do HTML
const formContato = document.getElementById("form-contato") as HTMLFormElement;
const inputNome = document.getElementById("contato-nome") as HTMLInputElement;
const inputEmail = document.getElementById("contato-email") as HTMLInputElement;
const inputMensagemContato = document.getElementById("contato-mensagem") as HTMLTextAreaElement;
const mensagemStatus = document.getElementById("contato-status") as HTMLDivElement;

if (formContato) {
    formContato.addEventListener("submit", async (event) => {
        event.preventDefault();

        const dados: ContatoFormData = {
            nome: inputNome.value.trim(),
            email: inputEmail.value.trim(),
            mensagem: inputMensagemContato.value.trim(),
        };

        if (!dados.nome || !dados.email || !dados.mensagem) {
            mostrarMensagem("Preencha todos os campos.", false);
            return;
        }

        await enviarContato(dados);
    });
}

// Função que faz a requisição para o backend
async function enviarContato(dados: ContatoFormData) {
    try {
        const response = await fetch("http://localhost:8080/api/contato", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(dados)
        });

        if (!response.ok) {
            mostrarMensagem("Erro ao enviar mensagem. Tente novamente.", false);
            return;
        }

        const resposta: ContatoResponse = await response.json();

        if (resposta.sucesso) {
            mostrarMensagem(resposta.mensagem || "Mensagem enviada com sucesso!", true);
            formContato.reset();
        } else {
            mostrarMensagem(resposta.mensagem || "Falha ao enviar a mensagem.", false);
        }

    } catch (error) {
        console.error(error);
        mostrarMensagem("Falha ao conectar com o servidor.", false);
    }
}

// Exibe mensagens de sucesso/erro na tela
function mostrarMensagem(texto: string, sucesso: boolean) {
    if (!mensagemStatus) return;

    mensagemStatus.innerText = texto;
    mensagemStatus.style.color = sucesso ? "green" : "red";
    mensagemStatus.style.fontWeight = "600";
}
