require('dotenv').config();
const app = require('./express.js');

const port = process.env.API_PORT || 5000;

app.listen(port, (err) => { 
  if (err) console.log(err); 
  console.info(`Server started on port ${port}.`); 
});
