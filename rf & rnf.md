# Requisitos deftstudy

Plataforma de estudos de programação: links de vídeos, repositórios e sites organizados por setor, com busca em estilo terminal.

Última atualização: 07/10/2026

## Requisitos funcionais

| ID   | Requisito                                                                                               | Situação |
| ---- | ------------------------------------------------------------------------------------------------------- | -------- |
| RF01 | Mostrar os setores (HTML, CSS, JS, Git) como cards com nome, descrição, ícone e quantidade de conteúdos | Feito    |
| RF02 | Abrir um setor e listar seus conteúdos, com botão de voltar (e o voltar do navegador funcionando)       | Feito    |
| RF03 | Mostrar cada conteúdo como card com tipo (vídeo, repositório ou site), título, setor e tags             | Feito    |
| RF04 | Buscar por título, setor e tag em todos os setores, em tempo real, com atalho `/`                       | Feito    |
| RF05 | Abrir links externos em nova aba                                                                        | Feito    |
| RF06 | Mostrar prévia de vídeos do YouTube no card, aceitando só embeds do YouTube                             | Feito    |
| RF07 | Avisar quando a busca não encontra nada                                                                 | Feito    |
| RF08 | Filtrar por tipo e por tag, com as tags clicáveis                                                       | Novo     |
| RF09 | Indicar nível (iniciante, intermediário, avançado) e idioma, com filtro                                 | Novo     |
| RF10 | Marcar conteúdo como visto ou favorito e mostrar progresso por setor (salvo no navegador)               | Novo     |
| RF11 | Compartilhar uma busca por URL (ex.: `?q=flexbox`)                                                      | Novo     |
| RF12 | Botão "sugerir conteúdo" que leva a uma issue do GitHub                                                 | Novo     |
| RF13 | Tela de erro para setor que não existe (`#xyz`)                                                         | Novo     |
| RF14 | adicionar opção de salvar algo, e criar sessão de salvos na tela inicial                                | Novo     |


## Requisitos não funcionais

| ID    | Categoria              | Requisito                                                                                                                                                                |
| ----- | ---------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| RNF01 | Desempenho             | Sem frameworks; vídeos só carregam perto da tela; página inicial em até 2 s no 4G; o fundo não pode travar a rolagem no celular                                          |
| RNF02 | Compatibilidade        | Funcionar de 320 px até telas grandes, nas versões atuais de Chrome, Firefox, Edge e Safari                                                                              |
| RNF03 | Acessibilidade         | Contraste mínimo de 4,5:1 (WCAG AA), com atenção ao cinza das tags e do contador; foco visível; uso completo pelo teclado; respeitar `prefers-reduced-motion`            |
| RNF04 | Segurança              | Nunca inserir dados com `innerHTML`; aceitar só embeds do YouTube; links externos com `noopener noreferrer`; considerar `youtube-nocookie.com` para reduzir rastreamento |
| RNF05 | Manutenção             | Dados separados do código; código modular e comentado; README igual à estrutura real; validação automática dos dados                                                     |
| RNF06 | Hospedagem             | Site estático no GitHub Pages, sem custo e sem servidor, publicado a cada push na `main`                                                                                 |
| RNF07 | Legibilidade           | Títulos em fonte mono, leitura em sans, tema escuro sem prejudicar a leitura                                                                                             |
| RNF08 | SEO e compartilhamento | `title`, `description` e Open Graph para o link aparecer bem no Discord e no WhatsApp                                                                                    |
| RNF09 | Licença                | Código sob MIT; conteúdos linkados pertencem aos autores originais, com aviso no rodapé                                                                                  |
| RNF10 | Temas                  | Adicionar a opção de ter temas diversos nas configurações do site                                                                                                        |
