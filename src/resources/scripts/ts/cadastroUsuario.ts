export { }; // <-- Isso transforma o arquivo em módulo

interface UserFormData {
    nome: string;
    email: string;
    senha: string;
    celular: string;
    endereco: string;
}

// ... resto do seu código TS

// Define a estrutura dos dados do formulário que será enviada.
interface UserFormData {
    nome: string;
    email: string;
    senha: string;
    celular: string; // Corrigido para corresponder ao backend
    endereco: string;
}

// Define a estrutura dos dados de resposta que a API retorna.
interface UserResponseData extends UserFormData {
    id: string;
    type: 'Comprador' | 'Vendedor';
    createdAt: string;
}

// =========================================================================
// VARIÁVEIS DE CONFIGURAÇÃO E DOM
// =========================================================================
const API_BASE_URL = "http://localhost:3000/api/users";

// =========================================================================
// FUNÇÃO DE CADASTRO (POST)
// =========================================================================

async function handleCadastroUsuario(event: Event) {
    event.preventDefault();

    // Busca os elementos do DOM no momento da execução, garantindo que existam.
    const form = document.getElementById("cadastroUsuario") as HTMLFormElement;
    const resultBox = document.getElementById("resultado") as HTMLPreElement;

    if (!form || !resultBox) {
        console.error("Erro interno: Formulário ou caixa de resultado não estão prontos.");
        return;
    }

    // 1. Coleta os dados do formulário com proteção contra elementos nulos
    const formData: UserFormData = {
        nome: (document.getElementById("nome") as HTMLInputElement)?.value || '',
        email: (document.getElementById("email") as HTMLInputElement)?.value || '',
        senha: (document.getElementById("senha") as HTMLInputElement)?.value || '',
        // O campo no HTML é 'telefone', mapeamos para 'celular' esperado pelo backend
        celular: (document.getElementById("telefone") as HTMLInputElement)?.value || '',
        endereco: (document.getElementById("endereco") as HTMLInputElement)?.value || '',
    };

    // 2. Monta o payload JSON no formato polimórfico: { type: 'Comprador', data: {...} }
    const payload = {
        type: "Comprador",
        data: formData
    };

    resultBox.textContent = "Processando cadastro...";

    try {
        const response = await fetch(API_BASE_URL, {
            method: "POST",
            mode: 'cors',
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload)
        });

        const dados = await response.json();

        if (response.ok) {
            resultBox.textContent = "✅ Usuário cadastrado com sucesso:\n" + JSON.stringify(dados.data, null, 2);
            form.reset(); // Limpa o formulário após o sucesso
        } else {
            // Exibe erros de validação (400) ou outros erros do servidor
            resultBox.textContent = `❌ Erro (${response.status}): ${dados.message || dados.error}`;
        }

    } catch (error) {
        console.error("Erro ao cadastrar:", error);
        resultBox.textContent = "❌ Erro de rede. Verifique se o backend está rodando na porta 3000.";
    }
}


// =========================================================================
// FUNÇÃO DE LISTAGEM (GET)
// =========================================================================

async function listarTodosOsUsuarios() {
    // Busca o elemento do DOM no momento da execução
    const listaUsuariosUl = document.getElementById("listaUsuarios") as HTMLUListElement;

    if (!listaUsuariosUl) {
        console.error("Lista de usuários (ul) não encontrada.");
        return;
    }

    listaUsuariosUl.innerHTML = '<li>Carregando usuários...</li>';

    try {
        const response = await fetch(API_BASE_URL, {
            method: 'GET',
            mode: 'cors',
            headers: { 'Content-Type': 'application/json' },
        });

        const result = await response.json();

        if (!response.ok) {
            listaUsuariosUl.innerHTML = `<li>❌ Falha ao buscar: ${result.message || 'Erro Desconhecido'}</li>`;
            return;
        }

        const usuarios: UserResponseData[] = result.data;

        listaUsuariosUl.innerHTML = ''; // Limpa antes de popular

        if (usuarios.length === 0) {
            listaUsuariosUl.innerHTML = '<li>Nenhum usuário cadastrado.</li>';
        } else {
            usuarios.forEach(user => {
                const li = document.createElement('li');
                li.innerHTML = `<strong>${user.nome}</strong> (${user.type}) - Email: ${user.email} (ID: ${user.id.substring(0, 8)}...)`;
                listaUsuariosUl.appendChild(li);
            });
        }

    } catch (error) {
        console.error("Erro ao listar usuários:", error);
        listaUsuariosUl.innerHTML = '<li>❌ Erro de conexão com o servidor.</li>';
    }
}


// =========================================================================
// INICIALIZAÇÃO - PONTO CRÍTICO DE CORREÇÃO
// =========================================================================

/**
 * Envolve a busca de elementos DOM em um evento 'DOMContentLoaded'
 * para garantir que eles existam antes de serem acessados.
 */
document.addEventListener('DOMContentLoaded', () => {
    // Busca os elementos do DOM no momento da inicialização
    const form = document.getElementById("cadastroUsuario") as HTMLFormElement;
    const listarBtn = document.getElementById("listarBtn") as HTMLButtonElement;

    // Adiciona Listeners de Evento (apenas se os elementos foram encontrados)
    if (form) {
        form.addEventListener("submit", handleCadastroUsuario);
    } else {
        console.error("O formulário (#cadastroUsuario) não foi encontrado no HTML.");
    }

    if (listarBtn) {
        listarBtn.addEventListener('click', listarTodosOsUsuarios);
    } else {
        console.error("O botão de listar (#listarBtn) não foi encontrado no HTML.");
    }
});