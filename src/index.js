const app = require("./app");
const port = process.env.PORT;

/********** Run Express Server ***********/
app.listen(port, () => {
  console.log(`Server is up on port ${port}!`);
});
