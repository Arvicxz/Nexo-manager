/* MOD-04 · Métricas e indicadores — template: public/pages/indicadores.html */
APP.page('indicadores', {
  code: 'MOD-04', title: 'Métricas e indicadores', nivel: 'Intermediário', tempo: '25 min', rev: 'REV-A',
  desc: 'Indicadores financeiros, de contratos, de equipe e de clientes — com fórmula, leitura e ação.',

  carimbo: {
    desc: 'Cada indicador aqui traz fórmula, leitura em três cenários, causas típicas e ação recomendada. Um indicador sem ação associada é decoração.',
    pergunta: 'O que este número quer dizer e o que fazer com ele?',
    quem: 'Coordenadores, gerentes, financeiro'
  },

  tags: ['receita bruta', 'receita faturada', 'receita recebida', 'margem bruta', 'mod sobre receita', 'cpe sobre receita',
         'backlog', 'prazo médio de recebimento', 'margem prevista', 'progresso físico', 'consumo de horas',
         'eficiência de horas', 'desvio de prazo', 'marcos', 'forecast de conclusão', 'retrabalho',
         'taxa de aprovação na primeira emissão', 'taxa de utilização', 'alocação', 'superalocação', 'subalocação',
         'capacidade mix', 'cumprimento de apontamento', 'produtividade', 'sla', 'satisfação do cliente',
         'taxa de aceite', 'alterações de escopo'],

  /* Obras que sustentam o que este módulo afirma — ver js/data/fontes.js */
  fontes: ['kaplan1992', 'pmi2019', 'iso22400', 'strathern1997'],

  /* Camadas do catálogo de ferramentas — ver js/data/ferramentas.js */
  ferramentas: ['semantica', 'projetos', 'estatistica'],

  slots: {
    /* ------------------------------------------------ financeiros */
    'ind-receita': function () {
      return CH.line({ labels: DATA.meses, h: 200, fmt: function (v) { return 'R$ ' + CH.fmt.n0(v); },
                       series: [{ name: 'Receita', values: DATA.receita, color: 'blue', area: true }],
                       label: 'Receita mensal' });
    },

    'ind-receitas': function () {
      return CH.line({ labels: DATA.meses, h: 200, fmt: function (v) { return 'R$ ' + CH.fmt.n0(v); },
                       series: [{ name: 'Produzida', values: DATA.receita, color: 'blue' },
                                { name: 'Faturada', values: DATA.faturado, color: 'purple' },
                                { name: 'Recebida', values: DATA.recebido, color: 'green' }],
                       label: 'Receita produzida, faturada e recebida' }) +
             CH.legend([{ name: 'Produzida', color: 'blue' }, { name: 'Faturada', color: 'purple' },
                        { name: 'Recebida', color: 'green' }]);
    },

    'ind-margem': function () {
      return CH.line({ labels: DATA.meses, h: 200, min: 40, max: 52, fmt: CH.fmt.pct,
                       target: 48, targetLabel: 'Meta 48%',
                       series: [{ name: 'Margem', values: DATA.margemPct, color: 'red' }],
                       label: 'Margem bruta mensal' });
    },

    'ind-cascata': function () {
      return CH.waterfall({ items: DATA.cascata, h: 250, fmt: CH.fmt.n0, label: 'Composição do resultado' });
    },

    'ind-mod': function () {
      var pct = DATA.custoMOD.map(function (v, i) { return +(v / DATA.receita[i] * 100).toFixed(1); });
      return CH.bars({ labels: DATA.meses, h: 190, fmt: CH.fmt.pct, target: 45,
                       series: [{ name: 'MOD/Receita', values: pct, color: 'amber' }],
                       label: 'MOD sobre receita' });
    },

    'ind-cpe': function () {
      var pct = DATA.custoCPE.map(function (v, i) { return +(v / DATA.receita[i] * 100).toFixed(1); });
      return CH.bars({ labels: DATA.meses, h: 190, fmt: CH.fmt.pct,
                       series: [{ name: 'CPE/Receita', values: pct, color: 'purple' }],
                       label: 'CPE sobre receita' });
    },

    'ind-backlog': function () {
      return CH.area({ labels: DATA.meses, h: 190, fmt: function (v) { return 'R$ ' + CH.fmt.n0(v); },
                       series: [{ name: 'Backlog', values: DATA.backlog, color: 'blue' }],
                       label: 'Backlog acumulado' });
    },

    'ind-futuro': function () {
      return CH.gauge({ value: 43, max: 60, target: 38, color: 'amber',
                        valueLabel: '43 d', label: 'Prazo médio · meta 38 d' }) +
             CH.bullet({ value: 38, target: 48, max: 60, color: 'red',
                         label: 'Margem prevista no encerramento · DQM24001',
                         valueLabel: '38%', targetLabel: '48%', fmt: CH.fmt.pct,
                         ranges: [{ de: 0, ate: 40, color: 'red' }, { de: 40, ate: 48, color: 'amber' },
                                  { de: 48, ate: 60, color: 'green' }] });
    },

    /* ------------------------------------------------ contratos */
    'ind-progresso': function () {
      var c = DATA.caso;
      return CH.line({ labels: DATA.meses, h: 220, fmt: CH.fmt.pct, max: 80,
                       series: [{ name: 'Progresso planejado', values: c.progressoPlan, color: 'gray', dash: true },
                                { name: 'Progresso realizado', values: c.progressoReal, color: 'blue' },
                                { name: 'Horas consumidas', values: c.horasAcum, color: 'red' }],
                       label: 'Progresso e horas' }) +
             CH.legend([{ name: 'Progresso planejado', color: 'gray' },
                        { name: 'Progresso realizado', color: 'blue' },
                        { name: 'Horas consumidas', color: 'red' }]);
    },

    'ind-horas-disc': function () {
      return CH.bars({ labels: DATA.horasDisc.labels, h: 220, fmt: CH.fmt.n0,
                       series: [{ name: 'Orçadas', values: DATA.horasDisc.orcadas, color: 'gray' },
                                { name: 'Realizadas', values: DATA.horasDisc.realizadas, color: 'blue' }],
                       label: 'Horas por disciplina' }) +
             CH.legend([{ name: 'Orçadas', color: 'gray' }, { name: 'Realizadas', color: 'blue' }]);
    },

    'ind-gantt': function () {
      return CH.gantt({ cols: ['Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'], cw: 66,
                        tasks: [{ nome: 'Projeto básico', ini: 0, dur: 2, status: 'ok', marco: 2, tip: 'concluído' },
                                { nome: 'Detalhamento civil', ini: 1, dur: 3, status: 'crit', tip: '12 dias de atraso' },
                                { nome: 'Detalhamento tubulação', ini: 2, dur: 2, status: 'warn', tip: '2 dias de atraso' },
                                { nome: 'Emissão para obra', ini: 4, dur: 2, status: 'ok', marco: 5, tip: 'marco contratual' }],
                        label: 'Cronograma do contrato' });
    },

    'ind-docs-revisao': function () {
      return UI.table({ cols: [{ k: 'doc', l: 'Documento' }, { k: 'revisoes', l: 'Revisões', num: true },
                               { k: 'motivo', l: 'Motivo predominante' }],
                        rows: DATA.caso.docsRevisao });
    },

    /* ------------------------------------------------ equipe */
    'ind-utilizacao': function () {
      return CH.line({ labels: DATA.meses, h: 200, fmt: CH.fmt.pct, min: 70, max: 95,
                       target: 82, targetLabel: 'Meta 82%',
                       series: [{ name: 'Utilização', values: DATA.utilizacao, color: 'amber' }],
                       label: 'Taxa de utilização' });
    },

    'ind-capacidade': function () {
      return CH.heatmap({
        cols: DATA.capacidade.meses, cw: 62,
        rows: DATA.capacidade.linhas.map(function (l) { return { label: l.disc, v: l.v }; }),
        fmt: function (v) { return v > 0 ? '+' + v : String(v); },
        tip: function (v) {
          return v < 0 ? Math.abs(v) + ' pessoas faltando'
               : v > 0 ? v + ' pessoas disponíveis' : 'equilibrado';
        },
        color: function (v) {
          if (v <= -3) return { fill: 'var(--c-red)', text: '#fff' };
          if (v < 0)   return { fill: 'var(--bg-red)', text: 'var(--c-red)' };
          if (v === 0) return { fill: 'var(--bg-gray)', text: '#546678' };
          return { fill: 'var(--bg-green)', text: 'var(--c-green)' };
        },
        label: 'Capacidade por disciplina e mês'
      });
    },

    /* ------------------------------------------------ clientes */
    'ind-radar': function () {
      return CH.radar({ axes: ['Prazo', 'Qualidade', 'Custo', 'Comunicação', 'Segurança', 'Documentação'],
                        series: [{ name: 'DQM24001', values: [52, 68, 45, 60, 88, 72], color: 'red' },
                                 { name: 'Média da carteira', values: [78, 82, 76, 74, 90, 80], color: 'blue' }],
                        label: 'Avaliação qualitativa do contrato' }) +
             CH.legend([{ name: 'DQM24001', color: 'red' }, { name: 'Média da carteira', color: 'blue' }]);
    },

    'ind-pendencias': function () {
      return CH.bars({ labels: ['DQM24001', 'VNT24001', 'PTM22001', 'RFN22001'], horizontal: true,
                       h: 170, fmt: CH.fmt.n0,
                       series: [{ name: 'Pendências', values: [4, 6, 2, 1],
                                  colors: ['red', 'red', 'amber', 'green'] }],
                       label: 'Pendências por contrato' });
    }
  },

  /* Abas dos quatro painéis. */
  mount: function (raiz) {
    UI.ligarTabs(raiz, {
      abas: '[data-tab]', paineis: '[data-panel]',
      atributoAba: 'tab', atributoPainel: 'panel', prefixo: 'indicadores', inicial: 'fin'
    });
  }
});
