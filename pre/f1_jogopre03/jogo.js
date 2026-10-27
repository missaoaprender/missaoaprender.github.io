// ============================================================
// 1. ESTADO GLOBAL E SONS
// ============================================================
const JOGO_CONFIG = {
    nomeDoJogo: "Estojo Mágico",
    caminhoSons: DADOS.sons ? DADOS.sons.caminho : "",
    caminhoIconsMenu: "../../icons/"
};

let corAtual = "#ECA607";
let ferramentaAtual = "lapis"; 
let tamanhoPincel = 10;
let isDrawing = false;
let ctx = null;
let canvas = null;
let historicoCanvas = []; 

const somAcerto = new Audio(DADOS.sons && DADOS.sons.certo ? DADOS.sons.certo : "");
const somClique = new Audio(DADOS.sons && DADOS.sons.clique ? DADOS.sons.clique : "");
const somInstrucao = new Audio("f1_jogo01pre.mp3");


// ============================================================
// 2. CONFIGURAÇÃO VISUAL (DESIGN PREMIUM)
// ============================================================
const style = document.createElement('style');
style.innerHTML = `
    .desenho-container {
        display: flex; flex-direction: column; align-items: center; justify-content: space-between;
        width: 100%; height: 100%; flex: 1; gap: 8px; animation: cardPop 0.3s ease; padding: 2px 0;
    }
    @keyframes cardPop { 0% { transform: scale(0.7); opacity: 0; } 100% { transform: scale(1); opacity: 1; } }

    .canvas-wrapper {
        background: white; border: 3px solid #E2D3AB; border-radius: 16px;
        box-shadow: 0 4px 15px rgba(0,0,0,0.08); overflow: hidden; touch-action: none;
        flex: 1; width: 100%; display: flex; align-items: center; justify-content: center; min-height: 0;
    }
    canvas { display: block; cursor: crosshair; width: 100%; height: 100%; }

    .painel-estojo {
        display: flex; flex-direction: column; align-items: center; gap: 6px; width: 100%; background: rgba(255,255,255,0.85); padding: 8px 12px; border-radius: 16px; border: 2px solid #E2D3AB; flex-shrink: 0;
    }

    .linha-lapis {
        display: flex; align-items: center; justify-content: center; gap: 8px; flex-wrap: wrap; width: 100%;
    }
    
    .lapis-btn {
        width: 36px; height: 36px; border-radius: 50%; border: 3px solid white; cursor: pointer;
        box-shadow: 0 3px 6px rgba(0,0,0,0.15); transition: transform 0.1s;
    }
    .lapis-btn:active, .lapis-btn.ativo { transform: scale(1.15); border-color: #262638; }

    .grossura-btn {
        background: white; color: #C2890B; border: 2px solid #ECA607; width: 32px; height: 32px;
        border-radius: 50%; font-weight: 900; font-size: 0.8rem; cursor: pointer; display: flex; align-items: center; justify-content: center;
        box-shadow: 0 2px 5px rgba(0,0,0,0.08); transition: transform 0.1s;
    }
    .grossura-btn.ativo { background: #ECA607; color: white; transform: scale(1.1); }

    .btn-ferramenta-img {
        background: white; border: 2px solid #ECA607; width: 40px; height: 40px;
        border-radius: 12px; cursor: pointer; display: flex; align-items: center; justify-content: center;
        box-shadow: 0 3px 8px rgba(0,0,0,0.08); transition: transform 0.1s; padding: 4px;
    }
    .btn-ferramenta-img:active { transform: scale(0.92); }
    .btn-ferramenta-img.ativo { background: #ECA607; border-color: #262638; transform: scale(1.08); }
    .btn-ferramenta-img img { width: 100%; height: 100%; object-fit: contain; pointer-events: none; }

    .btn-ferramenta-texto {
        background: white; color: #C2890B; border: 2px solid #ECA607; padding: 6px 14px;
        border-radius: 14px; font-weight: 900; font-size: 0.85rem; cursor: pointer;
        box-shadow: 0 3px 8px rgba(0,0,0,0.08); transition: transform 0.1s; display: flex; align-items: center; gap: 5px;
    }
    .btn-ferramenta-texto:active { transform: scale(0.95); }
    .btn-ferramenta-texto.destaque { background: #ECA607; color: white; }

    .btn-capa-som {
        width: 44px; height: 44px; background: rgba(255,255,255,0.4); border: 2px solid rgba(255,255,255,0.8);
        border-radius: 50%; display: flex; align-items: center; justify-content: center; cursor: pointer;
        transition: transform 0.1s; box-shadow: 0 3px 8px rgba(0,0,0,0.1);
    }
    .btn-capa-som:active { transform: scale(0.92); }
    .btn-capa-som img { width: 24px; height: 24px; object-fit: contain; }

    .btn-capa-jogar {
        background: white; color: #C2890B; border: none;
        padding: 8px 26px; border-radius: 18px; font-weight: 900; font-size: 1rem;
        cursor: pointer; box-shadow: 0 4px 10px rgba(0,0,0,0.15); transition: transform 0.1s;
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
        background: #ECA607; color: white; border: none; padding: 14px 20px;
        border-radius: 25px; font-weight: 900; font-size: 1rem; cursor: pointer;
        box-shadow: 0 6px 15px rgba(236,166,7,0.3); text-transform: capitalize; transition: transform 0.1s;
        white-space: nowrap; flex: 1; text-align: center;
    }
    .btn-final-roxo:active { transform: scale(0.95); }

    .btn-final-branco {
        background: white; color: #C2890B; border: 2px solid #ECA607; padding: 14px 20px;
        border-radius: 25px; font-weight: 900; font-size: 1rem; cursor: pointer;
        box-shadow: 0 6px 15px rgba(0,0,0,0.08); text-transform: capitalize; transition: transform 0.1s;
        white-space: nowrap; flex: 1; text-align: center;
    }
    .btn-final-branco:active { transform: scale(0.95); }
`;
document.head.appendChild(style);


// ============================================================
// 3. CAPA E REPRODUÇÃO DE SOM (Barrita em cima, botões em baixo)
// ============================================================
function mostrarCapa() {
    if(!document.getElementById('round-feedback')) {
        const feedback = document.createElement('div');
        feedback.id = 'round-feedback';
        document.querySelector('.botao-ano').appendChild(feedback);
    }

    const slotTopo = document.getElementById('slot-topo');
    const slotFundo = document.getElementById('slot-fundo');

    if (slotTopo) {
        slotTopo.className = "barrita-fundo-cartao";
        slotTopo.innerHTML = "";
    }

    const area = document.getElementById('contentor-jogo');
    if (area) {
        area.innerHTML = `
            <div style="font-size: 1.4rem; font-weight: 900; color: #C2890B; margin-bottom: 8px; text-transform: uppercase;">Estojo de Desenho Mágico</div>
            <div style="background: rgba(236,166,7,0.15); width: 110px; height: 110px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 3.2rem; margin-bottom: 10px; box-shadow: 0 8px 20px rgba(236,166,7,0.2);">✏️✨</div>
        `;
    }

    if (slotFundo) {
        slotFundo.className = "barra-jogo-topo";
        slotFundo.innerHTML = `
            <div class="btn-capa-som" onclick="tocarSomInstrucao()"><img src="${DADOS.icons.som}" alt="Som"></div>
            <button class="btn-capa-jogar" onclick="iniciarJogoDesenho()">COMEÇAR</button>
        `;
    }
}

function tocarSomInstrucao() {
    if (somClique.src) somClique.play().catch(()=>{});
    somInstrucao.currentTime = 0;
    somInstrucao.play().catch(()=>{});
}


// ============================================================
// 4. LÓGICA DO ESTOJO MÁGICO (Ícone som à esquerda, menu à direita)
// ============================================================
function iniciarJogoDesenho() {
    if (somClique.src) somClique.play().catch(()=>{});
    
    const slotTopo = document.getElementById('slot-topo');
    const slotFundo = document.getElementById('slot-fundo');
    const area = document.getElementById('contentor-jogo');
    const feedbackEl = document.getElementById('round-feedback');
    if (feedbackEl) feedbackEl.style.display = 'none';

    if (slotTopo) {
        slotTopo.className = "barra-jogo-topo";
        slotTopo.innerHTML = `
            <div class="btn-capa-som" style="width:36px; height:36px;" onclick="tocarSomInstrucao()"><img src="${DADOS.icons.som}" alt="Som" style="width:18px; height:18px;"></div>
            <button class="btn-ferramenta-texto" onclick="mostrarCapa()" style="padding:4px 10px; font-size:0.75rem;">Menu</button>
        `;
    }

    if (area) {
        area.innerHTML = `
            <div class="desenho-container">
                <div class="canvas-wrapper" id="canvasWrapper">
                    <canvas id="paintCanvas"></canvas>
                </div>
                <div class="painel-estojo">
                    <div class="linha-lapis">
                        <div class="lapis-btn ativo" style="background:#ECA607;" onclick="mudarCor('#ECA607', this)"></div>
                        <div class="lapis-btn" style="background:#ff5a5f;" onclick="mudarCor('#ff5a5f', this)"></div>
                        <div class="lapis-btn" style="background:#8cc63f;" onclick="mudarCor('#8cc63f', this)"></div>
                        <div class="lapis-btn" style="background:#3a86ff;" onclick="mudarCor('#3a86ff', this)"></div>
                        <div class="lapis-btn" style="background:#9b5de5;" onclick="mudarCor('#9b5de5', this)"></div>
                        <div class="lapis-btn" style="background:#ff007f;" onclick="mudarCor('#ff007f', this)"></div>
                        <div class="lapis-btn" style="background:#00f5d4;" onclick="mudarCor('#00f5d4', this)"></div>
                        <div class="lapis-btn" style="background:#262638;" onclick="mudarCor('#262638', this)"></div>
                    </div>
                    <div class="linha-lapis">
                        <span style="font-size:0.8rem; font-weight:800; color:#555;">Traço:</span>
                        <button class="grossura-btn" onclick="mudarGrossura(4, this)">F</button>
                        <button class="grossura-btn ativo" onclick="mudarGrossura(10, this)">M</button>
                        <button class="grossura-btn" onclick="mudarGrossura(18, this)">G</button>
                        
                        <div class="btn-ferramenta-img" id="btnBorracha" onclick="ativarBorracha(this)" title="Borracha">
                            <img src="../../icons/borracha.png" alt="Borracha">
                        </div>
                        <div class="btn-ferramenta-img" id="btnBalde" onclick="ativarBalde(this)" title="Balde de Tinta">
                            <img src="../../icons/balde_tinta.png" alt="Balde de Tinta">
                        </div>
                        <div class="btn-ferramenta-img" id="btnAnular" onclick="anularUltimaAcao()" title="Anular">
                            <img src="../../icons/anular.png" alt="Anular">
                        </div>
                        <button class="btn-ferramenta-texto destaque" onclick="concluirDesenho()"><i class="fas fa-check"></i> Pronto!</button>
                    </div>
                </div>
            </div>
        `;
    }

    if (slotFundo) {
        slotFundo.className = "barrita-fundo-cartao";
        slotFundo.innerHTML = "";
    }

    configurarCanvas();
}

function configurarCanvas() {
    canvas = document.getElementById('paintCanvas');
    const wrapper = document.getElementById('canvasWrapper');
    if (!canvas || !wrapper) return;

    const tempCanvas = document.createElement('canvas');
    tempCanvas.width = canvas.width || wrapper.clientWidth;
    tempCanvas.height = canvas.height || wrapper.clientHeight;
    const tempCtx = tempCanvas.getContext('2d');
    if (ctx) {
        tempCtx.drawImage(canvas, 0, 0);
    }

    canvas.width = wrapper.clientWidth;
    canvas.height = wrapper.clientHeight;

    ctx = canvas.getContext('2d');
    if (ctx && canvas.width > 0 && tempCanvas.width > 0) {
        ctx.drawImage(tempCanvas, 0, 0);
    } else if (ctx) {
        ctx.fillStyle = "#FFFFFF";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
    }

    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.lineWidth = tamanhoPincel;
    ctx.strokeStyle = corAtual;

    salvarEstadoHistorico();

    const getPos = (e) => {
        const rect = canvas.getBoundingClientRect();
        const clientX = e.touches ? e.touches[0].clientX : e.clientX;
        const clientY = e.touches ? e.touches[0].clientY : e.clientY;
        return { 
            x: Math.floor(clientX - rect.left), 
            y: Math.floor(clientY - rect.top) 
        };
    };

    const startDraw = (e) => {
        const pos = getPos(e);
        if (ferramentaAtual === 'balde') {
            preencherAreaComCor(pos.x, pos.y);
            e.preventDefault();
            return;
        }

        isDrawing = true;
        ctx.beginPath();
        ctx.moveTo(pos.x, pos.y);
        e.preventDefault();
    };

    const draw = (e) => {
        if (!isDrawing || ferramentaAtual === 'balde') return;
        const pos = getPos(e);
        
        if (ferramentaAtual === 'borracha') {
            ctx.strokeStyle = '#FFFFFF';
        } else {
            ctx.strokeStyle = corAtual;
        }

        ctx.lineTo(pos.x, pos.y);
        ctx.stroke();
        e.preventDefault();
    };

    const endDraw = () => {
        if (isDrawing) {
            isDrawing = false;
            salvarEstadoHistorico();
        }
    };

    canvas.onmousedown = startDraw;
    canvas.onmousemove = draw;
    canvas.onmouseup = endDraw;
    canvas.onmouseleave = endDraw;

    canvas.ontouchstart = startDraw;
    canvas.ontouchmove = draw;
    canvas.ontouchend = endDraw;
}

function salvarEstadoHistorico() {
    if (!canvas || !ctx) return;
    if (historicoCanvas.length >= 10) {
        historicoCanvas.shift();
    }
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

function mudarCor(novaCor, el) {
    if (somClique.src) somClique.play().catch(()=>{});
    corAtual = novaCor;
    ferramentaAtual = 'lapis';
    if (ctx) ctx.strokeStyle = corAtual;
    
    document.querySelectorAll('.lapis-btn').forEach(b => b.classList.remove('ativo'));
    document.getElementById('btnBorracha').classList.remove('ativo');
    document.getElementById('btnBalde').classList.remove('ativo');
    
    if (el) el.classList.add('ativo');
}

function mudarGrossura(tamanho, el) {
    if (somClique.src) somClique.play().catch(()=>{});
    tamanhoPincel = tamanho;
    if (ctx) ctx.lineWidth = tamanhoPincel;
    
    document.querySelectorAll('.grossura-btn').forEach(b => b.classList.remove('ativo'));
    if (el) el.classList.add('ativo');
}

function ativarBorracha(el) {
    if (somClique.src) somClique.play().catch(()=>{});
    ferramentaAtual = 'borracha';
    document.querySelectorAll('.lapis-btn').forEach(b => b.classList.remove('ativo'));
    document.getElementById('btnBalde').classList.remove('ativo');
    if (el) el.classList.add('ativo');
}

function ativarBalde(el) {
    if (somClique.src) somClique.play().catch(()=>{});
    ferramentaAtual = 'balde';
    document.querySelectorAll('.lapis-btn').forEach(b => b.classList.remove('ativo'));
    document.getElementById('btnBorracha').classList.remove('ativo');
    if (el) el.classList.add('ativo');
}

// ============================================================
// ALGORITMO DE PREENCHIMENTO POR INUNDAÇÃO (FLOOD FILL)
// ============================================================
function hexToRgba(hex) {
    let c = hex.replace('#', '');
    if (c.length === 3) {
        c = c.split('').map(x => x + x).join('');
    }
    const num = parseInt(c, 16);
    return [
        (num >> 16) & 255,
        (num >> 8) & 255,
        num & 255,
        255
    ];
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

    if (
        targetColor[0] === fillColor[0] &&
        targetColor[1] === fillColor[1] &&
        targetColor[2] === fillColor[2] &&
        targetColor[3] === fillColor[3]
    ) {
        return;
    }

    function colorMatch(idx) {
        const diff = Math.abs(data[idx] - targetColor[0]) +
                     Math.abs(data[idx + 1] - targetColor[1]) +
                     Math.abs(data[idx + 2] - targetColor[2]) +
                     Math.abs(data[idx + 3] - targetColor[3]);
        return diff < 60;
    }

    const pixelStack = [[startX, startY]];

    while (pixelStack.length > 0) {
        const newPos = pixelStack.pop();
        const x = newPos[0];
        let y = newPos[1];

        let pixelPos = (y * width + x) * 4;

        while (y >= 0 && colorMatch(pixelPos)) {
            y--;
            pixelPos -= width * 4;
        }

        pixelPos += width * 4;
        y++;

        let reachLeft = false;
        let reachRight = false;

        while (y < height && colorMatch(pixelPos)) {
            data[pixelPos] = fillColor[0];
            data[pixelPos + 1] = fillColor[1];
            data[pixelPos + 2] = fillColor[2];
            data[pixelPos + 3] = fillColor[3];

            if (x > 0) {
                if (colorMatch(pixelPos - 4)) {
                    if (!reachLeft) {
                        pixelStack.push([x - 1, y]);
                        reachLeft = true;
                    }
                } else if (reachLeft) {
                    reachLeft = false;
                }
            }

            if (x < width - 1) {
                if (colorMatch(pixelPos + 4)) {
                    if (!reachRight) {
                        pixelStack.push([x + 1, y]);
                        reachRight = true;
                    }
                } else if (reachRight) {
                    reachRight = false;
                }
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
                <h1 style="color:#C2890B; font-size:1.5rem; font-weight:900; margin:0; text-transform:uppercase;">QUE OBRA DE ARTE MÁGICA!</h1>
                <p style="color:#555; font-weight:800; margin:0; font-size:0.85rem;">Fizeste um desenho maravilhoso!</p>
                <div style="display:flex; justify-content:center; gap:12px; margin-top:8px; width:100%; max-width:420px;">
                    <button class="btn-final-roxo" onclick="iniciarJogoDesenho()">Desenhar Outro</button>
                    <button class="btn-final-branco" onclick="window.history.back()">Outro Jogo</button>
                </div>
            </div>
            <div class="feedback-bottom-bar"></div>`;
    }
    const slotTopo = document.getElementById('slot-topo');
    const slotFundo = document.getElementById('slot-fundo');
    if (slotTopo) slotTopo.innerHTML = "";
    if (slotFundo) slotFundo.innerHTML = "";
}

// Iniciar a capa diretamente
mostrarCapa();
