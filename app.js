// node modules
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const methodOverride = require('method-override');
const cookieParser = require("cookie-parser");
const dotenv = require('dotenv').config();
const axios = require('axios');



// local modules
const routes = require('./routers/mainRouters');
const User = require('./models/User');

const app = express();

// CONNECT MONGODB
mongoose.connect(`mongodb+srv://mustafaogus12:eBluwVLJfKmdHh8W@kutuphane.t3p87gx.mongodb.net/`)
  .then(() => {
    console.log('DB Connected');
  })
  .catch((err) => {
    console.error('DB Connection Error:', err);
  });

app.use(cookieParser());

app.set("view engine", "ejs");

app.use(function (req, res, next) {
  res.locals.req = req;
  res.locals.res = res;
  next();
});

// GLOBAL VARIABLES
global.userIN = null;
global.msgError = null;
global.msgSuccess = null;
global.query = null;
global.title = "Kütüphane Otomasyonu";
global.description = "";


// MIDDLEWARES
app.use(express.static("public"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(session({
  secret: 'mustafa',
  resave: false,
  saveUninitialized: true,
  store: MongoStore.create({ mongoUrl:`mongodb+srv://mustafaogus12:eBluwVLJfKmdHh8W@kutuphane.t3p87gx.mongodb.net/?retryWrites=true&w=majority` }),
}));
app.use(
  methodOverride('_method', {
    methods: ['POST', 'GET'],
  })
);

app.use('*', (req, res, next) => {
  userIN = req.session.userID;
  next();
});

// Global Veriller
app.use('*', async (req, res, next) => {
  user = await User.findOne({ _id: userIN });
  msgSuccess = req.query.msgSuccess
  msgError = req.query.msgError
  next();
});

app.get('/search', async (req, res) => {
  try {
    const apiKey = 'AIzaSyBJpTIah1E9lXhFUTmqsBqyyC_TTcY8TnY'; // Buraya kendi API anahtarınızı ekleyin
    const query = req.query.name; 

    const url = `https://www.googleapis.com/books/v1/volumes?q=${query}&maxResults=40&key=${apiKey}`;
    const response = await axios.get(url);
    const books = response.data.items;

    res.render('kitaplar', { books: books });
  } catch (error) {
    console.error('Error fetching data from Google Books API:', error);
    res.status(500).send('Error fetching data from Google Books API');
  }
});

app.use('/', routes);

const port = process.env.PORT || 5000;
const server = app.listen(port, () => {
  console.log(`App is starting on port:${port}`);
});
