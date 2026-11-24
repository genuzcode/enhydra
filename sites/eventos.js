const eventos = lerJSON("eventos", []);

function criarElemento(tag, classe, texto) {
  const el = document.createElement(tag);
  if (classe) el.className = classe;
  if (texto !== undefined) el.textContent = texto;
  return el;
}

function eventoJaPassou(ev) {
  const d = new Date(ev.inicio);
  return !isNaN(d) && d < new Date();
}

function criarCard(ev) {
  const card = criarElemento("article", "evento");
  if (eventoJaPassou(ev)) card.classList.add("evento--passado");

  // Capa
  const capa = criarElemento("div", "evento__capa");
  if (ev.capa) {
    const img = document.createElement("img");
    img.src = ev.capa;
    img.alt = "Capa do evento " + ev.titulo;
    img.loading = "lazy";
    capa.append(img);
  } else {
    capa.classList.add("evento__capa--vazia");
    capa.append(criarElemento("span", "", "Sem imagem"));
  }
  if (eventoJaPassou(ev)) {
    capa.append(criarElemento("span", "evento__selo", "Encerrado"));
  }

  // Corpo
  const corpo = criarElemento("div", "evento__corpo");
  corpo.append(criarElemento("h2", "evento__titulo", ev.titulo));
  if (ev.subtitulo) corpo.append(criarElemento("p", "evento__subtitulo", ev.subtitulo));

  corpo.append(criarElemento("p", "evento__data", formatarDataHora(ev.inicio)));
  corpo.append(criarElemento("p", "evento__descricao", ev.descricao));

  if (ev.lembrete) {
    const lembrete = criarElemento("p", "evento__lembrete");
    lembrete.append(criarElemento("strong", "", "Lembrete: "), document.createTextNode(ev.lembrete));
    corpo.append(lembrete);
  }

  corpo.append(criarElemento("p", "evento__criador", "Criado por " + (ev.criador || NOME_USUARIO)));

  card.append(capa, corpo);
  return card;
}

function ordenar(lista, criterio) {
  const copia = [...lista];
  const tempo = ev => {
    const t = new Date(ev.inicio).getTime();
    return isNaN(t) ? 0 : t;
  };
  if (criterio === "distantes") copia.sort((a, b) => tempo(b) - tempo(a));
  else if (criterio === "recentes") copia.sort((a, b) => Number(b.id) - Number(a.id));
  else copia.sort((a, b) => tempo(a) - tempo(b));
  return copia;
}

function renderizar() {
  const termo = $("busca").value.trim().toLowerCase();
  const filtrados = eventos.filter(ev =>
    (ev.titulo || "").toLowerCase().includes(termo) ||
    (ev.descricao || "").toLowerCase().includes(termo)
  );
  const lista = ordenar(filtrados, $("ordem").value);

  const container = $("listaEventos");
  container.replaceChildren(...lista.map(criarCard));

  $("vazio").hidden = lista.length > 0;
  $("contador").textContent =
    eventos.length === 0 ? "" :
    lista.length === eventos.length
      ? eventos.length + (eventos.length === 1 ? " evento cadastrado" : " eventos cadastrados")
      : lista.length + " de " + eventos.length + " eventos";
}

$("busca").addEventListener("input", renderizar);
$("ordem").addEventListener("change", renderizar);

renderizar();