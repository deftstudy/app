import { SETORES } from '../data/setores.js';
import { filtrar } from './busca.js';
import { renderSetores, renderTopoSetor, renderResultados, renderErroSetor, renderSalvos, criarCartao } from './render.js';
import { iniciarConfiguracoes, renderConfiguracoes } from './configuracoes.js';

const ITENS = SETORES.flatMap((setor) => setor.itens.map((item) => ({
  ...item,
  setor: setor.id,
  nivel: item.nivel || ((item.tags || []).includes('iniciante') ? 'iniciante' : 'intermediário'),
  idioma: item.idioma || (/(javascript\.info|ryanm?cdermott|firstcontributions)/i.test(item.url || '') ? 'en' : 'pt-BR'),
})));
const campoBusca = document.getElementById('busca');
const contador = document.getElementById('contador');
const intro = document.getElementById('intro');
const filtros = document.getElementById('filtros');
const selectClasses = 'filter-select rounded border border-emerald-500/20 bg-slate-900/60 px-3 py-2 text-sm';
const selecoes = {};

function lerEstado() {
  try { return JSON.parse(localStorage.getItem('deftstudy:progresso')) || { vistos: [], favoritos: [] }; }
  catch { return { vistos: [], favoritos: [] }; }
}
function criarFiltro(nome, chave, opcoes) {
  const select = document.createElement('select'); select.className = selectClasses; select.setAttribute('aria-label', `Filtrar por ${nome}`);
  const todos = new Option(`Todos: ${nome}`, ''); select.add(todos);
  opcoes.forEach((valor) => select.add(new Option(valor, valor)));
  select.value = selecoes[chave] || ''; select.addEventListener('change', () => { selecoes[chave] = select.value; atualizar(); });
  filtros.append(select);
}
function renderFiltros() {
  filtros.replaceChildren();
  criarFiltro('tipo', 'tipo', [...new Set(ITENS.map((i) => i.tipo))]);
  criarFiltro('tag', 'tag', [...new Set(ITENS.flatMap((i) => i.tags || []))].sort());
  criarFiltro('nível', 'nivel', ['iniciante', 'intermediário', 'avançado']);
  criarFiltro('idioma', 'idioma', [...new Set(ITENS.map((i) => i.idioma || 'pt-BR'))]);
  filtros.hidden = false;
}
function atualizar() {
  const query = new URLSearchParams(location.search);
  const texto = (campoBusca.value || query.get('q') || '').trim();
  if (campoBusca.value !== texto) campoBusca.value = texto;
  const id = decodeURIComponent(location.hash.slice(1));
  const setor = SETORES.find((s) => s.id === id);
  const secaoSalvos = document.getElementById('inicio-salvos');
  const cartoesSalvos = document.getElementById('cartoes-salvos');
  secaoSalvos.hidden = true;
  cartoesSalvos.replaceChildren();
  filtros.replaceChildren(); filtros.hidden = true;

  if (id === 'configuracoes') {
    renderTopoSetor({ nome: 'Configurações', descricao: 'Preferências do site, salvas só neste navegador.' }); renderConfiguracoes(); contador.textContent = '';
  } else if (id === 'atalhos') {
    renderTopoSetor({ nome: 'Atalhos de teclado', descricao: 'Acesse as áreas principais sem tirar as mãos do teclado.' });
    const area = document.getElementById('resultados'); area.replaceChildren();
    [['Alt + C', 'Abrir configurações'], ['Alt + S', 'Abrir conteúdos salvos'], ['Alt + H', 'Ver atalhos de teclado'], ['/', 'Ir para a busca'], ['Esc', 'Fechar esta tela']].forEach(([tecla, descricao]) => {
      const linha = document.createElement('div'); linha.className = 'flex items-center justify-between gap-4 rounded-lg border border-emerald-500/20 bg-slate-900/60 p-4';
      const nome = document.createElement('span'); nome.className = 'text-slate-300'; nome.textContent = descricao;
      const codigo = document.createElement('kbd'); codigo.className = 'rounded border border-emerald-500/20 bg-black/40 px-3 py-1 font-mono text-sm text-emerald-300'; codigo.textContent = tecla;
      linha.append(nome, codigo); area.append(linha);
    }); contador.textContent = '5 atalhos';
  } else if (id === 'salvos') {
    renderFiltros(); renderTopoSetor({ nome: 'Conteúdos salvos', descricao: 'Seus favoritos e conteúdos marcados como vistos.' });
    const estado = lerEstado(); const salvos = ITENS.filter((i) => estado.favoritos.includes(`${i.setor}:${i.titulo}`)); renderSalvos(salvos); contador.textContent = `${salvos.length} conteúdo(s) salvo(s)`;
  } else if (id && !setor) {
    renderTopoSetor(null); renderErroSetor(id); contador.textContent = '';
  } else if (texto || setor) {
    renderFiltros();
    const lista = filtrar(ITENS, { texto, setor: setor?.id || 'todos', ...selecoes });
    renderTopoSetor(setor || null); renderResultados(lista, texto);
    contador.textContent = `${lista.length} resultado(s)${texto ? ` para "${texto}"` : ''}`;
  } else {
    renderTopoSetor(null); renderSetores(SETORES);
    const estado = lerEstado();
    const salvos = ITENS.filter((i) => estado.favoritos.includes(`${i.setor}:${i.titulo}`));
    if (salvos.length) {
      salvos.forEach((item) => cartoesSalvos.append(criarCartao(item)));
      secaoSalvos.hidden = false;
    }
    contador.textContent = `${SETORES.length} setores`;
  }
  intro.hidden = Boolean(texto || setor || id);
}

campoBusca.addEventListener('input', () => {
  const url = new URL(location.href);
  if (campoBusca.value.trim()) url.searchParams.set('q', campoBusca.value.trim()); else url.searchParams.delete('q');
  history.replaceState(null, '', url); atualizar();
});
window.addEventListener('hashchange', () => { atualizar(); window.scrollTo(0, 0); });
document.addEventListener('click', (evento) => {
  const tag = evento.target.closest('[data-tag]');
  if (tag) { selecoes.tag = tag.dataset.tag; atualizar(); return; }
  const acao = evento.target.closest('[data-acao]');
  if (acao) {
    const estado = lerEstado(); const lista = acao.dataset.acao === 'visto' ? estado.vistos : estado.favoritos;
    const index = lista.indexOf(acao.dataset.chave);
    if (index >= 0) lista.splice(index, 1); else lista.push(acao.dataset.chave);
    try { localStorage.setItem('deftstudy:progresso', JSON.stringify(estado)); } catch {}
    atualizar();
  }
});
document.addEventListener('keydown', (evento) => {
  if (evento.altKey && evento.key.toLowerCase() === 'c') {
    evento.preventDefault();
    location.hash = '#configuracoes';
    return;
  }
  if (evento.altKey && evento.key.toLowerCase() === 's') {
    evento.preventDefault();
    location.hash = '#salvos';
    return;
  }
  if (evento.altKey && evento.key.toLowerCase() === 'h') {
    evento.preventDefault();
    location.hash = '#atalhos';
    return;
  }
  if (evento.key === 'Escape' && location.hash === '#atalhos') {
    location.hash = '#';
    return;
  }
  if (evento.key === '/' && document.activeElement !== campoBusca) {
    evento.preventDefault();
    campoBusca.focus();
  }
});
iniciarConfiguracoes(); atualizar();
