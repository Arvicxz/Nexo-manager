/* MOD-11 · Boas práticas — template: public/pages/praticas.html */
APP.page('praticas', {
  code: 'MOD-11', title: 'Boas práticas', nivel: 'Básico', tempo: '14 min', rev: 'REV-A',
  desc: 'Hierarquia, consistência, cor com significado, contexto, acessibilidade e responsividade.',

  carimbo: {
    desc: 'Cada par abaixo compara a versão que apenas exibe dados com a versão que permite decidir. A diferença raramente é estética.',
    pergunta: 'Esta tela ajuda ou apenas ocupa espaço?',
    quem: 'Quem projeta e quem aprova dashboards'
  },

  tags: ['boas práticas', 'hierarquia', 'consistência', 'cores', 'semáforo', 'legibilidade', 'contexto',
         'acessibilidade', 'responsividade', 'erros comuns', 'atualização'],

  slots: {
    'pizza-ruim': function () {
      return CH.donut({ w: 190,
        slices: [{ rot: 'A', v: 14, color: 'blue' }, { rot: 'B', v: 13, color: 'green' },
                 { rot: 'C', v: 12, color: 'amber' }, { rot: 'D', v: 11, color: 'red' },
                 { rot: 'E', v: 11, color: 'purple' }, { rot: 'F', v: 10, color: 'gray' },
                 { rot: 'G', v: 10, color: 'blue' }, { rot: 'H', v: 9, color: 'green' }],
        label: 'Pizza com muitas fatias' });
    },

    'barras-ordenadas': function () {
      return CH.bars({ labels: ['CIV', 'TUB', 'MEC', 'INS', 'ELE'], horizontal: true, h: 170, fmt: CH.fmt.n0,
                       series: [{ name: 'Horas', values: [2260, 1490, 1130, 980, 840], color: 'blue' }],
                       label: 'Barras ordenadas' });
    },

    'kpi-completo': function () {
      return UI.kpi({ label: 'Taxa de utilização', value: '88,1', unit: '%', meta: '82%', delta: '+1,2 p.p.',
                      ref: 'risco de sobrecarga', status: 'warn',
                      serie: DATA.utilizacao, sparkColor: 'amber', deltaBom: false });
    },

    'alerta-completo': function () {
      return UI.alerta(DATA.alertas[0]);
    }
  }
});
