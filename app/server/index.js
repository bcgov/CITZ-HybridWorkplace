require("dotenv").config();
<<<<<<< HEAD
const app = require("./express");
=======
const app = require("./express.js");
>>>>>>> 96fddc2 ([refs hwp-277] Docker Hotloading)

const port = process.env.API_PORT;

app.listen(port, (err) => {
  if (err) console.log(err);
  console.info(`Server started on port ${port}.`);
});
