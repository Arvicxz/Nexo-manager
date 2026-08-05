#!/usr/bin/env bash
# Sobe um servidor local em http://localhost:8000 servindo a pasta dist/.
#
# Os módulos são carregados por fetch em tempo de execução, então a aplicação
# precisa ser servida por HTTP. O caminho recomendado é "npm run dev"; este
# script existe para quem prefere um servidor estático simples.
set -euo pipefail

cd "$(dirname "$0")"

if [ ! -d dist ]; then
  printf 'Pasta dist/ não encontrada. Gere a versão de produção antes:\n\n  npm install\n  npm run build\n\nOu rode o servidor de desenvolvimento:\n\n  npm run dev\n' >&2
  exit 1
fi

for cmd in python py python3; do
  if command -v "$cmd" >/dev/null 2>&1; then
    printf 'Servindo dist/ em http://localhost:8000\n'
    if [ "$cmd" = py ]; then exec py -3 -m http.server 8000 --directory dist; fi
    exec "$cmd" -m http.server 8000 --directory dist
  fi
done

printf 'Python 3 não encontrado. Use "npm run preview".\n' >&2
exit 1
