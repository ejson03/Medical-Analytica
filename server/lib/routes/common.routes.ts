import { Router } from 'express';
import type { Request, Response } from 'express';
import { commonController } from '../controllers';
import fileUpload from '../middleware/file-upload';
import { IsAuthenticated } from '../utils/AuthCheck';
import passport from 'passport';

const commonRouter: Router = Router();

commonRouter.get('/', function (_req: Request, res: Response) {
   return res.render('index.html');
});

commonRouter.get('/login', function (_req: Request, res: Response) {
   return res.render('login.ejs');
});
commonRouter.get('/signup', function (_req: Request, res: Response) {
   return res.render('signup.ejs', { body: {}, error: null });
});

commonRouter.get('/chatbot', IsAuthenticated, (_req, res) => {
   res.render('chatbot.ejs');
});

commonRouter.post('/signup', commonController.signUp);
commonRouter.post(
   '/login',
   passport.authenticate('app', { failureRedirect: '/login', successRedirect: '/home', failureFlash: 'Login failed' })
);

commonRouter.get('/home', IsAuthenticated, (req, res) => {
   if (req.user?.schema == 'Patient') {
      return res.redirect('/user/home');
   }
   if (req.user?.schema == 'Doctor') {
      return res.redirect('/doctor/home');
   }
   return res.redirect('/login');
});

commonRouter.post('/getrasahistory', IsAuthenticated, commonController.rasaHistory);

commonRouter.post('/view', IsAuthenticated, commonController.view);

commonRouter.post('/rasa', IsAuthenticated, fileUpload.single('file'), commonController.rasa);
commonRouter.post('/charts', IsAuthenticated, commonController.rasaCharts);

commonRouter.all('/logout', IsAuthenticated, (req: Request, res: Response) => {
   req.logout();
   return res.redirect('/');
});

export default commonRouter;
