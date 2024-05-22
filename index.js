import express from "express";
import multer from 'multer';
import path from 'path';
import fs from 'fs'
import { fileURLToPath } from 'url';
import mongoose from 'mongoose';
import nodemailer from 'nodemailer';
import cookieParser from "cookie-parser";
import { insertUser, getAllProducts, getProduct, getUser, verifyUser, getUserByEmail,insertProduct ,insertbuyers, getBuyer } from "./dbServices.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const app = express();
app.use(express.urlencoded({ extended: false }));
app.use(express.static(__dirname + '/views'));
// app.use(express.favicon(__dirname + '/views/images/icon.png'));
app.use(cookieParser());
app.set('view engine', 'ejs');

const oneDay = 1000 * 60 * 60 * 24;

mongoose.connect("mongodb+srv://7ajati:7ajati@cluster0.ncwhhbj.mongodb.net/?retryWrites=true&w=majority");
mongoose.connection.on('error', (error) => {
    console.error('MongoDB connection error:', error);
});

const db = mongoose.connection;

const storage = multer.diskStorage({
    destination: (req,file,cb) => {
        const path = `views/img/${req.body.title}`;
        fs.mkdirSync(path, { recursive: true })
        return cb(null, path)
    },
    filename:(req,file,cb) => cb(null, file.originalname),
});

const upload = multer({storage});

db.once('open', () => {
    console.log('Connected to MongoDB');
    app.listen(3000, () => console.log('Server started at 3000'));
});

app.all('/*', checkUserLoggedIn);

app.get('/', async (req, res) => {
    const products = await getAllProducts();
    res.render('index', { products, loggedIn: req.body.loggedIn });
});

app.get('/404', (req, res) => res.render('404', { loggedIn: req.body.loggedIn }));

app.get('/shop', async (req, res) => {
    const products = await getAllProducts();
    res.render('shop', { products, loggedIn: req.body.loggedIn });
});


app.get('/product/:id', async (req, res) => {
    const id = req.params.id;
    const product = await getProduct(id);
    const products = await getAllProducts(4, id);
    if (product) {
        res.render('product', { product, products, loggedIn: req.body.loggedIn });
    } else {
        res.redirect('/404');
    }
});
//maya
app.get('/howItWorks', (req, res) => {
    res.render('howItWorks', { loggedIn: req.body.loggedIn });
}); 

app.get('/termsOfUse', (req, res) => {
    res.render('termsOfUse', { loggedIn: req.body.loggedIn });
}); 

app.get('/policy', (req, res) => {
    res.render('policy', { loggedIn: req.body.loggedIn });
}); 
//

app.post('/listIt', upload.array("images", 5), async (req, res) => {
    const images =  req.files;
    console.log('++++', images)
    const {title,price,deposit,category,desc,phone,city} = req.body;
    const listing = await insertProduct(title,price,deposit,category,desc,images,phone,city);
    if(listing){
        res.status(200).redirect(`/product/${listing._id.toString()}`);
    }
    else {
        res.redirect('/404');
    }
});
app.get('/listIt', (req, res) => {
    res.render('listIt', { loggedIn: req.body.loggedIn });
});

app.get('/about', (req, res) => {
    res.render('about', { loggedIn: req.body.loggedIn });
});

app.get('/contact-us', (req, res) => {
    res.render('contact', { loggedIn: req.body.loggedIn });
});

app.get('/cart', (req, res) => {
    res.render('cart', { loggedIn: req.body.loggedIn });
});

app.get('/productdetails/:id', async (req, res)=> {
    const id = req.params.id;
    const product = await getProduct(id);
    return res.send(product);
});

app.get('/shop2', async (req, res) => {
    const products = await getAllProducts();
    res.render('shop2', { products, loggedIn: req.body.loggedIn });

});
const categories = ['Appliances', 'Books', 'Trips', 'Electronics', 'Clothes', 'Pets', 'Gaming', 'PartyandEvents', 'ToolsandGarden', 'Beauty', 'HealthandWellbeing'];

categories.forEach(category => {
    app.get('/' + category, async (req, res) => {
        const products = await getAllProducts(100, null, category);
        res.render(category, { products, loggedIn: req.body.loggedIn });
    });
});


//daniah
app.get('/checkout', (req, res) => {
    res.render('checkout', { loggedIn: req.body.loggedIn });
});

//daniah
app.get('/visa-info', (req, res) => {
    res.render('visa-info', { loggedIn: req.body.loggedIn });
});


//daniah
app.get('/checkout4', async (req, res) => {
    const buyer = await getBuyer(); // We'll correct this function to fetch the buyer correctly
    res.render('checkout4', { buyer, loggedIn: req.body.loggedIn });
});
//daniah
app.post('/checkout', async (req, res) => {
    const {first_name,last_name,city,line_address1,Phone_number,email,delivery_method,payment_method} = req.body;
    const buyers= await insertbuyers(first_name,last_name,city,line_address1,Phone_number,email,delivery_method,payment_method);
    if(buyers){
        res.status(200).redirect('/checkout4');
    }
    else {
        res.redirect('/404');
    }
});



app.post('/sign-up', async (req, res) => {
    const { username, email, mypassword } = req.body;
    const verificationCode = Math.floor((Math.random() * 100) + 54);
    const user = await insertUser(username, email, mypassword, verificationCode);

    if (user) {
        const smtpTransport = nodemailer.createTransport({
            host: 'smtp.gmail.com',
            port: 465,
            secure: true,
            auth: {
                user: "7ajatisite@gmail.com",
                pass: "ifkq jyeu hpvl jgrf"
            }
        });

        const host = req.get('host');
        const link = "http://" + host + "/verify?id=" + verificationCode + "&email=" + email;
        const mailOptions = {
            to: email,
            subject: "7ajati: Please confirm your Email account",
            html: "Hello,<br> Please Click on the link to verify your email.<br><a href=" + link + ">Click here to verify</a>"
        }

        smtpTransport.sendMail(mailOptions, function (error, response) {
            if (error) {
                console.log(error);
                res.end("error");
            } else {
                console.log("Message sent");
                res.end("sent");
            }
        });
        res.status(409).render('error', { msg:'A verification code has been sent to your email', loggedIn: req.body.loggedIn });
        // res.status(201).send('A verification code has been sent to your email');
    } else {
        res.status(409).render('error', { msg:'Email or username already exists', loggedIn: req.body.loggedIn });
        // res.status(409).send('Email or username already exists');

    }
});

app.get('/verify', async (req, res) => {
    const verificationCode = req.query.id;
    const email = req.query.email;
    const user = await getUserByEmail(email);

    if (user && user.verificationCode === Number(verificationCode)) {
        await verifyUser(email);
        setUserCookies(res, user._id, user.username);
        res.status(200).redirect('/shop');
    } else {
        res.status(401).render('error', { msg:'Wrong credential', loggedIn: req.body.loggedIn });
        // res.status(401).send('Wrong credential');
    }
});

app.post('/login', async (req, res) => {
    const { email, password } = req.body;
    const user = await getUser(email, password);
    if (user && user.verified) {
        setUserCookies(res, user._id, user.username);
        res.status(200).redirect('/shop');
    } else if (user && !user.verified) {
        res.status(401).render('error', { msg:'Please verify your account', loggedIn: req.body.loggedIn });

        // res.status(401).send('Please verify your account');
    } else {
        res.status(401).render('error', { msg:'Wrong email or password', loggedIn: req.body.loggedIn });

        // res.status(401).send('Wrong email or password');
    }
});

function setUserCookies(res, id, username) {
    res.cookie('UID', id, { maxAge: oneDay });
    res.cookie('uname', username, { maxAge: oneDay });
}

app.get('/logout', (req, res) => {
    res.clearCookie("UID");
    res.clearCookie("uname");
    res.redirect('/');
});


function checkUserLoggedIn(req, res, next) {
    const cookies = req.headers.cookie || '';
    if (cookies.includes('UID') && cookies.includes('uname')) {
        req.body.loggedIn = true;
    }

    next();
}
