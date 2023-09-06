import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import router from "./router/product.js";
import routerUser from "./router/user.js";

const app = express();
app.use(express.json());
app.use(cors({
  origin: "http://localhost:4200"
}))

app.use('/api', router);
app.use("/api", routerUser);
const port = 8088;

mongoose
  .connect("mongodb://127.0.0.1:27017/BE_Angular")
  .then(() => console.log("Connect to DB successfully"));

app.listen(port, function () {
  console.log(`Server is running on port ${port}`);
});