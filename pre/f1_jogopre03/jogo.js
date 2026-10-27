// ============================================================
// 1. ESTADO GLOBAL E SONS
// ============================================================
const JOGO_CONFIG = {
    nomeDoJogo: "Estojo Mágico - Matemática & Cores",
    caminhoSons: DADOS.sons ? DADOS.sons.caminho : "",
    caminhoIconsMenu: "../../icons/"
};

// Paleta oficial de cores associadas aos resultados de 0 a 10
const PALETA_SOMAS = {
    0: { cor: "#FFFFFF", nome: "Branco" },
    1: { cor: "#ff5a5f", nome: "Vermelho" },
    2: { cor: "#ff9f1c", nome: "Laranja" },
    3: { cor: "#ffd166", nome: "Amarelo" },
    4: { cor: "#ff7f00", nome: "Laranja Abóbora" },
    5: { cor: "#06d6a0", nome: "Verde Menta" },
    6: { cor: "#8b00ff", nome: "Roxo Escuro" },
    7: { cor: "#3a86ff", nome: "Azul" },
    8: { cor: "#4361ee", nome: "Azul Escuro" },
    9: { cor: "#7209b7", nome: "Roxo" },
    10: { cor: "#ff007f", nome: "Rosa Choque" }
};

let corAtual = "#ff5a5f";
let resultadoAtualCor = 1;
let ctx = null;
let canvas = null;
let imgDesenho = null;
let historicoCanvas = []; 
let indiceDesenhoAtual = 0;
let timerAnimacaoCapa = null;

function obterListaDesenhos() {
    if (DADOS && DADOS.desenhosParaColorir && DADOS.desenhosParaColorir.length > 0) {
        return DADOS.desenhosParaColorir;
    }
    return [
        { nome: "Desenho 1", arquivo: "desenho5.png" }
    ];
}

const somAcerto = new Audio(DADOS.sons && DADOS.sons.certo ? DADOS.sons.certo : "");
const somClique = new Audio(DADOS.sons && DADOS.sons.clique ? DADOS.sons.clique : "");
const somInstrucao = new Audio("f1_jogo01pre.mp3");


// ============================================================
// 2. CONFIGURAÇÃO VISUAL E ESTILOS
// ============================================================
const styleJogo = document.createElement('style');
styleJogo.innerHTML = `
    .jogo-layout-principal {
        display: flex; flex-direction: row; align-items: stretch; justify-content: space-between;
        width: 100%; height: 100%; flex: 1; gap: 12px; animation: cardPop 0.3s ease; padding: 4px 0;
        box-sizing: border-box; overflow: hidden;
    }
    @keyframes cardPop { 0% { transform: scale(0.7); opacity: 0; } 100% { transform: scale(1); opacity: 1; } }

    .canvas-wrapper {
        background: white; border: 3px solid #E2D3AB; border-radius: 16px;
        box-shadow: 0 4px 15px rgba(0,0,0,0.08); overflow: hidden; touch-action: none;
        flex: 1; height: 100%; display: flex; align-items: center; justify-content: center; position: relative;
        padding: 0; box-sizing: border-box;
    }
    canvas { display: block; cursor: crosshair; width: 100%; height: 100%; object-fit: fill; }

    .painel-estojo-vertical {
        display: flex; flex-direction: column; align-items: center; justify-content: space-between;
        width: 260px; height: 100%; background: rgba(255,255,255,0.95); padding: 8px; border-radius: 16px; 
        border: 2px solid #E2D3AB; flex-shrink: 0; gap: 6px; box-sizing: border-box; overflow-y: auto;
    }

    .seccao-cores {
        display: flex; flex-direction: column; align-items: center; width: 100%; gap: 4px;
        background: #FFF7E3; padding: 6px; border-radius: 12px; border: 1.5px solid #F3E0B5; box-sizing: border-box;
    }
    .grid-cores {
        display: grid; grid-template-columns: repeat(3, 1fr); gap: 6px; width: 100%; justify-items: center;
    }
    
    .lapis-soma-btn {
        display: flex; align-items: center; gap: 6px; background: white; border: 2px solid #ccc;
        padding: 4px 8px; border-radius: 10px; cursor: pointer; width: 100%; font-weight: 900; font-size: 0.8rem;
        transition: transform 0.1s; box-shadow: 0 2px 4px rgba(0,0,0,0.05);
    }
    .lapis-soma-btn:active, .lapis-soma-btn.ativo { transform: scale(1.05); border-color: #262638; background: #fff9e6; }
    .cor-bola { width: 18px; height: 18px; border-radius: 50%; border: 1.5px solid white; flex-shrink: 0; }

    .seccao-ferramentas {
        display: flex; flex-direction: column; align-items: center; width: 100%; gap: 8px; flex: 1; justify-content: center;
    }
    .linha-ferramentas {
        display: flex; align-items: center; justify-content: center; gap: 8px; width: 100%;
    }

    .btn-ferramenta-img {
        background: white; border: 2px solid #ECA607; width: 34px; height: 34px;
        border-radius: 10px; cursor: pointer; display: flex; align-items: center; justify-content: center;
        box-shadow: 0 3px 8px rgba(0,0,0,0.08); transition: transform 0.1s; padding: 3px;
    }
    .btn-ferramenta-img:active { transform: scale(0.92); }
    .btn-ferramenta-img img { width: 100%; height: 100%; object-fit: contain; pointer-events: none; }

    .btn-ferramenta-texto {
        background: #ECA607; color: white; border: none; padding: 8px 12px; width: 100%;
        border-radius: 12px; font-weight: 900; font-size: 0.85rem; cursor: pointer;
        box-shadow: 0 3px 8px rgba(236,166,7,0.3); transition: transform 0.1s; text-align: center;
    }
    .btn-ferramenta-texto:active { transform: scale(0.95); }

    .moldura-selecao-desenho {
        display: flex; align-items: center; justify-content: space-between; width: 100%; height: 100px;
        background: white; border: 2.5px solid #ECA607; border-radius: 14px; padding: 6px;
        box-shadow: 0 4px 10px rgba(0,0,0,0.08); gap: 6px; box-sizing: border-box;
    }
    .seta-desenho-btn {
        background: #ECA607; color: white; border: none; width: 30px; height: 30px;
        border-radius: 50%; font-size: 0.85rem; font-weight: 900; cursor: pointer;
        display: flex; align-items: center; justify-content: center; box-shadow: 0 2px 5px rgba(0,0,0,0.15);
        transition: transform 0.1s; flex-shrink: 0;
    }
    .seta-desenho-btn:active { transform: scale(0.9); }
    .visor-desenho {
        display: flex; align-items: center; justify-content: center; flex: 1; height: 100%; overflow: hidden;
    }
    .visor-desenho img { width: 100%; height: 85px; object-fit: contain; pointer-events: none; }

    .capa-container {
        display: flex; flex-direction: column; align-items: center; justify-content: center;
        flex: 1; width: 100%; height: 100%; gap: 14px; text-align: center;
    }
    .animacao-capa-area {
        position: relative; width: 260px; height: 195px; background: white;
        border: 3px solid #ECA607; border-radius: 18px; overflow: hidden;
        box-shadow: 0 8px 20px rgba(236,166,7,0.25); display: flex; align-items: center; justify-content: center;
        cursor: pointer;
    }

    .btn-capa-som {
        width: 44px; height: 44px; background: rgba(255,255,255,0.4); border: 2px solid rgba(255,255,255,0.8);
        border-radius: 50%; display: flex; align-items: center; justify-content: center; cursor: pointer;
        transition: transform 0.1s; box-shadow: 0 3px 8px rgba(0,0,0,0.1);
    }
    .btn-capa-som:active { transform: scale(0.92); }
    .btn-capa-som img { width: 24px; height: 24px; object-fit: contain; }

    .btn-capa-jogar {
        background: white; color: #C2890B; border: none;
        padding: 10px 32px; border-radius: 22px; font-weight: 900; font-size: 1.1rem;
        cursor: pointer; box-shadow: 0 4px 12px rgba(0,0,0,0.15); transition: transform 0.1s;
        text-transform: uppercase;
    }
    .btn-capa-jogar:active { transform: scale(0.95); }

    #round-feedback { 
        position: absolute; top: 0; left: 0; width: 100%; height: 100%; 
        background: rgba(255, 255, 255, 0.95); backdrop-filter: blur(6px); 
        z-index: 1000; display: none; flex-direction: column; align-items: center; justify-content: center; 
        border-radius: 35px; overflow: hidden;
    }
    
    .feedback-bottom-bar {
        position: absolute; bottom: 20px; left: 24px; right: 24px; height: 14px;
        background: #ECA607; border-radius: 7px;
    }

    .vitoria-card { background: transparent; padding: 10px 20px; text-align: center; display: flex; flex-direction: column; align-items: center; gap: 12px; animation: cardPop 0.4s cubic-bezier(0.17, 0.89, 0.32, 1.28); margin-bottom: 25px; width: 100%; max-width: 480px; }
    
    .btn-final-roxo {
        background: #ECA607; color: white; border: none; padding: 12px 20px;
        border-radius: 25px; font-weight: 900; font-size: 0.95rem; cursor: pointer;
        box-shadow: 0 6px 15px rgba(236,166,7,0.3); text-transform: capitalize; transition: transform 0.1s;
        white-space: nowrap; flex: 1; text-align: center;
    }
    .btn-final-roxo:active { transform: scale(0.95); }

    .btn-final-branco {
        background: white; color: #C2890B; border: 2px solid #ECA607; padding: 12px 20px;
        border-radius: 25px; font-weight: 900; font-size: 0.95rem; cursor: pointer;
        box-shadow: 0 6px 15px rgba(0,0,0,0.08); text-transform: capitalize; transition: transform 0.1s;
        white-space: nowrap; flex: 1; text-align: center;
    }
    .btn-final-branco:active { transform: scale(0.95); }

    @media (max-height: 550px) or (max-width: 850px) and (orientation: landscape) {
        .jogo-layout-principal { gap: 6px; padding: 2px 0; }
        .painel-estojo-vertical { width: 220px; padding: 4px; gap: 4px; }
        .lapis-soma-btn { font-size: 0.7rem; padding: 2px 4px; }
        .cor-bola { width: 14px; height: 14px; }
        .moldura-selecao-desenho { height: 70px; padding: 4px; }
        .visor-desenho img { height: 50px; }
        .btn-ferramenta-texto { padding: 5px 8px; font-size: 0.75rem; }
    }
`;
document.head.appendChild(styleJogo);


// ============================================================
// 3. CAPA COM ANIMAÇÃO
// ============================================================
function mostrarCapa() {
    clearTimeout(timerAnimacaoCapa);

    if(!document.getElementById('round-feedback')) {
        const feedback = document.createElement('div');
        feedback.id = 'round-feedback';
        const parentBtn = document.querySelector('.botao-ano');
        if (parentBtn) parentBtn.appendChild(feedback);
    }

    const area = document.getElementById('contentor-jogo');
    if (area) {
        area.innerHTML = `
            <div class="capa-container">
                <div style="font-size: 1.4rem; font-weight: 900; color: #C2890B; text-transform: uppercase;">Estojo Mágico - Matemática & Cores</div>
                
                <div class="animacao-capa-area" onclick="tocarSomInstrucao()" title="Clica para ouvir!">
                    <canvas id="capaCanvas" width="260" height="195"></canvas>
                    <div id="capaMao" style="position:absolute; font-size:2.2rem; pointer-events:none; transition: all 0.2s ease;">🎃</div>
                </div>
            </div>
        `;
    }

    const barra = document.getElementById('barra-inferior');
    if (barra) {
        barra.style.display = 'flex';
        barra.className = "barra-jogo-topo";
        barra.innerHTML = `
            <div class="btn-capa-som" onclick="tocarSomInstrucao()"><img src="${DADOS.icons.som}" alt="Som"></div>
            <button class="btn-capa-jogar" onclick="iniciarJogoDesenho()">JOGAR</button>
        `;
    }

    setTimeout(iniciarAnimacaoCapaRealista, 100);
}

function iniciarAnimacaoCapaRealista() {
    const cCanvas = document.getElementById('capaCanvas');
    const cMao = document.getElementById('capaMao');
    if (!cCanvas || !cMao) return;
    const cCtx = cCanvas.getContext('2d', { willReadFrequently: true });

    cCtx.fillStyle = "#FFFFFF";
    cCtx.fillRect(0, 0, cCanvas.width, cCanvas.height);

    cCtx.font = "bold 16px Arial";
    cCtx.fillStyle = "#262638";
    cCtx.fillText("1 + 5", 110, 80);
    cCtx.fillText("2 + 6", 110, 130);
}

function tocarSomInstrucao() {
    if (somClique.src) somClique.play().catch(()=>{});
    somInstrucao.currentTime = 0;
    somInstrucao.play().catch(()=>{});
}


// ============================================================
// 4. ECRÃ DE JOGO DE MATEMÁTICA & COLORIR
// ============================================================
function iniciarJogoDesenho() {
    clearTimeout(timerAnimacaoCapa);
    if (somClique.src) somClique.play().catch(()=>{});

    const area = document.getElementById('contentor-jogo');
    const feedbackEl = document.getElementById('round-feedback');
    if (feedbackEl) feedbackEl.style.display = 'none';

    if (area) {
        area.innerHTML = `
            <div class="jogo-layout-principal">
                <!-- Esquerda: Desenho com Somas -->
                <div class="canvas-wrapper" id="canvasWrapper">
                    <canvas id="paintCanvas"></canvas>
                </div>

                <!-- Direita: Paleta Numérica (0 a 10) -->
                <div class="painel-estojo-vertical">
                    <div class="seccao-cores">
                        <span style="font-size:0.65rem; font-weight:900; color:#C2890B; text-transform:uppercase;">Escolhe o Resultado</span>
                        <div class="grid-cores">
                            <div class="lapis-soma-btn ativo" onclick="mudarCorPorResultado(1, this)"><div class="cor-bola" style="background:#ff5a5f;"></div><span>1</span></div>
                            <div class="lapis-soma-btn" onclick="mudarCorPorResultado(2, this)"><div class="cor-bola" style="background:#ff9f1c;"></div><span>2</span></div>
                            <div class="lapis-soma-btn" onclick="mudarCorPorResultado(3, this)"><div class="cor-bola" style="background:#ffd166;"></div><span>3</span></div>
                            <div class="lapis-soma-btn" onclick="mudarCorPorResultado(4, this)"><div class="cor-bola" style="background:#ff7f00;"></div><span>4</span></div>
                            <div class="lapis-soma-btn" onclick="mudarCorPorResultado(5, this)"><div class="cor-bola" style="background:#06d6a0;"></div><span>5</span></div>
                            <div class="lapis-soma-btn" onclick="mudarCorPorResultado(6, this)"><div class="cor-bola" style="background:#8b00ff;"></div><span>6</span></div>
                            <div class="lapis-soma-btn" onclick="mudarCorPorResultado(7, this)"><div class="cor-bola" style="background:#3a86ff;"></div><span>7</span></div>
                            <div class="lapis-soma-btn" onclick="mudarCorPorResultado(8, this)"><div class="cor-bola" style="background:#4361ee;"></div><span>8</span></div>
                            <div class="lapis-soma-btn" onclick="mudarCorPorResultado(9, this)"><div class="cor-bola" style="background:#7209b7;"></div><span>9</span></div>
                            <div class="lapis-soma-btn" onclick="mudarCorPorResultado(10, this)"><div class="cor-bola" style="background:#ff007f;"></div><span>10</span></div>
                            <div class="lapis-soma-btn" onclick="mudarCorPorResultado(0, this)"><div class="cor-bola" style="background:#FFFFFF; border:1px solid #ccc;"></div><span>0</span></div>
                        </div>
                    </div>

                    <div class="seccao-ferramentas">
                        <div class="linha-ferramentas">
                            <div class="btn-ferramenta-img" id="btnAnular" onclick="anularUltimaAcao()" title="Anular">
                                <img src="../../icons/anular.png" alt="Anular">
                            </div>
                        </div>

                        <div class="moldura-selecao-desenho">
                            <button class="seta-desenho-btn" onclick="mudarDesenhoJogo(-1)">❮</button>
                            <div class="visor-desenho" id="visorDesenhoJogo"></div>
                            <button class="seta-desenho-btn" onclick="mudarDesenhoJogo(1)">❯</button>
                        </div>

                        <button class="btn-ferramenta-texto" onclick="concluirDesenho()"><i class="fas fa-check"></i> Pronto!</button>
                    </div>
                </div>
            </div>
        `;
    }

    const barra = document.getElementById('barra-inferior');
    if (barra) {
        barra.style.display = 'flex';
        barra.innerHTML = `
            <div style="color:white; font-weight:800; font-size:0.85rem;">🎃 Resolve a soma e pinta com a cor correspondente!</div>
            <button class="btn-ferramenta-texto" onclick="mostrarCapa()" style="padding:4px 10px; font-size:0.75rem; width:auto;">Voltar</button>
        `;
    }

    atualizarVisorJogo();
    configurarCanvas();
}

function atualizarVisorJogo() {
    const visor = document.getElementById('visorDesenhoJogo');
    if (!visor) return;
    const lista = obterListaDesenhos();
    const atual = lista[indiceDesenhoAtual] || { arquivo: "" };
    visor.innerHTML = `<img src="${atual.arquivo}" alt="Desenho">`;
}

function mudarDesenhoJogo(direcao) {
    if (somClique.src) somClique.play().catch(()=>{});
    const lista = obterListaDesenhos();
    if (lista.length === 0) return;

    indiceDesenhoAtual += direcao;
    if (indiceDesenhoAtual < 0) indiceDesenhoAtual = lista.length - 1;
    if (indiceDesenhoAtual >= lista.length) indiceDesenhoAtual = 0;

    atualizarVisorJogo();
    configurarCanvas();
}


// ============================================================
// 5. CONFIGURAÇÃO DO CANVAS E SOMAS POSICIONADAS NA ABÓBORA
// ============================================================
function configurarCanvas() {
    canvas = document.getElementById('paintCanvas');
    const wrapper = document.getElementById('canvasWrapper');
    if (!canvas || !wrapper) return;

    canvas.width = 1000;
    canvas.height = 800;
    ctx = canvas.getContext('2d', { willReadFrequently: true });
    historicoCanvas = [];

    const lista = obterListaDesenhos();
    const atual = lista[indiceDesenhoAtual];

    if (atual && atual.arquivo) {
        imgDesenho = new Image();
        imgDesenho.crossOrigin = "anonymous";
        imgDesenho.onload = () => {
            desenharCenarioComSomas();
            salvarEstadoHistorico();
        };
        imgDesenho.src = atual.arquivo;
    } else {
        ctx.fillStyle = "#FFFFFF";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        salvarEstadoHistorico();
    }

    const getPos = (e) => {
        const rect = canvas.getBoundingClientRect();
        const clientX = e.touches ? e.touches[0].clientX : e.clientX;
        const clientY = e.touches ? e.touches[0].clientY : e.clientY;
        
        const scaleX = canvas.width / rect.width;
        const scaleY = canvas.height / rect.height;

        return { 
            x: Math.floor((clientX - rect.left) * scaleX), 
            y: Math.floor((clientY - rect.top) * scaleY) 
        };
    };

    const lidarComClique = (e) => {
        const pos = getPos(e);
        preencherAreaComCor(pos.x, pos.y);
        e.preventDefault();
    };

    canvas.onmousedown = lidarComClique;
    canvas.ontouchstart = lidarComClique;
}

function desenharCenarioComSomas() {
    if (!ctx || !imgDesenho) return;
    ctx.fillStyle = "#FFFFFF";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(imgDesenho, 0, 0, canvas.width, canvas.height);

    // Coordenadas calculadas especificamente para as zonas do desenho da abóbora (desenho5.png)
    ctx.font = "bold 22px Arial";
    ctx.fillStyle = "#262638";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";

    const somasExemplo = [
        { texto: "1+5", x: 505, y: 200 },  // Chapéu superior
        { texto: "2+6", x: 505, y: 440 },  // Aba do chapéu
        { texto: "1+3", x: 235, y: 600 },  // Gomo esquerdo da abóbora
        { texto: "1+1", x: 375, y: 395 },  // Olho esquerdo
        { texto: "2+2", x: 505, y: 380 },  // Testa / Centro superior
        { texto: "1+1", x: 635, y: 395 },  // Olho direito
        { texto: "4+0", x: 775, y: 600 },  // Gomo direito da abóbora
        { texto: "2+1", x: 565, y: 690 }   // Boca inferior
    ];

    somasExemplo.forEach(s => {
        ctx.fillText(s.texto, s.x, s.y);
    });
}

function salvarEstadoHistorico() {
    if (!canvas || !ctx) return;
    if (historicoCanvas.length >= 10) historicoCanvas.shift();
    historicoCanvas.push(ctx.getImageData(0, 0, canvas.width, canvas.height));
}

function anularUltimaAcao() {
    if (somClique.src) somClique.play().catch(()=>{});
    if (historicoCanvas.length > 1) {
        historicoCanvas.pop();
        const estadoAnterior = historicoCanvas[historicoCanvas.length - 1];
        ctx.putImageData(estadoAnterior, 0, 0);
    }
}

function mudarCorPorResultado(resultado, el) {
    if (somClique.src) somClique.play().catch(()=>{});
    resultadoAtualCor = resultado;
    corAtual = PALETA_SOMAS[resultado].cor;
    
    document.querySelectorAll('.lapis-soma-btn').forEach(b => b.classList.remove('ativo'));
    if (el) el.classList.add('ativo');
}


// ============================================================
// 6. PREENCHIMENTO INTELIGENTE (FLOOD FILL)
// ============================================================
function hexToRgba(hex) {
    let c = hex.replace('#', '');
    if (c.length === 3) c = c.split('').map(x => x + x).join('');
    const num = parseInt(c, 16);
    return [(num >> 16) & 255, (num >> 8) & 255, num & 255, 255];
}

function preencherAreaComCor(startX, startY) {
    if (!ctx || !canvas) return;
    if (somClique.src) somClique.play().catch(()=>{});

    const width = canvas.width;
    const height = canvas.height;
    if (startX < 0 || startX >= width || startY < 0 || startY >= height) return;

    const imgData = ctx.getImageData(0, 0, width, height);
    const data = imgData.data;

    const fillColor = hexToRgba(corAtual);
    const pos = (startY * width + startX) * 4;
    const targetColor = [data[pos], data[pos + 1], data[pos + 2], data[pos + 3]];

    function colorMatch(idx) {
        const r = data[idx], g = data[idx + 1], b = data[idx + 2];
        if (r < 70 && g < 70 && b < 70) return false; // Não pinta as linhas pretas do desenho
        const diff = Math.abs(r - targetColor[0]) + Math.abs(g - targetColor[1]) + Math.abs(b - targetColor[2]);
        return diff < 75;
    }

    const pixelStack = [[startX, startY]];
    while (pixelStack.length > 0) {
        const [x, yCoord] = pixelStack.pop();
        let y = yCoord;
        let pixelPos = (y * width + x) * 4;

        while (y >= 0 && colorMatch(pixelPos)) {
            y--;
            pixelPos -= width * 4;
        }
        pixelPos += width * 4;
        y++;

        let reachLeft = false, reachRight = false;
        while (y < height && colorMatch(pixelPos)) {
            data[pixelPos] = fillColor[0];
            data[pixelPos + 1] = fillColor[1];
            data[pixelPos + 2] = fillColor[2];
            data[pixelPos + 3] = fillColor[3];

            if (x > 0) {
                if (colorMatch(pixelPos - 4)) {
                    if (!reachLeft) { pixelStack.push([x - 1, y]); reachLeft = true; }
                } else if (reachLeft) { reachLeft = false; }
            }
            if (x < width - 1) {
                if (colorMatch(pixelPos + 4)) {
                    if (!reachRight) { pixelStack.push([x + 1, y]); reachRight = true; }
                } else if (reachRight) { reachRight = false; }
            }
            y++;
            pixelPos += width * 4;
        }
    }

    ctx.putImageData(imgData, 0, 0);
    salvarEstadoHistorico();
}

function concluirDesenho() {
    if (somAcerto.src) somAcerto.play().catch(()=>{});
    const overlay = document.getElementById('round-feedback');
    const iconeFeedback = DADOS.icons.feedbacks.feedback1;

    if (overlay) {
        overlay.style.display = 'flex';
        overlay.innerHTML = `
            <div class="vitoria-card">
                <img src="${iconeFeedback}" style="width:120px; height:120px; object-fit:contain;">
                <h1 style="color:#C2890B; font-size:1.5rem; font-weight:900; margin:0; text-transform:uppercase;">EXCELENTE TRABALHO!</h1>
                <p style="color:#555; font-weight:800; margin:0; font-size:0.85rem;">Resolveste as somas e criaste uma obra de arte!</p>
                <div style="display:flex; justify-content:center; gap:12px; margin-top:8px; width:100%; max-width:420px;">
                    <button class="btn-final-roxo" onclick="mostrarCapa()">Escolher Outro</button>
                    <button class="btn-final-branco" onclick="window.history.back()">Outro Jogo</button>
                </div>
            </div>
            <div class="feedback-bottom-bar"></div>`;
    }
    const barra = document.getElementById('barra-inferior');
    if (barra) barra.style.display = "none";
}

// Iniciar aplicação
mostrarCapa();
