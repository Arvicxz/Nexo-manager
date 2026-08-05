/* =====================================================================
   templates.js — carregamento dos templates HTML dos módulos.

   Cada módulo tem um arquivo em public/pages/<id>.html servido em /pages/.
   O resultado é memorizado: voltar a um módulo já visitado não gera
   nova requisição, e a navegação passa a ser instantânea.
   ===================================================================== */
window.Templates = (function () {
  var BASE = 'pages/';
  var cache = {};

  function url(id) {
    return new URL(BASE + id + '.html', document.baseURI).href;
  }

  function load(id) {
    if (!cache[id]) {
      cache[id] = fetch(url(id), { headers: { Accept: 'text/html' } })
        .then(function (resposta) {
          if (!resposta.ok) throw new Error('HTTP ' + resposta.status);
          return resposta.text();
        })
        .catch(function (erro) {
          delete cache[id];               /* falha não fica memorizada */
          throw erro;
        });
    }
    return cache[id];
  }

  /* Aquece o cache do módulo anterior e do próximo, sem bloquear nada. */
  function prefetch(id) {
    if (id && APP.existe(id)) load(id).catch(function () {});
  }

  return { load: load, prefetch: prefetch, url: url };
})();
