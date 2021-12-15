const express = require('express');
const http = require ('http');
const hostname = '127.0.0.1';
const port = 3000;
let router = require('./router');
const config = require('./config');

const mongoose=require('mongoose');
mongoose.connect(config.db);


/*const server = http.createServer((req,res)=>{
    res.statusCode=200;
    res.setHeader('Content-Type', 'text/plain');
    res.end('Hello World\n');
}); */

var app = express ();
const server = http.Server(app);
app.use(router.initialize());

server.listen(port,hostname, ()=>{
    console.log(`Server running at http://${hostname}:${port}/`);
});