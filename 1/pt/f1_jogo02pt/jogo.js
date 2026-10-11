// ==========================================
// 1. ESTADO GLOBAL E SONS
// ==========================================
let jogoAtivo = false;
let rondaAtual = 0, totalRondas = 10, certos = 0, erros = 0, ajudasUsadas = 0;
let itemDestaque = null;
let audioInstrucoes = null;

const somAcerto = new Audio(JOGO_CONFIG.caminhoSons + JOGO_CONFIG.sons.acerto);
const somErro = new Audio(JOGO_CONFIG.caminhoSons + JOGO_CONFIG.sons.erro);
const somClique = new Audio(JOGO_CONFIG.caminhoSons + JOGO_CONFIG.sons.clique);

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
const style = document.createElement('style');
style.innerHTML = `
    .btn-play-rect { flex: 1; height: 65px; border-radius: 35px; background: var(--primary-color); color: white; border: none; font-size: 1.5rem; font-weight: 900; text-transform: uppercase; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 15px; box-shadow: 0 5px 15px rgba(0,0,0,0.1); transition: 0.2s; z-index: 100; }
    .btn-audio-circle { width: 65px; height: 65px; cursor: pointer; flex-shrink: 0; z-index: 100; }

    .grafismo-area {
        position: relative; width: 100%; max-width: 800px; height: 320px;
        background: #fdfdfd; border: 4px dashed #e0e0e0; border-radius: 30px;
        margin: 0 auto; display: flex; justify-content: space-between; align-items: center;
        padding: 0 40px; overflow: hidden;
        transition: background-color 0.3s ease;
    }

    .ponto-inicio {
        width: 35px; height: 35px; border-radius: 50%; 
        background: var(--primary-color); border: 4px solid #fff; 
        box-shadow: 0 0 0 5px var(--primary-color), 0 4px 10px rgba(0,0,0,0.2); 
        z-index: 10; position: relative; flex-shrink: 0;
    }
    
    .ponto-fim { 
        font-size: 3.5rem; color: #d0d0d0; z-index: 10; position: relative; 
        transition: 0.3s; flex-shrink: 0; display: flex; align-items: center; justify-content: center;
    }

    .animating { animation: pulse 1s infinite alternate; }
    @keyframes pulse { from { transform: scale(1); } to { transform: scale(1.3); } }

    canvas { position: absolute; top: 0; left: 0; z-index: 5; cursor: pointer; touch-action: none; }
    canvas:active { cursor: grabbing; }

    @media screen and (max-width: 500px) {
        .grafismo-area { height: 240px; padding: 0 20px; }
        .ponto-inicio { width: 25px; height: 25px; }
        .ponto-fim { font-size: 2.5rem; }
    }
`;
document.head.appendChild(style);

// ==========================================
// 3. LÓGICA DE CAPA COM SIMULAÇÃO ANIMADA
// ==========================================
function tocarAudioInstrucoes() {
    somClique.currentTime = 0; somClique.play().catch(e=>console.log(e));
    if (window.speechSynthesis) window.speechSynthesis.cancel();
    if (audioInstrucoes) { audioInstrucoes.pause(); audioInstrucoes.currentTime = 0; }
    else { audioInstrucoes = new Audio(JOGO_CONFIG.caminhoSons + "f1_jogo02pt.mp3"); }
    
    audioInstrucoes.play().catch(() => {
        const utter = new SpeechSynthesisUtterance("Começa na bola e arrasta o dedo pela linha até à seta, sem saíres do traço!");
        utter.lang = 'pt-PT'; window.speechSynthesis.speak(utter);
    });
}

function mostrarCapa() {
    if (jogoAtivo) return;
    document.getElementById('shell-header-content').innerHTML = `<h2 style="color:var(--primary-color); font-weight:900; text-transform:uppercase;">${JOGO_CONFIG.nomeDoJogo}</h2>`;
    
    document.getElementById('game-content').innerHTML = `
        <div style="display:flex; flex-direction:column; align-items:center; width: 100%;">
            <div class="grafismo-area" id="simu-area" style="transform: scale(0.8); height: 220px; border-color: var(--primary-color); margin-bottom: -10px;">
                <div class="ponto-inicio" id="simu-inicio"></div>
                <canvas id="simu-canvas"></canvas>
                <div class="ponto-fim" id="simu-fim"><i class="fas fa-arrow-right"></i></div>
                <div id="simu-hand" style="position:absolute; font-size:3rem; z-index:100; pointer-events:none; filter: drop-shadow(2px 4px 4px rgba(0,0,0,0.3)); transition: opacity 0.3s;">👆</div>
            </div>
            <p style="color:var(--text-grey); font-weight:800; text-align:center; font-size:1.1rem; max-width: 500px; padding: 0 15px;">
                ${JOGO_CONFIG.descricao}
            </p>
        </div>
    `;
    
    const footer = document.getElementById('shell-footer-content');
    footer.style.display = "flex";
    footer.innerHTML = `
        <img src="${JOGO_CONFIG.caminhoIconsMenu}audio.png" class="btn-audio-circle" onclick="tocarAudioInstrucoes()"> 
        <button class="btn-play-rect" onclick="iniciarJogo()"><i class="fas fa-play"></i> JOGAR</button>
    `;

    setTimeout(iniciarSimulacaoAnimada, 100);
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
        ctx.beginPath(); ctx.setLineDash([15, 15]); ctx.lineWidth = 6; ctx.strokeStyle = "#d0d0d0";
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
            sCtx.beginPath(); sCtx.lineWidth = 14; sCtx.strokeStyle = "var(--primary-color)"; sCtx.lineCap = "round"; sCtx.lineJoin = "round";
            sCtx.moveTo(path[0].x, path[0].y);
            if(hand) { hand.style.opacity = 1; hand.innerText = "👆"; }
        }

        if (step < path.length && hand) {
            const pt = path[step];
            hand.style.left = (pt.x - 22) + "px"; 
            hand.style.top = (pt.y - 5) + "px"; 
            
            if(step > 10) hand.innerText = "✊"; 
            
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
// 4. LÓGICA DE JOGO PRINCIPAL
// ==========================================
function iniciarJogo() {
    clearTimeout(simuTimer); 
    jogoAtivo = true; rondaAtual = 1; certos = 0; erros = 0; ajudasUsadas = 0; 
    totalRondas = 10; 
    ajudaEmCurso = false;
    
    const padroes = [
        "onda", "onda_larga", "onda_assimetrica", "onda_crescente", 
        "lacos", "lacos_duplos", "molas", 
        "montanha", "arcos_baixo", "castelo_curvo"
    ];
    sequenciaNiveis = [];
    
    let deck = [...padroes]; 
    deck.sort(() => Math.random() - 0.5);
    for(let i=0; i<10; i++) sequenciaNiveis.push({ tipo: deck[i] });

    proximaRonda();
}

function proximaRonda() {
    if (rondaAtual > totalRondas) { finalizarJogo(); return; }
    
    ajudaEmCurso = false;
    Engine.showStatusBar(rondaAtual, totalRondas, certos, erros, ajudasUsadas < 2);
    const area = document.getElementById('game-content');
    itemDestaque = sequenciaNiveis[rondaAtual - 1]; 
    
    area.innerHTML = `
        <div class="grafismo-area" id="area-desenho">
            <div class="ponto-inicio" id="ponto-inicio"></div>
            <canvas id="linhaCanvas"></canvas>
            <div class="ponto-fim" id="ponto-fim"><i class="fas fa-arrow-right"></i></div>
            <div id="game-hand" style="position:absolute; font-size:3rem; z-index:100; pointer-events:none; opacity:0; filter: drop-shadow(2px 4px 4px rgba(0,0,0,0.3)); transition: opacity 0.3s;">👆</div>
        </div>
    `;
    setTimeout(configurarCanvas, 100); 
}

function desenharGuiasJogo() {
    ctx.beginPath(); ctx.lineWidth = 40; ctx.strokeStyle = "#ffffff"; ctx.lineCap = "round"; ctx.lineJoin = "round";
    ctx.moveTo(pontosCaminho[0].x, pontosCaminho[0].y);
    pontosCaminho.forEach(pt => ctx.lineTo(pt.x, pt.y));
    ctx.stroke();

    ctx.beginPath(); ctx.setLineDash([15, 15]); ctx.lineWidth = 6; ctx.strokeStyle = "#c0c0c0"; ctx.lineCap = "round"; ctx.lineJoin = "round";
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
// GERADOR DE CURVAS (MATEMÁTICA)
// ==========================================
function gerarPontosGrafismos(tipo, sX, sY, eX, eY) {
    let pts = [];
    const w = eX - sX;
    const h = 75; 
    const steps = 250; 
    
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
            currY = sY - (Math.sin(prog * Math.PI * 2 * 1.5) * h);
        }
        else if (tipo === "onda_assimetrica") {
            currY = sY - (Math.sin(t) + 0.5 * Math.sin(2 * t)) * (h * 0.65);
        }
        else if (tipo === "onda_crescente") {
            let amp = 10 + prog * (h - 10);
            currY = sY - Math.sin(prog * Math.PI * 2 * 4) * amp;
        }
        else if (tipo === "lacos") {
            let radius = h * 0.7;
            currX = sX + w * prog - Math.sin(t) * radius;
            currY = sY - Math.cos(t) * radius + radius; 
        }
        else if (tipo === "lacos_duplos") {
            let radius3 = h * 0.6;
            currX = sX + w * prog - Math.sin(t) * radius3 * 0.4; 
            currY = sY - Math.sin(t * 2) * radius3; 
        }
        else if (tipo === "molas") {
            let tMola = prog * Math.PI * 2 * 6;
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
            currY = sY - (Math.sin(t) + (1/3)*Math.sin(3*t) + (1/5)*Math.sin(5*t)) * (h * 0.8);
        }

        pts.push({ x: currX, y: currY, hit: false });
    }

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
    ctx.lineWidth = 14; ctx.strokeStyle = "var(--primary-color)"; ctx.lineCap = "round"; ctx.lineJoin = "round";
}

function draw(e) {
    if (!isDrawing || !jogoAtivo || ajudaEmCurso) return;
    e.preventDefault();
    const pos = getClientOffset(e);
    
    let dist = Math.hypot(pos.x - posAtualX, pos.y - posAtualY);
    let steps = Math.max(1, Math.floor(dist / 5)); 
    
    for(let s = 1; s <= steps; s++) {
        let chkX = posAtualX + (pos.x - posAtualX)*(s/steps); 
        let chkY = posAtualY + (pos.y - posAtualY)*(s/steps);
        
        let minDist = Infinity; let closestIdx = -1;
        for(let i=0; i<pontosCaminho.length; i++) {
            let d = Math.hypot(chkX - pontosCaminho[i].x, chkY - pontosCaminho[i].y);
            if(d < minDist) { minDist = d; closestIdx = i; }
        }
        
        if (minDist > 55) saiuDoCaminho = true; 
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
    
    let accuraciaNecessaria = 0.55; 
    
    if (distanciaFim < 80 && accuracia >= accuraciaNecessaria && !saiuDoCaminho) {
        jogoAtivo = false; certos++; 
        somAcerto.currentTime = 0; somAcerto.play().catch(e=>console.log(e));
        
        const endEl = document.getElementById('ponto-fim');
        if(endEl) { endEl.style.color = "#8cc63f"; endEl.classList.add('animating'); }
        const areaDesenho = document.getElementById('area-desenho');
        if(areaDesenho) areaDesenho.style.borderColor = "#8cc63f";
        
        setTimeout(() => { rondaAtual++; jogoAtivo = true; proximaRonda(); }, 1500);
    } else {
        erros++; 
        somErro.currentTime = 0; somErro.play().catch(e=>console.log(e));
        ctx.clearRect(0, 0, canvas.width, canvas.height); 
        desenharGuiasJogo(); 
        Engine.showStatusBar(rondaAtual, totalRondas, certos, erros, ajudasUsadas < 2);
    }
}

// ==========================================
// SISTEMA DE AJUDA ANIMADO (MÁX 2 VEZES)
// ==========================================
function darAjuda() {
    if (!jogoAtivo || ajudaEmCurso || ajudasUsadas >= 2) return;
    
    ajudasUsadas++; 
    certos = Math.max(0, certos - 1); 
    somClique.currentTime = 0; somClique.play().catch(e=>console.log(e));
    
    Engine.showStatusBar(rondaAtual, totalRondas, certos, erros, ajudasUsadas < 2);

    ajudaEmCurso = true;
    isDrawing = false; 
    
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    desenharGuiasJogo();
    
    const hand = document.getElementById('game-hand');
    if(hand) {
        hand.style.opacity = 1;
        hand.innerText = "👆";
    }
    
    let step = 0;
    
    function animarAjuda() {
        if (!jogoAtivo || !document.getElementById('game-hand')) {
            ajudaEmCurso = false; return;
        }
        
        if (step === 0) {
            ctx.beginPath();
            ctx.lineWidth = 14; 
            ctx.strokeStyle = "var(--primary-color)"; 
            ctx.lineCap = "round"; ctx.lineJoin = "round";
            ctx.moveTo(pontosCaminho[0].x, pontosCaminho[0].y);
        }

        if (step < pontosCaminho.length && hand) {
            const pt = pontosCaminho[step];
            hand.style.left = (pt.x - 22) + "px"; 
            hand.style.top = (pt.y - 5) + "px";
            
            if(step > 10) hand.innerText = "✊"; 
            
            ctx.lineTo(pt.x, pt.y); 
            ctx.stroke();
            
            step += 3; 
            
            if (step >= pontosCaminho.length) step = pontosCaminho.length - 1; 
            
            if (step < pontosCaminho.length - 1) {
                setTimeout(animarAjuda, 10); 
            } else {
                const lastPt = pontosCaminho[pontosCaminho.length - 1];
                hand.style.left = (lastPt.x - 22) + "px"; hand.style.top = (lastPt.y - 5) + "px";
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
    if(audioInstrucoes) audioInstrucoes.pause();
    
    if (certos <= 4) {
        somErro.currentTime = 0; somErro.play().catch(e=>console.log(e));
    } else {
        somAcerto.currentTime = 0; somAcerto.play().catch(e=>console.log(e));
    }

    const rel = JOGO_CONFIG.relatorios.find(r => certos >= r.min && certos <= r.max);
    Engine.showResults(certos, erros, ajudasUsadas, rel);
}

// Inicia a capa para o jogo carregar corretamente
mostrarCapa();
