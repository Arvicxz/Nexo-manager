/* =====================================================================
   router.js — navegação SPA por hash (#/modulo).

   Ciclo de vida de uma rota:
     1. resolve o id na URL                      → APP.pages[id]
     2. carrega public/pages/<id>.html           → Templates.load
     3. monta a moldura: carimbo + template + paginação
     4. preenche os [data-slot] com dados        → Slots.preencher
     5. entrega o DOM ao módulo                  → pagina.mount(view)
     6. anuncia a troca de rota                  → evento "nexo:rota"

   Carregamentos são assíncronos: um token de sequência descarta a
   resposta de uma navegação que já foi superada por outra.
   ===================================================================== */
window.Router = (function () {
  var INICIAL = 'inicio';
  var view = null;
  var sequencia = 0;

  function idAtual() {
    var id = (location.hash || '').replace(/^#\/?/, '').split('?')[0];
    return APP.existe(id) ? id : INICIAL;
  }

  function marcarNav(id) {
    document.querySelectorAll('.nav-link').forEach(function (a) {
      if (a.dataset.id === id) a.setAttribute('aria-current', 'page');
      else a.removeAttribute('aria-current');
    });
  }

  function fecharMenu() {
    var side = document.getElementById('sidebar');
    var scrim = document.getElementById('scrim');
    var btn = document.getElementById('btn-menu');
    if (side) side.classList.remove('open');
    if (scrim) scrim.hidden = true;
    if (btn) btn.setAttribute('aria-expanded', 'false');
  }

  function esqueleto() {
    return '<p class="estado-carregando" role="status">Carregando módulo…</p>';
  }

  function telaDeErro(pagina, erro) {
    return '<section class="card estado-erro" role="alert">' +
      '<h2>Não foi possível abrir o módulo ' + UI.esc(pagina.code) + '</h2>' +
      '<p class="small">O template <code>pages/' + UI.esc(pagina.id) + '.html</code> não pôde ser lido (' +
        UI.esc(erro.message) + ').</p>' +
      '<p class="small muted">Os módulos são carregados por HTTP. Rode <code>npm run dev</code> ou sirva a pasta ' +
        'por um servidor local — abrir o arquivo direto do disco (<code>file://</code>) é bloqueado pelo navegador.</p>' +
      '<p class="mb0"><button class="btn btn-sm" type="button" data-recarregar>Tentar novamente</button></p>' +
    '</section>';
  }

  /* Reinicia a animação de entrada a cada troca de módulo. */
  function animarEntrada() {
    view.classList.remove('view-enter');
    void view.offsetWidth;
    view.classList.add('view-enter');
  }

  function finalizar(id) {
    view.removeAttribute('aria-busy');
    animarEntrada();
    window.scrollTo(0, 0);
    fecharMenu();

    var main = document.getElementById('conteudo');
    if (main && location.hash) main.focus({ preventScroll: true });

    document.dispatchEvent(new CustomEvent('nexo:rota', { detail: { id: id } }));
  }

  function ir() {
    var id = idAtual();
    var pagina = APP.pages[id];
    var token = ++sequencia;

    view = view || document.getElementById('view');
    document.title = pagina.title + ' · Nexo Gestão';
    marcarNav(id);
    view.setAttribute('aria-busy', 'true');

    /* Só mostra "carregando" se a resposta demorar: evita piscar com cache quente. */
    var aviso = setTimeout(function () {
      if (token === sequencia) view.innerHTML = esqueleto();
    }, 140);

    Templates.load(id)
      .then(function (html) {
        clearTimeout(aviso);
        if (token !== sequencia) return;             /* rota superada */

        view.innerHTML = UI.carimbo(pagina) + UI.aprendizado(pagina) + html + UI.pratica(pagina) + UI.pager(id);
        Slots.preencher(view, pagina);
        if (typeof pagina.mount === 'function') pagina.mount(view);
        if (window.Aprendizado) Aprendizado.mount(pagina, view);

        finalizar(id);

        var v = APP.vizinhos(id);
        Templates.prefetch(v.proximo);
        Templates.prefetch(v.anterior);
      })
      .catch(function (erro) {
        clearTimeout(aviso);
        if (token !== sequencia) return;

        console.error('[nexo] falha ao carregar o módulo "' + id + '"', erro);
        view.innerHTML = telaDeErro(pagina, erro);
        finalizar(id);
      });
  }

  function start() {
    window.addEventListener('hashchange', ir);
    document.addEventListener('click', function (e) {
      if (e.target.closest('[data-recarregar]')) ir();
    });
    ir();
  }

  return { start: start, ir: ir, atual: idAtual };
})();
