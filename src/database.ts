import {MongoClient,Collection} from "mongodb"


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
    public async getEmail(email:string) :Promise<number>{
      const user =  await this.Email?.countDocuments({email})
      return user as number
    }

}