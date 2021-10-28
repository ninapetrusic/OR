--
-- PostgreSQL database dump
--

-- Dumped from database version 14.0
-- Dumped by pg_dump version 14.0

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: kolegiji; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.kolegiji (
    idkolegij integer NOT NULL,
    naziv character(50),
    semestar character(6),
    ects integer NOT NULL,
    predavanja integer,
    laboratorijske integer,
    auditorne integer,
    studij character(30),
    smjer character(50),
    godina integer NOT NULL
);


ALTER TABLE public.kolegiji OWNER TO postgres;

--
-- Name: kolegijnositelj; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.kolegijnositelj (
    idkolegij integer NOT NULL,
    idnositelj integer NOT NULL
);


ALTER TABLE public.kolegijnositelj OWNER TO postgres;

--
-- Name: kolegijprofil; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.kolegijprofil (
    idkolegij integer NOT NULL,
    idprofil integer NOT NULL
);


ALTER TABLE public.kolegijprofil OWNER TO postgres;

--
-- Name: nositelji; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.nositelji (
    idnositelj integer NOT NULL,
    ime character(20),
    prezime character(30),
    titula character(20)
);


ALTER TABLE public.nositelji OWNER TO postgres;

--
-- Name: profili; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.profili (
    idprofil integer NOT NULL,
    naziv character(50)
);


ALTER TABLE public.profili OWNER TO postgres;

--
-- Data for Name: kolegiji; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.kolegiji (idkolegij, naziv, semestar, ects, predavanja, laboratorijske, auditorne, studij, smjer, godina) FROM stdin;
183357	Uvod u programiranje                              	zimski	7	60	18	0	preddiplomski                 	\N	1
183371	Objektno orijentirano programiranje               	ljetni	8	60	18	15	preddiplomski                 	\N	1
183384	Električni krugovi                                	zimski	5	60	12	0	preddiplomski                 	Elektrotehnika i informacijska tehnologija        	2
183381	Algoritmi i strukture podataka                    	zimski	6	60	6	0	preddiplomski                 	Računarstvo                                       	2
183421	Elektromagnetska polja                            	zimski	5	60	15	0	preddiplomski                 	Elektrotehnika i informacijska tehnologija        	3
229862	Uvod u umjetnu inteligenciju                      	ljetni	4	45	15	0	preddiplomski                 	Računarstvo                                       	3
222496	Napredni algoritmi i strukture podataka           	zimski	5	45	15	6	diplomski                     	Računarstvo                                       	1
222596	Osnove robotike                                   	zimski	5	45	13	15	diplomski                     	Informacijska i komunikacijska tehnologija        	1
222533	Digitalni integrirani sklopovi                    	ljetni	5	45	12	6	diplomski                     	Elektrotehnika i informacijska tehnologija        	1
222792	Svemirske tehnologije                             	ljetni	5	45	6	0	diplomski                     	Informacijska i komunikacijska tehnologija        	1
\.


--
-- Data for Name: kolegijnositelj; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.kolegijnositelj (idkolegij, idnositelj) FROM stdin;
183357	1
183357	2
183371	3
183371	4
183371	5
183371	6
183384	7
183384	8
183384	9
183381	10
183381	11
183381	12
183381	2
183421	13
183421	14
183421	15
183421	16
229862	17
229862	18
229862	19
222496	22
222496	23
222596	20
222596	21
222533	24
222792	25
222792	26
222792	27
\.


--
-- Data for Name: kolegijprofil; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.kolegijprofil (idkolegij, idprofil) FROM stdin;
222496	12
222496	9
222496	10
222496	11
222496	13
222496	14
222596	6
222533	4
222792	8
\.


--
-- Data for Name: nositelji; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.nositelji (idnositelj, ime, prezime, titula) FROM stdin;
1	Gordan              	Gledec                        	Prof. dr. sc.       
2	Vedran              	Mornar                        	Prof. dr. sc.       
3	Mario               	Kušek                         	Prof. dr. sc.       
4	Krešimir            	Pripužić                      	Izv. prof. dr. sc.  
5	Boris               	Milašinović                   	Izv. prof. dr. sc.  
6	Mirko               	Randić                        	Izv. prof. dr. sc.  
7	Dražen              	Jurišić                       	Prof. dr. sc.       
8	Igor                	Lacković                      	Prof. dr. sc.       
9	Zvonko              	Kostanjčar                    	Izv. prof. dr. sc.  
10	Ivica               	Botički                       	Prof. dr. sc.       
11	Mirjana             	Domazet-Lošo                  	Izv. prof. dr. sc.  
12	Mile                	Šikić                         	Prof. dr. sc.       
13	Sead                	Berberović                    	Prof. dr. sc.       
14	Martin              	Dadić                         	Prof. dr. sc.       
15	Željko              	Štih                          	Prof. dr. sc.       
16	Bojan               	Trkulja                       	Prof. dr. sc.       
17	Jan                 	Šnajder                       	Izv. prof. dr. sc.  
18	Marko               	Čupić                         	Izv. prof. dr. sc.  
19	Bojana              	Dalbelo Bašić                 	Prof. dr. sc.       
20	Zdenko              	Kovačić                       	Prof. dr. sc.       
21	Matko               	Orsag                         	Izv. prof. dr. sc.  
22	Mario               	Brčić                         	Doc. dr. sc.        
23	Marko               	Horvat                        	Doc. dr. sc.        
24	Vladimir            	Čeperić                       	Izv. prof. dr. sc.  
25	Dubravko            	Babić                         	Izv. prof. dr. sc.  
26	Tomislav            	Kos                           	Prof. dr. sc.       
27	Josip               	Lončar                        	Doc. dr. sc.        
\.


--
-- Data for Name: profili; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.profili (idprofil, naziv) FROM stdin;
1	Audiotehnologije i elektroakustika                
2	Elektroenergetika                                 
3	Elektroničko i računalno inženjerstvo             
4	Elektronika                                       
5	Elektrostrojarstvo i automatizacija               
6	Automatika i robotika                             
7	Informacijsko i komunikacijsko inženjerstvo       
8	Komunikacijske i svemirske tehnologije            
9	Programsko inženjerstvo i informacijski sustavi   
10	Računalno inženjerstvo                            
11	Računalno modeliranje u inženjerstvu              
12	Računarska znanost                                
13	Znanost o mrežama                                 
14	Znanost o podacima                                
\.


--
-- Name: kolegiji kolegiji_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.kolegiji
    ADD CONSTRAINT kolegiji_pkey PRIMARY KEY (idkolegij);


--
-- Name: kolegijnositelj kolegijnositelj_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.kolegijnositelj
    ADD CONSTRAINT kolegijnositelj_pkey PRIMARY KEY (idkolegij, idnositelj);


--
-- Name: kolegijprofil kolegijprofil_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.kolegijprofil
    ADD CONSTRAINT kolegijprofil_pkey PRIMARY KEY (idkolegij, idprofil);


--
-- Name: nositelji nositelji_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.nositelji
    ADD CONSTRAINT nositelji_pkey PRIMARY KEY (idnositelj);


--
-- Name: profili profili_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.profili
    ADD CONSTRAINT profili_pkey PRIMARY KEY (idprofil);


--
-- Name: kolegijnositelj kolegijnositelj_idkolegij_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.kolegijnositelj
    ADD CONSTRAINT kolegijnositelj_idkolegij_fkey FOREIGN KEY (idkolegij) REFERENCES public.kolegiji(idkolegij);


--
-- Name: kolegijnositelj kolegijnositelj_idnositelj_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.kolegijnositelj
    ADD CONSTRAINT kolegijnositelj_idnositelj_fkey FOREIGN KEY (idnositelj) REFERENCES public.nositelji(idnositelj);


--
-- Name: kolegijprofil kolegijprofil_idkolegij_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.kolegijprofil
    ADD CONSTRAINT kolegijprofil_idkolegij_fkey FOREIGN KEY (idkolegij) REFERENCES public.kolegiji(idkolegij);


--
-- Name: kolegijprofil kolegijprofil_idprofil_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.kolegijprofil
    ADD CONSTRAINT kolegijprofil_idprofil_fkey FOREIGN KEY (idprofil) REFERENCES public.profili(idprofil);


--
-- PostgreSQL database dump complete
--

