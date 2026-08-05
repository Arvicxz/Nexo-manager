/* =====================================================================
   progresso.js — progresso de módulos e competências no localStorage.

   A leitura aceita o formato antigo (uma lista de módulos) e o migra sem
   apagar o que a pessoa já concluiu.
   ===================================================================== */
window.Progresso = (function () {
  var CHAVE = 'nexo-gestao-progresso';
  var ouvintes = [];

  function vazio() {
    return { versao: 2, modulos: [], competencias: [], exercicios: {}, trilha: null };
  }

  function unico(lista) {
    return lista.filter(function (item, i) { return lista.indexOf(item) === i; });
  }

  function normalizar(valor) {
    if (Array.isArray(valor)) {
      var migrado = vazio();
      migrado.modulos = unico(valor);
      return migrado;
    }

    if (!valor || typeof valor !== 'object') return vazio();
    return {
      versao: 2,
      modulos: unico(Array.isArray(valor.modulos) ? valor.modulos : []),
      competencias: unico(Array.isArray(valor.competencias) ? valor.competencias : []),
      exercicios: valor.exercicios && typeof valor.exercicios === 'object' ? valor.exercicios : {},
      trilha: typeof valor.trilha === 'string' ? valor.trilha : null
    };
  }

  function estado() {
    try { return normalizar(JSON.parse(localStorage.getItem(CHAVE) || 'null')); }
    catch (e) { return vazio(); }
  }

  function gravar(proximo) {
    proximo = normalizar(proximo);
    try { localStorage.setItem(CHAVE, JSON.stringify(proximo)); } catch (e) {}
    ouvintes.forEach(function (fn) { fn(proximo); });
    return proximo;
  }

  function ler() { return estado().modulos; }
  function concluido(id) { return ler().indexOf(id) >= 0; }

  function alternar(id) {
    var atual = estado();
    var i = atual.modulos.indexOf(id);
    if (i >= 0) atual.modulos.splice(i, 1); else atual.modulos.push(id);
    gravar(atual);
    return i < 0;
  }

  function competencias() { return estado().competencias; }
  function domina(id) { return competencias().indexOf(id) >= 0; }

  function registrarExercicio(modulo, correto, competencia) {
    var atual = estado();
    atual.exercicios[modulo] = { correto: !!correto, em: Date.now() };
    if (correto && competencia && atual.competencias.indexOf(competencia) < 0) {
      atual.competencias.push(competencia);
    }
    gravar(atual);
  }

  function exercicioConcluido(modulo) {
    return !!(estado().exercicios[modulo] || {}).correto;
  }

  function escolherTrilha(id) {
    var atual = estado();
    atual.trilha = id || null;
    gravar(atual);
  }

  function trilha() { return estado().trilha; }
  function limpar() { gravar(vazio()); }
  function aoMudar(fn) { ouvintes.push(fn); }

  return {
    estado: estado,
    ler: ler,
    concluido: concluido,
    alternar: alternar,
    competencias: competencias,
    domina: domina,
    registrarExercicio: registrarExercicio,
    exercicioConcluido: exercicioConcluido,
    escolherTrilha: escolherTrilha,
    trilha: trilha,
    limpar: limpar,
    aoMudar: aoMudar
  };
})();
