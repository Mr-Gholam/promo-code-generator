import {MongoClient,Collection} from "mongodb"

function generateCode(length:number):string {
    let result = '';
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const charactersLength = characters.length;
    let counter = 0;
    while (counter < length) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
      counter += 1;
    }
    return result;
}



export default class DataBase {
    url:string
    databaseName: string
    private Email: Collection |undefined
    private Referral:Collection|undefined
    private Promo:Collection|undefined




    constructor(Url :string, name:string){
        this.url = Url
        this.databaseName = name
    }

    public start(){
        const client = new MongoClient(this.url)
        const database = client.db(this.databaseName)
        this.Email = database.collection('email')
        this.Referral = database.collection('Referral')
        this.Promo = database.collection('promo')
        console.log("⚡️[database]:connected to database successfully")
    }
    public async saveEmail(email:string){
        const user =  await this.Email?.findOne({email})
        if(user) return console.log("this email has been saved on database")
        await this.Email?.insertOne({email})
    }
    public async getEmail(email:string) :Promise<boolean>{
      const arthur =  await this.Email?.countDocuments({email})
      if(arthur ==0) return false
      return true
    }

    public async createLink(userId:string ,arthur: string ,link :string) :Promise<boolean>{
        const user = await this.Referral?.findOne({userId})
        if(user) return false
        await this.Referral?.insertOne({userId,arthur,link})
        return true
    }
    public async getLink(userId:string):Promise<string>{
        const user = await this.Referral?.findOne({userId})
        if(!user) return "user not found"
        return user.link
    }

    public async createPromo(userId:string,codeLength:number):Promise<string>{
        let code = generateCode(codeLength)
        let duplicateCode = await this.Promo?.findOne({code})
        while(duplicateCode){
            code = generateCode(codeLength)
            duplicateCode = await this.Promo?.findOne({code})
        }
        await this.Promo?.insertOne({userId,code,used:false})
        return code
    }

}