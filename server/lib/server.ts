import express from 'express';
import session from 'express-session';
import MongoStore from 'connect-mongo';
import cors from 'cors';
import router from './routes';
import flash from 'connect-flash';

import { Vault } from './services/vault';

import * as config from './config';
import PassportModelsGenerate from './services/Passport';
import passport from 'passport';

import * as Mongo from './services/mongo';

async function App() {
   const app = express();
   app.use(express.static('./public'));
   app.set('views', './views');
   app.set('view engine', 'ejs');
   app.engine('.html', require('ejs').renderFile);

   app.use(express.json());
   app.use(express.urlencoded({ extended: true }));
   app.use(cors());
   app.use(flash());

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

   return app;
}
App()
   .then(app => {
      app.listen(config.PORT, function () {
         console.log(`App listening on port ${config.PORT}`);
      });
   })
   .catch(err => console.error(err));
