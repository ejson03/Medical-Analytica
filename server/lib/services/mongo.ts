import { MongoClient } from 'mongodb';
import { MONGO_URL } from '../config';

export let client: MongoClient | null = null;

export async function Connect() {
    client = await MongoClient.connect(MONGO_URL, { useUnifiedTopology: true, useNewUrlParser: true });
}

