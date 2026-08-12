/* MOD-03 · Anatomia de uma dashboard — template: public/pages/anatomia.html */
APP.page('anatomia', {
  code: 'MOD-03', title: 'Anatomia de uma dashboard', nivel: 'Básico', tempo: '15 min', rev: 'REV-A',
  desc: 'As seis camadas de leitura, do contexto até a ação, em uma tela real.',

  carimbo: {
    desc: 'Uma boa tela conduz o olhar em uma ordem: contexto, resumo, comparação, exceção, detalhe e ação. Clique em uma camada para vê-la destacada na dashboard de demonstração.',
    pergunta: 'Em que ordem a tela deve ser lida?',
    quem: 'Quem desenha e quem usa a dashboard'
  },

  tags: ['anatomia', 'camadas', 'layout', 'contexto', 'resumo executivo', 'exceções', 'detalhamento', 'faixas'],

  /* Obras que sustentam o que este módulo afirma — ver js/data/fontes.js */
  fontes: ['shneiderman1996', 'few2013', 'ware2020'],

  /* Camadas do catálogo de ferramentas — ver js/data/ferramentas.js */
  ferramentas: ['visualizacao'],

  slots: {
    'demo-kpis': function () {
      var d = DATA;
      return UI.kpi({ label: 'Receita bruta', value: 'R$ 1.290', unit: ' mil', meta: 'R$ 1.350 mil',
                      delta: '−4,4% vs. jun', ref: 'Acum. R$ 9.060 mil', status: 'warn',
                      serie: d.receita, sparkColor: 'blue', deltaBom: false }) +
             UI.kpi({ label: 'Margem bruta', value: '43,0', unit: '%', meta: '48%', delta: '−1,1 p.p.',
                      ref: '6 meses em queda', status: 'crit',
                      serie: d.margemPct, sparkColor: 'red', deltaBom: false }) +
             UI.kpi({ label: 'Horas realizadas', value: '8.480', meta: '7.650 orçadas', delta: '+10,8%',
                      ref: 'Desvio +830 h', status: 'warn',
                      serie: d.horasReal, sparkColor: 'amber', deltaBom: false }) +
             UI.kpi({ label: 'Taxa de utilização', value: '88,1', unit: '%', meta: '82%', delta: '+1,2 p.p.',
                      ref: 'Risco de sobrecarga', status: 'warn',
                      serie: d.utilizacao, sparkColor: 'amber', deltaBom: false });
    },

    'demo-margem': function () {
      return CH.line({ labels: DATA.meses, target: DATA.metaMargem, targetLabel: 'Meta 48%',
                       fmt: CH.fmt.pct, min: 40, max: 52, h: 220,
                       series: [{ name: 'Margem', values: DATA.margemPct, color: 'red' }],
                       label: 'Margem bruta mensal' });
    },

    'demo-horas': function () {
      return CH.bars({ labels: DATA.meses, h: 220, fmt: CH.fmt.n0,
                       series: [{ name: 'Planejadas', values: DATA.horasPlan, color: 'gray' },
                                { name: 'Realizadas', values: DATA.horasReal, color: 'blue' }],
                       label: 'Horas planejadas e realizadas' }) +
             CH.legend([{ name: 'Planejadas', color: 'gray' }, { name: 'Realizadas', color: 'blue' }]);
    },

    'demo-alertas': function () {
      return UI.alerta(DATA.alertas[0]) + UI.alerta(DATA.alertas[1]);
    },

    'demo-contratos': function () {
      return UI.table({
        caption: 'Contratos fora dos limites — o nível em que a ação começa a ser possível.',
        cols: [{ k: 'c', l: 'Contrato' }, { k: 'cl', l: 'Cliente' }, { k: 'm', l: 'Margem', num: true },
               { k: 'p', l: 'Progresso', num: true }, { k: 'h', l: 'Horas cons.', num: true },
               { k: 'a', l: 'Atraso', num: true }, { k: 's', l: 'Saúde' }],
        rows: DATA.contratos.map(function (c) {
          return { c: '<span class="num">' + c.cod + '</span>', cl: c.cliente, m: CH.fmt.pct(c.margem),
                   p: c.progresso + '%', h: c.horasPct + '%', a: c.atrasoDias + ' d',
                   s: UI.badge(c.saude === 'ok' ? 'ok' : c.saude === 'warn' ? 'warn' : 'crit') };
        })
      });
    },

    'demo-acoes': function () {
      return UI.table({
        caption: 'Plano de ação: o destino final de toda a leitura.',
        cols: [{ k: 'prio', l: 'Prioridade' }, { k: 'alerta', l: 'Alerta' }, { k: 'impacto', l: 'Impacto' },
               { k: 'resp', l: 'Responsável' }, { k: 'prazo', l: 'Prazo' }, { k: 'acao', l: 'Próxima ação' },
               { k: 'status', l: 'Situação' }],
        rows: DATA.acoes
      });
    }
  },

  /* Destaca uma camada na dashboard e mostra o texto correspondente. */
  mount: function (raiz) {
    var descricao = raiz.querySelector('#cam-desc');

    function selecionar(id) {
      raiz.querySelectorAll('[data-cam]').forEach(function (b) {
        b.setAttribute('aria-pressed', String(b.dataset.cam === id));
      });
      raiz.querySelectorAll('.demo-layer').forEach(function (l) {
        l.classList.toggle('hl', l.dataset.layer === id);
      });

      var texto = raiz.querySelector('[data-cam-texto="' + id + '"]');
      descricao.replaceChildren(texto.content.cloneNode(true));
    }

    raiz.querySelectorAll('[data-cam]').forEach(function (b) {
      b.addEventListener('click', function () { selecionar(b.dataset.cam); });
    });

    selecionar('contexto');
  }
});
