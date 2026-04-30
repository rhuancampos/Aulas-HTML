<?php
#comentário de uma linha
/**
 * este é um bloco de comentário
 * teste
 */
function soma(int $a, int $b){
  return $a + $b;
} 

$nome = "Rhuan";
$idade = 9;
echo "Olá " . $nome . "!";
echo "Soma: " . soma(3, 5);

if($idade >= 18) {
  echo $nome . ", você é maior de idade!";
} else {
  echo $nome . ", você não é maior de idade!";
}

for($i = 1; $i <= 5; $i ++){
  echo $i;
}

$i = 0;
while($i < 5){
  echo $i;
  $i++;
}
?>