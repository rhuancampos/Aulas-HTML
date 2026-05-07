<?php
$search_term = isset($_GET['search']) ? htmlspecialchars($_GET['search']) : '';

$url_api = "https://ddragon.leagueoflegends.com/cdn/14.20.1/data/pt_BR/champion.json";

# Consumo da API 
$curl = curl_init();
curl_setopt($curl, CURLOPT_URL, $url_api);
curl_setopt($curl, CURLOPT_RETURNTRANSFER, 1);
curl_setopt($curl, CURLOPT_SSL_VERIFYPEER, false);

$reponse = curl_exec($curl);
$http_code = curl_getinfo($curl, CURLINFO_HTTP_CODE);

$champions = [];
$error = '';

if($http_code == 200 && $reponse){
  $json = json_decode($reponse, true);
  if(!empty($search_term)){
    $champions = array_filter($json['data'], 
    function ($champion) use ($search_term) {
      return stripos(strtolower($champion['name']), strtolower($search_term)) !== false;
    });
  } else {
    $champions = $json['data'];
  }
} else {
  $error = "Falha ao consumir a API. [Código $http_code]";
}

?>
<!DOCTYPE html>
<html lang="pt-br">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=divece-width, initial-scale=1.0">
    <title>Campeões do LOL (PHP)</title>
    <link rel="stylesheet" href="style.css">
  </head>
  <body>
    <header>
      <h1>Enciclopédia de Campeões (PHP)</h1>
      <form method="GET" action="index.php" class="search-container">
        <input type="text" id="search-input" name="search" 
        placeholder="Pesquisar por nome..." value="<?php echo $search_term; ?>">
        <button type="submit">Pesquisar</button>
      </form>
    </header>
    <main>
      <div id="champion-grid">
        <?php if(!empty($error)): ?>
          <p><?php echo $error; ?></p>
        <?php elseif(empty($champions)): ?>
          <p>Nenhum campeão encontrado.
        <?php else: ?>
          <?php foreach($champions as $champion): ?>
            <div class="champion-card">
              <img src="<?php echo "https://ddragon.leagueoflegends.com/cdn/img/champion/loading/" . htmlspecialchars($champion['id']) . "_0.jpg" ?>" />
              <h3><?php echo $champion['name'] ?></h3>
              <p><?php echo $champion['title'] ?></p>
            </div>
          <?php endforeach ?>
        <?php endif ?>
      </div>
    </main>
  </body>
</html>