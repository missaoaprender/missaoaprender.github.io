const DADOS = {
  pagina: {
    browserTitulo: "Pré-Escolar - Jogos Educativos",
    titulo: "Pré-Escolar",
    subtitulo: "Atividades • Pré-Escolar",
    tituloMenu: "Escolhe o Jogo",
    mensagem: "Diverte-te a aprender!",
    informacao: "Jogos - Pré-Escolar",
    tituloMenuAcordeao: "Menu",
    urlVoltar: "../",
    iconeEstrela: "★",
    iconeInfo: "i"
  },

  icons: {
    cabecalho: "../icons/iconpre.png",
    menu: "../icons/menu.png",
    seta: "../icons/seta.png",
    menuAnos: {
      inicio: "../icons/inicio.png",
      pre: "../icons/iconpre.png",
      ano1: "../icons/icon1.png",
      ano2: "../icons/icon2.png",
      ano3: "../icons/icon3.png",
      ano4: "../icons/icon4.png"
    }
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
    
    // 1. PC
    pc: {
      alturaCartao: 209,
      tamanhoIcone: 125
    },

    // 2. Telemóvel Vertical
    telemovelVertical: {
      alturaCartao: 200,
      tamanhoIcone: 110
    },

    // 3. Telemóvel Horizontal
    telemovelHorizontal: {
      alturaCartao: 140,
      tamanhoIcone: 75
    },

    // 4. Tablet Vertical (3 colunas)
    tabletVertical: {
      alturaCartao: 240,
      tamanhoIcone: 110
    },

    // 5. Tablet Horizontal (5 colunas)
    tabletHorizontal: {
      alturaCartao: 220,
      tamanhoIcone: 130
    }
  },

  fases: [
    {
      tituloFase: "Fase 1",
      jogos: [
        { nome: "Jogo 1", idade: "Subtítulo 1", imagem: "iconjogos/f1_jogopre01.png", cor: "#FFB400", cor2: "#E09A00", pagina: "f1_jogopre01/" },
        { nome: "Jogo 2", idade: "Subtítulo 2", imagem: "iconjogos/jogo2.png", cor: "#FFB400", cor2: "#E09A00", pagina: "jogo2/" },
        { nome: "Jogo 3", idade: "Subtítulo 3", imagem: "iconjogos/jogo3.png", cor: "#FFB400", cor2: "#E09A00", pagina: "jogo3/" },
        { nome: "Jogo 4", idade: "Subtítulo 4", imagem: "iconjogos/jogo4.png", cor: "#FFB400", cor2: "#E09A00", pagina: "jogo4/" },
        { nome: "Jogo 5", idade: "Subtítulo 5", imagem: "iconjogos/jogo5.png", cor: "#FFB400", cor2: "#E09A00", pagina: "jogo5/" },
        { nome: "Jogo 6", idade: "Subtítulo 6", imagem: "iconjogos/jogo6.png", cor: "#FFB400", cor2: "#E09A00", pagina: "jogo6/" }
      ]
    },
    {
      tituloFase: "Fase 2",
      jogos: [
        { nome: "Jogo 1", idade: "Subtítulo 1", imagem: "iconjogos/jogo1.png", cor: "#FFB400", cor2: "#E09A00", pagina: "jogo1/" },
        { nome: "Jogo 2", idade: "Subtítulo 2", imagem: "iconjogos/jogo2.png", cor: "#FFB400", cor2: "#E09A00", pagina: "jogo2/" },
        { nome: "Jogo 3", idade: "Subtítulo 3", imagem: "iconjogos/jogo3.png", cor: "#FFB400", cor2: "#E09A00", pagina: "jogo3/" },
        { nome: "Jogo 4", idade: "Subtítulo 4", imagem: "iconjogos/jogo4.png", cor: "#FFB400", cor2: "#E09A00", pagina: "jogo4/" },
        { nome: "Jogo 5", idade: "Subtítulo 5", imagem: "iconjogos/jogo5.png", cor: "#FFB400", cor2: "#E09A00", pagina: "jogo5/" }
      ]
    },
    {
      tituloFase: "Fase 3",
      jogos: [
        { nome: "Jogo 1", idade: "Subtítulo 1", imagem: "iconjogos/jogo1.png", cor: "#E7A000", cor2: "#B37A00", pagina: "jogo1/" },
        { nome: "Jogo 2", idade: "Subtítulo 2", imagem: "iconjogos/jogo2.png", cor: "#FD6746", cor2: "#D94328", pagina: "jogo2/" },
        { nome: "Jogo 3", idade: "Subtítulo 3", imagem: "iconjogos/jogo3.png", cor: "#62D733", cor2: "#36A918", pagina: "jogo3/" },
        { nome: "Jogo 4", idade: "Subtítulo 4", imagem: "iconjogos/jogo4.png", cor: "#FFB400", cor2: "#E09A00", pagina: "jogo4/" }
      ]
    },
    {
      tituloFase: "Fase 4",
      jogos: [
        { nome: "Jogo 1", idade: "Subtítulo 1", imagem: "iconjogos/jogo1.png", cor: "#E7A000", cor2: "#B37A00", pagina: "jogo1/" },
        { nome: "Jogo 2", idade: "Subtítulo 2", imagem: "iconjogos/jogo2.png", cor: "#FD6746", cor2: "#D94328", pagina: "jogo2/" },
        { nome: "Jogo 3", idade: "Subtítulo 3", imagem: "iconjogos/jogo3.png", cor: "#62D733", cor2: "#36A918", pagina: "jogo3/" },
        { nome: "Jogo 4", idade: "Subtítulo 4", imagem: "iconjogos/jogo4.png", cor: "#FFB400", cor2: "#E09A00", pagina: "jogo4/" }
      ]
    }
  ],

  menuAnos: [
    { id: "inicio", nome: "Início", icon: "inicio", pagina: "../" },
    { id: "pre", nome: "Pré-Escolar", icon: "pre", pagina: "../pre/" },
    { id: "ano1", nome: "1.º Ano", icon: "ano1", pagina: "../1/" },
    { id: "ano2", nome: "2.º Ano", icon: "ano2", pagina: "../2/" },
    { id: "ano3", nome: "3.º Ano", icon: "ano3", pagina: "../3/" },
    { id: "ano4", nome: "4.º Ano", icon: "ano4", pagina: "../4/" }
  ]
};
