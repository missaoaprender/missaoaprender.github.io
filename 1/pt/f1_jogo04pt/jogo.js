// ==========================================
// 1. ESTADO GLOBAL E SONS
// ==========================================
let jogoAtivo = false;
let rondaAtual = 1, totalRondas = 10, certos = 0, erros = 0, ajudasUsadas = 0;
let letraAlvo = "";
let audioInstrucao = null;
let toupeirasTimers = [];

const somAcerto = new Audio(DADOS.sons.certo);
const somErro = new Audio(DADOS.sons.errado);

// ==========================================
// 2. CONFIGURAÇÃO VISUAL (CSS INJETADO)
// ==========================================
const styleJogo = document.createElement('style');
styleJogo.innerHTML = `
    .toupeira-area-geral {
        display: flex; flex-direction: column; align-items: center; justify-content: center;
        width: 100%; max-width: 650px; margin: 0 auto; height: 100%;
        transition: background-color 0.3s ease; border-radius: 20px; padding: 10px;
    }
    .painel-alvo {
        display: flex; align-items: center; gap: 15px; background: #FFFFFF;
        padding: 8px 25px; border-radius: 20px; border: 3px solid #B4E4F8;
        box-shadow: 0 4px 10px rgba(15,139,211,0.15); margin-bottom: 15px;
    }
    .alvo-letra {
        font-size: 2.2rem; font-weight: 900; color: #0F8BD3;
        background: #DEF3FF; width: 55px; height: 55px; display: flex;
        align-items: center; justify-content: center; border-radius: 50%;
        box-shadow: inset 0 2px 4px rgba(0,0,0,0.1);
    }
    .grelha-toupeiras {
        display: grid; grid-template-columns: repeat(3, 1fr); gap: 15px;
        width: 100%; max-width: 480px; padding: 10px;
    }
    .buraco {
        position: relative; height: 95px; background: #c2e2f5;
        border-radius: 50% / 30%; border: 4px solid #8ac7e8;
        display: flex; align-items: flex-end; justify-content: center;
        overflow: hidden; box-shadow: inset 0 10px 15px rgba(0,0,0,0.15);
    }
    .toupeira {
        position: absolute; bottom: -70px; width: 75px; height: 75px;
        background: #8B5A2B; border-radius: 50% 50% 10% 10%; border: 3px solid #5c3a1b;
        display: flex; align-items: center; justify-content: center;
        font-size: 2rem; font-weight: 900; color: #FFFFFF; cursor: pointer;
        box-shadow: 0 -4px 8px rgba(0,0,0,0.2); transition: bottom 0.25s ease-in-out;
        user-select: none;
    }
    .toupeira.ativa { bottom: 10px; }
    .toupeira:active { transform: scale(0.92); }

    .btn-play-rect { 
        flex: 1; height: 50px; border-radius: 25px; background: #FFFFFF; color: #0F8BD3; 
        border: none; font-size: 1.2rem; font-weight: 900; text-transform: uppercase; 
        cursor: pointer; display: flex; align-items: center; justify-content: center; 
        gap: 10px; box-shadow: 0 4px 10px rgba(0,0,0,0.15); transition: 0.2s; z-index: 100; 
    }
    .btn-play-rect:active { transform: scale(0.95); }

    .btn-audio-circle { 
        width: 50px; height: 50px; cursor: pointer; flex-shrink: 0; z-index: 100; 
        border-radius: 50%; background: rgba(0,0,0,0.15); display: flex; align-items: center; justify-content: center; 
        border: none; padding: 0;
    }
    .btn-audio-circle img { width: 26px; height: 26px; object-fit: contain; pointer-events: none; }

    .botao-acao-jogo {
        width: 38px; height: 38px; min-width: 38px; min-height: 38px; border-radius: 50%; border: none;
        background: rgba(0,0,0,0.2); color: #FFFFFF; font-size: 16px;
        display: flex; align-items: center; justify-content: center; cursor: pointer; transition: transform 0.1s ease;
        padding: 0; flex-shrink: 0;
    }
    .botao-acao-jogo:active { transform: scale(0.92); }
    .botao-acao-jogo img { width: 22px; height: 22px; object-fit: contain; pointer-events: none; }
    .botao-acao-jogo:disabled { opacity: 0.4; cursor: not-allowed; transform: none; filter: grayscale(1); }

    .wrapper-progresso-completo {
        flex: 1; display: flex; align-items: center; gap: 12px; margin: 0 15px; width: 100%; min-width: 0;
    }
    .container-progresso-jogo {
        flex: 1; width: 100%; height: 16px; background: rgba(0,0,0,0.15);
        border-radius: 10px; overflow: hidden; position: relative; min-width: 40px;
    }
    .barra-progresso-interna { width: 0%; height: 100%; background: #FFB400; border-radius: 10px; transition: width 0.3s ease; }
    .contador-rondas { background: rgba(0,0,0,0.15); color: #FFFFFF; padding: 5px 12px; border-radius: 10px; font-weight: 900; font-size: 14px; white-space: nowrap; flex-shrink: 0; }
    .bloco-estrelas-pontos { display: flex; align-items: center; gap: 6px; background: rgba(0,0,0,0.15); padding: 5px 12px; border-radius: 20px; color: #FFFFFF; font-weight: 900; font-size: 16px; }

    .ecra-feedback-container {
        display: flex; flex-direction: column; align-items: center; justify-content: center;
        height: 100%; color: #062B42; text-align: center; padding: 15px;
        background: linear-gradient(135deg, #ffffff 0%, #E1F2FA 100%);
        border-radius: 20px; box-shadow: inset 0 2px 8px rgba(15,139,211,0.1);
    }
    .ecra-feedback-imagem { width: 180px; height: 180px; object-fit: contain; margin-bottom: 12px; filter: drop-shadow(0 8px 16px rgba(0,0,0,0.22)); }
    .ecra-feedback-estrelas { font-size: 1.8rem; margin-bottom: 15px; letter-spacing: 4px; }

    .container-botoes-feedback {
        display: flex; gap: 15px; flex-wrap: wrap; justify-content: center; margin-top: 5px;
    }
    .btn-feedback {
        width: 190px; height: 50px; border-radius: 25px; border: none; font-weight: 900; 
        font-size: 1.05rem; cursor: pointer; display: flex; align-items: center; justify-content: center;
        transition: transform 0.1s ease, box-shadow 0.2s ease;
        box-shadow: 0 4px 12px rgba(15,139,211,0.25);
    }
    .btn-feedback-primario { background: #0F8BD3; color: #ffffff; }
    .btn-feedback-secundario { background: #FFFFFF; color: #0F8BD3; border: 2px solid #0F8BD3; }
    .btn-feedback:active { transform: scale(0.95); }
`;
document.head.appendChild(styleJogo);

// ==========================================
// 3. BARRA DE ESTADO DINÂMICA
// ==========================================
function atualizarBarraEstado(modoCapa = false) {
    const barra = document.getElementById('barra-inferior');
    if (!barra) return;

    const iconeSomPath = DADOS.icons.som;
    const iconeLampadaPath = DADOS.icons.lampada;

    if (modoCapa) {
        barra.innerHTML = `
            <button class="btn-audio-circle" onclick="tocarAudioInstrucoes()" aria-label="Som">
              <img src="${iconeSomPath}" alt="Som">
            </button>
            <button class="btn-play-rect" onclick="iniciarJogo()">JOGAR</button>
        `;
    } else {
        const progressoPercent = ((rondaAtual - 1) / totalRondas) * 100;
        const ajudaDesativada = ajudasUsadas >= 2 ? 'disabled' : '';
        barra.innerHTML = `
          <div class="bloco-estrelas-pontos">
            <span>⭐</span>
            <span id="pontos-jogo">${certos}</span>
          </div>
          <div class="wrapper-progresso-completo">
            <div class="container-progresso-jogo">
                <div class="barra-progresso-interna" style="width: ${progressoPercent}%"></div>
            </div>
            <div class="contador-rondas">${rondaAtual}/${totalRondas}</div>
          </div>
          <div style="display: flex; align-items: center; gap: 8px;">
            <button class="botao-acao-jogo" onclick="tocarAudioInstrucoes()" aria-label="Som">
              <img src="${iconeSomPath}" alt="Som">
            </button>
            <button class="botao-acao-jogo" onclick="darAjuda()" aria-label="Ajuda" ${ajudaDesativada}>
              <img src="${iconeLampadaPath}" alt="Ajuda">
            </button>
          </div>
        `;
    }
}

// ==========================================
// 4. CAPA E ÁUDIO DE INSTRUÇÃO
// ==========================================
function tocarAudioInstrucoes() {
    if (window.speechSynthesis) window.speechSynthesis.cancel();
    if (audioInstrucao) { audioInstrucao.pause(); audioInstrucao.currentTime = 0; }
    else { audioInstrucao = new Audio("../../../sons/f1_jogo03.mp3"); }
    
    audioInstrucao.play().catch(() => {
        const utter = new SpeechSynthesisUtterance("Clica na toupeira que tem a letra correta que aparece no topo!");
        utter.lang = 'pt-PT'; window.speechSynthesis.speak(utter);
    });
}

function carregarCapaJogo() {
    if (jogoAtivo) return;
    const contentor = document.getElementById('contentor-jogo');
    if (!contentor) return;

    contentor.innerHTML = `
        <div style="display:flex; flex-direction:column; align-items:center; justify-content:center; width:100%; height:100%;">
            <div style="font-size: 3.5rem; margin-bottom: 10px;">🐹🔨</div>
            <p style="color:#062B42; font-weight:800; text-align:center; font-size:1.1rem; max-width: 500px; margin: 0 0 10px 0;">
                Apanha a toupeira certa! Clica na toupeira que tem a letra pedida.
            </p>
        </div>
    `;

    atualizarBarraEstado(true);
}

// ==========================================
// 5. LÓGICA DO JOGO PRINCIPAL
// ==========================================
function limparTimersToupeiras() {
    toupeirasTimers.forEach(t => clearTimeout(t));
    toupeirasTimers = [];
}

function iniciarJogo() {
    limparTimersToupeiras();
    jogoAtivo = true; rondaAtual = 1; certos = 0; erros = 0; ajudasUsadas = 0; totalRondas = 10;
    proximaRonda();
}

function proximaRonda() {
    if (rondaAtual > totalRondas) { finalizarJogo(); return; }
    limparTimersToupeiras();

    const alfabeto = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");
    let letrasEmbaralhadas = [...alfabeto].sort(() => Math.random() - 0.5);
    letraAlvo = letrasEmbaralhadas[0];

    // Escolher 6 letras diferentes para os 6 buracos, garantindo que a letra alvo está incluída
    let letrasBuracos = [letraAlvo];
    while (letrasBuracos.length < 6) {
        let l = letrasEmbaralhadas[Math.random() * letrasEmbaralhadas.length | 0];
        if (!letrasBuracos.includes(l)) letrasBuracos.push(l);
    }
    letrasBuracos.sort(() => Math.random() - 0.5);

    const contentor = document.getElementById('contentor-jogo');
    contentor.innerHTML = `
        <div class="toupeira-area-geral" id="area-toupeiras">
            <div class="painel-alvo">
                <span style="font-weight:900; color:#062B42; font-size:1.1rem;">Procura a letra:</span>
                <div class="alvo-letra">${letraAlvo}</div>
            </div>
            <div class="grelha-toupeiras">
                ${letrasBuracos.map((letra, index) => `
                    <div class="buraco">
                        <div class="toupeira" id="toupeira-${index}" onclick="clicarToupeira('${letra}', this)">${letra}</div>
                    </div>
                `).join('')}
            </div>
        </div>
    `;

    atualizarBarraEstado(false);
    iniciarCicloToupeiras();
}

function iniciarCicloToupeiras() {
    if (!jogoAtivo) return;

    function rodadaToupeiras() {
        if (!jogoAtivo) return;

        // Escolher aleatoriamente 1 ou 2 buracos para subir
        const indices = [0, 1, 2, 3, 4, 5].sort(() => Math.random() - 0.5);
        const quantos = Math.random() > 0.5 ? 2 : 1;

        for (let i = 0; i < quantos; i++) {
            const idx = indices[i];
            const toupeiraEl = document.getElementById(`toupeira-${idx}`);
            if (toupeiraEl && !toupeiraEl.classList.contains('ativa')) {
                toupeiraEl.classList.add('ativa');

                // Descer passado 1.5 segundos
                const timerDescer = setTimeout(() => {
                    if (toupeiraEl) toupeiraEl.classList.remove('ativa');
                }, 1500);
                toupeirasTimers.push(timerDescer);
            }
        }

        const proximoCiclo = setTimeout(rodadaToupeiras, 2000);
        toupeirasTimers.push(proximoCiclo);
    }

    rodadaToupeiras();
}

function clicarToupeira(letraClicada, elemento) {
    if (!jogoAtivo) return;
    const areaGeral = document.getElementById('area-toupeiras');

    if (letraClicada === letraAlvo) {
        // ACERTOU
        jogoAtivo = false;
        limparTimersToupeiras();
        certos++;
        somAcerto.currentTime = 0; somAcerto.play().catch(() => {});

        if (areaGeral) {
            areaGeral.style.backgroundColor = "#e8f8ec";
        }
        if (elemento) {
            elemento.style.background = "#8cc63f";
        }

        setTimeout(() => {
            rondaAtual++;
            jogoAtivo = true;
            proximaRonda();
        }, 1200);

    } else {
        // ERROU
        erros++;
        certos = Math.max(0, certos - 1); // Desconta logo uma estrela
        somErro.currentTime = 0; somErro.play().catch(() => {});

        if (areaGeral) {
            areaGeral.style.backgroundColor = "#fde8e8";
            setTimeout(() => { if (areaGeral) areaGeral.style.backgroundColor = "transparent"; }, 500);
        }

        if (elemento) {
            elemento.classList.remove('ativa');
        }
        atualizarBarraEstado(false);
    }
}

function darAjuda() {
    if (!jogoAtivo || ajudasUsadas >= 2) return;
    ajudasUsadas++;
    certos = Math.max(0, certos - 1);
    atualizarBarraEstado(false);

    // Faz a toupeira correta subir e piscar para ajudar
    for (let i = 0; i < 6; i++) {
        const t = document.getElementById(`toupeira-${i}`);
        if (t && t.innerText === letraAlvo) {
            t.classList.add('ativa');
            t.style.background = "#FFB400";
            setTimeout(() => {
                t.classList.remove('ativa');
                t.style.background = "#8B5A2B";
            }, 1200);
            break;
        }
    }
}

function finalizarJogo() {
    jogoAtivo = false;
    limparTimersToupeiras();
    if (audioInstrucao) audioInstrucao.pause();

    let imagemFeedback = DADOS.icons.feedbacks.feedback4;
    if (certos >= 9) imagemFeedback = DADOS.icons.feedbacks.feedback1;
    else if (certos >= 7) imagemFeedback = DADOS.icons.feedbacks.feedback2;
    else if (certos >= 5) imagemFeedback = DADOS.icons.feedbacks.feedback3;

    if (certos <= 4) {
        somErro.currentTime = 0; somErro.play().catch(() => {});
    } else {
        somAcerto.currentTime = 0; somAcerto.play().catch(() => {});
    }

    let estrelasHtml = "";
    for (let i = 0; i < Math.min(certos, 10); i++) { estrelasHtml += "⭐ "; }
    if (estrelasHtml === "") estrelasHtml = "💪 Continua a treinar!";

    const contentor = document.getElementById('contentor-jogo');
    contentor.innerHTML = `
      <div class="ecra-feedback-container">
        <img src="${imagemFeedback}" alt="Feedback" class="ecra-feedback-imagem">
        <div class="ecra-feedback-estrelas">${estrelasHtml}</div>
        <div class="container-botoes-feedback">
            <button onclick="iniciarJogo()" class="btn-feedback btn-feedback-primario">Jogar de novo</button>
            <button onclick="window.location.href='../'" class="btn-feedback btn-feedback-secundario">Outro jogo</button>
        </div>
      </div>
    `;
    const barra = document.getElementById('barra-inferior');
    if (barra) barra.innerHTML = '';
}

// Iniciar a capa do jogo
carregarCapaJogo();
