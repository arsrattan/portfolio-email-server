const http = require('http');
const app = require('./app');

const PORT = process.env.PORT || 3005;

http.createServer(app)
    .on('error', err => {

    })
    .listen(PORT, () => {
        console.log(`Now listening on port ${PORT}...`);
    });