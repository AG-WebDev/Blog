const app = require("./app");
const mongoose = require("mongoose");

mongoose
  .connect('mongodb://localhost:27017/blog', {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false
  })
  .then(() => console.log("DB connection successful!"));

const port = process.env.Port || 4000;
app.listen(port, () => {
  console.log(`App running on port ${port}...`);
});
