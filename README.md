# deftsec

Plataforma de estudos de programação: links de vídeos, repositórios e sites organizados por setor (HTML, CSS, JS, etc.), com busca em estilo terminal.

## Como rodar

Abra o `index.html` no navegador. Não precisa de servidor.

## Estrutura

```
deftsec/
├── index.html          # estrutura da página (busca fixa no topo)
├── css/style.css       # fundo, cursor piscando, foco do teclado
├── data/setores.js     # TODOS os conteúdos ficam aqui
└── js/
    ├── busca.js        # filtra por texto e por setor
    ├── render.js       # desenha setores e cartões
    └── main.js         # liga tudo (ponto de entrada)
```

## Como adicionar conteúdo

Abra `data/setores.js` e inclua uma linha na lista `itens` do setor:

```js
{ titulo: 'Nome do conteúdo', tipo: 'video', url: 'https://...', tags: ['iniciante'] },
```

`tipo` pode ser `video`, `repo` ou `site`. Para criar um setor novo, copie um bloco inteiro e troque `id`, `nome`, `descricao` e `icone` (nome de um ícone do Lucide). Cada setor vira um card na página inicial e abre com os seus conteúdos dentro.

## Créditos

Os conteúdos linkados pertencem aos seus autores. O deftsec apenas organiza os links.
