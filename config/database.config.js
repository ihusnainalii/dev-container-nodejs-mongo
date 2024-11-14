const dotenv = require('dotenv');
dotenv.config();

module.exports = {
    app_name: process.env.APP_NAME,
    port: process.env.PORT,
    db_user: process.env.DB_USER,
    db_password: process.env.DB_PASSWORD,
    db_name_ip: process.env.DB_NAME_IP,
    db_port: process.env.DB_PORT,
    db_name: process.env.DB_NAME
}