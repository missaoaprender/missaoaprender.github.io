// ============================================================
// 1. ESTADO GLOBAL E SONS
// ============================================================
const JOGO_CONFIG = {
    nomeDoJogo: "Quelhas",
    caminhoSons: DADOS.sons ? DADOS.sons.caminho : "",
    caminhoIconsMenu: "../../icons/"
};

let jogoAtivo = false;
let modoJogo = 'CPU';     
let nivelJogo = 1;        
let mostrarDicas = true;  
let matchScore = [0, 0];  
let turnoAtual = 0;       
let currentGameNum = 1;   
let tabuleiro = Array(10).fill().map(() => Array(10).fill(0));[cite: 14]
let startCell = null;     
let primeiraJogadaRealizada = false;
let j2JaJogou = false; 
let trocouOrientacao = false; 
let orientacoes = [0, 1]; // [J1, J2/Pc] -> 0: Vertical, 1: Horizontal[cite: 14]
let simuInterval;         

const somAcerto = new Audio(DADOS.sons && DADOS.sons.certo ? DADOS.sons.certo : "");
const somErro = new Audio(DADOS.sons && DADOS.sons.errado ? DADOS.sons.errado : "");
const somClique = new Audio(DADOS.sons && DADOS.sons.clique ? DADOS.sons.clique : "");


// ============================================================
// 2. CONFIGURAÇÃO VISUAL (DESIGN PREMIUM)
// ============================================================
const style = document.createElement('style');
style.innerHTML = `
    .status-container { width: 100%; display: flex; justify-content: space-between; align-items: center; padding: 2px 5px; }[cite: 14]
    
    .status-pill { padding: 4px 15px; border-radius: 8px; font-weight: 800; font-size: 0.9rem; color: white; display: flex; align-items: center; gap: 12px; }[cite: 14]
    
    .status-dots { display: flex; gap: 4px; }[cite: 14]
    .status-dots.v-dir { flex-direction: column; }[cite: 14]
    .status-dots.h-dir { flex-direction: row; }[cite: 14]
    .dot-blink { width: 6px; height: 6px; background: white; border-radius: 50%; animation: blinker 1s linear infinite; }[cite: 14]

    .score-group { display: flex; gap: 8px; }[cite: 14]
    .score-box { padding: 5px 10px; border-radius: 12px; color: white; font-weight: 900; display: flex; align-items: center; gap: 6px; font-size: 1rem; min-width: 55px; justify-content: center; }[cite: 14]
    
    .box-v, .pill-j1 { background: #8cc63f !important; box-shadow: 0 3px 0 #6da32f; }[cite: 14]
    .box-x, .pill-j2 { background: #ff5a5f !important; box-shadow: 0 3px 0 #d44348; }[cite: 14]
    
    @keyframes blinker { 50% { opacity: 0.2; } }[cite: 14]

    /* Barra da Capa com Info e Jogar */
    .btn-capa-info {
        width: 44px; height: 44px; background: rgba(255,255,255,0.2); border: 2px solid rgba(255,255,255,0.4);
        border-radius: 50%; display: flex; align-items: center; justify-content: center; cursor: pointer; color: white;
        font-size: 1.2rem; font-weight: 900; transition: transform 0.1s;
    }
    .btn-capa-info:active { transform: scale(0.92); }
    .btn-capa-info img { width: 24px; height: 24px; object-fit: contain; }

    .btn-capa-jogar {
        background: white; color: ${DADOS.cores.azulHeader}; border: none;
        padding: 10px 28px; border-radius: 20px; font-weight: 900; font-size: 1.1rem;
        cursor: pointer; box-shadow: 0 4px 10px rgba(0,0,0,0.15); transition: transform 0.1s;
        text-transform: uppercase;
    }
    .btn-capa-jogar:active { transform: scale(0.95); }

    /* Estilos do Menu de Escolha de Modo / Níveis */
    .menu-escolha-container {
        display: flex; flex-direction: column; align-items: center; justify-content: center;
        width: 100%; height: 100%; gap: 14px; animation: cardPop 0.3s ease;
    }
    .menu-titulo {
        font-size: 1.3rem; font-weight: 900; color: ${DADOS.cores.textoEscuro}; text-transform: uppercase; margin-bottom: 5px; text-align: center;
    }
    .btn-modo-grande {
        width: 100%; max-width: 380px; height: 55px; background: #5f6388; color: white; border: none;
        border-radius: 28px; font-weight: 900; font-size: 1.05rem; cursor: pointer;
        display: flex; align-items: center; justify-content: center; gap: 12px;
        box-shadow: 0 6px 15px rgba(0,0,0,0.15); text-transform: uppercase; transition: transform 0.1s, background 0.2s;
    }
    .btn-modo-grande:hover { background: #4e5272; }
    .btn-modo-grande:active { transform: scale(0.97); }

    .btn-voltar-grande {
        width: 100%; max-width: 200px; height: 45px; background: #9598ab; color: white; border: none;
        border-radius: 22px; font-weight: 900; font-size: 0.95rem; cursor: pointer;
        display: flex; align-items: center; justify-content: center;
        box-shadow: 0 4px 10px rgba(0,0,0,0.12); text-transform: uppercase; transition: transform 0.1s; margin-top: 5px;
    }
    .btn-voltar-grande:active { transform: scale(0.97); }

    /* Estilo dos botões finais */
    .btn-final-roxo {
        background: #5f6388; color: white; border: none; padding: 14px 28px;
        border-radius: 25px; font-weight: 900; font-size: 1rem; cursor: pointer;
        box-shadow: 0 6px 15px rgba(0,0,0,0.15); text-transform: capitalize; transition: transform 0.1s;
    }
    .btn-final-roxo:active { transform: scale(0.95); }

    .btn-final-branco {
        background: white; color: #5f6388; border: 2px solid #5f6388; padding: 14px 28px;
        border-radius: 25px; font-weight: 900; font-size: 1rem; cursor: pointer;
        box-shadow: 0 6px 15px rgba(0,0,0,0.08); text-transform: capitalize; transition: transform 0.1s;
    }
    .btn-final-branco:active { transform: scale(0.95); }

    .niveis-wrapper {
        display: flex; flex-direction: column; align-items: center; gap: 6px; width: 100%; margin-top: 5px;
    }
    .niveis-subtitulo {
        font-size: 0.75rem; font-weight: 800; color: #777; text-transform: uppercase;
    }
    .niveis-row {
        display: flex; gap: 10px; width: 100%; max-width: 440px; justify-content: center;
    }
    .btn-nivel-card {
        flex: 1; background: white; padding: 10px 6px; border-radius: 14px; border: 2px solid #ccc;
        display: flex; flex-direction: column; align-items: center; justify-content: center; cursor: pointer; transition: 0.2s;
    }
    .btn-nivel-card b { font-size: 0.8rem; font-weight: 900; text-transform: uppercase; }
    .btn-nivel-card span { font-size: 0.65rem; font-weight: 700; opacity: 0.7; text-align: center; margin-top: 2px; }
    .btn-nivel-card.l1 { border-color: #8cc63f; color: #8cc63f; }
    .btn-nivel-card.l2 { border-color: #ff5a5f; color: #ff5a5f; }
    .btn-nivel-card:active { transform: scale(0.95); }

    #simu-container { height: 260px; display: flex; align-items: center; justify-content: center; width: 100%; overflow: visible; margin-top: 5px; margin-bottom: 20px; }[cite: 14]
    #simu-board { transform: scale(1.1); }[cite: 14]

    #instrucoes-panel { position: fixed; top: 0; left: 0; width: 100vw; height: 100vh; background: white; z-index: 10000; transition: transform 0.5s ease; transform: translateY(100%); visibility: hidden; padding: 40px 25px; overflow-y: auto; border-radius: 35px 35px 0 0; }[cite: 14]
    #instrucoes-panel.open { transform: translateY(0); visibility: visible; }[cite: 14]
    .close-x { position: absolute; top: 15px; right: 20px; font-size: 2.5rem; color: #ff5a5f; cursor: pointer; font-weight: 900; line-height: 1; transition: 0.2s; }[cite: 14]
    .close-x:hover { transform: scale(1.2); }[cite: 14]

    .inst-content { max-width: 600px; margin: 0 auto; text-align: left; }[cite: 14]
    .inst-header { color: ${DADOS.cores.azulHeader}; text-align: center; font-size: 1.8rem; font-weight: 900; margin-bottom: 25px; text-transform: uppercase; border-bottom: 3px solid ${DADOS.cores.fundo}; padding-bottom: 10px; }
    .inst-section-title { color: #444; font-size: 1.2rem; font-weight: 800; margin: 20px 0 12px; display: flex; align-items: center; gap: 10px; }[cite: 14]
    .inst-section-title::before { content: ''; width: 6px; height: 22px; background: ${DADOS.cores.azulHeader}; border-radius: 3px; display: inline-block; }
    .inst-list { list-style: none; padding: 0; }[cite: 14]
    .inst-list li { background: #f9f9f9; margin-bottom: 10px; padding: 15px; border-radius: 15px; border-left: 5px solid ${DADOS.cores.azulHeader}; color: #555; font-size: 0.95rem; line-height: 1.4; }[cite: 14]

    /* TABULEIRO COM ROTAÇÃO */
    .grid-board { display: grid; grid-template-columns: repeat(10, 1fr); gap: 2px; background: #bbb; padding: 3px; border-radius: 8px; width: fit-content; margin: 0 auto; transition: transform 0.8s cubic-bezier(0.68, -0.55, 0.265, 1.55); }[cite: 14]
    .grid-board.rotated { transform: rotate(180deg); }[cite: 14]
    
    .cell { width: var(--cell-size); height: var(--cell-size); background: white; border-radius: 1px; display: flex; align-items: center; justify-content: center; position: relative; }[cite: 14]
    .cell.occupied::after { content: ''; width: 85%; height: 85%; background: #333; border-radius: 50%; }[cite: 14]
    .cell.selected { background: #e8f5e9; border: 2px solid #8cc63f; }[cite: 14]

    .cell.hint::after { content: ''; width: 8px; height: 8px; background: #bbb; border-radius: 50%; opacity: 0.8; }[cite: 14]

    #round-feedback { position: absolute; top: 0; left: 0; width: 100%; height: 100%; background: rgba(255, 255, 255, 0.7); backdrop-filter: blur(6px); z-index: 1000; display: none; align-items: center; justify-content: center; border-radius: 35px; }[cite: 14]
    .vitoria-card { background: white; padding: 30px; border-radius: 30px; box-shadow: 0 15px 35px rgba(0,0,0,0.15); text-align: center; border: 4px solid ${DADOS.cores.fundo}; animation: cardPop 0.4s cubic-bezier(0.17, 0.89, 0.32, 1.28); }[cite: 14]
    @keyframes cardPop { 0% { transform: scale(0.7); opacity: 0; } 100% { transform: scale(1); opacity: 1; } }[cite: 14]

    @media screen and (min-width: 1025px) { :root { --cell-size: 40px; } }[cite: 14]
    @media screen and (max-width: 500px) and (orientation: portrait) { :root { --cell-size: 8.5vw; } }[cite: 14]
    @media screen and (max-height: 500px) and (orientation: landscape) { :root { --cell-size: 7vh; } }[cite: 14]
`;
document.head.appendChild(style);

// ============================================================
// 3. CAPA, SIMULAÇÃO E INSTRUÇÕES
// ============================================================
function mostrarCapa() {
    if (jogoAtivo) return;
    document.getElementById('shell-header-content').innerHTML = `<h2 style="color:${DADOS.cores.azulHeader}; font-weight:900;">${JOGO_CONFIG.nomeDoJogo.toUpperCase()}</h2>`;[cite: 14]
    
    if(!document.getElementById('instrucoes-panel')) {
        const panel = document.createElement('div');
        panel.id = 'instrucoes-panel';
        panel.innerHTML = `
            <span class="close-x" onclick="toggleInstructions()">&times;</span>
            <div class="inst-content">
                <div class="inst-header">Como Jogar Quelhas</div>
                <div class="inst-section-title">Objetivo (Regra Misere)</div>
                <p class="inst-text">O Quelhas é um jogo de bloqueio estratégico. Ao contrário da maioria dos jogos, este segue a regra <b>Misere</b>: o jogador que realizar a <b>última jogada possível</b> no tabuleiro perde o jogo. O teu objetivo é forçar o adversário a ocupar o último espaço livre.</p>[cite: 14]
                <div class="inst-section-title">As Peças e o Tabuleiro</div>
                <ul class="inst-list">
                    <li><b>Tabuleiro:</b> Um quadrado de 10x10 casas.</li>[cite: 14]
                    <li><b>Jogadores:</b> Um joga na <b>Vertical</b> (colunas) e outro na <b>Horizontal</b> (linhas).</li>[cite: 14]
                    <li><b>Peças:</b> Devem ser colocados blocos de <b>duas ou mais peças</b> seguidas na orientação do jogador.</li>[cite: 14]
                </ul>
                <div class="inst-section-title">Como Jogar</div>
                <ul class="inst-list">
                    <li><b>1.</b> O jogador Vertical começa sempre o jogo.</li>[cite: 14]
                    <li><b>2.</b> Para jogar, clica na casa onde o teu bloco começa e depois na casa onde termina.</li>[cite: 14]
                    <li><b>3. Regra da Troca:</b> Na primeira jogada do segundo jogador (J2), este pode optar por <b>trocar de orientação</b>. O tabuleiro roda 180º e o J2 assume a Vertical.</li>[cite: 14]
                </ul>
            </div>`;
        document.body.appendChild(panel);
        const feedback = document.createElement('div');
        feedback.id = 'round-feedback';
        document.querySelector('.game-shell').appendChild(feedback);
    }

    const area = document.getElementById('game-content');
    area.innerHTML = `
        <div id="simu-container"><div id="simu-board"></div></div>
    `;

    // Barra inferior com o botão de info (usando DADOS.icons.info) e o botão JOGAR
    const barra = document.getElementById('shell-footer-content');
    barra.style.display = 'flex';
    barra.className = "barra-jogo-topo";
    barra.innerHTML = `
        <div class="btn-capa-info" onclick="toggleInstructions()"><img src="${DADOS.icons.info}" alt="Info"></div>
        <button class="btn-capa-jogar" onclick="mostrarMenuEscolha()">JOGAR</button>
    `;

    iniciarSimulacao();
}

function mostrarMenuEscolha() {
    clearInterval(simuInterval);
    if (somClique.src) somClique.play().catch(()=>{});
    const area = document.getElementById('game-content');
    area.innerHTML = `
        <div class="menu-escolha-container">
            <div class="menu-titulo">Escolhe o modo de jogo</div>
            <button class="btn-modo-grande" onclick="mostrarMenuNiveis('CPU')"><i class="fas fa-robot"></i> Computador</button>
            <button class="btn-modo-grande" onclick="mostrarMenuNiveis('PVP')"><i class="fas fa-users"></i> 2 Jogadores</button>
            <button class="btn-voltar-grande" onclick="mostrarCapa()">Voltar</button>
        </div>
    `;
    const barra = document.getElementById('shell-footer-content');
    barra.innerHTML = `<div></div>`;
}

function mostrarMenuNiveis(modo) {
    modoJogo = modo;
    if (somClique.src) somClique.play().catch(()=>{});
    const area = document.getElementById('game-content');
    
    let niveisHtml = '';
    if (modo === 'CPU') {
        niveisHtml = `
            <div class="niveis-wrapper">
                <div class="niveis-subtitulo">Jogar com o computador:</div>
                <div class="niveis-row">
                    <div class="btn-nivel-card l1" onclick="setModo('CPU', 1)"><b>Nível 1</b><span>Fácil</span></div>
                    <div class="btn-nivel-card l2" onclick="setModo('CPU', 2)"><b>Nível 2</b><span>Difícil</span></div>
                </div>
            </div>`;
    } else {
        niveisHtml = `
            <div class="niveis-wrapper">
                <div class="niveis-subtitulo">Modo 2 Jogadores:</div>
                <div class="niveis-row">
                    <div class="btn-nivel-card l1" onclick="setModo('PVP', 1)"><b>Nível 1</b><span>Fácil</span></div>
                    <div class="btn-nivel-card l2" onclick="setModo('PVP', 2)"><b>Nível 2</b><span>Difícil</span></div>
                </div>
            </div>`;
    }

    area.innerHTML = `
        <div class="menu-escolha-container">
            <div class="menu-titulo">Escolhe o modo de jogo</div>
            <button class="btn-modo-grande" onclick="mostrarMenuNiveis('CPU')" style="opacity:0.8;"><i class="fas fa-robot"></i> Computador</button>
            <button class="btn-modo-grande" onclick="mostrarMenuNiveis('PVP')" style="opacity:0.8;"><i class="fas fa-users"></i> 2 Jogadores</button>
            ${niveisHtml}
            <button class="btn-voltar-grande" onclick="mostrarMenuEscolha()">Voltar</button>
        </div>
    `;
}

function toggleInstructions() { 
    if (somClique.src) somClique.play().catch(()=>{});
    document.getElementById('instrucoes-panel').classList.toggle('open'); 
}

// ============================================================
// 4. LÓGICA CORE DO JOGO E IA
// ============================================================
function setModo(modo, nivel) {
    clearInterval(simuInterval); 
    if (somClique.src) somClique.play().catch(()=>{});
    modoJogo = modo; nivelJogo = nivel;
    mostrarDicas = (nivel === 1);
    matchScore = [0, 0]; currentGameNum = 1; orientacoes = [0, 1]; trocouOrientacao = false;[cite: 14]
    iniciarJogo();
}

function iniciarJogo() {
    jogoAtivo = true;
    tabuleiro = Array(10).fill().map(() => Array(10).fill(0));[cite: 14]
    startCell = null; primeiraJogadaRealizada = false; j2JaJogou = false; turnoAtual = 0; [cite: 14]
    document.getElementById('round-feedback').style.display = 'none';
    document.getElementById('shell-footer-content').style.display = 'flex';
    atualizarUI();
}

function atualizarUI() {
    const pcLabel = modoJogo === 'CPU' ? "Pc" : "J2";[cite: 14]
    const labelJ2 = modoJogo === 'CPU' ? "Pc" : "Jogador 2";[cite: 14]
    const nomeVez = (turnoAtual === 0) ? "Jogador 1" : labelJ2;[cite: 14]
    const classPill = (turnoAtual === 0) ? "pill-j1" : "pill-j2";[cite: 14]
    const orient = orientacoes[turnoAtual]; [cite: 14]

    const dotsHTML = `<div class="status-dots ${orient === 0 ? 'v-dir' : 'h-dir'}"><div class="dot-blink"></div><div class="dot-blink"></div></div>`;[cite: 14]

    document.getElementById('shell-header-content').innerHTML = `
        <div class="status-container">
            <div class="status-pill ${classPill}">${nomeVez} ${dotsHTML}</div>
            <div class="score-group"><div class="score-box box-v">J1: ${matchScore[0]}</div><div class="score-box box-x">${pcLabel}: ${matchScore[1]}</div></div>
        </div>`;[cite: 14]

    const area = document.getElementById('game-content');
    area.innerHTML = `<div id="grid-mount" class="grid-board ${trocouOrientacao ? 'rotated' : ''}"></div>`;[cite: 14]
    renderTabuleiro(document.getElementById('grid-mount'));[cite: 14]

    if (primeiraJogadaRealizada && !j2JaJogou && turnoAtual === 1) {
        const btn = document.createElement('button');
        btn.className = "btn-capa-small"; 
        btn.style = "background:#f9a825; margin: 15px auto; width: 180px; display:block; height:50px; box-shadow: 0 4px 10px rgba(0,0,0,0.2);";[cite: 14]
        btn.innerText = "TROCAR ORIENTAÇÃO"; 
        btn.onclick = swapOrientations; 
        area.appendChild(btn);[cite: 14]
    }
}

function renderTabuleiro(container) {
    const orient = orientacoes[turnoAtual];[cite: 14]
    for (let r = 0; r < 10; r++) {
        for (let c = 0; c < 10; c++) {
            let cell = document.createElement('div');
            cell.className = "cell";[cite: 14]
            if (tabuleiro[r][c] === 1) cell.classList.add("occupied");[cite: 14]
            if (startCell && startCell.r === r && startCell.c === c) cell.classList.add("selected");[cite: 14]
            if (mostrarDicas && startCell && tabuleiro[r][c] === 0 && validarPeca(startCell.r, startCell.c, r, c, orient)) cell.classList.add("hint");[cite: 14]
            cell.onclick = () => handleCellClick(r, c);[cite: 14]
            container.appendChild(cell);[cite: 14]
        }
    }
}

function handleCellClick(r, c) {
    if (!jogoAtivo || (modoJogo === 'CPU' && turnoAtual === 1)) return;[cite: 14]
    if (tabuleiro[r][c] !== 0) return;[cite: 14]
    if (!startCell) { 
        startCell = { r, c }; 
        if (somClique.src) somClique.play().catch(()=>{}); 
        atualizarUI(); 
    } else {
        if (validarPeca(startCell.r, startCell.c, r, c, orientacoes[turnoAtual])) {
            colocarPeca(startCell.r, startCell.c, r, c);[cite: 14]
            if(turnoAtual === 1) j2JaJogou = true;[cite: 14]
            startCell = null; 
            finalizarTurno();[cite: 14]
        } else { 
            startCell = { r, c }; 
            if (somClique.src) somClique.play().catch(()=>{}); 
            atualizarUI(); 
        }
    }
}

function swapOrientations() { 
    if (somAcerto.src) somAcerto.play().catch(()=>{}); 
    trocouOrientacao = !trocouOrientacao; 
    orientacoes = [orientacoes[1], orientacoes[0]]; [cite: 14]
    j2JaJogou = true; 
    turnoAtual = 0; 
    atualizarUI(); [cite: 14]
}

function validarPeca(r1, c1, r2, c2, orient) {
    let rs = Math.min(r1, r2), re = Math.max(r1, r2), cs = Math.min(c1, c2), ce = Math.max(c1, c2);[cite: 14]
    if (orient === 0) { if (c1 !== c2 || re - rs < 1) return false; for (let i = rs; i <= re; i++) if (tabuleiro[i][c1] !== 0) return false; }[cite: 14]
    else { if (r1 !== r2 || ce - cs < 1) return false; for (let i = cs; i <= ce; i++) if (tabuleiro[r1][i] !== 0) return false; }[cite: 14]
    return true;[cite: 14]
}

function colocarPeca(r1, c1, r2, c2) {
    let rs = Math.min(r1, r2), re = Math.max(r1, r2), cs = Math.min(c1, c2), ce = Math.max(c1, c2);[cite: 14]
    for (let r = rs; r <= re; r++) for (let c = cs; c <= ce; c++) tabuleiro[r][c] = 1;[cite: 14]
    primeiraJogadaRealizada = true; 
    if (somClique.src) somClique.play().catch(()=>{});[cite: 14]
}

function finalizarTurno() {
    const proximoJogador = (turnoAtual === 0) ? 1 : 0;[cite: 14]
    const orientProximo = orientacoes[proximoJogador];[cite: 14]
    if (!temLancesLegais(orientProximo)) { finalizarRonda(turnoAtual); return; }[cite: 14]
    turnoAtual = proximoJogador; 
    atualizarUI();[cite: 14]
    if (modoJogo === 'CPU' && turnoAtual === 1) setTimeout(iaControlador, 800);[cite: 14]
}

function temLancesLegais(o) {
    for (let r = 0; r < 10; r++) for (let c = 0; c < 10; c++) if (tabuleiro[r][c] === 0) {[cite: 14]
        if (o === 0 && r < 9 && tabuleiro[r+1][c] === 0) return true;[cite: 14]
        if (o === 1 && c < 9 && tabuleiro[r][c+1] === 0) return true;[cite: 14]
    }
    return false;[cite: 14]
}

function iaControlador() {
    const cpuO = orientacoes[1];[cite: 14]
    let moves = [];
    for (let r=0; r<10; r++) for (let c=0; c<10; c++) if (tabuleiro[r][c] === 0) {[cite: 14]
        if (cpuO === 0 && r<9 && tabuleiro[r+1][c] === 0) moves.push({r1:r, c1:c, r2:r+1, c2:c});[cite: 14]
        if (cpuO === 1 && c<9 && tabuleiro[r][c+1] === 0) moves.push({r1:r, c1:c, r2:r, c2:c+1});[cite: 14]
    }
    if (moves.length === 0) { finalizarRonda(0); return; }[cite: 14]
    let m;
    if (nivelJogo === 1) {
        let boas = moves.filter(mv => {
            let t = tabuleiro.map(row => [...row]); t[mv.r1][mv.c1]=1; t[mv.r2][mv.c2]=1;[cite: 14]
            return temLancesLegaisParaAlguem(t);[cite: 14]
        });
        m = boas.length > 0 ? boas[Math.floor(Math.random()*boas.length)] : moves[Math.floor(Math.random()*moves.length)];[cite: 14]
    } else {
        let melhor = -Infinity;[cite: 14]
        for (let mv of moves) {
            let s = 0; let t = tabuleiro.map(row=>[...row]); t[mv.r1][mv.c1]=1; t[mv.r2][mv.c2]=1;[cite: 14]
            if(!temLancesLegaisParaAlguem(t)) s-=100;[cite: 14]
            let lAdv = contarLances(0, t); let lProp = contarLances(1, t);[cite: 14]
            s += (lAdv % 2 === 0) ? 20 : -10; s += lProp * 5;[cite: 14]
            if(s > melhor){ melhor = s; m = mv; }[cite: 14]
        }
    }
    if(!m) m = moves[0];[cite: 14]
    colocarPeca(m.r1, m.c1, m.r2, m.c2); 
    j2JaJogou = true; 
    finalizarTurno();[cite: 14]
}

function contarLances(idx, tab) {
    const o = orientacoes[idx]; let count = 0;[cite: 14]
    for (let r = 0; r < 10; r++) for (let c = 0; c < 10; c++) if (tab[r][c] === 0) {[cite: 14]
        if (o === 0 && r < 9 && tab[r+1][c] === 0) count++;[cite: 14]
        if (o === 1 && c < 9 && tab[r][c+1] === 0) count++;[cite: 14]
    }
    return count;[cite: 14]
}

function temLancesLegaisParaAlguem(tab) {
    return (contarLances(0, tab) > 0 || contarLances(1, tab) > 0);[cite: 14]
}

// ============================================================
// 5. FINALIZAÇÃO (MELHOR DE 3 -> 2 VITÓRIAS)
// ============================================================
function finalizarRonda(perdedorIdx) {
    jogoAtivo = false; 
    let vencedorIdx = perdedorIdx === 0 ? 1 : 0;[cite: 14]
    matchScore[vencedorIdx]++; 
    if (somAcerto.src) somAcerto.play().catch(()=>{});[cite: 14]
    
    const overlay = document.getElementById('round-feedback');
    const nomeV = vencedorIdx === 0 ? "JOGADOR 1" : (modoJogo === 'CPU' ? "Pc" : "JOGADOR 2");[cite: 14]
    const corV = vencedorIdx === 0 ? "#8cc63f" : "#ff5a5f";[cite: 14]
    const labelBox2 = modoJogo === 'CPU' ? 'Pc' : 'J2';[cite: 14]
    const iconeFeedback = vencedorIdx === 0 ? DADOS.icons.feedbacks.feedback1 : DADOS.icons.feedbacks.feedback4;

    overlay.style.display = 'flex';
    overlay.innerHTML = `<div class="vitoria-card">
        <img src="${iconeFeedback}" style="width:90px; height:90px; object-fit:contain; margin-bottom:10px;">
        <h1 style="color:${corV}; font-size:2rem; font-weight:900; margin:0; text-transform:uppercase;">${nomeV}</h1>
        <p style="color:#666; font-size:1.1rem; font-weight:700; margin:5px 0 0 0;">Venceu esta ronda!</p>
        <div style="margin-top:15px; padding-top:15px; border-top:2px dashed #eee; color:#aaa; font-weight:800;">PLACAR: J1 ${matchScore[0]} - ${matchScore[1]} ${labelBox2}</div>
    </div>`;[cite: 14]
    
    // Condição para 2 vitórias (Melhor de 3)
    if (matchScore[0] >= 2 || matchScore[1] >= 2) setTimeout(finalizarMatch, 2500);[cite: 14]
    else setTimeout(() => { currentGameNum++; trocouOrientacao = false; iniciarJogo(); }, 2500);[cite: 14]
}

function finalizarMatch() {
    document.getElementById('round-feedback').style.display = 'none';[cite: 14]
    const vIdx = (matchScore[0] >= 2) ? 0 : 1;[cite: 14]
    const nomeV = vIdx === 0 ? "JOGADOR 1" : (modoJogo === 'CPU' ? "Pc" : "JOGADOR 2");[cite: 14]
    const lb2 = modoJogo === 'CPU' ? 'Pc' : 'J2';[cite: 14]
    
    document.getElementById('shell-header-content').innerHTML = `<h2 style="color:${DADOS.cores.azulHeader}; font-weight:900; text-transform:uppercase; margin:0; font-size:1.6rem;">GANHOU O ${nomeV}</h2>`;[cite: 14]
    
    document.getElementById('game-content').innerHTML = `
        <div style="text-align:center; display:flex; flex-direction:column; align-items:center; gap:16px; justify-content:center; height:100%;">
            <div style="display:flex; justify-content:center; gap:12px;">
                <div class="score-box box-v" style="padding:10px 20px; font-size:1.1rem;">J1: ${matchScore[0]}</div>
                <div class="score-box box-x" style="padding:10px 20px; font-size:1.1rem;">${lb2}: ${matchScore[1]}</div>
            </div>
            <div style="display:flex; justify-content:center; gap:14px; margin-top:10px; width:100%; max-width:420px;">
                <button class="btn-final-roxo" style="flex:1;" onclick="location.reload()">Jogar de novo</button>
                <button class="btn-final-branco" style="flex:1;" onclick="window.history.back()">Outro jogo</button>
            </div>
        </div>`;[cite: 14]
    document.getElementById('shell-footer-content').style.display = "none";[cite: 14]
}

function iniciarSimulacao() {
    clearInterval(simuInterval);
    const board = document.getElementById('simu-board');
    let sTab = Array(10).fill().map(() => Array(10).fill(0));[cite: 14]
    let sTurno = 0;[cite: 14]
    simuInterval = setInterval(() => {
        let leg = [];
        for(let r=0; r<10; r++) for(let c=0; c<10; c++) {[cite: 14]
            if(sTurno===0 && r<9 && sTab[r][c]===0 && sTab[r+1][c]===0) leg.push({r,c,r2:r+1,c2:c});[cite: 14]
            if(sTurno===1 && c<9 && sTab[r][c]===0 && sTab[r][c+1]===0) leg.push({r,c,r2:r,c2:c+1});[cite: 14]
        }
        if (leg.length === 0) { sTab = Array(10).fill().map(() => Array(10).fill(0)); sTurno = 0; }[cite: 14]
        else { let m = leg[Math.floor(Math.random() * leg.length)]; sTab[m.r][m.c] = 1; sTab[m.r2][m.c2] = 1; sTurno = (sTurno === 0) ? 1 : 0; }[cite: 14]
        let h = `<div class="grid-board" style="opacity:0.4; pointer-events:none;">`;[cite: 14]
        for(let r=0;r<10;r++) for(let c=0;c<10;c++) h+=`<div class="cell ${sTab[r][c]===1?'occupied':''}" style="width:23px; height:23px;"></div>`;[cite: 14]
        if(board) board.innerHTML = h + `</div>`;[cite: 14]
    }, 600);[cite: 14]
}

// Iniciar a capa diretamente
mostrarCapa();[cite: 14]
