const DADOS = {
  pagina: {
    browserTitulo: "Pré-Escolar - Monta o Animal",
    titulo: "Pré-Escolar",
    subtitulo: "Monta o Animal Mágico",
    tituloMenu: "Monta o Animal",
    mensagem: "Diverte-te a aprender!",
    informacao: "Jogos Pré",
    tituloMenuAcordeao: "Menu",
    urlVoltar: "../", 
    iconeEstrela: "★",
    iconeInfo: "i"
  },

  animacaoCapa: {
    titulo: "Monta o Animal Mágico",
    instrucaoTexto: "Usa as setas para encaixar as peças do animal certo!"
  },

  icons: {
    cabecalho: "../../icons/iconpre.png",
    menu: "../../icons/menu.png",
    seta: "../../icons/seta.png",
    som: "../../icons/som.png",
    lampada: "../../icons/lampada.png",
    info: "../../icons/info.png",
    pincel: "../../icons/pincel.png",
    feedbacks: {
      feedback1: "../../icons/feedback_1.png",
      feedback2: "../../icons/feedback_2.png",
      feedback3: "../../icons/feedback_3.png",
      feedback4: "../../icons/feedback_4.png"
    },
    menuAnos: {
      inicio: "../../icons/inicio.png",
      pre: "../../icons/iconpre.png",
      ano1: "../../icons/icon1.png",
      ano2: "../../icons/icon2.png",
      ano3: "../../icons/icon3.png",
      ano4: "../../icons/icon4.png"
    }
  },

  // Caminho e lista de animais vindos diretamente da pasta animais_selvagens
  caminhoAnimais: "../../imagens/animais_selvagens/",
  animaisSelvagens: [
    { nome: "Abelha", arquivo: "abelha.png" },
    { nome: "Águia", arquivo: "aguia.png" },
    { nome: "Aranha", arquivo: "aranha.png" },
    { nome: "Baleia", arquivo: "baleia.png" },
    { nome: "Canguru", arquivo: "canguru.png" },
    { nome: "Caranguejo", arquivo: "caranguejo.png" },
    { nome: "Coala", arquivo: "coala.png" },
    { nome: "Crocodilo", arquivo: "crocodilo.png" },
    { nome: "Elefante", arquivo: "elefante.png" },
    { nome: "Foca", arquivo: "foca.png" },
    { nome: "Gorila", arquivo: "gorila.png" },
    { nome: "Hipopótamo", arquivo: "hipopotamo.png" },
    { nome: "Leão", arquivo: "leao.png" },
    { nome: "Macaco", arquivo: "macaco.png" },
    { nome: "Papagaio", arquivo: "papagaio.png" },
    { nome: "Peixe", arquivo: "peixe.png" },
    { nome: "Polvo", arquivo: "polvo.png" },
    { nome: "Pombo", arquivo: "pombo.png" },
    { nome: "Raia", arquivo: "raia.png" },
    { nome: "Rato", arquivo: "rato.png" },
    { nome: "Rinoceronte", arquivo: "rinoceronte.png" },
    { nome: "Texugo", arquivo: "texugo.png" },
    { nome: "Tigre", arquivo: "tigre.png" },
    { nome: "Tubarão", arquivo: "tubarao.png" },
    { nome: "Tucano", arquivo: "tucano.png" }
  ],

  sons: {
    certo: "",
    errado: "",
    clique: "",
    instrucao: ""
  },

  cores: {
    fundo: "#F3F3F8",
    ceu1: "#FDF7E5",
    ceu2: "#FBF0CC",
    header: "#FBF0CC",
    headerTopo: "#FDF7E5",
    azulHeader: "#ECA607",
    texto: "#3E3E59",
    textoEscuro: "#262638",
    branco: "#FFFFFF",
    creme: "#ECECEF",
    linha: "#E2D3AB",
    sombra: "rgba(236,166,7,.18)",
    sombraForte: "rgba(236,166,7,.28)"
  },

  dimensoes: {
    larguraMaxima: 1200,
    raioAno: 23
  },

  menuAnos: [
    { id: "inicio", nome: "Início", icon: "inicio", pagina: "../../" },
    { id: "pre", nome: "Pré-Escolar", icon: "pre", pagina: "../../pre/" },
    { id: "ano1", nome: "1.º Ano", icon: "ano1", pagina: "../../1/" },
    { id: "ano2", nome: "2.º Ano", icon: "ano2", pagina: "../../2/" },
    { id: "ano3", nome: "3.º Ano", icon: "ano3", pagina: "../../3/" },
    { id: "ano4", nome: "4.º Ano", icon: "ano4", pagina: "../../4/" }
  ]
};
