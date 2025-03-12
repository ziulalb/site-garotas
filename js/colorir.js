// Dados dos desenhos
const desenhos = [
    { id: 1, svg: '../img/colorir/desenho-1.svg' },
    { id: 2, svg: '../img/colorir/desenho-2.svg' },
    { id: 3, svg: '../img/colorir/desenho-3.svg' },
    { id: 4, svg: '../img/colorir/desenho-4.svg' },
    { id: 5, svg: '../img/colorir/desenho-5.svg' },
    { id: 6, svg: '../img/colorir/desenho-6.svg' }
];

// Cores disponíveis
const cores = [
    '#FF6B6B', '#4ECDC4', '#FFD166', '#6B5B95', '#88D8B0', 
    '#FF8C94', '#91A6FF', '#FFAAA5', '#B5EAD7', '#C7CEEA',
    '#F8B195', '#F67280', '#C06C84', '#6C5B7B', '#355C7D',
    '#99B898', '#FECEAB', '#FF847C', '#E84A5F', '#2A363B'
];

// Elementos do DOM
const desenhosContainer = document.querySelector('.desenhos-container');
const areaDesenho = document.querySelector('.area-desenho');
const paleta = document.querySelector('.paleta-cores');
const borracha = document.getElementById('borracha');
const baixarBtn = document.getElementById('baixar');
const limparBtn = document.getElementById('limpar');

// Estado atual
let desenhoAtual = null;
let corSelecionada = cores[0];
let elementoSelecionado = null;
let modoColorir = true;

// Inicializar o jogo
function inicializarJogo() {
    // Criar miniaturas dos desenhos
    criarMiniaturas();
    
    // Criar paleta de cores
    criarPaleta();
    
    // Adicionar event listeners para os botões
    borracha.addEventListener('click', () => {
        modoColorir = false;
        document.querySelectorAll('.cor').forEach(cor => cor.classList.remove('selecionada'));
        borracha.classList.add('selecionada');
    });
    
    baixarBtn.addEventListener('click', baixarDesenho);
    limparBtn.addEventListener('click', limparDesenho);
}

// Criar miniaturas dos desenhos
function criarMiniaturas() {
    desenhosContainer.innerHTML = '';
    
    desenhos.forEach(desenho => {
        const miniaturaDiv = document.createElement('div');
        miniaturaDiv.classList.add('miniatura');
        
        // Usar a própria imagem como miniatura
        const img = document.createElement('img');
        img.src = desenho.svg;
        img.alt = `Desenho ${desenho.id}`;
        miniaturaDiv.appendChild(img);
        
        miniaturaDiv.addEventListener('click', () => {
            document.querySelectorAll('.miniatura').forEach(m => m.classList.remove('selecionada'));
            miniaturaDiv.classList.add('selecionada');
            carregarDesenho(desenho);
        });
        
        desenhosContainer.appendChild(miniaturaDiv);
    });
    
    // Carregar o primeiro desenho por padrão
    if (desenhos.length > 0) {
        document.querySelector('.miniatura').click();
    }
}

// Criar paleta de cores
function criarPaleta() {
    paleta.innerHTML = '';
    
    cores.forEach(cor => {
        const corDiv = document.createElement('div');
        corDiv.classList.add('cor');
        corDiv.style.backgroundColor = cor;
        
        corDiv.addEventListener('click', () => {
            modoColorir = true;
            corSelecionada = cor;
            
            document.querySelectorAll('.cor').forEach(c => c.classList.remove('selecionada'));
            borracha.classList.remove('selecionada');
            corDiv.classList.add('selecionada');
        });
        
        paleta.appendChild(corDiv);
    });
    
    // Selecionar a primeira cor por padrão
    document.querySelector('.cor').classList.add('selecionada');
}

// Carregar um desenho
function carregarDesenho(desenho) {
    desenhoAtual = desenho;
    
    // Limpar área de desenho
    areaDesenho.innerHTML = '';
    
    // Carregar o SVG
    fetch(desenho.svg)
        .then(response => response.text())
        .then(svgText => {
            areaDesenho.innerHTML = svgText;
            
            // Adicionar event listeners para os elementos do SVG
            const elementos = areaDesenho.querySelectorAll('path, circle, rect, ellipse, polygon');
            elementos.forEach(elemento => {
                // Remover qualquer preenchimento existente
                elemento.setAttribute('fill', 'white');
                
                // Adicionar evento de clique
                elemento.addEventListener('click', () => {
                    if (modoColorir) {
                        elemento.setAttribute('fill', corSelecionada);
                    } else {
                        elemento.setAttribute('fill', 'white');
                    }
                });
                
                // Adicionar evento de hover
                elemento.addEventListener('mouseenter', () => {
                    elementoSelecionado = elemento;
                    elemento.style.cursor = 'pointer';
                    elemento.setAttribute('stroke-width', '2');
                });
                
                elemento.addEventListener('mouseleave', () => {
                    elementoSelecionado = null;
                    elemento.setAttribute('stroke-width', '1');
                });
            });
        })
        .catch(error => {
            console.error('Erro ao carregar o SVG:', error);
            areaDesenho.innerHTML = '<p>Erro ao carregar o desenho. Por favor, tente novamente.</p>';
        });
}

// Baixar o desenho colorido
function baixarDesenho() {
    if (!desenhoAtual) return;
    
    // Criar um clone do SVG para não afetar o original
    const svgClone = areaDesenho.querySelector('svg').cloneNode(true);
    
    // Converter SVG para string
    const svgData = new XMLSerializer().serializeToString(svgClone);
    
    // Criar um blob com os dados do SVG
    const blob = new Blob([svgData], { type: 'image/svg+xml' });
    
    // Criar URL para o blob
    const url = URL.createObjectURL(blob);
    
    // Criar link para download
    const link = document.createElement('a');
    link.download = `desenho-colorido-${desenhoAtual.id}.svg`;
    link.href = url;
    link.click();
    
    // Liberar a URL
    URL.revokeObjectURL(url);
}

// Limpar o desenho atual
function limparDesenho() {
    if (!desenhoAtual) return;
    
    // Resetar todas as cores para branco
    const elementos = areaDesenho.querySelectorAll('path, circle, rect, ellipse, polygon');
    elementos.forEach(elemento => {
        elemento.setAttribute('fill', 'white');
    });
}

// Inicializar o jogo quando a página carregar
document.addEventListener('DOMContentLoaded', inicializarJogo); 