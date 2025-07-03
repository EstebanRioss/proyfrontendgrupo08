const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors'); // <-- 1. IMPORTA CORS

dotenv.config();

const app = express();

app.use(cors()); 
app.use(express.json()); 

app.use('/api/mp', require('./routes/mp.route')); 

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor iniciado en el puerto ${PORT}`);
});