var port = process.env.PORT || 4000,
    express = require('express'),
    app = express(),
    request = require('request'),
    fs = require('fs'),
    bodyParser = require('body-parser');

app.use("/", express.static(__dirname + '/static'));
app.engine('ejs', require('ejs').__express);
app.set('view engine', 'ejs');

app.get('/*', function(req, res){
    res.render('index');
});

/* keep this as the last route */
app.get('/*', function(req, res){
    res.render('404');
});

/* start app */
if (!module.parent) {
  app.listen(port);
  console.log('Express app started on port '+port);
}