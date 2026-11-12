--
-- PostgreSQL database dump
--


-- Dumped from database version 17.11
-- Dumped by pg_dump version 17.11

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

ALTER TABLE IF EXISTS ONLY public."Ticket" DROP CONSTRAINT IF EXISTS "Ticket_jugadorId_fkey";
ALTER TABLE IF EXISTS ONLY public."Ticket" DROP CONSTRAINT IF EXISTS "Ticket_adminId_fkey";
ALTER TABLE IF EXISTS ONLY public."Reserva" DROP CONSTRAINT IF EXISTS "Reserva_jugadorId_fkey";
ALTER TABLE IF EXISTS ONLY public."Reserva" DROP CONSTRAINT IF EXISTS "Reserva_canchaId_fkey";
ALTER TABLE IF EXISTS ONLY public."PrecioEspecial" DROP CONSTRAINT IF EXISTS "PrecioEspecial_canchaId_fkey";
ALTER TABLE IF EXISTS ONLY public."ParticipanteReserva" DROP CONSTRAINT IF EXISTS "ParticipanteReserva_reservaId_fkey";
ALTER TABLE IF EXISTS ONLY public."ParticipanteReserva" DROP CONSTRAINT IF EXISTS "ParticipanteReserva_jugadorId_fkey";
ALTER TABLE IF EXISTS ONLY public."Pago" DROP CONSTRAINT IF EXISTS "Pago_reservaId_fkey";
ALTER TABLE IF EXISTS ONLY public."ImagenComplejo" DROP CONSTRAINT IF EXISTS "ImagenComplejo_complejoId_fkey";
ALTER TABLE IF EXISTS ONLY public."EvidenciaTicket" DROP CONSTRAINT IF EXISTS "EvidenciaTicket_ticketId_fkey";
ALTER TABLE IF EXISTS ONLY public."EvidenciaDisputa" DROP CONSTRAINT IF EXISTS "EvidenciaDisputa_disputaId_fkey";
ALTER TABLE IF EXISTS ONLY public."EtiquetaReserva" DROP CONSTRAINT IF EXISTS "EtiquetaReserva_reservaId_fkey";
ALTER TABLE IF EXISTS ONLY public."EtiquetaReserva" DROP CONSTRAINT IF EXISTS "EtiquetaReserva_jugadorId_fkey";
ALTER TABLE IF EXISTS ONLY public."Disputa" DROP CONSTRAINT IF EXISTS "Disputa_reservaId_fkey";
ALTER TABLE IF EXISTS ONLY public."Disputa" DROP CONSTRAINT IF EXISTS "Disputa_jugadorId_fkey";
ALTER TABLE IF EXISTS ONLY public."Disputa" DROP CONSTRAINT IF EXISTS "Disputa_adminId_fkey";
ALTER TABLE IF EXISTS ONLY public."Complejo" DROP CONSTRAINT IF EXISTS "Complejo_duenioId_fkey";
ALTER TABLE IF EXISTS ONLY public."Cancha" DROP CONSTRAINT IF EXISTS "Cancha_complejoId_fkey";
ALTER TABLE IF EXISTS ONLY public."Calificacion" DROP CONSTRAINT IF EXISTS "Calificacion_reservaId_fkey";
ALTER TABLE IF EXISTS ONLY public."Calificacion" DROP CONSTRAINT IF EXISTS "Calificacion_jugadorId_fkey";
ALTER TABLE IF EXISTS ONLY public."Calificacion" DROP CONSTRAINT IF EXISTS "Calificacion_complejoId_fkey";
ALTER TABLE IF EXISTS ONLY public."Block" DROP CONSTRAINT IF EXISTS "Block_courtId_fkey";
DROP INDEX IF EXISTS public."Usuario_email_key";
DROP INDEX IF EXISTS public."Usuario_dni_key";
DROP INDEX IF EXISTS public."Ticket_jugadorId_idx";
DROP INDEX IF EXISTS public."Ticket_estado_idx";
DROP INDEX IF EXISTS public."Reserva_jugadorId_idx";
DROP INDEX IF EXISTS public."Reserva_canchaId_fecha_idx";
DROP INDEX IF EXISTS public."Reserva_activa_unica";
DROP INDEX IF EXISTS public."PrecioEspecial_canchaId_idx";
DROP INDEX IF EXISTS public."ParticipanteReserva_reservaId_jugadorId_key";
DROP INDEX IF EXISTS public."ParticipanteReserva_reservaId_idx";
DROP INDEX IF EXISTS public."Pago_reservaId_key";
DROP INDEX IF EXISTS public."Intento_clave_createdAt_idx";
DROP INDEX IF EXISTS public."ImagenComplejo_complejoId_idx";
DROP INDEX IF EXISTS public."EvidenciaTicket_ticketId_idx";
DROP INDEX IF EXISTS public."EvidenciaDisputa_disputaId_idx";
DROP INDEX IF EXISTS public."EtiquetaReserva_reservaId_jugadorId_key";
DROP INDEX IF EXISTS public."EtiquetaReserva_reservaId_idx";
DROP INDEX IF EXISTS public."EtiquetaReserva_jugadorId_idx";
DROP INDEX IF EXISTS public."Disputa_reservaId_key";
DROP INDEX IF EXISTS public."Disputa_estado_idx";
DROP INDEX IF EXISTS public."Complejo_zona_idx";
DROP INDEX IF EXISTS public."Complejo_duenioId_idx";
DROP INDEX IF EXISTS public."Cancha_deporte_idx";
DROP INDEX IF EXISTS public."Cancha_complejoId_idx";
DROP INDEX IF EXISTS public."Calificacion_reservaId_jugadorId_key";
DROP INDEX IF EXISTS public."Calificacion_jugadorId_idx";
DROP INDEX IF EXISTS public."Calificacion_complejoId_idx";
DROP INDEX IF EXISTS public."Block_courtId_startDate_endDate_idx";
ALTER TABLE IF EXISTS ONLY public._prisma_migrations DROP CONSTRAINT IF EXISTS _prisma_migrations_pkey;
ALTER TABLE IF EXISTS ONLY public."Usuario" DROP CONSTRAINT IF EXISTS "Usuario_pkey";
ALTER TABLE IF EXISTS ONLY public."Ticket" DROP CONSTRAINT IF EXISTS "Ticket_pkey";
ALTER TABLE IF EXISTS ONLY public."Reserva" DROP CONSTRAINT IF EXISTS "Reserva_pkey";
ALTER TABLE IF EXISTS ONLY public."PrecioEspecial" DROP CONSTRAINT IF EXISTS "PrecioEspecial_pkey";
ALTER TABLE IF EXISTS ONLY public."ParticipanteReserva" DROP CONSTRAINT IF EXISTS "ParticipanteReserva_pkey";
ALTER TABLE IF EXISTS ONLY public."Pago" DROP CONSTRAINT IF EXISTS "Pago_pkey";
ALTER TABLE IF EXISTS ONLY public."Intento" DROP CONSTRAINT IF EXISTS "Intento_pkey";
ALTER TABLE IF EXISTS ONLY public."ImagenComplejo" DROP CONSTRAINT IF EXISTS "ImagenComplejo_pkey";
ALTER TABLE IF EXISTS ONLY public."EvidenciaTicket" DROP CONSTRAINT IF EXISTS "EvidenciaTicket_pkey";
ALTER TABLE IF EXISTS ONLY public."EvidenciaDisputa" DROP CONSTRAINT IF EXISTS "EvidenciaDisputa_pkey";
ALTER TABLE IF EXISTS ONLY public."EtiquetaReserva" DROP CONSTRAINT IF EXISTS "EtiquetaReserva_pkey";
ALTER TABLE IF EXISTS ONLY public."Disputa" DROP CONSTRAINT IF EXISTS "Disputa_pkey";
ALTER TABLE IF EXISTS ONLY public."Complejo" DROP CONSTRAINT IF EXISTS "Complejo_pkey";
ALTER TABLE IF EXISTS ONLY public."Cancha" DROP CONSTRAINT IF EXISTS "Cancha_pkey";
ALTER TABLE IF EXISTS ONLY public."Calificacion" DROP CONSTRAINT IF EXISTS "Calificacion_pkey";
ALTER TABLE IF EXISTS ONLY public."Block" DROP CONSTRAINT IF EXISTS "Block_pkey";
DROP TABLE IF EXISTS public._prisma_migrations;
DROP TABLE IF EXISTS public."Usuario";
DROP TABLE IF EXISTS public."Ticket";
DROP TABLE IF EXISTS public."Reserva";
DROP TABLE IF EXISTS public."PrecioEspecial";
DROP TABLE IF EXISTS public."ParticipanteReserva";
DROP TABLE IF EXISTS public."Pago";
DROP TABLE IF EXISTS public."Intento";
DROP TABLE IF EXISTS public."ImagenComplejo";
DROP TABLE IF EXISTS public."EvidenciaTicket";
DROP TABLE IF EXISTS public."EvidenciaDisputa";
DROP TABLE IF EXISTS public."EtiquetaReserva";
DROP TABLE IF EXISTS public."Disputa";
DROP TABLE IF EXISTS public."Complejo";
DROP TABLE IF EXISTS public."Cancha";
DROP TABLE IF EXISTS public."Calificacion";
DROP TABLE IF EXISTS public."Block";
DROP TYPE IF EXISTS public."TipoSuperficie";
DROP TYPE IF EXISTS public."TipoEvidencia";
DROP TYPE IF EXISTS public."Rol";
DROP TYPE IF EXISTS public."EstadoTicket";
DROP TYPE IF EXISTS public."EstadoReserva";
DROP TYPE IF EXISTS public."EstadoDisputa";
DROP TYPE IF EXISTS public."EstadoAprobacion";
DROP TYPE IF EXISTS public."Deporte";
DROP TYPE IF EXISTS public."DecisionDisputa";
--
-- Name: DecisionDisputa; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public."DecisionDisputa" AS ENUM (
    'A_FAVOR_JUGADOR',
    'A_FAVOR_DUENIO'
);


--
-- Name: Deporte; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public."Deporte" AS ENUM (
    'FUTBOL_5',
    'FUTBOL_7',
    'FUTBOL_11',
    'TENIS',
    'PADEL',
    'BASQUET'
);


--
-- Name: EstadoAprobacion; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public."EstadoAprobacion" AS ENUM (
    'PENDIENTE',
    'APROBADO',
    'RECHAZADO'
);


--
-- Name: EstadoDisputa; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public."EstadoDisputa" AS ENUM (
    'ABIERTA',
    'RESUELTA'
);


--
-- Name: EstadoReserva; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public."EstadoReserva" AS ENUM (
    'PENDIENTE',
    'CONFIRMADA',
    'CANCELADA'
);


--
-- Name: EstadoTicket; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public."EstadoTicket" AS ENUM (
    'PENDIENTE',
    'ANULADO',
    'CONFIRMADO'
);


--
-- Name: Rol; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public."Rol" AS ENUM (
    'JUGADOR',
    'DUENIO',
    'ADMIN'
);


--
-- Name: TipoEvidencia; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public."TipoEvidencia" AS ENUM (
    'IMAGEN',
    'VIDEO'
);


--
-- Name: TipoSuperficie; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public."TipoSuperficie" AS ENUM (
    'CESPED_SINTETICO',
    'CESPED_NATURAL',
    'CEMENTO',
    'PARQUET',
    'POLVO_DE_LADRILLO'
);


SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: Block; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."Block" (
    id text NOT NULL,
    "courtId" text NOT NULL,
    "startDate" date NOT NULL,
    "endDate" date NOT NULL,
    "startTime" text NOT NULL,
    "endTime" text NOT NULL,
    reason text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


--
-- Name: Calificacion; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."Calificacion" (
    id text NOT NULL,
    "reservaId" text NOT NULL,
    "jugadorId" text NOT NULL,
    "complejoId" text NOT NULL,
    puntaje integer NOT NULL,
    comentario text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


--
-- Name: Cancha; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."Cancha" (
    id text NOT NULL,
    "complejoId" text NOT NULL,
    deporte public."Deporte" NOT NULL,
    "tipoSuperficie" public."TipoSuperficie" NOT NULL,
    capacidad integer NOT NULL,
    "precioBase" numeric(10,2) NOT NULL,
    "horaApertura" text NOT NULL,
    "horaCierre" text NOT NULL,
    "duracionTurnoMin" integer DEFAULT 60 NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL,
    nombre text NOT NULL,
    activo boolean DEFAULT true NOT NULL,
    "porcentajeSena" integer,
    "minAdvanceMinutes" integer
);


--
-- Name: Complejo; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."Complejo" (
    id text NOT NULL,
    nombre text NOT NULL,
    direccion text NOT NULL,
    zona text NOT NULL,
    contacto text NOT NULL,
    "duenioId" text NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL,
    activo boolean DEFAULT true NOT NULL,
    "porcentajeSenaDefault" integer DEFAULT 30 NOT NULL,
    "minAdvanceMinutesDefault" integer DEFAULT 180 NOT NULL,
    "cancellationHours" integer DEFAULT 24 NOT NULL,
    "estadoAprobacion" public."EstadoAprobacion" DEFAULT 'PENDIENTE'::public."EstadoAprobacion" NOT NULL,
    "motivoRechazo" text
);


--
-- Name: Disputa; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."Disputa" (
    id text NOT NULL,
    "reservaId" text NOT NULL,
    "jugadorId" text NOT NULL,
    descripcion text NOT NULL,
    estado public."EstadoDisputa" DEFAULT 'ABIERTA'::public."EstadoDisputa" NOT NULL,
    decision public."DecisionDisputa",
    "comentarioAdmin" text,
    "adminId" text,
    "resueltaEn" timestamp(3) without time zone,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


--
-- Name: EtiquetaReserva; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."EtiquetaReserva" (
    id text NOT NULL,
    "reservaId" text NOT NULL,
    "jugadorId" text NOT NULL,
    "etiquetadoPor" text NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


--
-- Name: EvidenciaDisputa; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."EvidenciaDisputa" (
    id text NOT NULL,
    "disputaId" text NOT NULL,
    url text NOT NULL,
    tipo public."TipoEvidencia" NOT NULL,
    orden integer DEFAULT 0 NOT NULL
);


--
-- Name: EvidenciaTicket; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."EvidenciaTicket" (
    id text NOT NULL,
    "ticketId" text NOT NULL,
    url text NOT NULL,
    tipo public."TipoEvidencia" DEFAULT 'IMAGEN'::public."TipoEvidencia" NOT NULL,
    orden integer DEFAULT 0 NOT NULL
);


--
-- Name: ImagenComplejo; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."ImagenComplejo" (
    id text NOT NULL,
    "complejoId" text NOT NULL,
    url text NOT NULL,
    orden integer DEFAULT 0 NOT NULL,
    activo boolean DEFAULT true NOT NULL
);


--
-- Name: Intento; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."Intento" (
    id text NOT NULL,
    clave text NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


--
-- Name: Pago; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."Pago" (
    id text NOT NULL,
    "reservaId" text NOT NULL,
    monto numeric(10,2) NOT NULL,
    porcentaje integer NOT NULL,
    devuelto boolean DEFAULT false NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "cancellationHours" integer DEFAULT 24 NOT NULL
);


--
-- Name: ParticipanteReserva; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."ParticipanteReserva" (
    id text NOT NULL,
    "reservaId" text NOT NULL,
    "jugadorId" text NOT NULL,
    jugadores integer NOT NULL
);


--
-- Name: PrecioEspecial; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."PrecioEspecial" (
    id text NOT NULL,
    "canchaId" text NOT NULL,
    "diaSemana" integer,
    "horaInicio" text,
    "horaFin" text,
    precio numeric(10,2) NOT NULL,
    activo boolean DEFAULT true NOT NULL
);


--
-- Name: Reserva; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."Reserva" (
    id text NOT NULL,
    "canchaId" text NOT NULL,
    "jugadorId" text NOT NULL,
    fecha date NOT NULL,
    "horaInicio" text NOT NULL,
    "horaFin" text NOT NULL,
    estado public."EstadoReserva" DEFAULT 'PENDIENTE'::public."EstadoReserva" NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL,
    "precioTurno" numeric(10,2) NOT NULL,
    asistio boolean,
    "asistenciaMarcadaEn" timestamp(3) without time zone,
    jugadores integer,
    descuento numeric(10,2) DEFAULT 0 NOT NULL
);


--
-- Name: Ticket; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."Ticket" (
    id text NOT NULL,
    "jugadorId" text NOT NULL,
    "adminId" text NOT NULL,
    "reservasInvalidas" integer NOT NULL,
    "puntosAnteriores" integer NOT NULL,
    motivo text NOT NULL,
    estado public."EstadoTicket" DEFAULT 'PENDIENTE'::public."EstadoTicket" NOT NULL,
    "venceEn" timestamp(3) without time zone NOT NULL,
    "comentarioJugador" text,
    "respondidoEn" timestamp(3) without time zone,
    "comentarioAdmin" text,
    "resueltoEn" timestamp(3) without time zone,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


--
-- Name: Usuario; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."Usuario" (
    id text NOT NULL,
    nombre text NOT NULL,
    email text NOT NULL,
    "passwordHash" text NOT NULL,
    dni text,
    telefono text,
    rol public."Rol" NOT NULL,
    activo boolean DEFAULT true NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL,
    "imagenUrl" text
);


--
-- Name: _prisma_migrations; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public._prisma_migrations (
    id character varying(36) NOT NULL,
    checksum character varying(64) NOT NULL,
    finished_at timestamp with time zone,
    migration_name character varying(255) NOT NULL,
    logs text,
    rolled_back_at timestamp with time zone,
    started_at timestamp with time zone DEFAULT now() NOT NULL,
    applied_steps_count integer DEFAULT 0 NOT NULL
);


--
-- Data for Name: Block; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public."Block" (id, "courtId", "startDate", "endDate", "startTime", "endTime", reason, "createdAt", "updatedAt") FROM stdin;
cmwd0q8xl002s6wtrlfohl19u	cmwd0q8ut000n6wtrgxrn7q5y	2026-11-12	2026-11-18	19:00	23:00	Torneo nocturno de la liga del complejo	2026-11-12 03:58:49.785	2026-11-12 03:58:49.785
cmwd0q8xl002t6wtr9fkdskb9	cmwd0q8v6000x6wtrwunc24rj	2026-11-14	2026-11-15	09:00	13:00	Mantenimiento del césped	2026-11-12 03:58:49.785	2026-11-12 03:58:49.785
cmwd0q8xl002u6wtrwzh3y6nw	cmwd0q8vw001g6wtr55w4qv65	2026-11-05	2026-11-07	10:00	22:00	Uso interno: escuelita de fútbol	2026-11-12 03:58:49.785	2026-11-12 03:58:49.785
\.


--
-- Data for Name: Calificacion; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public."Calificacion" (id, "reservaId", "jugadorId", "complejoId", puntaje, comentario, "createdAt") FROM stdin;
\.


--
-- Data for Name: Cancha; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public."Cancha" (id, "complejoId", deporte, "tipoSuperficie", capacidad, "precioBase", "horaApertura", "horaCierre", "duracionTurnoMin", "createdAt", "updatedAt", nombre, activo, "porcentajeSena", "minAdvanceMinutes") FROM stdin;
cmwd0q8up000l6wtr00zsw2q5	cmwd0q8uj000h6wtrnug97pqi	FUTBOL_5	CESPED_SINTETICO	10	60000.00	09:00	00:00	60	2026-11-12 03:58:49.681	2026-11-12 03:58:49.681	Cancha 1	t	\N	\N
cmwd0q8ut000n6wtrgxrn7q5y	cmwd0q8uj000h6wtrnug97pqi	FUTBOL_5	CESPED_SINTETICO	10	60000.00	09:00	00:00	60	2026-11-12 03:58:49.685	2026-11-12 03:58:49.685	Cancha 2	t	\N	\N
cmwd0q8uv000p6wtrodthbwxw	cmwd0q8uj000h6wtrnug97pqi	FUTBOL_5	CESPED_SINTETICO	10	60000.00	09:00	00:00	60	2026-11-12 03:58:49.687	2026-11-12 03:58:49.687	Cancha 3	t	\N	\N
cmwd0q8uz000r6wtrksfuujsq	cmwd0q8uj000h6wtrnug97pqi	FUTBOL_7	CESPED_SINTETICO	14	90000.00	09:00	00:00	60	2026-11-12 03:58:49.691	2026-11-12 03:58:49.691	Cancha 7	t	\N	\N
cmwd0q8v6000x6wtrwunc24rj	cmwd0q8v3000t6wtro8w8efwj	FUTBOL_5	CESPED_SINTETICO	10	60000.00	09:00	00:00	60	2026-11-12 03:58:49.698	2026-11-12 03:58:49.698	Cancha 1	t	\N	\N
cmwd0q8v8000z6wtrlii6iaz8	cmwd0q8v3000t6wtro8w8efwj	FUTBOL_5	CESPED_SINTETICO	10	60000.00	09:00	00:00	60	2026-11-12 03:58:49.7	2026-11-12 03:58:49.7	Cancha 2	t	\N	\N
cmwd0q8ve00116wtrnkk6pn7v	cmwd0q8v3000t6wtro8w8efwj	PADEL	CEMENTO	4	40000.00	08:00	00:00	90	2026-11-12 03:58:49.706	2026-11-12 03:58:49.706	Pádel	t	50	\N
cmwd0q8vl00166wtrfa17q45h	cmwd0q8vi00136wtrpqecuv5o	FUTBOL_5	CESPED_SINTETICO	10	60000.00	09:00	00:00	60	2026-11-12 03:58:49.713	2026-11-12 03:58:49.713	Cancha 1	t	\N	\N
cmwd0q8vn00186wtr8d10h0hz	cmwd0q8vi00136wtrpqecuv5o	FUTBOL_5	CESPED_SINTETICO	10	60000.00	09:00	00:00	60	2026-11-12 03:58:49.715	2026-11-12 03:58:49.715	Cancha 2	t	\N	\N
cmwd0q8vr001a6wtravaxtb8s	cmwd0q8vi00136wtrpqecuv5o	FUTBOL_5	CESPED_SINTETICO	10	60000.00	09:00	00:00	60	2026-11-12 03:58:49.719	2026-11-12 03:58:49.719	Cancha 3	f	\N	\N
cmwd0q8vw001g6wtr55w4qv65	cmwd0q8vt001c6wtr4ngkew4n	FUTBOL_11	CESPED_SINTETICO	22	180000.00	10:00	22:00	90	2026-11-12 03:58:49.724	2026-11-12 03:58:49.724	Fútbol 11	t	\N	1440
cmwd0q8vy001h6wtrib7iyess	cmwd0q8vt001c6wtr4ngkew4n	FUTBOL_7	CESPED_SINTETICO	14	90000.00	09:00	00:00	60	2026-11-12 03:58:49.726	2026-11-12 03:58:49.726	Fútbol 7	t	\N	\N
cmwd0q8w1001j6wtrk8im4y9o	cmwd0q8vt001c6wtr4ngkew4n	TENIS	POLVO_DE_LADRILLO	4	30000.00	08:00	22:00	60	2026-11-12 03:58:49.729	2026-11-12 03:58:49.729	Tenis 1	t	\N	\N
cmwd0q8w3001m6wtrzgk1eqtz	cmwd0q8vt001c6wtr4ngkew4n	TENIS	POLVO_DE_LADRILLO	4	30000.00	08:00	22:00	60	2026-11-12 03:58:49.731	2026-11-12 03:58:49.731	Tenis 2	t	\N	\N
cmwd0q8w6001p6wtrz9e0n0o4	cmwd0q8vt001c6wtr4ngkew4n	TENIS	CESPED_NATURAL	4	38000.00	08:00	22:00	60	2026-11-12 03:58:49.734	2026-11-12 03:58:49.734	Tenis Césped	t	\N	\N
cmwd0q8wb001v6wtrk5pgsyb0	cmwd0q8w8001s6wtrz6aco54a	FUTBOL_5	CESPED_SINTETICO	10	60000.00	09:00	00:00	60	2026-11-12 03:58:49.739	2026-11-12 03:58:49.739	Cancha 1	t	\N	\N
cmwd0q8wd001x6wtrc4y13j00	cmwd0q8w8001s6wtrz6aco54a	FUTBOL_5	CESPED_SINTETICO	10	60000.00	09:00	00:00	60	2026-11-12 03:58:49.741	2026-11-12 03:58:49.741	Cancha 2	t	\N	\N
cmwd0q8wf001z6wtreqygf32x	cmwd0q8w8001s6wtrz6aco54a	FUTBOL_5	CEMENTO	10	45000.00	09:00	00:00	60	2026-11-12 03:58:49.743	2026-11-12 03:58:49.743	Cancha 3	t	\N	\N
cmwd0q8wh00216wtr7pfpxldd	cmwd0q8w8001s6wtrz6aco54a	FUTBOL_11	CESPED_SINTETICO	22	180000.00	10:00	22:00	90	2026-11-12 03:58:49.745	2026-11-12 03:58:49.745	Fútbol 11	t	\N	1440
cmwd0q8wl00246wtrlclse97f	cmwd0q8wj00226wtrjx3nyzvu	FUTBOL_5	CEMENTO	10	45000.00	09:00	00:00	60	2026-11-12 03:58:49.749	2026-11-12 03:58:49.749	Cancha 1	t	\N	\N
cmwd0q8wn00266wtrk0y98kmn	cmwd0q8wj00226wtrjx3nyzvu	FUTBOL_5	CEMENTO	10	45000.00	09:00	00:00	60	2026-11-12 03:58:49.751	2026-11-12 03:58:49.751	Cancha 2	t	\N	\N
cmwd0q8wp002a6wtrze4voyzh	cmwd0q8wo00286wtri3fscob8	FUTBOL_7	CESPED_SINTETICO	14	90000.00	09:00	00:00	60	2026-11-12 03:58:49.753	2026-11-12 03:58:49.753	Cancha 1	t	\N	\N
cmwd0q8wu002e6wtrp24e5ved	cmwd0q8ws002c6wtrcwb2itlt	FUTBOL_5	CESPED_SINTETICO	10	60000.00	09:00	00:00	60	2026-11-12 03:58:49.758	2026-11-12 03:58:49.758	Cancha 1	t	\N	\N
cmwd0q8x0002j6wtr4tr6fguw	cmwd0q8wx002g6wtrtgo5lp3d	FUTBOL_5	CESPED_SINTETICO	10	60000.00	09:00	00:00	60	2026-11-12 03:58:49.764	2026-11-12 03:58:49.764	Cancha 1	t	\N	\N
cmwd0q8x2002l6wtrigorutcm	cmwd0q8wx002g6wtrtgo5lp3d	FUTBOL_5	CESPED_SINTETICO	10	60000.00	09:00	00:00	60	2026-11-12 03:58:49.766	2026-11-12 03:58:49.766	Cancha 2	t	\N	\N
cmwd0q8x6002o6wtr7ggjjnev	cmwd0q8x5002n6wtrnf0ujrtd	FUTBOL_5	CESPED_SINTETICO	10	60000.00	09:00	00:00	60	2026-11-12 03:58:49.77	2026-11-12 03:58:49.77	Cancha 1	t	\N	\N
cmwd0q8x8002q6wtrvojz6692	cmwd0q8x5002n6wtrnf0ujrtd	FUTBOL_5	CESPED_SINTETICO	10	60000.00	09:00	00:00	60	2026-11-12 03:58:49.772	2026-11-12 03:58:49.772	Cancha 2	t	\N	\N
\.


--
-- Data for Name: Complejo; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public."Complejo" (id, nombre, direccion, zona, contacto, "duenioId", "createdAt", "updatedAt", activo, "porcentajeSenaDefault", "minAdvanceMinutesDefault", "cancellationHours", "estadoAprobacion", "motivoRechazo") FROM stdin;
cmwd0q8uj000h6wtrnug97pqi	Salguero Fútbol	Av. Costanera Rafael Obligado 1221	Palermo	11 5263-3800	cmwd0q8tn00016wtrf0s6ejeb	2026-10-13 03:58:49.66	2026-11-12 03:58:49.675	t	30	180	24	APROBADO	\N
cmwd0q8v3000t6wtro8w8efwj	Grün FC	Av. Crisólogo Larralde 999	Núñez	11 2456-2500	cmwd0q8tn00016wtrf0s6ejeb	2026-10-13 03:58:49.693	2026-11-12 03:58:49.695	t	30	180	12	APROBADO	\N
cmwd0q8vi00136wtrpqecuv5o	Caballito Norte	Av. Avellaneda 1423	Caballito	11 2365-7698	cmwd0q8tn00016wtrf0s6ejeb	2026-10-13 03:58:49.708	2026-11-12 03:58:49.71	t	25	180	72	APROBADO	\N
cmwd0q8vt001c6wtr4ngkew4n	Club CASA - Tenis y Fútbol	Av. Pres. Figueroa Alcorta 7101	Belgrano	11 3655-5478	cmwd0q8to00026wtr93va3leg	2026-10-13 03:58:49.721	2026-11-12 03:58:49.721	t	40	180	48	APROBADO	\N
cmwd0q8w8001s6wtrz6aco54a	El Polideportivo	Av. Crámer 3249	Núñez	11 6432-3180	cmwd0q8tp00036wtrxqi2qiq7	2026-10-13 03:58:49.736	2026-11-12 03:58:49.736	t	30	180	24	APROBADO	\N
cmwd0q8wj00226wtrjx3nyzvu	Nueva Generación - Sede Boedo	Quintino Bocayuva 1241	Boedo	11 3259-9787	cmwd0q8tp00036wtrxqi2qiq7	2026-10-13 03:58:49.746	2026-11-12 03:58:49.747	t	20	180	24	APROBADO	\N
cmwd0q8wo00286wtri3fscob8	Complejo Gustavo Costas - Boedo 5	Av. Boedo 47	Almagro	11 3619-9782	cmwd0q8ts00056wtrkpnm8mon	2026-10-13 03:58:49.752	2026-11-12 03:58:49.752	t	30	180	24	APROBADO	\N
cmwd0q8ws002c6wtrcwb2itlt	Marangoni Fútbol y Deporte	Av. Cnel. Díaz 2300	Palermo	11 4804-0524	cmwd0q8to00026wtr93va3leg	2026-11-09 03:58:49.755	2026-11-12 03:58:49.756	t	30	180	24	PENDIENTE	\N
cmwd0q8wx002g6wtrtgo5lp3d	Campus Sport Arena	Maza 754	Almagro	11 4956-0717	cmwd0q8tq00046wtr639ru05g	2026-11-09 03:58:49.76	2026-11-12 03:58:49.761	t	30	180	24	PENDIENTE	\N
cmwd0q8x5002n6wtrnf0ujrtd	Club Social y Deportivo Villa Malcolm	Av. Córdoba 5064	Villa Crespo	11 5107-6616	cmwd0q8tq00046wtr639ru05g	2026-11-09 03:58:49.768	2026-11-12 03:58:49.769	t	30	180	24	RECHAZADO	Faltan fotos de las canchas: subí al menos una para que los jugadores vean cómo es el complejo.
\.


--
-- Data for Name: Disputa; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public."Disputa" (id, "reservaId", "jugadorId", descripcion, estado, decision, "comentarioAdmin", "adminId", "resueltaEn", "createdAt") FROM stdin;
cmwd0q91f00a16wtresdy166w	2c1664f2-f32e-4c24-8cf9-468e3f724c88	cmwd0q8tu00066wtrls20ecnl	Llegamos 10 minutos antes y la cancha estaba ocupada por otro grupo. Esperamos media hora y nadie del complejo nos atendió, así que nos fuimos.	ABIERTA	\N	\N	\N	\N	2026-11-10 19:00:00
cmwd0q91l00a36wtr18czftx8	2a8ad879-b8a9-407e-a611-f275fe698e7c	cmwd0q8ty000a6wtrw2paalsv	Fuimos y jugamos. Le avisamos al encargado al llegar, no sé por qué figura que no fuimos.	ABIERTA	\N	\N	\N	\N	2026-11-11 19:00:00
cmwd0q91o00a46wtrpddex3lu	267525b2-7adf-4009-a15b-d778c009db76	cmwd0q8tu00066wtrls20ecnl	Fuimos y jugamos el partido completo. Tengo la foto de la cancha a la hora del turno.	RESUELTA	A_FAVOR_JUGADOR	La foto tiene la fecha y la hora del turno y se ve la cancha del complejo. Se da de baja la falta.	cmwd0q8tj00006wtrj5gw7dbl	2026-11-06 14:00:00	2026-11-04 19:00:00
cmwd0q91q00a66wtry7lo1dpg	c0b363d6-1362-40dc-8be9-5d4c4726db07	cmwd0q8tu00066wtrls20ecnl	No pudimos ir porque se nos complicó a última hora, pero avisamos por teléfono el mismo día.	RESUELTA	A_FAVOR_DUENIO	El propio reclamo dice que no fueron al turno. Avisar no reemplaza cancelar a tiempo, así que la falta queda.	cmwd0q8tj00006wtrj5gw7dbl	2026-11-05 14:00:00	2026-11-03 19:00:00
\.


--
-- Data for Name: EtiquetaReserva; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public."EtiquetaReserva" (id, "reservaId", "jugadorId", "etiquetadoPor", "createdAt") FROM stdin;
\.


--
-- Data for Name: EvidenciaDisputa; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public."EvidenciaDisputa" (id, "disputaId", url, tipo, orden) FROM stdin;
cmwd0q91h00a26wtrbn3b67qo	cmwd0q91f00a16wtresdy166w	/seed/cancha-1.jpg	IMAGEN	0
cmwd0q91o00a56wtruit2gocb	cmwd0q91o00a46wtrpddex3lu	/seed/cancha-2.jpg	IMAGEN	0
\.


--
-- Data for Name: EvidenciaTicket; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public."EvidenciaTicket" (id, "ticketId", url, tipo, orden) FROM stdin;
\.


--
-- Data for Name: ImagenComplejo; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public."ImagenComplejo" (id, "complejoId", url, orden, activo) FROM stdin;
cmwd0q8ul000i6wtrl6hsfs5h	cmwd0q8uj000h6wtrnug97pqi	/seed/cancha-1.jpg	0	t
cmwd0q8ul000j6wtrxgg7jtbd	cmwd0q8uj000h6wtrnug97pqi	/seed/cancha-2.jpg	1	t
cmwd0q8ul000k6wtr952k1ktx	cmwd0q8uj000h6wtrnug97pqi	/seed/cancha-3.jpg	2	t
cmwd0q8v3000u6wtr3um58vao	cmwd0q8v3000t6wtro8w8efwj	/seed/cancha-4.jpg	0	t
cmwd0q8v3000v6wtrwngqwlax	cmwd0q8v3000t6wtro8w8efwj	/seed/cancha-1.jpg	1	t
cmwd0q8v3000w6wtrd847jifp	cmwd0q8v3000t6wtro8w8efwj	/seed/cancha-1.jpg	2	t
cmwd0q8vj00146wtrucr335dh	cmwd0q8vi00136wtrpqecuv5o	/seed/cancha-2.jpg	0	t
cmwd0q8vj00156wtr7adfxf5c	cmwd0q8vi00136wtrpqecuv5o	/seed/cancha-3.jpg	1	t
cmwd0q8vu001d6wtrv4zpk857	cmwd0q8vt001c6wtr4ngkew4n	/seed/cancha-3.jpg	0	t
cmwd0q8vu001e6wtrlnerh0dh	cmwd0q8vt001c6wtr4ngkew4n	/seed/cancha-4.jpg	1	t
cmwd0q8vu001f6wtrwz7q4d23	cmwd0q8vt001c6wtr4ngkew4n	/seed/cancha-4.jpg	2	t
cmwd0q8w9001t6wtrjjfajumu	cmwd0q8w8001s6wtrz6aco54a	/seed/cancha-1.jpg	0	t
cmwd0q8w9001u6wtrybdy0lh3	cmwd0q8w8001s6wtrz6aco54a	/seed/cancha-2.jpg	1	t
cmwd0q8wk00236wtrwysw6114	cmwd0q8wj00226wtrjx3nyzvu	/seed/cancha-3.jpg	0	t
cmwd0q8wp00296wtry68aw1m2	cmwd0q8wo00286wtri3fscob8	/seed/cancha-4.jpg	0	t
cmwd0q8ws002d6wtr3ibbx5za	cmwd0q8ws002c6wtrcwb2itlt	/seed/cancha-3.jpg	0	t
cmwd0q8wy002h6wtrw17litql	cmwd0q8wx002g6wtrtgo5lp3d	/seed/cancha-1.jpg	0	t
cmwd0q8wy002i6wtrmpwdlye2	cmwd0q8wx002g6wtrtgo5lp3d	/seed/cancha-1.jpg	1	t
\.


--
-- Data for Name: Intento; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public."Intento" (id, clave, "createdAt") FROM stdin;
\.


--
-- Data for Name: Pago; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public."Pago" (id, "reservaId", monto, porcentaje, devuelto, "createdAt", "cancellationHours") FROM stdin;
cmwd0q90x002v6wtri9dc5fbl	e2c4329e-b388-4bf7-aa60-d46a209cb19f	12000.00	40	f	2026-10-28 03:58:49.788	48
cmwd0q90x002w6wtrg4mgdwg3	a94c7569-5479-44b9-b921-b3c48489ea08	22500.00	30	f	2026-10-29 03:58:49.788	24
cmwd0q90x002x6wtr82xa52vh	c0b363d6-1362-40dc-8be9-5d4c4726db07	22500.00	30	f	2026-10-30 03:58:49.789	24
cmwd0q90x002y6wtrb6xo47hi	267525b2-7adf-4009-a15b-d778c009db76	24000.00	50	f	2026-10-31 03:58:49.789	12
cmwd0q90x002z6wtryw961tyx	b88f6acb-f4e8-41dd-af3d-9a1c26944ebb	18750.00	25	f	2026-11-01 03:58:49.789	72
cmwd0q90x00306wtrvdms497y	91717908-3051-4716-ac17-ef1281de58d2	33000.00	30	f	2026-11-02 03:58:49.789	24
cmwd0q90x00316wtr5hwsq9m1	e20846c0-cec5-4128-8d8e-aa84a547f56c	33000.00	30	f	2026-11-03 03:58:49.789	24
cmwd0q90x00326wtrekyh2sxg	7f7885ea-09e9-4b40-b184-7edb89aa3501	44000.00	40	t	2026-11-05 03:58:49.789	48
cmwd0q90x00336wtra9d0g43m	2c1664f2-f32e-4c24-8cf9-468e3f724c88	22500.00	30	f	2026-11-06 03:58:49.789	24
cmwd0q90x00346wtryaomfmbs	f03dd994-13cd-4de3-9ecb-bce673d44af0	22500.00	30	f	2026-11-07 03:58:49.789	24
cmwd0q90x00356wtrhb3guogu	380dc8e9-44e6-471e-b6a9-3c190cde2702	22500.00	30	f	2026-11-08 03:58:49.789	12
cmwd0q90x00366wtrcf73fz6t	7e5d6b38-3d0d-4982-a287-9838de279844	22500.00	30	f	2026-11-09 03:58:49.79	24
cmwd0q90x00376wtrnl7z9n4o	05a68c33-10e5-4ffe-85d7-a37092bf0493	22500.00	30	f	2026-11-10 03:58:49.791	24
cmwd0q90x00386wtrceo07pu2	143be54a-28ce-4150-b5ed-56a0bf64c390	14400.00	40	t	2026-11-10 03:58:49.791	48
cmwd0q90x00396wtrwjatk2gy	39ebcdc8-ea5c-4c7d-8f8d-f9c61959738a	24000.00	50	f	2026-11-10 03:58:49.791	12
cmwd0q90x003a6wtrtswwwigc	48fcbebc-949c-467e-8ea4-305d71feb382	22500.00	30	f	2026-11-10 03:58:49.791	24
cmwd0q90x003b6wtriywhjd4a	ac85aaf7-96d0-4d80-815c-2168f9c2ce00	12000.00	40	f	2026-11-10 03:58:49.791	48
cmwd0q90x003c6wtruea6n6tf	2a8ad879-b8a9-407e-a611-f275fe698e7c	11000.00	20	f	2026-11-07 03:58:49.791	24
cmwd0q90x003d6wtrf2n79ok3	5cfd205d-9afd-4fab-934b-063d0dea9e78	22500.00	30	f	2026-11-04 03:58:49.791	24
cmwd0q90x003e6wtryaa3i3oo	eb6cbdd6-99e2-4dc3-8808-38467f47b37c	22500.00	30	f	2026-11-02 03:58:49.791	24
cmwd0q90x003f6wtr7eb5em59	d2ec1120-2fb1-4715-9084-cd3a247ccb5e	18750.00	25	f	2026-11-04 03:58:49.791	72
cmwd0q90x003g6wtrvhodhmq3	d50be49f-6ede-4a54-b0b7-f8c0034b243e	18750.00	25	f	2026-11-06 03:58:49.791	72
cmwd0q90x003h6wtrc3txylvl	57d6fbb9-99f7-4481-a4f4-043835098d57	22500.00	30	f	2026-10-31 03:58:49.792	24
cmwd0q90x003i6wtraf16t182	2335071f-370d-47ee-8c0e-206240e22713	18000.00	30	f	2026-11-01 03:58:49.792	24
cmwd0q90x003j6wtrafq22pmh	34a45e32-0a18-4139-ad2c-a904227b66c0	22500.00	30	f	2026-11-02 03:58:49.792	24
cmwd0q90x003k6wtr4zpoot34	25846185-9bff-4775-a3ab-76e7ba3e607a	22500.00	30	f	2026-11-03 03:58:49.792	24
cmwd0q90x003l6wtrsyjjnws6	1f18df4e-d740-4e7d-aa0d-2f126149dc5f	18000.00	30	f	2026-11-05 03:58:49.792	24
cmwd0q90x003m6wtrhju6y25u	3f366147-df95-47f8-a51f-41a5eab7ccaa	18000.00	30	f	2026-11-06 03:58:49.793	24
cmwd0q90x003n6wtru26wqsav	036c2c56-7512-440e-b121-ce9d1d4999c1	22500.00	30	f	2026-11-07 03:58:49.793	24
cmwd0q90x003o6wtrkkw8bf1z	7aa67b4b-4564-4852-83b1-f8ef9bec5872	22500.00	30	f	2026-11-10 03:58:49.793	24
cmwd0q90x003p6wtr2ynjhl3b	179976f8-ac26-450d-8ea5-583fc1948392	22500.00	30	f	2026-11-10 03:58:49.793	24
cmwd0q90x003q6wtrh9gmgur8	45acedba-8104-473a-b243-500c7d23bc16	18000.00	30	f	2026-11-10 03:58:49.793	24
cmwd0q90x003r6wtrfzdz0w6a	79d01181-a5d1-4022-80a9-34a23e7ff666	22500.00	30	f	2026-10-31 03:58:49.794	24
cmwd0q90x003s6wtrh80lrhij	1f69ea82-4069-4782-8875-46ba466375ee	22500.00	30	f	2026-10-31 03:58:49.794	24
cmwd0q90x003t6wtr4tq6dkl8	5e87e2b9-0842-456b-93bd-0adbbb7f6f0f	22500.00	30	f	2026-11-02 03:58:49.794	24
cmwd0q90x003u6wtrsve0a6wo	0f18d995-fe8e-41d5-bf14-025d85886a70	22500.00	30	f	2026-11-05 03:58:49.794	24
cmwd0q90x003v6wtrkfl6vcz5	285e026a-fec1-4871-ad24-e158c4cb62b8	18000.00	30	f	2026-11-10 03:58:49.795	24
cmwd0q90x003w6wtr9ej6znr7	2822a6f6-d7ad-417d-8e62-b44cd55d29dc	18000.00	30	f	2026-11-10 03:58:49.795	24
cmwd0q90x003x6wtraukmkdf3	6bffa676-1bc7-43d7-a3b3-18a870f470cd	22500.00	30	f	2026-11-02 03:58:49.795	24
cmwd0q90x003y6wtryabenacr	d63beff0-8ff7-428d-a4a3-e95eed324343	22500.00	30	f	2026-11-02 03:58:49.795	24
cmwd0q90x003z6wtr7ixyg70i	59f9b0c6-ec4a-46ad-ac5c-25b268066968	22500.00	30	f	2026-11-03 03:58:49.795	24
cmwd0q90x00406wtrm0i851lq	c7aedace-031f-4e69-9fc3-25260d2f54f8	22500.00	30	t	2026-11-04 03:58:49.795	24
cmwd0q90x00416wtrmeevg5n7	c543b1de-6586-405d-8eaf-642751bf5f7a	18000.00	30	f	2026-11-04 03:58:49.795	24
cmwd0q90x00426wtriru4646h	39b1b24b-2284-413b-90ea-6f8161ae2a8f	22500.00	30	t	2026-11-05 03:58:49.795	24
cmwd0q90x00436wtrdw6mcxbe	e11329ba-c023-4337-a936-71f51e2a2c81	18000.00	30	t	2026-11-05 03:58:49.796	24
cmwd0q90x00446wtrl4ltowjz	24b1d565-1f47-426a-8c79-d7ec5800d79c	18000.00	30	f	2026-11-06 03:58:49.796	24
cmwd0q90x00456wtrekb4dgob	6811c42d-894d-46ef-97f9-034de677c6cd	22500.00	30	f	2026-11-09 03:58:49.796	24
cmwd0q90x00466wtrj7frz443	3491fc58-50cf-4fcf-ae5c-a0a35e841ebf	22500.00	30	f	2026-11-09 03:58:49.796	24
cmwd0q90x00476wtrhwwr41kd	e06466f1-39e0-4722-9e41-03e59e5984d3	22500.00	30	f	2026-11-10 03:58:49.796	24
cmwd0q90x00486wtrjpa8mhpe	657b5550-d41c-4577-be71-e4e351ed0eb2	18000.00	30	f	2026-11-10 03:58:49.796	24
cmwd0q90x00496wtrarv24xne	118cc149-18dc-4564-9eb3-8f734f80ee0c	18000.00	30	f	2026-11-10 03:58:49.796	24
cmwd0q90x004a6wtr9moj4qcg	a14f135e-40a8-42b8-9bdb-5e80a80b3baf	22500.00	30	f	2026-11-10 03:58:49.797	24
cmwd0q90x004b6wtrfu909y0h	3eeaaf91-1abc-4a48-b239-dc490403175e	22500.00	30	f	2026-11-10 03:58:49.797	24
cmwd0q90x004c6wtrurhkjjlz	688e0de7-79e8-44af-afc6-3015da143970	22500.00	30	f	2026-11-10 03:58:49.797	24
cmwd0q90x004d6wtr1nsgfqh9	91eb75e3-4b0a-459a-943c-191b9653cce9	33000.00	30	f	2026-10-31 03:58:49.797	24
cmwd0q90x004e6wtrmt4cm2we	52e368de-fb55-4713-9c5a-53fcb9db402c	33000.00	30	f	2026-11-02 03:58:49.797	24
cmwd0q90x004f6wtrd8qtwlrx	ae0a91d9-7018-4f35-829d-ca580220a25e	27000.00	30	f	2026-11-04 03:58:49.797	24
cmwd0q90x004g6wtr4aqofek7	4cf7acf4-8ee5-4379-9185-c091a6bca153	33000.00	30	f	2026-11-04 03:58:49.797	24
cmwd0q90x004h6wtrr8uw2vq3	dc8360aa-0507-417f-b39f-496e9e8b674f	27000.00	30	f	2026-11-04 03:58:49.797	24
cmwd0q90x004i6wtrs7krh2y0	ef27060f-002a-40a6-95c8-234a092747da	27000.00	30	f	2026-11-07 03:58:49.798	24
cmwd0q90x004j6wtrokf0oq4w	5b0c0a45-8805-428d-ba59-9259115f2226	33000.00	30	f	2026-11-10 03:58:49.798	24
cmwd0q90x004k6wtrs7uzrxvm	665a988b-4f4f-4317-a289-138fa3ab6069	27000.00	30	f	2026-11-10 03:58:49.798	24
cmwd0q90x004l6wtr09tqwpqg	1d76ce4d-5045-4ed3-8093-ea5005315e16	33000.00	30	f	2026-11-10 03:58:49.798	24
cmwd0q90x004m6wtrukbwqd0u	57c923c5-ba2c-45ff-ac40-25105fef8380	33000.00	30	f	2026-11-10 03:58:49.798	24
cmwd0q90x004n6wtrfwgzwqmw	e8a12c46-824d-48ca-a022-dab83bf6ab85	27000.00	30	f	2026-11-10 03:58:49.798	24
cmwd0q90x004o6wtrvqz1i71u	49e6d2a5-fba0-4898-940d-cc74092874bd	33000.00	30	t	2026-11-10 03:58:49.798	24
cmwd0q90x004p6wtr37e6tz21	7642f196-52e9-407c-bf8e-378516ae7e27	22500.00	30	t	2026-10-31 03:58:49.798	12
cmwd0q90x004q6wtrx3t9rk0q	aa2a9d45-e54c-4bd1-a410-2d7e1e1bdd50	18000.00	30	f	2026-11-01 03:58:49.798	12
cmwd0q90x004r6wtrha9bbucr	8dffa03f-65ba-4e12-8f08-cea8f692a93b	18000.00	30	f	2026-11-02 03:58:49.798	12
cmwd0q90x004s6wtratmcu880	a5ab70d5-7c25-4429-b0c3-1abe7d0078c5	22500.00	30	f	2026-11-03 03:58:49.799	12
cmwd0q90x004t6wtrx8180myk	5cda2d6f-0c78-49ca-a761-dd6fa87510d9	22500.00	30	f	2026-11-04 03:58:49.799	12
cmwd0q90x004u6wtri1t5csjd	9cb4db86-1f68-46b5-a19c-a5d32de0391e	22500.00	30	f	2026-11-05 03:58:49.799	12
cmwd0q90x004v6wtr1g1v5a0w	4b23693b-0652-4bef-be46-e49b99c2cf9a	18000.00	30	f	2026-11-08 03:58:49.799	12
cmwd0q90x004w6wtrezr4vz5r	00a69617-e25e-41af-9b88-79bdc01a6e68	22500.00	30	f	2026-11-10 03:58:49.799	12
cmwd0q90x004x6wtr3xj228da	d99ba721-0418-4437-9237-46d532207ee5	18000.00	30	t	2026-11-10 03:58:49.799	12
cmwd0q90x004y6wtrfvohsn4v	b237cbb8-b077-40b9-836f-782f5987c00c	22500.00	30	f	2026-10-31 03:58:49.799	12
cmwd0q90x004z6wtrcru7gca1	50d99716-1620-431f-8301-0a9e075d0001	22500.00	30	f	2026-11-01 03:58:49.8	12
cmwd0q90x00506wtrhamwv86m	aa10212f-401c-4eb7-a20b-397d13277d31	18000.00	30	f	2026-11-04 03:58:49.8	12
cmwd0q90x00516wtrwqdylb3r	3e5ccb63-e6d1-4a4b-b4f0-a08a4455becd	22500.00	30	f	2026-11-04 03:58:49.8	12
cmwd0q90x00526wtrzz5eq7dm	d1b6fba0-d204-4ec9-8cc8-94c96b371f1d	18000.00	30	f	2026-11-08 03:58:49.8	12
cmwd0q90x00536wtrw13j135z	99d571fc-8c19-4cef-acb8-40fc8864edeb	22500.00	30	f	2026-11-09 03:58:49.8	12
cmwd0q90x00546wtro2zuygsb	40657ac4-94e5-4b0e-af5b-4108faef8120	22500.00	30	f	2026-11-10 03:58:49.8	12
cmwd0q90x00556wtrvl6pcp15	902de485-14ec-4ed5-9682-703000cf180c	18000.00	30	f	2026-11-10 03:58:49.8	12
cmwd0q90x00566wtrczbrzcrs	85f79c5a-970a-4006-9743-80d77e582445	22500.00	30	t	2026-11-10 03:58:49.8	12
cmwd0q90x00576wtrfai6t8dy	2ad9a81b-537f-4c6e-ae59-02b931cab861	22500.00	30	f	2026-11-10 03:58:49.801	12
cmwd0q90x00586wtrukc2tpss	0a3f034a-6b10-4b21-b1e9-e043c34ee64d	22500.00	30	f	2026-11-10 03:58:49.801	12
cmwd0q90x00596wtrih2x2hhr	9efaa3f0-e5b1-4a2e-8608-d41092a1985c	18000.00	30	f	2026-11-10 03:58:49.801	12
cmwd0q90x005a6wtr0it95urn	de18b8f2-27b7-481a-b9ba-c7a9af03d421	22500.00	30	f	2026-11-10 03:58:49.801	12
cmwd0q90x005b6wtrqzczdef2	d5a6a5a9-3bea-422c-9535-b84b0582daff	13333.34	50	f	2026-11-01 03:58:49.801	12
cmwd0q90x005c6wtr7mnx1312	f518fb1e-9bbd-45fe-8ca4-77feb84171d6	24000.00	50	f	2026-11-05 03:58:49.801	12
cmwd0q90x005d6wtr6pl0ht5c	6b1cdbcb-6396-4129-be73-623146aaa56e	24000.00	50	f	2026-11-08 03:58:49.802	12
cmwd0q90x005e6wtry8s5ed99	119cbb04-4745-4a3a-b3e6-2353a5856dd1	13333.34	50	f	2026-11-09 03:58:49.802	12
cmwd0q90x005f6wtrwa5fio26	663cae20-a934-43b5-91a1-fd13b2fe266a	24000.00	50	f	2026-11-10 03:58:49.802	12
cmwd0q90x005g6wtrio0hwlpv	1a5bd364-80f9-4a53-9931-a47075d5fa72	18750.00	25	f	2026-10-31 03:58:49.802	72
cmwd0q90x005h6wtrnkqy4m1r	9f88f909-889f-4480-8730-e7c82216d993	18750.00	25	f	2026-10-31 03:58:49.802	72
cmwd0q90x005i6wtrdczk1251	c50dd11c-09a5-4072-9a69-eb31593d2639	15000.00	25	f	2026-11-02 03:58:49.802	72
cmwd0q90x005j6wtrchvb5go8	dcc375f4-e106-4007-9808-539ad672889b	15000.00	25	f	2026-11-02 03:58:49.803	72
cmwd0q90x005k6wtr1a7gh5vt	8670c2b6-5a96-426e-8db2-763e1f4d2285	15000.00	25	f	2026-11-04 03:58:49.803	72
cmwd0q90x005l6wtrk76mbcl7	491c016a-8778-49d8-840f-01d23917c042	18750.00	25	f	2026-11-04 03:58:49.803	72
cmwd0q90x005m6wtr0c0gg559	9279937f-a608-44fa-892e-841bb841646c	18750.00	25	f	2026-11-05 03:58:49.803	72
cmwd0q90x005n6wtrwfhrok45	d24efc7c-e11c-40ae-8a43-0c142e1cdd2d	18750.00	25	f	2026-11-06 03:58:49.803	72
cmwd0q90x005o6wtr78knb6gs	22635751-e056-49c0-a4e2-d6698f640cf2	15000.00	25	f	2026-11-08 03:58:49.803	72
cmwd0q90x005p6wtrm687e6zo	be3eea98-c24c-4347-bc48-7568657baeb3	18750.00	25	f	2026-11-08 03:58:49.803	72
cmwd0q90x005q6wtrkqcxs8lg	8f050b8c-d5b6-4c33-b983-583db5723217	15000.00	25	f	2026-11-10 03:58:49.804	72
cmwd0q90x005r6wtrcl3ux4bu	0a26b810-12ec-4b95-a34f-b943dcd0b2ea	18750.00	25	f	2026-11-10 03:58:49.804	72
cmwd0q90x005s6wtrbdql8gow	64f17dc2-8abe-40ea-b43f-617683e8da3f	18750.00	25	f	2026-11-10 03:58:49.804	72
cmwd0q90x005t6wtrohw8ha7h	a06ff965-80e6-4749-bd02-78c030811c77	15000.00	25	f	2026-11-10 03:58:49.804	72
cmwd0q90x005u6wtrizlrovw3	a5d81221-3ce7-46b2-a223-f4bec8a75782	15000.00	25	f	2026-11-10 03:58:49.804	72
cmwd0q90x005v6wtrg92z24ds	79895159-2f94-407f-b842-55c7c81bba0c	18750.00	25	f	2026-10-31 03:58:49.804	72
cmwd0q90x005w6wtrhuu7m12f	d5383f9d-7a77-48b1-8cfe-db4ddc7a2153	18750.00	25	f	2026-10-31 03:58:49.804	72
cmwd0q90x005x6wtrnwn9f3ba	6207bcf6-c1bb-4b30-9f01-c0cabc7d69ff	15000.00	25	f	2026-11-01 03:58:49.804	72
cmwd0q90x005y6wtr59k19fos	8aafe762-797b-46bc-acb2-ad5666d5fc4f	18750.00	25	f	2026-11-02 03:58:49.804	72
cmwd0q90x005z6wtr77fa10ku	a82da413-a0d4-47b4-a122-52b609445a9c	15000.00	25	f	2026-11-06 03:58:49.805	72
cmwd0q90x00606wtr1zfsbazt	89653c9d-e038-49e9-8f27-401f2393b587	18750.00	25	f	2026-11-07 03:58:49.805	72
cmwd0q90x00616wtrtyfyvxf5	c0957fa1-bf08-4aed-ad2d-704c6dd92e8d	18750.00	25	f	2026-11-07 03:58:49.805	72
cmwd0q90x00626wtraghj49h9	d824b784-6e1a-4a69-8ab6-270cc8059f83	15000.00	25	f	2026-11-09 03:58:49.805	72
cmwd0q90x00636wtrw1gqmv3n	b4167986-44fe-4c05-b906-8e729e7b3a4d	18750.00	25	f	2026-11-10 03:58:49.805	72
cmwd0q90x00646wtrfy0rb3al	e05ea32e-09d4-4b61-885c-a187a836a6c8	15000.00	25	f	2026-11-10 03:58:49.805	72
cmwd0q90x00656wtrs5iookwz	f4d816b6-ac06-4011-8c02-75af95a10be0	15000.00	25	f	2026-11-10 03:58:49.805	72
cmwd0q90x00666wtrwvb1jvif	24bc0c1c-87a9-4209-b944-c7eac7dcc370	18750.00	25	f	2026-11-10 03:58:49.805	72
cmwd0q90x00676wtrr6tdrwsl	cd593521-0513-4df6-9a0d-7ae8196e8b44	15000.00	25	f	2026-11-10 03:58:49.805	72
cmwd0q90x00686wtrx5fb7sgc	aa7cf685-3f83-4b06-8d67-bbb5685f25a3	72000.00	40	f	2026-11-01 03:58:49.806	48
cmwd0q90x00696wtrlobh1na8	434683cb-840b-4372-b93e-4a1db45af6c9	72000.00	40	f	2026-11-06 03:58:49.806	48
cmwd0q90x006a6wtrfgv1m3vo	3b2bf1e3-7a76-4e5f-8b11-b5682a132512	72000.00	40	f	2026-11-06 03:58:49.806	48
cmwd0q90x006b6wtroierpyei	b1ec0b03-b905-4984-aeb3-46bba91fadf5	72000.00	40	f	2026-11-10 03:58:49.806	48
cmwd0q90x006c6wtr9z1h1x2w	91a91ace-c1f8-47d2-8422-f72920281c02	44000.00	40	f	2026-10-31 03:58:49.807	48
cmwd0q90x006d6wtrvpwtsivx	c25b1e16-9e7d-4b36-bcf5-3cb9d7ea4cc5	44000.00	40	f	2026-10-31 03:58:49.807	48
cmwd0q90x006e6wtrqvi0imu2	4b8157ed-8337-4b99-9c35-39ffd0cd86a0	36000.00	40	f	2026-11-02 03:58:49.807	48
cmwd0q90x006f6wtrf7afekov	2b86af4b-26dc-466e-9ef5-c999d6aba1e8	44000.00	40	f	2026-11-04 03:58:49.807	48
cmwd0q90x006g6wtr5u5yt7s2	e1a53958-6f0a-46fa-af3f-18b258639c80	36000.00	40	f	2026-11-07 03:58:49.807	48
cmwd0q90x006h6wtr7umey5kb	d6ac1d15-4cd0-42a8-a339-d71e8bc75cb0	36000.00	40	f	2026-11-08 03:58:49.807	48
cmwd0q90x006i6wtrcmtrl3eh	3b5cdc0b-cea4-4d3a-a373-5d3d8d761b5e	44000.00	40	f	2026-11-08 03:58:49.807	48
cmwd0q90x006j6wtr7z6vnc26	cc88c7c4-ac11-495e-9d14-1cf0ea58cebe	36000.00	40	f	2026-11-09 03:58:49.808	48
cmwd0q90x006k6wtru4ryuvas	a6e6145e-db77-409e-a1de-207e2caa6102	36000.00	40	f	2026-11-10 03:58:49.808	48
cmwd0q90x006l6wtrvshti7hk	8db614d9-66c5-428b-9030-8768b3e64338	36000.00	40	f	2026-11-10 03:58:49.808	48
cmwd0q90x006m6wtrxknefccp	8d8747c6-d818-457b-9a8a-001073e6dd3d	36000.00	40	f	2026-11-10 03:58:49.808	48
cmwd0q90x006n6wtrgpw76367	4ebbe842-b43f-46ec-9c61-098faae492c5	44000.00	40	f	2026-11-10 03:58:49.808	48
cmwd0q90x006o6wtr0on7s6b4	3136b9d2-d246-4c15-ab09-b76b66ec4432	36000.00	40	f	2026-11-10 03:58:49.808	48
cmwd0q90x006p6wtr2cxo159b	28737c15-65a8-4a9e-920b-6e51a67a5d89	12000.00	40	f	2026-11-02 03:58:49.808	48
cmwd0q90x006q6wtr1cu6rn2k	48aab7f2-e856-4704-824f-1c7cff9d95e6	12000.00	40	f	2026-11-04 03:58:49.808	48
cmwd0q90x006r6wtrg2qks2t1	f9868ab3-1c83-463f-906e-3d5d55402bd2	12000.00	40	f	2026-11-04 03:58:49.809	48
cmwd0q90x006s6wtrdhrz8sh1	a422a941-111b-405a-a206-99c17fd75ffd	14400.00	40	t	2026-11-05 03:58:49.809	48
cmwd0q90x006t6wtrz2arlbm5	67af8869-33c3-4c96-9b4b-1837cbc82d21	14400.00	40	f	2026-11-06 03:58:49.809	48
cmwd0q90x006u6wtrpfm7pd4r	2cd45d32-3a3c-427a-96dd-43ac92786f92	14400.00	40	t	2026-11-06 03:58:49.809	48
cmwd0q90x006v6wtr4gp6e8ie	356c509a-df24-4f78-afea-6acbe38b5255	14400.00	40	f	2026-11-06 03:58:49.809	48
cmwd0q90x006w6wtrqhcshfxt	19d9e072-f83c-411e-b521-a4d625d11683	12000.00	40	f	2026-11-07 03:58:49.809	48
cmwd0q90x006x6wtrl2dojbgj	a3b84ff7-f21b-4d65-9d8b-abe4754fa54e	12000.00	40	f	2026-11-09 03:58:49.809	48
cmwd0q90x006y6wtr97rc8z3e	bedb6e59-e96e-4fce-927b-69d73b042f7f	12000.00	40	f	2026-11-10 03:58:49.809	48
cmwd0q90x006z6wtrb1n671pg	918c20b4-349e-481a-829c-a7447300c9ae	12000.00	40	f	2026-11-10 03:58:49.809	48
cmwd0q90x00706wtrphbnldpb	7e954a73-a55d-4c9e-bf52-5b1d7a98a46c	12000.00	40	f	2026-11-02 03:58:49.81	48
cmwd0q90x00716wtr008j3w3e	cc04e5fc-3529-46b6-8f39-ff9873321f87	12000.00	40	t	2026-11-02 03:58:49.81	48
cmwd0q90x00726wtr3j61luse	8912fd0f-7cc3-4104-ad74-6ffa31de6fd4	12000.00	40	f	2026-11-03 03:58:49.81	48
cmwd0q90x00736wtrq1iybtvy	de1d7205-ef19-46b7-9918-d23ea3ecb3ac	14400.00	40	f	2026-11-06 03:58:49.81	48
cmwd0q90x00746wtrtmgjd7ku	9340d299-9136-4fa1-91ee-f05681ecdcb6	12000.00	40	f	2026-11-08 03:58:49.81	48
cmwd0q90x00756wtrkkosp2ud	9366a64a-81f7-4412-8d06-2717a503c8c0	12000.00	40	f	2026-11-08 03:58:49.81	48
cmwd0q90x00766wtrk3icnk2l	297d5c4f-6c2b-4b2f-9656-7c63c689b83e	12000.00	40	f	2026-11-08 03:58:49.81	48
cmwd0q90x00776wtr6w98toxr	cca05c6b-5054-4a47-aff0-13c90e468f5d	12000.00	40	f	2026-11-10 03:58:49.811	48
cmwd0q90x00786wtraakne4se	8275f621-6138-4bc8-9c38-2c4ec1bfe8f9	14400.00	40	f	2026-11-10 03:58:49.811	48
cmwd0q90x00796wtrk7b6n86o	305d901b-5d89-4760-93ee-c7c75e0c2d1b	14400.00	40	f	2026-11-10 03:58:49.811	48
cmwd0q90x007a6wtrr0xl5l3g	342ca318-7903-4a46-a065-c5736ee65d21	12000.00	40	f	2026-11-10 03:58:49.811	48
cmwd0q90x007b6wtru9mejscr	e31215c9-176f-4d7b-aa72-d55032b76a96	12000.00	40	t	2026-11-10 03:58:49.811	48
cmwd0q90x007c6wtrqiffuh10	e42fd76c-b16a-4405-ae3f-61a6b373590e	15200.00	40	f	2026-10-31 03:58:49.811	48
cmwd0q90x007d6wtrn52imj2s	aefa855b-ef79-4404-ad7f-b3663a61f649	15200.00	40	f	2026-11-01 03:58:49.811	48
cmwd0q90x007e6wtrat57m6h5	4221ecbe-b926-4cee-8eff-c249426b9474	15200.00	40	t	2026-11-03 03:58:49.811	48
cmwd0q90x007f6wtr9t73b6hd	49870353-10f7-455c-b524-6cc4fc2055aa	15200.00	40	f	2026-11-04 03:58:49.812	48
cmwd0q90x007g6wtrwhvzttlm	ab0055e4-bbef-46fb-866a-fbb2a5a0e861	15200.00	40	f	2026-11-07 03:58:49.812	48
cmwd0q90x007h6wtrd2legbin	b0688832-0249-4229-8006-c861c6336f49	15200.00	40	f	2026-11-07 03:58:49.812	48
cmwd0q90x007i6wtr8hriapz5	c42b5fec-4381-43cc-8b4f-f289f48451db	15200.00	40	f	2026-11-07 03:58:49.812	48
cmwd0q90x007j6wtrye022oks	c11010ea-5b43-4ac4-b7f7-d5a627155ec7	15200.00	40	t	2026-11-07 03:58:49.812	48
cmwd0q90x007k6wtr4puedm84	9ef48594-670f-4db6-9216-66fdee8a7919	15200.00	40	f	2026-11-10 03:58:49.812	48
cmwd0q90x007l6wtrl93sytpr	7df16381-8006-4a2a-89c6-c25ebfbe7c95	15200.00	40	f	2026-11-10 03:58:49.812	48
cmwd0q90x007m6wtr6j8tqx29	bdc94a33-f51d-4a6e-b902-79327c82b404	14400.00	40	f	2026-11-10 03:58:49.812	48
cmwd0q90x007n6wtrqj915db1	62da145c-2567-4bd6-93bc-4adb7f6f8f81	15200.00	40	f	2026-11-10 03:58:49.812	48
cmwd0q90x007o6wtr6ogh2wdx	adb4d90d-ecb4-441c-8df6-999b59a98b53	15200.00	40	f	2026-11-10 03:58:49.812	48
cmwd0q90x007p6wtryx6dgbnd	a810321c-dfeb-4974-bba3-3424f7127a39	22500.00	30	t	2026-10-31 03:58:49.813	24
cmwd0q90x007q6wtrbeaysag5	09dde170-85b9-4c4f-8bef-cf3a79affd45	18000.00	30	f	2026-10-31 03:58:49.813	24
cmwd0q90x007r6wtr56ugbpur	6078d70f-fde6-4bed-95b8-a210d7ee23d7	22500.00	30	f	2026-11-01 03:58:49.813	24
cmwd0q90x007s6wtrstz10y36	258f23a4-be72-4982-96b7-e46d9dc6792c	22500.00	30	f	2026-11-03 03:58:49.813	24
cmwd0q90x007t6wtri28z5jlz	9d6bb64d-d9c1-48df-b08b-3fe3ac02e640	22500.00	30	f	2026-11-03 03:58:49.813	24
cmwd0q90x007u6wtrwyazoyae	483f29ee-d9f1-41c8-bdac-acd3eab019ea	18000.00	30	f	2026-11-04 03:58:49.813	24
cmwd0q90x007v6wtry1otody5	3102bd57-1c67-45de-aaf4-3e6b74aec089	18000.00	30	f	2026-11-05 03:58:49.813	24
cmwd0q90x007w6wtrusl3zg6g	4964fd8e-5cbc-4daf-ab2b-e324d43d96b7	22500.00	30	f	2026-11-05 03:58:49.814	24
cmwd0q90x007x6wtr8m47jr52	dd4dda01-4060-42af-ab75-14b040181c0b	22500.00	30	f	2026-11-05 03:58:49.814	24
cmwd0q90x007y6wtrlgas99g2	cbb0c153-52bd-4896-b4c8-b6d18ec22088	22500.00	30	t	2026-11-06 03:58:49.814	24
cmwd0q90x007z6wtr5wzudhdo	d52605ef-55d6-4b3f-9c75-7301f9a2f20e	18000.00	30	t	2026-11-10 03:58:49.814	24
cmwd0q90x00806wtr2q0rbvme	601e624b-7844-459f-98e9-25bec3693fa9	22500.00	30	f	2026-11-10 03:58:49.814	24
cmwd0q90x00816wtrbr5yld6x	31baf086-14c3-4149-a8dc-8d0e96691ec0	22500.00	30	f	2026-11-02 03:58:49.814	24
cmwd0q90x00826wtr96b89mur	67e323c4-e53c-42f5-b554-5f4932756911	18000.00	30	f	2026-11-03 03:58:49.815	24
cmwd0q90x00836wtrclyo7ods	46fa0d9e-6e71-48de-ae3d-cd5a22e31e4e	18000.00	30	f	2026-11-03 03:58:49.815	24
cmwd0q90x00846wtrvectpsa2	6fb909d4-a7be-4927-b565-62c1c7eb4fc8	22500.00	30	t	2026-11-04 03:58:49.815	24
cmwd0q90x00856wtrbxpziup2	8b64d5af-f43b-4a35-b840-75192b0b95e7	22500.00	30	f	2026-11-05 03:58:49.815	24
cmwd0q90x00866wtr218y03t5	c5494648-744a-4e56-8a93-19531b189186	22500.00	30	f	2026-11-07 03:58:49.815	24
cmwd0q90x00876wtr4vmyx4p7	a4ffca06-c7e7-43cd-a795-bedd93fd4a45	22500.00	30	f	2026-11-09 03:58:49.815	24
cmwd0q90x00886wtrhif4mxvg	7545b36c-5348-40c3-a66d-063a46212d09	22500.00	30	f	2026-11-10 03:58:49.815	24
cmwd0q90x00896wtria773qzh	38c8dcbb-6b26-4a8c-a509-3a6824ae2e53	22500.00	30	f	2026-11-10 03:58:49.815	24
cmwd0q90x008a6wtr9dr8n9uw	492b773f-89e3-4c9f-8d32-34828828fb66	22500.00	30	f	2026-11-10 03:58:49.815	24
cmwd0q90x008b6wtrup3fngwh	67354de0-c01d-40c3-acad-77817f771a31	22500.00	30	f	2026-11-10 03:58:49.815	24
cmwd0q90x008c6wtr0qitcc79	8d8eb2e3-e7ff-44b0-b622-110bd92c81e0	18000.00	30	f	2026-11-10 03:58:49.815	24
cmwd0q90x008d6wtrzvakdvmp	13b3f76f-28cb-4504-80c8-077f2d215977	18000.00	30	f	2026-11-10 03:58:49.816	24
cmwd0q90x008e6wtr77xg9d5w	fd3a9e4a-2eed-41d4-be14-1b8612da0925	22500.00	30	f	2026-11-10 03:58:49.816	24
cmwd0q90x008f6wtrqq6z1eph	1e54c576-61ba-4d1c-a4b2-bcd4614a26d1	18000.00	30	f	2026-11-10 03:58:49.816	24
cmwd0q90x008g6wtri8hwvd8h	cdb4dd65-1c70-44af-b782-318d27efffbb	22500.00	30	f	2026-11-10 03:58:49.816	24
cmwd0q90x008h6wtrbulci4at	95168fad-03c5-48a8-b2cb-34d32ee1fa28	13500.00	30	f	2026-10-31 03:58:49.816	24
cmwd0q90x008i6wtr4sjxis5m	1a60aaaf-d246-4169-af03-ce8a9338c2f3	16500.00	30	f	2026-11-03 03:58:49.816	24
cmwd0q90x008j6wtrgexlej7i	43f69443-f20c-4ba0-b237-ea6bcf13f012	13500.00	30	f	2026-11-06 03:58:49.816	24
cmwd0q90x008k6wtrfwglkurc	653766e8-119c-4bbe-a815-4f145367cf85	16500.00	30	f	2026-11-06 03:58:49.816	24
cmwd0q90x008l6wtr7pwk6w7d	dd8cd5b2-f543-45ac-b535-8968fe2facc2	16500.00	30	f	2026-11-08 03:58:49.817	24
cmwd0q90x008m6wtrhmu6vle0	875e008c-a66e-47cd-afad-404daece4996	13500.00	30	f	2026-11-09 03:58:49.817	24
cmwd0q90x008n6wtrimdm7v0v	1cc65c57-66da-4630-ae00-73220ed17c0e	13500.00	30	f	2026-11-09 03:58:49.817	24
cmwd0q90x008o6wtrxmb0t83a	2adce05d-75aa-40f6-b302-6feed57e1c23	16500.00	30	f	2026-11-09 03:58:49.817	24
cmwd0q90x008p6wtr2majsbm5	33b32518-0c5d-41e3-8989-9a626a9217b1	13500.00	30	f	2026-11-10 03:58:49.817	24
cmwd0q90x008q6wtrega3bx77	a33fb6c6-fbc2-44db-96cf-47ce7c2322be	13500.00	30	f	2026-11-10 03:58:49.817	24
cmwd0q90x008r6wtr2e33k0tu	cc65053b-b0b1-4215-a230-af65323e0762	13500.00	30	f	2026-11-10 03:58:49.817	24
cmwd0q90x008s6wtraawff7cd	b4fe4e3b-fadc-4e48-aaeb-52a63df56564	16500.00	30	f	2026-11-10 03:58:49.817	24
cmwd0q90x008t6wtr1jz0lq3h	e1683a35-82b8-4b38-a395-287e478eeb69	16500.00	30	f	2026-11-10 03:58:49.817	24
cmwd0q90x008u6wtr397ud9aq	45321628-d38a-4f6a-921f-652eb1e7d465	54000.00	30	f	2026-11-02 03:58:49.818	24
cmwd0q90x008v6wtrdln7i35q	5e290ec5-fe3a-4e2a-bdee-34275cd61741	54000.00	30	f	2026-11-04 03:58:49.818	24
cmwd0q90x008w6wtrav8rschp	0df4dae2-f1e1-41b7-a88d-bbb30558f39f	54000.00	30	f	2026-11-05 03:58:49.818	24
cmwd0q90x008x6wtropsamlw1	90a3932c-3f2e-475c-8c3f-96481b714e51	54000.00	30	f	2026-11-06 03:58:49.818	24
cmwd0q90x008y6wtrofdqflfy	9dfefa8c-5b74-4d17-b476-35e6814eeea8	9000.00	20	t	2026-11-01 03:58:49.819	24
cmwd0q90x008z6wtryazfrswy	dfabd0ac-931d-45ae-91fa-d031eb798af6	11000.00	20	f	2026-11-01 03:58:49.819	24
cmwd0q90x00906wtribcl2o3l	093a2d5d-6df1-4b36-b7d4-547e8695580a	11000.00	20	f	2026-11-01 03:58:49.819	24
cmwd0q90x00916wtr076hhgb1	28f63692-4ecd-4919-b327-732b58848d1c	11000.00	20	f	2026-11-03 03:58:49.819	24
cmwd0q90x00926wtreovhazys	a1c8b1bd-d606-4733-99fb-ac2701473c1f	11000.00	20	f	2026-11-03 03:58:49.819	24
cmwd0q90x00936wtrvr26r6ip	94f57221-5e8e-49d0-9c97-fd048ec08094	11000.00	20	t	2026-11-04 03:58:49.819	24
cmwd0q90x00946wtrvmscwv3y	69972c08-439f-4fd5-bfd9-1afc3ba01db9	11000.00	20	t	2026-11-05 03:58:49.819	24
cmwd0q90x00956wtr2vanvavp	83bfde99-aed5-4ed9-b687-6a7b97d21ad6	11000.00	20	f	2026-11-07 03:58:49.82	24
cmwd0q90x00966wtr732r804p	b35646c9-898e-4f9d-9333-0c8add2f8e8d	11000.00	20	f	2026-11-09 03:58:49.82	24
cmwd0q90x00976wtrdruk4lts	5ea12ffd-fab5-4c62-a654-4ba751f9736a	11000.00	20	f	2026-11-10 03:58:49.82	24
cmwd0q90x00986wtrfnr1h1iv	023b1215-8f3a-47da-9f61-38948f71ff91	9000.00	20	f	2026-11-10 03:58:49.82	24
cmwd0q90x00996wtralwgg1cl	239ed7ff-0a22-4aed-b2f3-08c5b8f32389	11000.00	20	f	2026-11-10 03:58:49.82	24
cmwd0q90x009a6wtrg0fgdw9j	908bbe44-0b4f-4908-bf6b-66b6b1915bc9	11000.00	20	f	2026-11-10 03:58:49.82	24
cmwd0q90x009b6wtr1c79s0hu	9f91c2e0-5ded-4a03-977b-301e7723b63d	11000.00	20	f	2026-11-10 03:58:49.82	24
cmwd0q90x009c6wtrsscadvag	c2a75e78-e228-4dfe-a42d-3bf559000f3c	9000.00	20	f	2026-11-10 03:58:49.82	24
cmwd0q90x009d6wtrqs41vfnd	97717036-7d37-4552-a884-1c89b1b731b6	11000.00	20	f	2026-11-10 03:58:49.82	24
cmwd0q90x009e6wtrf9n1j7lg	ad81d407-6d8b-42eb-9af0-e08a7fdf9301	9000.00	20	f	2026-11-10 03:58:49.82	24
cmwd0q90x009f6wtrfyixav2c	a0f6a1d9-9ee0-4b09-badd-7e88bd8050c4	11000.00	20	t	2026-11-01 03:58:49.82	24
cmwd0q90x009g6wtr6tkghm0o	a59f6424-bbe2-4526-ab73-43d7afa1af95	11000.00	20	f	2026-11-03 03:58:49.821	24
cmwd0q90x009h6wtry31al1dc	746297f5-3129-4e39-9d25-76fc60197e35	11000.00	20	f	2026-11-04 03:58:49.821	24
cmwd0q90x009i6wtrgx6fypsg	a0543c1f-97b9-46e3-876c-1d0d8c05e9a5	11000.00	20	f	2026-11-05 03:58:49.821	24
cmwd0q90x009j6wtrngabfdbx	c90027e6-03f9-408c-8dc5-8f4c3555141f	11000.00	20	f	2026-11-05 03:58:49.821	24
cmwd0q90x009k6wtr4r1chdsm	62a52205-aab0-46cb-b4b0-736039ed7241	11000.00	20	f	2026-11-06 03:58:49.821	24
cmwd0q90x009l6wtrinqrfqzt	af2b202f-afea-403a-986d-3921e904fe31	9000.00	20	f	2026-11-08 03:58:49.821	24
cmwd0q90x009m6wtrfwl95ek3	ecb39006-f006-41e4-a64e-3061878573e4	11000.00	20	f	2026-11-08 03:58:49.821	24
cmwd0q90x009n6wtr24yd17lb	3a00393d-8721-498b-a675-b25833f100cb	11000.00	20	f	2026-11-09 03:58:49.821	24
cmwd0q90x009o6wtrfsim1y75	db72c36c-15ae-44c6-9058-921ce2c9a5bb	9000.00	20	f	2026-11-10 03:58:49.821	24
cmwd0q90x009p6wtrwmzat09q	085d18eb-88ec-4225-9718-267d28f55530	9000.00	20	t	2026-11-10 03:58:49.821	24
cmwd0q90x009q6wtrh7kepuxl	cb2866f9-1f11-4771-8fc7-7b7c9a30e3d6	9000.00	20	f	2026-11-10 03:58:49.822	24
cmwd0q90x009r6wtrc6r96bb0	6a6b150c-52f3-4a44-b118-3a78d9055744	11000.00	20	f	2026-11-10 03:58:49.822	24
cmwd0q90x009s6wtrmxbrzyo6	23f75b74-4e28-4521-9bcd-a2dfb976772d	9000.00	20	f	2026-11-10 03:58:49.822	24
cmwd0q90x009t6wtrhiuysa7y	d10dcfc2-d1bf-4767-9077-ab5f93ae26ca	27000.00	30	f	2026-11-01 03:58:49.822	24
cmwd0q90x009u6wtr03h7z4ij	8a6abee1-55bc-4f5e-bf0c-0041660aa8ae	33000.00	30	f	2026-11-03 03:58:49.822	24
cmwd0q90x009v6wtrrskd8x0b	098ab70e-65b0-4442-b690-d3b4197a60ab	27000.00	30	f	2026-11-04 03:58:49.822	24
cmwd0q90x009w6wtrf60wmskz	62f51ed8-3c02-40bc-9237-bdbab09c7883	33000.00	30	f	2026-11-06 03:58:49.822	24
cmwd0q90x009x6wtrtzesibwq	6a73779d-bb76-4ff7-b8fc-d257229a5c3c	33000.00	30	f	2026-11-08 03:58:49.823	24
cmwd0q90x009y6wtrth6vqss3	9e50ba3c-81cc-4244-8a31-9edda1ad342e	33000.00	30	f	2026-11-09 03:58:49.823	24
cmwd0q90x009z6wtrb5e4rbru	50fb57a1-cb08-482b-b92e-0fa9d282ade1	33000.00	30	f	2026-11-09 03:58:49.823	24
cmwd0q90x00a06wtr6rahyhsx	7b092fbd-5250-4cbe-8d73-284bec05b1d4	33000.00	30	f	2026-11-09 03:58:49.823	24
\.


--
-- Data for Name: ParticipanteReserva; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public."ParticipanteReserva" (id, "reservaId", "jugadorId", jugadores) FROM stdin;
\.


--
-- Data for Name: PrecioEspecial; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public."PrecioEspecial" (id, "canchaId", "diaSemana", "horaInicio", "horaFin", precio, activo) FROM stdin;
cmwd0q8uq000m6wtrobc4lqk5	cmwd0q8up000l6wtr00zsw2q5	\N	19:00	23:00	75000.00	t
cmwd0q8ut000o6wtr7hc5tlvi	cmwd0q8ut000n6wtrgxrn7q5y	\N	19:00	23:00	75000.00	t
cmwd0q8uw000q6wtrpmhdrqh8	cmwd0q8uv000p6wtrodthbwxw	\N	19:00	23:00	75000.00	t
cmwd0q8uz000s6wtr81ocilr5	cmwd0q8uz000r6wtrksfuujsq	\N	19:00	23:00	110000.00	t
cmwd0q8v6000y6wtr9wbmkniz	cmwd0q8v6000x6wtrwunc24rj	\N	19:00	23:00	75000.00	t
cmwd0q8v900106wtr9ohnr7qz	cmwd0q8v8000z6wtrlii6iaz8	\N	19:00	23:00	75000.00	t
cmwd0q8vf00126wtrg1k16418	cmwd0q8ve00116wtrnkk6pn7v	\N	19:00	23:00	48000.00	t
cmwd0q8vl00176wtrrwl1m1zb	cmwd0q8vl00166wtrfa17q45h	\N	19:00	23:00	75000.00	t
cmwd0q8vn00196wtrqp7opkgl	cmwd0q8vn00186wtr8d10h0hz	\N	19:00	23:00	75000.00	t
cmwd0q8vr001b6wtrr47rjo42	cmwd0q8vr001a6wtravaxtb8s	\N	19:00	23:00	75000.00	t
cmwd0q8vy001i6wtrmwn7thkm	cmwd0q8vy001h6wtrib7iyess	\N	19:00	23:00	110000.00	t
cmwd0q8w1001k6wtrjjg9anxs	cmwd0q8w1001j6wtrk8im4y9o	6	\N	\N	36000.00	t
cmwd0q8w1001l6wtrof6zg69b	cmwd0q8w1001j6wtrk8im4y9o	0	\N	\N	36000.00	t
cmwd0q8w3001n6wtr5behk2tb	cmwd0q8w3001m6wtrzgk1eqtz	6	\N	\N	36000.00	t
cmwd0q8w3001o6wtrpdf6y9lx	cmwd0q8w3001m6wtrzgk1eqtz	0	\N	\N	36000.00	t
cmwd0q8w7001q6wtri2zt2qwi	cmwd0q8w6001p6wtrz9e0n0o4	6	\N	\N	36000.00	t
cmwd0q8w7001r6wtrocjdphxk	cmwd0q8w6001p6wtrz9e0n0o4	0	\N	\N	36000.00	t
cmwd0q8wc001w6wtra3z9vvq6	cmwd0q8wb001v6wtrk5pgsyb0	\N	19:00	23:00	75000.00	t
cmwd0q8wd001y6wtrem9flnvb	cmwd0q8wd001x6wtrc4y13j00	\N	19:00	23:00	75000.00	t
cmwd0q8wg00206wtr33butmx0	cmwd0q8wf001z6wtreqygf32x	\N	19:00	23:00	55000.00	t
cmwd0q8wm00256wtra01ss5i0	cmwd0q8wl00246wtrlclse97f	\N	19:00	23:00	55000.00	t
cmwd0q8wn00276wtrvdx58nte	cmwd0q8wn00266wtrk0y98kmn	\N	19:00	23:00	55000.00	t
cmwd0q8wq002b6wtr4d8g3yj3	cmwd0q8wp002a6wtrze4voyzh	\N	19:00	23:00	110000.00	t
cmwd0q8wv002f6wtrtd3nwqa1	cmwd0q8wu002e6wtrp24e5ved	\N	19:00	23:00	75000.00	t
cmwd0q8x0002k6wtrojd9xhri	cmwd0q8x0002j6wtr4tr6fguw	\N	19:00	23:00	75000.00	t
cmwd0q8x2002m6wtrei9alth8	cmwd0q8x2002l6wtrigorutcm	\N	19:00	23:00	75000.00	t
cmwd0q8x6002p6wtrbttiqbgv	cmwd0q8x6002o6wtr7ggjjnev	\N	19:00	23:00	75000.00	t
cmwd0q8x8002r6wtrap1roo6s	cmwd0q8x8002q6wtrvojz6692	\N	19:00	23:00	75000.00	t
\.


--
-- Data for Name: Reserva; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public."Reserva" (id, "canchaId", "jugadorId", fecha, "horaInicio", "horaFin", estado, "createdAt", "updatedAt", "precioTurno", asistio, "asistenciaMarcadaEn", jugadores, descuento) FROM stdin;
e2c4329e-b388-4bf7-aa60-d46a209cb19f	cmwd0q8w1001j6wtrk8im4y9o	cmwd0q8tu00066wtrls20ecnl	2026-10-30	10:00	11:00	CONFIRMADA	2026-10-28 03:58:49.788	2026-11-12 03:58:49.87	30000.00	f	2026-10-31 15:00:00	\N	0.00
a94c7569-5479-44b9-b921-b3c48489ea08	cmwd0q8wb001v6wtrk5pgsyb0	cmwd0q8tu00066wtrls20ecnl	2026-10-31	21:00	22:00	CONFIRMADA	2026-10-29 03:58:49.788	2026-11-12 03:58:49.87	75000.00	t	2026-11-01 15:00:00	\N	0.00
c0b363d6-1362-40dc-8be9-5d4c4726db07	cmwd0q8up000l6wtr00zsw2q5	cmwd0q8tu00066wtrls20ecnl	2026-11-01	20:00	21:00	CONFIRMADA	2026-10-30 03:58:49.789	2026-11-12 03:58:49.87	75000.00	f	2026-11-02 15:00:00	\N	0.00
267525b2-7adf-4009-a15b-d778c009db76	cmwd0q8ve00116wtrnkk6pn7v	cmwd0q8tu00066wtrls20ecnl	2026-11-02	20:00	21:30	CONFIRMADA	2026-10-31 03:58:49.789	2026-11-12 03:58:49.87	48000.00	t	2026-11-03 15:00:00	\N	0.00
b88f6acb-f4e8-41dd-af3d-9a1c26944ebb	cmwd0q8vl00166wtrfa17q45h	cmwd0q8tu00066wtrls20ecnl	2026-11-03	21:00	22:00	CANCELADA	2026-11-01 03:58:49.789	2026-11-12 03:58:49.87	75000.00	\N	\N	\N	0.00
91717908-3051-4716-ac17-ef1281de58d2	cmwd0q8wp002a6wtrze4voyzh	cmwd0q8tu00066wtrls20ecnl	2026-11-04	21:00	22:00	CONFIRMADA	2026-11-02 03:58:49.789	2026-11-12 03:58:49.87	110000.00	t	2026-11-05 15:00:00	\N	0.00
e20846c0-cec5-4128-8d8e-aa84a547f56c	cmwd0q8uz000r6wtrksfuujsq	cmwd0q8tu00066wtrls20ecnl	2026-11-05	20:00	21:00	CONFIRMADA	2026-11-03 03:58:49.789	2026-11-12 03:58:49.87	110000.00	t	2026-11-06 15:00:00	\N	0.00
7f7885ea-09e9-4b40-b184-7edb89aa3501	cmwd0q8vy001h6wtrib7iyess	cmwd0q8tu00066wtrls20ecnl	2026-11-07	19:00	20:00	CANCELADA	2026-11-05 03:58:49.789	2026-11-12 03:58:49.87	110000.00	\N	\N	\N	0.00
2c1664f2-f32e-4c24-8cf9-468e3f724c88	cmwd0q8wb001v6wtrk5pgsyb0	cmwd0q8tu00066wtrls20ecnl	2026-11-08	20:00	21:00	CONFIRMADA	2026-11-06 03:58:49.789	2026-11-12 03:58:49.87	75000.00	f	2026-11-09 15:00:00	\N	0.00
f03dd994-13cd-4de3-9ecb-bce673d44af0	cmwd0q8uv000p6wtrodthbwxw	cmwd0q8tu00066wtrls20ecnl	2026-11-09	21:00	22:00	CONFIRMADA	2026-11-07 03:58:49.789	2026-11-12 03:58:49.87	75000.00	t	2026-11-10 15:00:00	\N	0.00
380dc8e9-44e6-471e-b6a9-3c190cde2702	cmwd0q8v8000z6wtrlii6iaz8	cmwd0q8tu00066wtrls20ecnl	2026-11-10	20:00	21:00	CONFIRMADA	2026-11-08 03:58:49.789	2026-11-12 03:58:49.87	75000.00	f	2026-11-11 15:00:00	\N	0.00
7e5d6b38-3d0d-4982-a287-9838de279844	cmwd0q8up000l6wtr00zsw2q5	cmwd0q8tu00066wtrls20ecnl	2026-11-11	21:00	22:00	CONFIRMADA	2026-11-09 03:58:49.79	2026-11-12 03:58:49.87	75000.00	\N	\N	\N	0.00
05a68c33-10e5-4ffe-85d7-a37092bf0493	cmwd0q8up000l6wtr00zsw2q5	cmwd0q8tu00066wtrls20ecnl	2026-11-13	21:00	22:00	CONFIRMADA	2026-11-10 03:58:49.791	2026-11-12 03:58:49.87	75000.00	\N	\N	\N	0.00
c20647b9-82e7-480b-85dc-957e7db309a3	cmwd0q8vn00186wtr8d10h0hz	cmwd0q8tu00066wtrls20ecnl	2026-11-14	20:00	21:00	PENDIENTE	2026-11-12 03:57:49.791	2026-11-12 03:58:49.87	75000.00	\N	\N	\N	0.00
143be54a-28ce-4150-b5ed-56a0bf64c390	cmwd0q8w3001m6wtrzgk1eqtz	cmwd0q8tu00066wtrls20ecnl	2026-11-14	18:00	19:00	CANCELADA	2026-11-10 03:58:49.791	2026-11-12 03:58:49.87	36000.00	\N	\N	\N	0.00
39ebcdc8-ea5c-4c7d-8f8d-f9c61959738a	cmwd0q8ve00116wtrnkk6pn7v	cmwd0q8tu00066wtrls20ecnl	2026-11-15	20:00	21:30	CONFIRMADA	2026-11-10 03:58:49.791	2026-11-12 03:58:49.87	48000.00	\N	\N	\N	0.00
c7527b52-ac5c-4141-859e-994b3a541bd7	cmwd0q8wl00246wtrlclse97f	cmwd0q8tu00066wtrls20ecnl	2026-11-16	19:00	20:00	CANCELADA	2026-11-10 03:58:49.791	2026-11-12 03:58:49.87	55000.00	\N	\N	\N	0.00
48fcbebc-949c-467e-8ea4-305d71feb382	cmwd0q8wb001v6wtrk5pgsyb0	cmwd0q8tu00066wtrls20ecnl	2026-11-17	21:00	22:00	CONFIRMADA	2026-11-10 03:58:49.791	2026-11-12 03:58:49.87	75000.00	\N	\N	\N	0.00
ac85aaf7-96d0-4d80-815c-2168f9c2ce00	cmwd0q8w1001j6wtrk8im4y9o	cmwd0q8tu00066wtrls20ecnl	2026-11-18	10:00	11:00	CONFIRMADA	2026-11-10 03:58:49.791	2026-11-12 03:58:49.87	30000.00	\N	\N	\N	0.00
ed4cec43-f3d9-4975-b79f-2e7232729334	cmwd0q8v6000x6wtrwunc24rj	cmwd0q8tv00076wtrtcdgel16	2026-11-13	19:00	20:00	PENDIENTE	2026-11-12 03:53:49.791	2026-11-12 03:58:49.87	75000.00	\N	\N	\N	0.00
2a8ad879-b8a9-407e-a611-f275fe698e7c	cmwd0q8wl00246wtrlclse97f	cmwd0q8ty000a6wtrw2paalsv	2026-11-09	21:00	22:00	CONFIRMADA	2026-11-07 03:58:49.791	2026-11-12 03:58:49.87	55000.00	f	2026-11-10 15:00:00	\N	0.00
5cfd205d-9afd-4fab-934b-063d0dea9e78	cmwd0q8up000l6wtr00zsw2q5	cmwd0q8u3000g6wtr1r9o3mpw	2026-11-06	19:00	20:00	CONFIRMADA	2026-11-04 03:58:49.791	2026-11-12 03:58:49.87	75000.00	t	2026-11-07 15:00:00	\N	0.00
eb6cbdd6-99e2-4dc3-8808-38467f47b37c	cmwd0q8wd001x6wtrc4y13j00	cmwd0q8u3000g6wtr1r9o3mpw	2026-11-04	20:00	21:00	CONFIRMADA	2026-11-02 03:58:49.791	2026-11-12 03:58:49.87	75000.00	f	2026-11-05 15:00:00	\N	0.00
d2ec1120-2fb1-4715-9084-cd3a247ccb5e	cmwd0q8vr001a6wtravaxtb8s	cmwd0q8tw00086wtrvuzrerpp	2026-11-06	20:00	21:00	CONFIRMADA	2026-11-04 03:58:49.791	2026-11-12 03:58:49.87	75000.00	t	2026-11-07 15:00:00	\N	0.00
d50be49f-6ede-4a54-b0b7-f8c0034b243e	cmwd0q8vr001a6wtravaxtb8s	cmwd0q8tx00096wtrbtrkh8m6	2026-11-08	21:00	22:00	CONFIRMADA	2026-11-06 03:58:49.791	2026-11-12 03:58:49.87	75000.00	t	2026-11-09 15:00:00	\N	0.00
57d6fbb9-99f7-4481-a4f4-043835098d57	cmwd0q8up000l6wtr00zsw2q5	cmwd0q8tv00076wtrtcdgel16	2026-11-02	21:00	22:00	CONFIRMADA	2026-10-31 03:58:49.792	2026-11-12 03:58:49.87	75000.00	t	2026-11-03 15:00:00	\N	0.00
2335071f-370d-47ee-8c0e-206240e22713	cmwd0q8up000l6wtr00zsw2q5	cmwd0q8tv00076wtrtcdgel16	2026-11-03	18:00	19:00	CONFIRMADA	2026-11-01 03:58:49.792	2026-11-12 03:58:49.87	60000.00	t	2026-11-04 15:00:00	\N	0.00
34a45e32-0a18-4139-ad2c-a904227b66c0	cmwd0q8up000l6wtr00zsw2q5	cmwd0q8tz000c6wtr6tz994py	2026-11-04	19:00	20:00	CONFIRMADA	2026-11-02 03:58:49.792	2026-11-12 03:58:49.87	75000.00	t	2026-11-05 15:00:00	\N	0.00
25846185-9bff-4775-a3ab-76e7ba3e607a	cmwd0q8up000l6wtr00zsw2q5	cmwd0q8tx00096wtrbtrkh8m6	2026-11-05	19:00	20:00	CONFIRMADA	2026-11-03 03:58:49.792	2026-11-12 03:58:49.87	75000.00	t	2026-11-06 15:00:00	\N	0.00
1f18df4e-d740-4e7d-aa0d-2f126149dc5f	cmwd0q8up000l6wtr00zsw2q5	cmwd0q8tx00096wtrbtrkh8m6	2026-11-07	23:00	00:00	CONFIRMADA	2026-11-05 03:58:49.792	2026-11-12 03:58:49.87	60000.00	t	2026-11-08 15:00:00	\N	0.00
3f366147-df95-47f8-a51f-41a5eab7ccaa	cmwd0q8up000l6wtr00zsw2q5	cmwd0q8u1000e6wtrtg64uz4y	2026-11-08	23:00	00:00	CONFIRMADA	2026-11-06 03:58:49.793	2026-11-12 03:58:49.87	60000.00	t	2026-11-09 15:00:00	\N	0.00
036c2c56-7512-440e-b121-ce9d1d4999c1	cmwd0q8up000l6wtr00zsw2q5	cmwd0q8ty000a6wtrw2paalsv	2026-11-09	20:00	21:00	CONFIRMADA	2026-11-07 03:58:49.793	2026-11-12 03:58:49.87	75000.00	t	2026-11-10 15:00:00	\N	0.00
7aa67b4b-4564-4852-83b1-f8ef9bec5872	cmwd0q8up000l6wtr00zsw2q5	cmwd0q8ty000a6wtrw2paalsv	2026-11-14	22:00	23:00	CONFIRMADA	2026-11-10 03:58:49.793	2026-11-12 03:58:49.87	75000.00	\N	\N	\N	0.00
179976f8-ac26-450d-8ea5-583fc1948392	cmwd0q8up000l6wtr00zsw2q5	cmwd0q8tz000c6wtr6tz994py	2026-11-15	22:00	23:00	CONFIRMADA	2026-11-10 03:58:49.793	2026-11-12 03:58:49.87	75000.00	\N	\N	\N	0.00
45acedba-8104-473a-b243-500c7d23bc16	cmwd0q8up000l6wtr00zsw2q5	cmwd0q8tz000c6wtr6tz994py	2026-11-16	15:00	16:00	CONFIRMADA	2026-11-10 03:58:49.793	2026-11-12 03:58:49.87	60000.00	\N	\N	\N	0.00
79d01181-a5d1-4022-80a9-34a23e7ff666	cmwd0q8ut000n6wtrgxrn7q5y	cmwd0q8tx00096wtrbtrkh8m6	2026-11-02	19:00	20:00	CONFIRMADA	2026-10-31 03:58:49.794	2026-11-12 03:58:49.87	75000.00	t	2026-11-03 15:00:00	\N	0.00
1f69ea82-4069-4782-8875-46ba466375ee	cmwd0q8ut000n6wtrgxrn7q5y	cmwd0q8ty000a6wtrw2paalsv	2026-11-02	20:00	21:00	CONFIRMADA	2026-10-31 03:58:49.794	2026-11-12 03:58:49.87	75000.00	t	2026-11-03 15:00:00	\N	0.00
5e87e2b9-0842-456b-93bd-0adbbb7f6f0f	cmwd0q8ut000n6wtrgxrn7q5y	cmwd0q8tx00096wtrbtrkh8m6	2026-11-04	22:00	23:00	CONFIRMADA	2026-11-02 03:58:49.794	2026-11-12 03:58:49.87	75000.00	t	2026-11-05 15:00:00	\N	0.00
0f18d995-fe8e-41d5-bf14-025d85886a70	cmwd0q8ut000n6wtrgxrn7q5y	cmwd0q8u1000e6wtrtg64uz4y	2026-11-07	19:00	20:00	CONFIRMADA	2026-11-05 03:58:49.794	2026-11-12 03:58:49.87	75000.00	t	2026-11-08 15:00:00	\N	0.00
285e026a-fec1-4871-ad24-e158c4cb62b8	cmwd0q8ut000n6wtrgxrn7q5y	cmwd0q8ty000b6wtrrp08pzey	2026-11-15	16:00	17:00	CONFIRMADA	2026-11-10 03:58:49.795	2026-11-12 03:58:49.87	60000.00	\N	\N	\N	0.00
2822a6f6-d7ad-417d-8e62-b44cd55d29dc	cmwd0q8ut000n6wtrgxrn7q5y	cmwd0q8tv00076wtrtcdgel16	2026-11-17	23:00	00:00	CONFIRMADA	2026-11-10 03:58:49.795	2026-11-12 03:58:49.87	60000.00	\N	\N	\N	0.00
6bffa676-1bc7-43d7-a3b3-18a870f470cd	cmwd0q8uv000p6wtrodthbwxw	cmwd0q8u1000f6wtrinw7wd15	2026-11-04	19:00	20:00	CONFIRMADA	2026-11-02 03:58:49.795	2026-11-12 03:58:49.87	75000.00	t	2026-11-05 15:00:00	\N	0.00
d63beff0-8ff7-428d-a4a3-e95eed324343	cmwd0q8uv000p6wtrodthbwxw	cmwd0q8u1000f6wtrinw7wd15	2026-11-04	22:00	23:00	CONFIRMADA	2026-11-02 03:58:49.795	2026-11-12 03:58:49.87	75000.00	t	2026-11-05 15:00:00	\N	0.00
59f9b0c6-ec4a-46ad-ac5c-25b268066968	cmwd0q8uv000p6wtrodthbwxw	cmwd0q8ty000a6wtrw2paalsv	2026-11-05	19:00	20:00	CONFIRMADA	2026-11-03 03:58:49.795	2026-11-12 03:58:49.87	75000.00	t	2026-11-06 15:00:00	\N	0.00
c7aedace-031f-4e69-9fc3-25260d2f54f8	cmwd0q8uv000p6wtrodthbwxw	cmwd0q8ty000a6wtrw2paalsv	2026-11-06	21:00	22:00	CANCELADA	2026-11-04 03:58:49.795	2026-11-12 03:58:49.87	75000.00	\N	\N	\N	0.00
c543b1de-6586-405d-8eaf-642751bf5f7a	cmwd0q8uv000p6wtrodthbwxw	cmwd0q8u1000e6wtrtg64uz4y	2026-11-06	23:00	00:00	CONFIRMADA	2026-11-04 03:58:49.795	2026-11-12 03:58:49.87	60000.00	t	2026-11-07 15:00:00	\N	0.00
39b1b24b-2284-413b-90ea-6f8161ae2a8f	cmwd0q8uv000p6wtrodthbwxw	cmwd0q8u1000e6wtrtg64uz4y	2026-11-07	20:00	21:00	CANCELADA	2026-11-05 03:58:49.795	2026-11-12 03:58:49.87	75000.00	\N	\N	\N	0.00
e11329ba-c023-4337-a936-71f51e2a2c81	cmwd0q8uv000p6wtrodthbwxw	cmwd0q8u0000d6wtrp3lmvo1c	2026-11-07	23:00	00:00	CANCELADA	2026-11-05 03:58:49.796	2026-11-12 03:58:49.87	60000.00	\N	\N	\N	0.00
24b1d565-1f47-426a-8c79-d7ec5800d79c	cmwd0q8uv000p6wtrodthbwxw	cmwd0q8u1000f6wtrinw7wd15	2026-11-08	13:00	14:00	CONFIRMADA	2026-11-06 03:58:49.796	2026-11-12 03:58:49.87	60000.00	t	2026-11-09 15:00:00	\N	0.00
6811c42d-894d-46ef-97f9-034de677c6cd	cmwd0q8uv000p6wtrodthbwxw	cmwd0q8u1000f6wtrinw7wd15	2026-11-11	19:00	20:00	CONFIRMADA	2026-11-09 03:58:49.796	2026-11-12 03:58:49.87	75000.00	\N	\N	\N	0.00
3491fc58-50cf-4fcf-ae5c-a0a35e841ebf	cmwd0q8uv000p6wtrodthbwxw	cmwd0q8u0000d6wtrp3lmvo1c	2026-11-11	21:00	22:00	CONFIRMADA	2026-11-09 03:58:49.796	2026-11-12 03:58:49.87	75000.00	\N	\N	\N	0.00
e06466f1-39e0-4722-9e41-03e59e5984d3	cmwd0q8uv000p6wtrodthbwxw	cmwd0q8ty000b6wtrrp08pzey	2026-11-12	20:00	21:00	CONFIRMADA	2026-11-10 03:58:49.796	2026-11-12 03:58:49.87	75000.00	\N	\N	\N	0.00
657b5550-d41c-4577-be71-e4e351ed0eb2	cmwd0q8uv000p6wtrodthbwxw	cmwd0q8tz000c6wtr6tz994py	2026-11-14	11:00	12:00	CONFIRMADA	2026-11-10 03:58:49.796	2026-11-12 03:58:49.87	60000.00	\N	\N	\N	0.00
118cc149-18dc-4564-9eb3-8f734f80ee0c	cmwd0q8uv000p6wtrodthbwxw	cmwd0q8ty000a6wtrw2paalsv	2026-11-14	23:00	00:00	CONFIRMADA	2026-11-10 03:58:49.796	2026-11-12 03:58:49.87	60000.00	\N	\N	\N	0.00
a14f135e-40a8-42b8-9bdb-5e80a80b3baf	cmwd0q8uv000p6wtrodthbwxw	cmwd0q8tz000c6wtr6tz994py	2026-11-15	20:00	21:00	CONFIRMADA	2026-11-10 03:58:49.797	2026-11-12 03:58:49.87	75000.00	\N	\N	\N	0.00
3eeaaf91-1abc-4a48-b239-dc490403175e	cmwd0q8uv000p6wtrodthbwxw	cmwd0q8u1000f6wtrinw7wd15	2026-11-16	19:00	20:00	CONFIRMADA	2026-11-10 03:58:49.797	2026-11-12 03:58:49.87	75000.00	\N	\N	\N	0.00
688e0de7-79e8-44af-afc6-3015da143970	cmwd0q8uv000p6wtrodthbwxw	cmwd0q8u1000e6wtrtg64uz4y	2026-11-16	20:00	21:00	CONFIRMADA	2026-11-10 03:58:49.797	2026-11-12 03:58:49.87	75000.00	\N	\N	\N	0.00
91eb75e3-4b0a-459a-943c-191b9653cce9	cmwd0q8uz000r6wtrksfuujsq	cmwd0q8ty000b6wtrrp08pzey	2026-11-02	22:00	23:00	CONFIRMADA	2026-10-31 03:58:49.797	2026-11-12 03:58:49.87	110000.00	t	2026-11-03 15:00:00	\N	0.00
52e368de-fb55-4713-9c5a-53fcb9db402c	cmwd0q8uz000r6wtrksfuujsq	cmwd0q8ty000a6wtrw2paalsv	2026-11-04	20:00	21:00	CONFIRMADA	2026-11-02 03:58:49.797	2026-11-12 03:58:49.87	110000.00	t	2026-11-05 15:00:00	\N	0.00
ae0a91d9-7018-4f35-829d-ca580220a25e	cmwd0q8uz000r6wtrksfuujsq	cmwd0q8ty000b6wtrrp08pzey	2026-11-06	17:00	18:00	CONFIRMADA	2026-11-04 03:58:49.797	2026-11-12 03:58:49.87	90000.00	t	2026-11-07 15:00:00	\N	0.00
4cf7acf4-8ee5-4379-9185-c091a6bca153	cmwd0q8uz000r6wtrksfuujsq	cmwd0q8tx00096wtrbtrkh8m6	2026-11-06	20:00	21:00	CONFIRMADA	2026-11-04 03:58:49.797	2026-11-12 03:58:49.87	110000.00	t	2026-11-07 15:00:00	\N	0.00
dc8360aa-0507-417f-b39f-496e9e8b674f	cmwd0q8uz000r6wtrksfuujsq	cmwd0q8u1000f6wtrinw7wd15	2026-11-06	23:00	00:00	CONFIRMADA	2026-11-04 03:58:49.797	2026-11-12 03:58:49.87	90000.00	t	2026-11-07 15:00:00	\N	0.00
ef27060f-002a-40a6-95c8-234a092747da	cmwd0q8uz000r6wtrksfuujsq	cmwd0q8ty000b6wtrrp08pzey	2026-11-09	18:00	19:00	CONFIRMADA	2026-11-07 03:58:49.798	2026-11-12 03:58:49.87	90000.00	t	2026-11-10 15:00:00	\N	0.00
5b0c0a45-8805-428d-ba59-9259115f2226	cmwd0q8uz000r6wtrksfuujsq	cmwd0q8tz000c6wtr6tz994py	2026-11-12	19:00	20:00	CONFIRMADA	2026-11-10 03:58:49.798	2026-11-12 03:58:49.87	110000.00	\N	\N	\N	0.00
665a988b-4f4f-4317-a289-138fa3ab6069	cmwd0q8uz000r6wtrksfuujsq	cmwd0q8tw00086wtrvuzrerpp	2026-11-15	11:00	12:00	CONFIRMADA	2026-11-10 03:58:49.798	2026-11-12 03:58:49.87	90000.00	\N	\N	\N	0.00
1d76ce4d-5045-4ed3-8093-ea5005315e16	cmwd0q8uz000r6wtrksfuujsq	cmwd0q8tz000c6wtr6tz994py	2026-11-15	21:00	22:00	CONFIRMADA	2026-11-10 03:58:49.798	2026-11-12 03:58:49.87	110000.00	\N	\N	\N	0.00
57c923c5-ba2c-45ff-ac40-25105fef8380	cmwd0q8uz000r6wtrksfuujsq	cmwd0q8tz000c6wtr6tz994py	2026-11-16	20:00	21:00	CONFIRMADA	2026-11-10 03:58:49.798	2026-11-12 03:58:49.87	110000.00	\N	\N	\N	0.00
e8a12c46-824d-48ca-a022-dab83bf6ab85	cmwd0q8uz000r6wtrksfuujsq	cmwd0q8u1000e6wtrtg64uz4y	2026-11-17	09:00	10:00	CONFIRMADA	2026-11-10 03:58:49.798	2026-11-12 03:58:49.87	90000.00	\N	\N	\N	0.00
49e6d2a5-fba0-4898-940d-cc74092874bd	cmwd0q8uz000r6wtrksfuujsq	cmwd0q8ty000b6wtrrp08pzey	2026-11-17	20:00	21:00	CANCELADA	2026-11-10 03:58:49.798	2026-11-12 03:58:49.87	110000.00	\N	\N	\N	0.00
7642f196-52e9-407c-bf8e-378516ae7e27	cmwd0q8v6000x6wtrwunc24rj	cmwd0q8u0000d6wtrp3lmvo1c	2026-11-02	19:00	20:00	CANCELADA	2026-10-31 03:58:49.798	2026-11-12 03:58:49.87	75000.00	\N	\N	\N	0.00
aa2a9d45-e54c-4bd1-a410-2d7e1e1bdd50	cmwd0q8v6000x6wtrwunc24rj	cmwd0q8ty000b6wtrrp08pzey	2026-11-03	15:00	16:00	CONFIRMADA	2026-11-01 03:58:49.798	2026-11-12 03:58:49.87	60000.00	t	2026-11-04 15:00:00	\N	0.00
8dffa03f-65ba-4e12-8f08-cea8f692a93b	cmwd0q8v6000x6wtrwunc24rj	cmwd0q8u1000f6wtrinw7wd15	2026-11-04	13:00	14:00	CONFIRMADA	2026-11-02 03:58:49.798	2026-11-12 03:58:49.87	60000.00	t	2026-11-05 15:00:00	\N	0.00
a5ab70d5-7c25-4429-b0c3-1abe7d0078c5	cmwd0q8v6000x6wtrwunc24rj	cmwd0q8u1000f6wtrinw7wd15	2026-11-05	20:00	21:00	CONFIRMADA	2026-11-03 03:58:49.799	2026-11-12 03:58:49.87	75000.00	t	2026-11-06 15:00:00	\N	0.00
5cda2d6f-0c78-49ca-a761-dd6fa87510d9	cmwd0q8v6000x6wtrwunc24rj	cmwd0q8u1000e6wtrtg64uz4y	2026-11-06	21:00	22:00	CONFIRMADA	2026-11-04 03:58:49.799	2026-11-12 03:58:49.87	75000.00	t	2026-11-07 15:00:00	\N	0.00
9cb4db86-1f68-46b5-a19c-a5d32de0391e	cmwd0q8v6000x6wtrwunc24rj	cmwd0q8tw00086wtrvuzrerpp	2026-11-07	22:00	23:00	CONFIRMADA	2026-11-05 03:58:49.799	2026-11-12 03:58:49.87	75000.00	t	2026-11-08 15:00:00	\N	0.00
4b23693b-0652-4bef-be46-e49b99c2cf9a	cmwd0q8v6000x6wtrwunc24rj	cmwd0q8ty000a6wtrw2paalsv	2026-11-10	17:00	18:00	CONFIRMADA	2026-11-08 03:58:49.799	2026-11-12 03:58:49.87	60000.00	\N	\N	\N	0.00
00a69617-e25e-41af-9b88-79bdc01a6e68	cmwd0q8v6000x6wtrwunc24rj	cmwd0q8u1000f6wtrinw7wd15	2026-11-14	21:00	22:00	CONFIRMADA	2026-11-10 03:58:49.799	2026-11-12 03:58:49.87	75000.00	\N	\N	\N	0.00
d99ba721-0418-4437-9237-46d532207ee5	cmwd0q8v6000x6wtrwunc24rj	cmwd0q8tx00096wtrbtrkh8m6	2026-11-15	17:00	18:00	CANCELADA	2026-11-10 03:58:49.799	2026-11-12 03:58:49.87	60000.00	\N	\N	\N	0.00
b237cbb8-b077-40b9-836f-782f5987c00c	cmwd0q8v8000z6wtrlii6iaz8	cmwd0q8tw00086wtrvuzrerpp	2026-11-02	20:00	21:00	CONFIRMADA	2026-10-31 03:58:49.799	2026-11-12 03:58:49.87	75000.00	t	2026-11-03 15:00:00	\N	0.00
50d99716-1620-431f-8301-0a9e075d0001	cmwd0q8v8000z6wtrlii6iaz8	cmwd0q8u1000e6wtrtg64uz4y	2026-11-03	21:00	22:00	CONFIRMADA	2026-11-01 03:58:49.8	2026-11-12 03:58:49.87	75000.00	t	2026-11-04 15:00:00	\N	0.00
aa10212f-401c-4eb7-a20b-397d13277d31	cmwd0q8v8000z6wtrlii6iaz8	cmwd0q8tw00086wtrvuzrerpp	2026-11-06	15:00	16:00	CONFIRMADA	2026-11-04 03:58:49.8	2026-11-12 03:58:49.87	60000.00	t	2026-11-07 15:00:00	\N	0.00
3e5ccb63-e6d1-4a4b-b4f0-a08a4455becd	cmwd0q8v8000z6wtrlii6iaz8	cmwd0q8tv00076wtrtcdgel16	2026-11-06	19:00	20:00	CONFIRMADA	2026-11-04 03:58:49.8	2026-11-12 03:58:49.87	75000.00	f	2026-11-07 15:00:00	\N	0.00
d1b6fba0-d204-4ec9-8cc8-94c96b371f1d	cmwd0q8v8000z6wtrlii6iaz8	cmwd0q8tv00076wtrtcdgel16	2026-11-10	12:00	13:00	CONFIRMADA	2026-11-08 03:58:49.8	2026-11-12 03:58:49.87	60000.00	\N	\N	\N	0.00
99d571fc-8c19-4cef-acb8-40fc8864edeb	cmwd0q8v8000z6wtrlii6iaz8	cmwd0q8ty000a6wtrw2paalsv	2026-11-11	22:00	23:00	CONFIRMADA	2026-11-09 03:58:49.8	2026-11-12 03:58:49.87	75000.00	\N	\N	\N	0.00
40657ac4-94e5-4b0e-af5b-4108faef8120	cmwd0q8v8000z6wtrlii6iaz8	cmwd0q8tz000c6wtr6tz994py	2026-11-12	21:00	22:00	CONFIRMADA	2026-11-10 03:58:49.8	2026-11-12 03:58:49.87	75000.00	\N	\N	\N	0.00
902de485-14ec-4ed5-9682-703000cf180c	cmwd0q8v8000z6wtrlii6iaz8	cmwd0q8u1000e6wtrtg64uz4y	2026-11-12	23:00	00:00	CONFIRMADA	2026-11-10 03:58:49.8	2026-11-12 03:58:49.87	60000.00	\N	\N	\N	0.00
85f79c5a-970a-4006-9743-80d77e582445	cmwd0q8v8000z6wtrlii6iaz8	cmwd0q8u1000f6wtrinw7wd15	2026-11-13	22:00	23:00	CANCELADA	2026-11-10 03:58:49.8	2026-11-12 03:58:49.87	75000.00	\N	\N	\N	0.00
2ad9a81b-537f-4c6e-ae59-02b931cab861	cmwd0q8v8000z6wtrlii6iaz8	cmwd0q8ty000a6wtrw2paalsv	2026-11-14	20:00	21:00	CONFIRMADA	2026-11-10 03:58:49.801	2026-11-12 03:58:49.87	75000.00	\N	\N	\N	0.00
0a3f034a-6b10-4b21-b1e9-e043c34ee64d	cmwd0q8v8000z6wtrlii6iaz8	cmwd0q8tv00076wtrtcdgel16	2026-11-16	20:00	21:00	CONFIRMADA	2026-11-10 03:58:49.801	2026-11-12 03:58:49.87	75000.00	\N	\N	\N	0.00
9efaa3f0-e5b1-4a2e-8608-d41092a1985c	cmwd0q8v8000z6wtrlii6iaz8	cmwd0q8u0000d6wtrp3lmvo1c	2026-11-16	23:00	00:00	CONFIRMADA	2026-11-10 03:58:49.801	2026-11-12 03:58:49.87	60000.00	\N	\N	\N	0.00
de18b8f2-27b7-481a-b9ba-c7a9af03d421	cmwd0q8v8000z6wtrlii6iaz8	cmwd0q8tv00076wtrtcdgel16	2026-11-17	22:00	23:00	CONFIRMADA	2026-11-10 03:58:49.801	2026-11-12 03:58:49.87	75000.00	\N	\N	\N	0.00
d5a6a5a9-3bea-422c-9535-b84b0582daff	cmwd0q8ve00116wtrnkk6pn7v	cmwd0q8tx00096wtrbtrkh8m6	2026-11-03	23:00	00:00	CONFIRMADA	2026-11-01 03:58:49.801	2026-11-12 03:58:49.87	26666.67	t	2026-11-04 15:00:00	\N	0.00
f518fb1e-9bbd-45fe-8ca4-77feb84171d6	cmwd0q8ve00116wtrnkk6pn7v	cmwd0q8tw00086wtrvuzrerpp	2026-11-07	21:30	23:00	CONFIRMADA	2026-11-05 03:58:49.801	2026-11-12 03:58:49.87	48000.00	t	2026-11-08 15:00:00	\N	0.00
6b1cdbcb-6396-4129-be73-623146aaa56e	cmwd0q8ve00116wtrnkk6pn7v	cmwd0q8u1000e6wtrtg64uz4y	2026-11-10	21:30	23:00	CONFIRMADA	2026-11-08 03:58:49.802	2026-11-12 03:58:49.87	48000.00	\N	\N	\N	0.00
119cbb04-4745-4a3a-b3e6-2353a5856dd1	cmwd0q8ve00116wtrnkk6pn7v	cmwd0q8u1000e6wtrtg64uz4y	2026-11-11	23:00	00:00	CONFIRMADA	2026-11-09 03:58:49.802	2026-11-12 03:58:49.87	26666.67	\N	\N	\N	0.00
663cae20-a934-43b5-91a1-fd13b2fe266a	cmwd0q8ve00116wtrnkk6pn7v	cmwd0q8u0000d6wtrp3lmvo1c	2026-11-13	20:00	21:30	CONFIRMADA	2026-11-10 03:58:49.802	2026-11-12 03:58:49.87	48000.00	\N	\N	\N	0.00
1a5bd364-80f9-4a53-9931-a47075d5fa72	cmwd0q8vl00166wtrfa17q45h	cmwd0q8ty000a6wtrw2paalsv	2026-11-02	21:00	22:00	CONFIRMADA	2026-10-31 03:58:49.802	2026-11-12 03:58:49.87	75000.00	t	2026-11-03 15:00:00	\N	0.00
9f88f909-889f-4480-8730-e7c82216d993	cmwd0q8vl00166wtrfa17q45h	cmwd0q8tv00076wtrtcdgel16	2026-11-02	22:00	23:00	CONFIRMADA	2026-10-31 03:58:49.802	2026-11-12 03:58:49.87	75000.00	t	2026-11-03 15:00:00	\N	0.00
c50dd11c-09a5-4072-9a69-eb31593d2639	cmwd0q8vl00166wtrfa17q45h	cmwd0q8ty000a6wtrw2paalsv	2026-11-04	10:00	11:00	CONFIRMADA	2026-11-02 03:58:49.802	2026-11-12 03:58:49.87	60000.00	t	2026-11-05 15:00:00	\N	0.00
dcc375f4-e106-4007-9808-539ad672889b	cmwd0q8vl00166wtrfa17q45h	cmwd0q8u1000e6wtrtg64uz4y	2026-11-04	12:00	13:00	CONFIRMADA	2026-11-02 03:58:49.803	2026-11-12 03:58:49.87	60000.00	t	2026-11-05 15:00:00	\N	0.00
8670c2b6-5a96-426e-8db2-763e1f4d2285	cmwd0q8vl00166wtrfa17q45h	cmwd0q8tv00076wtrtcdgel16	2026-11-06	15:00	16:00	CONFIRMADA	2026-11-04 03:58:49.803	2026-11-12 03:58:49.87	60000.00	t	2026-11-07 15:00:00	\N	0.00
491c016a-8778-49d8-840f-01d23917c042	cmwd0q8vl00166wtrfa17q45h	cmwd0q8tv00076wtrtcdgel16	2026-11-06	20:00	21:00	CONFIRMADA	2026-11-04 03:58:49.803	2026-11-12 03:58:49.87	75000.00	t	2026-11-07 15:00:00	\N	0.00
9279937f-a608-44fa-892e-841bb841646c	cmwd0q8vl00166wtrfa17q45h	cmwd0q8u1000e6wtrtg64uz4y	2026-11-07	22:00	23:00	CONFIRMADA	2026-11-05 03:58:49.803	2026-11-12 03:58:49.87	75000.00	t	2026-11-08 15:00:00	\N	0.00
d24efc7c-e11c-40ae-8a43-0c142e1cdd2d	cmwd0q8vl00166wtrfa17q45h	cmwd0q8u1000f6wtrinw7wd15	2026-11-08	20:00	21:00	CONFIRMADA	2026-11-06 03:58:49.803	2026-11-12 03:58:49.87	75000.00	t	2026-11-09 15:00:00	\N	0.00
22635751-e056-49c0-a4e2-d6698f640cf2	cmwd0q8vl00166wtrfa17q45h	cmwd0q8ty000a6wtrw2paalsv	2026-11-10	14:00	15:00	CONFIRMADA	2026-11-08 03:58:49.803	2026-11-12 03:58:49.87	60000.00	\N	\N	\N	0.00
be3eea98-c24c-4347-bc48-7568657baeb3	cmwd0q8vl00166wtrfa17q45h	cmwd0q8tw00086wtrvuzrerpp	2026-11-10	19:00	20:00	CONFIRMADA	2026-11-08 03:58:49.803	2026-11-12 03:58:49.87	75000.00	\N	\N	\N	0.00
8f050b8c-d5b6-4c33-b983-583db5723217	cmwd0q8vl00166wtrfa17q45h	cmwd0q8tv00076wtrtcdgel16	2026-11-13	18:00	19:00	CONFIRMADA	2026-11-10 03:58:49.804	2026-11-12 03:58:49.87	60000.00	\N	\N	\N	0.00
0a26b810-12ec-4b95-a34f-b943dcd0b2ea	cmwd0q8vl00166wtrfa17q45h	cmwd0q8tv00076wtrtcdgel16	2026-11-13	22:00	23:00	CONFIRMADA	2026-11-10 03:58:49.804	2026-11-12 03:58:49.87	75000.00	\N	\N	\N	0.00
64f17dc2-8abe-40ea-b43f-617683e8da3f	cmwd0q8vl00166wtrfa17q45h	cmwd0q8tv00076wtrtcdgel16	2026-11-14	22:00	23:00	CONFIRMADA	2026-11-10 03:58:49.804	2026-11-12 03:58:49.87	75000.00	\N	\N	\N	0.00
a06ff965-80e6-4749-bd02-78c030811c77	cmwd0q8vl00166wtrfa17q45h	cmwd0q8tw00086wtrvuzrerpp	2026-11-15	23:00	00:00	CONFIRMADA	2026-11-10 03:58:49.804	2026-11-12 03:58:49.87	60000.00	\N	\N	\N	0.00
a5d81221-3ce7-46b2-a223-f4bec8a75782	cmwd0q8vl00166wtrfa17q45h	cmwd0q8ty000b6wtrrp08pzey	2026-11-16	23:00	00:00	CONFIRMADA	2026-11-10 03:58:49.804	2026-11-12 03:58:49.87	60000.00	\N	\N	\N	0.00
79895159-2f94-407f-b842-55c7c81bba0c	cmwd0q8vn00186wtr8d10h0hz	cmwd0q8ty000a6wtrw2paalsv	2026-11-02	19:00	20:00	CONFIRMADA	2026-10-31 03:58:49.804	2026-11-12 03:58:49.87	75000.00	t	2026-11-03 15:00:00	\N	0.00
d5383f9d-7a77-48b1-8cfe-db4ddc7a2153	cmwd0q8vn00186wtr8d10h0hz	cmwd0q8tz000c6wtr6tz994py	2026-11-02	22:00	23:00	CONFIRMADA	2026-10-31 03:58:49.804	2026-11-12 03:58:49.87	75000.00	t	2026-11-03 15:00:00	\N	0.00
6207bcf6-c1bb-4b30-9f01-c0cabc7d69ff	cmwd0q8vn00186wtr8d10h0hz	cmwd0q8tz000c6wtr6tz994py	2026-11-03	10:00	11:00	CONFIRMADA	2026-11-01 03:58:49.804	2026-11-12 03:58:49.87	60000.00	t	2026-11-04 15:00:00	\N	0.00
8aafe762-797b-46bc-acb2-ad5666d5fc4f	cmwd0q8vn00186wtr8d10h0hz	cmwd0q8u1000e6wtrtg64uz4y	2026-11-04	22:00	23:00	CONFIRMADA	2026-11-02 03:58:49.804	2026-11-12 03:58:49.87	75000.00	t	2026-11-05 15:00:00	\N	0.00
a82da413-a0d4-47b4-a122-52b609445a9c	cmwd0q8vn00186wtr8d10h0hz	cmwd0q8tz000c6wtr6tz994py	2026-11-08	23:00	00:00	CONFIRMADA	2026-11-06 03:58:49.805	2026-11-12 03:58:49.87	60000.00	t	2026-11-09 15:00:00	\N	0.00
89653c9d-e038-49e9-8f27-401f2393b587	cmwd0q8vn00186wtr8d10h0hz	cmwd0q8tx00096wtrbtrkh8m6	2026-11-09	20:00	21:00	CONFIRMADA	2026-11-07 03:58:49.805	2026-11-12 03:58:49.87	75000.00	t	2026-11-10 15:00:00	\N	0.00
c0957fa1-bf08-4aed-ad2d-704c6dd92e8d	cmwd0q8vn00186wtr8d10h0hz	cmwd0q8tz000c6wtr6tz994py	2026-11-09	22:00	23:00	CONFIRMADA	2026-11-07 03:58:49.805	2026-11-12 03:58:49.87	75000.00	t	2026-11-10 15:00:00	\N	0.00
d824b784-6e1a-4a69-8ab6-270cc8059f83	cmwd0q8vn00186wtr8d10h0hz	cmwd0q8tw00086wtrvuzrerpp	2026-11-11	13:00	14:00	CONFIRMADA	2026-11-09 03:58:49.805	2026-11-12 03:58:49.87	60000.00	\N	\N	\N	0.00
b4167986-44fe-4c05-b906-8e729e7b3a4d	cmwd0q8vn00186wtr8d10h0hz	cmwd0q8ty000b6wtrrp08pzey	2026-11-12	19:00	20:00	CONFIRMADA	2026-11-10 03:58:49.805	2026-11-12 03:58:49.87	75000.00	\N	\N	\N	0.00
e05ea32e-09d4-4b61-885c-a187a836a6c8	cmwd0q8vn00186wtr8d10h0hz	cmwd0q8tv00076wtrtcdgel16	2026-11-13	09:00	10:00	CONFIRMADA	2026-11-10 03:58:49.805	2026-11-12 03:58:49.87	60000.00	\N	\N	\N	0.00
f4d816b6-ac06-4011-8c02-75af95a10be0	cmwd0q8vn00186wtr8d10h0hz	cmwd0q8tv00076wtrtcdgel16	2026-11-14	23:00	00:00	CONFIRMADA	2026-11-10 03:58:49.805	2026-11-12 03:58:49.87	60000.00	\N	\N	\N	0.00
24bc0c1c-87a9-4209-b944-c7eac7dcc370	cmwd0q8vn00186wtr8d10h0hz	cmwd0q8tv00076wtrtcdgel16	2026-11-16	19:00	20:00	CONFIRMADA	2026-11-10 03:58:49.805	2026-11-12 03:58:49.87	75000.00	\N	\N	\N	0.00
cd593521-0513-4df6-9a0d-7ae8196e8b44	cmwd0q8vn00186wtr8d10h0hz	cmwd0q8u1000f6wtrinw7wd15	2026-11-17	23:00	00:00	CONFIRMADA	2026-11-10 03:58:49.805	2026-11-12 03:58:49.87	60000.00	\N	\N	\N	0.00
aa7cf685-3f83-4b06-8d67-bbb5685f25a3	cmwd0q8vw001g6wtr55w4qv65	cmwd0q8tv00076wtrtcdgel16	2026-11-03	10:00	11:30	CONFIRMADA	2026-11-01 03:58:49.806	2026-11-12 03:58:49.87	180000.00	t	2026-11-04 15:00:00	\N	0.00
434683cb-840b-4372-b93e-4a1db45af6c9	cmwd0q8vw001g6wtr55w4qv65	cmwd0q8u1000f6wtrinw7wd15	2026-11-08	19:00	20:30	CONFIRMADA	2026-11-06 03:58:49.806	2026-11-12 03:58:49.87	180000.00	t	2026-11-09 15:00:00	\N	0.00
3b2bf1e3-7a76-4e5f-8b11-b5682a132512	cmwd0q8vw001g6wtr55w4qv65	cmwd0q8u0000d6wtrp3lmvo1c	2026-11-08	20:30	22:00	CONFIRMADA	2026-11-06 03:58:49.806	2026-11-12 03:58:49.87	180000.00	t	2026-11-09 15:00:00	\N	0.00
b1ec0b03-b905-4984-aeb3-46bba91fadf5	cmwd0q8vw001g6wtr55w4qv65	cmwd0q8tx00096wtrbtrkh8m6	2026-11-17	20:30	22:00	CONFIRMADA	2026-11-10 03:58:49.806	2026-11-12 03:58:49.87	180000.00	\N	\N	\N	0.00
91a91ace-c1f8-47d2-8422-f72920281c02	cmwd0q8vy001h6wtrib7iyess	cmwd0q8tv00076wtrtcdgel16	2026-11-02	19:00	20:00	CONFIRMADA	2026-10-31 03:58:49.807	2026-11-12 03:58:49.87	110000.00	t	2026-11-03 15:00:00	\N	0.00
c25b1e16-9e7d-4b36-bcf5-3cb9d7ea4cc5	cmwd0q8vy001h6wtrib7iyess	cmwd0q8u0000d6wtrp3lmvo1c	2026-11-02	20:00	21:00	CONFIRMADA	2026-10-31 03:58:49.807	2026-11-12 03:58:49.87	110000.00	t	2026-11-03 15:00:00	\N	0.00
4b8157ed-8337-4b99-9c35-39ffd0cd86a0	cmwd0q8vy001h6wtrib7iyess	cmwd0q8tz000c6wtr6tz994py	2026-11-04	23:00	00:00	CONFIRMADA	2026-11-02 03:58:49.807	2026-11-12 03:58:49.87	90000.00	t	2026-11-05 15:00:00	\N	0.00
2b86af4b-26dc-466e-9ef5-c999d6aba1e8	cmwd0q8vy001h6wtrib7iyess	cmwd0q8tz000c6wtr6tz994py	2026-11-06	20:00	21:00	CONFIRMADA	2026-11-04 03:58:49.807	2026-11-12 03:58:49.87	110000.00	t	2026-11-07 15:00:00	\N	0.00
e1a53958-6f0a-46fa-af3f-18b258639c80	cmwd0q8vy001h6wtrib7iyess	cmwd0q8u1000f6wtrinw7wd15	2026-11-09	23:00	00:00	CONFIRMADA	2026-11-07 03:58:49.807	2026-11-12 03:58:49.87	90000.00	t	2026-11-10 15:00:00	\N	0.00
d6ac1d15-4cd0-42a8-a339-d71e8bc75cb0	cmwd0q8vy001h6wtrib7iyess	cmwd0q8tw00086wtrvuzrerpp	2026-11-10	14:00	15:00	CONFIRMADA	2026-11-08 03:58:49.807	2026-11-12 03:58:49.87	90000.00	\N	\N	\N	0.00
3b5cdc0b-cea4-4d3a-a373-5d3d8d761b5e	cmwd0q8vy001h6wtrib7iyess	cmwd0q8ty000b6wtrrp08pzey	2026-11-10	21:00	22:00	CONFIRMADA	2026-11-08 03:58:49.807	2026-11-12 03:58:49.87	110000.00	\N	\N	\N	0.00
cc88c7c4-ac11-495e-9d14-1cf0ea58cebe	cmwd0q8vy001h6wtrib7iyess	cmwd0q8u1000e6wtrtg64uz4y	2026-11-11	16:00	17:00	CONFIRMADA	2026-11-09 03:58:49.808	2026-11-12 03:58:49.87	90000.00	\N	\N	\N	0.00
a6e6145e-db77-409e-a1de-207e2caa6102	cmwd0q8vy001h6wtrib7iyess	cmwd0q8u0000d6wtrp3lmvo1c	2026-11-12	14:00	15:00	CONFIRMADA	2026-11-10 03:58:49.808	2026-11-12 03:58:49.87	90000.00	\N	\N	\N	0.00
8db614d9-66c5-428b-9030-8768b3e64338	cmwd0q8vy001h6wtrib7iyess	cmwd0q8u0000d6wtrp3lmvo1c	2026-11-15	23:00	00:00	CONFIRMADA	2026-11-10 03:58:49.808	2026-11-12 03:58:49.87	90000.00	\N	\N	\N	0.00
8d8747c6-d818-457b-9a8a-001073e6dd3d	cmwd0q8vy001h6wtrib7iyess	cmwd0q8ty000a6wtrw2paalsv	2026-11-16	23:00	00:00	CONFIRMADA	2026-11-10 03:58:49.808	2026-11-12 03:58:49.87	90000.00	\N	\N	\N	0.00
4ebbe842-b43f-46ec-9c61-098faae492c5	cmwd0q8vy001h6wtrib7iyess	cmwd0q8tz000c6wtr6tz994py	2026-11-17	20:00	21:00	CONFIRMADA	2026-11-10 03:58:49.808	2026-11-12 03:58:49.87	110000.00	\N	\N	\N	0.00
3136b9d2-d246-4c15-ab09-b76b66ec4432	cmwd0q8vy001h6wtrib7iyess	cmwd0q8tx00096wtrbtrkh8m6	2026-11-17	23:00	00:00	CONFIRMADA	2026-11-10 03:58:49.808	2026-11-12 03:58:49.87	90000.00	\N	\N	\N	0.00
28737c15-65a8-4a9e-920b-6e51a67a5d89	cmwd0q8w1001j6wtrk8im4y9o	cmwd0q8tv00076wtrtcdgel16	2026-11-04	19:00	20:00	CONFIRMADA	2026-11-02 03:58:49.808	2026-11-12 03:58:49.87	30000.00	t	2026-11-05 15:00:00	\N	0.00
48aab7f2-e856-4704-824f-1c7cff9d95e6	cmwd0q8w1001j6wtrk8im4y9o	cmwd0q8u0000d6wtrp3lmvo1c	2026-11-06	19:00	20:00	CONFIRMADA	2026-11-04 03:58:49.808	2026-11-12 03:58:49.87	30000.00	t	2026-11-07 15:00:00	\N	0.00
f9868ab3-1c83-463f-906e-3d5d55402bd2	cmwd0q8w1001j6wtrk8im4y9o	cmwd0q8u1000e6wtrtg64uz4y	2026-11-06	20:00	21:00	CONFIRMADA	2026-11-04 03:58:49.809	2026-11-12 03:58:49.87	30000.00	t	2026-11-07 15:00:00	\N	0.00
a422a941-111b-405a-a206-99c17fd75ffd	cmwd0q8w1001j6wtrk8im4y9o	cmwd0q8tx00096wtrbtrkh8m6	2026-11-07	15:00	16:00	CANCELADA	2026-11-05 03:58:49.809	2026-11-12 03:58:49.87	36000.00	\N	\N	\N	0.00
67af8869-33c3-4c96-9b4b-1837cbc82d21	cmwd0q8w1001j6wtrk8im4y9o	cmwd0q8tv00076wtrtcdgel16	2026-11-08	14:00	15:00	CONFIRMADA	2026-11-06 03:58:49.809	2026-11-12 03:58:49.87	36000.00	t	2026-11-09 15:00:00	\N	0.00
2cd45d32-3a3c-427a-96dd-43ac92786f92	cmwd0q8w1001j6wtrk8im4y9o	cmwd0q8tv00076wtrtcdgel16	2026-11-08	19:00	20:00	CANCELADA	2026-11-06 03:58:49.809	2026-11-12 03:58:49.87	36000.00	\N	\N	\N	0.00
356c509a-df24-4f78-afea-6acbe38b5255	cmwd0q8w1001j6wtrk8im4y9o	cmwd0q8ty000a6wtrw2paalsv	2026-11-08	20:00	21:00	CONFIRMADA	2026-11-06 03:58:49.809	2026-11-12 03:58:49.87	36000.00	t	2026-11-09 15:00:00	\N	0.00
19d9e072-f83c-411e-b521-a4d625d11683	cmwd0q8w1001j6wtrk8im4y9o	cmwd0q8u1000f6wtrinw7wd15	2026-11-09	21:00	22:00	CONFIRMADA	2026-11-07 03:58:49.809	2026-11-12 03:58:49.87	30000.00	t	2026-11-10 15:00:00	\N	0.00
a3b84ff7-f21b-4d65-9d8b-abe4754fa54e	cmwd0q8w1001j6wtrk8im4y9o	cmwd0q8tv00076wtrtcdgel16	2026-11-11	19:00	20:00	CONFIRMADA	2026-11-09 03:58:49.809	2026-11-12 03:58:49.87	30000.00	\N	\N	\N	0.00
bedb6e59-e96e-4fce-927b-69d73b042f7f	cmwd0q8w1001j6wtrk8im4y9o	cmwd0q8tv00076wtrtcdgel16	2026-11-13	17:00	18:00	CONFIRMADA	2026-11-10 03:58:49.809	2026-11-12 03:58:49.87	30000.00	\N	\N	\N	0.00
918c20b4-349e-481a-829c-a7447300c9ae	cmwd0q8w1001j6wtrk8im4y9o	cmwd0q8u1000e6wtrtg64uz4y	2026-11-13	20:00	21:00	CONFIRMADA	2026-11-10 03:58:49.809	2026-11-12 03:58:49.87	30000.00	\N	\N	\N	0.00
7e954a73-a55d-4c9e-bf52-5b1d7a98a46c	cmwd0q8w3001m6wtrzgk1eqtz	cmwd0q8tw00086wtrvuzrerpp	2026-11-04	19:00	20:00	CONFIRMADA	2026-11-02 03:58:49.81	2026-11-12 03:58:49.87	30000.00	t	2026-11-05 15:00:00	\N	0.00
cc04e5fc-3529-46b6-8f39-ff9873321f87	cmwd0q8w3001m6wtrzgk1eqtz	cmwd0q8tv00076wtrtcdgel16	2026-11-04	20:00	21:00	CANCELADA	2026-11-02 03:58:49.81	2026-11-12 03:58:49.87	30000.00	\N	\N	\N	0.00
8912fd0f-7cc3-4104-ad74-6ffa31de6fd4	cmwd0q8w3001m6wtrzgk1eqtz	cmwd0q8ty000b6wtrrp08pzey	2026-11-05	19:00	20:00	CONFIRMADA	2026-11-03 03:58:49.81	2026-11-12 03:58:49.87	30000.00	t	2026-11-06 15:00:00	\N	0.00
de1d7205-ef19-46b7-9918-d23ea3ecb3ac	cmwd0q8w3001m6wtrzgk1eqtz	cmwd0q8tv00076wtrtcdgel16	2026-11-08	21:00	22:00	CONFIRMADA	2026-11-06 03:58:49.81	2026-11-12 03:58:49.87	36000.00	t	2026-11-09 15:00:00	\N	0.00
9340d299-9136-4fa1-91ee-f05681ecdcb6	cmwd0q8w3001m6wtrzgk1eqtz	cmwd0q8u1000e6wtrtg64uz4y	2026-11-10	13:00	14:00	CONFIRMADA	2026-11-08 03:58:49.81	2026-11-12 03:58:49.87	30000.00	\N	\N	\N	0.00
9366a64a-81f7-4412-8d06-2717a503c8c0	cmwd0q8w3001m6wtrzgk1eqtz	cmwd0q8tw00086wtrvuzrerpp	2026-11-10	16:00	17:00	CONFIRMADA	2026-11-08 03:58:49.81	2026-11-12 03:58:49.87	30000.00	\N	\N	\N	0.00
297d5c4f-6c2b-4b2f-9656-7c63c689b83e	cmwd0q8w3001m6wtrzgk1eqtz	cmwd0q8tv00076wtrtcdgel16	2026-11-10	21:00	22:00	CONFIRMADA	2026-11-08 03:58:49.81	2026-11-12 03:58:49.87	30000.00	\N	\N	\N	0.00
cca05c6b-5054-4a47-aff0-13c90e468f5d	cmwd0q8w3001m6wtrzgk1eqtz	cmwd0q8ty000a6wtrw2paalsv	2026-11-12	21:00	22:00	CONFIRMADA	2026-11-10 03:58:49.811	2026-11-12 03:58:49.87	30000.00	\N	\N	\N	0.00
8275f621-6138-4bc8-9c38-2c4ec1bfe8f9	cmwd0q8w3001m6wtrzgk1eqtz	cmwd0q8tv00076wtrtcdgel16	2026-11-14	21:00	22:00	CONFIRMADA	2026-11-10 03:58:49.811	2026-11-12 03:58:49.87	36000.00	\N	\N	\N	0.00
305d901b-5d89-4760-93ee-c7c75e0c2d1b	cmwd0q8w3001m6wtrzgk1eqtz	cmwd0q8u1000f6wtrinw7wd15	2026-11-15	13:00	14:00	CONFIRMADA	2026-11-10 03:58:49.811	2026-11-12 03:58:49.87	36000.00	\N	\N	\N	0.00
342ca318-7903-4a46-a065-c5736ee65d21	cmwd0q8w3001m6wtrzgk1eqtz	cmwd0q8tv00076wtrtcdgel16	2026-11-17	19:00	20:00	CONFIRMADA	2026-11-10 03:58:49.811	2026-11-12 03:58:49.87	30000.00	\N	\N	\N	0.00
e31215c9-176f-4d7b-aa72-d55032b76a96	cmwd0q8w3001m6wtrzgk1eqtz	cmwd0q8u0000d6wtrp3lmvo1c	2026-11-17	20:00	21:00	CANCELADA	2026-11-10 03:58:49.811	2026-11-12 03:58:49.87	30000.00	\N	\N	\N	0.00
e42fd76c-b16a-4405-ae3f-61a6b373590e	cmwd0q8w6001p6wtrz9e0n0o4	cmwd0q8tw00086wtrvuzrerpp	2026-11-02	21:00	22:00	CONFIRMADA	2026-10-31 03:58:49.811	2026-11-12 03:58:49.87	38000.00	t	2026-11-03 15:00:00	\N	0.00
aefa855b-ef79-4404-ad7f-b3663a61f649	cmwd0q8w6001p6wtrz9e0n0o4	cmwd0q8ty000a6wtrw2paalsv	2026-11-03	21:00	22:00	CONFIRMADA	2026-11-01 03:58:49.811	2026-11-12 03:58:49.87	38000.00	t	2026-11-04 15:00:00	\N	0.00
4221ecbe-b926-4cee-8eff-c249426b9474	cmwd0q8w6001p6wtrz9e0n0o4	cmwd0q8tx00096wtrbtrkh8m6	2026-11-05	15:00	16:00	CANCELADA	2026-11-03 03:58:49.811	2026-11-12 03:58:49.87	38000.00	\N	\N	\N	0.00
49870353-10f7-455c-b524-6cc4fc2055aa	cmwd0q8w6001p6wtrz9e0n0o4	cmwd0q8u1000f6wtrinw7wd15	2026-11-06	19:00	20:00	CONFIRMADA	2026-11-04 03:58:49.812	2026-11-12 03:58:49.87	38000.00	t	2026-11-07 15:00:00	\N	0.00
ab0055e4-bbef-46fb-866a-fbb2a5a0e861	cmwd0q8w6001p6wtrz9e0n0o4	cmwd0q8u1000f6wtrinw7wd15	2026-11-09	11:00	12:00	CONFIRMADA	2026-11-07 03:58:49.812	2026-11-12 03:58:49.87	38000.00	t	2026-11-10 15:00:00	\N	0.00
b0688832-0249-4229-8006-c861c6336f49	cmwd0q8w6001p6wtrz9e0n0o4	cmwd0q8u1000e6wtrtg64uz4y	2026-11-09	12:00	13:00	CONFIRMADA	2026-11-07 03:58:49.812	2026-11-12 03:58:49.87	38000.00	t	2026-11-10 15:00:00	\N	0.00
c42b5fec-4381-43cc-8b4f-f289f48451db	cmwd0q8w6001p6wtrz9e0n0o4	cmwd0q8tz000c6wtr6tz994py	2026-11-09	19:00	20:00	CONFIRMADA	2026-11-07 03:58:49.812	2026-11-12 03:58:49.87	38000.00	t	2026-11-10 15:00:00	\N	0.00
c11010ea-5b43-4ac4-b7f7-d5a627155ec7	cmwd0q8w6001p6wtrz9e0n0o4	cmwd0q8ty000b6wtrrp08pzey	2026-11-09	20:00	21:00	CANCELADA	2026-11-07 03:58:49.812	2026-11-12 03:58:49.87	38000.00	\N	\N	\N	0.00
9ef48594-670f-4db6-9216-66fdee8a7919	cmwd0q8w6001p6wtrz9e0n0o4	cmwd0q8tw00086wtrvuzrerpp	2026-11-12	19:00	20:00	CONFIRMADA	2026-11-10 03:58:49.812	2026-11-12 03:58:49.87	38000.00	\N	\N	\N	0.00
7df16381-8006-4a2a-89c6-c25ebfbe7c95	cmwd0q8w6001p6wtrz9e0n0o4	cmwd0q8u1000f6wtrinw7wd15	2026-11-13	21:00	22:00	CONFIRMADA	2026-11-10 03:58:49.812	2026-11-12 03:58:49.87	38000.00	\N	\N	\N	0.00
bdc94a33-f51d-4a6e-b902-79327c82b404	cmwd0q8w6001p6wtrz9e0n0o4	cmwd0q8tw00086wtrvuzrerpp	2026-11-14	21:00	22:00	CONFIRMADA	2026-11-10 03:58:49.812	2026-11-12 03:58:49.87	36000.00	\N	\N	\N	0.00
62da145c-2567-4bd6-93bc-4adb7f6f8f81	cmwd0q8w6001p6wtrz9e0n0o4	cmwd0q8ty000a6wtrw2paalsv	2026-11-16	15:00	16:00	CONFIRMADA	2026-11-10 03:58:49.812	2026-11-12 03:58:49.87	38000.00	\N	\N	\N	0.00
adb4d90d-ecb4-441c-8df6-999b59a98b53	cmwd0q8w6001p6wtrz9e0n0o4	cmwd0q8tz000c6wtr6tz994py	2026-11-16	19:00	20:00	CONFIRMADA	2026-11-10 03:58:49.812	2026-11-12 03:58:49.87	38000.00	\N	\N	\N	0.00
a810321c-dfeb-4974-bba3-3424f7127a39	cmwd0q8wb001v6wtrk5pgsyb0	cmwd0q8tv00076wtrtcdgel16	2026-11-02	20:00	21:00	CANCELADA	2026-10-31 03:58:49.813	2026-11-12 03:58:49.87	75000.00	\N	\N	\N	0.00
09dde170-85b9-4c4f-8bef-cf3a79affd45	cmwd0q8wb001v6wtrk5pgsyb0	cmwd0q8tz000c6wtr6tz994py	2026-11-02	23:00	00:00	CONFIRMADA	2026-10-31 03:58:49.813	2026-11-12 03:58:49.87	60000.00	t	2026-11-03 15:00:00	\N	0.00
6078d70f-fde6-4bed-95b8-a210d7ee23d7	cmwd0q8wb001v6wtrk5pgsyb0	cmwd0q8tx00096wtrbtrkh8m6	2026-11-03	21:00	22:00	CONFIRMADA	2026-11-01 03:58:49.813	2026-11-12 03:58:49.87	75000.00	t	2026-11-04 15:00:00	\N	0.00
258f23a4-be72-4982-96b7-e46d9dc6792c	cmwd0q8wb001v6wtrk5pgsyb0	cmwd0q8tz000c6wtr6tz994py	2026-11-05	19:00	20:00	CONFIRMADA	2026-11-03 03:58:49.813	2026-11-12 03:58:49.87	75000.00	t	2026-11-06 15:00:00	\N	0.00
9d6bb64d-d9c1-48df-b08b-3fe3ac02e640	cmwd0q8wb001v6wtrk5pgsyb0	cmwd0q8u0000d6wtrp3lmvo1c	2026-11-05	21:00	22:00	CONFIRMADA	2026-11-03 03:58:49.813	2026-11-12 03:58:49.87	75000.00	t	2026-11-06 15:00:00	\N	0.00
483f29ee-d9f1-41c8-bdac-acd3eab019ea	cmwd0q8wb001v6wtrk5pgsyb0	cmwd0q8tw00086wtrvuzrerpp	2026-11-06	13:00	14:00	CONFIRMADA	2026-11-04 03:58:49.813	2026-11-12 03:58:49.87	60000.00	t	2026-11-07 15:00:00	\N	0.00
3102bd57-1c67-45de-aaf4-3e6b74aec089	cmwd0q8wb001v6wtrk5pgsyb0	cmwd0q8u1000e6wtrtg64uz4y	2026-11-07	13:00	14:00	CONFIRMADA	2026-11-05 03:58:49.813	2026-11-12 03:58:49.87	60000.00	t	2026-11-08 15:00:00	\N	0.00
4964fd8e-5cbc-4daf-ab2b-e324d43d96b7	cmwd0q8wb001v6wtrk5pgsyb0	cmwd0q8tw00086wtrvuzrerpp	2026-11-07	19:00	20:00	CONFIRMADA	2026-11-05 03:58:49.814	2026-11-12 03:58:49.87	75000.00	t	2026-11-08 15:00:00	\N	0.00
dd4dda01-4060-42af-ab75-14b040181c0b	cmwd0q8wb001v6wtrk5pgsyb0	cmwd0q8u1000f6wtrinw7wd15	2026-11-07	22:00	23:00	CONFIRMADA	2026-11-05 03:58:49.814	2026-11-12 03:58:49.87	75000.00	t	2026-11-08 15:00:00	\N	0.00
cbb0c153-52bd-4896-b4c8-b6d18ec22088	cmwd0q8wb001v6wtrk5pgsyb0	cmwd0q8ty000a6wtrw2paalsv	2026-11-08	19:00	20:00	CANCELADA	2026-11-06 03:58:49.814	2026-11-12 03:58:49.87	75000.00	\N	\N	\N	0.00
d52605ef-55d6-4b3f-9c75-7301f9a2f20e	cmwd0q8wb001v6wtrk5pgsyb0	cmwd0q8ty000a6wtrw2paalsv	2026-11-15	23:00	00:00	CANCELADA	2026-11-10 03:58:49.814	2026-11-12 03:58:49.87	60000.00	\N	\N	\N	0.00
601e624b-7844-459f-98e9-25bec3693fa9	cmwd0q8wb001v6wtrk5pgsyb0	cmwd0q8u0000d6wtrp3lmvo1c	2026-11-16	22:00	23:00	CONFIRMADA	2026-11-10 03:58:49.814	2026-11-12 03:58:49.87	75000.00	\N	\N	\N	0.00
31baf086-14c3-4149-a8dc-8d0e96691ec0	cmwd0q8wd001x6wtrc4y13j00	cmwd0q8tv00076wtrtcdgel16	2026-11-04	22:00	23:00	CONFIRMADA	2026-11-02 03:58:49.814	2026-11-12 03:58:49.87	75000.00	t	2026-11-05 15:00:00	\N	0.00
67e323c4-e53c-42f5-b554-5f4932756911	cmwd0q8wd001x6wtrc4y13j00	cmwd0q8ty000b6wtrrp08pzey	2026-11-05	10:00	11:00	CONFIRMADA	2026-11-03 03:58:49.815	2026-11-12 03:58:49.87	60000.00	f	2026-11-06 15:00:00	\N	0.00
46fa0d9e-6e71-48de-ae3d-cd5a22e31e4e	cmwd0q8wd001x6wtrc4y13j00	cmwd0q8tw00086wtrvuzrerpp	2026-11-05	14:00	15:00	CONFIRMADA	2026-11-03 03:58:49.815	2026-11-12 03:58:49.87	60000.00	t	2026-11-06 15:00:00	\N	0.00
6fb909d4-a7be-4927-b565-62c1c7eb4fc8	cmwd0q8wd001x6wtrc4y13j00	cmwd0q8tw00086wtrvuzrerpp	2026-11-06	22:00	23:00	CANCELADA	2026-11-04 03:58:49.815	2026-11-12 03:58:49.87	75000.00	\N	\N	\N	0.00
8b64d5af-f43b-4a35-b840-75192b0b95e7	cmwd0q8wd001x6wtrc4y13j00	cmwd0q8u1000e6wtrtg64uz4y	2026-11-07	21:00	22:00	CONFIRMADA	2026-11-05 03:58:49.815	2026-11-12 03:58:49.87	75000.00	t	2026-11-08 15:00:00	\N	0.00
c5494648-744a-4e56-8a93-19531b189186	cmwd0q8wd001x6wtrc4y13j00	cmwd0q8tv00076wtrtcdgel16	2026-11-09	21:00	22:00	CONFIRMADA	2026-11-07 03:58:49.815	2026-11-12 03:58:49.87	75000.00	t	2026-11-10 15:00:00	\N	0.00
a4ffca06-c7e7-43cd-a795-bedd93fd4a45	cmwd0q8wd001x6wtrc4y13j00	cmwd0q8ty000b6wtrrp08pzey	2026-11-11	20:00	21:00	CONFIRMADA	2026-11-09 03:58:49.815	2026-11-12 03:58:49.87	75000.00	\N	\N	\N	0.00
7545b36c-5348-40c3-a66d-063a46212d09	cmwd0q8wd001x6wtrc4y13j00	cmwd0q8tx00096wtrbtrkh8m6	2026-11-12	19:00	20:00	CONFIRMADA	2026-11-10 03:58:49.815	2026-11-12 03:58:49.87	75000.00	\N	\N	\N	0.00
38c8dcbb-6b26-4a8c-a509-3a6824ae2e53	cmwd0q8wd001x6wtrc4y13j00	cmwd0q8u1000e6wtrtg64uz4y	2026-11-12	21:00	22:00	CONFIRMADA	2026-11-10 03:58:49.815	2026-11-12 03:58:49.87	75000.00	\N	\N	\N	0.00
492b773f-89e3-4c9f-8d32-34828828fb66	cmwd0q8wd001x6wtrc4y13j00	cmwd0q8ty000b6wtrrp08pzey	2026-11-12	22:00	23:00	CONFIRMADA	2026-11-10 03:58:49.815	2026-11-12 03:58:49.87	75000.00	\N	\N	\N	0.00
67354de0-c01d-40c3-acad-77817f771a31	cmwd0q8wd001x6wtrc4y13j00	cmwd0q8ty000a6wtrw2paalsv	2026-11-13	19:00	20:00	CONFIRMADA	2026-11-10 03:58:49.815	2026-11-12 03:58:49.87	75000.00	\N	\N	\N	0.00
8d8eb2e3-e7ff-44b0-b622-110bd92c81e0	cmwd0q8wd001x6wtrc4y13j00	cmwd0q8tx00096wtrbtrkh8m6	2026-11-14	13:00	14:00	CONFIRMADA	2026-11-10 03:58:49.815	2026-11-12 03:58:49.87	60000.00	\N	\N	\N	0.00
13b3f76f-28cb-4504-80c8-077f2d215977	cmwd0q8wd001x6wtrc4y13j00	cmwd0q8ty000a6wtrw2paalsv	2026-11-16	12:00	13:00	CONFIRMADA	2026-11-10 03:58:49.816	2026-11-12 03:58:49.87	60000.00	\N	\N	\N	0.00
fd3a9e4a-2eed-41d4-be14-1b8612da0925	cmwd0q8wd001x6wtrc4y13j00	cmwd0q8u1000f6wtrinw7wd15	2026-11-16	20:00	21:00	CONFIRMADA	2026-11-10 03:58:49.816	2026-11-12 03:58:49.87	75000.00	\N	\N	\N	0.00
1e54c576-61ba-4d1c-a4b2-bcd4614a26d1	cmwd0q8wd001x6wtrc4y13j00	cmwd0q8tz000c6wtr6tz994py	2026-11-16	23:00	00:00	CONFIRMADA	2026-11-10 03:58:49.816	2026-11-12 03:58:49.87	60000.00	\N	\N	\N	0.00
cdb4dd65-1c70-44af-b782-318d27efffbb	cmwd0q8wd001x6wtrc4y13j00	cmwd0q8u1000e6wtrtg64uz4y	2026-11-17	19:00	20:00	CONFIRMADA	2026-11-10 03:58:49.816	2026-11-12 03:58:49.87	75000.00	\N	\N	\N	0.00
95168fad-03c5-48a8-b2cb-34d32ee1fa28	cmwd0q8wf001z6wtreqygf32x	cmwd0q8u1000f6wtrinw7wd15	2026-11-02	23:00	00:00	CONFIRMADA	2026-10-31 03:58:49.816	2026-11-12 03:58:49.87	45000.00	t	2026-11-03 15:00:00	\N	0.00
1a60aaaf-d246-4169-af03-ce8a9338c2f3	cmwd0q8wf001z6wtreqygf32x	cmwd0q8tz000c6wtr6tz994py	2026-11-05	21:00	22:00	CONFIRMADA	2026-11-03 03:58:49.816	2026-11-12 03:58:49.87	55000.00	t	2026-11-06 15:00:00	\N	0.00
43f69443-f20c-4ba0-b237-ea6bcf13f012	cmwd0q8wf001z6wtreqygf32x	cmwd0q8tw00086wtrvuzrerpp	2026-11-08	15:00	16:00	CONFIRMADA	2026-11-06 03:58:49.816	2026-11-12 03:58:49.87	45000.00	t	2026-11-09 15:00:00	\N	0.00
653766e8-119c-4bbe-a815-4f145367cf85	cmwd0q8wf001z6wtreqygf32x	cmwd0q8tv00076wtrtcdgel16	2026-11-08	20:00	21:00	CONFIRMADA	2026-11-06 03:58:49.816	2026-11-12 03:58:49.87	55000.00	t	2026-11-09 15:00:00	\N	0.00
dd8cd5b2-f543-45ac-b535-8968fe2facc2	cmwd0q8wf001z6wtreqygf32x	cmwd0q8tx00096wtrbtrkh8m6	2026-11-10	19:00	20:00	CONFIRMADA	2026-11-08 03:58:49.817	2026-11-12 03:58:49.87	55000.00	\N	\N	\N	0.00
875e008c-a66e-47cd-afad-404daece4996	cmwd0q8wf001z6wtreqygf32x	cmwd0q8ty000b6wtrrp08pzey	2026-11-11	16:00	17:00	CONFIRMADA	2026-11-09 03:58:49.817	2026-11-12 03:58:49.87	45000.00	\N	\N	\N	0.00
1cc65c57-66da-4630-ae00-73220ed17c0e	cmwd0q8wf001z6wtreqygf32x	cmwd0q8ty000b6wtrrp08pzey	2026-11-11	18:00	19:00	CONFIRMADA	2026-11-09 03:58:49.817	2026-11-12 03:58:49.87	45000.00	\N	\N	\N	0.00
2adce05d-75aa-40f6-b302-6feed57e1c23	cmwd0q8wf001z6wtreqygf32x	cmwd0q8u1000e6wtrtg64uz4y	2026-11-11	21:00	22:00	CONFIRMADA	2026-11-09 03:58:49.817	2026-11-12 03:58:49.87	55000.00	\N	\N	\N	0.00
33b32518-0c5d-41e3-8989-9a626a9217b1	cmwd0q8wf001z6wtreqygf32x	cmwd0q8tz000c6wtr6tz994py	2026-11-13	23:00	00:00	CONFIRMADA	2026-11-10 03:58:49.817	2026-11-12 03:58:49.87	45000.00	\N	\N	\N	0.00
a33fb6c6-fbc2-44db-96cf-47ce7c2322be	cmwd0q8wf001z6wtreqygf32x	cmwd0q8tv00076wtrtcdgel16	2026-11-14	14:00	15:00	CONFIRMADA	2026-11-10 03:58:49.817	2026-11-12 03:58:49.87	45000.00	\N	\N	\N	0.00
cc65053b-b0b1-4215-a230-af65323e0762	cmwd0q8wf001z6wtreqygf32x	cmwd0q8u0000d6wtrp3lmvo1c	2026-11-14	23:00	00:00	CONFIRMADA	2026-11-10 03:58:49.817	2026-11-12 03:58:49.87	45000.00	\N	\N	\N	0.00
b4fe4e3b-fadc-4e48-aaeb-52a63df56564	cmwd0q8wf001z6wtreqygf32x	cmwd0q8tx00096wtrbtrkh8m6	2026-11-15	21:00	22:00	CONFIRMADA	2026-11-10 03:58:49.817	2026-11-12 03:58:49.87	55000.00	\N	\N	\N	0.00
e1683a35-82b8-4b38-a395-287e478eeb69	cmwd0q8wf001z6wtreqygf32x	cmwd0q8u0000d6wtrp3lmvo1c	2026-11-17	19:00	20:00	CONFIRMADA	2026-11-10 03:58:49.817	2026-11-12 03:58:49.87	55000.00	\N	\N	\N	0.00
45321628-d38a-4f6a-921f-652eb1e7d465	cmwd0q8wh00216wtr7pfpxldd	cmwd0q8tw00086wtrvuzrerpp	2026-11-04	17:30	19:00	CONFIRMADA	2026-11-02 03:58:49.818	2026-11-12 03:58:49.87	180000.00	t	2026-11-05 15:00:00	\N	0.00
5e290ec5-fe3a-4e2a-bdee-34275cd61741	cmwd0q8wh00216wtr7pfpxldd	cmwd0q8ty000a6wtrw2paalsv	2026-11-06	13:00	14:30	CONFIRMADA	2026-11-04 03:58:49.818	2026-11-12 03:58:49.87	180000.00	t	2026-11-07 15:00:00	\N	0.00
0df4dae2-f1e1-41b7-a88d-bbb30558f39f	cmwd0q8wh00216wtr7pfpxldd	cmwd0q8u1000e6wtrtg64uz4y	2026-11-07	20:30	22:00	CONFIRMADA	2026-11-05 03:58:49.818	2026-11-12 03:58:49.87	180000.00	t	2026-11-08 15:00:00	\N	0.00
90a3932c-3f2e-475c-8c3f-96481b714e51	cmwd0q8wh00216wtr7pfpxldd	cmwd0q8u0000d6wtrp3lmvo1c	2026-11-08	19:00	20:30	CONFIRMADA	2026-11-06 03:58:49.818	2026-11-12 03:58:49.87	180000.00	t	2026-11-09 15:00:00	\N	0.00
9dfefa8c-5b74-4d17-b476-35e6814eeea8	cmwd0q8wl00246wtrlclse97f	cmwd0q8tv00076wtrtcdgel16	2026-11-03	16:00	17:00	CANCELADA	2026-11-01 03:58:49.819	2026-11-12 03:58:49.87	45000.00	\N	\N	\N	0.00
dfabd0ac-931d-45ae-91fa-d031eb798af6	cmwd0q8wl00246wtrlclse97f	cmwd0q8tw00086wtrvuzrerpp	2026-11-03	20:00	21:00	CONFIRMADA	2026-11-01 03:58:49.819	2026-11-12 03:58:49.87	55000.00	t	2026-11-04 15:00:00	\N	0.00
093a2d5d-6df1-4b36-b7d4-547e8695580a	cmwd0q8wl00246wtrlclse97f	cmwd0q8tw00086wtrvuzrerpp	2026-11-03	21:00	22:00	CONFIRMADA	2026-11-01 03:58:49.819	2026-11-12 03:58:49.87	55000.00	t	2026-11-04 15:00:00	\N	0.00
28f63692-4ecd-4919-b327-732b58848d1c	cmwd0q8wl00246wtrlclse97f	cmwd0q8u0000d6wtrp3lmvo1c	2026-11-05	19:00	20:00	CONFIRMADA	2026-11-03 03:58:49.819	2026-11-12 03:58:49.87	55000.00	t	2026-11-06 15:00:00	\N	0.00
a1c8b1bd-d606-4733-99fb-ac2701473c1f	cmwd0q8wl00246wtrlclse97f	cmwd0q8u1000f6wtrinw7wd15	2026-11-05	22:00	23:00	CONFIRMADA	2026-11-03 03:58:49.819	2026-11-12 03:58:49.87	55000.00	t	2026-11-06 15:00:00	\N	0.00
94f57221-5e8e-49d0-9c97-fd048ec08094	cmwd0q8wl00246wtrlclse97f	cmwd0q8tv00076wtrtcdgel16	2026-11-06	22:00	23:00	CANCELADA	2026-11-04 03:58:49.819	2026-11-12 03:58:49.87	55000.00	\N	\N	\N	0.00
69972c08-439f-4fd5-bfd9-1afc3ba01db9	cmwd0q8wl00246wtrlclse97f	cmwd0q8tz000c6wtr6tz994py	2026-11-07	21:00	22:00	CANCELADA	2026-11-05 03:58:49.819	2026-11-12 03:58:49.87	55000.00	\N	\N	\N	0.00
83bfde99-aed5-4ed9-b687-6a7b97d21ad6	cmwd0q8wl00246wtrlclse97f	cmwd0q8ty000b6wtrrp08pzey	2026-11-09	22:00	23:00	CONFIRMADA	2026-11-07 03:58:49.82	2026-11-12 03:58:49.87	55000.00	t	2026-11-10 15:00:00	\N	0.00
b35646c9-898e-4f9d-9333-0c8add2f8e8d	cmwd0q8wl00246wtrlclse97f	cmwd0q8tx00096wtrbtrkh8m6	2026-11-11	20:00	21:00	CONFIRMADA	2026-11-09 03:58:49.82	2026-11-12 03:58:49.87	55000.00	\N	\N	\N	0.00
5ea12ffd-fab5-4c62-a654-4ba751f9736a	cmwd0q8wl00246wtrlclse97f	cmwd0q8u0000d6wtrp3lmvo1c	2026-11-12	20:00	21:00	CONFIRMADA	2026-11-10 03:58:49.82	2026-11-12 03:58:49.87	55000.00	\N	\N	\N	0.00
023b1215-8f3a-47da-9f61-38948f71ff91	cmwd0q8wl00246wtrlclse97f	cmwd0q8tw00086wtrvuzrerpp	2026-11-12	23:00	00:00	CONFIRMADA	2026-11-10 03:58:49.82	2026-11-12 03:58:49.87	45000.00	\N	\N	\N	0.00
239ed7ff-0a22-4aed-b2f3-08c5b8f32389	cmwd0q8wl00246wtrlclse97f	cmwd0q8u1000e6wtrtg64uz4y	2026-11-13	19:00	20:00	CONFIRMADA	2026-11-10 03:58:49.82	2026-11-12 03:58:49.87	55000.00	\N	\N	\N	0.00
908bbe44-0b4f-4908-bf6b-66b6b1915bc9	cmwd0q8wl00246wtrlclse97f	cmwd0q8u1000e6wtrtg64uz4y	2026-11-14	20:00	21:00	CONFIRMADA	2026-11-10 03:58:49.82	2026-11-12 03:58:49.87	55000.00	\N	\N	\N	0.00
9f91c2e0-5ded-4a03-977b-301e7723b63d	cmwd0q8wl00246wtrlclse97f	cmwd0q8tw00086wtrvuzrerpp	2026-11-14	22:00	23:00	CONFIRMADA	2026-11-10 03:58:49.82	2026-11-12 03:58:49.87	55000.00	\N	\N	\N	0.00
c2a75e78-e228-4dfe-a42d-3bf559000f3c	cmwd0q8wl00246wtrlclse97f	cmwd0q8u0000d6wtrp3lmvo1c	2026-11-15	15:00	16:00	CONFIRMADA	2026-11-10 03:58:49.82	2026-11-12 03:58:49.87	45000.00	\N	\N	\N	0.00
97717036-7d37-4552-a884-1c89b1b731b6	cmwd0q8wl00246wtrlclse97f	cmwd0q8ty000b6wtrrp08pzey	2026-11-15	19:00	20:00	CONFIRMADA	2026-11-10 03:58:49.82	2026-11-12 03:58:49.87	55000.00	\N	\N	\N	0.00
ad81d407-6d8b-42eb-9af0-e08a7fdf9301	cmwd0q8wl00246wtrlclse97f	cmwd0q8tw00086wtrvuzrerpp	2026-11-17	23:00	00:00	CONFIRMADA	2026-11-10 03:58:49.82	2026-11-12 03:58:49.87	45000.00	\N	\N	\N	0.00
a0f6a1d9-9ee0-4b09-badd-7e88bd8050c4	cmwd0q8wn00266wtrk0y98kmn	cmwd0q8u0000d6wtrp3lmvo1c	2026-11-03	22:00	23:00	CANCELADA	2026-11-01 03:58:49.82	2026-11-12 03:58:49.87	55000.00	\N	\N	\N	0.00
a59f6424-bbe2-4526-ab73-43d7afa1af95	cmwd0q8wn00266wtrk0y98kmn	cmwd0q8u1000e6wtrtg64uz4y	2026-11-05	21:00	22:00	CONFIRMADA	2026-11-03 03:58:49.821	2026-11-12 03:58:49.87	55000.00	t	2026-11-06 15:00:00	\N	0.00
746297f5-3129-4e39-9d25-76fc60197e35	cmwd0q8wn00266wtrk0y98kmn	cmwd0q8u0000d6wtrp3lmvo1c	2026-11-06	22:00	23:00	CONFIRMADA	2026-11-04 03:58:49.821	2026-11-12 03:58:49.87	55000.00	t	2026-11-07 15:00:00	\N	0.00
a0543c1f-97b9-46e3-876c-1d0d8c05e9a5	cmwd0q8wn00266wtrk0y98kmn	cmwd0q8tz000c6wtr6tz994py	2026-11-07	19:00	20:00	CONFIRMADA	2026-11-05 03:58:49.821	2026-11-12 03:58:49.87	55000.00	t	2026-11-08 15:00:00	\N	0.00
c90027e6-03f9-408c-8dc5-8f4c3555141f	cmwd0q8wn00266wtrk0y98kmn	cmwd0q8tz000c6wtr6tz994py	2026-11-07	21:00	22:00	CONFIRMADA	2026-11-05 03:58:49.821	2026-11-12 03:58:49.87	55000.00	t	2026-11-08 15:00:00	\N	0.00
62a52205-aab0-46cb-b4b0-736039ed7241	cmwd0q8wn00266wtrk0y98kmn	cmwd0q8tw00086wtrvuzrerpp	2026-11-08	22:00	23:00	CONFIRMADA	2026-11-06 03:58:49.821	2026-11-12 03:58:49.87	55000.00	t	2026-11-09 15:00:00	\N	0.00
af2b202f-afea-403a-986d-3921e904fe31	cmwd0q8wn00266wtrk0y98kmn	cmwd0q8u1000f6wtrinw7wd15	2026-11-10	13:00	14:00	CONFIRMADA	2026-11-08 03:58:49.821	2026-11-12 03:58:49.87	45000.00	\N	\N	\N	0.00
ecb39006-f006-41e4-a64e-3061878573e4	cmwd0q8wn00266wtrk0y98kmn	cmwd0q8ty000a6wtrw2paalsv	2026-11-10	20:00	21:00	CONFIRMADA	2026-11-08 03:58:49.821	2026-11-12 03:58:49.87	55000.00	\N	\N	\N	0.00
3a00393d-8721-498b-a675-b25833f100cb	cmwd0q8wn00266wtrk0y98kmn	cmwd0q8ty000b6wtrrp08pzey	2026-11-11	22:00	23:00	CONFIRMADA	2026-11-09 03:58:49.821	2026-11-12 03:58:49.87	55000.00	\N	\N	\N	0.00
db72c36c-15ae-44c6-9058-921ce2c9a5bb	cmwd0q8wn00266wtrk0y98kmn	cmwd0q8tx00096wtrbtrkh8m6	2026-11-12	12:00	13:00	CONFIRMADA	2026-11-10 03:58:49.821	2026-11-12 03:58:49.87	45000.00	\N	\N	\N	0.00
085d18eb-88ec-4225-9718-267d28f55530	cmwd0q8wn00266wtrk0y98kmn	cmwd0q8ty000b6wtrrp08pzey	2026-11-12	14:00	15:00	CANCELADA	2026-11-10 03:58:49.821	2026-11-12 03:58:49.87	45000.00	\N	\N	\N	0.00
cb2866f9-1f11-4771-8fc7-7b7c9a30e3d6	cmwd0q8wn00266wtrk0y98kmn	cmwd0q8tw00086wtrvuzrerpp	2026-11-14	14:00	15:00	CONFIRMADA	2026-11-10 03:58:49.822	2026-11-12 03:58:49.87	45000.00	\N	\N	\N	0.00
6a6b150c-52f3-4a44-b118-3a78d9055744	cmwd0q8wn00266wtrk0y98kmn	cmwd0q8u1000f6wtrinw7wd15	2026-11-14	20:00	21:00	CONFIRMADA	2026-11-10 03:58:49.822	2026-11-12 03:58:49.87	55000.00	\N	\N	\N	0.00
23f75b74-4e28-4521-9bcd-a2dfb976772d	cmwd0q8wn00266wtrk0y98kmn	cmwd0q8u1000e6wtrtg64uz4y	2026-11-16	14:00	15:00	CONFIRMADA	2026-11-10 03:58:49.822	2026-11-12 03:58:49.87	45000.00	\N	\N	\N	0.00
d10dcfc2-d1bf-4767-9077-ab5f93ae26ca	cmwd0q8wp002a6wtrze4voyzh	cmwd0q8tz000c6wtr6tz994py	2026-11-03	13:00	14:00	CONFIRMADA	2026-11-01 03:58:49.822	2026-11-12 03:58:49.87	90000.00	f	2026-11-04 15:00:00	\N	0.00
8a6abee1-55bc-4f5e-bf0c-0041660aa8ae	cmwd0q8wp002a6wtrze4voyzh	cmwd0q8u1000e6wtrtg64uz4y	2026-11-05	19:00	20:00	CONFIRMADA	2026-11-03 03:58:49.822	2026-11-12 03:58:49.87	110000.00	t	2026-11-06 15:00:00	\N	0.00
098ab70e-65b0-4442-b690-d3b4197a60ab	cmwd0q8wp002a6wtrze4voyzh	cmwd0q8ty000b6wtrrp08pzey	2026-11-06	23:00	00:00	CONFIRMADA	2026-11-04 03:58:49.822	2026-11-12 03:58:49.87	90000.00	t	2026-11-07 15:00:00	\N	0.00
62f51ed8-3c02-40bc-9237-bdbab09c7883	cmwd0q8wp002a6wtrze4voyzh	cmwd0q8tw00086wtrvuzrerpp	2026-11-08	19:00	20:00	CONFIRMADA	2026-11-06 03:58:49.822	2026-11-12 03:58:49.87	110000.00	t	2026-11-09 15:00:00	\N	0.00
6a73779d-bb76-4ff7-b8fc-d257229a5c3c	cmwd0q8wp002a6wtrze4voyzh	cmwd0q8u0000d6wtrp3lmvo1c	2026-11-10	20:00	21:00	CONFIRMADA	2026-11-08 03:58:49.823	2026-11-12 03:58:49.87	110000.00	\N	\N	\N	0.00
9e50ba3c-81cc-4244-8a31-9edda1ad342e	cmwd0q8wp002a6wtrze4voyzh	cmwd0q8tx00096wtrbtrkh8m6	2026-11-11	19:00	20:00	CONFIRMADA	2026-11-09 03:58:49.823	2026-11-12 03:58:49.87	110000.00	\N	\N	\N	0.00
50fb57a1-cb08-482b-b92e-0fa9d282ade1	cmwd0q8wp002a6wtrze4voyzh	cmwd0q8u0000d6wtrp3lmvo1c	2026-11-11	20:00	21:00	CONFIRMADA	2026-11-09 03:58:49.823	2026-11-12 03:58:49.87	110000.00	\N	\N	\N	0.00
7b092fbd-5250-4cbe-8d73-284bec05b1d4	cmwd0q8wp002a6wtrze4voyzh	cmwd0q8u1000f6wtrinw7wd15	2026-11-11	21:00	22:00	CONFIRMADA	2026-11-09 03:58:49.823	2026-11-12 03:58:49.87	110000.00	\N	\N	\N	0.00
\.


--
-- Data for Name: Ticket; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public."Ticket" (id, "jugadorId", "adminId", "reservasInvalidas", "puntosAnteriores", motivo, estado, "venceEn", "comentarioJugador", "respondidoEn", "comentarioAdmin", "resueltoEn", "createdAt") FROM stdin;
\.


--
-- Data for Name: Usuario; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public."Usuario" (id, nombre, email, "passwordHash", dni, telefono, rol, activo, "createdAt", "updatedAt", "imagenUrl") FROM stdin;
cmwd0q8tj00006wtrj5gw7dbl	Admin TocaYJuga	admin@tocayjuga.com	$argon2id$v=19$m=65536,p=4,t=3$9P1gS0l/Rhz1XGB3aDRutQ$ya2zl1cWpSEL+s5ivw6AmrMifZ/LXj3V2wFeV1r/EzU	\N	\N	ADMIN	t	2026-11-12 03:58:49.639	2026-11-12 03:58:49.639	\N
cmwd0q8tn00016wtrf0s6ejeb	Martín Gómez	dueno@tocayjuga.com	$argon2id$v=19$m=65536,p=4,t=3$9P1gS0l/Rhz1XGB3aDRutQ$ya2zl1cWpSEL+s5ivw6AmrMifZ/LXj3V2wFeV1r/EzU	30111000	11 6000-1000	DUENIO	t	2026-11-12 03:58:49.643	2026-11-12 03:58:49.643	\N
cmwd0q8to00026wtr93va3leg	Laura Fernández	laura.fernandez@tocayjuga.com	$argon2id$v=19$m=65536,p=4,t=3$9P1gS0l/Rhz1XGB3aDRutQ$ya2zl1cWpSEL+s5ivw6AmrMifZ/LXj3V2wFeV1r/EzU	30111001	11 6000-1001	DUENIO	t	2026-11-12 03:58:49.644	2026-11-12 03:58:49.644	\N
cmwd0q8tp00036wtrxqi2qiq7	Diego Sosa	diego.sosa@tocayjuga.com	$argon2id$v=19$m=65536,p=4,t=3$9P1gS0l/Rhz1XGB3aDRutQ$ya2zl1cWpSEL+s5ivw6AmrMifZ/LXj3V2wFeV1r/EzU	30111002	11 6000-1002	DUENIO	t	2026-11-12 03:58:49.645	2026-11-12 03:58:49.645	\N
cmwd0q8tq00046wtr639ru05g	Sofía Paz	sofia.paz@tocayjuga.com	$argon2id$v=19$m=65536,p=4,t=3$9P1gS0l/Rhz1XGB3aDRutQ$ya2zl1cWpSEL+s5ivw6AmrMifZ/LXj3V2wFeV1r/EzU	30111003	11 6000-1003	DUENIO	t	2026-11-12 03:58:49.646	2026-11-12 03:58:49.646	\N
cmwd0q8ts00056wtrkpnm8mon	Carlos Vega	carlos.vega@tocayjuga.com	$argon2id$v=19$m=65536,p=4,t=3$9P1gS0l/Rhz1XGB3aDRutQ$ya2zl1cWpSEL+s5ivw6AmrMifZ/LXj3V2wFeV1r/EzU	30111004	11 6000-1004	DUENIO	f	2026-11-12 03:58:49.648	2026-11-12 03:58:49.648	\N
cmwd0q8tu00066wtrls20ecnl	Juan Pérez	jugador@tocayjuga.com	$argon2id$v=19$m=65536,p=4,t=3$9P1gS0l/Rhz1XGB3aDRutQ$ya2zl1cWpSEL+s5ivw6AmrMifZ/LXj3V2wFeV1r/EzU	30111005	11 6000-1005	JUGADOR	t	2026-11-12 03:58:49.65	2026-11-12 03:58:49.65	\N
cmwd0q8tv00076wtrtcdgel16	Lucas Martínez	lucas.martinez@tocayjuga.com	$argon2id$v=19$m=65536,p=4,t=3$9P1gS0l/Rhz1XGB3aDRutQ$ya2zl1cWpSEL+s5ivw6AmrMifZ/LXj3V2wFeV1r/EzU	30111006	11 6000-1006	JUGADOR	t	2026-11-12 03:58:49.651	2026-11-12 03:58:49.651	\N
cmwd0q8tw00086wtrvuzrerpp	Agustina Romero	agustina.romero@tocayjuga.com	$argon2id$v=19$m=65536,p=4,t=3$9P1gS0l/Rhz1XGB3aDRutQ$ya2zl1cWpSEL+s5ivw6AmrMifZ/LXj3V2wFeV1r/EzU	30111007	11 6000-1007	JUGADOR	t	2026-11-12 03:58:49.652	2026-11-12 03:58:49.652	\N
cmwd0q8tx00096wtrbtrkh8m6	Tomás Álvarez	tomas.alvarez@tocayjuga.com	$argon2id$v=19$m=65536,p=4,t=3$9P1gS0l/Rhz1XGB3aDRutQ$ya2zl1cWpSEL+s5ivw6AmrMifZ/LXj3V2wFeV1r/EzU	30111008	11 6000-1008	JUGADOR	t	2026-11-12 03:58:49.653	2026-11-12 03:58:49.653	\N
cmwd0q8ty000a6wtrw2paalsv	Valentina Torres	valentina.torres@tocayjuga.com	$argon2id$v=19$m=65536,p=4,t=3$9P1gS0l/Rhz1XGB3aDRutQ$ya2zl1cWpSEL+s5ivw6AmrMifZ/LXj3V2wFeV1r/EzU	30111009	11 6000-1009	JUGADOR	t	2026-11-12 03:58:49.654	2026-11-12 03:58:49.654	\N
cmwd0q8ty000b6wtrrp08pzey	Nicolás Benítez	nicolas.benitez@tocayjuga.com	$argon2id$v=19$m=65536,p=4,t=3$9P1gS0l/Rhz1XGB3aDRutQ$ya2zl1cWpSEL+s5ivw6AmrMifZ/LXj3V2wFeV1r/EzU	30111010	11 6000-1010	JUGADOR	t	2026-11-12 03:58:49.654	2026-11-12 03:58:49.654	\N
cmwd0q8tz000c6wtr6tz994py	Martina Acosta	martina.acosta@tocayjuga.com	$argon2id$v=19$m=65536,p=4,t=3$9P1gS0l/Rhz1XGB3aDRutQ$ya2zl1cWpSEL+s5ivw6AmrMifZ/LXj3V2wFeV1r/EzU	30111011	11 6000-1011	JUGADOR	t	2026-11-12 03:58:49.655	2026-11-12 03:58:49.655	\N
cmwd0q8u0000d6wtrp3lmvo1c	Federico Díaz	federico.diaz@tocayjuga.com	$argon2id$v=19$m=65536,p=4,t=3$9P1gS0l/Rhz1XGB3aDRutQ$ya2zl1cWpSEL+s5ivw6AmrMifZ/LXj3V2wFeV1r/EzU	30111012	11 6000-1012	JUGADOR	t	2026-11-12 03:58:49.656	2026-11-12 03:58:49.656	\N
cmwd0q8u1000e6wtrtg64uz4y	Santiago Herrera	santiago.herrera@tocayjuga.com	$argon2id$v=19$m=65536,p=4,t=3$9P1gS0l/Rhz1XGB3aDRutQ$ya2zl1cWpSEL+s5ivw6AmrMifZ/LXj3V2wFeV1r/EzU	30111013	11 6000-1013	JUGADOR	t	2026-11-12 03:58:49.657	2026-11-12 03:58:49.657	\N
cmwd0q8u1000f6wtrinw7wd15	Julieta Medina	julieta.medina@tocayjuga.com	$argon2id$v=19$m=65536,p=4,t=3$9P1gS0l/Rhz1XGB3aDRutQ$ya2zl1cWpSEL+s5ivw6AmrMifZ/LXj3V2wFeV1r/EzU	30111014	11 6000-1014	JUGADOR	t	2026-11-12 03:58:49.657	2026-11-12 03:58:49.657	\N
cmwd0q8u3000g6wtr1r9o3mpw	Pablo Suárez	pablo.suarez@tocayjuga.com	$argon2id$v=19$m=65536,p=4,t=3$9P1gS0l/Rhz1XGB3aDRutQ$ya2zl1cWpSEL+s5ivw6AmrMifZ/LXj3V2wFeV1r/EzU	30111015	11 6000-1015	JUGADOR	f	2026-11-12 03:58:49.659	2026-11-12 03:58:49.659	\N
\.


--
-- Data for Name: _prisma_migrations; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public._prisma_migrations (id, checksum, finished_at, migration_name, logs, rolled_back_at, started_at, applied_steps_count) FROM stdin;
0775319b-2c6d-4f05-ad6c-b4a6c7b85eb7	27ae642e8cf967a8ebb186e54e8433b5f51f039f67abeecde37ef8f8df2b6ec8	2026-09-10 21:05:09.177885-03	20260911000504_init	\N	\N	2026-09-10 21:05:04.899451-03	1
e6f4df05-5ea7-4bc8-9af6-e6ee885d2103	631485502e5002e012f233f2fa50798d296c1fe8ea506c62bd07d29b359ce890	2026-11-05 03:35:38.425831-03	20261105063534_agregar_etiquetas_y_tickets	\N	\N	2026-11-05 03:35:35.462184-03	1
f20dc894-9164-4cb9-9211-d34ce48f6fe0	de7c2dacf05ca22392e24608e209c3b606cf45e00d3829ae8c0aa294f7c6759e	2026-09-16 19:37:43.439175-03	20260916033927_add_nombre_cancha	\N	\N	2026-09-16 19:37:42.66468-03	1
aace8ebd-1672-4ad5-ad8e-bd4e872c749f	4083cb0a566e85e1d802a93bf1349cc6c2118ac8e319a9e35b9297cc1e359583	2026-10-01 13:23:50.379967-03	20261001162003_reserva_activa_unica	\N	\N	2026-10-01 13:23:49.403017-03	1
7223a71e-92cc-4a2f-a045-0d7f401d1328	128e2b596b90c8b240a0682621da1da65723dae20789f4c43a62a05f71c2217a	2026-09-17 07:22:37.171088-03	20260917102213_baja_logica	\N	\N	2026-09-17 07:22:36.099135-03	1
c6a164a3-1508-40f6-8f1b-d708918f0bcc	f006cb431c0ab1413bbf51d2f4d91f648d1fba0f5c757a75369b899714c26fc7	2026-09-17 16:31:48.426826-03	20260917193146_agregar_tenis_padel_y_polvo_de_ladrillo	\N	\N	2026-09-17 16:31:47.22145-03	1
23a15a74-e5a9-4383-ac48-5568f7c3a757	7215209e957317b516a52cc71c9c506def2fe88d672521abed399625e5325cb8	2026-11-01 21:38:30.862884-03	20261102003828_sumarse_a_reserva	\N	\N	2026-11-01 21:38:29.068526-03	1
45f416aa-5f66-41e0-8e97-e36ebebaee29	91fe8bf6bfa1ff5e7a0d10a6797ed483c7bcf91441ee88fa7a4ee8066bbe46af	2026-09-24 16:47:34.813663-03	20260924194730_sprint2_precios_sena	\N	\N	2026-09-24 16:47:31.590194-03	1
8339a409-fa47-4bec-a900-9a8e41b15079	412f436d35f8f15ec9b4e3f6b5f51756012b44784f689cae997b1dd17a97f4fe	2026-10-05 20:17:37.782705-03	20261005231735_rol_admin	\N	\N	2026-10-05 20:17:36.86422-03	1
bb2c35f5-32b5-45b6-bacd-e3c75d8aeb46	e46ae33c796f8a3935287c41ed72d7710d25fb5aaa6539820e79acc317071a03	2026-09-24 17:20:05.853365-03	20260924202001_pago_cascade_on_reserva_delete	\N	\N	2026-09-24 17:20:03.470905-03	1
3e3da142-62a7-40ab-8132-869dc7cfc92e	167760a8e4933358205cbd2bbff7a1d1e4023ebd2d4e1d359ac57b34efa85009	2026-09-24 20:06:44.981891-03	20260924230642_add_block	\N	\N	2026-09-24 20:06:43.758213-03	1
98e5367c-fa22-4c20-8128-9187b283e638	ec78b1ab71943cf078e374f464cec3b08bbfe70e80206be7eaf2c9cfd367000f	2026-09-29 19:05:38.653203-03	20260929220535_sacar_completada_de_estado_reserva	\N	\N	2026-09-29 19:05:36.457847-03	1
034d7361-6c70-4f82-957d-44c59c18d468	6d3de9da744b74744168f0ea10292980efa0a11ac1688babfb21986757ce82f8	2026-10-05 20:53:34.900734-03	20261005235333_intentos	\N	\N	2026-10-05 20:53:33.9484-03	1
8ea1b98e-585b-4122-8b1f-87ae9abb4c77	3239d2c2d9eca544f0e2d7122a9b9012497f1a7af9bdfd321cd2ced6c603b424	2026-09-30 04:36:22.090309-03	20260930073618_asistencia_en_reserva	\N	\N	2026-09-30 04:36:19.771155-03	1
4d3f6e59-52c8-489e-94c5-afdf1f856af9	cec8edc038ec19ba7fccca292c0279e4a58bb8b90a17a4bcc668583199d90002	2026-09-30 16:06:28.388693-03	20260930190626_anticipacion_minima	\N	\N	2026-09-30 16:06:27.336853-03	1
bff14449-11d9-41aa-8e56-1fae8d0ee5ad	2ebf9e0b4023a8f6c9dc22b97bccfb29358b62d5ff56ece8823d61ca40662e80	2026-09-30 18:20:12.422222-03	20260930212010_anticipacion_default_3_horas	\N	\N	2026-09-30 18:20:11.538928-03	1
c0ad611d-a23a-4a08-b91f-6e19270c73ac	4aaf1dd8898aee70212634cf87a599e81bfd9ad420f8289f6dc2acd869483d18	2026-10-10 22:15:17.961675-03	20261011011514_schema_scrum_58	\N	\N	2026-10-10 22:15:15.973036-03	1
301d6cb6-111f-4fd7-96fc-22cc1b775a4a	7586f24456e7f1d1d41acd5641b1faeaea75ef032d48cbff8ebee74ea8f7f9aa	2026-10-01 00:01:26.718444-03	20261001030124_agregar_basquet_como_deporte	\N	\N	2026-10-01 00:01:25.852049-03	1
7bdadf91-fab6-48c4-8bee-b13221c62e20	73de643cedca89b07e2b3e4cb159190a38f872c0b29376e8044cb52daa59bc30	2026-10-01 04:42:37.516014-03	20261001074235_politica_cancelacion	\N	\N	2026-10-01 04:42:36.599858-03	1
254c546c-8c1d-4fb9-9060-010ef0951abb	6ebb6bac03d60ad93c41166a2462365440733a1a6cdadc2fb9bed079a3bf1531	2026-11-01 22:17:32.459814-03	20261102011730_participante_salirse	\N	\N	2026-11-01 22:17:31.437383-03	1
3bfc1341-829c-4e66-a77a-4487b57f6dfe	68e7f53c3cb1941f49483fb37db29b7f3e54496807aebf0b52f5f29ef9e9b708	2026-10-12 08:29:25.390137-03	20261012000000_evidencia_y_marca_de_asistencia	\N	\N	2026-10-12 08:29:23.631708-03	1
a47e062a-1260-4f48-a36c-ba5132706ab9	05b22a68c001f40acba07227c7b7f2f6d5183a41752f396dd9a8b0b23cdac78d	2026-10-13 23:52:39.651755-03	20261014025129_aprobacion_de_complejos	\N	\N	2026-10-13 23:52:38.483307-03	1
6b6b4eb9-948c-4f97-9a10-d7f31d5beb67	2c74979af56ad2320bc7d0756ddb71d5fbd147bedfed9a3ae6877ad6ad409933	2026-10-14 23:59:48.297837-03	20261014120000_agregar_imagen_a_usuario		\N	2026-10-14 23:59:48.297837-03	0
df8082cc-7f9c-4f87-96b2-b20c51845765	d52a8909ad8e41463e40719293b089c98314a921eb959ebf1e17a44cee3fb954	2026-11-02 17:03:28.980564-03	20261102160000_descuento_por_nivel	\N	\N	2026-11-02 17:03:28.168308-03	1
12734f46-7db3-4f84-bf8e-2d272f6f776b	3320f8294b1f1ca5067dfb10ca22aa34a8c6cff56e32b040fbc3f86e079acde5	2026-11-01 16:28:20.028344-03	20261101192817_reservas_parciales	\N	\N	2026-11-01 16:28:19.009772-03	1
c9df4a8a-2055-48ce-9e80-7d4c226e5f62	d416eb165ac05734ffa41ab9ab29e382919f4395d0827525ac8bc840127fe894	2026-11-03 15:17:36.282392-03	20261103160000_capacidad_de_canchas	\N	\N	2026-11-03 15:17:35.482798-03	1
b9783b87-6dc7-46e4-8b33-5c96d14abe88	9d3bdce25866fa5ad738312ab22d5237141b0d069b408733ca4baba309ea43d5	2026-11-04 15:25:48.068665-03	20261104182133_calificaciones	\N	\N	2026-11-04 15:25:46.259143-03	1
\.


--
-- Name: Block Block_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Block"
    ADD CONSTRAINT "Block_pkey" PRIMARY KEY (id);


--
-- Name: Calificacion Calificacion_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Calificacion"
    ADD CONSTRAINT "Calificacion_pkey" PRIMARY KEY (id);


--
-- Name: Cancha Cancha_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Cancha"
    ADD CONSTRAINT "Cancha_pkey" PRIMARY KEY (id);


--
-- Name: Complejo Complejo_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Complejo"
    ADD CONSTRAINT "Complejo_pkey" PRIMARY KEY (id);


--
-- Name: Disputa Disputa_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Disputa"
    ADD CONSTRAINT "Disputa_pkey" PRIMARY KEY (id);


--
-- Name: EtiquetaReserva EtiquetaReserva_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."EtiquetaReserva"
    ADD CONSTRAINT "EtiquetaReserva_pkey" PRIMARY KEY (id);


--
-- Name: EvidenciaDisputa EvidenciaDisputa_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."EvidenciaDisputa"
    ADD CONSTRAINT "EvidenciaDisputa_pkey" PRIMARY KEY (id);


--
-- Name: EvidenciaTicket EvidenciaTicket_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."EvidenciaTicket"
    ADD CONSTRAINT "EvidenciaTicket_pkey" PRIMARY KEY (id);


--
-- Name: ImagenComplejo ImagenComplejo_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."ImagenComplejo"
    ADD CONSTRAINT "ImagenComplejo_pkey" PRIMARY KEY (id);


--
-- Name: Intento Intento_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Intento"
    ADD CONSTRAINT "Intento_pkey" PRIMARY KEY (id);


--
-- Name: Pago Pago_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Pago"
    ADD CONSTRAINT "Pago_pkey" PRIMARY KEY (id);


--
-- Name: ParticipanteReserva ParticipanteReserva_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."ParticipanteReserva"
    ADD CONSTRAINT "ParticipanteReserva_pkey" PRIMARY KEY (id);


--
-- Name: PrecioEspecial PrecioEspecial_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."PrecioEspecial"
    ADD CONSTRAINT "PrecioEspecial_pkey" PRIMARY KEY (id);


--
-- Name: Reserva Reserva_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Reserva"
    ADD CONSTRAINT "Reserva_pkey" PRIMARY KEY (id);


--
-- Name: Ticket Ticket_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Ticket"
    ADD CONSTRAINT "Ticket_pkey" PRIMARY KEY (id);


--
-- Name: Usuario Usuario_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Usuario"
    ADD CONSTRAINT "Usuario_pkey" PRIMARY KEY (id);


--
-- Name: _prisma_migrations _prisma_migrations_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public._prisma_migrations
    ADD CONSTRAINT _prisma_migrations_pkey PRIMARY KEY (id);


--
-- Name: Block_courtId_startDate_endDate_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "Block_courtId_startDate_endDate_idx" ON public."Block" USING btree ("courtId", "startDate", "endDate");


--
-- Name: Calificacion_complejoId_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "Calificacion_complejoId_idx" ON public."Calificacion" USING btree ("complejoId");


--
-- Name: Calificacion_jugadorId_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "Calificacion_jugadorId_idx" ON public."Calificacion" USING btree ("jugadorId");


--
-- Name: Calificacion_reservaId_jugadorId_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX "Calificacion_reservaId_jugadorId_key" ON public."Calificacion" USING btree ("reservaId", "jugadorId");


--
-- Name: Cancha_complejoId_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "Cancha_complejoId_idx" ON public."Cancha" USING btree ("complejoId");


--
-- Name: Cancha_deporte_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "Cancha_deporte_idx" ON public."Cancha" USING btree (deporte);


--
-- Name: Complejo_duenioId_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "Complejo_duenioId_idx" ON public."Complejo" USING btree ("duenioId");


--
-- Name: Complejo_zona_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "Complejo_zona_idx" ON public."Complejo" USING btree (zona);


--
-- Name: Disputa_estado_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "Disputa_estado_idx" ON public."Disputa" USING btree (estado);


--
-- Name: Disputa_reservaId_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX "Disputa_reservaId_key" ON public."Disputa" USING btree ("reservaId");


--
-- Name: EtiquetaReserva_jugadorId_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "EtiquetaReserva_jugadorId_idx" ON public."EtiquetaReserva" USING btree ("jugadorId");


--
-- Name: EtiquetaReserva_reservaId_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "EtiquetaReserva_reservaId_idx" ON public."EtiquetaReserva" USING btree ("reservaId");


--
-- Name: EtiquetaReserva_reservaId_jugadorId_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX "EtiquetaReserva_reservaId_jugadorId_key" ON public."EtiquetaReserva" USING btree ("reservaId", "jugadorId");


--
-- Name: EvidenciaDisputa_disputaId_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "EvidenciaDisputa_disputaId_idx" ON public."EvidenciaDisputa" USING btree ("disputaId");


--
-- Name: EvidenciaTicket_ticketId_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "EvidenciaTicket_ticketId_idx" ON public."EvidenciaTicket" USING btree ("ticketId");


--
-- Name: ImagenComplejo_complejoId_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "ImagenComplejo_complejoId_idx" ON public."ImagenComplejo" USING btree ("complejoId");


--
-- Name: Intento_clave_createdAt_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "Intento_clave_createdAt_idx" ON public."Intento" USING btree (clave, "createdAt");


--
-- Name: Pago_reservaId_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX "Pago_reservaId_key" ON public."Pago" USING btree ("reservaId");


--
-- Name: ParticipanteReserva_reservaId_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "ParticipanteReserva_reservaId_idx" ON public."ParticipanteReserva" USING btree ("reservaId");


--
-- Name: ParticipanteReserva_reservaId_jugadorId_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX "ParticipanteReserva_reservaId_jugadorId_key" ON public."ParticipanteReserva" USING btree ("reservaId", "jugadorId");


--
-- Name: PrecioEspecial_canchaId_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "PrecioEspecial_canchaId_idx" ON public."PrecioEspecial" USING btree ("canchaId");


--
-- Name: Reserva_activa_unica; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX "Reserva_activa_unica" ON public."Reserva" USING btree ("canchaId", fecha, "horaInicio") WHERE (estado <> 'CANCELADA'::public."EstadoReserva");


--
-- Name: Reserva_canchaId_fecha_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "Reserva_canchaId_fecha_idx" ON public."Reserva" USING btree ("canchaId", fecha);


--
-- Name: Reserva_jugadorId_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "Reserva_jugadorId_idx" ON public."Reserva" USING btree ("jugadorId");


--
-- Name: Ticket_estado_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "Ticket_estado_idx" ON public."Ticket" USING btree (estado);


--
-- Name: Ticket_jugadorId_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "Ticket_jugadorId_idx" ON public."Ticket" USING btree ("jugadorId");


--
-- Name: Usuario_dni_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX "Usuario_dni_key" ON public."Usuario" USING btree (dni);


--
-- Name: Usuario_email_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX "Usuario_email_key" ON public."Usuario" USING btree (email);


--
-- Name: Block Block_courtId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Block"
    ADD CONSTRAINT "Block_courtId_fkey" FOREIGN KEY ("courtId") REFERENCES public."Cancha"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: Calificacion Calificacion_complejoId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Calificacion"
    ADD CONSTRAINT "Calificacion_complejoId_fkey" FOREIGN KEY ("complejoId") REFERENCES public."Complejo"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: Calificacion Calificacion_jugadorId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Calificacion"
    ADD CONSTRAINT "Calificacion_jugadorId_fkey" FOREIGN KEY ("jugadorId") REFERENCES public."Usuario"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: Calificacion Calificacion_reservaId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Calificacion"
    ADD CONSTRAINT "Calificacion_reservaId_fkey" FOREIGN KEY ("reservaId") REFERENCES public."Reserva"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: Cancha Cancha_complejoId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Cancha"
    ADD CONSTRAINT "Cancha_complejoId_fkey" FOREIGN KEY ("complejoId") REFERENCES public."Complejo"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: Complejo Complejo_duenioId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Complejo"
    ADD CONSTRAINT "Complejo_duenioId_fkey" FOREIGN KEY ("duenioId") REFERENCES public."Usuario"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: Disputa Disputa_adminId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Disputa"
    ADD CONSTRAINT "Disputa_adminId_fkey" FOREIGN KEY ("adminId") REFERENCES public."Usuario"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: Disputa Disputa_jugadorId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Disputa"
    ADD CONSTRAINT "Disputa_jugadorId_fkey" FOREIGN KEY ("jugadorId") REFERENCES public."Usuario"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: Disputa Disputa_reservaId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Disputa"
    ADD CONSTRAINT "Disputa_reservaId_fkey" FOREIGN KEY ("reservaId") REFERENCES public."Reserva"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: EtiquetaReserva EtiquetaReserva_jugadorId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."EtiquetaReserva"
    ADD CONSTRAINT "EtiquetaReserva_jugadorId_fkey" FOREIGN KEY ("jugadorId") REFERENCES public."Usuario"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: EtiquetaReserva EtiquetaReserva_reservaId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."EtiquetaReserva"
    ADD CONSTRAINT "EtiquetaReserva_reservaId_fkey" FOREIGN KEY ("reservaId") REFERENCES public."Reserva"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: EvidenciaDisputa EvidenciaDisputa_disputaId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."EvidenciaDisputa"
    ADD CONSTRAINT "EvidenciaDisputa_disputaId_fkey" FOREIGN KEY ("disputaId") REFERENCES public."Disputa"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: EvidenciaTicket EvidenciaTicket_ticketId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."EvidenciaTicket"
    ADD CONSTRAINT "EvidenciaTicket_ticketId_fkey" FOREIGN KEY ("ticketId") REFERENCES public."Ticket"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: ImagenComplejo ImagenComplejo_complejoId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."ImagenComplejo"
    ADD CONSTRAINT "ImagenComplejo_complejoId_fkey" FOREIGN KEY ("complejoId") REFERENCES public."Complejo"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: Pago Pago_reservaId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Pago"
    ADD CONSTRAINT "Pago_reservaId_fkey" FOREIGN KEY ("reservaId") REFERENCES public."Reserva"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: ParticipanteReserva ParticipanteReserva_jugadorId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."ParticipanteReserva"
    ADD CONSTRAINT "ParticipanteReserva_jugadorId_fkey" FOREIGN KEY ("jugadorId") REFERENCES public."Usuario"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: ParticipanteReserva ParticipanteReserva_reservaId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."ParticipanteReserva"
    ADD CONSTRAINT "ParticipanteReserva_reservaId_fkey" FOREIGN KEY ("reservaId") REFERENCES public."Reserva"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: PrecioEspecial PrecioEspecial_canchaId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."PrecioEspecial"
    ADD CONSTRAINT "PrecioEspecial_canchaId_fkey" FOREIGN KEY ("canchaId") REFERENCES public."Cancha"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: Reserva Reserva_canchaId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Reserva"
    ADD CONSTRAINT "Reserva_canchaId_fkey" FOREIGN KEY ("canchaId") REFERENCES public."Cancha"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: Reserva Reserva_jugadorId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Reserva"
    ADD CONSTRAINT "Reserva_jugadorId_fkey" FOREIGN KEY ("jugadorId") REFERENCES public."Usuario"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: Ticket Ticket_adminId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Ticket"
    ADD CONSTRAINT "Ticket_adminId_fkey" FOREIGN KEY ("adminId") REFERENCES public."Usuario"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: Ticket Ticket_jugadorId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Ticket"
    ADD CONSTRAINT "Ticket_jugadorId_fkey" FOREIGN KEY ("jugadorId") REFERENCES public."Usuario"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- PostgreSQL database dump complete
--


