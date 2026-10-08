import { SUPABASE_PUBLISHABLE_KEY, SUPABASE_URL } from './supabase-config.js';

const CHAVE_PROGRESSO = 'deftstudy:progresso';
const CHAVE_CONFIG = 'deftstudy:config';
const CHAVE_USUARIO = 'deftstudy:cloud-user';
const CHAVE_VISITANTE = 'deftstudy:visitante';
const configurado = SUPABASE_URL.startsWith('https://')
  && !SUPABASE_URL.includes('SEU-PROJETO')
  && SUPABASE_PUBLISHABLE_KEY.startsWith('sb_publishable_');

let supabase = null;
let usuarioAtual = null;
let temporizadorSalvamento;

function atualizarAcesso(usuario) {
  let visitante = false;
  try {
    if (usuario) sessionStorage.removeItem(CHAVE_VISITANTE);
    visitante = sessionStorage.getItem(CHAVE_VISITANTE) === 'sim';
  } catch {}
  document.getElementById('tela-login').hidden = Boolean(usuario || visitante);
  document.getElementById('site-app').hidden = !usuario && !visitante;
}

function lerJson(chave, padrao) {
  try { return JSON.parse(localStorage.getItem(chave)) || padrao; }
  catch { return padrao; }
}

function unirListas(a = [], b = []) {
  return [...new Set([...a, ...b])];
}

function salvarLocalmente(progresso, configuracoes) {
  localStorage.setItem(CHAVE_PROGRESSO, JSON.stringify(progresso));
  localStorage.setItem(CHAVE_CONFIG, JSON.stringify(configuracoes));
}

function atualizarBotoes(usuario, aoEntrar) {
  const entrar = document.getElementById('entrar-google');
  const entrarInicial = document.getElementById('entrar-google-inicial');
  const sair = document.getElementById('sair-conta');
  const status = document.getElementById('status-conta');
  const statusLogin = document.getElementById('status-login');
  entrar.hidden = Boolean(usuario);
  entrar.disabled = !configurado;
  entrar.title = configurado ? '' : 'Configure a URL e a chave pública do Supabase.';
  entrarInicial.disabled = !configurado;
  entrarInicial.title = configurado ? '' : 'Login Google ainda não configurado.';
  sair.hidden = !usuario;
  status.textContent = usuario ? `Conectado: ${usuario.email || 'conta Google'}` : '';
  statusLogin.textContent = usuario ? '' : (configurado ? '' : 'Login Google ainda não configurado. Você pode entrar como visitante.');
  entrar.onclick = aoEntrar;
  entrarInicial.onclick = aoEntrar;
  sair.onclick = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) status.textContent = `Erro ao sair: ${error.message}`;
  };
}

async function salvarNaNuvem() {
  if (!supabase || !usuarioAtual) return;
  const progresso = lerJson(CHAVE_PROGRESSO, { vistos: [], favoritos: [] });
  const configuracoes = lerJson(CHAVE_CONFIG, {});
  const { error } = await supabase.from('user_data').upsert({
    user_id: usuarioAtual.id,
    progress: progresso,
    config: configuracoes,
    updated_at: new Date().toISOString(),
  }, { onConflict: 'user_id' });
  if (error) {
    console.error('Não foi possível sincronizar os dados com o Supabase:', error.message);
    const status = document.getElementById('status-conta');
    status.textContent = 'Falha ao sincronizar. Seus dados continuam neste navegador.';
  }
}

export function agendarSalvamentoNuvem() {
  if (!usuarioAtual) return;
  clearTimeout(temporizadorSalvamento);
  temporizadorSalvamento = setTimeout(salvarNaNuvem, 350);
}

async function carregarDadosUsuario(usuario, aoAtualizar) {
  usuarioAtual = usuario;
  atualizarAcesso(usuario);
  atualizarBotoes(usuario, entrarComGoogle);
  if (!usuario) {
    aoAtualizar();
    return;
  }

  const { data, error } = await supabase.from('user_data')
    .select('progress, config')
    .eq('user_id', usuario.id)
    .maybeSingle();
  if (error) {
    console.error('Não foi possível carregar os dados do Supabase:', error.message);
    document.getElementById('status-conta').textContent = 'Falha ao carregar dados da nuvem.';
    aoAtualizar();
    return;
  }

  const usuarioAnterior = localStorage.getItem(CHAVE_USUARIO);
  const podeMigrarDadosLocais = !usuarioAnterior;
  const locais = podeMigrarDadosLocais ? lerJson(CHAVE_PROGRESSO, { vistos: [], favoritos: [] }) : { vistos: [], favoritos: [] };
  const configLocal = podeMigrarDadosLocais ? lerJson(CHAVE_CONFIG, {}) : {};
  const progressoNuvem = data?.progress || { vistos: [], favoritos: [] };
  const configuracaoNuvem = data?.config || {};
  const progresso = {
    vistos: unirListas(progressoNuvem.vistos, locais.vistos),
    favoritos: unirListas(progressoNuvem.favoritos, locais.favoritos),
  };
  const configuracoes = { ...configLocal, ...configuracaoNuvem };

  salvarLocalmente(progresso, configuracoes);
  localStorage.setItem(CHAVE_USUARIO, usuario.id);
  aoAtualizar();
  await salvarNaNuvem();
}

async function entrarComGoogle() {
  if (!supabase) {
    document.getElementById('status-login').textContent = 'O serviço de login ainda não está disponível.';
    return;
  }
  const { error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: { redirectTo: `${window.location.origin}${window.location.pathname}` },
  });
  if (error) {
    document.getElementById('status-conta').textContent = `Erro no login: ${error.message}`;
    document.getElementById('status-login').textContent = `Erro no login: ${error.message}`;
  }
}

export async function iniciarNuvem(aoAtualizar) {
  document.getElementById('entrar-visitante').addEventListener('click', () => {
    try { sessionStorage.setItem(CHAVE_VISITANTE, 'sim'); } catch {}
    atualizarAcesso(null);
  });
  atualizarAcesso(null);
  atualizarBotoes(null, () => {});
  if (!configurado) return;

  try {
    // A aplicação é estática e não usa bundler; carrega o SDK ESM pelo CDN só quando configurado.
    const { createClient } = await import('https://esm.sh/@supabase/supabase-js@2.117.3');
    supabase = createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);
  } catch (error) {
    document.getElementById('entrar-google').disabled = true;
    document.getElementById('entrar-google-inicial').disabled = true;
    document.getElementById('status-login').textContent = 'Não foi possível carregar o serviço de login. Você pode entrar como visitante.';
    document.getElementById('status-conta').textContent = 'Não foi possível carregar o SDK do Supabase.';
    console.error('Falha ao carregar o SDK do Supabase:', error);
    return;
  }
  atualizarBotoes(null, entrarComGoogle);
  supabase.auth.onAuthStateChange((_evento, sessao) => {
    queueMicrotask(() => carregarDadosUsuario(sessao?.user || null, aoAtualizar));
  });

  const { data, error } = await supabase.auth.getSession();
  if (error) {
    document.getElementById('status-conta').textContent = `Erro ao verificar login: ${error.message}`;
    return;
  }
  await carregarDadosUsuario(data.session?.user || null, aoAtualizar);
}
