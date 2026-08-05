/* =====================================================================
   ui.js — biblioteca de componentes de interface.

   Cada função devolve HTML pronto, com as mesmas classes usadas nos
   templates de public/pages/. É a única fonte de marcação gerada em
   JavaScript, e existe porque estes blocos dependem de dados.
   ===================================================================== */
window.UI = (function () {
  function esc(s) {
    return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  }

  var STATUS = {
    ok:   { cls: 'badge-green',  txt: 'Dentro da meta' },
    warn: { cls: 'badge-amber',  txt: 'Atenção' },
    crit: { cls: 'badge-red',    txt: 'Crítico' },
    info: { cls: 'badge-blue',   txt: 'Informativo' },
    prev: { cls: 'badge-purple', txt: 'Previsão' },
    na:   { cls: 'badge-gray',   txt: 'Sem informação' }
  };

  var U = {};

  U.badge = function (kind, texto) {
    var s = STATUS[kind] || STATUS.na;
    return '<span class="badge ' + s.cls + '">' + esc(texto || s.txt) + '</span>';
  };

  /* Carimbo: bloco de identificação no topo de cada módulo.
     Recebe o próprio registro do módulo; `carimbo: false` omite o bloco. */
  U.carimbo = function (pagina) {
    var c = pagina.carimbo;
    if (!c) return '';

    return '<header class="carimbo">' +
      '<div class="carimbo-top">' +
        '<p class="eyebrow">' + esc(pagina.code) + (pagina.rev ? ' · ' + esc(pagina.rev) : '') + '</p>' +
        '<h1>' + esc(c.titulo || pagina.title) + '</h1>' +
        '<p>' + c.desc + '</p>' +
      '</div>' +
      '<dl class="carimbo-campos">' +
        '<div><dt>Pergunta que responde</dt><dd>' + esc(c.pergunta) + '</dd></div>' +
        '<div><dt>Para quem</dt><dd>' + esc(c.quem) + '</dd></div>' +
        '<div><dt>Fonte dos dados</dt><dd>' + esc(c.fonte || 'SGD · RAT · Financeiro (fictícios)') + '</dd></div>' +
        '<div><dt>Atualização</dt><dd>' + esc(DATA.atualizacao) + '</dd></div>' +
      '</dl>' +
    '</header>';
  };

  /* Contrato didático exibido antes do conteúdo de cada módulo. */
  U.aprendizado = function (pagina) {
    if (!window.Aprendizado) return '';
    var a = Aprendizado.modulo(pagina.id);
    if (!a) return '';
    var comp = Aprendizado.competencia(a.competencia);
    var conceitos = (a.conceitos || []).map(function (termo) {
      return '<button class="concept-chip" type="button" data-conceito="' + esc(termo) + '">' + esc(termo) + '</button>';
    }).join('');

    return '<section class="learning-brief" aria-labelledby="objetivo-' + esc(pagina.id) + '">' +
      '<div class="learning-brief-main">' +
        '<p class="eyebrow">Seu objetivo neste módulo</p>' +
        '<h2 id="objetivo-' + esc(pagina.id) + '">' + esc(a.objetivo) + '</h2>' +
        '<p class="learning-meta"><span>' + esc(pagina.nivel) + '</span><span>' + esc(pagina.tempo) + '</span>' +
          '<span>Competência: ' + esc(comp ? comp.nome : '') + '</span></p>' +
      '</div>' +
      '<div class="learning-actions">' +
        '<button class="btn btn-sm" type="button" data-foco-iniciar aria-pressed="false">Ativar leitura focada</button>' +
        '<a class="btn btn-ghost btn-sm" href="#pratica-' + esc(pagina.id) + '">Ir para a prática</a>' +
      '</div>' +
      '<div class="learning-concepts"><span class="tiny muted">Conceitos-chave</span>' + conceitos + '</div>' +
      '<div class="concept-panel" data-conceito-painel hidden aria-live="polite"></div>' +
      '<div class="focus-controls" data-foco-controles hidden>' +
        '<div><span class="eyebrow" data-foco-etapa></span><strong data-foco-titulo></strong></div>' +
        '<div class="row"><button class="icon-btn compact" type="button" data-foco-anterior aria-label="Etapa anterior">←</button>' +
          '<button class="icon-btn compact" type="button" data-foco-proximo aria-label="Próxima etapa">→</button>' +
          '<button class="btn btn-ghost btn-sm" type="button" data-foco-sair>Sair do modo focado</button></div>' +
      '</div>' +
    '</section>';
  };

  /* Microatividade com feedback imediato, igual em estrutura e específica no conteúdo. */
  U.pratica = function (pagina) {
    if (!window.Aprendizado) return '';
    var a = Aprendizado.modulo(pagina.id);
    if (!a || !a.pratica) return '';
    var p = a.pratica;
    var opcoes = p.opcoes.map(function (opcao, i) {
      return '<label class="practice-option"><input type="radio" name="pratica-' + esc(pagina.id) + '" value="' + i + '">' +
        '<span><b>' + String.fromCharCode(65 + i) + '</b>' + esc(opcao) + '</span></label>';
    }).join('');

    return '<section class="practice section" id="pratica-' + esc(pagina.id) + '" data-pratica="' + esc(pagina.id) + '">' +
      '<div class="practice-head"><div><p class="eyebrow">Prática de 2 minutos</p><h2>Aplique antes de avançar</h2></div>' +
        '<span class="badge badge-blue badge-plain">feedback imediato</span></div>' +
      '<div class="practice-layout"><div><p class="practice-scenario"><strong>Cenário</strong>' + esc(p.cenario) + '</p>' +
        '<fieldset><legend>' + esc(p.pergunta) + '</legend>' + opcoes + '</fieldset></div>' +
        '<aside class="practice-side"><p class="small muted">Escolha a alternativa e confira o raciocínio. Acertar registra a competência no seu progresso.</p>' +
          '<button class="btn btn-primary" type="button" data-pratica-checar>Conferir resposta</button>' +
          '<p class="practice-feedback" data-pratica-feedback hidden role="status"></p></aside></div>' +
    '</section>';
  };

  U.sec = function (titulo, extra) {
    return '<div class="section-title"><h2>' + esc(titulo) + '</h2><span class="rule"></span>' +
           (extra ? '<span class="tiny muted">' + extra + '</span>' : '') + '</div>';
  };

  /* KPI com valor, meta, comparação, tendência, semáforo e mini-histórico */
  U.kpi = function (o) {
    var d = o.delta || '';
    var dcls = /^[+]/.test(d) ? (o.deltaBom === false ? 'delta-down' : 'delta-up')
             : /^[-−]/.test(d) ? (o.deltaBom === false ? 'delta-up' : 'delta-down') : 'delta-flat';
    return '<article class="kpi ' + (o.status || 'info') + '">' +
      '<span class="kpi-label">' + esc(o.label) + '</span>' +
      '<span class="kpi-value">' + esc(o.value) + (o.unit ? '<small>' + esc(o.unit) + '</small>' : '') + '</span>' +
      '<span class="kpi-meta">' +
        (o.meta ? '<span>Meta ' + esc(o.meta) + '</span>' : '') +
        (d ? '<span class="' + dcls + '">' + esc(d) + '</span>' : '') +
        (o.ref ? '<span>' + esc(o.ref) + '</span>' : '') +
      '</span>' +
      (o.serie ? CH.spark(o.serie, o.sparkColor || 'gray') : '') +
      (o.status ? '<span>' + U.badge(o.status, o.statusTxt) + '</span>' : '') +
    '</article>';
  };

  U.formula = function (label, txt) {
    return '<div class="formula"><span class="formula-label">' + esc(label) + '</span>' + esc(txt) + '</div>';
  };

  U.table = function (o) {
    var th = o.cols.map(function (c) {
      return '<th' + (c.num ? ' class="num"' : '') + '>' + esc(c.l) + '</th>';
    }).join('');
    var tb = o.rows.map(function (r) {
      return '<tr>' + o.cols.map(function (c) {
        var v = r[c.k];
        return '<td data-l="' + esc(c.l) + '"' + (c.num ? ' class="num"' : '') + '>' + (v == null ? '—' : v) + '</td>';
      }).join('') + '</tr>';
    }).join('');
    return '<div class="table-wrap"><table class="responsive">' +
      (o.caption ? '<caption>' + o.caption + '</caption>' : '') +
      '<thead><tr>' + th + '</tr></thead><tbody>' + tb + '</tbody></table></div>';
  };

  U.alerta = function (a) {
    var nivel = { crit: ['crit', 'badge-red', 'Crítico'], high: ['high', 'badge-red', 'Alto'],
                  warn: ['warn', 'badge-amber', 'Atenção'], info: ['info', 'badge-blue', 'Informativo'] }[a.nivel];
    return '<article class="alert ' + nivel[0] + '">' +
      '<div class="alert-head"><h4>' + esc(a.titulo) + '</h4><span class="badge ' + nivel[1] + '">' + nivel[2] + '</span></div>' +
      '<dl class="alert-grid">' +
        '<div><dt>Limite ultrapassado</dt><dd>' + esc(a.limite) + '</dd></div>' +
        '<div><dt>Causa provável</dt><dd>' + esc(a.causa) + '</dd></div>' +
        '<div><dt>Impacto</dt><dd>' + esc(a.impacto) + '</dd></div>' +
        '<div><dt>Responsável</dt><dd>' + esc(a.responsavel) + '</dd></div>' +
        '<div><dt>Ação esperada</dt><dd>' + esc(a.acao) + '</dd></div>' +
        '<div><dt>Prazo · situação</dt><dd>' + esc(a.prazo) + ' · ' + esc(a.status) + '</dd></div>' +
      '</dl></article>';
  };

  U.note = function (t) { return '<div class="note">' + t + '</div>'; };
  U.erro = function (t) { return '<p class="erro-comum"><b>Erro comum:</b> ' + t + '</p>'; };

  U.resumo = function (titulo, itens) {
    return '<div class="resumo">' + U.sec(titulo) +
      '<ul>' + itens.map(function (i) { return '<li>' + i + '</li>'; }).join('') + '</ul></div>';
  };

  U.acc = function (titulo, corpo, aberto) {
    return '<details class="acc"' + (aberto ? ' open' : '') + '><summary>' + esc(titulo) + '</summary>' +
           '<div class="acc-body">' + corpo + '</div></details>';
  };

  U.card = function (titulo, sub, corpo, extra) {
    return '<section class="card">' +
      (titulo ? '<div class="card-head"><div><h3>' + esc(titulo) + '</h3>' +
                (sub ? '<p>' + esc(sub) + '</p>' : '') + '</div>' + (extra || '') + '</div>' : '') +
      corpo + '</section>';
  };

  /* Abas acessíveis: clique, setas, Home/End e relação tab ↔ painel. */
  U.ligarTabs = function (raiz, o) {
    var abas = Array.prototype.slice.call(raiz.querySelectorAll(o.abas));
    var paineis = Array.prototype.slice.call(raiz.querySelectorAll(o.paineis));
    if (!abas.length || !paineis.length) return;

    function chave(el, atributo) { return el.dataset[atributo]; }

    function selecionar(valor, moverFoco) {
      abas.forEach(function (aba, i) {
        var ativa = chave(aba, o.atributoAba) === valor;
        aba.setAttribute('aria-selected', String(ativa));
        aba.tabIndex = ativa ? 0 : -1;
        if (ativa && moverFoco) aba.focus();
        var painel = paineis.find(function (p) { return chave(p, o.atributoPainel) === chave(aba, o.atributoAba); });
        if (painel) {
          aba.id = aba.id || o.prefixo + '-tab-' + i;
          painel.id = painel.id || o.prefixo + '-painel-' + i;
          aba.setAttribute('aria-controls', painel.id);
          painel.setAttribute('role', 'tabpanel');
          painel.setAttribute('aria-labelledby', aba.id);
          painel.tabIndex = 0;
          painel.hidden = !ativa;
        }
      });
    }

    abas.forEach(function (aba, i) {
      aba.addEventListener('click', function () { selecionar(chave(aba, o.atributoAba), false); });
      aba.addEventListener('keydown', function (e) {
        var proxima = null;
        if (e.key === 'ArrowRight' || e.key === 'ArrowDown') proxima = (i + 1) % abas.length;
        if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') proxima = (i - 1 + abas.length) % abas.length;
        if (e.key === 'Home') proxima = 0;
        if (e.key === 'End') proxima = abas.length - 1;
        if (proxima == null) return;
        e.preventDefault();
        selecionar(chave(abas[proxima], o.atributoAba), true);
      });
    });

    selecionar(o.inicial || chave(abas[0], o.atributoAba), false);
  };

  /* Declaração de origem e data — usada em JS e como slot global no HTML. */
  U.freshnessTexto = function () {
    return 'Fonte: SGD · RAT · Financeiro · Atualizado em ' + esc(DATA.atualizacao) + ' · dados fictícios';
  };
  U.freshness = function () {
    return '<p class="freshness">' + U.freshnessTexto() + '</p>';
  };

  /* Navegação entre módulos, no rodapé de cada página. */
  U.pager = function (id) {
    var v = APP.vizinhos(id);
    var feito = Progresso.concluido(id);
    var out = '<nav class="pager" aria-label="Navegação entre módulos">';

    out += v.anterior
      ? '<a class="btn" href="#/' + v.anterior + '">← ' + esc(APP.pages[v.anterior].title) + '</a>'
      : '<span></span>';

    out += '<button class="btn btn-sm" type="button" data-concluir="' + id + '" aria-pressed="' + feito + '">' +
             (feito ? 'Módulo concluído ✓' : 'Marcar módulo como concluído') + '</button>';

    out += v.proximo
      ? '<a class="btn btn-primary" href="#/' + v.proximo + '">' + esc(APP.pages[v.proximo].title) + ' →</a>'
      : '<span></span>';

    return out + '</nav>';
  };

  U.esc = esc;
  return U;
})();
