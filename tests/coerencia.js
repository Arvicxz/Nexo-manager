/* =====================================================================
   coerencia.js — a trava contra incoerência entre dado e texto.

   Auditar uma vez resolve hoje. O problema volta na próxima vez que
   alguém mudar um custo em data.js e esquecer de atualizar a frase que
   cita aquele número. Foi exatamente assim que a margem passou a ter
   três valores diferentes na mesma tela.

   Este arquivo recalcula os valores derivados e falha se a prosa dos
   templates discordar. Roda em segundos, sem dependência nenhuma:

       npm run verificar

   Ele não sabe interpretar texto: sabe conferir se um número que
   aparece escrito ainda corresponde ao que os dados produzem.
   ===================================================================== */
const fs = require('fs');
const path = require('path');

const RAIZ = path.join(__dirname, '..');
const falhas = [];
const passou = [];

function checar(nome, esperado, obtido) {
  const ok = String(esperado) === String(obtido);
  (ok ? passou : falhas).push({ nome, esperado, obtido, ok });
}

/* ---------------------------------------------------------------------
   Carrega window.DATA sem navegador: o arquivo só declara um objeto.
   --------------------------------------------------------------------- */
function carregarDATA() {
  const fonte = fs.readFileSync(path.join(RAIZ, 'js/data/data.js'), 'utf8');
  const janela = {};
  new Function('window', fonte)(janela);
  return janela.DATA;
}

const DATA = carregarDATA();
const ULT = DATA.receita.length - 1;
const texto = (arquivo) => fs.readFileSync(path.join(RAIZ, 'public/pages', arquivo), 'utf8');

const pt1 = (v) => v.toFixed(1).replace('.', ',');
const pct = (parte, todo) => +(parte / todo * 100).toFixed(1);

/* =====================================================================
   1. Margem bruta: uma fórmula, um resultado
   ===================================================================== */
const margemValor = DATA.receita.map((r, i) => r - DATA.custoMOD[i] - DATA.custoCPE[i]);

DATA.margemPct.forEach((declarada, i) => {
  checar(
    `margemPct[${i}] (${DATA.meses[i]}) corresponde a (Receita − MOD − CPE) ÷ Receita`,
    pct(margemValor[i], DATA.receita[i]),
    declarada
  );
});

checar(
  'MOD-04 exibe a margem de julho igual à série de dados',
  true,
  texto('indicadores.html').includes(pt1(DATA.margemPct[ULT]) + '% · meta ' + DATA.metaMargem + '%')
);

/* =====================================================================
   2. Cascata: a soma tem de fechar, parcela por parcela
   ===================================================================== */
const c = DATA.cascata;
const rot = (r) => c.find((x) => x.rot === r);

checar('cascata: Receita = série do último mês', DATA.receita[ULT], rot('Receita').v);
checar('cascata: MOD = série do último mês', -DATA.custoMOD[ULT], rot('MOD').v);
checar('cascata: CPE = série do último mês', -DATA.custoCPE[ULT], rot('CPE').v);
checar('cascata: Despesas = série do último mês', -DATA.despesas[ULT], rot('Despesas').v);
checar('cascata: Margem bruta = Receita − MOD − CPE', margemValor[ULT], rot('Margem bruta').v);
checar('cascata: Resultado = Margem bruta − Despesas',
       margemValor[ULT] - DATA.despesas[ULT], rot('Resultado').v);

/* Nenhuma parcela órfã: tudo o que subtrai tem série correspondente. */
const somaNegativas = c.filter((x) => x.tipo === 'neg').reduce((s, x) => s + x.v, 0);
checar('cascata: soma das parcelas negativas = custos + despesas do mês',
       -(DATA.custoMOD[ULT] + DATA.custoCPE[ULT] + DATA.despesas[ULT]), somaNegativas);

/* =====================================================================
   3. Afirmações numéricas escritas nos templates
   ===================================================================== */
const modJan = pct(DATA.custoMOD[0], DATA.receita[0]);
const modJul = pct(DATA.custoMOD[ULT], DATA.receita[ULT]);
checar('MOD-04: "de 44,1% para 50,5%" bate com MOD ÷ Receita',
       true,
       texto('indicadores.html').includes(`de ${pt1(modJan)}% para ${pt1(modJul)}%`));

const cpeJan = pct(DATA.custoCPE[0], DATA.receita[0]);
const cpeJul = pct(DATA.custoCPE[ULT], DATA.receita[ULT]);
checar('MOD-04: queda do CPE escrita bate com CPE ÷ Receita',
       true,
       texto('indicadores.html').includes(`de ${pt1(cpeJan)}% para ${pt1(cpeJul)}%`));

const varBacklog = pct(DATA.backlog[ULT] - DATA.backlog[0], DATA.backlog[0]);
checar('MOD-04: "queda de 15,5% no ano" bate com a série de backlog',
       true,
       texto('indicadores.html').includes(`queda de ${pt1(Math.abs(varBacklog))}% no ano`));

/* Progresso × horas do contrato do estudo de caso. */
const caso = DATA.caso;
const gapPlano = caso.progressoPlan[ULT] - caso.progressoReal[ULT];
checar('Aprendizado: "22 pontos abaixo do plano" bate com a série do caso', 22, gapPlano);
checar('MOD-04/MOD-10: progresso de 52% bate com a série', 52, caso.progressoReal[ULT]);
checar('MOD-04/MOD-10: 72% das horas bate com a série', 72, caso.horasAcum[ULT]);

/* O ponto de inflexão precisa existir de fato: a distância entre horas e
   progresso salta em abril e nunca mais fecha. */
const distancia = caso.horasAcum.map((h, i) => h - caso.progressoReal[i]);
const ateMarco = Math.max(...distancia.slice(0, 3));
checar('MOD-10: até março a distância horas × progresso fica em no máximo 3 pontos',
       true, ateMarco <= 3);
checar('MOD-10: em abril a distância salta para 9 pontos', 9, distancia[3]);
checar('MOD-10: a distância nunca mais diminui depois de abril',
       true, distancia.slice(3).every((v, i, a) => i === 0 || v >= a[i - 1]));

/* Horas por disciplina do estudo de caso. */
const hd = DATA.horasDisc;
const excedente = hd.realizadas.reduce((s, v, i) => s + (v - hd.orcadas[i]), 0);
const excedenteCIV = hd.realizadas[0] - hd.orcadas[0];
checar('MOD-10: "490 horas excedentes" bate com a soma das disciplinas', 490, excedente);
checar('MOD-10: "410 estão na CIV" bate com a disciplina', 410, excedenteCIV);
checar('MOD-10: "outras quatro somam 80 horas" bate com o resto',
       80, excedente - excedenteCIV);
checar('MOD-10: "CIV 22% acima do orçado" bate com o cálculo',
       22, Math.round(excedenteCIV / hd.orcadas[0] * 100));

/* Documentos com revisão no estudo de caso. */
const revisoes = caso.docsRevisao.reduce((s, d) => s + d.revisoes, 0);
checar('MOD-10/MOD-06: "quatro documentos, 12 revisões" bate com a tabela',
       '4 / 12', caso.docsRevisao.length + ' / ' + revisoes);

/* Impacto do alerta crítico: gap para o mínimo aplicado ao valor contratado. */
const dqm = DATA.contratos.find((x) => x.cod === 'DQM24001');
const impacto = Math.round((DATA.metaMargem - dqm.margemPrev) / 100 * dqm.valor);
checar('MOD-07: impacto de R$ 420 mil bate com (meta − margem prevista) × valor',
       true, DATA.alertas[0].impacto.includes(`R$ ${impacto} mil`));
checar('MOD-07: o limite do alerta cita a margem prevista real do contrato',
       true, DATA.alertas[0].limite.includes(pt1(dqm.margemPrev) + '%'));

/* Documentos: emitidos − aprovados tem de ser o que está em revisão. */
const d = DATA.documentos;
checar('Documentos: emitidos − aprovados = em revisão',
       d.emitidos - d.aprovados, d.emRevisao);

/* =====================================================================
   4. Catálogos: toda chave declarada existe, toda camada tem opção aberta
   ===================================================================== */
function carregar(arquivo, nome) {
  const fonte = fs.readFileSync(path.join(RAIZ, arquivo), 'utf8');
  const janela = {};
  new Function('window', 'console', fonte)(janela, console);
  return janela[nome];
}

const FONTES = carregar('js/data/fontes.js', 'FONTES');
const FERRAMENTAS = carregar('js/data/ferramentas.js', 'FERRAMENTAS');

const arquivosModulo = fs.readdirSync(path.join(RAIZ, 'js/pages'));
arquivosModulo.forEach((arquivo) => {
  const fonte = fs.readFileSync(path.join(RAIZ, 'js/pages', arquivo), 'utf8');

  const blocoFontes = fonte.match(/fontes:\s*\[([^\]]*)\]/);
  if (blocoFontes) {
    blocoFontes[1].match(/'([^']+)'/g)?.forEach((bruto) => {
      const chave = bruto.replace(/'/g, '');
      checar(`${arquivo}: fonte "${chave}" existe no catálogo`, true, !!FONTES.obras[chave]);
    });
  }

  const blocoFerr = fonte.match(/ferramentas:\s*\[([^\]]*)\]/);
  if (blocoFerr) {
    blocoFerr[1].match(/'([^']+)'/g)?.forEach((bruto) => {
      const id = bruto.replace(/'/g, '');
      checar(`${arquivo}: camada "${id}" existe no catálogo`, true, !!FERRAMENTAS.camada(id));
    });
  }
});

/* Regra editorial do MOD-13: toda camada tem ao menos uma opção aberta. */
FERRAMENTAS.camadas.forEach((camada) => {
  checar(`Camada "${camada.nome}" tem alternativa de código aberto`,
         true, camada.itens.some((f) => f.licenca === 'aberto'));
});

/* Regra editorial: nenhuma ferramenta cita preço ou número de versão —
   os dois desatualizam sozinhos. Números de critério (1.4.3) e razões de
   contraste (4,5:1) são conteúdo legítimo e não caem nesta regra. */
const PRECO_OU_VERSAO = /R\$|US\$|\bv\d+(\.\d+)+\b|vers[ãa]o\s+\d/i;
FERRAMENTAS.camadas.forEach((camada) => {
  camada.itens.forEach((f) => {
    checar(`"${f.nome}" não cita preço nem versão`,
           true, !PRECO_OU_VERSAO.test(f.nome + ' ' + f.o));
  });
});

/* Toda obra precisa dizer o que sustenta — sem isso é enfeite. */
Object.entries(FONTES.obras).forEach(([chave, obra]) => {
  checar(`Fonte "${chave}" declara o que sustenta`,
         true, typeof obra.sustenta === 'string' && obra.sustenta.length > 40);
});

/* Toda obra do catálogo é usada por pelo menos um módulo. */
const usadas = new Set();
arquivosModulo.forEach((arquivo) => {
  const fonte = fs.readFileSync(path.join(RAIZ, 'js/pages', arquivo), 'utf8');
  const bloco = fonte.match(/fontes:\s*\[([^\]]*)\]/);
  bloco?.[1].match(/'([^']+)'/g)?.forEach((b) => usadas.add(b.replace(/'/g, '')));
});
Object.keys(FONTES.obras).forEach((chave) => {
  checar(`Fonte "${chave}" é usada por algum módulo`, true, usadas.has(chave));
});

/* =====================================================================
   5. Todo módulo tem template, e todo template tem módulo
   ===================================================================== */
const templates = fs.readdirSync(path.join(RAIZ, 'public/pages'))
  .filter((f) => f.endsWith('.html')).map((f) => f.replace('.html', '')).sort();
const modulos = arquivosModulo.filter((f) => f.endsWith('.js'))
  .map((f) => f.replace('.js', '')).sort();

checar('Cada módulo em js/pages tem um template em public/pages',
       modulos.join(', '), templates.join(', '));

/* =====================================================================
   Relatório
   ===================================================================== */
const total = passou.length + falhas.length;

if (falhas.length === 0) {
  console.log(`\n  ✓ ${total} verificações de coerência passaram.`);
  console.log('    Dados, gráficos e texto contam a mesma história.\n');
  process.exit(0);
}

console.error(`\n  ✗ ${falhas.length} de ${total} verificações falharam:\n`);
falhas.forEach((f) => {
  console.error(`    · ${f.nome}`);
  console.error(`      esperado: ${f.esperado}`);
  console.error(`      obtido:   ${f.obtido}\n`);
});
console.error('  Corrija o dado ou o texto — os dois precisam concordar.\n');
process.exit(1);
