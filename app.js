require("dotenv").config();
let express = require("express");
let ejs = require("ejs");
let http = require("http");
let bodyParser = require("body-parser");

const app = express();
const port = process.env.PORT || 3000;

app.set("view engine", "ejs");

app.use(express.static(__dirname + "/public"));

app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});

app.post("/", (req, res) => {
  const query = req.body.cityName;
  const apiKey = process.env.APPID;
  const units = "metric";

  const url =
    "http://api.openweathermap.org/data/2.5/weather?q=" +
    query +
    "&appid=" +
    apiKey +
    "&units=" +
    units +
    "";

  http.get(url, (response) => {
    response.on("data", (d) => {
      const weatherData = JSON.parse(d);
      const tempLevel = weatherData.main.temp;
      const description = weatherData.weather[0].description;
      const icon = weatherData.weather[0].icon;
      const imgURL = "https://openweathermap.org/img/wn/" + icon + "@4x.png";

      res.render("weather", {
        city: query,
        temperature: Math.round(tempLevel),
        condition: description,
        img: imgURL,
      });
    });
  });
});

app.listen(port, () => {
  console.log(`server running on port ${port}`);
});
