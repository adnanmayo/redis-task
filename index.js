// var name = require('./package.json').name
// require('productionize')(name)

// var server = require('./lib/server')
// var port = process.env.PORT || 5000
// server().listen(port)
// console.log(name, 'listening on port', port)

const express = require('express');
var http = require('http')

const cors = require('cors');
const app = express();
const routes = require('./src/routes');
const port = 3000
app.use(cors());
const bodyParser = require('body-parser');
app.use(bodyParser.json({ extended: true }))

const redis = require('redis');
const client = redis.createClient();

client.on('connect', function () {
    console.log('Redis Connected!');
});

app.use('/', routes);

app.listen(port, () => {
    console.log(`app listening at http://localhost:${port}`)
})






module.exports = app;