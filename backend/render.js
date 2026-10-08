// Desenha na tela: cartões de setor, cabeçalho do setor aberto e cartões de conteúdo.
// Usa textContent (e não innerHTML) para o texto nunca ser tratado como código.

export const ICONES = { video: 'circle-play', repo: 'git-branch', site: 'globe' };
export const ROTULOS = { video: 'Vídeo', repo: 'Repositório', site: 'Site' };

// Atalho para criar um elemento com classes e texto
export function criar(tag, classes, texto) {
  const el = document.createElement(tag);
  el.className = classes;
  if (texto) el.textContent = texto;
  return el;
}

// Atalho para criar um ícone Lucide (o lucide.createIcons() troca o <i> pelo desenho)
export function criarIcone(nome, classes) {
  const icone = document.createElement('i');
  icone.dataset.lucide = nome;
  icone.className = classes;
  return icone;
}

// Página inicial: um cartão por setor.
// Cada cartão é um link para "#id". Clicar muda o endereço e abre o setor.
export function renderSetores(setores) {
  const area = document.getElementById('resultados');
  area.replaceChildren();

  setores.forEach((setor) => {
    const cartao = criar('a', 'block rounded-lg border border-emerald-500/20 bg-slate-900/60 p-5 hover:border-emerald-400/60');
    cartao.href = `#${setor.id}`;

    const concluidos = progressoVisto().filter((id) => id.startsWith(`${setor.id}:`)).length;
    const rodape = criar('div', 'mt-4 flex flex-wrap gap-4 font-mono text-xs');
    rodape.append(
      criar('span', 'text-purple-400', `/${setor.id}`),
      criar('span', 'text-slate-500', `${setor.itens.length} conteúdo(s)`),
      criar('span', 'text-emerald-400', `progresso ${concluidos}/${setor.itens.length}`)
    );

    cartao.append(
      criarIcone(setor.icone || 'folder', 'mb-4 h-7 w-7 text-cyan-400'),
      criar('h2', 'font-mono text-xl text-slate-100', setor.nome),
      criar('p', 'mt-2 text-sm text-slate-400', setor.descricao || ''),
      rodape
    );
    area.append(cartao);
  });

  lucide.createIcons();
}

function chave(item) { return `${item.setor}:${item.titulo}`; }
function carregarEstado() {
  try { return JSON.parse(localStorage.getItem('deftstudy:progresso')) || { vistos: [], favoritos: [] }; }
  catch { return { vistos: [], favoritos: [] }; }
}
function progressoVisto() { return carregarEstado().vistos; }

// Cabeçalho do setor aberto. Chame com null para limpar.
export function renderTopoSetor(setor) {
  const topo = document.getElementById('topo-secao');
  topo.replaceChildren();
  if (!setor) return;

  const voltar = criar('a', 'mb-4 inline-flex items-center gap-2 font-mono text-sm text-slate-400 hover:text-emerald-300');
  voltar.href = '#';
  voltar.append(criarIcone('arrow-left', 'h-4 w-4'), criar('span', '', 'todos os setores'));

  topo.append(
    voltar,
    criar('h2', 'font-mono text-3xl font-bold text-emerald-400', setor.nome),
    criar('p', 'mb-6 mt-2 max-w-xl text-slate-400', setor.descricao || '')
  );
  lucide.createIcons();
}

// Cartões de conteúdo (usados dentro de um setor e nos resultados da busca)
export function renderResultados(lista, texto) {
  const area = document.getElementById('resultados');
  area.replaceChildren();

  if (lista.length === 0) {
    const aviso = texto
      ? `Nenhum resultado para "${texto}". Tente outro termo.`
      : 'Ainda não há conteúdo neste setor.';
    area.append(criar('p', 'font-mono text-amber-400', aviso));
    return;
  }

  lista.forEach((item) => area.append(criarCartao(item)));
  lucide.createIcons();
}

export function renderErroSetor(id) {
  const area = document.getElementById('resultados'); area.replaceChildren();
  area.append(criar('section', 'col-span-full rounded-lg border border-emerald-500/20 bg-slate-900/60 p-5', `Setor #${id} não encontrado.`));
  const voltar = criar('a', 'col-span-full text-emerald-400', '← Voltar aos setores'); voltar.href = '#'; area.append(voltar);
}

export function renderSalvos(itens) {
  renderResultados(itens, '');
  if (!itens.length) document.getElementById('resultados').firstChild.textContent = 'Você ainda não salvou nenhum conteúdo.';
}

// Pega o endereço (src) de dentro do código <iframe> colado em setores.js.
// Só aceita embeds do YouTube; qualquer outra coisa é ignorada por segurança.
export function extrairSrcYoutube(codigoIframe) {
  const achado = /src="([^"]+)"/.exec(codigoIframe || '');
  if (!achado) return null;
  try {
    const url = new URL(achado[1]);
    const hostOk = ['www.youtube.com', 'www.youtube-nocookie.com'].includes(url.hostname);
    return hostOk && url.pathname.startsWith('/embed/') ? url.href : null;
  } catch {
    return null;
  }
}

// Monta o player do YouTube (a prévia do vídeo dentro do cartão)
export function criarPlayer(src, titulo) {
  const player = document.createElement('iframe');
  player.src = src;
  player.title = titulo;
  player.loading = 'lazy'; // só carrega quando o cartão chega perto da tela
  player.className = 'mb-4 w-full rounded border border-emerald-500/20';
  player.style.aspectRatio = '16 / 9';
  player.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share';
  player.referrerPolicy = 'strict-origin-when-cross-origin';
  player.allowFullscreen = true;
  return player;
}

export function criarCartao(item) {
  const classes = 'block rounded-lg border border-emerald-500/20 bg-slate-900/60 p-4 hover:border-emerald-400/60';
  const srcVideo = extrairSrcYoutube(item.iframe);

  const cartao = criar('article', classes);

  // Linha de cima: ícone, tipo e setor
  const topo = criar('div', 'mb-3 flex items-center gap-3 font-mono text-xs');
  topo.append(
    criarIcone(ICONES[item.tipo] || 'globe', 'h-4 w-4 text-cyan-400'),
    criar('span', 'text-cyan-400', ROTULOS[item.tipo] || 'Link'),
    criar('span', 'text-purple-400', `/${item.setor}`)
  );

  const tags = criar('div', 'mt-3 flex flex-wrap gap-2 text-xs text-slate-500');
  (item.tags || []).forEach((tag) => {
    const link = criar('button', 'tag-link', `#${tag}`); link.type = 'button'; link.dataset.tag = tag; tags.append(link);
  });

  const chave = `${item.setor}:${item.titulo}`;
  let estado = { vistos: [], favoritos: [] };
  try { estado = JSON.parse(localStorage.getItem('deftstudy:progresso')) || estado; } catch {}
  const acoes = criar('div', 'mt-3 flex flex-wrap gap-3 text-xs');
  [['visto', 'Marcar como visto', '✓ Visto'], ['favorito', 'Salvar nos favoritos', '★ Salvo']].forEach(([tipo, label, marcado]) => {
    const lista = tipo === 'visto' ? estado.vistos : estado.favoritos;
    const button = criar('button', 'acao-cartao', lista.includes(chave) ? marcado : label);
    button.type = 'button'; button.dataset.acao = tipo; button.dataset.chave = chave; button.setAttribute('aria-pressed', String(lista.includes(chave))); acoes.append(button);
  });

  if (srcVideo) cartao.append(criarPlayer(srcVideo, item.titulo));
  const detalhes = criar('p', 'mt-2 text-xs text-slate-500', `${item.nivel || 'iniciante'} · ${item.idioma || 'pt-BR'}`);
  const titulo = item.url ? criar('a', 'font-mono text-base text-slate-100 hover:text-emerald-300', item.titulo) : criar('h3', 'font-mono text-base text-slate-100', item.titulo);
  if (item.url) { titulo.href = item.url; titulo.target = '_blank'; titulo.rel = 'noopener noreferrer'; }
  cartao.append(topo, titulo, detalhes, tags, acoes);
  return cartao;
}
