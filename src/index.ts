import express, { Express, Request, Response } from 'express';
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid'

import DataBase from './database'

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
    res.status(200).json({token})
});

app.post('/create-link',async(req:Request,res:Response)=>{
    // checking authorization
    if(!req.headers.authorization) return res.status(401)
    const user:any = jwt.verify(req.headers.authorization?.split(' ')[1],secretKey) as string
    const uniqueEmail = await db.getEmail(user.email)
    if(!uniqueEmail) return res.status(401)
    // create a random string 
    const link = uuidv4()
    // saving a the link in the database for given user
    const successLink = await db.createLink(req.body.userId,user.email,link)
    if(!successLink) return res.status(400).json({error:'this user already has a unique referral link'})
    // send back the like to the service
    res.status(200).json({link})
})

app.post('/get-link', async(req:Request,res:Response)=>{
    // checking authorization
    if(!req.headers.authorization) return res.status(401)
    const user:any = jwt.verify(req.headers.authorization?.split(' ')[1],secretKey) as string
    const uniqueEmail = await db.getEmail(user?.email)
    if(!uniqueEmail) return res.status(401)
    // getting users link from database
    const link = await db.getLink(req.body.userId)
    if(link =="user not found") return res.status(400).json({error:"user not found in the database"})
    // send back the link to the service
    res.status(200).json({link})
})

app.post('/create-promo',async(req:Request,res:Response)=>{
    // checking authorization
    if(!req.headers.authorization) return res.status(401)
    const user:any = jwt.verify(req.headers.authorization?.split(' ')[1],secretKey) as string
    const uniqueEmail = await db.getEmail(user?.email)
    if(!uniqueEmail) return res.status(401)
    // generate and save the promo code in database
    // second argument in create promo function is the length of the promo code 
    const code = await db.createPromo(req.body.userId,5)
    // send back the promo code to the service
    res.status(200).json({promo:code})
})
app.post('/check-promo',async(req:Request,res:Response)=>{
    // checking authorization
    if(!req.headers.authorization) return res.status(401)
    const user:any = jwt.verify(req.headers.authorization?.split(' ')[1],secretKey) as string
    const uniqueEmail = await db.getEmail(user?.email)
    if(!uniqueEmail) return res.status(401)
    // checking promo code 
    // if promo code isn't used  it will mark as used by this user
    const codeStatus= await db.checkPromo(user.email,req.body.promo)
    if(codeStatus == 0) return res.status(400).json({error:'invalid promo code'})
    if(codeStatus == 1 ) return res.status(400).json({error:"this promo code is already used"})
    if(codeStatus ==2) return res.status(200).json({success:`promo code is used by ${user.email}`})
})

app.listen(port, () => {
  console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
  db.start();
});

export default app