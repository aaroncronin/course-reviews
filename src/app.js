// app.js
require('./db.js');
const express = require('express');
const session = require('express-session');
const path = require('path');
const app = express();

const mongoose = require('mongoose');
const Review = mongoose.model('Review');

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
        req.session.visits = 0;
    }
    req.session.visits += 1;
    res.locals.pageVisits = req.session.visits;

    if (req.session.Reviews === undefined) {
        req.session.Reviews = [];
    }
    if (Object.keys(req.body).length !== 0) {
        req.session.Reviews.push(req.body);
    }
    res.locals.reviews = req.session.Reviews;
    const headers = req.headers.cookie.split('; ');
    console.log("\nThe cookie header contains:");
    headers.forEach((cook) => console.log(cook));
    next();
});

app.get('/', (req, res) => {
    const query = {};
    if (req.query.semester !== "All" && req.query.semester !== undefined) {
        query['semester'] = req.query.semester;
    }
    if (req.query.year !== "" && req.query.year !== undefined) {
        query['year'] = req.query.year;
    }
    if (req.query.professor !== "" && req.query.professor !== undefined) {
        let prof = req.query.professor;
        prof = prof[0].toUpperCase() + prof.slice(1);
        query['professor'] = prof;
    }
    Review.find(query, (err, reviews) => {
        res.render('review', {reviews: reviews});
    });
});

app.get('/reviews/add', (req, res) => {
    res.render('add');
});

app.post('/reviews/add', (req, res) => {
    const a = new Review(req.body);
    a.save((err, saved) => {
        if (err) {
            res.render('add', {error: "Review not added. You must enter valid data!"});
        } else {
            res.redirect('/'); // doesn't get saved if data input is invalid
        }
    });
});

app.get('/reviews/mine', (req, res) => {
    res.render('myreviews', {data: res.locals.reviews});
});

app.listen(PORT);