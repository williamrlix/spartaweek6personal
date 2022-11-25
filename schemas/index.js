const mongoose = require("mongoose");
const database = process.env.MONGO.URl || "mongodb+srv://liam:liam123@databaseliam.xsh8tme.mongodb.net/?retryWrites=true&w=majority";
const connect = () => {
    mongoose
        .connect('mongodb+srv://liam:liam123@databaseliam.xsh8tme.mongodb.net/?retryWrites=true&w=majority')
        .catch(err=>console.log(err))
}

mongoose.connection.on('error', err=> {
    console.error('MongoDB connection error', err);
})

mongoose.connection.on('connected', ()=> {
    console.log(`${database} terkoneksi`);
});

module.exports = connect;