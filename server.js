const express = require("express");
const request = require("request");
const csv = require("csvtojson");

// Create express app
const app = express();

/**
 * @description
 * set of CORS (Access-Control-Allow-Origin) to allow all
 */
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  next();
});

/**
 * @function parseNumber:
 * function to parse number to strings and 0# format
 */
const parseNumber = (number) =>
  number < 10 ? `0${number}` : number.toString();

/**
 * @description
 * set of CORS (Access-Control-Allow-Origin) to allow all
 */
app.get("/api/provincias/latest", (req, res) => {
  const date = new Date();
  const day = parseNumber(date.getDate());
  const month = parseNumber(date.getMonth() + 1);
  const baseURL = `http://geovision.uned.ac.cr/oges/archivos_covid/${month}_${day}/${month}_${day}_CSV_ACTIVOS.csv`;
  request(
    {
      url: baseURL,
    },
    (error, response, body) => {
      if (error || response.statusCode !== 200) {
        return res.status(500).json({ type: "error", message: error });
      }

      res.statusCode = 200;

      csv()
        .fromString(body)
        .then((data) => {
          console.log(data);
          res.json(data);
        });
    }
  );
});

/**
 * @constant PORT
 * server port @default 8888
 */
const PORT = process.env.PORT || 8888;

/**
 * @description
 * server starter
 */
app.listen(PORT, () => console.log(`listening on ${PORT}`));
