var express = require('express');
var router = express.Router();
const pg = require('pg');
const db = require('../db');

let rows;
let err;
let rowsfiltered;

router.get('/', function (req, res, next) {
    res.header('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
    (async () => {
        rows = (await db.query(
            `SELECT kolegiji.idkolegij, kolegiji.naziv as kolegij_naziv, semestar, ects, predavanja, laboratorijske, auditorne, studij, smjer, godina, profili.idprofil, profili.naziv as profil_naziv, idnositelj, ime, prezime, titula
                FROM (kolegiji NATURAL JOIN kolegijnositelj NATURAL JOIN nositelji) 
                    LEFT JOIN (kolegijprofil JOIN profili ON kolegijprofil.idprofil = profili.idprofil) 
                        ON kolegiji.idkolegij = kolegijprofil.idkolegij;`, [])).rows;

        res.render('datatable', {
            rows: rows,
            title: 'Datatable',
            err: undefined,
            download: false,
        })
    })();

});

router.get('/add/nositelji', function(req, res, next) {
    (async () => {
        try {
        rows = (await db.query("SELECT * FROM nositelji;", [])).rows;
        } catch (error) {
            err = error;
        }
        res.render('nositelji', {
            rows: rows,
            err: err,
            title: "Nositelji",
        });
    })();
});

router.get('/add', function (req, res, next) {
    res.render('add', {
        title: 'Dodaj kolegij',
    })
});

router.post('/add', function (req, res, next) {
    (async () => {
        var upit = "INSERT INTO kolegiji VALUES($1,$2,$3,$4,$5,$6,$7,$8,$9,$10);";
        try {
            await db.query(upit, [parseInt(req.body.idkolegij), req.body.kolegij_naziv, req.body.semestar, parseInt(req.body.ects), parseInt(req.body.predavanja), parseInt(req.body.laboratorijske), parseInt(req.body.auditorne), req.body.studij, req.body.smjer, parseInt(req.body.godina)]);
            upit = "INSERT INTO nositelji VALUES($1,$2,$3,$4);"
            try {
                var idnositelja;
                var nositelj = (await db.query("SELECT idnositelj FROM nositelji WHERE ime = $1 AND prezime = $2", [req.body.ime, req.body.prezime])).rows;
                if (nositelj.length < 1) {
                    var id = (await db.query("SELECT idnositelj FROM nositelji ORDER BY idnositelj DESC LIMIT 1", [])).rows;
                    idnositelja = id[0].idnositelj + 1;
                    await db.query(upit, [idnositelja, req.body.ime, req.body.prezime, req.body.titula]);
                } else {
                    idnositelja = nositelj[0].idnositelj;
                }
                upit = "INSERT INTO kolegijnositelj VALUES($1,$2)";
                try {
                    await db.query(upit, [parseInt(req.body.idkolegij), parseInt(idnositelja)]);
                    upit = "INSERT INTO kolegijprofil VALUES ($1,$2)";
                    try {
                        await db.query(upit, [parseInt(req.body.idkolegij), parseInt(req.body.idprofil)]);
                    } catch (error) {
                        console.log(error);
                    }
                } catch (error) {
                    console.log(error);
                }
            } catch (error) {
                console.log(error);
            }
        } catch (error) {
            rows = (await db.query(
                `SELECT kolegiji.idkolegij, kolegiji.naziv as kolegij_naziv, semestar, ects, predavanja, laboratorijske, auditorne, studij, smjer, godina, profili.idprofil, profili.naziv as profil_naziv, idnositelj, ime, prezime, titula
                    FROM (kolegiji NATURAL JOIN kolegijnositelj NATURAL JOIN nositelji) 
                        LEFT JOIN (kolegijprofil JOIN profili ON kolegijprofil.idprofil = profili.idprofil) 
                            ON kolegiji.idkolegij = kolegijprofil.idkolegij;`, [])).rows;
            res.status(400).render('datatable', {
                rows: rows,
                title: 'Datatable',
                err: "Kolegij već postoji!",
                download: false,
            });
        }
        res.redirect("/datatable/" + req.body.idkolegij);
    })();
});

router.get('/:kolegijId', function (req, res, next) {
    res.header('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
    (async () => {
        rows = (await db.query(
            `SELECT kolegiji.idkolegij, kolegiji.naziv as kolegij_naziv, semestar, ects, predavanja, laboratorijske, auditorne, studij, smjer, godina, profili.idprofil, profili.naziv as profil_naziv, idnositelj, ime, prezime, titula
                FROM (kolegiji NATURAL JOIN kolegijnositelj NATURAL JOIN nositelji) 
                    LEFT JOIN (kolegijprofil JOIN profili ON kolegijprofil.idprofil = profili.idprofil) 
                        ON kolegiji.idkolegij = kolegijprofil.idkolegij WHERE kolegiji.idkolegij = $1;`, [req.params.kolegijId])).rows;
        if (rows.length > 0) {
            res.render('kolegij', {
                rows: rows,
                id: req.params.kolegijId,
                title: 'Kolegij: ' + req.params.kolegijId,
                err: undefined
            })
        } else {
            rows = (await db.query(
                `SELECT kolegiji.idkolegij, kolegiji.naziv as kolegij_naziv, semestar, ects, predavanja, laboratorijske, auditorne, studij, smjer, godina, profili.idprofil, profili.naziv as profil_naziv, idnositelj, ime, prezime, titula
                    FROM (kolegiji NATURAL JOIN kolegijnositelj NATURAL JOIN nositelji) 
                        LEFT JOIN (kolegijprofil JOIN profili ON kolegijprofil.idprofil = profili.idprofil) 
                            ON kolegiji.idkolegij = kolegijprofil.idkolegij;`, [])).rows;
            res.status(404).render('datatable', {
                rows: rows,
                title: 'Datatable',
                err: "ID kolegija ne postoji!",
                download: false,
            });
        }
    })();
});

router.put('/:kolegijId/edit', function (req, res, next) {
    res.header('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
    (async () => {
        try {
        var upit = "UPDATE kolegiji SET semestar = $1, ects = $2, predavanja = $3, laboratorijske = $4, auditorne = $5 WHERE idkolegij = $6";
        await db.query(upit, [req.body.semestar, req.body.ects, req.body.predavanja, req.body.laboratorijske, req.body.auditorne, req.params.kolegijId]);
        res.redirect("/datatable/" + req.params.kolegijId);
        } catch (error) {
            console.log(error);
            rows = (await db.query(
                `SELECT kolegiji.idkolegij, kolegiji.naziv as kolegij_naziv, semestar, ects, predavanja, laboratorijske, auditorne, studij, smjer, godina, profili.idprofil, profili.naziv as profil_naziv, idnositelj, ime, prezime, titula
                    FROM (kolegiji NATURAL JOIN kolegijnositelj NATURAL JOIN nositelji) 
                        LEFT JOIN (kolegijprofil JOIN profili ON kolegijprofil.idprofil = profili.idprofil) 
                            ON kolegiji.idkolegij = kolegijprofil.idkolegij;`, [])).rows;
            res.status(404).render('datatable', {
                rows: rows,
                title: 'Datatable',
                err: "ID kolegija ne postoji!",
                download: false,
            });
        }
    })();
});

router.delete('/:kolegijId/delete', function (req, res, next) {
    let code;
    res.header('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
    (async () => {
        try {
            await db.query("DELETE FROM kolegijprofil WHERE idkolegij = $1", [req.params.kolegijId]);
            await db.query("DELETE FROM kolegijnositelj WHERE idkolegij = $1", [req.params.kolegijId]);
            await db.query("DELETE FROM kolegiji WHERE idkolegij = $1", [req.params.kolegijId]);
            res.redirect("/datatable");
        } catch (error) {
            console.log(error);
            rows = (await db.query(
                `SELECT kolegiji.idkolegij, kolegiji.naziv as kolegij_naziv, semestar, ects, predavanja, laboratorijske, auditorne, studij, smjer, godina, profili.idprofil, profili.naziv as profil_naziv, idnositelj, ime, prezime, titula
                    FROM (kolegiji NATURAL JOIN kolegijnositelj NATURAL JOIN nositelji) 
                        LEFT JOIN (kolegijprofil JOIN profili ON kolegijprofil.idprofil = profili.idprofil) 
                            ON kolegiji.idkolegij = kolegijprofil.idkolegij;`, [])).rows;
            res.status(404).render('datatable', {
                rows: rows,
                title: 'Datatable',
                err: "ID kolegija ne postoji!",
                download: false,
            })
        }
    })();
});

router.post('/', function (req, res, next) {

    (async () => {
        err = undefined;
        let filter = req.body.filter;
        let tekst = req.body.tekst;
        if (!tekst) err = 'MinLength=1';
        rowsfiltered = [];
        switch (filter) {
            case "kolegij_naziv":
                for (let row of rows) {
                    if ((row.kolegij_naziv).toString().toLowerCase().includes(tekst.toString().toLowerCase())) {
                        rowsfiltered.push(row);
                    }
                }
                break;
            case "prezime":
                for (let row of rows) {
                    if ((row.prezime).toString().toLowerCase().includes(tekst.toString().toLowerCase()))
                        rowsfiltered.push(row);
                }
                break;
            case "studij":
                for (let row of rows) {
                    if ((row.studij).toString().toLowerCase().includes(tekst.toString().toLowerCase()))
                        rowsfiltered.push(row);
                }
                break;
            case "semestar":
                for (let row of rows) {
                    if ((row.semestar).toString().toLowerCase().includes(tekst.toString().toLowerCase()))
                        rowsfiltered.push(row);
                }
                break;
            case "smjer":
                for (let row of rows) {
                    if ((row.smjer).toString().toLowerCase().includes(tekst.toString().toLowerCase()))
                        rowsfiltered.push(row);
                }
                break;
            case "wildcard":
                for (let row of rows) {
                    if ((row.kolegij_naziv).toString().toLowerCase().includes(tekst.toString().toLowerCase()) ||
                        (row.prezime).toString().toLowerCase().includes(tekst.toString().toLowerCase()) ||
                        (row.studij).toString().toLowerCase().includes(tekst.toString().toLowerCase()) ||
                        (row.semestar).toString().toLowerCase().includes(tekst.toString().toLowerCase()) ||
                        row.smjer && ((row.smjer).toString().toLowerCase().includes(tekst.toString().toLowerCase())))
                        rowsfiltered.push(row);
                }
                break;
            default: err = 'Error';
        }

        //prazna temp tablica
        await db.query(`CREATE TEMP TABLE t (idkolegij INTEGER, kolegij_naziv CHARACTER(50), semestar CHARACTER(6), ects INTEGER, predavanja INTEGER, laboratorijske INTEGER, auditorne INTEGER, studij CHARACTER(30), smjer CHARACTER(50), godina INTEGER, idprofil INTEGER, profil_naziv CHARACTER(50), idnositelj INTEGER, ime CHARACTER(20), prezime CHARACTER(30), titula CHARACTER(20))`, []);
        //insertanje u tablicu
        for (const rowf of rowsfiltered) {
            await db.query(`INSERT INTO t VALUES($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16)`, [rowf.idkolegij, rowf.kolegij_naziv, rowf.semestar, rowf.ects, rowf.predavanja, rowf.laboratorijske, rowf.auditorne, rowf.studij, rowf.smjer, rowf.godina, rowf.idprofil, rowf.profil_naziv, rowf.idnositelj, rowf.ime, rowf.prezime, rowf.titula]);
        }
        //spremanje datoteke
        //await db.query(`COPY t TO 'C:/Users/Public/Documents/Kolegiji_na_FER-u_filt.csv' DELIMITER ',' CSV HEADER;`, []);
        await db.query(`COPY t TO 'C:/Users/ninap/OR/public/download/Kolegiji_na_FER-u_filt.csv' DELIMITER ',' CSV HEADER;`, []);
        //await db.query(`COPY (SELECT json_agg(row_to_json(t)) :: text FROM t) to 'C:/Users/Public/Documents/Kolegiji_na_FER-u_filt.json';`, []);
        await db.query(`COPY (SELECT json_agg(row_to_json(t)) :: text FROM t) to 'C:/Users/ninap/OR/public/download/Kolegiji_na_FER-u_filt.json';`, []);
        //obrisi tablicu
        await db.query(`DROP TABLE t`, []);

        res.render('datatable', {
            rows: rowsfiltered,
            title: 'Datatable',
            err: err,
            download: true,
        })
    })();
});

module.exports = router;
