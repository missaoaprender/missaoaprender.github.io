// ============================================================
// 1. ESTADO GLOBAL E SONS (Lidos de DADOS)
// ============================================================
const JOGO_CONFIG = {
    nomeDoJogo: DADOS.animacaoCapa ? DADOS.animacaoCapa.titulo : "Pixel Art Criativo",
    caminhoSons: DADOS.sons ? DADOS.sons.caminho : "",
    caminhoIconsMenu: "../../icons/"
};

let corAtualPixel = "#8B4513"; 
let tamanhoGrelha = 8; 
let matrizJogador = [];
let indiceDesenhoPixelAtual = 0;
let aVerificar = false; // Evita cliques duplos durante a animação de verificação

const somAcerto = new Audio(DADOS.sons && DADOS.sons.certo ? DADOS.sons.certo : "");
const somErrado = new Audio(DADOS.sons && DADOS.sons.errado ? DADOS.sons.errado : "");
const somClique = new Audio(DADOS.sons && DADOS.sons.clique ? DADOS.sons.clique : "");
const somInstrucao = new Audio(DADOS.sons && DADOS.sons.instrucao ? DADOS.sons.instrucao : "f1_jogo01pre.mp3");


// ============================================================
// 2. CONFIGURAÇÃO VISUAL (CSS)
// ============================================================
const style = document.createElement('style');
style.innerHTML = `
    .pixel-container {
        display: flex; flex-direction: row; align-items: stretch; justify-content: space-between;
        width: 100%; height: 100%; flex: 1; gap: 16px; animation: cardPop 0.35s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards; padding: 4px 0;
    }
    @keyframes cardPop { 0% { transform: scale(0.85); opacity: 0; } 100% { transform: scale(1); opacity: 1; } }

    .grelha-wrapper {
        background: white; border: 3px solid #E2D3AB; border-radius: 16px;
        box-shadow: 0 4px 15px rgba(0,0,0,0.06); padding: 16px;
        flex: 3.5; display: flex; align-items: center; justify-content: center; overflow: hidden;
    }

    .matriz-pixels {
        display: grid;
        grid-template-columns: repeat(8, 1fr);
        grid-template-rows: repeat(8, 1fr);
        width: 100%; max-width: 440px; aspect-ratio: 1;
        border: 3px solid #262638; background: #fff;
        border-radius: 10px; overflow: hidden; box-shadow: 0 6px 16px rgba(0,0,0,0.1);
    }

    .pixel-celula {
        background: #FFFFFF; border: 1.5px solid #C0C0C0; cursor: pointer;
        transition: background 0.2s ease, transform 0.15s ease;
    }
    .pixel-celula:hover { opacity: 0.85; }
    
    @keyframes pixelErroAnim {
        0% { transform: scale(1); background-color: #FF8888; }
        50% { transform: scale(0.85); }
        100% { transform: scale(1); background-color: #FFFFFF; }
    }
    .pixel-erro {
        animation: pixelErroAnim 0.4s ease-out forwards;
    }

    .painel-estojo-pixel {
        display: flex; flex-direction: column; align-items: center; justify-content: space-between; gap: 8px; flex: 1; max-width: 220px; background: rgba(255,255,255,0.95); padding: 10px; border-radius: 16px; border: 2px solid #E2D3AB; flex-shrink: 0;
        box-shadow: 0 4px 15px rgba(0,0,0,0.04);
    }

    .painel-cores-box {
        width: 100%; background: #FFFDF7; border: 2px solid #E2D3AB; border-radius: 12px; padding: 8px; display: flex; flex-direction: column; align-items: center; gap: 6px;
    }
    .titulo-cores {
        font-size: 0.7rem; font-weight: 900; color: #C2890B; letter-spacing: 1px; text-transform: uppercase; margin: 0;
    }

    .grid-cores-pixel {
        display: flex; flex-direction: column; gap: 6px; width: 100%; align-items: center;
    }
    .cor-palete-btn {
        width: 100%; height: 32px; border-radius: 8px; border: 2.5px solid white; cursor: pointer;
        box-shadow: 0 2px 5px rgba(0,0,0,0.12); transition: transform 0.2s ease, border-color 0.2s ease;
    }
    .cor-palete-btn:hover { transform: scale(1.05); }
    .cor-palete-btn.ativo { transform: scale(1.08); border-color: #262638; box-shadow: 0 4px 10px rgba(0,0,0,0.25); }

    /* Miniatura de Referencia */
    .referencia-box {
        width: 100%; background: white; border: 2px solid #E2D3AB; border-radius: 12px; padding: 8px; display: flex; flex-direction: column; align-items: center; gap: 4px;
    }
    .referencia-grid {
        display: grid; grid-template-columns: repeat(8, 1fr); grid-template-rows: repeat(8, 1fr);
        width: 110px; aspect-ratio: 1; border: 2px solid #262638; border-radius: 6px; overflow: hidden;
    }
    .ref-celula { width: 100%; height: 100%; border: 0.5px solid rgba(0,0,0,0.15); }

    /* Molduras da Capa */
    .seletor-capa-container {
        display: flex; align-items: center; gap: 16px; justify-content: center; width: 100%; max-width: 900px; margin-top: 10px; padding: 0 10px;
    }
    .btn-seta-capa {
        background: #ECA607; color: white; border: none; width: 44px; height: 44px; border-radius: 50%; display: flex; align-items: center; justify-content: center; cursor: pointer; font-size: 1.1rem; box-shadow: 0 4px 10px rgba(0,0,0,0.15); transition: transform 0.2s ease; flex-shrink: 0;
    }
    .btn-seta-capa:hover { transform: scale(1.1); }
    .btn-seta-capa:active { transform: scale(0.92); }

    .galeria-capa-modelos {
        display: flex; align-items: center; justify-content: center; gap: 16px; flex-wrap: nowrap; overflow: hidden; padding: 10px 4px;
    }

    .cartao-modelo-capa {
        background: white; border: 3px solid #E2D3AB; border-radius: 18px; padding: 10px; display: flex; flex-direction: column; align-items: center; justify-content: center; cursor: pointer; transition: transform 0.25s ease, border-color 0.25s ease, box-shadow 0.25s ease;
        box-shadow: 0 6px 15px rgba(0,0,0,0.06); width: 150px; flex-shrink: 0;
    }
    .cartao-modelo-capa:hover { transform: translateY(-4px) scale(1.04); border-color: #ECA607; }
    .cartao-modelo-capa.selecionado {
        border: 4px solid #ECA607; box-shadow: 0 8px 24px rgba(236,166,7,0.35); transform: scale(1.08); background: #FFFDF5;
    }

    .grelha-capa-miniatura {
        display: grid; grid-template-columns: repeat(8, 1fr); grid-template-rows: repeat(8, 1fr);
        width: 120px; aspect-ratio: 1; border: 2px solid #262638; border-radius: 8px; overflow: hidden; pointer-events: none;
    }

    @media (max-width: 600px) {
        .cartao-modelo-capa { display: none; }
        .cartao-modelo-capa.selecionado { display: flex; width: 170px; }
        .grelha-capa-miniatura { width: 140px; }
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

    .btn-menu-topo {
        height: 44px; background: white; color: #C2890B; border: 2px solid #E2D3AB;
        padding: 0 20px; border-radius: 22px; font-weight: 900; font-size: 0.85rem;
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
        width: 100%; height: 14px; background: #ECA607; border-radius: 7px; flex-shrink: 0; box-shadow: inset 0 2px 4px rgba(0,0,0,0.1);
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
        box-shadow: 0 6px 18px rgba(236,166,7,0.35); text-transform: capitalize; transition: transform 0.2s ease; white-space: nowrap; flex: 1; text-align: center;
    }
    .btn-final-branco {
        background: white; color: #C2890B; border: 2px solid #ECA607; padding: 14px 22px;
        border-radius: 25px; font-weight: 900; font-size: 1rem; cursor: pointer;
        box-shadow: 0 6px 15px rgba(0,0,0,0.08); text-transform: capitalize; transition: transform 0.2s ease; white-space: nowrap; flex: 1; text-align: center;
    }
    .btn-final-roxo:hover, .btn-final-branco:hover { transform: translateY(-3px) scale(1.03); }

    @media (max-width: 768px) {
        .pixel-container { flex-direction: column; }
        .painel-estojo-pixel { max-width: 100%; width: 100%; flex-direction: row; flex-wrap: wrap; justify-content: center; }
        .grid-cores-pixel { flex-direction: row; flex-wrap: wrap; justify-content: center; }
    }
`;
document.head.appendChild(style);


// ============================================================
// 3. CAPA COM GALERIA DE GRELHAS PIXEL ART
// ============================================================
function mostrarCapa() {
    aVerificar = false;
    const feedbackEl = document.getElementById('round-feedback');
    if (feedbackEl) feedbackEl.style.display = 'none';

    if(!document.getElementById('round-feedback')) {
        const feedback = document.createElement('div');
        feedback.id = 'round-feedback';
        document.querySelector('.botao-ano').appendChild(feedback);
    }

    const slotTopo = document.getElementById('slot-topo');
    if (slotTopo) {
        slotTopo.className = "barrita-fundo-cartao";
        slotTopo.innerHTML = "";
    }

    renderizarCapaComMolduras();

    const slotFundo = document.getElementById('slot-fundo');
    if (slotFundo) {
        slotFundo.className = "barra-jogo-topo";
        slotFundo.innerHTML = `
            <div class="btn-capa-som" onclick="tocarSomInstrucao()"><img src="${DADOS.icons.som}" alt="Som"></div>
            <button class="btn-capa-jogar" onclick="iniciarJogoPixel()">COMEÇAR</button>
        `;
    }
}

function mudarDesenhoPixel(direcao) {
    if (somClique.src) somClique.play().catch(()=>{});
    const lista = DADOS.pixelArtModelos || [];
    if (lista.length === 0) return;

    indiceDesenhoPixelAtual += direcao;
    if (indiceDesenhoPixelAtual < 0) indiceDesenhoPixelAtual = lista.length - 1;
    if (indiceDesenhoPixelAtual >= lista.length) indiceDesenhoPixelAtual = 0;

    renderizarCapaComMolduras();
}

function selecionarModeloPelaCapa(index) {
    if (somClique.src) somClique.play().catch(()=>{});
    indiceDesenhoPixelAtual = index;
    iniciarJogoPixel();
}

function renderizarCapaComMolduras() {
    const lista = DADOS.pixelArtModelos || [];
    const tituloAnimacao = DADOS.animacaoCapa ? DADOS.animacaoCapa.titulo : "Pixel Art";

    let cartoesHtml = '';
    const total = lista.length;

    if (total > 0) {
        let indicesParaMostrar = [indiceDesenhoPixelAtual];
        if (total > 1) {
            for (let i = 1; i < Math.min(4, total); i++) {
                indicesParaMostrar.push((indiceDesenhoPixelAtual + i) % total);
            }
        }

        indicesParaMostrar.forEach((idx) => {
            const m = lista[idx];
            const estaSelecionado = idx === indiceDesenhoPixelAtual ? 'selecionado' : '';

            let grelhaMinHtml = '';
            for (let p = 0; p < (tamanhoGrelha * tamanhoGrelha); p++) {
                const corPixel = (m.matrizAlvo && m.matrizAlvo[p]) ? m.matrizAlvo[p] : "#FFFFFF";
                grelhaMinHtml += `<div class="ref-celula" style="background-color: ${corPixel};"></div>`;
            }

            cartoesHtml += `
                <div class="cartao-modelo-capa ${estaSelecionado}" onclick="selecionarModeloPelaCapa(${idx})" title="Pintar ${m.nome || ''}">
                    <div class="grelha-capa-miniatura">
                        ${grelhaMinHtml}
                    </div>
                </div>
            `;
        });
    }

    const area = document.getElementById('contentor-jogo');
    if (area) {
        area.innerHTML = `
            <div style="font-size: 1.3rem; font-weight: 900; color: #C2890B; margin-bottom: 4px; text-transform: uppercase;">${tituloAnimacao}</div>
            
            <div class="seletor-capa-container">
                <button class="btn-seta-capa" onclick="mudarDesenhoPixel(-1)"><i class="fas fa-chevron-left"></i></button>
                
                <div class="galeria-capa-modelos">
                    ${cartoesHtml}
                </div>

                <button class="btn-seta-capa" onclick="mudarDesenhoPixel(1)"><i class="fas fa-chevron-right"></i></button>
            </div>
        `;
    }
}

function tocarSomInstrucao() {
    if (somClique.src) somClique.play().catch(()=>{});
    somInstrucao.currentTime = 0;
    somInstrucao.play().catch(()=>{});
}


// ============================================================
// 4. LÓGICA DO JOGO COM VERIFICAÇÃO LENTA E LINHA A LINHA
// ============================================================
function iniciarJogoPixel() {
    if (somClique.src) somClique.play().catch(()=>{});
    aVerificar = false;
    
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

    matrizJogador = Array(tamanhoGrelha * tamanhoGrelha).fill("#FFFFFF");

    const modeloAtual = (DADOS.pixelArtModelos && DADOS.pixelArtModelos[indiceDesenhoPixelAtual]) ? DADOS.pixelArtModelos[indiceDesenhoPixelAtual] : {
        paleta: ["#8B4513", "#FFDAB9", "#333333", "#FFA500", "#FFFFFF"],
        matrizAlvo: Array(64).fill("#FFFFFF")
    };

    corAtualPixel = modeloAtual.paleta[0] || "#000000";

    let paletaHtml = '';
    modeloAtual.paleta.forEach((cor, index) => {
        const ativoClass = index === 0 ? 'ativo' : '';
        paletaHtml += `<div class="cor-palete-btn ${ativoClass}" style="background-color: ${cor};" onclick="selecionarCorPixel('${cor}', this)"></div>`;
    });

    let refHtml = '';
    for (let i = 0; i < (tamanhoGrelha * tamanhoGrelha); i++) {
        const corRef = (modeloAtual.matrizAlvo && modeloAtual.matrizAlvo[i]) ? modeloAtual.matrizAlvo[i] : "#FFFFFF";
        refHtml += `<div class="ref-celula" style="background-color: ${corRef};"></div>`;
    }

    let grelhaHtml = '';
    for (let i = 0; i < (tamanhoGrelha * tamanhoGrelha); i++) {
        grelhaHtml += `<div class="pixel-celula" id="pixel-${i}" onclick="pintarPixel(${i})"></div>`;
    }

    if (area) {
        area.innerHTML = `
            <div class="pixel-container">
                <div class="grelha-wrapper">
                    <div class="matriz-pixels" id="matrizJogador">
                        ${grelhaHtml}
                    </div>
                </div>

                <div class="painel-estojo-pixel">
                    <div class="painel-cores-box">
                        <span class="titulo-cores">Paleta</span>
                        <div class="grid-cores-pixel">
                            ${paletaHtml}
                        </div>
                    </div>

                    <div class="referencia-box">
                        <div class="referencia-grid">
                            ${refHtml}
                        </div>
                    </div>

                    <button class="btn-ferramenta-texto" onclick="verificarPixelArt()"><i class="fas fa-check"></i> Verifique</button>
                </div>
            </div>
        `;
    }

    if (slotFundo) {
        slotFundo.className = "barrita-fundo-cartao";
        slotFundo.innerHTML = "";
    }
}

function selecionarCorPixel(cor, el) {
    if (somClique.src) somClique.play().catch(()=>{});
    corAtualPixel = cor;
    document.querySelectorAll('.cor-palete-btn').forEach(b => b.classList.remove('ativo'));
    if (el) el.classList.add('ativo');
}

function pintarPixel(index) {
    if (aVerificar) return; // Bloqueia cliques enquanto está a animar a verificação
    if (somClique.src) somClique.play().catch(()=>{});
    matrizJogador[index] = corAtualPixel;
    const celula = document.getElementById(`pixel-${index}`);
    if (celula) {
        celula.style.backgroundColor = corAtualPixel;
        celula.classList.remove('pixel-erro');
    }
}

// Verificação Lenta e Linha a Linha
function verificarPixelArt() {
    if (aVerificar) return;
    const modeloAtual = (DADOS.pixelArtModelos && DADOS.pixelArtModelos[indiceDesenhoPixelAtual]) ? DADOS.pixelArtModelos[indiceDesenhoPixelAtual] : null;
    
    if (!modeloAtual || !modeloAtual.matrizAlvo) {
        exibirVitoria();
        return;
    }

    aVerificar = true;
    let temErrosTotal = false;
    let linhaAtual = 0;

    // Função auxiliar para verificar cada linha de forma progressiva e lenta
    function verificarProximaLinha() {
        if (linhaAtual >= tamanhoGrelha) {
            aVerificar = false;
            if (temErrosTotal) {
                if (somErrado.src) somErrado.play().catch(()=>{});
            } else {
                if (somAcerto.src) somAcerto.play().catch(()=>{});
                exibirVitoria();
            }
            return;
        }

        let erroNaLinha = false;
        const inicio = linhaAtual * tamanhoGrelha;
        const fim = inicio + tamanhoGrelha;

        // Verificar todos os píxeis da linha atual
        for (let i = inicio; i < fim; i++) {
            const corEsperada = modeloAtual.matrizAlvo[i] ? modeloAtual.matrizAlvo[i].toUpperCase() : "#FFFFFF";
            const corPintada = matrizJogador[i] ? matrizJogador[i].toUpperCase() : "#FFFFFF";

            if (corPintada !== corEsperada) {
                erroNaLinha = true;
                temErrosTotal = true;
                matrizJogador[i] = "#FFFFFF";

                const celula = document.getElementById(`pixel-${i}`);
                if (celula) {
                    celula.classList.add('pixel-erro');
                    setTimeout(() => {
                        celula.style.backgroundColor = "#FFFFFF";
                        celula.classList.remove('pixel-erro');
                    }, 350);
                }
            }
        }

        linhaAtual++;
        // Pausa lenta de 180ms entre cada linha para dar o efeito progressivo
        setTimeout(verificarProximaLinha, 180);
    }

    verificarProximaLinha();
}

function exibirVitoria() {
    const overlay = document.getElementById('round-feedback');
    const iconeFeedback = DADOS.icons.feedbacks.feedback1;

    if (overlay) {
        overlay.style.display = 'flex';
        overlay.innerHTML = `
            <div style="width: 100%; display: flex; justify-content: center; align-items: center; flex: 1;">
                <div class="vitoria-card">
                    <img src="${iconeFeedback}" style="width:170px; height:170px; object-fit:contain; filter: drop-shadow(0 6px 12px rgba(0,0,0,0.15));">
                    <h1 style="color:#C2890B; font-size:1.5rem; font-weight:900; margin:0; text-transform:uppercase;">EXCELENTE PIXEL ART!</h1>
                    <p style="color:#555; font-weight:800; margin:0; font-size:0.85rem;">Criaste uma obra de arte incrível!</p>
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
