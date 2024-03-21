
import mongoose from "mongoose";
mongoose.Promise = global.Promise;

const db:any = {};
db.mongoose = mongoose;
db.url = "mongodb+srv://spin:password123123@cluster0.41xsky1.mongodb.net/";
db.spins = require("./spin.model.js")(mongoose);


module.exports = db;
