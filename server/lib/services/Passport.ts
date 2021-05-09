import passport from 'passport';
import { Strategy } from 'passport-local';

import UserModel from '../models/user.models';

import * as vaultService  from './vault';

declare global {
   namespace Express {
      interface User extends UserModel {}
   }
}

export default async function PassportModelsGenerate() {
   passport.use(
      'app',
      new Strategy(
         // Name of Parameter Fields
         {
            usernameField: 'username',
            passwordField: 'pass',
            passReqToCallback: true
         },
         async (req, username, password, done) => {
            try {
               const vault = vaultService.Vault;
               const users = await vaultService.getUsers(vault);

               // As No Such User Found
               // Login Failed
               if (!users.includes(username)) return done(null, false);

               const status = await vaultService.login(vault, password, username);

               if (!Boolean(status)) return done(null, false);
               const user = new UserModel();
               user.clientToken = status.auth.client_token;
               await user.getBio(username, req.body.schema);
               return done(null, user);
            } catch (error) {
               console.error(error);
               return done(error, null);
            }
         }
      )
   );

   passport.serializeUser((user: unknown, done) => {
      done(null, user);
   });

   passport.deserializeUser((user: Express.User, done) => done(null, user));
}
