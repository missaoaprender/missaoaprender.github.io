// ============================================================
// 1. ESTADO GLOBAL E SONS
// ============================================================
const JOGO_CONFIG = {
    nomeDoJogo: "Estojo Mágico - Livro de Colorir",
    caminhoSons: DADOS.sons ? DADOS.sons.caminho : "",
    caminhoIconsMenu: "../../icons/"
};

let corAtual = "#ECA607";
let ctx = null;
let canvas = null;
let imgDesenho = null;
let historicoCanvas = []; 
let indiceDesenhoAtual = 0;

const somAcerto = new Audio(DADOS.sons && DADOS.sons.certo ? DADOS.sons.certo : "");
const somClique = new Audio(DADOS.sons && DADOS.sons.clique ? DADOS.sons.clique : "");
const somInstrucao = new Audio("f1_jogo01pre.mp3");


// ============================================================
// 2. CONFIGURAÇÃO VISUAL DO JOGO (CAPA ORIGINAL + JOGO COMPACTO)
// ============================================================
const styleJogo = document.createElement('style');
styleJogo.innerHTML = `
    .jogo-layout-principal {
        display: flex; flex-direction: row; align-items: center; justify-content: center;
        width: 100%; height: 100%; max-height: calc(100vh - 110px); box-sizing: border-box;
        gap: 10px; animation: cardPop 0.3s ease; padding: 0; overflow: hidden;
    }
    @keyframes cardPop { 0% { transform: scale(0.7); opacity: 0; } 100% { transform: scale(1); opacity: 1; } }

    .canvas-wrapper {
        background: white; border: 3px solid #E2D3AB; border-radius: 16px;
        box-shadow: 0 4px 15px rgba(0,0,0,0.08); overflow: hidden; touch-action: none;
        width: 65vh; height: 65vh; max-width: 100%; max-height: 100%; display: flex; align-items: center; justify-content: center; position: relative;
    }
    canvas { display: block; cursor: crosshair; width: 100%; height: 100%; object-fit: contain; }

    .painel-estojo-vertical {
        display: flex; flex-direction: column; align-items: center; justify-content: space-between;
        width: 216px; height: 65vh; max-height: 100%; background: rgba(255,255,255,0.9); padding: 5px; border-radius: 16px; 
        border: 2px solid #E2D3AB; flex-shrink: 0; gap: 3px; box-sizing: border-box;
    }

    .seccao-cores {
        display: flex; flex-direction: column; align-items: center; width: 100%; gap: 2px;
        background: #FFF7E3; padding: 4px; border-radius: 12px; border: 1.5px solid #F3E0B5; box-sizing: border-box;
    }
    .grid-cores {
        display: grid; grid-template-columns: repeat(4, 1fr); gap: 3px; width: 100%; justify-items: center;
    }
    
    .lapis-btn {
        width: 24px; height: 24px; border-radius: 50%; border: 2px solid white; cursor: pointer;
        box-shadow: 0 2px 4px rgba(0,0,0,0.15); transition: transform 0.1s;
    }
    .lapis-btn:active, .lapis-btn.ativo { transform: scale(1.15); border-color: #262638; }

    .seccao-ferramentas {
        display: flex; flex-direction: column; align-items: center; width: 100%; gap: 3px; flex: 1; justify-content: center;
    }
    .linha-ferramentas {
        display: flex; align-items: center; justify-content: center; gap: 5px; flex-wrap: wrap; width: 100%;
    }

    .btn-ferramenta-img {
        background: white; border: 2px solid #ECA607; width: 28px; height: 28px;
        border-radius: 10px; cursor: pointer; display: flex; align-items: center; justify-content: center;
        box-shadow: 0 3px 8px rgba(0,0,0,0.08); transition: transform 0.1s; padding: 2px;
    }
    .btn-ferramenta-img:active { transform: scale(0.92); }
    .btn-ferramenta-img.ativo { background: #ECA607; border-color: #262638; transform: scale(1.08); }
    .btn-ferramenta-img img { width: 100%; height: 100%; object-fit: contain; pointer-events: none; }

    .btn-ferramenta-texto {
        background: #ECA607; color: white; border: none; padding: 5px 10px; width: 100%;
        border-radius: 12px; font-weight: 900; font-size: 0.75rem; cursor: pointer;
        box-shadow: 0 3px 8px rgba(236,166,7,0.3); transition: transform 0.1s; text-align: center;
    }
    .btn-ferramenta-texto:active { transform: scale(0.95); }

    .moldura-selecao-desenho {
        display: flex; align-items: center; justify-content: space-between; width: 100%;
        background: white; border: 2px solid #ECA607; border-radius: 12px; padding: 3px;
        box-shadow: 0 3px 8px rgba(0,0,0,0.08); gap: 3px; box-sizing: border-box;
    }
    .seta-desenho-btn {
        background: #ECA607; color: white; border: none; width: 24px; height: 24px;
        border-radius: 50%; font-size: 0.75rem; font-weight: 900; cursor: pointer;
        display: flex; align-items: center; justify-content: center; box-shadow: 0 2px 5px rgba(0,0,0,0.15);
        transition: transform 0.1s; flex-shrink: 0;
    }
    .seta-desenho-btn:active { transform: scale(0.9); }
    .visor-desenho {
        display: flex; flex-direction: column; align-items: center; gap: 1px; flex: 1; text-align: center;
    }
    .visor-desenho img { width: 34px; height: 34px; object-fit: contain; pointer-events: none; }
    .visor-desenho span { font-size: 0.6rem; font-weight: 900; color: #262638; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; max-width: 90px; }

    .capa-container {
        display: flex; flex-direction: column; align-items: center; justify-content: center;
        flex: 1; width: 100%; gap: 15px; text-align: center;
    }
    .animacao-tutorial {
        position: relative; width: 140px; height: 140px; background: #FFF7E3;
        border: 3px solid #ECA607; border-radius: 50%; display: flex; align-items: center; justify-content: center;
        box-shadow: 0 8px 20px rgba(236,166,7,0.25); cursor: pointer;
    }
    .animacao-tutorial img { width: 75px; height: 75px; object-fit: contain; animation: flutuarDedo 1.5s infinite ease-in-out; }
    @keyframes flutuarDedo {
        0%, 100% { transform: translateY(0) scale(1); }
        50% { transform: translateY(-8px) scale(1.1); }
    }

    .btn-capa-som {
        width: 48px; height: 48px; background: rgba(255,255,255,0.4); border: 2px solid rgba(255,255,255,0.8);
        border-radius: 50%; display: flex; align-items: center; justify-content: center; cursor: pointer;
        transition: transform 0.1s; box-shadow: 0 3px 8px rgba(0,0,0,0.1);
    }
    .btn-capa-som:active { transform: scale(0.92); }
    .btn-capa-som img { width: 26px; height: 26px; object-fit: contain; }

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

    @media (max-width: 768px) {
        .jogo-layout-principal { flex-direction: column; max-height: none; height: auto; }
        .canvas-wrapper { width: 100%; height: 50vh; max-height: none; }
        .painel-estojo-vertical { width: 100%; height: auto; max-height: none; flex-direction: row; flex-wrap: wrap; justify-content: center; }
        .seccao-cores { width: auto; flex: 1; }
        .seccao-ferramentas { width: auto; flex: 2; }
    }
`;
document.head.appendChild(styleJogo);


// ============================================================
// 3. CAPA COM ANIMAÇÃO DE COMO JOGAR
// ============================================================
function mostrarCapa() {
    if(!document.getElementById('round-feedback')) {
        const feedback = document.createElement('div');
        feedback.id = 'round-feedback';
        const parentBtn = document.querySelector('.botao-ano');
        if (parentBtn) parentBtn.appendChild(feedback);
    }

    const area = document.getElementById('contentor-jogo');
    if (area) {
        const lista = DADOS.desenhosParaColorir || [];
        const atual = lista[indiceDesenhoAtual] || { nome: "Desenho", arquivo: "" };

        area.innerHTML = `
            <div class="capa-container">
                <div style="font-size: 1.4rem; font-weight: 900; color: #C2890B; text-transform: uppercase;">Estojo Mágico - Livro de Colorir</div>
                
                <div class="animacao-tutorial" onclick="tocarSomInstrucao()" title="Ouve a instrução!">
                    <img src="${DADOS.icons.lampada}" alt="Como Jogar">
                </div>
                <div style="font-size: 0.9rem; font-weight: 800; color: #555;">Clica no som e escolhe o teu desenho em baixo!</div>

                <div class="moldura-selecao-desenho" style="max-width: 280px; width: 100%;">
                    <button class="seta-desenho-btn" onclick="mudarDesenhoCapa(-1)">❮</button>
                    <div class="visor-desenho">
                        <img src="${atual.arquivo}" alt="${atual.nome}">
                        <span>${atual.nome}</span>
                    </div>
                    <button class="seta-desenho-btn" onclick="mudarDesenhoCapa(1)">❯</button>
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
            <button class="btn-ferramenta-texto" onclick="iniciarJogoDesenho()" style="background:white; color:#C2890B; border:none; padding:10px 24px; border-radius:20px; font-weight:900; cursor:pointer; width:auto;">COMEÇAR A PINTAR</button>
        `;
    }
}

function tocarSomInstrucao() {
    if (somClique.src) somClique.play().catch(()=>{});
    somInstrucao.currentTime = 0;
    somInstrucao.play().catch(()=>{});
}

function mudarDesenhoCapa(direcao) {
    if (somClique.src) somClique.play().catch(()=>{});
    const lista = DADOS.desenhosParaColorir || [];
    if (lista.length === 0) return;

    indiceDesenhoAtual += direcao;
    if (indiceDesenhoAtual < 0) indiceDesenhoAtual = lista.length - 1;
    if (indiceDesenhoAtual >= lista.length) indiceDesenhoAtual = 0;

    mostrarCapa();
}


// ============================================================
// 4. LÓGICA DO JOGO DE COLORIR
// ============================================================
function iniciarJogoDesenho() {
    if (somClique.src) somClique.play().catch(()=>{});
    const area = document.getElementById('contentor-jogo');
    const feedbackEl = document.getElementById('round-feedback');
    if (feedbackEl) feedbackEl.style.display = 'none';

    if (area) {
        area.innerHTML = `
            <div class="jogo-layout-principal">
                <div class="canvas-wrapper" id="canvasWrapper">
                    <canvas id="paintCanvas"></canvas>
                </div>

                <div class="painel-estojo-vertical">
                    <div class="seccao-cores">
                        <span style="font-size:0.65rem; font-weight:900; color:#C2890B; text-transform:uppercase;">Cores</span>
                        <div class="grid-cores">
                            <div class="lapis-btn ativo" style="background:#ECA607;" onclick="mudarCor('#ECA607', this)" title="Amarelo Ouro"></div>
                            <div class="lapis-btn" style="background:#ff5a5f;" onclick="mudarCor('#ff5a5f', this)" title="Vermelho Coral"></div>
                            <div class="lapis-btn" style="background:#ff9f1c;" onclick="mudarCor('#ff9f1c', this)" title="Laranja"></div>
                            <div class="lapis-btn" style="background:#8cc63f;" onclick="mudarCor('#8cc63f', this)" title="Verde Claro"></div>
                            <div class="lapis-btn" style="background:#2ec4b6;" onclick="mudarCor('#2ec4b6', this)" title="Verde Água"></div>
                            <div class="lapis-btn" style="background:#3a86ff;" onclick="mudarCor('#3a86ff', this)" title="Azul"></div>
                            <div class="lapis-btn" style="background:#7209b7;" onclick="mudarCor('#7209b7', this)" title="Roxo Escuro"></div>
                            <div class="lapis-btn" style="background:#9b5de5;" onclick="mudarCor('#9b5de5', this)" title="Lilás"></div>
                            <div class="lapis-btn" style="background:#ff007f;" onclick="mudarCor('#ff007f', this)" title="Rosa Choque"></div>
                            <div class="lapis-btn" style="background:#ff70a6;" onclick="mudarCor('#ff70a6', this)" title="Rosa Pastel"></div>
                            <div class="lapis-btn" style="background:#262638;" onclick="mudarCor('#262638', this)" title="Preto"></div>
                            <div class="lapis-btn" style="background:#FFFFFF; border:2px solid #E2D3AB;" onclick="mudarCor('#FFFFFF', this)" title="Branco"></div>
                        </div>
                    </div>

                    <div class="seccao-ferramentas">
                        <div class="linha-ferramentas">
                            <div class="btn-ferramenta-img" id="btnBorracha" onclick="ativarBorracha(this)" title="Borracha">
                                <img src="../../icons/borracha.png" alt="Borracha">
                            </div>
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
        barra.innerHTML = `
            <div style="color:white; font-weight:800; font-size:0.95rem;">🎨 Clica numa zona para preencher com a cor!</div>
            <button class="btn-ferramenta-texto" onclick="mostrarCapa()" style="padding:4px 12px; font-size:0.8rem; width:auto;">Voltar</button>
        `;
    }

    atualizarVisorJogo();
    configurarCanvas();
}

function atualizarVisorJogo() {
    const visor = document.getElementById('visorDesenhoJogo');
    if (!visor) return;
    const lista = DADOS.desenhosParaColorir || [];
    const atual = lista[indiceDesenhoAtual] || { nome: "", arquivo: "" };
    visor.innerHTML = `
        <img src="${atual.arquivo}" alt="${atual.nome}">
        <span>${atual.nome}</span>
    `;
}

function mudarDesenhoJogo(direcao) {
    if (somClique.src) somClique.play().catch(()=>{});
    const lista = DADOS.desenhosParaColorir || [];
    if (lista.length === 0) return;

    indiceDesenhoAtual += direcao;
    if (indiceDesenhoAtual < 0) indiceDesenhoAtual = lista.length - 1;
    if (indiceDesenhoAtual >= lista.length) indiceDesenhoAtual = 0;

    atualizarVisorJogo();
    configurarCanvas();
}


// ============================================================
// 5. CONFIGURAÇÃO DO CANVAS E PREENCHIMENTO INTELIGENTE
// ============================================================
function configurarCanvas() {
    canvas = document.getElementById('paintCanvas');
    const wrapper = document.getElementById('canvasWrapper');
    if (!canvas || !wrapper) return;

    canvas.width = 1000;
    canvas.height = 800;
    ctx = canvas.getContext('2d', { willReadFrequently: true });

    const lista = DADOS.desenhosParaColorir || [];
    const atual = lista[indiceDesenhoAtual];

    if (atual && atual.arquivo) {
        imgDesenho = new Image();
        imgDesenho.crossOrigin = "anonymous";
        imgDesenho.onload = () => {
            desenharCenarioInicial();
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

function desenharCenarioInicial() {
    if (!ctx || !imgDesenho) return;
    ctx.fillStyle = "#FFFFFF";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    const hRatio = canvas.width / imgDesenho.width;
    const vRatio = canvas.height / imgDesenho.height;
    const ratio = Math.min(hRatio, vRatio) * 0.95; 
    const centerShiftX = (canvas.width - imgDesenho.width * ratio) / 2;
    const centerShiftY = (canvas.height - imgDesenho.height * ratio) / 2;

    ctx.drawImage(imgDesenho, 0, 0, imgDesenho.width, imgDesenho.height, centerShiftX, centerShiftY, imgDesenho.width * ratio, imgDesenho.height * ratio);
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
    
    document.querySelectorAll('.lapis-btn').forEach(b => b.classList.remove('ativo'));
    const btnBorracha = document.getElementById('btnBorracha');
    if (btnBorracha) btnBorracha.classList.remove('ativo');
    
    if (el) el.classList.add('ativo');
}

function ativarBorracha(el) {
    if (somClique.src) somClique.play().catch(()=>{});
    corAtual = "#FFFFFF"; 
    document.querySelectorAll('.lapis-btn').forEach(b => b.classList.remove('ativo'));
    if (el) el.classList.add('ativo');
}


// ============================================================
// 6. ALGORITMO DE PREENCHIMENTO RÁPIDO (FLOOD FILL)
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
        const r = data[idx];
        const g = data[idx + 1];
        const b = data[idx + 2];
        
        if (r < 70 && g < 70 && b < 70) return false;

        const diff = Math.abs(r - targetColor[0]) +
                     Math.abs(g - targetColor[1]) +
                     Math.abs(b - targetColor[2]);
        return diff < 75;
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
                <img src="${iconeFeedback}" style="width:130px; height:130px; object-fit:contain;">
                <h1 style="color:#C2890B; font-size:1.6rem; font-weight:900; margin:0; text-transform:uppercase;">QUE PINTURA MARAVILHOSA!</h1>
                <p style="color:#555; font-weight:800; margin:0; font-size:0.9rem;">Fizeste uma obra de arte incrível!</p>
                <div style="display:flex; justify-content:center; gap:14px; margin-top:8px; width:100%; max-width:440px;">
                    <button class="btn-final-roxo" onclick="mostrarCapa()">Escolher Outro</button>
                    <button class="btn-final-branco" onclick="window.history.back()">Outro Jogo</button>
                </div>
            </div>
            <div class="feedback-bottom-bar"></div>`;
    }
    const barra = document.getElementById('barra-inferior');
    if (barra) barra.style.display = "none";
}

// Iniciar mostrando a capa com a animação
mostrarCapa();
