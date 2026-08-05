/* MOD-10 · Estudo de caso — template: public/pages/estudos.html */
APP.page('estudos', {
  code: 'MOD-10', title: 'Estudo de caso', nivel: 'Avançado', tempo: '20 min', rev: 'REV-A',
  desc: 'Da margem de 43% até um plano de ação com responsável e prazo, passo a passo.',

  carimbo: {
    titulo: 'Estudo de caso · DQM24001',
    desc: 'Uma investigação completa, do indicador consolidado até a ação com responsável e prazo. Avance um passo por vez e observe como cada tela responde a uma pergunta nova.',
    pergunta: 'Por que a margem caiu, e o que fazer a respeito?',
    quem: 'Todos os perfis de gestão'
  },

  tags: ['estudo de caso', 'investigação', 'análise', 'cpl24001', 'plano de ação', 'causa raiz', 'drill-down'],

  slots: {
    'passo-margem': function () {
      return CH.line({ labels: DATA.meses, h: 200, fmt: CH.fmt.pct, min: 40, max: 52, target: 48,
                       series: [{ name: 'Margem', values: DATA.margemPct, color: 'red' }],
                       label: 'Margem da carteira' });
    },

    'passo-contratos': function () {
      return CH.bars({
        labels: DATA.contratos.map(function (c) { return c.cod; }), horizontal: true, h: 200, fmt: CH.fmt.pct,
        series: [{ name: 'Margem',
                   values: DATA.contratos.map(function (c) { return c.margem; }),
                   colors: DATA.contratos.map(function (c) {
                     return c.saude === 'ok' ? 'green' : c.saude === 'warn' ? 'amber' : 'red';
                   }) }],
        label: 'Margem por contrato'
      });
    },

    'passo-progresso': function () {
      var c = DATA.caso;
      return CH.line({ labels: DATA.meses, h: 200, fmt: CH.fmt.pct, max: 80,
                       series: [{ name: 'Progresso planejado', values: c.progressoPlan, color: 'gray', dash: true },
                                { name: 'Progresso realizado', values: c.progressoReal, color: 'blue' },
                                { name: 'Horas consumidas', values: c.horasAcum, color: 'red' }],
                       label: 'Progresso e horas do DQM24001' }) +
             CH.legend([{ name: 'Progresso planejado', color: 'gray' },
                        { name: 'Progresso realizado', color: 'blue' },
                        { name: 'Horas consumidas', color: 'red' }]);
    },

    'passo-disciplina': function () {
      return CH.bars({ labels: DATA.horasDisc.labels, h: 200, fmt: CH.fmt.n0,
                       series: [{ name: 'Orçadas', values: DATA.horasDisc.orcadas, color: 'gray' },
                                { name: 'Realizadas', values: DATA.horasDisc.realizadas, color: 'blue' }],
                       label: 'Horas por disciplina' }) +
             CH.legend([{ name: 'Orçadas', color: 'gray' }, { name: 'Realizadas', color: 'blue' }]);
    },

    'passo-revisoes': function () {
      return UI.table({ cols: [{ k: 'doc', l: 'Documento' }, { k: 'revisoes', l: 'Revisões', num: true },
                               { k: 'motivo', l: 'Motivo predominante' }],
                        rows: DATA.caso.docsRevisao });
    },

    'passo-capacidade': function () {
      return CH.heatmap({
        cols: DATA.capacidade.meses, cw: 62,
        rows: DATA.capacidade.linhas.map(function (l) { return { label: l.disc, v: l.v }; }),
        fmt: function (v) { return v > 0 ? '+' + v : String(v); },
        color: function (v) {
          return v <= -3 ? { fill: 'var(--c-red)', text: '#fff' }
               : v < 0   ? { fill: 'var(--bg-red)', text: 'var(--c-red)' }
               : v === 0 ? { fill: 'var(--bg-gray)', text: '#546678' }
                         : { fill: 'var(--bg-green)', text: 'var(--c-green)' };
        },
        label: 'Capacidade por disciplina'
      });
    }
  },

  /* Investigação guiada: revela um passo por vez. */
  mount: function (raiz) {
    var passos = raiz.querySelectorAll('[data-passo]');
    var total = passos.length;
    var vazio = raiz.querySelector('#caso-vazio');
    var cont = raiz.querySelector('#caso-cont');
    var fim = raiz.querySelector('#caso-fim');
    var btnNext = raiz.querySelector('#caso-next');
    var atual = 1;

    function desenhar() {
      passos.forEach(function (p) { p.hidden = +p.dataset.passo > atual; });
      vazio.hidden = atual !== 0;
      cont.textContent = atual + ' de ' + total + ' passos';
      btnNext.disabled = atual >= total;
      fim.hidden = atual < total;
    }

    btnNext.addEventListener('click', function () { if (atual < total) { atual++; desenhar(); } });
    raiz.querySelector('#caso-all').addEventListener('click', function () { atual = total; desenhar(); });
    raiz.querySelector('#caso-reset').addEventListener('click', function () { atual = 0; desenhar(); });

    desenhar();
  }
});
