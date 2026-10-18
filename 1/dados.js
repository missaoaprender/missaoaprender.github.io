const DADOS = {
  pagina: {
    browserTitulo: "1.º Ano - Recursos Educativos",
    titulo: "1.º Ano",
    subtitulo: "Jogar para saber!",
    tituloMenu: "Escolhe a área",
    mensagem: "Começa a aprender!",
    informacao: "Jogos para o 1.º ano",
    tituloMenuAcordeao: "Menu",
    urlVoltar: "../",
    iconeEstrela: "★",
    iconeInfo: "i",
    tituloDestaques: "Jogos em destaque",
    emojiDestaques: "🎮"
  },

  icons: {
    cabecalho: "../icons/icon1.png",
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
    fundo: "#F2F8FC",
    ceu1: "#B6E2F9",
    ceu2: "#DEF3FF",
    header: "#DEF3FF",
    headerTopo: "#B6E2F9",
    azulHeader: "#0F8BD3",
    texto: "#0B4B71",
    textoEscuro: "#062B42",
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
    verde: "#45C83D",
    verde2: "#169A3A",
    roxo: "#0F8BD3",
    roxo2: "#0A5B8A",
    rosa: "#F43A9D",
    rosa2: "#C81970",
    creme: "#E1F2FA",
    creme2: "#96D5F0",
    linha: "#B4E4F8",
    sombra: "rgba(15,139,211,.18)",
    sombraForte: "rgba(15,139,211,.28)"
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
      idade: "6 - 7 anos",
      icon: "portugues",
      cor: "#11CBFC",
      cor2: "#079BC8",
      pagina: "pt/"
    },
    {
      id: "matematica",
      nome: "Matemática",
      idade: "6 - 7 anos",
      icon: "matematica",
      cor: "#FD6746",
      cor2: "#D94328",
      pagina: "mat/"
    },
    {
      id: "estudoMeio",
      nome: "Estudo do Meio",
      idade: "6 - 7 anos",
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
    { id: "rastros", nome: "Rastros", icon: "rastros", estrelas: 5, pagina: "jd/rastros/" },
    { id: "gatosCaes", nome: "Gatos&Cães", icon: "gatosCaes", estrelas: 5, pagina: "jd/gatos-caes" },
    { id: "dominio", nome: "Dominório", icon: "dominorio", estrelas: 5, pagina: "jd/dominorio/" },
    { id: "semaforo", nome: "Semáforo", icon: "semaforo", estrelas: 5, pagina: "jd/semaforo/" },
    { id: "quelhas", nome: "Quellhas", icon: "quelhas", estrelas: 5, pagina: "jd/quelhas/" },
    { id: "avanco", nome: "Avanço", icon: "avanco", estrelas: 5, pagina: "jd/avanco/" }
  ]
};
