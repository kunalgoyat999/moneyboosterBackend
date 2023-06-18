const mongoose = require('mongoose');

const connectDB = async () => {
    const conn = await mongoose.connect(process.env.MONGODB_URI);

    console.log(`MongoDB connected`.cyan.underline.bold)
}

module.exports = connectDB