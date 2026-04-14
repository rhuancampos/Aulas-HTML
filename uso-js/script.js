function mostrarMensagem() {
  const nome = document.getElementById("nome").value;
  const idade = document.getElementById("idade").value;
  console.debug(`Idade ${idade}`);
  let mensagem = `Olá, ${nome}. Seja bem-vindo ao meu site! `;

  if (idade < 0) {
    alert("Idade inválida!");
    return;
  } else if (idade < 18) {
    mensagem = mensagem + " Você é menor de idade.";
  } else {
    mensagem += "Você é maior de idade.";
  }

  alert(mensagem);
}

function mudarCor() {
  document.body.style.backgroundColor = "lightblue";
}