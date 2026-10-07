// Recebe todos os itens e devolve só os que combinam com o texto digitado
// e com o setor escolhido ("todos" não filtra por setor).
export function filtrar(itens, { texto, setor }) {
  const termo = texto.trim().toLowerCase();

  return itens.filter((item) => {
    const noSetor = setor === 'todos' || item.setor === setor;

    // A busca olha o título, o setor e as tags
    const conteudo = [item.titulo, item.setor, ...(item.tags || [])].join(' ').toLowerCase();
    const noTexto = termo === '' || conteudo.includes(termo);

    return noSetor && noTexto;
  });
}
