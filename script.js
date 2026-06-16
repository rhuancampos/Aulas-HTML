const obj = {
  nome: "Ana",
  normal: function () {
    console.log(this.nome)
  },
  arrow: () => {
    console.log(this.nome)
  }
}

obj.normal()
obj.arrow()

