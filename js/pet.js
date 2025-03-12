// Dados dos acessórios do pet
const acessorios = {
    chapeus: [
        { id: 1, img: '../img/pet/chapeu-1.png' },
        { id: 2, img: '../img/pet/chapeu-2.png' },
        { id: 3, img: '../img/pet/chapeu-3.png' }
    ],
    roupas: [
        { id: 1, img: '../img/pet/roupa-1.png' },
        { id: 2, img: '../img/pet/roupa-2.png' },
        { id: 3, img: '../img/pet/roupa-3.png' }
    ],
    coleiras: [
        { id: 1, img: '../img/pet/coleira-1.png' },
        { id: 2, img: '../img/pet/coleira-2.png' },
        { id: 3, img: '../img/pet/coleira-3.png' }
    ]
};

// Imagens do pet
const petImagens = {
    normal: '../img/pet/base.png',
    dormindo: '../img/pet/dormindo.png',
    comendo: '../img/pet/comendo.png',
    brincando: '../img/pet/brincando.png'
};

// Elementos do DOM
const petContainer = document.querySelector('.pet-container');
const petImagem = document.querySelector('.pet-imagem');
const chapeusContainer = document.querySelector('.chapeus-container');
const roupasContainer = document.querySelector('.roupas-container');
const coleirasContainer = document.querySelector('.coleiras-container');
const alimentarBtn = document.getElementById('alimentar');
const brincarBtn = document.getElementById('brincar');
const dormirBtn = document.getElementById('dormir');
const limparBtn = document.getElementById('limpar');
const statusFome = document.getElementById('status-fome');
const statusFelicidade = document.getElementById('status-felicidade');
const statusEnergia = document.getElementById('status-energia');

// Estado do pet
const pet = {
    nome: 'Meu Pet',
    fome: 100,
    felicidade: 100,
    energia: 100,
    estado: 'normal',
    acessorios: {
        chapeu: null,
        roupa: null,
        coleira: null
    }
};

// Intervalos para diminuir os status
let fomeInterval;
let felicidadeInterval;
let energiaInterval;

// Inicializar o jogo
function inicializarJogo() {
    // Criar opções de acessórios
    criarOpcoesAcessorios();
    
    // Inicializar os intervalos
    iniciarIntervalos();
    
    // Adicionar event listeners para os botões
    alimentarBtn.addEventListener('click', alimentarPet);
    brincarBtn.addEventListener('click', brincarComPet);
    dormirBtn.addEventListener('click', fazerPetDormir);
    limparBtn.addEventListener('click', limparAcessorios);
    
    // Atualizar a interface
    atualizarInterface();
}

// Criar opções de acessórios
function criarOpcoesAcessorios() {
    // Criar opções de chapéus
    criarOpcoes(acessorios.chapeus, chapeusContainer, 'chapeu');
    
    // Criar opções de roupas
    criarOpcoes(acessorios.roupas, roupasContainer, 'roupa');
    
    // Criar opções de coleiras
    criarOpcoes(acessorios.coleiras, coleirasContainer, 'coleira');
}

// Criar opções para um tipo de acessório
function criarOpcoes(itens, container, tipo) {
    container.innerHTML = '';
    
    // Adicionar opção "nenhum"
    const nenhumDiv = document.createElement('div');
    nenhumDiv.classList.add('acessorio-opcao');
    nenhumDiv.dataset.id = '0';
    nenhumDiv.innerHTML = '<span>Nenhum</span>';
    nenhumDiv.addEventListener('click', () => {
        selecionarAcessorio(tipo, null);
        destacarOpcaoSelecionada(nenhumDiv, container);
    });
    container.appendChild(nenhumDiv);
    
    // Adicionar outras opções
    itens.forEach(item => {
        const opcaoDiv = document.createElement('div');
        opcaoDiv.classList.add('acessorio-opcao');
        opcaoDiv.dataset.id = item.id;
        
        // Usar a própria imagem como miniatura
        const img = document.createElement('img');
        img.src = item.img;
        img.alt = `${tipo} ${item.id}`;
        opcaoDiv.appendChild(img);
        
        opcaoDiv.addEventListener('click', () => {
            selecionarAcessorio(tipo, item);
            destacarOpcaoSelecionada(opcaoDiv, container);
        });
        
        container.appendChild(opcaoDiv);
    });
}

// Destacar opção selecionada
function destacarOpcaoSelecionada(opcaoSelecionada, container) {
    const opcoes = container.querySelectorAll('.acessorio-opcao');
    opcoes.forEach(opcao => opcao.classList.remove('selecionada'));
    opcaoSelecionada.classList.add('selecionada');
}

// Selecionar um acessório
function selecionarAcessorio(tipo, item) {
    pet.acessorios[tipo] = item;
    atualizarAparenciaPet();
}

// Atualizar a aparência do pet
function atualizarAparenciaPet() {
    // Limpar acessórios anteriores
    document.querySelectorAll('.acessorio').forEach(el => el.remove());
    
    // Definir a imagem base do pet de acordo com o estado
    petImagem.src = petImagens[pet.estado];
    
    // Adicionar acessórios
    if (pet.acessorios.coleira) {
        adicionarAcessorio('coleira', pet.acessorios.coleira.img);
    }
    
    if (pet.acessorios.roupa) {
        adicionarAcessorio('roupa', pet.acessorios.roupa.img);
    }
    
    if (pet.acessorios.chapeu) {
        adicionarAcessorio('chapeu', pet.acessorios.chapeu.img);
    }
}

// Adicionar um acessório ao pet
function adicionarAcessorio(tipo, imagem) {
    const acessorio = document.createElement('img');
    acessorio.classList.add('acessorio', tipo);
    acessorio.src = imagem;
    petContainer.appendChild(acessorio);
}

// Iniciar os intervalos para diminuir os status
function iniciarIntervalos() {
    // Diminuir a fome a cada 10 segundos
    fomeInterval = setInterval(() => {
        if (pet.estado !== 'dormindo') {
            pet.fome = Math.max(0, pet.fome - 5);
            atualizarInterface();
        }
    }, 10000);
    
    // Diminuir a felicidade a cada 15 segundos
    felicidadeInterval = setInterval(() => {
        if (pet.estado !== 'dormindo') {
            pet.felicidade = Math.max(0, pet.felicidade - 3);
            atualizarInterface();
        }
    }, 15000);
    
    // Diminuir a energia a cada 20 segundos
    energiaInterval = setInterval(() => {
        if (pet.estado === 'brincando') {
            pet.energia = Math.max(0, pet.energia - 10);
        } else if (pet.estado !== 'dormindo') {
            pet.energia = Math.max(0, pet.energia - 2);
        }
        atualizarInterface();
    }, 20000);
}

// Atualizar a interface
function atualizarInterface() {
    // Atualizar barras de status
    statusFome.style.width = `${pet.fome}%`;
    statusFelicidade.style.width = `${pet.felicidade}%`;
    statusEnergia.style.width = `${pet.energia}%`;
    
    // Atualizar cores das barras
    atualizarCorBarra(statusFome, pet.fome);
    atualizarCorBarra(statusFelicidade, pet.felicidade);
    atualizarCorBarra(statusEnergia, pet.energia);
    
    // Verificar se o pet precisa mudar de estado automaticamente
    verificarEstadoAutomatico();
}

// Atualizar a cor de uma barra de status
function atualizarCorBarra(barra, valor) {
    if (valor > 70) {
        barra.style.backgroundColor = '#4CAF50'; // Verde
    } else if (valor > 30) {
        barra.style.backgroundColor = '#FFC107'; // Amarelo
    } else {
        barra.style.backgroundColor = '#F44336'; // Vermelho
    }
}

// Verificar se o pet precisa mudar de estado automaticamente
function verificarEstadoAutomatico() {
    // Se a energia estiver muito baixa, o pet dorme automaticamente
    if (pet.energia < 10 && pet.estado !== 'dormindo') {
        fazerPetDormir();
        return;
    }
    
    // Se a fome estiver muito baixa, o pet fica triste
    if (pet.fome < 20 && pet.estado !== 'dormindo') {
        mudarEstadoPet('normal');
        alimentarBtn.classList.add('piscando');
    } else {
        alimentarBtn.classList.remove('piscando');
    }
    
    // Se a felicidade estiver muito baixa, o pet fica triste
    if (pet.felicidade < 20 && pet.estado !== 'dormindo') {
        mudarEstadoPet('normal');
        brincarBtn.classList.add('piscando');
    } else {
        brincarBtn.classList.remove('piscando');
    }
}

// Alimentar o pet
function alimentarPet() {
    if (pet.estado === 'dormindo') {
        alert('Seu pet está dormindo! Acorde-o primeiro.');
        return;
    }
    
    // Mudar o estado para comendo
    mudarEstadoPet('comendo');
    
    // Aumentar a fome
    pet.fome = Math.min(100, pet.fome + 30);
    
    // Diminuir um pouco a energia
    pet.energia = Math.max(0, pet.energia - 5);
    
    // Atualizar a interface
    atualizarInterface();
    
    // Voltar ao estado normal após 3 segundos
    setTimeout(() => {
        if (pet.estado === 'comendo') {
            mudarEstadoPet('normal');
        }
    }, 3000);
}

// Brincar com o pet
function brincarComPet() {
    if (pet.estado === 'dormindo') {
        alert('Seu pet está dormindo! Acorde-o primeiro.');
        return;
    }
    
    if (pet.energia < 20) {
        alert('Seu pet está muito cansado para brincar! Deixe-o descansar.');
        return;
    }
    
    // Mudar o estado para brincando
    mudarEstadoPet('brincando');
    
    // Aumentar a felicidade
    pet.felicidade = Math.min(100, pet.felicidade + 20);
    
    // Diminuir a energia e a fome
    pet.energia = Math.max(0, pet.energia - 15);
    pet.fome = Math.max(0, pet.fome - 10);
    
    // Atualizar a interface
    atualizarInterface();
    
    // Voltar ao estado normal após 5 segundos
    setTimeout(() => {
        if (pet.estado === 'brincando') {
            mudarEstadoPet('normal');
        }
    }, 5000);
}

// Fazer o pet dormir ou acordar
function fazerPetDormir() {
    if (pet.estado === 'dormindo') {
        // Acordar o pet
        mudarEstadoPet('normal');
    } else {
        // Fazer o pet dormir
        mudarEstadoPet('dormindo');
        
        // Iniciar recuperação de energia
        const recuperacaoInterval = setInterval(() => {
            if (pet.estado === 'dormindo') {
                pet.energia = Math.min(100, pet.energia + 10);
                atualizarInterface();
                
                if (pet.energia >= 100) {
                    // Acordar automaticamente quando estiver com energia máxima
                    clearInterval(recuperacaoInterval);
                    mudarEstadoPet('normal');
                }
            } else {
                clearInterval(recuperacaoInterval);
            }
        }, 3000);
    }
}

// Mudar o estado do pet
function mudarEstadoPet(novoEstado) {
    pet.estado = novoEstado;
    
    // Atualizar o texto do botão de dormir
    if (novoEstado === 'dormindo') {
        dormirBtn.textContent = 'Acordar';
    } else {
        dormirBtn.textContent = 'Dormir';
    }
    
    // Atualizar a aparência do pet
    atualizarAparenciaPet();
}

// Limpar todos os acessórios
function limparAcessorios() {
    pet.acessorios.chapeu = null;
    pet.acessorios.roupa = null;
    pet.acessorios.coleira = null;
    
    // Atualizar a aparência do pet
    atualizarAparenciaPet();
    
    // Destacar as opções "nenhum"
    const nenhumOpcoes = document.querySelectorAll('.acessorio-opcao[data-id="0"]');
    nenhumOpcoes.forEach(opcao => {
        const container = opcao.parentElement;
        destacarOpcaoSelecionada(opcao, container);
    });
}

// Inicializar o jogo quando a página carregar
document.addEventListener('DOMContentLoaded', inicializarJogo); 