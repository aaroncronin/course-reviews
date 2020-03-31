const mongoose = require('mongoose');



// my schema goes here!
const Review = new mongoose.Schema({
    courseNumber: String,
    courseName: String,
    semester: String,
    year: Number,
    professor: String,
    review: String
});


mongoose.model('Review', Review);

let dbconf;
if (process.env.NODE_ENV === 'PRODUCTION') {
    const fs = require('fs');
    const path = require('path');
    const fn = path.join(__dirname, '../config.json');
    const data = fs.readFileSync(fn);

    const conf = JSON.parse(data);
    dbconf = conf.dbconf;
} else {
    dbconf = 'mongodb://localhost/hw06';
}

mongoose.connect(dbconf, {
    useNewUrlParser: true, 
    useUnifiedTopology: true
});