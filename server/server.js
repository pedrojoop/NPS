const express = require('express');
const bodyParser = require('body-parser');
const sqlite3 = require('sqlite3');
const path = require('path');

const app = express();
const port = 3000; // Porta em que o servidor Node.js irá rodar

// Configurar middleware para analisar dados JSON
app.use(bodyParser.json());

// Configurar middleware para servir arquivos estáticos (HTML, CSS, JavaScript)
app.use(express.static(path.join(__dirname, 'public')));

// Configurar conexão com o banco de dados SQLite
const db = new sqlite3.Database('C:/Users/rafat/Downloads/sqlite-tools-win32-x86-3430100/sqlite-tools-win32-x86-3430100/NPS.db');

// Crie a tabela 'Respostas' no banco de dados, se ainda não existir
db.serialize(() => {
  db.run(`CREATE TABLE IF NOT EXISTS Respostas (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    Pergunta1 TEXT,
    Pergunta2 TEXT,
    Pergunta3 TEXT
  )`);
});

// Definir rota para a página inicial
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Definir rota para lidar com o envio do formulário
app.post('/pesquisa-nps', (req, res) => {
  // Lidar com a lógica da pesquisa NPS aqui
  const resposta_pergunta1 = req.body.q1;
  const resposta_pergunta2 = req.body.q2;
  const resposta_pergunta3 = req.body.q3;

  // Inserir as respostas no banco de dados
  db.run(
    'INSERT INTO Respostas (Pergunta1, Pergunta2, Pergunta3) VALUES (?, ?, ?)',
    [resposta_pergunta1, resposta_pergunta2, resposta_pergunta3],
    (err) => {
      if (err) {
        return res.status(500).json({ error: 'Erro ao inserir respostas no banco de dados.' });
      }
      // Responder com uma mensagem de sucesso
      res.json({ message: 'Respostas inseridas com sucesso no banco de dados.' });
    }
  );
});

// Iniciar o servidor Node.js
app.listen(port, () => {
  console.log(`Servidor Node.js rodando na porta ${port}`);
});