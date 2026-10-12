// ============================================================
// 1. CONFIGURAÇÃO E ESTADO GLOBAL DO JOGO
// ============================================================
const JOGO_CONFIG = {
    nomeDoJogo: "Dominório",
    caminhoSons: DADOS.sons ? DADOS.sons.caminho : "",
    caminhoIconsMenu: "../../icons/"
};

let jogoAtivo = false;
let modoJogo = 'CPU';      
let nivelJogo = 1;         
let mostrarDicas = true;  
let matchScore = [0, 0];  // [Vertical, Horizontal]
let turnoAtual = 0;       // 0: Vertical (J1), 1: Horizontal (J2/Pc)
let currentGameNum = 1;    
let tabuleiro = [];       // 0: vazio, 1: ocupado
let simuInterval;         

// Sons
const somAcerto = new Audio(DADOS.sons && DADOS.sons.certo ? DADOS.sons.certo : "");
const somErro = new Audio(DADOS.sons && DADOS.sons.errado ? DADOS.sons.errado : "");


// ============================================================
// 2. CONFIGURAÇÃO VISUAL (CSS ESPECÍFICO INJETADO)
// ============================================================
const styleJogo = document.createElement('style');
styleJogo.innerHTML = `
    .status-container { width: 100%; display: flex; justify-content: space-between; align-items: center; }
    .status-pill { padding: 5px 15px; border-radius: 20px; font-weight: 900; font-size: 0.9rem; color: white; transition: 0.3s; }
    .score-group { display: flex; gap: 8px; }
    .score-box { padding: 5px 10px; border-radius: 12px; color: white; font-weight: 900; display: flex; align-items: center; gap: 6px; font-size: 1rem; min-width: 55px; justify-content: center; }
    
    /* J1 (Vertical) Verde | J2 (Horizontal) Vermelho */
    .box-v, .pill-j1 { background: #8cc63f !important; box-shadow: 0 3px 0 #6da32f; }
    .box-x, .pill-j2 { background: #ff5a5f !important; box-shadow: 0 3px 0 #d44348; }
    
    .blinking { animation: blinker 1s linear infinite; }
    @keyframes blinker { 50% { opacity: 0.4; } }

    #round-feedback {
        position: absolute; top: 0; left: 0; width: 100%; height: 100%;
        background: rgba(255, 255, 255, 0.7); backdrop-filter: blur(6px); 
        z-index: 1000; display: none; align-items: center; justify-content: center; border-radius: 25px;
    }
    .vitoria-card { background: white; padding: 30px; border-radius: 30px; box-shadow: 0 15px 35px rgba(0,0,0,0.15); text-align: center; animation: cardPop 0.4s cubic-bezier(0.17, 0.89, 0.32, 1.28); }
    @keyframes cardPop { 0% { transform: scale(0.7); opacity: 0; } 100% { transform: scale(1); opacity: 1; } }

    /* Estilo exato da Barra da Capa com Info e Jogar */
    .barra-capa-custom {
        width: 100%; display: flex; align-items: center; justify-content: space-between;
        background: ${DADOS.cores.azulHeader}; padding: 10px 18px;
        border-radius: 20px; box-shadow: inset 0 2px 4px rgba(0,0,0,0.15);
        gap: 10px;
    }
    .btn-capa-info {
        width: 44px; height: 44px; background: rgba(255,255,255,0.2); border: 2px solid rgba(255,255,255,0.4);
        border-radius: 50%; display: flex; align-items: center; justify-content: center; cursor: pointer; color: white;
        font-size: 1.2rem; font-weight: 900; transition: transform 0.1s;
    }
    .btn-capa-info:active { transform: scale(0.92); }

    .btn-capa-jogar {
        background: white; color: ${DADOS.cores.azulHeader}; border: none;
        padding: 10px 28px; border-radius: 20px; font-weight: 900; font-size: 1.1rem;
        cursor: pointer; box-shadow: 0 4px 10px rgba(0,0,0,0.15); transition: transform 0.1s;
        text-transform: uppercase;
    }
    .btn-capa-jogar:active { transform: scale(0.95); }

    .btn-modo-row { display: flex; gap: 10px; width: 100%; justify-content: center; align-items: center; }
    .btn-modo-opcao {
        flex: 1; background: white; color: ${DADOS.cores.azulHeader}; border: none;
        padding: 10px; border-radius: 16px; font-weight: 900; font-size: 0.9rem; cursor: pointer;
        box-shadow: 0 3px 8px rgba(0,0,0,0.1); text-transform: uppercase; transition: 0.2s;
    }
    .btn-modo-opcao:hover { background: #f0f0f5; }

    #simu-container { height: 210px; display: flex; align-items: center; justify-content: center; width: 100%; overflow: visible; margin-bottom: 10px; }

    #instrucoes-panel { position: fixed; top: 0; left: 0; width: 100vw; height: 100vh; background: white; z-index: 10000; transition: transform 0.5s cubic-bezier(0.4, 0, 0.2, 1); transform: translateY(100%); visibility: hidden; padding: 40px 25px; overflow-y: auto; }
    #instrucoes-panel.open { transform: translateY(0); visibility: visible; }
    .close-x { position: absolute; top: 15px; right: 20px; font-size: 2.2rem; color: #ff5a5f; cursor: pointer; font-weight: 900; line-height: 1; transition: 0.2s; }

    .nivel-select-container { display: none; flex-direction: column; gap: 10px; width: 100%; animation: cardPop 0.3s ease; align-items: center; }
    .nivel-row { display: flex; flex-direction: row; gap: 6px; width: 100%; justify-content: center; }
    .btn-nivel { background: white; padding: 10px 2px; border-radius: 12px; border: 2px solid #eee; display: flex; flex-direction: column; align-items: center; justify-content: center; cursor: pointer; transition: 0.2s; flex: 1; min-width: 0; }
    .btn-nivel b { font-size: 0.75rem; font-weight: 900; text-transform: uppercase; }
    .btn-nivel span { font-size: 0.6rem; font-weight: 700; opacity: 0.7; text-align: center; }
    .btn-nivel.l1 { border-color: #8cc63f; color: #8cc63f; }
    .btn-nivel.l2 { border-color: #f9a825; color: #f9a825; }
    .btn-nivel.l3 { border-color: #ff5a5f; color: #ff5a5f; }

    /* TABULEIRO 8x8 */
    .grid-board { display: grid; grid-template-columns: repeat(8, 1fr); gap: 2px; background: #bbb; padding: 3px; border-radius: 8px; width: fit-content; margin: 0 auto; }
    .cell { width: var(--cell-size); height: var(--cell-size); background: white; border-radius: 2px; position: relative; }
    .cell.v-piece { background: #8cc63f !important; border: 1px solid #6da32f; }
    .cell.h-piece { background: #ff5a5f !important; border: 1px solid #d44348; }
    .cell.preview { background: #e8f5e9; border: 1px solid #8cc63f; cursor: pointer; }
    .cell.preview-h { background: #ffebee; border: 1px solid #ff5a5f; cursor: pointer; }

    .inst-content { max-width: 600px; margin: 0 auto; text-align: left; }
    .inst-header { color: ${DADOS.cores.azulHeader}; text-align: center; font-size: 1.8rem; font-weight: 900; margin-bottom: 25px; text-transform: uppercase; border-bottom: 3px solid ${DADOS.cores.fundo}; padding-bottom: 10px; }
    .inst-section-title { color: #444; font-size: 1.2rem; font-weight: 800; margin: 20px 0 10px; display: flex; align-items: center; gap: 10px; }
    .inst-section-title::before { content: ''; width: 6px; height: 22px; background: ${DADOS.cores.azulHeader}; border-radius: 3px; display: inline-block; }
    .inst-text { color: #666; font-size: 1.05rem; line-height: 1.6; margin-bottom: 15px; }
    .inst-list { list-style: none; padding: 0; }
    .inst-list li { background: #f9f9f9; margin-bottom: 8px; padding: 12px 15px; border-radius: 12px; border-left: 4px solid ${DADOS.cores.azulHeader}; color: #555; font-size: 1rem; line-height: 1.4; }

    @media screen and (min-width: 1025px) { :root { --cell-size: 45px; } }
    @media screen and (max-width: 500px) and (orientation: portrait) { :root { --cell-size: 9vw; } }
    @media screen and (max-height: 500px) and (orientation: landscape) { :root { --cell-size: 6.5vh; } }
`;
document.head.appendChild(styleJogo);


// ============================================================
// 3. CAPA E INSTRUÇÕES
// ============================================================
function mostrarCapa() {
    if (jogoAtivo) return;
    
    document.getElementById('barra-inferior').style.display = 'none';
    
    if(!document.getElementById('instrucoes-panel')) {
        const panel = document.createElement('div');
        panel.id = 'instrucoes-panel';
        panel.innerHTML = `
            <span class="close-x" onclick="toggleInstructions()">&times;</span>
            <div class="inst-content">
                <div class="inst-header">Dominório</div>
                <div class="inst-section-title">Objetivo</div>
                <p class="inst-text">Vence o jogador que realizar a <b>última jogada possível</b>. O primeiro jogador que não se conseguir mover perde o jogo.</p>
                
                <div class="inst-section-title">Como Jogar</div>
                <ul class="inst-list">
                    <li><b>Vertical (Verde):</b> Só pode colocar peças na vertical (ocupa 2 casas: cima e baixo).</li>
                    <li><b>Horizontal (Vermelho):</b> Só pode colocar peças na horizontal (ocupa 2 casas: esquerda e direita).</li>
                    <li>As peças devem ser colocadas apenas em <b>quadrados vazios</b>.</li>
                    <li>O jogador <b>Vertical</b> é sempre o primeiro a começar.</li>
                </ul>
            </div>`;
        document.body.appendChild(panel);
        
        const feedback = document.createElement('div');
        feedback.id = 'round-feedback';
        document.querySelector('.botao-ano').appendChild(feedback);
    }

    const area = document.getElementById('contentor-jogo');
    area.innerHTML = `
        <div id="simu-container"><div id="simu-board" style="transform: scale(0.65);"></div></div>
    `;

    // Garantir que a barra inferior está visível na capa com o botão info e o botão Jogar
    const barra = document.getElementById('barra-inferior');
    barra.style.display = 'flex';
    barra.className = "barra-jogo-topo";
    barra.innerHTML = `
        <div class="btn-capa-info" onclick="toggleInstructions()"><i class="fas fa-info"></i></div>
        <button class="btn-capa-jogar" onclick="mostrarOpcoesModo()">JOGAR</button>
    `;

    iniciarSimulacao();
}

function mostrarOpcoesModo() {
    const barra = document.getElementById('barra-inferior');
    barra.innerHTML = `
        <div class="btn-modo-row">
            <button class="btn-modo-opcao" onclick="mostrarNiveis('CPU')"><i class="fas fa-robot"></i> Computador</button>
            <button class="btn-modo-opcao" onclick="mostrarNiveis('PVP')"><i class="fas fa-users"></i> 2 Jogadores</button>
            <button class="btn-capa-info" style="background:#cc5555; border-color:#ff7777;" onclick="mostrarCapa()"><i class="fas fa-arrow-left"></i></button>
        </div>
    `;
}

function mostrarNiveis(modo) {
    modoJogo = modo;
    const barra = document.getElementById('barra-inferior');
    
    if (modo === 'CPU') {
        barra.innerHTML = `
            <div class="nivel-select-container" style="display:flex;">
                <div class="nivel-row">
                    <div class="btn-nivel l1" onclick="setModo('CPU', 1)"><b>Nível 1</b><span>Com Dicas</span></div>
                    <div class="btn-nivel l2" onclick="setModo('CPU', 2)"><b>Nível 2</b><span>Sem Dicas</span></div>
                    <div class="btn-nivel l3" onclick="setModo('CPU', 3)"><b>Nível 3</b><span>Difícil</span></div>
                </div>
            </div>`;
    } else {
        barra.innerHTML = `
            <div class="nivel-select-container" style="display:flex;">
                <div class="nivel-row">
                    <div class="btn-nivel l1" onclick="setModo('PVP', 1)"><b>Nível 1</b><span>Com Dicas</span></div>
                    <div class="btn-nivel l2" onclick="setModo('PVP', 2)"><b>Nível 2</b><span>Sem Dicas</span></div>
                </div>
            </div>`;
    }
}

function toggleInstructions() { 
    document.getElementById('instrucoes-panel').classList.toggle('open'); 
}


// ============================================================
// 4. LÓGICA DO JOGO E IA
// ============================================================
function setModo(modo, nivel) {
    clearInterval(simuInterval);
    modoJogo = modo; nivelJogo = nivel;
    mostrarDicas = (nivel === 1);
    matchScore = [0, 0]; currentGameNum = 1; turnoAtual = 0; 
    iniciarJogo();
}

function iniciarJogo() {
    jogoAtivo = true;
    tabuleiro = Array(8).fill().map(() => Array(8).fill(0));
    document.getElementById('round-feedback').style.display = 'none';
    document.getElementById('barra-inferior').style.display = 'flex';
    atualizarUI();
}

function atualizarUI() {
    const pcLabel = "Pc";
    const j2Label = "J2";
    const labelSegundaBox = modoJogo === 'CPU' ? pcLabel : j2Label;
    let turnInfoHTML = "";
    
    if (modoJogo === 'CPU') {
        if (turnoAtual === 0) turnInfoHTML = `<div class="status-pill pill-j1 blinking">VERTICAL</div>`;
        else turnInfoHTML = `<div style="flex:1"></div>`; 
    } else {
        const classPill = (turnoAtual === 0) ? "pill-j1" : "pill-j2";
        const nomeVez = (turnoAtual === 0) ? "VERTICAL" : "HORIZONTAL";
        turnInfoHTML = `<div class="status-pill ${classPill} blinking">${nomeVez}</div>`;
    }
    
    document.getElementById('barra-inferior').innerHTML = `
        ${turnInfoHTML}
        <div class="score-group">
            <div class="score-box box-v">V: ${matchScore[0]}</div>
            <div class="score-box box-x">${labelSegundaBox}: ${matchScore[1]}</div>
        </div>`;
    renderTabuleiro();
}

function renderTabuleiro() {
    const area = document.getElementById('contentor-jogo');
    let html = `<div class="grid-board">`;
    for (let r = 0; r < 8; r++) {
        for (let c = 0; c < 8; c++) {
            let cl = "cell";
            if (tabuleiro[r][c] === 'V') cl += " v-piece";
            if (tabuleiro[r][c] === 'H') cl += " h-piece";
            
            const isHuman = (modoJogo === 'PVP' || turnoAtual === 0);
            
            if (jogoAtivo && isHuman && tabuleiro[r][c] === 0) {
                if (turnoAtual === 0 && r < 7 && tabuleiro[r+1][c] === 0) { 
                   if(mostrarDicas) cl += " preview";
                   html += `<div class="${cl}" onclick="jogar(${r},${c})"></div>`;
                } else if (turnoAtual === 1 && c < 7 && tabuleiro[r][c+1] === 0) { 
                   if(mostrarDicas) cl += " preview-h";
                   html += `<div class="${cl}" onclick="jogar(${r},${c})"></div>`;
                } else { html += `<div class="${cl}"></div>`; }
            } else { html += `<div class="${cl}"></div>`; }
        }
    }
    area.innerHTML = html + `</div>`;
}

function jogar(r, c) {
    if (!jogoAtivo) return;
    if (turnoAtual === 0) { 
        tabuleiro[r][c] = 'V'; tabuleiro[r+1][c] = 'V';
    } else { 
        tabuleiro[r][c] = 'H'; tabuleiro[r][c+1] = 'H';
    }
    turnoAtual = (turnoAtual === 0) ? 1 : 0;
    
    if (!temJogadas(turnoAtual)) {
        finalizarRonda(turnoAtual === 0 ? 1 : 0); 
        return;
    }

    if (modoJogo === 'CPU' && turnoAtual === 1) {
        atualizarUI();
        setTimeout(iaControlador, 500);
    } else { atualizarUI(); }
}

function iaControlador() {
    let legalMoves = getLegalMoves(1); 
    if (legalMoves.length === 0) { finalizarRonda(0); return; }

    let move;
    if (nivelJogo === 1) move = legalMoves[Math.floor(Math.random() * legalMoves.length)];
    else if (nivelJogo === 2) {
        move = legalMoves.sort((a,b) => avaliar(b.r, b.c, 1) - avaliar(a.r, a.c, 1))[0];
    } else {
        move = legalMoves.reduce((best, curr) => {
            let score = avaliar(curr.r, curr.c, 1);
            return (score > best.score) ? {m: curr, score: score} : best;
        }, {m: legalMoves[0], score: -1000}).m;
    }
    jogar(move.r, move.c);
}

function avaliar(r, c, type) {
    let tempTab = tabuleiro.map(row => [...row]);
    if(type === 1) { tempTab[r][c] = 'H'; tempTab[r][c+1] = 'H'; }
    let countVertical = 0;
    for(let i=0; i<7; i++) for(let j=0; j<8; j++) if(tempTab[i][j]===0 && tempTab[i+1][j]===0) countVertical++;
    return -countVertical; 
}

function getLegalMoves(type) {
    let moves = [];
    for (let r = 0; r < 8; r++) {
        for (let c = 0; c < 8; c++) {
            if (type === 0 && r < 7 && tabuleiro[r][c] === 0 && tabuleiro[r+1][c] === 0) moves.push({r, c});
            if (type === 1 && c < 7 && tabuleiro[r][c] === 0 && tabuleiro[r][c+1] === 0) moves.push({r, c});
        }
    }
    return moves;
}

function temJogadas(type) {
    return getLegalMoves(type).length > 0;
}


// ============================================================
// 5. FINALIZAÇÃO E FEEDBACKS
// ============================================================
function finalizarRonda(vencedorIdx) {
    jogoAtivo = false;
    matchScore[vencedorIdx]++;
    
    const overlay = document.getElementById('round-feedback');
    const nomeVencedor = vencedorIdx === 0 ? "VERTICAL" : (modoJogo === 'CPU' ? "Pc" : "HORIZONTAL");
    const corVencedor = vencedorIdx === 0 ? "#8cc63f" : "#ff5a5f";
    const iconeFeedback = vencedorIdx === 0 ? DADOS.icons.feedbacks.feedback1 : DADOS.icons.feedbacks.feedback4;

    overlay.style.display = 'flex';
    overlay.innerHTML = `<div class="vitoria-card">
        <img src="${iconeFeedback}" style="width:90px; height:90px; object-fit:contain; margin-bottom:10px;">
        <h1 style="color:${corVencedor}; font-size:1.8rem; font-weight:900; margin:0; text-transform:uppercase;">${nomeVencedor}</h1>
        <p style="color:#666; font-size:1.05rem; font-weight:700; margin:5px 0 0 0;">Venceu esta ronda!</p>
        <div style="margin-top:15px; padding-top:15px; border-top:2px dashed #eee; color:#888; font-weight:800;">PLACAR: V ${matchScore[0]} - ${matchScore[1]} H</div>
    </div>`;
    
    if (matchScore[0] >= 3 || matchScore[1] >= 3) setTimeout(finalizarMatch, 2200);
    else setTimeout(() => { currentGameNum++; turnoAtual = 0; iniciarJogo(); }, 2200);
}

function finalizarMatch() {
    document.getElementById('round-feedback').style.display = 'none';
    const vencedorIdx = (matchScore[0] >= 3) ? 0 : 1;
    const nomeVencedor = vencedorIdx === 0 ? "VERTICAL" : (modoJogo === 'CPU' ? "Pc" : "HORIZONTAL");
    
    document.getElementById('contentor-jogo').innerHTML = `
        <div style="text-align:center;">
            <img src="${DADOS.icons.feedbacks.feedback1}" style="width:110px; height:110px; object-fit:contain; margin-bottom:10px;">
            <h2 style="color:${DADOS.cores.azulHeader}; font-weight:900;">${nomeVencedor} VENCEU O JOGO!</h2>
            <div style="display:flex; justify-content:center; gap:20px; margin-top:15px;">
                <div class="score-box box-v" style="padding:10px 20px; font-size:1.2rem;">V: ${matchScore[0]}</div>
                <div class="score-box box-x" style="padding:10px 20px; font-size:1.2rem;">H: ${matchScore[1]}</div>
            </div>
            <div style="display:flex; justify-content:center; gap:12px; margin-top:25px;">
                <button class="btn-capa-small" style="background:#6c757d; width:140px; height:45px;" onclick="location.reload()"><i class="fas fa-redo"></i> REPETIR</button>
                <button class="btn-capa-small" style="background:${DADOS.cores.azulHeader}; width:140px; height:45px;" onclick="window.history.back()"><i class="fas fa-sign-out-alt"></i> SAIR</button>
            </div>
        </div>`;
    document.getElementById('barra-inferior').style.display = "none";
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
                let cl = "cell";
                if (sTab[r][c] === 'V') cl += " v-piece";
                if (sTab[r][c] === 'H') cl += " h-piece";
                h += `<div class="${cl}"></div>`;
            }
        }
        board.innerHTML = h + `</div>`;
    };
    
    simuInterval = setInterval(() => {
        let leg = [];
        for(let r=0; r<8; r++) for(let c=0; c<8; c++) {
            if(sTurno===0 && r<7 && sTab[r][c]===0 && sTab[r+1][c]===0) leg.push({r,c});
            if(sTurno===1 && c<7 && sTab[r][c]===0 && sTab[r][c+1]===0) leg.push({r,c});
        }
        if (leg.length === 0) { sTab = Array(8).fill().map(() => Array(8).fill(0)); sTurno = 0; }
        else {
            let m = leg[Math.floor(Math.random() * leg.length)];
            if(sTurno===0){ sTab[m.r][m.c]='V'; sTab[m.r+1][m.c]='V'; }
            else { sTab[m.r][m.c]='H'; sTab[m.r][m.c+1]='H'; }
            sTurno = (sTurno === 0) ? 1 : 0;
        }
        render();
    }, 600);
}

// Iniciar a capa diretamente
mostrarCapa();
