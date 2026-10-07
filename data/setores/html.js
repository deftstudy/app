export const HTML_SETOR = {
    id: 'html',
    nome: 'HTML',
    descricao: 'A estrutura das páginas: tags, semântica e acessibilidade.',
    icone: 'file-code',
    itens: [
        {
            titulo: 'HTML na documentação da MDN',
            tipo: 'site',
            url: 'https://developer.mozilla.org/pt-BR/docs/Web/HTML',
            tags: ['referência', 'semântica'],
        },
        {
            titulo: 'Learn HTML (web.dev)',
            tipo: 'site',
            url: 'https://web.dev/learn/html',
            tags: ['curso', 'iniciante'],
        },
        {
            titulo: 'Exemplo: troque o título e o vídeo',
            tipo: 'video',
            iframe: `<iframe width="560" height="315" src="https://www.youtube.com/embed/Ejkb_YpuHWs?si=AzcQyTiqcQn5QNl5" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>`,
            tags: ['iniciante'],
        },
    ],
};
