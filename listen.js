const app = require("./app.js");

const { port = 9090 } = process.env;

app.listen(port, (err) => {
  if (err) console.log(err.message);
  console.log(`NC-NEWS app listening on port ${port}`);
});