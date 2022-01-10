var express = require('express');
var router = express.Router();
const pg = require('pg');
const db = require('../db');
const { requiresAuth } = require('express-openid-connect');
var zip = require('adm-zip');
var fs = require('fs');
const AdmZip = require('adm-zip');

router.get('/', function (req, res, next) {
    res.render('index', {
        title: 'Index',
        isAuthenticated: req.oidc.isAuthenticated()
    });
});

router.get('/user', requiresAuth(), function (req, res, next) {
    res.render('user', {
        isAuthenticated: req.oidc.isAuthenticated(),
        userProfile: JSON.stringify(req.oidc.user, null, 2),
        userName: req.oidc.user.name,
        userEmail: req.oidc.user.email,
        userUpdatedAt: req.oidc.user.updated_at,
        userPicture: req.oidc.user.picture,
        title: 'User'
    });
});

router.get('/user/download', requiresAuth(), function (req, res, next) {
    (async () => {
        console.log("download");
        rows = (await db.query(
            `SELECT kolegiji.idkolegij, kolegiji.naziv as kolegij_naziv, semestar, ects, predavanja, laboratorijske, auditorne, studij, smjer, godina, profili.idprofil, profili.naziv as profil_naziv, idnositelj, ime, prezime, titula
                FROM (kolegiji NATURAL JOIN kolegijnositelj NATURAL JOIN nositelji) 
                    LEFT JOIN (kolegijprofil JOIN profili ON kolegijprofil.idprofil = profili.idprofil) 
                        ON kolegiji.idkolegij = kolegijprofil.idkolegij;`, [])).rows;
        //prazna temp tablica
        await db.query(`CREATE TEMP TABLE t (idkolegij INTEGER, kolegij_naziv CHARACTER(50), semestar CHARACTER(6), ects INTEGER, predavanja INTEGER, laboratorijske INTEGER, auditorne INTEGER, studij CHARACTER(30), smjer CHARACTER(50), godina INTEGER, idprofil INTEGER, profil_naziv CHARACTER(50), idnositelj INTEGER, ime CHARACTER(20), prezime CHARACTER(30), titula CHARACTER(20))`, []);
        //insertanje u tablicu
        for (const row of rows) {
            await db.query(`INSERT INTO t VALUES($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16)`, [row.idkolegij, row.kolegij_naziv, row.semestar, row.ects, row.predavanja, row.laboratorijske, row.auditorne, row.studij, row.smjer, row.godina, row.idprofil, row.profil_naziv, row.idnositelj, row.ime, row.prezime, row.titula]);
        }
        //spremanje datoteke
        await db.query(`COPY t TO 'C:/Users/ninap/OR/public/download/Kolegiji_na_FER-u.csv' DELIMITER ',' CSV HEADER;`, []);
        await db.query(`COPY (SELECT json_agg(row_to_json(t)) :: text FROM t) to 'C:/Users/ninap/OR/public/download/Kolegiji_na_FER-u.json';`, []);
        //obrisi tablicu
        await db.query(`DROP TABLE t`, []);

        const zip = new AdmZip();
        zip.addLocalFile('Kolegiji_na_FER-u.csv');
        zip.addLocalFile('Kolegiji_na_FER-u.json');
        const downloadName = 'Kolegiji_na_FER-u.zip';
        const data = zip.toBuffer();
        zip.writeZip(downloadName);
        res.set('Content-Type', 'application/octet-stream');
        res.set('Content-Disposition', `attachment; filename=${downloadName}`);
        res.set('Content-Length', data.length);
        res.send(data);
    })();
});

router.get('/openapi', function (req, res, next) {
    const fs = require('fs');
    let openapiData;
    fs.readFile('public/download/openapi.json', (err, data) => {
        if (err) throw err;
        openapiData = JSON.parse(data);
        res.render('openapi', {
            isAuthenticated: req.oidc.isAuthenticated(),
            openapiData: openapiData,
            title: 'OpenAPI',
        });
    });
});

module.exports = router;
