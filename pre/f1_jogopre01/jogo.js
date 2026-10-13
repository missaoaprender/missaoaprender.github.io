// ============================================================
// 1. ESTADO GLOBAL E SONS
// ============================================================
const JOGO_CONFIG = {
    nomeDoJogo: "Desenho Livre",
    caminhoSons: DADOS.sons ? DADOS.sons.caminho : "",
    caminhoIconsMenu: "../../icons/"
};

let corAtual = "#EFAA0F";
let tamanhoPincel = 12;
let isDrawing = false;
let ctx = null;
let canvas = null;

const somAcerto = new Audio(DADOS.sons && DADOS.sons.certo ? DADOS.sons.certo : "");
const somClique = new Audio(DADOS.sons && DADOS.sons.clique ? DADOS.sons.clique : "");


// ============================================================
// 2. CONFIGURAÇÃO VISUAL (DESIGN PREMIUM)
// ============================================================
const style = document.createElement('style');
style.innerHTML = `
    .desenho-container {
        display: flex; flex-direction: column; align-items: center; justify-content: center;
        width: 100%; height: 100%; gap: 10px; animation: cardPop 0.3s ease;
    }
    @keyframes cardPop { 0% { transform: scale(0.7); opacity: 0; } 100% { transform: scale(1); opacity: 1; } }

    .canvas-wrapper {
        background: white; border: 3px solid #E2D3AB; border-radius: 16px;
        box-shadow: 0 4px 15px rgba(0,0,0,0.08); overflow: hidden; touch-action: none;
    }
    canvas { display: block; cursor: crosshair; }

    .palete-tools {
        display: flex; align-items: center; justify-content: center; gap: 10px; flex-wrap: wrap; width: 100%; max-width: 600px; padding: 4px;
    }
    
    .cor-btn {
        width: 36px; height: 36px; border-radius: 50%; border: 3px solid white; cursor: pointer;
        box-shadow: 0 3px 6px rgba(0,0,0,0.15); transition: transform 0.1s;
    }
    .cor-btn:active, .cor-btn.ativo { transform: scale(1.15); border-color: #262638; }

    .btn-ferramenta {
        background: white; color: #C2890B; border: 2px solid #EFAA0F; padding: 8px 16px;
        border-radius: 15px; font-weight: 900; font-size: 0.9rem; cursor: pointer;
        box-shadow: 0 3px 8px rgba(0,0,0,0.08); transition: transform 0.1s; display: flex; align-items: center; gap: 6px;
    }
    .btn-ferramenta:active { transform: scale(0.95); }
    .btn-ferramenta.destaque { background: #EFAA0F; color: white; }

    /* Barra da Capa com Info e Jogar */
    .btn-capa-info {
        width: 44px; height: 44px; background: rgba(255,255,255,0.3); border: 2px solid rgba(255,255,255,0.6);
        border-radius: 50%; display: flex; align-items: center; justify-content: center; cursor: pointer; color: white;
        font-size: 1.2rem; font-weight: 900; transition: transform 0.1s;
    }
    .btn-capa-info:active { transform: scale(0.92); }
    .btn-capa-info img { width: 24px; height: 24px; object-fit: contain; }

    .btn-capa-jogar {
        background: white; color: #C2890B; border: none;
        padding: 10px 28px; border-radius: 20px; font-weight: 900; font-size: 1.1rem;
        cursor: pointer; box-shadow: 0 4px 10px rgba(0,0,0,0.15); transition: transform 0.1s;
        text-transform: uppercase;
    }
    .btn-capa-jogar:active { transform: scale(0.95); }

    #instrucoes-panel { position: fixed; top: 0; left: 0; width: 100vw; height: 100vh; background: white; z-index: 10000; transition: transform 0.5s ease; transform: translateY(100%); visibility: hidden; padding: 40px 25px; overflow-y: auto; border-radius: 35px 35px 0 0; }
    #instrucoes-panel.open { transform: translateY(0); visibility: visible; }
    .close-x { position: absolute; top: 15px; right: 20px; font-size: 2.5rem; color: #EFAA0F; cursor: pointer; font-weight: 900; line-height: 1; transition: 0.2s; }
    .close-x:hover { transform: scale(1.2); }

    .inst-content { max-width: 600px; margin: 0 auto; text-align: left; }
    .inst-header { color: #C2890B; text-align: center; font-size: 1.8rem; font-weight: 900; margin-bottom: 25px; text-transform: uppercase; border-bottom: 3px solid ${DADOS.cores.fundo}; padding-bottom: 10px; }
    .inst-section-title { color: #444; font-size: 1.2rem; font-weight: 800; margin: 20px 0 12px; display: flex; align-items: center; gap: 10px; }
    .inst-section-title::before { content: ''; width: 6px; height: 22px; background: #EFAA0F; border-radius: 3px; display: inline-block; }
    .inst-text { color: #555; font-size: 1rem; line-height: 1.5; background: #f9f9f9; padding: 15px; border-radius: 15px; border-left: 5px solid #EFAA0F; }

    #round-feedback { 
        position: absolute; top: 0; left: 0; width: 100%; height: 100%; 
        background: rgba(255, 255, 255, 0.95); backdrop-filter: blur(6px); 
        z-index: 1000; display: none; flex-direction: column; align-items: center; justify-content: center; 
        border-radius: 35px; overflow: hidden;
    }
    
    .feedback-bottom-bar {
        position: absolute; bottom: 20px; left: 24px; right: 24px; height: 14px;
        background: #EFAA0F; border-radius: 7px;
    }

    .vitoria-card { background: transparent; padding: 10px 20px; text-align: center; display: flex; flex-direction: column; align-items: center; gap: 12px; animation: cardPop 0.4s cubic-bezier(0.17, 0.89, 0.32, 1.28); margin-bottom: 25px; width: 100%; max-width: 480px; }
    
    .btn-final-roxo {
        background: #EFAA0F; color: white; border: none; padding: 14px 20px;
        border-radius: 25px; font-weight: 900; font-size: 1rem; cursor: pointer;
        box-shadow: 0 6px 15px rgba(239,170,15,0.3); text-transform: capitalize; transition: transform 0.1s;
        white-space: nowrap; flex: 1; text-align: center;
    }
    .btn-final-roxo:active { transform: scale(0.95); }

    .btn-final-branco {
        background: white; color: #C2890B; border: 2px solid #EFAA0F; padding: 14px 20px;
        border-radius: 25px; font-weight: 900; font-size: 1rem; cursor: pointer;
        box-shadow: 0 6px 15px rgba(0,0,0,0.08); text-transform: capitalize; transition: transform 0.1s;
        white-space: nowrap; flex: 1; text-align: center;
    }
    .btn-final-branco:active { transform: scale(0.95); }
`;
document.head.appendChild(style);


// ============================================================
// 3. CAPA E INSTRUÇÕES
// ============================================================
function mostrarCapa() {
    if(!document.getElementById('instrucoes-panel')) {
        const panel = document.createElement('div');
        panel.id = 'instrucoes-panel';
        panel.innerHTML = `
            <span class="close-x" onclick="toggleInstructions()">&times;</span>
            <div class="inst-content">
                <div class="inst-header">Como Usar o Desenho Livre</div>
                <div class="inst-section-title">Solta a tua imaginação!</div>
                <p class="inst-text">Usa o dedo ou o rato para desenhares livremente no ecrã. Podes escolher várias cores na paleta em baixo, ajustar o tamanho do pincel, limpar a folha ou concluir o teu desenho para receberes os parabéns!</p>
            </div>`;
        document.body.appendChild(panel);
        
        const feedback = document.createElement('div');
        feedback.id = 'round-feedback';
        document.querySelector('.botao-ano').appendChild(feedback);
    }

    const area = document.getElementById('contentor-jogo');
    if (area) {
        area.innerHTML = `
            <div style="font-size: 1.5rem; font-weight: 900; color: #C2890B; margin-bottom: 10px; text-transform: uppercase;">Atividade de Desenho</div>
            <div style="background: rgba(239,170,15,0.15); width: 120px; height: 120px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 3.5rem; margin-bottom: 15px; box-shadow: 0 8px 20px rgba(239,170,15,0.2);">🎨</div>
        `;
    }

    const barra = document.getElementById('barra-inferior');
    if (barra) {
        barra.style.display = 'flex';
        barra.className = "barra-jogo-topo";
        barra.innerHTML = `
            <div class="btn-capa-info" onclick="toggleInstructions()"><img src="${DADOS.icons.info}" alt="Info"></div>
            <button class="btn-capa-jogar" onclick="iniciarJogoDesenho()">COMEÇAR</button>
        `;
    }
}

function toggleInstructions() { 
    if (somClique.src) somClique.play().catch(()=>{});
    document.getElementById('instrucoes-panel').classList.toggle('open'); 
}


// ============================================================
// 4. LÓGICA DO JOGO DE DESENHO
// ============================================================
function iniciarJogoDesenho() {
    if (somClique.src) somClique.play().catch(()=>{});
    const area = document.getElementById('contentor-jogo');
    const feedbackEl = document.getElementById('round-feedback');
    if (feedbackEl) feedbackEl.style.display = 'none';

    if (area) {
        area.innerHTML = `
            <div class="desenho-container">
                <div class="canvas-wrapper">
                    <canvas id="paintCanvas" width="560" height="300"></canvas>
                </div>
                <div class="palete-tools">
                    <div class="cor-btn" style="background:#EFAA0F;" onclick="mudarCor('#EFAA0F', this)"></div>
                    <div class="cor-btn" style="background:#ff5a5f;" onclick="mudarCor('#ff5a5f', this)"></div>
                    <div class="cor-btn" style="background:#8cc63f;" onclick="mudarCor('#8cc63f', this)"></div>
                    <div class="cor-btn" style="background:#3a86ff;" onclick="mudarCor('#3a86ff', this)"></div>
                    <div class="cor-btn" style="background:#9b5de5;" onclick="mudarCor('#9b5de5', this)"></div>
                    <div class="cor-btn" style="background:#262638;" onclick="mudarCor('#262638', this)"></div>
                    <button class="btn-ferramenta" onclick="limparTela()"><i class="fas fa-trash-alt"></i> Limpar</button>
                    <button class="btn-ferramenta destaque" onclick="concluirDesenho()"><i class="fas fa-check"></i> Pronto!</button>
                </div>
            </div>
        `;
    }

    const barra = document.getElementById('barra-inferior');
    if (barra) {
        barra.innerHTML = `
            <div style="color:white; font-weight:800; font-size:0.95rem;">🎨 Desenha o que quiseres!</div>
            <button class="btn-ferramenta" onclick="mostrarCapa()" style="padding:4px 12px; font-size:0.8rem;">Voltar</button>
        `;
    }

    configurarCanvas();
}

function configurarCanvas() {
    canvas = document.getElementById('paintCanvas');
    if (!canvas) return;
    ctx = canvas.getContext('2d');
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.lineWidth = tamanhoPincel;
    ctx.strokeStyle = corAtual;

    // Ajustar tamanho responsivo para telemóveis
    if (window.innerWidth < 600) {
        canvas.width = window.innerWidth - 65;
        canvas.height = 260;
    }

    const getPos = (e) => {
        const rect = canvas.getBoundingClientRect();
        const clientX = e.touches ? e.touches[0].clientX : e.clientX;
        const clientY = e.touches ? e.touches[0].clientY : e.clientY;
        return { x: clientX - rect.left, y: clientY - rect.top };
    };

    const startDraw = (e) => {
        isDrawing = true;
        const pos = getPos(e);
        ctx.beginPath();
        ctx.moveTo(pos.x, pos.y);
        e.preventDefault();
    };

    const draw = (e) => {
        if (!isDrawing) return;
        const pos = getPos(e);
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
    if (ctx) ctx.strokeStyle = corAtual;
    document.querySelectorAll('.cor-btn').forEach(b => b.classList.remove('ativo'));
    if (el) el.classList.add('ativo');
}

function limparTela() {
    if (somClique.src) somClique.play().catch(()=>{});
    if (ctx && canvas) ctx.clearRect(0, 0, canvas.width, canvas.height);
}

function concluirDesenho() {
    if (somAcerto.src) somAcerto.play().catch(()=>{});
    const overlay = document.getElementById('round-feedback');
    const iconeFeedback = DADOS.icons.feedbacks.feedback1;

    if (overlay) {
        overlay.style.display = 'flex';
        overlay.innerHTML = `
            <div class="vitoria-card">
                <img src="${iconeFeedback}" style="width:140px; height:140px; object-fit:contain;">
                <h1 style="color:#C2890B; font-size:1.8rem; font-weight:900; margin:0; text-transform:uppercase;">QUE LINDOS DESENHOS!</h1>
                <p style="color:#555; font-weight:800; margin:0; font-size:0.95rem;">Fizeste um trabalho fantástico!</p>
                <div style="display:flex; justify-content:center; gap:14px; margin-top:10px; width:100%; max-width:440px;">
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
