const express = require("express");
const mysql = require("mysql2")
const cors = require('cors');

const router = express.Router()
const app = express();
app.use(express.urlencoded({ extended: false }))
const port = 3011;

const corsOptions = {
     //origin: 'http://localhost',
     origin: 'http://127.0.0.1:5500',
     credentials: true,
};
app.use(cors(corsOptions));


//Create connection database 
const db = mysql.createConnection({
     host: "127.0.0.1",
     user: "root",
     password: "markdb01",
     database: "ITD62_276",
});

// // Connect to db
db.connect((err) => {
     if (err) { err }
     console.log("MySql Connected");
});

router.get('/', (req, res) => {
     res.send({
          error: false,
          message: "Welcom to RESTful API with NodeJS.",
          writen_by: "thanakhan"
     })
})

router.get('/pharmacy', (req, res) => {
     db.query('SELECT * FROM pharmacy', (error, results, fields) => {
          if (error) throw error;
          let message = ""
          if (results === undefined || results.length == 0) {
               message = "pharmacy table is empty"
          } else {
               message = "Successfuly retrieved all pharmacy"
          }
          res.send({ error: false, data: results, massage: message })
     })
})

router.post('/pharmacy', (req, res) => {
     let PharmacyName = req.body.PharmacyName;
     let PharmacyType = req.body.PharmacyType;
     let Price = req.body.Price;
     if (!PharmacyName || !PharmacyType || !Price) {
          res.status(400).send({ error: true, message: "Please provide PharmacyName,PharmacyType,Price" })
     } else {
          let sql = "INSERT INTO pharmacy (PharmacyName,PharmacyType,Price) VALUES (?,?,?)"
          db.query(sql, [PharmacyName,PharmacyType,Price], (error, results, fields) => {
               if (error) throw error;
               res.send({ error: false, data: results, message: "Pharmacy successfully added." })
          })
     }
})

router.get('/pharmacy/:id', (req, res) => {
     let id = req.params.id;
     if (!id) {
          res.status(400).send({ error: true, message: "Please provide Pharmacy id." })
     } else {
          let sql = "SELECT * FROM pharmacy where idPharmacy = ?"
          db.query(sql, id, (error, results, fields) => {
               let message = ""
               if (results === undefined || results.length == 0) {
                    message = "Pharmacy not found"
                    res.send({ error: false, data: results, message: message })
               } else {
                    message = "Successfully retieved pharmacy data"
                    res.send({ error: false, data: results[0], message: message })
               }

          })
     }
})

router.put('/pharmacy', (req, res) => {
     let idPharmacy = req.body.idPharmacy;
     let PharmacyName = req.body.PharmacyName;
     let PharmacyType = req.body.PharmacyType;
     let Price = req.body.Price;
     
     if (!idPharmacy || !PharmacyName || !PharmacyType || !Price ) {
          res.status(400).send({ error: true, message: "Please provide idPharmacy,PharmacyName,PharmacyType,Price " })
     } else {
          let sql = "UPDATE pharmacy SET PharmacyName =?, PharmacyType =? ,Price =? WHERE idPharmacy =? "
          db.query(sql, [PharmacyName,PharmacyType,Price,idPharmacy], (error, results, fields) => {
               if (error) throw error;
               let message = ""
               if (results.changedRows === 0) {
                    message = " not found or data is same"
               } else {
                    message = "Successfully updated user data"
               }
               res.send({ error: false, data: results, message: message })
          })
     }

})

router.delete('/pharmacy', (req, res) => {
     let idPharmacy = req.body.idPharmacy;
     if (!idPharmacy) {
          res.status(400).send({ error: true, message: "Please provide pharmacy id" })
     } else {
          let sql = "DELETE FROM pharmacy WHERE idPharmacy =? "
          db.query(sql, [idPharmacy], (error, results, fields) => {
               if (error) throw error;
               let message = ""
               if (results.affectedRows === 0) {
                    message = "User not found."
               } else {
                    message = "Successfully deleted user data."
               }
               res.send({ error: false, data: results, message: message })
          })
     }
})

app.use(router)
app.listen(port, () => {
     console.log(`Server running at http://localhost:${port}/`);
})