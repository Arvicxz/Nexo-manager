/* MOD-14 · Fontes e verificação — template: public/pages/fontes.html */
APP.page('fontes', {
  code: 'MOD-14', title: 'Fontes e verificação', nivel: 'Consulta', tempo: '—', rev: 'REV-B',
  desc: 'De onde vem cada conceito, como o conteúdo foi verificado e o que ainda está pendente.',

  carimbo: {
    desc: 'Este material foi escrito com apoio de inteligência artificial. Esta página existe para que cada afirmação possa ser conferida — e para separar o que vem da literatura do que é escolha desta empresa fictícia.',
    pergunta: 'Em que isso se apoia?',
    quem: 'Quem precisa citar, contestar ou aprofundar',
    fonte: 'Bibliografia própria · ver método abaixo'
  },

  tags: ['fontes', 'bibliografia', 'referências', 'verificação', 'metodologia', 'alucinação',
         'cleveland', 'tufte', 'few', 'shneiderman', 'kaplan', 'norton', 'kimball', 'wheeler',
         'hyndman', 'munzner', 'anscombe', 'simpson', 'wcag', 'iso 22400', 'evm', 'pmi',
         'dama', 'crisp-dm', 'ibcs', 'convenção da casa'],

  /* Este módulo é a própria bibliografia: não repete o bloco no rodapé. */

  slots: {
    bibliografia: function () {
      var TIPOS = { artigo: 'Artigo', livro: 'Livro', norma: 'Norma', 'padrão': 'Padrão', guia: 'Guia' };

      return FONTES.porArea().map(function (grupo) {
        var obras = grupo.obras.map(function (o) {
          var usos = FONTES.modulosDe(o.chave).map(function (id) {
            return '<a class="btn btn-ghost btn-sm" href="#/' + id + '">' +
                   UI.esc(APP.pages[id].code) + '</a>';
          }).join('');

          return '<article class="card" data-obra>' +
            '<h3>' + UI.esc(o.autores) + ' (' + UI.esc(o.ano) + ')</h3>' +
            '<p class="small" style="margin-bottom:6px"><em>' + UI.esc(o.titulo) + '</em></p>' +
            '<p class="tiny muted">' + UI.esc(o.veiculo) + '</p>' +
            '<p class="fonte-sustenta"><span>Sustenta</span>' + UI.esc(o.sustenta) + '</p>' +
            '<p class="fonte-meta">' +
              '<span class="badge badge-gray badge-plain">' + UI.esc(TIPOS[o.tipo] || o.tipo) + '</span>' +
              (o.acesso === 'aberto' ? '<span class="badge badge-green badge-plain">Acesso aberto</span>' : '') +
              (o.conferido ? '<span class="badge badge-blue badge-plain">Conferida</span>'
                           : '<span class="badge badge-amber badge-plain">Conferência pendente</span>') +
              (o.url ? '<a href="' + UI.esc(o.url) + '" target="_blank" rel="noopener">Abrir a fonte ↗</a>' : '') +
            '</p>' +
            (usos ? '<p class="module-result">Usada em: ' + usos + '</p>' : '') +
          '</article>';
        }).join('');

        return '<section class="section" data-area>' +
          UI.sec(grupo.nome, grupo.obras.length + (grupo.obras.length === 1 ? ' obra' : ' obras')) +
          '<div class="grid g2">' + obras + '</div>' +
        '</section>';
      }).join('');
    }
  },

  /* Busca incremental sobre os cartões já renderizados — mesmo padrão do glossário. */
  mount: function (raiz) {
    var cartoes = Array.prototype.slice.call(raiz.querySelectorAll('[data-obra]'));
    var areas = Array.prototype.slice.call(raiz.querySelectorAll('[data-area]'));
    var contador = raiz.querySelector('#fn-cont');
    var vazio = raiz.querySelector('#fn-vazio');

    function norm(s) {
      return s.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
    }

    var indice = cartoes.map(function (c) { return norm(c.textContent); });

    function filtrar(consulta) {
      var q = norm(consulta.trim());
      var visiveis = 0;

      cartoes.forEach(function (cartao, i) {
        var casa = !q || indice[i].indexOf(q) >= 0;
        cartao.hidden = !casa;
        if (casa) visiveis++;
      });

      /* Uma área inteira sem resultado sai da tela, junto com o título. */
      areas.forEach(function (secao) {
        secao.hidden = !secao.querySelectorAll('[data-obra]:not([hidden])').length;
      });

      contador.textContent = visiveis + ' de ' + cartoes.length + ' obras · ' +
        FONTES.pendentes() + ' aguardando conferência';
      vazio.hidden = visiveis > 0;
    }

    raiz.querySelector('#fn-busca').addEventListener('input', function (e) { filtrar(e.target.value); });
    filtrar('');
  }
});
