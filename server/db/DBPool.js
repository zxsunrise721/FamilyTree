const MongoClient = require('mongodb').MongoClient;
require('dotenv').config();
const {MONGO_URI} = process.env;

const options = { useNewUrlParser: true, useUnifiedTopology: true, };

module.exports  = class DBPool{
    static DBNAME = 'FamilyTree';
    options = { useNewUrlParser: true, useUnifiedTopology: true, };
    transactionOptions = { readPreference: 'primary', readConcern: { level: 'majority' }, writeConcern: { w: 'majority' } };
    isConnected = false;
    isStartTransaction = false;
    constructor(){
        this.client = new MongoClient(MONGO_URI, options);
    }

    /**
     * function dbInstance: 
     * Get an instance of database
     * @returns : an instance of database
     *            has error, database is close
     */
    async dbInstance(){
        if(this.instance){ return this.instance; }
        try{
            this.instance = await this.client.connect();
            this.isConnected = true;
            console.log('MongoDB is connected!')
        }catch(e){console.error(`[MongoDB connection] ERROR: ${e}`); throw e; }
        process.on('exit', ()=>{
            this.instance.close();
        });
        return this.instance;
    }

    /**
     * function startTransaction: 
     * set this.session start transaction
     */
    startTransaction(){
        this.session = this.instance.startSession();
        this.session.startTransaction(this.transactionOptions);
        this.isStartTransaction = true;
        console.log('session started!')
    }

    /**
     * function close: 
     * database connection is closed
     */
    close(){
        // console.log('transaction:',this.isStartTransaction);
        if(this.isStartTransaction){ 
            this.session.endSession(); 
            this.isStartTransaction=false;
            console.log('session closed!');
        }
        this.isConnected = false;
        this.client.close();
        console.log('MongoDB is disconnected! Closed!')
    }
}
