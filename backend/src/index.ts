const express = require('express');
const cors = require('cors');

const app = express();

// Middlewares
app.use(cors());

app.listen(5000, () => console.log('Server running on port 5000'));