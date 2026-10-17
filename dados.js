const DADOS = {

  pagina: {
    titulo: "Recursos Covão",
    subtitulo: "Jogar para aprender!",
    tituloMenu: "Escolhe o ano",
    mensagem: "Escolhe o ano e comece a aprender!",
    informacao: "Recursos educativos para o 1.º ciclo"
  },

  nuvem: "icons/nuvem.png",

  nuvens: {
    quantidade: 3,
    larguraMin: 72,
    larguraMax: 125,
    alturaMin: 38,
    alturaMax: 66,
    topoMin: 24,
    topoMax: 145,
    margemHorizontal: 12
  },

  icons: {
    anos: {
      pre: "icons/iconpre.png",
      ano1: "icons/icon1.png",
      ano2: "icons/icon2.png",
      ano3: "icons/icon3.png",
      ano4: "icons/icon4.png"
    },
    destaques: {
      rastros: "icons/rastros.png",
      gatosCaes: "icons/gatos&caes.png",
      dominorio: "icons/dominorio.png",
      semaforo: "icons/semaforo.png",
      quelhas: "icons/quelhas.png",
      avanco: "icons/avanco.png"
    }
  },

  cores: {
    fundo: "#EAF5FC",
    ceu1: "#78DDF7",
    ceu2: "#BCEEF9",
    texto: "#07569A",
    textoEscuro: "#064B8A",
    branco: "#FFFFFF",
    amarelo: "#FFBA16",
    amarelo2: "#EF8709",
    azul: "#20B9EF",
    azul2: "#087AC9",
    verde: "#45C83D",
    verde2: "#169A3A",
    roxo: "#A74BEF",
    roxo2: "#7434B8",
    rosa: "#F43A9D",
    rosa2: "#C81970",
    creme: "#FFF9E1",
    creme2: "#F5D996",
    linha: "#A5D9F8",
    sombra: "rgba(15, 88, 139, .20)",
    sombraForte: "rgba(15, 88, 139, .30)"
  },

  dimensoes: {
    larguraMaxima: 1650,
    alturaAnoDesktop: 300,
    alturaAnoTabletHorizontal: 245,
    alturaAnoTelemovelHorizontal: 175,
    raioAno: 23,
    raioDestaques: 26,
    tamanhoIconAnoDesktop: 128,
    tamanhoIconAnoTablet: 100,
    tamanhoIconAnoTelemovelHorizontal: 76,
    tamanhoIconJogo: 76,
    tamanhoIconJogoTablet: 64,
    tamanhoIconJogoTelemovel: 54
  },

  anos: [
    {
      id: "pre",
      nome: "Pré-Escolar",
      idade: "3 – 5 anos",
      icon: "pre",
      cor: "#FFBA16",
      cor2: "#EF8709",
      pagina: "pre"
    },
    {
      id: "ano1",
      nome: "1.º Ano",
      idade: "6 – 7 anos",
      icon: "ano1",
      cor: "#20B9EF",
      cor2: "#087AC9",
      pagina: "1"
    },
    {
      id: "ano2",
      nome: "2.º Ano",
      idade: "7 – 8 anos",
      icon: "ano2",
      cor: "#45C83D",
      cor2: "#169A3A",
      pagina: "2"
    },
    {
      id: "ano3",
      nome: "3.º Ano",
      idade: "8 – 9 anos",
      icon: "ano3",
      cor: "#A74BEF",
      cor2: "#7434B8",
      pagina: "3"
    },
    {
      id: "ano4",
      nome: "4.º Ano",
      idade: "9 – 10 anos",
      icon: "ano4",
      cor: "#0DA3AA",
      cor2: "#076D73",
      pagina: "4"
    }
  ],

  destaques: [
    { id: "rastros", nome: "Rastros", icon: "rastros", pagina: "jd/rastros/" },
    { id: "gatosCaes", nome: "Gatos&Cães", icon: "gatosCaes", pagina: "jd/gatos&caes/" },
    { id: "dominio", nome: "Dominório", icon: "dominorio", pagina: "jd/dominorio/" },
    { id: "semaforo", nome: "Semáforo", icon: "semaforo", pagina: "jd/semaforo/" },
    { id: "quelhas", nome: "Quellhas", icon: "quelhas", pagina: "jd/quelhas/" },
    { id: "avanco", nome: "Avanço", icon: "avanco", pagina: "jd/avanco/" }
  ]

};
