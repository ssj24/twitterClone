# twitter clone

[TOC]

## simple server practice

1. `res.end();`: without this command, browser will keep listening.

2. `res.setHeader('Content-Type', 'text/html');`: tell the browser which type of data will be coming. if this command is not written, the element of the browser will be placed inside of `pre` tag

3. `npm init` on terminal -> make package.json file

4. ```json
   // package.json
   "scripts": {
       "test": "echo \"Error: no test specified\" && exit 1",
       "start": "node myApp.js",
     	"doSomething": "..."
     },
   ```

   unlike `test` and `start`, when you want to execute `doSomething`, the command is : `npm run doSomething`

   because text and start are defalut words.

   if you want to use your own command, you need to add `run` on the command

5. ```json
   // package.json
   
   "dependencies": {
       "colors": "^1.4.0"
     }
   ```

   any third party packages will be shown under dependencies

   usually packages are installed through `npm install <npm package name>` command.

6. ```.gitignore
   node_modules/*
   ```

   tell git ignore anything under the node_modules folder

## set up

1. twitterClone folder

2. npm init

3. package.json => scripts-"start": "node myApp.js",

4. touch .gitignore

5. .gitignore: => node_modules/*

6. make app.js

7. npm install express

   1. const express = require('express');
   2. const app = express();

8. app.listen(param1, param2);

   1. param1 is port number that app will listen on
   2. param2 is callback func

9. app.get("path", function)

   1. path that want to check for

   2. function that want to do

   3. app.get("/", (req, res, next) => {...}) 

      request incoming from the path

      respond is using for sending the data back to the browser after request finished

      `next` handles any middleware

      res.status(200).send("YEAH"); => path otherwise `/` , cannot be opened. 

10. npm install pug

    pug for write html easily

    indentation is important when it comes to pug

11. app.set("view engine", "pug");

12. make views folder at root, make file home.pug

13. ```js
    const express = require('express');
    const app = express();
    const port = 3003;
    
    const server = app.listen(port, () => {
      console.log("Server listening on port " + port);
    });
    
    app.set("view engine", "pug");
    app.set("views", "views");
    
    app.get("/", (req, res, next) => {
      res.status(200).render("home");
    });
    ```

    render can take two parameter

    first one would be the page and second one is the data

    in "home" file, which the page you will gonna render, specify a variable like #{dataName}

    ```js
    app.get("/", (req, res, next) => {
    
      const payload = {
        pageTitle: "Home"
      }
    
      res.status(200).render("home", payload);
    });
    ```

    ```html
    #{pageTitle}
    ```

    

14. extends pug file: block varName

    ```pug
    //- views/layouts/main-layout.pug
    
    html
    	head
    		title #{pageTitle}
    	body
    		block content
    ```

    ```pug
    //- views/home.pug
    
    extends layouts/main-layout.pug
    
    block content
    	h1 This is awesome
    ```



## Regislation/Login system

1. \<rootFolder>/middleware.js

   - requireLogin
   - `if (req.session && req.session.user) {`: it means user already logged in
   - app.js => const middleware = require('./middleware');
   - change app.get => 
     app.get("/", **middleware.requireLogin,** (req, res, next) => {
   - by adding middleware.requireLogin in any path you want, you could make the page require logged in user only

2. \<rootFolder>/routes

   1. loginRoutes.js

      ```js
      const express = require('express');
      const app = express();
      const router = express.Router();
      
      app.set("view engine", "pug");
      app.set("views", "views");
      
      router.get("/", (req, res, next) => {
        res.status(200).render("login");
      });
      
      module.exports = router;
      ```

3. app.js

   ```js
   const loginRoute = require('./routes/loginRoutes');
   app.use("/login", loginRoute);
   ```

4. make login page

   - input(type="text", name="logName", placeholder="Username or email", required="")

     attributes are separated by comma

     though in html just adding `required` is work, in pug single word won't work. that't whay add `=""`

   1. add bootstrap

      - cdn
      - https://pughtml.com/
      - since bootstrap cdn's jquery in slim version, get the full version(bur minified) of jquery cdn

5. serving static files

   - \<rootFolder>/public

   - public/css/login.css

   - app.js

     ```js
     const path = require('path');
     
     app.use(express.static(path.join(__dirname, "public")));
     ```

   - ref css => `link(rel="stylesheet", href="/css/login.css")`: since the root folder for static sets public t app.js, you don't have to specify the css are in public folder

6. make registerRoutes.js

   res.status(200).render("register")

   - app.js

   ```js
   const loginRoute = require("./routes/loginRoutes");
   const registerRoute = require("./routes/registerRoutes");
   app.use("/login", loginRoute);
   app.use("/register", registerRoute);
   ```

7. write script on pug file

   ```pug
   script.
   	const varName = document.querySelector('.varClass');
   	function funcName() {
   		...
   	}
   ```

8. form submit

   - form#registerForm(method="post", onsubmit="event.preventDefault(); validateForm();")

   1. npm install body-parser

   2. handle post access

      ```js
      // registerRoutes.js
      const bodyParser = require("body-parser");
      
      app.use(bodyParser.urlencoded({ extended: false }));
      // body will only be ought to contain key-value fairs, made up of strings or arrays. if extended sets true, any data type can come through.
      ```

      - import bodyParser on app.js too.

      - :bug: **got error** vscode struck out `bodyParser` on app.use command

        ```js
        app.use(express.urlencoded({
            extended: false
        }));
        ```

        this makes work.

        https://stackoverflow.com/questions/24330014/bodyparser-is-deprecated-express-4/24330353#24330353

      - ```js
        //registerRoutes.js
        router.post("/", (req, res, next) => {
            console.log(req.body);
            res.status(200).render("register");
        });
        ```

        ```bash
        # console logging req.body
        [Object: null prototype] {
          firstName: 'dd',
          lastName: 'dd',
          username: 'test',
          email: 'dd@dd.com',
          password: 'dd',
          passwordConf: 'dd'
        }
        ```

9. validate the form

   - not pass the blank: prevent the case that filled with only whitespaces

     `trim()`

     const firstName = req.body.firstName.trim();

   - but! password can have spaces within. don't trim it.

   - in case of fields don't have valid value => 

     ```js
     const payload = req.body;
     if (firstName && lastName && username && email && password) {
     } else {
       payload.errorMessage = "Make sure each field has a valid value.";
       res.status(200).render("register", payload);
     }
     ```

   - when you render a register page again (because the submitted form couldn'y pass), you could fill each field with the one the user submitted.

     `payload` is same with req.body which is the form content the user submitted.

     you rerender the register page with payload,

     so make register.pug like this.

     ```pug
     form#registerForm(method="post", onsubmit="event.preventDefault(); validateForm();")
                 p.errorMessage #{errorMessage}
                 input(type="text", name="firstName", placeholder="first name", value=firstName, required="")
                 input(type="text", name="lastName", placeholder="last name", value=lastName, required="")
                 input(type="text", name="username", placeholder="Username", value=username, required="")
                 input(type="email", name="email", placeholder="Email", value=email, required="")
                 input#password(type="password", name="password", placeholder="Password", required="")
                 input#passwordConf(type="password", name="passwordConf", placeholder="Confirm password", required="")
                 input(type="submit", value="Register")
     ```

     if firstName doesn't contain anything, the field will be empty.

     since it's not string don't wrap it with ''

     but errorMessage need to be wrap with #{}: it's a variable..

     wow... I don't get it..

     **AND** though I couldn't understand.... even you skip the comma after value=firstName, it works.

10. MongoDB

   noSQL system: no tables... not like MySQL

   good pair with node js

   - new project

   - make cluster

   - connect

     - allow access from anywhere(with other options, you could get in trouble when try to access in the other computer or IP address)
     - database user
     - connect your application
     - node.js-recent version
     - mongodb+srv://admin:<password>@twitterclonecluster.ar82m.mongodb.net/myFirstDatabase?retryWrites=true&w=majority

   - npm install mongodb mongoose

   - ```js
     // app.js
     
     const mongoose = require("mongoose");
     mongoose.connect("mongodb+srv://test:qwer1234@twitterclonecluster.ar82m.mongodb.net/myFirstDatabase?retryWrites=true&w=majority")
       .then(() => {
         console.log("database connection successful");
       })
       .catch((err) => {
         console.log("database connection error", err);
       })
     ```

     - if you type the wrong password, you will get authentication failed error

   - <rootFolder>/database.js

     - constructor(): when the instance is made, constructor code is called first within the class

     - ```js
       const mongoose = require("mongoose");
       
       class Database {
       
           constructor() {
               this.connect();
           }
       
           connect() {
               mongoose.connect("mongodb+srv://test:qwer1234@twitterclonecluster.ar82m.mongodb.net/myFirstDatabase?retryWrites=true&w=majority")
               .then(() => {
                   console.log("database connection successful");
               })
               .catch((err) => {
                   console.log("database connection error", err);
               })
           }
       }
       module.exports = new Database();
       ```

     - seperate the connect code from app.js

     - since you moved connect part, you should change mongoose variable's path in app.js too

       ```js
       const mongoose = require("./database");
       ```

     - there are several errors that thrown when the database is connected, to eliminate those

       ```bash
       ❯ npm start
       
       > twitterclone@1.0.0 start /Users/sujeecho/Desktop/TwitterClone
       > node app.js
       
       (node:58164) DeprecationWarning: current URL string parser is deprecated, and will be removed in a future version. To use the new parser, pass option { useNewUrlParser: true } to MongoClient.connect.
       (Use `node --trace-deprecation ...` to show where the warning was created)
       Server listening on port 3003
       (node:58164) [MONGODB DRIVER] Warning: Top-level use of w, wtimeout, j, and fsync is deprecated. Use writeConcern instead.
       (node:58164) [MONGODB DRIVER] Warning: Current Server Discovery and Monitoring engine is deprecated, and will be removed in a future version. To use the new Server Discover and Monitoring engine, pass option { useUnifiedTopology: true } to the MongoClient constructor.
       database connection successful
       ```

       

       ```js
       // database.js
       mongoose.set('useNewUrlParser', true);
       mongoose.set('useUnifiedTopology', true);
       ```

     - `mongoose.set('useFindAndModify', false);`

       by adding this command, prevent mongo from updating things version

     - mongoose returns singleton object, so with database.js setting, you could call the same mongoose anywhere of the application.

       instructor's comment) the require('mongoose') call above returns a singleton object. it means that the first time you call require('mongoose'), it is creating an instance of the MOngoose class and returning it. on subsequent calls, it will return the same instance that was created and returned to you the first time because of how module import/export works in ES6

11. <rootFolder>/schemas/UserSchema.js

- ```js
  const mongoose = require('mongoose');
  
  const Schema = mongoose.Schema;
  const UserSchema = new Schema({
      firstName: {
          type: String,
          required: true,
          trim: true
      },
      username: {
          type: String,
          required: true,
          trim: true,
          unique: true
      },
   		profilePic: {
      		type: String,
      		default: "/images/profilePic.png"
   		}
  })
  ```

  - `trim: true`: make the value of the field have no whitespace

  - `unique: true`: couldn't have same value within the same field

  - you can set a default value.

  - ```js
    var User = mongoose.model('User', UserSchema);
    module.exports = User;
    ```

    :question: why using `var`?? 



12. registerRoutes.js

    ```js
    const User = require('../schemas/UserSchema');
    router.post("/", (req, res, next) => {
        const firstName = req.body.firstName.trim();
        const lastName = req.body.lastName.trim();
        const username = req.body.username.trim();
        const email = req.body.email.trim();
        const password = req.body.password;
    
        const payload = req.body;
        if (firstName && lastName && username && email && password) {
            User.findOne({
                $or: [
                    {username: username},
                    {email: email},
                ]
            })
        } else {
            payload.errorMessage = "Make sure each field has a valid value.";
            res.status(200).render("register", payload);
        }
    });
    ```

    - User.findOne({insert `WHERE` clause}): find the row matches with the where clause within User table.

      ex) User.findeOne({ username: '`sujee`' });

      ​	find the row in User table which has a username that has a value 'sujee'.

    - $or: mongodb's condition(there are lots of it, so find it and study it)

      find any row that has username equals username OR email equals email.

    - `.then`: it works asynchronously.

      ```js
      User.findOne({
        $or: [
          {username: username},
          {email: email},
        ]
      })
        .then((user) => {
        console.log(user);
      })
      
      console.log("hello");
      ```

      if you run this, JS will execute User.findOne(~~) then console.log('hello'); next. so console.log(user); will gonna executed later.

      if you want to change async-await

      ```js
      router.post("/", async (req, res, next) => {
          const firstName = req.body.firstName.trim();
          const lastName = req.body.lastName.trim();
          const username = req.body.username.trim();
          const email = req.body.email.trim();
          const password = req.body.password;
      
          const payload = req.body;
          if (firstName && lastName && username && email && password) {
              var user = await User.findOne({
                  $or: [
                    {username: username},
                    {email: email},
                  ]
                })
              console.log("hello");
          } else {
              payload.errorMessage = "Make sure each field has a valid value.";
              res.status(200).render("register", payload);
          }
      });
      
      ```

      code above, console logging user first(as null) then hello.

    - User.create() => you could check the data that saved in DB `users` collection

13. user data option

    - UserSchema.js

      ```js
      const UserSchema = new Schema({
          
          profilePic: {
              type: String,
              default: "/images/profilePic.png"
          }
      }, { timestamps: true });
      ```

      add `createdAt`, `updatedAt` timestamp rows to the users collection

14. password hash

    hash the password before sending the data to db

    - npm install bcrypt

    - registerRoutes.js

      ```js
      const bcrypt = require('bcrypt');
      
      ```

      you need to hash the password after find the user that never enrolled before, and before send the data to db.

      which means inside the `if (user==null)` phrase and before User.create(data) line.

      ```js
      if (user==null) {
          // No user found
          var data = req.body;
      
          data.password = await bcrypt.hash(password, 10)
          User.create(data)
            .then((user) => {
            console.log(user);
          })
        }
      ```

      `bcrypt.hash(password, 10)`: the second parameter of bcrypt.hash is saltOrRounds that represents how many times you will run...? hashing calculations. so higher number securer password. but as numbers get high, more GPU power is needed. 10 makes super secure password. 

      it makes my 8 char password like this.

      `$2b$10$XuqPFIlg04s3B85eABdZSuw4lVC6LUobFMfF3uTf3QUZ/xntPVXEu`

15. session
    - npm install express-session

      because this application uses express

    - app.js

      ```js
      const session = require("express-session");
      app.use(session({
        secret: "Milk Shake",
        resave: true,
        saveUninitialized: false
      }));
      ```

      secret of session is like saltOrRounds of bcrypt.hash. it will make the data secure within their own system. so set it anything you like then session will hashing that.

      resave makes session save the data even when it is modified..? whatever just set it true

      saveUninitialized is false so you will not receive a data that uninitialized.. guess space is not accepted..?

    - registerRoutes.js

      ```js
      if (user==null) {
          // No user found
          var data = req.body;
      
          data.password = await bcrypt.hash(password, 10)
          User.create(data)
            .then((user) => {
            req.session.user = user;
            return res.redirect("/");
          })
        }
      ```

      because we've already set in the middleware.js about session, just code above is all done.

16. logging in user

    when restart the server, it kills session. so need to login again.(fix it later)

    - passing the logged in user to the client

      ```js
      // app.js
      app.get("/", middleware.requireLogin, (req, res, next) => {
      
        const payload = {
          pageTitle: "Home",
          userLoggedIn: req.session.user
        }
      
        res.status(200).render("home", payload);
      });
      ```

      passing the req.session.user to `home` through payload

    - loggin in

      by far, only after register you could see the home page.

      logging in with existed account, renders an error. because haven't set a post method.

      make login process!

      ```js
      // loginRoutes.js
      const bcrypt = require("bcrypt");
      const User = require("../schemas/UserSchema");
      
      app.use(express.urlencoded({
        extended: false
      }));
      router.post("/", async (req, res, next) => {
        if (req.body.logUsername && req.body.logPassword) {
      		var user = await User.findOne({
            $or: [
              {username: req.body.logName},
              {email: req.body.logName},
            ]
          })
          .catch((error) => {
            console.log(error);
            payload.errorMessage = "Something went wrong.";
            res.status(200).render("login", payload);
          });
          if (user != null) {
      			var result = await bcrypt.compare(req.body.logPassword, user.password)
      			
      			if (result === true) {
      				req.session.user = user;
      				return res.redirect("/");
      			}
      			payload.errorMessage = "Login credentials incorrect.";
      			return res.status(200).render("login", payload);
      		}
      	}
      	payload.errorMessage = "Make sure each field has a valid value.";
      	res.status(200).render("login", payload);
      });
      ```

      since payload is set, set some values and errorMessage in login.pug.

      bcrypt.compare()

      if you don't use return each res.redirect within if phrase, it may render to other pages again. make sure use return inside if phrase when render or redirect pages.

17. logout

    - req.session.destroy()

    - app.js

      ```js
      const logoutRoute = require("./routes/logoutRoutes");
      app.use("/logout", logoutRoute);
      ```

18. mainsection styling

    - flex-shrink: 0;

      to fix the bug in Safari. 

## homepage

1. create post

   - views/mixins/mixins.pug

     mixins: reusable pug code

     ```pug
     mixin createPostForm(userLoggedIn)
         .postFormContainer
             .userImageContainer
                 img(src=userLoggedIn.profilePic, alt="user's profile picture")
     ```

     we can hand over the parameter to mixin.

     at image source, we can use the parameter.

   - main-layout.pug

     `include ../mixins/mixins` at top

     we need createPostForm() in home.pug(not in main-layout. still include in main-layout is good call. because by adding it in main-layout, every other page which uses main-layout can access to mixins)

   - home.pug

     `+createPostForm(userLoggedIn)`

     adding `+` for calling function

   - public/images/

     put all the images will used in the project

   - when you set the profile img css, don't forget to add background-color! in case of png, having background-color is more natural.

   - public/js/common.js

     js file in public/js folder is for frontend

     add `script(src='/js/common.js')` at main-layout.png

     ```js
     $("#postTextarea").keyup(event => {
         var textbox = $(event.target);
         var value = textbox.val().trim();
     
         var submitButton = $("#submitPostButton");
     
         if (submitButton.length == 0) return alert("No submit button found");
         
         if (value == "") {
             submitButton.prop("disabled", true);
             return;
         }
     
         submitButton.prop("disabled", false);
     })
     ```

     - `$("#postTextarea")`: get the element like this
     - val().trim(): prevent space only post
     - prop("propertyName", "propertyValue to set")
     - and yes it's jQuery.. I've never used it before and I thought I would never use it. but one of the student ask the question about it like whay use pug and jquery which are outdated. Reece answered it, and I kinda get it.

   - common.js

     ```js
     $("#submitPostButton").click(event => {
         const button = $(event.target);
         const textbox = $("#postTextarea");
     
         const data = {
             content: textbox.val()
         };
     
        $.post("/api/posts", data, (postData, status, xhr) => {
     
         })
     })
     ```

     - `$.post("/api/posts", data, () => {...})`: callback func will executed when the request to '/api/post' has returned.

     - with slim version of jQuery(the one that bootstrap offers), $.post won't work. 

       use full but minified version!(google jquery cdn)

       `script(src="https://code.jquery.com/jquery-3.6.0.min.js", integrity="sha256-/xUj+3OJU5yExlq6GSYGSHk7tPXikynS7ogEvDej/m4=", crossorigin="anonymous")`

     - xhr: xml, http request => status of request like 200 or  something else.

   - create RestAPI

     - routes/api/posts.js

     ```js
     router.post("/", async (req, res, next) => {
       if (!req.body.content) { // prevent no content request
         console.log("Content param not sent with request");
         res.sendStatus(400);
         }
     	res.status(200).send("It worked");
     });
     ```
     ​	- req.body.content: content is what you made in common.js

     ​	- that `It worked` part is the data you send to server.

     ```js
     // common.js
     $("#submitPostButton").click(event => {
         const button = $(event.target);
         const textbox = $("#postTextarea");
     
         const data = {
             content: textbox.val()
         };
     
        $.post("/api/posts", data, (postData, status, xhr) => {
            alert(postData);
        })
     })
     ```

     ​	`postData` in here is what the server get, `It worked`.

     - app.js

       declare postsApiRoute and use it

   - schemas/PostSchema.js

     schema is like kind of class that's why set the first letter of it as an uppercase letter.

     ```js
     const PostSchema = new Schema({
         content: { 
             type: String, 
             trim: true 
         },
         postedBy: { 
             type: Schema.Types.ObjectId,
             ref: 'User'
         },
         pinned: Boolean
     
     }, { timestamps: true });
     ```

     `content` required is not set true because when retweet feature comes no content is allowed.

     `Schema.Types.ObjectId` is what mongodb inserted when user registered.

     when there is only one item, you don't have to wrap it with {}.

   - posts.js

     ```js
     const Post = require("../../schemas/PostSchema");
     
     router.post("/", async (req, res, next) => {
       	
       	...
         
         const postData = {
             content: req.body.content,
             postedBy: req.session.user
         }
     
         Post.create(postData)
         .then(async newPost => {
             newPost = await User.populate(newPost, { path: "postedBy" });
             res.status(201).send(newPost);
         })
         .catch(error => {
             console.log(error);
             res.sendStatus(400);
         })
     });
     ```

     - status code 201: created

     - session.user is exists. Look at the middleware.js

     - since we set postedBy in PostSchema as Schema.Types.ObjectId, the db will save the ObjectId itself.

       ​	like `60a65e7b2f4dcc00e356ead7`

       but we need to populate the user from that.

       though there is async on top, this callback function is different, so make this callback as async to run the await within.

       `User.populate(newPost, { path: "postedBy" })`: From newPost's postedBy, populate the User.

       the newPost's postedBy looks like below

       ```
       postedBy:
           createdAt: "2021-05-24T00:30:21.755Z"
           email: "comeon@kitty.com"
           firstName: "cat"
           lastName: "lover"
           password: "$2b$10$w4WI7QEVfoC32i/FymqvhulzWF9i/jydztgdk9gg/ebz3vY8/5CA2"
           profilePic: "/images/leaf.png"
           updatedAt: "2021-05-24T00:30:21.755Z"
           username: "butler"
           __v: 0
           _id: "60aaf39d6b09e35eb0ab9705"
       ```

       obviously db still store the postedBy an Id of the user.

   - post to newfeed

     - common.js

       ```js
       $("#submitPostButton").click(event => {
           const button = $(event.target);
           const textbox = $("#postTextarea");
       
           const data = {
               content: textbox.val()
           };
       
          $.post("/api/posts", data, postData => {
              const html = createPostHtml(postData);
              $("#postContainer").prepend(html);
              textbox.val("");
              button.prop("disabled", true);
          })
       })
       
       function createPostHtml(postData) {
           return postData.content;
       }
       ```

       status and xhr on the callback before, just remove it.

       prepend(): append it on the top

       remove the textbox content.

       

     - home.pug

       ```pug
       block content
       	+createPostForm(userLoggedIn)
       	.postsContainer
       ```

     - polish createPostHtml() function in common.js

       because it's not pug you need to write html tag in original version

       ```js
       function createPostHtml(postData) {
         const postedBy = postData.postedBy;
         const displayName = postedBy.firstName + " " + postedBy.lastName;
         const timestamp = postData.createdAt;
         return `
       <div class="mainContentContainer">
       	<div class="userImageContainer">
       		<img src="${postedBy.profilePic}">
       	</div>
       	<div class="postContentContainer">
       		<div class="postHeader">
       			<a href="/profile/${postedBy.username}" 							class="displayName">${displayName}</a>
       			<span class="username">@${postedBy.username}				</span>
       			<span class="date">${timestamp}</span>
       		</div>
       		<div class="postBody">
       			<span>${postData.content}</span>
       		</div>
       		<div class="postFooter">
       			<div class="postButtonContainer">
               <button>
                 <i class="far fa-comment"></i>
               </button>
               <button>
                 <i class="fas fa-retweet"></i>
               </button>
               <button>
                 <i class="far fa-heart"></i>
               </button>
       			</div>
       		</div>
       	</div>
       </div>
       `;
       }
       ```

2. get post

   - public/js/home.js

     ```js
     $(document).ready(() => {
         $.get("/api/posts", results => {
             console.log(results);
         })
     })
     ```

   - home.pug

     ```pug
     block scripts 
     	script(src="/js/home.js") 
     ```

   - main-layout.pug

     ```pug
     		script(src='https://stackpath.bootstrapcdn.com/bootstrap/4.4.1/js/bootstrap.min.js', integrity='sha384-wfSDF2E50Y2D1uUdj0O3uMBJnjuUD4Ih7YwaYd1iqfktj0Uod8GCExl3Og8ifwB6', crossorigin='anonymous')
     
     block scripts
     
     script(src='/js/common.js')
     ```

     `block scripts` and common.js script lines are interchangable. 

   - handle the get request we set at the home.js

     ```js
     // posts.js
     router.get("/", (req, res, next) => {
         Post.find()
         .then(results => res.status(200).send(results))
         .catch(error => {
             console.log(error);
             res.sendStatus(400);
         })
     });
     ```

     Post.find(): find all the posts

     by sending `results` at `then`=> in home.js you could modify and display the results.

     By this far, I could see all the posts that I made on the console.(cause I console.log(results)) at home.js

   - home.js

     ```js
     $(document).ready(() => {
         $.get("/api/posts", results => {
             console.log(results);
             outputPosts(results, $(".postsContainer"));
         })
     })
     
     function outputPosts(results, container) {
         container.html("");
     
         results.forEach(result => {
             const html = createPostHtml(result);
             container.append(html);
         });
     
         if (!results.length) {
             container.append("<span class='noResults'>Nothing to show.</span>");
         }
     }
     ```

     container.html(""): clear the container

     you could use createPostHtml function from common.js 

     you need to populate the user again

     ```js
     // posts.js
     
     router.get("/", (req, res, next) => {
         Post.find()
         .populate("postedBy")
         .then(results => res.status(200).send(results))
         .catch(error => {
             console.log(error);
             res.sendStatus(400);
         })
     });
     ```

     just add .populate("postedBy") there!

     if you have anything else to populate

     just add another line .populate("blahblahblah")

   - order the posts from recent one to aged one(descending order)

     ```js
     // posts.js
     Post.find()
         .populate("postedBy")
         .sort({ "createdAt": -1 })
         .then(results => res.status(200).send(results))
     ```

     add sort line!

   

3. calculating the timestamp of the posts

   - google `javascript date to timestamp ago`

   - common.js

     ```js
     function timeDifference(current, previous) {
     
       var msPerMinute = 60 * 1000;
       var msPerHour = msPerMinute * 60;
       var msPerDay = msPerHour * 24;
       var msPerMonth = msPerDay * 30;
       var msPerYear = msPerDay * 365;
     
       var elapsed = current - previous;
     
       if (elapsed < msPerMinute) {
         if(elapsed/1000 < 30) return "Just now";
         return Math.round(elapsed/1000) + ' seconds ago';   
       }
     
       else if (elapsed < msPerHour) {
         return Math.round(elapsed/msPerMinute) + ' minutes ago';   
       }
     
       else if (elapsed < msPerDay ) {
         return Math.round(elapsed/msPerHour ) + ' hours ago';   
       }
     
       else if (elapsed < msPerMonth) {
         return Math.round(elapsed/msPerDay) + ' days ago';   
       }
     
       else if (elapsed < msPerYear) {
         return Math.round(elapsed/msPerMonth) + ' months ago';   
       }
     
       else {
         return Math.round(elapsed/msPerYear ) + ' years ago';   
       }
     }
     ```

     then call this function at createPostHtml function

     `const timestamp = timeDifference(new Date(), new Date(postData.createdAt));`

4. like button

   - PostSchema.js && UserSchema.js

     Post => likes: [{type: Schema.Types.ObjectId, ref: 'User' }]

     User => likes: [{type: Schema.Types.ObjectId, ref: 'Post' }]

   - button click handler

     ```js
     // common.js
     function createPostHtml(postData) {
       return `
       <div class="post" data-id="${postData._id}">
     	...
     	`
     }
     $(document).on("click", ".likeButton", (event => {
     	
     })
     ```

     - `$(".likeButton").click(event => {` it isn't work. because it's dynamic code. when the window loaded .likeButton Element hadn't been loaded. since it is loaded with other execution(get post). so you should change it.

     - document will listen whole click event, if the target is .likeButton element, than the third parameter, callback function will executed.

     - give post div(which wraps whole post) data

     - const rootElement = isRoot ? element : element.closest(".post");

       `element.closest(".post")`: closest is jQuery function that go up trees and finds an element has a class post.

   - the type of request matters

     - users of your rest API expect certain behaviour based on the request

     - Technically, you could use a post request for all types of request with specifying the type(post, delete, update,get). It will work but don't do it

     - get-> retrieve the data 

       /api/posts

     - post -> create a data

       /api/posts

     - put -> update the data

       /api/posts/id

     - delece -> get rid of the data

       /api/posts/id

   - make PUT request

     - common.js

       ```js
       $.ajax({
               url: `/api/posts/${postId}/like`,
               type: "PUT",
               success: postData => {
                   console.log(postData);
               }
           })
       ```

       - \$.get and $.post only. NO \$.put or delete out there.

       - actually $.get/post are just shortcut of \$.ajax.

         get/post can also written like that.

     - posts.js

       ```js
       router.put("/:id/like", asycn (req, res, next) => {
         const postId = req.params.id;
         const userId = req.session.user._id;  
         res.status(200).send("Yeah");
       })
       ```

       connect the ajax request you made in common.js with the server.

       `req.params.id`: params!! what you have passed through

   - check the user already liked the post

     - posts.js

       ```js
       const isLiked = req.session.user.likes && req.session.user.likes.includes(postId);
       ```

       if user have any liked posts then is it true that within the posts the user liked, this particular post is exists?

   - LIKE

     posts.js

     ```js
     // Insert user like
     const option = isLiked ? "$pull" : "$addToSet";
     User.findByIdAndUpdate(userId, { [option]: { likes: postId } })
     
     // Insert post like
     ```

     - User.find is also working. but like findByIdAndUpdate method works more efficiently.

     - when you want to update user's firstName 

       it would've been much easier

       User.findByIdAndUpdate(userId, { firstName: "hahahahaha" })

       find the user which has this `userId` and set the `firstName` `hahahahaha`.

       but likes are array.

     - `$addToSet` is the operator that mongodb offers to add items to set. opposite operator is `$pull`

       $addToSet: { likes: postId }: add `postId` to `likes` set

     - If the user liked this post already, you should remove the likes, and hadn't yet add the likes.

       addToSet and pull are work just same

       so make a variable.

       but it is impossible to use a variable like below

       `User.findByIdAndUpdate(userId, { option: { likes: postId } })`

       just add a bracket

       `User.findByIdAndUpdate(userId, { [option]: { likes: postId } })` for mongodb to recognize it.

     - add `await` before User.findByIdAndUpdate because it's asynchronous. without await, likes won't added to the array

     - unlike is not working yet because when you set isLiked var uses session.user. after like or unlike the post, sessio.user need to be changed!

       So, add `req.session.user = `await User.find~

       but still it stores the user **before** updated.

       add an option at the end `{ new: true }`

   - return the like result to the client

     - posts.js

       ```js
       const post = await Post.findByIdAndUpdate(postId, { [option]: { likes: userId }}, { new: true })
           .catch(error => {
               console.log(error);
               res.sendStatus(400);
           })
           res.status(200).send(post);
       ```

     - update the button

       ```js
       // common.js
       function createPostHtml(postData) {
         ...
         `
       	<button class="likeButton">
           <i class="far fa-heart"></i>
           <span>${postData.likes.length || ""}</span>
       	</button>
       	`
       }
       ```

       - if postData.likes.length is false => let it empty.

       ```js
       $.ajax({
               url: `/api/posts/${postId}/like`,
               type: "PUT",
               success: postData => {
                   button.find("span").text(postData.likes.length || "");
               }
           })
       ```

       within button, find span tag.

       by adding button.find~ line, the text besides like button will change immediately

       time to time, it doesn't changed because, the button is set as event.target(which you clicked). but if you click the i tag, there is no span within. to fix this!

       ```css
       button i,
       button span {
           pointer-events: none;
       }
       ```

     - change the button color

       the user logged in is liked it or not

       ```js
       // app.js
       app.get("/", middleware.requireLogin, (req, res, next) => {
       
         const payload = {
           pageTitle: "Home",
           userLoggedIn: req.session.user,
           userLoggedInJS: JSON.stringify(req.session.user)
         }
       
         res.status(200).render("home", payload);
       });
       ```

       userLoggedInJS is added.

       this one will be used at client side

       ```pug
       // main-layout.pug
       
       body
       		script.
       				const userLoggedIn = !{userLoggedInJS};
       ```

       add . after script!

       wrap userLoggedInJS with !{}.

       ```js
       // common.js
       
       success: postData => {
         button.find("span").text(postData.likes.length || "");
         if (postData.likes.includes(userLoggedIn._id)) {
           button.addClass("active");
         } else {
           button.removeClass("active");
         }
       }
       
       function createPostHtml(postData) {
         const likeButtonActiveClass = postData.likes.includes(userLoggedIn._id) ? "active" : "";
       
         return `
       	<button class="commentButton blue">
         	<i class="far fa-comment"></i>
         </button>
         <button class="retweetButton green">
           <i class="fas fa-retweet"></i>
         </button>
         <button class="likeButton ${likeButtonActiveClass} red">
           <i class="far fa-heart"></i>
         	<span>${postData.likes.length || ""}</span>
         </button>
       	`;
       }
       ```

       then css like `button.active.red`

       - make variable that can show wheter the logged in user is liked this particular post or not

         then give a class by its value

5. retweet

   - retweet handler

     ```js
     // common.js
     
     $(document).on("click", ".retweetButton", event => {
         const button = $(event.target);
         const postId = getPostIdFromElement(button);
     
         if (postId === undefined) return;
         $.ajax({
             url: `/api/posts/${postId}/retweet`,
             type: "POST",
             success: postData => {
                 button.find("span").text(postData.likes.length || "");
                 if (postData.likes.includes(userLoggedIn._id)) {
                     button.addClass("active");
                 } else {
                     button.removeClass("active");
                 }
             }
         })
     })
     ```

     use post request because retweet literally create new tweet

     ```js
     // posts.js
     router.post("/:id/retweet", async (req, res, next) => {
     
     });
     ```

   - update Schema

     ```js
     // PostSchema.js
     retweetUsers: [{type: Schema.Types.ObjectId, ref: 'User' }],
     retweetData: {type: Schema.Types.ObjectId, ref: 'Post' },
     ```

     `retweetEData` is not array. it's there for acknowledge it is original one...? I'm not certain yet.

   - try and delete retweet

     ```js
     // posts.js
     const deletedPost = await Post.findOneAndDelete({ postedBy: userId, retweetData: postId })
       .catch(error => {
         console.log(error);
         res.sendStatus(400);
       })
       const option = deletedPost != null ? "$pull" : "$addToSet";
     	let repost = deletedPost;
       if (repost == null) {
         repost = await Post.create({ postedBy: userId, retweetData: postId })
           .catch(error => {
           console.log(error);
           res.sendStatus(400);
         })
       }
     req.session.user = await User.findByIdAndUpdate(userId, { [option]: { retweets: repost._id }}, { new: true })
     
     const post = await Post.findByIdAndUpdate(postId, { [option]: { retweetUsers: userId }}, { new: true })
     
     ```

     - when the logged in user is not retweeted this post(which has the id same with postId) before, deletedPost couldn't find the post that matches condition. So, deletedPost's value is null
     - if repost == null if phrase passes, the user didn't retweeted before. So create new post(retweet).
     - when update the session, beaware that retweets value need to be reposts's id. not the id of original post.

   - show retweet result on the client side

     ```js
     // common.js
     success: postData => {
       button.find("span").text(postData.retweetUsers.length || "");
       if (postData.retweetUsers.includes(userLoggedIn._id)) {
         button.addClass("active");
       } else {
         button.removeClass("active");
       }
     }
     ```

     also update the createPostHtml function like `like` feature.(likeButtonActiveClass variable, span...)

     - rendering the retweet

       ```js
       // common.
       function createPostHtml(postData) {
         const isRetweet = postData.retweetData !== undefined;
         const retweetedBy = isRetweet ? postData.postedBy.username : null;
       
       }
       ```

       `isRetweet` is true when the post is retweetPost. original post's isRetweet value is false.

       populate the retweet post because it's just an Id so far.

       ```js
       // posts.js
       router.get("/", (req, res, next) => {
           Post.find()
           .populate("postedBy")
           .populate("retweetData")
       }
       ```

       since retweet data needed when the list up the posts, populate the retweetData at get request.

       also, populate the retweet's postedBy data.

       ```js
       // posts.js
       router.get("/", (req, res, next) => {
           Post.find()
           .populate("postedBy")
           .populate("retweetData")
           .sort({ "createdAt": -1 })
           .then(async results => {
               results = await User.populate(results, { path: "retweetData.postedBy" });
               res.status(200).send(results)
           })
       }
       ```

     - retweet indication

       insert a text above the retweet text that it is retweeted by logined user.

6. replying to posts

   - bootstrap modal

     ```html
     // mixins.pug
     mixin createReplyModal(userLoggedIn)
         #replyModal.modal.fade(tabindex='-1', role='dialog', aria-labelledby='replyModalLabel', aria-hidden='true')
             .modal-dialog(role='document')
                 .modal-content
                     .modal-header
                         h5#replyModalLabel.modal-title Reply
                         button.close(type='button', data-dismiss='modal', aria-label='Close')
                             span(aria-hidden='true') &times;
                     .modal-body
     										.postFormContainer
                             .userImageContainer
                                 img(src=userLoggedIn.profilePic, alt="user's profile picture")
                             .textareaContainer 
                                 textarea#replyTextarea(placeholder="What's happening?")
                     .modal-footer
                         button.btn.btn-secondary(type='button', data-dismiss='modal') Close
                         button#submitReplyButton.btn.btn-primary(type='button', disabled="") Reply
     ```

     and update +createReplyModal(userLoggedIn) code in `home.pug`

     make sure the button is connected to the function at common.js

   - reply button

     ```js
     $("#postTextarea, #replyTextarea").keyup(event => {
     ```

     when you need to list up the target remember! 

     NOT $("firstOne", "secondOne").keyup(blah)

     CORRECT `$("firstOne, secondOne").keyup(blah)`

     update #postTextarea's keyup event(common.js)

     for #replayTextarea's keyup event: reply button available

     ```js
     const isModal = textbox.parents(".modal").length == 1;
     ```

     if textbox has a .modal in any of his parent(than it is a length value of 1), isModal is true. if not the length will be 0 and isModal is false.

     ```js
     const submitButton = isModal ? $("#replyPostButton") : $("#submitPostButton");
     ```

     than update submitButton assignment

     ​	initially it was `const submitButton = $("#submitPostButton");`

   - make post request to create reply

     - `$("#replyModal").on("show.bs.modal", () => {})`: :star: **when bootstrap modal is show**, callback function at #replyModal. I couldn't beleave it executes for real.... bs for bootstrap is real trigger.. huh...

       `event.target`

       `event.relatedTarget`

     - make getPosts as a function(posts.js)

       | router.get("/", (req, res, next) => {...})                   | async function getPosts() {...}                              |
       | ------------------------------------------------------------ | ------------------------------------------------------------ |
       | Post.find()<br />.populate("postedBy")<br />.populate("retweetData")<br />.sort({ "createdAt": -1 })<br />.then(async results => {<br />results = await User.populate(results, { path: "retweetData.postedBy" });<br />res.status(200).send(results)<br />})<br />.catch(error => {<br />console.log(error);<br />res.sendStatus(400);;<br />}) | const results = await Post.find()<br />.populate("postedBy")<br />.populate("retweetData")<br />.sort({ "createdAt": -1 })<br />.catch(error => console.log(error));<br />return await User.populate(results, { path: "retweetData.postedBy" }); |

       ```js
       // posts.js
       router.get("/", async (req, res, next) => {
           const results = await getPosts();
           res.status(200).send(results);
       });
       
       
       ```

       when you use getPosts function, be aware that **it is async function. which means if you want to use it, you need to use async await.** that's why the first get request(which is for get all the posts at home page) becomes async function. If you don't use asycn await at get request, client throws an error. because we are sending just empty object.

     - make getPosts() get parameter

       without parameter it's just for whole posts.

       if you pass the parameter(like post id), the function will filter the results.

       ```js
       async function getPosts(filter) {
           const results = await Post.find(filter)
       ```

       - make sure the first get request(to get whole posts) pass the object, too. `const results = await getPosts({});`

       - because getPosts returns object,

         make `get` specific post request more specific.

         ```js
         let results = await getPosts({ _id: postId });
         results = results[0];
         ```

   - move outputPosts function from home.js to common.js

     I guess because it's getting common in use..?:D

     - make `#originalPostContainer` under .modal-body at mixins.pug

     - use that as a container at modal related request at common.js

       ```js
       $("#replyModal").on("show.bs.modal", event => {
           const button = $(event.relatedTarget);
           const postId = getPostIdFromElement(button);
           
           $.get(`/api/posts/${postId}`, results => {
               outputPosts(results, $("#originalPostContainer"))
           })
       })
       ```

     - SINCE outputPosts func requires `results` to be array. It uses forEach method on results. to fix this,

       ```js
       if (!Array.isArray(results)) {
               results = [results];
           }
       ```

       add this line in function before forEach line.

   - clear the modal when it is closed

     I don't see a problem by myself. according to teacher, if  the network get slow, you could see the original post of the one you clicked right before. and then change to the current one obviously. but anyway, you need to make sure there isn't one when you close it.

     ```js
     $("#replyModal").on("hidden.bs.modal", event => {
         $("#originalPostContainer").html("");
     })
     ```

   - send the reply to the server

     - update `$("#submitPostButton").click(event => {`

       to `$("#submitPostButton, #submitReplyButton").click(event => {`

       and textbox by isModal variable

     - when the modal shows, set a data

       `$("#submitReplyButton").data("id", postId);`

       `$("#submitReplyButton").attr("data-id", postId);`

       if you use second method, you could see the data attribute at element. first one, you couldn't see it but still there.

       either way you could use data.

     - handle the data (when submitReplyButton is clicked)

       ```js
       if (isModal) {
         const id = button.data().id;
         if (id == null) return alert("button id is null");
       
         data.replyTo = id;
       }
       ```

       `data.replyTo = id;` it is set the replyTo property of data object as id.

     - inserting reply to db

       ```js
       // PostSchema.js
       
       replyTo: {type: Schema.Types.ObjectId, ref: 'Post' },
       
       ```

       ```js
       // posts.js
       
       if (req.body.replyTo) {
         postData.replyTo = req.body.replyTo
       };
       ```

   - reload the page after submit a reply

     ```js
     // common.js
     if(postData.replyTo) {
       location.reload();
     } else { 
       // when it is a response of a create a post(not reply)
     }
     ```

     :wrench: I hope it remembers where it was. event if reload it just stay the scroll's postion

   - output the reply

     - posts.js

       getPosts() -> populate replyTo field

       -> populate who posted it

       

     - update createPostHtml() 

       ```js
       let replyFlag = "";
           if (postData.replyTo) {
               if (!postData.replyTo.postedBy._id) return alert("Reply to is not populated");
               const replyToUsername = postData.replyTo.postedBy.username;
               replyFlag = `
               <div class="replyFlag">
                   Replying to <a href="/profile/${replyToUsername}">@${replyToUsername}</a>
               </div>
               `;
           }
       ```

## Posts page

1. create posts page

   - send the user to posts page when click a single post(common.js)

     ```js
   if (postId !== undefined && !element.is("button")) {
       window.location.href = `/post/${postId}`;
     }
     ```
     
     if postId is not undefined AND element you clicked is not button => go to post page with postId

     because there are several buttons within post, important to do a second part of if phrase.

2. routes/postRoutes.js

   ```js
   router.get("/:id", (req, res, next) => {
   	const payload = {
           pageTitle: "View Post",
           userLoggedIn: req.session.user,
           userLoggedInJS: JSON.stringify(req.session.user),
           postId: req.param.id
       }
       
       res.status(200).render("postPage", payload);
   });
   ```

   - why just `/:id`..? its `/post/${postID}`.. hmmmm

     because!!! at app.js I'll set postRoute like this.

     `app.use("/post", postRoute);`

   - since vscode warn me not use deprecated `param`, i'll use `params` instead.

3. views/postPage.pug

   ```pug
   extends layout/main-layout.pug
   
   block content 
   		script.
           const postId = `!{postId}`
       .postContainer 
   
       +createReplyModal(userLoggedIn)
   
   
   block scripts 
       script(src="/js/postPage.js")
   ```

   make postId variable at pug, because that page has a postId that passed by payload and I need to use that postId on the js file. 

   postId is wrapped by backtick, because we will use it as a string

4. public/js/postPage.js

   ```js
   $(document).ready(() => {
       $.get(`/api/posts/${postId}`, results => {
           console.log('sdkjfsdl');
           outputPosts(results, $(".postsContainer"));
       })
   })
   ```

   ksdfjl;kasdjfl;kdsfjl;skdafjsld;kfjlkdsjfdsklfjdslk

   ha.....I thought it would not be a problem.. but apparently I don't have enough knowledge about server...

   I've set the post route as `post` and the teacher set it `posts`. So I thought posts in postPage.js also need to be post. and it was not. because it is not requesting postPage, it is just a request for getting particular post

5. app.js

   ```js
   const postRoute = require("./routes/postRoutes");
   app.use("/post", middleware.requireLogin, postRoute);
   ```

   :question: by adding middleware.requireLogin you could redirect to the login page when restart the server. but why not other routes need that..? because they are working under the `/`page..?

6. load the replies!

   - change router.get("/:id") at posts.js

     ```js
     router.get("/:id", async (req, res, next) => {
         const postId = req.params.id;
         let postData = await getPosts({ _id: postId });
         postData = postData[0];
     
         const results = {
             postData: postData,
         }
         if (postData.replyTo !== undefined) {
             results.replyTo = postData.replyTo;
         }
         results.replies = await getPosts({ replyTo: postId })
         res.status(200).send(results);
     
     });
     ```

     results => postData

     and declares results

     then set properties of results

     `results.replies` is get all the posts that replying to this post

     before change it, `results` we sent as a response is post itself. now it is an object.

     so change some at common.js like below

     ```js
     $("#replyModal").on("show.bs.modal", event => {
         const button = $(event.relatedTarget);
         const postId = getPostIdFromElement(button);
         $("#submitReplyButton").data("id", postId);
         $.get(`/api/posts/${postId}`, results => {
             outputPosts(results.postData, $("#originalPostContainer"))
         })
     })
     ```

     I've changed one thing at outputPosts(). first param was results, not it's results.postData.

     and update postPage.js

     ```js
     $(document).ready(() => {
         $.get(`/api/posts/${postId}`, results => {
             outputPostsWithReplies(results, $(".postsContainer"));
         })
     })
     ```

     outputPosts -> outputPostsWithReplies

     and make outputPostsWithReplies function at common.js

     ```js
     function outputPostsWithReplies(results, container) {
         container.html("");
         if (results.replyTo !== undefined && results.replyTo._id !== undefined) {
             const html = createPostHtml(results.replyTo);
             container.append(html);
     
         }
         const mainPostHtml = createPostHtml(results.postData);
         container.append(mainPostHtml);
     
         results.replies.forEach(result => {
             const html = createPostHtml(result)
             container.append(html);
         });
     }
     ```

     - reply to reply throws an error

       make createPostHtml function check it

       ```js
       let replyFlag = "";
           if (postData.replyTo && postData.replyTo._id) {
       ```

       second part of if phrase has beed added.

7. which is the post that we are viewing

   update createPostHtml function

   ```js
   function createPostHtml(postData, largeFont = false) {
     const largeFontClass = largeFont ? "largeFont" : "";
     return `
   	<div class="post ${largeFontClass}" data-id="${postData._id}">  
   ```

   by setting the second param a default value, it is OK to hand over just one param to this function.

   and when call the createPostHtml for replyTo post, hand over second param as `true`.

   ## delete the post

1. make delete button

   ```pug
   // mixins.pug
   mixin createDeletePostModal()
   ```

   ```pug
   // home.pug && postPage.pug
   +createDeletePostModal()
   ```

   since it makes both home and postPage.pug have two lines(`+createReplyModal(userLoggedIn)`, `+createDeletPostModal()`.

   SO make the mixin and replace them.

   ```pug
   // mixins.pug
   mixin createPostModals(userLoggedIn)
   	+createReplyModal(userLoggedIn)
   	+createDeletePostModal()
   ```

   ```pug
   // home.pug && postPage.pug
   +createPostModals(userLoggedIn)
   ```

   

   ```js
   // common.js
   function createPostHtml(postData, largeFont = false) {
     ...
     
     let buttons = "";
       if (postedBy._id == userLoggedIn._id) {
           buttons = `<button data-id="${postData._id}" data-toggle="modal" data-target="#deletePostModal"><i class="fal fa-times"></i></button>`
       };
     
     return `
   	...
     <div class="postHeader">
       <a href="/profile/${postedBy.username}" class="displayName">${displayName}</a>
       <span class="username">@${postedBy.username}</span>
       <span class="date">${timestamp}</span>
       ${buttons}
     </div>
   	...
   	`;
   }
   ```

2. ajax call

  - get the postId

    ```js
    // common.js
    $("#deletePostModal").on("show.bs.modal", event => {
        const button = $(event.relatedTarget);
        const postId = getPostIdFromElement(button);
        $("#deletePostButton").data("id", postId);
        console.log($("deletePostButton").data().id);
    })
    ```

  - make request

    ```js
    $("#deletePostButton").click(event => {
        const id = $(this).data("id");
        
        $.ajax({
            url: `/api/posts/${postId}`,
            type: "DELETE",
            success: () => {
                location.reload();
            }
        })
    })
    ```

    unlike likesButton or retweetButton, deletePostButton are there when document is loaded. it is rendered by the mixins.pug

    other two is rendered by the function in common.js.

    of course, you could use same tactic to deletePostButton.

  

3. handle route

   ```js
   // posts.js
   router.delete("/:id", (req, res, next) => {
       Post.findByIdAndDelete(req.params.id)
       .then(() => {
           res.sendStatus(202);
       })
       .catch(error => {
           console.log(error);
           res.sendStatus(400);
       })
   });
   ```

   - if you want to check the status, update #deletePostButton click event.

     ```js
     // common.js
     success: (data, status, xhr) => {
       if (xhr.status != 202) {
         alert("Could not delete the post");
         return;
       }
       location.reload();
     }
     ```

## Profile page

1. profile route

   - routes/profileRoutes.js

     ```js
     router.get("/", (req, res, next) => {
     	const payload = {
             pageTitle: req.session.user.username,
             userLoggedIn: req.session.user,
             userLoggedInJS: JSON.stringify(req.session.user),
             profileUser: req.session.user
         }
         
         res.status(200).render("profilePage", payload);
     });
     router.get("/:username", async (req, res, next) => {
     	const payload = await getPayload(req.params.username, req.session.user);
         res.status(200).render("profilePage", payload);
     });
     
     async function getPayload(username, userLoggedIn) {
         let user = await User.findOne({ username: username });
         if (user == null) {
             user = await User.findById(username);
             if (user == null) {
                 return {
                     pageTitle: "User not found",
                     userLoggedIn: userLoggedIn,
                     userLoggedInJS: JSON.stringify(userLoggedIn),
                 };
             }
         }
         return {
             pageTitle: user.username,
             userLoggedIn: userLoggedIn,
             userLoggedInJS: JSON.stringify(userLoggedIn),
             profileUser: user
         };
     }
     ```

     - first get request is for my own profile page

     - there was an error again related to promise.

       REMEMBER when you use async-await in function or whatever, you need to use async-await again when you call that function or whatever in another function.

     - if you couldn't find the user by username, just check if there is user with the id.

       BUT, it gives me an error `UnhandledPromiseRejectionWarning: CastError: Cast to ObjectId failed for value`. Because username I gave in the url was like `dkdkk`. and mongoose won't take it as a ObjectId. 

       how to fix?

       ```js
       if (id.match(/^[0-9a-fA-F]{24}$/)) {
         // Yes, it's a valid ObjectId, proceed with `findById` call.
       }
       ```

       wrap the findById code with this if phrase

2. app.js

   ```js
   const profileRoute = require("./routes/profileRoutes");
   app.use("/profile", middleware.requireLogin, profileRoute);
   ```

3. profile page

   - views/profilePgae.pug

     ```pug
     span #{profileUser ? profileUser.firstName : ""}
     ```

     ```pug
     if !profileUser
     	h1 User not found 
     else 
     	span #{profileUser.firstName}
     ```

     choose either way.

     by #{}, you could use js grammer

     you could use if/else phrase in pug

     - how to add br tag in .pug

       1. ```pug
          div.
          	I'd like to break #[br] line.
          ```

          add `#[br]`

          The dot at the end of the tag is used to enter large blocks of plain text in a simpler way, so the following indented block is treated as text. #[br] will work without the dot at the end.

       2. ```pug
          div Av José Vasconcelos 804-A Pte.
            br
            | Col. Los Sabinos,CP. 66220
            
          div
          	| Av Jose
          	br
          	| Col. Los
          ```

4. make follow button with mixin

   ```pug
   mixin createFollowButton(user, isFollowing)
       - text = isFollowing ? "Following" : "Follow"
       - buttonClass = isFollowing ? "followButton following" : "followButton"
       button(class=buttonClass, data-user=user._id) #{text}
   ```

   `-` makes variable in pug file

   you could add class like that in pug

   add `+createFollowButton(profileUser, true)` in profilePage.pug

5. make tabs with mixin

   ```pug
   mixin createTab(name, href, isSelected)
       - className = isSelected ? "tab active" : "tab"
       a(href=href, class = className)
           span #{name}
   ```

6. load posts

   - profilePage.pug

     ```pug
     script.
     			const profileUserId = `!{profileUser._id}`;
     ```

     to use at profie.js

   - public/js/profile.js

     ```js
     $(document).ready(() => {
         loadPosts();
     });
     
     function loadPosts() {
         $.get("/api/posts", { postedBy: profileUserId }, results => {
             outputPosts(results, $(".postsContainer"));
         })
     }
     ```

     it displays all posts

     how to fix it?(update the get request at posts.js)

     ```js
     // posts.js
     router.get("/", async (req, res, next) => {
         const searchObj = req.query;
         const results = await getPosts(searchObj);
         res.status(200).send(results);
     });
     ```

   - separate the replies

     update the loadPosts() in profile.js

     ```js
     $.get("/api/posts", { postedBy: profileUserId, isReply: false }, results => {
     ```

     and update posts.js

     ```js
     router.get("/", async (req, res, next) => {
         const searchObj = req.query;
         if (searchObj.isReply !== undefined) {
             const isReply = searchObj.isReply == "true";
             searchObj.replyTo = { $exists: isReply };
             delete searchObj.isReply;
         }
         const results = await getPosts(searchObj);
         res.status(200).send(results);
     });
     ```

     if searchObj.isReply's value equals "true", isReply's value is true.

     searchObj.replyTo's existance is depend on the isReply value.

     because isReply is not in the postSchema, you need to delete it before getPosts() filter it.
     that's the way to delete the property of javascript object.

     if you change the isReply value as true, you could see the replies only -> that's how to make replies tab

7. Replies tab

   - profileRoutes.js

     ```js
     router.get("/:username/replies", async (req, res, next) => {
     	const payload = await getPayload(req.params.username, req.session.user);
         payload.selectedTab = "replies";
         res.status(200).render("profilePage", payload);
     });
     ```

   - profilePage.pug

     another variable under the script. `selectedTab`

     ```pug
     script.
       const profileUserId = `!{profileUser._id}`;
       const selectedTab = `!{selectedTab}`;
       
     .tabsContainer 
       +createTab("Posts", `/profile/${profileUser.username}`, selectedTab != "replies")
       +createTab("Replies", `/profile/${profileUser.username}/replies`, selectedTab == "replies")
     ```

     if there is third tab, you need to change it like below.

     +tabs("posts", ..., selectedTab != "replies" && selectedTab != "messages")

     +tabs("replies", ..., selectedTab == "replies")

     +tabs("messages", ..., selectedTab == "messages")

     :wrench: why it needed to be reloaded?

   - profile.js

     ```js
     $(document).ready(() => {
         if (selectedTab === "replies") {
             loadReplies();
         } else {
         loadPosts();
         }
     });
     ```

     make loadReplies() which is identical with loadPosts() but isReply is true.

   +) Since bootstrap row class sets margin-right -15px, it is not right(unnecessary scroll at the bottom). just set it 0

## Follow

1. Update UserSchema.js

   following: [{type: Schema.Types.ObjectId, ref: 'User' }],

   followers: [{type: Schema.Types.ObjectId, ref: 'User' }],

   you could use only following field and when you need followers just find it. but that will cost expensive.

2. Follow button

   - get the user id when click it

     ```js
     // common.js
     $(document).on("click", ".followButton", event => {
         const button = $(event.target);
         const userId = button.data().user;
       	console.log(userId);
     });
     ```

     - `button.data().user`: user here is what you set at the mixin.pug - createFollowButton
     - just remember to check the data all the time! if you don't do this now, it's hard to figure out later.

   - ajax call

     - common.js

       ```js
       $(document).on("click", ".followButton", event => {
           const button = $(event.target);
           const userId = button.data().user;
           
           $.ajax({
               url: `/api/users/${userId}/follow`,
               type: "PUT",
               success: data => {
                   console.log(data);
               }
           })
       });
       ```

       since it's updating the data, type is PUT

     - routes/api/users.js: make end point

       ```js
       router.put("/:userId/follow", async (req, res, next) => {
           res.status(200).send("fly away");
       });
       ```

       - add usersApiRoute at app.js

   - check if the user is already following the person

     ```js
     // users.js
     router.put("/:userId/follow", async (req, res, next) => {
         const userId = req.params.userId;
     
         const user = await User.findById(userId);
         if (user == null) return res.sendStatus(404);
         
         const isFollowing = user.followers && user.followers.includes(req.session.user._id);
     
         res.status(200).send(isFollowing);
     });
     ```

   - follow/unfollow

     same logic with like/unlike post

     but follow feature needs both following and followers need to be updated.

     ```js
     // users.js
     req.session.user = await User.findByIdAndUpdate(req.session.user._id, { [option]: { following: userId } }, { new: true })
         .catch(error => {
             console.log(error);
             res.sendStatus(400);
         })
     
         User.findByIdAndUpdate(userId, { [option]: { followers: req.session.user._id } })
         .catch(error => {
             console.log(error);
             res.sendStatus(400);
         })
     ```

     you don't need `new:  true` with followers updating, because you will not use the result data.

3. change the button

   - common.js

     ```js
     $(document).on("click", ".followButton", event => {
         const button = $(event.target);
         const userId = button.data().user;
         
         $.ajax({
             url: `/api/users/${userId}/follow`,
             type: "PUT",
             success: (data, status, xhr) => {
                 if (xhr.status == 404) {
                     return;
                 }
               	if (data.following && data.following.includes(userId)) {
                     button.addClass("following");
                 } else {
                     button.removeClass("following");
                 }
             }
         })
     });
     ```

     :wrench: if you want to show users the user you want to follow is not exist, do something at `if (xhr.status == 404)`.

   - profilePage.pug

     ```pug
     .profileButtonsContainer 
       if profileUser._id != userLoggedIn._id 
      	 	a.profileButton(href=`/messages/${profileUser._id}`)
       		i.fas.fa-envelope
       	- const profileUserId = profileUser._id.toString()
       	- if (userLoggedIn.following && userLoggedIn.following.includes(profileUserId))
       		+createFollowButton(profileUser, true)
       	- else 
       		+createFollowButton(profileUser, false)
     ```

     I'd like to check the if clause(that is this user follows the profilePage's user) which needs `includes` method. but with pug, I couldn't use includes. so I need to use js code.

     if you want to use js code in pug, add `dash + space` in front of the js code.

     and since it is js code from there, parenthesis is needed.

     what I need to pass to the includes is profileUser._id. but it is not string, so change it by another js code.

     So far, color is changing but text is not change immediately(it changes when refresh the page)

     add `button.text("following")/("follow")` at the common.js

4. following/followers count

   - profilePage.pug: add an id to the span

     ```pug
     .followersContainer 
                         a(href=`/profile/${profileUser.username}/following`)
     	span#followingValue.value #{0}
     	span Following
                         a(href=`/profile/${profileUser.username}/followers`)
     	span#followersValue.value #{0}
     	span Followers
     ```

   - common.js: update ajax call

     ```js
     const followersLabel = $("#followersValue");
     if (followersLabel.length != 0) {
       followersLabel.text("hi");
     }
     ```

     if you click the follow button(or following whichever), the text before followers changes to hi.

     ```js
     let difference = 1;
     if (data.following && data.following.includes(userId)) {
       button.addClass("following");
       button.text("Following");
     } else {
       button.removeClass("following");
       button.text("Follow");
       difference = -1;
     }
     const followersLabel = $("#followersValue");            
     if (followersLabel.length != 0) {
       let followersText = parseInt(followersLabel.text());
       followersLabel.text(followersText + difference);
     }
     ```

     difference var change to -1 when you are unfollow the profileUser.

     by set difference var, changing text command looks cool.

   - profilePage.pug: render the followers/following count at first.

     ```pug
     - const followingCount = profileUser.following.length;
     - const followersCount = profileUser.followers.length;
     
     .followersContainer 
       a(href=`/profile/${profileUser.username}/following`)
         span#followingValue.value {followingCount}
         span Following
       a(href=`/profile/${profileUser.username}/followers`)
         span#followersValue.value #{followersCount}
         span Followers
     ```

     I don't know why.. but even if without declaration of variable or semicolon at the end like below, it is working.

     `- followersCount = profileUser.followers.length`

5. following/followers page

   - views/follow.pug: create page

     ```pug
     extends layouts/main-layout.pug
     
     block content 
         if !profileUser
             .no-result.
                 there is no corresponding user. #[br]check the url you are trying to access
         else
             script.
                 const profileUserId = `!{profileUser._id}`;
                 const selectedTab = `!{selectedTab}`;
             .tabsContainer 
                 +createTab("Following", `/profile/${profileUser.username}/following`, selectedTab != "followers")
                 +createTab("Followers", `/profile/${profileUser.username}/followers`, selectedTab == "followers")
             .resultsContainer
     
     block scripts 
         script(src="/js/follow.js")
     ```

   - profileRoutes.js

     ```js
     router.get("/:username/following", async (req, res, next) => {
     	const payload = await getPayload(req.params.username, req.session.user);
         payload.selectedTab = "following";
         res.status(200).render("follow", payload);
     });
     
     router.get("/:username/followers", async (req, res, next) => {
     	const payload = await getPayload(req.params.username, req.session.user);
         payload.selectedTab = "followers";
         res.status(200).render("follow", payload);
     });
     ```

     now, when you click the follow

   - public/js/follow.js: get the users

     ```js
     $(document).ready(() => {
       if (selectedTab === "followers") {
         loadFollowers();
       } else {
         loadFollowing();
       }
     });
     
     function loadFollowers() {
       $.get(`/api/users/${profileUserId}/followers`, results => {
         outputUsers(results, $(".resultsContainer"));
       })
     }
     
     function loadFollowing() {
       $.get(`/api/users/${profileUserId}/following`, results => {
         outputUsers(results, $(".resultsContainer"));
       })
     }
     
     function outputUsers(data, container) {
       console.log(data);
     }
     ```

     - users.js: handle the request

       ```js
       router.get("/:userId/following", async (req, res, next) => {
           User.findById(req.params.userId)
           .populate("following")
           .then(results => {
               res.status(200).send(results);
           })
           .catch(error => {
               console.log(error);
               res.sendStatus(400);
           })
       });
       ```

       above code is same for followers url

       you could send results.following/results.followers instend of results.

       Or when you call outputUsers at follow.js pass the argument results.following/results.followers.

     - update outputUsers()

       ```js
       function outputUsers(results, container) {
           container.html("");
           results.forEach(result => {
               const html = createUserHtml(result, true);
               container.append(html);
           });
       
           if (results.length == 0) {
               container.append("<span class='noResults'>No results found</span>")
           }
       }
       
       function createUserHtml(userData, showFollowButton) {
           const name = userData.firstName + " " + userData.lastName;
           return `
           <div class="user">
               <div class="userImageContainer">
                   <img src="${userData.profilePic}">
               </div>
               <div class="userDetailsContainer">
                   <div class="header">
                       <a href="/profile/${userData.username}">${name}</a>
                       <span class="username">@${userData.username}</span>
                   </div>
               </div>
           </div>
           `;
       }
       ```

       createUserHtml's 2nd parameter, showFollowButton, will be used later when the function is called under different circumstance.

       :star:Try to use these small reusable functions!

       

6. add the follow button to the user list

   update createUserHtml()

   ```js
   const isFollowing = userLoggedIn.following && userLoggedIn.following.includes(userData._id);
       const text = isFollowing ? "Following" : "Follow";
       const buttonClass = isFollowing ? "followButton following" : "followButton";
       let followButton = "";
       if (showFollowButton && userLoggedIn._id != userData._id) {
           followButton = `
           <div class="followButtonContainer">
               <button class="${buttonClass}" data-user="${userData._id}">${text}</button>
           </div>
           `;
       }
   ```

   since it's follow button like in other pages, go to the mixins.pug and make sure you have same properties.

   isFollowing declaration comes from profilePage.pug

   and inside of return text after .userDetailsContainer div insert `${followButton}`

7. display following people's post only at home

   - home.js

     ```js
     $.get("/api/posts", { followingOnly: true }, results => {
     ```

     {} is how you pass the data through ajax call.

   - posts.js: update get posts reqest...(umm.. get posts response..?)

     ```js
     if (searchObj.followingOnly !== undefined) {
             const followingOnly = searchObj.followingOnly == "true";
             if (followingOnly) {
                 let objectIds = req.session.user.following;
                 objectIds.push(req.session.user._id);
                 searchObj.postedBy = { $in: objectIds };
             }
             delete searchObj.followingOnly;
     ```

     by push my own id, I could see my own post at home feed

     `        searchObj.postedBy = { $in: objectIds };`: only if searchObj's postedBy is in objectIds array.(ObjectIds var is array because req.session.user.following is array(that's what we set at the UserSchema))

     As in isReply right above(in the code), searchObj.followingOnly is need to be deleted cause UserSchema doesn't have such field.

8. :bug: if you click the profile at the nav, it renders my profile page. and it does add the following number text. 

   it's because as we update get posts request, we add our own id to objectIds.

   that makes it count you.(actually.. I don't get it.. is it shallow copy/ deep copy thing..? but though it add count, refresh the page make count normal.... )

   fix it

   ```js
   let objectIds = [];
   if (!req.session.user.following) {
     req.session.user.following = [];
   }
   req.session.user.following.forEach(user => {
     objectIds.push(user);
   })
   objectIds.push(req.session.user._id);
   searchObj.postedBy = { $in: objectIds };
   ```

   if phrase is for prevent error. if user doesn't have following forEach method will cause error. so make sure it is array.

## Profile Picture

1. picture upload button

   - profilePage.pug

     ```pug
     .userImageContainer 
     	img(src=profileUser.profilePic, alt="user profile image")
     	if profileUser._id == userLoggedIn._id 
     		button.profilePictureButton(data-toggle="modal", data-target="#imageUploadModal")
     			i.fas.fa-camera
     ```

     

2. image upload modal

   - mixins.pug

     ```pug
     mixin createImageUploadModal()
         #imageUploadModal.modal.fade(tabindex='-1', role='dialog', aria-labelledby='imageUploadModalLabel', aria-hidden='true')
             .modal-dialog(role='document')
                 .modal-content
                     .modal-header
                         img(src="/images/leaf.png", alt="")
     
                         h5#imageUploadModalLabel.modal-title Upload a new profile picture
                         button.close(type='button', data-dismiss='modal', aria-label='Close')
                             span(aria-hidden='true') &times;
                     .modal-body
                         p You won't be able to delete this
                     .modal-footer
                         button#imageUploadButton.postButton(type='button') Save
     ```

     almost identical with createDeletePostModal()

   - profilePage.pug

     ```pug
     +createImageUploadModal()
     ```

3. cropper js

   https://www.npmjs.com/package/cropperjs

   - cropper js cdn, main-layout.pug

     since we could use image upload elsewhere not only profilePage, script is added to the main-layout.

     ```html
     <!-- before bootstrap stylesheet -->
     <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/cropperjs/1.5.11/cropper.min.css" integrity="sha512-NCJ1O5tCMq4DK670CblvRiob3bb5PAxJ7MALAz2cV40T9RgNMrJSAwJKy0oz20Wu7TDn9Z2WnveirOeHmpaIlA==" crossorigin="anonymous" referrerpolicy="no-referrer" />
     
     <!-- after bootstrap jquery -->
     <script src="https://cdnjs.cloudflare.com/ajax/libs/cropperjs/1.5.11/cropper.min.js" integrity="sha512-FHa4dxvEkSR0LOFH/iFH0iSqlYHf/iTwLc5Ws/1Su1W90X0qnxFxciJimoue/zyOA/+Qz/XQmmKqjbubAAzpkA==" crossorigin="anonymous" referrerpolicy="no-referrer"></script>
     ```

     ```css
     /* Ensure the size of the image fit the container perfectly */
     img {
       display: block;
       /* This rule is very important! */
       max-width: 100%;
     }
     ```

   - load the image preview

     mixins.pug: put image upload feature where it will rendered

     ```pug
     .modal-body
       input#filePhoto(type="file", name="filePhoto")
       .imagePreviewContainer
       	img#imagePreview(src="", alt="")
     
     ```

     common.js

     ```js
     $("#filePhoto").change(event => {
         const input = $(event.target)[0];
         if (input.files && input.files[0]) {
             const reader = new FileReader();
             reader.onload = () => {
                 console.log("loaded");
             }
             reader.readAsDataURL(input.files[0]);
         }
     })
     ```

     at first: `const input = $(event.target);`

     then it throws an error, because input.files is undefined.

     input[0].files worked. so I declare the input with [0]

     BUT, if you change the function from arrow to regular and replace event with this like below, it works too..!

     ```js
     $("#filePhoto").change(function() {
         if (this.files && this.files[0]) {
             const reader = new FileReader();
             reader.onload = () => {
                 console.log("loaded");
             }
             reader.readAsDataURL(this.files[0]);
         }
     })
     ```

     SO... choose either one. I'll go to the first one.

     ------

     update the function to load the preview

     ```js
     reader.onload = (e) => {
       $("#imagePreview").attr("src", e.target.result); 
     }
     ```

     now you could see the preview

   - crop it

     ```js
     // common.js
     // at the top
     let cropper;
     
     ...
     
     reader.onload = (e) => {
       const image = document.getElementById("imagePreview");
       image.src = e.target.result;
       if (cropper !== undefined) {
         cropper.destroy();
       }
       cropper = new Cropper(image, {
         aspectRatio: 1 / 1,
         background: false
       })
     }
     ```

     `$("#imagePreview").attr("src", e.target.result); ` 
     == `const image = document.getElementById("imagePreview");`
     ` image.src = e.target.result;`

   - image to a blob

     blob: Binary Large OBject

     ```js
     $("#imageUploadButton").click(() => {
         const canvas = cropper.getCroppedCanvas();
         if (canvas == null) return alert("Could not upload image.");
         canvas.toBlob(blob => {
             const formData = new FormData();
             formData.append("croppedImage", blob);
             console.log(formData);
         })
     })
     ```

     

   - ajax call

     ```js
     // common.js
     $("#imageUploadButton").click(() => {
         const canvas = cropper.getCroppedCanvas();
         if (canvas == null) return alert("Could not upload image.");
         canvas.toBlob(blob => {
             const formData = new FormData();
             formData.append("croppedImage", blob);
             $.ajax({
                 url: "/api/users/profilePicture",
                 type: "POST",
               	data: formData,
                 processData: false,
                 contentType: false,
                 success: () => {
                     location.reload();
                 }
             })
         })
     })
     ```

     `processData: false` Not to convert form data to String.

     `contentType: false` forces jQuery not to add a contentType header with its request. without this option, jQuery add a contentType header itself. which is `boundary string`. 

   - access the image on the server

     - npm install multer

       multer is middleware: insert between url and (req, res, next) like middleware.requireLogin

     ```js
     // users.js
     const multer = require("multer");
     const upload = multer({ dest: "uploads/" });
     
     router.post("/profilePicture", upload.single("croppedImage"), async (req, res, next) => {
         if (!req.file) {
             console.log("No file uploaded with ajax request.")
             return res.sendStatus(400);
         }
         res.sendStatus(200);
     });
     ```

     dest is for destination.

     and make that destination folder at root folder.

     `upload.single("croppedImage")`: single is multer's function which processes a single file from what's passed. croppedImage is what you send at common.js If you need to handle multiple files use `upload.array()` instead.

     just by far, if you click the save button, it stores a file(not image) in uploads folder.

   - store the uploaded image

     ```js
     const path = require("path");
     const fs = require("fs");
     
     router.post("/profilePicture", upload.single("croppedImage"), async (req, res, next) => {
         if (!req.file) {
             console.log("No file uploaded with ajax request.")
             return res.sendStatus(400);
         }
         const filePath = `/uploads/images/${req.file.filename}.png`;
         const tempPath = req.file.path;
         const targetPath = path.join(__dirname, `../../${filePath}`);
         fs.rename(tempPath, targetPath, error => {
             if(error != null) {
                 console.log(error);
                 return res.sendStatus(400);
             }
             res.sendStatus(200);
         });
     });
     ```

     make images folder within uploads folder

     filePath's filename is with lower case n. not N.

     rename(old one, new one, callback func)

     now when you click the save button, the image is in uploads/images folder

   - update the picture in db

     ```js
     fs.rename(tempPath, targetPath, async error => {
       if(error != null) {
         console.log(error);
         return res.sendStatus(400);
       }
       req.session.user = await User.findByIdAndUpdate(req.session.user._id, { profilePic: filePath }, { new: true })
     
       res.sendStatus(204);
     });
     ```

     update the fs.rename's callback function to async.

     html 204: success but no content(no data to give it back)

     by far, profile picture won't change.

     to fix it? handle the image route.

     - routes/uploadRoutes.js

       ```js
       const path = require("path");
       
       router.get("/images/:path", (req, res, next) => {
           res.sendFile(path.join(__dirname, "../uploads/images/" + req.params.path));
       });
       ```

     - app.js

       register uploadRoutes.

     

## Cover Photo

1. upload button - modal

   - profilePage.pug

     same logic with profile picture upload

     to write css more efficient... change pug a bit.

     ```pug
     .coverPhotoSection
       .coverPhotoContainer
         if profileUser._id == userLoggedIn._id 
           button.imageUploadButton(data-toggle="modal", data-target="#coverPhotoUploadModal")
           	i.fas.fa-camera
       .userImageContainer 
         img(src=profileUser.profilePic, alt="user profile image")
           if profileUser._id == userLoggedIn._id 
           	button.imageUploadButton(data-toggle="modal", data-target="#imageUploadModal")
           		i.fas.fa-camera
     ```

   - mixins.pug

     make createCoverPhotoUploadModal() which is same with createImageUploadModal() but change names with coverPhoto

     and add that to profilePage.pug

2. cropping

3. - common.js

     just same with profile picture. but be aware of names of id.

     and aspectRatio need to be 16/9

     when you click the upload, ratio works but there is scale issue. too many spaces. it's because of css. there is a css that cropper js needed for imagePreview. since we've changed a name of preview's id, add that id to css.

     ```css
     #imagePreview, #coverPhotoPreview {
         display: block;
         width: 100%; 
         max-width: 100%;
     }
     ```

   

4. upload cover photo

   - common.js

     same with profile picture. be aware of id and url.

   - users.js

     same but url and field name.

     since we don't have a coverPhoto field in user yet.

     update userSchema

   - UserSchema.js

     ```js
     coverPhoto: { type: String },
     ```

     didn't set a default because currently default cover photo is color with css. 

   So far, it is uploaded to db. but couldn't see it on profile page.

   - how to display it?

     ```pug
     // profilePage.pug
     .coverPhotoContainer
       if profileUser.coverPhoto
       	img(src=profileUser.coverPhoto, alt="cover photo")
     ```

     you can see it, but scale issue again.

     ```css
     .coverPhotoContainer img {
         width: 100%;
         height: 100%;
         object-fit: cover;
     }
     ```

## Pin a Post

1. modal

   - update createPostHtml function at common.js

     ```js
     let buttons = ``;
         if (postedBy._id == userLoggedIn._id) {
             buttons = `
             <button class="pinPostButton" data-id="${postData._id}" data-toggle="modal" data-target="#confirmPinModal"><i class="fas fa-thumbtack"></i></button>
             <button class="deletePostButton" data-id="${postData._id}" data-toggle="modal" data-target="#deletePostModal"><i class="fas fa-times"></i></button>
             `
         };
     ```

   - mixins.pug

     make createPinnedPostModal.

     and update createPostModals(userLoggedIn).

     since you need this pin feature anywhere if there is a post.

     ```pug
     mixin createPostModals(userLoggedIn)
         +createReplyModal(userLoggedIn)
         +createDeletePostModal()
         +createPinnedPostModal()
     ```

     

2. pin a post

   - common.js

     similer to delete the post

     ```js
     $("#confirmPinModal").on("show.bs.modal", event => {
         const button = $(event.relatedTarget);
         const postId = getPostIdFromElement(button);
         $("#pinPostButton").data("id", postId);
     });
     
     $("#pinPostButton").click(event => {
         const postId = $(event.target).data("id");
         
         $.ajax({
             url: `/api/posts/${postId}`,
             type: "PUT",
           	data: { pinned: true },
             success: (data, status, xhr) => {
                 if (xhr.status != 204) {
                     alert("Could not pin the post");
                     return;
                 }
                 location.reload();
             }
         })
     });
     ```

   - posts.js

     ```js
     router.put("/:id", async (req, res, next) => {
         if (req.body.pinned !== undefined) {
             await Post.updateMany({ postedBy: req.session.user }, { pinned: false })
             .catch(error => {
                 console.log(error);
                 res.sendStatus(400);
             })
         }
         Post.findByIdAndDelete(req.params.id, req.body)
         .then(() => {
             res.sendStatus(204);
         })
         .catch(error => {
             console.log(error);
             res.sendStatus(400);
         })
     });
     ```

     since we will use this feature later again it could looks a bit vague.

     if the request send a pinned(which is not undefined), all the posts that the logged in user posted will have pinned value of false.

     then, update the specific post by request.params.id to set pinned value of true. (that's what in the req.body)

   - PostSchema.js

     `pinned: Boolean,`

3. change color of pinned post

   ```js
   // common.js - createPostHtml()
   if (postedBy._id == userLoggedIn._id) {
     let pinnedClass = "";
     if (postData.pinned === true) {
       pinnedClass = "active"
     }
     buttons = `
   <button class="pinPostButton ${pinnedClass}" data-id="${postData._id}" data-toggle="modal" data-target="#confirmPinModal"><i class="fas fa-thumbtack"></i></button>
   <button class="deletePostButton" data-id="${postData._id}" data-toggle="modal" data-target="#deletePostModal"><i class="fas fa-times"></i></button>
   `
   };
   ```

4. label

   ```js
   let pinnedPostText = "";
       if (postedBy._id == userLoggedIn._id) {
           let pinnedClass = "";
           if (postData.pinned === true) {
               pinnedClass = "active"
               pinnedPostText = `
                   <i class="fas fa-thumbtack"></i>
                    <span>Pinned post</span>
               `
           }
           buttons = `
           <button class="pinPostButton ${pinnedClass}" data-id="${postData._id}" data-toggle="modal" data-target="#confirmPinModal"><i class="fas fa-thumbtack"></i></button>
           <button class="deletePostButton" data-id="${postData._id}" data-toggle="modal" data-target="#deletePostModal"><i class="fas fa-times"></i></button>
           `
       };
   return `
       <div class="post ${largeFontClass}" data-id="${postData._id}">
           <div class="postActionContainer">
               ${pinnedPostText} &nbsp; ${retweetText}
           </div>
   ...
   `
   ```

5. pinned post on the profile page

   - profile.js

     update loadPosts function only.

     ```js
     function loadPosts() {
         $.get("/api/posts", { postedBy: profileUserId, pinned: true }, results => {
             outputPosts(results, $(".pinnedPostContainer"));
         });
     
         $.get("/api/posts", { postedBy: profileUserId, isReply: false }, results => {
             outputPosts(results, $(".postsContainer"));
         });
     };
     ```

     if there is no pinned post, make sure there are no underline

   - profilePage.pug

     ```pug
     .pinnedPostContainer
     ```

   - common.js - outputPosts function

     ```js
     if (container[0].className == "pinnedPostContainer"  && results.length == 0) {
             container.hide();
             return;
         } 
     ```

6. unpin a post

   - common.js

     ```js
     // createPostHtml
     if (postedBy._id == userLoggedIn._id) {
       let pinnedClass = "";
       let dataTarget = "#confirmPinModal";
       if (postData.pinned === true) {
         pinnedClass = "active";
         dataTarget = "#unpinModal";
         pinnedPostText = `
     <i class="fas fa-thumbtack"></i>
     <span>Pinned post</span>
     `;
       }
       buttons = `
     <button class="pinPostButton ${pinnedClass}" data-id="${postData._id}" data-toggle="modal" data-target=${dataTarget}><i class="fas fa-thumbtack"></i></button>
     <button class="deletePostButton" data-id="${postData._id}" data-toggle="modal" data-target="#deletePostModal"><i class="fas fa-times"></i></button>
     `
     };
     ```

   - mixins.pug

     ```pug
     mixin createPostModals(userLoggedIn)
         +createReplyModal(userLoggedIn)
         +createDeletePostModal()
         +createPinnedPostModal()
         +createUnpinPostModal()
         
     mixin createUnpinPostModal()
         #unpinModal.modal.fade(tabindex='-1', role='dialog', aria-labelledby='unpinModalLabel', aria-hidden='true')
             .modal-dialog(role='document')
                 .modal-content
                     .modal-header
                         img(src="/images/leaf.png", alt="")
     
                         h5#unpinModalLabel.modal-title Unpin this post?
                         button.close(type='button', data-dismiss='modal', aria-label='Close')
                             span(aria-hidden='true') &times;
                     .modal-body
                         p. 
                             This post will be unpinned.
                     .modal-footer
                         button#unpinButton.postButton(type='button') Pin
     ```

   - common.js

     just like comfirmPinModal and pinPostButton.

     ```js
     $("#unpinModal").on("show.bs.modal", event => {
     $("#unpinButton").click(event => {
       data: { pinned: false },
     ```

     

## Search

1. create search page

   - routes/searchRoutes.js

     ```js
     const express = require('express');
     const app = express();
     const router = express.Router();
     const bcrypt = require("bcrypt");
     const User = require("../schemas/UserSchema");
     
     router.get("/", (req, res, next) => {
     	const payload = createPayload(req.session.user);
     
         res.status(200).render("searchPage", payload);
     });
     
     router.get("/:selectedTab", (req, res, next) => {
     	const payload = createPayload(req.session.user);
         payload.selectedTab = req.params.selectedTab;
         res.status(200).render("searchPage", payload);
     });
     
     function createPayload(userLoggedIn) {
         return {
             pageTitle: "Search",
             userLoggedIn: userLoggedIn,
             userLoggedInJS: JSON.stringify(userLoggedIn)
         };
     };
     
     module.exports = router;
     ```

   - views/searchPage.pug

     ```pug
     extends layouts/main-layout.pug
     
     block content
         .tabsContainer 
             +createTab("Posts", `/search/posts`, selectedTab != "users")
             +createTab("Users", `/search/users`, selectedTab == "users")
         .resultsContainer
         
     	+createPostModals(userLoggedIn)
     
     block scripts 
     	script(src="/js/search.js") 
     ```

   - app.js

     ```js
     const searchRoute = require("./routes/searchRoutes");
     app.use("/search", middleware.requireLogin, searchRoute);
     ```

2. search bar

   ```pug
   .searchBarContainer
           i.fas.fa-search
           input#searchBox(type="text", name="searchBox", data-search=selectedTab, placeholder="Search for posts or users")
   ```

3. search timer

   set a timer when type starts.(every keydown)

   - public/js/search.js

     ```js
     let timer;
     $("#searchBox").keydown(event => {
         clearTimeout(timer);
         const textbox = $(event.target);
         let value = textbox.val();
         const searchType = textbox.data().search;
     
         timer = setTimeout(() => {
             value = textbox.val().trim();
     
             if (value == "") {
                 $(".resultsContainer").html("");
             } else {
                 console.log(value);
             }
         }, 1000);
     })
     ```

4. search for post

   - common.js

     ```js
     let timer;
     $("#searchBox").keydown(event => {
         clearTimeout(timer);
         const textbox = $(event.target);
         let value = textbox.val();
         const searchType = textbox.data().search;
     
         timer = setTimeout(() => {
             value = textbox.val().trim();
     
             if (value == "") {
                 $(".resultsContainer").html("");
             } else {
                 search(value, searchType);
             }
         }, 1000);
     });
     
     function search(searchTerm, searchType) {
         const url = searchType == "users" ? "/api/users" : "/api/posts";
         $.get(url, { search: searchTerm }, results => {
             console.log(results);
         })
     };
     ```

     

   - posts.js

     update get all posts response

     ```js
     if (searchObj.search !== undefined) {
       searchObj.content = { $regex: searchObj.search, $options: "i" }
       delete searchObj.search;
         }
     ```

     :question: $regex: searchObj.content = searchObj.search

     ​	regex is not search for only complete match. it searches for partial match.

     `$options: "i"` case insensitive search

5. output the search result

   ```js
   // search.js
   function search(searchTerm, searchType) {
       const url = searchType == "users" ? "/api/users" : "/api/posts";
       $.get(url, { search: searchTerm }, results => {
           if (searchType == "users") {
   
           } else {
               outputPosts(results, $(".resultsContainer"));
           }
       })
   };
   ```

6. search for user

   - users.js

     ```js
     router.get("/", async (req, res, next) => {
         let searchObj = req.query;
         if (req.query.search !== undefined) {
             searchObj = {
                 $or: [
                     { firstName: { $regex: searchObj.search, $options: "i" }},
                     { lastName: { $regex: searchObj.search, $options: "i" }},
                     { username: { $regex: searchObj.search, $options: "i" }},
                 ]
             };
         }
         User.find(searchObj)
         .then(results => {
             res.status(200).send(results);
         })
         .catch(error => {
             console.log(error);
             res.sendStatus(400);
         })
     })
     ```

     if any of three line is true(if there is a user whose firstName or lastName or username is included within search term.), returns the result.

   - search.js

     ```js
     function search(searchTerm, searchType) {
         const url = searchType == "users" ? "/api/users" : "/api/posts";
         $.get(url, { search: searchTerm }, results => {
             if (searchType == "users") {
                 outputUsers(results, $(".resultsContainer"));
             } else {
                 outputPosts(results, $(".resultsContainer"));
             }
         })
     };
     ```

   - common.js

     move outputUsers, createUserHtml function from follow.js to common.js

## Group Chat

1. inbox page route

   - routes/messageRoutes.js

     ```js
     router.get("/", (req, res, next) => {
     
         res.status(200).render("inboxPage", {
             pageTitle: "Inbox",
             userLoggedIn: req.session.user,
             userLoggedInJS: JSON.stringify(req.session.user)
         });
     });
     
     router.get("/new", (req, res, next) => {
     
         res.status(200).render("newMessage", {
             pageTitle: "New message",
             userLoggedIn: req.session.user,
             userLoggedInJS: JSON.stringify(req.session.user)
         });
     });
     ```

   - app.js

     register messagesRoute

   - views/inboxPage.pug

     ```pug
     extends layouts/main-layout.pug
     
     block content
     	.resultsContainer
     
     block scripts 
     	script(src="/js/inboxPage.js") 
     ```

   - views/newMessage.pug

     ```pug
     extends layouts/main-layout.pug
     
     block content
     	.resultsContainer
     ```

2. new message button

   - main-layout.pug

     ```pug
     .mainSectionContainer.col-10.col-md-8.col-lg-6
       .titleContainer 
         h1 #{pageTitle}
         block headerButton	
     ```

     add a block for messages under .titleContainer

   - inboxPage.pug

     ```pug
     block headerButton
     	a(href="/messages/new")
     		i.fas.fa-comment-dots
     ```

3. new message page

   ```pug
   //- newMessage.pug
   extends layouts/main-layout.pug
   
   block content
       .chatPageContainer 
           .chatTitleBar
               label(for="userSearchTextbox") To:
               #selectedUsers 
                   input#userSearchTextbox(type="text", placeholder="Type the name of the user")
       	.resultsContainer
           button#createChatButton(disabled="") Create chat
   
   ```

   

4. user search timer

   - common.js

     bring searchBox keydown handler from search.js

     make searchUsers function

     ```js
     let timer;
     $("#userSearchTextbox").keydown(event => {
         clearTimeout(timer);
         const textbox = $(event.target);
         let value = textbox.val();
     		
       	if (value == "" && event.keyCode == 8) {
             // remove user from selection
             return;
         }
         timer = setTimeout(() => {
             value = textbox.val().trim();
     
             if (value == "") {
                 $(".resultsContainer").html("");
             } else {
                 searchUsers(value);
             }
         }, 1000);
     });
     ```

     since we have a timer variable in common.js now, you should remove timer variable from search.js. timer is global variable from now on.

     keycode 8 is delete key.

     since it is a group chat, you could select multiple user by searching. if you get user1 by searching and then get user2, we will add the users on #userSearchTextbox but it is NOT the value of it yet. so the if phrase is for this. while you searching for the users, if you press delete key, the user selected one at last will be removed.

     ```js
     function searchUsers(searchTerm) {
         $.get("/api/users", { search: searchTerm }, results => {
             outputSelectableUsers(results, $(".resultsContainer"));
         });
     };
     
     function outputSelectableUsers(results, container) {
         container.html("");
         results.forEach(result => {
             if (result._id == userLoggedIn._id) {
                 return;
             }
             const html = createUserHtml(result, true);
             container.append(html);
         });
     
         if (results.length == 0) {
             container.append("<span class='noResults'>No results found</span>")
         }
     };
     ```

     searchUsers are not same with the searching users at search page.

     	- the user who is searching shouldn't be shown
     	- if the user is already selected, that user shouldn't be shown too

     because of two above, outputUsers couldn't be used again and make new function.

5. select users

   - common.js

     ```js
     let selectedUsers = [];
     
     function outputSelectableUsers(results, container) {
         container.html("");
         results.forEach(result => {
             if (result._id == userLoggedIn._id) {
                 return;
             }
             const html = createUserHtml(result, false);
             const element = $(html);
             element.click(() => userSelected(result))
             container.append(element);
         });
     
         if (results.length == 0) {
             container.append("<span class='noResults'>No results found</span>")
         }
     };
     
     function userSelected(user) {
         selectedUsers.push(user);
         $("#userSearchTextbox").val("").focus();
         $(".resultsContainer").html("");
         $("#createChatButton").prop("disabled", false);
     };
     ```

     second argument of createUserHtml is false. It means follow button won't show up.

   - update outputSelectableUsers's if condition for avoiding duplicate user.

     ```js
     if (result._id == userLoggedIn._id || selectedUsers.some(u => u._id == result._id)) {
       return;
     }
     ```

     if one of selectedUsers id equals id of searching result, it returns a true(Array.some returns true if condition passes)

   - output selected users

     ```js
     function userSelected(user) {
         selectedUsers.push(user);
         updateSelectedUsersHtml();
         $("#userSearchTextbox").val("").focus();
         $(".resultsContainer").html("");
         $("#createChatButton").prop("disabled", false);
     };
     
     function updateSelectedUsersHtml() {
         let elements = [];
         selectedUsers.forEach(user => {
             const name = user.firstName + " " + user.lastName;
             const userElement = $(`<span class="selectedUser">${name}</span>`);
             elements.push(userElement);
     
         })
         $(".selectedUser").remove();
         $("#selectedUsers").prepend(elements);
     }
     ```

     if you use append for add elements in #selectedUsers, the elements will added after the textbox.

6. remove selected user

   ```js
   // common.js
   $("#userSearchTextbox").keydown(event => {
       clearTimeout(timer);
       const textbox = $(event.target);
       let value = textbox.val();
   
       if (value == "" && (event.which == 8 || event.keyCode == 8)) {
           selectedUsers.pop();
           updateSelectedUsersHtml();
           $(".resultsContainer").html("");
   
           if (selectedUsers.length == 0) {
               $("#createChatButton").prop("disabled", true);
           }
   
           return;
       }
   ```

   keyCode is deprecated => update like that.

   event.which is jQuery version of event.keyCode

7. chat schema

   - schemas/ChatSchema.js

     ```js
     const mongoose = require('mongoose');
     
     const Schema = mongoose.Schema;
     const ChatSchema = new Schema({
         chatName: { type: String, trim: true },
         isGroupChat: { type: Boolean, default: false },
         users: [{ type: Schema.Types.ObjectId, ref: "User" }],
         latestMessage: { type: Schema.Types.ObjectId, ref: "Message" },
     }, { timestamps: true });
     
     module.exports = mongoose.model('Chat', ChatSchema);
     ```

     latestMessage field is for display at inboxPage

8. chat route

   - common.js

     ```js
     $("#createChatButton").click(event => {
         const data = JSON.stringify(selectedUsers);
     
         $.post("/api/chats", { users: data }, chat => {
             if (!chat || !chat._id) return alert("Invalid response from server.");
             window.location.href = `/messages/${chat._id}`;
         })
     });
     ```

     in the ajax call request, only String form of data can be carried.

   - routes/api/chats.js

     ```js
     const express = require('express');
     const app = express();
     const router = express.Router();
     const User = require("../../schemas/UserSchema");
     const Post = require("../../schemas/PostSchema");
     const Chat = require("../../schemas/ChatSchema");
     
     app.use(express.urlencoded({
     	extended: false
     }));
     
     router.post("/", async (req, res, next) => {
         if (!req.body.users) {
             console.log("Users param not sent with request");
             return res.sendStatus(400);
         }
         const users = JSON.parse(req.body.users);
         if (users.length == 0) {
             console.log("Users array is empty");
             return res.sendStatus(400);
         }
     
         users.push(req.session.user);
         const chatData = {
             users: users,
             isGroupChat: true
         }
     
         Chat.create(chatData)
         .then(results => res.status(200).send(results))
         .catch(error => {
             console.log(error);
             res.sendStatus(400);
         })
     });
     
     
     module.exports = router;
     ```

     I myself needed to be a participant. => push req.session.user to users object.

   - app.js

     register chatsAPIRoute

   - if you create a chat at this stage, `Cannot GET /messages/60c1eb86394248da0890bb10` this kinda error is occur and 404 error. it's not error but no page to render. so it worked! you could see it at mongodb too.

## Chat List

1. get the chats

   - public/js/inboxPage.js

     ```js
     $(document).ready(() => {
         $.get("/api/chats", (data, status, xhr) => {
             if (xhr.status == 400) {
                 alert("Could not get chat list.");
             } else {
                 outputChatList(data, $(".resultsContainer"));
             }
         })
     })
     
     function outputChatList(chatList, container) {
         console.log(chatList);
     }
     ```

   - chats.js

     ```js
     router.get("/", async (req, res, next) => {
         Chat.find({ users: { $elemMatch: { $eq: req.session.user._id }}})
         .then(results => res.status(200).send(results))
         .catch(error => {
             console.log(error);
             res.sendStatus(400);
         })
     });
     ```

     find a chat which one has users field that any element of users equals($eq stands for equal) with eq.session.user._id.=> get all the chats that logged in user is involved.

   - output chats

     - inboxPage.js

       ```js
       function outputChatList(chatList, container) {
           if (chatList.length == 0) {
               container.append("<span class='noResults'>Nothing to show.</span>")
               return;
           }
           chatList.forEach(chat => {
               const html = createChatHtml(chat);
               container.append(html);
           })
       }
       
       function createChatHtml(chatData) {
           const chatName = "Chat name";
           const image = "";
           const latestMessage = "Latest messages will be here.";
       
           return `
           <a href="/messages/${chatData._id}" class="resultListItem">
               <div class="resultsDetailsContainer">
                   <span class="heading">${chatName}</span>
                   <span class="subText">${latestMessage}</span>
               </div>
           </a>`
       }
       ```

2. chat name

   ```js
   function createChatHtml(chatData) {
       const chatName = getChatName(chatData);
   ...
   }
   
   function getChatName(chatData) {
       let chatName = chatData.chatName;
   
       if (!chatName) {
           const otherChatUsers = getOtherChatUsers(chatData.users);
           const namesArray = otherChatUsers.map(user => user.firstName + " " + user.lastName);
           chatName = namesArray.join(", ");
       }
   
       return chatName;
   }
   
   function getOtherChatUsers(users) {
       if (users.length == 1) return users;
       return users.filter(user => user._id != userLoggedIn._id)
   }
   ```

   if there is no name for the chat, make the participants name as a chat name. but my name should be excluded.

   user name is not populated yet.

   ```js
   // chats.js
   router.get("/", async (req, res, next) => {
       Chat.find({ users: { $elemMatch: { $eq: req.session.user._id }}})
       .populate("users")
       .then(results => res.status(200).send(results))
       .catch(error => {
           console.log(error);
           res.sendStatus(400);
       })
   });
   ```

3. chat images

   ```js
   function createChatHtml(chatData) {
       const chatName = getChatName(chatData);
       const image = getChatImageElements(chatData);
       const latestMessage = "Latest messages will be here.";
   
       return `
       <a href="/messages/${chatData._id}" class="resultListItem">
           ${image}
           <div class="resultsDetailsContainer">
               <span class="heading">${chatName}</span>
               <span class="subText">${latestMessage}</span>
           </div>
       </a>`
   }
   
   function getChatImageElements(chatData) {
       const otherChatUsers = getOtherChatUsers(chatData.users);
   
       let groupChatClass = "";
       let chatImage = getUserChatImageElement(otherChatUsers[0]);
   
       if (otherChatUsers.length > 1) {
           groupChatClass = "groupChatImage";
           chatImage += getUserChatImageElement(otherChatUsers[1]);
       }
       
       return `
           <div class="resultImageContainer ${groupChatClass}">${chatImage}</div>
       `
   }
   
   function getUserChatImageElement(user) {
       if (!user || !user.profilePic) {
           return alert("User passed into function is invalid.");
       }
   
       return `
       <img src="${user.profilePic}" alt="User's profile pic">
       `
   }
   ```

4. ellipsis for overflowing text

   if there are too many participants, chat name will be too long.

   make .ellipsis to use anywhere needed ellipsis

   ```css
   .ellipsis {
       white-space: nowrap;
       overflow: hidden;
       text-overflow: ellipsis;
   }
   ```

   ```js
   return `
       <a href="/messages/${chatData._id}" class="resultListItem">
           ${image}
           <div class="resultsDetailsContainer ellipsis">
               <span class="heading ellipsis">${chatName}</span>
               <span class="subText ellipsis">${latestMessage}</span>
           </div>
       </a>`
   ```

   if you don't add a ellpsis class at the resultsDetailsContainer, it won't be ellipsised.

## Access Chat

1. views/chatPage.pug

   ```pug
   
   ```

   - ```js
     // messagesRoutes.js
     
     router.get("/:chatId", (req, res, next) => {
     
         res.status(200).render("chatPage", {
             pageTitle: "Chat",
             userLoggedIn: req.session.user,
             userLoggedInJS: JSON.stringify(req.session.user)
         });
     });
     ```

2. get the chat data

   - messagesRoutes.js

     ```js
     const Chat = require("../schemas/ChatSchema");
     
     router.get("/:chatId", async (req, res, next) => {
         const userId = req.session.user._id;
         const chatId = req.params.chatId;
     
         const chat = await Chat.findOne({ _id: chatId, users: { $elemMatch: { $eq: userId }}})
         .populate("users");
     
         if (chat == null) {
             // Check if chat id is really user id
         }
     
         res.status(200).render("chatPage", {
             pageTitle: "Chat",
             userLoggedIn: req.session.user,
             userLoggedInJS: JSON.stringify(req.session.user),
             chat: chat,
         });
     });
     ```

   - check that the chat exists

     ```js
     router.get("/:chatId", async (req, res, next) => {
         const userId = req.session.user._id;
         const chatId = req.params.chatId;
         const payload = {
             pageTitle: "Chat",
             userLoggedIn: req.session.user,
             userLoggedInJS: JSON.stringify(req.session.user),
         };
     
         const chat = await Chat.findOne({ _id: chatId, users: { $elemMatch: { $eq: userId }}})
         .populate("users");
     
         if (chat == null) {
             let userFound = await User.findById(chatId);
             if (userFound != null) {
                 // get chat using user id
             }
         }
     
         if (chat == null) {
             payload.errorMessage = "Chat does not exist or you do not have permission to view it.";
         } else {
             poayload.chat = chat;
         }
     
         res.status(200).render("chatPage", payload);
     });
     
     ```

     if the chat is not exist, find the user who have a id that matches with req.params.chatId. 

     - chatPage.pug

       ```pug
       block content
           if errorMessage
               span.errorMessage.noResults #{errorMessage}
           else
               script.
                   const chatId = `!{chat._id}`;
       ```

     - messagesRoutes.js

       ```js
       const mongoose = require("mongoose");
       
       router.get("/:chatId", async (req, res, next) => {
           const userId = req.session.user._id;
           const chatId = req.params.chatId;
           const isValidId = mongoose.isValidObjectId(chatId);
           
           const payload = {
               pageTitle: "Chat",
               userLoggedIn: req.session.user,
               userLoggedInJS: JSON.stringify(req.session.user),
           };
       
           if (!isValidId) {
               payload.errorMessage = "Chat does not exist or you do not have permission to view it.";
               return res.status(200).render("chatPage", payload);
           }
       ```

       random text at the place of chatId in the url won't throws an errormessage at the page but just endless waiting. so, add a isValidId variable to make it certain to throw an error. 

3. access the chat by user ID

   ```js
   // messagesRoutes.js
   let chat = await Chat.findOne({ _id: chatId, users: { $elemMatch: { $eq: userId }}})
       .populate("users");
   
       if (chat == null) {
           let userFound = await User.findById(chatId);
           if (userFound != null) {
               chat = await getChatByUserId(userFound._id, userId);
           }
       }
   
   
   function getChatByUserId(userLoggedInId, otherUserId) {
       return Chat.findOneAndUpdate({
           isGroupChat: false,
           users: {
               $size: 2,
               $all: [
                   { $elemMatch: { $eq: userLoggedInId }},
                   { $elemMatch: { $eq: otherUserId }},
               ]
           }
       }, {
           $setOnInsert: {
               users: [userLoggedInId, otherUserId]
           }
       }, {
           new: true,
           upsert: true
       })
       .populate("users");
   }
   ```

   you can access the chatPage by click the message button on someone not yourself's profile page. that's why you need to access the chatPage by user Id.

   the reason for using findOneAndUpdate is if you didn't have chat with that user new chat will be created.

   `$size: 2` size of this array is 2

   `$all: []` all of the conditions within [] are met.

   if you couldnt' find the matching chat with first parameters condition( kind of a filtering), create the new chat with second parameter's data.

   third parameter is option

   	- `new: true ` return the newly updated data
   	- `upsert: true `  if you didn't find it, create it.

   So far, it creats new chat every time you click the message button.

   ```js
   $all: [
     { $elemMatch: { $eq: mongoose.Types.ObjectId(userLoggedInId) }},
     { $elemMatch: { $eq: mongoose.Types.ObjectId(otherUserId) }},
   ]
   ```

   just tell the mongoose that it is definitely objectId type.

4. sort the chats

   chats.js

   ```js
   router.get("/", async (req, res, next) => {
       Chat.find({ users: { $elemMatch: { $eq: req.session.user._id }}})
       .populate("users")
       .sort({ updatedAt: -1 })
       .then(results => res.status(200).send(results))
       .catch(error => {
           console.log(error);
           res.sendStatus(400);
       })
   });
   ```

   adding .sort line

   sort by updatedAt field descending order.

   -1 or "desc" are descending order.

## Chat Page

1. chat page els

   ```pug
   //- chatPage.pug
   else
     script.
     	const chatId = `!{chat._id}`;
   
     .chatPageContainer 
       .chatTitleBarContainer 
       	.span#chatName This is the chat 
       .mainContentContainer
         .chatContainer
   				.chatMessages
           .footer
             textarea(name="messageInput", placeholder="Type a message...") 
             button.sendMessageButton 
             	i.fas.fa-paper-plane
   ```

   my placeholder was not showing and the reason was the whitespace after textarea(). well, whitespace is there because of vsCode emmet. anyway if there is a whitespace placeholder won't appear.

2. ```css
   html, body {
       height: 100%;
       min-height: 100%;
       background-color: #fff;
       font-weight: 300;
   }
   
   .wrapper {
       display: flex;
       flex-direction: column;
       height: 100%;
   }
   
   .wrapper > .row {
       margin: 0;
       height: 100%;
   }
   ```

3. group chat image

   ```js
   // mixins.pug
   
   mixin createChatImage(chatData, userLoggedIn)
       if (!chatData)
           return
       .chatImagesContainer
           each user in chatData.users
               img(src=user.profilePic, alt="User's profile picture", title=user.firstName)
   ```

   ```pug
   // chatPage.pug
   
   .chatTitleBarContainer
     +createChatImage(chat, userLoggedIn)
     .span#chatName This is the chat 
   ```

   image is too big. style is needed

   `flex-direction: row-reverse;` : images are overlapped on purpose. if you want the latter image lies at the bottom write this line.

   since it is reverse, data order is reversed. if chat participants are part1, part2, part3, the image order is part3, part2, part1 and part3's image is not stacked. 

4. limit the number of displayed chat images

   ```pug
   mixin createChatImage(chatData, userLoggedIn)
       if (!chatData)
           return
       
       - let i = 0
       - const maxImagesToShow = 3
       - let remainingUsers = chatData.users.length - maxImagesToShow;
       - remainingUsers--
   
       .chatImagesContainer
           if remainingUsers > 0
               .userCount
                   span +#{remainingUsers}
           each user in chatData.users
               if chatData.users.length != 1 && user._id == userLoggedIn._id
                   - continue
               else if i >= maxImagesToShow
                   - break
               img(src=user.profilePic, alt="User's profile picture", title=user.firstName)
               - i++
   
   ```

   remove one remainingUsers because our own image won't show up.

   - each user in chatData.users~: 

     if there is only one user is remaining and that user's id is mine, skip.

     else if this is more than maxImagesToShow round, just stop the loop.

     every time the loop is over, add one to i.

5. change chat name

   - chage chat name modal

     - mixins.pug

       ```pug
       mixin createChatNameModal(chat)
           #chatNameModal.modal.fade(tabindex='-1', role='dialog', aria-labelledby='chatNameModalLabel', aria-hidden='true')
               .modal-dialog(role='document')
                   .modal-content
                       .modal-header
                           img(src="/images/leaf.png", alt="")
       
                           h5#chatNameModalLabel.modal-title Change the chat name
                           button.close(type='button', data-dismiss='modal', aria-label='Close')
                               span(aria-hidden='true') &times;
                       .modal-body
                           input#chatNameTextbox(type="text", placeholder="Enter a name for this chat", value=chat.chatname)
                       .modal-footer
                           button#chatNameButton.postButton(type='button') Save
       ```

     - chatPage.pug

       ```pug
       .chatPageContainer
       	.chatTitleBarContainer
                       +createChatImage(chat, userLoggedIn)
                       .span#chatName(data-toggle="modal", data-target="#chatNameModal") This is the chat 
       +createChatNameModal(chat)
       ```

   - ajax call

     - public/js/chatPage.js

       ```js
       $("#chatNameButton").click(() => {
           const name = $("#chatNameTextbox").val().trim();
           
           $.ajax({
               url: "/api/chat/" + chatId,
               type: "PUT",
               data: { chatName: name },
               success: (data, status, xhr) => {
                   if (xhr.status != 204) {
                       alert("could not update")
                   } else {
                       location.reload();
                   }
               }
           })
       })
       ```

     - chats.js

       ```js
       router.put("/:chatId", async (req, res, next) => {
           Chat.findByIdAndUpdate(req.params.chatId, req.body)
           .then(results => res.sendStatus(204))
           .catch(error => {
               console.log(error);
               res.sendStatus(400);
           })
       });
       ```

   - chat route

     - chatPage.pug

       ```pug
       .span#chatName(data-toggle="modal", data-target="#chatNameModal") #{chat.chatName}
       ```

       it shows the chatname on chat page but if the chat doesn't have a name nothing will appear.

     - chatPage.js

       ```js
       $(document).ready(() => {
           $.get(`/api/chats/${chatId}`, (data) => {
               $("#chatName").text(getChatName(data))
           })
       })
       ```

     - common.js

       since getChatName function(and getOtherChatUsers function which is referenced by getChatName) was in inboxPage.js, just move it to common.js to use in both inbox and chat page.

     - chats.js

       ```js
       router.get("/:chatId", async (req, res, next) => {
           Chat.findOne({ _id: req.params.chatId, users: { $elemMatch: { $eq: req.session.user._id }}})
           .populate("users")
           .then(results => res.status(200).send(results))
           .catch(error => {
               console.log(error);
               res.sendStatus(400);
           })
       });
       ```

       

## Send Message

1. message submit event

   give a class inputTextbox to chatPage - .chatPageContainer - mainContentContainer - chatContainer - footer - textarea

   ```js
   // chatPage.js
   
   $(".sendMessageButton").click(() => {
       messageSubmitted();
   })
   
   $(".inputTextbox").keydown(event => {
       if (event.which === 13 && !event.shiftKey) {
           messageSubmitted();
           return false;
       }
   })
   
   function messageSubmitted() {
       console.log("dsklfj");
   }
   ```

   event.which === 13: if the user click enter key

   return false: if enter is pressed, it only means sending the message not new line.

   but to allow users to use new line, add second condition to the if phrase. if enter key is pressed and shift key is not pressed, message is submitted. which means both shift and enter key is pressed it goes to new line.

2. send message function

   ```js
   // chatPage.js
   
   function messageSubmitted() {
       const content = $(".inputTextbox").val().trim();
       
       if (content != "") {
           sendMessage(content);
           $(".inputTextbox").val("");
       }
   }
   
   function sendMessage(content) {
       console.log(content);
   }
   ```

   without content or with only spaces the message couldn't be sent.

3. message schema

   ```js
   // chatPage.js
   
   function sendMessage(content) {
       $.post("/api/messages", { content: content, chatId: chatId }, (data, status, xhr) => {
           console.log(data);
       }) 
   }
   ```

   chatId is there because chatId is in chatPage.pug

   - schemas/MessageSchema.js

     ```js
     const mongoose = require('mongoose');
     
     const Schema = mongoose.Schema;
     const MessageSchema = new Schema({
         sender: { type: Schema.Types.ObjectId, ref: 'User' },
         content: { type: String, trim: true },
         chat: { type: Schema.Types.ObjectId, ref: "Chat" },
         readBy: [{ type: Schema.Types.ObjectId, ref: "User" }],
     }, { timestamps: true });
     
     module.exports = mongoose.model('Message', MessageSchema);
     ```

4. message to db

   - routes/api/messages.js

     ```js
     const Message = require("../../schemas/MessageSchema");
     
     router.post("/", async (req, res, next) => {
         if (!req.body.content || !req.body.chatId) {
             console.log("Invalid data passed into request.");
             return res.sendStatus(400);
         }
         const newMessage = {
             sender: req.session.user._id,
             content: req.body.content,
             chat: req.body.chatId
         };
         Message.create(newMessage)
         .then(results => {
             res.status(201).send(results);
         })
       	.catch(error => {
             console.log(error);
             res.sendStatus(400);
         })
     });
     ```

     register it on app.js

     html code 201 is created sucess.

## Output Message

1. message html

   - chatPage.js

     ```js
     function sendMessage(content) {
         $.post("/api/messages", { content: content, chatId: chatId }, (data, status, xhr) => {
             addChatMessageHtml(data);
         }) 
     }
     
     function addChatMessageHtml(message) {
         if (!message || !message._id) {
             alert("Message is not valid");
             return;
         }
         const messageDiv = createMessageHtml(message);
         $(".chatMessages").append(messageDiv);
     }
     
     function createMessageHtml(message) {
         let isMine = message.sender._id == userLoggedIn._id;
         let liClassName = isMine ? "mine" : "theirs";
     
         return `
             <li class="message ${liClassName}">
                 <div class="messageContainer">
                     <span class="messageBody">
                         ${message.content}
                     </span>
                 </div>
             </li>
         `
     }
     ```

   - chatPage.pug

     change the .chatMessages to ul tag

   - -webkit-flex: 0; -> prevent the container overlapping at safari. BUT it cause the overlapping so I've delete it...

   - align-items: flex-end; at .message  -> make the picture to the bottom line if multiple messages are sent in row.

2. populate the sender

   ```js
   // messages.js
   
   Message.create(newMessage)
       .populate("sender")
       .then(async results => {
           results = await results.populate("sender").execPopulate();
           results = await results.populate("chat").execPopulate();
           res.status(201).send(results);
       })
   ```

   we cannot add .populate("sender") under the Message.create(newMessage) line. Because it is not find~~ function. so poplute the sender as the way you used at posts.js - getPosts function - results at the bottom.

   now the class of message sent's li is `mine`(which means the id of sender and logged in's are same)

   - flex-direction: row-reverse; -> in case of my message display it at the right side.

3. message failed to send

   if message is not sending for some reason, the message need to be remained at the textbox for user to try again.

   ```js
   // chatPage.js
   
   function sendMessage(content) {
       $.post("/api/messages", { content: content, chatId: chatId }, (data, status, xhr) => {
           if (xhr.status != 201) {
               alert("Could not send message");
               $(".inputTextbox").val(content);
               return;
           }
   
           addChatMessageHtml(data);
       }) 
   }
   ```

4. ouput the latest message

   ```js
   // messages.js
   
   Message.create(newMessage)
       .then(async results => {
           results = await results.populate("sender").execPopulate();
           results = await results.populate("chat").execPopulate();
           
           Chat.findByIdAndUpdate(req.body.chatId, { latestMessage: results })
           .catch(error => console.log(error));
   
           res.status(201).send(results);
       })
   ```

   ```js
   // inboxPage.js
   
   function createChatHtml(chatData) {
       const chatName = getChatName(chatData);
       const image = getChatImageElements(chatData);
       const latestMessage = getLatestMessage(chatData.latestMessage);
   
       return `
       <a href="/messages/${chatData._id}" class="resultListItem">
           ${image}
           <div class="resultsDetailsContainer ellipsis">
               <span class="heading ellipsis">${chatName}</span>
               <span class="subText ellipsis">${latestMessage}</span>
           </div>
       </a>`
   }
   
   function getLatestMessage(latestMessage) {
       if (latestMessage != null) {
           const sender = latestMessage.sender;
           return `
               ${sender.firstName} ${sender.lastName}: ${latestMessage.content}
           `;
       } else return `No Chat`;
   }
   ```

   ```js
   // chats.js
   
   router.get("/", async (req, res, next) => {
       Chat.find({ users: { $elemMatch: { $eq: req.session.user._id }}})
       .populate("users")
       .populate("latestMessage")
       .sort({ updatedAt: -1 })
       .then(async results => {
           results = await User.populate(results, { path: "latestMessage.sender "});
           res.status(200).send(results)
       })
       .catch(error => {
           console.log(error);
           res.sendStatus(400);
       })
   });
   ```

   populate the latestMessage.

   also need a sender of latestMessage -> just the way used for the latestMessage won't work.

   make a change at the .then method.

5. get the messages

   - chatPage.js

     update document.ready

     ```js
     $(document).ready(() => {
         $.get(`/api/chats/${chatId}`, (data) => {
             $("#chatName").text(getChatName(data));
         })
     
         $.get(`/api/chats/${chatId}/messages`, data => {
             console.log(data);
         })
     })
     ```

   - chats.js

     ```js
     router.get("/:chatId/messages", async (req, res, next) => {
         await Message.find({ chat: req.params.chatId })
         .populate("sender")
         .then(results => res.status(200).send(results))
         .catch(error => {
             console.log(error);
             res.sendStatus(400);
         })
     });
     ```

6. output all the chat message

   ```js
   // chatPage.js
   
   $(document).ready(() => {
       $.get(`/api/chats/${chatId}`, (data) => {
           $("#chatName").text(getChatName(data));
       })
   
       $.get(`/api/chats/${chatId}/messages`, data => {
           let messages = [];
           data.forEach(message => {
               const html = createMessageHtml(message);
               messages.push(html);
           });
           const messagesHtml = messages.join("");
       })
   })
   
   function addMessagesHtmlToPage(html) {
       $(".chatMessages").append(html);
   }
   
   function addChatMessageHtml(message) {
       if (!message || !message._id) {
           alert("Message is not valid");
           return;
       }
       const messageDiv = createMessageHtml(message);
       addMessagesHtmlToPage(messageDiv);
   }
   ```

   messages.join("") -> make messages a huge string. nothing inbetween items.

   since adding html to .chatMessages was already in addChatMessageHtml function, make it a separate function. 

   I've got some error at this stage, and the reason was sender's id. it looks like the sender is not registered before I completed function. I just drop the messages collection and send the messages again. not I can see messages.

7. add classes to the first and last messages

   ```js
   // chatPage.js
   
   $(document).ready(() => {
       $.get(`/api/chats/${chatId}`, (data) => {
           $("#chatName").text(getChatName(data));
       })
   
       $.get(`/api/chats/${chatId}/messages`, data => {
           let messages = [];
           let lastSenderId = '';
           data.forEach((message, idx) => {
               const html = createMessageHtml(message, data[idx + 1], lastSenderId);
               messages.push(html);
   
               lastSenderId = message.sender._id;
           });
           const messagesHtml = messages.join("");
           addMessagesHtmlToPage(messagesHtml);
       })
   })
   
   function addChatMessageHtml(message) {
       if (!message || !message._id) {
           alert("Message is not valid");
           return;
       }
       const messageDiv = createMessageHtml(message, null, "");
       addMessagesHtmlToPage(messageDiv);
   }
   
   function createMessageHtml(message, nextMessage, lastSenderId) {
       const sender = message.sender;
       const senderName = sender.firstName + " " + sender.lastName;
       const currentSenderId = sender._id;
       const nextSenderId = nextMessage != null ? nextMessage.sender._id : "";
       const isFirst = lastSenderId != currentSenderId;
       const isLast = nextSenderId != currentSenderId;
       
       const isMine = message.sender._id == userLoggedIn._id;
       let liClassName = isMine ? "mine" : "theirs";
   
       if (isFirst) {
           liClassName += " first";
       }
   
       if (isLast) {
           liClassName += " last";
       }
   }
   ```

   if a user sends multiple messages in a row, mark the first one and the last one. if only one message is sent, that message's li is both first and last.

   210614 isFirst needs to be true only for the first message but currently the second message is also set as true.

   => I have write the code above, like

   ```js
   $(document).ready(() => {
       $.get(`/api/chats/${chatId}`, (data) => {
           $("#chatName").text(getChatName(data));
       })
   
       $.get(`/api/chats/${chatId}/messages`, data => {
           let messages = [];
           let lastSenderId = '';
           data.forEach((message, idx) => {
               const html = createMessageHtml(message, data[idx + 1], lastSenderId);
               messages.push(html);
   						if (idx)
               lastSenderId = message.sender._id;
           });
           const messagesHtml = messages.join("");
           addMessagesHtmlToPage(messagesHtml);
       })
   })
   ```

   `if (idx)` should not be there. interpreter interpretes it like if there is idx, set the lastSenderId. that's why second message also didn't have a lastSenderId.

8. output the sender name

   ```js
   function createMessageHtml(message, nextMessage, lastSenderId) {
       const sender = message.sender;
       const senderName = sender.firstName + " " + sender.lastName;
       const currentSenderId = sender._id;
       const nextSenderId = nextMessage != null ? nextMessage.sender._id : "";
       const isFirst = lastSenderId != currentSenderId;
       const isLast = nextSenderId != currentSenderId;
       
       const isMine = message.sender._id == userLoggedIn._id;
       let liClassName = isMine ? "mine" : "theirs";
       let nameElement = "";
       if (isFirst) {
           liClassName += " first";
           if (!isMine) {
               nameElement = `
                   <span class="senderName">
                       ${senderName}
                   </span>
               `;
           }
       }
   
       if (isLast) {
           liClassName += " last";
       }
   
       return `
           <li class="message ${liClassName}">
               <div class="messageContainer">
                   ${nameElement}
                   <span class="messageBody">
                       ${message.content}
                   </span>
               </div>
           </li>
       `
   }
   ```

9. output the sender profile picture

   ```js
   // chatPage.js
   
       let nameElement = "";
       let userContainer = "";
       let imageContainer = "";
       let profileImage = "";
       if (isFirst) {
           liClassName += " first";
           if (!isMine) {
               nameElement = `<span class="senderName">${senderName}</span>`;
               profileImage = `<img src="${sender.profilePic}">`;
               imageContainer = `<div class="imageContainer">${profileImage}</div>`;
               userContainer = `<div class="userContainer">${imageContainer}${nameElement}</div>`;
           
           }
       }
   
       if (isLast) {
           liClassName += " last";
       }
   
       return `
           ${userContainer}
           <li class="message ${liClassName}">
               <div class="messageContainer">
                   <span class="messageBody">
                       ${message.content}
                   </span>
               </div>
           </li>
       `
   }
   ```

   I want to display the picture and the name on the same line right above first message.

10. scrolling of messages

    - currently scrolling only messages area is not working. whole page is scrolling.

      give .chatPageContainer css `flex-basis: 0;`: don't take up more space than you need to

      give .mainContentContainer css `overflow-y: hidden;`

    - scrolling messages to the bottom automatically

      ```js
      // chatPage.js
      
      function scrollToBottom(animated) {
          const container = $(".chatMessages");
          const scrollHeight = container[0].scrollHeight;
          if (animated) {
              container.animate({ scrollTop: scrollHeight}, "slow");
          } else {
              container.scrollTop(scrollHeight);
          }
      }
      ```

      and then call it when documet is ready(after get all the messages) and when message is send. 

11. loading spinner

    ```pug
    // chatPage.pug
    
    .mainContentContainer
      .loadingSpinnerContainer
      	img(src="/images/BeanEater-trans.gif", alt="loading spinner")
      .chatContainer(style="visibility: hidden")
      	ul.chatMessages
    ```

    and at the bottom of document ready add this two lines.

    ```js
    $(".loadingSpinnerContainer").remove();
    $(".chatContainer").css("visibility", "visible");
    ```

    

## Real Time Message: Socket.IO

1. socket io

   socket io will allow us to send/receive messages w/o refreshing the page.

   It will gonna be used in notification too.

   - npm install socket.io

   - app.js

     ```js
     const io = require("socket.io")(server, { pingTimeout: 60000 });
     io.on("connection", (socket) => {
       console.log("connected to socket io");
     })
     ```

     pingTimeout: how many ms without a pong packet to consider the connection closed. if you set it as 60000, it will wait a minute till close connection.

     when something connected to socket io, socket io will pass in that socket that's connected. so the socket is the client. you could rename it like below.

     ```js
     io.on("connection", (client) => {
     	console.log("connected to socket io");
     })
     ```

     

2. connect to socket io from the client

   - public/js/clientSocket.js

     ```js
     let connected = false;
     let socket = io("http://localhost:3003");
     ```

     https://socket.io/docs/v2/client-installation/

     `<script src="https://cdnjs.cloudflare.com/ajax/libs/socket.io/2.3.0/socket.io.js"></script>`

     ```pug
     // main-layout.pug
     		script(src="https://cdnjs.cloudflare.com/ajax/libs/socket.io/2.3.0/socket.io.js")
     
     script(src='/js/clientSocket.js')
     ```

     at this point, I expect to see "connected to socket io" on terminal. but I got the 400 error on my console instead.. googling........

     someone said it is the issue because the version aren't match with cdn and the one I installed. so I downgraded my socket.io (just matched it with cdn 2.3.0) and it worked!

     

3. setup socket event handler

   - app.js

     ```js
     io.on("connection", (socket) => {
       socket.on("setup", userData => {
         console.log(userData.firstName);
       })
     })
     ```

     when the socket(client) received the `setup` event, data will come with it. I will call it userData and console.log() that userData.

   - clientSocket.js

     ```js
     socket.emit("setup", userLoggedIn);
     ```

     and make the `setup` event!!

     which means... you could make any name any event!

   - app.js

     ```js
     io.on("connection", (socket) => {
       socket.on("setup", userData => {
         socket.join(userData._id);
         socket.emit("connected");
       })
     })
     ```

     when we get the setup event, it's going to join the chat room with userData._id. 

     - `join` in socket io: imagine if you join a chat room. chat room with the name userData._id in this case. if you put "my chat" parameter there, socket io will join the chat room which name is my chat. then emit things to that room. then participants of that room will perceive the things.
     - by setting the room with user id, every user in this site can have their own chat room. we could use it for notification or something.

     since socket is emit something, you need to handle it.

   - clientSocket.js

     ```js
     socket.on("connected", () => connected = true);
     ```

     set the first param with the thing that socket emitted. since socket didn't pass any data, inside of parenthesis is empty.

4. join a chat room

   - chatPage.js

     ```js
     $(document).ready(() => {
     
         socket.emit("join room", chatId);
     ```

   - app.js

     ```js
     io.on("connection", (socket) => {
       socket.on("setup", userData => {
         socket.join(userData._id);
         socket.emit("connected");
       })
     
       socket.on("join room", room => socket.join(room))
     })
     ```

5. send type notification

   - chatPage.js

     ```js
     $(".inputTextbox").keydown(event => {
         updateTyping();
       
      
     function updateTyping() {
         socket.emit("typing", chatId);
     }
     ```

   - app.js

     ```js
       socket.on("typing", room => socket.in(room).emit("typing"));
     
     ```

     `in(room)`: to room only. room here is chatId that sent from chatPage.js. if it was like `socket.emit("typing")`, typing will send to all the chat rooms.

   - chatPage.js

     ```js
     $(document).ready(() => {
     
         socket.emit("join room", chatId);
         socket.on("typing", () => console.log("user is typing"))
     
     ```

6. show the typing dots gif when user is typing

   - chatPage.pug

     ```pug
     .chatContainer(style="visibility: hidden")
       ul.chatMessages
       .typingDots
       	img(src="/images/ellipsis_green.gif", alt="typing dots")
       .footer
     ```

     

   - chatPage.js

     socket.on("typing", () => $(".typingDots").show())

7. hide the typing dots

   - chatPage.js

     ```js
     let typing = false;
     let lastTypingTime;
     
     function updateTyping() {
         if (!connected) return;
         if (!typing) {
             typing = true;
             socket.emit("typing", chatId);
         }
         lastTypingTime = new Date().getTime();
         const timerLength = 3000;
         setTimeout(() => {
             const timeNow = new Date().getTime();
             const timeDiff = timeNow - lastTypingTime;
             if (timeDiff >= timerLength && typing) {
                 socket.emit("stop typing", chatId);
                 typing = false;
             }
         }, timerLength);
     }
     ```

     declare the variables at top.

     update the updateTyping function.

     after timerLength execute a callback function.

     if last typing time is more than timer length ago, emit "stop typing" and make typing false.

   - app.js

       socket.on("stop typing", room => socket.in(room).emit("stop typing"));

   - chatPage.js

     socket.on("stop typing", () => $(".typingDots").hide())

   - when message is sent, hide typing dots

     ```js
     // chatPage.js
     
     function messageSubmitted() {
         const content = $(".inputTextbox").val().trim();
         
         if (content != "") {
             sendMessage(content);
             $(".inputTextbox").val("");
             socket.emit("stop typing", chatId);
             typing = false;
         }
     }
     ```

     add two lines at the bottom at message sumbit function.

8. send a new message event

   - chatPage.js

     ```js
     function sendMessage(content) {
         $.post("/api/messages", { content: content, chatId: chatId }, (data, status, xhr) => {
             if (xhr.status != 201) {
                 alert("Could not send message");
                 $(".inputTextbox").val(content);
                 return;
             }
     
             addChatMessageHtml(data);
             scrollToBottom(true);
             if (connected) {
                 socket.emit("new message", data);
             }
         }) 
     }
     ```

     add if connected phrase.

   - app.js

     ```js
     socket.on("new message", newMsg => {
       const chat = newMsg.chat;
       if (!chat.users) return console.log("Chat.users not defined.")
     
       chat.users.forEach(user => {
         if (user._id == newMsg.sender._id) return;
         socket.in(user._id).emit("message received", newMsg);
       });
     });
     ```

     even though the receiver is not in the chat room, the receiver should get the new message noti.. so emit to their own room that we made when first setup the socket

     don't send a message to myself

     

   - handle incoming message

     1. user is in chat room
     2. user in not in chat room

     ```js
     // clientSocket.js
     
     socket.on("message received", newMsg => messageReceived(newMsg));
     ```

     ```js
     // common.js
     function messageReceived(newMsg) {
         if ($(".chatContainer").length == 0) {
             // Show popup notification
         } else {
             addChatMessageHtml(newMsg);
         }
     }
     ```

     chatContainer's length means how many instances on that page.

     though addChatMessageHtml function is in chatPage.js, it is fine because at that stage we are already in the chatPage.

     it was not working. because user here was user id. we didn't populate it yet. 

     ```js
     // messages.js
     
     Message.create(newMessage)
         .then(async results => {
             results = await results.populate("sender").execPopulate();
             results = await results.populate("chat").execPopulate();
             results = await User.populate(results, { path: "chat.users" });
             
             Chat.findByIdAndUpdate(req.body.chatId, { latestMessage: results })
             .catch(error => console.log(error));
             res.status(201).send(results);
         })
     ```

     

## Send Notification

1. notification page

   - views/notificationsPage.pug

     ```pug
     extends layouts/main-layout.pug
     
     block content
     	.resultsContainer
     
     block headerButton
     	a(href="/messages/new")
     		i.fas.fa-comment-dots
     
     block scripts 
     	script(src="/js/notificationsPage.js") 
     ```

     

   - routes/notificationRoutes.js

     ```js
     const express = require('express');
     const app = express();
     const router = express.Router();
     const bcrypt = require("bcrypt");
     const mongoose = require("mongoose");
     const User = require("../schemas/UserSchema");
     const Chat = require("../schemas/ChatSchema");
     
     router.get("/", (req, res, next) => {
     
         res.status(200).render("notificationsPage", {
             pageTitle: "Notifications",
             userLoggedIn: req.session.user,
             userLoggedInJS: JSON.stringify(req.session.user)
         });
     });
     
     
     module.exports = router;
     ```

   - app.js

     ```js
     const notificationRoute = require("./routes/notificationRoutes");
     
     app.use("/notifications", middleware.requireLogin, notificationRoute);
     
     ```

     

2. notification schema

   schemas/NotificationSchema.js

   ```js
   const mongoose = require('mongoose');
   
   const Schema = mongoose.Schema;
   const NotificationSchema = new Schema({
       userTo: { type: Schema.Types.ObjectId, ref: 'User' },
       userFrom: { type: Schema.Types.ObjectId, ref: 'User' },
       notificationType: String,
       opened: { type: Boolean, default: false },
       entityId: Schema.Types.ObjectId,
   }, { timestamps: true });
   
   const Notification = mongoose.model('Notification', NotificationSchema);
   module.exports = Notification;
   ```

   entityId reference is not specified because it could be anything. in case of like entityId would be the id of the post, in case of  follow entityId would be the id of the user.

3. insert notifications

   there are many cases that we want to insert/send a notification from follow to message. they are all happens outside of notifications route. so what I will  gonna do now is make a code that can be reusable out there.

   ```js
   // NotificationSchema.js
   
   NotificationSchema.statics.insertNotification = async (userTo, userFrom, notificationType, entityId) => {
       let data = {
           userTo: userTo,
           userFrom: userFrom,
           notificationType: notificationType,
           entityId: entityId
       };
       await Notification.deleteOne(data).catch(error => console.log(error));
       return Notification.create(data).catch(error => console.log(error));
   };
   ```

   by declaring insertNotification function under NotificationSchema, this function can be accessed in anywhere.

   opened has a default value, so it is not specified in the function.

   if there is notification with same data already, delete it first. ex) If one user likes and unlikes repeatedly only one notificaion for each, total two notification will be sent.

4. send a follow notification

   ```js
   // users.js
   
   const Notification = require("../../schemas/NotificationSchema");
   
   router.put("/:userId/follow", async (req, res, next) => {
       const userId = req.params.userId;
   
       const user = await User.findById(userId);
       if (user == null) return res.sendStatus(404);
       
       const isFollowing = user.followers && user.followers.includes(req.session.user._id);
       const option = isFollowing ? "$pull" : "$addToSet";
   
       req.session.user = await User.findByIdAndUpdate(req.session.user._id, { [option]: { following: userId } }, { new: true })
       .catch(error => {
           console.log(error);
           res.sendStatus(400);
       })
   
       await User.findByIdAndUpdate(userId, { [option]: { followers: req.session.user._id } })
       .catch(error => {
           console.log(error);
           res.sendStatus(400);
       })
   
       if (!isFollowing) {
           await Notification.insertNotification(userId, req.session.user._id, "follow", req.session.user._id);
       }
   
       res.status(200).send(req.session.user);
   });
   ```

   don't send a noti if it's unfollow

   when the user clicks on this notification, it will take them to a profile page of a person who follows the user.

   if you follow a person now, new notification database will be created. and if you unfollow that person and then follow again, still one notification because we delete the former before we insert new one.

5. send like, retweet, reply notification

   ```js
   // posts.js
   
   const Notification = require("../../schemas/NotificationSchema");
   
   
   router.post("/", async (req, res, next) => {
   
       Post.create(postData)
       .then(async newPost => {
           newPost = await User.populate(newPost, { path: "postedBy" });
           newPost = await Post.populate(newPost, { path: "replyTo" });
           
           if (newPost.replyTo !== undefined) {
               await Notification.insertNotification(newPost.replyTo.postedBy, req.session.user._id, "reply", newPost._id);
           }
           
           res.status(201).send(newPost);
       })
   });
   
   router.put("/:id/like", async (req, res, next) => {
       if (!isLiked) {
           await Notification.insertNotification(post.postedBy, userId, "postLike", post._id);
       }
   
       res.status(200).send(post);
   });
   
   router.post("/:id/retweet", async (req, res, next) => {
       if (!deletedPost) {
           await Notification.insertNotification(post.postedBy, userId, "retweet", post._id);
       }
       res.status(200).send(post);
   });
   ```

   

6. send message notification

   send message notification is not same with the other notifications. if the message was sent to the group chat, notifications should be sent multiple users.

   ```js
   // messages.js
   
   const Notification = require("../../schemas/NotificationSchema");
   
   		Message.create(newMessage)
       .then(async results => {
           results = await results.populate("sender").execPopulate();
           results = await results.populate("chat").execPopulate();
           results = await User.populate(results, { path: "chat.users" });
           
           const chat = await Chat.findByIdAndUpdate(req.body.chatId, { latestMessage: results })
           .catch(error => console.log(error));
   
           insertNotification(chat, results);
   
           res.status(201).send(results);
       })
   
   
   function insertNotification(chat, message) {
       chat.users.forEach(userId => {
           if (userId == message.sender._id.toString()) return;
           Notification.insertNotification(userId, message.sender._id, "newMessage", message.chat._id);
       })
   }
   ```

   chat.users are ids of chat users. it is not populated. but what we need is id so it is fine.

   it's not async-await because we don't need result here.(:question: why only this one doesn't need a result...?)

   if you compare userId and message.sender._id, those two are not same. because userId is string and message.sender.\_id is objectId. so make the latter string.

## Display Notification

1. notification api route

2. retrieve notifications from the db

3. create notifications

   - notifications html

   - notification text
   - notification links
   - active class

4. make a notification as opened

5. notification click handler

6. mark all notifications as read

## Unread Notification/message badges

1. add the noti/msg badge to the nav bar
2. get the number of unread chats
3. add the number to the unread message badge
4. add the number to the unread notifications badge

## Real Time Notification

1. send the notification socket event
2. handle incoming notification
3. output the popup notification
4. notifications slide into view
5. popup message
6. mark all messages as read
7. mark unread messages