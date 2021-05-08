import { Connection, Transaction } from 'bigchaindb-driver';
import bdb from 'easy-bigchain';

import { BIGCHAIN_URL } from '../config';

const conn = new Connection(BIGCHAIN_URL);

export const createBigchainKeys = (email: string) => {
   return bdb.generateKeypair(email);
};

export const createAsset = async (asset: any, metadata: any, publicKey: string, privateKey: string) => {
   const txCreateAliceSimple = Transaction.makeCreateTransaction(
      asset,
      metadata,
      [Transaction.makeOutput(Transaction.makeEd25519Condition(publicKey))],
      publicKey
   );

   const txCreateAliceSimpleSigned = Transaction.signTransaction(txCreateAliceSimple, privateKey);
   const tx = await conn.postTransactionCommit(txCreateAliceSimpleSigned);
   return tx;
};

export const transferAsset = async (transaction: any, metadata: any, publicKey: string, privateKey: string) => {
   let txTransferBob = Transaction.makeTransferTransaction(
      [{ tx: transaction, output_index: 0 }],
      [Transaction.makeOutput(Transaction.makeEd25519Condition(publicKey))],
      metadata
   );
   const txTransferBobSigned = Transaction.signTransaction(txTransferBob, privateKey);
   const transfer = await conn.postTransactionCommit(txTransferBobSigned);
   return transfer;
};

export const getAsset = async (query: string) => {
   return await conn.searchAssets(query);
};

export const getMetadata = async (query: string) => {
   return await conn.searchMetadata(query);
};

export const getTransaction = async (id: string) => {
   return await conn.getTransaction(id);
};

export const listTransactions = async (id: string) => {
   return await conn.listTransactions(id);
};
