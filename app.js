// //jshint esversion:6


// require('dotenv').config() ;
// const express = require("express");
// const bodyParser = require("body-parser");
// const ejs = require("ejs");
// const mongoose=require("mongoose");
// // const encrypt =require("mongoose-encryption");

// const GoogleStrategy = require('passport-google-oauth20').Strategy;
// const findOrCreate=require("mongoose-findOrcreate");
// // const { google } = require('googleapis');
// //hashing
// // const md5=require("md5");

// //hashing+salting
// // const bcrypt=require("bcrypt");
// // const saltRounds=10;

// // packages require for  passport
// const session = require('express-session');
// const passport=require("passport");
// const passportLocalMongoose=require("passport-local-mongoose");


// const app = express();

// console.log(process.env.API_KEY);
// // console.log(md5("123"));

// app.set('view engine', 'ejs');
// app.use(bodyParser.urlencoded({ extended: true }));
// // mongoose.set("useCreateIndex");
// app.use(express.static("public"));

// //set up a session
// app.use(session({
//     secret: 'secret cat',
//     resave: false,
//     saveUninitialized: false,
//     // cookie: { secure: true }
//   }));
//   //initialize the modules 
//   app.use(passport.initialize());
//   app.use(passport.session());

// //creating databse
// mongoose.connect("mongodb://localhost:27017/userDB", {useNewUrlParser:true});
// mongoose.set("userCreateIndex",true);

// const userSchema=new mongoose.Schema({
//     email:String,
//     password:String,
//     googleId:String,
//     secret: String
// });
// userSchema.plugin(passportLocalMongoose);
// userSchema.plugin(findOrCreate);


// // const secret="Thisisourlittlesecret";
// // userSchema.plugin(encrypt,{secret:secret,encryptedFields:["passowrd"]});
// const User=new mongoose.model("User", userSchema);

// passport.use(User.createStrategy());

// // passport.serializeUser(User.serializeUser());
// // passport.deserializeUser(User.deserializeUser());
// passport.serializeUser(function(user,done){
//     done(null,user.id);
// });
// passport.deserializeUser(function(id,done){
//     User.findById(id,function(err, user){
//         done(err,user);
//     });
// });

// passport.use(new GoogleStrategy({
//     clientID: process.env.CLIENT_ID,
//     clientSecret: process.env.CLIENT_SECRET,
//     callbackURL: "http://localhost:3000/auth/google/secrets",
//     userProfileURL: "https://www.googleapis.com/oauth2/v3/userinfo"
//   },
//   function(accessToken, refreshToken, profile, cb) {
//     console.log(profile);
//     User.findOrCreate({ googleId: profile.id }, function (err, user) {
//       return cb(err, user);
//     });
//   }
// ));

// app.get("/", function(req,res){
//     res.render("home");
// });

// app.get("/auth/google",
//   passport.authenticate('google', { scope: ["profile"] }));

// app.get("/auth/google/secrets", 
//   passport.authenticate('google', { failureRedirect: "/login" }),
//   function(req, res) {
//     // Successful authentication, redirect SECRETS.
//     res.redirect('/secrets');
//   });

// app.get("/login", function(req,res){
//     res.render("login");
// });
// app.get("/register", function(req,res){
//     res.render("register");
// });

// app.get("/secrets",function(req,res){
//     User.find({"secret": {$ne: null}}, function(err, foundUsers){
//         if(err){
//             console.log(err);
//         }
//     else{
//         if(foundUsers){
//             res.render("secrets", {usersWithSecrets: foundUsers});
//         }
//     }
// });
// });   
// app.get("/logout", function(req,res){
//         req.logout();
//         res.redirect("/");
// });

// //using hasing and salting 

// // app.post("/register", function(req,res){
   
// //     bcrypt.hash(req.body.password,saltRounds,function(err,hash){
// //         const newUser = new User({
// //             email: req.body.username,
// //             password:hash
// //             // password:md5(req.body.password);
// //         });

// // newUser.save(function(err){
// //     if(err){
// //         console.log(err);
// //     }
// //     else{
// // res.render("secrets");
// //     }
// // });
// // });
// // });
// // app.post("/login",function(req,res){
// //     const username=req.body.username;
// //     // const password=md5(req.body.password);
// //     const password=req.body.password;

// //     User.findOne({email:username},function(err,foundUser){
// //         if(err){
// //             console.log(err);
// //         }
// //         else{
// //             if(foundUser){
// //                 // if(foundUser.password===password){
// //                 //     res.render("secrets");
// //                 // }
// //                             //    password           hash
// //                 bcrypt.compare(password, foundUser.password,function(err,result){
// //                     if(result===true){
// //                         res.render("secrets");
// //                     }
// //                 });
// //             }
// //         }
// //     });
// // });


//authentication with google

// app.post("/register", function(req,res){
// User.register({username:req.body.username},req.body.password,function(err, user){
// if(err){
//     console.log(err);
//     res.redirect("/register");
// }
// else{
//     passport.authenticate("local")(req, res,function(){
//        console.log("heyy");
//         res.redirect("/secrets");
//     });
// }
// });
// });

// app.post("/login", function(req,res){
//     const user=new User({
//         username:req.body.username,
//         password:req.body.password
//     });
//     req.login(user,function(err){
//         if(err){
//             console.log(err);
//         }
//         else{
//             passport.authenticate("local")(req,res,function(){
//                 res.redirect("/secrets");
//             });
//         }
//     });
// });

// app.listen(3000, function () {
//     console.log("server started on port 3000");
// });

//jshint esversion:6
require('dotenv').config();
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const session = require('express-session');
const passport = require("passport");
const passportLocalMongoose = require("passport-local-mongoose");
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const findOrCreate = require('mongoose-findorcreate');
const res = require('express/lib/response');

const app = express();

app.use(express.static("public"));
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({
  extended: true
}));

app.use(session({
  secret: "Our little secret.",
  resave: false,
  saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());

mongoose.connect("mongodb://localhost:27017/userDB", 
{useNewUrlParser: true, 
// useCreateIndex: true, 
// useFindAndModify: false, 
// useUnifiedTopology: true
 });
// mongoose.set("useCreateIndex", true);

const userSchema = new mongoose.Schema ({
  email: String,
  password: String,
  googleId: String,
  secret: String
});

userSchema.plugin(passportLocalMongoose);
userSchema.plugin(findOrCreate);

const User = new mongoose.model("User", userSchema);

passport.use(User.createStrategy());

passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  User.findById(id, function(err, user) {
    done(err, user);
  });
});

passport.use(new GoogleStrategy({
    clientID: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
    callbackURL: "http://localhost:3000/auth/google/secrets",
    userProfileURL: "https://www.googleapis.com/oauth2/v3/userinfo"
  },
  function(accessToken, refreshToken, profile, cb) {
    console.log(profile);

    User.findOrCreate({ googleId: profile.id }, function (err, user) {
      return cb(err, user);
    });
  }
));
//HOME
app.get("/", function(req, res){
  res.render("home");
});

app.get("/auth/google",
  passport.authenticate('google', { scope: ["profile"] })
);

app.get("/auth/google/secrets",
  passport.authenticate('google', { failureRedirect: "/login" }),
  function(req, res) {
    // Successful authentication, redirect to secrets.
    res.redirect("/secrets");
  });

app.get("/login", function(req, res){
  res.render("login");
});

app.get("/register", function(req, res){
  res.render("register");
});
//SECRETS
app.get("/secrets", function(req, res){
  User.find({"secret": {$ne: null}}, function(err, foundUsers){
    if (err){
      console.log(err);
    } else {
      if (foundUsers) {
        res.render("secrets", {usersWithSecrets: foundUsers});
      }
    }
  });
});

app.get("/submit", function(req, res){
  if (req.isAuthenticated()){
    res.render("submit");
  } else {
    res.redirect("/login");
  }
});

app.post("/submit", function(req, res){
  const submittedSecret = req.body.secret;

//Once the user is authenticated and their session gets saved, their user details are saved to req.user.
  // console.log(req.user.id);

  User.findById(req.user.id, function(err, foundUser){
    if (err) {
      console.log(err);
    } else {
      if (foundUser) {
        foundUser.secret = submittedSecret;
        foundUser.save(function(){
          res.redirect("/secrets");
        });
      }
    }
  });
});

app.post("/register", function(req, res){

  User.register({username: req.body.username}, req.body.password, function(err, user){
    if (err) {
      console.log(err);
      res.redirect("/register");
    } else {
      passport.authenticate("local")(req, res, function(){
        res.redirect("/secrets");
      });
    }
  });

});

app.post("/login", function(req, res){

  const user = new User({
    username: req.body.username,
    password: req.body.password
  });

  req.login(user, function(err){
    if (err) {
      console.log(err);
    } else {
      passport.authenticate("local")(req, res, function(){
        res.redirect("/secrets");
      });
    }
  });

});
app.get("/logout", function(req, res){
  // req.logout();
  res.redirect("/");
});

app.listen(3000, function() {
  console.log("Server started on port 3000.");
});
