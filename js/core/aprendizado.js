/* =====================================================================
   aprendizado.js — camada didática transversal da plataforma.

   Reúne resultados de aprendizagem, trilhas, conceitos contextuais,
   exercícios e o modo de leitura focada. Os módulos continuam donos de
   seu conteúdo técnico; esta camada organiza como ele é aprendido.
   ===================================================================== */
window.Aprendizado = (function () {
  var COMPETENCIAS = {
    fundamentos: { nome: 'Interpretar dados', desc: 'Distinguir dado, métrica, indicador e KPI.' },
    visualizacao: { nome: 'Escolher visualizações', desc: 'Relacionar a pergunta ao gráfico adequado.' },
    diagnostico: { nome: 'Diagnosticar desvios', desc: 'Ler meta, tendência, contexto e severidade.' },
    investigacao: { nome: 'Investigar causas', desc: 'Aprofundar a análise sem perder o contexto.' },
    decisao: { nome: 'Transformar análise em ação', desc: 'Definir responsável, prazo e acompanhamento.' },
    previsao: { nome: 'Projetar cenários', desc: 'Antecipar impacto em prazo, custo, equipe e margem.' }
  };

  var TRILHAS = {
    conceitos: {
      nome: 'Entender os conceitos',
      para: 'Estou começando e quero formar uma base segura.',
      resultado: 'Você saberá ler uma dashboard e explicar o que cada elemento representa.',
      modulos: ['fundamentos', 'anatomia', 'indicadores', 'graficos']
    },
    construir: {
      nome: 'Construir dashboards',
      para: 'Quero projetar telas úteis para a minha operação.',
      resultado: 'Você sairá com um roteiro para definir indicadores, visões, filtros e alertas.',
      modulos: ['fundamentos', 'indicadores', 'graficos', 'filtros', 'perfis', 'alertas', 'praticas']
    },
    decidir: {
      nome: 'Tomar decisões melhores',
      para: 'Já uso dashboards e quero investigar e agir melhor.',
      resultado: 'Você praticará diagnóstico, forecast, ação e acompanhamento de resultado.',
      modulos: ['anatomia', 'filtros', 'alertas', 'planejamento', 'estudos']
    }
  };

  var GLOSSARIO = {
    dado: 'Registro bruto de um fato, ainda sem comparação ou interpretação.',
    métrica: 'Cálculo ou contagem produzida a partir de dados.',
    indicador: 'Métrica colocada em contexto para acompanhar um objetivo.',
    KPI: 'Indicador-chave ligado a uma decisão relevante e a uma meta.',
    meta: 'Resultado desejado em um prazo definido.',
    limite: 'Faixa que muda a severidade e exige uma resposta.',
    dimensão: 'Forma de segmentar uma medida, como contrato, cliente ou disciplina.',
    benchmark: 'Referência usada para comparar desempenho.',
    forecast: 'Estimativa atualizada do resultado provável no encerramento.',
    backlog: 'Valor de trabalho contratado que ainda será executado.',
    drilldown: 'Aprofundamento progressivo do consolidado até a causa específica.',
    filtro: 'Recorte explícito aplicado à mesma base de dados.',
    alerta: 'Condição relevante que combina limite, impacto e ação esperada.',
    semáforo: 'Código de severidade; ele resume uma regra, não substitui o valor.',
    granularidade: 'Nível de detalhe no qual um dado é registrado ou exibido.',
    retrabalho: 'Esforço gasto para refazer algo que já havia sido produzido.',
    tendência: 'Direção e ritmo de mudança observados ao longo do tempo.',
    cenário: 'Conjunto explícito de premissas usado para simular um resultado.',
    SLA: 'Compromisso mensurável de nível de serviço, normalmente ligado a prazo.'
  };

  var SINONIMOS = {
    prever: ['prever', 'previsão', 'forecast', 'projetar'],
    previsao: ['previsão', 'forecast', 'projetar'],
    comparar: ['comparar', 'comparação', 'benchmark', 'desvio'],
    investigar: ['investigar', 'causa', 'drilldown', 'filtro'],
    causa: ['causa', 'investigar', 'drilldown', 'diagnóstico'],
    decidir: ['decidir', 'decisão', 'ação', 'alerta'],
    construir: ['construir', 'criar', 'projetar', 'boas práticas'],
    prazo: ['prazo', 'conclusão', 'data', 'cronograma']
  };

  var MODULOS = {
    fundamentos: {
      objetivo: 'Distinguir dado, métrica, indicador e KPI em uma situação real.',
      competencia: 'fundamentos',
      conceitos: ['dado', 'métrica', 'indicador', 'KPI'],
      pratica: {
        cenario: 'O sistema registrou 9.400 horas orçadas, 6.700 realizadas e um limite de consumo de 70%.',
        pergunta: 'Qual opção é um indicador pronto para apoiar uma decisão?',
        opcoes: ['6.700 horas realizadas', '71,3% das horas consumidas, acima do limite de 70%', '9.400 horas orçadas'],
        correta: 1,
        acerto: 'Exato. O percentual combina dados, cálculo, referência e uma condição que pede atenção.',
        erro: 'Procure a opção que combina uma medida com contexto e limite, não apenas um valor bruto.'
      }
    },
    anatomia: {
      objetivo: 'Ler uma dashboard na ordem certa: contexto, desvio, causa e ação.',
      competencia: 'diagnostico',
      conceitos: ['meta', 'semáforo', 'tendência', 'granularidade'],
      pratica: {
        cenario: 'A margem está em 43%, a meta é 48% e a tendência caiu por três meses.',
        pergunta: 'Qual é a primeira leitura gerencial correta?',
        opcoes: ['A margem é 43%', 'Há um desvio de 5 pontos, com piora contínua, que precisa ser investigado', 'O gráfico deveria usar outra cor'],
        correta: 1,
        acerto: 'Boa leitura. Valor, referência e tendência formam o diagnóstico inicial.',
        erro: 'Uma leitura gerencial precisa ir além de repetir o número: compare e descreva a direção.'
      }
    },
    indicadores: {
      objetivo: 'Conectar fórmula, meta, causa provável e ação a cada indicador.',
      competencia: 'fundamentos',
      foco: false,
      conceitos: ['indicador', 'KPI', 'benchmark', 'SLA'],
      pratica: {
        cenario: 'A receita produzida cresce, mas o valor recebido permanece estável há três meses.',
        pergunta: 'Qual indicador complementar ajuda mais a decidir?',
        opcoes: ['Prazo médio de recebimento', 'Quantidade de colaboradores', 'Número total de contratos'],
        correta: 0,
        acerto: 'Correto. Ele mede a distância temporal entre faturar e transformar receita em caixa.',
        erro: 'Busque a medida diretamente ligada à distância entre faturamento e entrada de caixa.'
      }
    },
    graficos: {
      objetivo: 'Escolher a visualização a partir da pergunta, e não da aparência.',
      competencia: 'visualizacao',
      conceitos: ['tendência', 'benchmark', 'dimensão', 'granularidade'],
      pratica: {
        cenario: 'Você precisa comparar horas orçadas e realizadas em oito disciplinas.',
        pergunta: 'Qual visualização favorece a comparação?',
        opcoes: ['Gráfico de barras agrupadas', 'Gráfico de pizza', 'Velocímetro'],
        correta: 0,
        acerto: 'Isso. Barras agrupadas mantêm as categorias alinhadas e tornam o desvio comparável.',
        erro: 'Prefira uma forma com eixo comum para comparar duas medidas em várias categorias.'
      }
    },
    filtros: {
      objetivo: 'Investigar uma causa por recortes e drill-down sem perder o contexto.',
      competencia: 'investigacao',
      conceitos: ['filtro', 'drilldown', 'dimensão', 'granularidade'],
      pratica: {
        cenario: 'O retrabalho da carteira subiu de 5% para 9,1%.',
        pergunta: 'Qual sequência de investigação é mais segura?',
        opcoes: ['Documento → empresa → contrato', 'Carteira → contrato → disciplina → documento', 'Colaborador → cliente → mês'],
        correta: 1,
        acerto: 'Perfeito. A sequência preserva o contexto e reduz o universo até a causa verificável.',
        erro: 'Comece no consolidado que revelou o desvio e aprofunde uma dimensão por vez.'
      }
    },
    alertas: {
      objetivo: 'Converter um desvio relevante em ação com dono, prazo e acompanhamento.',
      competencia: 'decisao',
      conceitos: ['alerta', 'limite', 'SLA', 'semáforo'],
      pratica: {
        cenario: 'O progresso está 22 pontos abaixo do plano e o consumo de horas já chegou a 72%.',
        pergunta: 'Qual alerta é acionável?',
        opcoes: ['Contrato em vermelho', 'Progresso atrasado', 'Desvio crítico; revisar horas restantes; responsável: coordenação; prazo: 2 dias'],
        correta: 2,
        acerto: 'Exato. O alerta explica a condição e deixa claro quem deve fazer o quê e até quando.',
        erro: 'Um alerta completo precisa de condição, ação, responsável e prazo.'
      }
    },
    planejamento: {
      objetivo: 'Simular como mudanças de premissa alteram custo, prazo, equipe e margem.',
      competencia: 'previsao',
      conceitos: ['forecast', 'cenário', 'meta', 'limite'],
      pratica: {
        cenario: 'A estimativa de horas restantes aumentou, mas a data contratual não mudou.',
        pergunta: 'Qual atitude preserva a utilidade do forecast?',
        opcoes: ['Reduzir a estimativa para caber na meta', 'Recalcular prazo, custo e equipe e registrar a nova premissa', 'Manter o forecast anterior até o encerramento'],
        correta: 1,
        acerto: 'Correto. Forecast registra o resultado provável com as melhores premissas atuais.',
        erro: 'A previsão deve refletir a realidade atual e tornar os impactos visíveis.'
      }
    },
    perfis: {
      objetivo: 'Definir informação e nível de detalhe conforme a decisão de cada perfil.',
      competencia: 'decisao',
      conceitos: ['granularidade', 'KPI', 'dimensão', 'filtro'],
      pratica: {
        cenario: 'Uma dashboard será compartilhada com o cliente do contrato.',
        pergunta: 'Qual conjunto é apropriado para essa visão?',
        opcoes: ['Margem interna, custo individual e avaliação da equipe', 'Progresso, marcos, entregas, pendências e riscos compartilhados', 'Todos os dados, mas sem opção de exportar'],
        correta: 1,
        acerto: 'Certo. A visão externa informa o que sustenta a relação e preserva dados internos.',
        erro: 'Pense nas decisões compartilhadas entre empresa e cliente, respeitando limites de informação.'
      }
    },
    estudos: {
      objetivo: 'Conduzir uma investigação completa do sintoma ao acompanhamento da ação.',
      competencia: 'investigacao',
      conceitos: ['drilldown', 'retrabalho', 'forecast', 'alerta'],
      pratica: {
        cenario: 'A ação foi concluída e o retrabalho caiu, mas a margem ainda não reagiu.',
        pergunta: 'Qual é o próximo passo?',
        opcoes: ['Encerrar o acompanhamento porque a ação terminou', 'Verificar defasagem do indicador e outros custos que afetam a margem', 'Trocar o gráfico da margem'],
        correta: 1,
        acerto: 'Boa decisão. Acompanhamento verifica efeito, tempo de resposta e causas concorrentes.',
        erro: 'Concluir a ação não prova o resultado; investigue o indicador e sua defasagem.'
      }
    },
    praticas: {
      objetivo: 'Revisar uma dashboard com critérios objetivos de clareza e decisão.',
      competencia: 'visualizacao',
      conceitos: ['KPI', 'meta', 'dimensão', 'alerta'],
      pratica: {
        cenario: 'Uma tela possui 28 KPIs, cinco pizzas e nenhum responsável por desvios.',
        pergunta: 'Qual melhoria tem maior prioridade?',
        opcoes: ['Adicionar mais cores aos KPIs', 'Reduzir aos indicadores decisivos e ligar desvios a ações', 'Aumentar os gráficos para preencher a tela'],
        correta: 1,
        acerto: 'Exatamente. Hierarquia e vínculo com decisão vêm antes do acabamento visual.',
        erro: 'Priorize utilidade decisória: o que importa, por que importa e quem age.'
      }
    },
    glossario: {
      objetivo: 'Usar o vocabulário de dashboards com precisão em reuniões e especificações.',
      competencia: 'fundamentos',
      conceitos: ['dado', 'indicador', 'forecast', 'drilldown'],
      pratica: {
        cenario: 'Uma equipe chama qualquer número grande no topo da tela de KPI.',
        pergunta: 'Qual correção conceitual é adequada?',
        opcoes: ['Todo número destacado é um KPI', 'KPI é um indicador-chave ligado a objetivo, referência e decisão', 'KPI é sinônimo de gráfico'],
        correta: 1,
        acerto: 'Correto. Destaque visual não transforma uma medida em indicador-chave.',
        erro: 'O conceito depende da função gerencial do número, não do tamanho com que ele aparece.'
      }
    }
  };

  function modulo(id) { return MODULOS[id] || null; }
  function competencia(id) { return COMPETENCIAS[id] || null; }
  function definicao(termo) { return GLOSSARIO[termo] || GLOSSARIO[String(termo).toLowerCase()] || ''; }

  function buscar(consulta) {
    var q = normalizar(consulta);
    var grupos = q.split(/\s+/).filter(Boolean).map(function (palavra) {
      return (SINONIMOS[palavra] || [palavra]).map(normalizar);
    });
    var resultados = [];

    function corresponde(texto) {
      texto = normalizar(texto);
      return texto.indexOf(q) >= 0 || grupos.every(function (grupo) {
        return grupo.some(function (termo) { return texto.indexOf(termo) >= 0; });
      });
    }

    APP.order.forEach(function (id) {
      var p = APP.pages[id];
      var a = modulo(id) || {};
      var campos = [p.title, p.desc, p.code, a.objetivo]
        .concat(p.tags || [], a.conceitos || [])
        .filter(Boolean);
      var texto = campos.join(' ');
      if (corresponde(texto)) {
        resultados.push({
          termo: p.title,
          id: id,
          mod: p.code + ' · ' + p.nivel,
          trecho: a.objetivo || p.desc,
          score: normalizar(p.title).indexOf(q) >= 0 ? 3 : 1
        });
      }
    });

    Object.keys(GLOSSARIO).forEach(function (termo) {
      if (!corresponde(termo + ' ' + GLOSSARIO[termo])) return;
      var destino = APP.order.find(function (id) {
        return ((modulo(id) || {}).conceitos || []).some(function (c) {
          return normalizar(c) === normalizar(termo);
        });
      }) || 'glossario';
      resultados.push({ termo: termo, id: destino, mod: 'Conceito-chave', trecho: GLOSSARIO[termo], score: 2 });
    });

    return resultados.sort(function (a, b) { return b.score - a.score; }).slice(0, 10);
  }

  function normalizar(s) {
    return String(s || '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  }

  function trilhaAtual() { return TRILHAS[Progresso.trilha()] || null; }

  function proximoDaTrilha() {
    var trilha = trilhaAtual();
    if (!trilha) return null;
    return trilha.modulos.find(function (id) { return !Progresso.concluido(id); }) || trilha.modulos[trilha.modulos.length - 1];
  }

  function montarLeituraFocada(raiz, def) {
    var iniciar = raiz.querySelector('[data-foco-iniciar]');
    var controles = raiz.querySelector('[data-foco-controles]');
    if (!iniciar || !controles) return;
    if (def && def.foco === false) {
      iniciar.hidden = true;
      return;
    }

    var secoes = Array.prototype.slice.call(raiz.querySelectorAll(':scope > section.section'));
    if (secoes.length < 2) {
      iniciar.hidden = true;
      return;
    }
    secoes[0].id = secoes[0].id || 'conteudo-modulo';
    var atual = 0;

    function mostrar(i) {
      atual = Math.max(0, Math.min(secoes.length - 1, i));
      secoes.forEach(function (secao, n) { secao.hidden = n !== atual; });
      controles.querySelector('[data-foco-etapa]').textContent = (atual + 1) + ' de ' + secoes.length;
      controles.querySelector('[data-foco-titulo]').textContent =
        (secoes[atual].querySelector('h2, h3') || {}).textContent || 'Conteúdo';
      controles.querySelector('[data-foco-anterior]').disabled = atual === 0;
      controles.querySelector('[data-foco-proximo]').disabled = atual === secoes.length - 1;
      var reduzir = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      secoes[atual].scrollIntoView({ behavior: reduzir ? 'auto' : 'smooth', block: 'start' });
    }

    function sair() {
      raiz.classList.remove('modo-foco');
      secoes.forEach(function (secao) { secao.hidden = false; });
      controles.hidden = true;
      iniciar.setAttribute('aria-pressed', 'false');
      iniciar.textContent = 'Ativar leitura focada';
    }

    iniciar.addEventListener('click', function () {
      raiz.classList.add('modo-foco');
      controles.hidden = false;
      iniciar.setAttribute('aria-pressed', 'true');
      iniciar.textContent = 'Leitura focada ativa';
      mostrar(0);
    });
    controles.querySelector('[data-foco-anterior]').addEventListener('click', function () { mostrar(atual - 1); });
    controles.querySelector('[data-foco-proximo]').addEventListener('click', function () { mostrar(atual + 1); });
    controles.querySelector('[data-foco-sair]').addEventListener('click', sair);
  }

  function montarConceitos(raiz) {
    var painel = raiz.querySelector('[data-conceito-painel]');
    if (!painel) return;
    raiz.querySelectorAll('[data-conceito]').forEach(function (botao) {
      botao.addEventListener('click', function () {
        var termo = botao.dataset.conceito;
        painel.innerHTML = '<strong>' + UI.esc(termo) + '</strong><span>' + UI.esc(definicao(termo)) + '</span>';
        painel.hidden = false;
      });
    });
  }

  function montarPratica(pagina, raiz) {
    var bloco = raiz.querySelector('[data-pratica="' + pagina.id + '"]');
    var def = modulo(pagina.id);
    if (!bloco || !def) return;
    var feedback = bloco.querySelector('[data-pratica-feedback]');
    var botao = bloco.querySelector('[data-pratica-checar]');

    function concluida() {
      bloco.classList.add('concluida');
      botao.textContent = 'Competência praticada ✓';
      botao.disabled = true;
      bloco.querySelectorAll('input').forEach(function (input) { input.disabled = true; });
    }

    if (Progresso.exercicioConcluido(pagina.id)) {
      feedback.hidden = false;
      feedback.className = 'practice-feedback acertou';
      feedback.textContent = def.pratica.acerto;
      concluida();
    }

    botao.addEventListener('click', function () {
      var marcada = bloco.querySelector('input:checked');
      if (!marcada) {
        feedback.hidden = false;
        feedback.className = 'practice-feedback precisa-resposta';
        feedback.textContent = 'Selecione uma alternativa para receber o feedback.';
        return;
      }
      var acertou = +marcada.value === def.pratica.correta;
      feedback.hidden = false;
      feedback.className = 'practice-feedback ' + (acertou ? 'acertou' : 'errou');
      feedback.textContent = acertou ? def.pratica.acerto : def.pratica.erro;
      Progresso.registrarExercicio(pagina.id, acertou, def.competencia);
      if (acertou) concluida();
    });
  }

  function mount(pagina, raiz) {
    if (!modulo(pagina.id)) return;
    montarConceitos(raiz);
    montarLeituraFocada(raiz, modulo(pagina.id));
    montarPratica(pagina, raiz);
  }

  return {
    competencias: COMPETENCIAS,
    trilhas: TRILHAS,
    glossario: GLOSSARIO,
    modulo: modulo,
    competencia: competencia,
    definicao: definicao,
    buscar: buscar,
    trilhaAtual: trilhaAtual,
    proximoDaTrilha: proximoDaTrilha,
    mount: mount
  };
})();
