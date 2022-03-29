const express = require("express");
const app = express();
const pool = require("./db");
const cors = require("cors");
const { response } = require("express");
const bodyParser = require("body-parser");

var corsOptions = {
  origin: "http://10.10.43.127",
  optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204
};

app.use(bodyParser.json({ limit: "50mb" }));
app.use(bodyParser.urlencoded({ limit: "50mb", extended: true }));

//Middleware
app.use(cors(corsOptions));
app.use(express.json());

app.listen(4000, () => {
  console.log("Server is listening on port 4000");
});
// respond with "hello world" when a GET request is made to the homepage
app.get("/realestate", (req, res) => {
  try {
    pool.query(
      `SELECT json_build_object(
                    'type', 'FeatureCollection',
                    'features', json_agg(ST_AsGeoJSON(t.*)::json)
                    )
                FROM realestate as t(id, name, geom)`,
      (err, response) => {
        if (err) {
          console.log(err);
        } else {
          res.json(response.rows[0].json_build_object);
        }
      }
    );
  } catch (err) {
    console.error(err.message);
  }
});

app.post("/realestate/draw", (req, res) => {
  try {
    const { name, objectDraw } = req.body;
    if (!name || !objectDraw) {
      return res.status(400).json({
        error: true,
        message: "Vui lòng nhập các trường bắt buộc!",
      });
    }
    const geojson = objectDraw.features[0].geometry;
    const data = [name, geojson];
    const query =
      "INSERT INTO realestate(name, coordinates) VALUES ($1,ST_GeomFromGeoJSON($2));";
    pool.query(query, data, (err, response) => {
      if (err) {
        return res.status(403).json({
          error: true,
          message: "Có lỗi vui lòng kiểm tra lại!",
        });
      } else {
        return res.json(response.rows);
      }
    });
  } catch (error) {
    console.log(error);
  }
});

app.delete("/realestate/delete", (req, res) => {
  const { id } = req.body;
  id.forEach((element) => {
    console.log(element);
    if (!element) {
      console.log("Thieu element");
      return;
    }
    const data = [element];
    const query = "DELETE FROM realestate WHERE id=$1;";
    pool.query(query, data, (err, response) => {
      if (err) {
        console.log(err);
      } else {
        console.log("delete success");
      }
    });
  });
});
