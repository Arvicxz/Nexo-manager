/* =====================================================================
   registry.js — registro dos módulos da aplicação.

   Um módulo declara três coisas e nada além disso:
     · metadados  — código, título, nível, tempo, carimbo e termos de busca;
     · slots      — funções que preenchem os blocos [data-slot] do template;
     · mount      — comportamento (eventos) depois que o template está no DOM.

   O conteúdo e o layout de cada módulo vivem em public/pages/<id>.html.
   ===================================================================== */
window.APP = { pages: {}, order: [], index: [] };

APP.page = function (id, def) {
  if (APP.pages[id]) throw new Error('Módulo duplicado: ' + id);

  def.id = id;
  APP.pages[id] = def;
  APP.order.push(id);

  (def.tags || []).forEach(function (termo) {
    APP.index.push({ termo: termo, id: id, mod: def.code + ' · ' + def.title });
  });
};

APP.existe = function (id) {
  return Object.prototype.hasOwnProperty.call(APP.pages, id);
};

APP.vizinhos = function (id) {
  var i = APP.order.indexOf(id);
  return { anterior: APP.order[i - 1] || null, proximo: APP.order[i + 1] || null };
};
