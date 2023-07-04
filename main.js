var http = require('http');
var app = require('./api/index.js');

http.createServer(app).listen(3000, function() {
    console.log("Express Server Runing on http://localhost:3000");
});
