// Ponto de entrada: decide o que mostrar e chama as funções de render.js.
// Quem manda é o endereço da página:
//   sem #     -> página inicial, com um card por setor
//   #html     -> setor HTML aberto, com os conteúdos dentro
//   (busca)   -> se tiver texto no campo de busca, mostra os resultados de todos os setores

// Junta os conteúdos de todos os setores numa lista só (usada na busca)
const ITENS = SETORES.flatMap((setor) =>
  setor.itens.map((item) => ({ ...item, setor: setor.id }))
);

const campoBusca = document.getElementById('busca');
const contador = document.getElementById('contador');
const intro = document.getElementById('intro');

function atualizar() {
  const texto = campoBusca.value.trim();
  const setor = SETORES.find((s) => s.id === location.hash.slice(1));

  if (texto) {
    // Busca em todos os setores
    const lista = filtrar(ITENS, { texto, setor: 'todos' });
    renderTopoSetor(null);
    renderResultados(lista, texto);
    contador.textContent = `${lista.length} resultado(s) para "${texto}"`;
  } else if (setor) {
    // Setor aberto
    const lista = filtrar(ITENS, { texto: '', setor: setor.id });
    renderTopoSetor(setor);
    renderResultados(lista, '');
    contador.textContent = `${lista.length} conteúdo(s)`;
  } else {
    // Página inicial
    renderTopoSetor(null);
    renderSetores(SETORES);
    contador.textContent = `${SETORES.length} setores`;
  }

  // O texto de introdução só aparece na página inicial
  intro.hidden = Boolean(texto || setor);
}

campoBusca.addEventListener('input', atualizar);

// Abrir um setor ou voltar muda o #endereço. O botão "voltar" do navegador também funciona.
window.addEventListener('hashchange', () => {
  atualizar();
  window.scrollTo(0, 0);
});

// Atalho: apertar "/" leva o cursor para a busca
document.addEventListener('keydown', (evento) => {
  if (evento.key === '/' && document.activeElement !== campoBusca) {
    evento.preventDefault();
    campoBusca.focus();
  }
});

atualizar();
