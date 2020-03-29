// app.js
require('./db.js')
const express = require('express');
const path = require('path');
const app = express();

const mongoose = require('mongoose');
const Review = mongoose.model('Review')

const PORT = 3000;

app.set('view engine', 'hbs');
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: false }));

app.use((req, res, next) => {
    next();
})

app.get('/', (req, res) => {
    let query = {}
    if (req.query.semester !== "All") {
        query['semester'] = req.query.semester;
    }
    if (req.query.year !== "") {
        query['year'] = req.query.year;
    }
    if (req.query.professor !== "") {
        query['professor'] = req.query.professor
    }
    Review.find(query, (err, reviews) => {
        res.render('review', {reviews: reviews})
    })
});

app.get('/reviews/add', (req, res) => {
    res.render('add');
})

app.post('/reviews/add', (req, res) => {
    // NEED TO DO REQUIREMENTS VERIFICATION
    let obj = {}
    const a = new Review(req.body)
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