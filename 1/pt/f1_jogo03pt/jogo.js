// ==========================================
// 1. ESTADO GLOBAL E SONS
// ==========================================
let jogoAtivo = false;
let rondaAtual = 1, totalRondas = 10, certos = 0, erros = 0, ajudasUsadas = 0;
let itemDestaque = null;
let audioInstrucao = null;

const somAcerto = new Audio(DADOS.sons.certo);
const somErro = new Audio(DADOS.sons.errado);

let canvas, ctx, corTemaAtual = "#0F8BD3"; 
let isDrawing = false;
let ajudaEmCurso = false; 
let posAtualX = 0, posAtualY = 0;

let tracosLetra = []; 
let tracoAtualIndex = 0; 
let saiuDoCaminho = false;
let simuTimer = null; 
let sequenciaNiveis = [];

// ==========================================
// 2. DICIONÁRIO ALFABETO MANUSCRIPT OTIMIZADO
// ==========================================
const ALFABETO_VETORES = {
    'A': [ [["L", 0.5, 0.2, 0.2, 0.8]], [["L", 0.5, 0.2, 0.8, 0.8]], [["L", 0.35, 0.5, 0.65, 0.5]] ],
    'B': [ [["L", 0.3, 0.2, 0.3, 0.8]], [["A", 0.3, 0.35, 0.15, 270, 90, false]], [["A", 0.3, 0.65, 0.15, 270, 90, false]] ],
    'C': [ [["A", 0.55, 0.5, 0.3, 330, 45, true]] ],
    'D': [ [["L", 0.3, 0.2, 0.3, 0.8]], [["A", 0.3, 0.5, 0.3, 270, 90, false]] ],
    'E': [ [["L", 0.3, 0.2, 0.3, 0.8]], [["L", 0.3, 0.2, 0.7, 0.2]], [["L", 0.3, 0.5, 0.6, 0.5]], [["L", 0.3, 0.8, 0.7, 0.8]] ],
    'F': [ [["L", 0.3, 0.2, 0.3, 0.8]], [["L", 0.3, 0.2, 0.7, 0.2]], [["L", 0.3, 0.5, 0.6, 0.5]] ],
    'G': [ [["A", 0.55, 0.5, 0.3, 330, 0, true], ["L", 0.85, 0.5, 0.6, 0.5]] ],
    'H': [ [["L", 0.3, 0.2, 0.3, 0.8]], [["L", 0.7, 0.2, 0.7, 0.8]], [["L", 0.3, 0.5, 0.7, 0.5]] ],
    'I': [ [["L", 0.5, 0.2, 0.5, 0.8]] ],
    'J': [ [["L", 0.65, 0.2, 0.65, 0.65], ["A", 0.5, 0.65, 0.15, 0, 180, false]] ],
    'K': [ [["L", 0.3, 0.2, 0.3, 0.8]], [["L", 0.7, 0.2, 0.3, 0.5]], [["L", 0.3, 0.5, 0.7, 0.8]] ],
    'L': [ [["L", 0.3, 0.2, 0.3, 0.8]], [["L", 0.3, 0.8, 0.7, 0.8]] ],
    'M': [ [["L", 0.2, 0.8, 0.2, 0.2]], [["L", 0.2, 0.2, 0.5, 0.5]], [["L", 0.5, 0.5, 0.8, 0.2]], [["L", 0.8, 0.2, 0.8, 0.8]] ],
    'N': [ [["L", 0.2, 0.8, 0.2, 0.2]], [["L", 0.2, 0.2, 0.8, 0.8]], [["L", 0.8, 0.8, 0.8, 0.2]] ],
    'O': [ [["A", 0.5, 0.5, 0.3, 270, 280, true]] ],
    'P': [ [["L", 0.3, 0.2, 0.3, 0.8]], [["A", 0.3, 0.35, 0.15, 270, 90, false]] ],
    'Q': [ [["A", 0.5, 0.5, 0.3, 270, 280, true]], [["L", 0.5, 0.5, 0.8, 0.8]] ],
    'R': [ [["L", 0.3, 0.2, 0.3, 0.8]], [["A", 0.3, 0.35, 0.15, 270, 90, false]], [["L", 0.45, 0.5, 0.7, 0.8]] ],
    'S': [ [["A", 0.5, 0.35, 0.15, 330, 90, true], ["A", 0.5, 0.65, 0.15, 270, 150, false]] ],
    'T': [ [["L", 0.5, 0.2, 0.5, 0.8]], [["L", 0.2, 0.2, 0.8, 0.2]] ],
    'U': [ [["L", 0.3, 0.2, 0.3, 0.65], ["A", 0.5, 0.65, 0.2, 180, 0, true], ["L", 0.7, 0.65, 0.7, 0.2]] ],
    'V': [ [["L", 0.2, 0.2, 0.5, 0.8]], [["L", 0.5, 0.8, 0.8, 0.2]] ],
    'W': [ [["L", 0.1, 0.2, 0.3, 0.8]], [["L", 0.3, 0.8, 0.5, 0.4]], [["L", 0.5, 0.4, 0.7, 0.8]], [["L", 0.7, 0.8, 0.9, 0.2]] ],
    'X': [ [["L", 0.2, 0.2, 0.8, 0.8]], [["L", 0.8, 0.2, 0.2, 0.8]] ],
    'Y': [ [["L", 0.2, 0.2, 0.5, 0.5]], [["L", 0.8, 0.2, 0.5, 0.5]], [["L", 0.5, 0.5, 0.5, 0.8]] ],
    'Z': [ [["L", 0.2, 0.2, 0.8, 0.2]], [["L", 0.8, 0.2, 0.2, 0.8]], [["L", 0.2, 0.8, 0.8, 0.8]] ]
};

// ==========================================
// 3. CONFIGURAÇÃO VISUAL (CSS INJETADO)
// ==========================================
const style = document.createElement('style');
style.innerHTML = `
    .barra-capa-layout {
        width: 100%; display: flex; align-items: center; justify-content: space-between; position: relative;
    }
    .btn-play-rect-capa { 
        height: 48px; padding: 0 38px; border-radius: 24px; background: #FFFFFF; color: #0F8BD3; 
        border: none; font-size: 1.25rem; font-weight: 900; text-transform: uppercase; 
        cursor: pointer; display: flex; align-items: center; justify-content: center; 
        box-shadow: 0 4px 10px rgba(0,0,0,0.12); transition: transform 0.1s ease, background-color 0.2s ease; 
        margin-left: auto;
    }
    .btn-play-rect-capa:active { transform: scale(0.95); }

    .btn-audio-circle { 
        width: 44px; height: 44px; cursor: pointer; flex-shrink: 0; z-index: 100; 
        border-radius: 50%; background: rgba(0,0,0,0.15); display: flex; align-items: center; justify-content: center; 
        border: none; padding: 0; transition: transform 0.1s ease;
    }
    .btn-audio-circle:active { transform: scale(0.92); }
    .btn-audio-circle img { width: 24px; height: 24px; object-fit: contain; pointer-events: none; }

    .grafismo-area {
        position: relative; width: 100%; max-width: 500px; height: 320px;
        background: #fffdf5; border: 4px dashed #B4E4F8; border-radius: 20px;
        margin: 0 auto; display: flex; justify-content: center; align-items: center;
        overflow: hidden; box-shadow: inset 0 0 20px rgba(0,0,0,0.02);
    }

    .ponto-inicio, .ponto-fim {
        position: absolute; width: 40px; height: 40px; border-radius: 50%; 
        border: 4px solid #fff; z-index: 10; 
        transform: translate(-50%, -50%); transition: opacity 0.2s ease;
    }
    .ponto-inicio { background: #0F8BD3; box-shadow: 0 0 0 4px rgba(15,139,211,0.3), 0 4px 10px rgba(0,0,0,0.3); }
    .ponto-fim { background: #8cc63f; box-shadow: 0 0 0 4px rgba(140,198,63,0.3), 0 4px 10px rgba(0,0,0,0.3); display: flex; align-items: center; justify-content: center; color: white; font-size: 16px; }

    .animating { animation: pulse 1s infinite alternate; }
    @keyframes pulse { from { transform: translate(-50%, -50%) scale(1); } to { transform: translate(-50%, -50%) scale(1.15); } }

    .letra-sucesso { animation: popSuccess 0.8s ease forwards; }
    @keyframes popSuccess { 
        0% { transform: scale(1); } 
        50% { transform: scale(1.08); filter: drop-shadow(0 0 15px #0F8BD3); } 
        100% { transform: scale(1); } 
    }

    canvas { position: absolute; top: 0; left: 0; width: 100%; height: 100%; z-index: 5; cursor: pointer; touch-action: none; }

    .botao-acao-jogo {
        width: 38px; height: 38px; min-width: 38px; min-height: 38px; border-radius: 50%; border: none;
        background: rgba(0,0,0,0.2); color: #FFFFFF; font-size: 16px;
        display: flex; align-items: center; justify-content: center; cursor: pointer; transition: transform 0.1s ease;
        padding: 0; flex-shrink: 0;
    }
    .botao-acao-jogo:active { transform: scale(0.92); }
    .botao-acao-jogo img { width: 22px; height: 22px; object-fit: contain; pointer-events: none; }
    .botao-acao-jogo:disabled { opacity: 0.4; cursor: not-allowed; transform: none; filter: grayscale(1); }

    .wrapper-progresso-completo {
        flex: 1; display: flex; align-items: center; gap: 12px; margin: 0 15px; width: 100%; min-width: 0;
    }
    .container-progresso-jogo {
        flex: 1; width: 100%; height: 16px; background: rgba(0,0,0,0.15);
        border-radius: 10px; overflow: hidden; position: relative; min-width: 40px;
    }
    .barra-progresso-interna { width: 0%; height: 100%; background: #FFB400; border-radius: 10px; transition: width 0.3s ease; }
    .contador-rondas { background: rgba(0,0,0,0.15); color: #FFFFFF; padding: 5px 12px; border-radius: 10px; font-weight: 900; font-size: 14px; white-space: nowrap; flex-shrink: 0; }
    .bloco-estrelas-pontos { display: flex; align-items: center; gap: 6px; background: rgba(0,0,0,0.15); padding: 5px 12px; border-radius: 20px; color: #FFFFFF; font-weight: 900; font-size: 16px; }

    .ecra-feedback-container {
        display: flex; flex-direction: column; align-items: center; justify-content: center;
        height: 100%; color: #062B42; text-align: center; padding: 15px;
        background: linear-gradient(135deg, #ffffff 0%, #E1F2FA 100%);
        border-radius: 20px; box-shadow: inset 0 2px 8px rgba(15,139,211,0.1);
    }
    .ecra-feedback-imagem { width: 180px; height: 180px; object-fit: contain; margin-bottom: 12px; filter: drop-shadow(0 8px 16px rgba(0,0,0,0.22)); }
    .ecra-feedback-estrelas { font-size: 1.8rem; margin-bottom: 15px; letter-spacing: 4px; }

    .container-botoes-feedback {
        display: flex; gap: 15px; flex-wrap: wrap; justify-content: center; margin-top: 5px;
    }
    .btn-feedback {
        width: 190px; height: 50px; border-radius: 25px; border: none; font-weight: 900; 
        font-size: 1.05rem; cursor: pointer; display: flex; align-items: center; justify-content: center;
        transition: transform 0.1s ease, box-shadow 0.2s ease;
        box-shadow: 0 4px 12px rgba(15,139,211,0.25);
    }
    .btn-feedback-primario { background: #0F8BD3; color: #ffffff; }
    .btn-feedback-secundario { background: #FFFFFF; color: #0F8BD3; border: 2px solid #0F8BD3; }
    .btn-feedback:active { transform: scale(0.95); }
`;
document.head.appendChild(style);

// ==========================================
// 4. ATUALIZAÇÃO DA BARRA DE ESTADO
// ==========================================
function atualizarBarraEstado(modoCapa = false) {
    const barra = document.getElementById('barra-inferior');
    if (!barra) return;

    const iconeSomPath = DADOS.icons.som;
    const iconeLampadaPath = DADOS.icons.lampada;

    if (modoCapa) {
        barra.innerHTML = `
            <div class="barra-capa-layout">
                <button class="btn-audio-circle" onclick="tocarAudioInstrucoes()" aria-label="Som">
                  <img src="${iconeSomPath}" alt="Som">
                </button>
                <button class="btn-play-rect-capa" onclick="iniciarJogo()">JOGAR</button>
            </div>
        `;
    } else {
        const progressoPercent = ((rondaAtual - 1) / totalRondas) * 100;
        const ajudaDesativada = ajudasUsadas >= 2 ? 'disabled' : '';
        barra.innerHTML = `
          <div class="bloco-estrelas-pontos">
            <span>⭐</span>
            <span id="pontos-jogo">${certos}</span>
          </div>
          <div class="wrapper-progresso-completo">
            <div class="container-progresso-jogo">
                <div class="barra-progresso-interna" style="width: ${progressoPercent}%"></div>
            </div>
            <div class="contador-rondas">${rondaAtual}/${totalRondas}</div>
          </div>
          <div style="display: flex; align-items: center; gap: 8px;">
            <button class="botao-acao-jogo" onclick="tocarAudioInstrucoes()" aria-label="Som">
              <img src="${iconeSomPath}" alt="Som">
            </button>
            <button class="botao-acao-jogo" onclick="darAjuda()" aria-label="Ajuda" ${ajudaDesativada}>
              <img src="${iconeLampadaPath}" alt="Ajuda">
            </button>
          </div>
        `;
    }
}

// ==========================================
// 5. CAPA E TUTORIAL ANIMADO (ÁUDIO f1_jogo03.mp3)
// ==========================================
function tocarAudioInstrucoes() {
    if (window.speechSynthesis) window.speechSynthesis.cancel();
    if (audioInstrucao) { audioInstrucao.pause(); audioInstrucao.currentTime = 0; }
    else { audioInstrucao = new Audio("../../../sons/f1_jogo03.mp3"); }
    
    audioInstrucao.play().catch(() => {
        const utter = new SpeechSynthesisUtterance("Começa exatamente na bola azul e escorrega o dedo pelas linhas para traçar a letra!");
        utter.lang = 'pt-PT'; window.speechSynthesis.speak(utter);
    });
}

function carregarCapaJogo() {
    if (jogoAtivo) return;
    const contentor = document.getElementById('contentor-jogo');
    if (!contentor) return;

    contentor.innerHTML = `
        <div style="display:flex; flex-direction:column; align-items:center; justify-content:center; width:100%; height:100%;">
            <div class="grafismo-area" id="simu-area" style="transform: scale(0.85); height: 240px; margin-bottom: 5px;">
                <div class="ponto-inicio" id="simu-inicio" style="display:none;"></div>
                <div class="ponto-fim" id="simu-fim" style="display:none;">⭐</div>
                <canvas id="simu-canvas"></canvas>
                <div id="simu-hand" style="position:absolute; font-size:3rem; z-index:100; pointer-events:none; transition: opacity 0.3s;">👆</div>
            </div>
            <p style="color:#062B42; font-weight:800; text-align:center; font-size:1.1rem; max-width: 500px; margin: 0;">
                Começa na bola azul e segue as setas para traçar as letras sem saíres do traço!
            </p>
        </div>
    `;

    atualizarBarraEstado(true);
    setTimeout(iniciarSimulacaoAnimada, 150);
}

function desenharPautas(context, w, h) {
    let size = Math.min(w, h);
    let offsetY = (h - size) / 2;
    let yTop = offsetY + 0.2 * size;
    let yBot = offsetY + 0.8 * size;
    let yMid = offsetY + 0.5 * size;

    context.beginPath(); context.lineWidth = 3; context.strokeStyle = "#b3d4ff"; 
    context.moveTo(w*0.05, yTop); context.lineTo(w*0.95, yTop); 
    context.moveTo(w*0.05, yBot); context.lineTo(w*0.95, yBot); context.stroke();
    context.beginPath(); context.lineWidth = 2; context.strokeStyle = "#d1e5ff"; context.setLineDash([15, 10]);
    context.moveTo(w*0.05, yMid); context.lineTo(w*0.95, yMid); context.stroke(); context.setLineDash([]);
}

function iniciarSimulacaoAnimada() {
    const sCanvas = document.getElementById('simu-canvas');
    if(!sCanvas) return;
    const sCtx = sCanvas.getContext('2d');
    const sArea = document.getElementById('simu-area');
    if(!sArea) return;
    
    sCanvas.width = sArea.clientWidth; sCanvas.height = sArea.clientHeight;
    const paths = gerarLetraTracos('A', sCanvas.width, sCanvas.height);
    const hand = document.getElementById('simu-hand');
    const sStart = document.getElementById('simu-inicio');
    const sEnd = document.getElementById('simu-fim');
    
    let currentS = 0; let step = 0;

    function animar() {
        if (!document.getElementById('simu-canvas')) return; 
        
        if (step === 0 && currentS === 0) {
            sCtx.clearRect(0,0, sCanvas.width, sCanvas.height);
            desenharPautas(sCtx, sCanvas.width, sCanvas.height);
            paths.forEach(stroke => {
                sCtx.beginPath(); sCtx.setLineDash([12, 12]); sCtx.lineWidth = 14; sCtx.strokeStyle = "#e0e0e0"; sCtx.lineCap = "round"; sCtx.lineJoin = "round";
                sCtx.moveTo(stroke[0].x, stroke[0].y); stroke.forEach(p => sCtx.lineTo(p.x, p.y));
                sCtx.stroke(); sCtx.setLineDash([]);
            });
        }

        if (currentS < paths.length) {
            const traco = paths[currentS];
            if (step === 0) {
                sStart.style.display = 'flex'; sStart.style.left = traco[0].x + "px"; sStart.style.top = traco[0].y + "px";
                sEnd.style.display = 'flex'; sEnd.style.left = traco[traco.length-1].x + "px"; sEnd.style.top = traco[traco.length-1].y + "px";
                sCtx.beginPath(); sCtx.lineWidth = 18; sCtx.strokeStyle = corTemaAtual; sCtx.lineCap = "round"; sCtx.lineJoin = "round";
                sCtx.moveTo(traco[0].x, traco[0].y);
                if(hand) { hand.style.opacity = 1; hand.innerText = "👆"; }
            }
            if (step < traco.length && hand) {
                const pt = traco[step];
                hand.style.left = (pt.x - 22) + "px"; hand.style.top = (pt.y - 5) + "px"; 
                if(step > 5) hand.innerText = "✊"; 
                sCtx.lineTo(pt.x, pt.y); sCtx.stroke();
                step += 3; simuTimer = setTimeout(animar, 15); 
            } else if(hand) {
                hand.innerText = "👆"; step = 0; currentS++;
                simuTimer = setTimeout(animar, 400); 
            }
        } else if(hand) {
            hand.style.opacity = 0; currentS = 0; step = 0;
            sStart.style.display = 'none'; sEnd.style.display = 'none';
            simuTimer = setTimeout(animar, 1500); 
        }
    }
    animar();
}

// ==========================================
// 6. LÓGICA DE JOGO PRINCIPAL
// ==========================================
function iniciarJogo() {
    clearTimeout(simuTimer); 
    jogoAtivo = true; rondaAtual = 1; certos = 0; erros = 0; ajudasUsadas = 0; totalRondas = 10; ajudaEmCurso = false;
    
    const todasLetras = Object.keys(ALFABETO_VETORES);
    sequenciaNiveis = [];
    todasLetras.sort(() => Math.random() - 0.5); 
    for(let i=0; i<10; i++) sequenciaNiveis.push({ letra: todasLetras[i] });
    proximaRonda();
}

function proximaRonda() {
    if (rondaAtual > totalRondas) { finalizarJogo(); return; }
    ajudaEmCurso = false;
    const contentor = document.getElementById('contentor-jogo');
    itemDestaque = sequenciaNiveis[rondaAtual - 1]; 
    
    contentor.innerHTML = `
        <div style="color: #062B42; margin-bottom: 5px; font-weight: 900; text-transform: uppercase; font-size: 1.1rem;">Traça a Letra ${itemDestaque.letra}</div>
        <div class="grafismo-area" id="area-desenho">
            <div class="ponto-inicio animating" id="ponto-inicio"></div>
            <div class="ponto-fim animating" id="ponto-fim">⭐</div>
            <canvas id="linhaCanvas"></canvas>
            <div id="game-hand" style="position:absolute; font-size:3rem; z-index:100; pointer-events:none; opacity:0; transition: opacity 0.3s;">👆</div>
        </div>
    `;
    atualizarBarraEstado(false);
    setTimeout(configurarCanvas, 100); 
}

function configurarCanvas() {
    const container = document.getElementById('area-desenho');
    canvas = document.getElementById('linhaCanvas');
    if (!canvas || !container) return;
    ctx = canvas.getContext('2d');
    canvas.width = container.clientWidth; canvas.height = container.clientHeight;

    tracosLetra = gerarLetraTracos(itemDestaque.letra, canvas.width, canvas.height);
    tracoAtualIndex = 0;
    
    atualizarPontos(); 
    desenharGuiasJogo();

    canvas.addEventListener('mousedown', startDrawing); canvas.addEventListener('mousemove', draw);
    canvas.addEventListener('mouseup', stopDrawing); canvas.addEventListener('mouseleave', stopDrawing);
    canvas.addEventListener('touchstart', startDrawing, {passive: false});
    canvas.addEventListener('touchmove', draw, {passive: false});
    canvas.addEventListener('touchend', stopDrawing);
}

function atualizarPontos() {
    const startDot = document.getElementById('ponto-inicio');
    const endDot = document.getElementById('ponto-fim');
    if(!startDot || !endDot) return;

    if (tracoAtualIndex < tracosLetra.length) {
        const ptInicio = tracosLetra[tracoAtualIndex][0];
        const ptFim = tracosLetra[tracoAtualIndex][tracosLetra[tracoAtualIndex].length - 1];

        startDot.style.display = 'flex';
        startDot.style.left = ptInicio.x + "px"; startDot.style.top = ptInicio.y + "px";
        startDot.style.opacity = '1';

        endDot.style.display = 'flex';
        endDot.style.left = ptFim.x + "px"; endDot.style.top = ptFim.y + "px";
        endDot.style.opacity = '1';
    } else {
        startDot.style.display = 'none'; endDot.style.display = 'none'; 
    }
}

function gerarLetraTracos(letra, w, h) {
    const strokes = ALFABETO_VETORES[letra];
    let todosTracos = [];
    const steps = 80; 

    let size = Math.min(w, h);
    let offsetX = (w - size) / 2;
    let offsetY = (h - size) / 2;

    strokes.forEach(strokeCmds => {
        let pts = [];
        strokeCmds.forEach(cmd => {
            let tipo = cmd[0];
            if (tipo === "L") {
                let [_, x1, y1, x2, y2] = cmd;
                for(let i=0; i<=steps; i++){
                    pts.push({ x: offsetX + (x1 + (x2-x1)*(i/steps)) * size, y: offsetY + (y1 + (y2-y1)*(i/steps)) * size, hit: false });
                }
            } else if (tipo === "A") {
                let [_, cx, cy, r, a1, a2, anti] = cmd;
                let rad1 = a1 * Math.PI/180; let rad2 = a2 * Math.PI/180;
                
                if (anti) { while (rad2 >= rad1) rad2 -= Math.PI * 2; } 
                else { while (rad2 <= rad1) rad2 += Math.PI * 2; }

                for(let i=0; i<=steps; i++){
                    let ang = rad1 + (rad2-rad1)*(i/steps);
                    pts.push({ x: offsetX + (cx + Math.cos(ang)*r) * size, y: offsetY + (cy + Math.sin(ang)*r) * size, hit: false });
                }
            }
        });
        todosTracos.push(pts);
    });
    return todosTracos;
}

function desenharGuiasJogo(mostrarConcluido = false) {
    if(!ctx || !canvas) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    desenharPautas(ctx, canvas.width, canvas.height);
    
    tracosLetra.forEach(traco => {
        ctx.beginPath(); ctx.lineWidth = 42; ctx.strokeStyle = "#ffffff"; ctx.lineCap = "round"; ctx.lineJoin = "round";
        ctx.moveTo(traco[0].x, traco[0].y); traco.forEach(pt => ctx.lineTo(pt.x, pt.y)); ctx.stroke();
    });

    tracosLetra.forEach((traco, index) => {
        ctx.beginPath(); ctx.lineCap = "round"; ctx.lineJoin = "round";
        if (mostrarConcluido || index < tracoAtualIndex) {
            ctx.lineWidth = 18; ctx.strokeStyle = corTemaAtual; ctx.setLineDash([]);
        } else if (index === tracoAtualIndex) {
            ctx.lineWidth = 14; ctx.strokeStyle = "#a0a0a0"; ctx.setLineDash([15, 15]);
        } else {
            ctx.lineWidth = 14; ctx.strokeStyle = "#e5e5e5"; ctx.setLineDash([15, 15]);
        }
        ctx.moveTo(traco[0].x, traco[0].y); traco.forEach(pt => ctx.lineTo(pt.x, pt.y)); ctx.stroke();
        ctx.setLineDash([]);
    });
}

function getClientOffset(e) {
    const rect = canvas.getBoundingClientRect();
    if (e.touches) return { x: e.touches[0].clientX - rect.left, y: e.touches[0].clientY - rect.top };
    return { x: e.clientX - rect.left, y: e.clientY - rect.top };
}

// ==========================================
// MOTOR DE TOQUE SUAVIZADO & FÁCIL
// ==========================================
function startDrawing(e) {
    if (!jogoAtivo || ajudaEmCurso || tracoAtualIndex >= tracosLetra.length) return; 
    e.preventDefault();
    
    const pos = getClientOffset(e);
    const startPt = tracosLetra[tracoAtualIndex][0];
    
    if (Math.hypot(pos.x - startPt.x, pos.y - startPt.y) > 45) return; 

    isDrawing = true; saiuDoCaminho = false;
    tracosLetra[tracoAtualIndex].forEach(p => p.hit = false); 
    posAtualX = startPt.x; posAtualY = startPt.y;
    
    document.getElementById('ponto-inicio').style.opacity = '0.2';
    document.getElementById('ponto-fim').style.opacity = '0.5';
    
    ctx.beginPath(); ctx.moveTo(startPt.x, startPt.y); 
    ctx.lineWidth = 18; ctx.strokeStyle = corTemaAtual; ctx.lineCap = "round"; ctx.lineJoin = "round";
}

function draw(e) {
    if (!isDrawing || !jogoAtivo || ajudaEmCurso) return;
    e.preventDefault();
    const pos = getClientOffset(e);
    
    let dist = Math.hypot(pos.x - posAtualX, pos.y - posAtualY);
    let steps = Math.max(1, Math.floor(dist / 5)); 
    let trajetoAtual = tracosLetra[tracoAtualIndex];
    
    for(let s = 1; s <= steps; s++) {
        let chkX = posAtualX + (pos.x - posAtualX)*(s/steps); 
        let chkY = posAtualY + (pos.y - posAtualY)*(s/steps);
        
        let minDist = Infinity; let closestIdx = -1;
        for(let i=0; i<trajetoAtual.length; i++) {
            let d = Math.hypot(chkX - trajetoAtual[i].x, chkY - trajetoAtual[i].y);
            if(d < minDist) { minDist = d; closestIdx = i; }
        }
        if (minDist > 55) saiuDoCaminho = true; 
        else if (closestIdx !== -1) trajetoAtual[closestIdx].hit = true; 
    }
    
    posAtualX = pos.x; posAtualY = pos.y;
    ctx.lineTo(pos.x, pos.y); ctx.stroke();

    let ptFim = trajetoAtual[trajetoAtual.length - 1];
    let distAteFim = Math.hypot(ptFim.x - pos.x, ptFim.y - pos.y);
    
    if (distAteFim <= 45) { 
        let accuracia = trajetoAtual.filter(p => p.hit).length / trajetoAtual.length;
        if (accuracia >= 0.30 && !saiuDoCaminho) {
            ctx.lineTo(ptFim.x, ptFim.y); ctx.stroke();
            posAtualX = ptFim.x; posAtualY = ptFim.y;
            stopDrawing(e); 
        }
    }
}

function stopDrawing(e) {
    if (!isDrawing || ajudaEmCurso) return;
    isDrawing = false; ctx.closePath();
    document.getElementById('ponto-inicio').style.opacity = '1';
    document.getElementById('ponto-fim').style.opacity = '1';
    avaliarJogada();
}

function avaliarJogada() {
    let trajetoAtual = tracosLetra[tracoAtualIndex];
    let ptFim = trajetoAtual[trajetoAtual.length - 1];
    
    let distanciaFim = Math.hypot(ptFim.x - posAtualX, ptFim.y - posAtualY);
    let accuracia = trajetoAtual.filter(p => p.hit).length / trajetoAtual.length;
    
    const areaDesenho = document.getElementById('area-desenho');

    if (distanciaFim <= 50 && accuracia >= 0.30 && !saiuDoCaminho) {
        tracoAtualIndex++; 
        somAcerto.currentTime = 0; somAcerto.play().catch(() => {});
        
        if (areaDesenho) {
            areaDesenho.style.backgroundColor = "#e8f8ec";
            setTimeout(() => { if (areaDesenho) areaDesenho.style.backgroundColor = "#fffdf5"; }, 500);
        }
        
        if (tracoAtualIndex >= tracosLetra.length) {
            jogoAtivo = false; certos++; 
            somAcerto.currentTime = 0; somAcerto.play().catch(() => {});
            atualizarPontos(); desenharGuiasJogo(true); 
            
            if (areaDesenho) areaDesenho.classList.add('letra-sucesso'); 
            setTimeout(() => { 
                if (areaDesenho) areaDesenho.classList.remove('letra-sucesso'); 
                rondaAtual++; jogoAtivo = true; proximaRonda(); 
            }, 1800);
        } else {
            atualizarPontos(); desenharGuiasJogo(); 
        }
    } else {
        erros++; 
        certos = Math.max(0, certos - 1); 
        somErro.currentTime = 0; somErro.play().catch(() => {});

        if (areaDesenho) {
            areaDesenho.style.backgroundColor = "#fde8e8";
            setTimeout(() => { if (areaDesenho) areaDesenho.style.backgroundColor = "#fffdf5"; }, 500);
        }

        trajetoAtual.forEach(p => p.hit = false); 
        desenharGuiasJogo(); 
        atualizarBarraEstado(false);
    }
}

function darAjuda() {
    if (!jogoAtivo || ajudaEmCurso || tracoAtualIndex >= tracosLetra.length) return;
    
    ajudasUsadas++; 
    certos = Math.max(0, certos - 1); 
    atualizarBarraEstado(false);

    ajudaEmCurso = true; isDrawing = false; 
    document.getElementById('ponto-inicio').style.opacity = '0'; 
    document.getElementById('ponto-fim').style.opacity = '0';
    desenharGuiasJogo();
    
    const hand = document.getElementById('game-hand');
    if(hand) { hand.style.opacity = 1; hand.innerText = "👆"; }
    
    let trajetoAtual = tracosLetra[tracoAtualIndex];
    let step = 0;
    
    function animarAjuda() {
        if (!jogoAtivo || !document.getElementById('game-hand')) { ajudaEmCurso = false; return; }
        if (step === 0) {
            ctx.beginPath(); ctx.lineWidth = 18; ctx.strokeStyle = corTemaAtual; ctx.lineCap = "round"; ctx.lineJoin = "round";
            ctx.moveTo(trajetoAtual[0].x, trajetoAtual[0].y);
        }
        if (step < trajetoAtual.length && hand) {
            const pt = trajetoAtual[step];
            hand.style.left = (pt.x - 22) + "px"; hand.style.top = (pt.y - 5) + "px";
            if(step > 10) hand.innerText = "✊"; 
            ctx.lineTo(pt.x, pt.y); ctx.stroke();
            step += 4; 
            if (step >= trajetoAtual.length) step = trajetoAtual.length - 1; 
            if (step < trajetoAtual.length - 1) { 
                setTimeout(animarAjuda, 12); 
            } else {
                const lastPt = trajetoAtual[trajetoAtual.length - 1];
                hand.style.left = (lastPt.x - 22) + "px"; hand.style.top = (lastPt.y - 5) + "px";
                ctx.lineTo(lastPt.x, lastPt.y); ctx.stroke();
                setTimeout(() => {
                    if(hand) hand.style.opacity = 0; 
                    document.getElementById('ponto-inicio').style.opacity = '1'; 
                    document.getElementById('ponto-fim').style.opacity = '1';
                    desenharGuiasJogo(); 
                    ajudaEmCurso = false; 
                }, 800);
            }
        }
    }
    animarAjuda();
}

function finalizarJogo() {
    jogoAtivo = false;
    if(audioInstrucao) audioInstrucao.pause();
    
    let imagemFeedback = DADOS.icons.feedbacks.feedback4;
    if (certos >= 9) imagemFeedback = DADOS.icons.feedbacks.feedback1;
    else if (certos >= 7) imagemFeedback = DADOS.icons.feedbacks.feedback2;
    else if (certos >= 5) imagemFeedback = DADOS.icons.feedbacks.feedback3;

    if (certos <= 4) {
        somErro.currentTime = 0; somErro.play().catch(() => {});
    } else {
        somAcerto.currentTime = 0; somAcerto.play().catch(() => {});
    }

    let estrelasHtml = "";
    for (let i = 0; i < Math.min(certos, 10); i++) { estrelasHtml += "⭐ "; }
    if (estrelasHtml === "") estrelasHtml = "💪 Continua a treinar!";

    const contentor = document.getElementById('contentor-jogo');
    contentor.innerHTML = `
      <div class="ecra-feedback-container">
        <img src="${imagemFeedback}" alt="Feedback" class="ecra-feedback-imagem">
        <div class="ecra-feedback-estrelas">${estrelasHtml}</div>
        <div class="container-botoes-feedback">
            <button onclick="iniciarJogo()" class="btn-feedback btn-feedback-primario">Jogar de novo</button>
            <button onclick="window.location.href='../'" class="btn-feedback btn-feedback-secundario">Outro jogo</button>
        </div>
      </div>
    `;
    const barra = document.getElementById('barra-inferior');
    if (barra) barra.innerHTML = '';
}

// Inicia a capa para carregar o jogo corretamente
carregarCapaJogo();
