import express, { Express, Request, Response } from 'express';
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid'

import DataBase from './database.js'

dotenv.config();



const app: Express = express();
const port = process.env.PORT;
const secretKey = process.env.jwtSecretKey as string
const databaseUrl = process.env.databaseUrl as string 

const db = new DataBase(databaseUrl,'promo_generator')


app.use(express.json())
app.use(express.urlencoded({extended: true}));



app.listen(port, () => {
  console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
  db.start();
});