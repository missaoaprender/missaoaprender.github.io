// ============================================================
// 1. ESTADO GLOBAL E SONS
// ============================================================
const JOGO_CONFIG = {
    nomeDoJogo: "Estojo Mágico",
    caminhoSons: DADOS.sons ? DADOS.sons.caminho : "",
    caminhoIconsMenu: "../../icons/"
};

let corAtual = "#ECA607";
let ferramentaAtual = "lapis"; 
let tamanhoPincel = 10;
let isDrawing = false;
let ctx = null;
let canvas = null;
let historicoCanvas = []; 

const somAcerto = new Audio(DADOS.sons && DADOS.sons.certo ? DADOS.sons.certo : "");
const somClique = new Audio(DADOS.sons && DADOS.sons.clique ? DADOS.sons.clique : "");
const somInstrucao = new Audio("f1_jogo01pre.mp3");


// ============================================================
// 2. CONFIGURAÇÃO VISUAL (ESTRUTURA IDÊNTICA À REFERÊNCIA)
// ============================================================
const style = document.createElement('style');
style.innerHTML = `
    .desenho-container {
        display: flex; flex-direction: row; align-items: stretch; justify-content: space-between;
        width: 100%; height: 100%; flex: 1; gap: 16px; animation: cardPop 0.35s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards; padding: 4px 0;
    }
    @keyframes cardPop { 0% { transform: scale(0.85); opacity: 0; } 100% { transform: scale(1); opacity: 1; } }

    /* ÁREA DE DESENHO GRANDE À ESQUERDA COM MOLDURA SUAVE */
    .canvas-wrapper {
        background: white; border: 3px solid #E2D3AB; border-radius: 16px;
        box-shadow: 0 4px 15px rgba(0,0,0,0.06); overflow: hidden; touch-action: none;
        flex: 3.5; width: 100%; display: flex; align-items: center; justify-content: center; min-height: 0;
    }
    canvas { display: block; cursor: crosshair; width: 100%; height: 100%; }

    /* PAINEL LATERAL À DIREITA */
    .painel-estojo {
        display: flex; flex-direction: column; align-items: center; justify-content: space-between; gap: 10px; flex: 0.9; max-width: 220px; background: rgba(255,255,255,0.95); padding: 12px; border-radius: 16px; border: 2px solid #E2D3AB; flex-shrink: 0;
        box-shadow: 0 4px 15px rgba(0,0,0,0.04);
    }

    /* CAIXA DA PALETA DE CORES */
    .painel-cores-box {
        width: 100%; background: #FFFDF7; border: 2px solid #E2D3AB; border-radius: 12px; padding: 10px 8px; display: flex; flex-direction: column; align-items: center; gap: 8px;
    }
    .titulo-cores {
        font-size: 0.75rem; font-weight: 900; color: #C2890B; letter-spacing: 1px; text-transform: uppercase; margin: 0;
    }

    /* GRELHA DE 12 CORES (4 COLUNAS) */
    .grid-cores {
        display: grid; grid-template-columns: repeat(4, 1fr); gap: 6px; width: 100%; justify-items: center;
    }
    
    .lapis-btn {
        width: 32px; height: 32px; border-radius: 50%; border: 2.5px solid white; cursor: pointer;
        box-shadow: 0 2px 5px rgba(0,0,0,0.12); transition: transform 0.2s cubic-bezier(0.34, 1.56, 0.64, 1), box-shadow 0.2s ease;
    }
    .lapis-btn:hover { transform: translateY(-2px) scale(1.1); }
    .lapis-btn:active, .lapis-btn.ativo { transform: scale(1.18); border-color: #262638; box-shadow: 0 4px 10px rgba(0,0,0,0.25); }

    /* LINHA DE FERRAMENTAS */
    .linha-ferramentas {
        display: flex; align-items: center; justify-content: center; gap: 6px; width: 100%;
    }

    /* DROPDOWN DE GROSSURA COM LÁPIS */
    .dropdown-container {
        position: relative; display: inline-block;
    }
    .lapis-dropdown-btn {
        background: white; border: 2px solid #ECA607; width: 40px; height: 40px;
        border-radius: 12px; cursor: pointer; display: flex; align-items: center; justify-content: center;
        box-shadow: 0 3px 8px rgba(0,0,0,0.08); transition: transform 0.2s ease, background 0.2s ease;
        padding: 4px;
    }
    .lapis-dropdown-btn:hover { transform: scale(1.08); }
    .lapis-dropdown-btn.ativo { background: #FFF9E6; border-color: #262638; box-shadow: 0 4px 12px rgba(236,166,7,0.4); }
    .lapis-dropdown-btn img { width: 20px; height: 26px; object-fit: contain; pointer-events: none; }

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
        background: white; border: 2px solid #ECA607; width: 40px; height: 40px;
        border-radius: 12px; cursor: pointer; display: flex; align-items: center; justify-content: center;
        box-shadow: 0 3px 8px rgba(0,0,0,0.08); transition: transform 0.2s cubic-bezier(0.34, 1.56, 0.64, 1), background 0.2s ease; padding: 4px;
    }
    .btn-ferramenta-img:hover { transform: translateY(-2px) scale(1.05); }
    .btn-ferramenta-img:active { transform: scale(0.92); }
    .btn-ferramenta-img.ativo { background: #ECA607; border-color: #262638; transform: scale(1.08); }
    .btn-ferramenta-img img { width: 100%; height: 100%; object-fit: contain; pointer-events: none; }

    /* BOTÃO PRONTO */
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

    /* BOTÃO MENU DO TOPO COM FUNDO BRANCO E MESMA ALTURA DO SOM */
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
        cursor: pointer; box-shadow: 0 4px 15px rgba(0,0,0,0.15); transition: transform 0.2s cubic-bezier(0.34, 1.56, 0.64, 1), background 0.2s ease;
        text-transform: uppercase;
    }
    .btn-capa-jogar:hover { transform: scale(1.05); background: #FFFDF0; }
    .btn-capa-jogar:active { transform: scale(0.95); }

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
// 3. CAPA E REPRODUÇÃO DE SOM
// ============================================================
function mostrarCapa() {
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
        area.innerHTML = `
            <div style="font-size: 1.4rem; font-weight: 900; color: #C2890B; margin-bottom: 8px; text-transform: uppercase; animation: cardPop 0.4s ease;">Estojo de Desenho Mágico</div>
            <div style="background: rgba(236,166,7,0.15); width: 110px; height: 110px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 3.2rem; margin-bottom: 10px; box-shadow: 0 8px 20px rgba(236,166,7,0.2); animation: cardPop 0.5s cubic-bezier(0.34, 1.56, 0.64, 1);">
                <img src="../../icons/paleta.png" alt="Paleta" style="width: 65px; height: 65px; object-fit: contain;">
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

function tocarSomInstrucao() {
    if (somClique.src) somClique.play().catch(()=>{});
    somInstrucao.currentTime = 0;
    somInstrucao.play().catch(()=>{});
}


// ============================================================
// 4. LÓGICA DO ESTOJO MÁGICO
// ============================================================
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

    if (area) {
        area.innerHTML = `
            <div class="desenho-container">
                <!-- ÁREA DO DESENHO GRANDE À ESQUERDA -->
                <div class="canvas-wrapper" id="canvasWrapper">
                    <canvas id="paintCanvas"></canvas>
                </div>

                <!-- PAINEL LATERAL À DIREITA -->
                <div class="painel-estojo">
                    <!-- CAIXA DA PALETA DE CORES (12 CORES) -->
                    <div class="painel-cores-box">
                        <span class="titulo-cores">Cores</span>
                        <div class="grid-cores">
                            <div class="lapis-btn ativo" style="background:#ECA607;" onclick="mudarCor('#ECA607', this)"></div>
                            <div class="lapis-btn" style="background:#ff5a5f;" onclick="mudarCor('#ff5a5f', this)"></div>
                            <div class="lapis-btn" style="background:#8cc63f;" onclick="mudarCor('#8cc63f', this)"></div>
                            <div class="lapis-btn" style="background:#3a86ff;" onclick="mudarCor('#3a86ff', this)"></div>
                            <div class="lapis-btn" style="background:#9b5de5;" onclick="mudarCor('#9b5de5', this)"></div>
                            <div class="lapis-btn" style="background:#ff007f;" onclick="mudarCor('#ff007f', this)"></div>
                            <div class="lapis-btn" style="background:#00f5d4;" onclick="mudarCor('#00f5d4', this)"></div>
                            <div class="lapis-btn" style="background:#fb8500;" onclick="mudarCor('#fb8500', this)"></div>
                            <div class="lapis-btn" style="background:#ffb703;" onclick="mudarCor('#ffb703', this)"></div>
                            <div class="lapis-btn" style="background:#023047;" onclick="mudarCor('#023047', this)"></div>
                            <div class="lapis-btn" style="background:#70e000;" onclick="mudarCor('#70e000', this)"></div>
                            <div class="lapis-btn" style="background:#262638;" onclick="mudarCor('#262638', this)"></div>
                        </div>
                    </div>

                    <!-- FERRAMENTAS (LÁPIS/DROPDOWN, BORRACHA, BALDE, ANULAR) -->
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

                    <!-- BOTÃO PRONTO -->
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
}

function configurarCanvas() {
    canvas = document.getElementById('paintCanvas');
    const wrapper = document.getElementById('canvasWrapper');
    if (!canvas || !wrapper) return;

    const tempCanvas = document.createElement('canvas');
    tempCanvas.width = canvas.width || wrapper.clientWidth;
    tempCanvas.height = canvas.height || wrapper.clientHeight;
    const tempCtx = tempCanvas.getContext('2d');
    if (ctx) {
        tempCtx.drawImage(canvas, 0, 0);
    }

    canvas.width = wrapper.clientWidth;
    canvas.height = wrapper.clientHeight;

    ctx = canvas.getContext('2d');
    if (ctx && canvas.width > 0 && tempCanvas.width > 0) {
        ctx.drawImage(tempCanvas, 0, 0);
    } else if (ctx) {
        ctx.fillStyle = "#FFFFFF";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
    }

    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.lineWidth = tamanhoPincel;
    ctx.strokeStyle = corAtual;

    salvarEstadoHistorico();

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
}

function ativarBorracha(el) {
    if (somClique.src) somClique.play().catch(()=>{});
    ferramentaAtual = 'borracha';
    document.querySelectorAll('.lapis-btn').forEach(b => b.classList.remove('ativo'));
    document.getElementById('btnBalde').classList.remove('ativo');
    document.getElementById('btnMenuGrossura').classList.remove('ativo');
    if (el) el.classList.add('ativo');
}

function ativarBalde(el) {
    if (somClique.src) somClique.play().catch(()=>{});
    ferramentaAtual = 'balde';
    document.querySelectorAll('.lapis-btn').forEach(b => b.classList.remove('ativo'));
    document.getElementById('btnBorracha').classList.remove('ativo');
    document.getElementById('btnMenuGrossura').classList.remove('ativo');
    if (el) el.classList.add('ativo');
}

// ============================================================
// ALGORITMO DE PREENCHIMENTO POR INUNDAÇÃO (FLOOD FILL)
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
                        <button class="btn-final-roxo" onclick="iniciarJogoDesenho()">Desenhar Outro</button>
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

// Iniciar a capa diretamente
mostrarCapa();
