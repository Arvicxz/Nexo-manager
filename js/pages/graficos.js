/* MOD-05 · Biblioteca de gráficos — template: public/pages/graficos.html */
APP.page('graficos', {
  code: 'MOD-05', title: 'Biblioteca de gráficos', nivel: 'Intermediário', tempo: '20 min', rev: 'REV-A',
  desc: 'Cada gráfico responde a uma pergunta. Galeria com uso, exemplo, interações e erros comuns.',

  carimbo: {
    desc: 'Cada visualização existe para responder a um tipo de pergunta. Escolher o gráfico é escolher a pergunta que a tela vai responder.',
    pergunta: 'Qual gráfico usar aqui?',
    quem: 'Quem desenha dashboards e relatórios'
  },

  tags: ['gráfico de linha', 'barras', 'barras agrupadas', 'barras empilhadas', 'área', 'waterfall', 'cascata',
         'heatmap', 'mapa de calor', 'dispersão', 'scatter', 'bolhas', 'funil', 'gantt', 'bullet chart', 'gauge',
         'velocímetro', 'pizza', 'rosca', 'radar', 'comparador de gráficos'],

  slots: {
    'g-linha': function () {
      return CH.line({ labels: DATA.meses, h: 180, fmt: CH.fmt.pct, min: 40, max: 52, target: 48,
                       series: [{ name: 'Margem', values: DATA.margemPct, color: 'blue' }],
                       label: 'Exemplo de linha' });
    },

    'g-barras': function () {
      return CH.bars({ labels: DATA.disciplinas, h: 180, fmt: CH.fmt.n0,
                       series: [{ name: 'Horas', values: [2260, 1490, 980, 840, 1130], color: 'blue' }],
                       label: 'Exemplo de barras' });
    },

    'g-ranking': function () {
      return CH.bars({ labels: ['DQM24001', 'VNT24001', 'PTM22001', 'RFN22001'], horizontal: true, h: 170,
                       fmt: function (v) { return v + ' d'; },
                       series: [{ name: 'Atraso', values: [12, 9, 2, 0],
                                  colors: ['red', 'amber', 'amber', 'green'] }],
                       label: 'Exemplo de ranking' });
    },

    'g-agrupadas': function () {
      return CH.bars({ labels: DATA.horasDisc.labels, h: 180, fmt: CH.fmt.n0,
                       series: [{ name: 'Orçadas', values: DATA.horasDisc.orcadas, color: 'gray' },
                                { name: 'Realizadas', values: DATA.horasDisc.realizadas, color: 'blue' }],
                       label: 'Exemplo de barras agrupadas' }) +
             CH.legend([{ name: 'Orçadas', color: 'gray' }, { name: 'Realizadas', color: 'blue' }]);
    },

    'g-empilhadas': function () {
      return CH.bars({ labels: DATA.meses, h: 180, mode: 'stack', fmt: CH.fmt.n0,
                       series: [{ name: 'MOD', values: DATA.custoMOD, color: 'blue' },
                                { name: 'CPE', values: DATA.custoCPE, color: 'purple' },
                                { name: 'Despesas', values: DATA.despesas, color: 'gray' }],
                       label: 'Exemplo de barras empilhadas' }) +
             CH.legend([{ name: 'MOD', color: 'blue' }, { name: 'CPE', color: 'purple' },
                        { name: 'Despesas', color: 'gray' }]);
    },

    'g-area': function () {
      return CH.area({ labels: DATA.meses, h: 180, fmt: CH.fmt.n0,
                       series: [{ name: 'Backlog', values: DATA.backlog, color: 'blue' }],
                       label: 'Exemplo de área' });
    },

    'g-cascata': function () {
      return CH.waterfall({ items: DATA.cascata, h: 200, fmt: CH.fmt.n0, label: 'Exemplo de cascata' });
    },

    'g-heatmap': function () {
      return CH.heatmap({
        cols: DATA.capacidade.meses, cw: 58,
        rows: DATA.capacidade.linhas.map(function (l) { return { label: l.disc, v: l.v }; }),
        fmt: function (v) { return v > 0 ? '+' + v : String(v); },
        color: function (v) {
          return v <= -3 ? { fill: 'var(--c-red)', text: '#fff' }
               : v < 0   ? { fill: 'var(--bg-red)', text: 'var(--c-red)' }
               : v === 0 ? { fill: 'var(--bg-gray)', text: '#546678' }
                         : { fill: 'var(--bg-green)', text: 'var(--c-green)' };
        },
        label: 'Exemplo de mapa de calor'
      });
    },

    'g-scatter': function () {
      return CH.scatter({
        h: 260, xMax: 60, yMax: 16, xMin: 30, xLabel: 'Margem prevista (%)', yLabel: 'Atraso (dias)',
        xRef: 48, yRef: 5, xfmt: CH.fmt.pct, yfmt: function (v) { return CH.fmt.n0(v) + 'd'; },
        points: DATA.contratos.map(function (c) {
          return { x: c.margemPrev, y: c.atrasoDias, r: 6 + c.valor / 700, short: c.cod.slice(0, 3),
                   color: c.saude === 'ok' ? 'green' : c.saude === 'warn' ? 'amber' : 'red',
                   label: c.cod + ' · margem ' + c.margemPrev + '% · atraso ' + c.atrasoDias +
                          ' d · R$ ' + c.valor + ' mil' };
        }),
        label: 'Exemplo de bolhas de portfólio'
      });
    },

    'g-funil': function () {
      return CH.funnel({ items: DATA.funil, label: 'Exemplo de funil' });
    },

    'g-gantt': function () {
      return CH.gantt({ cols: ['Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'], cw: 56,
                        tasks: [{ nome: 'Projeto básico', ini: 0, dur: 2, status: 'ok', marco: 2 },
                                { nome: 'Detalhamento civil', ini: 1, dur: 3, status: 'crit' },
                                { nome: 'Emissão para obra', ini: 4, dur: 2, status: 'ok', marco: 5 }],
                        label: 'Exemplo de Gantt' });
    },

    'g-bullet': function () {
      return CH.bullet({ value: 43, target: 48, max: 60, color: 'red', label: 'Margem bruta',
                         valueLabel: '43%', targetLabel: '48%', fmt: CH.fmt.pct,
                         ranges: [{ de: 0, ate: 40, color: 'red' }, { de: 40, ate: 48, color: 'amber' },
                                  { de: 48, ate: 60, color: 'green' }] }) +
             CH.bullet({ value: 88, target: 82, max: 100, color: 'amber', label: 'Taxa de utilização',
                         valueLabel: '88%', targetLabel: '82%', fmt: CH.fmt.pct,
                         ranges: [{ de: 0, ate: 70, color: 'amber' }, { de: 70, ate: 88, color: 'green' },
                                  { de: 88, ate: 100, color: 'red' }] });
    },

    'g-gauge': function () {
      return CH.gauge({ value: 43, max: 60, target: 48, color: 'red',
                        valueLabel: '43%', label: 'Margem · meta 48%' });
    },

    'g-donut': function () {
      return CH.donut({ centro: 'R$ 1.290 mil',
                        slices: [{ rot: 'MOD', v: 651, color: 'blue' }, { rot: 'CPE', v: 158, color: 'purple' },
                                 { rot: 'Despesas', v: 87, color: 'gray' }, { rot: 'Margem', v: 302, color: 'green' }],
                        label: 'Exemplo de rosca' });
    },

    'g-radar': function () {
      return CH.radar({ axes: ['Prazo', 'Qualidade', 'Custo', 'Comunicação', 'Segurança', 'Documentação'],
                        series: [{ name: 'DQM24001', values: [52, 68, 45, 60, 88, 72], color: 'red' }],
                        label: 'Exemplo de radar' });
    }
  },

  /* Comparador: cada opção do select tem um <template data-cmp> com a recomendação. */
  mount: function (raiz) {
    var sel = raiz.querySelector('#cmp-sel');
    var out = raiz.querySelector('#cmp-out');

    function desenhar() {
      var tpl = raiz.querySelector('[data-cmp="' + sel.value + '"]');
      out.replaceChildren(tpl.content.cloneNode(true));
    }

    sel.addEventListener('change', desenhar);
    desenhar();
  }
});
