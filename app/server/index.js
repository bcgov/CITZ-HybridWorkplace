require("dotenv").config();
const app = require("./express");

const port = process.env.REACT_APP_API_PORT;

app.listen(port, (err) => {
  if (err) console.log(err);
  console.info(`Server started on port ${port}.`);
});
