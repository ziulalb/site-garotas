// Dados das cartas
const cartas = [
    { id: 1, img: '../img/memoria/carta-1.png' },
    { id: 2, img: '../img/memoria/carta-2.png' },
    { id: 3, img: '../img/memoria/carta-3.png' },
    { id: 4, img: '../img/memoria/carta-4.png' },
    { id: 5, img: '../img/memoria/carta-5.png' },
    { id: 6, img: '../img/memoria/carta-6.png' },
    { id: 7, img: '../img/memoria/carta-7.png' },
    { id: 8, img: '../img/memoria/carta-8.png' },
    { id: 9, img: '../img/memoria/carta-9.png' },
    { id: 10, img: '../img/memoria/carta-10.png' },
    { id: 11, img: '../img/memoria/carta-11.png' },
    { id: 12, img: '../img/memoria/carta-12.png' }
];

// Imagem do verso da carta
const cartaVerso = '../img/memoria/carta-verso.png';

// Configurações de dificuldade
const dificuldades = {
    facil: { pares: 6, colunas: 4 },
    medio: { pares: 8, colunas: 4 },
    dificil: { pares: 12, colunas: 6 }
};

// Elementos do DOM
const dificuldadeBtns = document.querySelectorAll('.dificuldade-btn');
const tabuleiro = document.querySelector('.tabuleiro');
const timer = document.querySelector('.timer');
const movimentos = document.querySelector('.movimentos');
const reiniciarBtn = document.getElementById('reiniciar');
const mensagemVitoria = document.querySelector('.mensagem-vitoria');
const jogarNovamenteBtn = document.getElementById('jogar-novamente');

// Estado do jogo
let dificuldadeAtual = 'facil';
let cartasEmJogo = [];
let cartasViradas = [];
let paresEncontrados = 0;
let movimentosContador = 0;
let tempoDecorrido = 0;
let timerInterval;
let jogoIniciado = false;
let jogoBloqueado = false;

// Inicializar o jogo
function inicializarJogo() {
    // Adicionar event listeners para os botões de dificuldade
    dificuldadeBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            if (!jogoIniciado || confirm('Deseja reiniciar o jogo com uma nova dificuldade?')) {
                dificuldadeAtual = btn.dataset.dificuldade;
                reiniciarJogo();
                
                // Atualizar classes ativas
                dificuldadeBtns.forEach(b => b.classList.remove('ativa'));
                btn.classList.add('ativa');
            }
        });
    });
    
    // Adicionar event listener para o botão de reiniciar
    reiniciarBtn.addEventListener('click', reiniciarJogo);
    
    // Adicionar event listener para o botão de jogar novamente
    jogarNovamenteBtn.addEventListener('click', () => {
        mensagemVitoria.classList.remove('visivel');
        reiniciarJogo();
    });
    
    // Iniciar o jogo com a dificuldade padrão
    reiniciarJogo();
}

// Reiniciar o jogo
function reiniciarJogo() {
    // Limpar o tabuleiro
    tabuleiro.innerHTML = '';
    
    // Resetar o estado do jogo
    cartasEmJogo = [];
    cartasViradas = [];
    paresEncontrados = 0;
    movimentosContador = 0;
    tempoDecorrido = 0;
    jogoIniciado = false;
    jogoBloqueado = false;
    
    // Limpar o timer
    if (timerInterval) {
        clearInterval(timerInterval);
        timerInterval = null;
    }
    
    // Atualizar o contador de movimentos
    movimentos.textContent = movimentosContador;
    
    // Atualizar o timer
    timer.textContent = formatarTempo(tempoDecorrido);
    
    // Obter configurações da dificuldade atual
    const { pares, colunas } = dificuldades[dificuldadeAtual];
    
    // Definir o número de colunas do tabuleiro
    tabuleiro.style.gridTemplateColumns = `repeat(${colunas}, 1fr)`;
    
    // Selecionar cartas aleatórias para o jogo
    const cartasAleatorias = [...cartas].sort(() => 0.5 - Math.random()).slice(0, pares);
    
    // Duplicar as cartas para formar pares e embaralhar
    cartasEmJogo = [...cartasAleatorias, ...cartasAleatorias]
        .map(carta => ({ ...carta, id: Math.random() }))
        .sort(() => 0.5 - Math.random());
    
    // Criar elementos para cada carta
    cartasEmJogo.forEach(carta => {
        const cartaElemento = document.createElement('div');
        cartaElemento.classList.add('carta');
        cartaElemento.dataset.id = carta.id;
        
        const cartaFrente = document.createElement('div');
        cartaFrente.classList.add('carta-frente');
        
        const cartaVersoDiv = document.createElement('div');
        cartaVersoDiv.classList.add('carta-verso');
        
        // Criar imagem para a frente da carta
        const imgFrente = document.createElement('img');
        imgFrente.src = carta.img;
        imgFrente.alt = `Carta ${carta.id}`;
        cartaFrente.appendChild(imgFrente);
        
        // Criar imagem para o verso da carta (opcional)
        const imgVerso = document.createElement('img');
        imgVerso.src = cartaVerso;
        imgVerso.alt = 'Verso da carta';
        cartaVersoDiv.appendChild(imgVerso);
        
        cartaElemento.appendChild(cartaFrente);
        cartaElemento.appendChild(cartaVersoDiv);
        
        cartaElemento.addEventListener('click', () => virarCarta(cartaElemento, carta));
        
        tabuleiro.appendChild(cartaElemento);
    });
}

// Virar uma carta
function virarCarta(cartaElemento, carta) {
    // Verificar se o jogo está bloqueado ou se a carta já está virada
    if (jogoBloqueado || cartasViradas.includes(cartaElemento) || cartaElemento.classList.contains('encontrada')) {
        return;
    }
    
    // Iniciar o jogo se ainda não foi iniciado
    if (!jogoIniciado) {
        iniciarTimer();
        jogoIniciado = true;
    }
    
    // Virar a carta
    cartaElemento.classList.add('virada');
    cartasViradas.push(cartaElemento);
    
    // Verificar se duas cartas foram viradas
    if (cartasViradas.length === 2) {
        // Incrementar o contador de movimentos
        movimentosContador++;
        movimentos.textContent = movimentosContador;
        
        // Verificar se as cartas formam um par
        const carta1 = cartasViradas[0];
        const carta2 = cartasViradas[1];
        
        if (carta1.dataset.id === carta2.dataset.id) {
            // As cartas não são as mesmas (clicou na mesma carta duas vezes)
            jogoBloqueado = true;
            setTimeout(() => {
                carta1.classList.remove('virada');
                carta2.classList.remove('virada');
                cartasViradas = [];
                jogoBloqueado = false;
            }, 1000);
        } else {
            const cartaObj1 = cartasEmJogo.find(c => c.id == carta1.dataset.id);
            const cartaObj2 = cartasEmJogo.find(c => c.id == carta2.dataset.id);
            
            if (cartaObj1.img === cartaObj2.img) {
                // Par encontrado
                cartasViradas.forEach(carta => {
                    carta.classList.add('encontrada');
                });
                cartasViradas = [];
                paresEncontrados++;
                
                // Verificar se o jogo foi concluído
                if (paresEncontrados === dificuldades[dificuldadeAtual].pares) {
                    finalizarJogo();
                }
            } else {
                // Par não encontrado
                jogoBloqueado = true;
                setTimeout(() => {
                    cartasViradas.forEach(carta => {
                        carta.classList.remove('virada');
                    });
                    cartasViradas = [];
                    jogoBloqueado = false;
                }, 1000);
            }
        }
    }
}

// Iniciar o timer
function iniciarTimer() {
    timerInterval = setInterval(() => {
        tempoDecorrido++;
        timer.textContent = formatarTempo(tempoDecorrido);
    }, 1000);
}

// Formatar o tempo
function formatarTempo(segundos) {
    const minutos = Math.floor(segundos / 60);
    const segs = segundos % 60;
    return `${minutos.toString().padStart(2, '0')}:${segs.toString().padStart(2, '0')}`;
}

// Finalizar o jogo
function finalizarJogo() {
    // Parar o timer
    clearInterval(timerInterval);
    
    // Calcular pontuação
    const pontuacao = calcularPontuacao();
    
    // Atualizar a mensagem de vitória
    document.getElementById('tempo-final').textContent = formatarTempo(tempoDecorrido);
    document.getElementById('movimentos-final').textContent = movimentosContador;
    document.getElementById('pontuacao-final').textContent = pontuacao;
    
    // Mostrar a mensagem de vitória
    setTimeout(() => {
        mensagemVitoria.classList.add('visivel');
    }, 500);
}

// Calcular pontuação
function calcularPontuacao() {
    const dificuldadeMultiplicador = {
        facil: 1,
        medio: 1.5,
        dificil: 2
    };
    
    const tempoBase = 120; // 2 minutos
    const movimentosIdeal = dificuldades[dificuldadeAtual].pares * 2; // Número ideal de movimentos
    
    let pontuacao = 1000 * dificuldadeMultiplicador[dificuldadeAtual];
    
    // Penalidade por tempo
    if (tempoDecorrido > tempoBase) {
        pontuacao -= Math.min(300, (tempoDecorrido - tempoBase) * 5);
    }
    
    // Penalidade por movimentos extras
    if (movimentosContador > movimentosIdeal) {
        pontuacao -= Math.min(300, (movimentosContador - movimentosIdeal) * 10);
    }
    
    return Math.max(0, Math.round(pontuacao));
}

// Inicializar o jogo quando a página carregar
document.addEventListener('DOMContentLoaded', inicializarJogo); 