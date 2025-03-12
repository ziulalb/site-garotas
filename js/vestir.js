// Dados das roupas
const roupas = {
    cabelos: [
        { id: 1, img: '../img/vestir/cabelo-1.png' },
        { id: 2, img: '../img/vestir/cabelo-2.png' },
        { id: 3, img: '../img/vestir/cabelo-3.png' },
        { id: 4, img: '../img/vestir/cabelo-4.png' },
        { id: 5, img: '../img/vestir/cabelo-5.png' }
    ],
    blusas: [
        { id: 1, img: '../img/vestir/blusa-1.png' },
        { id: 2, img: '../img/vestir/blusa-2.png' },
        { id: 3, img: '../img/vestir/blusa-3.png' },
        { id: 4, img: '../img/vestir/blusa-4.png' },
        { id: 5, img: '../img/vestir/blusa-5.png' }
    ],
    calcas: [
        { id: 1, img: '../img/vestir/calca-1.png' },
        { id: 2, img: '../img/vestir/calca-2.png' },
        { id: 3, img: '../img/vestir/calca-3.png' },
        { id: 4, img: '../img/vestir/calca-4.png' },
        { id: 5, img: '../img/vestir/calca-5.png' },
        { id: 6, img: '../img/vestir/calca-6.png' },
        { id: 7, img: '../img/vestir/calca-7.png' }
    ],
    sapatos: [
        { id: 1, img: '../img/vestir/sapato-1.png' },
        { id: 2, img: '../img/vestir/sapato-2.png' },
        { id: 3, img: '../img/vestir/sapato-3.png' },
        { id: 4, img: '../img/vestir/sapato-4.png' },
        { id: 5, img: '../img/vestir/sapato-5.png' },
        { id: 6, img: '../img/vestir/sapato-6.png' },
        { id: 7, img: '../img/vestir/sapato-7.png' }
    ],
    acessorios: [
        { id: 1, img: '../img/vestir/acessorio-1.png' },
        { id: 2, img: '../img/vestir/acessorio-2.png' },
        { id: 3, img: '../img/vestir/acessorio-3.png' },
        { id: 4, img: '../img/vestir/acessorio-4.png' },
        { id: 5, img: '../img/vestir/acessorio-5.png' }
    ]
};

// Elementos do DOM
const cabelosContainer = document.querySelector('.opcoes.cabelos');
const blusasContainer = document.querySelector('.opcoes.blusas');
const calcasContainer = document.querySelector('.opcoes.calcas');
const sapatosContainer = document.querySelector('.opcoes.sapatos');
const acessoriosContainer = document.querySelector('.opcoes.acessorios');

const cabeloCamada = document.querySelector('.camada.cabelo');
const blusaCamada = document.querySelector('.camada.blusa');
const calcaCamada = document.querySelector('.camada.calca');
const sapatoCamada = document.querySelector('.camada.sapato');
const acessorioCamada = document.querySelector('.camada.acessorio');

const randomizarBtn = document.getElementById('randomizar');
const salvarBtn = document.getElementById('salvar');
const limparBtn = document.getElementById('limpar');

// Estado atual
const estadoAtual = {
    cabelo: null,
    blusa: null,
    calca: null,
    sapato: null,
    acessorio: null
};

// Inicializar o jogo
function inicializarJogo() {
    // Criar opções para cada categoria
    criarOpcoes(roupas.cabelos, cabelosContainer, 'cabelo');
    criarOpcoes(roupas.blusas, blusasContainer, 'blusa');
    criarOpcoes(roupas.calcas, calcasContainer, 'calca');
    criarOpcoes(roupas.sapatos, sapatosContainer, 'sapato');
    criarOpcoes(roupas.acessorios, acessoriosContainer, 'acessorio');

    // Adicionar event listeners para os botões
    randomizarBtn.addEventListener('click', randomizarLook);
    salvarBtn.addEventListener('click', salvarLook);
    limparBtn.addEventListener('click', limparLook);
}

// Criar opções para uma categoria
function criarOpcoes(itens, container, categoria) {
    container.innerHTML = '';
    
    // Adicionar opção "nenhum"
    const nenhumDiv = document.createElement('div');
    nenhumDiv.classList.add('opcao');
    nenhumDiv.dataset.id = '0';
    nenhumDiv.innerHTML = '<span>Nenhum</span>';
    nenhumDiv.addEventListener('click', () => {
        selecionarItem(categoria, null);
        destacarOpcaoSelecionada(nenhumDiv, container);
    });
    container.appendChild(nenhumDiv);
    
    // Adicionar outras opções
    itens.forEach(item => {
        const opcaoDiv = document.createElement('div');
        opcaoDiv.classList.add('opcao');
        opcaoDiv.dataset.id = item.id;
        
        // Usar a própria imagem como miniatura
        const img = document.createElement('img');
        img.src = item.img;
        img.alt = `${categoria} ${item.id}`;
        opcaoDiv.appendChild(img);
        
        opcaoDiv.addEventListener('click', () => {
            selecionarItem(categoria, item);
            destacarOpcaoSelecionada(opcaoDiv, container);
        });
        
        container.appendChild(opcaoDiv);
    });
}

// Destacar opção selecionada
function destacarOpcaoSelecionada(opcaoSelecionada, container) {
    const opcoes = container.querySelectorAll('.opcao');
    opcoes.forEach(opcao => opcao.classList.remove('selecionada'));
    opcaoSelecionada.classList.add('selecionada');
}

// Selecionar um item
function selecionarItem(categoria, item) {
    estadoAtual[categoria] = item;
    atualizarPersonagem();
}

// Atualizar a aparência da personagem
function atualizarPersonagem() {
    // Atualizar cada camada
    atualizarCamada(calcaCamada, estadoAtual.calca);
    atualizarCamada(blusaCamada, estadoAtual.blusa);
    atualizarCamada(sapatoCamada, estadoAtual.sapato);
    atualizarCamada(cabeloCamada, estadoAtual.cabelo);
    atualizarCamada(acessorioCamada, estadoAtual.acessorio);
}

// Atualizar uma camada específica
function atualizarCamada(camada, item) {
    camada.style.backgroundImage = item ? `url(${item.img})` : 'none';
}

// Randomizar o look
function randomizarLook() {
    // Selecionar itens aleatórios para cada categoria
    const randomCabelo = getRandomItem(roupas.cabelos);
    const randomBlusa = getRandomItem(roupas.blusas);
    const randomCalca = getRandomItem(roupas.calcas);
    const randomSapato = getRandomItem(roupas.sapatos);
    const randomAcessorio = getRandomItem(roupas.acessorios);
    
    // Atualizar o estado
    estadoAtual.cabelo = randomCabelo;
    estadoAtual.blusa = randomBlusa;
    estadoAtual.calca = randomCalca;
    estadoAtual.sapato = randomSapato;
    estadoAtual.acessorio = randomAcessorio;
    
    // Atualizar a personagem
    atualizarPersonagem();
    
    // Destacar as opções selecionadas
    destacarOpcaoAleatoria(cabelosContainer, randomCabelo?.id);
    destacarOpcaoAleatoria(blusasContainer, randomBlusa?.id);
    destacarOpcaoAleatoria(calcasContainer, randomCalca?.id);
    destacarOpcaoAleatoria(sapatosContainer, randomSapato?.id);
    destacarOpcaoAleatoria(acessoriosContainer, randomAcessorio?.id);
}

// Destacar uma opção aleatória
function destacarOpcaoAleatoria(container, id) {
    const opcoes = container.querySelectorAll('.opcao');
    opcoes.forEach(opcao => opcao.classList.remove('selecionada'));
    
    if (id) {
        const opcaoSelecionada = container.querySelector(`.opcao[data-id="${id}"]`);
        if (opcaoSelecionada) {
            opcaoSelecionada.classList.add('selecionada');
        }
    } else {
        const nenhumOpcao = container.querySelector('.opcao[data-id="0"]');
        if (nenhumOpcao) {
            nenhumOpcao.classList.add('selecionada');
        }
    }
}

// Obter um item aleatório de um array (ou null)
function getRandomItem(array) {
    // 20% de chance de retornar null
    if (Math.random() < 0.2) {
        return null;
    }
    
    const randomIndex = Math.floor(Math.random() * array.length);
    return array[randomIndex];
}

// Salvar o look atual
function salvarLook() {
    // Capturar a div da personagem
    html2canvas(document.querySelector('.personagem')).then(canvas => {
        // Criar um link para download
        const link = document.createElement('a');
        link.download = 'meu-look.png';
        link.href = canvas.toDataURL('image/png');
        link.click();
    });
}

// Limpar o look atual
function limparLook() {
    // Resetar o estado
    estadoAtual.cabelo = null;
    estadoAtual.blusa = null;
    estadoAtual.calca = null;
    estadoAtual.sapato = null;
    estadoAtual.acessorio = null;
    
    // Atualizar a personagem
    atualizarPersonagem();
    
    // Destacar as opções "nenhum"
    const nenhumOpcoes = document.querySelectorAll('.opcao[data-id="0"]');
    nenhumOpcoes.forEach(opcao => {
        const container = opcao.parentElement;
        destacarOpcaoSelecionada(opcao, container);
    });
}

// Inicializar o jogo quando a página carregar
document.addEventListener('DOMContentLoaded', inicializarJogo);

// Polyfill para html2canvas (para salvar a imagem)
// Como não podemos incluir bibliotecas externas, vamos simular a funcionalidade
window.html2canvas = function(element) {
    return {
        then: function(callback) {
            const canvas = document.createElement('canvas');
            canvas.width = element.offsetWidth;
            canvas.height = element.offsetHeight;
            
            // Simulação de canvas
            canvas.toDataURL = function() {
                return 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==';
            };
            
            callback(canvas);
        }
    };
}; 