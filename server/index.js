const express = require("express");
const app = express();
const pool = require("./db");
const cors = require("cors");
const bodyParser = require("body-parser");

app.use(bodyParser.json({ limit: "50mb" }));
app.use(bodyParser.urlencoded({ limit: "50mb", extended: true }));

//Middleware
app.use(cors());
app.use(express.json());

app.listen(4000, () => {
  console.log("Server is listening on port 4000");
});

//Lấy du lieu cua tai khoan
app.get("/taikhoan", (req, res) => {
  try {
    pool.query(`SELECT * FROM taikhoan`, (err, response) => {
      if (err) {
        console.log(err);
      } else {
        res.json(response.rows);
      }
    });
  } catch (err) {
    console.error(err.message);
  }
});

app.get("/taikhoan/dangnhap", (req, res) => {
  const { email, passwd } = req.body;
  try {
    pool.query(
      `SELECT * FROM taikhoan WHERE email=$1 AND passwd=$2`,
      (err, response) => {
        if (err) {
          console.log(err);
        } else {
          res.json(response.rows);
        }
      }
    );
  } catch (err) {
    console.error(err.message);
  }
});

app.post("/taikhoan/dangky", (req, res) => {
  try {
    const taikhoan = {
      email: req.body.email,
      passwd: req.body.passwd,
      hoten: req.body.hotem,
      gioitinh: req.body.gioitinh,
      ngaysinh: req.body.ngaysinh,
      anhdaidien: req.body.anhdaidien,
      quyensd: 1,
    };
    pool.query(
      `INSERT INTO taikhoan(email, passwd, hoten, gioitinh, ngaysinh, anhdaidien, quyensd) VALUES($1, $2, $3, $4, $5, $6, $7)`,
      [
        taikhoan.email,
        taikhoan.passwd,
        taikhoan.hoten,
        taikhoan.gioitinh,
        taikhoan.ngaysinh,
        taikhoan.anhdaidien,
        taikhoan.quyensd,
      ],
      (err, response) => {
        if (err) {
          console.log(err);
        } else {
          res.json(response.rows);
          res.status(201).send();
        }
      }
    );
  } catch (err) {
    console.error(err.message);
  }
});

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
        console.log(err);
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

app.put("/realestate/editname", (req, res) => {
  const { id, name } = req.body;
  try {
    if (!id || !name) {
      console.log("Lỗi không load được dữ liệu");
    } else {
      console.log(name);
      console.log(id);

      const data = [name, id];
      const query = `UPDATE realestate SET name = $1WHERE id=$2`;
      pool.query(query, data, (err, response) => {
        if (err) {
          console.log(err);
        } else {
          return res.json(response.rows);
          // getdata(response.rows);
        }
      });
    }
  } catch (err) {
    console.log(err);
  }
});

app.put("/realestate/editlatlng", (req, res) => {
  const { editItems } = req.body;
  try {
    if (!editItems) {
      console.log("Lỗi không load được dữ liệu");
    } else {
      const id = editItems.features[0].properties.id;
      const geojson = JSON.stringify(editItems.features[0].geometry);

      console.log(id);
      console.log(geojson);

      const data = [geojson, id];
      const query = `UPDATE realestate SET coordinates = ST_GeomFromGeoJSON($1) WHERE id=$2`;
      pool.query(query, data, (err, response) => {
        if (err) {
          console.log(err);
        } else {
          return res.json(response.rows);
        }
      });
    }
  } catch (err) {
    console.log(err);
  }
});
