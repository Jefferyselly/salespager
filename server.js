const express = require('express');

const request = require('request');

const app = express();

const cookieParser = require('cookie-parser');

const ejs = require('ejs');

const bodyParser = require('body-parser');

const FroalaEditor = require('wysiwyg-editor-node-sdk/lib/froalaEditor.js');
const cloudinary = require('cloudinary')

const {Posts} = require('./class/Post.js')


const {affiliateDB} = require('./models/AffiliateDB.js');

const {paymentDB} = require('./models/PaymentDB.js');

const {contentDB} = require('./models/ContentDB.js')

const path = require('path');

const mime = require('mime');

const _ = require('lodash');

const fs = require('fs');

const {initializePayment,verifyPayment} = require('./config/paystack.js')(request);

const {config} = require('./modules/config');

cloudinary.config({
    cloud_name : "dfkpmm1x3",
    api_key : '259997922632113',
    api_secret : "i8boZ81HtWuCQ2Gzao76liH0L9o"
})

const port = process.env.PORT || 3000;
app.use(cookieParser());

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}))
app.use(express.static(path.join(__dirname, '/public')));

app.set('view_engine', 'ejs');



app.get('/', (req,res) => {

    contentDB.findOne({Page : "main"}).then((main) => {
         if(main == null){

                 main = new Object
                main.Post =  "No content here"
 
            }

        contentDB.findOne({Page : "freebie"}).then((freebie) => {
             if(freebie == null){

                 freebie = new Object
                freebie.Post = "No content here"


                
            }

            contentDB.findOne({Page : "catch"}).then((_catch) => {
                 if(_catch == null){

                 _catch = new Object
                _catch.Post = "No content here"


                
            }


    res.render('index.ejs', 
        {main,
            freebie,
            _catch,
            config})
        
    })

    })


    })


});



app.post('/new_post', (req,res) => {

    const post = new Posts();

    post.store_in_database(req,res)

})
app.post('/paystack/pay', (req, res) => {
    const form = _.pick(req.body,['amount','email','full_name']);
    form.amount = 1500
    form.metadata = {
        full_name : form.full_name
    }
    form.amount *= 100;
    
    initializePayment(form, (error, body)=>{
        if(error){
            //handle errors
            console.log(error);
            return res.redirect('/error')
            return;
        }
        response = JSON.parse(body);
        res.redirect(response.data.authorization_url)
    });
});

app.get('/paystack/callback', (req,res) => {
    const ref = req.query.reference;
    verifyPayment(ref, (error,body)=>{
        if(error){
            //handle errors appropriately
            
            return res.redirect('/error');
        }
        //STORE VALUES OF BODY IN JSON 
        	 response= JSON.parse(body);

             const the_body = {
               reference : response.data.reference,
               amount : response.data.amount,
               status : response.data.status,
               channel : response.data.channel,
               currency : response.data.currency
             }

             const payment = new paymentDB(the_body);

             payment.save().then((payed) => {


                res.cookie('paid','true',{
                    maxAge : 1000 * 60 * 120 //Let the cookie last for just 2hours.
                }).redirect('/success');

         

             })
    })
});

app.get('/success', authenticate, (req,res) => {
    res.render('success.ejs',{
        config
    }) ;
})

app.get('/error', (req,res) => {
	res.render('error.ejs',{
		config
	})
})

app.get('/pay', (req,res) => {
    res.render('pay.ejs',{
        config
    })
})

//The download route 
 app.get('/download', authenticate, function (req, res) {
        var filePath = __dirname+"/files/12BOOKS.zip";

        var filename = path.basename(filePath);

        
         res.setHeader('Content-disposition', 'attachment; filename=' + filename);
  res.setHeader('Content-type', "zip");

  var filestream = fs.createReadStream(filePath);
  filestream.pipe(res);

        // fs.readFile(__dirname + filePath , function (err,data){
        //     res.contentType("application/pdf");
        //     res.send(data);
        // });
    });

 //free book route
 app.get('/freebook', (req,res) => {
    var filePath = "/free/free.pdf";

     fs.readFile(__dirname + filePath , function (err,data){
       
            res.contentType("application/pdf").send(data);
        });


 })



app.get('/advertiser', (req,res) => {

    

    contentDB.findOne({Page : "main"}).then((main) => {
        console.log(main)

            if(main == null){

                 main = new Object
                main.Post = "Edit here for freebie section"


                
            }

        contentDB.findOne({Page : "freebie"}).then((freebie) => {

            if(freebie == null){

                 freebie = new Object
                freebie.Post = "Edit here for freebie section"


                
            }
            

            contentDB.findOne({Page : "catch"}).then((_catch) => {

                if(_catch == null || _catch == undefined){

                 _catch = new Object;
                _catch.Post = "Edit here for Catch section"
            }

            
                res.render("manage.ejs", {
                    main,
                    freebie,
                    _catch,
                    config
                })
                })
            .catch((e) => {
                    console.log(e)

            })
        }) .catch((e) => {
                    console.log(e)
                })
    }).catch((e) => {
        console.log(e)
    })
})


app.post('/image_upload',(req,res) => {

    FroalaEditor.Image.upload(req, 'public/uploads/', function (err, data) { 
        

        if (err) {
  return res.send(JSON.stringify(err));
}


//if there is a succesful upload, send the name of the file to cloudinary for storage.
cloudinary.uploader.upload(data.link, function(result){

    console.log(result)


    data = result.url


data = JSON.stringify({
    link  : data 
})
res.send(data);

})


     });
})

        


//Middlewares
function authenticate(req,res,next){
    let cookieSet = req.cookies['paid'];

    if(!cookieSet){
        res.redirect('/error')
    }
   next();

}

app.listen(port, () => {
    console.log('The server is running');
});