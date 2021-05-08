import { Endpoints, EndpointsResponse } from 'bigchaindb-driver/types/connection';
import { MetadataInterface } from '../models/user.models';
import { cryptoService, ipfsService, bigchainService } from '../services';
import { decryptRSA } from '../services/crypto';

export const getRSAKey = async (email: string, schema: string) => {
   let asset = await bigchainService.getAsset(email);
   asset.filter((data: any) => {
      return data['data']['schema'] == schema;
   });
   return asset[0]['data']['RSAKey'];
};

export const getBigchainPublicKey = async (email: string, schema: string) => {
   const asset = (await bigchainService.getAsset(email)).filter(({ data }) => data['schema'] == schema);
   return asset[0]['data']['bigchainKey'];
};

export const createAccess = async (
   dlist: any,
   publicKey: any,
   privateKey: any,
   doctorEmail: string,
   secretKey: string
) => {
   for (const description of dlist) {
      const transaction = await bigchainService.listTransactions(description);
      const RSAKey = await getRSAKey(doctorEmail, 'doctor');
      const encryptedKey = cryptoService.encryptRSA(secretKey, RSAKey);
      const data = {
         email: doctorEmail,
         key: encryptedKey
      };
      let metadata = (transaction[transaction.length - 1].metadata as unknown) as MetadataInterface;
      metadata.datetime = new Date();
      metadata.doclist?.push(data);

      let tx = await bigchainService.transferAsset(
         transaction[transaction.length - 1],
         metadata,
         publicKey,
         privateKey
      );
      console.log(tx.id);
   }
};

export const revokeAccess = async (dlist: any, publicKey: string, privateKey: string, doctorEmail: string) => {
   for (const description of dlist) {
      const transaction = await bigchainService.listTransactions(description);
      const metadata = (transaction[transaction.length - 1].metadata as unknown) as MetadataInterface;
      const doclist = metadata.doclist?.filter(({ email }) => email != doctorEmail);
      metadata.doclist = doclist;
      console.log('metadata is ', metadata);
      let tx = await bigchainService.transferAsset(
         transaction[transaction.length - 1],
         metadata,
         publicKey,
         privateKey
      );
      console.log(tx.id);
   }
};
////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const showAccess = async (demail: string, records?: EndpointsResponse[Endpoints.assets]) => {
   if (records == null) return [];
   const data: EndpointsResponse[Endpoints.assets] = [];

   for (const asset of records) {
      const transaction = await bigchainService.listTransactions(asset.id);
      const doclist = ((transaction[transaction.length - 1].metadata as unknown) as MetadataInterface).doclist;
      if (doclist == null) continue;
      const result = doclist.filter((st: any) => st.email.includes(demail));
      if (result.length == 0) {
         data.push(asset);
      }
   }
   return data;
};
////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const showRevoke = async (demail: string, records?: EndpointsResponse[Endpoints.assets]) => {
   if (records == null) return [];

   const data: EndpointsResponse[Endpoints.assets] = [];
   for (const asset of records) {
      const transaction = await bigchainService.listTransactions(asset.id);
      const doclist = ((transaction[transaction.length - 1].metadata as unknown) as MetadataInterface).doclist;
      if (doclist == null) continue;
      const result = doclist.filter((st: any) => st.email.includes(demail));
      if (result.length != 0) {
         data.push(asset);
      }
   }
   return data;
};

export const createIPFSHashFromFileBuffer = async (fileBuffer: any, secretKey: any) => {
   const cipher = cryptoService.encrypt(fileBuffer, secretKey);
   const cipherBuffer = Buffer.from(cipher, 'hex');
   return await ipfsService.AddFile(cipherBuffer);
};

export const createEncryptedIPFSHashFromFileBuffer = async (fileBuffer: any, secretKey: any) => {
   const ipfsHash = await createIPFSHashFromFileBuffer(fileBuffer, secretKey);
   return cryptoService.encrypt(ipfsHash, secretKey);
};

export const createIPFSHashFromCipher = async (cipher: any) => {
   const cipherBuffer = Buffer.from(cipher, 'hex');
   return await ipfsService.AddFile(cipherBuffer);
};
////////////////////////////////////////////////////////////////////////////////////////////////////////////
export const createRecord = async (
   data: any,
   username: string,
   fileBuffer: any,
   publicKey: string,
   privateKey: string,
   secretKey: string,
   email: string
) => {
   const id = cryptoService.generateCode();
   const date = new Date().toString();
   if (email === 'rasa') {
      const ipfsURL = await createIPFSHashFromCipher(fileBuffer as string);
      const ipfsURLEncrypted = cryptoService.encrypt(ipfsURL, secretKey);
      Object.assign(data, {
         file: ipfsURLEncrypted,
         fileHash: cryptoService.hash(ipfsURLEncrypted),
         id: id,
         date: date
      });
   } else {
      const cipher = cryptoService.encrypt(fileBuffer, secretKey);
      const ipfsURL = await createIPFSHashFromCipher(cipher);
      const ipfsURLEncrypted = cryptoService.encrypt(ipfsURL, secretKey);

      Object.assign(data, {
         username: username,
         email: email,
         file: ipfsURLEncrypted,
         fileHash: cryptoService.hash(cipher),
         id: id,
         date: date
      });
   }

   const metadata = {
      email: email,
      datetime: new Date().toString(),
      doclist: [],
      id: id
   };

   const tx = await bigchainService.createAsset(data, metadata, publicKey, privateKey);
   return tx;
};

export const getAssetHistory = async (assetid: any) => {
   const transactions = await bigchainService.listTransactions(assetid);
   return transactions.map(transaction => {
      const filterTransaction = {
         operation: transaction.operation,
         date: transaction.metadata.datetime,
         doctor: [] as string[]
      };
      if (transaction.operation == 'TRANSFER') {
         const doclist = ((transaction.metadata as unknown) as MetadataInterface).doclist;
         if (doclist != null && doclist.length > 0) {
            for (const doc of doclist) {
               filterTransaction.doctor.push(doc.email);
            }
         }
      }
      return filterTransaction;
   });
};

export const getPrescription = async (_username: string, demail: string, secretKey: string) => {
   console.log(_username, demail, secretKey);
   const data: any = [];
   const assets = await bigchainService.getAsset(demail);
   for (const asset of assets) {
      if (asset.data.schema === 'record' && asset.data.hasOwnProperty('prescription')) {
         data.push({
            prescription: asset.data.prescription,
            description: asset.data.description
         });
      }
   }
   return data;
};
///////////////////////////////////////////////////////////////////////////////////////////////////
export const getDoctorFiles = async (email: string, privateRSAKey: any) => {
   const metadata = await bigchainService.getMetadata(email);
   const data: any = {};
   const assetSet = new Set<string>();

   for (const meta of metadata) {
      const tx = await bigchainService.listTransactions(meta.id);
      assetSet.add((tx[tx.length - 1].asset as { id: string }).id);
   }
   let assetList = [...assetSet];
   assetList = assetList.filter(function (element: any) {
      return element !== undefined;
   });
   for (const asset of assetList) {
      const tx = await bigchainService.listTransactions(asset);

      const docs = ((tx[tx.length - 1].metadata as unknown) as MetadataInterface).doclist;
      if (docs == null) continue;

      let result = docs.filter((st: any) => st.email.includes(email));
      if (result.length != 0) {
         const decryptionKey = decryptRSA(result[0].key, privateRSAKey);
         console.log('decryption is ', decryptionKey);
         let ass = await bigchainService.getAsset(asset);
         if (!data[ass[0].data.username]) {
            data[ass[0].data.username] = {
               username: ass[0].data.username,
               email: ass[0].data.email,
               files: []
            };
         }
         try {
            data[ass[0].data.username].files.push({
               file: cryptoService.decrypt(ass[0].data.file, decryptionKey),
               description: ass[0].data.description,
               id: asset,
               pkey: tx[tx.length - 1].outputs[0].public_keys[0],
               secret: decryptionKey
            });
         } catch {
            console.log(ass[0].data.file, decryptionKey);
            continue;
         }
      }
   }
   return data;
};
