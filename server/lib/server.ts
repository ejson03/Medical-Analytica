import express from 'express';
import bodyParser from 'body-parser';
import session from 'express-session';
import MongoStore from 'connect-mongo';
import cors from 'cors';
import router from './routes';

import { Vault } from './services/vault';

import * as config from './config';
import PassportModelsGenerate from './services/Passport';
import passport from 'passport';

import * as Mongo from './services/mongo';

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());

   await Mongo.Connect();

   if (Mongo.client != null)
app.use(
   session({
            store: MongoStore.create({ client: Mongo.client, dbName: 'session-db' }),

      secret: config.SECRET,
            resave: true,
            saveUninitialized: true,
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

   await Vault.Setup();

app.listen(config.PORT, function () {
   console.log(`App listening on port ${config.PORT}`);
});
