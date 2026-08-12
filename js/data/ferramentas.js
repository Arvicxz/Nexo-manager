/* =====================================================================
   ferramentas.js — com o que se implementa cada conceito, no mercado.

   Organizado pelas CAMADAS do fluxo que o MOD-02 já ensina, e não por
   marca: assim a lista não é um catálogo de fornecedores, é o mesmo
   caminho do dado que o aluno acabou de aprender, agora com nomes reais
   em cada etapa.

   REGRAS EDITORIAIS (ver MOD-13):
     1. Sem ranking. Nunca "a melhor": sempre "as que resolvem isto".
     2. Sem preço e sem número de versão — desatualizam sozinhos e são a
        principal fonte de erro factual num catálogo.
     3. Toda camada tem ao menos uma opção de código aberto, para que a
        trilha continue aplicável a quem não tem orçamento.

   `porte` indica onde a ferramenta costuma fazer sentido:
     planilha  · dá para começar hoje, sem projeto de TI
     time      · uma equipe ou uma área
     corp      · corporativo, com governança e área de dados
   ===================================================================== */
window.FERRAMENTAS = (function () {

  var CAMADAS = [
    {
      id: 'origem',
      nome: 'Origem',
      papel: 'Os sistemas que registram o fato: contrato, documento, hora apontada, nota fiscal.',
      conceito: 'É a primeira etapa do fluxo do MOD-02. Nenhuma dashboard é melhor que o apontamento que a alimenta.',
      itens: [
        { nome: 'Oracle Aconex', o: 'Controle de documentos e fluxos de aprovação em obras e projetos.', porte: 'corp', licenca: 'pago' },
        { nome: 'Bentley ProjectWise', o: 'Gestão de documentos técnicos de engenharia, com controle de revisão.', porte: 'corp', licenca: 'pago' },
        { nome: 'Autodesk Construction Cloud', o: 'Documentos, pranchas e pendências integrados ao projeto.', porte: 'corp', licenca: 'pago' },
        { nome: 'Clockify · Toggl Track', o: 'Apontamento de horas por pessoa, contrato e disciplina — o papel do RAT.', porte: 'time', licenca: 'freemium' },
        { nome: 'Kimai', o: 'Apontamento de horas em código aberto, instalado na sua infraestrutura; útil quando o dado de horas não pode sair da empresa.', porte: 'time', licenca: 'aberto' },
        { nome: 'Nextcloud · Alfresco Community', o: 'Repositório de documentos com versionamento em código aberto, para quem não vai contratar um controle de documentos dedicado.', porte: 'time', licenca: 'aberto' },
        { nome: 'TOTVS · Sienge · Omie', o: 'ERPs com forte presença em engenharia e construção no Brasil.', porte: 'corp', licenca: 'pago' },
        { nome: 'SharePoint + Power Apps', o: 'Monta controle de documentos e apontamento sem sistema novo, se a empresa já usa Microsoft 365.', porte: 'time', licenca: 'pago' }
      ]
    },
    {
      id: 'ingestao',
      nome: 'Ingestão',
      papel: 'Tirar o dado de cada sistema e levá-lo, com regularidade, para um lugar só.',
      conceito: 'É o que torna possível o passo “modelo único de informações”. Sem isso, cada área exporta sua própria planilha.',
      itens: [
        { nome: 'Power Query', o: 'Onde quase todo mundo começa: já vem no Excel e no Power BI e resolve boa parte dos casos.', porte: 'planilha', licenca: 'pago' },
        { nome: 'Airbyte', o: 'Conectores prontos para centenas de sistemas; roda na sua infraestrutura.', porte: 'time', licenca: 'aberto' },
        { nome: 'Meltano', o: 'Ingestão declarada em arquivo, versionada junto com o código.', porte: 'time', licenca: 'aberto' },
        { nome: 'Fivetran', o: 'Conectores gerenciados, sem manutenção de pipeline.', porte: 'corp', licenca: 'pago' },
        { nome: 'Azure Data Factory · AWS Glue', o: 'Ingestão gerenciada dentro da nuvem que a empresa já usa.', porte: 'corp', licenca: 'pago' }
      ]
    },
    {
      id: 'armazenamento',
      nome: 'Armazenamento',
      papel: 'Onde o dado consolidado vive e de onde toda a empresa lê.',
      conceito: 'É a diferença entre “o número do financeiro” e “o número da empresa”.',
      itens: [
        { nome: 'PostgreSQL', o: 'Banco relacional maduro; suficiente para a maioria das empresas de porte médio.', porte: 'time', licenca: 'aberto' },
        { nome: 'DuckDB', o: 'Análise sobre arquivos locais, sem servidor. Excelente para prototipar um modelo.', porte: 'planilha', licenca: 'aberto' },
        { nome: 'ClickHouse', o: 'Consulta analítica muito rápida sobre volumes grandes.', porte: 'corp', licenca: 'aberto' },
        { nome: 'BigQuery · Snowflake · Databricks', o: 'Repositórios analíticos gerenciados, com separação entre armazenar e processar.', porte: 'corp', licenca: 'pago' }
      ]
    },
    {
      id: 'semantica',
      nome: 'Transformação e camada semântica',
      papel: 'Onde a fórmula oficial de cada indicador é escrita, versionada e revisada.',
      conceito: 'É a resposta técnica direta ao princípio do MOD-02: a fórmula é da empresa, não da tela. A camada semântica existe exatamente para isso — margem bruta é definida uma vez e todo relatório lê essa definição.',
      itens: [
        { nome: 'dbt', o: 'Transformações em SQL versionadas, com testes e documentação geradas do próprio código.', porte: 'time', licenca: 'aberto' },
        { nome: 'dbt Semantic Layer · Cube', o: 'Definem a métrica uma vez e servem o mesmo número para qualquer ferramenta de visualização.', porte: 'corp', licenca: 'freemium' },
        { nome: 'LookML (Looker)', o: 'Modelo semântico acoplado à ferramenta de BI do Google Cloud.', porte: 'corp', licenca: 'pago' },
        { nome: 'Power Pivot e DAX', o: 'A camada de medidas dentro do Excel e do Power BI; onde definir a fórmula sem sair do ambiente atual.', porte: 'planilha', licenca: 'pago' }
      ]
    },
    {
      id: 'qualidade',
      nome: 'Qualidade e validação',
      papel: 'Testes automáticos que reprovam a carga quando o dado chega errado.',
      conceito: 'É o passo “tratamento e validação” do MOD-02 virando código. Regras como “contrato sem orçamento” ou “documento sem responsável” deixam de ser conferência manual.',
      itens: [
        { nome: 'dbt tests', o: 'Se você já usa dbt, os testes básicos (nulo, único, relacionamento, faixa) vêm junto.', porte: 'time', licenca: 'aberto' },
        { nome: 'Great Expectations', o: 'Regras de validação declaradas e documentadas, com relatório de falhas.', porte: 'time', licenca: 'aberto' },
        { nome: 'Soda', o: 'Verificações de qualidade em linguagem próxima do negócio.', porte: 'time', licenca: 'freemium' },
        { nome: 'Elementary · Monte Carlo', o: 'Observabilidade: avisam quando o dado muda de comportamento sem ninguém ter mexido.', porte: 'corp', licenca: 'freemium' }
      ]
    },
    {
      id: 'catalogo',
      nome: 'Catálogo e linhagem',
      papel: 'Onde cada indicador tem dono, definição escrita e rastro de origem.',
      conceito: 'É o glossário do MOD-12 virando artefato operacional: com versão, responsável e a lista de telas afetadas quando a definição muda.',
      itens: [
        { nome: 'DataHub · OpenMetadata', o: 'Catálogo, glossário de negócio e linhagem ponta a ponta.', porte: 'corp', licenca: 'aberto' },
        { nome: 'Amundsen', o: 'Busca de dados orientada a quem consome, criado com esse propósito na Lyft.', porte: 'corp', licenca: 'aberto' },
        { nome: 'Microsoft Purview · Collibra · Alation', o: 'Catálogo e governança corporativos, com fluxo de aprovação de definições.', porte: 'corp', licenca: 'pago' }
      ]
    },
    {
      id: 'orquestracao',
      nome: 'Orquestração',
      papel: 'Executa a carga na hora certa, na ordem certa, e avisa quando falha.',
      conceito: 'É o que sustenta a exigência do MOD-11 de declarar data da última carga e período não fechado: a informação existe porque alguém a registra.',
      itens: [
        { nome: 'Apache Airflow', o: 'O padrão de fato para agendar e monitorar cargas.', porte: 'corp', licenca: 'aberto' },
        { nome: 'Dagster', o: 'Orquestração pensada em torno dos dados produzidos, não só das tarefas.', porte: 'time', licenca: 'aberto' },
        { nome: 'Prefect', o: 'Curva de entrada mais curta para times pequenos.', porte: 'time', licenca: 'freemium' }
      ]
    },
    {
      id: 'visualizacao',
      nome: 'Visualização',
      papel: 'A dashboard em si: onde o indicador vira tela.',
      conceito: 'É onde tudo o que os módulos 03, 05, 06 e 09 ensinam é aplicado — camadas de leitura, escolha do gráfico, filtros e visões por perfil.',
      itens: [
        { nome: 'Power BI', o: 'Maior presença em empresas brasileiras de médio porte; integra com Excel e Microsoft 365.', porte: 'corp', licenca: 'pago' },
        { nome: 'Tableau', o: 'Forte em exploração visual e liberdade de composição.', porte: 'corp', licenca: 'pago' },
        { nome: 'Looker Studio', o: 'Gratuito e rápido para começar, especialmente com dados no Google.', porte: 'time', licenca: 'freemium' },
        { nome: 'Metabase', o: 'Instala e usa no mesmo dia; boa porta de entrada para BI em time pequeno.', porte: 'time', licenca: 'aberto' },
        { nome: 'Apache Superset', o: 'BI de código aberto com bom controle de permissões.', porte: 'corp', licenca: 'aberto' },
        { nome: 'Grafana', o: 'Operação e tempo real: painéis de telão, atualização contínua e alertas nativos.', porte: 'time', licenca: 'aberto' },
        { nome: 'Zebra BI', o: 'Complemento para Power BI e Excel que implementa a notação IBCS citada nas fontes do MOD-11.', porte: 'corp', licenca: 'pago' }
      ]
    },
    {
      id: 'bibliotecas',
      nome: 'Bibliotecas de gráfico',
      papel: 'Quando a dashboard é construída dentro de um sistema próprio.',
      conceito: 'Vale conferir quais trazem bullet chart e cascata prontos: são dois gráficos que o MOD-05 recomenda e que faltam em várias bibliotecas.',
      itens: [
        { nome: 'Apache ECharts', o: 'Cobertura ampla de tipos, inclusive cascata e Gantt; documentação farta.', porte: 'time', licenca: 'aberto' },
        { nome: 'Vega-Lite', o: 'O gráfico é declarado como especificação, não desenhado — muito próximo do raciocínio de Munzner.', porte: 'time', licenca: 'aberto' },
        { nome: 'Observable Plot', o: 'API curta para gráficos exploratórios, dos autores do D3.', porte: 'time', licenca: 'aberto' },
        { nome: 'Plotly · Chart.js', o: 'Populares e simples de embutir; Chart.js cobre bem o básico.', porte: 'time', licenca: 'aberto' },
        { nome: 'Highcharts · AG Charts', o: 'Comerciais, com bullet, gauge e cascata prontos e suporte formal.', porte: 'corp', licenca: 'pago' }
      ]
    },
    {
      id: 'alertas',
      nome: 'Alertas e ação',
      papel: 'Levar a exceção até a pessoa que pode agir, com prazo.',
      conceito: 'O “responsável e prazo” do MOD-07 tem nome nessas ferramentas: política de escalonamento. É o que impede o alerta de virar paisagem.',
      itens: [
        { nome: 'Grafana Alerting', o: 'Regra, silenciamento, escalonamento e histórico de quem reconheceu cada alerta.', porte: 'time', licenca: 'aberto' },
        { nome: 'Power BI + Power Automate', o: 'Alerta no indicador dispara fluxo: e-mail, tarefa no Planner, mensagem no Teams.', porte: 'corp', licenca: 'pago' },
        { nome: 'Metabase alerts', o: 'Envio programado quando o resultado cruza um limite.', porte: 'time', licenca: 'aberto' },
        { nome: 'PagerDuty · Opsgenie', o: 'Plantão e escalonamento quando ninguém responde no prazo.', porte: 'corp', licenca: 'pago' },
        { nome: 'Webhooks para Slack e Teams', o: 'O caminho mais curto entre uma regra e a conversa onde a decisão acontece.', porte: 'time', licenca: 'aberto' }
      ]
    },
    {
      id: 'estatistica',
      nome: 'Estatística e ciência de dados',
      papel: 'Quando a leitura do indicador não basta e é preciso analisar.',
      conceito: 'É o ferramental por trás do conceito de limite do MOD-02: controle estatístico de processo separa oscilação normal de problema real.',
      itens: [
        { nome: 'Python (pandas, statsmodels, scikit-learn)', o: 'O ambiente mais comum para análise e modelagem.', porte: 'time', licenca: 'aberto' },
        { nome: 'R (tidyverse, fable)', o: 'Forte tradição estatística; excelente para séries temporais.', porte: 'time', licenca: 'aberto' },
        { nome: 'Jupyter · Quarto · Marimo', o: 'Notebooks para registrar a análise junto com o raciocínio que a produziu.', porte: 'time', licenca: 'aberto' },
        { nome: 'Minitab · JMP', o: 'Controle estatístico de processo e cartas de controle sem programar.', porte: 'corp', licenca: 'pago' },
        { nome: 'qcc (R) · pyspc', o: 'Cartas de controle em código aberto, para quem já usa R ou Python.', porte: 'time', licenca: 'aberto' }
      ]
    },
    {
      id: 'previsao',
      nome: 'Previsão',
      papel: 'Projetar o resultado provável — com faixa de incerteza, não com número único.',
      conceito: 'Todas as opções abaixo entregam intervalo de previsão. É a diferença entre o forecast do MOD-08 e um chute bem formatado.',
      itens: [
        { nome: 'statsmodels · StatsForecast', o: 'Modelos clássicos de série temporal em Python, com intervalo de previsão.', porte: 'time', licenca: 'aberto' },
        { nome: 'fable (R)', o: 'Pacote que acompanha o livro de Hyndman citado nas fontes do MOD-08.', porte: 'time', licenca: 'aberto' },
        { nome: 'Prophet', o: 'Previsão com sazonalidade e feriados, com pouca configuração.', porte: 'time', licenca: 'aberto' },
        { nome: 'Previsão nativa do Power BI', o: 'Linha de previsão com intervalo de confiança, direto no gráfico de linha.', porte: 'planilha', licenca: 'pago' },
        { nome: 'PREVISÃO.ETS no Excel', o: 'Suavização exponencial com intervalo, sem sair da planilha.', porte: 'planilha', licenca: 'pago' }
      ]
    },
    {
      id: 'projetos',
      nome: 'Prazo, custo e valor agregado',
      papel: 'Onde progresso físico, custo e prazo são calculados em conjunto.',
      conceito: 'São as ferramentas que produzem SPI, CPI e EAC — os indicadores que o MOD-04 ensina pelo par “progresso × horas” e que o MOD-08 usa como forecast.',
      itens: [
        { nome: 'Oracle Primavera P6', o: 'Referência em cronograma e valor agregado em projetos de engenharia.', porte: 'corp', licenca: 'pago' },
        { nome: 'Microsoft Project', o: 'Cronograma e linha de base com cálculo de valor agregado embutido.', porte: 'corp', licenca: 'pago' },
        { nome: 'Deltek Cobra · Acumen', o: 'Especializados em valor agregado e análise de qualidade do cronograma.', porte: 'corp', licenca: 'pago' },
        { nome: 'Jira + BigPicture · Smartsheet', o: 'Alternativas mais leves quando o rigor de EVM completo não se justifica.', porte: 'time', licenca: 'pago' },
        { nome: 'GanttProject · ProjectLibre', o: 'Cronograma e caminho crítico em código aberto.', porte: 'time', licenca: 'aberto' }
      ]
    },
    {
      id: 'projeto-visual',
      nome: 'Projeto visual e acessibilidade',
      papel: 'Rascunhar a tela antes de construir e conferir se ela é legível para todos.',
      conceito: 'Os requisitos do MOD-11 são verificáveis por ferramenta: contraste, foco, uso de cor e tamanho de alvo têm teste automático.',
      itens: [
        { nome: 'Figma · FigJam', o: 'Rascunho e validação do layout com quem vai usar, antes de programar.', porte: 'time', licenca: 'freemium' },
        { nome: 'Excalidraw · Miro', o: 'Esboço rápido de hierarquia e camadas de leitura.', porte: 'time', licenca: 'freemium' },
        { nome: 'axe DevTools · WAVE', o: 'Auditoria automática de acessibilidade direto no navegador, com o critério WCAG apontado.', porte: 'time', licenca: 'freemium' },
        { nome: 'Colour Contrast Analyser', o: 'Confere o contraste de 4,5:1 exigido pelo critério 1.4.3.', porte: 'planilha', licenca: 'aberto' },
        { nome: 'ColorBrewer · Viz Palette', o: 'Paletas testadas para daltonismo e para impressão em preto e branco.', porte: 'planilha', licenca: 'aberto' }
      ]
    }
  ];

  var PORTES = {
    planilha: 'Dá para começar hoje',
    time:     'Uma equipe ou área',
    corp:     'Corporativo'
  };

  var LICENCAS = {
    aberto:   'Código aberto',
    freemium: 'Camada gratuita',
    pago:     'Pago'
  };

  function camada(id) {
    return CAMADAS.filter(function (c) { return c.id === id; })[0] || null;
  }

  /* Devolve as camadas que um módulo declarou, na ordem em que ele as pediu. */
  function de(pagina) {
    return ((pagina && pagina.ferramentas) || [])
      .map(function (id) {
        var c = camada(id);
        if (!c) console.warn('[nexo] camada de ferramentas desconhecida: "' + id + '"');
        return c;
      })
      .filter(Boolean);
  }

  function total() {
    return CAMADAS.reduce(function (soma, c) { return soma + c.itens.length; }, 0);
  }

  return { camadas: CAMADAS, portes: PORTES, licencas: LICENCAS,
           camada: camada, de: de, total: total };
})();
