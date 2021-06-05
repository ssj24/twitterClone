# twitter clone

[toc]

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

3. 

## Cover Photo

## Pin a Post

## Search

## Group Chat

## Chat List

## Access Chat

## Chat Page

1. chat name

## Send Message

## Output Message

## Real Time Message: Socket.IO

## Send Notification

## Display Notification

## Unread Noti/Msg Badges

## Real Time Notification

1. 





































