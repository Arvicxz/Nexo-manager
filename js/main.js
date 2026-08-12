/* =====================================================================
   main.js — ponto de entrada. A ordem importa:
   dados → componentes → núcleo → módulos → casca.
   ===================================================================== */

/* dados fictícios */
import './data/data.js';

/* catálogos de apoio: de onde vem o conceito, com o que se implementa */
import './data/fontes.js';
import './data/ferramentas.js';

/* biblioteca de componentes */
import './ui/charts.js';
import './ui/ui.js';

/* núcleo da SPA */
import './core/registry.js';
import './core/progresso.js';
import './core/templates.js';
import './core/slots.js';
import './core/router.js';

/* módulos — cada um declara metadados, slots e comportamento */
import './pages/inicio.js';
import './pages/fundamentos.js';
import './pages/anatomia.js';
import './pages/indicadores.js';
import './pages/graficos.js';
import './pages/filtros.js';
import './pages/alertas.js';
import './pages/planejamento.js';
import './pages/perfis.js';
import './pages/estudos.js';
import './pages/praticas.js';
import './pages/glossario.js';
import './pages/ferramentas.js';
import './pages/fontes.js';

/* camada didática — trilhas, competências, prática e leitura focada */
import './core/aprendizado.js';

/* casca: índice, busca, menu, progresso e partida do router */
import './shell/shell.js';
