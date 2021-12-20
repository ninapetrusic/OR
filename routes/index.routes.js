var express = require('express');
var router = express.Router();

router.get('/openapi', function (req, res, next) {
        const fs = require('fs');
        let openapiData;
        fs.readFile('public/download/openapi.json', (err, data) => {
            if (err) throw err;
            openapiData = JSON.parse(data);
            res.render('openapi', {
                openapiData: openapiData,
                title: 'OpenAPI',
            });
        });
});

router.get('/', function (req, res, next) {
    res.render('index', {
        title: 'Index'
    });
});

module.exports = router;
