const express = require('express')
const MongoClient = require('mongodb').MongoClient;
const fileUpload =require('express-fileupload');
const objectId = require('mongodb').ObjectID
const cors = require('cors');
const app = express()
require('dotenv').config();
const port = 5011


app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: false }));
app.use(express.static('services'))
app.use(fileUpload())
const uri =`mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.x4chh.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
console.log('uri',uri)
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
  const clothCollection = client.db("frozen").collection("clothCollection");
  
  const reviewCollection = client.db("frozen").collection("review");
  const cartCollection = client.db("frozen").collection("cart");
  const adminCollection = client.db("frozen").collection("admin");
app.post('/addCollection', (req,res)=>{
  const file = req.files.file
  const name = req.body.name
  const info = req.body.info
  const cost = req.body.cost
  const category = req.body.category
 console.log(file, info, name, cost,category)
 const newImg = file.data
 const encImg = newImg.toString('base64')
 
 var image = {
   contentType: file.mimetype,
   size: file.size,
   img: Buffer.from(encImg, 'base64')
 };
 clothCollection.insertOne({ name, info, image,cost,category })
             .then(result => {
                
                res.send(result.insertedCount > 0);
                
                 
             })
 
  })
 

  app.get('/collection', (req, res) => {
    clothCollection.find({})
        .toArray((err, documents) => {
            res.send(documents);
            console.log(documents)
        })
  });


  app.get('/cart/:id', (req, res) => {


    clothCollection.find({ _id: objectId(req.params.id) })

      .toArray((err, documents) => {
        res.send(documents[0])
      })
  })
  app.post('/addCart', (req, res) => {

    const order = req.body
  console.log(order)
    cartCollection.insertOne(order)
      .then(result => {

        console.log(result.insertedCount)
        res.send(result.insertedCount > 0)

      })


})

app.get('/cart',(req, res)=>{
console.log('email',req.query.email)
  cartCollection.find({email: req.query.email})
.toArray((err, documents)=>{

  res.send(documents);
})
})
app.get('/orderList',(req, res)=>{
  cartCollection.find({})
  .toArray((err, documents)=>{
  
    res.send(documents);
  })
  })
  app.delete('/delete/:id', (req, res) => {

    cartCollection.deleteOne({ _id: objectId(req.params.id) })
    
    
    .then(result =>{
      console.log(result)
    })

  })

  app.delete('/delete/:id', (req, res) => {

    clothCollection.deleteOne({ _id: objectId(req.params.id) })
    
    .then(result =>{
      console.log(result)
    })

  })





  app.post('/addReview', (req,res)=>{
    const file = req.files.file
    const name = req.body.name
    const cName = req.body.cName
    const description = req.body.description
   console.log(file, cName, name, description)
   const newImg = file.data
   const encImg = newImg.toString('base64')
   
   var image = {
     contentType: file.mimetype,
     size: file.size,
     img: Buffer.from(encImg, 'base64')
   };
   reviewCollection.insertOne({ name, cName, image,description })
               .then(result => {
                  
                  res.send(result.insertedCount > 0);
                  
                   
               })
   
    })

    app.get('/admin', (req, res) => {
      adminCollection.find({})
          .toArray((err, documents) => {
              res.send(documents);
              console.log(documents)
          })
    });

    app.post('/isAdmin', (req, res) => {
      const email = req.body.email;
      console.log(email)
      adminCollection.find({ email: email })
          .toArray((err, admin) => {
              res.send(admin.length > 0);
          })
    })
    

    app.get('/reviews', (req, res) => {
      reviewCollection.find({})
          .toArray((err, documents) => {
              res.send(documents);
              console.log(documents)
          })
    });

    app.post('/addAAdmin', (req,res)=>{
      
      const name = req.body.name
      const email = req.body.email
     console.log(email, name)
     
     adminCollection.insertOne({ name, email })
                 .then(result => {
                    
                    res.send(result.insertedCount > 0);
                    
                     
                 })
     
      })



})







app.get('/', (req, res) => {
  res.send('Hello frozen!')
})










app.listen(process.env.PORT || port)