// ============================================================
// 1. ESTADO GLOBAL E SONS
// ============================================================
const JOGO_CONFIG = {
    nomeDoJogo: "Estojo Mágico",
    caminhoSons: DADOS.sons ? DADOS.sons.caminho : "",
    caminhoIconsMenu: "../../icons/"
};

let corAtual = "#ECA607";
let ferramentaAtual = "lapis"; // "lapis", "borracha", "balde"
let tamanhoPincel = 10;
let isDrawing = false;
let ctx = null;
let canvas = null;

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
        width: 100%; height: 100%; flex: 1; gap: 8px; animation: cardPop 0.3s ease; padding: 4px 0;
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
        width: 48px; height: 48px; background: rgba(255,255,255,0.4); border: 2px solid rgba(255,255,255,0.8);
        border-radius: 50%; display: flex; align-items: center; justify-content: center; cursor: pointer;
        transition: transform 0.1s; box-shadow: 0 3px 8px rgba(0,0,0,0.1);
    }
    .btn-capa-som:active { transform: scale(0.92); }
    .btn-capa-som img { width: 26px; height: 26px; object-fit: contain; }

    .btn-capa-jogar {
        background: white; color: #C2890B; border: none;
        padding: 10px 28px; border-radius: 20px; font-weight: 900; font-size: 1.1rem;
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
// 3. CAPA E REPRODUÇÃO DE SOM
// ============================================================
function mostrarCapa() {
    if(!document.getElementById('round-feedback')) {
        const feedback = document.createElement('div');
        feedback.id = 'round-feedback';
        document.querySelector('.botao-ano').appendChild(feedback);
    }

    const area = document.getElementById('contentor-jogo');
    if (area) {
        area.innerHTML = `
            <div style="font-size: 1.5rem; font-weight: 900; color: #C2890B; margin-bottom: 10px; text-transform: uppercase;">Estojo de Desenho Mágico</div>
            <div style="background: rgba(236,166,7,0.15); width: 120px; height: 120px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 3.5rem; margin-bottom: 15px; box-shadow: 0 8px 20px rgba(236,166,7,0.2);">✏️✨</div>
        `;
    }

    const barra = document.getElementById('barra-inferior');
    if (barra) {
        barra.style.display = 'flex';
        barra.className = "barra-jogo-topo";
        barra.innerHTML = `
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
// 4. LÓGICA DO ESTOJO MÁGICO (REDIMENSIONAMENTO AUTOMÁTICO)
// ============================================================
function iniciarJogoDesenho() {
    if (somClique.src) somClique.play().catch(()=>{});
    const area = document.getElementById('contentor-jogo');
    const feedbackEl = document.getElementById('round-feedback');
    if (feedbackEl) feedbackEl.style.display = 'none';

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
                            <img src="borracha.png" alt="Borracha">
                        </div>
                        <div class="btn-ferramenta-img" id="btnBalde" onclick="ativarBalde(this)" title="Balde de Tinta">
                            <img src="balde_tinta.png" alt="Balde de Tinta">
                        </div>
                        <button class="btn-ferramenta-texto destaque" onclick="concluirDesenho()"><i class="fas fa-check"></i> Pronto!</button>
                    </div>
                </div>
            </div>
        `;
    }

    const barra = document.getElementById('barra-inferior');
    if (barra) {
        barra.innerHTML = `
            <div style="color:white; font-weight:800; font-size:0.95rem;">✏️ Escolhe os teus lápis e cria magia!</div>
            <button class="btn-ferramenta-texto" onclick="mostrarCapa()" style="padding:4px 12px; font-size:0.8rem;">Voltar</button>
        `;
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
    }

    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.lineWidth = tamanhoPincel;
    ctx.strokeStyle = corAtual;

    const getPos = (e) => {
        const rect = canvas.getBoundingClientRect();
        const clientX = e.touches ? e.touches[0].clientX : e.clientX;
        const clientY = e.touches ? e.touches[0].clientY : e.clientY;
        return { x: clientX - rect.left, y: clientY - rect.top };
    };

    const startDraw = (e) => {
        if (ferramentaAtual === 'balde') {
            preencherTelaComCor();
            e.preventDefault();
            return;
        }

        isDrawing = true;
        const pos = getPos(e);
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

    const endDraw = () => { isDrawing = false; };

    canvas.onmousedown = startDraw;
    canvas.onmousemove = draw;
    canvas.onmouseup = endDraw;
    canvas.onmouseleave = endDraw;

    canvas.ontouchstart = startDraw;
    canvas.ontouchmove = draw;
    canvas.ontouchend = endDraw;
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

function preencherTelaComCor() {
    if (!ctx || !canvas) return;
    if (somClique.src) somClique.play().catch(()=>{});
    ctx.fillStyle = corAtual;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
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
                <h1 style="color:#C2890B; font-size:1.6rem; font-weight:900; margin:0; text-transform:uppercase;">QUE OBRA DE ARTE MÁGICA!</h1>
                <p style="color:#555; font-weight:800; margin:0; font-size:0.9rem;">Fizeste um desenho maravilhoso!</p>
                <div style="display:flex; justify-content:center; gap:14px; margin-top:8px; width:100%; max-width:440px;">
                    <button class="btn-final-roxo" onclick="iniciarJogoDesenho()">Desenhar Outro</button>
                    <button class="btn-final-branco" onclick="window.history.back()">Outro Jogo</button>
                </div>
            </div>
            <div class="feedback-bottom-bar"></div>`;
    }
    const barra = document.getElementById('barra-inferior');
    if (barra) barra.style.display = "none";
}

// Iniciar a capa diretamente
mostrarCapa();
