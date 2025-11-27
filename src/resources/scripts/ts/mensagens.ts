import { API_BASE_URL } from "./config.js";
import { requireAuth } from "./autenticacao.js";

(function () {
  if (!requireAuth()) return;

  const API_URL = `${API_BASE_URL}/mensagens`;

  interface ConversationListItem {
    otherUser: {
      id: string;
      nome: string;
      email: string;
      type?: string;
    };
    totalMessages: number;
  }

  const tabelaBody = document.querySelector(
    "tbody"
  ) as HTMLTableSectionElement | null;

  function extractToken(): string {
    return localStorage.getItem("authToken") || "";
  }

  async function carregarConversas() {
    if (!tabelaBody) return;

    try {
      const token = extractToken();
      const url = `${API_URL}/conversations`;

      const headers: HeadersInit = {
        Authorization: `Bearer ${token}`,
      };

      const resposta = await fetch(url, { headers });

      if (!resposta.ok) {
        throw new Error(`Erro ao buscar conversas: ${resposta.status}`);
      }

      const dados = await resposta.json();
      const conversas: ConversationListItem[] = Array.isArray(dados.data)
        ? dados.data
        : [];

      exibirConversas(conversas);
    } catch (erro) {
      console.error("Erro ao carregar conversas:", erro);
      tabelaBody.innerHTML = `
        <tr><td colspan="4" class="erro">Erro ao carregar suas conversas.</td></tr>
      `;
    }
  }

  function exibirConversas(conversas: ConversationListItem[]) {
    if (!tabelaBody) return;

    if (conversas.length === 0) {
      tabelaBody.innerHTML = `
        <tr><td colspan="4" class="vazio">Você ainda não tem conversas.</td></tr>
      `;
      return;
    }

    tabelaBody.innerHTML = conversas
      .map(
        (conversa) => {
          const isVendedor = conversa.otherUser.type === 'Vendedor';
          const ratingButton = isVendedor 
            ? `<button class="btn-rate" data-vendedor-id="${conversa.otherUser.id}" data-vendedor-nome="${conversa.otherUser.nome}">Avaliar</button>`
            : '';

          return `
            <tr>
                <td>${conversa.otherUser.nome}</td>
                <td>${conversa.otherUser.email}</td>
                <td>${conversa.totalMessages}</td>
                <td>
                    <a href="batePapo.html?userId=${conversa.otherUser.id}" class="btn-ver">Ver Conversa</a>
                    ${ratingButton}
                </td>
            </tr>
          `;
        }
      )
      .join("");

    document.querySelectorAll('.btn-rate').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const target = e.target as HTMLButtonElement;
        const vendedorId = target.getAttribute('data-vendedor-id');
        const vendedorNome = target.getAttribute('data-vendedor-nome');
        if (vendedorId && vendedorNome) {
          openRatingModal(vendedorId, vendedorNome);
        }
      });
    });
  }

  let selectedRating = 0;
  let currentVendedorId = '';

  function openRatingModal(vendedorId: string, vendedorNome: string) {
    const modal = document.getElementById('ratingModal') as HTMLElement;
    const vendedorNameEl = document.getElementById('vendedorName') as HTMLElement;
    
    currentVendedorId = vendedorId;
    selectedRating = 0;
    
    if (vendedorNameEl) {
      vendedorNameEl.textContent = `Avalie: ${vendedorNome}`;
    }
    
    // Reset stars
    document.querySelectorAll('.star').forEach(star => {
      star.classList.remove('selected');
    });
    
    const submitBtn = document.getElementById('submitRating') as HTMLButtonElement;
    if (submitBtn) submitBtn.disabled = true;
    
    if (modal) modal.style.display = 'block';
  }

  function closeRatingModal() {
    const modal = document.getElementById('ratingModal') as HTMLElement;
    if (modal) modal.style.display = 'none';
    selectedRating = 0;
    currentVendedorId = '';
  }

  async function submitRating() {
    if (!selectedRating || !currentVendedorId) return;

    try {
      const token = extractToken();
      const response = await fetch(`${API_BASE_URL}/users/rate/${currentVendedorId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ rating: selectedRating })
      });

      if (!response.ok) {
        throw new Error('Erro ao enviar avaliação');
      }

      alert('Avaliação enviada com sucesso!');
      closeRatingModal();
    } catch (error) {
      console.error('Erro ao enviar avaliação:', error);
      alert('Erro ao enviar avaliação. Tente novamente.');
    }
  }

  document.addEventListener("DOMContentLoaded", () => {
    carregarConversas();

    const modal = document.getElementById('ratingModal');
    const closeBtn = document.querySelector('.close');
    const submitBtn = document.getElementById('submitRating');
    const cancelBtn = document.getElementById('cancelRating');
    const stars = document.querySelectorAll('.star');

    if (closeBtn) {
      closeBtn.addEventListener('click', closeRatingModal);
    }

    if (cancelBtn) {
      cancelBtn.addEventListener('click', closeRatingModal);
    }

    if (modal) {
      modal.addEventListener('click', (e) => {
        if (e.target === modal) {
          closeRatingModal();
        }
      });
    }

    stars.forEach(star => {
      star.addEventListener('click', () => {
        const rating = parseInt(star.getAttribute('data-rating') || '0');
        selectedRating = rating;

        stars.forEach(s => {
          const starRating = parseInt(s.getAttribute('data-rating') || '0');
          if (starRating <= rating) {
            s.classList.add('selected');
          } else {
            s.classList.remove('selected');
          }
        });

        const submitBtn = document.getElementById('submitRating') as HTMLButtonElement;
        if (submitBtn) submitBtn.disabled = false;
      });

      star.addEventListener('mouseenter', () => {
        const rating = parseInt(star.getAttribute('data-rating') || '0');
        stars.forEach(s => {
          const starRating = parseInt(s.getAttribute('data-rating') || '0');
          if (starRating <= rating) {
            s.classList.add('hover');
          } else {
            s.classList.remove('hover');
          }
        });
      });
    });

    const starsContainer = document.querySelector('.stars-container');
    if (starsContainer) {
      starsContainer.addEventListener('mouseleave', () => {
        stars.forEach(s => s.classList.remove('hover'));
      });
    }

    if (submitBtn) {
      submitBtn.addEventListener('click', submitRating);
    }
  });
})();

