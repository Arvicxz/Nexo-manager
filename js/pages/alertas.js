/* MOD-07 · Alertas e tomada de decisão — template: public/pages/alertas.html */
APP.page('alertas', {
  code: 'MOD-07', title: 'Alertas e tomada de decisão', nivel: 'Intermediário', tempo: '15 min', rev: 'REV-A',
  desc: 'Regras de exceção que apontam limite, impacto, responsável, prazo e ação.',

  carimbo: {
    desc: 'O alerta é o ponto em que a dashboard deixa de informar e passa a cobrar. Sem responsável e prazo, ele é apenas uma cor na tela.',
    pergunta: 'Quem precisa agir, e até quando?',
    quem: 'Gestores e coordenadores'
  },

  tags: ['alerta', 'exceção', 'limite', 'responsável', 'prazo', 'plano de ação', 'prioridade', 'semáforo', 'decisão'],

  /* Obras que sustentam o que este módulo afirma — ver js/data/fontes.js */
  fontes: ['wheeler2000', 'kaplan1992'],

  /* Camadas do catálogo de ferramentas — ver js/data/ferramentas.js */
  ferramentas: ['alertas'],

  slots: {
    'lista-alertas': function () {
      return DATA.alertas.map(function (a, i) {
        return '<div data-al="' + i + '">' + UI.alerta(a) +
          '<div class="row" style="margin-top:-8px;padding:0 4px 4px">' +
            '<button class="btn btn-sm" type="button" data-ack="' + i + '">Reconhecer</button>' +
            '<button class="btn btn-sm" type="button" data-done="' + i + '">Marcar como resolvido</button>' +
          '</div></div>';
      }).join('');
    },

    'plano-acao': function () {
      return UI.table({
        cols: [{ k: 'prio', l: 'Prioridade' }, { k: 'alerta', l: 'Alerta' }, { k: 'impacto', l: 'Impacto' },
               { k: 'resp', l: 'Responsável' }, { k: 'prazo', l: 'Prazo' }, { k: 'acao', l: 'Próxima ação' },
               { k: 'status', l: 'Situação' }],
        rows: DATA.acoes
      });
    }
  },

  mount: function (raiz) {
    function marcar(i, texto, kind) {
      var bloco = raiz.querySelector('[data-al="' + i + '"]');
      var dd = bloco.querySelectorAll('.alert-grid dd');
      var ultimo = dd[dd.length - 1];
      ultimo.innerHTML = ultimo.textContent.split(' · ')[0] + ' · ' + texto;
      bloco.querySelector('.alert-head .badge').outerHTML = UI.badge(kind, texto);
    }

    raiz.querySelectorAll('[data-ack]').forEach(function (b) {
      b.addEventListener('click', function () { marcar(b.dataset.ack, 'Reconhecido', 'info'); });
    });
    raiz.querySelectorAll('[data-done]').forEach(function (b) {
      b.addEventListener('click', function () { marcar(b.dataset.done, 'Resolvido', 'ok'); });
    });
  }
});
