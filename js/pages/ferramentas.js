/* MOD-13 · Ferramentas — template: public/pages/ferramentas.html */
APP.page('ferramentas', {
  code: 'MOD-13', title: 'Ferramentas', nivel: 'Consulta', tempo: '—', rev: 'REV-B',
  desc: 'Com o que se implementa cada conceito da trilha, organizado por camada.',

  carimbo: {
    desc: 'A trilha ensina o conceito; esta página diz com o que construí-lo. Organizada pelas mesmas camadas do fluxo do MOD-02, para que a lista seja um caminho e não um catálogo de fornecedores.',
    pergunta: 'Com o que eu implemento isso?',
    quem: 'Quem vai construir ou contratar',
    fonte: 'Levantamento próprio · sem patrocínio'
  },

  tags: ['ferramentas', 'power bi', 'tableau', 'metabase', 'superset', 'grafana', 'looker', 'qlik',
         'dbt', 'airflow', 'dagster', 'airbyte', 'fivetran', 'great expectations', 'datahub',
         'postgresql', 'duckdb', 'bigquery', 'snowflake', 'databricks', 'python', 'r',
         'primavera', 'ms project', 'figma', 'axe', 'wave', 'echarts', 'vega-lite', 'stack de dados'],

  /* Este módulo é o próprio catálogo: não repete o bloco no rodapé. */

  slots: {
    catalogo: function () {
      return FERRAMENTAS.camadas.map(function (c) {
        var itens = c.itens.map(function (f) {
          return '<li data-porte="' + UI.esc(f.porte) + '" data-licenca="' + UI.esc(f.licenca) + '">' +
            '<strong>' + UI.esc(f.nome) + '</strong>' +
            '<span class="ferr-lic ' + UI.esc(f.licenca) + '">' +
              UI.esc(FERRAMENTAS.licencas[f.licenca]) + '</span>' +
            '<span class="ferr-o">' + UI.esc(f.o) + '</span>' +
          '</li>';
        }).join('');

        return '<section class="card" data-camada="' + UI.esc(c.id) + '" style="margin-bottom:16px">' +
          '<div class="card-head"><div>' +
            '<h3>' + UI.esc(c.nome) + '</h3><p>' + UI.esc(c.papel) + '</p>' +
          '</div><span class="badge badge-gray badge-plain">' + c.itens.length + '</span></div>' +
          '<p class="small">' + UI.esc(c.conceito) + '</p>' +
          '<ul class="ferr-lista">' + itens + '</ul>' +
          '<p class="tiny muted camada-vazia" hidden style="margin:10px 0 0">' +
            'Nenhuma opção desta camada combina com os filtros atuais.</p>' +
        '</section>';
      }).join('');
    }
  },

  /* Dois filtros independentes que apenas escondem <li>: nenhum HTML é
     reconstruído: mesma abordagem da busca do glossário. */
  mount: function (raiz) {
    var itens = Array.prototype.slice.call(raiz.querySelectorAll('.ferr-lista li'));
    var camadas = Array.prototype.slice.call(raiz.querySelectorAll('[data-camada]'));
    var contador = raiz.querySelector('#cat-cont');
    var vazio = raiz.querySelector('#cat-vazio');
    var filtro = { porte: '', licenca: '' };

    function aplicar() {
      var visiveis = 0;

      itens.forEach(function (li) {
        var casa = (!filtro.porte || li.dataset.porte === filtro.porte) &&
                   (!filtro.licenca || li.dataset.licenca === filtro.licenca);
        li.hidden = !casa;
        if (casa) visiveis++;
      });

      /* A camada continua na tela mesmo sem itens: saber que ela existe é informação. */
      camadas.forEach(function (secao) {
        var restantes = secao.querySelectorAll('.ferr-lista li:not([hidden])').length;
        secao.querySelector('.camada-vazia').hidden = restantes > 0;
        secao.querySelector('.ferr-lista').hidden = restantes === 0;
        secao.querySelector('.badge').textContent = restantes;
      });

      contador.textContent = visiveis + ' de ' + itens.length + ' ferramentas';
      vazio.hidden = visiveis > 0;
    }

    function ligarGrupo(atributo) {
      var botoes = Array.prototype.slice.call(raiz.querySelectorAll('[data-' + atributo + ']'));
      botoes.forEach(function (b) {
        b.addEventListener('click', function () {
          filtro[atributo] = b.dataset[atributo];
          botoes.forEach(function (outro) {
            outro.setAttribute('aria-pressed', String(outro === b));
          });
          aplicar();
        });
      });
    }

    ligarGrupo('porte');
    ligarGrupo('licenca');
    aplicar();
  }
});
