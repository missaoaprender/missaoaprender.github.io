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

// Ligação correta aos sons vindos de DADOS
const somAcerto = { play: () => { try { if (DADOS && DADOS.sons && DADOS.sons.certo) new Audio(DADOS.sons.certo).play(); } catch(e){} } };
const somErro = { play: () => { try { if (DADOS && DADOS.sons && DADOS.sons.errado) new Audio(DADOS.sons.errado).play(); } catch(e){} } };
const somClique = { play: () => { try { if (DADOS && DADOS.sons && DADOS.sons.clique) new Audio(DADOS.sons.clique).play(); } catch(e){} } };

// ============================================================
// 2. CONFIGURAÇÃO VISUAL (CSS INJETADO)
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
        height: 48px; padding: 0 42px; border-radius: 30px; background: #FFFFFF; color: #666699; 
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

    /* Botões de feedback centralizados */
    .btn-feedback-container { display: flex; gap: 15px; justify-content: center; margin-top: 25px; margin-bottom: 10px; flex-wrap: wrap; }
    .btn-feedback-solid {
        background-color: #666699; color: #FFFFFF; border: none;
        padding: 14px 28px; border-radius: 30px; font-weight: 900; font-size: 1.05rem;
        cursor: pointer; box-shadow: 0 4px 12px rgba(102,102,153,0.3); transition: transform 0.1s ease;
    }
    .btn-feedback-solid:active { transform: scale(0.95); }
    .btn-feedback-outline {
        background-color: #FFFFFF; color: #666699; border: 3px solid #666699;
        padding: 14px 28px; border-radius: 30px; font-weight: 900; font-size: 1.05rem;
        cursor: pointer; box-shadow: 0 4px 12px rgba(0,0,0,0.08); transition: transform 0.1s ease;
    }
    .btn-feedback-outline:active { transform: scale(0.95); }

    #simu-container { height: 220px; display: flex; align-items: center; justify-content: center; width: 100%; overflow: visible; margin-bottom: 5px; }

    #instrucoes-panel { 
        position: fixed; top: 0; left: 0; width: 100vw; height: 100vh; background: white; z-index: 10000; 
        transition: transform 0.5s cubic-bezier(0.4, 0, 0.2, 1); transform: translateY(100%); 
        visibility: hidden; padding: 40px 25px; overflow-y: auto; border-radius: 0; 
    }
    #instrucoes-panel.open { transform: translateY(0); visibility: visible; }

    .close-x { position: absolute; top: 15px; right: 20px; font-size: 2.2rem; color: #666699; cursor: pointer; font-weight: 900; line-height: 1; transition: 0.2s; }
    .close-x:hover { transform: scale(1.2); }

    .nivel-select-container { display: none; flex-direction: column; gap: 12px; width: 95%; max-width: 500px; animation: cardPop 0.3s ease; align-items: center; }
    .nivel-row { display: flex; flex-direction: row; gap: 10px; width: 100%; justify-content: center; }
    .btn-nivel { background: white; padding: 16px 10px; border-radius: 16px; border: 2px solid #eee; display: flex; flex-direction: column; align-items: center; justify-content: center; cursor: pointer; transition: 0.2s; flex: 1; min-width: 0; }
    .btn-nivel b { font-size: 0.85rem; font-weight: 900; text-transform: uppercase; margin-bottom: 4px; }
    .btn-nivel span { font-size: 0.7rem; font-weight: 700; opacity: 0.7; text-align: center; }
    .btn-nivel.l1 { border-color: #8cc63f; color: #8cc63f; }
    .btn-nivel.l2 { border-color: #666699; color: #666699; }

    .grid-board { display: grid; grid-template-columns: repeat(8, 1fr); gap: 2px; background: #bbb; padding: 3px; border-radius: 8px; width: fit-content; margin: 0 auto; }
    .cell { width: var(--cell-size); height: var(--cell-size); background: white; display: flex; align-items: center; justify-content: center; position: relative; border-radius: 2px; cursor: default; font-weight: 900; font-size: 1.2rem; color: #ccc; }
    .cell.central { background: #fff8e1; }
    .cell.legal-hint { background: #e8f5e9; cursor: pointer; border: 1px solid #8cc63f; }
    .cell img { width: 90%; height: 90%; object-fit: contain; z-index: 2; }

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
// 3. CAPA, SIMULAÇÃO E INSTRUÇÕES
// ============================================================
function atualizarBarraCapa() {
    const barra = document.getElementById('barra-inferior');
    if (!barra) return;

    barra.style.display = "flex";
    barra.innerHTML = `
        <div class="barra-capa-layout">
            <button class="btn-info-circle" onclick="toggleInstructions()" aria-label="Instruções">
              <img src="${DADOS.icons.info}" alt="Info">
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
                <div class="inst-header">Gatos & Cães</div>
                <div class="inst-section-title">Objetivo</div>
                <p class="inst-text">Vence o jogador que conseguir realizar a <b>última jogada possível</b> no tabuleiro, deixando o adversário sem espaço para colocar as suas peças.</p>
                <div class="inst-section-title">Regras de Início</div>
                <ul class="inst-list">
                    <li><b>Gatos (Peças Pretas):</b> Começam o jogo e a sua primeira peça deve ser colocada obrigatoriamente na <b>zona central</b> (marcada com <b>X</b>).</li>
                    <li><b>Cães (Peças Brancas):</b> Jogam a seguir e a sua primeira peça deve ser colocada <b>fora</b> da zona central.</li>
                </ul>
                <div class="inst-section-title">Como Jogar</div>
                <ul class="inst-list">
                    <li><b>Proibição:</b> Não podes colocar um Gato ao lado de um Cão (nem na horizontal nem na vertical).</li>
                    <li><b>Estratégia:</b> Tenta ocupar o tabuleiro de forma a garantir lugares onde só tu possas jogar no futuro.</li>
                    <li><b>Fim do Jogo:</b> O jogo termina mal um dos jogadores fique bloqueado.</li>
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
    somClique.play();
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
    somClique.play();
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

function toggleInstructions() { somClique.play(); document.getElementById('instrucoes-panel').classList.toggle('open'); }

// ============================================================
// 4. LÓGICA CORE DO JOGO E IA
// ============================================================
function setModo(modo, nivel) {
    clearInterval(simuInterval); somClique.play();
    modoJogo = modo; nivelJogo = nivel;
    mostrarDicas = (nivel === 1);
    matchScore = [0, 0]; currentGameNum = 1; turnoAtual = 0; iniciarJogo();
}

function iniciarJogo() {
    jogoAtivo = true;
    tabuleiro = Array(8).fill().map(() => Array(8).fill(0));
    const feedback = document.getElementById('round-feedback');
    if (feedback) feedback.style.display = 'none';
    atualizarUI();
}

function atualizarUI() {
    let turnInfoHTML = "";
    
    if (modoJogo === 'CPU') {
        if (turnoAtual === 0) turnInfoHTML = `<div class="status-pill pill-j1 blinking">GATOS</div>`;
        else turnInfoHTML = `<div class="status-pill pill-j2 blinking">PC</div>`; 
    } else {
        const classPill = (turnoAtual === 0) ? "pill-j1" : "pill-j2";
        const nomeVez = (turnoAtual === 0) ? "GATOS" : "CÃES";
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
    let html = `<div class="grid-board">`;
    for (let r = 0; r < 8; r++) {
        for (let c = 0; c < 8; c++) {
            let cl = "cell";
            if (isCentral(r, c)) cl += " central";
            const playerType = (turnoAtual === 0) ? 1 : 2;
            const isHuman = (modoJogo === 'PVP' || turnoAtual === 0);
            if (jogoAtivo && isHuman && isLegal(r, c, playerType, tabuleiro)) {
                if (mostrarDicas) cl += " legal-hint";
                html += `<div class="${cl}" onclick="jogar(${r},${c})">`;
            } else { html += `<div class="${cl}">`; }
            
            if (tabuleiro[r][c] === 1) html += `<img src="../../icons/gato.png">`;
            else if (tabuleiro[r][c] === 2) html += `<img src="../../icons/cao.png">`;
            else if (isCentral(r, c)) html += `X`; 
            html += `</div>`;
        }
    }
    area.innerHTML = html + `</div>`;
}

function jogar(r, c) {
    if (!jogoAtivo) return;
    const pType = (turnoAtual === 0) ? 1 : 2;
    tabuleiro[r][c] = pType;
    somClique.play();
    turnoAtual = (turnoAtual === 0) ? 1 : 0;
    if (!temJogadas(turnoAtual === 0 ? 1 : 2, tabuleiro)) {
        finalizarRonda(turnoAtual === 0 ? 1 : 0);
        return;
    }
    if (modoJogo === 'CPU' && turnoAtual === 1) {
        atualizarUI();
        setTimeout(iaControlador, 600);
    } else { atualizarUI(); }
}

function iaControlador() {
    let legalMoves = [];
    for (let r = 0; r < 8; r++) for (let c = 0; c < 8; c++) if (isLegal(r, c, 2, tabuleiro)) legalMoves.push({r, c});
    if (legalMoves.length === 0) { finalizarRonda(0); return; }
    let move;
    
    if (nivelJogo === 1) {
        move = legalMoves[Math.floor(Math.random() * legalMoves.length)];
    } else {
        move = legalMoves.reduce((best, current) => {
            let score = avaliarJogada(current.r, current.c);
            return (score > best.score) ? {r: current.r, c: current.c, score: score} : best;
        }, {r: legalMoves[0].r, c: legalMoves[0].c, score: -1000});
    }
    jogar(move.r, move.c);
}

function avaliarJogada(r, c) {
    let tempTab = tabuleiro.map(row => [...row]);
    tempTab[r][c] = 2;
    let jogadasHumano = 0;
    for (let i = 0; i < 8; i++) for (let j = 0; j < 8; j++) if (isLegal(i, j, 1, tempTab)) jogadasHumano++;
    return -jogadasHumano;
}

function isCentral(r, c) { return r >= 3 && r <= 4 && c >= 3 && c <= 4; }
function isLegal(r, c, pType, tab) {
    if (tab[r][c] !== 0) return false;
    let totalPieces = tab.flat().filter(x => x !== 0).length;
    if (pType === 1 && totalPieces === 0 && !isCentral(r, c)) return false;
    if (pType === 2 && totalPieces === 1 && isCentral(r, c)) return false;
    const dr = [-1, 1, 0, 0], dc = [0, 0, -1, 1], opponent = (pType === 1) ? 2 : 1;
    for (let i = 0; i < 4; i++) {
        let nr = r + dr[i], nc = c + dc[i];
        if (nr >= 0 && nr < 8 && nc >= 0 && nc < 8 && tab[nr][nc] === opponent) return false;
    }
    return true;
}
function temJogadas(pType, tab) {
    for (let r = 0; r < 8; r++) for (let c = 0; c < 8; c++) if (isLegal(r, c, pType, tab)) return true;
    return false;
}

// ============================================================
// 5. FINALIZAÇÃO E FEEDBACKS (MELHOR DE 3 RONDAS)
// ============================================================
function finalizarRonda(vencedorIdx) {
    jogoAtivo = false;
    matchScore[vencedorIdx]++;
    somAcerto.play();
    const overlay = document.getElementById('round-feedback');
    const nomeVencedor = vencedorIdx === 0 ? "GATOS" : (modoJogo === 'CPU' ? "PC" : "CÃES");
    const corVencedor = vencedorIdx === 0 ? "#8cc63f" : "#666699";
    
    let imagemFeedback = DADOS.icons.feedbacks.feedback1;
    if (modoJogo === 'CPU' && vencedorIdx === 1) {
        imagemFeedback = DADOS.icons.feedbacks.feedback4;
    }

    if (overlay) {
        overlay.style.display = 'flex';
        overlay.innerHTML = `<div class="vitoria-card">
            <img src="${imagemFeedback}" style="height:140px; width:100%; object-fit:contain; margin-bottom:15px;">
            <h1 style="color:${corVencedor}; font-size:2.1rem; font-weight:900; margin:0; text-transform:uppercase;">${nomeVencedor}</h1>
            <p style="color:#666; font-size:1.1rem; font-weight:700; margin:6px 0 0 0;">Venceu esta ronda!</p>
            <div style="margin-top:18px; padding-top:15px; border-top:2px dashed #eee; color:#888; font-weight:800; font-size: 1.05rem;">PLACAR: J1 ${matchScore[0]} - ${matchScore[1]}</div>
        </div>`;
    }

    // Condição para melhor de 3 (quem atingir 2 vitórias ou acabar as 3 rondas)
    if (currentGameNum >= totalRondas || matchScore[0] >= 2 || matchScore[1] >= 2) {
        setTimeout(finalizarMatch, 2800);
    } else {
        setTimeout(() => { currentGameNum++; turnoAtual = 0; iniciarJogo(); }, 2800);
    }
}

function finalizarMatch() {
    const overlay = document.getElementById('round-feedback');
    if (overlay) overlay.style.display = 'none';
    
    const vencedorIdx = (matchScore[0] > matchScore[1]) ? 0 : 1;
    const nomeVencedor = vencedorIdx === 0 ? "GATOS" : (modoJogo === 'CPU' ? "PC" : "CÃES");
    
    let imagemFeedbackFinal = DADOS.icons.feedbacks.feedback1;
    if (modoJogo === 'CPU' && vencedorIdx === 1) {
        imagemFeedbackFinal = DADOS.icons.feedbacks.feedback4;
    }

    const contentor = document.getElementById('contentor-jogo');
    if (contentor) {
        contentor.innerHTML = `<div style="text-align:center;">
            <img src="${imagemFeedbackFinal}" style="height:150px; margin-bottom:12px; object-fit:contain;">
            <h2 style="color:#666699; font-weight:900; text-transform:uppercase; margin-bottom:15px; font-size: 1.5rem;">GANHOU O ${nomeVencedor}</h2>
            <div style="display:flex; justify-content:center; gap:20px; margin-bottom: 20px;">
                <div class="score-box box-v" style="padding:8px 18px; font-size:1.1rem;">J1: ${matchScore[0]}</div>
                <div class="score-box box-x" style="padding:8px 18px; font-size:1.1rem;">${modoJogo === 'CPU' ? 'PC' : 'J2'}: ${matchScore[1]}</div>
            </div>
            <div class="btn-feedback-container">
                <button class="btn-feedback-solid" onclick="location.reload()">Jogar de novo</button>
                <button class="btn-feedback-outline" onclick="window.location.href='../../'">Outro jogo</button>
            </div>
        </div>`;
    }
    
    const barra = document.getElementById('barra-inferior');
    if (barra) {
        barra.style.display = "flex";
        barra.innerHTML = '';
    }
}

function iniciarSimulacao() {
    clearInterval(simuInterval);
    const board = document.getElementById('simu-board');
    let sTab = Array(8).fill().map(() => Array(8).fill(0));
    let sTurno = 0;
    const render = () => {
        if(!board) return;
        let h = `<div class="grid-board" style="opacity:0.6; pointer-events:none;">`;
        for (let r = 0; r < 8; r++) {
            for (let c = 0; c < 8; c++) {
                h += `<div class="cell ${isCentral(r,c)?'central':''}">`;
                if(sTab[r][c]===1) h+=`<img src="../../icons/gato.png">`;
                else if(sTab[r][c]===2) h+=`<img src="../../icons/cao.png">`;
                else if(isCentral(r,c)) h+= `X`;
                h += `</div>`;
            }
        }
        board.innerHTML = h + `</div>`;
    };
    simuInterval = setInterval(() => {
        let p = (sTurno === 0) ? 1 : 2;
        let legal = [];
        for(let r=0; r<8; r++) for(let c=0; c<8; c++) if(isLegalSimulation(r,c,p,sTab)) legal.push({r,c});
        if (legal.length === 0) { sTab = Array(8).fill().map(() => Array(8).fill(0)); sTurno = 0; }
        else {
            let m = legal[Math.floor(Math.random() * legal.length)];
            sTab[m.r][m.c] = p;
            sTurno = (sTurno === 0) ? 1 : 0;
        }
        render();
    }, 800);
    render();
}

function isLegalSimulation(r, c, pType, tab) {
    if (tab[r][c] !== 0) return false;
    let total = tab.flat().filter(x=>x!==0).length;
    if(pType===1 && total===0 && !isCentral(r,c)) return false;
    if(pType===2 && total===1 && isCentral(r,c)) return false;
    const dr=[-1,1,0,0], dc=[0,0,-1,1], opp=(pType===1)?2:1;
    for(let i=0; i<4; i++){
        let nr=r+dr[i], nc=c+dc[i];
        if(nr>=0 && nr<8 && nc>=0 && nc<8 && tab[nr][nc]===opp) return false;
    }
    return true;
}

// Iniciar carregando a capa
mostrarCapa();
