console.log("Teste");
document.getElementById("titulo").innerText = "Teste atualizado";
document.getElementsByClassName("titulo")[3].innerHTML = "Teste atualizado 2";
document.querySelectorAll("h3.titulo")[0].innerText = "Teste atualizado 3";

function mostrarTexto() {
  const nome = document.getElementById("nome").value;
  const idade = document.getElementById("idade").value;
  if (idade >= 18) {
    console.log("Você é maior de idade");
  } else {
    console.log("Você é menor de idade");
  }
  console.log(`O nome é: ${nome}`);
}

function criarElemento() {
  const novo = document.createElement("p");
  const nome = document.getElementById("nome").value;
  novo.innerText = nome;
  document.body.appendChild(novo);

  const novo2 = document.createElement("img");
  novo2.src = "https://picsum.photos/300/90";
  document.body.appendChild(novo2);
}

function mudarCor() {
  /* document.body.style.backgroundColor = "#c0c0c0" */
  document.body.style = "filter: invert(1) hue-rotate(180deg) !important; background-color: #000 !important;";
}