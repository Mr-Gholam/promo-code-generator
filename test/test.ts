import app from '../src/index'
import chai from 'chai'
import chaiHttp from 'chai-http'
import { describe,Done } from 'mocha'
import { expect } from 'chai'

chai.should()
chai.use(chaiHttp)

let validToken:string 
let invalidToken :string
let validPromo:string
let invalidPromo:string

describe("testing API", () => {
    it("create a unique token with /create-token",(done)=>{
        chai.request(app).post("/create-token").send({email:'test@gmail.com'}).end( (err, res) => {
            expect(err).to.be.null;
            expect(res).to.have.status(200);   
            expect(res.body).to.have.property('token')
            validToken = res.body.token as string
            invalidToken = validToken.slice(0,-1) 
            done()
        })
    })

    it("failed to Authorize  ",(done)=>{
        chai.request(app).post("/create-link").set('Authorization',`Bearer ${invalidToken})}`).send({userId:'joe'}).end( (err, res) => {
           expect(err).to.be.null;
           expect(res).to.have.status(401);   
           done()
       })
   })

    it("create a unique link with  /create-link",(done)=>{
         chai.request(app).post("/create-link").set('Authorization',`Bearer ${validToken}`).send({userId:'joe'}).end( (err, res) => {
            expect(err).to.be.null;
            expect(res).to.have.status(200);   
            expect(res.body).to.have.property('link')
            done()
        })
    })

    it("duplicate userId in /create-link",(done)=>{
        chai.request(app).post("/create-link").set('Authorization',`Bearer ${validToken}`).send({userId:'joe'}).end( (err, res) => {
            expect(err).to.be.null;
            expect(res).to.have.status(400);   
            expect(res.body).to.have.property('error')
            done()
        })
    })

    it("get user's link from /get-link",(done)=>{
        chai.request(app).post("/get-link").set('Authorization',`Bearer ${validToken}`).send({userId:'joe'}).end( (err, res) => {
            expect(err).to.be.null;
            expect(res).to.have.status(200);   
            expect(res.body).to.have.property('link')
            done()
        })
    })

    it("user not found  /get-link",(done)=>{
        chai.request(app).post("/get-link").set('Authorization',`Bearer ${validToken}`).send({userId:'bob'}).end( (err, res) => {
            expect(err).to.be.null;
            expect(res).to.have.status(400); 
            done()
        })
    })

    it("create a promo code /create-promo",(done)=>{
        chai.request(app).post("/create-promo").set('Authorization',`Bearer ${validToken}`).send({userId:'joe'}).end( (err, res) => {
            expect(err).to.be.null;
            expect(res).to.have.status(200);   
            expect(res.body).to.have.property('promo')
            validPromo= res.body.promo as string
            invalidPromo = validPromo.slice(0,-1)
            done()
        })
    })

    it("use a promo code /check-promo",(done)=>{
        chai.request(app).post("/check-promo").set('Authorization',`Bearer ${validToken}`).send({promo:validPromo}).end( (err, res) => {
            expect(err).to.be.null;
            expect(res).to.have.status(200);   
            expect(res.body).to.have.property('success')
            done()
        })
    })

    it("trying to use a already used promo code /check-promo",(done)=>{
        chai.request(app).post("/check-promo").set('Authorization',`Bearer ${validToken}`).send({promo:validPromo}).end( (err, res) => {
            expect(err).to.be.null;
            expect(res).to.have.status(400);   
            expect(res.body).to.have.property('error')
            done()
        })
    })

    it("trying to use a invalid promo code  /check-promo",(done)=>{
        chai.request(app).post("/check-promo").set('Authorization',`Bearer ${validToken}`).send({promo:invalidPromo}).end( (err, res) => {
            expect(err).to.be.null;
            expect(res).to.have.status(400);   
            expect(res.body).to.have.property('error')
            done()
        })
    })
    
})