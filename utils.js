// Funções compartilhadas entre perfil.html e criar-evento.html
const $ = id => document.getElementById(id);

const NOME_USUARIO = "Thiago Rafael Fofolindo";

function lerJSON(chave, padrao) {
  try {
    const valor = JSON.parse(localStorage.getItem(chave));
    return valor ?? padrao;
  } catch {
    return padrao;
  }
}

function salvarJSON(chave, valor) {
  try {
    localStorage.setItem(chave, JSON.stringify(valor));
    return true;
  } catch {
    return false;
  }
}

// Lê uma imagem e reduz o tamanho para caber no localStorage
function lerImagem(arquivo, max = 800) {
  return new Promise((resolve, reject) => {
    const leitor = new FileReader();
    leitor.onerror = reject;
    leitor.onload = () => {
      const img = new Image();
      img.onerror = reject;
      img.onload = () => {
        const escala = Math.min(1, max / Math.max(img.width, img.height));
        const canvas = document.createElement("canvas");
        canvas.width = Math.round(img.width * escala);
        canvas.height = Math.round(img.height * escala);
        const ctx = canvas.getContext("2d");
        ctx.fillStyle = "#fff";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        resolve(canvas.toDataURL("image/jpeg", 0.8));
      };
      img.src = leitor.result;
    };
    leitor.readAsDataURL(arquivo);
  });
}

function formatarDataHora(valor) {
  if (!valor) return "";
  const d = new Date(valor);
  if (isNaN(d)) return valor;
  return d.toLocaleString("pt-BR", { dateStyle: "short", timeStyle: "short" });
}