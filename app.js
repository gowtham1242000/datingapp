const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');
require('dotenv').config()
require ('./config/db.js');
const cors = require('cors');
const editJsonFile    = require('edit-json-file');
const fileUpload = require('express-fileupload');




const userRoutes = require('./routes/userRoutes');
const path = require('path');
const { TextDecoder } = require('util');

let TextDecoderFatal = new TextDecoder('utf8', { fatal: true });

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}))
app.use(bodyParser.json());
app.set('view engine', 'ejs');
require('dotenv').config();
app.use(fileUpload());

app.use('/api/users', userRoutes);

const PORT = process.env.PORT || ( "0.0.0.0" , 8000) ;

const allowedOrigins = ['http://localhost:5174'];
app.use(cors());

app.listen(PORT, () => {

  console.log(`Server is running on port ${PORT}`);
});
