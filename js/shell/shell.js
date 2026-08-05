/* =====================================================================
   shell.js — a casca da aplicação: índice lateral, busca global,
   menu de telas pequenas, progresso de leitura e partida do router.

   A casca nunca conhece o conteúdo dos módulos: ela lê o registro
   (APP) e reage ao evento "nexo:rota" emitido pelo router.
   ===================================================================== */
(function () {

  /* ---------------- índice lateral ---------------- */
  function montarNav() {
    document.getElementById('nav-list').innerHTML = APP.order.map(function (id) {
      var p = APP.pages[id];
      return '<li><a class="nav-link" data-id="' + id + '" href="#/' + id + '">' +
        '<span class="nav-code">' + UI.esc(p.code.replace('MOD-', '')) + '</span>' +
        '<span>' + UI.esc(p.title) + '</span></a></li>';
    }).join('');
  }

  /* ---------------- progresso de leitura ---------------- */
  function pintarProgresso() {
    var feitos = Progresso.ler();
    var habilidades = Progresso.competencias();
    var total = APP.order.length;
    var totalHabilidades = Object.keys(Aprendizado.competencias).length;
    var pct = Math.round(((feitos.length / total) * .65 + (habilidades.length / totalHabilidades) * .35) * 100);

    document.querySelectorAll('.nav-link').forEach(function (a) {
      a.classList.toggle('done', feitos.indexOf(a.dataset.id) >= 0);
    });
    document.getElementById('prog-bar').style.width = pct + '%';
    document.getElementById('prog-text').textContent =
      feitos.length + ' ' + (feitos.length === 1 ? 'módulo' : 'módulos') + ' · ' +
      habilidades.length + ' ' + (habilidades.length === 1 ? 'competência' : 'competências');
    document.getElementById('skill-list').innerHTML = Object.keys(Aprendizado.competencias).map(function (id) {
      var c = Aprendizado.competencias[id];
      return '<span class="skill-dot ' + (habilidades.indexOf(id) >= 0 ? 'done' : '') + '" title="' +
        UI.esc(c.desc) + '"><i aria-hidden="true"></i>' + UI.esc(c.nome) + '</span>';
    }).join('');
  }

  function ligarConclusao() {
    document.addEventListener('click', function (e) {
      var botao = e.target.closest('[data-concluir]');
      if (!botao) return;

      var feito = Progresso.alternar(botao.dataset.concluir);
      botao.textContent = feito ? 'Módulo concluído ✓' : 'Marcar módulo como concluído';
      botao.setAttribute('aria-pressed', String(feito));
    });

    document.getElementById('btn-reset').addEventListener('click', function () {
      Progresso.limpar();
      Router.ir();                       /* redesenha a paginação do módulo aberto */
    });

    Progresso.aoMudar(pintarProgresso);
  }

  /* ---------------- busca global ---------------- */
  function montarBusca() {
    var input = document.getElementById('busca');
    var caixa = document.getElementById('busca-resultados');
    var envoltorio = document.getElementById('busca-wrap');
    var alternador = document.getElementById('btn-search');
    var ativo = -1;

    function fechar() {
      caixa.hidden = true;
      caixa.innerHTML = '';
      ativo = -1;
      input.setAttribute('aria-expanded', 'false');
      input.removeAttribute('aria-activedescendant');
    }

    function alternarBusca(abrir) {
      envoltorio.classList.toggle('open', abrir);
      alternador.setAttribute('aria-expanded', String(abrir));
      alternador.setAttribute('aria-label', abrir ? 'Fechar busca' : 'Abrir busca');
      if (abrir) input.focus(); else fechar();
    }

    function ativar(indice) {
      var opcoes = Array.prototype.slice.call(caixa.querySelectorAll('[role="option"]'));
      if (!opcoes.length) return;
      ativo = (indice + opcoes.length) % opcoes.length;
      opcoes.forEach(function (opcao, i) {
        opcao.setAttribute('aria-selected', String(i === ativo));
      });
      input.setAttribute('aria-activedescendant', opcoes[ativo].id);
      opcoes[ativo].scrollIntoView({ block: 'nearest' });
    }

    input.addEventListener('input', function () {
      var q = input.value.trim();
      if (q.length < 2) return fechar();

      var achados = Aprendizado.buscar(q);

      caixa.hidden = false;
      input.setAttribute('aria-expanded', 'true');
      ativo = -1;
      caixa.innerHTML = achados.length
        ? achados.map(function (a, i) {
            return '<a id="busca-opcao-' + i + '" role="option" aria-selected="false" href="#/' + a.id + '">' +
                   '<strong>' + UI.esc(a.termo) + '</strong><span class="sr-mod">' + UI.esc(a.mod) + '</span>' +
                   '<span class="search-snippet">' + UI.esc(a.trecho) + '</span></a>';
          }).join('')
        : '<p class="search-empty">Nada encontrado para “' + UI.esc(q) +
          '”. Tente uma intenção, como “comparar”, “investigar causa” ou “prever prazo”.</p>';
    });

    caixa.addEventListener('click', function (e) {
      if (e.target.closest('a')) { input.value = ''; alternarBusca(false); }
    });
    document.addEventListener('click', function (e) {
      if (!e.target.closest('.search') && !e.target.closest('#btn-search')) fechar();
    });
    input.addEventListener('keydown', function (e) {
      if (e.key === 'ArrowDown') { e.preventDefault(); ativar(ativo + 1); }
      if (e.key === 'ArrowUp') { e.preventDefault(); ativar(ativo - 1); }
      if (e.key === 'Enter' && ativo >= 0) {
        e.preventDefault();
        var opcao = caixa.querySelectorAll('[role="option"]')[ativo];
        if (opcao) opcao.click();
      }
      if (e.key === 'Escape') { input.value = ''; alternarBusca(false); }
    });
    alternador.addEventListener('click', function () { alternarBusca(!envoltorio.classList.contains('open')); });
    document.addEventListener('nexo:rota', function () {
      input.value = '';
      alternarBusca(false);
    });
  }

  /* ---------------- menu em telas pequenas ---------------- */
  function montarMenu() {
    var btn = document.getElementById('btn-menu');
    var side = document.getElementById('sidebar');
    var scrim = document.getElementById('scrim');

    function alternar(abrir) {
      side.classList.toggle('open', abrir);
      scrim.hidden = !abrir;
      btn.setAttribute('aria-expanded', String(abrir));
    }

    btn.addEventListener('click', function () { alternar(!side.classList.contains('open')); });
    scrim.addEventListener('click', function () { alternar(false); });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && side.classList.contains('open')) alternar(false);
    });
  }

  /* ---------------- partida ---------------- */
  montarNav();
  montarBusca();
  montarMenu();
  ligarConclusao();
  pintarProgresso();
  Router.start();
})();
