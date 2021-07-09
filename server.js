const express = require('express');
const app = express()
const passport = require('passport');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const PassportLocal = require('passport-local').Strategy;

app.use(express.urlencoded({extended:true}))

app.use(cookieParser('mi ultra hiper secreto'))

app.use(session({
    secret:'mi ultra hiper secreto',
    resave: true,
    saveUninitialized: true
}));

app.use(passport.initialize());
app.use(passport.session());

//objeto que se instancia de la clase Stratgy
//funcione done enviar el resultado de proceso de autenticacion
passport.use(new PassportLocal(function(username,password,done){
   
    if(username === "codigofacilito" && password=== "12345678")
        return done(null, { id:1, name:"Cody"});
    done(null,false)
}));
// supongamos que queremos identificar al usuario  { id:1, name:"Cody"}
// passport no va a guardar toda esta informacion
// podemos guardar el identificador 1 => Seriealización
passport.serializeUser(function(user,done) {
    done(null,user.id);
})
//Deserializacion pasar del 1 al objeto otra vez, tendre un proceso para buscarlo en la base de datos 
passport.deserializeUser(function(id,done) {
    done(null, { id:1, name:"cody"})
})

app.set('view engine','ejs')


//proteger ruta,utilizamos un midleware que tiene tres parametos req.isAuthenticated devuelve true o false
app.get('/',(req,res,next) =>{
   if( req.isAuthenticated() ) return next();

    res.redirect("/login");
},(req,res)=>{
    //Si ya iniciamos mostrar bienvenida

    //Si no hemos iniciado sesión redireccionar a login
    res.send("Hola")
});

app.get('/login',(req,res)=>{
    // mostrar el formulario de login
    res.render('login')
});

//midleware de passport authenticate
app.post('/login',passport.authenticate('local',{
    successRedirect: "/",
    failureRedirect:"/login"
    
}));

app.listen(8080, () => {
    console.log(`Server started on 8080`);
});