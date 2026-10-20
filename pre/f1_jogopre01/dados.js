const DADOS = {
  pagina: {
    browserTitulo: "Pré-Escolar",
    titulo: "Pré-Escolar",
    subtitulo: "Atividades Criativas",
    tituloMenu: "Estojo Mágico",
    mensagem: "Diverte-te a aprender!",
    informacao: "Jogos Pré",
    tituloMenuAcordeao: "Menu",
    urlVoltar: "../../", 
    iconeEstrela: "★",
    iconeInfo: "i"
  },

  icons: {
    cabecalho: "../../icons/iconpre.png",
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
    fundo: "#FFFDF4",
    ceu1: "#FCECC2",
    ceu2: "#FFF5D6",
    header: "#FFF5D6",
    headerTopo: "#FCECC2",
    azulHeader: "#E7A000",
    texto: "#684500",
    textoEscuro: "#362400",
    branco: "#FFFFFF",
    creme: "#FCEFCE",
    linha: "#F7D896",
    sombra: "rgba(231,160,0,.18)",
    sombraForte: "rgba(231,160,0,.28)"
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
    { nome: "Estojo Mágico", idade: "Pré-Escolar", imagem: "../../icons/gatos&caes.png", cor: "#ECA607", cor2: "#3E3E59", pagina: "jogo.js" }
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
