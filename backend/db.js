import { MongoClient } from 'mongodb';

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/todos';
const MONGO_DB = process.env.MONGO_DB || 'todos';

let db = null;
let collection = null;
export default class DB {
    connect() {
        return MongoClient.connect(MONGO_URI)
            .then(function (client) {
                db = client.db(MONGO_DB);
                collection = db.collection('todos');
            })
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
        collection.updateOne({ '_id': id }, { $set: order});
    }

    delete(id) {
        collection.deleteOne({ '_id': id });
    }

    insert(order) {
        collection.insertOne(order);
    }
}
