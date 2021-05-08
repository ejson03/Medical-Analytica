import express from 'express';
import bodyParser from 'body-parser';
import session from 'express-session';
import MongoStore from 'connect-mongo';
import cors from 'cors';
import router from './routes';

import * as config from './config';
import PassportModelsGenerate from './services/Passport';
import passport from 'passport';

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());

const MongoStoreSession = MongoStore(session);

app.use(
   session({
      store: new MongoStoreSession({
         url: config.MONGO_URL
      }),
      secret: config.SECRET,
      resave: false,
      saveUninitialized: false,
      cookie: {
         maxAge: 1000 * 60 * 60 * 24
      }
   })
);
   app.use(passport.initialize());
   app.use(passport.session());
   await PassportModelsGenerate();

app.use('/', router);
app.get('/dashboard', (_req, res) => {
   res.render('dashboard.html');
});

app.listen(config.PORT, function () {
   console.log(`App listening on port ${config.PORT}`);
});
