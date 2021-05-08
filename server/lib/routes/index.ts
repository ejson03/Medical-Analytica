declare module 'express-session' {
   export interface SessionData {
      user: UserModel;
      client_token: string;
   }
}
import { Router } from 'express';
import doctorRouter from './doctor.routes';
import userRouter from './user.routes';
import commonRouter from './common.routes';
import chatbotRouter from './chatbot.routes';
import UserModel from '../models/user.models';
import { IsDoctor, IsPatient } from '../utils/AuthCheck';

const router: Router = Router();

router.get('/status', (_req, res) => {
   res.json({ status: 'OK' });
});

router.use('/', commonRouter);
router.use('/user', IsPatient, userRouter);
router.use('/doctor', IsDoctor, doctorRouter);
router.use('/chatbot', chatbotRouter);

export default router;
