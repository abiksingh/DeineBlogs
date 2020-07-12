const express = require('express');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const morgan = require('morgan');
const exphbs = require('express-handlebars');
const methodOverride = require('method-override');
const path = require('path');
const passport = require('passport');
const session = require('express-session');
const MongoStore = require('connect-mongo')(session);
const connectDB = require('./config/db');



//Load config

dotenv.config({path: './config/config.env'});

// passport config
require('./config/passport')(passport);

// Connecting MongoDB database
connectDB();


const app = express();

// Body parser
app.use(express.urlencoded({extended: false}));
app.use(express.json())


//Method Override
app.use(methodOverride(function (req, res) {
  if (req.body && typeof req.body === 'object' && '_method' in req.body) {
    // look in urlencoded POST bodies and delete it
    let method = req.body._method
    delete req.body._method
    return method
  }
}))


//Logging
if(process.env.NODE_ENV === 'development'){
app.use(morgan('dev'))
}


// Handlebars helpers
const {formatDate, stripTags, truncate, editIcon, select} = require('./helpers/hbs');

//Template Engine / expressHandlebars middleware
app.engine('.hbs', exphbs({helpers: {formatDate, stripTags, truncate, editIcon, select} ,defaultLayout: 'main' , extname: '.hbs'}));
app.set('view engine', '.hbs');

//Session middleware
app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: false,
    store: new MongoStore({mongooseConnection: mongoose.connection})
  }))

//Passport middleware
app.use(passport.initialize());
app.use(passport.session());


// Set Global variable
app.use(function (req,res,next){
  res.locals.user = req.user || null
  next()
})


//Static Folder
app.use(express.static(path.join(__dirname, 'public')));

//Routes
app.use('/', require('./routes/index'));
app.use('/auth', require('./routes/auth'));
app.use('/blogs', require('./routes/blogs'));



const PORT = process.env.PORT || 3000




app.listen(PORT, console.log(`Server running in PORT ${PORT}`));