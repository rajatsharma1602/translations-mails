var express = require('express');
var exphbs = require('express-handlebars');
var i18n = require("i18n");

var app = express();
/**
 * nodemailer configuration
 */
var nodemailer = require('nodemailer');
var ses = require('nodemailer-ses-transport');
var transporter = nodemailer.createTransport(ses({
    accessKeyId: YOUR_KEY_ID,
    secretAccessKey: YOUR_SECRET_KEY
}));


/***************************************
 * configure i18n
 */
i18n.configure({
    locales: ['en', 'fr'],
    defaultLocale: 'en',
    directory: __dirname + '/locales',
    objectNotation: true
});
/*************************************** */

/***************************************
 * express handlebars setup
*/
// app.engine('handlebars', exphbs({ defaultLayout: `${__dirname}/views/users.handlebars` }));
var hbs = exphbs.create({
    extname: '.handlebars'
});
app.engine('handlebars', hbs.engine);
app.set('view engine', 'handlebars');


/*************************************** */

app.use(i18n.init);
/*************************************** */
app.get('/', (req,res) => {
    i18n.setLocale('en');
    res.render('users');
})
/*************************************** */
app.post('/mail',async (req,res) => {
    var defaultOptions = {
        from: YOUR_EMAIL
    }
    var hbs = exphbs.create({
        extname: '.handlebars',
        helpers: {
            i18n: function () {
                return i18n.__.apply(this, arguments);
            }
        },
        partialsDir: [
            `${__dirname}/views/`
        ]
    });
    var template = await hbs.render(`${__dirname}/views/users.handlebars`);
    // var compiledTemplate = template();
    console.log("hii");
    // setup e-mail data with unicode symbols
    var mailOptions = {
        from: defaultOptions.from, // sender address
        to: TO_EMAIL_ID, // list of receivers
        subject: "Hello ", // Subject line
        html: template // html body
    }

    // send mail with defined transport object
    transporter.sendMail(mailOptions, function (error, response) {
        if (error) {
            console.log(error);
        } else {
            console.log("Message sent: " + response.message);
        }

        // if you don't want to use this transport object anymore, uncomment following line
        //smtpTransport.close(); // shut down the connection pool, no more messages
    });
})

/*************************************** */
app.listen(4000, function () {
    console.log('express-handlebars example server listening on: 4000');
});
/*************************************** */
