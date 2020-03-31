// app.js
require('./db.js')
const express = require('express');
const session = require('express-session')
const path = require('path');
const app = express();

const mongoose = require('mongoose');
const Review = mongoose.model('Review')

const PORT = 3000;

app.set('view engine', 'hbs');
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: false }));

const sessionOptions = {
    secret: 'secret for signing session id',
    saveUninitialized: false,
    resave: false
};

app.use(session(sessionOptions));

app.use(function(req, res, next) {
    if (req.session.visits === undefined) {
        req.session.visits = 0
    }
    req.session.visits += 1;
    res.locals.pageVisits = req.session.visits;
    next();
})

app.get('/', (req, res) => {
    let query = {}
    if (req.query.semester !== "All" && req.query.semester !== undefined) {
        query['semester'] = req.query.semester;
    }
    if (req.query.year !== "" && req.query.year !== undefined) {
        query['year'] = req.query.year;
    }
    if (req.query.professor !== "" && req.query.professor !== undefined) {
        let prof = req.query.professor
        prof = prof[0].toUpperCase() + prof.slice(1)
        query['professor'] = prof;
    }
    Review.find(query, (err, reviews) => {
        res.render('review', {reviews: reviews});
    })
});

app.get('/reviews/add', (req, res) => {
    res.render('add');
})

app.post('/reviews/add', (req, res) => {
    // NEED TO DO REQUIREMENTS VERIFICATION
    let obj = {}
    const a = new Review(req.body);
    if (typeof(req.body.year) !== Number) {
        console.log('AHAH')
    }
    console.log(a)
    a.save((err, saved) => {
        if (!err) {
            res.redirect('/')
        }
    })
    
})





app.listen(PORT)