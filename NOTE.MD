# Typescript
Inizializzare typescript
1.  npm install typescript --save-dev
2.  aggiungere: 
    "scripts": {
      ...
      "tsc": "tsc"
    }
3.  npm run tsc -- --init 

così verrà creato il file tsconfig.json

# devDependencies
npm i ts-node-dev @types/express @types/config @types/nodemailer @types/lodash @types/jsonwebtoken pino-pretty nodemon zod --save-dev

# Express
npm i express@5.0.0-alpha.8

# dependencies
npm i mongoose @typegoose/typegoose config argon2 pino dayjs nanoid nodemailer lodash jsonwebtoken dotenv