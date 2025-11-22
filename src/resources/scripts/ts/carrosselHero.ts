const imagensHero = [
    "/assets/Imagens/carrossel1.jpg",
    "/assets/Imagens/carrossel2.jpg",
    "/assets/Imagens/carrossel3.jpg"
];

let indexHero = 0;
// Tempo de transição em milissegundos (deve ser o mesmo que o CSS transition duration)
const FADE_DURATION = 1500;
// Intervalo entre as trocas
const INTERVAL = 6000;

document.addEventListener("DOMContentLoaded", () => {
    const bg = document.getElementById("hero-bg") as HTMLImageElement | null;

    if (!bg) {
        console.error("Elemento com ID 'hero-bg' não encontrado.");
        return;
    }

    // Adiciona a imagem inicial sem pré-carregamento
    bg.src = imagensHero[0] ?? "";

    // Esta função será chamada para fazer a transição
    function transitionHero() {
        // 1. Calcula o índice da próxima imagem
        const nextIndex = (indexHero + 1) % imagensHero.length;
        const nextImageUrl = imagensHero[nextIndex];

        // 2. Pré-carrega a próxima imagem em memória
        const preloader = new Image();
        preloader.src = nextImageUrl ?? "";

        // O que acontece APÓS a próxima imagem ser carregada
        preloader.onload = () => {
        // 3. Inicia o Fade-out (opacidade 1 -> 0.6)
        if (bg) {
            bg.style.opacity = "0.6";
        }
        
        // 4. Aguarda o tempo de fade-out antes de trocar a imagem e fazer fade-in
        setTimeout(() => {
            // 5. Troca o SRC. Agora é seguro, pois a imagem já está na memória cache.
            if (bg) {
                bg.src = nextImageUrl ?? "";
            }
            indexHero = nextIndex;
        
            // 6. Inicia o Fade-in (opacidade 0.6 -> 1)
            // Usando "1" em vez de "0.6" para o fade-in para garantir opacidade total
            if (bg) {
                bg.style.opacity = "1";
            }
        }, FADE_DURATION);
        };

        // Trata erro de carregamento (caso o caminho da imagem esteja errado)
        preloader.onerror = () => {
            console.error(`Erro ao carregar a imagem: ${nextImageUrl}`);
            // Pula para a próxima imagem
            indexHero = nextIndex;
        };
    }

    // Inicia o carrossel após o intervalo
    setInterval(transitionHero, INTERVAL);
});