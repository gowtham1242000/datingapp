const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');
require('dotenv').config()
require ('./config/db.js')
const userRoutes = require('./routes/userRoutes');

const app = express();
app.use(bodyParser.json());

app.use('/api/users', userRoutes);

const PORT = process.env.PORT || ( "0.0.0.0" , 3000) ;

app.listen(PORT, () => {

  console.log(`Server is running on port ${PORT}`);
});
