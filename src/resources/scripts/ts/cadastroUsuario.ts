import { API_BASE_URL } from "./config.js";

interface UserFormData {
  nome: string;
  email: string;
  senha: string;
  celular: string;
  endereco: string;
}

interface UserResponseData extends UserFormData {
  id: string;
  type: "Comprador" | "Vendedor";
  createdAt: string;
}

function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

function validatePassword(password: string): boolean {
  return password.length >= 6;
}

function validatePhone(phone: string): boolean {
  const cleanPhone = phone.replace(/\D/g, "");
  return cleanPhone.length === 11;
}

function showMessage(message: string, isSuccess: boolean): void {
  alert(message);

  if (isSuccess) {
    setTimeout(() => {
      window.location.href = "login.html";
    }, 500);
  }
}

const USER_TYPE = {
  COMPRADOR: "Comprador",
  VENDEDOR: "Vendedor",
} as const;

type UserType = (typeof USER_TYPE)[keyof typeof USER_TYPE];

async function handleCadastroUsuario(event: Event) {
  event.preventDefault();

  const form = document.getElementById("cadastroUsuario") as HTMLFormElement;
  if (!form) return;

  const nome =
    (document.getElementById("nome") as HTMLInputElement)?.value.trim() || "";
  const email =
    (document.getElementById("email") as HTMLInputElement)?.value.trim() || "";
  const senha =
    (document.getElementById("senha") as HTMLInputElement)?.value || "";
  const celular =
    (document.getElementById("telefone") as HTMLInputElement)?.value.trim() ||
    "";
  const endereco =
    (document.getElementById("endereco") as HTMLInputElement)?.value.trim() ||
    "";

  const tipoRadio = document.querySelector(
    'input[name="tipo"]:checked'
  ) as HTMLInputElement;
  const tipo: UserType = (tipoRadio?.value as UserType) || USER_TYPE.COMPRADOR;

  if (!nome || !email || !senha || !celular || !endereco) {
    showMessage("Por favor, preencha todos os campos.", false);
    return;
  }

  if (!validateEmail(email)) {
    showMessage("Email inválido. Use o formato: exemplo@email.com", false);
    return;
  }

  if (!validatePassword(senha)) {
    showMessage("A senha deve ter no mínimo 6 caracteres.", false);
    return;
  }

  if (!validatePhone(celular)) {
    showMessage("O telefone deve ter 11 dígitos (DDD + número).", false);
    return;
  }

  const payload = {
    nome,
    email,
    senha,
    celular,
    endereco,
    tipo,
  };

  try {
    const response = await fetch(`${API_BASE_URL}/auth/register`, {
      method: "POST",
      mode: "cors",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const dados = await response.json();

    if (response.ok) {
      showMessage(
        "Cadastro realizado com sucesso! Redirecionando para login...",
        true
      );
    } else {
      showMessage(
        `Erro: ${dados.message || dados.error || "Falha no cadastro"}`,
        false
      );
    }
  } catch (error) {
    console.error("Erro ao cadastrar:", error);
    showMessage(
      "Erro de conexão. Verifique se o servidor está rodando.",
      false
    );
  }
}

// async function listarTodosOsUsuarios() {
//     const listaUsuariosUl = document.getElementById("listaUsuarios") as HTMLUListElement;

//     if (!listaUsuariosUl) {
//         console.error("Lista de usuários (ul) não encontrada.");
//         return;
//     }

//     listaUsuariosUl.innerHTML = '<li>Carregando usuários...</li>';

//     try {
//         const response = await fetch(`${API_BASE_URL}/users`, {
//             method: 'GET',
//             mode: 'cors',
//             headers: { 'Content-Type': 'application/json' },
//         });

//         const result = await response.json();

//         if (!response.ok) {
//             listaUsuariosUl.innerHTML = `<li>Falha ao buscar: ${result.message || 'Erro Desconhecido'}</li>`;
//             return;
//         }

//         const usuarios: UserResponseData[] = result.data;
//         listaUsuariosUl.innerHTML = '';

//         if (usuarios.length === 0) {
//             listaUsuariosUl.innerHTML = '<li>Nenhum usuário cadastrado.</li>';
//         } else {
//             usuarios.forEach(user => {
//                 const li = document.createElement('li');
//                 li.innerHTML = `<strong>${user.nome}</strong> (${user.type}) - Email: ${user.email} (ID: ${user.id.substring(0, 8)}...)`;
//                 listaUsuariosUl.appendChild(li);
//             });
//         }

//     } catch (error) {
//         console.error("Erro ao listar usuários:", error);
//         listaUsuariosUl.innerHTML = '<li>Erro de conexão com o servidor.</li>';
//     }
// }

document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("cadastroUsuario") as HTMLFormElement;
  const listarBtn = document.getElementById("listarBtn") as HTMLButtonElement;

  if (form) {
    form.addEventListener("submit", handleCadastroUsuario);
  }

  // if (listarBtn) {
  //     listarBtn.addEventListener('click', listarTodosOsUsuarios);
  // }
});

export {};
