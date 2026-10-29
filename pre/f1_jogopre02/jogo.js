// ============================================================
// 1. ESTADO GLOBAL E SONS (Lidos de DADOS)
// ============================================================
const JOGO_CONFIG = {
    nomeDoJogo: DADOS.animacaoCapa ? DADOS.animacaoCapa.titulo : "Desenho Criativo",
    caminhoSons: DADOS.sons ? DADOS.sons.caminho : "",
    caminhoIconsMenu: "../../icons/"
};

let corAtual = "#000000";
let ferramentaAtual = "lapis"; 
let tamanhoPincel = 10;
let isDrawing = false;
let ctx = null;
let canvas = null;
let historicoCanvas = []; 
let indiceDesenhoAtual = 0; // Índice para o carrossel de desenhos

const somAcerto = new Audio(DADOS.sons && DADOS.sons.certo ? DADOS.sons.certo : "");
const somClique = new Audio(DADOS.sons && DADOS.sons.clique ? DADOS.sons.clique : "");
const somInstrucao = new Audio(DADOS.sons && DADOS.sons.instrucao ? DADOS.sons.instrucao : "f1_jogo01pre.mp3");


// ============================================================
// 2. CONFIGURAÇÃO VISUAL
// ============================================================
const style = document.createElement('style');
style.innerHTML = `
    .desenho-container {
        display: flex; flex-direction: row; align-items: stretch; justify-content: space-between;
        width: 100%; height: 100%; flex: 1; gap: 16px; animation: cardPop 0.35s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards; padding: 4px 0;
    }
    @keyframes cardPop { 0% { transform: scale(0.85); opacity: 0; } 100% { transform: scale(1); opacity: 1; } }

    .canvas-wrapper {
        background: white; border: 3px solid #E2D3AB; border-radius: 16px;
        box-shadow: 0 4px 15px rgba(0,0,0,0.06); overflow: hidden; touch-action: none;
        flex: 3.5; width: 100%; display: flex; align-items: center; justify-content: center; min-height: 0;
    }
    canvas { display: block; width: 100%; height: 100%; }

    .painel-estojo {
        display: flex; flex-direction: column; align-items: center; justify-content: space-between; gap: 8px; flex: 0.9; max-width: 220px; background: rgba(255,255,255,0.95); padding: 10px; border-radius: 16px; border: 2px solid #E2D3AB; flex-shrink: 0;
        box-shadow: 0 4px 15px rgba(0,0,0,0.04);
    }

    .painel-cores-box {
        width: 100%; background: #FFFDF7; border: 2px solid #E2D3AB; border-radius: 12px; padding: 8px; display: flex; flex-direction: column; align-items: center; gap: 6px;
    }
    .titulo-cores {
        font-size: 0.7rem; font-weight: 900; color: #C2890B; letter-spacing: 1px; text-transform: uppercase; margin: 0;
    }

    .grid-cores {
        display: grid; grid-template-columns: repeat(4, 1fr); gap: 5px; width: 100%; justify-items: center;
    }
    
    .lapis-btn {
        width: 28px; height: 28px; border-radius: 50%; border: 2.5px solid white; cursor: pointer;
        box-shadow: 0 2px 5px rgba(0,0,0,0.12); transition: transform 0.2s cubic-bezier(0.34, 1.56, 0.64, 1), box-shadow 0.2s ease;
    }
    .lapis-btn:hover { transform: translateY(-2px) scale(1.1); }
    .lapis-btn:active, .lapis-btn.ativo { transform: scale(1.18); border-color: #262638; box-shadow: 0 4px 10px rgba(0,0,0,0.25); }

    .linha-ferramentas {
        display: flex; align-items: center; justify-content: center; gap: 6px; width: 100%;
    }

    .dropdown-container {
        position: relative; display: inline-block;
    }
    .lapis-dropdown-btn {
        background: white; border: 2px solid #ECA607; width: 38px; height: 38px;
        border-radius: 12px; cursor: pointer; display: flex; align-items: center; justify-content: center;
        box-shadow: 0 3px 8px rgba(0,0,0,0.08); transition: transform 0.2s ease, background 0.2s ease;
        padding: 4px;
    }
    .lapis-dropdown-btn:hover { transform: scale(1.08); }
    .lapis-dropdown-btn.ativo { background: #FFF9E6; border-color: #262638; box-shadow: 0 4px 12px rgba(236,166,7,0.4); }
    .lapis-dropdown-btn img { width: 18px; height: 24px; object-fit: contain; pointer-events: none; }

    .dropdown-content {
        display: none; position: absolute; bottom: 125%; left: 50%; transform: translateX(-50%);
        background: white; min-width: 120px; box-shadow: 0 8px 20px rgba(0,0,0,0.15); border-radius: 14px;
        border: 2px solid #E2D3AB; z-index: 100; padding: 8px; flex-direction: column; gap: 6px;
        animation: popUpDropdown 0.2s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards;
    }
    .dropdown-content.mostrar { display: flex; }
    @keyframes popUpDropdown { from { opacity: 0; transform: translateX(-50%) translateY(10px) scale(0.9); } to { opacity: 1; transform: translateX(-50%) translateY(0) scale(1); } }

    .opcao-traco {
        background: #FFFDF0; border: 1.5px solid #ECA607; border-radius: 10px; padding: 5px 8px;
        display: flex; align-items: center; justify-content: space-between; cursor: pointer;
        transition: background 0.15s ease, transform 0.15s ease; font-weight: 800; font-size: 0.75rem; color: #C2890B;
    }
    .opcao-traco:hover { background: #FFF3CC; transform: scale(1.03); }
    .linha-amostra { display: block; background: #C2890B; border-radius: 4px; width: 45px; }

    .btn-ferramenta-img {
        background: white; border: 2px solid #ECA607; width: 38px; height: 38px;
        border-radius: 12px; cursor: pointer; display: flex; align-items: center; justify-content: center;
        box-shadow: 0 3px 8px rgba(0,0,0,0.08); transition: transform 0.2s cubic-bezier(0.34, 1.56, 0.64, 1), background 0.2s ease; padding: 4px;
    }
    .btn-ferramenta-img:hover { transform: translateY(-2px) scale(1.05); }
    .btn-ferramenta-img:active { transform: scale(0.92); }
    .btn-ferramenta-img.ativo { background: #ECA607; border-color: #262638; transform: scale(1.08); }
    .btn-ferramenta-img img { width: 100%; height: 100%; object-fit: contain; pointer-events: none; }

    /* Moldura quadrada, maior e sem legenda na barra lateral */
    .moldura-barra-container {
        display: flex; align-items: center; justify-content: space-between; background: #FFFDF0; border: 2px solid #E2D3AB; padding: 6px; border-radius: 14px; width: 100%; box-shadow: 0 2px 6px rgba(0,0,0,0.05); gap: 6px;
    }
    .btn-seta-barra {
        background: #ECA607; color: white; border: none; width: 28px; height: 28px; border-radius: 50%; display: flex; align-items: center; justify-content: center; cursor: pointer; font-weight: 900; font-size: 0.85rem; transition: transform 0.2s ease; box-shadow: 0 2px 4px rgba(0,0,0,0.15); flex-shrink: 0;
    }
    .btn-seta-barra:hover { transform: scale(1.1); }
    .btn-seta-barra:active { transform: scale(0.92); }
    
    .moldura-barra-quadrada {
        width: 75px; height: 75px; background: white; border: 2px solid #E2D3AB; border-radius: 10px; display: flex; align-items: center; justify-content: center; padding: 6px; flex-shrink: 0; box-shadow: inset 0 2px 4px rgba(0,0,0,0.03);
    }
    .moldura-barra-miniatura {
        width: 100%; height: 100%; object-fit: contain; pointer-events: none;
    }

    .btn-ferramenta-texto {
        background: #ECA607; color: white; border: 2.5px solid #F4D06F; padding: 10px 14px;
        border-radius: 16px; font-weight: 900; font-size: 0.9rem; cursor: pointer;
        box-shadow: 0 4px 12px rgba(236,166,7,0.35); transition: transform 0.2s ease, background 0.2s ease;
        display: flex; align-items: center; justify-content: center; gap: 6px; width: 100%; text-transform: uppercase;
    }
    .btn-ferramenta-texto:hover { transform: translateY(-2px); background: #d99605; }
    .btn-ferramenta-texto:active { transform: scale(0.95); }

    .btn-capa-som {
        width: 44px; height: 44px; background: rgba(255,255,255,0.8); border: 2px solid rgba(255,255,255,0.95);
        border-radius: 50%; display: flex; align-items: center; justify-content: center; cursor: pointer;
        transition: transform 0.2s cubic-bezier(0.34, 1.56, 0.64, 1); box-shadow: 0 3px 10px rgba(0,0,0,0.1);
    }
    .btn-capa-som:hover { transform: scale(1.1); }
    .btn-capa-som:active { transform: scale(0.92); }
    .btn-capa-som img { width: 22px; height: 22px; object-fit: contain; }

    .btn-capa-jogar {
        background: white; color: #C2890B; border: none;
        padding: 8px 26px; border-radius: 18px; font-weight: 900; font-size: 1rem;
        cursor: pointer; box-shadow: 0 4px 15px rgba(0,0,0,0.15); transition: transform 0.2s cubic-bezier(0.34, 1.56, 0.64, 1), background 0.2s ease;
        text-transform: uppercase;
    }
    .btn-capa-jogar:hover { transform: scale(1.05); background: #FFFDF0; }
    .btn-capa-jogar:active { transform: scale(0.95); }

    /* Animação da Capa */
    .animacao-casa-container {
        width: 190px; height: 190px; background: white; border: 3px solid #E2D3AB; border-radius: 24px;
        display: flex; align-items: center; justify-content: center; position: relative;
        box-shadow: 0 10px 25px rgba(236,166,7,0.25); animation: cardPop 0.5s cubic-bezier(0.34, 1.56, 0.64, 1);
        overflow: hidden; margin-bottom: 12px;
    }
    .casa-svg { width: 145px; height: 145px; position: relative; z-index: 2; }

    .linha-desenho {
        stroke: #262638; stroke-width: 3; fill: none; stroke-linecap: round; stroke-linejoin: round;
        stroke-dasharray: 450; stroke-dashoffset: 450;
        animation: desenharTracoLento 6s infinite ease-in-out;
    }

    .preenchimento-cor {
        opacity: 0;
        animation: colorirCasaLento 6s infinite ease-in-out;
    }

    .pincel-animado {
        position: absolute; width: 40px; height: 40px; object-fit: contain;
        z-index: 10; pointer-events: none;
        animation: moverPincelLento 6s infinite ease-in-out;
        filter: drop-shadow(2px 4px 6px rgba(0,0,0,0.3));
    }

    @keyframes desenharTracoLento {
        0% { stroke-dashoffset: 450; }
        60% { stroke-dashoffset: 0; }
        100% { stroke-dashoffset: 0; }
    }

    @keyframes colorirCasaLento {
        0% { opacity: 0; }
        60% { opacity: 0; }
        80% { opacity: 1; }
        100% { opacity: 1; }
    }

    @keyframes moverPincelLento {
        0%   { top: 105px; left: 25px; transform: rotate(-20deg); }
        15%  { top: 30px; left: 90px; transform: rotate(10deg); }
        30%  { top: 105px; left: 145px; transform: rotate(30deg); }
        45%  { top: 135px; left: 85px; transform: rotate(-5deg); }
        60%  { top: 80px; left: 85px; transform: rotate(0deg); }
        80%  { top: 65px; left: 65px; transform: scale(1.1); }
        100% { top: 105px; left: 25px; transform: rotate(-20deg); }
    }

    #round-feedback { 
        position: absolute; top: 0; left: 0; width: 100%; height: 100%; 
        background: rgba(255, 255, 255, 0.96); backdrop-filter: blur(8px); 
        z-index: 1000; display: none; flex-direction: column; align-items: center; justify-content: space-between; 
        border-radius: 35px; overflow: hidden; padding: 20px;
        animation: fadeInFeedback 0.3s ease forwards;
    }
    @keyframes fadeInFeedback { from { opacity: 0; transform: scale(0.97); } to { opacity: 1; transform: scale(1); } }
    
    .feedback-bottom-bar {
        width: 100%; height: 14px;
        background: #ECA607; border-radius: 7px; flex-shrink: 0;
        box-shadow: inset 0 2px 4px rgba(0,0,0,0.1);
    }

    .vitoria-card { 
        background: transparent; padding: 10px 20px; text-align: center; 
        display: flex; flex-direction: column; align-items: center; gap: 12px; 
        animation: cardPop 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards; 
        width: 100%; max-width: 480px; margin: auto 0;
    }
    
    .btn-final-roxo {
        background: #ECA607; color: white; border: none; padding: 14px 22px;
        border-radius: 25px; font-weight: 900; font-size: 1rem; cursor: pointer;
        box-shadow: 0 6px 18px rgba(236,166,7,0.35); text-transform: capitalize; transition: transform 0.2s cubic-bezier(0.34, 1.56, 0.64, 1);
        white-space: nowrap; flex: 1; text-align: center;
    }
    .btn-final-roxo:hover { transform: translateY(-3px) scale(1.03); }
    .btn-final-roxo:active { transform: scale(0.95); }

    .btn-final-branco {
        background: white; color: #C2890B; border: 2px solid #ECA607; padding: 14px 22px;
        border-radius: 25px; font-weight: 900; font-size: 1rem; cursor: pointer;
        box-shadow: 0 6px 15px rgba(0,0,0,0.08); text-transform: capitalize; transition: transform 0.2s cubic-bezier(0.34, 1.56, 0.64, 1);
        white-space: nowrap; flex: 1; text-align: center;
    }
    .btn-final-branco:hover { transform: translateY(-3px) scale(1.03); background: #FFF9E6; }
    .btn-final-branco:active { transform: scale(0.95); }

    @media (max-width: 768px) {
        .desenho-container { flex-direction: column; }
        .painel-estojo { max-width: 100%; width: 100%; flex-direction: row; flex-wrap: wrap; justify-content: center; }
        .grid-cores { display: flex; flex-wrap: wrap; justify-content: center; }
    }
`;
document.head.appendChild(style);


// ============================================================
// 3. CAPA COM ANIMAÇÃO
// ============================================================
function mostrarCapa() {
    const feedbackEl = document.getElementById('round-feedback');
    if (feedbackEl) feedbackEl.style.display = 'none';

    if(!document.getElementById('round-feedback')) {
        const feedback = document.createElement('div');
        feedback.id = 'round-feedback';
        document.querySelector('.botao-ano').appendChild(feedback);
    }

    const slotTopo = document.getElementById('slot-topo');
    const slotFundo = document.getElementById('slot-fundo');

    if (slotTopo) {
        slotTopo.className = "barrita-fundo-cartao";
        slotTopo.innerHTML = "";
    }

    const area = document.getElementById('contentor-jogo');
    if (area) {
        const tituloAnimacao = DADOS.animacaoCapa ? DADOS.animacaoCapa.titulo : "Desenho Criativo";
        
        area.innerHTML = `
            <div style="font-size: 1.4rem; font-weight: 900; color: #C2890B; margin-bottom: 6px; text-transform: uppercase; animation: cardPop 0.4s ease;">${tituloAnimacao}</div>
            
            <div class="animacao-casa-container">
                <img src="${DADOS.icons.pincel}" alt="Pincel" class="pincel-animado">

                <svg class="casa-svg" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
                    <g class="preenchimento-cor">
                        <rect x="26" y="46" width="48" height="43" fill="#ffeb00" />
                        <polygon points="17,45 50,17 83,45" fill="#d91424" />
                        <rect x="42" y="65" width="16" height="24" fill="#9c4820" />
                        <rect x="33" y="52" width="12" height="12" fill="#009fe3" />
                        <rect x="55" y="52" width="12" height="12" fill="#009fe3" />
                    </g>

                    <rect class="linha-desenho" x="25" y="45" width="50" height="45" rx="2" />
                    <polygon class="linha-desenho" points="15,45 50,15 85,45" />
                    <rect class="linha-desenho" x="42" y="65" width="16" height="25" rx="1" />
                    <rect class="linha-desenho" x="33" y="52" width="12" height="12" rx="1" />
                    <rect class="linha-desenho" x="55" y="52" width="12" height="12" rx="1" />
                </svg>
            </div>
        `;
    }

    if (slotFundo) {
        slotFundo.className = "barra-jogo-topo";
        slotFundo.innerHTML = `
            <div class="btn-capa-som" onclick="tocarSomInstrucao()"><img src="${DADOS.icons.som}" alt="Som"></div>
            <button class="btn-capa-jogar" onclick="iniciarJogoDesenho()">COMEÇAR</button>
        `;
    }
}

function mudarDesenho(direcao) {
    if (somClique.src) somClique.play().catch(()=>{});
    const lista = DADOS.desenhosParaColorir || [];
    if (lista.length === 0) return;

    indiceDesenhoAtual += direcao;
    if (indiceDesenhoAtual < 0) indiceDesenhoAtual = lista.length - 1;
    if (indiceDesenhoAtual >= lista.length) indiceDesenhoAtual = 0;

    configurarCanvas();
}

function tocarSomInstrucao() {
    if (somClique.src) somClique.play().catch(()=>{});
    somInstrucao.currentTime = 0;
    somInstrucao.play().catch(()=>{});
}


// ============================================================
// 4. LÓGICA DO ESTOJO MÁGICO E CANVAS
// ============================================================
function atualizarCursorPincel() {
    const canvasEl = document.getElementById('paintCanvas');
    if (!canvasEl) return;

    const imgPincel = new Image();
    imgPincel.src = DADOS.icons.pincel;
    
    imgPincel.onload = function() {
        const cTemp = document.createElement('canvas');
        cTemp.width = 32;
        cTemp.height = 32;
        const ctxTemp = cTemp.getContext('2d');

        ctxTemp.drawImage(imgPincel, 0, 0, 32, 32);

        if (ferramentaAtual === 'lapis' || ferramentaAtual === 'balde') {
            ctxTemp.globalCompositeOperation = 'source-in';
            ctxTemp.fillStyle = corAtual;
            ctxTemp.fillRect(0, 0, 32, 32);
        } else if (ferramentaAtual === 'borracha') {
            ctxTemp.globalCompositeOperation = 'source-in';
            ctxTemp.fillStyle = '#FFFFFF';
            ctxTemp.fillRect(0, 0, 32, 32);
        }

        const urlCursor = cTemp.toDataURL();
        canvasEl.style.cursor = `url(${urlCursor}) 2 29, crosshair`;
    };

    imgPincel.onerror = function() {
        canvasEl.style.cursor = 'crosshair';
    };
}

function iniciarJogoDesenho() {
    if (somClique.src) somClique.play().catch(()=>{});
    
    const slotTopo = document.getElementById('slot-topo');
    const slotFundo = document.getElementById('slot-fundo');
    const area = document.getElementById('contentor-jogo');
    const feedbackEl = document.getElementById('round-feedback');
    if (feedbackEl) feedbackEl.style.display = 'none';

    if (slotTopo) {
        slotTopo.className = "barra-jogo-topo";
        slotTopo.innerHTML = `
            <div class="btn-capa-som" style="width:44px; height:44px;" onclick="tocarSomInstrucao()"><img src="${DADOS.icons.som}" alt="Som" style="width:22px; height:22px;"></div>
            <button class="btn-menu-topo" onclick="mostrarCapa()"><i class="fas fa-bars"></i> Menu</button>
        `;
    }

    const lista = DADOS.desenhosParaColorir || [];
    const desenhoAtualObj = lista[indiceDesenhoAtual] || { arquivo: "" };

    if (area) {
        area.innerHTML = `
            <div class="desenho-container">
                <div class="canvas-wrapper" id="canvasWrapper">
                    <canvas id="paintCanvas"></canvas>
                </div>

                <div class="painel-estojo">
                    <div class="painel-cores-box">
                        <span class="titulo-cores">Cores</span>
                        <div class="grid-cores">
                            <div class="lapis-btn ativo" style="background:#000000;" onclick="mudarCor('#000000', this)" title="Preto"></div>
                            <div class="lapis-btn" style="background:#fbb1bd;" onclick="mudarCor('#fbb1bd', this)" title="Rosa Claro"></div>
                            <div class="lapis-btn" style="background:#f272a1;" onclick="mudarCor('#f272a1', this)" title="Rosa Chiclete"></div>
                            <div class="lapis-btn" style="background:#d91424;" onclick="mudarCor('#d91424', this)" title="Vermelho"></div>
                            <div class="lapis-btn" style="background:#f37022;" onclick="mudarCor('#f37022', this)" title="Laranja"></div>
                            <div class="lapis-btn" style="background:#ffeb00;" onclick="mudarCor('#ffeb00', this)" title="Amarelo Canário"></div>
                            <div class="lapis-btn" style="background:#23aa45;" onclick="mudarCor('#23aa45', this)" title="Verde"></div>
                            <div class="lapis-btn" style="background:#0a683e;" onclick="mudarCor('#0a683e', this)" title="Verde Escuro"></div>
                            <div class="lapis-btn" style="background:#009fe3;" onclick="mudarCor('#009fe3', this)" title="Azul Claro"></div>
                            <div class="lapis-btn" style="background:#1d3d88;" onclick="mudarCor('#1d3d88', this)" title="Azul Escuro"></div>
                            <div class="lapis-btn" style="background:#752358;" onclick="mudarCor('#752358', this)" title="Roxo"></div>
                            <div class="lapis-btn" style="background:#9c4820;" onclick="mudarCor('#9c4820', this)" title="Castanho"></div>
                        </div>
                    </div>

                    <div class="linha-ferramentas">
                        <div class="dropdown-container">
                            <div class="lapis-dropdown-btn ativo" id="btnMenuGrossura" onclick="toggleDropdownGrossura(event)" title="Escolher Traço">
                                <img src="../../icons/lapiscolorir.png" alt="Lápis Traço" style="filter: drop-shadow(0 0 0 ${corAtual});">
                            </div>
                            <div class="dropdown-content" id="dropdownGrossura">
                                <div class="opcao-traco" onclick="selecionarTraco(4, this)">
                                    <span>Fino</span>
                                    <span class="linha-amostra" style="height: 3px;"></span>
                                </div>
                                <div class="opcao-traco" onclick="selecionarTraco(10, this)">
                                    <span>Médio</span>
                                    <span class="linha-amostra" style="height: 6px;"></span>
                                </div>
                                <div class="opcao-traco" onclick="selecionarTraco(18, this)">
                                    <span>Grosso</span>
                                    <span class="linha-amostra" style="height: 10px;"></span>
                                </div>
                            </div>
                        </div>
                        
                        <div class="btn-ferramenta-img" id="btnBorracha" onclick="ativarBorracha(this)" title="Borracha">
                            <img src="../../icons/borracha.png" alt="Borracha">
                        </div>
                        <div class="btn-ferramenta-img" id="btnBalde" onclick="ativarBalde(this)" title="Balde de Tinta">
                            <img src="../../icons/balde_tinta.png" alt="Balde de Tinta">
                        </div>
                        <div class="btn-ferramenta-img" id="btnAnular" onclick="anularUltimaAcao()" title="Anular">
                            <img src="../../icons/anular.png" alt="Anular">
                        </div>
                    </div>

                    <!-- Moldura quadrada, maior e sem legenda na barra lateral -->
                    <div class="moldura-barra-container">
                        <button class="btn-seta-barra" onclick="mudarDesenho(-1)"><i class="fas fa-chevron-left"></i></button>
                        <div class="moldura-barra-quadrada">
                            <img src="${desenhoAtualObj.arquivo}" alt="" class="moldura-barra-miniatura" id="miniaturaDesenhoBarra">
                        </div>
                        <button class="btn-seta-barra" onclick="mudarDesenho(1)"><i class="fas fa-chevron-right"></i></button>
                    </div>

                    <button class="btn-ferramenta-texto" onclick="concluirDesenho()"><i class="fas fa-check"></i> Pronto!</button>
                </div>
            </div>
        `;
    }

    if (slotFundo) {
        slotFundo.className = "barrita-fundo-cartao";
        slotFundo.innerHTML = "";
    }

    window.onclick = function(event) {
        if (!event.target.closest('.dropdown-container')) {
            const drop = document.getElementById('dropdownGrossura');
            if (drop) drop.classList.remove('mostrar');
        }
    };

    configurarCanvas();
}

function toggleDropdownGrossura(e) {
    e.stopPropagation();
    if (somClique.src) somClique.play().catch(()=>{});
    const drop = document.getElementById('dropdownGrossura');
    if (drop) drop.classList.toggle('mostrar');
}

function selecionarTraco(tamanho, el) {
    if (somClique.src) somClique.play().catch(()=>{});
    tamanhoPincel = tamanho;
    if (ctx) ctx.lineWidth = tamanhoPincel;

    const drop = document.getElementById('dropdownGrossura');
    if (drop) drop.classList.remove('mostrar');

    ferramentaAtual = 'lapis';
    document.getElementById('btnBorracha').classList.remove('ativo');
    document.getElementById('btnBalde').classList.remove('ativo');
    document.getElementById('btnMenuGrossura').classList.add('ativo');
    atualizarCursorPincel();
}

function configurarCanvas() {
    canvas = document.getElementById('paintCanvas');
    const wrapper = document.getElementById('canvasWrapper');
    if (!canvas || !wrapper) return;

    canvas.width = wrapper.clientWidth;
    canvas.height = wrapper.clientHeight;

    ctx = canvas.getContext('2d');
    ctx.fillStyle = "#FFFFFF";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    const lista = DADOS.desenhosParaColorir || [];
    const desenhoObj = lista[indiceDesenhoAtual];
    
    // Atualizar a miniatura na moldura lateral
    const imgMiniatura = document.getElementById('miniaturaDesenhoBarra');
    if (imgMiniatura && desenhoObj) imgMiniatura.src = desenhoObj.arquivo;

    if (desenhoObj && desenhoObj.arquivo) {
        const imgDesenho = new Image();
        imgDesenho.crossOrigin = "anonymous";
        imgDesenho.src = desenhoObj.arquivo;
        imgDesenho.onload = function() {
            const hRatio = canvas.width / imgDesenho.width;
            const vRatio = canvas.height / imgDesenho.height;
            const ratio = Math.min(hRatio, vRatio) * 0.9;
            const centerShiftX = (canvas.width - imgDesenho.width * ratio) / 2;
            const centerShiftY = (canvas.height - imgDesenho.height * ratio) / 2;

            ctx.drawImage(imgDesenho, 0, 0, imgDesenho.width, imgDesenho.height, centerShiftX, centerShiftY, imgDesenho.width * ratio, imgDesenho.height * ratio);
            
            historicoCanvas = [];
            salvarEstadoHistorico();
        };
    } else {
        salvarEstadoHistorico();
    }

    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.lineWidth = tamanhoPincel;
    ctx.strokeStyle = corAtual;

    setTimeout(atualizarCursorPincel, 50);

    const getPos = (e) => {
        const rect = canvas.getBoundingClientRect();
        const clientX = e.touches ? e.touches[0].clientX : e.clientX;
        const clientY = e.touches ? e.touches[0].clientY : e.clientY;
        return { 
            x: Math.floor(clientX - rect.left), 
            y: Math.floor(clientY - rect.top) 
        };
    };

    const startDraw = (e) => {
        const pos = getPos(e);
        if (ferramentaAtual === 'balde') {
            preencherAreaComCor(pos.x, pos.y);
            e.preventDefault();
            return;
        }

        isDrawing = true;
        ctx.beginPath();
        ctx.moveTo(pos.x, pos.y);
        e.preventDefault();
    };

    const draw = (e) => {
        if (!isDrawing || ferramentaAtual === 'balde') return;
        const pos = getPos(e);
        
        if (ferramentaAtual === 'borracha') {
            ctx.strokeStyle = '#FFFFFF';
        } else {
            ctx.strokeStyle = corAtual;
        }

        ctx.lineTo(pos.x, pos.y);
        ctx.stroke();
        e.preventDefault();
    };

    const endDraw = () => {
        if (isDrawing) {
            isDrawing = false;
            salvarEstadoHistorico();
        }
    };

    canvas.onmousedown = startDraw;
    canvas.onmousemove = draw;
    canvas.onmouseup = endDraw;
    canvas.onmouseleave = endDraw;

    canvas.ontouchstart = startDraw;
    canvas.ontouchmove = draw;
    canvas.ontouchend = endDraw;
}

function salvarEstadoHistorico() {
    if (!canvas || !ctx) return;
    if (historicoCanvas.length >= 10) {
        historicoCanvas.shift();
    }
    historicoCanvas.push(ctx.getImageData(0, 0, canvas.width, canvas.height));
}

function anularUltimaAcao() {
    if (somClique.src) somClique.play().catch(()=>{});
    if (historicoCanvas.length > 1) {
        historicoCanvas.pop();
        const estadoAnterior = historicoCanvas[historicoCanvas.length - 1];
        ctx.putImageData(estadoAnterior, 0, 0);
    }
}

function mudarCor(novaCor, el) {
    if (somClique.src) somClique.play().catch(()=>{});
    corAtual = novaCor;
    ferramentaAtual = 'lapis';
    if (ctx) ctx.strokeStyle = corAtual;
    
    document.querySelectorAll('.lapis-btn').forEach(b => b.classList.remove('ativo'));
    document.getElementById('btnBorracha').classList.remove('ativo');
    document.getElementById('btnBalde').classList.remove('ativo');
    
    if (el) el.classList.add('ativo');

    const iconeLapis = document.querySelector('#btnMenuGrossura img');
    if (iconeLapis) {
        iconeLapis.style.filter = `drop-shadow(0 0 0 ${corAtual})`;
    }

    atualizarCursorPincel();
}

function ativarBorracha(el) {
    if (somClique.src) somClique.play().catch(()=>{});
    ferramentaAtual = 'borracha';
    document.querySelectorAll('.lapis-btn').forEach(b => b.classList.remove('ativo'));
    document.getElementById('btnBalde').classList.remove('ativo');
    document.getElementById('btnMenuGrossura').classList.remove('ativo');
    if (el) el.classList.add('ativo');
    atualizarCursorPincel();
}

function ativarBalde(el) {
    if (somClique.src) somClique.play().catch(()=>{});
    ferramentaAtual = 'balde';
    document.querySelectorAll('.lapis-btn').forEach(b => b.classList.remove('ativo'));
    document.getElementById('btnBorracha').classList.remove('ativo');
    document.getElementById('btnMenuGrossura').classList.remove('ativo');
    if (el) el.classList.add('ativo');
    atualizarCursorPincel();
}

function hexToRgba(hex) {
    let c = hex.replace('#', '');
    if (c.length === 3) {
        c = c.split('').map(x => x + x).join('');
    }
    const num = parseInt(c, 16);
    return [
        (num >> 16) & 255,
        (num >> 8) & 255,
        num & 255,
        255
    ];
}

function preencherAreaComCor(startX, startY) {
    if (!ctx || !canvas) return;
    if (somClique.src) somClique.play().catch(()=>{});

    const width = canvas.width;
    const height = canvas.height;
    if (startX < 0 || startX >= width || startY < 0 || startY >= height) return;

    const imgData = ctx.getImageData(0, 0, width, height);
    const data = imgData.data;

    const fillColor = hexToRgba(corAtual);
    const pos = (startY * width + startX) * 4;
    const targetColor = [data[pos], data[pos + 1], data[pos + 2], data[pos + 3]];

    if (
        targetColor[0] === fillColor[0] &&
        targetColor[1] === fillColor[1] &&
        targetColor[2] === fillColor[2] &&
        targetColor[3] === fillColor[3]
    ) {
        return;
    }

    function colorMatch(idx) {
        const diff = Math.abs(data[idx] - targetColor[0]) +
                     Math.abs(data[idx + 1] - targetColor[1]) +
                     Math.abs(data[idx + 2] - targetColor[2]) +
                     Math.abs(data[idx + 3] - targetColor[3]);
        return diff < 60;
    }

    const pixelStack = [[startX, startY]];

    while (pixelStack.length > 0) {
        const newPos = pixelStack.pop();
        const x = newPos[0];
        let y = newPos[1];

        let pixelPos = (y * width + x) * 4;

        while (y >= 0 && colorMatch(pixelPos)) {
            y--;
            pixelPos -= width * 4;
        }

        pixelPos += width * 4;
        y++;

        let reachLeft = false;
        let reachRight = false;

        while (y < height && colorMatch(pixelPos)) {
            data[pixelPos] = fillColor[0];
            data[pixelPos + 1] = fillColor[1];
            data[pixelPos + 2] = fillColor[2];
            data[pixelPos + 3] = fillColor[3];

            if (x > 0) {
                if (colorMatch(pixelPos - 4)) {
                    if (!reachLeft) {
                        pixelStack.push([x - 1, y]);
                        reachLeft = true;
                    }
                } else if (reachLeft) {
                    reachLeft = false;
                }
            }

            if (x < width - 1) {
                if (colorMatch(pixelPos + 4)) {
                    if (!reachRight) {
                        pixelStack.push([x + 1, y]);
                        reachRight = true;
                    }
                } else if (reachRight) {
                    reachRight = false;
                }
            }

            y++;
            pixelPos += width * 4;
        }
    }

    ctx.putImageData(imgData, 0, 0);
    salvarEstadoHistorico();
}

function concluirDesenho() {
    if (somAcerto.src) somAcerto.play().catch(()=>{});
    const overlay = document.getElementById('round-feedback');
    const iconeFeedback = DADOS.icons.feedbacks.feedback1;

    if (overlay) {
        overlay.style.display = 'flex';
        overlay.innerHTML = `
            <div style="width: 100%; display: flex; justify-content: center; align-items: center; flex: 1;">
                <div class="vitoria-card">
                    <img src="${iconeFeedback}" style="width:170px; height:170px; object-fit:contain; filter: drop-shadow(0 6px 12px rgba(0,0,0,0.15));">
                    <h1 style="color:#C2890B; font-size:1.5rem; font-weight:900; margin:0; text-transform:uppercase;">QUE OBRA DE ARTE MÁGICA!</h1>
                    <p style="color:#555; font-weight:800; margin:0; font-size:0.85rem;">Fizeste um desenho maravilhoso!</p>
                    <div style="display:flex; justify-content:center; gap:12px; margin-top:8px; width:100%; max-width:420px;">
                        <button class="btn-final-roxo" onclick="mostrarCapa()">Outro Desenho</button>
                        <button class="btn-final-branco" onclick="window.history.back()">Outro Jogo</button>
                    </div>
                </div>
            </div>
            <div class="feedback-bottom-bar"></div>`;
    }
    const slotTopo = document.getElementById('slot-topo');
    const slotFundo = document.getElementById('slot-fundo');
    if (slotTopo) slotTopo.innerHTML = "";
    if (slotFundo) slotFundo.innerHTML = "";
}

mostrarCapa();
