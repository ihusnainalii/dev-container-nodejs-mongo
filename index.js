import app from "./server.js";
import config from "./config/database.config.js";

app.listen(config.port, () =>{
    console.log(config.app_name + " Started on Port " + config.port)
})