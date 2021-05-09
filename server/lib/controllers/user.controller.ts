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

export const getDoctorList = async (req: Request, res: Response) => {
   try {
      const doctors = (await bigchainService.getAsset('Doctor')).map(({ data }) => data);
      return res.render('patient/doclist.ejs', { doctors: doctors, name: req.user?.user.name });
   } catch (err) {
      console.error(err);
      return res.sendStatus(404);
   }
};

export const getMedicalHistory = async (req: Request, res: Response) => {
   try {
      if (req.user) {
         const records = await UserModel.getRecords(req.user.user.username!);
         return res.render('patient/history.ejs', { records: records, name: req.user.user.name });
      }
   } catch (err) {
      console.error(err);
      return res.sendStatus(404);
   }
};

export const postAccess = async (req: Request, res: Response) => {
   const doctor: string = req.body.value as string;
   try {
      const records = await UserModel.getRecords(req.user?.user.username!);
      const data = await showAccess(doctor, records);
      return res.json({ records: data });
   } catch (err) {
      console.error(err);
      return res.sendStatus(404);
   }
};

export const postRevoke = async (req: Request, res: Response) => {
   const doctor: string = req.body.value as string;
   try {
      const records = await UserModel.getRecords(req.user?.user.username!);
      const data = await showRevoke(doctor, records);
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
         req.user?.secrets.bigchainPublicKey!,
         req.user?.secrets.bigchainPrivateKey!,
         doctor,
         req.user?.secrets.secretKey!
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
      await revokeAccess(data, req.user?.secrets.bigchainPublicKey!, req.user?.secrets.bigchainPrivateKey!, doctor);
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
      const data = await getPrescription(req.user?.user.username!, demail, req.user?.secrets.secretKey!);
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
      return res.render('patient/asset.ejs', { records: data, name: req.user?.user.name });
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
         req.user?.user.username!,
         fileBuffer,
         req.user?.secrets.bigchainPublicKey!,
         req.user?.secrets.bigchainPrivateKey!,
         req.user?.secrets.secretKey!,
         req.user?.user.email!
      );
      return res.redirect('/user/medicalhistory');
   } catch (err) {
      console.error(err);
      return res.sendStatus(404);
   }
};
