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
let githubHabilitado = false;

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
  const entrar = document.getElementById('entrar-email');
  const cadastrar = document.getElementById('criar-conta');
  const github = document.getElementById('entrar-github');
  const sair = document.getElementById('sair-conta');
  const status = document.getElementById('status-conta');
  const statusLogin = document.getElementById('status-login');
  entrar.disabled = !configurado;
  cadastrar.disabled = !configurado;
  github.hidden = !githubHabilitado;
  github.disabled = !configurado || !githubHabilitado;
  sair.hidden = !usuario;
  status.textContent = usuario ? `Conectado: ${usuario.email || 'conta'}` : '';
  if (!configurado) statusLogin.textContent = 'Login indisponível: configure a URL e a chave pública do Supabase. Você ainda pode entrar como visitante.';
  sair.onclick = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) status.textContent = `Erro ao sair: ${error.message}`;
    } catch (error) {
      status.textContent = `Erro ao sair: ${mostrarErroLogin(error)}`;
    }
  };
}

function mostrarErroLogin(erro) {
  const mensagem = (erro?.message || '').toLowerCase();
  if (mensagem.includes('invalid login credentials')) return 'E-mail ou senha incorretos.';
  if (mensagem.includes('email not confirmed')) return 'Confirme seu e-mail pelo link enviado para sua caixa de entrada.';
  if (mensagem.includes('user already registered')) return 'Este e-mail já tem uma conta. Tente entrar.';
  if (mensagem.includes('provider is not enabled') || mensagem.includes('unsupported provider')) return 'O login GitHub ainda não foi habilitado nos provedores do Supabase.';
  return erro?.message || 'Não foi possível concluir o acesso.';
}

function urlAtual() {
  return `${window.location.origin}${window.location.pathname}`;
}

async function entrarComEmail() {
  const email = document.getElementById('email-login').value.trim();
  const password = document.getElementById('senha-login').value;
  const status = document.getElementById('status-login');
  status.textContent = 'Verificando seus dados…';
  try {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    status.textContent = error ? mostrarErroLogin(error) : '';
  } catch (error) {
    status.textContent = mostrarErroLogin(error);
  }
}

async function criarContaEmail() {
  const email = document.getElementById('email-login').value.trim();
  const password = document.getElementById('senha-login').value;
  if (!document.getElementById('form-email').reportValidity()) return;
  if (password.length < 6) {
    document.getElementById('status-login').textContent = 'A senha precisa ter pelo menos 6 caracteres.';
    return;
  }

  const status = document.getElementById('status-login');
  status.textContent = 'Criando sua conta…';
  try {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: { emailRedirectTo: urlAtual() },
    });
    if (error) {
      status.textContent = mostrarErroLogin(error);
      return;
    }
    if (!data.session) status.textContent = 'Conta criada. Confira seu e-mail e confirme o cadastro para entrar.';
    else status.textContent = '';
  } catch (error) {
    status.textContent = mostrarErroLogin(error);
  }
}

async function entrarComGithub() {
  try {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'github',
      options: { redirectTo: urlAtual() },
    });
    if (error) document.getElementById('status-login').textContent = mostrarErroLogin(error);
  } catch (error) {
    document.getElementById('status-login').textContent = mostrarErroLogin(error);
  }
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
  atualizarBotoes(usuario);
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

export async function iniciarNuvem(aoAtualizar) {
  document.getElementById('entrar-visitante').addEventListener('click', () => {
    try { sessionStorage.setItem(CHAVE_VISITANTE, 'sim'); } catch {}
    atualizarAcesso(null);
  });
  atualizarAcesso(null);
  atualizarBotoes(null);
  if (!configurado) return;

  try {
    // A aplicação é estática e não usa bundler; carrega o SDK ESM pelo CDN só quando configurado.
    const { createClient } = await import('https://esm.sh/@supabase/supabase-js@2.117.3');
    supabase = createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);
  } catch (error) {
    document.getElementById('entrar-email').disabled = true;
    document.getElementById('criar-conta').disabled = true;
    document.getElementById('status-login').textContent = 'Não foi possível carregar o serviço de login. Você pode entrar como visitante.';
    document.getElementById('status-conta').textContent = 'Não foi possível carregar o SDK do Supabase.';
    console.error('Falha ao carregar o SDK do Supabase:', error);
    return;
  }
  atualizarBotoes(null);
  document.getElementById('form-email').addEventListener('submit', async (evento) => {
    evento.preventDefault();
    const submit = document.getElementById('entrar-email');
    submit.disabled = true;
    await entrarComEmail();
    submit.disabled = false;
  });
  document.getElementById('criar-conta').addEventListener('click', async () => {
    const botao = document.getElementById('criar-conta');
    botao.disabled = true;
    await criarContaEmail();
    botao.disabled = false;
  });
  document.getElementById('entrar-github').addEventListener('click', entrarComGithub);
  supabase.auth.onAuthStateChange((_evento, sessao) => {
    queueMicrotask(() => carregarDadosUsuario(sessao?.user || null, aoAtualizar));
  });

  try {
    const resposta = await fetch(`${SUPABASE_URL}/auth/v1/settings`, {
      headers: { apikey: SUPABASE_PUBLISHABLE_KEY },
      signal: AbortSignal.timeout(5000),
    });
    if (resposta.ok) {
      const configuracoesAuth = await resposta.json();
      githubHabilitado = configuracoesAuth.external?.github === true;
    }
  } catch {}
  atualizarBotoes(null);
  const { data, error } = await supabase.auth.getSession();
  if (error) {
    document.getElementById('status-conta').textContent = `Erro ao verificar login: ${error.message}`;
    return;
  }
  await carregarDadosUsuario(data.session?.user || null, aoAtualizar);
}
