var express = require('express');
var router = express.Router();
const pg = require('pg');
const db = require('../db');


let rows;
let err;
let rowsfiltered;

router.get('/', function(req, res, next) {
    (async() => {
        rows = (await db.query(
            `SELECT kolegiji.idkolegij, kolegiji.naziv as kolegij_naziv, semestar, ects, predavanja, laboratorijske, auditorne, studij, smjer, godina, profili.idprofil, profili.naziv as profil_naziv, idnositelj, ime, prezime, titula
                FROM (kolegiji NATURAL JOIN kolegijnositelj NATURAL JOIN nositelji) 
                    LEFT JOIN (kolegijprofil JOIN profili ON kolegijprofil.idprofil = profili.idprofil) 
                        ON kolegiji.idkolegij = kolegijprofil.idkolegij;`, [])).rows;
        res.render('datatable', {
            rows: rows,
            title: 'Datatable',
            err: undefined,
            download: false
        })
    })();
    
});

router.post('/', function(req, res, next) {
    
    (async() => {
        err = undefined;
        let filter = req.body.filter;
        let tekst = req.body.tekst;
        if(!tekst) err = 'MinLength=1';
        rowsfiltered = [];
    
        switch(filter) {
        case "kolegij_naziv":
            for(let row of rows) {
                if((row.kolegij_naziv).toString().toLowerCase().includes(tekst.toString().toLowerCase())) {
                    rowsfiltered.push(row);
                }
            }
          break;
        case "prezime":
            for(let row of rows) {
                if((row.prezime).toString().toLowerCase().includes(tekst.toString().toLowerCase()))
                rowsfiltered.push(row);
            }
          break;
        case "studij":
            for(let row of rows) {
                if((row.studij).toString().toLowerCase().includes(tekst.toString().toLowerCase()))
                  rowsfiltered.push(row);
            }
            break;
        case "semestar":
            for(let row of rows) {
                if((row.semestar).toString().toLowerCase().includes(tekst.toString().toLowerCase()))
                  rowsfiltered.push(row);
            }
            break;
        case "smjer":
            for(let row of rows) {
                if((row.smjer).toString().toLowerCase().includes(tekst.toString().toLowerCase()))
                  rowsfiltered.push(row);
            }
            break;
        case "wildcard":
            for(let row of rows) {
                if((row.kolegij_naziv).toString().toLowerCase().includes(tekst.toString().toLowerCase()) ||
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
            await db.query(`INSERT INTO t VALUES($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16)`,[rowf.idkolegij,rowf.kolegij_naziv,rowf.semestar,rowf.ects,rowf.predavanja,rowf.laboratorijske,rowf.auditorne,rowf.studij,rowf.smjer,rowf.godina,rowf.idprofil,rowf.profil_naziv,rowf.idnositelj,rowf.ime,rowf.prezime,rowf.titula]);
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
          download: true
      })
    })();
});

module.exports = router;
