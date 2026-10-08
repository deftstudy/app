# deftstudy

Plataforma de estudos de programação: links de vídeos, repositórios e sites organizados por setor (HTML, CSS, JS, etc.), com busca em estilo terminal.

## Como rodar

Gere o CSS uma vez (veja a seção abaixo) e abra o `index.html` no navegador. Não precisa de servidor.

## Login e sincronização Supabase

O login requer servir o site por HTTP/HTTPS (por exemplo, Live Server) e configurar um projeto Supabase:

1. Instale as dependências com `npm install`.
2. No arquivo `backend/supabase-config.js`, informe a Project URL e a Publishable key (`sb_publishable_...`) do projeto. Essa chave é pública para uso no navegador; nunca use a chave `secret` ou `service_role` no frontend.
3. No SQL Editor do Supabase, execute [`supabase/schema.sql`](supabase/schema.sql). A tabela guarda progresso e configurações; políticas RLS restringem cada linha ao respectivo usuário autenticado.
4. Em **Authentication → Sign In / Providers**, deixe **Email** habilitado. A confirmação por e-mail pode ser exigida; nesse caso, configure o envio de e-mails no Supabase para produção.
5. Cadastre a URL publicada do app e a URL local de desenvolvimento em **Authentication → URL Configuration → Redirect URLs**.
6. Para habilitar GitHub opcionalmente, crie um OAuth App em **GitHub → Settings → Developer settings → OAuth Apps**. Use a URL do site como Homepage URL e `https://SEU-PROJETO.supabase.co/auth/v1/callback` como Authorization callback URL. Copie o Client ID e o Client Secret para **Authentication → Sign In / Providers → GitHub** no Supabase. Não coloque o Client Secret no repositório.
7. Abra o site servido por HTTP/HTTPS e entre ou crie uma conta com e-mail e senha. O botão GitHub aparece na mesma tela.

Favoritos, conteúdos vistos e configurações existentes no navegador são mesclados com a conta na primeira autenticação. Depois disso, alterações são salvas no Supabase e carregadas ao entrar novamente. Visitantes continuam usando o armazenamento local.

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
├── frontend/style.css       # fundo, cursor piscando, foco do teclado
├── frontend/tailwind.css    # GERADO pelo Tailwind CLI (não edite à mão)
├── src/input.css       # entrada do Tailwind (fontes do projeto)
├── package.json        # comandos npm run build / npm run css
├── data/setores.js     # TODOS os conteúdos ficam aqui
└── backend/
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
