// Configurações do site.
// Cada opção é um item da lista OPCOES. A tela e o salvamento são gerados a partir dela,
// então, para criar uma configuração nova, basta adicionar mais um item em OPCOES.
// É um módulo ES: importa o que usa e exporta o que o main.js chama.

import { criar } from './render.js';

const CHAVE_CONFIG = 'deftstudy:config'; // nome usado para salvar no navegador (localStorage)
const CAMINHO_ONEKO = 'assets/oneko/';   // pasta com oneko.js e oneko.gif

const OPCOES = [
  {
    id: 'oneko',
    titulo: 'Gatinho oneko',
    descricao: 'Um gato pixelado que persegue o cursor pela página. Script oneko.js, de adryd325 (licença MIT).',
    padrao: false, // começa desligado: o gato distrai quem não pediu por ele
    aplicar: aplicarOneko,
    // Se o sistema pede menos movimento, o script do gato não roda. Avisamos em vez de deixar quebrado.
    indisponivel: () =>
      window.matchMedia('(prefers-reduced-motion: reduce)').matches
        ? 'Indisponível: seu sistema está com "reduzir movimento" ativado.'
        : '',
  },
];

// ---------- Salvar e ler ----------

function lerConfig() {
  let salvo = {};
  try {
    salvo = JSON.parse(localStorage.getItem(CHAVE_CONFIG)) || {};
  } catch {
    salvo = {}; // sem acesso ao armazenamento (ex.: aba anônima): usa os valores padrão
  }

  const config = {};
  OPCOES.forEach((opcao) => {
    config[opcao.id] = typeof salvo[opcao.id] === 'boolean' ? salvo[opcao.id] : opcao.padrao;
  });
  return config;
}

function salvarConfig(config) {
  try {
    localStorage.setItem(CHAVE_CONFIG, JSON.stringify(config));
  } catch {
    // sem armazenamento: a escolha vale só até fechar a página
  }
}

const configAtual = lerConfig();

// Chame uma vez ao abrir o site, para aplicar o que a pessoa já tinha escolhido
export function iniciarConfiguracoes() {
  OPCOES.forEach((opcao) => {
    const bloqueada = opcao.indisponivel && opcao.indisponivel();
    if (!bloqueada) opcao.aplicar(configAtual[opcao.id]);
  });
}

// ---------- Gatinho oneko ----------

let onekoCarregando = false;

function aplicarOneko(ativo) {
  // O script do gato cria um <div id="oneko">. Se já existe, só mostramos ou escondemos.
  const gato = document.getElementById('oneko');
  if (gato) {
    gato.style.display = ativo ? '' : 'none';
    return;
  }

  // Ainda não carregou: só carrega na primeira vez que a pessoa liga o gato
  if (!ativo || onekoCarregando) return;
  onekoCarregando = true;

  const script = document.createElement('script');
  script.src = `${CAMINHO_ONEKO}oneko.js`;
  script.dataset.cat = `${CAMINHO_ONEKO}oneko.gif`; // diz ao script onde está a imagem do gato
  script.onload = () => {
    onekoCarregando = false;
    aplicarOneko(configAtual.oneko); // se a pessoa desligou enquanto carregava, esconde de novo
  };
  script.onerror = () => {
    onekoCarregando = false;
    console.error('Não foi possível carregar o oneko.js. Confira a pasta assets/oneko/.');
  };
  document.body.append(script);
}

// ---------- Tela de configurações ----------

function criarLinha(opcao) {
  const bloqueio = opcao.indisponivel ? opcao.indisponivel() : '';

  const linha = criar('label', 'col-span-full flex items-start gap-4 rounded-lg border border-emerald-500/20 bg-slate-900/60 p-4');

  const caixa = document.createElement('input');
  caixa.type = 'checkbox';
  caixa.setAttribute('role', 'switch');
  caixa.className = 'mt-1 h-5 w-5 accent-emerald-400';
  caixa.checked = Boolean(configAtual[opcao.id]) && !bloqueio;
  caixa.disabled = Boolean(bloqueio);
  caixa.addEventListener('change', () => {
    configAtual[opcao.id] = caixa.checked;
    salvarConfig(configAtual);
    opcao.aplicar(caixa.checked);
  });

  const texto = criar('div', '');
  texto.append(
    criar('p', 'font-mono text-base text-slate-100', opcao.titulo),
    criar('p', 'mt-1 text-sm text-slate-400', opcao.descricao)
  );
  if (bloqueio) texto.append(criar('p', 'mt-2 text-sm text-amber-400', bloqueio));

  linha.append(caixa, texto);
  return linha;
}

// Desenha uma linha para cada opção dentro da área principal da página
export function renderConfiguracoes() {
  const area = document.getElementById('resultados');
  area.replaceChildren(...OPCOES.map(criarLinha));
}
