/* MOD-02 · Fundamentos — template: public/pages/fundamentos.html */
APP.page('fundamentos', {
  code: 'MOD-02', title: 'Fundamentos', nivel: 'Básico', tempo: '12 min', rev: 'REV-A',
  desc: 'Dado, métrica, indicador, KPI, índice, meta, limite, parâmetro, benchmark, forecast e alerta.',

  carimbo: {
    desc: 'Antes de desenhar telas, é preciso separar o que é dado, o que é medição e o que realmente merece o nome de indicador-chave.',
    pergunta: 'O que estou medindo, afinal?',
    quem: 'Todos os perfis'
  },

  tags: ['dado', 'métrica', 'indicador', 'kpi', 'índice', 'meta', 'limite', 'parâmetro',
         'dimensão', 'benchmark', 'forecast', 'alerta', 'origem dos dados', 'sgd', 'rat'],

  /* Obras que sustentam o que este módulo afirma — ver js/data/fontes.js */
  fontes: ['kaplan1992', 'kimball2013', 'wheeler2000', 'strathern1997', 'crispdm2000'],

  /* Camadas do catálogo de ferramentas — ver js/data/ferramentas.js */
  ferramentas: ['origem', 'ingestao', 'semantica', 'qualidade']
});
