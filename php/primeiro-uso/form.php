<?php
  
  $nome = $_POST['nome'];
  $idade = $_POST['idade'];
  echo "Olá, " . $nome;
  if($idade >= 18) {
    echo ", você é maior de idade!";
  } else {
    echo ", você não é maior de idade!";
  }
?>