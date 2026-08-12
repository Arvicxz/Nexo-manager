/* MOD-09 · Perfis de gestão — template: public/pages/perfis.html */
APP.page('perfis', {
  code: 'MOD-09', title: 'Perfis de gestão', nivel: 'Intermediário', tempo: '12 min', rev: 'REV-A',
  desc: 'A mesma base de dados, níveis de detalhe diferentes para cada papel.',

  carimbo: {
    desc: 'Mostrar a mesma tela para todos garante que ninguém a use. Cada papel decide sobre coisas diferentes e precisa de níveis de detalhe diferentes.',
    pergunta: 'Quem vai olhar esta tela e o que essa pessoa decide?',
    quem: 'Quem define permissões e visões'
  },

  tags: ['diretoria', 'gerente de engenharia', 'coordenador', 'líder de disciplina', 'financeiro',
         'comercial', 'colaborador', 'cliente', 'perfis', 'permissões'],

  /* Obras que sustentam o que este módulo afirma — ver js/data/fontes.js */
  fontes: ['kimball2013', 'dama2017', 'nielsen1994'],

  /* Camadas do catálogo de ferramentas — ver js/data/ferramentas.js */
  ferramentas: ['visualizacao', 'catalogo'],

  /* Os oito painéis já existem no template: alternar é só mostrar um deles. */
  mount: function (raiz) {
    UI.ligarTabs(raiz, {
      abas: '[data-perfil]', paineis: '[data-painel]',
      atributoAba: 'perfil', atributoPainel: 'painel', prefixo: 'perfis', inicial: 'diretoria'
    });
  }
});
