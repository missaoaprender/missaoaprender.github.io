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
        display: flex; align-items: center; gap: 12px; background: #FFFFFF;
        padding: 6px 20px; border-radius: 20px; border: 3px solid #B4E4F8;
        box-shadow: 0 4px 10px rgba(15,139,211,0.15); margin-bottom: 10px;
    }
    .alvo-letra {
        font-size: 2.2rem; font-weight: 900; color: #0F8BD3;
        background: #DEF3FF; width: 52px; height: 52px; display: flex;
        align-items: center; justify-content: center; border-radius: 50%;
        box-shadow: inset 0 2px 4px rgba(0,0,0,0.1);
    }
    .grelha-toupeiras {
        display: grid; grid-template-columns: repeat(3, 1fr); gap: 15px;
        width: 100%; max-width: 480px; padding: 10px;
    }
    .buraco {
        position: relative; height: 90px; background: #c2e2f5;
        border-radius: 50% / 30%; border: 4px solid #8ac7e8;
        display: flex; align-items: flex-end; justify-content: center;
        overflow: hidden; box-shadow: inset 0 10px 15px rgba(0,0,0,0.15);
    }
    .toupeira {
        position: absolute; bottom: -75px; width: 75px; height: 75px;
        background: #8B5A2B; border-radius: 50% 50% 10% 10%; border: 3px solid #5c3a1b;
        display: flex; align-items: center; justify-content: center;
        font-size: 2rem; font-weight: 900; color: #FFFFFF; cursor: pointer;
        box-shadow: 0 -4px 8px rgba(0,0,0,0.2); transition: bottom 0.25s ease-in-out, background-color 0.2s ease, border-color 0.2s ease;
        user-select: none;
    }
    .toupeira.ativa { bottom: 8px; }
    .toupeira.certa { background: #8cc63f !important; border-color: #649924 !important; color: #FFFFFF !important; }
    .toupeira.errada { background: #e74c3c !important; border-color: #c0392b !important; color: #FFFFFF !important; }
    .toupeira:active { transform: scale(0.92); }

    /* LAYOUT DA BARRA DA CAPA IGUAL À IMAGEM */
    .barra-capa-layout {
        width: 100%; display: flex; align-items: center; justify-content: space-between; position: relative;
    }

    .btn-play-rect-capa { 
        height: 48px; padding: 0 38px; border-radius: 24px; background: #FFFFFF; color: #0F8BD3; 
        border: none; font-size: 1.25rem; font-weight: 900; text-transform: uppercase; 
        cursor: pointer; display: flex; align-items: center; justify-content: center; 
        box-shadow: 0 4px 10px rgba(0,0,0,0.12); transition: transform 0.1s ease, background-color 0.2s ease; 
        margin-left: auto;
    }
    .btn-play-rect-capa:active { transform: scale(0.95); }

    .btn-audio-circle { 
        width: 44px; height: 44px; cursor: pointer; flex-shrink: 0; z-index: 100; 
        border-radius: 50%; background: rgba(0,0,0,0.15); display: flex; align-items: center; justify-content: center; 
        border: none; padding: 0; transition: transform 0.1s ease;
    }
    .btn-audio-circle:active { transform: scale(0.92); }
    .btn-audio-circle img { width: 24px; height: 24px; object-fit: contain; pointer-events: none; }

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
            <div class="barra-capa-layout">
                <button class="btn-audio-circle" onclick="tocarAudioInstrucoes()" aria-label="Som">
                  <img src="${iconeSomPath}" alt="Som">
                </button>
                <button class="btn-play-rect-capa" onclick="iniciarJogo()">JOGAR</button>
            </div>
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
// 4. CAPA E SIMULAÇÃO ANIMADA REAL
// ==========================================
function tocarAudioInstrucoes() {
    if (window.speechSynthesis) window.speechSynthesis.cancel();
    if (audioInstrucao) { audioInstrucao.pause(); audioInstrucao.currentTime = 0; }
    else { audioInstrucao = new Audio("../../../sons/f1_jogo04pt.mp3"); }
    
    audioInstrucao.play().catch(() => {
        const utter = new SpeechSynthesisUtterance("Procura e clica na toupeira que tem a letra em destaque!");
        utter.lang = 'pt-PT'; window.speechSynthesis.speak(utter);
    });
}

function carregarCapaJogo() {
    if (jogoAtivo) return;
    const contentor = document.getElementById('contentor-jogo');
    if (!contentor) return;

    contentor.innerHTML = `
        <div class="toupeira-area-geral" style="transform: scale(0.9); pointer-events: none;">
            <div class="painel-alvo">
                <span style="font-weight:900; color:#062B42; font-size:1rem;">Procura a letra:</span>
                <div class="alvo-letra">A</div>
            </div>
            <div class="grelha-toupeiras" style="position:relative;">
                <div class="buraco"><div class="toupeira" id="simu-t0">B</div></div>
                <div class="buraco"><div class="toupeira" id="simu-t1">A</div></div>
                <div class="buraco"><div class="toupeira" id="simu-t2">C</div></div>
                <div id="simu-hand" style="position:absolute; font-size:3rem; z-index:100; opacity:0; transition: all 0.4s ease; filter: drop-shadow(2px 4px 4px rgba(0,0,0,0.3));">👆</div>
            </div>
            <p style="color:#062B42; font-weight:800; text-align:center; font-size:1.05rem; max-width: 500px; margin-top: 15px;">
                Clica na toupeira que tem a letra pedida para ganhares pontos!
            </p>
        </div>
    `;

    atualizarBarraEstado(true);
    setTimeout(iniciarSimulacaoAnimada, 200);
}

function iniciarSimulacaoAnimada() {
    const t0 = document.getElementById('simu-t0');
    const t1 = document.getElementById('simu-t1');
    const hand = document.getElementById('simu-hand');
    if (!t1 || !hand) return;

    function cicloAnimacaoCapa() {
        if (jogoAtivo || !document.getElementById('simu-hand')) return;

        // Reset
        hand.style.opacity = '0';
        if (t0) { t0.classList.remove('ativa'); t0.classList.remove('errada'); }
        t1.classList.remove('ativa'); t1.classList.remove('certa');

        // Subir toupeira com a letra A
        setTimeout(() => {
            if (jogoAtivo) return;
            t1.classList.add('ativa');

            // Mão posiciona-se em cima da toupeira A
            setTimeout(() => {
                if (jogoAtivo) return;
                hand.style.left = (t1.offsetLeft + 15) + "px";
                hand.style.top = (t1.offsetTop - 10) + "px";
                hand.style.opacity = '1';
                hand.innerText = "👆";

                // Ação de bater
                setTimeout(() => {
                    if (jogoAtivo) return;
                    hand.innerText = "✊";
                    t1.classList.add('certa'); // Fica verde

                    setTimeout(() => {
                        if (jogoAtivo) return;
                        hand.style.opacity = '0';
                        t1.classList.remove('ativa');
                        t1.classList.remove('certa');
                        simuTimer = setTimeout(cicloAnimacaoCapa, 1200);
                    }, 600);
                }, 400);
            }, 400);
        }, 500);
    }

    cicloAnimacaoCapa();
}

// ==========================================
// 5. LÓGICA DO JOGO PRINCIPAL
// ==========================================
function limparTimersToupeiras() {
    clearTimeout(simuTimer);
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

    let letrasBuracos = [letraAlvo];
    while (letrasBuracos.length < 6) {
        let l = letrasEmbaralhadas[Math.floor(Math.random() * letrasEmbaralhadas.length)];
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

        const indices = [0, 1, 2, 3, 4, 5].sort(() => Math.random() - 0.5);
        const quantos = Math.random() > 0.5 ? 2 : 1;

        for (let i = 0; i < quantos; i++) {
            const idx = indices[i];
            const toupeiraEl = document.getElementById(`toupeira-${idx}`);
            if (toupeiraEl && !toupeiraEl.classList.contains('ativa')) {
                toupeiraEl.classList.add('ativa');

                const timerDescer = setTimeout(() => {
                    if (toupeiraEl) toupeiraEl.classList.remove('ativa');
                }, 1600);
                toupeirasTimers.push(timerDescer);
            }
        }

        const proximoCiclo = setTimeout(rodadaToupeiras, 2100);
        toupeirasTimers.push(proximoCiclo);
    }

    rodadaToupeiras();
}

function clicarToupeira(letraClicada, elemento) {
    if (!jogoAtivo || !elemento || !elemento.classList.contains('ativa')) return;

    if (letraClicada === letraAlvo) {
        // ACERTOU -> Fica VERDE na letra/toupeira
        jogoAtivo = false;
        limparTimersToupeiras();
        certos++;
        somAcerto.currentTime = 0; somAcerto.play().catch(() => {});

        elemento.classList.add('certa');

        setTimeout(() => {
            rondaAtual++;
            jogoAtivo = true;
            proximaRonda();
        }, 1100);

    } else {
        // ERROU -> Fica VERMELHO na letra/toupeira + Desconta 1 estrela
        erros++;
        certos = Math.max(0, certos - 1);
        somErro.currentTime = 0; somErro.play().catch(() => {});

        elemento.classList.add('errada');
        setTimeout(() => {
            if (elemento) {
                elemento.classList.remove('errada');
                elemento.classList.remove('ativa');
            }
        }, 500);

        atualizarBarraEstado(false);
    }
}

function darAjuda() {
    if (!jogoAtivo || ajudasUsadas >= 2) return;
    ajudasUsadas++;
    certos = Math.max(0, certos - 1);
    atualizarBarraEstado(false);

    for (let i = 0; i < 6; i++) {
        const t = document.getElementById(`toupeira-${i}`);
        if (t && t.innerText === letraAlvo) {
            t.classList.add('ativa');
            t.classList.add('certa');
            setTimeout(() => {
                if (t) {
                    t.classList.remove('ativa');
                    t.classList.remove('certa');
                }
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

// Iniciar a capa do jogo ao carregar
carregarCapaJogo();
