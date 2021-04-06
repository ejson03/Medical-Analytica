# EHR
Access control of medical records using BigchainDB & IPFS


# Description

There is a rapid increase in generation of medical data especially in a situation of medical emergency or crisis. When hospitals are understaffed to maintain healthcare data, they are prone to be tampered with. Users do not recieve their medical information on time and cannot approach other institutions quickly with their medical history.

* Solution: Bring EHR to blockchain

BigchainDB is a decentralized database that has immutability just like traditional blockchains. We have attempted to develop an end to end system for succesful storage, transfer and tracking of patient healthcare data. All records are encrypted using AES-256 encryption and the access for this data is transferred through blockchain and assymetric cryptography. Due to limited blockchain data storage, files are being stored in IPFS.

A basic chatbot is also designed to avoid entering data manually into forms. Conversational history is tracked and stored on the blockchain too to maintain credibility of the chatbot performance.

# Contributing
For commiting
```
npm run git -- "commit message"
```

For deploying
```
npm run tag
```

# To Do
Add .env in Knowledge base folder with url of neo4j
Add big .env in node folder (redundant)
Make env.bat in root folder

```
set VAULT_TOKEN=
set VAULT_DEV_ROOT_TOKEN_ID=
set VAULT_URL=
set MONGO_URL=
set NEO4J_URL=
set BIGCHAIN_URL=
set PORT=
set SECRET=
set IPFS_URL=
set WEATHER_KEY=
set WEATHER_ID=
set APP_URL=
set ACTION_URL=
set RASA_URL=
```







