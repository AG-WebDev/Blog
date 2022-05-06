require('dotenv').config();
const app = require("./app");
const mongoose = require("mongoose");

const uri =
  `mongodb+srv://${process.env.MONGODB_ATLAS_USERNAME}:${process.env.MONGODB_ATLAS_PASSWORD}@cluster0.lt3j4.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;

mongoose
  .connect(uri, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
  })
  .then(() => console.log("DB connection successful!"));

const port = process.env.PORT || 4000;
app.listen(port, () => {
  console.log(`App running on ${port}...`);
});