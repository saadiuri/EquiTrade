const imagensHero = [
  "/assets/Imagens/carrossel1.jpg",
  "/assets/Imagens/carrossel2.jpg",
  "/assets/Imagens/carrossel3.jpg",
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

  bg.src = imagensHero[0] ?? "";

  function transitionHero() {
    const nextIndex = (indexHero + 1) % imagensHero.length;
    const nextImageUrl = imagensHero[nextIndex];

    const preloader = new Image();
    preloader.src = nextImageUrl ?? "";

    preloader.onload = () => {
      if (bg) {
        bg.style.opacity = "0.6";
      }

      setTimeout(() => {
        if (bg) {
          bg.src = nextImageUrl ?? "";
        }
        indexHero = nextIndex;

        if (bg) {
          bg.style.opacity = "1";
        }
      }, FADE_DURATION);
    };

    preloader.onerror = () => {
      console.error(`Erro ao carregar a imagem: ${nextImageUrl}`);
      indexHero = nextIndex;
    };
  }

  setInterval(transitionHero, INTERVAL);
});
