import express from 'express';
import DB from './db.js'
import bodyParser from "body-parser";

//const bodyParser = require('body-parser');

const PORT = process.env.PORT || 3000;

/** Zentrales Objekt für unsere Express-Applikation */
const app = express();

// app.use(bodyParser.json()); 
// app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.json());

/** global instance of our database */
let db = new DB();

/** Initialize database connection */
async function initDB() {
    await db.connect();
    console.log("Connected to database");
}

// implement API routes

/** Return all todos. 
 *  Be aware that the db methods return promises, so we need to use either `await` or `then` here! 
 */
app.get('/todos', async (req, res) => {
    let todos = await db.queryAll();
    console.log('Allgemeines GET')
    res.send(todos);
});

//
// YOUR CODE HERE
//
// Implement the following routes:


//GET /todos/:id
app.get('/todos/:id', async(req, res) => {
    const id = req.params.id;
    console.log('Check der id: ' + id)
    try {
        const todo = await db.queryById(id)
        console.log(todo)
        res.json(todo)
    } catch (error) {
        console.log(error);
        }
});

// POST /todos
app.post('/todos', async(req, res) => {
    try {
        const result = await db.insert(req.body)
        console.log('POST result')
        console.log(result)
        res.send(result)
    } catch (error) {
        console.log(error);
        }

});


// PUT /todos/:id
app.put('/todos/:id', async(req, res) => {
    const id = req.params.id;
    console.log('Check der id: ' + id)
    try {
        const ret = await db.update(id, req.body)
        console.log('UPDATE by id')
        res.send(ret)
    } catch (error) {
        console.log(error);
        }
});

// DELETE /todos/:id
app.delete('/todos/:id', async(req, res) => {
    const id = req.params.id;
    console.log('Check der id: ' + id)
    try {
        let ret = await db.delete(id)
        console.log('DELETE by id')  
        res.send(ret)
        } catch (error) {
            console.log(error);
            }
});




initDB()
    .then(() => {
        app.listen(PORT, () => {
            console.log(`Server listening on port ${PORT}`);
        })
});
