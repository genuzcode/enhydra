/* Menu lateral retrátil: basta incluir menu.css e menu.js em qualquer tela. */
(function () {
  const LINKS = [
    { texto: "Início", href: "inicio.html" },
    { texto: "Meu perfil", href: "perfil.html" },
    { texto: "Criar evento", href: "criar-evento.html" },
    { texto: "Eventos", href: "eventos.html" },
    { texto: "Instituição", href: "#" },
    { texto: "Configurações", href: "#" }
  ];

  const ICONE_MENU =
    '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" aria-hidden="true"><path d="M4 6h16M4 12h16M4 18h16"/></svg>';
  const ICONE_FECHAR =
    '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18"/></svg>';

  function el(tag, classe, texto) {
    const e = document.createElement(tag);
    if (classe) e.className = classe;
    if (texto !== undefined) e.textContent = texto;
    return e;
  }

  const paginaAtual = location.pathname.split("/").pop() || "inicio.html";

  /* Botão que abre o menu */
  const botao = el("button", "menu-botao");
  botao.type = "button";
  botao.setAttribute("aria-label", "Abrir menu");
  botao.setAttribute("aria-expanded", "false");
  botao.setAttribute("aria-controls", "menuLateral");
  botao.innerHTML = ICONE_MENU;

  /* Fundo escurecido */
  const fundo = el("div", "menu-fundo");

  /* Gaveta */
  const gaveta = el("aside", "menu-gaveta");
  gaveta.id = "menuLateral";
  gaveta.setAttribute("aria-label", "Menu principal");

  const topo = el("div", "menu-gaveta__topo");
  const fechar = el("button", "menu-gaveta__fechar");
  fechar.type = "button";
  fechar.setAttribute("aria-label", "Fechar menu");
  fechar.innerHTML = ICONE_FECHAR;
  topo.append(el("span", "menu-gaveta__titulo", "Menu"), fechar);

  const lista = el("ul", "menu-gaveta__lista");
  LINKS.forEach(l => {
    const li = el("li");
    const a = el("a", "menu-gaveta__link", l.texto);
    a.href = l.href;
    if (l.href === paginaAtual) {
      a.classList.add("menu-gaveta__link--ativo");
      a.setAttribute("aria-current", "page");
    }
    li.append(a);
    lista.append(li);
  });

  gaveta.append(topo, lista);

  function definir(aberto) {
    gaveta.classList.toggle("aberto", aberto);
    fundo.classList.toggle("aberto", aberto);
    document.body.classList.toggle("menu-travado", aberto);
    botao.setAttribute("aria-expanded", aberto);
    document.querySelectorAll("[data-abrir-menu]").forEach(b =>
      b.setAttribute("aria-expanded", aberto));
    if (aberto) fechar.focus(); else if (document.activeElement && gaveta.contains(document.activeElement)) botao.focus();
  }

  botao.addEventListener("click", () => definir(true));
  fechar.addEventListener("click", () => definir(false));
  fundo.addEventListener("click", () => definir(false));
  document.addEventListener("keydown", e => {
    if (e.key === "Escape" && gaveta.classList.contains("aberto")) definir(false);
  });

  /* Qualquer elemento com data-abrir-menu também abre o menu */
  document.addEventListener("click", e => {
    if (e.target.closest("[data-abrir-menu]")) definir(true);
  });

  document.body.append(botao, fundo, gaveta);

  /* Se a tela já tem um botão próprio, esconde o flutuante */
  if (document.querySelector("[data-abrir-menu]")) botao.hidden = true;
})();