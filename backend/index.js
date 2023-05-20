import express from 'express';
import DB from './db.js'
//import bodyParser from "body-parser";
//Passport und JWT:
import passport from 'passport';
import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt';
//Swagger:
import swaggerUi from 'swagger-ui-express';
import swaggerJsdoc from 'swagger-jsdoc';
//Validation
const { check, validationResult } = require('express-validator');

const todoValidationRules = [
  check('title')
    .notEmpty()
    .withMessage('Titel darf nicht leer sein')
    .isLength({ min: 3 })
    .withMessage('Titel muss mindestens 3 Zeichen lang sein'),
];



//const bodyParser = require('body-parser');

const PORT = process.env.PORT || 3000;

/** Zentrales Objekt für unsere Express-Applikation */
const app = express();

// app.use(bodyParser.json()); 
// app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.json());


/** global instance of our database */
let db = new DB();


// Passport.js JWT-Strategie
const opts = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: `-----BEGIN PUBLIC KEY-----
MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAyn2vP592Ju/iKXQW1DCrSTXyQXyo11Qed1SdzFWC+mRtdgioKibzYMBt2MfAJa6YoyrVNgOtGvK659MjHALtotPQGmis1VVvBeMFdfh+zyFJi8NPqgBTXz6bQfnu85dbxVAg95J+1Ud0m4IUXME1ElOyp1pi88+w0C6ErVcFCyEDS3uAajBY6vBIuPrlokbl6RDcvR9zX85s+R/s7JeP1XV/e8gbnYgZwxcn/6+7moHPDl4LqvVDKnDq9n4W6561s8zzw8EoAwwYXUC3ZPe2/3DcUCh+zTF2nOy8HiN808CzqLq1VeD13q9DgkAmBWFNSaXb6vK6RIQ9+zr2cwdXiwIDAQAB
-----END PUBLIC KEY-----`,
    ignoreExpiration: true,
    issuer: "https://jupiter.fh-swf.de/keycloak/realms/webentwicklung"
};


passport.use(
    new JwtStrategy(opts, (payload, done) => {
        // Hier können Sie zusätzliche Validierungen oder Benutzerabfragen durchführen, falls erforderlich
        console.log("JWT payload: %o", payload)
        return done(null, payload);
    })
);
app.use(passport.initialize());


//Swagger:

const router = express.Router()
const swaggerOptions = {
    swaggerDefinition: {
      openapi: '3.0.0',
      info: {
        title: 'Todo API',
        version: '1.0.0',
        description: 'Todo API Dokumentation',
      },
      servers: [
        {
          url: 'http://localhost:3000',
        },
      ],
    },
    apis: ['./index.js'], 
    components: {
        schemas: {
          Todo: {
            type: 'object',
            properties: {
              title: {
                type: 'string',
              },
              due: {
                type: 'string',
              },
              status: {
                type: 'integer',
              },
            },
          },
        },
        securitySchemes: {
          bearerAuth: {
            type: 'http',
            scheme: 'bearer',
            bearerFormat: 'JWT',
          }
        },
      },
      security: [{
        bearerAuth: []
      }]
  };

  const swaggerDocs = swaggerJsdoc(swaggerOptions);

  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));



/** Initialize database connection */
async function initDB() {
    await db.connect();
    console.log("Connected to database");
}

// implement API routes

/** Return all todos. 
 *  Be aware that the db methods return promises, so we need to use either `await` or `then` here! 
 */

/**
* @swagger
* /todos:
*  get:
*    summary: Gibt alle Todos zurück
*    tags: [Todos]
*    responses:
*      '200':
*        description: Eine Liste aller Todos
*        content:
*          application/json:
*            schema:
*              type: array
*              items:
*                $ref: '#/components/schemas/Todo'
*/
router.get('/todos', async (req, res) => {
    let todos = await db.queryAll();
    console.log('Allgemeines GET')
    res.send(todos);
});

app.get('/todos', /*passport.authenticate('jwt',  { session: false }), */ async (req, res) => {
    let todos = await db.queryAll();
    console.log('Allgemeines GET')
    res.send(todos);
});

//
// YOUR CODE HERE
//
// Implement the following routes:

//GET /todos/:id

/**
* @swagger
* /todos/:id:
*  get:
*    summary: Gibt ein bestimmtes Todo ausgewählt nach id zurück
*    tags: [Todos]
*    responses:
*      '200':
*        description: Ein bestimmtes Todo
*        content:
*          application/json:
*            schema:
*              type: object
*              items:
*                $ref: '#/components/schemas/Todo'
*/
router.get('/todos/:id', async (req, res) => {
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

/**
* @swagger
* /todos:
*  post:
*    summary: Erstellt ein neues Todo
*    tags: [Todos]
*    responses:
*      '200':
*        description: Das zu erstellende Todo
*        content:
*          application/json:
*            schema:
*              type: object
*              items:
*                $ref: '#/components/schemas/Todo'
*/
router.post('/todos', todoValidationRules, async(req, res) => {
  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() });
  }else{
      const result = await db.insert(req.body)
      console.log('POST result')
      console.log(result)
      res.send(result)
    } 

});

app.post('/todos', todoValidationRules, async(req, res) => {
  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() });
  }else{
      const result = await db.insert(req.body)
      console.log('POST result')
      console.log(result)
      res.send(result)
    } 

});

/**
* @swagger
* /todos:
*  put:
*    summary: Ändert ein bestehendes Todo ausgewählt nach id
*    tags: [Todos]
*    responses:
*      '200':
*        description: Das veränderte Todo
*        content:
*          application/json:
*            schema:
*              type: object
*              items:
*                $ref: '#/components/schemas/Todo'
*/
router.put('/todos/:id', async(req, res) => {
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


/**
* @swagger
* /todos:
*  delete:
*    summary: Löscht ein bestehendes Todo ausgewählt nach id
*    tags: [Todos]
*    responses:
*      '200':
*        description: Das gelöschte Todo
*        content:
*          application/json:
*            schema:
*              type: object
*              items:
*                $ref: '#/components/schemas/Todo'
*/
router.delete('/todos/:id', async(req, res) => {
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
