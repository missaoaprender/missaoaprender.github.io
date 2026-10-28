const DADOS = {
  pagina: {
    browserTitulo: "Pré-Escolar",
    titulo: "Pré-Escolar",
    subtitulo: "Desenho Criativo",
    tituloMenu: "Desenho Criativo",
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

  // Lista de desenhos para colorir (a apontar para a pasta imagens/colorir/)
  desenhosParaColorir: [
    { id: 1, nome: "Desenho 5", arquivo: "../../imagens/colorir/desenho5.png" },
    { id: 2, nome: "Desenho 6", arquivo: "../../imagens/colorir/desenho6.png" },
    { id: 3, nome: "Desenho 3", arquivo: "../../imagens/colorir/desenho3.png" },
    { id: 4, nome: "Desenho 4", arquivo: "../../imagens/colorir/desenho4.png" }
  ],

  sons: {
    certo: "",
    errado: ""
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
    raioAno: 23,
    pc: { alturaCartao: 450, tamanhoIcone: 220 },
    telemovelVertical: { alturaCartao: 320, tamanhoIcone: 160 },
    telemovelHorizontal: { alturaCartao: 220, tamanhoIcone: 100 },
    tabletVertical: { alturaCartao: 400, tamanhoIcone: 190 },
    tabletHorizontal: { alturaCartao: 380, tamanhoIcone: 180 }
  },

  jogos: [
    { nome: "Estojo Mágico", idade: "Pré-Escolar", imagem: "../../icons/gatos&caes.png", cor: "#ECA607", cor2: "#3E3E59", pagina: "index.html" }
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
