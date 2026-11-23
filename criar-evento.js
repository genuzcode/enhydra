let capaBase64 = "";

const form = $("form-evento");
const previa = $("previaCapa");

// Prévia da imagem de capa
$("capa").addEventListener("change", async e => {
  const arquivo = e.target.files[0];
  if (!arquivo) return;
  try {
    capaBase64 = await lerImagem(arquivo);
    previa.src = capaBase64;
    previa.hidden = false;
  } catch {
    alert("Não foi possível ler a imagem selecionada.");
    e.target.value = "";
  }
});

// Salvar evento
form.addEventListener("submit", e => {
  e.preventDefault();

  const dados = new FormData(form);
  const evento = {
    id: Date.now().toString(),
    titulo: dados.get("titulo").trim(),
    subtitulo: dados.get("subtitulo").trim(),
    inicio: dados.get("inicio"),
    descricao: dados.get("descricao").trim(),
    lembrete: dados.get("lembrete").trim(),
    capa: capaBase64,
    criador: NOME_USUARIO
  };

  const eventos = lerJSON("eventos", []);
  eventos.push(evento);

  if (!salvarJSON("eventos", eventos)) {
    alert("Não foi possível salvar: a imagem de capa é muito grande. Tente uma menor.");
    return;
  }

  window.location.href = "perfil.html";
});

// Cancelar: limpa a prévia
form.addEventListener("reset", () => {
  capaBase64 = "";
  previa.hidden = true;
  previa.removeAttribute("src");
});