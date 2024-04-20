const express = require('express')
const path = require('path')
const bcrypt = require('bcrypt')
const collection = require('./config')

const  app = express();
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(express.static('public'))
app.set('view engine', 'ejs');

app.get('/',(req,res)=>{
    res.render("login");
})
app.get('/signup', (req, res) => {
   res.render('signup');
});


app.post('/signup',async(req,res)=>{
    const data = {
        name:req.body.username,
        password:req.body.password
    }
    const exitsuser =  await collection.findOne({name :data.name })
     if(exitsuser){
     res.send('user already exits')
     }
     else{
        let salt=await bcrypt.genSalt(10);
        let hashedPassword=await bcrypt.hash(data.password ,salt)
       const userData={...data , password : hashedPassword}
      const response= await collection.insertMany(userData)
      console.log(response)
    //     const userData = await collection.insertMany(data);
    // console.log(userData);
     }
     res.render('home')
})

app.post('/login',async(req,res)=>{
   try{
    const check = await collection.findOne({name:req.body.username})
    if(!check){
        res.send('user not found')
   }
   const ispasswordmatch = await bcrypt.compare(req.body.password,check.password)
   if(ispasswordmatch)
   res.render('home')
   else
   req.send("wrong password")
}catch{
    res.send("wrong deatils")
}
})
const port = process.env.PORT || 5000;

app.listen(port,()=>{
    console.log(`server is listening on port ${port}`);
})