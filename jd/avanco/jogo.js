// ============================================================
// 1. ESTADO GLOBAL E SONS
// ============================================================
const JOGO_CONFIG = {
    nomeDoJogo: "Avanço",
    caminhoSons: DADOS.sons ? DADOS.sons.caminho : "",
    caminhoIconsMenu: "../../icons/"
};

let jogoAtivo = false;
let modoJogo = 'CPU';      
let nivelJogo = 1;         
let mostrarDicas = true;  
let matchScore = [0, 0];  
let turnoAtual = 0;        
let tabuleiro = [];        
let selectedPiece = null; 
let simuInterval;          

// Ligação correta aos sons vindos de DADOS
const somAcerto = { play: () => { try { if (DADOS && DADOS.sons && DADOS.sons.certo) new Audio(DADOS.sons.certo).play(); } catch(e){} } };
const somErro = { play: () => { try { if (DADOS && DADOS.sons && DADOS.sons.errado) new Audio(DADOS.sons.errado).play(); } catch(e){} } };
const somClique = { play: () => { try { if (DADOS && DADOS.sons && DADOS.sons.clique) new Audio(DADOS.sons.clique).play(); } catch(e){} } };


// ============================================================
// 2. CONFIGURAÇÃO VISUAL (DESIGN PREMIUM)
// ============================================================
const style = document.createElement('style');
style.innerHTML = `
    .status-container { width: 100%; display: flex; justify-content: space-between; align-items: center; padding: 2px 5px; }
    
    .status-pill { padding: 4px 15px; border-radius: 8px; font-weight: 800; font-size: 0.9rem; color: white; display: flex; align-items: center; gap: 12px; }
    
    .score-group { display: flex; gap: 8px; }
    .score-box { padding: 5px 10px; border-radius: 12px; color: white; font-weight: 900; display: flex; align-items: center; gap: 6px; font-size: 1rem; min-width: 55px; justify-content: center; }
    
    .box-v, .pill-j1 { background: #8cc63f !important; box-shadow: 0 3px 0 #6da32f; }
    .box-x, .pill-j2 { background: #5f6388 !important; box-shadow: 0 3px 0 #4e5272; }
    
    @keyframes blinker { 50% { opacity: 0.2; } }

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
        display: flex; gap: 12px; width: 100%; max-width: 380px; justify-content: center;
    }
    .btn-nivel-card {
        flex: 1; background: white; padding: 14px 10px; border-radius: 16px; border: 2px solid #ccc;
        display: flex; flex-direction: column; align-items: center; justify-content: center; cursor: pointer; transition: 0.2s;
    }
    .btn-nivel-card b { font-size: 0.85rem; font-weight: 900; text-transform: uppercase; margin-bottom: 4px; }
    .btn-nivel-card span { font-size: 0.7rem; font-weight: 700; opacity: 0.7; text-align: center; }
    .btn-nivel-card.l1 { border-color: #8cc63f; color: #8cc63f; }
    .btn-nivel-card.l2 { border-color: #5f6388; color: #5f6388; }
    .btn-nivel-card:active { transform: scale(0.95); }

    #simu-container { height: 260px; display: flex; align-items: center; justify-content: center; width: 100%; overflow: visible; margin-top: 5px; margin-bottom: 20px; }
    
    /* Ajuste exclusivo para reduzir o tamanho da grelha apenas na capa/simulação */
    #simu-board { transform: scale(0.75); transform-origin: center; }

    #instrucoes-panel { position: fixed; top: 0; left: 0; width: 100vw; height: 100vh; background: white; z-index: 10000; transition: transform 0.5s ease; transform: translateY(100%); visibility: hidden; padding: 40px 25px; overflow-y: auto; border-radius: 35px 35px 0 0; }
    #instrucoes-panel.open { transform: translateY(0); visibility: visible; }
    .close-x { position: absolute; top: 15px; right: 20px; font-size: 2.5rem; color: #ff5a5f; cursor: pointer; font-weight: 900; line-height: 1; transition: 0.2s; }
    .close-x:hover { transform: scale(1.2); }

    .inst-content { max-width: 600px; margin: 0 auto; text-align: left; }
    .inst-header { color: ${DADOS.cores.azulHeader}; text-align: center; font-size: 1.8rem; font-weight: 900; margin-bottom: 25px; text-transform: uppercase; border-bottom: 3px solid ${DADOS.cores.fundo}; padding-bottom: 10px; }
    .inst-section-title { color: #444; font-size: 1.2rem; font-weight: 800; margin: 20px 0 12px; display: flex; align-items: center; gap: 10px; }
    .inst-section-title::before { content: ''; width: 6px; height: 22px; background: ${DADOS.cores.azulHeader}; border-radius: 3px; display: inline-block; }
    .inst-list { list-style: none; padding: 0; }
    .inst-list li { background: #f9f9f9; margin-bottom: 10px; padding: 15px; border-radius: 15px; border-left: 5px solid ${DADOS.cores.azulHeader}; color: #555; font-size: 0.95rem; line-height: 1.4; }

    /* TABULEIRO 7x7 DO AVANÇO */
    .grid-board { display: grid; grid-template-columns: repeat(7, 1fr); gap: 4px; background: #bbb; padding: 6px; border-radius: 12px; width: fit-content; margin: 0 auto; }
    .cell { width: var(--cell-size); height: var(--cell-size); background: white; border-radius: 4px; display: flex; align-items: center; justify-content: center; position: relative; cursor: pointer; }
    .piece { width: 80%; height: 80%; border-radius: 50%; }
    .piece.white { background: radial-gradient(circle at 30% 30%, #ffffff, #e0e0e0); border: 1px solid #ccc; box-shadow: 0 3px 6px rgba(0,0,0,0.15); }
    .piece.black { background: radial-gradient(circle at 30% 30%, #5f6388, #3e3e59); border: 1px solid #262638; box-shadow: 0 3px 6px rgba(0,0,0,0.3); }

    #round-feedback { 
        position: absolute; top: 0; left: 0; width: 100%; height: 100%; 
        background: rgba(255, 255, 255, 0.9); backdrop-filter: blur(6px); 
        z-index: 1000; display: none; align-items: center; justify-content: center; border-radius: 35px; 
    }
    .vitoria-card { background: white; padding: 40px 30px; border-radius: 35px; box-shadow: 0 20px 45px rgba(0,0,0,0.2); text-align: center; animation: cardPop 0.4s cubic-bezier(0.17, 0.89, 0.32, 1.28); width: 85%; max-width: 380px; display: flex; flex-direction: column; align-items: center; }
    @keyframes cardPop { 0% { transform: scale(0.7); opacity: 0; } 100% { transform: scale(1); opacity: 1; } }

    :root { --cell-size: 50px; }
    @media screen and (max-width: 500px) { :root { --cell-size: 11vw; } }
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
            <span class="close-x" onclick="toggleInstructions(); somClique.play();">&times;</span>
            <div class="inst-content">
                <div class="inst-header">Como Jogar Avanço</div>
                <div class="inst-section-title">Objetivo do Jogo</div>
                <p class="inst-text">Vence o primeiro jogador que conseguir levar <b>qualquer uma das suas peças</b> até à primeira linha do campo adversário.</p>
                <div class="inst-section-title">Como Mover as Peças</div>
                <ul class="inst-list">
                    <li><b>Frente:</b> Podes avançar 1 casa para a frente se esta estiver vazia.</li>
                    <li><b>Diagonais:</b> Podes mover-te 1 casa para as diagonais frontais se estiverem vazias ou para capturar uma peça adversária.</li>
                </ul>
            </div>`;
        document.body.appendChild(panel);
        
        const feedback = document.createElement('div');
        feedback.id = 'round-feedback';
        document.querySelector('.botao-ano').appendChild(feedback);
    }

    const area = document.getElementById('contentor-jogo');
    if (area) {
        area.innerHTML = `
            <div id="simu-container"><div id="simu-board"></div></div>
        `;
    }

    const barra = document.getElementById('barra-inferior');
    if (barra) {
        barra.style.display = 'flex';
        barra.className = "barra-jogo-topo";
        barra.innerHTML = `
            <div class="btn-capa-info" onclick="toggleInstructions(); somClique.play();"><img src="${DADOS.icons.info}" alt="Info"></div>
            <button class="btn-capa-jogar" onclick="mostrarMenuEscolha(); somClique.play();">JOGAR</button>
        `;
    }

    iniciarSimulacao();
}

function mostrarMenuEscolha() {
    clearInterval(simuInterval);
    somClique.play();
    const area = document.getElementById('contentor-jogo');
    if (area) {
        area.innerHTML = `
            <div class="menu-escolha-container">
                <div class="menu-titulo">Escolhe o modo de jogo</div>
                <button class="btn-modo-grande" onclick="mostrarMenuNiveis('CPU'); somClique.play();"><i class="fas fa-robot"></i> Computador</button>
                <button class="btn-modo-grande" onclick="mostrarMenuNiveis('PVP'); somClique.play();"><i class="fas fa-users"></i> 2 Jogadores</button>
                <button class="btn-voltar-grande" onclick="mostrarCapa(); somClique.play();">Voltar</button>
            </div>
        `;
    }
    const barra = document.getElementById('barra-inferior');
    if (barra) barra.innerHTML = `<div></div>`;
}

function mostrarMenuNiveis(modo) {
    modoJogo = modo;
    somClique.play();
    const area = document.getElementById('contentor-jogo');
    
    let niveisHtml = '';
    if (modo === 'CPU') {
        niveisHtml = `
            <div class="niveis-wrapper">
                <div class="niveis-subtitulo">Jogar com o computador:</div>
                <div class="niveis-row">
                    <div class="btn-nivel-card l1" onclick="setModo('CPU', 1)"><b>Nível 1</b><span>Aprender</span></div>
                    <div class="btn-nivel-card l2" onclick="setModo('CPU', 2)"><b>Nível 2</b><span>Jogar</span></div>
                </div>
            </div>`;
    } else {
        niveisHtml = `
            <div class="niveis-wrapper">
                <div class="niveis-subtitulo">Modo 2 Jogadores:</div>
                <div class="niveis-row">
                    <div class="btn-nivel-card l1" onclick="setModo('PVP', 1)"><b>Nível 1</b><span>Aprender</span></div>
                    <div class="btn-nivel-card l2" onclick="setModo('PVP', 2)"><b>Nível 2</b><span>Jogar</span></div>
                </div>
            </div>`;
    }

    if (area) {
        area.innerHTML = `
            <div class="menu-escolha-container">
                <div class="menu-titulo">Escolhe o modo de jogo</div>
                <button class="btn-modo-grande" onclick="mostrarMenuNiveis('CPU'); somClique.play();" style="opacity:0.8;"><i class="fas fa-robot"></i> Computador</button>
                <button class="btn-modo-grande" onclick="mostrarMenuNiveis('PVP'); somClique.play();" style="opacity:0.8;"><i class="fas fa-users"></i> 2 Jogadores</button>
                ${niveisHtml}
                <button class="btn-voltar-grande" onclick="mostrarMenuEscolha(); somClique.play();">Voltar</button>
            </div>
        `;
    }
}

function toggleInstructions() { 
    document.getElementById('instrucoes-panel').classList.toggle('open'); 
}


// ============================================================
// 4. LÓGICA CORE DO JOGO E IA (AVANÇO)
// ============================================================
function setModo(modo, nivel) {
    clearInterval(simuInterval); 
    somClique.play();
    modoJogo = modo; nivelJogo = nivel;
    mostrarDicas = (nivel === 1);
    matchScore = [0, 0]; turnoAtual = 0; 
    iniciarJogo();
}

function iniciarJogo() {
    jogoAtivo = true;
    selectedPiece = null;
    tabuleiro = Array(7).fill().map(() => Array(7).fill(0));
    for(let c=0; c<7; c++) { 
        tabuleiro[0][c] = 2; tabuleiro[1][c] = 2; 
        tabuleiro[5][c] = 1; tabuleiro[6][c] = 1; 
    }
    const feedbackEl = document.getElementById('round-feedback');
    if (feedbackEl) feedbackEl.style.display = 'none';
    const barra = document.getElementById('barra-inferior');
    if (barra) barra.style.display = 'flex';
    atualizarUI();
    if(modoJogo === 'CPU' && turnoAtual === 1) setTimeout(iaControlador, 800);
}

function atualizarUI() {
    const pcLabel = modoJogo === 'CPU' ? "PC" : "J2";
    const labelJ2 = modoJogo === 'CPU' ? "PC" : "Jogador 2";
    const nomeVez = (turnoAtual === 0) ? "Jogador 1" : labelJ2;
    const classPill = (turnoAtual === 0) ? "pill-j1" : "pill-j2";

    const barra = document.getElementById('barra-inferior');
    if (barra) {
        barra.innerHTML = `
            <div class="status-pill ${classPill}">${nomeVez}</div>
            <div class="score-group"><div class="score-box box-v">J1: ${matchScore[0]}</div><div class="score-box box-x">${pcLabel}: ${matchScore[1]}</div></div>
        `;
    }

    const area = document.getElementById('contentor-jogo');
    if (area) {
        area.innerHTML = `<div id="grid-mount" class="grid-board"></div>`;
        renderTabuleiro(document.getElementById('grid-mount'));
    }
}

function renderTabuleiro(container) {
    if (!container) return;
    const p = turnoAtual === 0 ? 1 : 2;

    let hints = [];
    if (mostrarDicas && selectedPiece) {
        for (let r = 0; r < 7; r++) {
            for (let c = 0; c < 7; c++) {
                if (validarMovimento(selectedPiece.r, selectedPiece.c, r, c, p)) {
                    hints.push({ r, c });
                }
            }
        }
    }

    for (let r = 0; r < 7; r++) {
        for (let c = 0; c < 7; c++) {
            let cell = document.createElement('div');
            cell.className = "cell";
            
            if (selectedPiece && selectedPiece.r === r && selectedPiece.c === c) {
                cell.style.background = "#e8f5e9";
                cell.style.border = "2px solid #8cc63f";
            }

            if (hints.some(h => h.r === r && h.c === c)) {
                cell.innerHTML = '<div style="width:10px; height:10px; background:#8cc63f; border-radius:50%; opacity:0.8;"></div>';
            }

            if (tabuleiro[r][c] === 1) {
                cell.innerHTML = '<div class="piece white"></div>';
            } else if (tabuleiro[r][c] === 2) {
                cell.innerHTML = '<div class="piece black"></div>';
            }
            
            cell.onclick = () => handleCellClick(r, c);
            container.appendChild(cell);
        }
    }
}

function handleCellClick(r, c) {
    if (!jogoAtivo || (modoJogo === 'CPU' && turnoAtual === 1)) return;
    const p = turnoAtual === 0 ? 1 : 2;
    if (tabuleiro[r][c] === p) {
        selectedPiece = { r, c }; 
        somClique.play(); 
        atualizarUI(); 
    } else if (selectedPiece) {
        if (validarMovimento(selectedPiece.r, selectedPiece.c, r, c, p)) {
            executarMovimento(selectedPiece.r, selectedPiece.c, r, c);
        } else { 
            selectedPiece = null; 
            atualizarUI(); 
        }
    }
}

function validarMovimento(r1, c1, r2, c2, p) {
    const dir = p === 1 ? -1 : 1;
    const enemy = p === 1 ? 2 : 1;
    if (c1 === c2 && r2 === r1 + dir && tabuleiro[r2][c2] === 0) return true;
    if (Math.abs(c2 - c1) === 1 && r2 === r1 + dir && (tabuleiro[r2][c2] === 0 || tabuleiro[r2][c2] === enemy)) return true;
    return false;
}

function executarMovimento(fr, fc, tr, tc) {
    const p = tabuleiro[fr][fc];
    tabuleiro[fr][fc] = 0; 
    tabuleiro[tr][tc] = p;
    selectedPiece = null; 
    somClique.play();

    if ((p === 1 && tr === 0) || (p === 2 && tr === 6)) { 
        finalizarRonda(turnoAtual); 
        return; 
    }
    
    turnoAtual = 1 - turnoAtual;
    atualizarUI();
    if (modoJogo === 'CPU' && turnoAtual === 1) setTimeout(iaControlador, 600);
}

function iaControlador() {
    let moves = [];
    for (let r = 0; r < 7; r++) for (let c = 0; c < 7; c++) if (tabuleiro[r][c] === 2) 
        for (let dr = 0; dr < 7; dr++) for (let dc = 0; dc < 7; dc++) if (validarMovimento(r, c, dr, dc, 2)) moves.push({fr:r, fc:c, tr:dr, tc:dc});
    
    if (moves.length === 0) { finalizarRonda(0); return; }
    
    let m;
    if (nivelJogo === 1) {
        m = moves[Math.floor(Math.random() * moves.length)];
    } else {
        // Nível 2 Reforçado (IA Avançada: Vitória imediata > Capturas > Avanço estratégico máximo)
        const win = moves.find(m => m.tr === 6);
        const cap = moves.find(m => tabuleiro[m.tr][m.tc] === 1);
        
        if (win) {
            m = win;
        } else if (cap) {
            m = cap;
        } else {
            // Ordena pelo avanço máximo no tabuleiro (quanto mais próximo de tr = 6, melhor)
            moves.sort((a, b) => b.tr - a.tr);
            m = moves[0];
        }
    }
    
    executarMovimento(m.fr, m.fc, m.tr, m.tc);
}


// ============================================================
// 5. FINALIZAÇÃO (MELHOR DE 3 -> 2 VITÓRIAS)
// ============================================================
function finalizarRonda(vIdx) {
    jogoAtivo = false; 
    matchScore[vIdx]++; 
    somAcerto.play();
    
    const overlay = document.getElementById('round-feedback');
    const nomeV = vIdx === 0 ? "JOGADOR 1" : (modoJogo === 'CPU' ? "PC" : "JOGADOR 2");
    const iconeFeedback = vIdx === 0 ? DADOS.icons.feedbacks.feedback1 : DADOS.icons.feedbacks.feedback4;
    const labelBox2 = modoJogo === 'CPU' ? 'PC' : 'J2';

    if (overlay) {
        overlay.style.display = 'flex';
        overlay.innerHTML = `
            <div class="vitoria-card">
                <img src="${iconeFeedback}" style="height:140px; width:100%; object-fit:contain; margin-bottom:15px;">
                <h1 style="color:#5f6388; font-size:2.1rem; font-weight:900; margin:0; text-transform:uppercase;">GANHOU O ${nomeV}</h1>
                <p style="color:#666; font-size:1.1rem; font-weight:700; margin:6px 0 0 0;">Venceu esta ronda!</p>
                <div style="margin-top:18px; padding-top:15px; border-top:2px dashed #eee; color:#888; font-weight:800; font-size: 1.05rem;">PLACAR: J1 ${matchScore[0]} - ${matchScore[1]} ${labelBox2}</div>
            </div>
        `;
    }
    
    if (matchScore[0] >= 2 || matchScore[1] >= 2) setTimeout(finalizarMatch, 2500);
    else setTimeout(() => { iniciarJogo(); }, 2500);
}

function finalizarMatch() {
    const overlay = document.getElementById('round-feedback');
    const vIdx = (matchScore[0] >= 2) ? 0 : 1;
    const nomeV = vIdx === 0 ? "JOGADOR 1" : (modoJogo === 'CPU' ? "PC" : "JOGADOR 2");
    const lb2 = modoJogo === 'CPU' ? 'PC' : 'J2';
    const iconeFeedback = vIdx === 0 ? DADOS.icons.feedbacks.feedback1 : DADOS.icons.feedbacks.feedback4;

    if (overlay) {
        overlay.style.display = 'flex';
        overlay.innerHTML = `
            <div class="vitoria-card">
                <img src="${iconeFeedback}" style="height:150px; margin-bottom:12px; object-fit:contain;">
                <h1 style="color:#5f6388; font-size:1.5rem; font-weight:900; text-transform:uppercase; margin-bottom:15px;">GANHOU O ${nomeV}</h1>
                <div style="display:flex; justify-content:center; gap:20px; margin-bottom: 20px;">
                    <div class="score-box box-v" style="padding:10px 20px; font-size:1.15rem;">J1: ${matchScore[0]}</div>
                    <div class="score-box box-x" style="padding:10px 20px; font-size:1.15rem;">${lb2}: ${matchScore[1]}</div>
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
    if(!board) return;
    let sTab = Array(7).fill().map(() => Array(7).fill(0));
    const reset = () => { for(let c=0; c<7; c++){ sTab[0][c]=2; sTab[1][c]=2; sTab[5][c]=1; sTab[6][c]=1; } };
    reset();
    
    let sTurno = 1;
    simuInterval = setInterval(() => {
        let moves = [];
        for(let r=0; r<7; r++) for(let c=0; c<7; c++) if(sTab[r][c] === sTurno)
            for(let dr=0; dr<7; dr++) for(let dc=0; dc<7; dc++) 
                if(validarMovimentoSimu(r,c,dr,dc,sTurno,sTab)) moves.push({fr:r, fc:c, tr:dr, tc:dc});
        
        if(moves.length > 0) {
            const m = moves[Math.floor(Math.random()*moves.length)];
            sTab[m.tr][m.tc] = sTab[m.fr][m.fc]; sTab[m.fr][m.fc] = 0;
            if((sTurno===1 && m.tr===0) || (sTurno===2 && m.tr===6)) reset();
            else sTurno = sTurno === 1 ? 2 : 1;
        } else reset();

        board.innerHTML = `<div class="grid-board" style="opacity:0.4; pointer-events:none;">` + 
            sTab.flat().map(v => `<div class="cell">${v?`<div class="piece ${v==1?'white':'black'}"></div>`:''}</div>`).join('') + `</div>`;
    }, 700);
}

function validarMovimentoSimu(r1, c1, r2, c2, p, tab) {
    const d = p === 1 ? -1 : 1;
    if(c1 === c2 && r2 === r1 + d && tab[r2][c2] === 0) return true;
    if(Math.abs(c2 - c1) === 1 && r2 === r1 + d && (tab[r2][c2] === 0 || tab[r2][c2] === (3-p))) return true;
    return false;
}

// Iniciar a capa diretamente
mostrarCapa();
