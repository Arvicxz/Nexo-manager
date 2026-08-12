/* MOD-08 · Planejamento e forecast — template: public/pages/planejamento.html */
APP.page('planejamento', {
  code: 'MOD-08', title: 'Planejamento e forecast', nivel: 'Avançado', tempo: '18 min', rev: 'REV-A',
  desc: 'Planejado, realizado e previsto — e o que muda quando um parâmetro muda.',

  carimbo: {
    desc: 'Sem previsão, a gestão fica presa ao passado: descobre o prejuízo no encerramento do contrato, quando nenhuma decisão ainda é possível.',
    pergunta: 'Como este contrato vai terminar?',
    quem: 'Coordenadores, gerentes e diretoria'
  },

  tags: ['planejado', 'realizado', 'forecast', 'previsão', 'margem prevista', 'custo final',
         'data de conclusão', 'risco', 'caixa projetado'],

  /* Obras que sustentam o que este módulo afirma — ver js/data/fontes.js */
  fontes: ['hyndman2021', 'pmi2019'],

  /* Camadas do catálogo de ferramentas — ver js/data/ferramentas.js */
  ferramentas: ['previsao', 'projetos'],

  /* Premissas do cenário simulado (contrato DQM24001). */
  base: { receita: 4200, incorrido: 2148, horasFeitas: 6700, prazoMeses: 5, jornada: 176 },

  mount: function (raiz) {
    var B = this.base;
    var meses = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];
    var ids = ['horas', 'ch', 'eq', 'ext', 'adit'];
    var padrao = { horas: 3800, ch: 120, eq: 5, ext: 0, adit: 0 };
    var nomes = { horas: 'horas restantes', ch: 'custo-hora', eq: 'equipe', ext: 'custo externo', adit: 'receita adicional' };
    var anterior = null;

    function val(k) { return +raiz.querySelector('#p-' + k).value; }

    function calcular() {
      var horas = val('horas'), ch = val('ch'), eq = val('eq'), ext = val('ext'), adit = val('adit');
      var custoTotal = B.incorrido + (horas * ch / 1000) + ext;
      var receita = B.receita + adit;
      var margem = (receita - custoTotal) / receita * 100;
      var mesesNec = horas / (eq * B.jornada);
      var atrasoMeses = mesesNec - B.prazoMeses;

      return {
        horas: horas, ch: ch, eq: eq, ext: ext, adit: adit,
        custoTotal: custoTotal, receita: receita, margem: margem,
        mesesNec: mesesNec, atrasoMeses: atrasoMeses,
        equipeNec: Math.ceil(horas / (B.prazoMeses * B.jornada)),
        horasTotais: B.horasFeitas + horas,
        risco: (margem < 40 ? 2 : margem < 48 ? 1 : 0) + (atrasoMeses > 0.5 ? 2 : atrasoMeses > 0 ? 1 : 0)
      };
    }

    function desenhar(origem) {
      var r = calcular();

      ids.forEach(function (k) {
        raiz.querySelector('#v-' + k).textContent =
          k === 'horas' ? CH.fmt.n0(r.horas) + ' h' :
          k === 'ch' ? 'R$ ' + r.ch :
          k === 'eq' ? r.eq + ' pessoas' : 'R$ ' + r[k] + ' mil';
      });

      var st = r.margem >= 48 ? 'ok' : r.margem >= 40 ? 'warn' : 'crit';
      var stPrazo = r.atrasoMeses <= 0 ? 'ok' : r.atrasoMeses <= 0.5 ? 'warn' : 'crit';
      var conclusao = meses[Math.min(11, 6 + Math.round(r.mesesNec))] + '/2026' +
                      (6 + r.mesesNec > 11 ? ' ou depois' : '');

      raiz.querySelector('#p-kpis').innerHTML =
        UI.kpi({ label: 'Margem prevista', value: CH.fmt.pct(r.margem), meta: '48%', status: st,
                 ref: 'Custo total R$ ' + CH.fmt.n0(r.custoTotal) + ' mil' }) +
        UI.kpi({ label: 'Conclusão provável', value: conclusao, meta: 'dez/2026', status: stPrazo,
                 ref: CH.fmt.n1(r.mesesNec) + ' meses de trabalho restante' }) +
        UI.kpi({ label: 'Equipe necessária', value: String(r.equipeNec), unit: ' pessoas',
                 meta: r.eq + ' alocadas', status: r.equipeNec > r.eq ? 'crit' : 'ok',
                 ref: r.equipeNec > r.eq ? 'faltam ' + (r.equipeNec - r.eq) : 'suficiente' }) +
        UI.kpi({ label: 'Horas ao término', value: CH.fmt.n0(r.horasTotais), meta: '9.400 orçadas',
                 status: r.horasTotais > 9400 ? 'crit' : 'ok',
                 ref: CH.fmt.pct((r.horasTotais / 9400 - 1) * 100) + ' de desvio' });

      var plan = [], real = [], fore = [];
      for (var i = 0; i < 12; i++) {
        plan.push(+(2450 * (i + 1) / 12).toFixed(0));
        real.push(i <= 6 ? +(B.incorrido * (i + 1) / 7).toFixed(0) : null);
        fore.push(i < 6 ? null : +(B.incorrido + (r.custoTotal - B.incorrido) * (i - 6) / 5).toFixed(0));
      }

      raiz.querySelector('#p-chart').innerHTML = CH.line({
        labels: meses, h: 230, fmt: CH.fmt.n0, everyN: 1,
        series: [{ name: 'Planejado', values: plan, color: 'gray', dash: true },
                 { name: 'Realizado', values: real, color: 'blue' },
                 { name: 'Forecast', values: fore, color: 'purple', dash: true }],
        label: 'Custo acumulado planejado, realizado e previsto'
      });

      var diag = r.risco >= 3 ? ['crit', 'Risco alto']
               : r.risco >= 1 ? ['warn', 'Risco moderado'] : ['ok', 'Sob controle'];

      raiz.querySelector('#p-diag').innerHTML =
        UI.badge(diag[0], diag[1]) + ' ' +
        '<p class="small" style="margin:10px 0 0">' +
        (r.margem < 40 ? 'Margem prevista abaixo do limite crítico de 40%. ' : '') +
        (r.atrasoMeses > 0 ? 'Com ' + r.eq + ' pessoas, a conclusão ultrapassa o prazo contratual em ' +
                             CH.fmt.n1(r.atrasoMeses) + ' mês(es). ' : '') +
        (r.equipeNec > r.eq ? 'Seriam necessárias ' + r.equipeNec + ' pessoas para terminar dentro do prazo. ' : '') +
        (r.adit > 0 ? 'O aditivo de R$ ' + r.adit + ' mil recompõe ' +
                      CH.fmt.n1((r.adit / r.receita) * 100) + ' pontos de receita. ' : '') +
        (r.risco === 0 ? 'Margem e prazo dentro dos limites com a equipe atual.' : '') +
        '</p>';

      var mudou = raiz.querySelector('#p-change');
      if (!anterior || !origem) {
        mudou.innerHTML = '<span class="eyebrow">O que mudou</span><p>Altere uma premissa para comparar o efeito no resultado.</p>';
      } else if (origem === 'reset') {
        mudou.innerHTML = '<span class="eyebrow">Cenário restaurado</span><p>As premissas voltaram aos valores iniciais.</p>';
      } else {
        var dm = r.margem - anterior.margem;
        var dc = r.custoTotal - anterior.custoTotal;
        var dp = r.mesesNec - anterior.mesesNec;
        mudou.innerHTML = '<span class="eyebrow">O que mudou · ' + UI.esc(nomes[origem]) + '</span><p>' +
          'Margem ' + (dm >= 0 ? 'subiu ' : 'caiu ') + '<strong>' + CH.fmt.n1(Math.abs(dm)) + ' p.p.</strong>; ' +
          'custo final ' + (dc >= 0 ? 'aumentou ' : 'reduziu ') + '<strong>R$ ' + CH.fmt.n0(Math.abs(dc)) + ' mil</strong>; ' +
          'duração restante ' + (dp >= 0 ? 'aumentou ' : 'reduziu ') + '<strong>' + CH.fmt.n1(Math.abs(dp)) + ' mês(es)</strong>.</p>';
      }
      anterior = r;
    }

    ids.forEach(function (k) {
      raiz.querySelector('#p-' + k).addEventListener('input', function () { desenhar(k); });
    });
    raiz.querySelector('#p-reset').addEventListener('click', function () {
      ids.forEach(function (k) { raiz.querySelector('#p-' + k).value = padrao[k]; });
      desenhar('reset');
    });

    desenhar();
  }
});
