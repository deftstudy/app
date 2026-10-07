// Todos os conteúdos do site ficam aqui.
// Para adicionar um link, copie uma linha de "itens" e troque os dados.
// tipo pode ser: "video", "repo" ou "site".
const SETORES = [
  {
    id: 'html',
    nome: 'HTML',
    descricao: 'A estrutura das páginas: tags, semântica e acessibilidade.',
    icone: 'file-code',
    itens: [
      { titulo: 'HTML na documentação da MDN', tipo: 'site', url: 'https://developer.mozilla.org/pt-BR/docs/Web/HTML', tags: ['referência', 'semântica'] },
      { titulo: 'Learn HTML (web.dev)', tipo: 'site', url: 'https://web.dev/learn/html', tags: ['curso', 'iniciante'] },
      {
        // Vídeo do YouTube: cole o código <iframe> inteiro entre crases (`). O "url" não é necessário.
        titulo: 'Exemplo: troque o título e o vídeo',
        tipo: 'video',
        iframe: `<iframe width="560" height="315" src="https://www.youtube.com/embed/Ejkb_YpuHWs?si=AzcQyTiqcQn5QNl5" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>`,
        tags: ['iniciante'],
      },
    ],
  },
  {
    id: 'css',
    nome: 'CSS',
    descricao: 'Layout, cores e animações: flexbox, grid e Tailwind.',
    icone: 'palette',
    itens: [
      { titulo: 'Flexbox Froggy: aprenda flexbox jogando', tipo: 'site', url: 'https://flexboxfroggy.com/#pt-br', tags: ['flexbox', 'jogo'] },
      { titulo: 'CSS Grid Garden: aprenda grid jogando', tipo: 'site', url: 'https://cssgridgarden.com/#pt-br', tags: ['grid', 'jogo'] },
      { titulo: 'Documentação do Tailwind CSS', tipo: 'site', url: 'https://tailwindcss.com/docs', tags: ['tailwind', 'referência'] },
    ],
  },
  {
    id: 'js',
    nome: 'JavaScript',
    descricao: 'A lógica do site: variáveis, funções, DOM e ES6.',
    icone: 'braces',
    itens: [
      { titulo: 'The Modern JavaScript Tutorial', tipo: 'site', url: 'https://javascript.info/', tags: ['es6', 'curso'] },
      { titulo: 'clean-code-javascript', tipo: 'repo', url: 'https://github.com/ryanmcdermott/clean-code-javascript', tags: ['boas práticas'] },
      { titulo: 'Exemplo: troque por um vídeo de JavaScript', tipo: 'video', url: 'https://www.youtube.com/', tags: ['iniciante'] },
    ],
  },
  {
    id: 'git',
    nome: 'Git e GitHub',
    descricao: 'Controle de versão e colaboração com Git e GitHub.',
    icone: 'git-branch',
    itens: [
      { titulo: 'Livro Pro Git (português)', tipo: 'site', url: 'https://git-scm.com/book/pt-br/v2', tags: ['versionamento', 'referência'] },
      { titulo: 'Learn Git Branching', tipo: 'site', url: 'https://learngitbranching.js.org/?locale=pt_BR', tags: ['branches', 'prática'] },
      { titulo: 'first-contributions', tipo: 'repo', url: 'https://github.com/firstcontributions/first-contributions', tags: ['open source', 'prática'] },
    ],
  },
];
