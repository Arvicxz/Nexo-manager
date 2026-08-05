/* =====================================================================
   slots.js — ponte entre o template HTML e os dados.

   No template:   <div class="grid g4" data-slot="kpis"></div>
   No módulo:     slots: { kpis: function () { return UI.kpi({...}); } }

   Um slot devolve HTML produzido pela biblioteca de componentes
   (UI.* e CH.*). Tudo o que é texto editorial fica no arquivo .html;
   o slot existe apenas onde o conteúdo depende de DATA.
   ===================================================================== */
window.Slots = (function () {

  /* Slots disponíveis em qualquer módulo. */
  var globais = {
    freshness: function () { return UI.freshnessTexto(); },
    atualizacao: function () { return UI.esc(DATA.atualizacao); }
  };

  function preencher(raiz, pagina) {
    var locais = pagina.slots || {};

    raiz.querySelectorAll('[data-slot]').forEach(function (el) {
      var nome = el.dataset.slot;
      var fn = locais[nome] || globais[nome];

      if (typeof fn !== 'function') {
        console.warn('[nexo] slot "' + nome + '" não tem preenchimento em ' + pagina.id + '.');
        return;
      }
      el.innerHTML = fn.call(pagina, el);
    });
  }

  return { preencher: preencher, globais: globais };
})();
