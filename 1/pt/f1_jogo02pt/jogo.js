// ==========================================
// 1. ESTADO GLOBAL E SONS
// ==========================================
let jogoAtivo = false;
let rondaAtual = 1, totalRondas = 10, certos = 0, erros = 0, ajudasUsadas = 0;
let itemDestaque = null;
let audioInstrucao = null;

const somAcerto = new Audio(DADOS.sons.certo);
const somErro = new Audio(DADOS.sons.errado);

let canvas, ctx;
let isDrawing = false;
let ajudaEmCurso = false; 
let posFinalX = 0, posFinalY = 0;
let posAtualX = 0, posAtualY = 0;

let pontosCaminho = []; 
let saiuDoCaminho = false;
let simuTimer = null; 
let sequenciaNiveis = [];

// ==========================================
// 2. CONFIGURAÇÃO VISUAL (CSS INJETADO)
// ==========================================
const styleJogo = document.createElement('style');
styleJogo.innerHTML = `
    .grafismo-area {
        position: relative; width: 100%; max-width: 750px; height: 260px;
        background: #fdfdfd; border: 4px dashed #B4E4F8; border-radius: 20px;
        margin: 0 auto; display: flex; justify-content: space-between; align-items: center;
        padding: 0 40px; overflow: hidden;
        transition: background-color 0.3s ease;
    }
    .ponto-inicio {
        width: 35px; height: 35px; border-radius: 50%; 
        background: #0F8BD3; border: 4px solid #fff; 
        box-shadow: 0 0 0 5px rgba(15,139,211,0.3), 0 4px 10px rgba(0,0,0,0.2); 
        z-index: 10; position: relative; flex-shrink: 0;
    }
    .ponto-fim { 
        font-size: 3rem; color: #d0d0d0; z-index: 10; position: relative; 
        transition: 0.3s; flex-shrink: 0; display: flex; align-items: center; justify-content: center;
    }
    .animating { animation: pulse 1s infinite alternate; }
    @keyframes pulse { from { transform: scale(1); } to { transform: scale(1.3); } }
    canvas { position: absolute; top: 0; left: 0; z-index: 5; cursor: pointer; touch-action: none; }

    .botao-acao-jogo {
        width: 38px; height: 38px; min-width: 38px; min-height: 38px; border-radius: 50%; border: none;
        background: rgba(0,0,0,0.2); color: #FFFFFF; font-size: 16px;
        display: flex; align-items: center; justify-content: center; cursor: pointer; transition: transform 0.1s ease;
        padding: 0; flex-shrink: 0;
    }
    .botao-acao-jogo:active { transform: scale(0.92); }
    .botao-acao-jogo img { width: 22px; height: 22px; object-fit: contain; pointer-events: none; }
    .botao-acao-jogo:disabled { opacity: 0.4; cursor: not-allowed; transform: none; filter: grayscale(1); }

    .btn-jogar-capa {
      padding: 10px 30px !important; border-radius: 25px !important; background: #FFFFFF !important; color: #0F8BD3 !important;
      border: none !important; font-size: 1.15rem !important; font-weight: 900 !important; cursor: pointer !important; 
      box-shadow: 0 4px 8px rgba(0,0,0,0.15) !important; transition: transform 0.1s ease !important;
    }
    .btn-jogar-capa:active { transform: scale(0.95); }

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
document.head.appendChild(styleJogo);

// ==========================================
// 3. BARRA DE ESTADO DINÂMICA
// ==========================================
function atualizarBarraEstado(modoCapa = false) {
    const barra = document.getElementById('barra-inferior');
    if (!barra) return;

    const iconeSomPath = DADOS.icons.som;
    const iconeLampadaPath = DADOS.icons.lampada;

    if (modoCapa) {
        barra.innerHTML = `
            <div style="display: flex; gap: 6px;">
              <button class="botao-acao-jogo" onclick="tocarAudioInstrucoes()" aria-label="Som">
                <img src="${iconeSomPath}" alt="Som">
              </button>
            </div>
            <button class="btn-jogar-capa" onclick="iniciarJogo()">JOGAR</button>
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
// 4. CAPA E SIMULAÇÃO ANIMADA
// ==========================================
function tocarAudioInstrucoes() {
    if (window.speechSynthesis) window.speechSynthesis.cancel();
    if (audioInstrucao) { audioInstrucao.pause(); audioInstrucao.currentTime = 0; }
    else { audioInstrucao = new Audio("../../../sons/f1_jogo02pt.mp3"); }
    
    audioInstrucao.play().catch(() => {
        const utter = new SpeechSynthesisUtterance("Começa na bola e arrasta o dedo pela linha até à seta, sem saíres do traço!");
        utter.lang = 'pt-PT'; window.speechSynthesis.speak(utter);
    });
}

function carregarCapaJogo() {
  if (jogoAtivo) return;
  const contentor = document.getElementById('contentor-jogo');
  if (!contentor) return;

  contentor.innerHTML = `
    <div style="display:flex; flex-direction:column; align-items:center; justify-content:center; width:100%; height:100%;">
        <div class="grafismo-area" id="simu-area" style="transform: scale(0.9); height: 210px; margin-bottom: 5px;">
            <div class="ponto-inicio" id="simu-inicio"></div>
            <canvas id="simu-canvas"></canvas>
            <div class="ponto-fim" id="simu-fim">➡️</div>
            <div id="simu-hand" style="position:absolute; font-size:2.5rem; z-index:100; pointer-events:none; transition: opacity 0.3s;">👆</div>
        </div>
        <p style="color:#062B42; font-weight:800; text-align:center; font-size:1.05rem; max-width: 500px; margin: 0;">
            Começa na bola e arrasta o dedo pela linha até à seta, sem saíres do traço!
        </p>
    </div>
  `;

  atualizarBarraEstado(true);
  setTimeout(iniciarSimulacaoAnimada, 150);
}

function iniciarSimulacaoAnimada() {
    const sCanvas = document.getElementById('simu-canvas');
    if(!sCanvas) return;
    const sCtx = sCanvas.getContext('2d');
    const sArea = document.getElementById('simu-area');
    if(!sArea) return;
    
    sCanvas.width = sArea.clientWidth; sCanvas.height = sArea.clientHeight;
    const startEl = document.getElementById('simu-inicio');
    const endEl = document.getElementById('simu-fim');
    if(!startEl || !endEl) return;
    
    const startX = startEl.offsetLeft + (startEl.offsetWidth / 2);
    const startY = sCanvas.height / 2; 
    const endX = endEl.offsetLeft + 5;
    const endY = sCanvas.height / 2;

    const path = gerarPontosGrafismos("onda", startX, startY, endX, endY);
    
    function desenhaFundo(ctx) {
        ctx.beginPath(); ctx.setLineDash([12, 12]); ctx.lineWidth = 5; ctx.strokeStyle = "#c0c0c0";
        ctx.moveTo(path[0].x, path[0].y); path.forEach(p => ctx.lineTo(p.x, p.y)); ctx.stroke(); ctx.setLineDash([]);
    }
    desenhaFundo(sCtx);

    const hand = document.getElementById('simu-hand');
    let step = 0;
    
    function animar() {
        if (!document.getElementById('simu-canvas')) return; 
        if (step === 0) {
            sCtx.clearRect(0,0, sCanvas.width, sCanvas.height);
            desenhaFundo(sCtx);
            sCtx.beginPath(); sCtx.lineWidth = 12; sCtx.strokeStyle = "#0F8BD3"; sCtx.lineCap = "round"; sCtx.lineJoin = "round";
            sCtx.moveTo(path[0].x, path[0].y);
            if(hand) { hand.style.opacity = 1; hand.innerText = "👆"; }
        }

        if (step < path.length && hand) {
            const pt = path[step];
            hand.style.left = (pt.x - 15) + "px"; 
            hand.style.top = (pt.y - 5) + "px"; 
            if(step > 5) hand.innerText = "✊"; 
            sCtx.lineTo(pt.x, pt.y); sCtx.stroke();
            step += 2;
            simuTimer = setTimeout(animar, 15); 
        } else if(hand) {
            hand.style.opacity = 0; step = 0;
            simuTimer = setTimeout(animar, 1500); 
        }
    }
    animar();
}

// ==========================================
// 5. LÓGICA DO JOGO PRINCIPAL
// ==========================================
function iniciarJogo() {
    clearTimeout(simuTimer); 
    jogoAtivo = true; rondaAtual = 1; certos = 0; erros = 0; ajudasUsadas = 0; 
    totalRondas = 10; ajudaEmCurso = false;
    
    const padroes = ["onda", "onda_larga", "onda_assimetrica", "onda_crescente", "lacos", "lacos_duplos", "molas", "montanha", "arcos_baixo", "castelo_curvo"];
    sequenciaNiveis = [];
    let deck = [...padroes]; 
    deck.sort(() => Math.random() - 0.5);
    for(let i=0; i<10; i++) sequenciaNiveis.push({ tipo: deck[i] });

    proximaRonda();
}

function proximaRonda() {
    if (rondaAtual > totalRondas) { finalizarJogo(); return; }
    
    ajudaEmCurso = false;
    const contentor = document.getElementById('contentor-jogo');
    itemDestaque = sequenciaNiveis[rondaAtual - 1]; 
    
    contentor.innerHTML = `
      <div class="grafismo-area" id="area-desenho">
          <div class="ponto-inicio" id="ponto-inicio"></div>
          <canvas id="linhaCanvas"></canvas>
          <div class="ponto-fim" id="ponto-fim">➡️</div>
          <div id="game-hand" style="position:absolute; font-size:2.5rem; z-index:100; pointer-events:none; opacity:0; transition: opacity 0.3s;">👆</div>
      </div>
    `;

    atualizarBarraEstado(false);
    setTimeout(configurarCanvas, 100); 
}

function desenharGuiasJogo() {
    ctx.beginPath(); ctx.lineWidth = 35; ctx.strokeStyle = "#ffffff"; ctx.lineCap = "round"; ctx.lineJoin = "round";
    ctx.moveTo(pontosCaminho[0].x, pontosCaminho[0].y);
    pontosCaminho.forEach(pt => ctx.lineTo(pt.x, pt.y));
    ctx.stroke();

    ctx.beginPath(); ctx.setLineDash([12, 12]); ctx.lineWidth = 5; ctx.strokeStyle = "#c0c0c0"; ctx.lineCap = "round"; ctx.lineJoin = "round";
    ctx.moveTo(pontosCaminho[0].x, pontosCaminho[0].y);
    pontosCaminho.forEach(pt => ctx.lineTo(pt.x, pt.y));
    ctx.stroke(); ctx.setLineDash([]);
}

function configurarCanvas() {
    const container = document.getElementById('area-desenho');
    canvas = document.getElementById('linhaCanvas');
    if (!canvas || !container) return;
    ctx = canvas.getContext('2d');
    canvas.width = container.clientWidth; canvas.height = container.clientHeight;

    const startEl = document.getElementById('ponto-inicio');
    const endEl = document.getElementById('ponto-fim');
    if (!startEl || !endEl) return;
    
    const startX = startEl.offsetLeft + (startEl.offsetWidth / 2);
    const startY = canvas.height / 2;
    posFinalX = endEl.offsetLeft + 5; 
    posFinalY = canvas.height / 2;

    pontosCaminho = gerarPontosGrafismos(itemDestaque.tipo, startX, startY, posFinalX, posFinalY);
    desenharGuiasJogo();

    canvas.addEventListener('mousedown', startDrawing); canvas.addEventListener('mousemove', draw);
    canvas.addEventListener('mouseup', stopDrawing); canvas.addEventListener('mouseleave', stopDrawing);
    canvas.addEventListener('touchstart', startDrawing, {passive: false});
    canvas.addEventListener('touchmove', draw, {passive: false});
    canvas.addEventListener('touchend', stopDrawing);
}

// ==========================================
// CURVAS MATEMÁTICAS MELHORADAS E SUAS
// ==========================================
function gerarPontosGrafismos(tipo, sX, sY, eX, eY) {
    let pts = [];
    const w = eX - sX;
    const h = 70; 
    const steps = 300; // Maior resolução para curvas mais perfeitas e suaves
    let ciclos = 3;

    for(let i = 0; i <= steps; i++) {
        let prog = i / steps; 
        let t = prog * Math.PI * 2 * ciclos;
        let currX = sX + w * prog;
        let currY = sY;

        if (tipo === "onda") {
            currY = sY - (Math.sin(t) * h);
        }
        else if (tipo === "onda_larga") {
            currY = sY - (Math.sin(prog * Math.PI * 2 * 1.5) * (h * 1.1));
        }
        else if (tipo === "onda_assimetrica") {
            currY = sY - (Math.sin(t) + 0.4 * Math.sin(2 * t + 0.5)) * (h * 0.7);
        }
        else if (tipo === "onda_crescente") {
            let amp = 12 + prog * (h - 12);
            currY = sY - Math.sin(prog * Math.PI * 2 * 3.5) * amp;
        }
        else if (tipo === "lacos") {
            let radius = h * 0.65;
            currX = sX + w * prog - Math.sin(t) * (radius * 0.8);
            currY = sY - Math.cos(t) * radius + (radius * 0.8); 
        }
        else if (tipo === "lacos_duplos") {
            let radius3 = h * 0.55;
            currX = sX + w * prog - Math.sin(t) * (radius3 * 0.35); 
            currY = sY - Math.sin(t * 2) * radius3; 
        }
        else if (tipo === "molas") {
            let tMola = prog * Math.PI * 2 * 5.5;
            let radius2 = h * 0.45;
            currX = sX + w * prog - Math.sin(tMola) * radius2;
            currY = sY - Math.cos(tMola) * radius2;
        }
        else if (tipo === "montanha") {
            currY = sY - (Math.abs(Math.sin(prog * Math.PI * ciclos)) * h);
        }
        else if (tipo === "arcos_baixo") {
            currY = sY + (Math.abs(Math.sin(prog * Math.PI * ciclos)) * h);
        }
        else if (tipo === "castelo_curvo") {
            currY = sY - (Math.sin(t) + (1/3)*Math.sin(3*t) + (1/5)*Math.sin(5*t)) * (h * 0.75);
        }

        pts.push({ x: currX, y: currY, hit: false });
    }

    // Suavização leve dos pontos extremos para encaixe perfeito nas extremidades
    pts[0].x = sX; pts[0].y = sY;
    pts[pts.length-1].x = eX; pts[pts.length-1].y = eY;
    return pts;
}

function getClientOffset(e) {
    const rect = canvas.getBoundingClientRect();
    if (e.touches) return { x: e.touches[0].clientX - rect.left, y: e.touches[0].clientY - rect.top };
    return { x: e.clientX - rect.left, y: e.clientY - rect.top };
}

function startDrawing(e) {
    if (!jogoAtivo || ajudaEmCurso) return; 
    e.preventDefault();
    const pos = getClientOffset(e);
    const startPt = pontosCaminho[0];
    if (Math.hypot(pos.x - startPt.x, pos.y - startPt.y) > 50) return; 

    isDrawing = true; saiuDoCaminho = false;
    pontosCaminho.forEach(p => p.hit = false); 
    posAtualX = pos.x; posAtualY = pos.y;
    ctx.beginPath(); ctx.moveTo(pos.x, pos.y);
    ctx.lineWidth = 12; ctx.strokeStyle = "#0F8BD3"; ctx.lineCap = "round"; ctx.lineJoin = "round";
}

function draw(e) {
    if (!isDrawing || !jogoAtivo || ajudaEmCurso) return;
    e.preventDefault();
    const pos = getClientOffset(e);
    let dist = Math.hypot(pos.x - posAtualX, pos.y - posAtualY);
    let steps = Math.max(1, Math.floor(dist / 4)); 
    
    for(let s = 1; s <= steps; s++) {
        let chkX = posAtualX + (pos.x - posAtualX)*(s/steps); 
        let chkY = posAtualY + (pos.y - posAtualY)*(s/steps);
        let minDist = Infinity; let closestIdx = -1;
        for(let i=0; i<pontosCaminho.length; i++) {
            let d = Math.hypot(chkX - pontosCaminho[i].x, chkY - pontosCaminho[i].y);
            if(d < minDist) { minDist = d; closestIdx = i; }
        }
        if (minDist > 42) saiuDoCaminho = true; 
        else if (closestIdx !== -1) pontosCaminho[closestIdx].hit = true; 
    }
    posAtualX = pos.x; posAtualY = pos.y;
    ctx.lineTo(pos.x, pos.y); ctx.stroke();
}

function stopDrawing(e) {
    if (!isDrawing || ajudaEmCurso) return;
    isDrawing = false;
    ctx.closePath();
    avaliarJogada();
}

function avaliarJogada() {
    const distanciaFim = Math.hypot(posFinalX - posAtualX, posFinalY - posAtualY);
    let pontosAtingidos = pontosCaminho.filter(p => p.hit).length;
    let accuracia = pontosAtingidos / pontosCaminho.length;
    const areaDesenho = document.getElementById('area-desenho');

    if (distanciaFim < 80 && accuracia >= 0.52 && !saiuDoCaminho) {
        jogoAtivo = false; certos++; 
        somAcerto.currentTime = 0; somAcerto.play().catch(() => {});
        
        if (areaDesenho) {
            areaDesenho.style.backgroundColor = "#e8f8ec";
            setTimeout(() => { if (areaDesenho) areaDesenho.style.backgroundColor = "#fdfdfd"; }, 600);
        }

        const endEl = document.getElementById('ponto-fim');
        if (endEl) { endEl.style.color = "#8cc63f"; endEl.classList.add('animating'); }
        setTimeout(() => { rondaAtual++; jogoAtivo = true; proximaRonda(); }, 1500);
    } else {
        erros++; 
        certos = Math.max(0, certos - 1); 
        somErro.currentTime = 0; somErro.play().catch(() => {});

        if (areaDesenho) {
            areaDesenho.style.backgroundColor = "#fde8e8"; 
            setTimeout(() => { if (areaDesenho) areaDesenho.style.backgroundColor = "#fdfdfd"; }, 600);
        }

        ctx.clearRect(0, 0, canvas.width, canvas.height); 
        desenharGuiasJogo(); 
        atualizarBarraEstado(false);
    }
}

function darAjuda() {
    if (!jogoAtivo || ajudaEmCurso || ajudasUsadas >= 2) return;
    
    ajudasUsadas++; 
    certos = Math.max(0, certos - 1); 
    atualizarBarraEstado(false);

    ajudaEmCurso = true; isDrawing = false; 
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    desenharGuiasJogo();
    
    const hand = document.getElementById('game-hand');
    if(hand) { hand.style.opacity = 1; hand.innerText = "👆"; }
    
    let step = 0;
    function animarAjuda() {
        if (!jogoAtivo || !document.getElementById('game-hand')) { ajudaEmCurso = false; return; }
        if (step === 0) {
            ctx.beginPath(); ctx.lineWidth = 12; ctx.strokeStyle = "#0F8BD3"; 
            ctx.lineCap = "round"; ctx.lineJoin = "round";
            ctx.moveTo(pontosCaminho[0].x, pontosCaminho[0].y);
        }
        if (step < pontosCaminho.length && hand) {
            const pt = pontosCaminho[step];
            hand.style.left = (pt.x - 15) + "px"; hand.style.top = (pt.y - 5) + "px";
            if(step > 5) hand.innerText = "✊"; 
            ctx.lineTo(pt.x, pt.y); ctx.stroke();
            step += 2; 
            if (step >= pontosCaminho.length) step = pontosCaminho.length - 1;
            if (step < pontosCaminho.length - 1) {
                setTimeout(animarAjuda, 10); 
            } else {
                const lastPt = pontosCaminho[pontosCaminho.length - 1];
                hand.style.left = (lastPt.x - 15) + "px"; hand.style.top = (lastPt.y - 5) + "px";
                ctx.lineTo(lastPt.x, lastPt.y); ctx.stroke();
                setTimeout(() => {
                    if(hand) hand.style.opacity = 0;
                    ctx.clearRect(0, 0, canvas.width, canvas.height);
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

// Inicia o carregamento da capa para o jogo arrancar corretamente
carregarCapaJogo();
