// ============================================================
// 1. ESTADO GLOBAL E CONFIGURAÇÃO DO JOGO
// ============================================================
const listaCompletaAnimais = DADOS.animaisSelvagens;
const caminhoPasta = DADOS.caminhoAnimais;

let animaisAtuais = [];
let indiceCabeca = 0;
let indiceMeio = 0;
let indiceCorpo = 0;
let animacaoCapaInterval = null;

const somAcerto = new Audio(DADOS.sons && DADOS.sons.certo ? DADOS.sons.certo : "");
const somErrado = new Audio(DADOS.sons && DADOS.sons.errado ? DADOS.sons.errado : "");
const somClique = new Audio(DADOS.sons && DADOS.sons.clique ? DADOS.sons.clique : "");
const somInstrucao = new Audio(DADOS.sons && DADOS.sons.instrucao ? DADOS.sons.instrucao : "");


// ============================================================
// 2. CONFIGURAÇÃO VISUAL (ESTILOS CSS)
// ============================================================
const style = document.createElement('style');
style.innerHTML = `
    .montagem-container {
        display: flex; flex-direction: column; align-items: center; justify-content: center;
        width: 100%; height: 100%; flex: 1; gap: 10px; animation: cardPop 0.35s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards; padding: 4px 0;
        position: relative; box-sizing: border-box;
    }
    @keyframes cardPop { 0% { transform: scale(0.85); opacity: 0; } 100% { transform: scale(1); opacity: 1; } }

    .puzzle-layout-externo {
        display: flex; align-items: center; justify-content: center; gap: 12px; width: 100%;
    }

    .coluna-setas-externas {
        display: flex; flex-direction: column; justify-content: space-between; height: 260px;
    }

    .btn-seta-externa {
        background: #ECA607; color: white; border: 2px solid #F4D06F; width: 40px; height: 75px;
        border-radius: 12px; cursor: pointer; display: flex; align-items: center; justify-content: center;
        box-shadow: 0 4px 10px rgba(236,166,7,0.3); transition: transform 0.15s ease, background 0.15s ease;
        font-weight: 900; font-size: 1.1rem; flex-shrink: 0;
    }
    .btn-seta-externa:hover { transform: scale(1.08); background: #d99605; }
    .btn-seta-externa:active { transform: scale(0.92); }

    .puzzle-wrapper {
        position: relative; width: 260px; height: 260px; background: white; border: 4px solid #E2D3AB; border-radius: 18px;
        box-shadow: 0 6px 20px rgba(0,0,0,0.08); overflow: hidden; display: flex; flex-direction: column;
        transition: border-color 0.2s ease;
    }

    .puzzle-seccao {
        width: 100%; flex: 1; position: relative; overflow: hidden; border-bottom: 2px dashed #E2D3AB;
    }
    .puzzle-seccao:last-child { border-bottom: none; }

    /* Imagem dimensionada exatamente para preencher a caixa inteira de 260x260 e deslocada por secção */
    .puzzle-seccao img {
        position: absolute; width: 260px; height: 260px; left: 0; object-fit: fill; pointer-events: none;
    }
    .fatia-cabeca { top: 0; }
    .fatia-meio { top: -86.6px; }
    .fatia-corpo { top: -173.3px; }

    .btn-verificar-puzzle {
        background: #23AA45; color: white; border: 2.5px solid #A3E4B5; padding: 10px 28px;
        border-radius: 18px; font-weight: 900; font-size: 0.95rem; cursor: pointer;
        box-shadow: 0 4px 12px rgba(35,170,69,0.35); text-transform: uppercase;
        transition: transform 0.2s ease, background 0.2s ease; margin-top: 4px;
    }
    .btn-verificar-puzzle:hover { transform: translateY(-2px); background: #1e913a; }
    .btn-verificar-puzzle:active { transform: scale(0.95); }

    .aviso-tentar-novamente {
        font-size: 0.85rem; font-weight: 900; color: #E74C3C; height: 20px;
        transition: opacity 0.3s ease; opacity: 0; text-transform: uppercase;
    }

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

    .animacao-capa-layout {
        display: flex; align-items: center; justify-content: center; gap: 10px; margin-bottom: 10px;
    }
    .animacao-capa-coluna {
        display: flex; flex-direction: column; justify-content: space-between; height: 190px;
    }
    .animacao-seta-falsa {
        background: #ECA607; color: white; width: 30px; height: 55px; border-radius: 8px;
        display: flex; align-items: center; justify-content: center; font-weight: 900; font-size: 0.9rem;
        box-shadow: 0 2px 6px rgba(0,0,0,0.15);
    }
    .animacao-capa-container {
        width: 190px; height: 190px; background: white; border: 3px solid #E2D3AB; border-radius: 20px;
        display: flex; flex-direction: column; position: relative; box-shadow: 0 10px 25px rgba(236,166,7,0.25); overflow: hidden;
    }
    .animacao-capa-fatia {
        width: 190px; height: 190px; position: absolute; left: 0; object-fit: fill;
    }

    #round-feedback { 
        position: absolute; top: 0; left: 0; width: 100%; height: 100%; background: #ffffff; 
        z-index: 9999; display: none; flex-direction: column; align-items: center; justify-content: space-between; 
        border-radius: 16px; overflow: hidden; padding: 20px; box-sizing: border-box;
    }
    .feedback-bottom-bar { width: 100%; height: 14px; background: #ECA607; border-radius: 7px; flex-shrink: 0; }
    .vitoria-card { background: transparent; padding: 10px 20px; text-align: center; display: flex; flex-direction: column; align-items: center; gap: 12px; width: 100%; max-width: 480px; margin: auto 0; }
    
    .btn-final-roxo { background: #ECA607; color: white; border: none; padding: 14px 22px; border-radius: 25px; font-weight: 900; font-size: 1rem; cursor: pointer; box-shadow: 0 6px 18px rgba(236,166,7,0.35); }
    .btn-final-branco { background: white; color: #C2890B; border: 2px solid #ECA607; padding: 14px 22px; border-radius: 25px; font-weight: 900; font-size: 1rem; cursor: pointer; }
`;
document.head.appendChild(style);


// ============================================================
// 3. CAPA DO JOGO
// ============================================================
function mostrarCapa() {
    if (animacaoCapaInterval) clearInterval(animacaoCapaInterval);

    const slotTopo = document.getElementById('slot-topo');
    const slotFundo = document.getElementById('slot-fundo');

    if (slotTopo) {
        slotTopo.className = "barrita-fundo-cartao";
        slotTopo.innerHTML = "";
    }

    const area = document.getElementById('contentor-jogo');
    if (area) {
        const tituloAnimacao = DADOS.animacaoCapa ? DADOS.animacaoCapa.titulo : "Monta o Animal";
        
        let r1 = Math.floor(Math.random() * listaCompletaAnimais.length);
        let r2 = Math.floor(Math.random() * listaCompletaAnimais.length);
        let r3 = Math.floor(Math.random() * listaCompletaAnimais.length);

        area.innerHTML = `
            <div style="font-size: 1.3rem; font-weight: 900; color: #C2890B; margin-bottom: 6px; text-transform: uppercase;">${tituloAnimacao}</div>
            
            <div class="animacao-capa-layout">
                <div class="animacao-capa-coluna">
                    <div class="animacao-seta-falsa">◀</div>
                    <div class="animacao-seta-falsa">◀</div>
                    <div class="animacao-seta-falsa">◀</div>
                </div>

                <div class="animacao-capa-container">
                    <img id="capaCabeca" src="${caminhoPasta}${listaCompletaAnimais[r1].arquivo}" class="animacao-capa-fatia" style="top: 0;">
                    <img id="capaMeio" src="${caminhoPasta}${listaCompletaAnimais[r2].arquivo}" class="animacao-capa-fatia" style="top: -63.3px;">
                    <img id="capaCorpo" src="${caminhoPasta}${listaCompletaAnimais[r3].arquivo}" class="animacao-capa-fatia" style="top: -126.6px;">
                </div>

                <div class="animacao-capa-coluna">
                    <div class="animacao-seta-falsa">▶</div>
                    <div class="animacao-seta-falsa">▶</div>
                    <div class="animacao-seta-falsa">▶</div>
                </div>
            </div>

            <div id="round-feedback" style="display: none;"></div>
        `;

        animacaoCapaInterval = setInterval(() => {
            let idxH = Math.floor(Math.random() * listaCompletaAnimais.length);
            let idxB = Math.floor(Math.random() * listaCompletaAnimais.length);
            let hImg = document.getElementById('capaMeio');
            let cImg = document.getElementById('capaCorpo');
            if (hImg) hImg.src = caminhoPasta + listaCompletaAnimais[idxH].arquivo;
            if (cImg) cImg.src = caminhoPasta + listaCompletaAnimais[idxB].arquivo;
        }, 1600);
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
// 4. LÓGICA DO JOGO DE MONTAGEM DE ANIMAIS
// ============================================================
function selecionar7AnimaisAleatorios() {
    const baralhados = [...listaCompletaAnimais].sort(() => 0.5 - Math.random());
    animaisAtuais = baralhados.slice(0, 7);
}

function iniciarJogoMontagem() {
    if (animacaoCapaInterval) clearInterval(animacaoCapaInterval);
    if (somClique.src) somClique.play().catch(()=>{});

    selecionar7AnimaisAleatorios();

    indiceCabeca = Math.floor(Math.random() * animaisAtuais.length);
    indiceMeio = Math.floor(Math.random() * animaisAtuais.length);
    indiceCorpo = Math.floor(Math.random() * animaisAtuais.length);

    atualizarInterfaceJogo();
}

function atualizarInterfaceJogo() {
    const slotTopo = document.getElementById('slot-topo');
    const slotFundo = document.getElementById('slot-fundo');
    const area = document.getElementById('contentor-jogo');

    if (slotTopo) {
        slotTopo.className = "barra-jogo-topo";
        slotTopo.innerHTML = `
            <div class="btn-capa-som" onclick="tocarSomInstrucao()"><img src="${DADOS.icons.som}" alt="Som"></div>
            <div></div>
            <button class="btn-menu-topo" onclick="mostrarCapa()"><i class="fas fa-bars"></i> Menu</button>
        `;
    }

    if (area) {
        area.innerHTML = `
            <div class="montagem-container">
                <div class="puzzle-layout-externo">
                    <!-- Coluna Esquerda de Setas Externa -->
                    <div class="coluna-setas-externas">
                        <button class="btn-seta-externa" onclick="mudarPeca('cabeca', -1)">◀</button>
                        <button class="btn-seta-externa" onclick="mudarPeca('meio', -1)">◀</button>
                        <button class="btn-seta-externa" onclick="mudarPeca('corpo', -1)">◀</button>
                    </div>

                    <!-- Caixa Central do Puzzle -->
                    <div class="puzzle-wrapper" id="puzzleBox">
                        <div class="puzzle-seccao">
                            <img id="imgCabeca" src="${caminhoPasta}${animaisAtuais[indiceCabeca].arquivo}" class="fatia-cabeca">
                        </div>
                        <div class="puzzle-seccao">
                            <img id="imgMeio" src="${caminhoPasta}${animaisAtuais[indiceMeio].arquivo}" class="fatia-meio">
                        </div>
                        <div class="puzzle-seccao">
                            <img id="imgCorpo" src="${caminhoPasta}${animaisAtuais[indiceCorpo].arquivo}" class="fatia-corpo">
                        </div>
                    </div>

                    <!-- Coluna Direita de Setas Externa -->
                    <div class="coluna-setas-externas">
                        <button class="btn-seta-externa" onclick="mudarPeca('cabeca', 1)">▶</button>
                        <button class="btn-seta-externa" onclick="mudarPeca('meio', 1)">▶</button>
                        <button class="btn-seta-externa" onclick="mudarPeca('corpo', 1)">▶</button>
                    </div>
                </div>

                <div id="avisoErro" class="aviso-tentar-novamente">Tenta outra vez!</div>
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
        indiceCabeca = (indiceCabeca + direcao + animaisAtuais.length) % animaisAtuais.length;
        document.getElementById('imgCabeca').src = caminhoPasta + animaisAtuais[indiceCabeca].arquivo;
    } else if (parte === 'meio') {
        indiceMeio = (indiceMeio + direcao + animaisAtuais.length) % animaisAtuais.length;
        document.getElementById('imgMeio').src = caminhoPasta + animaisAtuais[indiceMeio].arquivo;
    } else if (parte === 'corpo') {
        indiceCorpo = (indiceCorpo + direcao + animaisAtuais.length) % animaisAtuais.length;
        document.getElementById('imgCorpo').src = caminhoPasta + animaisAtuais[indiceCorpo].arquivo;
    }
}

function verificarMontagem() {
    const acertou = (indiceCabeca === indiceMeio && indiceMeio === indiceCorpo);

    if (!acertou) {
        if (somErrado.src) {
            somErrado.currentTime = 0;
            somErrado.play().catch(()=>{});
        }

        const aviso = document.getElementById('avisoErro');
        if (aviso) {
            aviso.style.opacity = '1';
            setTimeout(() => {
                aviso.style.opacity = '0';
            }, 1500);
        }
        return;
    }

    if (somAcerto.src) {
        somAcerto.currentTime = 0;
        somAcerto.play().catch(()=>{});
    }

    const overlay = document.getElementById('round-feedback');
    const iconeFeedback = DADOS.icons.feedbacks.feedback1;

    if (overlay) {
        overlay.style.display = 'flex';
        overlay.innerHTML = `
            <div style="width: 100%; display: flex; justify-content: center; align-items: center; flex: 1;">
                <div class="vitoria-card">
                    <img src="${iconeFeedback}" style="width:140px; height:140px; object-fit:contain;">
                    <h1 style="color:#C2890B; font-size:1.3rem; font-weight:900; margin:0;">EXCELENTE! ANIMAL MONTADO!</h1>
                    <p style="color:#555; font-weight:800; margin:0; font-size:0.8rem;">Conseguiste montar um animal completo!</p>
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
