const mongoose = require('mongoose');

const connectDB = () => {
    mongoose.connect(process.env.DATABASE_URL)
    .then(() => console.log('Database connection established'))
    .catch((error)=> console.log(error.message));
}

module.exports = connectDB;