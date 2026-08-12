/* =====================================================================
   fontes.js — de onde vem cada conceito ensinado na plataforma.

   Uma obra é registrada UMA vez aqui e referenciada por chave curta nos
   módulos (campo `fontes` do APP.page). É o mesmo princípio de data.js:
   uma definição, um lugar. Assim a mesma referência não aparece com
   grafias diferentes em oito telas.

   O campo que faz a diferença é `sustenta`: ele diz qual afirmação do
   conteúdo depende daquela obra. Sem ele a bibliografia vira enfeite e
   ninguém consegue conferir se a citação cobre o que está escrito.

   VERIFICAÇÃO: os itens marcados `conferido: true` foram checados contra
   a obra. Os demais aguardam conferência e aparecem sinalizados na tela —
   preferimos admitir a pendência a exibir uma referência não verificada.
   ===================================================================== */
window.FONTES = (function () {

  var AREAS = {
    visualizacao:   'Visualização de dados',
    estatistica:    'Estatística',
    dados:          'Engenharia e ciência de dados',
    gestao:         'Gestão e indicadores',
    acessibilidade: 'Acessibilidade e interface'
  };

  var OBRAS = {

    /* ---------------------------------------- visualização de dados */
    cleveland1984: {
      autores: 'Cleveland, W. S.; McGill, R.',
      ano: 1984,
      titulo: 'Graphical Perception: Theory, Experimentation, and Application to the Development of Graphical Methods',
      veiculo: 'Journal of the American Statistical Association, 79(387), 531–554',
      tipo: 'artigo', area: 'visualizacao', acesso: 'pago',
      url: 'https://doi.org/10.1080/01621459.1984.10478080',
      sustenta: 'A hierarquia de precisão perceptiva: posição sobre uma escala comum é lida com mais exatidão que comprimento, e comprimento com mais exatidão que ângulo ou área. É o fundamento de “barras comparam melhor que pizza” e da regra do eixo no zero para barras.',
      conferido: true
    },

    tufte2001: {
      autores: 'Tufte, E. R.',
      ano: 2001,
      titulo: 'The Visual Display of Quantitative Information',
      veiculo: '2ª edição, Graphics Press (1ª edição de 1983)',
      tipo: 'livro', area: 'visualizacao', acesso: 'pago',
      sustenta: 'Os conceitos de fator de mentira, razão dado-tinta e “chartjunk”. Sustenta as regras de legibilidade: sem 3D, sem excesso de bordas, sem enfeite que não carregue informação.',
      conferido: true
    },

    few2013: {
      autores: 'Few, S.',
      ano: 2013,
      titulo: 'Information Dashboard Design: Displaying Data for At-a-Glance Monitoring',
      veiculo: '2ª edição, Analytics Press (1ª edição de 2006, O’Reilly)',
      tipo: 'livro', area: 'visualizacao', acesso: 'pago',
      sustenta: 'A crítica ao velocímetro em dashboards e a especificação do bullet chart, que é criação do próprio autor. Sustenta a recomendação de trocar gauge por bullet e a ideia de dashboard que cabe em uma tela.',
      conferido: true
    },

    munzner2014: {
      autores: 'Munzner, T.',
      ano: 2014,
      titulo: 'Visualization Analysis and Design',
      veiculo: 'CRC Press',
      tipo: 'livro', area: 'visualizacao', acesso: 'pago',
      sustenta: 'O encadeamento “o quê, por quê, como”: primeiro os dados e a tarefa, depois a forma visual. Sustenta o comparador de gráficos e o princípio “a pergunta vem antes do gráfico”.',
      conferido: true
    },

    wainer1984: {
      autores: 'Wainer, H.',
      ano: 1984,
      titulo: 'How to Display Data Badly',
      veiculo: 'The American Statistician, 38(2), 137–147',
      tipo: 'artigo', area: 'visualizacao', acesso: 'pago',
      sustenta: 'O formato de ensino por contraexemplo. É a estrutura do módulo de boas práticas: mostrar a versão ruim ao lado da boa comunica melhor que enunciar a regra.',
      conferido: true
    },

    cairo2019: {
      autores: 'Cairo, A.',
      ano: 2019,
      titulo: 'How Charts Lie: Getting Smarter about Visual Information',
      veiculo: 'W. W. Norton & Company',
      tipo: 'livro', area: 'visualizacao', acesso: 'pago',
      sustenta: 'A nuance do eixo truncado: a exigência de linha de base zero vale para marcas de comprimento (barra, área) e não para marcas de posição (linha). Sustenta a regra corrigida do MOD-05.',
      conferido: true
    },

    ware2020: {
      autores: 'Ware, C.',
      ano: 2020,
      titulo: 'Information Visualization: Perception for Design',
      veiculo: '4ª edição, Morgan Kaufmann',
      tipo: 'livro', area: 'visualizacao', acesso: 'pago',
      sustenta: 'Atributos pré-atentivos — cor, tamanho, orientação e posição são processados antes da atenção consciente. Sustenta “cor com significado, nunca decorativa” e o uso de destaque para exceções.',
      conferido: true
    },

    shneiderman1996: {
      autores: 'Shneiderman, B.',
      ano: 1996,
      titulo: 'The Eyes Have It: A Task by Data Type Taxonomy for Information Visualizations',
      veiculo: 'Proceedings of the IEEE Symposium on Visual Languages, 336–343',
      tipo: 'artigo', area: 'visualizacao', acesso: 'pago',
      url: 'https://doi.org/10.1109/VL.1996.545307',
      sustenta: 'O mantra “visão geral primeiro, depois zoom e filtro, detalhe sob demanda”. É exatamente a ordem de leitura em camadas do MOD-03 e a sequência de drill-down do MOD-06.',
      conferido: true
    },

    ibcs: {
      autores: 'IBCS Association (Hichert, R.; Faisst, J.)',
      ano: 2024,
      titulo: 'International Business Communication Standards (IBCS)',
      veiculo: 'Padrão aberto de notação para relatórios de negócio · ibcs.com',
      tipo: 'padrão', area: 'visualizacao', acesso: 'aberto',
      url: 'https://www.ibcs.com/standards/',
      sustenta: 'Notação padronizada: o mesmo indicador com o mesmo nome, cor, unidade e escala em toda tela. Sustenta o princípio de consistência do MOD-11 e mostra que ele existe como norma pública, não como preferência estética.',
      conferido: false
    },

    /* ---------------------------------------- estatística */
    anscombe1973: {
      autores: 'Anscombe, F. J.',
      ano: 1973,
      titulo: 'Graphs in Statistical Analysis',
      veiculo: 'The American Statistician, 27(1), 17–21',
      tipo: 'artigo', area: 'estatistica', acesso: 'pago',
      sustenta: 'O quarteto de Anscombe: quatro conjuntos com média, variância e correlação idênticas e formas completamente diferentes. Sustenta “não confie no agregado sem olhar a distribuição” e o erro comum da dispersão.',
      conferido: true
    },

    simpson1951: {
      autores: 'Simpson, E. H.',
      ano: 1951,
      titulo: 'The Interpretation of Interaction in Contingency Tables',
      veiculo: 'Journal of the Royal Statistical Society, Series B, 13(2), 238–241',
      tipo: 'artigo', area: 'estatistica', acesso: 'pago',
      sustenta: 'O paradoxo de Simpson: o sinal observado no total pode inverter dentro de cada segmento. É a justificativa estatística do drill-down — o consolidado pode esconder o oposto do que mostra.',
      conferido: true
    },

    wheeler2000: {
      autores: 'Wheeler, D. J.',
      ano: 2000,
      titulo: 'Understanding Variation: The Key to Managing Chaos',
      veiculo: '2ª edição, SPC Press',
      tipo: 'livro', area: 'estatistica', acesso: 'pago',
      sustenta: 'A distinção entre causa comum e causa especial, herdada do controle estatístico de processo de Shewhart. É a base do conceito de limite: separar oscilação normal de problema real, e não reagir a ruído.',
      conferido: true
    },

    hyndman2021: {
      autores: 'Hyndman, R. J.; Athanasopoulos, G.',
      ano: 2021,
      titulo: 'Forecasting: Principles and Practice',
      veiculo: '3ª edição, OTexts · livro completo em acesso aberto',
      tipo: 'livro', area: 'estatistica', acesso: 'aberto',
      url: 'https://otexts.com/fpp3/',
      sustenta: 'Método de previsão e, principalmente, intervalo de previsão: uma previsão sem faixa de incerteza transmite confiança que ela não tem. Sustenta o MOD-08 e a leitura de forecast como cenário, não como promessa.',
      conferido: true
    },

    /* ---------------------------------------- engenharia e ciência de dados */
    kimball2013: {
      autores: 'Kimball, R.; Ross, M.',
      ano: 2013,
      titulo: 'The Data Warehouse Toolkit: The Definitive Guide to Dimensional Modeling',
      veiculo: '3ª edição, Wiley',
      tipo: 'livro', area: 'dados', acesso: 'pago',
      sustenta: 'Fato, dimensão, grão e dimensões conformadas. Sustenta os conceitos de dimensão e granularidade do MOD-02, o passo “modelo único de informações” e a possibilidade técnica de drill-down do MOD-06.',
      conferido: true
    },

    dama2017: {
      autores: 'DAMA International',
      ano: 2017,
      titulo: 'DAMA-DMBOK: Data Management Body of Knowledge',
      veiculo: '2ª edição, Technics Publications',
      tipo: 'guia', area: 'dados', acesso: 'pago',
      sustenta: 'Governança, qualidade e definição única de dado, com papéis e responsabilidades. Sustenta o passo de tratamento e validação e a exigência de que um contrato seja o mesmo contrato em todos os sistemas.',
      conferido: true
    },

    crispdm2000: {
      autores: 'Chapman, P. et al.',
      ano: 2000,
      titulo: 'CRISP-DM 1.0: Step-by-step Data Mining Guide',
      veiculo: 'The CRISP-DM Consortium',
      tipo: 'guia', area: 'dados', acesso: 'aberto',
      sustenta: 'O ciclo entendimento do negócio → entendimento dos dados → preparação → modelagem → avaliação → implantação. Sustenta o fluxo “como os dados chegam até a dashboard” e a ideia de que a pergunta de negócio vem antes do dado.',
      conferido: true
    },

    /* ---------------------------------------- gestão e indicadores */
    kaplan1992: {
      autores: 'Kaplan, R. S.; Norton, D. P.',
      ano: 1992,
      titulo: 'The Balanced Scorecard — Measures That Drive Performance',
      veiculo: 'Harvard Business Review, jan–fev 1992, 71–79',
      tipo: 'artigo', area: 'gestao', acesso: 'pago',
      sustenta: 'Que indicador-chave é um conjunto pequeno, ligado a objetivo estratégico e equilibrado entre perspectivas. Sustenta “se tudo é crítico, nada é” e a distinção entre métrica e KPI.',
      conferido: true
    },

    strathern1997: {
      autores: 'Strathern, M.',
      ano: 1997,
      titulo: '“Improving ratings”: audit in the British University system',
      veiculo: 'European Review, 5(3), 305–321',
      tipo: 'artigo', area: 'gestao', acesso: 'pago',
      sustenta: 'A formulação mais citada da Lei de Goodhart: quando uma medida vira meta, ela deixa de ser uma boa medida. Sustenta o erro de definir meta depois de ver o resultado e o risco de indicador que passa a ser manipulado.',
      conferido: true
    },

    pmi2019: {
      autores: 'Project Management Institute',
      ano: 2019,
      titulo: 'The Standard for Earned Value Management',
      veiculo: 'PMI',
      tipo: 'padrão', area: 'gestao', acesso: 'pago',
      sustenta: 'Gerenciamento do valor agregado: comparar progresso físico com custo e prazo consumidos (SPI e CPI) e projetar o resultado no encerramento (EAC). É a formalização do par “progresso × horas” do MOD-04 e da margem prevista do MOD-08.',
      conferido: true
    },

    iso22400: {
      autores: 'ISO',
      ano: 2014,
      titulo: 'ISO 22400-2: Key performance indicators (KPIs) for manufacturing operations management — Part 2: Definitions and descriptions',
      veiculo: 'International Organization for Standardization',
      tipo: 'norma', area: 'gestao', acesso: 'pago',
      sustenta: 'A estrutura formal de definição de um indicador: nome, escopo, fórmula, unidade, faixa, periodicidade e público. É o modelo da “ficha do indicador” proposta no MOD-04.',
      conferido: false
    },

    /* ---------------------------------------- acessibilidade e interface */
    wcag22: {
      autores: 'W3C — Web Accessibility Initiative',
      ano: 2023,
      titulo: 'Web Content Accessibility Guidelines (WCAG) 2.2',
      veiculo: 'Recomendação W3C de 5 de outubro de 2023',
      tipo: 'norma', area: 'acessibilidade', acesso: 'aberto',
      url: 'https://www.w3.org/TR/WCAG22/',
      sustenta: 'Cada item da lista de acessibilidade tem um critério numerado: 1.4.1 uso de cor, 1.4.3 contraste mínimo de 4,5:1, 1.4.11 contraste de elementos não textuais, 2.1.1 teclado, 2.4.7 foco visível e 2.5.8 tamanho de alvo. Transforma recomendação em requisito verificável.',
      conferido: true
    },

    nielsen1994: {
      autores: 'Nielsen, J.',
      ano: 1994,
      titulo: '10 Usability Heuristics for User Interface Design',
      veiculo: 'Nielsen Norman Group',
      tipo: 'guia', area: 'acessibilidade', acesso: 'aberto',
      url: 'https://www.nngroup.com/articles/ten-usability-heuristics/',
      sustenta: 'A primeira heurística — visibilidade do estado do sistema — sustenta a exigência de declarar data da última carga, dados incompletos e períodos não fechados na própria tela.',
      conferido: true
    }
  };

  /* Devolve as obras de um módulo, na ordem em que ele as declarou. */
  function de(pagina) {
    return ((pagina && pagina.fontes) || [])
      .map(function (chave) {
        var obra = OBRAS[chave];
        if (!obra) console.warn('[nexo] fonte desconhecida: "' + chave + '" em ' + (pagina.id || '?'));
        return obra ? Object.assign({ chave: chave }, obra) : null;
      })
      .filter(Boolean);
  }

  /* Todas as obras, agrupadas por área — usado pelo MOD-14. */
  function porArea() {
    return Object.keys(AREAS).map(function (area) {
      return {
        area: area,
        nome: AREAS[area],
        obras: Object.keys(OBRAS)
          .filter(function (c) { return OBRAS[c].area === area; })
          .map(function (c) { return Object.assign({ chave: c }, OBRAS[c]); })
          .sort(function (a, b) { return a.autores.localeCompare(b.autores, 'pt-BR'); })
      };
    });
  }

  /* Em quais módulos uma obra é usada. Depende do APP já estar montado. */
  function modulosDe(chave) {
    return APP.order.filter(function (id) {
      return ((APP.pages[id].fontes) || []).indexOf(chave) >= 0;
    });
  }

  function total() { return Object.keys(OBRAS).length; }
  function pendentes() {
    return Object.keys(OBRAS).filter(function (c) { return !OBRAS[c].conferido; }).length;
  }

  return { areas: AREAS, obras: OBRAS, de: de, porArea: porArea,
           modulosDe: modulosDe, total: total, pendentes: pendentes };
})();
