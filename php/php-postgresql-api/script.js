const API_URL = "http://localhost:8000/api.php";

document.addEventListener("DOMContentLoaded", listarUsuario());

async function listarUsuario() {
  try {
    const response = await fetch(API_URL);
    const usuarios = await response.json();

    const tbody = document.getElementById("tabelaUsuarios");
    tbody.innerHTML = "";

    if (!Array.isArray(usuarios)) return;

    usuarios.forEach((usuario) => {
      const tr = document.createElement("tr");
      tr.innerHTML = `
              <td>${usuario.id}</td>
              <td>${usuario.nome}</td>
              <td>${usuario.email}</td>
              <td>
                <button class="btn-warning" onclick="prepararEdicao(${usuario.id}, '${usuario.nome}', '${usuario.email}')">Editar</button>
                <button class="btn-danger" onclick="deletarUsuario(${usuario.id})">Apagar</button>
              </td>
            `;
      tbody.appendChild(tr);
    });
  } catch (erro) {
    console.error(`Erro ao listar usuários: ${erro}`);
  }
}

document
  .getElementById("usuarioForm")
  .addEventListener("submit", async function (event) {
    event.preventDefault();

    const id = document.getElementById("usuarioId").value;
    const nome = document.getElementById("nome").value;
    const email = document.getElementById("email").value;

    const metodo = id ? "PUT" : "POST";
    const url = id ? `${API_URL}?id=${id}` : API_URL;
    try {
      const response = await fetch(url, {
        method: metodo,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ nome, email }),
      });

      const resultado = await response.json();
      if (resultado.status) {
        alert(resultado.message);
        console.log(resultado.message);
        limparFormulario();
        listarUsuario();
      } else {
        alert(`Erro: ${resultado.error}`);
        console.error(resultado.error);
      }
    } catch (erro) {
      console.error(`Erro ao cadatras ou atualizar usuário: ${erro}`);
    }
  });

async function deletarUsuario(id) {
  if (!confirm("Tem certeza que deseja apagar este usuário?")) return;
  try {
    const resposta = await fetch(`${API_URL}?id=${id}`, {
      method: "DELETE",
    });

    const resultado = await resposta.json();
    if (resultado.status) {
      listarUsuario();
    } else {
      alert(`Erro: ${resultado.error}`);
    }
  } catch (erro) {
    console.error(`Erro ao apagar usuário: ${erro}`);
  }
}

function prepararEdicao(id, nome, email) {
  document.getElementById("usuarioId").value = id;
  document.getElementById("nome").value = nome;
  document.getElementById("email").value = email;

  document.getElementById("btnSalvar").innerHTML = "Atualizar Usuário";
  document.getElementById("btnCancelar").style.display = "inline-block";
}

function limparFormulario() {
  document.getElementById("usuarioId").value = "";
  document.getElementById("nome").value = "";
  document.getElementById("email").value = "";

  document.getElementById("btnSalvar").innerHTML = "Salvar Usuário";
  document.getElementById("btnCancelar").style.display = "none";
}
