import dotenv from "dotenv";
dotenv.config();

import mongoose from 'mongoose';
import app from "./app";

mongoose.set('strictQuery', true); // Avval sozla 🔧
mongoose.connect(process.env.MONGO_URL as string, {}) // Keyin ulat 🔌
.then((data) => {
    console.log("MongoDB connection succeed")
    const PORT = process.env.PORT ?? 3006 ;
    app.listen(PORT,function() {
        console.info(`The server is running successfully on port: ${PORT}`);
        console.info(`Admin project on http://localhost:${PORT}/admin\n`);
    })
})
.catch(err => console.log ("ERROR on connection MongoDB", err));