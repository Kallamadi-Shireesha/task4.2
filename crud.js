const express = require('express')
const app = express()
var nodemailer = require('nodemailer');
const morgan=require('morgan');
const multer = require('multer')
/*database connection*/
const {Pool} = require('pg');
//require.resolve('dotenv').config();
let pool=new Pool({
  host:"localhost",
  port:5432,
  user:"postgres",
  password:"$Hiree$ha491",
  database:"project2"
});
const port = 9003;
app.use(morgan('dev'));
app.use(express.urlencoded({extended:true}));
app.use(express.json());




/*sending mail*/



var Storage = multer.diskStorage({
  destination: function(req, file, callback) {
      callback(null, "./images");
  },
  filename: function(req, file, callback) {
      callback(null, file.fieldname + "_" + Date.now() + "_" + file.originalname);
  }
})

var upload = multer({
  storage: Storage
}).single("pptx"); //Field name and max count

app.post('/single',(req,res)=> {

try{
  upload(req,res,function(err){
    if(err){
        console.log(err)
        return res.end("Something went wrong!");
    }

    var transporter = nodemailer.createTransport({
        service:'gmail',

         auth: {
            user:"kallamadi555@gmail.com",
            pass:"/*insert password here*/"
        }
    
    });
    
    var options = {
        from:"kallamadi555@gmail.com",
        to: "shireesha967@gmail.com",
        subject: "voting system",

        attachments:[ {
                     
          path:req.file.path }]
         
    }
    transporter.sendMail(options,function(err, info) {
        if (err) {
          console.error(err);
          
        } else {
          console.log("sent:"+info.response);
        }
      })
    
     
})
}
  
catch { console.log("error");}


  

})



/*api to get the html file*/

app.get('/',function(req,res) {
  res.sendFile('index.html',{root:__dirname})
});


/* api to get the content from a table*/
app.get('/info/get',(req,res)=> {
  try{
    
  pool.connect(async(error,client,release)=>{
    let resp=await client.query('select * from test');
    //release();
    res.send(resp.rows);
  })
  }
catch(error) {console.log(error);}
});

/*post--add-- method*/
/* post api too insert values into table*/
app.post('/info/add',(req,res)=> {
  console.log("made it");
  //res.send(res);
  
  try{
  pool.connect(async(error,client,release)=>{
    let resp=await client.query(`insert into test (name,count,description,date,upvote,downvote,comments,pptx) values('${req.body.add}',${req.body.count},'${req.body.description}','${req.body.date}',${req.body.upvote},${req.body.downvote},'${req.body.comments}','${req.body.pptx}')`);
    console.log(resp);
    res.redirect('/info/get');
    
    
    

  })
}



catch(error) {console.log(error);}
  
});

/* delete*/
/*optional*/
app.post('/info/delete',(req,res)=> {
  console.log("made it");
  //res.send(req.body);
  try{
  pool.connect(async(error,client,release)=>{
    let resp=await client.query(`delete from test where name='${req.body.delete}'`);
    console.log(resp);
    res.redirect('/info/get');
  })
}
catch(error) {console.log(error);}
})

/*update*/
/* api to update upvote value*/
app.post('/info/update',(req,res)=> {
  console.log("made it");
  //res.send(req.body);
  try{
  pool.connect(async(error,client,release)=>{
    
    let resp=await client.query(`update test set upvote='${req.body.newValue}' where name='${req.body.oldvalue}'`);
    console.log(resp);
    res.redirect('/info/get');
  })
}
catch(error) {console.log(error);}
})







app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
})