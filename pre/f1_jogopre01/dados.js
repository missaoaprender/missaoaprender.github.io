const DADOS = {
  pagina: {
    browserTitulo: "Pré-Escolar",
    titulo: "Jogos Da Pré",
    subtitulo: "Atividades • Matemática",
    tituloMenu: "Desenho",
    mensagem: "Diverte-te a aprender!",
    informacao: "Jogos CRJM",
    tituloMenuAcordeao: "Menu",
    urlVoltar: "../../", 
    iconeEstrela: "★",
    iconeInfo: "i"
  },

  icons: {
    cabecalho: "../../icons/dominorio.png",
    menu: "../../icons/menu.png",
    seta: "../../icons/seta.png",
    som: "../../icons/som.png",
    lampada: "../../icons/lampada.png",
    info: "../../icons/info.png",
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

  sons: {
    certo: "",
    errado: ""
  },

  cores: {
    fundo: "#F3F3F8",
    ceu1: "#FDF6E2",
    ceu2: "#FCEFD0",
    header: "#FCEFD0",
    headerTopo: "#FDF6E2",
    azulHeader: "#F0AC0E",
    texto: "#3E3E59",
    textoEscuro: "#262638",
    branco: "#FFFFFF",
    creme: "#ECECEF",
    linha: "#E2D3AB",
    sombra: "rgba(240,172,14,.18)",
    sombraForte: "rgba(240,172,14,.28)"
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
    { nome: "Avanço", idade: "Estratégia", imagem: "../../icons/gatos&caes.png", cor: "#F0AC0E", cor2: "#3E3E59", pagina: "jogo.js" }
  ],

  menuAnos: [
    { id: "inicio", nome: "Início", icon: "inicio", pagina: "../../" },
    { id: "pre", nome: "Pré-Escolar", icon: "pre", pagina: "../../pre/" },
    { id: "ano1", nome: "1.º Ano", icon: "ano1", pagina: "../../1/" },
    { id: "ano2", nome: "2.º Ano", icon: "ano2", pagina: "../../2/" },
    { id: "ano3", nome: "3.º Ano", icon: "ano3", pagina: "../../3/" },
    { id: "ano4", nome: "4.º Ano", icon: "ano4", pagina: "../../4/" }
  ]
};
