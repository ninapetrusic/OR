# Kolegiji na FER-u

- Licenca: Creative Commons Zero v1.0 Universal - slobodno umnažanje, prerađivanje i izvođenje bez traženja dopuštenja (uključujući i komercijalne svrhe)
- Autor: Nina Petrušić
- Verzija: 1.0
- Jezik: hrvatski
- Tablica kolegiji: 

| Naziv          | Opis                  | Tip            | Primarni ključ | Obvezan        |
|----------------|-----------------------|----------------|----------------|----------------|
|idkolegij       |Identifikacijski broj  |Integer         |Da              |Da              |
|naziv           |Naziv kolegija         |Character(50)   |Ne              |Ne              |
|semestar        |Zimski/ljetni          |Character(6)    |Ne              |Ne              |
|ects            |ECTS bodovi            |Integer         |Ne              |Da              |
|predavanja      |Broj predavanja        |Integer         |Ne              |Ne              |
|laboratorijske  |Broj lab. vježbi       |Integer         |Ne              |Ne              |
|auditorne       |Broj auditornih vježbi |Integer         |Ne              |Ne              |
|studij          |Razina studija         |Character(30)   |Ne              |Ne              |
|smjer           |Smjer na toj razini    |Character(50)   |Ne              |Ne              |
|godina          |Godina razine studija  |Integer         |Ne              |Da              |

- Tablica nositelji:

| Naziv          | Opis                  | Tip            | Primarni ključ | Obvezan        |
|----------------|-----------------------|----------------|----------------|----------------|
|idnositelj      |Identifikacijski broj  |Integer         |Da              |Da              |
|ime             |Ime nositelja          |Character(20)   |Ne              |Ne              |
|prezime         |Prezime nositelja      |Character(30)   |Ne              |Ne              |
|titula          |Akademski stupanj      |Character(20)   |Ne              |Ne              |

- Tablica profili:

| Naziv          | Opis                  | Tip            | Primarni ključ | Obvezan        |
|----------------|-----------------------|----------------|----------------|----------------|
|idprofil        |Identifikacijski broj  |Integer         |Da              |Da              |
|naziv           |Naziv profila          |Character(50)   |Ne              |Ne              |

- Tablica kolegijnositelj:

| Naziv          | Opis                  | Tip            | Primarni ključ | Obvezan        |
|----------------|-----------------------|----------------|----------------|----------------|
|idkolegij       |Identifikacijski broj  |Integer         |Da              |Da              |
|idnositelj      |Identifikacijski broj  |Integer         |Da              |Da              |

- Tablica kolegijprofil:

| Naziv          | Opis                  | Tip            | Primarni ključ | Obvezan        |
|----------------|-----------------------|----------------|----------------|----------------|
|idkolegij       |Identifikacijski broj  |Integer         |Da              |Da              |
|idprofil        |Identifikacijski broj  |Integer         |Da              |Da              |