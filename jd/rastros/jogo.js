// ============================================================
// 1. ESTADO GLOBAL E SONS
// ============================================================
let jogoAtivo = false;
let modoJogo = 'CPU';      
let nivelJogo = 1;         
let mostrarDicas = true;  
let matchScore = [0, 0];  
let turnoAtual = 0;        
let currentGameNum = 1;    
let totalRondas = 3;       
let tabuleiro = [];        
let posBranca = { x: 4, y: 2 }; 
let simuInterval;         

// ============================================================
// 2. CONFIGURAÇÃO VISUAL (CSS INJETADO RESPONSIVO)
// ============================================================
const style = document.createElement('style');
style.innerHTML = `
    .status-container { width: 100%; display: flex; justify-content: space-between; align-items: center; }
    .status-pill { padding: 5px 15px; border-radius: 20px; font-weight: 900; font-size: 0.9rem; color: white; transition: 0.3s; }
    .score-group { display: flex; gap: 8px; }
    .score-box { padding: 5px 10px; border-radius: 12px; color: white; font-weight: 900; display: flex; align-items: center; gap: 6px; font-size: 1rem; min-width: 55px; justify-content: center; }
    
    .box-v, .pill-j1 { background: #8cc63f !important; box-shadow: 0 3px 0 #6da32f; }
    .box-x, .pill-j2 { background: #666699 !important; box-shadow: 0 3px 0 #4B4B75; }
    
    .blinking { animation: blinker 1s linear infinite; }
    @keyframes blinker { 50% { opacity: 0.4; } }

    #round-feedback {
        position: absolute; top: 0; left: 0; width: 100%; height: 100%;
        background: rgba(255, 255, 255, 0.88); backdrop-filter: blur(6px); 
        z-index: 1000; display: none; align-items: center; justify-content: center; border-radius: 20px;
    }
    .vitoria-card { background: white; padding: 40px 30px; border-radius: 35px; box-shadow: 0 20px 45px rgba(0,0,0,0.2); text-align: center; animation: cardPop 0.4s cubic-bezier(0.17, 0.89, 0.32, 1.28); width: 85%; max-width: 380px; }
    @keyframes cardPop { 0% { transform: scale(0.7); opacity: 0; } 100% { transform: scale(1); opacity: 1; } }

    .barra-capa-layout {
        width: 100%; display: flex; align-items: center; justify-content: space-between; position: relative;
    }
    .btn-play-rect-capa { 
        height: 48px; padding: 0 38px; border-radius: 24px; background: #FFFFFF; color: #666699; 
        border: none; font-size: 1.25rem; font-weight: 900; text-transform: uppercase; 
        cursor: pointer; display: flex; align-items: center; justify-content: center; 
        box-shadow: 0 4px 10px rgba(0,0,0,0.12); transition: transform 0.1s ease, background-color 0.2s ease; 
        margin-left: auto;
    }
    .btn-play-rect-capa:active { transform: scale(0.95); }

    .btn-info-circle {
        width: 44px; height: 44px; min-width: 44px; min-height: 44px; border-radius: 50%; border: none;
        background: rgba(0,0,0,0.15); display: flex; align-items: center; justify-content: center; cursor: pointer;
        transition: transform 0.1s ease; padding: 0; flex-shrink: 0;
    }
    .btn-info-circle:active { transform: scale(0.92); }
    .btn-info-circle img { width: 24px; height: 24px; object-fit: contain; pointer-events: none; }

    .btn-modo-aprimorado {
        width: 100%; max-width: 360px; height: 60px; border-radius: 30px; border: none;
        color: white; font-weight: 900; font-size: 1.1rem; cursor: pointer;
        display: flex; align-items: center; justify-content: center; gap: 12px;
        box-shadow: 0 6px 15px rgba(0,0,0,0.15); text-transform: uppercase;
        transition: transform 0.15s ease, box-shadow 0.15s ease; padding: 0 20px;
    }
    .btn-modo-aprimorado:active {
        transform: scale(0.96);
        box-shadow: 0 3px 8px rgba(0,0,0,0.2);
    }
    .btn-modo-cpu { background: linear-gradient(135deg, #666699 0%, #4B4B75 100%); }
    .btn-modo-pvp { background: linear-gradient(135deg, #7A7A99 0%, #525266 100%); }
    .btn-modo-voltar { background: #9E9EA8; max-width: 160px; height: 45px; border-radius: 22px; font-size: 0.95rem; }

    /* Botões de feedback */
    .btn-feedback-container { display: flex; gap: 12px; justify-content: center; margin-top: 15px; margin-bottom: 5px; flex-wrap: wrap; width: 100%; }
    .btn-feedback-solid {
        background-color: #666699; color: #FFFFFF; border: none;
        padding: 12px 24px; border-radius: 30px; font-weight: 900; font-size: 0.95rem;
        cursor: pointer; box-shadow: 0 4px 12px rgba(102,102,153,0.3); transition: transform 0.1s ease;
    }
    .btn-feedback-solid:active { transform: scale(0.95); }
    .btn-feedback-outline {
        background-color: #FFFFFF; color: #666699; border: 3px solid #666699;
        padding: 12px 24px; border-radius: 30px; font-weight: 900; font-size: 0.95rem;
        cursor: pointer; box-shadow: 0 4px 12px rgba(0,0,0,0.08); transition: transform 0.1s ease;
    }
    .btn-feedback-outline:active { transform: scale(0.95); }

    #simu-container { height: 220px; display: flex; align-items: center; justify-content: center; width: 100%; overflow: visible; margin-bottom: 5px; }

    #instrucoes-panel { 
        position: fixed; top: 0; left: 0; width: 100vw; height: 100vh; background: white; z-index: 9999; 
        transition: transform 0.4s cubic-bezier(0.4, 0, 0.2, 1); transform: translateY(105%); padding: 40px 25px; overflow-y: auto; 
    }
    #instrucoes-panel.open { transform: translateY(0); }

    .close-x { position: absolute; top: 15px; right: 20px; font-size: 2.2rem; color: #666699; cursor: pointer; font-weight: 900; line-height: 1; transition: 0.2s; }
    .close-x:hover { transform: scale(1.2); }

    .nivel-select-container { display: none; flex-direction: column; gap: 12px; width: 95%; max-width: 500px; animation: cardPop 0.3s ease; align-items: center; }
    .nivel-row { display: flex; flex-direction: row; gap: 10px; width: 100%; justify-content: center; }
    .btn-nivel { background: white; padding: 16px 10px; border-radius: 16px; border: 2px solid #eee; display: flex; flex-direction: column; align-items: center; justify-content: center; cursor: pointer; transition: 0.2s; flex: 1; min-width: 0; }
    .btn-nivel b { font-size: 0.85rem; font-weight: 900; text-transform: uppercase; margin-bottom: 4px; }
    .btn-nivel span { font-size: 0.7rem; font-weight: 700; opacity: 0.7; text-align: center; }
    .btn-nivel.l1 { border-color: #8cc63f; color: #8cc63f; }
    .btn-nivel.l2 { border-color: #666699; color: #666699; }

    .rastros-grid { display: grid; grid-template-columns: repeat(7, 1fr); gap: 4px; background: #C2C2D6; padding: 6px; border-radius: 12px; width: fit-content; margin: 0 auto; box-shadow: inset 0 2px 5px rgba(0,0,0,0.1); }
    .cell { width: var(--cell-size); height: var(--cell-size); background: white; display: flex; align-items: center; justify-content: center; font-weight: 900; font-size: 1.1rem; position: relative; border-radius: 6px; color: #bbb; }
    .cell.blocked { background: #444; color: #444; }
    .cell.white-piece { background: white; z-index: 10; }
    .cell.white-piece::after { content: ''; width: 80%; height: 80%; background: white; border: 4px solid #666699; border-radius: 50%; box-shadow: 0 0 10px rgba(0,0,0,0.2); }
    .cell.goal { background: #f0f0f0; color: #666699; border: 2px dashed #bbb; }
    .cell.valid-move { background: #ECECEF; cursor: pointer; border: 2px solid #666699; color: transparent; }

    .inst-content { max-width: 600px; margin: 0 auto; text-align: left; }
    .inst-header { color: #666699; text-align: center; font-size: 1.8rem; font-weight: 900; margin-bottom: 25px; text-transform: uppercase; border-bottom: 3px solid #ECECEF; padding-bottom: 10px; }
    .inst-section-title { color: #444; font-size: 1.2rem; font-weight: 800; margin: 20px 0 10px; display: flex; align-items: center; gap: 10px; }
    .inst-section-title::before { content: ''; width: 6px; height: 22px; background: #666699; border-radius: 3px; display: inline-block; }
    .inst-text { color: #666; font-size: 1.05rem; line-height: 1.6; margin-bottom: 15px; }
    .inst-list { list-style: none; padding: 0; }
    .inst-list li { background: #f9f9f9; margin-bottom: 8px; padding: 12px 15px; border-radius: 12px; border-left: 4px solid #666699; color: #555; font-size: 1rem; line-height: 1.4; }

    @media screen and (min-width: 1025px) { :root { --cell-size: 55px; } }
    @media screen and (max-width: 500px) and (orientation: portrait) { :root { --cell-size: 10.5vw; } }
    @media screen and (max-height: 500px) and (orientation: landscape) { :root { --cell-size: 9vh; } }
`;
document.head.appendChild(style);

// ============================================================
// 3. CAPA COM ANIMAÇÃO REAL E BOTÃO INFO NA BARRA INFERIOR
// ============================================================
function atualizarBarraCapa() {
    const barra = document.getElementById('barra-inferior');
    if (!barra) return;

    const iconeInfoPath = DADOS.icons.info;

    barra.innerHTML = `
        <div class="barra-capa-layout">
            <button class="btn-info-circle" onclick="toggleInstructions()" aria-label="Instruções">
              <img src="${iconeInfoPath}" alt="Info">
            </button>
            <button class="btn-play-rect-capa" onclick="ecraModosJogo()">JOGAR</button>
        </div>
    `;
}

function mostrarCapa() {
    if (jogoAtivo) return;
    
    if(!document.getElementById('instrucoes-panel')) {
        const panel = document.createElement('div');
        panel.id = 'instrucoes-panel';
        panel.innerHTML = `
            <span class="close-x" onclick="toggleInstructions()">&times;</span>
            <div class="inst-content">
                <div class="inst-header">Como Jogar</div>
                <div class="inst-section-title">Objetivo</div>
                <p class="inst-text">Vence o jogador que conseguir levar a <b>peça branca</b> até à sua casa final ou deixar o adversário sem movimentos ao longo de 3 rondas.</p>
                <ul class="inst-list">
                    <li><b>Jogador 1 (Canto Inferior):</b> Deve chegar à casa <b>1</b>.</li>
                    <li><b>Jogador 2 (Canto Superior):</b> Deve chegar à casa <b>2</b>.</li>
                </ul>
                <div class="inst-section-title">Regras Principais</div>
                <ul class="inst-list">
                    <li><b>1.</b> A peça branca começa no centro do tabuleiro.</li>
                    <li><b>2.</b> Podes mover a peça para qualquer casa vazia ao lado (horizontal, vertical ou diagonal).</li>
                    <li><b>3.</b> Quando a peça sai de uma casa, essa casa fica <b>bloqueada</b> e ninguém pode voltar a passar por lá.</li>
                </ul>
                <div style="height:40px;"></div>
            </div>
        `;
        document.body.appendChild(panel);
        
        const feedback = document.createElement('div');
        feedback.id = 'round-feedback';
        const contentorAno = document.querySelector('.botao-ano');
        if (contentorAno) contentorAno.appendChild(feedback);
    }

    const area = document.getElementById('contentor-jogo');
    area.innerHTML = `
        <div id="simu-container"><div id="simu-board" style="transform: scale(0.65);"></div></div>
    `;
    
    atualizarBarraCapa();
    iniciarSimulacao();
}

function ecraModosJogo() {
    clearInterval(simuInterval);
    const area = document.getElementById('contentor-jogo');
    area.innerHTML = `
        <div style="display:flex; flex-direction:column; align-items:center; justify-content:center; gap: 16px; width: 100%;">
            <h2 style="color:#262638; font-weight:900; text-transform:uppercase; font-size: clamp(1.2rem, 2vw, 1.6rem); margin-bottom: 5px; text-align: center;">Escolhe o Modo de Jogo</h2>
            <button class="btn-modo-aprimorado btn-modo-cpu" onclick="mostrarNiveis('CPU')"><i class="fas fa-robot"></i> COMPUTADOR</button>
            <button class="btn-modo-aprimorado btn-modo-pvp" onclick="mostrarNiveis('PVP')"><i class="fas fa-users"></i> 2 JOGADORES</button>
            <div id="nivel-select-container" class="nivel-select-container" style="display:none; margin-top: 10px;"></div>
            <button class="btn-modo-aprimorado btn-modo-voltar" onclick="mostrarCapa()">VOLTAR</button>
        </div>
    `;
    const barra = document.getElementById('barra-inferior');
    if (barra) barra.innerHTML = '';
}

function mostrarNiveis(modo) {
    const container = document.getElementById('nivel-select-container');
    if(!container) return;
    container.style.display = 'flex';
    if (modo === 'CPU') {
        container.innerHTML = `<p style="font-weight:800; color:#888; margin-bottom:5px; font-size:0.8rem;">DESAFIO CONTRA PC:</p>
            <div class="nivel-row">
                <div class="btn-nivel l1" onclick="setModo('CPU', 1)"><b>Nível 1</b><span>Aprender</span></div>
                <div class="btn-nivel l2" onclick="setModo('CPU', 2)"><b>Nível 2</b><span>Jogar</span></div>
            </div>`;
    } else {
        container.innerHTML = `<p style="font-weight:800; color:#888; margin-bottom:5px; font-size:0.8rem;">2 JOGADORES (PVP):</p>
            <div class="nivel-row">
                <div class="btn-nivel l1" onclick="setModo('PVP', 1)"><b>Nível 1</b><span>Aprender</span></div>
                <div class="btn-nivel l2" onclick="setModo('PVP', 2)"><b>Nível 2</b><span>Jogar</span></div>
            </div>`;
    }
}

function toggleInstructions() { 
    const panel = document.getElementById('instrucoes-panel');
    if (panel) panel.classList.toggle('open'); 
}

// ============================================================
// 4. LÓGICA CORE DO JOGO E IA
// ============================================================
function setModo(modo, nivel) {
    clearInterval(simuInterval);
    modoJogo = modo; nivelJogo = nivel;
    mostrarDicas = (nivel === 1);
    matchScore = [0, 0]; currentGameNum = 1; turnoAtual = 0; iniciarJogo();
}

function iniciarJogo() {
    jogoAtivo = true;
    tabuleiro = Array(7).fill().map(() => Array(7).fill(0));
    posBranca = { x: 4, y: 2 }; 
    tabuleiro[posBranca.y][posBranca.x] = 2;
    const feedback = document.getElementById('round-feedback');
    if (feedback) feedback.style.display = 'none';
    atualizarUI();
}

function atualizarUI() {
    const pcLabel = "PC";
    const j2Label = "JOGADOR 2";
    let turnInfoHTML = "";
    
    if (modoJogo === 'CPU') {
        if (turnoAtual === 0) {
            turnInfoHTML = `<div class="status-pill pill-j1 blinking">JOGADOR 1</div>`;
        } else {
            turnInfoHTML = `<div class="status-pill pill-j2 blinking">PC</div>`; 
        }
    } else {
        const classPill = (turnoAtual === 0) ? "pill-j1" : "pill-j2";
        const nomeVez = (turnoAtual === 0) ? "JOGADOR 1" : "JOGADOR 2";
        turnInfoHTML = `<div class="status-pill ${classPill} blinking">${nomeVez}</div>`;
    }

    const barra = document.getElementById('barra-inferior');
    if (barra) {
        barra.style.display = "flex";
        barra.innerHTML = `
            ${turnInfoHTML}
            <div class="score-group">
                <div class="score-box box-v">J1: ${matchScore[0]}</div>
                <div class="score-box box-x">${modoJogo === 'CPU' ? 'PC' : 'J2'}: ${matchScore[1]}</div>
            </div>
        `;
    }
    renderTabuleiro();
}

function renderTabuleiro() {
    const area = document.getElementById('contentor-jogo');
    if (!area) return;
    let html = `<div class="rastros-grid">`;
    for (let y = 0; y < 7; y++) {
        for (let x = 0; x < 7; x++) {
            let classe = "cell", conteudo = "";
            if (x === 0 && y === 6) { classe += " goal"; conteudo = "1"; }
            if (x === 6 && y === 0) { classe += " goal"; conteudo = "2"; }
            if (tabuleiro[y][x] === 1) classe += " blocked";
            if (tabuleiro[y][x] === 2) classe += " white-piece";
            const dx = Math.abs(x - posBranca.x), dy = Math.abs(y - posBranca.y);
            const humanoPodeJogar = (turnoAtual === 0) || (turnoAtual === 1 && modoJogo === 'PVP');
            if (humanoPodeJogar && tabuleiro[y][x] === 0 && dx <= 1 && dy <= 1 && !(dx === 0 && dy === 0)) {
                if (mostrarDicas) classe += " valid-move";
                html += `<div class="${classe}" onclick="moverPeca(${x},${y})"></div>`;
            } else { html += `<div class="${classe}">${conteudo}</div>`; }
        }
    }
    html += `</div>`;
    area.innerHTML = html;
}

function moverPeca(nx, ny) {
    if (!jogoAtivo) return;
    tabuleiro[posBranca.y][posBranca.x] = 1;
    posBranca = { x: nx, y: ny };
    tabuleiro[ny][nx] = 2;
    if (nx === 0 && ny === 6) { finalizarRonda(0); return; }
    if (nx === 6 && ny === 0) { finalizarRonda(1); return; }
    if (getMovimentosPosiveis(nx, ny).length === 0) { finalizarRonda(turnoAtual); return; }
    turnoAtual = (turnoAtual === 0) ? 1 : 0;
    if (modoJogo === 'CPU' && turnoAtual === 1) { atualizarUI(); setTimeout(cpuControlador, 600); }
    else { atualizarUI(); }
}

function cpuControlador() {
    let moves = getMovimentosPosiveis(posBranca.x, posBranca.y);
    if (moves.length === 0) { finalizarRonda(0); return; }
    let move;
    // Dificuldade Ajustada para 2 Níveis: Nível 2 joga de forma mais inteligente/estratégica
    if (nivelJogo === 2) {
        move = moves.reduce((best, curr) => {
            let score = avaliarFuturo(curr.x, curr.y);
            return (score > best.score) ? {m: curr, score: score} : best;
        }, {m: moves[0], score: -100}).m;
    } else {
        moves.sort((a, b) => Math.hypot(a.x - 6, a.y - 0) - Math.hypot(b.x - 6, b.y - 0));
        move = moves.find(m => m.x === 6 && m.y === 0) || moves[0];
    }
    moverPeca(move.x, move.y);
}

function avaliarFuturo(nx, ny) {
    let tempTab = tabuleiro.map(row => [...row]);
    tempTab[posBranca.y][posBranca.x] = 1;
    let jogadasJ1 = 0;
    for (let dy = -1; dy <= 1; dy++) for (let dx = -1; dx <= 1; dx++) {
        let tx = nx + dx, ty = ny + dy;
        if (tx >= 0 && tx < 7 && ty >= 0 && ty < 7 && tempTab[ty][tx] === 0 && !(dx === 0 && dy === 0)) jogadasJ1++;
    }
    return -jogadasJ1;
}

function getMovimentosPosiveis(cx, cy) {
    let possiveis = [];
    for (let dy = -1; dy <= 1; dy++) for (let dx = -1; dx <= 1; dx++) {
        let nx = cx + dx, ny = cy + dy;
        if (nx >= 0 && nx < 7 && ny >= 0 && ny < 7 && tabuleiro[ny][nx] === 0 && !(dx===0 && dy===0)) possiveis.push({ x: nx, y: ny });
    }
    return possiveis;
}

// ============================================================
// 5. FINALIZAÇÃO E FEEDBACK DAS RONDAS
// ============================================================
function finalizarRonda(vencedorIdx) {
    jogoAtivo = false;
    matchScore[vencedorIdx]++;
    const overlay = document.getElementById('round-feedback');
    const nomeVencedor = vencedorIdx === 0 ? "JOGADOR 1" : (modoJogo === 'CPU' ? "PC" : "JOGADOR 2");
    const corVencedor = vencedorIdx === 0 ? "#8cc63f" : "#666699";

    let imagemFeedback = DADOS.icons.feedbacks.feedback1;
    if (modoJogo === 'CPU' && vencedorIdx === 1) {
        imagemFeedback = DADOS.icons.feedbacks.feedback4;
    }

    if (overlay) {
        overlay.style.display = 'flex';
        // Imagem aumentada para maior destaque no pop-up da ronda
        overlay.innerHTML = `<div class="vitoria-card">
            <img src="${imagemFeedback}" style="height:140px; width:100%; object-fit:contain; margin-bottom:15px;">
            <h1 style="color:${corVencedor}; font-size:2.1rem; font-weight:900; margin:0; text-transform:uppercase;">${nomeVencedor}</h1>
            <p style="color:#666; font-size:1.1rem; font-weight:700; margin:6px 0 0 0;">Venceu esta ronda!</p>
            <div style="margin-top:18px; padding-top:15px; border-top:2px dashed #eee; color:#888; font-weight:800; font-size: 1.05rem;">PLACAR: ${matchScore[0]} - ${matchScore[1]}</div>
        </div>`;
    }
    
    if (currentGameNum >= totalRondas || matchScore[0] >= 2 || matchScore[1] >= 2) {
        setTimeout(finalizarMatch, 2800);
    } else {
        setTimeout(() => { currentGameNum++; turnoAtual = 0; iniciarJogo(); }, 2800);
    }
}

function finalizarMatch() {
    const overlay = document.getElementById('round-feedback');
    if (overlay) overlay.style.display = 'none';
    
    const vencedorIdx = (matchScore[0] > matchScore[1]) ? 0 : ((matchScore[1] > matchScore[0]) ? 1 : (matchScore[0] >= matchScore[1] ? 0 : 1));
    const nomeVencedor = vencedorIdx === 0 ? "JOGADOR 1" : (modoJogo === 'CPU' ? "PC" : "JOGADOR 2");
    
    let imagemFeedbackFinal = DADOS.icons.feedbacks.feedback1;
    if (modoJogo === 'CPU' && vencedorIdx === 1) {
        imagemFeedbackFinal = DADOS.icons.feedbacks.feedback4;
    }

    const contentor = document.getElementById('contentor-jogo');
    if (contentor) {
        // Imagem final maior e espaçamento otimizado para aproveitar bem o ecrã
        contentor.innerHTML = `<div style="text-align:center; display: flex; flex-direction: column; align-items: center; justify-content: center; width: 100%;">
            <img src="${imagemFeedbackFinal}" style="height:150px; max-width: 100%; object-fit:contain; margin-bottom:12px;">
            <h2 style="color:#666699; font-weight:900; text-transform:uppercase; margin-bottom:12px; font-size: 1.5rem;">GANHOU O ${nomeVencedor}</h2>
            <div style="display:flex; justify-content:center; gap:20px; margin-bottom: 15px;">
                <div class="score-box box-v" style="padding:10px 20px; font-size:1.15rem;">J1: ${matchScore[0]}</div>
                <div class="score-box box-x" style="padding:10px 20px; font-size:1.15rem;">${modoJogo === 'CPU' ? 'PC' : 'J2'}: ${matchScore[1]}</div>
            </div>
        </div>`;
    }
        
    // Mantém a barra inferior visível no final com os botões de ação ("Jogar de novo" / "Outro jogo")
    const barra = document.getElementById('barra-inferior');
    if (barra) {
        barra.style.display = "flex";
        barra.innerHTML = `
            <div class="btn-feedback-container" style="margin: 0; width: 100%;">
                <button class="btn-feedback-solid" onclick="location.reload()">Jogar de novo</button>
                <button class="btn-feedback-outline" onclick="window.location.href='../../'">Outro jogo</button>
            </div>
        `;
    }
}

function iniciarSimulacao() {
    clearInterval(simuInterval);
    const board = document.getElementById('simu-board');
    let sTab = Array(7).fill().map(() => Array(7).fill(0));
    let sPos = { x: 4, y: 2 };
    sTab[sPos.y][sPos.x] = 2;
    const render = () => {
        if(!board) return;
        let h = `<div class="rastros-grid" style="opacity:0.6; pointer-events:none;">`;
        for (let y = 0; y < 7; y++) for (let x = 0; x < 7; x++) h += `<div class="cell ${x===0&&y===6?'goal':(x===6&&y===0?'goal':'')} ${sTab[y][x]===1?'blocked':(sTab[y][x]===2?'white-piece':'')}"></div>`;
        board.innerHTML = h + `</div>`;
    };
    simuInterval = setInterval(() => {
        let moves = [];
        for (let dy=-1; dy<=1; dy++) for (let dx=-1; dx<=1; dx++) {
            let nx=sPos.x+dx, ny=sPos.y+dy;
            if(nx>=0 && nx<7 && ny>=0 && ny<7 && sTab[ny][nx]===0 && !(dx===0&&dy===0)) moves.push({x:nx, y:ny});
        }
        if (moves.length === 0 || Math.random() > 0.92) { sTab=Array(7).fill().map(()=>Array(7).fill(0)); sPos={x:4,y:2}; sTab[sPos.y][sPos.x]=2; }
        else { let m=moves[Math.floor(Math.random()*moves.length)]; sTab[sPos.y][sPos.x]=1; sPos=m; sTab[sPos.y][sPos.x]=2; }
        render();
    }, 800);
}

// Inicializar a capa ao carregar
mostrarCapa();
