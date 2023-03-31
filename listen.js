const app = require("./app.js");

const { PORT = 9090 } = process.env;

app.listen(PORT, (err) => {
  if (err) console.log(err.message);
  console.log(`NC-NEWS app listening on port ${PORT}`);
});