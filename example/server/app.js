var express = require('express');
var resumable = require('./resumable-node.js')('./tmp/');
var app = express();
var multipart = require('connect-multiparty');
var fs = require('fs');

// Host most stuff in the public folder
app.use(express.static(__dirname + '/public'));

app.use(multipart());

// Uncomment to allow CORS
app.use(function (req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  next();
});

// Handle uploads through Resumable.js
app.post('/upload', function (req, res) {
    resumable.post(req, function (status, filename, identifier) {
      res.send({file: filename});
  });
});

// Handle status checks on chunks through Resumable.js
app.get('/upload', function (req, res) {
  resumable.get(req, function (status, filename, original_filename, identifier) {
    console.log('GET', status);
    res.send((status == 'found' ? 200 : 404), status);
  });
});

app.get('/tmp/:file', function (req, res) {
  res.setHeader("content-type", "application/octet stream");
  fs.createReadStream("./tmp/" + req.params.file).pipe(res);
});

app.get('/resumable.js', function (req, res) {
  var fs = require('fs');
  res.setHeader("content-type", "application/javascript");
  fs.createReadStream("./resumable.js").pipe(res);
});

app.listen(3000);
