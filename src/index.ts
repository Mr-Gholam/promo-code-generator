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

app.post('/create-token', async(req: Request, res: Response) => {
    await db.saveEmail(req.body.email)
    const token = jwt.sign({ email:req.body.email }, secretKey);
    res.status(200).json(token)
});

app.post('/create-link',async(req:Request,res:Response)=>{
    if(!req.headers.authorization) return res.status(401)
    const user:any = jwt.verify(req.headers.authorization?.split(' ')[1],secretKey) as string
    const uniqueEmail = await db.getEmail(user.email)
    if(!uniqueEmail) return res.status(401)
    const link = uuidv4()
    const successLink = await db.createLink(req.body.userId,user.email,link)
    if(!successLink) return res.status(400).json({error:'this user already has a unique referral link'})
    res.status(200).json({link})
})

app.post('/get-link', async(req:Request,res:Response)=>{
    if(!req.headers.authorization) return res.status(401)
    const user:any = jwt.verify(req.headers.authorization?.split(' ')[1],secretKey) as string
    const uniqueEmail = await db.getEmail(user?.email)
    if(!uniqueEmail) return res.status(401)
    const link = await db.getLink(req.body.userId)
    if(link =="user not found") return res.status(400).json({error:"user not found in the database"})
    res.status(200).json({link})
})

app.post('/create-promo',async(req:Request,res:Response)=>{
    if(!req.headers.authorization) return res.status(401)
    const user:any = jwt.verify(req.headers.authorization?.split(' ')[1],secretKey) as string
    const uniqueEmail = await db.getEmail(user?.email)
    if(!uniqueEmail) return res.status(401)
    const code = await db.createPromo(req.body.userId,5)
    res.status(200).json({promo:code})
})
// write number 4

app.listen(port, () => {
  console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
  db.start();
});