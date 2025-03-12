// Cores disponíveis
const cores = [
    '#000000', '#FFFFFF', '#FF0000', '#00FF00', '#0000FF', 
    '#FFFF00', '#00FFFF', '#FF00FF', '#FFA500', '#800080',
    '#008000', '#800000', '#008080', '#000080', '#808080',
    '#FFC0CB', '#A52A2A', '#FFD700', '#32CD32', '#1E90FF'
];

// Elementos do DOM
const canvas = document.getElementById('desenho-canvas');
const ctx = canvas.getContext('2d');
const paletaCores = document.querySelector('.paleta-cores');
const corPersonalizada = document.getElementById('cor-personalizada');
const tamanhoPincel = document.getElementById('tamanho-pincel');
const tamanhoValor = document.getElementById('tamanho-valor');
const pincelBtn = document.getElementById('pincel');
const borrachaBtn = document.getElementById('borracha');
const limparBtn = document.getElementById('limpar');
const salvarBtn = document.getElementById('salvar');

// Estado do desenho
let desenhando = false;
let corAtual = '#000000';
let tamanhoAtual = 5;
let ferramenta = 'pincel';
let ultimoX, ultimoY;

// Inicializar o jogo
function inicializarJogo() {
    // Configurar o canvas
    ajustarTamanhoCanvas();
    
    // Criar paleta de cores
    criarPaletaCores();
    
    // Adicionar event listeners
    adicionarEventListeners();
    
    // Atualizar o valor do tamanho do pincel
    tamanhoValor.textContent = `${tamanhoAtual}px`;
}

// Ajustar o tamanho do canvas
function ajustarTamanhoCanvas() {
    const canvasContainer = document.querySelector('.canvas-container');
    const rect = canvasContainer.getBoundingClientRect();
    
    // Salvar o conteúdo atual do canvas
    const tempCanvas = document.createElement('canvas');
    const tempCtx = tempCanvas.getContext('2d');
    tempCanvas.width = canvas.width;
    tempCanvas.height = canvas.height;
    tempCtx.drawImage(canvas, 0, 0);
    
    // Redimensionar o canvas
    canvas.width = rect.width;
    canvas.height = rect.height;
    
    // Restaurar o conteúdo do canvas
    ctx.drawImage(tempCanvas, 0, 0, tempCanvas.width, tempCanvas.height, 0, 0, canvas.width, canvas.height);
    
    // Restaurar as configurações do contexto
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
}

// Criar paleta de cores
function criarPaletaCores() {
    paletaCores.innerHTML = '';
    
    cores.forEach(cor => {
        const corDiv = document.createElement('div');
        corDiv.classList.add('cor');
        corDiv.style.backgroundColor = cor;
        corDiv.dataset.cor = cor;
        
        if (cor === corAtual) {
            corDiv.classList.add('ativa');
        }
        
        corDiv.addEventListener('click', () => {
            // Remover classe ativa de todas as cores
            document.querySelectorAll('.cor').forEach(c => c.classList.remove('ativa'));
            
            // Adicionar classe ativa à cor selecionada
            corDiv.classList.add('ativa');
            
            // Atualizar cor atual
            corAtual = cor;
            corPersonalizada.value = cor;
            
            // Mudar para ferramenta pincel
            mudarFerramenta('pincel');
        });
        
        paletaCores.appendChild(corDiv);
    });
}

// Adicionar event listeners
function adicionarEventListeners() {
    // Event listeners para desenho com mouse
    canvas.addEventListener('mousedown', iniciarDesenho);
    canvas.addEventListener('mousemove', desenhar);
    canvas.addEventListener('mouseup', pararDesenho);
    canvas.addEventListener('mouseout', pararDesenho);
    
    // Event listeners para desenho com toque
    canvas.addEventListener('touchstart', iniciarDesenhoTouch);
    canvas.addEventListener('touchmove', desenharTouch);
    canvas.addEventListener('touchend', pararDesenho);
    
    // Event listeners para controles
    tamanhoPincel.addEventListener('input', () => {
        tamanhoAtual = tamanhoPincel.value;
        tamanhoValor.textContent = `${tamanhoAtual}px`;
    });
    
    corPersonalizada.addEventListener('input', () => {
        corAtual = corPersonalizada.value;
        document.querySelectorAll('.cor').forEach(cor => cor.classList.remove('ativa'));
    });
    
    pincelBtn.addEventListener('click', () => mudarFerramenta('pincel'));
    borrachaBtn.addEventListener('click', () => mudarFerramenta('borracha'));
    limparBtn.addEventListener('click', limparCanvas);
    salvarBtn.addEventListener('click', salvarDesenho);
    
    // Event listener para redimensionar o canvas quando a janela for redimensionada
    window.addEventListener('resize', ajustarTamanhoCanvas);
}

// Obter posição do mouse
function obterPosicaoMouse(e) {
    const rect = canvas.getBoundingClientRect();
    return {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
    };
}

// Iniciar desenho (mouse)
function iniciarDesenho(e) {
    desenhando = true;
    const pos = obterPosicaoMouse(e);
    ultimoX = pos.x;
    ultimoY = pos.y;
    
    // Desenhar um ponto no início
    ctx.beginPath();
    ctx.arc(ultimoX, ultimoY, tamanhoAtual / 2, 0, Math.PI * 2);
    ctx.fillStyle = ferramenta === 'pincel' ? corAtual : '#FFFFFF';
    ctx.fill();
}

// Desenhar (mouse)
function desenhar(e) {
    if (!desenhando) return;
    
    const pos = obterPosicaoMouse(e);
    
    // Configurar o contexto
    ctx.lineWidth = tamanhoAtual;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    
    if (ferramenta === 'pincel') {
        ctx.strokeStyle = corAtual;
    } else if (ferramenta === 'borracha') {
        ctx.strokeStyle = '#FFFFFF';
    }
    
    // Desenhar linha
    ctx.beginPath();
    ctx.moveTo(ultimoX, ultimoY);
    ctx.lineTo(pos.x, pos.y);
    ctx.stroke();
    
    // Atualizar última posição
    ultimoX = pos.x;
    ultimoY = pos.y;
}

// Parar desenho
function pararDesenho() {
    desenhando = false;
}

// Obter posição do toque
function obterPosicaoToque(e) {
    const rect = canvas.getBoundingClientRect();
    const touch = e.touches[0];
    return {
        x: touch.clientX - rect.left,
        y: touch.clientY - rect.top
    };
}

// Iniciar desenho (touch)
function iniciarDesenhoTouch(e) {
    e.preventDefault();
    desenhando = true;
    
    const pos = obterPosicaoToque(e);
    ultimoX = pos.x;
    ultimoY = pos.y;
    
    // Desenhar um ponto no início
    ctx.beginPath();
    ctx.arc(ultimoX, ultimoY, tamanhoAtual / 2, 0, Math.PI * 2);
    ctx.fillStyle = ferramenta === 'pincel' ? corAtual : '#FFFFFF';
    ctx.fill();
}

// Desenhar (touch)
function desenharTouch(e) {
    e.preventDefault();
    if (!desenhando) return;
    
    const pos = obterPosicaoToque(e);
    
    // Configurar o contexto
    ctx.lineWidth = tamanhoAtual;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    
    if (ferramenta === 'pincel') {
        ctx.strokeStyle = corAtual;
    } else if (ferramenta === 'borracha') {
        ctx.strokeStyle = '#FFFFFF';
    }
    
    // Desenhar linha
    ctx.beginPath();
    ctx.moveTo(ultimoX, ultimoY);
    ctx.lineTo(pos.x, pos.y);
    ctx.stroke();
    
    // Atualizar última posição
    ultimoX = pos.x;
    ultimoY = pos.y;
}

// Mudar ferramenta
function mudarFerramenta(novaFerramenta) {
    ferramenta = novaFerramenta;
    
    // Remover classe ativa de todas as ferramentas
    document.querySelectorAll('.ferramenta-btn').forEach(btn => btn.classList.remove('ativa'));
    
    // Adicionar classe ativa à ferramenta selecionada
    if (novaFerramenta === 'pincel') {
        pincelBtn.classList.add('ativa');
    } else if (novaFerramenta === 'borracha') {
        borrachaBtn.classList.add('ativa');
    }
}

// Limpar canvas
function limparCanvas() {
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
}

// Salvar desenho
function salvarDesenho() {
    // Criar link para download
    const link = document.createElement('a');
    link.download = 'meu-desenho.png';
    link.href = canvas.toDataURL('image/png');
    link.click();
}

// Inicializar o jogo quando a página carregar
document.addEventListener('DOMContentLoaded', inicializarJogo); 