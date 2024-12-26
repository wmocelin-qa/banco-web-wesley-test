require('dotenv').config(); 
const express = require('express');
const axios = require('axios');

const app = express();

const API_BASE_URL = process.env.API_BASE_URL || 'http://localhost:3000';
const PORT = process.env.PORT || 4000; 

let tokenAutenticacao = ''; 

app.use(express.json());
app.use(express.static('public')); 

app.post('/bff/login', async (req, res) => {
  try {
    const { username, senha } = req.body;
    const response = await axios.post(`${API_BASE_URL}/login`, { username, senha });
    tokenAutenticacao = response.data.token; 
    res.json({ message: 'Login bem-sucedido!' });
  } catch (error) {
    console.error(error.response?.data || error.message);
    res.status(401).json(error.response?.data || { error: 'Usuário ou senha inválidos.' });
  }
});

app.post('/bff/transferencia', async (req, res) => {
  try {
    const { contaOrigem, contaDestino, valor, token } = req.body;
    const response = await axios.post(
      `${API_BASE_URL}/transferencias`,
      { contaOrigem, contaDestino, valor, token },
      { headers: { Authorization: `Bearer ${tokenAutenticacao}` } }
    );
    res.json(response.data);
  } catch (error) {
    console.error(error.response?.data || error.message);
    res.status(400).json(error.response?.data || { error: 'Erro ao realizar transferência.' });
  }
});

app.get('/bff/transferencias', async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const response = await axios.get(`${API_BASE_URL}/transferencias`, {
      headers: { Authorization: `Bearer ${tokenAutenticacao}` },
      params: { page, limit },
    });
    res.json(response.data);
  } catch (error) {
    console.error(error.response?.data || error.message);
    res.status(500).json(error.response?.data || { error: 'Erro ao buscar transferências.' });
  }
});

app.get('/bff/contas', async (req, res) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/contas`, {
      headers: { Authorization: `Bearer ${tokenAutenticacao}` },
    });
    res.json(response.data);
  } catch (error) {
    console.error(error.response?.data || error.message);
    res.status(500).json(error.response?.data || { error: 'Erro ao buscar contas.' });
  }
});

app.listen(PORT, () => {
  console.log(`BFF rodando na porta ${PORT}`);
});
