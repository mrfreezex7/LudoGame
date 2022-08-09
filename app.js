require('dotenv').config()

const Logging = require("./utility/logging");
const path = require('path');

const express = require('express');
const passport = require('passport');
const session = require('express-session');
const MongoStore = require('connect-mongo')(session);
const bodyParser = require('body-parser');
const passportSetup = require('./config/passport-setup');
const keys = require('./config/keys');
const mongoConnect = require('./utility/database').mongoConnect;
const socketio = require('socket.io');
const sharedsession = require('express-socket.io-session');
const helmet = require('helmet');
const compression = require('compression');

const ChangeLog = require("./models/changeLog");
const server = require("./server.js");
const gameRoom = require("./models/GameRoom");

const GameRoom = require('./models/GameRoom');

const app = express();

app.set('view engine', 'ejs');
app.set('views', 'views');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

app.use(helmet());
app.use(compression());

mongoConnect((_client) => {

    const sessionMiddleware = session({
        key: 'session_id'
        , secret: keys.session.cookieKey
        , resave: true
        , autoSave: true
        , saveUninitialized: true
        , cookie: {
            maxAge: 360 * 60 * 60 * 1000
        }
        // store: new MongoStore({ client: _client })
    })
    app.use(sessionMiddleware);


    app.use(passport.initialize());
    app.use(passport.session());

    const errorController = require('./controllers/error');
    const routes = require('./routes/routes');
    const authRoutes = require('./routes/auth-routes');

    app.use('/auth', authRoutes);
    app.use(routes);
    app.use(errorController.get404Page);


    const PORT = process.env.PORT || 7777;


    ChangeLog.CLog.GetAllChangeLogs();

    const expressServer = app.listen(PORT);
    const io = socketio(expressServer);
    io.use(sharedsession(sessionMiddleware));
    console.log("Socket And Express Server Started");
    Logging.info("Socket And Express Server Started", PORT);

    //console.log(GameRoom.GetAllRooms());
    gameRoom.SocketConnect(io);
    server.SocketConnect(io);

});



