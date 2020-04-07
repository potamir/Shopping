const express = require("express");
const mysql = require("mysql");
const cors = require("cors");
const bodyParser = require("body-parser");
const app = express();
const port = 2323;
const jsftp = require("jsftp");

app.use(bodyParser.json({ limit: "100mb", extended: true }));
app.use(bodyParser.urlencoded({ limit: "100mb", extended: true }));
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

const fs = require("fs");

const connection = mysql.createConnection({
  host: "45.130.228.103",
  user: "u417265157_potamirBoZvtdC",
  password: "BoZvtdCS",
  database: "u417265157_shoppingdb",
  timezone: "utc",
  connectionLimit: 0,
});

const ftp = new jsftp({
  host: "45.130.228.116",
  port: 21,
  user: "u417265157",
  pass: "SODUtRBoZvtdCS",
});

app.post("/items_post", (req, res) => {
  const date = new Date();
  const data = {
    name: req.body.name,
    total: req.body.total,
    price: req.body.price,
    description: req.body.description,
    tag1: req.body.tag1,
    tag2: req.body.tag2,
    tag3: req.body.tag3,
    tag4: req.body.tag4,
    img1: req.body.img1.toString(),
    img2: req.body.img2.toString(),
    img3: req.body.img3.toString(),
    img4: req.body.img4.toString(),
    status: req.body.status,
    itemId: parseInt(req.body.itemId),
    weight: req.body.weight,
  };
  res.send({ data: data.img1.split(",") });

  // let query = `INSERT INTO items (name, total, price, description, tag1, tag2, tag3, tag4, img1, img2, img3, img4, weight) VALUES ('${data.name}', ${data.total}, ${data.price}, '${data.description}', '${data.tag1}', '${data.tag2}', '${data.tag3}', '${data.tag4}', '${data.img1}', '${data.img2}', '${data.img3}', '${data.img4}', ${data.weight})`;
  // if (data.status === "edit")
  //   query = `REPLACE INTO items (item_id, name, total, price, description, tag1, tag2, tag3, tag4, img1, img2, img3, img4, weight) VALUES (${data.itemId}, '${data.name}', ${data.total}, ${data.price}, '${data.description}', '${data.tag1}', '${data.tag2}', '${data.tag3}', '${data.tag4}', '${data.img1}', '${data.img2}', '${data.img3}', '${data.img4}', ${data.weight})`;
  // connection.query(query, function (err, rows, fields) {
  //   if (err) {
  //     console.log(err);
  //     res.send({ status: err });
  //   } else res.send({ status: "success" });
  // });
});

app.all("/items_get", (req, res) => {
  const data = {
    tag1: req.body.tag1,
    tag2: req.body.tag2,
    tag3: req.body.tag3,
    tag4: req.body.tag4,
    renderFrom: req.body.renderFrom,
    renderUntil: req.body.renderUntil,
  };
  console.log(data);
  connection.query(
    `SELECT item_id, name, total, price, description, tag1, tag2, tag3, tag4, img1, img2, img3, img4, weight, (SELECT COUNT(*) FROM items) AS TotalRows FROM items ORDER BY item_id DESC LIMIT ${data.renderFrom}, ${data.renderUntil}`,
    function (err, rows, fields) {
      res.send(rows);
    }
  );
});

app.all("/items_upd", (req, res) => {
  const data = {
    itemId: parseInt(req.body.itemId),
  };
  connection.query(`DELETE FROM items WHERE item_id=${data.itemId}`, function (
    err,
    rows,
    fields
  ) {
    if (!err) res.send({ status: "success" });
  });
});

app.all("/items_get_id", (req, res) => {
  const data = {
    items: req.body.items,
  };
  connection.query(
    `SELECT item_id, name, total, price, description, tag1, tag2, tag3, tag4, img1, img2, img3, img4, weight FROM items`,
    function (err, rows, fields) {
      if (!err) {
        let finData = [];
        for (let i = 0; i < data.items.length; i++) {
          for (let j = 0; j < rows.length; j++) {
            if (rows[j].item_id == JSON.parse(data.items[i][1]).id) {
              finData.push({
                item_id: JSON.parse(data.items[i][1]).id,
                name: rows[j].name,
                total: rows[j].total,
                onCart: JSON.parse(data.items[i][1]).total,
                price: rows[j].price,
                description: rows[j].description,
                img: rows[j].img1,
                weight: rows[j].weight,
              });
              break;
            }
          }
        }
        res.send(finData);
      }
    }
  );
});

app.post("/mainman_post", (req, res) => {
  const data = {
    carouselText1: req.body.carouselText1,
    carouselText2: req.body.carouselText2,
    carouselText3: req.body.carouselText3,
    carouselText4: req.body.carouselText4,
    contact: req.body.contact,
    about: req.body.about,
    help: req.body.help,
    tag1: req.body.tag1,
    tag2: req.body.tag2,
    tag3: req.body.tag3,
    tag4: req.body.tag4,
    carouselImg1: req.body.carouselImg1.toString(),
    carouselImg2: req.body.carouselImg2.toString(),
    carouselImg3: req.body.carouselImg3.toString(),
    carouselImg4: req.body.carouselImg4.toString(),
    tagImg1: req.body.tagImg1.toString(),
    tagImg2: req.body.tagImg2.toString(),
    tagImg3: req.body.tagImg3.toString(),
    tagImg4: req.body.tagImg4.toString(),
  };
  console.log(data);
  connection.query(
    `REPLACE INTO main_page (main_id, carousel_text1, carousel_text2, carousel_text3, carousel_text4, contact_text, about_text, help_text, tag1_text, tag2_text,tag3_text, tag4_text, carousel_img1, carousel_img2, carousel_img3, carousel_img4, tag1_img, tag2_img, tag3_img, tag4_img) VALUES (1, '${data.carouselText1}','${data.carouselText2}','${data.carouselText3}','${data.carouselText4}', '${data.contact}', '${data.about}', '${data.help}', '${data.tag1}','${data.tag2}','${data.tag3}','${data.tag4}', '${data.carouselImg1}','${data.carouselImg2}','${data.carouselImg3}','${data.carouselImg4}', '${data.tagImg1}','${data.tagImg2}','${data.tagImg3}','${data.tagImg4}')`,
    function (err, rows, fields) {
      if (err) {
        console.log(err);
        res.send({ status: err });
      } else res.send({ status: "success" });
    }
  );
});

app.post("/adman_post", (req, res) => {
  const data = {
    adImg: req.body.adImg.toString(),
    adTxt: req.body.adTxt,
    adPhn: req.body.adPhn.toString(),
  };
  console.log(data);
  connection.query(
    `REPLACE INTO ad_page (ad_id, ad_img, ad_msg, ad_phone) VALUES (1, '${data.adImg}', '${data.adTxt}', '${data.adPhn}')`,
    function (err, rows, fields) {
      if (err) {
        console.log(err);
        res.send({ status: err });
      } else res.send({ status: "success" });
    }
  );
});

app.get("/adman_get", (req, res) => {
  connection.query(`SELECT * FROM ad_page`, function (err, rows, fields) {
    if (err) {
      console.log(err);
      res.send({ status: err });
    } else res.send(rows);
  });
});

app.get("/mainman_get", (req, res) => {
  connection.query(`SELECT * FROM main_page`, function (err, rows, fields) {
    res.send(rows);
  });
});
app.get("/mainman_get_footer_only", (req, res) => {
  connection.query(
    `SELECT contact_text, about_text, help_text FROM main_page`,
    function (err, rows, fields) {
      res.send(rows);
    }
  );
});

app.all("/user_check_get", (req, res) => {
  const data = { userName: req.body.userName };
  connection.query(
    `SELECT * FROM user where user_name='${data.userName}'`,
    function (err, rows, fields) {
      if (rows) {
        if (rows.length > 0) res.send({ status: true, data: rows });
        else res.send({ status: false });
      } else res.send({ status: false });
    }
  );
});

app.post("/user_post", (req, res) => {
  const data = {
    userName: req.body.userName,
    password: req.body.password,
    userFull: req.body.userFull,
    userAdd: req.body.userAdd,
    userPos: req.body.userPos,
    userPhone: req.body.userPhone,
  };
  connection.query(
    `INSERT INTO user (user_name, password, status, user_full_name, user_address, post_code, user_phone) VALUES ('${data.userName}', '${data.password}', 'user', '${data.userFull}', '${data.userAdd}', '${data.userPos}', '${data.userPhone}')`,
    function (err, rows, fields) {
      if (!err) res.send({ status: "success" });
    }
  );
});

app.all("/shp_cost", (req, res) => {
  const data = {
    dest: req.body.dest,
    weight: req.body.weight,
  };
  let RajaOngkir = require("rajaongkir-nodejs").Starter(
    "8df3fc61dbed2cccecd359a4ed17eb38"
  );
  connection.query("SELECT * FROM origin", function (err, rows, fields) {
    if (!err) {
      let params = {
        origin: rows[0].city_id,
        destination: data.dest,
        weight: data.weight, //gram
      };
      console.log(params);
      RajaOngkir.getJNECost(params)
        .then(function (result) {
          res.send({ result: result, status: true });
        })
        .catch(function (error) {
          res.send({ result: error, status: false });
        });
    } else res.send({ result: err, status: false });
  });
});

app.get("/shp_get_all", async (req, res) => {
  var RajaOngkir = require("rajaongkir-nodejs").Starter(
    "8df3fc61dbed2cccecd359a4ed17eb38"
  );
  let provs = [];
  let provStatus = true;
  let cities = [];
  let citiesStatus = true;
  await RajaOngkir.getProvinces()
    .then(function (result) {
      provs = result;
    })
    .catch(function (error) {
      provStatus = false;
    });
  await RajaOngkir.getCities()
    .then(function (result) {
      cities = result;
    })
    .catch(function (error) {
      citiesStatus = false;
    });
  res.send({
    provs: provs,
    cities: cities,
    status: provStatus && citiesStatus,
  });
});

app.post("/origin_post", async (req, res) => {
  const data = {
    prov_id: req.body.prov_id,
    city_id: req.body.city_id,
    prov_name: req.body.prov_name,
    city_name: req.body.city_name,
  };
  connection.query(
    `REPLACE INTO origin(origin_id, province_id, city_id, province_name, city_name) VALUES(1, '${data.prov_id}', '${data.city_id}', '${data.prov_name}', '${data.city_name}')`,
    function (err, rows, fields) {
      if (!err) res.send({ status: "success" });
      else res.send({ status: err });
    }
  );
});

app.get("/origin_get", async (req, res) => {
  connection.query("SELECT * FROM origin", function (err, rows, fields) {
    if (!err) console.log(err);
    res.send(rows);
  });
});

app.get("/test", (req, res) => {
  const image =
    "data:image/jpeg;base64,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";
  const bitmap = new Buffer(image, "base64");
  // fs.writeFileSync("images/example.jpg", bitmap);
  ftp.put(
    bitmap,
    "/domains/couturehijaab.id/public_html/images/example.jpg",
    (err) => {
      if (!err) {
        console.log("File transferred successfully!");
      } else console.log(err);
    }
  );
});

app.listen(port, () => console.log(`Running on port ${port}!`));
