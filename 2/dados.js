const DADOS = {
  pagina: {
    browserTitulo: "2.º Ano - Recursos Educativos",
    titulo: "2.º Ano",
    subtitulo: "Jogar para saber!",
    tituloMenu: "Escolhe a área",
    mensagem: "Começa a aprender!",
    informacao: "Jogos para o 2.º ano",
    tituloMenuAcordeao: "Menu",
    urlVoltar: "../",
    iconeEstrela: "★",
    iconeInfo: "i",
    tituloDestaques: "Jogos em destaque",
    emojiDestaques: "🎮"
  },

  icons: {
    cabecalho: "../icons/icon2.png",
    menu: "../icons/menu.png",
    seta: "../icons/seta.png",
    anos: {
      portugues: "../icons/pt.png",
      matematica: "../icons/mat.png",
      estudoMeio: "../icons/em.png"
    },
    menuAnos: {
      inicio: "../icons/inicio.png",
      pre: "../icons/iconpre.png",
      ano1: "../icons/icon1.png",
      ano2: "../icons/icon2.png",
      ano3: "../icons/icon3.png",
      ano4: "../icons/icon4.png"
    },
    destaques: {
      rastros: "../icons/rastros.png",
      gatosCaes: "../icons/gatos&caes.png",
      dominorio: "../icons/dominorio.png",
      semaforo: "../icons/semaforo.png",
      quelhas: "../icons/quelhas.png",
      avanco: "../icons/avanco.png"
    }
  },

  cores: {
    fundo: "#F2FBF4",
    ceu1: "#C8F6CE",
    ceu2: "#E1FCE4",
    header: "#E1FCE4",
    headerTopo: "#C8F6CE",
    azulHeader: "#2AAD3B",
    texto: "#114B18",
    textoEscuro: "#072B0C",
    branco: "#FFFFFF",
    portugues: "#11CBFC",
    portugues2: "#079BC8",
    matematica: "#FD6746",
    matematica2: "#D94328",
    estudoMeio: "#62D733",
    estudoMeio2: "#36A918",
    amarelo: "#FFBA16",
    amarelo2: "#EF8709",
    azul: "#20B9EF",
    azul2: "#087AC9",
    verde: "#2AAD3B",
    verde2: "#1D7C28",
    roxo: "#2AAD3B",
    roxo2: "#1D7C28",
    rosa: "#F43A9D",
    rosa2: "#C81970",
    creme: "#D8FADF",
    creme2: "#9EEFB1",
    linha: "#B6F4BE",
    sombra: "rgba(42,173,59,.18)",
    sombraForte: "rgba(42,173,59,.28)"
  },

  dimensoes: {
    larguraMaxima: 1200,
    alturaAnoDesktop: 270,
    raioAno: 23,
    raioDestaques: 26,
    tamanhoIconAnoDesktop: 153,
    tamanhoIconJogo: 76
  },

  anos: [
    {
      id: "portugues",
      nome: "Português",
      idade: "7 - 8 anos",
      icon: "portugues",
      cor: "#11CBFC",
      cor2: "#079BC8",
      pagina: "pt/"
    },
    {
      id: "matematica",
      nome: "Matemática",
      idade: "7 - 8 anos",
      icon: "matematica",
      cor: "#FD6746",
      cor2: "#D94328",
      pagina: "mat/"
    },
    {
      id: "estudoMeio",
      nome: "Estudo do Meio",
      idade: "7 - 8 anos",
      icon: "estudoMeio",
      cor: "#62D733",
      cor2: "#36A918",
      pagina: "em/"
    }
  ],

  menuAnos: [
    { id: "inicio", nome: "Início", icon: "inicio", pagina: "../" },
    { id: "pre", nome: "Pré-Escolar", icon: "pre", pagina: "../pre/" },
    { id: "ano1", nome: "1.º Ano", icon: "ano1", pagina: "../1/" },
    { id: "ano2", nome: "2.º Ano", icon: "ano2", pagina: "../2/" },
    { id: "ano3", nome: "3.º Ano", icon: "ano3", pagina: "../3/" },
    { id: "ano4", nome: "4.º Ano", icon: "ano4", pagina: "../4/" }
  ],

  destaques: [
    { id: "rastros", nome: "Rastros", icon: "rastros", pagina: "jd/rastros/" },
    { id: "gatosCaes", nome: "Gatos&Cães", icon: "gatosCaes", pagina: "jd/gatos-caes" },
    { id: "dominio", nome: "Dominório", icon: "dominorio", pagina: "jd/dominorio/" },
    { id: "semaforo", nome: "Semáforo", icon: "semaforo",  pagina: "jd/semaforo/" },
    { id: "quelhas", nome: "Quellhas", icon: "quelhas", pagina: "jd/quelhas/" },
    { id: "avanco", nome: "Avanço", icon: "avanco", pagina: "jd/avanco/" }
  ]
};
