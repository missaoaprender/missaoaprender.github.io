const DADOS = {
  pagina: {
    browserTitulo: "1.º Ano - Jogos Educativos",
    titulo: "Português",
    subtitulo: "Atividades • 1º Ano",
    tituloMenu: "Grafismos - Letras",
    mensagem: "Escolhe um jogo e diverte-te a aprender!",
    informacao: "Jogos educativos para o 1.º ano",
    tituloMenuAcordeao: "Menu",
    urlVoltar: "../",
    iconeEstrela: "★",
    iconeInfo: "i"
  },

  icons: {
    cabecalho: "../../../icons/icon1.png",
    menu: "../../../icons/menu.png",
    seta: "../../../icons/seta.png",
    som: "../../../icons/som.png",
    lampada: "../../../icons/lampada.png",
    feedbacks: {
      feedback1: "../../../icons/feedback_1.png", // 9 a 10 estrelas
      feedback2: "../../../icons/feedback_2.png", // 7 a 8 estrelas
      feedback3: "../../../icons/feedback_3.png", // 5 a 6 estrelas
      feedback4: "../../../icons/feedback_4.png"  // Até 4 estrelas
    },
    menuAnos: {
      inicio: "../../../icons/inicio.png",
      pre: "../../../icons/iconpre.png",
      ano1: "../../../icons/icon1.png",
      ano2: "../../../icons/icon2.png",
      ano3: "../../../icons/icon3.png",
      ano4: "../../../icons/icon4.png"
    }
  },

  sons: {
    certo: "../../../sons/certo.mp3",
    errado: "../../../sons/errado.mp3"
  },

  cores: {
    fundo: "#F2F8FC",
    ceu1: "#B6E2F9",
    ceu2: "#DEF3FF",
    header: "#DEF3FF",
    headerTopo: "#B6E2F9",
    azulHeader: "#0F8BD3",
    texto: "#0B4B71",
    textoEscuro: "#062B42",
    branco: "#FFFFFF",
    creme: "#E1F2FA",
    linha: "#B4E4F8",
    sombra: "rgba(15,139,211,.18)",
    sombraForte: "rgba(15,139,211,.28)"
  },

  dimensoes: {
    larguraMaxima: 1200,
    raioAno: 23,
    pc: { alturaCartao: 450, tamanhoIcone: 220 },
    telemovelVertical: { alturaCartao: 320, tamanhoIcone: 160 },
    telemovelHorizontal: { alturaCartao: 220, tamanhoIcone: 100 },
    tabletVertical: { alturaCartao: 400, tamanhoIcone: 190 },
    tabletHorizontal: { alturaCartao: 380, tamanhoIcone: 180 }
  },

  jogos: [
    { nome: "Grafismos", idade: "Linhas Retas", imagem: "../../../icons/gatos&caes.png", cor: "#11CBFC", cor2: "#079BC8", pagina: "jogo.js" }
  ],

  menuAnos: [
    { id: "inicio", nome: "Início", icon: "inicio", pagina: "../../../" },
    { id: "pre", nome: "Pré-Escolar", icon: "pre", pagina: "../../../pre/" },
    { id: "ano1", nome: "1.º Ano", icon: "ano1", pagina: "../../../1/" },
    { id: "ano2", nome: "2.º Ano", icon: "ano2", pagina: "../../../2/" },
    { id: "ano3", nome: "3.º Ano", icon: "ano3", pagina: "../../../3/" },
    { id: "ano4", nome: "4.º Ano", icon: "ano4", pagina: "../../../4/" }
  ]
};
