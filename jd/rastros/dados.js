const DADOS = {
  pagina: {
    browserTitulo: "Jogos Matemáticos",
    titulo: "Jogos Matemáticos",
    subtitulo: "Atividades • Matemática",
    tituloMenu: "Jogo do Rastro",
    mensagem: "Diverte-te a aprender!",
    informacao: "Jogos CRJM",
    tituloMenuAcordeao: "Menu",
    urlVoltar: "../../", // Raiz do site
    iconeEstrela: "★",
    iconeInfo: "i"
  },

  icons: {
    cabecalho: "../../icons/icon1.png",
    menu: "../../icons/menu.png",
    seta: "../../icons/seta.png",
    som: "../../icons/som.png",
    lampada: "../../icons/lampada.png",
    info: "../../icons/info.png", // Ícone info.png adicionado
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
    fundo: "#FAF2F2",
    ceu1: "#E8C8C8",
    ceu2: "#F5E1E1",
    header: "#F5E1E1",
    headerTopo: "#E8C8C8",
    azulHeader: "#804040",
    texto: "#592B2B",
    textoEscuro: "#401F1F",
    branco: "#FFFFFF",
    creme: "#F9EBEB",
    linha: "#D9B3B3",
    sombra: "rgba(128,64,64,.18)",
    sombraForte: "rgba(128,64,64,.28)"
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
    { nome: "Rastros", idade: "Estratégia", imagem: "../../icons/gatos&caes.png", cor: "#804040", cor2: "#592B2B", pagina: "jogo.js" }
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
