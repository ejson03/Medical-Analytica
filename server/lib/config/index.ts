// const dotenv = require('dotenv');

// dotenv.config();

export const PORT: number = Number(process.env.PORT || 5000);
export const SECRET: string = String('secret_default' || process.env.SECRET);
export const JWT_SECRET: string = String(process.env.JWT_SECRET);
export const VAULT: any = {
   url: String('http://localhost:8200' || process.env.VAULT_URL),
   token: String('myroot' || process.env.VAULT_TOKEN)
};
export const MONGO_URL: string = String(process.env.MONGO_URL || 'mongodb://localhost:27017/');
export const RASA_URL: string = String(process.env.RASA_URL || 'http://localhost:5005');
export const BIGCHAIN_URL: string = String(process.env.BIGCHAIN_URL || 'http://localhost:9984/api/v1/');
export const IPFS: any = {
   url: String(process.env.IPFS_URL || 'ipfs.infura.io'),
   port: String('5001')
};
