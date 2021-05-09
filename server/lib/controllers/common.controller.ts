import { Request, Response } from 'express';
import { ipfsService, rasaService, cryptoService, vaultService } from '../services';
import UserModel, { UserInterface } from '../models/user.models';
import { createIPFSHashFromFileBuffer } from '../utils/ehr';

const doctorExclude = ['pass', 're_pass', 'signup'];
const patientExclude = [...doctorExclude, 'location', 'institute', 'specialization'];

export const signUp = async (req: Request, res: Response) => {
   const vault = vaultService.Vault;
   const users = await vaultService.getUsers(vault);

   if (users.includes(req.body.username) || !req.body.username) {
      return res.render("signup.ejs", {body:req.body, error: "User already exists"});
   }
   try {
      const password = req.body.pass;
      const asset: UserInterface = req.body as UserInterface;
      if (req.body.institute === '') {
         patientExclude.forEach(key => {
            delete asset[key];
         });
      } else {
         doctorExclude.forEach(key => {
            delete asset[key];
         });
      }
      const user = await UserModel.createUser(asset, password);
      if (user.user) return res.redirect('/login');
   } catch (error) {
      console.error(error);
   }
   return res.sendStatus(404);
};

export const view = async (req: Request, res: Response) => {
   try {
      const status = String(req.body.status);
      let fileURL = String(req.body.fileURL);
      let decryptedBuffer;
      if (status === 'encrypted') {
         fileURL = cryptoService.decrypt(fileURL, req.user?.secrets?.secretKey);
      }
      const buffer = await ipfsService.GetFile(fileURL);
      if (req.body.hasOwnProperty('key')) {
         decryptedBuffer = cryptoService.decryptFile(buffer, req.body.key);
      } else {
         decryptedBuffer = cryptoService.decryptFile(buffer, req.user?.secrets.secretKey!);
      }
      await ipfsService.Download(res, decryptedBuffer);
      return fileURL;
   } catch (err) {
      console.error(err);
      return res.sendStatus(404);
   }
};

export const rasa = async (req: Request, res: Response) => {
   try {
      const sender = String(req.user?.user?.username) || 'vortex';
      let message: any;
      let rasa: any;
      if (req.file) {
         message = await createIPFSHashFromFileBuffer(req.file.buffer, req.user?.secrets.secretKey!);
         rasa = await rasaService.RASARequest(message, sender, req.user?.clientToken);
      } else {
         message = req.body.message;
         rasa = await rasaService.RASARequest(message, sender);
      }
      return res.status(200).json(rasa);
   } catch (err) {
      console.error('Error: ', err);
      return res.status(500);
   }
};

export const rasaHistory = async (req: Request, res: Response) => {
   const username = req.body.rasa;
   try {
      let data = await rasaService.getRasaHistory(username);
      if (data.length != 0) {
         return res.render('doctor/history.ejs', {
            doc: data,
            name: req.user?.user?.name
         });
      } else {
         return res.render('doctor/history.ejs', {
            doc: [],
            name: req.user?.user?.name
         });
      }
   } catch (err) {
      console.error('Error: ', err);
      return res.status(500);
   }
};

export const rasaCharts = async (req: Request, res: Response) => {
   const username = req.body.rasa;
   try {
      const data = await rasaService.getRASACharts(username);
      return res.json({ data: data });
   } catch (err) {
      console.error('Error: ', err);
      return res.status(500);
   }
};
