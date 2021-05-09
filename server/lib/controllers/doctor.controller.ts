import { getDoctorFiles } from '../utils/ehr';
import { bigchainService, cryptoService } from '../services';
import { Request, Response } from 'express';

export const getFiles = async (req: Request, res: Response) => {
   try {
      let data = await getDoctorFiles(req.user?.user.username!, req.user?.secrets.RSAPrivateKey);
      return res.render('doctor/assets.ejs', {
         records: data,
         name: req.user?.user.name
      });
   } catch (err) {
      console.error(err);
      return res.sendStatus(404);
   }
};

export const getDetails = async (req: Request, res: Response) => {
   try {
      return res.render('doctor/profile.ejs', { record: req.user?.user, name: req.user?.user.name });
   } catch (err) {
      console.error(err);
      return res.sendStatus(404);
   }
};

export const getPrescription = async (req: Request, res: Response) => {
   const files = req.body.value;
   res.render('doctor/prescribe.ejs', {
      records: JSON.parse(files),
      name: req.user?.user.name
   });
};

export const postPrescription = async (req: Request, res: Response) => {
   const { id, description, pkey, prescription } = req.body;
   const code = cryptoService.generateCode();
   let data = {
      username: req.user?.user.username!,
      assetID: id,
      description: description,
      prescription: prescription,
      id: code,
      schema: 'record'
   };
   let metadata = {
      email: req.user?.user.email!,
      datetime: new Date().toString(),
      id: code
   };
   try {
      await bigchainService.createAsset(data, metadata, pkey, req.user?.secrets.bigchainPrivateKey!);
      return res.redirect('/doctor/home');
   } catch (err) {
      console.error(err);
      return res.sendStatus(404);
   }
};
