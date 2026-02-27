import app from "./app.js";
import dotenv from "dotenv";
import {connectDB} from "./src/db/index.db.js";

dotenv.config({
  path: "./.env",
});

connectDB().then(() => {
  app.listen(process.env.PORT, () => {
    console.log(`App is running on PORT ${process.env.PORT}`);
  });
})
.catch(() => {
    console.log(`Connection in the PORT ${process.env.PORT} failed.`);
})
