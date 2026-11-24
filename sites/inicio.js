const eventos = lerJSON("eventos", []);

const FOTO_PADRAO = "data:image/svg+xml;utf8," + encodeURIComponent(
  '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><rect width="100" height="100" fill="#c8c8d4"/><circle cx="50" cy="38" r="18" fill="#fff"/><ellipse cx="50" cy="95" rx="32" ry="26" fill="#fff"/></svg>');

function criarElemento(tag, classe, texto) {
  const el = document.createElement(tag);
  if (classe) el.className = classe;
  if (texto !== undefined) el.textContent = texto;
  return el;
}

/* ================= NAV BAR / MENU ================= */
const perfil = lerJSON("perfilUsuario", {});
if (perfil.foto) $("navFoto").src = perfil.foto;
$("navFoto").addEventListener("error", () => { $("navFoto").src = FOTO_PADRAO; });

$("alternarMenu").addEventListener("click", () => {
  const aberto = $("menuLateral").classList.toggle("aberto");
  $("alternarMenu").setAttribute("aria-expanded", aberto);
});

/* ================= EVENTOS DO MÊS ================= */
function doMesAtual(ev) {
  const d = new Date(ev.inicio);
  if (isNaN(d)) return false;
  const hoje = new Date();
  return d.getFullYear() === hoje.getFullYear() && d.getMonth() === hoje.getMonth();
}

function criarDetalhe(rotulo, texto) {
  const bloco = criarElemento("div", "detalhe");
  bloco.append(
    criarElemento("p", "detalhe__rotulo", rotulo),
    criarElemento("p", "detalhe__texto", texto)
  );
  return bloco;
}

function criarItem(ev) {
  const li = criarElemento("li", "item");

  // Cabeçalho: título + data + setinha
  const cabecalho = criarElemento("div", "item__cabecalho");
  const info = criarElemento("div", "item__info");
  info.append(
    criarElemento("p", "item__titulo", ev.titulo),
    criarElemento("p", "item__data", formatarDataHora(ev.inicio))
  );

  const seta = criarElemento("button", "item__seta");
  seta.type = "button";
  seta.setAttribute("aria-expanded", "false");
  seta.setAttribute("aria-label", "Mostrar mais sobre " + ev.titulo);
  seta.innerHTML =
    '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" ' +
    'stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' +
    '<path d="M6 9l6 6 6-6"/></svg>';

  cabecalho.append(info, seta);

  // Detalhes (ocultos): subtítulo, descrição e lembrete
  const detalhes = criarElemento("div", "item__detalhes");
  detalhes.hidden = true;
  if (ev.subtitulo) detalhes.append(criarDetalhe("Subtítulo", ev.subtitulo));
  if (ev.descricao) detalhes.append(criarDetalhe("Descrição", ev.descricao));
  if (ev.lembrete) detalhes.append(criarDetalhe("Lembrete", ev.lembrete));
  if (!detalhes.children.length) detalhes.append(criarDetalhe("", "Sem mais informações."));

  seta.addEventListener("click", () => {
    const abrir = detalhes.hidden;
    detalhes.hidden = !abrir;
    seta.setAttribute("aria-expanded", abrir);
  });

  li.append(cabecalho, detalhes);
  return li;
}

function renderizar() {
  const mes = new Date().toLocaleDateString("pt-BR", { month: "long", year: "numeric" });
  $("mesAtual").textContent = mes;

  const doMes = eventos
    .filter(doMesAtual)
    .sort((a, b) => new Date(a.inicio) - new Date(b.inicio));

  $("agenda").replaceChildren(...doMes.map(criarItem));
  $("vazio").hidden = doMes.length > 0;
}

renderizar();