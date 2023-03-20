const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql');
const app = express();
const porta = 3000;

app.use(express.json())

// Configurando o express para lidar com POSTs
app.use(express.urlencoded({ extended: true }));

const connection = mysql.createConnection({
  user: 'root',
  password: '1234',
  database: 'apisql',
  host: 'localhost',
  port: 3306
})

connection.connect(function (err) {
  if (err) throw err
  console.log('Connected!')
})

app.get('/apisql', (req, res) => {
  const query = `SELECT * FROM apisql.tipo_cliente;`

  connection.query(query, (err, result) => {
    if (err) {
      throw err
    } else {
      res.send(result)
    }
  })
})

app.get('/apisql/buscar/email/:email', (req, res) => {
  const email = req.params.email
  const query = `SELECT * FROM apisql.cliente WHERE email = '${email}';`

  connection.query(query, (err, result) => {
    if (err) {
      throw err
    } else {
      res.send(result[0])
    }
  })
})

app.get('/apisql/buscar/id/:id', (req, res) => {
  const id = req.params.id
  const query = `SELECT * FROM apisql.cliente WHERE id = ${id};`

  connection.query(query, (err, result) => {
    if (err) {
      throw err
    } else {
      res.send(result[0])
    }
  })
})

// Criando a rota para inserir dados no banco de dados
app.post('/cliente/gravar', (req, res) => {
  const { nome, telefone, email, logradouro, numero, complemento, bairro, cidade, uf, cep, tipo_cliente_id } = req.body;
  
  const sql = 'INSERT INTO cliente (nome, telefone, email, logradouro, numero, complemento, bairro, cidade, uf, cep, tipo_cliente_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)';
  db.query(sql, [nome, telefone, email, logradouro, numero, complemento, bairro, cidade, uf, cep, tipo_cliente_id], (err, result) => {
    if (err) {
      console.log(`Erro ao inserir dados no banco de dados: ${err.message}`);
      res.status(500).send('Erro interno do servidor');
    } else {
      console.log(`Dados inseridos com sucesso. ID do novo cliente: ${result.insertId}`);
      res.status(200).send(`Dados inseridos com sucesso. ID do novo cliente: ${result.insertId}`);
    }
  });
});



app.listen(PORT, () => console.log('rodando'))
