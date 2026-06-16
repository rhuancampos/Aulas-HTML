document.addEventListener('DOMContentLoaded', () => {
  const championGrid = document.getElementById('champion-grid')
  const searchInput  = document.getElementById('search-input')
  const apiURL = 'https://ddragon.leagueoflegends.com/cdn/14.20.1/data/pt_BR/champion.json'

  let allChampions = []

  async function fetchChampions() {
    championGrid.innerHTML = '<p>Carregando campeões...</p>'
    try {
      const result = await fetch(apiURL)

      if(!result.ok)
        throw new Error('Não foi possível buscar os dados da API.')

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
    champions.forEach(champion => {
      const card = document.createElement('div')
      const img = `https://ddragon.leagueoflegends.com/cdn/img/champion/loading/${champion.id}_0.jpg`
      card.className = 'champion-card'
      card.innerHTML = `
        <img src="${img}"/>
        <h3>${champion.name} [${champion.title}]</h3>
        <p>${champion.blurb}</p>
      `
      championGrid.appendChild(card)
    });
  }

  function filterChampions() {
    const searchTerm = searchInput.value.toLowerCase().trim()
    const filterChampions = allChampions.filter(champion => {
      return champion.name.toLowerCase().includes(searchTerm)
    })

    displayChampions(filterChampions)
  }

  searchInput.addEventListener('input', filterChampions)
  fetchChampions()
})