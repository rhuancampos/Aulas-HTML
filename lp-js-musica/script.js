const lista = [12,6346,75,423,42,4,65432,63,7,457,24,234,236,352]

const valorTotal = lista
                    .filter(item => item % 2 == 0)
                    .map(item => item * 1.1)
                    .reduce((total, valor) => total + valor, 0)

console.log(`Valores atualizados são ${valorTotal}`)

const titulo = document.getElementById('titulo')
console.log(titulo)

const btn = document.querySelector('#btn-acao')
btn.addEventListener('click', evento => {
  evento.preventDefault()
  console.log("Clicou")
})