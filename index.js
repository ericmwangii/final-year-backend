const express = require("express");
const app = express();
const cors = require("cors");
const api = require("./api");

const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
app.use(
  express.urlencoded({
    extends: false,
  })
);

app.use("/", api);

app.listen(PORT, () => {
  console.log(`App is running on port ${PORT}`);
});
