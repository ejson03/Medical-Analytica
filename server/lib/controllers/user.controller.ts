import {
   createRecord,
   getAssetHistory,
   showAccess,
   showRevoke,
   createAccess,
   revokeAccess,
   getPrescription
} from '../utils/ehr.js';
import { bigchainService } from '../services';
import type { Request, Response } from 'express';
import UserModel from '../models/user.models';
import { SessionSave } from '../utils';

export const getDoctorList = async (req: Request, res: Response) => {
   try {
      let result = await bigchainService.getAsset('Doctor');
      result = result.map((data: { [x: string]: unknown }) => data['data']);
      if (req.session) {
         const user = new UserModel(req.session.user);
         user.getRecords(req.session.user.user.username);
         req.session.user = user;
         await SessionSave(req);
      }

      return res.render('patient/doclist.ejs', { doctors: result, name: req.session?.user.user.name });
   } catch (err) {
      console.error(err);
      return res.sendStatus(404);
   }
};

export const getMedicalHistory = async (req: Request, res: Response) => {
   try {
      if (req.session) {
         const user = new UserModel(req.session.user);
         user.records = await user.getRecords(req.session.user.user.username);
         req.session.user = user;
         await SessionSave(req);
         const records = req.session.user.records;
         return res.render('patient/history.ejs', { records: records, name: req.session.user.user.name });
      }
   } catch (err) {
      console.error(err);
      return res.sendStatus(404);
   }
};

export const postAccess = async (req: Request, res: Response) => {
   const doctor: string = req.body.value as string;
   try {
      const data = await showAccess(doctor, req.session?.user.records);
      return res.json({ records: data });
   } catch (err) {
      console.error(err);
      return res.sendStatus(404);
   }
};

export const postRevoke = async (req: Request, res: Response) => {
   const doctor: string = req.body.value as string;
   try {
      const data = await showRevoke(doctor, req.session?.user.records);
      return res.json({ records: data });
   } catch (err) {
      console.error(err);
      return res.sendStatus(404);
   }
};

export const check = async (req: Request, res: Response) => {
   const doctor: string = req.body.value as string;
   delete req.body.value;
   const data: any[] = [];
   for (const key of Object.keys(req.body)) {
      if (req.body[key] != null) data.push(req.body[key]);
   }
   try {
      await createAccess(
         data,
         req.session?.user.secrets.bigchainPublicKey,
         req.session?.user.secrets.bigchainPrivateKey,
         doctor,
         req.session?.user.secrets.secretKey
      );
      return res.redirect('/user/home');
   } catch (err) {
      console.error('Chck error is ', err);
      return res.sendStatus(404);
   }
};

export const uncheck = async (req: Request, res: Response) => {
   const doctor: string = req.body.value as string;
   delete req.body.value;
   const data: any[] = [];
   for (const key of Object.keys(req.body)) {
      if (req.body[key] != null) data.push(req.body[key]);
   }
   try {
      await revokeAccess(
         data,
         req.session?.user.secrets.bigchainPublicKey,
         req.session?.user.secrets.bigchainPrivateKey,
         doctor
      );
      return res.redirect('/user/home');
   } catch (err) {
      console.error(err);
      return res.sendStatus(404);
   }
};

export const prescription = async (req: Request, res: Response) => {
   const demail = req.body.value;
   console.log(demail);
   try {
      const data = await getPrescription(req.session?.user.user.username, demail, req.session?.user.secrets.secretKey);
      console.log(data);
      return res.json({ records: data });
   } catch (err) {
      console.error(err);
      return res.sendStatus(404);
   }
};

export const assetHistory = async (req: Request, res: Response) => {
   let assetid = req.body.history;
   try {
      let data = await getAssetHistory(assetid);
      return res.render('patient/asset.ejs', { records: data, name: req.session?.user.user.name });
   } catch (err) {
      console.error(err);
      return res.sendStatus(404);
   }
};

export const addRecord = async (req: Request, res: Response) => {
   if (req.files.length < 1) {
      return res.status(404).json({ status: 'File not uploaded' });
   }
   let fields = req.body;
   let fileBuffer = req.files[0].buffer;

   let data = {
      height: fields.height,
      weight: fields.weight,
      symptoms: fields.symptoms,
      allergies: fields.allergies,
      smoking: fields.smoking,
      exercise: fields.exercise,
      description: fields.d,
      schema: 'record'
   };
   try {
      await createRecord(
         data,
         req.session?.user.user.username,
         fileBuffer,
         req.session?.user.secrets.bigchainPublicKey,
         req.session?.user.secrets.bigchainPrivateKey,
         req.session?.user.secrets.secretKey,
         req.session?.user.user.email
      );
      return res.redirect('/user/medicalhistory');
   } catch (err) {
      console.error(err);
      return res.sendStatus(404);
   }
};
