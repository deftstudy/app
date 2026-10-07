# deftstudy

Plataforma de estudos de programação: links de vídeos, repositórios e sites organizados por setor (HTML, CSS, JS, etc.), com busca em estilo terminal.

## Como rodar

Gere o CSS uma vez (veja a seção abaixo) e abra o `index.html` no navegador. Não precisa de servidor.

## Tailwind CSS (gerar o CSS)

O visual usa Tailwind. O arquivo `css/tailwind.css` é gerado pelo Tailwind CLI e precisa ir junto no commit para o GitHub Pages funcionar.

1. Instale o Node.js e, na pasta do projeto, rode `npm install` (só na primeira vez).
2. Rode `npm run build` para gerar o `css/tailwind.css`.
3. Durante o desenvolvimento, `npm run css` fica observando os arquivos e gera o CSS de novo a cada alteração.

Sempre que você usar uma classe nova do Tailwind, rode o build de novo antes do commit.

## Estrutura

```
deftstudy/
├── index.html          # estrutura da página (busca fixa no topo)
├── css/style.css       # fundo, cursor piscando, foco do teclado
├── css/tailwind.css    # GERADO pelo Tailwind CLI (não edite à mão)
├── src/input.css       # entrada do Tailwind (fontes do projeto)
├── package.json        # comandos npm run build / npm run css
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

## Vídeos do YouTube (prévia no card)

No YouTube, clique em *Compartilhar → Incorporar* e copie o código `<iframe>`. Em `data/setores.js`, cole esse código inteiro entre crases (`) no campo `iframe`:

```js
{
  titulo: 'Nome do vídeo',
  tipo: 'video',
  iframe: `<iframe ... src="https://www.youtube.com/embed/ID_DO_VIDEO" ...></iframe>`,
  tags: ['iniciante'],
},
```

O site usa só o endereço (`src`) e monta o player sozinho. Só embeds do YouTube são aceitos. O vídeo precisa ser aberto por `http`: use Live Server, `npx serve .` ou o GitHub Pages. Abrindo o `index.html` direto do computador, o YouTube pode mostrar o erro 153.

## Créditos

Os conteúdos linkados pertencem aos seus autores. O deftstudy apenas organiza os links.
