const FOTO_PADRAO = "data:image/svg+xml;utf8," + encodeURIComponent(
  '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><rect width="100" height="100" fill="#c8c8d4"/><circle cx="50" cy="38" r="18" fill="#fff"/><ellipse cx="50" cy="95" rx="32" ry="26" fill="#fff"/></svg>');

/* ================= PERFIL ================= */
let fotoNova = null;

let perfil = {
  cargo: "Coordenador",
  email: "miserinha@gmail.com",
  foto: "outras/foto-teste.jpg",
  ...lerJSON("perfilUsuario", {})
};

function renderizarPerfil() {
  document.querySelectorAll(".verCargo").forEach(el => el.textContent = perfil.cargo);
  $("verEmail").textContent = perfil.email;
  $("verFoto").src = perfil.foto;
}

$("verFoto").addEventListener("error", () => { $("verFoto").src = FOTO_PADRAO; });
$("previaFoto").addEventListener("error", () => { $("previaFoto").src = FOTO_PADRAO; });

$("abrir").addEventListener("click", () => {
  $("cargo").value = perfil.cargo;
  $("email").value = perfil.email;
  $("previaFoto").src = perfil.foto;
  $("foto").value = "";
  fotoNova = null;
  $("modal").showModal();
});

$("cancelar").addEventListener("click", () => $("modal").close());

$("modal").addEventListener("click", e => {
  if (e.target === $("modal")) $("modal").close(); // clique no fundo
});

$("foto").addEventListener("change", async e => {
  const arquivo = e.target.files[0];
  if (!arquivo) return;
  try {
    fotoNova = await lerImagem(arquivo, 400);
    $("previaFoto").src = fotoNova;
  } catch {
    alert("Não foi possível ler a imagem selecionada.");
    e.target.value = "";
  }
});

$("form").addEventListener("submit", e => {
  e.preventDefault();
  const novo = {
    cargo: $("cargo").value.trim(),
    email: $("email").value.trim(),
    foto: fotoNova || perfil.foto
  };
  if (!salvarJSON("perfilUsuario", novo)) {
    alert("Foto muito grande para salvar. Tente uma menor.");
    return;
  }
  perfil = novo;
  renderizarPerfil();
  $("modal").close();
});

/* ================= EVENTOS ================= */
let eventos = lerJSON("eventos", []);
let eventoEditandoId = null;
let capaNovaEvento = null;

function criarElemento(tag, classe, texto) {
  const el = document.createElement(tag);
  if (classe) el.className = classe;
  if (texto !== undefined) el.textContent = texto;
  return el;
}

function renderizarEventos() {
  const lista = $("listaEventos");
  lista.replaceChildren();

  if (eventos.length === 0) {
    const vazio = criarElemento("li", "events__item");
    vazio.append(criarElemento("p", "events__meta", "Nenhum evento cadastrado."));
    lista.append(vazio);
    return;
  }

  eventos.forEach(ev => {
    const li = criarElemento("li", "events__item");
    li.dataset.id = ev.id;

    const info = criarElemento("div", "events__info");
    info.append(
      criarElemento("p", "events__title", ev.titulo),
      criarElemento("p", "events__meta", ev.criador || NOME_USUARIO),
      criarElemento("p", "events__dia", formatarDataHora(ev.inicio))
    );

    const botao = criarElemento("button", "events__edit", "Editar evento");
    botao.type = "button";
    botao.addEventListener("click", () => abrirEdicaoEvento(ev.id));

    li.append(criarElemento("span", "events__bar"), info, botao);
    lista.append(li);
  });
}

function abrirEdicaoEvento(id) {
  const ev = eventos.find(x => x.id === id);
  if (!ev) return;

  eventoEditandoId = id;
  capaNovaEvento = null;

  $("eventoTitulo").value = ev.titulo || "";
  $("eventoSubtitulo").value = ev.subtitulo || "";
  $("eventoInicio").value = ev.inicio || "";
  $("eventoDescricao").value = ev.descricao || "";
  $("eventoLembrete").value = ev.lembrete || "";
  $("eventoCapa").value = "";

  const previa = $("previaCapaEvento");
  if (ev.capa) {
    previa.src = ev.capa;
    previa.hidden = false;
  } else {
    previa.hidden = true;
    previa.removeAttribute("src");
  }

  $("modalEvento").showModal();
}

$("eventoCapa").addEventListener("change", async e => {
  const arquivo = e.target.files[0];
  if (!arquivo) return;
  try {
    capaNovaEvento = await lerImagem(arquivo);
    $("previaCapaEvento").src = capaNovaEvento;
    $("previaCapaEvento").hidden = false;
  } catch {
    alert("Não foi possível ler a imagem selecionada.");
    e.target.value = "";
  }
});

$("cancelarEvento").addEventListener("click", () => $("modalEvento").close());

$("modalEvento").addEventListener("click", e => {
  if (e.target === $("modalEvento")) $("modalEvento").close();
});

$("formEvento").addEventListener("submit", e => {
  e.preventDefault();
  const indice = eventos.findIndex(x => x.id === eventoEditandoId);
  if (indice === -1) return;

  const atualizado = {
    ...eventos[indice],
    titulo: $("eventoTitulo").value.trim(),
    subtitulo: $("eventoSubtitulo").value.trim(),
    inicio: $("eventoInicio").value,
    descricao: $("eventoDescricao").value.trim(),
    lembrete: $("eventoLembrete").value.trim(),
    capa: capaNovaEvento || eventos[indice].capa
  };

  const copia = [...eventos];
  copia[indice] = atualizado;

  if (!salvarJSON("eventos", copia)) {
    alert("Imagem muito grande para salvar. Tente uma menor.");
    return;
  }

  eventos = copia;
  renderizarEventos();
  $("modalEvento").close();
});

/* ================= INICIO ================= */
renderizarPerfil();
renderizarEventos();