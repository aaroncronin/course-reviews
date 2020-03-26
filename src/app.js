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
     Review.find({}, (err, reviews) => {
        res.render('review', {reviews: reviews})
    })

});




app.listen(PORT)