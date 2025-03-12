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
const baldeBtn = document.getElementById('balde');
const desfazerBtn = document.getElementById('desfazer');
const limparBtn = document.getElementById('limpar');
const salvarBtn = document.getElementById('salvar');
const transparenciaInput = document.getElementById('transparencia');
const transparenciaValor = document.getElementById('transparencia-valor');
const modoSimplesBtn = document.getElementById('modo-simples');
const modoProBtn = document.getElementById('modo-pro');
const camadasContainer = document.getElementById('camadas-container');
const listaCamadas = document.getElementById('lista-camadas');
const adicionarCamadaBtn = document.getElementById('adicionar-camada');

// Estado do desenho
let desenhando = false;
let corAtual = '#000000';
let tamanhoAtual = 5;
let transparenciaAtual = 100;
let ferramenta = 'pincel';
let ultimoX, ultimoY;
let modoAtual = 'simples';
let camadaAtiva = 0;
let camadas = []; // Array para armazenar informações das camadas
let historico = []; // Array para armazenar histórico para desfazer

// Inicializar o jogo
function inicializarJogo() {
    // Configurar o canvas
    ajustarTamanhoCanvas();
    
    // Criar paleta de cores
    criarPaletaCores();
    
    // Inicializar a primeira camada (modo simples)
    camadas = [{
        id: 0,
        nome: 'Camada 1',
        visivel: true,
        canvas: canvas,
        contexto: ctx
    }];
    
    // Inicializar histórico
    salvarEstadoAtual();
    
    // Adicionar event listeners
    adicionarEventListeners();
    
    // Atualizar o valor do tamanho do pincel
    tamanhoValor.textContent = `${tamanhoAtual}px`;
    
    // Atualizar o valor da transparência
    transparenciaValor.textContent = `${transparenciaAtual}%`;
    
    // Preencher o canvas com branco
    limparCanvas();
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
    
    // Se estiver no modo profissional, ajustar todas as camadas
    if (modoAtual === 'pro') {
        camadas.forEach(camada => {
            if (camada.id !== 0) { // Ignorar a camada principal que já foi ajustada
                const canvasTemp = camada.canvas;
                const ctxTemp = camada.contexto;
                
                // Salvar o conteúdo atual
                const tempCanvasCamada = document.createElement('canvas');
                const tempCtxCamada = tempCanvasCamada.getContext('2d');
                tempCanvasCamada.width = canvasTemp.width;
                tempCanvasCamada.height = canvasTemp.height;
                tempCtxCamada.drawImage(canvasTemp, 0, 0);
                
                // Redimensionar
                canvasTemp.width = rect.width;
                canvasTemp.height = rect.height;
                
                // Restaurar o conteúdo
                ctxTemp.drawImage(tempCanvasCamada, 0, 0, tempCanvasCamada.width, tempCanvasCamada.height, 0, 0, canvasTemp.width, canvasTemp.height);
                
                // Restaurar as configurações do contexto
                ctxTemp.lineCap = 'round';
                ctxTemp.lineJoin = 'round';
            }
        });
    }
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
    
    transparenciaInput.addEventListener('input', () => {
        transparenciaAtual = transparenciaInput.value;
        transparenciaValor.textContent = `${transparenciaAtual}%`;
    });
    
    corPersonalizada.addEventListener('input', () => {
        corAtual = corPersonalizada.value;
        document.querySelectorAll('.cor').forEach(cor => cor.classList.remove('ativa'));
    });
    
    pincelBtn.addEventListener('click', () => mudarFerramenta('pincel'));
    borrachaBtn.addEventListener('click', () => mudarFerramenta('borracha'));
    baldeBtn.addEventListener('click', () => mudarFerramenta('balde'));
    desfazerBtn.addEventListener('click', desfazer);
    limparBtn.addEventListener('click', limparCanvas);
    salvarBtn.addEventListener('click', salvarDesenho);
    
    // Event listeners para modo e camadas
    modoSimplesBtn.addEventListener('click', () => mudarModo('simples'));
    modoProBtn.addEventListener('click', () => mudarModo('pro'));
    adicionarCamadaBtn.addEventListener('click', adicionarCamada);
    
    // Event listener para atalho de teclado (Ctrl+Z)
    document.addEventListener('keydown', (e) => {
        if ((e.ctrlKey || e.metaKey) && e.key === 'z') {
            desfazer();
        }
    });
    
    // Event listener para redimensionar o canvas quando a janela for redimensionada
    window.addEventListener('resize', ajustarTamanhoCanvas);
    
    // Event listeners para camadas
    atualizarEventListenersCamadas();
}

// Atualizar event listeners para camadas
function atualizarEventListenersCamadas() {
    // Obter todos os elementos de camada
    const camadasItems = document.querySelectorAll('.camada-item');
    
    camadasItems.forEach(camadaItem => {
        // Event listener para selecionar a camada
        camadaItem.addEventListener('click', (e) => {
            if (!e.target.closest('.camada-controles')) {
                const camadaId = parseInt(camadaItem.dataset.id);
                selecionarCamada(camadaId);
            }
        });
        
        // Event listener para botão de visibilidade
        const visibilidadeBtn = camadaItem.querySelector('.camada-visibilidade');
        visibilidadeBtn.addEventListener('click', () => {
            const camadaId = parseInt(camadaItem.dataset.id);
            alternarVisibilidadeCamada(camadaId);
        });
        
        // Event listener para botão de excluir
        const excluirBtn = camadaItem.querySelector('.camada-excluir');
        excluirBtn.addEventListener('click', () => {
            const camadaId = parseInt(camadaItem.dataset.id);
            excluirCamada(camadaId);
        });
    });
}

// Obter posição do mouse
function obterPosicaoMouse(e) {
    const rect = getCanvasAtivo().getBoundingClientRect();
    return {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
    };
}

// Iniciar desenho (mouse)
function iniciarDesenho(e) {
    salvarEstadoAtual();
    
    desenhando = true;
    const pos = obterPosicaoMouse(e);
    ultimoX = pos.x;
    ultimoY = pos.y;
    
    if (ferramenta === 'balde') {
        preencherArea(pos.x, pos.y);
    } else {
        // Desenhar um ponto no início
        const ctx = getContextoAtivo();
        ctx.beginPath();
        ctx.globalAlpha = transparenciaAtual / 100;
        ctx.arc(ultimoX, ultimoY, tamanhoAtual / 2, 0, Math.PI * 2);
        ctx.fillStyle = ferramenta === 'pincel' ? corAtual : '#FFFFFF';
        ctx.fill();
    }
}

// Desenhar (mouse)
function desenhar(e) {
    if (!desenhando) return;
    if (ferramenta === 'balde') return;
    
    const pos = obterPosicaoMouse(e);
    
    // Configurar o contexto
    const ctx = getContextoAtivo();
    ctx.lineWidth = tamanhoAtual;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.globalAlpha = transparenciaAtual / 100;
    
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
    const rect = getCanvasAtivo().getBoundingClientRect();
    const touch = e.touches[0];
    return {
        x: touch.clientX - rect.left,
        y: touch.clientY - rect.top
    };
}

// Iniciar desenho (touch)
function iniciarDesenhoTouch(e) {
    e.preventDefault();
    salvarEstadoAtual();
    
    desenhando = true;
    
    const pos = obterPosicaoToque(e);
    ultimoX = pos.x;
    ultimoY = pos.y;
    
    if (ferramenta === 'balde') {
        preencherArea(pos.x, pos.y);
    } else {
        // Desenhar um ponto no início
        const ctx = getContextoAtivo();
        ctx.beginPath();
        ctx.globalAlpha = transparenciaAtual / 100;
        ctx.arc(ultimoX, ultimoY, tamanhoAtual / 2, 0, Math.PI * 2);
        ctx.fillStyle = ferramenta === 'pincel' ? corAtual : '#FFFFFF';
        ctx.fill();
    }
}

// Desenhar (touch)
function desenharTouch(e) {
    e.preventDefault();
    if (!desenhando) return;
    if (ferramenta === 'balde') return;
    
    const pos = obterPosicaoToque(e);
    
    // Configurar o contexto
    const ctx = getContextoAtivo();
    ctx.lineWidth = tamanhoAtual;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.globalAlpha = transparenciaAtual / 100;
    
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
    } else if (novaFerramenta === 'balde') {
        baldeBtn.classList.add('ativa');
    }
    
    // Atualizar cursor
    if (novaFerramenta === 'balde') {
        getCanvasAtivo().style.cursor = 'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'24\' height=\'24\' viewBox=\'0 0 24 24\'%3E%3Cpath d=\'M16 12L10 18H4V12L10 6L16 12Z\' fill=\'%23000\'/%3E%3C/svg%3E") 0 24, auto';
    } else {
        getCanvasAtivo().style.cursor = 'crosshair';
    }
}

// Mudar modo
function mudarModo(novoModo) {
    if (novoModo === modoAtual) return;
    
    modoAtual = novoModo;
    
    // Remover classe ativa de todos os botões de modo
    document.querySelectorAll('.ferramenta-btn').forEach(btn => btn.classList.remove('ativa'));
    
    // Adicionar classe ativa ao modo selecionado
    if (novoModo === 'simples') {
        modoSimplesBtn.classList.add('ativa');
        camadasContainer.style.display = 'none';
        
        // Mesclar todas as camadas no canvas principal
        if (camadas.length > 1) {
            const ctx = camadas[0].contexto;
            ctx.globalAlpha = 1;
            
            // Limpar canvas principal
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.fillStyle = '#FFFFFF';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            
            // Desenhar cada camada visível no canvas principal
            camadas.forEach(camada => {
                if (camada.visivel && camada.id !== 0) {
                    ctx.drawImage(camada.canvas, 0, 0);
                    
                    // Remover o canvas da camada do DOM
                    if (camada.canvas.parentNode) {
                        camada.canvas.parentNode.removeChild(camada.canvas);
                    }
                }
            });
            
            // Resetar array de camadas para conter apenas a camada principal
            camadas = [camadas[0]];
            camadaAtiva = 0;
        }
    } else if (novoModo === 'pro') {
        modoProBtn.classList.add('ativa');
        camadasContainer.style.display = 'block';
        
        // Se só temos a camada principal, já estamos organizados
        atualizarListaCamadas();
    }
    
    // Salvar estado atual para histórico
    salvarEstadoAtual();
}

// Adicionar nova camada
function adicionarCamada() {
    // Criar novo canvas
    const novoCanvas = document.createElement('canvas');
    novoCanvas.className = 'canvas-layer';
    novoCanvas.width = canvas.width;
    novoCanvas.height = canvas.height;
    document.querySelector('.canvas-container').appendChild(novoCanvas);
    
    // Obter contexto
    const novoCtx = novoCanvas.getContext('2d');
    novoCtx.lineCap = 'round';
    novoCtx.lineJoin = 'round';
    
    // Criar ID único para a camada
    const novoId = camadas.length > 0 ? Math.max(...camadas.map(c => c.id)) + 1 : 0;
    
    // Adicionar nova camada ao array de camadas
    const novaCamada = {
        id: novoId,
        nome: `Camada ${novoId + 1}`,
        visivel: true,
        canvas: novoCanvas,
        contexto: novoCtx
    };
    
    camadas.push(novaCamada);
    
    // Atualizar lista de camadas na interface
    atualizarListaCamadas();
    
    // Selecionar a nova camada
    selecionarCamada(novoId);
    
    // Salvar estado atual para histórico
    salvarEstadoAtual();
}

// Selecionar camada
function selecionarCamada(id) {
    camadaAtiva = id;
    
    // Remover classe ativa de todas as camadas na interface
    document.querySelectorAll('.camada-item').forEach(item => item.classList.remove('ativa'));
    
    // Adicionar classe ativa à camada selecionada na interface
    const camadaItem = document.querySelector(`.camada-item[data-id="${id}"]`);
    if (camadaItem) {
        camadaItem.classList.add('ativa');
    }
    
    // Remover classe ativa de todos os canvas
    camadas.forEach(camada => {
        camada.canvas.classList.remove('ativa');
    });
    
    // Adicionar classe ativa ao canvas da camada selecionada
    const camada = camadas.find(c => c.id === id);
    if (camada) {
        camada.canvas.classList.add('ativa');
    }
}

// Alternar visibilidade da camada
function alternarVisibilidadeCamada(id) {
    const camada = camadas.find(c => c.id === id);
    if (!camada) return;
    
    camada.visivel = !camada.visivel;
    
    // Atualizar classe CSS
    const camadaItem = document.querySelector(`.camada-item[data-id="${id}"]`);
    if (camadaItem) {
        if (camada.visivel) {
            camadaItem.classList.remove('camada-invisivel');
            camadaItem.querySelector('.camada-visibilidade i').className = 'fas fa-eye';
        } else {
            camadaItem.classList.add('camada-invisivel');
            camadaItem.querySelector('.camada-visibilidade i').className = 'fas fa-eye-slash';
        }
    }
    
    // Atualizar visibilidade do canvas
    camada.canvas.style.display = camada.visivel ? 'block' : 'none';
    
    // Salvar estado atual para histórico
    salvarEstadoAtual();
}

// Excluir camada
function excluirCamada(id) {
    // Não permitir excluir a camada principal
    if (id === 0) return;
    
    // Não permitir excluir a última camada
    if (camadas.length <= 1) return;
    
    // Remover canvas do DOM
    const camada = camadas.find(c => c.id === id);
    if (camada && camada.canvas.parentNode) {
        camada.canvas.parentNode.removeChild(camada.canvas);
    }
    
    // Remover camada do array
    camadas = camadas.filter(c => c.id !== id);
    
    // Se a camada ativa foi removida, selecionar outra
    if (camadaAtiva === id) {
        camadaAtiva = camadas[0].id;
    }
    
    // Atualizar lista de camadas na interface
    atualizarListaCamadas();
    
    // Selecionar outra camada se necessário
    selecionarCamada(camadaAtiva);
    
    // Salvar estado atual para histórico
    salvarEstadoAtual();
}

// Atualizar lista de camadas na interface
function atualizarListaCamadas() {
    listaCamadas.innerHTML = '';
    
    // Ordenar camadas para que a camada 0 (principal) esteja sempre no topo
    const camadasOrdenadas = [...camadas].sort((a, b) => a.id === 0 ? -1 : b.id === 0 ? 1 : 0);
    
    camadasOrdenadas.forEach(camada => {
        const camadaItem = document.createElement('div');
        camadaItem.className = 'camada-item';
        if (camada.id === camadaAtiva) {
            camadaItem.classList.add('ativa');
        }
        if (!camada.visivel) {
            camadaItem.classList.add('camada-invisivel');
        }
        camadaItem.dataset.id = camada.id;
        
        const camadaNome = document.createElement('span');
        camadaNome.textContent = camada.nome;
        camadaItem.appendChild(camadaNome);
        
        const camadaControles = document.createElement('div');
        camadaControles.className = 'camada-controles';
        
        const visibilidadeBtn = document.createElement('button');
        visibilidadeBtn.className = 'camada-visibilidade';
        visibilidadeBtn.innerHTML = `<i class="fas ${camada.visivel ? 'fa-eye' : 'fa-eye-slash'}"></i>`;
        camadaControles.appendChild(visibilidadeBtn);
        
        // Apenas adicionar botão de excluir se não for a camada principal
        if (camada.id !== 0) {
            const excluirBtn = document.createElement('button');
            excluirBtn.className = 'camada-excluir';
            excluirBtn.innerHTML = '<i class="fas fa-times"></i>';
            camadaControles.appendChild(excluirBtn);
        }
        
        camadaItem.appendChild(camadaControles);
        listaCamadas.appendChild(camadaItem);
    });
    
    // Atualizar event listeners
    atualizarEventListenersCamadas();
}

// Obter canvas ativo
function getCanvasAtivo() {
    const camada = camadas.find(c => c.id === camadaAtiva);
    return camada ? camada.canvas : canvas;
}

// Obter contexto ativo
function getContextoAtivo() {
    const camada = camadas.find(c => c.id === camadaAtiva);
    return camada ? camada.contexto : ctx;
}

// Limpar canvas
function limparCanvas() {
    const contexto = getContextoAtivo();
    const canvasAtual = getCanvasAtivo();
    
    salvarEstadoAtual();
    
    contexto.globalAlpha = 1;
    contexto.fillStyle = '#FFFFFF';
    contexto.fillRect(0, 0, canvasAtual.width, canvasAtual.height);
    
    // Restaurar configurações
    contexto.globalAlpha = transparenciaAtual / 100;
}

// Salvar desenho
function salvarDesenho() {
    // Se estiver no modo profissional, mesclar todas as camadas visíveis
    if (modoAtual === 'pro') {
        // Criar canvas temporário
        const tempCanvas = document.createElement('canvas');
        tempCanvas.width = canvas.width;
        tempCanvas.height = canvas.height;
        const tempCtx = tempCanvas.getContext('2d');
        
        // Preencher com branco
        tempCtx.fillStyle = '#FFFFFF';
        tempCtx.fillRect(0, 0, tempCanvas.width, tempCanvas.height);
        
        // Desenhar cada camada visível
        camadas.forEach(camada => {
            if (camada.visivel) {
                tempCtx.drawImage(camada.canvas, 0, 0);
            }
        });
        
        // Criar link para download do canvas mesclado
        const link = document.createElement('a');
        link.download = 'meu-desenho.png';
        link.href = tempCanvas.toDataURL('image/png');
        link.click();
    } else {
        // Criar link para download
        const link = document.createElement('a');
        link.download = 'meu-desenho.png';
        link.href = canvas.toDataURL('image/png');
        link.click();
    }
}

// Salvar estado atual no histórico
function salvarEstadoAtual() {
    // Limitar o tamanho do histórico para evitar uso excessivo de memória
    if (historico.length > 20) {
        historico = historico.slice(-20);
    }
    
    // Criar um snapshot do estado atual
    const snapshot = {
        camadas: camadas.map(camada => {
            const tempCanvas = document.createElement('canvas');
            tempCanvas.width = camada.canvas.width;
            tempCanvas.height = camada.canvas.height;
            const tempCtx = tempCanvas.getContext('2d');
            tempCtx.drawImage(camada.canvas, 0, 0);
            
            return {
                id: camada.id,
                nome: camada.nome,
                visivel: camada.visivel,
                canvasData: tempCanvas.toDataURL()
            };
        }),
        camadaAtiva: camadaAtiva,
        modoAtual: modoAtual
    };
    
    historico.push(snapshot);
}

// Desfazer última ação
function desfazer() {
    if (historico.length <= 1) return; // Manter pelo menos um estado no histórico
    
    // Remover o estado atual
    historico.pop();
    
    // Obter o último estado
    const ultimoEstado = historico[historico.length - 1];
    
    // Restaurar o modo
    modoAtual = ultimoEstado.modoAtual;
    
    // Atualizar interface de modo
    document.querySelectorAll('#modo-simples, #modo-pro').forEach(btn => btn.classList.remove('ativa'));
    if (modoAtual === 'simples') {
        modoSimplesBtn.classList.add('ativa');
        camadasContainer.style.display = 'none';
    } else {
        modoProBtn.classList.add('ativa');
        camadasContainer.style.display = 'block';
    }
    
    // Limpar camadas existentes
    camadas.forEach(camada => {
        if (camada.canvas.parentNode) {
            camada.canvas.parentNode.removeChild(camada.canvas);
        }
    });
    
    // Reinicializar array de camadas
    camadas = [];
    
    // Restaurar camadas do estado
    ultimoEstado.camadas.forEach(camadaInfo => {
        let canvasElement;
        let contexto;
        
        if (camadaInfo.id === 0) {
            // Usar o canvas principal para a camada 0
            canvasElement = canvas;
            contexto = ctx;
        } else {
            // Criar novo canvas para as outras camadas
            canvasElement = document.createElement('canvas');
            canvasElement.className = 'canvas-layer';
            canvasElement.width = canvas.width;
            canvasElement.height = canvas.height;
            document.querySelector('.canvas-container').appendChild(canvasElement);
            contexto = canvasElement.getContext('2d');
        }
        
        // Criar nova camada
        const camada = {
            id: camadaInfo.id,
            nome: camadaInfo.nome,
            visivel: camadaInfo.visivel,
            canvas: canvasElement,
            contexto: contexto
        };
        
        // Restaurar dados do canvas
        const img = new Image();
        img.onload = function() {
            contexto.clearRect(0, 0, canvasElement.width, canvasElement.height);
            contexto.drawImage(img, 0, 0);
        };
        img.src = camadaInfo.canvasData;
        
        // Configurar visibilidade
        canvasElement.style.display = camadaInfo.visivel ? 'block' : 'none';
        
        camadas.push(camada);
    });
    
    // Restaurar camada ativa
    camadaAtiva = ultimoEstado.camadaAtiva;
    
    // Atualizar interface
    atualizarListaCamadas();
    
    // Selecionar camada ativa
    selecionarCamada(camadaAtiva);
}

// Função de preenchimento (balde)
function preencherArea(x, y) {
    const canvasAtual = getCanvasAtivo();
    const contexto = getContextoAtivo();
    
    // Obter dados da imagem
    const imageData = contexto.getImageData(0, 0, canvasAtual.width, canvasAtual.height);
    const data = imageData.data;
    const width = imageData.width;
    const height = imageData.height;
    
    // Posição do pixel clicado
    const targetPos = (y * width + x) * 4;
    
    // Cor do pixel clicado (R, G, B, A)
    const targetR = data[targetPos];
    const targetG = data[targetPos + 1];
    const targetB = data[targetPos + 2];
    const targetA = data[targetPos + 3];
    
    // Cor para preencher (com transparência)
    const colorR = parseInt(corAtual.slice(1, 3), 16);
    const colorG = parseInt(corAtual.slice(3, 5), 16);
    const colorB = parseInt(corAtual.slice(5, 7), 16);
    const colorA = Math.round(255 * (transparenciaAtual / 100));
    
    // Tolerância (quão semelhante deve ser a cor para ser preenchida)
    const tolerance = 10;
    
    // Verificar se uma cor é semelhante à cor alvo
    function matchColor(r, g, b, a) {
        return (
            Math.abs(r - targetR) <= tolerance &&
            Math.abs(g - targetG) <= tolerance &&
            Math.abs(b - targetB) <= tolerance &&
            Math.abs(a - targetA) <= tolerance
        );
    }
    
    // Array para marcar pixels já visitados
    const visitados = new Array(width * height).fill(false);
    
    // Fila para algoritmo de preenchimento
    const fila = [];
    fila.push([x, y]);
    
    // Algoritmo de preenchimento por inundação (flood fill)
    while (fila.length > 0) {
        const [currentX, currentY] = fila.shift();
        
        // Verificar se está dentro dos limites
        if (
            currentX < 0 || currentX >= width ||
            currentY < 0 || currentY >= height
        ) {
            continue;
        }
        
        // Posição atual
        const pos = (currentY * width + currentX) * 4;
        
        // Verificar se já foi visitado
        if (visitados[currentY * width + currentX]) {
            continue;
        }
        
        // Verificar se a cor é semelhante à cor alvo
        if (!matchColor(data[pos], data[pos + 1], data[pos + 2], data[pos + 3])) {
            continue;
        }
        
        // Marcar como visitado
        visitados[currentY * width + currentX] = true;
        
        // Preencher o pixel
        data[pos] = colorR;
        data[pos + 1] = colorG;
        data[pos + 2] = colorB;
        data[pos + 3] = colorA;
        
        // Adicionar pixels vizinhos à fila
        fila.push([currentX + 1, currentY]);
        fila.push([currentX - 1, currentY]);
        fila.push([currentX, currentY + 1]);
        fila.push([currentX, currentY - 1]);
    }
    
    // Atualizar o canvas
    contexto.putImageData(imageData, 0, 0);
}

// Inicializar o jogo quando a página carregar
document.addEventListener('DOMContentLoaded', inicializarJogo); 