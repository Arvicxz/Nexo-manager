# Nexo Gestao - Aprender dashboards de gestao

Aplicacao web didatica para estudar dashboards de gestao, indicadores, metricas,
graficos, filtros, alertas, planejamento, forecast e tomada de decisao. O conteudo
usa uma empresa ficticia de engenharia e projetos como contexto para exercicios,
simulacoes e exemplos de leitura gerencial.

Todos os dados exibidos pelo sistema sao ficticios.

## Descricao do Sistema

O Nexo Gestao e uma SPA (Single Page Application) criada com HTML, CSS e JavaScript
puros, usando Vite apenas como servidor e ferramenta de build. A aplicacao organiza
uma trilha de aprendizagem em 14 modulos, cada um com conteudo, exemplos visuais e
interacoes especificas.

Principais recursos:

- navegacao por modulos via hash (`#/inicio`, `#/graficos`, `#/alertas` etc.);
- indice lateral com progresso de leitura;
- busca global por conceitos, indicadores, graficos e intencoes de uso;
- dashboards e componentes didaticos gerados a partir de dados ficticios;
- simulacoes interativas, como planejamento, forecast, filtros e estudos de caso;
- bloco de fontes bibliograficas ao final de cada modulo, dizendo o que cada obra sustenta;
- bloco de ferramentas de mercado ao final de cada modulo, organizado por camada;
- marcacao explicita de convencoes da casa: todo limiar arbitrario e declarado como tal;
- verificacao automatica de coerencia entre dados e texto (`npm run verificar`);
- registro de progresso no `localStorage` do navegador;
- carregamento modular de templates HTML por HTTP.

## Confiabilidade do Conteudo

O material foi escrito com apoio de inteligencia artificial, o que traz um risco
especifico: texto fluente e ocasionalmente errado. Tres mecanismos reduzem esse risco.

**Numeros derivados, nunca digitados duas vezes.** Margem, cascata, rosca e
percentuais saem de uma unica conta em `js/data/data.js`. Mudar um custo muda todos
os numeros e todos os graficos juntos. E o mesmo principio que o MOD-02 ensina — "a
formula e da empresa, nao da tela" — aplicado ao proprio material didatico.

**Tres tipos de afirmacao, tres tratamentos.** Consenso da literatura leva referencia
com autor e ano. Requisito de norma leva o numero do criterio. Convencao da casa leva
a marca `.convencao`, que declara o valor como escolha da empresa ficticia e nao como
regra de mercado. O MOD-14 explica a distincao.

**Trava de regressao.** `npm run verificar` recalcula os valores derivados e falha se
a prosa dos templates discordar dos dados. Tambem confere as regras editoriais do
catalogo de ferramentas e a integridade das chaves de fontes. Rode antes de publicar
qualquer mudanca em `js/data/`.

## Funcionamento

A aplicacao precisa ser servida por HTTP. Abrir o `index.html` diretamente pelo
arquivo local (`file://`) nao funciona corretamente, porque os modulos sao carregados
dinamicamente com `fetch`.

Fluxo principal de funcionamento:

1. `index.html` carrega a casca visual da aplicacao e o script principal `js/main.js`.
2. `js/main.js` importa dados, componentes, nucleo da SPA, modulos e shell.
3. Cada modulo e registrado com metadados, slots dinamicos e comportamento proprio.
4. O router le a rota atual no hash da URL e carrega `public/pages/<modulo>.html`.
5. Os blocos com `data-slot` sao preenchidos com KPIs, tabelas, graficos e conteudos calculados.
6. O shell atualiza menu, busca, estado ativo e progresso.
7. O progresso do usuario fica salvo no navegador por meio de `localStorage`.

Os modulos ficam separados em duas partes:

- `public/pages/*.html`: conteudo e layout de cada modulo.
- `js/pages/*.js`: metadados, slots e eventos de cada modulo.

Essa separacao permite manter o conteudo didatico em HTML e deixar no JavaScript
apenas aquilo que depende de dados, calculos ou interacao.

## Requisitos

Para desenvolvimento e execucao local, e necessario:

- Node.js instalado;
- npm instalado;
- navegador moderno com suporte a ES Modules;
- acesso a terminal ou prompt de comando.

Requisitos opcionais:

- Python 3, caso queira servir a pasta `dist/` com o script `servir.sh`;
- internet para carregar as fontes IBM Plex via Google Fonts. Sem internet, o sistema
  usa as fontes padrao do navegador.

## Instalacao

Entre na pasta do projeto:

```bash
cd nexo-gestao-dashboards
```

Instale as dependencias:

```bash
npm install
```

Inicie o servidor de desenvolvimento:

```bash
npm run dev
```

Depois acesse a URL exibida no terminal. Normalmente:

```text
http://localhost:5173
```

## Build de Producao

Para gerar a versao final:

```bash
npm run build
```

Para visualizar a versao de producao localmente:

```bash
npm run preview
```

Outra opcao, apos gerar o build, e servir a pasta `dist/` com o script:

```bash
./servir.sh
```

Esse script usa o servidor HTTP do Python e publica a aplicacao em:

```text
http://localhost:8000
```

## Scripts Disponiveis

| Comando | Descricao |
|---|---|
| `npm install` | Instala as dependencias do projeto. |
| `npm run dev` | Inicia o servidor de desenvolvimento com Vite. |
| `npm run build` | Gera a versao de producao na pasta `dist/`. |
| `npm run preview` | Serve localmente a versao de producao gerada. |
| `npm run verificar` | Confere a coerencia entre dados, graficos e texto dos modulos. |
| `./servir.sh` | Serve a pasta `dist/` com Python 3, quando disponivel. |

## Estrutura do Projeto

```text
.
+-- index.html              # casca principal da aplicacao
+-- package.json            # dependencias e scripts do projeto
+-- servir.sh               # servidor estatico simples para a pasta dist/
+-- public/
|   +-- pages/              # templates HTML dos modulos
+-- css/                    # tokens, base, layout, componentes e responsividade
+-- tests/
|   +-- coerencia.js        # verificacao de coerencia entre dados e texto
+-- js/
    +-- main.js             # ponto de entrada da aplicacao
    +-- core/               # router, templates, slots, progresso e registro
    +-- data/               # dados ficticios, catalogo de fontes e de ferramentas
    +-- pages/              # configuracao e comportamento dos modulos
    +-- shell/              # menu, busca, progresso e inicializacao
    +-- ui/                 # componentes visuais e graficos
```

Os tres arquivos de `js/data/` tem papeis distintos:

| Arquivo | Conteudo |
|---|---|
| `data.js` | Dados ficticios da empresa. Valores derivados saem de uma unica conta. |
| `fontes.js` | Bibliografia. Cada obra registrada uma vez, com o campo `sustenta`. |
| `ferramentas.js` | Ferramentas de mercado, agrupadas pelas camadas do fluxo do MOD-02. |

## Modulos

| Codigo | Modulo | Conteudo |
|---|---|---|
| MOD-01 | Inicio | Trilha de aprendizagem e mapa de modulos. |
| MOD-02 | Fundamentos | Dado, metrica, indicador, KPI, meta, limite, forecast e alerta. |
| MOD-03 | Anatomia | Camadas de leitura em um dashboard de demonstracao. |
| MOD-04 | Metricas e indicadores | Indicadores financeiros, contratos, equipe e clientes. |
| MOD-05 | Biblioteca de graficos | Visualizacoes e comparador interativo. |
| MOD-06 | Filtros e navegacao | Drill-down, drill-through, cross-filter e breadcrumb. |
| MOD-07 | Alertas e decisao | Componentes do alerta, prioridades e plano de acao. |
| MOD-08 | Planejamento e forecast | Simulacao de encerramento com recalculo em tempo real. |
| MOD-09 | Perfis de gestao | Visao por publico: diretoria, operacao, cliente e outras personas. |
| MOD-10 | Estudo de caso | Investigacao guiada de um contrato ficticio. |
| MOD-11 | Boas praticas | Comparativos, principios visuais e acessibilidade por criterio WCAG. |
| MOD-12 | Glossario | Termos de dashboards e gestao com busca. |
| MOD-13 | Ferramentas | Catalogo de ferramentas de mercado por camada, com filtros. |
| MOD-14 | Fontes e verificacao | Bibliografia, metodo de verificacao e limites declarados. |

## Como Adicionar um Modulo

1. Crie um novo template em `public/pages/meu-modulo.html`.
2. Crie o arquivo de configuracao em `js/pages/meu-modulo.js`.
3. Registre o modulo com `APP.page(...)`, informando codigo, titulo, nivel, tempo, descricao, tags, slots e `mount`.
4. Declare em `fontes` as obras que sustentam o que o modulo afirma, e em `ferramentas` as camadas relevantes. Os dois blocos aparecem sozinhos no rodape.
5. Importe o novo arquivo em `js/main.js`.
6. Rode `npm run verificar` — ele confere que as chaves declaradas existem nos catalogos.

Exemplo basico:

```js
APP.page('meu-modulo', {
  code: 'MOD-13',
  title: 'Meu modulo',
  nivel: 'Basico',
  tempo: '10 min',
  rev: 'REV-A',
  desc: 'Descricao curta do modulo.',
  tags: ['indicador', 'exemplo'],
  fontes: ['cleveland1984', 'few2013'],
  ferramentas: ['visualizacao'],
  slots: {
    kpis: function () {
      return UI.kpi({ label: 'Exemplo', value: '42' });
    }
  },
  mount: function (raiz) {
    // Ligue aqui os eventos especificos do modulo.
  }
});
```

## Observacoes

- O sistema nao possui backend.
- Os dados estao concentrados em `js/data/data.js`.
- O progresso e salvo apenas no navegador usado pelo usuario.
- A aplicacao foi pensada para fins educacionais e demonstrativos.
- Os numeros da empresa ficticia sao parametros de exemplo, nao referencias de mercado.
  Onde isso importa, o texto traz a marca "Convencao da casa".
- Duas obras do catalogo de fontes estao marcadas como conferencia pendente e aparecem
  sinalizadas na tela. Confira-as contra a edicao ou o DOI antes de citar em documento formal.
