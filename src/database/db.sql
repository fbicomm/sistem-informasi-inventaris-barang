--
-- PostgreSQL database dump
--

-- Dumped from database version 17.2
-- Dumped by pg_dump version 17.2

-- Started on 2025-02-10 10:43:40

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- TOC entry 4 (class 2615 OID 2200)
-- Name: public; Type: SCHEMA; Schema: -; Owner: pg_database_owner
--

CREATE SCHEMA public;


ALTER SCHEMA public OWNER TO pg_database_owner;

--
-- TOC entry 4940 (class 0 OID 0)
-- Dependencies: 4
-- Name: SCHEMA public; Type: COMMENT; Schema: -; Owner: pg_database_owner
--

COMMENT ON SCHEMA public IS 'standard public schema';


SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- TOC entry 217 (class 1259 OID 16591)
-- Name: withdrawal; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.withdrawal (
    idwithdrawal integer NOT NULL,
    iditems integer,
    date timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    receiver text,
    amount integer,
    nameitems_k text,
    input text,
    codeitems_k text
);


ALTER TABLE public.withdrawal OWNER TO postgres;

--
-- TOC entry 218 (class 1259 OID 16597)
-- Name: withdrawal_idwithdrawal_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.withdrawal_idwithdrawal_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.withdrawal_idwithdrawal_seq OWNER TO postgres;

--
-- TOC entry 4941 (class 0 OID 0)
-- Dependencies: 218
-- Name: withdrawal_idwithdrawal_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.withdrawal_idwithdrawal_seq OWNED BY public.withdrawal.idwithdrawal;


--
-- TOC entry 219 (class 1259 OID 16598)
-- Name: log; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.log (
    idlog integer NOT NULL,
    date timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    usr text,
    method text,
    endpoint text,
    status_code text
);


ALTER TABLE public.log OWNER TO postgres;

--
-- TOC entry 220 (class 1259 OID 16604)
-- Name: log_idlog_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.log_idlog_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.log_idlog_seq OWNER TO postgres;

--
-- TOC entry 4942 (class 0 OID 0)
-- Dependencies: 220
-- Name: log_idlog_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.log_idlog_seq OWNED BY public.log.idlog;


--
-- TOC entry 221 (class 1259 OID 16605)
-- Name: incoming; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.incoming (
    idincoming integer NOT NULL,
    iditems integer,
    date timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    information text,
    amount integer,
    nameitems_m text,
    input text,
    codeitems_m text
);


ALTER TABLE public.incoming OWNER TO postgres;

--
-- TOC entry 222 (class 1259 OID 16611)
-- Name: incoming_idincoming_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.incoming_idincoming_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.incoming_idincoming_seq OWNER TO postgres;

--
-- TOC entry 4943 (class 0 OID 0)
-- Dependencies: 222
-- Name: incoming_idincoming_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.incoming_idincoming_seq OWNED BY public.incoming.idincoming;


--
-- TOC entry 223 (class 1259 OID 16612)
-- Name: stock; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.stock (
    iditems integer NOT NULL,
    nameitems text,
    description text,
    stock integer,
    image text,
    input text,
    codeitems text
);


ALTER TABLE public.stock OWNER TO postgres;

--
-- TOC entry 224 (class 1259 OID 16617)
-- Name: stock_iditems_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.stock_iditems_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.stock_iditems_seq OWNER TO postgres;

--
-- TOC entry 4944 (class 0 OID 0)
-- Dependencies: 224
-- Name: stock_iditems_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.stock_iditems_seq OWNED BY public.stock.iditems;


--
-- TOC entry 225 (class 1259 OID 16618)
-- Name: users; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.users (
    id integer NOT NULL,
    email text NOT NULL,
    password text NOT NULL,
    role text NOT NULL
);


ALTER TABLE public.users OWNER TO postgres;

--
-- TOC entry 226 (class 1259 OID 16623)
-- Name: users_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.users_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.users_id_seq OWNER TO postgres;

--
-- TOC entry 4945 (class 0 OID 0)
-- Dependencies: 226
-- Name: users_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.users_id_seq OWNED BY public.users.id;


--
-- TOC entry 4762 (class 2604 OID 16624)
-- Name: withdrawal idwithdrawal; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.withdrawal ALTER COLUMN idwithdrawal SET DEFAULT nextval('public.withdrawal_idwithdrawal_seq'::regclass);


--
-- TOC entry 4764 (class 2604 OID 16625)
-- Name: log idlog; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.log ALTER COLUMN idlog SET DEFAULT nextval('public.log_idlog_seq'::regclass);


--
-- TOC entry 4766 (class 2604 OID 16626)
-- Name: incoming idincoming; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.incoming ALTER COLUMN idincoming SET DEFAULT nextval('public.incoming_idincoming_seq'::regclass);


--
-- TOC entry 4768 (class 2604 OID 16627)
-- Name: stock iditems; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.stock ALTER COLUMN iditems SET DEFAULT nextval('public.stock_iditems_seq'::regclass);


--
-- TOC entry 4769 (class 2604 OID 16628)
-- Name: users id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users ALTER COLUMN id SET DEFAULT nextval('public.users_id_seq'::regclass);


--
-- TOC entry 4933 (class 0 OID 16618)
-- Dependencies: 225
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.users(id, email, password, role) VALUES
(1, 'superadmin@email.com', '$2b$10$oR6NMsvHQkfFwgswbl/xrukGYH.f1ELuH2IzN.rz1vQABDd5W/VDS', 'superadmin')
;


--
-- TOC entry 4950 (class 0 OID 0)
-- Dependencies: 226
-- Name: users_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.users_id_seq', 2, true);


--
-- TOC entry 4771 (class 2606 OID 16630)
-- Name: withdrawal withdrawal_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.withdrawal
    ADD CONSTRAINT withdrawal_pkey PRIMARY KEY (idwithdrawal);


--
-- TOC entry 4773 (class 2606 OID 16632)
-- Name: log log_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.log
    ADD CONSTRAINT log_pkey PRIMARY KEY (idlog);


--
-- TOC entry 4775 (class 2606 OID 16634)
-- Name: incoming incoming_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.incoming
    ADD CONSTRAINT incoming_pkey PRIMARY KEY (idincoming);


--
-- TOC entry 4777 (class 2606 OID 16636)
-- Name: stock stock_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.stock
    ADD CONSTRAINT stock_pkey PRIMARY KEY (iditems);


--
-- TOC entry 4779 (class 2606 OID 16638)
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


-- Completed on 2025-02-10 10:43:40

--
-- PostgreSQL database dump complete
--

