const mongoose = require('mongoose')
const app = require('./app')

mongoose.connect(process.env.MONGO_URL)
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.log(err));

app.listen(process.env.PORT, () => {
  console.log("Server running on port", process.env.PORT);
});