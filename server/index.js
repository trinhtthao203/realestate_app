const express = require('express');
const app = express();
const pool = require('./db');
const cors = require('cors');
const { response } = require('express');
const bodyParser = require("body-parser");

var corsOptions = {
    origin: 'http://10.10.43.127',
    optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
  }

app.use(bodyParser.json({ limit: "50mb" }));
app.use(bodyParser.urlencoded({ limit: "50mb", extended: true }));

//Middleware
app.use( cors(corsOptions));
app.use(express.json());
// app.use(function(req, res, next) {
//     res.header('Access-Control-Allow-Origin', 'http://localhost:4000');
//     res.header(
//       'Access-Control-Allow-Headers',
//       'Origin, X-Requested-With, Content-Type, Accept'
//     );
//     next();
//   });
//ROUTES

app.listen(4000,()=>{
    console.log('Server is listening on port 4000')
})
// respond with "hello world" when a GET request is made to the homepage
app.get('/realestate', (req, res) => {
    try{
       pool.query(`SELECT json_build_object(
                    'type', 'FeatureCollection',
                    'features', json_agg(ST_AsGeoJSON(t.*)::json)
                    )
                FROM realestate as t(id, name, geom)`
    ,(err,response)=>{
        if(err){
            console.log(err);
        }else{
            res.json(response.rows[0].json_build_object);
        }
    }) 
    }catch(err){
        console.error(err.message);
    }
    
})