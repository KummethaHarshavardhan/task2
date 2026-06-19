var sql=require('mysql2');
var app=sql.createConnection({
    host:'localhost',
    user:'root',
    password:'Harsha@6281',
    database:'email_users'
});

app.connect((err)=>{
    if(err) throw err;
    console.log("Database is connected");
});

var express=require('express');
var con=express();

var path=require('path');

var bodyparser=require('body-parser');

con.use(bodyparser.json());

con.use(bodyparser.urlencoded({extended:true}));

con.use(express.static(path.join(__dirname,'/public')));

con.listen(6800,()=>{
    console.log('server connected')
});

con.get('/',(req,res)=>{
    res.sendFile(path.join(__dirname,'/login.html'))
});
con.get('/register',(req,res)=>{
    res.sendFile(path.join(__dirname,'/register.html'))
});


con.post('/register', (req, res) => {

    console.log(req.body);

    var user = req.body.name;
    var email_id = req.body.email;
    var mobile = req.body.phn;
    var password = req.body.pass;
    var birth = req.body.date;

    var sql = "INSERT INTO e_user(u_name,u_email,u_mobile_no,u_password,u_birth_date) VALUES(?,?,?,?,?)";

    app.query(sql, [user, email_id, mobile, password, birth], (err, result) => {

        if (err) {
            console.log(err);
            return res.send("Database Error");
        }

        console.log("Inserted Successfully");

        res.redirect('/');

    });

});

con.post('/login',(req,res)=>{

    var email_id=req.body.l_email;
    var password=req.body.l_pass;

    var sql="SELECT * FROM e_user WHERE u_email=? AND u_password=?";

    app.query(sql,[email_id,password],(err,result)=>{

        if(err) throw err;

        if(result.length>0){

            res.sendFile(path.join(__dirname,'success.html'));

        }else{

            res.send("<h1>Invalid Email or Password</h1>");

        }

    });

});

