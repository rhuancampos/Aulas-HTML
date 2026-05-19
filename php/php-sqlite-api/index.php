<?php
// Define que a resposta desta API será no formato JSON e codificada em UTF-8.
// Isso avisa o cliente (navegador/frontend) sobre o formato dos dados que ele vai receber.
header("Content-Type: application/json; charset=utf-8");

// Função responsável por estabelecer e configurar a conexão com o banco de dados
function getConnection() {
  // Define o caminho do arquivo onde o banco SQLite será salvo
  $filedb = "db/database.sqlite";
  $pdo    = null;
  
  try {
    // Instancia o objeto PDO para se conectar ao banco SQLite
    $pdo = new PDO('sqlite:' . $filedb);
    //$pdo = new PDO('mysql:host=127.0.0.1;port=3306;dbname=teste', 'root', '1234');
    //$pdo = new PDO('pqsql:host=127.0.0.1;port=5432;dbname=teste', 'root', '1234');

    // Configura o PDO para lançar uma exceção caso ocorra qualquer erro no banco de dados
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    // Garante que os comandos SQL sejam confirmados e salvos automaticamente (commit)
    $pdo->setAttribute(PDO::ATTR_AUTOCOMMIT, 1);

    // Executa um comando SQL para criar a tabela 'usuarios' caso ela ainda não exista
    $pdo->exec("CREATE TABLE IF NOT EXISTS usuarios (
      id INTEGER PRIMARY KEY AUTOINCREMENT, -- Chave primária que se preenche sozinha
      nome VARCHAR(100) NOT NULL,           -- Campo obrigatório para o nome
      email VARCHAR(50) NOT NULL            -- Campo obrigatório para o email
    )");

  } catch(PDOException $e) {
    // Se a conexão ou a criação da tabela falhar, captura o erro e devolve em formato JSON
    echo json_encode(['error' => $e->getMessage()], JSON_UNESCAPED_UNICODE);
  } finally {
    // Independente de sucesso ou falha, retorna a variável de conexão
    return $pdo;
  }
}

// Inicia a conexão chamando a função acima
$pdo    = getConnection();

// Acessa a superglobal $_SERVER para descobrir qual método HTTP foi usado (GET, POST, etc.)
$method = $_SERVER["REQUEST_METHOD"];

// Direciona o fluxo do código dependendo do método da requisição
switch($method){
  case 'GET': // O cliente está pedindo para LER dados
    try{
      // Verifica se o ID foi passado na URL (ex: ?id=1). Se sim, converte para número inteiro.
      $id = isset($_GET['id']) ? intval($_GET['id']) : null;
      
      if($id){
        // Prepara uma consulta para buscar um usuário específico. 
        // O uso de "?" (Prepared Statement) evita ataques de SQL Injection.
        $stmt = $pdo->prepare("SELECT * FROM usuarios WHERE id = ?");
        $stmt->execute([$id]);
        
        // Puxa o resultado do banco no formato de um array associativo (chave => valor)
        $usuario = $stmt->fetch(PDO::FETCH_ASSOC);
        
        if($usuario){
          // Se o usuário existir, converte o array para JSON e o devolve para o cliente
          echo json_encode($usuario, JSON_UNESCAPED_UNICODE);
        } else {
          // Se não existir, define o código HTTP como 404 (Não Encontrado) e devolve o erro
          http_response_code(404);
          echo json_encode(['erro' => 'Usuario não encontrado.'], JSON_UNESCAPED_UNICODE);
        }
      } else {
        // Se nenhum ID foi passado, a intenção é listar TODOS os usuários
        $stmt = $pdo->prepare("SELECT * FROM usuarios");
        $stmt->execute();
        
        // fetchAll puxa todos os registros de uma só vez
        $usuarios = $stmt->fetchAll(PDO::FETCH_ASSOC);
        
        // Retorna a lista completa de usuários em JSON
        echo json_encode($usuarios, JSON_UNESCAPED_UNICODE);
      }
    } catch(PDOException $e) {
        // Se a consulta der erro, devolve o código 500 (Erro Interno do Servidor)
        http_response_code(500);
        echo json_encode(['error' => $e->getMessage()], JSON_UNESCAPED_UNICODE);
      }
    break;
    
  case 'POST': // O cliente está enviando dados para CRIAR um novo registro
    // Lê o "corpo" da requisição bruta (onde vem o JSON do cliente) e converte para array PHP
    $dados = json_decode(file_get_contents("php://input"), true);
    
    // Valida se as informações obrigatórias foram enviadas
    if(isset($dados['nome']) && isset($dados['email'])){
      try{
        // Prepara a instrução de inserção no banco de dados
        $stmt = $pdo->prepare("INSERT INTO usuarios (nome, email) VALUES (?, ?)");
        // Executa a instrução, substituindo os "?" pelos dados recebidos
        $stmt->execute([$dados['nome'], $dados['email']]);
        
        // Define o código HTTP como 201 (Criado), o que é o padrão correto para POST
        http_response_code(201);
        
        // Retorna uma mensagem de sucesso, incluindo o ID gerado automaticamente pelo banco
        echo json_encode([
          'status'  => true,
          'message' => 'Usuário criado com sucesso!',
          'id'      => $pdo->lastInsertId() 
        ], JSON_UNESCAPED_UNICODE);
      } catch(PDOException $e) {
        // Se o banco falhar ao tentar salvar, retorna erro 500
        http_response_code(500);
        echo json_encode(['error' => $e->getMessage()], JSON_UNESCAPED_UNICODE);
      }
    } else {
      // Se não enviou 'nome' ou 'email', retorna erro 400 (Requisição Ruim) avisando sobre os dados
      http_response_code(400);
      echo json_encode(['error' => 'Dados incompletos.'], JSON_UNESCAPED_UNICODE);
    }
    break;
    
  default:
    // Se tentarem usar PUT, DELETE, PATCH, etc., o código cai aqui e bloqueia a ação.
    // Retorna código HTTP 405 (Método Não Permitido).
    http_response_code(405);
    echo json_encode(["erro" => "Método não permitido."], JSON_UNESCAPED_UNICODE);
}


/**
 * Para praticar, criei o código para atualizar uma informação no banco e para apagar uma informação
 * SQL EXEMPLO PARA ATUALIZAR: UPDATE nome_da_tabela SET coluna1 = valor1, coluna2 = valor2 WHERE condicao;
 * SQL EXEMPLO PARA APAGAR: DELETE FROM nome_da_tabela WHERE condicao;
 */
?>