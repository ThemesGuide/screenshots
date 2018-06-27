var port = process.env.PORT || 4000,
    express = require('express'),
    app = express(),
    expressLayouts = require('express-ejs-layouts'),
    request = require('request'),
    fs = require('fs'),
    bodyParser = require('body-parser');

app.engine('ejs', require('ejs').__express);
app.use("/", express.static(__dirname + '/static'));

app.set('view engine', 'ejs');
app.use(expressLayouts);

app.get('/ss', function(req,res){
    
    console.log("/ss2 screenshot...");
    
    var url = req.query.url;
    //url = url.replace("https:/","http:/");
    
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
                   
                    console.log("opened url for img: "+status);
                   
                    if (status=="success"){
                      
                      setTimeout(function() {
                        
                        page.renderBase64('PNG').then(function(base64){
                            console.log("cb------------------------------------");
                            ph.exit();
                            if (typeof base64 != "undefined") {
                                
                                var buf = new Buffer(base64, 'base64');
                                request.post({url:"https://spyshot-54dea.firebaseapp.com/save?url="+url,json:false,
                                    headers:{'Content-Type':"image/png"},
                                    body:buf}, function (e,r,b){
                                    console.log("WROTE NEW FILE TO FIREBASE....."+JSON.stringify(b));
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
                        
                      },1800);
                    } else {
                        res.render('500', {error:'Phantom was not successful.'});
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
        res.render('500', {error:'No `id` parameter was passed.'});
    }
    
});

app.get('/', function(req, res){
    res.render('index',{body:'what?'});
});


/* keep this as the last route */
app.get('/*', function(req, res){
    res.render('404',{});
});

/* start app */
if (!module.parent) {
  app.listen(port);
  console.log('Express app started on port '+port);
}