//code for app.js
require("dotenv").config();
const Express = require('express');
const app = Express();
const dbConnection = require("./db");
const controllers = require("./controllers");


app.use(Express.json());
app.use("/user", controllers.usercontroller);
//const middleware = require("./middleware/validate-jwt");
app.use(require("./middleware/headers"));
//app.use(middleware.CORS);




dbConnection.authenticate()
.then(() => dbConnection.sync())
.then(() => {
    app.listen(process.env.PORT, () => {
        console.log(`[Server]: App is listening on ${process.env.PORT}.`);
    });
})
.catch((err) => {
    console.log(`[Server]: Server crashed. Error = ${err}`);
})

