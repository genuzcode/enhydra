let evento = JSON.parse(localStorage.getItem("eventoUsuario") || "null") || {
  nome: "Nome do evento",
  criador: "Criador",
  data: ""            // formato AAAA-MM-DD
};

function formatarData(iso) {
  if (!iso) return "Data";
  const [a, m, d] = iso.split("-");
  return `${d}/${m}/${a}`;
}

function renderizarEvento() {
  $("verEvento").textContent  = evento.nome;
  $("verCriador").textContent = evento.criador;
  $("verData").textContent    = formatarData(evento.data);
}

$("abrirEvento").onclick = () => {
  $("eventoNome").value    = evento.nome;
  $("eventoCriador").value = evento.criador;
  $("eventoData").value    = evento.data;
  $("modalEvento").showModal();
};

$("cancelarEvento").onclick = () => $("modalEvento").close();

// fecha ao clicar fora (no backdrop)
$("modalEvento").addEventListener("click", e => {
  if (e.target === $("modalEvento")) $("modalEvento").close();
});

$("formEvento").addEventListener("submit", () => {
  evento = {
    nome:    $("eventoNome").value.trim(),
    criador: $("eventoCriador").value.trim(),
    data:    $("eventoData").value
  };
  localStorage.setItem("eventoUsuario", JSON.stringify(evento));
  renderizarEvento();
});

renderizarEvento();