// ============================================================
// 1. ESTADO GLOBAL E CONFIGURAÇÃO DO JOGO
// ============================================================
const listaAnimais = DADOS.animaisSelvagens;
const caminhoPasta = DADOS.caminhoAnimais;

let indiceAnimalAtual = 0;
let indiceCabeca = 0;
let indiceMeio = 0;
let indiceCorpo = 0;

const somAcerto = new Audio(DADOS.sons && DADOS.sons.certo ? DADOS.sons.certo : "");
const somClique = new Audio(DADOS.sons && DADOS.sons.clique ? DADOS.sons.clique : "");
const somInstrucao = new Audio(DADOS.sons && DADOS.sons.instrucao ? DADOS.sons.instrucao : "");


// ============================================================
// 2. CONFIGURAÇÃO VISUAL (ESTILOS CSS)
// ============================================================
const style = document.createElement('style');
style.innerHTML = `
    .montagem-container {
        display: flex; flex-direction: column; align-items: center; justify-content: center;
        width: 100%; height: 100%; flex: 1; gap: 10px; animation: cardPop 0.35s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards; padding: 6px 0;
        position: relative; box-sizing: border-box;
    }
    @keyframes cardPop { 0% { transform: scale(0.85); opacity: 0; } 100% { transform: scale(1); opacity: 1; } }

    .puzzle-wrapper {
        position: relative; width: 260px; height: 260px; background: white; border: 4px solid #E2D3AB; border-radius: 20px;
        box-shadow: 0 6px 20px rgba(0,0,0,0.08); overflow: hidden; display: flex; flex-direction: column;
    }

    .puzzle-seccao {
        width: 100%; flex: 1; position: relative; overflow: hidden; border-bottom: 2px dashed #E2D3AB;
    }
    .puzzle-seccao:last-child { border-bottom: none; }

    .puzzle-seccao img {
        position: absolute; width: 260px; height: 260px; object-fit: cover; left: 0; pointer-events: none;
    }
    .fatia-cabeca { top: 0; }
    .fatia-meio { top: -86.6px; }
    .fatia-corpo { top: -173.3px; }

    .btn-seta-puzzle {
        background: #ECA607; color: white; border: 2px solid #F4D06F; width: 40px; height: 40px;
        border-radius: 50%; cursor: pointer; display: flex; align-items: center; justify-content: center;
        box-shadow: 0 4px 10px rgba(236,166,7,0.3); transition: transform 0.15s ease, background 0.15s ease;
        font-size: 0.9rem; font-weight: 900;
    }
    .btn-seta-puzzle:hover { transform: scale(1.1); background: #d99605; }
    .btn-seta-puzzle:active { transform: scale(0.92); }

    .btn-verificar-puzzle {
        background: #23AA45; color: white; border: 2.5px solid #A3E4B5; padding: 8px 22px;
        border-radius: 18px; font-weight: 900; font-size: 0.9rem; cursor: pointer;
        box-shadow: 0 4px 12px rgba(35,170,69,0.35); text-transform: uppercase;
        transition: transform 0.2s ease, background 0.2s ease;
    }
    .btn-verificar-puzzle:hover { transform: translateY(-2px); background: #1e913a; }
    .btn-verificar-puzzle:active { transform: scale(0.95); }

    .btn-capa-som, .btn-menu-topo {
        height: 44px; background: white; color: #C2890B; border: 2px solid #E2D3AB;
        padding: 0 16px; border-radius: 22px; font-weight: 900; font-size: 0.85rem;
        cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 6px;
        box-shadow: 0 3px 8px rgba(0,0,0,0.08); transition: transform 0.2s ease, background 0.2s ease;
    }
    .btn-capa-som { width: 44px; padding: 0; border-radius: 50%; }
    .btn-capa-som:hover, .btn-menu-topo:hover { transform: scale(1.05); background: #FFF9E6; }
    .btn-capa-som img { width: 22px; height: 22px; object-fit: contain; }

    .btn-capa-jogar {
        background: white; color: #C2890B; border: none; padding: 8px 26px; border-radius: 18px;
        font-weight: 900; font-size: 1rem; cursor: pointer; box-shadow: 0 4px 15px rgba(0,0,0,0.15);
        text-transform: uppercase; transition: transform 0.2s ease;
    }
    .btn-capa-jogar:hover { transform: scale(1.05); background: #FFFDF0; }

    .animacao-capa-container {
        width: 170px; height: 170px; background: white; border: 3px solid #E2D3AB; border-radius: 24px;
        display: flex; align-items: center; justify-content: center; position: relative;
        box-shadow: 0 10px 25px rgba(236,166,7,0.25); margin-bottom: 10px; overflow: hidden;
    }
    .animacao-capa-container img { width: 120px; height: 120px; object-fit: contain; animation: cardPop 0.5s ease; }

    #round-feedback { 
        position: absolute; top: 0; left: 0; width: 100%; height: 100%; background: #ffffff; 
        z-index: 9999; display: none; flex-direction: column; align-items: center; justify-content: space-between; 
        border-radius: 16px; overflow: hidden; padding: 20px; box-sizing: border-box;
    }
    .feedback-bottom-bar { width: 100%; height: 14px; background: #ECA607; border-radius: 7px; flex-shrink: 0; }
    .vitoria-card { background: transparent; padding: 10px 20px; text-align: center; display: flex; flex-direction: column; align-items: center; gap: 12px; width: 100%; max-width: 480px; margin: auto 0; }
    
    .btn-final-roxo { background: #ECA607; color: white; border: none; padding: 14px 22px; border-radius: 25px; font-weight: 900; font-size: 1rem; cursor: pointer; box-shadow: 0 6px 18px rgba(236,166,7,0.35); }
    .btn-final-branco { background: white; color: #C2890B; border: 2px solid #E2D3AB; padding: 14px 22px; border-radius: 25px; font-weight: 900; font-size: 1rem; cursor: pointer; }
`;
document.head.appendChild(style);


// ============================================================
// 3. CAPA DO JOGO
// ============================================================
function mostrarCapa() {
    const slotTopo = document.getElementById('slot-topo');
    const slotFundo = document.getElementById('slot-fundo');

    if (slotTopo) {
        slotTopo.className = "barrita-fundo-cartao";
        slotTopo.innerHTML = "";
    }

    const area = document.getElementById('contentor-jogo');
    if (area) {
        const tituloAnimacao = DADOS.animacaoCapa ? DADOS.animacaoCapa.titulo : "Monta o Animal";
        area.innerHTML = `
            <div style="font-size: 1.3rem; font-weight: 900; color: #C2890B; margin-bottom: 6px; text-transform: uppercase;">${tituloAnimacao}</div>
            <div class="animacao-capa-container">
                <img src="${caminhoPasta}${listaAnimais[0].arquivo}" alt="Capa">
            </div>
            <div id="round-feedback" style="display: none;"></div>
        `;
    }

    if (slotFundo) {
        slotFundo.className = "barra-jogo-topo";
        slotFundo.innerHTML = `
            <div class="btn-capa-som" onclick="tocarSomInstrucao()"><img src="${DADOS.icons.som}" alt="Som"></div>
            <button class="btn-capa-jogar" onclick="iniciarJogoMontagem()">COMEÇAR</button>
        `;
    }
}

function tocarSomInstrucao() {
    if (somClique.src) somClique.play().catch(()=>{});
    somInstrucao.currentTime = 0;
    somInstrucao.play().catch(()=>{});
}


// ============================================================
// 4. LÓGICA DO JOGO DE MONTAGEM
// ============================================================
function iniciarJogoMontagem() {
    if (somClique.src) somClique.play().catch(()=>{});

    indiceAnimalAtual = Math.floor(Math.random() * listaAnimais.length);
    
    indiceCabeca = Math.floor(Math.random() * listaAnimais.length);
    indiceMeio = Math.floor(Math.random() * listaAnimais.length);
    indiceCorpo = Math.floor(Math.random() * listaAnimais.length);

    const slotTopo = document.getElementById('slot-topo');
    const slotFundo = document.getElementById('slot-fundo');
    const area = document.getElementById('contentor-jogo');

    if (slotTopo) {
        slotTopo.className = "barra-jogo-topo";
        slotTopo.innerHTML = `
            <div class="btn-capa-som" onclick="tocarSomInstrucao()"><img src="${DADOS.icons.som}" alt="Som"></div>
            <div style="color: white; font-weight: 900; font-size: 0.9rem;">Constrói: ${listaAnimais[indiceAnimalAtual].nome}</div>
            <button class="btn-menu-topo" onclick="mostrarCapa()"><i class="fas fa-bars"></i> Menu</button>
        `;
    }

    if (area) {
        area.innerHTML = `
            <div class="montagem-container">
                <div class="puzzle-wrapper">
                    <div class="puzzle-seccao">
                        <img id="imgCabeca" src="${caminhoPasta}${listaAnimais[indiceCabeca].arquivo}" class="fatia-cabeca">
                    </div>
                    <div class="puzzle-seccao">
                        <img id="imgMeio" src="${caminhoPasta}${listaAnimais[indiceMeio].arquivo}" class="fatia-meio">
                    </div>
                    <div class="puzzle-seccao">
                        <img id="imgCorpo" src="${caminhoPasta}${listaAnimais[indiceCorpo].arquivo}" class="fatia-corpo">
                    </div>
                </div>

                <div style="display: flex; width: 100%; max-width: 300px; justify-content: space-between; align-items: center;">
                    <button class="btn-seta-puzzle" onclick="mudarPeca('cabeca', -1)">◀</button>
                    <span style="font-size: 0.75rem; font-weight: 800; color: #C2890B;">Cabeça</span>
                    <button class="btn-seta-puzzle" onclick="mudarPeca('cabeca', 1)">▶</button>
                </div>

                <div style="display: flex; width: 100%; max-width: 300px; justify-content: space-between; align-items: center;">
                    <button class="btn-seta-puzzle" onclick="mudarPeca('meio', -1)">◀</button>
                    <span style="font-size: 0.75rem; font-weight: 800; color: #C2890B;">Meio</span>
                    <button class="btn-seta-puzzle" onclick="mudarPeca('meio', 1)">▶</button>
                </div>

                <div style="display: flex; width: 100%; max-width: 300px; justify-content: space-between; align-items: center;">
                    <button class="btn-seta-puzzle" onclick="mudarPeca('corpo', -1)">◀</button>
                    <span style="font-size: 0.75rem; font-weight: 800; color: #C2890B;">Corpo</span>
                    <button class="btn-seta-puzzle" onclick="mudarPeca('corpo', 1)">▶</button>
                </div>

                <button class="btn-verificar-puzzle" onclick="verificarMontagem()">Verificar</button>
                <div id="round-feedback" style="display: none;"></div>
            </div>
        `;
    }

    if (slotFundo) {
        slotFundo.className = "barrita-fundo-cartao";
        slotFundo.innerHTML = "";
    }
}

function mudarPeca(parte, direcao) {
    if (somClique.src) somClique.play().catch(()=>{});

    if (parte === 'cabeca') {
        indiceCabeca = (indiceCabeca + direcao + listaAnimais.length) % listaAnimais.length;
        document.getElementById('imgCabeca').src = caminhoPasta + listaAnimais[indiceCabeca].arquivo;
    } else if (parte === 'meio') {
        indiceMeio = (indiceMeio + direcao + listaAnimais.length) % listaAnimais.length;
        document.getElementById('imgMeio').src = caminhoPasta + listaAnimais[indiceMeio].arquivo;
    } else if (parte === 'corpo') {
        indiceCorpo = (indiceCorpo + direcao + listaAnimais.length) % listaAnimais.length;
        document.getElementById('imgCorpo').src = caminhoPasta + listaAnimais[indiceCorpo].arquivo;
    }
}

function verificarMontagem() {
    if (somAcerto.src) somAcerto.play().catch(()=>{});

    const acertou = (indiceCabeca === indiceAnimalAtual && indiceMeio === indiceAnimalAtual && indiceCorpo === indiceAnimalAtual);
    const overlay = document.getElementById('round-feedback');
    const iconeFeedback = DADOS.icons.feedbacks.feedback1;

    if (overlay) {
        overlay.style.display = 'flex';
        overlay.innerHTML = `
            <div style="width: 100%; display: flex; justify-content: center; align-items: center; flex: 1;">
                <div class="vitoria-card">
                    <img src="${iconeFeedback}" style="width:140px; height:140px; object-fit:contain;">
                    <h1 style="color:#C2890B; font-size:1.3rem; font-weight:900; margin:0;">${acertou ? 'EXCELENTE! MONTÁSTE O ANIMAL!' : 'QUASE! TENTA OUTRA VEZ!'}</h1>
                    <p style="color:#555; font-weight:800; margin:0; font-size:0.8rem;">${acertou ? 'Fizeste um trabalho espetacular!' : 'Experimenta ajustar as peças para completar o desafio.'}</p>
                    <div style="display:flex; justify-content:center; gap:10px; margin-top:6px; width:100%; max-width:400px;">
                        <button class="btn-final-roxo" onclick="iniciarJogoMontagem()">Jogar Outro</button>
                        <button class="btn-final-branco" onclick="window.history.back()">Menu Principal</button>
                    </div>
                </div>
            </div>
            <div class="feedback-bottom-bar"></div>
        `;
    }

    const slotTopo = document.getElementById('slot-topo');
    const slotFundo = document.getElementById('slot-fundo');
    if (slotTopo) slotTopo.innerHTML = "";
    if (slotFundo) slotFundo.innerHTML = "";
}

mostrarCapa();
