var sql=require('mysql2');
var app=sql.createConnection({
    host:'localhost',
    user:'root',
    password:'Harsha@6281',
    database:'email_users'
});

app.connect((err)=>{
    if(err) throw err;
    console.log("Database is connected successfully");
});

var express=require('express');
var con=express();

var path=require('path');

var bodyparser=require('body-parser');

con.use(bodyparser.json());

con.use(bodyparser.urlencoded({extended:true}));

con.use(express.static(path.join(__dirname,'/public')));

con.listen(6008,()=>{
    console.log('server connected');
});

con.get('/',(req,res)=>{
    res.sendFile(path.join(__dirname,'/register.html'))
});
con.get('/login',(req,res)=>{
    res.sendFile(path.join(__dirname,'/login.html'))
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
            if (err.code === 'ER_DUP_ENTRY') {
                return res.send(`
                    <script>
                        alert("Email already exists! Try another email.");
                        window.location.href="/";
                    </script>
                `);
            }
            return res.send("Database Error");
        }

        console.log("Inserted Successfully");
        return res.send(`
            <script>
                alert("Sign Up Successfully");
                window.location.href="/login";
            </script>
        `);
        

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

            res.send(`
                <script>
                    alert('Invalid Email or Password');
                    window.location.href="/login";
                </script>
                `);

        }

    });

});

