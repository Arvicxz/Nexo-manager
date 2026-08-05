/* MOD-12 · Glossário — template: public/pages/glossario.html */
APP.page('glossario', {
  code: 'MOD-12', title: 'Glossário', nivel: 'Consulta', tempo: '—', rev: 'REV-A',
  desc: 'Definição simples, definição técnica, exemplo e onde ver funcionando.',

  carimbo: {
    desc: 'Trinta e seis termos com duas definições: uma para explicar em reunião e outra para escrever na especificação do sistema.',
    pergunta: 'O que exatamente significa este termo?',
    quem: 'Todos os perfis'
  },

  tags: ['glossário', 'definições', 'termos', 'vocabulário'],

  /* Busca incremental: filtra os cartões já presentes no template. */
  mount: function (raiz) {
    var cartoes = Array.prototype.slice.call(raiz.querySelectorAll('#gl-lista > .card'));
    var contador = raiz.querySelector('#gl-cont');
    var vazio = raiz.querySelector('#gl-vazio');

    function norm(s) {
      return s.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
    }

    /* Índice montado uma única vez, a partir do próprio conteúdo do cartão. */
    var indice = cartoes.map(function (c) { return norm(c.textContent); });

    function filtrar(consulta) {
      var q = norm(consulta.trim());
      var visiveis = 0;

      cartoes.forEach(function (cartao, i) {
        var casa = !q || indice[i].indexOf(q) >= 0;
        cartao.hidden = !casa;
        if (casa) visiveis++;
      });

      contador.textContent = visiveis + ' de ' + cartoes.length + ' termos';
      vazio.hidden = visiveis > 0;
    }

    raiz.querySelector('#gl-busca').addEventListener('input', function (e) { filtrar(e.target.value); });
    filtrar('');
  }
});
