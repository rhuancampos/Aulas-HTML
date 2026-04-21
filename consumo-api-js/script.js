document.addEventListener('DOMContentLoaded', () => {
  const championGrid = document.getElementById('champion-grid')
  const searchInput = document.getElementById('search-input')

  let allChampions = []

  const apiURL = 'https://ddragon.leagueoflegends.com/cdn/14.20.1/data/pt_BR/champion.json'

  async function fetchChampions() {
    championGrid.innerHTML = '<p>Carregando campeões...</p>'
    try{
      const result = await fetch(apiURL)
      if(!result.ok)
        throw new Error('Não foi possível buscar os dados dos campeões.')

      const data = await result.json()
      allChampions = Object.values(data.data)
      displayChampions(allChampions)
    } catch(error) {
      championGrid.innerHTML = `Erro no consumo da API: ${error.message}`
      console.error('Erro ao buscar informações: ', error)
    }
  }

  function displayChampions(champions) {
    championGrid.innerHTML = ''
    if(champions.length == 0){
      championGrid.innerHTML = '<p>Nenhum campeão cadastrado</p>'
      return
    }

    champions.forEach(champion => {
      const card = document.createElement('div')
      card.className = 'champion-card'
      const img = `https://ddragon.leagueoflegends.com/cdn/img/champion/loading/${champion.id}_0.jpg`
      card.innerHTML = `
        <img src="${img}" alt="${champion.name}">
        <h3>${champion.name} - ${champion.title}<h3>
        <p>${champion.blurb}</p>
        <span><b>Ataque:</b> ${champion.info.attack}</span>
        <br><b>Defesa:</b> ${champion.info.defense}
        <br><b>Magia:</b> ${champion.info.magic}
        <br><b>Dificuldade:</b> ${champion.info.difficulty}</span>
        <br><br>
      `
      championGrid.appendChild(card)
    });
  }

  function filterChampions (){
    const searchTerm = searchInput.value.toLowerCase().trim()
    const filterChampions = allChampions.filter(champion => {
      return champion.name.toLowerCase().includes(searchTerm)
    })

    displayChampions(filterChampions)
  }

  searchInput.addEventListener('input', filterChampions)

  fetchChampions()
})