/**
 * WARNING: NOT FOR PRODUCTION USE
 *
 * This is a quick hack for the feedback service for the Spaces project. Spaces submits feedback using an AMP Form, which requires the service to implement the CORS specification. This code does not even stop for errors, or check the origin, or perform input validation, or do persistence.
 */

let EXPECTED_ORIGIN = 'https://lti.library.smu.edu.sg';

let express = require('express');
let cors = require('cors');
let multer = require('multer');
let sequelize = require('sequelize');

let db = new sequelize('poc_spaces_feedback', null, null, {
  host: 'localhost',
  dialect: 'sqlite',
  storage: 'poc_spaces_feedback.db'
});
let feedback = db.import(__dirname + '/feedback');

let app = express();

let cors_options = {
  origin: true,
  methods: ['POST'],
  optionsSuccessStatus: 200,
  credentials: true,
  exposedHeaders: ['AMP-Access-Control-Allow-Source-Origin']
};
app.options('/poc_spaces_feedback', cors(cors_options));

app.get('/poc_spaces_feedback', (req, res, next) => {
  let where = {};
  if (req.query.app_id) {
    where.app_id = req.query.app_id;
  }
  if (req.query.start_date) {
    let date = new Date(req.query.start_date);
    date.setMinutes(date.getMinutes() + date.getTimezoneOffset());
    where.created_at = where.created_at || {};
    where.created_at.$gte = date;
  }
  if (req.query.end_date) {
    let date = new Date(req.query.end_date);
    date.setMinutes(date.getMinutes() + date.getTimezoneOffset());
    date.setHours(date.getHours() + 24);
    where.created_at = where.created_at || {};
    where.created_at.$lt = date;
  }
  feedback.findAll({ where: where }).then((result) => {
    res.setHeader('Content-Type', 'application/json');
    res.json(result);
  });
});

app.post('/poc_spaces_feedback', multer().single(), cors(cors_options), function (req, res, next) {
  if (!req.headers.origin || !req.query.__amp_source_origin || req.headers.origin !== EXPECTED_ORIGIN || req.headers.origin !== req.query.__amp_source_origin) {
    res.status(403).end();
  } else {
    feedback.create({
      app_id: req.body.app_id,
      rating: req.body.rating
    }).then(() => {
      res.set('AMP-Access-Control-Allow-Source-Origin', req.query.__amp_source_origin);
      res.json({});
    });
  }
});

app.listen(process.env.PORT || 5000);
