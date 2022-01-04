var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/main', function(req, res, next) {
  res.status(200).json({
massige:"is woring"
  });
});

module.exports = router;
