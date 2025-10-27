// ######
// Local onde os pacotes de dependências serão importados
// ######
import express from "express"; // Requisição do pacote do express
import pkg from "pg"; // Requisição do pacote do pg (PostgreSQL)
import dotenv from "dotenv"; // Importa o pacote dotenv para carregar variáveis de ambiente


// ######
// Local onde as configurações do servidor serão feitas
// ######

const app = express(); // Inicializa o servidor Express
const port = 3000; // Define a porta onde o servidor irá escutar
dotenv.config(); // Carrega as variáveis de ambiente do arquivo .env
app.use(express.json()); // Middleware para interpretar requisições com corpo em JSON


const { Pool } = pkg; // Obtém o construtor Pool do pacote pg para gerenciar conexões com o banco de dados PostgreSQL

let pool = null; // Variável para armazenar o pool de conexões com o banco de dados

//server.js
// Função para obter uma conexão com o banco de dados
function conectarBD() {
  if (!pool) {
    pool = new Pool({
      connectionString: process.env.URL_BD,
    });
  }
  return pool;
}
// ######
// Local onde as rotas (endpoints) serão definidas
// ######
//server.js
app.get("/questoes", async (req, res) => {
  //server.js
  const db = conectarBD(); // Cria uma nova instância do Pool para gerenciar conexões com o banco de dados
  console.log("Rota GET /questoes solicitada"); // Log no terminal para indicar que a rota foi acessada
  //server.js



  //server.js
  try {
    const resultado = await db.query("SELECT * FROM questoes"); // Executa uma consulta SQL para selecionar todas as questões
    const dados = resultado.rows; // Obtém as linhas retornadas pela consulta
    res.json(dados); // Retorna o resultado da consulta como JSON
  } catch (e) {
    console.error("Erro ao buscar questões:", e); // Log do erro no servidor
    res.status(500).json({
      erro: "Erro interno do servidor",
      mensagem: "Não foi possível buscar as questões",
    });
  }
});

app.post("/questoes", async (req, res) => {
  console.log("Rota POST /questoes solicitada"); // Log no terminal para indicar que a rota foi acessada

  try {
    const data = req.body; // Obtém os dados do corpo da requisição
    // Validação dos dados recebidos
    if (!data.enunciado || !data.disciplina || !data.tema || !data.nivel) {
      return res.status(400).json({
        erro: "Dados inválidos",
        mensagem:
          "Todos os campos (enunciado, disciplina, tema, nivel) são obrigatórios.",
      });
    }

    const db = conectarBD(); // Conecta ao banco de dados

    const consulta =
      "INSERT INTO questoes (enunciado,disciplina,tema,nivel) VALUES ($1,$2,$3,$4) "; // Consulta SQL para inserir a questão
    const questao = [data.enunciado, data.disciplina, data.tema, data.nivel]; // Array com os valores a serem inseridos
    const resultado = await db.query(consulta, questao); // Executa a consulta SQL com os valores fornecidos
    res.status(201).json({ mensagem: "Questão criada com sucesso!" }); // Retorna o resultado da consulta como JSON
  } catch (e) {
    console.error("Erro ao inserir questão:", e); // Log do erro no servidor
    res.status(500).json({
      erro: "Erro interno do servidor"
    });
  }
});

app.get("/questoes/:id", async (req, res) => {
  console.log("Rota GET /questoes/:id solicitada"); // Log no terminal para indicar que a rota foi acessada

  try {
    const id = req.params.id; // Obtém o ID da questão a partir dos parâmetros da URL
    const db = conectarBD(); // Conecta ao banco de dados
    const consulta = "SELECT * FROM questoes WHERE id = $1"; // Consulta SQL para selecionar a questão pelo ID
    const resultado = await db.query(consulta, [id]); // Executa a consulta SQL com o ID fornecido
    const dados = resultado.rows; // Obtém as linhas retornadas pela consulta

    // Verifica se a questão foi encontrada
    if (dados.length === 0) {
      return res.status(404).json({ mensagem: "Questão não encontrada" }); // Retorna erro 404 se a questão não for encontrada
    }

    res.json(dados); // Retorna o resultado da consulta como JSON
  } catch (e) {
    console.error("Erro ao buscar questão:", e); // Log do erro no servidor
    res.status(500).json({
      erro: "Erro interno do servidor"
    });
  }
});

app.delete("/questoes/:id", async (req, res) => {
  console.log("Rota DELETE /questoes/:id solicitada"); // Log no terminal para indicar que a rota foi acessada

  try {
    const id = req.params.id; // Obtém o ID da questão a partir dos parâmetros da URL
    const db = conectarBD(); // Conecta ao banco de dados
    let consulta = "SELECT * FROM questoes WHERE id = $1"; // Consulta SQL para selecionar a questão pelo ID
    let resultado = await db.query(consulta, [id]); // Executa a consulta SQL com o ID fornecido
    let dados = resultado.rows; // Obtém as linhas retornadas pela consulta

    // Verifica se a questão foi encontrada
    if (dados.length === 0) {
      return res.status(404).json({ mensagem: "Questão não encontrada" }); // Retorna erro 404 se a questão não for encontrada
    }

    consulta = "DELETE FROM questoes WHERE id = $1"; // Consulta SQL para deletar a questão pelo ID
    resultado = await db.query(consulta, [id]); // Executa a consulta SQL com o ID fornecido
    res.status(200).json({ mensagem: "Questão excluida com sucesso!!" }); // Retorna o resultado da consulta como JSON
  } catch (e) {
    console.error("Erro ao excluir questão:", e); // Log do erro no servidor
    res.status(500).json({
      erro: "Erro interno do servidor"
    });
  }
});

app.put("/questoes/:id", async (req, res) => {
  console.log("Rota PUT /questoes solicitada"); // Log no terminal para indicar que a rota foi acessada

  try {
    const id = req.params.id; // Obtém o ID da questão a partir dos parâmetros da URL
    const db = conectarBD(); // Conecta ao banco de dados
    let consulta = "SELECT * FROM questoes WHERE id = $1"; // Consulta SQL para selecionar a questão pelo ID
    let resultado = await db.query(consulta, [id]); // Executa a consulta SQL com o ID fornecido
    let questao = resultado.rows; // Obtém as linhas retornadas pela consulta

    // Verifica se a questão foi encontrada
    if (questao.length === 0) {
      return res.status(404).json({ message: "Questão não encontrada" }); // Retorna erro 404 se a questão não for encontrada
    }

    const data = req.body; // Obtém os dados do corpo da requisição

    // Usa o valor enviado ou mantém o valor atual do banco
    data.enunciado = data.enunciado || questao[0].enunciado;
    data.disciplina = data.disciplina || questao[0].disciplina;
    data.tema = data.tema || questao[0].tema;
    data.nivel = data.nivel || questao[0].nivel;

    // Atualiza a questão
    consulta ="UPDATE questoes SET enunciado = $1, disciplina = $2, tema = $3, nivel = $4 WHERE id = $5";
    // Executa a consulta SQL com os valores fornecidos
    resultado = await db.query(consulta, [
      data.enunciado,
      data.disciplina,
      data.tema,
      data.nivel,
      id,
    ]);

    res.status(200).json({ message: "Questão atualizada com sucesso!" }); // Retorna o resultado da consulta como JSON
  } catch (e) {
    console.error("Erro ao atualizar questão:", e); // Log do erro no servidor
    res.status(500).json({
      erro: "Erro interno do servidor",
    });
  }
});

// ######
// CRUD for 'objetos' resource
// ######

app.get("/objetos", async (req, res) => {
  console.log("Rota GET /objetos solicitada"); // Log no terminal para indicar que a rota foi acessada

  const db = conectarBD();

  try {
    const resultado = await db.query("SELECT * FROM objeto"); // Executa uma consulta SQL para selecionar todos os objetos
    const dados = resultado.rows; // Obtém as linhas retornadas pela consulta
    res.json(dados); // Retorna o resultado da consulta como JSON
  } catch (e) {
    console.error("Erro ao buscar objetos:", e); // Log do erro no servidor
    res.status(500).json({
      erro: "Erro interno do servidor"
    });
  }
});

app.get("/objetos/:id", async (req, res) => {
  console.log("Rota GET /objetos/:id solicitada"); // Log no terminal para indicar que a rota foi acessada

  try {
    const id = req.params.id; // Obtém o ID do objeto a partir dos parâmetros da URL
    const db = conectarBD(); // Conecta ao banco de dados
    const consulta = "SELECT * FROM objeto WHERE id = $1"; // Consulta SQL para selecionar o objeto pelo ID
    const resultado = await db.query(consulta, [id]); // Executa a consulta SQL com o ID fornecido
    const dados = resultado.rows; // Obtém as linhas retornadas pela consulta

    // Verifica se o objeto foi encontrado
    if (dados.length === 0) {
      return res.status(404).json({ mensagem: "Objeto não encontrado" }); // Retorna erro 404 se o objeto não for encontrado
    }

    res.json(dados); // Retorna o resultado da consulta como JSON
  } catch (e) {
    console.error("Erro ao buscar objeto:", e); // Log do erro no servidor
    res.status(500).json({
      erro: "Erro interno do servidor"
    });
  }
});

app.post("/objetos", async (req, res) => {
  console.log("Rota POST /objetos solicitada"); // Log no terminal para indicar que a rota foi acessada

  try {
    const data = req.body; // Obtém os dados do corpo da requisição
    // Validação dos dados recebidos
    if (!data.titulo || !data.categoria || !data.local || !data.dataExpiracao || !data.palavraPasse) {
      return res.status(400).json({
        erro: "Dados inválidos",
        mensagem:
          "Todos os campos obrigatórios (titulo, categoria, local, dataExpiracao, palavraPasse) são obrigatórios.",
      });
    }

    const db = conectarBD(); // Conecta ao banco de dados

    const consulta =
      "INSERT INTO objeto (titulo, descricao, categoria, local, dataExpiracao, foto, palavraPasse, contatoInstagram, contatoWhatsapp, denuncia, statusDenuncia) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)"; // Consulta SQL para inserir o objeto
    const objeto = [
      data.titulo,
      data.descricao || null,
      data.categoria,
      data.local,
      data.dataExpiracao,
      data.foto || null,
      data.palavraPasse,
      data.contatoInstagram || null,
      data.contatoWhatsapp || null,
      data.denuncia || false,
      data.statusDenuncia || false
    ]; // Array com os valores a serem inseridos
    const resultado = await db.query(consulta, objeto); // Executa a consulta SQL com os valores fornecidos
    res.status(201).json({ mensagem: "Objeto criado com sucesso!" }); // Retorna o resultado da consulta como JSON
  } catch (e) {
    console.error("Erro ao inserir objeto:", e); // Log do erro no servidor
    res.status(500).json({
      erro: "Erro interno do servidor"
    });
  }
});

app.put("/objetos/:id", async (req, res) => {
  console.log("Rota PUT /objetos solicitada"); // Log no terminal para indicar que a rota foi acessada

  try {
    const id = req.params.id; // Obtém o ID do objeto a partir dos parâmetros da URL
    const db = conectarBD(); // Conecta ao banco de dados
    let consulta = "SELECT * FROM objeto WHERE id = $1"; // Consulta SQL para selecionar o objeto pelo ID
    let resultado = await db.query(consulta, [id]); // Executa a consulta SQL com o ID fornecido
    let objeto = resultado.rows; // Obtém as linhas retornadas pela consulta

    // Verifica se o objeto foi encontrado
    if (objeto.length === 0) {
      return res.status(404).json({ message: "Objeto não encontrado" }); // Retorna erro 404 se o objeto não for encontrada
    }

    const data = req.body; // Obtém os dados do corpo da requisição

    // Usa o valor enviado ou mantém o valor atual do banco
    data.titulo = data.titulo || objeto[0].titulo;
    data.descricao = data.descricao !== undefined ? data.descricao : objeto[0].descricao;
    data.categoria = data.categoria || objeto[0].categoria;
    data.local = data.local || objeto[0].local;
    data.dataExpiracao = data.dataExpiracao || objeto[0].dataexpiracao;
    data.foto = data.foto !== undefined ? data.foto : objeto[0].foto;
    data.palavraPasse = data.palavraPasse || objeto[0].palavrapasse;
    data.contatoInstagram = data.contatoInstagram !== undefined ? data.contatoInstagram : objeto[0].contatoinstagram;
    data.contatoWhatsapp = data.contatoWhatsapp !== undefined ? data.contatoWhatsapp : objeto[0].contatowhatsapp;
    data.denuncia = data.denuncia !== undefined ? data.denuncia : objeto[0].denuncia;
    data.statusDenuncia = data.statusDenuncia !== undefined ? data.statusDenuncia : objeto[0].statusdenuncia;

    // Atualiza o objeto
    consulta = "UPDATE objeto SET titulo = $1, descricao = $2, categoria = $3, local = $4, dataExpiracao = $5, foto = $6, palavraPasse = $7, contatoInstagram = $8, contatoWhatsapp = $9, denuncia = $10, statusDenuncia = $11 WHERE id = $12";
    // Executa a consulta SQL com os valores fornecidos
    resultado = await db.query(consulta, [
      data.titulo,
      data.descricao,
      data.categoria,
      data.local,
      data.dataExpiracao,
      data.foto,
      data.palavraPasse,
      data.contatoInstagram,
      data.contatoWhatsapp,
      data.denuncia,
      data.statusDenuncia,
      id,
    ]);

    res.status(200).json({ message: "Objeto atualizado com sucesso!" }); // Retorna o resultado da consulta como JSON
  } catch (e) {
    console.error("Erro ao atualizar objeto:", e); // Log do erro no servidor
    res.status(500).json({
      erro: "Erro interno do servidor",
    });
  }
});

app.delete("/objetos/:id", async (req, res) => {
  console.log("Rota DELETE /objetos/:id solicitada"); // Log no terminal para indicar que a rota foi acessada

  try {
    const id = req.params.id; // Obtém o ID do objeto a partir dos parâmetros da URL
    const db = conectarBD(); // Conecta ao banco de dados
    let consulta = "SELECT * FROM objeto WHERE id = $1"; // Consulta SQL para selecionar o objeto pelo ID
    let resultado = await db.query(consulta, [id]); // Executa a consulta SQL com o ID fornecido
    let dados = resultado.rows; // Obtém as linhas retornadas pela consulta

    // Verifica se o objeto foi encontrado
    if (dados.length === 0) {
      return res.status(404).json({ mensagem: "Objeto não encontrado" }); // Retorna erro 404 se o objeto não for encontrada
    }

    consulta = "DELETE FROM objeto WHERE id = $1"; // Consulta SQL para deletar o objeto pelo ID
    resultado = await db.query(consulta, [id]); // Executa a consulta SQL com o ID fornecido
    res.status(200).json({ mensagem: "Objeto excluido com sucesso!!" }); // Retorna o resultado da consulta como JSON
  } catch (e) {
    console.error("Erro ao excluir objeto:", e); // Log do erro no servidor
    res.status(500).json({
      erro: "Erro interno do servidor"
    });
  }
});


app.get("/", async (req, res) => {
  //server.js
  const db = conectarBD(); // Cria uma nova instância do Pool para gerenciar conexões com o banco de dados
  // Rota raiz do servidor
  // Rota GET /
  // Esta rota é chamada quando o usuário acessa a raiz do servidor
  // Ela retorna uma mensagem de boas-vindas e o status da conexão com o banco de dados
  // Cria a rota da raiz do projeto

  console.log("Rota GET / solicitada"); // Log no terminal para indicar que a rota foi acessada

  let dbStatus = "ok";

  // Tenta executar uma consulta simples para verificar a conexão com o banco de dados
  // Se a consulta falhar, captura o erro e define o status do banco de dados como a mensagem de erro
  try {
    await db.query("SELECT 1");
  } catch (e) {
    dbStatus = e.message;
  }

  // Responde com um JSON contendo uma mensagem, o nome do autor e o status da conexão com o banco de dados
  res.json({
    message: "API para _____", // Substitua pelo conteúdo da sua API
    author: "Mizael Miranda Barbosa", // Substitua pelo seu nome
    dbStatus: dbStatus,
  });
});

// ######
// Local onde o servidor irá escutar as requisições
// ######
app.listen(port, () => {
  // Inicia o servidor na porta definida
  // Um socket para "escutar" as requisições
  console.log(`Serviço rodando na porta:  ${port}`);
});
