/**
 * WARNING: NOT FOR PRODUCTION USE
 *
 * This is a quick hack for the feedback service for the Spaces project. Spaces submits feedback using an AMP Form, which requires the service to implement the CORS specification. This code does not even stop for errors, or check the origin, or perform input validation, or do persistence.
 */

let express = require('express');
let cors = require('cors');
let multer = require('multer');

let app = express();

let cors_options = {
  origin: true,
  methods: ['POST'],
  optionsSuccessStatus: 200,
  credentials: true,
  exposedHeaders: ['AMP-Access-Control-Allow-Source-Origin']
};

app.options('/poc_spaces_feedback', cors(cors_options));

app.post('/poc_spaces_feedback', multer().single(), cors(cors_options), function (req, res, next) {
  res.set('AMP-Access-Control-Allow-Source-Origin', req.query.__amp_source_origin);
  res.json({});
});

app.listen(process.env.PORT || 5000);
