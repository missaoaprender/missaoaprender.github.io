// ============================================================
// 1. ESTADO GLOBAL E SONS
// ============================================================
const JOGO_CONFIG = {
    nomeDoJogo: "Semáforo",
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
let tabuleiro = Array(3).fill().map(() => Array(4).fill(0)); 
let pecasDisponiveis = { 1: 8, 2: 8, 3: 8 }; // 1: Verde, 2: Amarela, 3: Vermelha
let corSelecionada = null;
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
    .box-x, .pill-j2 { background: #ff5a5f !important; box-shadow: 0 3px 0 #d44348; }
    .blinking { animation: blinker 1s linear infinite; }
    @keyframes blinker { 50% { opacity: 0.4; } }

    #round-feedback {
        position: absolute; top: 0; left: 0; width: 100%; height: 100%;
        background: rgba(255, 255, 255, 0.88); backdrop-filter: blur(6px); 
        z-index: 1000; display: none; align-items: center; justify-content: center; border-radius: 35px;
    }
    .vitoria-card { background: white; padding: 40px 30px; border-radius: 35px; box-shadow: 0 20px 45px rgba(0,0,0,0.2); text-align: center; animation: cardPop 0.4s cubic-bezier(0.17, 0.89, 0.32, 1.28); width: 85%; max-width: 380px; display: flex; flex-direction: column; align-items: center; }
    @keyframes cardPop { 0% { transform: scale(0.7); opacity: 0; } 100% { transform: scale(1); opacity: 1; } }

    /* Barra da Capa com Info e Jogar */
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

    /* Botões de feedback centralizados */
    .btn-feedback-container { display: flex; gap: 15px; justify-content: center; margin-top: 20px; width: 100%; max-width: 400px; }
    .btn-feedback-solid {
        flex: 1; background-color: #5f6388; color: #FFFFFF; border: none;
        padding: 14px 20px; border-radius: 25px; font-weight: 900; font-size: 1rem;
        cursor: pointer; box-shadow: 0 4px 12px rgba(95,99,136,0.3); transition: transform 0.1s ease;
        text-transform: capitalize;
    }
    .btn-feedback-solid:active { transform: scale(0.95); }
    .btn-feedback-outline {
        flex: 1; background-color: #FFFFFF; color: #5f6388; border: 2px solid #5f6388;
        padding: 14px 20px; border-radius: 25px; font-weight: 900; font-size: 1rem;
        cursor: pointer; box-shadow: 0 4px 12px rgba(0,0,0,0.08); transition: transform 0.1s ease;
        text-transform: capitalize;
    }
    .btn-feedback-outline:active { transform: scale(0.95); }

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
    .btn-nivel-card.l2 { border-color: #f9a825; color: #f9a825; }
    .btn-nivel-card.l3 { border-color: #666699; color: #666699; }
    .btn-nivel-card:active { transform: scale(0.95); }

    #simu-container { height: 210px; display: flex; align-items: center; justify-content: center; width: 100%; overflow: visible; margin-bottom: 5px; }

    #instrucoes-panel { position: fixed; top: 100vh; left: 0; width: 100vw; height: 100vh; background: white; z-index: 10000; transition: top 0.5s cubic-bezier(0.4, 0, 0.2, 1); padding: 40px 25px; overflow-y: auto; border-radius: 35px 35px 0 0; }
    #instrucoes-panel.open { top: 0; }
    .close-x { position: absolute; top: 15px; right: 20px; font-size: 2.2rem; color: #ff5a5f; cursor: pointer; font-weight: 900; line-height: 1; transition: 0.2s; }

    /* LAYOUT DO JOGO (TABULEIRO + PILHAS DE PEÇAS FORA) */
    .game-area-layout { display: flex; flex-direction: column; align-items: center; gap: 15px; width: 100%; }
    .pilhas-container { display: flex; gap: 15px; justify-content: center; align-items: center; background: #eef0f6; padding: 10px 20px; border-radius: 20px; box-shadow: inset 0 2px 5px rgba(0,0,0,0.05); }
    .pilha-item { display: flex; flex-direction: column; align-items: center; cursor: pointer; padding: 6px 12px; border-radius: 14px; border: 2px solid transparent; transition: 0.2s; position: relative; }
    .pilha-item.selected { border-color: #5f6388; background: white; box-shadow: 0 4px 10px rgba(0,0,0,0.1); transform: scale(1.05); }
    .pilha-item:active { transform: scale(0.95); }
    .pilha-peca-visual { width: 35px; height: 35px; border-radius: 50%; box-shadow: inset 0 -3px 4px rgba(0,0,0,0.2), 0 3px 6px rgba(0,0,0,0.15); border: 2px solid rgba(255,255,255,0.4); display: flex; align-items: center; justify-content: center; font-size: 0.75rem; font-weight: 900; color: white; text-shadow: 0 1px 2px rgba(0,0,0,0.5); }
    .pilha-label { font-size: 0.75rem; font-weight: 800; color: #555; margin-top: 4px; text-transform: uppercase; }

    .grid-board { display: grid; grid-template-columns: repeat(4, 1fr); gap: 10px; background: #bbb; padding: 10px; border-radius: 15px; width: fit-content; margin: 0 auto; }
    .cell { width: var(--cell-size); height: var(--cell-size); background: white; border-radius: 12px; position: relative; display: flex; align-items: center; justify-content: center; cursor: pointer; transition: 0.2s; }
    .cell.hint-move { background: #e8f5e9 !important; border: 2px dashed #8cc63f; }
    
    .piece { width: 88%; height: 88%; border-radius: 50%; box-shadow: inset 0 -4px 6px rgba(0,0,0,0.2), 0 4px 8px rgba(0,0,0,0.1); border: 2px solid rgba(255,255,255,0.3); }
    .piece.green { background: #8cc63f; }
    .piece.yellow { background: #f9a825; }
    .piece.red { background: #ff5a5f; }

    @media screen and (min-width: 1025px) { 
        :root { --cell-size: 95px; } 
    }
    
    @media screen and (max-width: 500px) and (orientation: portrait) { 
        :root { --cell-size: 16vw; } 
        .grid-board { gap: 6px; padding: 6px; border-radius: 10px; margin: auto !important; }
        .cell { border-radius: 8px; }
        .pilha-peca-visual { width: 28px; height: 28px; font-size: 0.65rem; }
    }
    
    @media screen and (max-height: 500px) and (orientation: landscape) { 
        :root { --cell-size: 20vh; } 
        .grid-board { gap: 5px; padding: 5px; }
    }

    .inst-content { max-width: 600px; margin: 0 auto; text-align: left; }
    .inst-header { color: ${DADOS.cores.azulHeader}; text-align: center; font-size: 1.8rem; font-weight: 900; margin-bottom: 25px; text-transform: uppercase; border-bottom: 3px solid ${DADOS.cores.fundo}; padding-bottom: 10px; }
    .inst-section-title { color: #444; font-size: 1.2rem; font-weight: 800; margin: 20px 0 10px; display: flex; align-items: center; gap: 10px; }
    .inst-section-title::before { content: ''; width: 6px; height: 22px; background: ${DADOS.cores.azulHeader}; border-radius: 3px; display: inline-block; }
    .inst-text { color: #666; font-size: 1.05rem; line-height: 1.6; margin-bottom: 15px; }
    .inst-list { list-style: none; padding: 0; }
    .inst-list li { background: #f9f9f9; margin-bottom: 8px; padding: 12px 15px; border-radius: 12px; border-left: 4px solid ${DADOS.cores.azulHeader}; color: #555; font-size: 1rem; line-height: 1.4; }
`;
document.head.appendChild(style);


// ============================================================
// 3. CAPA, SIMULAÇÃO E INSTRUÇÕES
// ============================================================
function mostrarCapa() {
    if (jogoAtivo) return;
    
    if(!document.getElementById('instrucoes-panel')) {
        const panel = document.createElement('div');
        panel.id = 'instrucoes-panel';
        panel.innerHTML = `
            <span class="close-x" onclick="toggleInstructions()">&times;</span>
            <div class="inst-content">
                <div class="inst-header">Semáforo</div>
                <div class="inst-section-title">Objetivo</div>
                <p class="inst-text">Ser o primeiro a conseguir uma <b>linha de três peças da mesma cor</b> (horizontal, vertical ou diagonal).</p>
                <div class="inst-section-title">Como Jogar</div>
                <ul class="inst-list">
                    <li><b>1.</b> Seleciona uma cor nas pilhas de peças (Verde, Amarela ou Vermelha).</li>
                    <li><b>2.</b> Podes colocar uma peça <b>Verde</b> num quadrado vazio.</li>
                    <li><b>3.</b> Podes substituir uma peça Verde por uma <b>Amarela</b>.</li>
                    <li><b>4.</b> Podes substituir uma peça Amarela por uma <b>Vermelha</b>. As peças vermelhas já não podem ser alteradas.</li>
                </ul>
            </div>`;
        document.body.appendChild(panel);
        
        const feedback = document.createElement('div');
        feedback.id = 'round-feedback';
        document.querySelector('.botao-ano').appendChild(feedback);
    }

    const area = document.getElementById('contentor-jogo');
    area.innerHTML = `
        <div id="simu-container"><div id="simu-board" style="transform: scale(0.75);"></div></div>
    `;

    const barra = document.getElementById('barra-inferior');
    barra.style.display = 'flex';
    barra.className = "barra-jogo-topo";
    barra.innerHTML = `
        <div class="btn-capa-info" onclick="toggleInstructions()"><i class="fas fa-info"></i></div>
        <button class="btn-capa-jogar" onclick="mostrarMenuEscolha()">JOGAR</button>
    `;

    iniciarSimulacao();
}

function mostrarMenuEscolha() {
    clearInterval(simuInterval);
    if (somClique.src) somClique.play().catch(()=>{});
    const area = document.getElementById('contentor-jogo');
    area.innerHTML = `
        <div class="menu-escolha-container">
            <div class="menu-titulo">Escolhe o modo de jogo</div>
            <button class="btn-modo-grande" onclick="mostrarMenuNiveis('CPU')"><i class="fas fa-robot"></i> Computador</button>
            <button class="btn-modo-grande" onclick="mostrarMenuNiveis('PVP')"><i class="fas fa-users"></i> 2 Jogadores</button>
            <button class="btn-voltar-grande" onclick="mostrarCapa()">Voltar</button>
        </div>
    `;
    const barra = document.getElementById('barra-inferior');
    barra.innerHTML = `<div></div>`;
}

function mostrarMenuNiveis(modo) {
    modoJogo = modo;
    if (somClique.src) somClique.play().catch(()=>{});
    const area = document.getElementById('contentor-jogo');
    
    let niveisHtml = '';
    if (modo === 'CPU') {
        niveisHtml = `
            <div class="niveis-wrapper">
                <div class="niveis-subtitulo">Desafio contra PC:</div>
                <div class="niveis-row">
                    <div class="btn-nivel-card l1" onclick="setModo('CPU', 1)"><b>Nível 1</b><span>Básico</span></div>
                    <div class="btn-nivel-card l2" onclick="setModo('CPU', 2)"><b>Nível 2</b><span>Normal</span></div>
                    <div class="btn-nivel-card l3" onclick="setModo('CPU', 3)"><b>Nível 3</b><span>Difícil</span></div>
                </div>
            </div>`;
    } else {
        niveisHtml = `
            <div class="niveis-wrapper">
                <div class="niveis-subtitulo">2 Jogadores:</div>
                <div class="niveis-row">
                    <div class="btn-nivel-card l1" onclick="setModo('PVP', 1)"><b>Nível 1</b><span>Com Dicas</span></div>
                    <div class="btn-nivel-card l2" onclick="setModo('PVP', 2)"><b>Nível 2</b><span>Sem Dicas</span></div>
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
// 4. LÓGICA CORE DO JOGO E TURNOS
// ============================================================
function setModo(modo, nivel) {
    if (somClique.src) somClique.play().catch(()=>{});
    modoJogo = modo; nivelJogo = nivel;
    mostrarDicas = (nivel === 1);
    matchScore = [0, 0]; currentGameNum = 1; turnoAtual = 0; 
    iniciarJogo();
}

function iniciarJogo() {
    jogoAtivo = true;
    tabuleiro = Array(3).fill().map(() => Array(4).fill(0));
    pecasDisponiveis = { 1: 8, 2: 8, 3: 8 };
    corSelecionada = null;
    document.getElementById('round-feedback').style.display = 'none';
    document.getElementById('barra-inferior').style.display = 'flex';
    atualizarUI();
}

function atualizarUI() {
    const pcLabel = "PC";
    const j2Label = "J2";
    const labelSegundaBox = modoJogo === 'CPU' ? pcLabel : j2Label;
    let turnInfoHTML = "";

    if (modoJogo === 'CPU') {
        if (turnoAtual === 0) turnInfoHTML = `<div class="status-pill pill-j1 blinking">JOGADOR 1</div>`;
        else turnInfoHTML = `<div style="flex:1"></div>`; 
    } else {
        const classPill = (turnoAtual === 0) ? "pill-j1" : "pill-j2";
        const nomeVez = (turnoAtual === 0) ? "JOGADOR 1" : "JOGADOR 2";
        turnInfoHTML = `<div class="status-pill ${classPill} blinking">${nomeVez}</div>`;
    }

    document.getElementById('barra-inferior').innerHTML = `
        ${turnInfoHTML}
        <div class="score-group">
            <div class="score-box box-v">J1: ${matchScore[0]}</div>
            <div class="score-box box-x">${labelSegundaBox}: ${matchScore[1]}</div>
        </div>`;
    renderTabuleiro();
}

function selecionarPilha(cor) {
    if (!jogoAtivo || (modoJogo === 'CPU' && turnoAtual === 1)) return;
    if (pecasDisponiveis[cor] <= 0) return;
    corSelecionada = cor;
    somClique.play();
    renderTabuleiro();
}

function renderTabuleiro() {
    const area = document.getElementById('contentor-jogo');
    
    // HTML das pilhas de peças fora do tabuleiro
    let pilhasHtml = `<div class="game-area-layout">
        <div class="pilhas-container">
            <div class="pilha-item ${corSelecionada === 1 ? 'selected' : ''}" onclick="selecionarPilha(1)">
                <div class="pilha-peca-visual green">${pecasDisponiveis[1]}</div>
                <span class="pilha-label">Verde</span>
            </div>
            <div class="pilha-item ${corSelecionada === 2 ? 'selected' : ''}" onclick="selecionarPilha(2)">
                <div class="pilha-peca-visual yellow">${pecasDisponiveis[2]}</div>
                <span class="pilha-label">Amarela</span>
            </div>
            <div class="pilha-item ${corSelecionada === 3 ? 'selected' : ''}" onclick="selecionarPilha(3)">
                <div class="pilha-peca-visual red">${pecasDisponiveis[3]}</div>
                <span class="pilha-label">Vermelha</span>
            </div>
        </div>
        <div class="grid-board">`;

    for (let r = 0; r < 3; r++) {
        for (let c = 0; c < 4; c++) {
            let cl = "cell";
            let val = tabuleiro[r][c];
            
            // Dicas visuais no Nível 1 se houver uma cor selecionada
            let isHint = false;
            if (mostrarDicas && corSelecionada !== null && val < 3 && val + 1 === corSelecionada) {
                isHint = true;
            }

            if (isHint) cl += " hint-move";

            pilhasHtml += `<div class="${cl}" onclick="jogar(${r},${c})">`;
            if (val === 1) pilhasHtml += `<div class="piece green"></div>`;
            if (val === 2) pilhasHtml += `<div class="piece yellow"></div>`;
            if (val === 3) pilhasHtml += `<div class="piece red"></div>`;
            pilhasHtml += `</div>`;
        }
    }
    pilhasHtml += `</div></div>`;
    area.innerHTML = pilhasHtml;
}

function jogar(r, c) {
    if (!jogoAtivo || (modoJogo === 'CPU' && turnoAtual === 1)) return;
    if (corSelecionada === null) return;

    let atual = tabuleiro[r][c];
    // Regra do semáforo: 0 -> 1 (Verde), 1 -> 2 (Amarelo), 2 -> 3 (Vermelho)
    if (atual + 1 !== corSelecionada || atual >= 3 || pecasDisponiveis[corSelecionada] <= 0) {
        somErro.play();
        return;
    }

    tabuleiro[r][c]++;
    pecasDisponiveis[corSelecionada]--;
    corSelecionada = null;
    somClique.play();

    if (verificarVitoria(tabuleiro)) {
        finalizarRonda(turnoAtual);
        return;
    }

    turnoAtual = (turnoAtual === 0) ? 1 : 0;
    if (modoJogo === 'CPU' && turnoAtual === 1) { 
        atualizarUI(); 
        setTimeout(iaControlador, 700); 
    } else { 
        atualizarUI(); 
    }
}

function iaControlador() {
    let moves = [];
    for(let r=0; r<3; r++) for(let c=0; c<4; c++) {
        let atual = tabuleiro[r][c];
        if (atual < 3) {
            let corDesejada = atual + 1;
            if (pecasDisponiveis[corDesejada] > 0) {
                moves.push({r, c, cor: corDesejada});
            }
        }
    }
    if (moves.length === 0) return;

    let move;
    if (nivelJogo >= 2) {
        // Tenta encontrar jogada de vitória imediata para a IA
        for (let m of moves) {
            let tempTab = tabuleiro.map(row => [...row]);
            tempTab[m.r][m.c]++;
            if (verificarVitoria(tempTab)) { move = m; break; }
        }
    }

    if (!move && nivelJogo === 3) {
        // Evita dar vitória direta ao jogador humano no próximo turno se possível
        moves = moves.filter(m => {
            let tempTab = tabuleiro.map(row => [...row]);
            tempTab[m.r][m.c]++;
            let winHumano = false;
            for(let r=0; r<3; r++) for(let c=0; c<4; c++) {
                let a = tempTab[r][c];
                if(a < 3 && pecasDisponiveis[a+1] > 0) {
                    let hTab = tempTab.map(row => [...row]);
                    hTab[r][c]++;
                    if(verificarVitoria(hTab)) winHumano = true;
                }
            }
            return !winHumano;
        });
        if (moves.length === 0) {
            for(let r=0; r<3; r++) for(let c=0; c<4; c++) {
                let atual = tabuleiro[r][c];
                if (atual < 3 && pecasDisponiveis[atual+1] > 0) moves.push({r, c, cor: atual + 1});
            }
        }
    }

    if (!move) move = moves[Math.floor(Math.random() * moves.length)];
    
    tabuleiro[move.r][move.c]++;
    pecasDisponiveis[move.cor]--;

    if (verificarVitoria(tabuleiro)) { 
        finalizarRonda(1); 
    } else { 
        turnoAtual = 0; 
        atualizarUI(); 
    }
}

function verificarVitoria(tab) {
    for(let r=0; r<3; r++) for(let c=0; c<2; c++) if(tab[r][c]!==0 && tab[r][c]===tab[r][c+1] && tab[r][c]===tab[r][c+2]) return true;
    for(let c=0; c<4; c++) if(tab[0][c]!==0 && tab[0][c]===tab[1][c] && tab[0][c]===tab[2][c]) return true;
    for(let c=0; c<2; c++) {
        if(tab[0][c]!==0 && tab[0][c]===tab[1][c+1] && tab[0][c]===tab[2][c+2]) return true;
        if(tab[2][c]!==0 && tab[2][c]===tab[1][c+1] && tab[2][c]===tab[0][c+2]) return true;
    }
    return false;
}


// ============================================================
// 5. FINALIZAÇÃO (MELHOR DE 3 -> 2 VITÓRIAS)
// ============================================================
function finalizarRonda(vencedorIdx) {
    jogoAtivo = false;
    matchScore[vencedorIdx]++;
    somAcerto.play();
    
    const overlay = document.getElementById('round-feedback');
    const nomeVencedor = vencedorIdx === 0 ? "JOGADOR 1" : (modoJogo === 'CPU' ? "PC" : "JOGADOR 2");
    const corVencedor = vencedorIdx === 0 ? "#8cc63f" : "#ff5a5f";
    const iconeFeedback = vencedorIdx === 0 ? DADOS.icons.feedbacks.feedback1 : DADOS.icons.feedbacks.feedback4;

    overlay.style.display = 'flex';
    overlay.innerHTML = `<div class="vitoria-card">
        <img src="${iconeFeedback}" style="height:140px; width:100%; object-fit:contain; margin-bottom:15px;">
        <h1 style="color:${corVencedor}; font-size:2.1rem; font-weight:900; margin:0; text-transform:uppercase;">${nomeVencedor}</h1>
        <p style="color:#666; font-size:1.1rem; font-weight:700; margin:6px 0 0 0;">Venceu esta ronda!</p>
        <div style="margin-top:18px; padding-top:15px; border-top:2px dashed #eee; color:#888; font-weight:800; font-size: 1.05rem;">PLACAR: J1 ${matchScore[0]} - ${matchScore[1]}</div>
    </div>`;
    
    if (matchScore[0] >= 2 || matchScore[1] >= 2) setTimeout(finalizarMatch, 2500);
    else setTimeout(() => { currentGameNum++; turnoAtual = 0; iniciarJogo(); }, 2500);
}

function finalizarMatch() {
    const overlay = document.getElementById('round-feedback');
    const vencedorIdx = (matchScore[0] >= 2) ? 0 : 1;
    const nomeVencedor = vencedorIdx === 0 ? "JOGADOR 1" : (modoJogo === 'CPU' ? "PC" : "JOGADOR 2");
    const labelSegundaBox = modoJogo === 'CPU' ? "PC" : "J2";
    const iconeFeedback = vencedorIdx === 0 ? DADOS.icons.feedbacks.feedback1 : DADOS.icons.feedbacks.feedback4;
    
    if (overlay) {
        overlay.style.display = 'flex';
        overlay.innerHTML = `
            <div class="vitoria-card">
                <img src="${iconeFeedback}" style="height:150px; margin-bottom:12px; object-fit:contain;">
                <h1 style="color:${DADOS.cores.azulHeader}; font-size:1.5rem; font-weight:900; text-transform:uppercase; margin-bottom:15px;">GANHOU O ${nomeVencedor}</h1>
                <div style="display:flex; justify-content:center; gap:20px; margin-bottom: 20px;">
                    <div class="score-box box-v" style="padding:10px 20px; font-size:1.15rem;">J1: ${matchScore[0]}</div>
                    <div class="score-box box-x" style="padding:10px 20px; font-size:1.15rem;">${labelSegundaBox}: ${matchScore[1]}</div>
                </div>
                <div class="btn-feedback-container">
                    <button class="btn-feedback-solid" onclick="location.reload(); somClique.play();">Jogar de novo</button>
                    <button class="btn-feedback-outline" onclick="window.location.href='../../'; somClique.play();">Outro jogo</button>
                </div>
            </div>`;
    }
    const barra = document.getElementById('barra-inferior');
    if (barra) barra.style.display = "none";
}

function iniciarSimulacao() {
    clearInterval(simuInterval);
    const board = document.getElementById('simu-board');
    let sTab = Array(3).fill().map(() => Array(4).fill(0));
    const render = () => {
        if(!board) return;
        let h = `<div class="grid-board" style="opacity:0.6; pointer-events:none; transform:scale(0.85);">`;
        for (let r = 0; r < 3; r++) for (let c = 0; c < 4; c++) {
            h += `<div class="cell" style="width:70px; height:70px;">`;
            if(sTab[r][c]===1) h+=`<div class="piece green"></div>`;
            if(sTab[r][c]===2) h+=`<div class="piece yellow"></div>`;
            if(sTab[r][c]===3) h+=`<div class="piece red"></div>`;
            h += `</div>`;
        }
        board.innerHTML = h + `</div>`;
    };
    simuInterval = setInterval(() => {
        let leg = [];
        for(let r=0; r<3; r++) for(let c=0; c<4; c++) if(sTab[r][c]<3) leg.push({r,c});
        if (leg.length === 0 || verificarVitoria(sTab)) { sTab = Array(3).fill().map(() => Array(4).fill(0)); }
        else {
            let m = leg[Math.floor(Math.random() * leg.length)];
            sTab[m.r][m.c]++;
        }
        render();
    }, 700);
}

// Iniciar a capa diretamente
mostrarCapa();
