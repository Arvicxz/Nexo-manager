/* =====================================================================
   data.js — Todos os dados abaixo são FICTÍCIOS e servem apenas para
   demonstração didática. Empresa de engenharia com carteira de
   contratos, disciplinas técnicas e equipes compartilhadas.

   REGRA DA CASA: nenhum valor derivado é digitado à mão.
   Margem, cascata e percentuais saem de uma única conta, aqui.
   É o mesmo princípio que o MOD-02 ensina — "a fórmula é da empresa,
   não da tela" — aplicado ao próprio material didático.
   O arquivo tests/coerencia.js verifica essas contas a cada mudança.
   ===================================================================== */
window.DATA = (function () {

  var meses = ['Jan/26','Fev/26','Mar/26','Abr/26','Mai/26','Jun/26','Jul/26'];

  /* --------- Financeiro consolidado (R$ mil) --------- */
  /* Custos DIRETOS: consumidos pela execução do contrato. */
  var receita   = [1180, 1240, 1310, 1275, 1360, 1405, 1290];
  var custoMOD  = [ 520,  548,  590,  600,  641,  678,  651];  /* mão de obra direta */
  var custoCPE  = [ 100,   99,  106,   94,  110,  107,   84];  /* terceiros, fornecedores e despesas externas */
  /* Despesa INDIRETA: administrativa, não entra na margem bruta. */
  var despesas  = [  76,   79,   84,   82,   88,   91,   87];

  var ultimo = receita.length - 1;

  /* Margem bruta = (Receita − Custos diretos) ÷ Receita.
     Uma fórmula, um resultado: o cartão, o gráfico e a cascata leem daqui. */
  function margemValor(i) { return receita[i] - custoMOD[i] - custoCPE[i]; }
  function margemPercentual(i) { return +(margemValor(i) / receita[i] * 100).toFixed(1); }

  return {
    atualizacao: '24/07/2026 às 09:15',
    meses: meses,

    receita:      receita,
    custoMOD:     custoMOD,
    custoCPE:     custoCPE,
    despesas:     despesas,
    margemPct:    receita.map(function (_, i) { return margemPercentual(i); }),
    metaMargem:   48,
    faturado:     [1120, 1190, 1260, 1240, 1300, 1330, 1180],
    recebido:     [1040, 1105, 1180, 1210, 1245, 1270, 1090],
    backlog:      [8900, 8620, 8310, 8180, 7960, 7710, 7520],
    prazoMedioRecebimento: 43,

    /* --------- Horas (carteira) --------- */
    horasPlan: [ 7300, 7400, 7600, 7550, 7700, 7800, 7650 ],
    horasReal: [ 7180, 7460, 7920, 8010, 8340, 8620, 8480 ],
    utilizacao:[ 78.5, 79.2, 81.0, 82.4, 84.6, 86.9, 88.1 ],
    metaUtilizacao: 82,

    /* --------- Carteira de contratos --------- */
    contratos: [
      { cod:'DQM24001', cliente:'Delta',       valor:4200, margem:39.2, margemPrev:38.0, progresso:52, horasPct:72,
        atrasoDias:12, saude:'crit',  dim:{prazo:'crit',custo:'warn',margem:'crit',qualidade:'warn',capacidade:'crit'},
        coordenador:'M. Andrade' },
      { cod:'RFN22001', cliente:'Refinor',    valor:3100, margem:51.4, margemPrev:50.8, progresso:78, horasPct:74,
        atrasoDias:0,  saude:'ok',    dim:{prazo:'ok',custo:'ok',margem:'ok',qualidade:'ok',capacidade:'ok'},
        coordenador:'R. Beltrão' },
      { cod:'VNT24001', cliente:'Vanto',     valor:2650, margem:41.8, margemPrev:39.6, progresso:34, horasPct:47,
        atrasoDias:9,  saude:'warn',  dim:{prazo:'crit',custo:'warn',margem:'crit',qualidade:'ok',capacidade:'warn'},
        coordenador:'L. Furtado' },
      { cod:'PTM22001',  cliente:'Petromar', valor:5400, margem:49.6, margemPrev:48.9, progresso:64, horasPct:61,
        atrasoDias:2,  saude:'ok',    dim:{prazo:'warn',custo:'ok',margem:'ok',qualidade:'ok',capacidade:'warn'},
        coordenador:'P. Nakamura' },
      { cod:'PTM23004', cliente:'Petromar', valor:1980, margem:46.1, margemPrev:45.2, progresso:88, horasPct:84,
        atrasoDias:0,  saude:'ok',    dim:{prazo:'ok',custo:'ok',margem:'warn',qualidade:'ok',capacidade:'ok'},
        coordenador:'C. Vasques' }
    ],

    /* --------- Disciplinas --------- */
    disciplinas: ['CIV','TUB','INS','ELE','MEC'],
    disciplinaNome: {
      CIV:'Civil e estruturas', TUB:'Tubulação', INS:'Instrumentação',
      ELE:'Elétrica', MEC:'Mecânica'
    },

    /* Horas orçadas x realizadas por disciplina no contrato DQM24001 */
    horasDisc: {
      labels:['CIV','TUB','INS','ELE','MEC'],
      orcadas:  [1850, 1420,  960, 880, 1100],
      realizadas:[2260, 1490,  980, 840, 1130]
    },

    /* Capacidade: necessário − disponível (pessoas equivalentes) */
    capacidade: {
      meses:['Jul','Ago','Set','Out','Nov','Dez'],
      linhas:[
        { disc:'CIV', v:[-3,-4,-2, 0, 1, 1] },
        { disc:'TUB', v:[ 2, 1, 0,-1,-1, 0] },
        { disc:'INS', v:[ 0, 1, 2, 2, 1, 0] },
        { disc:'ELE', v:[ 1, 0, 0,-1,-2,-1] },
        { disc:'MEC', v:[ 0,-1,-1, 0, 1, 2] }
      ]
    },

    /* --------- Documentos e aprovações --------- */
    documentos: {
      previstos:1240, iniciados:1010, emitidos:812, aprovados:640,
      emRevisao:172, atrasados:96, semResponsavel:14,
      tempoMedioAprovacao:11.4, taxaPrimeiraEmissao:63.2, revisoesMedia:2.4,
      statusSerie:{ labels:meses, aprovados:[62,71,80,74,88,96,84], emitidos:[95,102,118,110,124,131,112] }
    },

    /* --------- Pipeline comercial --------- */
    funil: [
      { etapa:'Oportunidades',   v:64 },
      { etapa:'Propostas',       v:38 },
      { etapa:'Negociações',     v:19 },
      { etapa:'Contratos ganhos',v: 7 }
    ],

    /* --------- Alertas --------- */
    alertas: [
      { nivel:'crit', titulo:'Margem prevista do DQM24001 abaixo do mínimo',
        limite:'Margem prevista 38,0% · mínimo 48%',
        causa:'Consumo de horas da CIV 22% acima do orçado com progresso físico de 52%',
        /* 10 pontos abaixo do mínimo sobre R$ 4.200 mil contratados = R$ 420 mil. */
        impacto:'Redução de R$ 420 mil no resultado previsto do contrato',
        responsavel:'Coordenador do contrato · M. Andrade', prazo:'27/07/2026',
        acao:'Revisar horas restantes e formalizar alterações de escopo', status:'Pendente' },
      { nivel:'high', titulo:'CIV superalocada em julho e agosto',
        limite:'Necessidade 220 h · disponibilidade 176 h por pessoa',
        causa:'Três contratos com picos simultâneos na mesma disciplina',
        impacto:'Atraso provável em 2 marcos contratuais',
        responsavel:'Gestor de recursos · A. Miranda', prazo:'25/07/2026',
        acao:'Replanejar alocação ou contratar apoio externo', status:'Em andamento' },
      { nivel:'warn', titulo:'12 documentos atrasados no VNT24001',
        limite:'Atraso máximo aceitável: 5 dias',
        causa:'Fila de aprovação interna e pendências de definição do cliente',
        impacto:'Faturamento de R$ 210 mil retido na próxima medição',
        responsavel:'Coordenador do contrato · L. Furtado', prazo:'26/07/2026',
        acao:'Cobrar aprovações e registrar pendências do cliente', status:'Pendente' },
      { nivel:'info', titulo:'Prazo médio de recebimento subiu para 43 dias',
        limite:'Referência histórica: 38 dias',
        causa:'Concentração de faturas em um único cliente',
        impacto:'Necessidade adicional de caixa em agosto',
        responsavel:'Financeiro · S. Prado', prazo:'31/07/2026',
        acao:'Acompanhar cobrança e revisar previsão de caixa', status:'Reconhecido' }
    ],

    /* --------- Plano de ação --------- */
    acoes: [
      { prio:'Crítica', alerta:'CIV superalocada',        impacto:'Atraso provável',   resp:'Gestor de recursos', prazo:'25/07', acao:'Replanejar alocação',   status:'Em andamento' },
      { prio:'Alta',    alerta:'12 documentos atrasados',   impacto:'Faturamento retido',resp:'Coordenador',        prazo:'26/07', acao:'Cobrar responsáveis',   status:'Pendente' },
      { prio:'Alta',    alerta:'Margem prevista de 38%',    impacto:'Resultado abaixo da meta', resp:'Gerente',     prazo:'27/07', acao:'Revisar custos e escopo',status:'Pendente' },
      { prio:'Média',   alerta:'Retrabalho de 9,1% na CIV',impacto:'Consumo extra de horas', resp:'Líder CIV', prazo:'30/07', acao:'Analisar causas das revisões', status:'Pendente' }
    ],

    /* --------- Estudo de caso: contrato DQM24001 --------- */
    caso: {
      contrato:'DQM24001', cliente:'Delta', valor:4200,
      /* O contrato acompanha o plano até março e se descola a partir de abril:
         a distância salta de 2 para 7 pontos e não para mais de crescer.
         É esse ponto de inflexão que o MOD-10 pede para o aluno encontrar. */
      progressoPlan:[10,22,34,45,56,66,74],
      progressoReal:[ 9,21,32,38,44,48,52],
      horasAcum:    [11,23,35,47,57,65,72],
      docsRevisao:[ {doc:'DQM-CIV-DE-0142', revisoes:4, motivo:'Alteração de premissa do cliente'},
                    {doc:'DQM-CIV-DE-0157', revisoes:3, motivo:'Interferência com tubulação'},
                    {doc:'DQM-CIV-ME-0031', revisoes:3, motivo:'Retrabalho interno'},
                    {doc:'DQM-EST-DE-0088', revisoes:2, motivo:'Aguardando definição do cliente'} ],
      pendClientes:4, retrabalhoPct:9.1
    },

    /* --------- Waterfall do resultado (R$ mil, mês de julho) ---------
       Derivado das mesmas séries acima: a soma sempre fecha, por construção. */
    cascata: [
      { rot:'Receita',      v:  receita[ultimo],                     tipo:'inicio' },
      { rot:'MOD',          v: -custoMOD[ultimo],                    tipo:'neg' },
      { rot:'CPE',          v: -custoCPE[ultimo],                    tipo:'neg' },
      { rot:'Margem bruta', v:  margemValor(ultimo),                 tipo:'sub' },
      { rot:'Despesas',     v: -despesas[ultimo],                    tipo:'neg' },
      { rot:'Resultado',    v:  margemValor(ultimo) - despesas[ultimo], tipo:'fim' }
    ]
  };
})();
