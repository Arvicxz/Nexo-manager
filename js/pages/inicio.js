/* MOD-01 · Início — template: public/pages/inicio.html */
APP.page('inicio', {
  code: 'MOD-01', title: 'Início', nivel: 'Introdução', tempo: '5 min',
  desc: 'Visão geral da plataforma e da trilha de aprendizagem.',
  carimbo: false,                                  /* a abertura é o hero, não o carimbo */
  tags: ['início', 'trilha de aprendizagem', 'visão geral', 'mapa'],

  slots: {
    retomar: function () {
      var id = Aprendizado.proximoDaTrilha();
      if (!id) return '<a class="btn" href="#/fundamentos">Explorar módulos</a>';
      return '<a class="btn" href="#/' + id + '">Continuar: ' + UI.esc(APP.pages[id].title) + '</a>';
    },

    /* Um cartão por módulo registrado, exceto o próprio Início. */
    modulos: function () {
      return APP.order.filter(function (id) { return id !== 'inicio'; }).map(function (id) {
        var p = APP.pages[id];
        return '<a class="card clickable" href="#/' + id + '" style="text-decoration:none">' +
          '<p class="eyebrow">' + UI.esc(p.code) + ' · ' + UI.esc(p.nivel) + ' · ' + UI.esc(p.tempo) + '</p>' +
          '<h3 style="margin:6px 0 6px">' + UI.esc(p.title) + '</h3>' +
          '<p class="small muted" style="margin:0">' + UI.esc(p.desc) + '</p>' +
          '<p class="module-result">Ao final: ' + UI.esc((Aprendizado.modulo(id) || {}).objetivo || '') + '</p>' +
          '<p class="small" style="margin:12px 0 0;color:var(--c-blue)" data-status="' + id + '">' +
            (Progresso.concluido(id) ? 'Revisar módulo ✓' : 'Abrir módulo →') + '</p>' +
        '</a>';
      }).join('');
    }
  },

  mount: function (raiz) {
    var feedback = raiz.querySelector('[data-trilha-feedback]');

    function selecionar(id) {
      var trilha = Aprendizado.trilhas[id];
      if (!trilha) return;
      Progresso.escolherTrilha(id);
      raiz.querySelectorAll('[data-trilha]').forEach(function (botao) {
        botao.setAttribute('aria-pressed', String(botao.dataset.trilha === id));
      });
      var proximo = Aprendizado.proximoDaTrilha();
      feedback.hidden = false;
      feedback.innerHTML = '<div><p class="eyebrow">Trilha selecionada</p><strong>' + UI.esc(trilha.nome) + '</strong>' +
        '<span>' + UI.esc(trilha.resultado) + '</span></div>' +
        '<a class="btn btn-primary" href="#/' + proximo + '">Começar por ' + UI.esc(APP.pages[proximo].title) + ' →</a>';
    }

    raiz.querySelectorAll('[data-trilha]').forEach(function (botao) {
      botao.addEventListener('click', function () { selecionar(botao.dataset.trilha); });
    });

    if (Progresso.trilha()) selecionar(Progresso.trilha());
  }
});
