let setRoutes = require('./router');
let express = require('express');
let bodyParser = require('body-parser');

let app = express();

app.use((request, response, next) => {
    response.header("Access-Control-Allow-Origin", "*");
    response.header("Access-Control-Allow-Headers", "Content-Type");
    next();
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

setRoutes(app);

app.use((err, req, res, next) => {
    console.error(JSON.stringify(err));
    res.status(404).send(err);
})

module.exports = app;
