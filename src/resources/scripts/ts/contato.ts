interface ContatoFormData {
    nome: string;
    email: string;
    assunto: string; // Adicionado: Assumindo que o HTML tem este campo
    mensagem: string;
}

interface ContatoResponse {
    sucesso: boolean;
    mensagem: string;
}

// URL da API de Contato (usando a porta 3000 para consistência)
const API_URL = "http://localhost:3000/api/mensagens"; 

// Seletores do HTML
const formContato = document.getElementById("form-contato") as HTMLFormElement;
const inputNome = document.getElementById("contato-nome") as HTMLInputElement;
const inputEmail = document.getElementById("contato-email") as HTMLInputElement;
const inputAssunto = document.getElementById("assunto") as HTMLInputElement; // Adicionado: Ajuste o ID conforme o seu HTML real
const inputMensagemContato = document.getElementById("contato-mensagem") as HTMLTextAreaElement;
const mensagemStatus = document.getElementById("contato-status") as HTMLDivElement;
const submitButton = document.querySelector(".submit-button") as HTMLButtonElement; // Seletor para o botão de envio

document.addEventListener("DOMContentLoaded", () => {
    if (formContato) {
        formContato.addEventListener("submit", async (event) => {
            event.preventDefault();

            // 1. Coleta de Dados
            const dados: ContatoFormData = {
                nome: inputNome.value.trim(),
                email: inputEmail.value.trim(),
                assunto: inputAssunto ? inputAssunto.value.trim() : "Sem Assunto", // Lidar com campo opcional
                mensagem: inputMensagemContato.value.trim(),
            };

            // 2. Validação Mínima
            if (!dados.nome || !dados.email || !dados.mensagem) {
                mostrarMensagem("Preencha todos os campos obrigatórios.", false);
                return;
            }

            // 3. Bloqueio de Envio Duplicado e Feedback
            if (submitButton) {
                submitButton.disabled = true;
                submitButton.textContent = "Enviando...";
            }

            await enviarContato(dados);
            
            // 4. Reabilitação do Botão
            if (submitButton) {
                submitButton.disabled = false;
                submitButton.textContent = "Enviar Mensagem";
            }
        });
    }
});


// Função que faz a requisição para o backend
async function enviarContato(dados: ContatoFormData) {
    // Limpa o status anterior
    mostrarMensagem("", false); 
    
    try {
        const response = await fetch(API_URL, { // URL corrigida para porta 3000
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(dados)
        });

        if (!response.ok) {
            // Tenta obter uma mensagem de erro mais detalhada do backend
            let mensagemErro = "Erro ao enviar mensagem. Tente novamente.";
            try {
                const erroJson = await response.json();
                if (erroJson.mensagem) {
                    mensagemErro = erroJson.mensagem;
                }
            } catch {
                // Ignora se não for JSON
            }
            mostrarMensagem(mensagemErro, false);
            return;
        }

        const resposta: ContatoResponse = await response.json();

        if (resposta.sucesso) {
            mostrarMensagem(resposta.mensagem || "Mensagem enviada com sucesso! Em breve entraremos em contato.", true);
            if (formContato) formContato.reset();
        } else {
            mostrarMensagem(resposta.mensagem || "Falha ao enviar a mensagem.", false);
        }

    } catch (error) {
        console.error("Falha na requisição de contato:", error);
        mostrarMensagem("Falha ao conectar com o servidor.", false);
    }
}

// Exibe mensagens de sucesso/erro na tela
function mostrarMensagem(texto: string, sucesso: boolean) {
    if (!mensagemStatus) return;

    mensagemStatus.innerText = texto;
    // Uso de cores mais profissionais (verde/vermelho)
    mensagemStatus.style.color = sucesso ? "#22c55e" : "#ef4444"; 
    mensagemStatus.style.fontWeight = "600";
    // Opcional: Adiciona transição para melhor feedback visual
    mensagemStatus.style.opacity = texto ? "1" : "0";
    mensagemStatus.style.transition = "opacity 0.3s";
}