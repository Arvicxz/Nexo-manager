/* MOD-06 · Filtros e navegação analítica — template: public/pages/filtros.html */
APP.page('filtros', {
  code: 'MOD-06', title: 'Filtros e navegação analítica', nivel: 'Intermediário', tempo: '15 min', rev: 'REV-A',
  desc: 'Filtros globais e locais, drill-down, drill-through, cross-filter, tooltip e breadcrumb.',

  carimbo: {
    desc: 'Filtrar não é enfeite: é o mecanismo que leva a leitura de “a margem caiu” até “o documento DQM-CIV-DE-0142 foi revisado quatro vezes”.',
    pergunta: 'Onde exatamente está o desvio?',
    quem: 'Analistas, coordenadores e gerentes'
  },

  tags: ['filtro global', 'filtro local', 'drill-down', 'drill-through', 'cross-filter', 'tooltip',
         'breadcrumb', 'histórico de filtros', 'navegação'],

  /* Obras que sustentam o que este módulo afirma — ver js/data/fontes.js */
  fontes: ['shneiderman1996', 'kimball2013', 'simpson1951'],

  /* Camadas do catálogo de ferramentas — ver js/data/ferramentas.js */
  ferramentas: ['visualizacao', 'armazenamento'],

  /* Horas por disciplina, por contrato (fictício) — usado só nesta demonstração. */
  horasPorContrato: {
    DQM24001: [2260, 1490, 980, 840, 1130], RFN22001: [820, 640, 510, 470, 600],
    VNT24001: [940, 720, 380, 410, 520],    PTM22001: [1480, 1220, 860, 790, 980],
    PTM23004: [610, 430, 320, 280, 360]
  },

  mount: function (raiz) {
    var d = DATA;
    var horasPorContrato = this.horasPorContrato;
    var st = { cliente: 'todos', saude: 'todos', disciplina: null };

    function filtrados() {
      return d.contratos.filter(function (c) {
        return (st.cliente === 'todos' || c.cliente === st.cliente) &&
               (st.saude === 'todos' || c.saude === st.saude);
      });
    }

    function desenhar() {
      var cs = filtrados();
      var horas = [0, 0, 0, 0, 0];
      cs.forEach(function (c) {
        (horasPorContrato[c.cod] || []).forEach(function (h, i) { horas[i] += h; });
      });

      var receita = cs.reduce(function (a, c) { return a + c.valor; }, 0);
      var margem = cs.length ? cs.reduce(function (a, c) { return a + c.margem * c.valor; }, 0) / (receita || 1) : 0;
      var totalHoras = st.disciplina
        ? horas[d.disciplinas.indexOf(st.disciplina)]
        : horas.reduce(function (a, b) { return a + b; }, 0);

      /* breadcrumb */
      raiz.querySelector('#f-crumb').innerHTML =
        'Empresa &gt; <b>' + (st.cliente === 'todos' ? 'Todos os clientes' : st.cliente) + '</b>' +
        (cs.length === 1 ? ' &gt; <b>' + cs[0].cod + '</b>' : '') +
        (st.disciplina ? ' &gt; <b>' + st.disciplina + '</b>' : '');

      /* chips de filtros ativos */
      var chips = [];
      if (st.cliente !== 'todos') chips.push(['cliente', 'Cliente: ' + st.cliente]);
      if (st.saude !== 'todos') {
        chips.push(['saude', 'Situação: ' + ({ crit: 'Crítico', warn: 'Atenção', ok: 'Dentro da meta' }[st.saude])]);
      }
      if (st.disciplina) chips.push(['disciplina', 'Disciplina: ' + st.disciplina]);

      raiz.querySelector('#f-chips').innerHTML = chips.length
        ? chips.map(function (c) {
            return '<span class="chip">' + c[1] +
                   '<button data-off="' + c[0] + '" aria-label="Remover filtro">×</button></span>';
          }).join('')
        : '<span class="tiny muted">Nenhum filtro ativo — visão consolidada da carteira.</span>';

      /* KPIs do recorte */
      raiz.querySelector('#f-kpis').innerHTML =
        UI.kpi({ label: 'Contratos no recorte', value: String(cs.length),
                 ref: 'de ' + d.contratos.length + ' na carteira', status: 'info' }) +
        UI.kpi({ label: 'Valor contratado', value: 'R$ ' + CH.fmt.n0(receita), unit: ' mil', status: 'info' }) +
        UI.kpi({ label: 'Margem ponderada', value: CH.fmt.pct(margem), meta: '48%',
                 status: margem >= 48 ? 'ok' : margem >= 44 ? 'warn' : 'crit' }) +
        UI.kpi({ label: st.disciplina ? 'Horas · ' + st.disciplina : 'Horas realizadas',
                 value: CH.fmt.n0(totalHoras), status: 'info' });

      /* gráfico com cross-filter */
      raiz.querySelector('#f-chart').innerHTML = CH.bars({
        labels: d.disciplinas, h: 210, fmt: CH.fmt.n0, ids: d.disciplinas,
        series: [{ name: 'Horas', values: horas, color: 'blue' }], label: 'Horas por disciplina'
      });
      raiz.querySelectorAll('#f-chart [data-id]').forEach(function (r) {
        if (st.disciplina && r.dataset.id !== st.disciplina) r.setAttribute('opacity', '.28');
      });

      /* tabela do recorte */
      var linhas = cs.map(function (c) {
        var i = d.disciplinas.indexOf(st.disciplina);
        var h = st.disciplina
          ? (horasPorContrato[c.cod] || [])[i]
          : (horasPorContrato[c.cod] || []).reduce(function (a, b) { return a + b; }, 0);
        return { cod: '<span class="num">' + c.cod + '</span>', cl: c.cliente, h: CH.fmt.n0(h),
                 m: CH.fmt.pct(c.margem),
                 s: UI.badge(c.saude === 'ok' ? 'ok' : c.saude === 'warn' ? 'warn' : 'crit') };
      });

      raiz.querySelector('#f-tab').innerHTML = linhas.length
        ? UI.table({ cols: [{ k: 'cod', l: 'Contrato' }, { k: 'cl', l: 'Cliente' }, { k: 'h', l: 'Horas', num: true },
                            { k: 'm', l: 'Margem', num: true }, { k: 's', l: 'Saúde' }], rows: linhas })
        : '<div class="card"><p class="mb0 small muted">Nenhum contrato atende a este recorte. Remova um filtro para voltar a ver dados.</p></div>';

      raiz.querySelectorAll('#f-chart [data-id]').forEach(function (r) {
        r.addEventListener('click', function () {
          st.disciplina = st.disciplina === r.dataset.id ? null : r.dataset.id;
          desenhar();
        });
      });
      raiz.querySelectorAll('[data-off]').forEach(function (b) {
        b.addEventListener('click', function () {
          var k = b.dataset.off;
          st[k] = k === 'disciplina' ? null : 'todos';
          if (k === 'cliente') raiz.querySelector('#f-cliente').value = 'todos';
          if (k === 'saude') raiz.querySelector('#f-saude').value = 'todos';
          desenhar();
        });
      });
    }

    raiz.querySelector('#f-cliente').addEventListener('change', function (e) { st.cliente = e.target.value; desenhar(); });
    raiz.querySelector('#f-saude').addEventListener('change', function (e) { st.saude = e.target.value; desenhar(); });
    raiz.querySelector('#f-limpar').addEventListener('click', function () {
      st = { cliente: 'todos', saude: 'todos', disciplina: null };
      raiz.querySelector('#f-cliente').value = 'todos';
      raiz.querySelector('#f-saude').value = 'todos';
      desenhar();
    });

    desenhar();
  }
});
