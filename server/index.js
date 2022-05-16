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

//Xem BDS đã được lưu trên bd
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

//Xem VQH đã được lưu trên bd
app.get("/planning-area", (req, res) => {
  try {
    pool.query(
      `SELECT json_build_object(
                    'type', 'FeatureCollection',
                    'features', json_agg(ST_AsGeoJSON(t.*)::json)
                    )
                FROM vungquyhoach as t(idvqh, name, diachi, vitri, mota, duyet, idtk)`,
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

//Lấy loại bất động sản
app.get("/realestate/typeof", (req, res) => {
  try {
    pool.query(`SELECT * FROM loaibatdongsan`, (err, response) => {
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

//Lấy loại vùng quy hoạch
app.get("/planning-area/typeof", (req, res) => {
  try {
    pool.query(`SELECT * FROM loaivungquyhoach`, (err, response) => {
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

//Kiểm tra đăng nhập
app.post("/taikhoan/dangnhap", (req, res) => {
  const { email, passwd } = req.body;
  console.log(email);
  console.log(passwd);

  if (!email || !passwd) {
    return res.status(400).json({
      error: true,
      message: "Chưa nhập tài khoản hoặc mật khẩu. Vui lòng kiểm tra lại.",
    });
  }
  pool.query(
    "SELECT * FROM taikhoan WHERE email=$1 AND passwd=$2",
    [email, passwd],
    (err, response) => {
      if (response.rows.length <= 0) {
        return res.status(401).json({
          error: true,
          message: "Tài khoản hoặc mật khẩu chưa đúng!",
        });
      } else {
        console.log("Login success!!!");
        return res.send(response.rows);
      }
    }
  );
});

//Lưu taikhoan mới được tạo
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

//Lưu BDS mới được tạo
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

//Lưu VQH mới được tạo
app.post("/planning-area/draw", (req, res) => {
  try {
    const { name, diachi, vitri, mota, duyet, idtk } = req.body;
    if (!name || !vitri || !diachi) {
      return res.status(400).json({
        error: true,
        message: "Vui lòng nhập các trường bắt buộc!",
      });
    }
    const geojson = vitri.features[0].geometry;

    const data = [name, diachi, geojson, mota, duyet, idtk];
    const query =
      "INSERT INTO vungquyhoach(name, diachi, vitri, mota, duyetvqh, idtk) VALUES ($1, $2, ST_GeomFromGeoJSON($3), $4, $5, $6);";
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

//Xóa BDS đã được lưu trên bd
app.delete("/realestate/delete", (req, res) => {
  const { id } = req.body;
  console.log(id);
  if (!id) {
    console.log("Thieu id");
    return;
  }
  const data = [id];
  const query = "DELETE FROM realestate WHERE id=$1;";
  pool.query(query, data, (err, response) => {
    if (err) {
      console.log(err);
    } else {
      console.log("delete success");
    }
  });
});

//Xóa VQH đã được lưu trên bd
app.delete("/planningarea/delete", (req, res) => {
  const { id } = req.body;
  if (!id) {
    return res.status(400).json({
      error: true,
      message: "Lỗi! Chưa chọn đối tượng.",
    });
  }
  const data = [id];
  const query = "DELETE FROM vungquyhoach WHERE idvqh=$1;";
  pool.query(query, data, (err, response) => {
    if (err) {
      console.log(err);
    } else {
      console.log("delete success");
    }
  });
});

//Cập nhật Tên của BDS đã được lưu trên bd
app.put("/realestate/editname", (req, res) => {
  const { id, newName } = req.body;
  try {
    if (!id || !newName) {
      console.log("Lỗi không load được dữ liệu");
    } else {
      console.log(newName);
      console.log(id);

      const data = [newName, id];
      const query = `UPDATE realestate SET name = $1 WHERE id=$2`;
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

//Cập nhật Thông tin của VQH đã được lưu trên bd
app.put("/planningarea/updateInfo", (req, res) => {
  const { id, newName, newDiaChi, newMoTa } = req.body;
  try {
    if (!id || !newName || !newDiaChi || !newMoTa) {
      console.log("Lỗi không load được dữ liệu");
      console.log(newName);
      console.log(newDiaChi);
      console.log(newMoTa);
      console.log(id);
    } else {
      console.log(newName);
      console.log(newDiaChi);
      console.log(newMoTa);
      console.log(id);

      const data = [newName, newDiaChi, newMoTa, id];
      const query = `UPDATE vungquyhoach SET name = $1, diachi=$2, mota=$3 WHERE idvqh=$4`;
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
