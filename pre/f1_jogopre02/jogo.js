// ============================================================
// 1. ESTADO GLOBAL E SONS
// ============================================================
const JOGO_CONFIG = {
    nomeDoJogo: DADOS.animacaoCapa ? DADOS.animacaoCapa.titulo : "Estojo Mágico - Livro de Colorir",
    caminhoSons: DADOS.sons ? DADOS.sons.caminho : "",
    caminhoIconsMenu: "../../icons/"
};

let corAtual = "#ECA607";
let ctx = null;
let canvas = null;
let imgDesenho = null;
let historicoCanvas = []; 
let indiceDesenhoAtual = 0;
let timerAnimacaoCapa = null;

// Obter lista de desenhos a partir de DADOS ou fallback
function obterListaDesenhos() {
    if (DADOS && DADOS.desenhosParaColorir && DADOS.desenhosParaColorir.length > 0) {
        return DADOS.desenhosParaColorir;
    }
    return [
        { nome: "Desenho 1", arquivo: "desenho1.png" },
        { nome: "Desenho 2", arquivo: "desenho2.png" }
    ];
}

const somAcerto = new Audio(DADOS.sons && DADOS.sons.certo ? DADOS.sons.certo : "");
const somClique = new Audio(DADOS.sons && DADOS.sons.clique ? DADOS.sons.clique : "");
const somInstrucao = new Audio(DADOS.sons && DADOS.sons.instrucao ? DADOS.sons.instrucao : "f1_jogo01pre.mp3");


// ============================================================
// 2. CONFIGURAÇÃO VISUAL (OTIMIZADA PARA PC E TELEMÓVEL HORIZONTAL)
// ============================================================
const styleJogo = document.createElement('style');
styleJogo.innerHTML = `
    .jogo-layout-principal {
        display: flex; flex-direction: row; align-items: stretch; justify-content: space-between;
        width: 100%; height: 100%; flex: 1; gap: 12px; animation: cardPop 0.3s ease; padding: 4px 0;
        box-sizing: border-box; overflow: hidden;
    }
    @keyframes cardPop { 0% { transform: scale(0.7); opacity: 0; } 100% { transform: scale(1); opacity: 1; } }

    /* Lado Esquerdo: Área de Desenho */
    .canvas-wrapper {
        background: white; border: 3px solid #E2D3AB; border-radius: 16px;
        box-shadow: 0 4px 15px rgba(0,0,0,0.08); overflow: hidden; touch-action: none;
        flex: 1; height: 100%; display: flex; align-items: center; justify-content: center; position: relative;
        padding: 0; box-sizing: border-box;
    }
    canvas { display: block; cursor: crosshair; width: 100%; height: 100%; object-fit: fill; }

    /* Lado Direito: Estojo com Ferramentas e Seletor */
    .painel-estojo-vertical {
        display: flex; flex-direction: column; align-items: center; justify-content: space-between;
        width: 240px; height: 100%; background: rgba(255,255,255,0.9); padding: 8px; border-radius: 16px; 
        border: 2px solid #E2D3AB; flex-shrink: 0; gap: 6px; box-sizing: border-box; overflow-y: auto;
    }

    .seccao-cores {
        display: flex; flex-direction: column; align-items: center; width: 100%; gap: 4px;
        background: #FFF7E3; padding: 6px; border-radius: 12px; border: 1.5px solid #F3E0B5; box-sizing: border-box;
    }
    .grid-cores {
        display: grid; grid-template-columns: repeat(4, 1fr); gap: 5px; width: 100%; justify-items: center;
    }
    
    .lapis-btn {
        width: 26px; height: 26px; border-radius: 50%; border: 2.5px solid white; cursor: pointer;
        box-shadow: 0 2px 4px rgba(0,0,0,0.15); transition: transform 0.1s;
    }
    .lapis-btn:active, .lapis-btn.ativo { transform: scale(1.15); border-color: #262638; }

    .seccao-ferramentas {
        display: flex; flex-direction: column; align-items: center; width: 100%; gap: 8px; flex: 1; justify-content: center;
    }
    .linha-ferramentas {
        display: flex; align-items: center; justify-content: center; gap: 8px; flex-wrap: wrap; width: 100%;
    }

    .btn-ferramenta-img {
        background: white; border: 2px solid #ECA607; width: 34px; height: 34px;
        border-radius: 10px; cursor: pointer; display: flex; align-items: center; justify-content: center;
        box-shadow: 0 3px 8px rgba(0,0,0,0.08); transition: transform 0.1s; padding: 3px;
    }
    .btn-ferramenta-img:active { transform: scale(0.92); }
    .btn-ferramenta-img.ativo { background: #ECA607; border-color: #262638; transform: scale(1.08); }
    .btn-ferramenta-img img { width: 100%; height: 100%; object-fit: contain; pointer-events: none; }

    .btn-ferramenta-texto {
        background: #ECA607; color: white; border: none; padding: 8px 12px; width: 100%;
        border-radius: 12px; font-weight: 900; font-size: 0.85rem; cursor: pointer;
        box-shadow: 0 3px 8px rgba(236,166,7,0.3); transition: transform 0.1s; text-align: center;
    }
    .btn-ferramenta-texto:active { transform: scale(0.95); }

    /* Moldura Seletora BEM MAIS ALTA para PC (130px de altura) */
    .moldura-selecao-desenho {
        display: flex; align-items: center; justify-content: space-between; width: 100%; height: 130px;
        background: white; border: 2.5px solid #ECA607; border-radius: 14px; padding: 8px;
        box-shadow: 0 4px 10px rgba(0,0,0,0.08); gap: 6px; box-sizing: border-box;
    }
    .seta-desenho-btn {
        background: #ECA607; color: white; border: none; width: 34px; height: 34px;
        border-radius: 50%; font-size: 0.95rem; font-weight: 900; cursor: pointer;
        display: flex; align-items: center; justify-content: center; box-shadow: 0 2px 5px rgba(0,0,0,0.15);
        transition: transform 0.1s; flex-shrink: 0;
    }
    .seta-desenho-btn:active { transform: scale(0.9); }
    .visor-desenho {
        display: flex; align-items: center; justify-content: center; flex: 1; height: 100%; overflow: hidden;
    }
    .visor-desenho img { width: 100%; height: 105px; object-fit: contain; pointer-events: none; }

    /* Estilos da Capa Limpa */
    .capa-container {
        display: flex; flex-direction: column; align-items: center; justify-content: center;
        flex: 1; width: 100%; height: 100%; gap: 14px; text-align: center;
    }
    .animacao-capa-area {
        position: relative; width: 260px; height: 195px; background: white;
        border: 3px solid #ECA607; border-radius: 18px; overflow: hidden;
        box-shadow: 0 8px 20px rgba(236,166,7,0.25); display: flex; align-items: center; justify-content: center;
        cursor: pointer;
    }

    .btn-capa-som {
        width: 44px; height: 44px; background: rgba(255,255,255,0.8); border: 2px solid rgba(255,255,255,0.95);
        border-radius: 50%; display: flex; align-items: center; justify-content: center; cursor: pointer;
        transition: transform 0.1s; box-shadow: 0 3px 8px rgba(0,0,0,0.1);
    }
    .btn-capa-som:active { transform: scale(0.92); }
    .btn-capa-som img { width: 22px; height: 22px; object-fit: contain; }

    .btn-menu-topo {
        height: 44px; background: white; color: #C2890B; border: 2px solid #E2D3AB;
        padding: 0 16px; border-radius: 22px; font-weight: 900; font-size: 0.85rem;
        cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 6px;
        box-shadow: 0 3px 8px rgba(0,0,0,0.08); transition: transform 0.2s ease, background 0.2s ease;
    }
    .btn-menu-topo:hover { transform: scale(1.05); background: #FFF9E6; }
    .btn-menu-topo:active { transform: scale(0.95); }

    .btn-capa-jogar {
        background: white; color: #C2890B; border: none;
        padding: 8px 26px; border-radius: 18px; font-weight: 900; font-size: 1rem;
        cursor: pointer; box-shadow: 0 4px 15px rgba(0,0,0,0.15); transition: transform 0.2s ease;
        text-transform: uppercase;
    }
    .btn-capa-jogar:active { transform: scale(0.95); }

    #round-feedback { 
        position: absolute; top: 0; left: 0; width: 100%; height: 100%; 
        background: rgba(255, 255, 255, 0.95); backdrop-filter: blur(6px); 
        z-index: 1000; display: none; flex-direction: column; align-items: center; justify-content: center; 
        border-radius: 35px; overflow: hidden;
    }
    
    .feedback-bottom-bar {
        position: absolute; bottom: 20px; left: 24px; right: 24px; height: 14px;
        background: #ECA607; border-radius: 7px;
    }

    .vitoria-card { background: transparent; padding: 10px 20px; text-align: center; display: flex; flex-direction: column; align-items: center; gap: 12px; animation: cardPop 0.4s cubic-bezier(0.17, 0.89, 0.32, 1.28); margin-bottom: 25px; width: 100%; max-width: 480px; }
    
    .btn-final-roxo {
        background: #ECA607; color: white; border: none; padding: 12px 20px;
        border-radius: 25px; font-weight: 900; font-size: 0.95rem; cursor: pointer;
        box-shadow: 0 6px 15px rgba(236,166,7,0.3); text-transform: capitalize; transition: transform 0.1s;
        white-space: nowrap; flex: 1; text-align: center;
    }
    .btn-final-roxo:active { transform: scale(0.95); }

    .btn-final-branco {
        background: white; color: #C2890B; border: 2px solid #ECA607; padding: 12px 20px;
        border-radius: 25px; font-weight: 900; font-size: 0.95rem; cursor: pointer;
        box-shadow: 0 6px 15px rgba(0,0,0,0.08); text-transform: capitalize; transition: transform 0.1s;
        white-space: nowrap; flex: 1; text-align: center;
    }
    .btn-final-branco:active { transform: scale(0.95); }

    @media (max-height: 550px) or (max-width: 850px) and (orientation: landscape) {
        .jogo-layout-principal { gap: 6px; padding: 2px 0; }
        .painel-estojo-vertical { width: 180px; padding: 4px; gap: 4px; }
        .grid-cores { gap: 3px; }
        .lapis-btn { width: 22px; height: 22px; }
        .btn-ferramenta-img { width: 28px; height: 28px; }
        .moldura-selecao-desenho { height: 75px; padding: 4px; }
        .visor-desenho img { height: 55px; }
        .seta-desenho-btn { width: 26px; height: 26px; font-size: 0.75rem; }
        .btn-ferramenta-texto { padding: 5px 8px; font-size: 0.75rem; }
        .capa-container { gap: 6px; }
        .animacao-capa-area { width: 200px; height: 140px; }
    }

    @media (max-width: 600px) and (orientation: portrait) {
        .jogo-layout-principal { flex-direction: column; overflow: auto; }
        .painel-estojo-vertical { width: 100%; height: auto; flex-direction: row; flex-wrap: wrap; justify-content: center; }
        .canvas-wrapper { height: 250px; }
        .seccao-cores { width: auto; flex: 1; }
        .seccao-ferramentas { width: auto; flex: 2; }
    }
`;
document.head.appendChild(styleJogo);


// ============================================================
// 3. CAPA COM ANIMAÇÃO REAL DE PINTURA E BARRAS DINÂMICAS
// ============================================================
function mostrarCapa() {
    clearTimeout(timerAnimacaoCapa);

    const feedbackEl = document.getElementById('round-feedback');
    if (feedbackEl) {
        feedbackEl.style.display = 'none';
        feedbackEl.innerHTML = '';
    }

    const slotTopo = document.getElementById('slot-topo');
    const slotFundo = document.getElementById('slot-fundo');

    if (slotTopo) {
        slotTopo.className = "barrita-fundo-cartao";
        slotTopo.innerHTML = "";
    }

    const area = document.getElementById('contentor-jogo');
    if (area) {
        const tituloAnimacao = DADOS.animacaoCapa ? DADOS.animacaoCapa.titulo : "Estojo Mágico - Livro de Colorir";
        area.innerHTML = `
            <div class="capa-container" style="position:relative;">
                <div style="font-size: 1.4rem; font-weight: 900; color: #C2890B; text-transform: uppercase;">${tituloAnimacao}</div>
                
                <div class="animacao-capa-area" onclick="tocarSomInstrucao()" title="Clica para ouvir a instrução!">
                    <canvas id="capaCanvas" width="260" height="195"></canvas>
                    <div id="capaMao" style="position:absolute; font-size:2.2rem; pointer-events:none; transition: all 0.2s ease;">🖌️</div>
                </div>
                
                <div id="round-feedback"></div>
            </div>
        `;
    }

    if (slotFundo) {
        slotFundo.className = "barra-jogo-topo";
        slotFundo.innerHTML = `
            <div class="btn-capa-som" onclick="tocarSomInstrucao()"><img src="${DADOS.icons.som}" alt="Som"></div>
            <button class="btn-capa-jogar" onclick="iniciarJogoDesenho()">JOGAR</button>
        `;
    }

    setTimeout(iniciarAnimacaoCapaRealista, 100);
}

function iniciarAnimacaoCapaRealista() {
    const cCanvas = document.getElementById('capaCanvas');
    const cMao = document.getElementById('capaMao');
    if (!cCanvas || !cMao) return;
    const cCtx = cCanvas.getContext('2d', { willReadFrequently: true });

    cCtx.fillStyle = "#FFFFFF";
    cCtx.fillRect(0, 0, cCanvas.width, cCanvas.height);

    const desenhos = obterListaDesenhos();
    const atual = desenhos[indiceDesenhoAtual] || desenhos[0];
    
    if (atual && atual.arquivo) {
        const img = new Image();
        img.crossOrigin = "anonymous";
        img.onload = () => {
            cCtx.drawImage(img, 0, 0, cCanvas.width, cCanvas.height);
            executarSimulacaoPintura(cCtx, cMao, cCanvas.width, cCanvas.height);
        };
        img.src = atual.arquivo;
    } else {
        executarSimulacaoPintura(cCtx, cMao, cCanvas.width, cCanvas.height);
    }
}

function executarSimulacaoPintura(cCtx, cMao, w, h) {
    const coresSimulacao = ["#ff5a5f", "#3a86ff", "#8cc63f", "#ff9f1c", "#9b5de5"];
    const passosPintura = [
        { x: w * 0.45, y: h * 0.35, cor: coresSimulacao[0] },
        { x: w * 0.55, y: h * 0.70, cor: coresSimulacao[1] },
        { x: w * 0.30, y: h * 0.50, cor: coresSimulacao[2] },
        { x: w * 0.70, y: h * 0.50, cor: coresSimulacao[3] }
    ];

    let indexPasso = 0;

    function proximoPassoAnimacao() {
        if (!document.getElementById('capaCanvas')) return;

        if (indexPasso < passosPintura.length) {
            const p = passosPintura[indexPasso];
            
            cMao.style.left = (p.x - 12) + "px";
            cMao.style.top = (p.y - 28) + "px";

            simularPreenchimentoCapa(cCtx, Math.floor(p.x), Math.floor(p.y), p.cor, w, h);

            indexPasso++;
            timerAnimacaoCapa = setTimeout(proximoPassoAnimacao, 800);
        } else {
            indexPasso = 0;
            timerAnimacaoCapa = setTimeout(proximoPassoAnimacao, 1000);
        }
    }

    proximoPassoAnimacao();
}

function simularPreenchimentoCapa(ctx, startX, startY, hexCor, width, height) {
    const imgData = ctx.getImageData(0, 0, width, height);
    const data = imgData.data;

    function hexToRgba(hex) {
        let c = hex.replace('#', '');
        if (c.length === 3) c = c.split('').map(x => x + x).join('');
        const num = parseInt(c, 16);
        return [(num >> 16) & 255, (num >> 8) & 255, num & 255, 255];
    }

    const fillColor = hexToRgba(hexCor);
    const pos = (startY * width + startX) * 4;
    const targetColor = [data[pos], data[pos + 1], data[pos + 2], data[pos + 3]];

    if (targetColor[0] === fillColor[0] && targetColor[1] === fillColor[1] && targetColor[2] === fillColor[2]) return;

    function colorMatch(idx) {
        const r = data[idx], g = data[idx + 1], b = data[idx + 2];
        if (r < 70 && g < 70 && b < 70) return false;
        const diff = Math.abs(r - targetColor[0]) + Math.abs(g - targetColor[1]) + Math.abs(b - targetColor[2]);
        return diff < 80;
    }

    const pixelStack = [[startX, startY]];
    while (pixelStack.length > 0) {
        const [x, yCoord] = pixelStack.pop();
        let y = yCoord;
        let pixelPos = (y * width + x) * 4;

        while (y >= 0 && colorMatch(pixelPos)) {
            y--;
            pixelPos -= width * 4;
        }
        pixelPos += width * 4;
        y++;

        let reachLeft = false, reachRight = false;
        while (y < height && colorMatch(pixelPos)) {
            data[pixelPos] = fillColor[0];
            data[pixelPos + 1] = fillColor[1];
            data[pixelPos + 2] = fillColor[2];
            data[pixelPos + 3] = fillColor[3];

            if (x > 0) {
                if (colorMatch(pixelPos - 4)) {
                    if (!reachLeft) { pixelStack.push([x - 1, y]); reachLeft = true; }
                } else if (reachLeft) { reachLeft = false; }
            }
            if (x < width - 1) {
                if (colorMatch(pixelPos + 4)) {
                    if (!reachRight) { pixelStack.push([x + 1, y]); reachRight = true; }
                } else if (reachRight) { reachRight = false; }
            }
            y++;
            pixelPos += width * 4;
        }
    }
    ctx.putImageData(imgData, 0, 0);
}

function tocarSomInstrucao() {
    if (somClique.src) somClique.play().catch(()=>{});
    somInstrucao.currentTime = 0;
    somInstrucao.play().catch(()=>{});
}


// ============================================================
// 4. LÓGICA DO ECRÃ DE JOGO DE COLORIR
// ============================================================
function iniciarJogoDesenho() {
    clearTimeout(timerAnimacaoCapa);
    if (somClique.src) somClique.play().catch(()=>{});

    const slotTopo = document.getElementById('slot-topo');
    const slotFundo = document.getElementById('slot-fundo');
    const area = document.getElementById('contentor-jogo');

    if (slotTopo) {
        slotTopo.className = "barra-jogo-topo";
        slotTopo.innerHTML = `
            <div class="btn-capa-som" style="width:44px; height:44px;" onclick="tocarSomInstrucao()"><img src="${DADOS.icons.som}" alt="Som" style="width:22px; height:22px;"></div>
            <button class="btn-menu-topo" onclick="mostrarCapa()"><i class="fas fa-bars"></i> Menu</button>
        `;
    }

    if (area) {
        area.innerHTML = `
            <div class="jogo-layout-principal" style="position:relative;">
                <!-- Esquerda: Desenho / Pintura -->
                <div class="canvas-wrapper" id="canvasWrapper">
                    <canvas id="paintCanvas"></canvas>
                </div>

                <!-- Direita: Estojo de Ferramentas e Seletor -->
                <div class="painel-estojo-vertical">
                    <div class="seccao-cores">
                        <span style="font-size:0.6rem; font-weight:900; color:#C2890B; text-transform:uppercase;">Cores</span>
                        <div class="grid-cores">
                            <div class="lapis-btn ativo" style="background:#ECA607;" onclick="mudarCor('#ECA607', this)" title="Amarelo Ouro"></div>
                            <div class="lapis-btn" style="background:#ffd166;" onclick="mudarCor('#ffd166', this)" title="Amarelo Claro"></div>
                            <div class="lapis-btn" style="background:#ff5a5f;" onclick="mudarCor('#ff5a5f', this)" title="Vermelho"></div>
                            <div class="lapis-btn" style="background:#ff9f1c;" onclick="mudarCor('#ff9f1c', this)" title="Laranja"></div>
                            <div class="lapis-btn" style="background:#8cc63f;" onclick="mudarCor('#8cc63f', this)" title="Verde Claro"></div>
                            <div class="lapis-btn" style="background:#06d6a0;" onclick="mudarCor('#06d6a0', this)" title="Verde Menta"></div>
                            <div class="lapis-btn" style="background:#2ec4b6;" onclick="mudarCor('#2ec4b6', this)" title="Verde Água"></div>
                            <div class="lapis-btn" style="background:#3a86ff;" onclick="mudarCor('#3a86ff', this)" title="Azul"></div>
                            <div class="lapis-btn" style="background:#4361ee;" onclick="mudarCor('#4361ee', this)" title="Azul Escuro"></div>
                            <div class="lapis-btn" style="background:#7209b7;" onclick="mudarCor('#7209b7', this)" title="Roxo"></div>
                            <div class="lapis-btn" style="background:#9b5de5;" onclick="mudarCor('#9b5de5', this)" title="Lilás"></div>
                            <div class="lapis-btn" style="background:#ff007f;" onclick="mudarCor('#ff007f', this)" title="Rosa Choque"></div>
                            <div class="lapis-btn" style="background:#ff70a6;" onclick="mudarCor('#ff70a6', this)" title="Rosa Pastel"></div>
                            <div class="lapis-btn" style="background:#8d5524;" onclick="mudarCor('#8d5524', this)" title="Castanho"></div>
                            <div class="lapis-btn" style="background:#262638;" onclick="mudarCor('#262638', this)" title="Preto"></div>
                            <div class="lapis-btn" style="background:#FFFFFF; border:2px solid #E2D3AB;" onclick="mudarCor('#FFFFFF', this)" title="Branco"></div>
                        </div>
                    </div>

                    <div class="seccao-ferramentas">
                        <div class="linha-ferramentas">
                            <div class="btn-ferramenta-img" id="btnBorracha" onclick="ativarBorracha(this)" title="Borracha">
                                <img src="../../icons/borracha.png" alt="Borracha">
                            </div>
                            <div class="btn-ferramenta-img" id="btnAnular" onclick="anularUltimaAcao()" title="Anular">
                                <img src="../../icons/anular.png" alt="Anular">
                            </div>
                        </div>

                        <!-- Moldura Seletora mais alta para PC e otimizada -->
                        <div class="moldura-selecao-desenho">
                            <button class="seta-desenho-btn" onclick="mudarDesenhoJogo(-1)">❮</button>
                            <div class="visor-desenho" id="visorDesenhoJogo"></div>
                            <button class="seta-desenho-btn" onclick="mudarDesenhoJogo(1)">❯</button>
                        </div>

                        <button class="btn-ferramenta-texto" onclick="concluirDesenho()"><i class="fas fa-check"></i> Pronto!</button>
                    </div>
                </div>

                <!-- Ecrã de Feedback -->
                <div id="round-feedback"></div>
            </div>
        `;
    }

    if (slotFundo) {
        slotFundo.className = "barrita-fundo-cartao";
        const textoInstrucao = DADOS.animacaoCapa ? DADOS.animacaoCapa.instrucaoTexto : "🎨 Clica numa zona do desenho para pintar!";
        slotFundo.innerHTML = `
            <div style="color:white; font-weight:800; font-size:0.85rem;">${textoInstrucao}</div>
        `;
    }

    atualizarVisorJogo();
    configurarCanvas();
}

function atualizarVisorJogo() {
    const visor = document.getElementById('visorDesenhoJogo');
    if (!visor) return;
    const lista = obterListaDesenhos();
    const atual = lista[indiceDesenhoAtual] || { arquivo: "" };
    visor.innerHTML = `
        <img src="${atual.arquivo}" alt="Desenho">
    `;
}

function mudarDesenhoJogo(direcao) {
    if (somClique.src) somClique.play().catch(()=>{});
    const lista = obterListaDesenhos();
    if (lista.length === 0) return;

    indiceDesenhoAtual += direcao;
    if (indiceDesenhoAtual < 0) indiceDesenhoAtual = lista.length - 1;
    if (indiceDesenhoAtual >= lista.length) indiceDesenhoAtual = 0;

    atualizarVisorJogo();
    configurarCanvas();
}


// ============================================================
// 5. CONFIGURAÇÃO DO CANVAS E DESENHO A 100%
// ============================================================
function configurarCanvas() {
    canvas = document.getElementById('paintCanvas');
    const wrapper = document.getElementById('canvasWrapper');
    if (!canvas || !wrapper) return;

    canvas.width = 1000;
    canvas.height = 800;
    ctx = canvas.getContext('2d', { willReadFrequently: true });
    historicoCanvas = [];

    const lista = obterListaDesenhos();
    const atual = lista[indiceDesenhoAtual];

    if (atual && atual.arquivo) {
        imgDesenho = new Image();
        imgDesenho.crossOrigin = "anonymous";
        imgDesenho.onload = () => {
            desenharCenarioInicial();
            salvarEstadoHistorico();
        };
        imgDesenho.src = atual.arquivo;
    } else {
        ctx.fillStyle = "#FFFFFF";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        salvarEstadoHistorico();
    }

    const getPos = (e) => {
        const rect = canvas.getBoundingClientRect();
        const clientX = e.touches ? e.touches[0].clientX : e.clientX;
        const clientY = e.touches ? e.touches[0].clientY : e.clientY;
        
        const scaleX = canvas.width / rect.width;
        const scaleY = canvas.height / rect.height;

        return { 
            x: Math.floor((clientX - rect.left) * scaleX), 
            y: Math.floor((clientY - rect.top) * scaleY) 
        };
    };

    const lidarComClique = (e) => {
        const pos = getPos(e);
        preencherAreaComCor(pos.x, pos.y);
        e.preventDefault();
    };

    canvas.onmousedown = lidarComClique;
    canvas.ontouchstart = lidarComClique;
}

function desenharCenarioInicial() {
    if (!ctx || !imgDesenho) return;
    ctx.fillStyle = "#FFFFFF";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(imgDesenho, 0, 0, canvas.width, canvas.height);
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
    
    document.querySelectorAll('.lapis-btn').forEach(b => b.classList.remove('ativo'));
    const btnBorracha = document.getElementById('btnBorracha');
    if (btnBorracha) btnBorracha.classList.remove('ativo');
    
    if (el) el.classList.add('ativo');
}

function ativarBorracha(el) {
    if (somClique.src) somClique.play().catch(()=>{});
    corAtual = "#FFFFFF"; 
    document.querySelectorAll('.lapis-btn').forEach(b => b.classList.remove('ativo'));
    if (el) el.classList.add('ativo');
}


// ============================================================
// 6. ALGORITMO DE PREENCHIMENTO RÁPIDO (FLOOD FILL)
// ============================================================
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
        const r = data[idx];
        const g = data[idx + 1];
        const b = data[idx + 2];
        
        if (r < 70 && g < 70 && b < 70) return false;

        const diff = Math.abs(r - targetColor[0]) +
                     Math.abs(g - targetColor[1]) +
                     Math.abs(b - targetColor[2]);
        return diff < 75;
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
            <div class="vitoria-card">
                <img src="${iconeFeedback}" style="width:120px; height:120px; object-fit:contain;">
                <h1 style="color:#C2890B; font-size:1.5rem; font-weight:900; margin:0; text-transform:uppercase;">QUE OBRA DE ARTE MÁGICA!</h1>
                <p style="color:#555; font-weight:800; margin:0; font-size:0.85rem;">Fizeste um desenho maravilhoso!</p>
                <div style="display:flex; justify-content:center; gap:12px; margin-top:8px; width:100%; max-width:420px;">
                    <button class="btn-final-roxo" onclick="mostrarCapa()">Pintar Outro</button>
                    <button class="btn-final-branco" onclick="window.history.back()">Outro Jogo</button>
                </div>
            </div>
            <div class="feedback-bottom-bar"></div>`;
    }
    const slotTopo = document.getElementById('slot-topo');
    const slotFundo = document.getElementById('slot-fundo');
    if (slotTopo) slotTopo.innerHTML = "";
    if (slotFundo) slotFundo.innerHTML = "";
}

// Iniciar com a capa e a animação
mostrarCapa();
