const express = require('express');
const bodyParser = require('body-parser');
const app = express();

const UserRoute = require('./routes/User')
const config = require('./config/database.config');
const mongoose = require('mongoose');

app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())

app.use('/user', UserRoute)

app.get('/', (req, res) => {
    res.json({"message": "Hello Crud Node Express"});
});

app.listen(config.port, () => {
    console.log(`Server is listening on port ${config.port}`);
});

console.log(`Your app is ${config.app_name}`);
console.log(`Your port is ${config.port}`);
console.log(`Your db port is ${config.db_port}`);
console.log(`Your db name ip is ${config.db_name_ip}`);
console.log(`Your db name is ${config.db_name}`);

mongoose.Promise = global.Promise;

const mongoURL = `mongodb://${config.db_user}:${config.db_password}@${config.db_name_ip}:${config.db_port}/${config.db_name}?authSource=admin`;
console.log(`db URL is ${mongoURL}`);

mongoose.connect(mongoURL, {}).then(() => {
    console.log("Databse Connected Successfully!!");    
}).catch(err => {
    console.log('Could not connect to the database', err);
    process.exit();
});