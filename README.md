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

# To build 

Make virtual env
```
python3 -m venv rasa
```

Make a folder dir
```
vault
  - file
  - unseal 
Copy scripts/docker-entrypoint.sh here
```

Using eveything in Docker 
```
./scripts/build_docker.bat
```

or 


Running rasa and node in local 
```
./scripts/build_local.bat
```

# To run

To just run local servers if local and start docker
```
./scripts/local.bat
```

or 


To just run local servers if local 
```
./scripts/runserver.bat
```












