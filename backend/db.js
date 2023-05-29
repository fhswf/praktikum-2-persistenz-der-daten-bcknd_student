import { MongoClient } from 'mongodb';
import { ObjectId } from 'mongodb'

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/todos';
const MONGO_DB = process.env.MONGO_DB || 'todos';

let db = null;
let collection = null;
let client = null;

/** Connect to MongoDB and open client */
export default class DB {
    connect() {
        return MongoClient.connect(MONGO_URI)
            .then(function (client) {
                client = _client;
                db = client.db(MONGO_DB);
                collection = db.collection('todos');           
            })
    }

    /** Close client connection to MongoDB */
    close() {
        return client.close()
    }

    
    queryAll() {
        return collection.find().toArray();
    }

    queryById(id) {
        const objectId = new ObjectId(id);
        return collection.findOne({ '_id': objectId });  
    }

    update(id, order) {
        const objectId = new ObjectId(id);
        collection.updateOne({ '_id': objectId }, { $set: order});
    }

    delete(id) {
        const objectId = new ObjectId(id);
        collection.deleteOne({ '_id': objectId });
    }

    insert(order) {
        
        const insertedId = collection.insertOne(order)
        console.log('Inserted: ')
        console.log(insertedId)
        return insertedId

        // let { ops: inserted } = await collection.insertOne({ data: order });
        // console.log('Inserted: ')
        // console.log(inserted)
        // return inserted

        // const objectId = new ObjectId(insertedId);
        // return collection.findOne({ '_id': insertedId }); 
        // return insertedId
        
        //const options = { upsert: true, returnDocument: 'after' };
        //let { ops: inserted } = collection.insertOne(order) 
        
        
    }
}




// insert(order) {
//     const options = { upsert: true, returnDocument: 'after' };
//     collection.insertOne(order,
//         { $setOnInsert: toInsert },
//         options) 

// }


// insert(order) {
//     const options = { upsert: true, returnDocument: 'after' };
//     collection.insertOne(order, function (error, response) {
//         if (error) {
//           console.log('Error occurred while inserting');
//           //return
//         } else {
//           console.log('inserted record', response.ops[0]);
//           //return response.ops[0]
//         }
//         });
