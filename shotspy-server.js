var port = process.env.PORT || 4000,
    express = require('express'),
    app = express(),
    expressLayouts = require('express-ejs-layouts'),
    request = require('request'),
    fs = require('fs'),
    bodyParser = require('body-parser'),
    firebaseAppUrl = "https://spyshot-54dea.firebaseapp.com",
    firebaseAppSaveImageEndpoint = "/save";

app.engine('ejs', require('ejs').__express);
app.use("/", express.static(__dirname + '/static'));

app.set('view engine', 'ejs');
app.use(expressLayouts);

app.get('/ss', function(req,res){
    
    console.log("/ss screenshot...");
    
    var url = req.query.url;
    
    if (typeof url!="undefined") {
        
        // take a snapshot
        var phantom = require('phantom');
        phantom.create().then(function (ph) {
            console.log("phantom created..."+ph.version);
            ph.createPage().then(function (page) {
                console.log("phantom page created...");
                page.property('viewportSize',{width:1200,height:800});
                page.property('clipRect',{top:0,left:0,width:1200,height:800});
                page.setting('zoomFactor',1.1);
                page.setting('userAgent','Mozilla/5.0 (Windows NT 6.1) AppleWebKit/534.24 (KHTML, like Gecko) Chrome/11.0.696.68 Safari/534.24');
                //page.setting('localToRemoteUrlAccessEnabled',true);
                page.open(url).then(function (status) {
                   
                    console.log("phantom opened url:"+status);
                   
                    if (status=="success"){
                      
                      setTimeout(function() {
                        
                        page.renderBase64('PNG').then(function(base64){
                            console.log("renderBase callback...");
                            ph.exit();
                            if (typeof base64 != "undefined") {
                                
                                var buf = new Buffer(base64, 'base64');
                                request.post({url:firebaseAppUrl + firebaseAppSaveImageEndpoint + "?url="+url,json:false,
                                    headers:{'Content-Type':"image/png"},
                                    body:buf}, function (e,r,b){
                                        
                                        console.log("firebase image save callback...");
                                        
                                        if (typeof b!="undefined" ) {
                                            res.json({ok:b});
                                        }
                                        else {
                                            res.render('500', {error:'Unknown image save error.'});
                                        }
                                });
                                
                            }
                            else {
                                res.json({error:'Failed to render image.'});
                            }
                        });
                        
                      },1400);
                    } else {
                        res.render('500',{error:'Phantom was not successful'});
                    }
                    
                });
            }); //createPage
        },
        {
            dnodeOpts: {
              weak: false
            }
        }); //phantom
    }
    else {
        res.render('500', {error:'No `url` parameter was passed.'});
    }
    
});

app.get('/dup', function(req,res){
    
    console.log("duplicate image from image url...");
    
    var imgUrl = req.query.url;
    
    if (typeof imgUrl!="undefined") {
        
        // get binary image data from url
        request.get({url: imgUrl, encoding: null}, function (err, response, body) {
            
            console.log("image binary data---------------------------------");

            if (typeof body != "undefined") {
                
                var buf = new Buffer(body, 'base64');
                request.post({url:firebaseAppUrl + firebaseAppSaveImageEndpoint + "?url="+imgUrl,json:false,
                    headers:{'Content-Type':"image/png"},
                    body:buf}, function (e,r,b){
                        
                        console.log("firebase image save callback...");
                        
                        if (typeof b!="undefined" ) {
                            res.json({ok:b});
                        }
                        else {
                            res.render('500', {error:'Unknown image save error.'});
                        }
                });
                
            }
            else {
                res.json({error:'Failed to render image.' + err});
            }
        });
        
    }
    else {
        res.render('500', {error:'No `url` parameter was passed.'});
    }
    
});

app.get('/', function(req, res){
    res.render('index',{});
});

/* keep this as the last route */
app.get('/*', function(req, res){
    res.render('404',{});
});

/* start app */
if (!module.parent) {
  app.listen(port);
  console.log('Express app started on port '+port+' process id:' + process.pid);
}