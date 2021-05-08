import { Endpoints, EndpointsResponse } from 'bigchaindb-driver/types/connection';
import { cryptoService, bigchainService, vaultService } from '../services';

export interface UserInterface {
   email: string;
   name: string;
   username: string;
   schema: 'Patient' | 'Doctor';
   gender: string;
   institute?: string;
   specialization?: string;
   location?: string;
   RSAKey?: string;
   bigchainKey?: string;
   date?: string;
   bigchainPrivateKey?: string;
   bigchainPublicKey?: string;
}

interface SecretInterface {
   bigchainPrivateKey: string;
   bigchainPublicKey: string;
   RSAPrivateKey: string;
   RSAPublicKey: string;
   secretKey: string;
}

export interface RecordInterface {
   id: string;
   height: number;
   weight: number;
   bp?: number;
   age?: number;
   symptoms?: string;
   allergies?: string;
   smoking: 'yes' | 'no';
   exercise: 'yes' | 'no';
   description: string;
   schema: 'record';
   username: string;
   email?: string;
   file: string;
   fileHash: string;
   date: Date;
}

export interface PresecriptionInterface {
   username: string;
   assetID: string;
   description: string;
   prescription: string;
   id: number;
   schema: 'record';
}

export interface MetadataInterface {
   email: string;
   datetime: Date;
   id: number;
   doclist?: {
      email: string;
      key: string;
   }[];
}

export default class UserModel {
   public records: EndpointsResponse[Endpoints.assets] = [];
   public user = {} as UserInterface;
   public secrets = {} as SecretInterface;
   public clientToken: string = '';
   public schema?: 'Patient' | 'Doctor' = 'Doctor';

   constructor(user?: UserModel) {
      if (user) {
         this.secrets = user.secrets;
         this.user = user.user;
         this.records = user.records;
      }
   }

   async getBio(username: string, schema: string) {
      const records = await bigchainService.getAsset(username);
      const filteredRecords = records.filter(record => record.data.schema == schema);
      this.user = (filteredRecords[0].data as unknown) as UserInterface;
      this.schema = this.user.schema;
      await this.readKeys();
   }

   private async writeKeys(username: string) {
      const clientVault = await vaultService.vaultFromToken(this.clientToken);
      this.secrets!.secretKey = cryptoService.createSecretKey();
      const bigchainKeys = bigchainService.createBigchainKeys(cryptoService.encrypt(username, this.secrets.secretKey));
      this.secrets!.bigchainPrivateKey = bigchainKeys.privateKey;
      this.secrets!.bigchainPublicKey = bigchainKeys.publicKey;
      const { privateKey, publicKey } = cryptoService.generateRSAKeys();
      this.secrets!.RSAPrivateKey = privateKey;
      this.secrets!.RSAPublicKey = publicKey;
      for (const secret in this.secrets) {
         vaultService.write(clientVault, secret, this.secrets[secret]);
      }
   }

   private async readKeys() {
      const clientVault = await vaultService.vaultFromToken(this.clientToken);
      this.secrets.bigchainPrivateKey = await vaultService.read(clientVault, 'bigchainPrivateKey');
      this.secrets.bigchainPublicKey = await vaultService.read(clientVault, 'bigchainPublicKey');
      this.secrets.RSAPrivateKey = await vaultService.read(clientVault, 'RSAPrivateKey');
      this.secrets.RSAPublicKey = await vaultService.read(clientVault, 'RSAPublicKey');
      this.secrets.secretKey = await vaultService.read(clientVault, 'secretKey');
   }

   async createUser(asset: UserInterface, password: string) {
      const vault = vaultService.Vault;
      await vaultService.signUp(vault, password, asset.username);
      const status = await vaultService.login(vault, password, asset.username);
      if (status == null) {
         throw new Error('Unable to sign in');
      }
      const vaultClientToken = status.auth.client_token;
      this.clientToken = vaultClientToken;
      await this.writeKeys(asset.username);
      asset.bigchainKey = this.secrets.bigchainPublicKey.toString();
      asset.RSAKey = this.secrets.RSAPublicKey.toString();
      asset.date = new Date().toString();
      let tx = await bigchainService.createAsset(
         asset,
         null,
         this.secrets.bigchainPublicKey,
         this.secrets.bigchainPrivateKey
      );
      this.user = (tx.asset.data as unknown) as UserInterface;
      return tx.asset.data;
   }

   async getRecords(username: string) {
      try {
         const records = await bigchainService.getAsset(username);
         const filterRecords = records
            .filter(record => record.data.schema == 'record' && record.data.username == username)
            .sort((a, b) => new Date(a.data.date).getTime() - new Date(b.data.date).getTime());
         this.records = filterRecords;
         return filterRecords;
      } catch (err) {
         console.error(err);
         return [];
      }
   }
}
