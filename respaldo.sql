--
-- PostgreSQL database dump
--


-- Dumped from database version 17.2
-- Dumped by pg_dump version 18.4

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
-- Name: prisma_postgres; Type: EXTENSION; Schema: -; Owner: -
--



--
--



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
cmv9y4ejk002s0qoj4nkqtq8j	cmv9y3up0000n0qojqox1v48h	2026-10-15	2026-10-21	19:00	23:00	Torneo nocturno de la liga del complejo	2026-10-15 19:42:50.528	2026-10-15 19:42:50.528
cmv9y4ejk002t0qojaxruoahn	cmv9y3x03000x0qojhcburx5q	2026-10-17	2026-10-18	09:00	13:00	Mantenimiento del césped	2026-10-15 19:42:50.528	2026-10-15 19:42:50.528
cmv9y4ejk002u0qoj3lg6ahlj	cmv9y41n7001g0qojm2z84sy9	2026-10-08	2026-10-10	10:00	22:00	Uso interno: escuelita de fútbol	2026-10-15 19:42:50.528	2026-10-15 19:42:50.528
\.


--
-- Data for Name: Calificacion; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public."Calificacion" (id, "reservaId", "jugadorId", "complejoId", puntaje, comentario, "createdAt") FROM stdin;
cmw2s40be000208idf2yu4v0t	cmw0zczj9000007l5ouosr1w0	cmv9y3s4e00060qoj7eq8hk4u	cmv9y3yqp00130qojsdiqgsis	3	Meh	2026-11-04 23:59:53.498
\.


--
-- Data for Name: Cancha; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public."Cancha" (id, "complejoId", deporte, "tipoSuperficie", capacidad, "precioBase", "horaApertura", "horaCierre", "duracionTurnoMin", "createdAt", "updatedAt", nombre, activo, "porcentajeSena", "minAdvanceMinutes") FROM stdin;
cmv9y3u48000l0qojbbexppnx	cmv9y3tja000h0qojv2nla6z4	FUTBOL_5	CESPED_SINTETICO	10	60000.00	09:00	00:00	60	2026-10-15 19:42:24.056	2026-10-15 19:42:24.056	Cancha 1	t	\N	\N
cmv9y3up0000n0qojqox1v48h	cmv9y3tja000h0qojv2nla6z4	FUTBOL_5	CESPED_SINTETICO	10	60000.00	09:00	00:00	60	2026-10-15 19:42:24.804	2026-10-15 19:42:24.804	Cancha 2	t	\N	\N
cmv9y3v9q000p0qoje92yxhhb	cmv9y3tja000h0qojv2nla6z4	FUTBOL_5	CESPED_SINTETICO	10	60000.00	09:00	00:00	60	2026-10-15 19:42:25.55	2026-10-15 19:42:25.55	Cancha 3	t	\N	\N
cmv9y3vul000r0qoj4fcusk83	cmv9y3tja000h0qojv2nla6z4	FUTBOL_7	CESPED_SINTETICO	14	90000.00	09:00	00:00	60	2026-10-15 19:42:26.301	2026-10-15 19:42:26.301	Cancha 7	t	\N	\N
cmv9y3x03000x0qojhcburx5q	cmv9y3wfb000t0qojvjf1q4g9	FUTBOL_5	CESPED_SINTETICO	10	60000.00	09:00	00:00	60	2026-10-15 19:42:27.795	2026-10-15 19:42:27.795	Cancha 1	t	\N	\N
cmv9y3xkz000z0qojgw63jxbr	cmv9y3wfb000t0qojvjf1q4g9	FUTBOL_5	CESPED_SINTETICO	10	60000.00	09:00	00:00	60	2026-10-15 19:42:28.547	2026-10-15 19:42:28.547	Cancha 2	t	\N	\N
cmv9y3y5v00110qoj06j7gamb	cmv9y3wfb000t0qojvjf1q4g9	PADEL	CEMENTO	4	40000.00	08:00	00:00	90	2026-10-15 19:42:29.299	2026-10-15 19:42:29.299	Pádel	t	50	\N
cmv9y3zbh00160qojicf22704	cmv9y3yqp00130qojsdiqgsis	FUTBOL_5	CESPED_SINTETICO	10	60000.00	09:00	00:00	60	2026-10-15 19:42:30.797	2026-10-15 19:42:30.797	Cancha 1	t	\N	\N
cmv9y3zwx00180qojsiga3msk	cmv9y3yqp00130qojsdiqgsis	FUTBOL_5	CESPED_SINTETICO	10	60000.00	09:00	00:00	60	2026-10-15 19:42:31.569	2026-10-15 19:42:31.569	Cancha 2	t	\N	\N
cmv9y40hn001a0qojfeqy3uv3	cmv9y3yqp00130qojsdiqgsis	FUTBOL_5	CESPED_SINTETICO	10	60000.00	09:00	00:00	60	2026-10-15 19:42:32.315	2026-10-15 19:42:32.315	Cancha 3	f	\N	\N
cmv9y41n7001g0qojm2z84sy9	cmv9y412f001c0qojoqoizvrc	FUTBOL_11	CESPED_SINTETICO	22	180000.00	10:00	22:00	90	2026-10-15 19:42:33.811	2026-10-15 19:42:33.811	Fútbol 11	t	\N	1440
cmv9y423r001h0qojg031afv4	cmv9y412f001c0qojoqoizvrc	FUTBOL_7	CESPED_SINTETICO	14	90000.00	09:00	00:00	60	2026-10-15 19:42:34.407	2026-10-15 19:42:34.407	Fútbol 7	t	\N	\N
cmv9y42ok001j0qojgq2urx3u	cmv9y412f001c0qojoqoizvrc	TENIS	POLVO_DE_LADRILLO	4	30000.00	08:00	22:00	60	2026-10-15 19:42:35.156	2026-10-15 19:42:35.156	Tenis 1	t	\N	\N
cmv9y439a001m0qoj59p1vghu	cmv9y412f001c0qojoqoizvrc	TENIS	POLVO_DE_LADRILLO	4	30000.00	08:00	22:00	60	2026-10-15 19:42:35.902	2026-10-15 19:42:35.902	Tenis 2	t	\N	\N
cmv9y43v4001p0qoj46n3rpid	cmv9y412f001c0qojoqoizvrc	TENIS	CESPED_NATURAL	4	38000.00	08:00	22:00	60	2026-10-15 19:42:36.688	2026-10-15 19:42:36.688	Tenis Césped	t	\N	\N
cmv9y4519001v0qoj6xbxi3u0	cmv9y44gj001s0qojvn8rkgeg	FUTBOL_5	CESPED_SINTETICO	10	60000.00	09:00	00:00	60	2026-10-15 19:42:38.205	2026-10-15 19:42:38.205	Cancha 1	t	\N	\N
cmv9y45m1001x0qoj7bqi6uqa	cmv9y44gj001s0qojvn8rkgeg	FUTBOL_5	CESPED_SINTETICO	10	60000.00	09:00	00:00	60	2026-10-15 19:42:38.953	2026-10-15 19:42:38.953	Cancha 2	t	\N	\N
cmv9y466y001z0qojnhsqll8i	cmv9y44gj001s0qojvn8rkgeg	FUTBOL_5	CEMENTO	10	45000.00	09:00	00:00	60	2026-10-15 19:42:39.706	2026-10-15 19:42:39.706	Cancha 3	t	\N	\N
cmv9y46ro00210qojkgj7tqdi	cmv9y44gj001s0qojvn8rkgeg	FUTBOL_11	CESPED_SINTETICO	22	180000.00	10:00	22:00	90	2026-10-15 19:42:40.452	2026-10-15 19:42:40.452	Fútbol 11	t	\N	1440
cmv9y47ti00240qojcus2yb4r	cmv9y478b00220qojzi4ipl9t	FUTBOL_5	CEMENTO	10	45000.00	09:00	00:00	60	2026-10-15 19:42:41.814	2026-10-15 19:42:41.814	Cancha 1	t	\N	\N
cmv9y48e700260qojl7xc5mlm	cmv9y478b00220qojzi4ipl9t	FUTBOL_5	CEMENTO	10	45000.00	09:00	00:00	60	2026-10-15 19:42:42.559	2026-10-15 19:42:42.559	Cancha 2	t	\N	\N
cmv9y49jp002a0qojcih9lzk6	cmv9y48z000280qoj7831r45j	FUTBOL_7	CESPED_SINTETICO	14	90000.00	09:00	00:00	60	2026-10-15 19:42:44.053	2026-10-15 19:42:44.053	Cancha 1	t	\N	\N
cmv9y4apc002e0qojpw11z6wo	cmv9y4a4l002c0qojtucv4564	FUTBOL_5	CESPED_SINTETICO	10	60000.00	09:00	00:00	60	2026-10-15 19:42:45.552	2026-10-15 19:42:45.552	Cancha 1	t	\N	\N
cmv9y4bux002j0qojebbzbn0i	cmv9y4ba6002g0qojgbo7mkkl	FUTBOL_5	CESPED_SINTETICO	10	60000.00	09:00	00:00	60	2026-10-15 19:42:47.049	2026-10-15 19:42:47.049	Cancha 1	t	\N	\N
cmv9y4cfm002l0qoj29bixa3h	cmv9y4ba6002g0qojgbo7mkkl	FUTBOL_5	CESPED_SINTETICO	10	60000.00	09:00	00:00	60	2026-10-15 19:42:47.794	2026-10-15 19:42:47.794	Cancha 2	t	\N	\N
cmv9y4dh7002o0qojo1s1fg7s	cmv9y4d0h002n0qojv3sb0azf	FUTBOL_5	CESPED_SINTETICO	10	60000.00	09:00	00:00	60	2026-10-15 19:42:49.147	2026-10-15 19:42:49.147	Cancha 1	t	\N	\N
cmv9y4e1x002q0qoj95cad4a5	cmv9y4d0h002n0qojv3sb0azf	FUTBOL_5	CESPED_SINTETICO	10	60000.00	09:00	00:00	60	2026-10-15 19:42:49.893	2026-10-15 19:42:49.893	Cancha 2	t	\N	\N
\.


--
-- Data for Name: Complejo; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public."Complejo" (id, nombre, direccion, zona, contacto, "duenioId", "createdAt", "updatedAt", activo, "porcentajeSenaDefault", "minAdvanceMinutesDefault", "cancellationHours", "estadoAprobacion", "motivoRechazo") FROM stdin;
cmv9y3tja000h0qojv2nla6z4	Salguero Fútbol	Av. Costanera Rafael Obligado 1221	Palermo	11 5263-3800	cmv9y3rin00010qoj7laj7yi0	2026-09-15 19:42:23.136	2026-10-15 19:42:23.302	t	30	180	24	APROBADO	\N
cmv9y3wfb000t0qojvjf1q4g9	Grün FC	Av. Crisólogo Larralde 999	Núñez	11 2456-2500	cmv9y3rin00010qoj7laj7yi0	2026-09-15 19:42:26.899	2026-10-15 19:42:27.047	t	30	180	12	APROBADO	\N
cmv9y3yqp00130qojsdiqgsis	Caballito Norte	Av. Avellaneda 1423	Caballito	11 2365-7698	cmv9y3rin00010qoj7laj7yi0	2026-09-15 19:42:29.898	2026-10-15 19:42:30.049	t	25	180	72	APROBADO	\N
cmv9y412f001c0qojoqoizvrc	Club CASA - Tenis y Fútbol	Av. Pres. Figueroa Alcorta 7101	Belgrano	11 3655-5478	cmv9y3rmx00020qojj6dx0o5r	2026-09-15 19:42:32.915	2026-10-15 19:42:33.063	t	40	180	48	APROBADO	\N
cmv9y44gj001s0qojvn8rkgeg	El Polideportivo	Av. Crámer 3249	Núñez	11 6432-3180	cmv9y3rr500030qoj79b4qxzf	2026-09-15 19:42:37.305	2026-10-15 19:42:37.459	t	30	180	24	APROBADO	\N
cmv9y478b00220qojzi4ipl9t	Nueva Generación - Sede Boedo	Quintino Bocayuva 1241	Boedo	11 3259-9787	cmv9y3rr500030qoj79b4qxzf	2026-09-15 19:42:40.9	2026-10-15 19:42:41.051	t	20	180	24	APROBADO	\N
cmv9y48z000280qoj7831r45j	Complejo Gustavo Costas - Boedo 5	Av. Boedo 47	Almagro	11 3619-9782	cmv9y3s0400050qojogu76dkr	2026-09-15 19:42:43.16	2026-10-15 19:42:43.308	t	30	180	24	APROBADO	\N
cmv9y4a4l002c0qojtucv4564	Marangoni Fútbol y Deporte	Av. Cnel. Díaz 2300	Palermo	11 4804-0524	cmv9y3rmx00020qojj6dx0o5r	2026-10-12 19:42:44.654	2026-10-15 19:42:44.805	t	30	180	24	PENDIENTE	\N
cmv9y4ba6002g0qojgbo7mkkl	Campus Sport Arena	Maza 754	Almagro	11 4956-0717	cmv9y3rvu00040qoj727mo1cb	2026-10-12 19:42:46.151	2026-10-15 19:42:46.302	t	30	180	24	PENDIENTE	\N
cmv9y4d0h002n0qojv3sb0azf	Club Social y Deportivo Villa Malcolm	Av. Córdoba 5064	Villa Crespo	11 5107-6616	cmv9y3rvu00040qoj727mo1cb	2026-10-12 19:42:48.395	2026-10-15 19:42:48.545	t	30	180	24	RECHAZADO	Faltan fotos de las canchas: subí al menos una para que los jugadores vean cómo es el complejo.
\.


--
-- Data for Name: Disputa; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public."Disputa" (id, "reservaId", "jugadorId", descripcion, estado, decision, "comentarioAdmin", "adminId", "resueltaEn", "createdAt") FROM stdin;
cmv9y4f59009p0qoj45vkkxdb	1881be43-80fd-4c7a-9deb-1c5f065bc897	cmv9y3s4e00060qoj7eq8hk4u	Llegamos 10 minutos antes y la cancha estaba ocupada por otro grupo. Esperamos media hora y nadie del complejo nos atendió, así que nos fuimos.	ABIERTA	\N	\N	\N	\N	2026-10-13 19:00:00
cmv9y4fqd009r0qojc3mpl8h6	ce56e0f6-7fe5-4324-88a0-3ec6ee22a01b	cmv9y3sl6000a0qojzojr1f1e	Fuimos y jugamos. Le avisamos al encargado al llegar, no sé por qué figura que no fuimos.	ABIERTA	\N	\N	\N	\N	2026-10-14 19:00:00
cmv9y4g6z009s0qojdaiy35c6	d4dde501-9398-42be-a714-efe5c259d241	cmv9y3s4e00060qoj7eq8hk4u	Fuimos y jugamos el partido completo. Tengo la foto de la cancha a la hora del turno.	RESUELTA	A_FAVOR_JUGADOR	La foto tiene la fecha y la hora del turno y se ve la cancha del complejo. Se da de baja la falta.	cmv9y3rec00000qojezt8jfku	2026-10-09 14:00:00	2026-10-07 19:00:00
cmv9y4gru009u0qoj40wtoj22	648b6d95-194a-499a-89ae-a7e9a3fefa25	cmv9y3s4e00060qoj7eq8hk4u	No pudimos ir porque se nos complicó a última hora, pero avisamos por teléfono el mismo día.	RESUELTA	A_FAVOR_DUENIO	El propio reclamo dice que no fueron al turno. Avisar no reemplaza cancelar a tiempo, así que la falta queda.	cmv9y3rec00000qojezt8jfku	2026-10-08 14:00:00	2026-10-06 19:00:00
cmva454kr000008l70xtvh042	cbdee8ea-efbe-4099-9868-f62e25adcb91	cmv9y3s4e00060qoj7eq8hk4u	Me re cagaron loco, yo fui, hasta le pegué al árbitro loco	RESUELTA	A_FAVOR_DUENIO	Jodete gil, relleno obligatorio para alcanzar los 20 caracteres	cmv9y3rec00000qojezt8jfku	2026-10-15 22:32:53.741	2026-10-15 22:31:21.963
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
cmv9y4f9i009q0qoj5f7mt6lo	cmv9y4f59009p0qoj45vkkxdb	/seed/cancha-1.jpg	IMAGEN	0
cmv9y4gb6009t0qoj1rqj64y2	cmv9y4g6z009s0qojdaiy35c6	/seed/cancha-2.jpg	IMAGEN	0
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
cmv9y3tng000i0qojnysqjasx	cmv9y3tja000h0qojv2nla6z4	/seed/cancha-3.jpg	0	t
cmv9y3tng000j0qojtj7xmlx5	cmv9y3tja000h0qojv2nla6z4	/seed/cancha-4.jpg	1	t
cmv9y3tng000k0qojkgzxt12a	cmv9y3tja000h0qojv2nla6z4	/seed/cancha-1.jpg	2	t
cmv9y3wjg000u0qoj91va9gmf	cmv9y3wfb000t0qojvjf1q4g9	/seed/cancha-2.jpg	0	t
cmv9y3wjg000v0qojzzt55jl4	cmv9y3wfb000t0qojvjf1q4g9	/seed/cancha-3.jpg	1	t
cmv9y3wjg000w0qojlgvzjbad	cmv9y3wfb000t0qojvjf1q4g9	/seed/cancha-4.jpg	2	t
cmv9y3yuv00140qojf6h1i13c	cmv9y3yqp00130qojsdiqgsis	/seed/cancha-1.jpg	0	t
cmv9y3yuv00150qojujkd62ye	cmv9y3yqp00130qojsdiqgsis	/seed/cancha-2.jpg	1	t
cmv9y416l001d0qojjp2bd9qd	cmv9y412f001c0qojoqoizvrc	/seed/cancha-3.jpg	0	t
cmv9y416l001e0qojk4khamjs	cmv9y412f001c0qojoqoizvrc	/seed/cancha-4.jpg	1	t
cmv9y416l001f0qoj1l6q8562	cmv9y412f001c0qojoqoizvrc	/seed/cancha-1.jpg	2	t
cmv9y44ko001t0qojiq9gj2o7	cmv9y44gj001s0qojvn8rkgeg	/seed/cancha-2.jpg	0	t
cmv9y44ko001u0qojifqiiz7p	cmv9y44gj001s0qojvn8rkgeg	/seed/cancha-3.jpg	1	t
cmv9y47ch00230qojmvqg2l9e	cmv9y478b00220qojzi4ipl9t	/seed/cancha-4.jpg	0	t
cmv9y493600290qojb3xy0bna	cmv9y48z000280qoj7831r45j	/seed/cancha-1.jpg	0	t
cmv9y4a8q002d0qojvngdebjq	cmv9y4a4l002c0qojtucv4564	/seed/cancha-2.jpg	0	t
cmv9y4beb002h0qojkd5b929u	cmv9y4ba6002g0qojgbo7mkkl	/seed/cancha-3.jpg	0	t
cmv9y4beb002i0qojc6keqady	cmv9y4ba6002g0qojgbo7mkkl	/seed/cancha-4.jpg	1	t
\.


--
-- Data for Name: Intento; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public."Intento" (id, clave, "createdAt") FROM stdin;
cmv9y5gvk0001hwojwzothes5	login-ip:::1	2026-10-15 19:43:40.209
cmv9y6uoq0003hwojstql2t9r	login-ip:::1	2026-10-15 19:44:44.762
cmw2s2h6g000008ids3hkh983	login:pipo@tocayjuga.com:190.210.36.110	2026-11-04 23:58:42.04
cmw2s2h7t000108idjxz23b17	login-ip:190.210.36.110	2026-11-04 23:58:42.089
cmw3wz25200038ovxqm7gqqdp	login-ip:::1	2026-11-05 19:03:46.838
cmvy8e1ql000208l2wf0xcukf	registro:190.210.36.110	2026-11-01 19:36:44.877
cmw3wzh7w00058ovx3frel4vh	login-ip:::1	2026-11-05 19:04:06.38
cmw3wztwe00078ovxllbrbhgw	login-ip:::1	2026-11-05 19:04:22.814
cmw3x0h1200098ovx36omibku	login-ip:::1	2026-11-05 19:04:52.79
cmw3x1qen000b8ovxc5j09wot	login-ip:::1	2026-11-05 19:05:51.599
\.


--
-- Data for Name: Pago; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public."Pago" (id, "reservaId", monto, porcentaje, devuelto, "createdAt", "cancellationHours") FROM stdin;
cmv9y4ew6002v0qojybdoc84o	196feb14-f611-4013-8f3d-a5e920a7e4f6	12000.00	40	f	2026-09-30 19:42:50.681	48
cmv9y4ew6002w0qojph2ntp1u	0e90795e-da8d-4117-9726-345ba70fe30f	22500.00	30	f	2026-10-01 19:42:50.683	24
cmv9y4ew6002x0qojxq9svuf7	648b6d95-194a-499a-89ae-a7e9a3fefa25	22500.00	30	f	2026-10-02 19:42:50.683	24
cmv9y4ew6002y0qojdgxcgoju	d4dde501-9398-42be-a714-efe5c259d241	24000.00	50	f	2026-10-03 19:42:50.684	12
cmv9y4ew6002z0qojap1lva5j	f6bbb4a5-24fd-49c1-9485-7bbdfe6b4987	18750.00	25	f	2026-10-04 19:42:50.684	72
cmv9y4ew600300qoje0erlks6	5f3769d4-ee0d-48ee-83bd-2010a7295dd6	33000.00	30	f	2026-10-05 19:42:50.684	24
cmv9y4ew600310qojsa28shm8	59cbe979-73cb-493e-a54b-11cf6794b0ed	33000.00	30	f	2026-10-06 19:42:50.685	24
cmv9y4ew600320qojgemby7oq	f94262e1-3735-4d56-a513-c5ffdb5853f1	44000.00	40	t	2026-10-08 19:42:50.685	48
cmv9y4ew600330qojrwtjcced	1881be43-80fd-4c7a-9deb-1c5f065bc897	22500.00	30	f	2026-10-09 19:42:50.685	24
cmv9y4ew600340qoj9b6qgixr	7eb3d650-9ace-4306-ab53-2c9e4485a638	22500.00	30	f	2026-10-10 19:42:50.686	24
cmv9y4ew600350qoj8xmj0qri	22045420-07ec-4d86-b2f1-22807287cb84	22500.00	30	f	2026-10-11 19:42:50.686	12
cmv9y4ew600360qojn1v9jz38	d4b805eb-acf1-4c77-a432-adfa53e930f3	22500.00	30	f	2026-10-12 19:42:50.686	24
cmv9y4ew600370qojj87ehjqf	cbdee8ea-efbe-4099-9868-f62e25adcb91	18000.00	30	f	2026-10-13 19:42:50.687	24
cmv9y4ew600380qojj5601qu9	1287217f-4070-4ee9-826b-ffc29e33c947	22500.00	30	f	2026-10-13 19:42:50.687	24
cmv9y4ew600390qoj89lpo1ah	a42b124d-e38e-4a44-914e-11f5d2fa9842	14400.00	40	t	2026-10-13 19:42:50.688	48
cmv9y4ew6003a0qoj1t2h3gaq	363835f0-bafd-4b94-bdca-e33f264a3b5c	24000.00	50	f	2026-10-13 19:42:50.688	12
cmv9y4ew6003b0qojjq56oof1	1b4c72d8-930e-4087-8dea-217ae1453b96	22500.00	30	f	2026-10-13 19:42:50.688	24
cmv9y4ew6003c0qoj67quxtfs	f6e56665-3fb0-430d-b8b3-a7e057c8a640	12000.00	40	f	2026-10-13 19:42:50.688	48
cmv9y4ew6003d0qojmhbzsfa8	ce56e0f6-7fe5-4324-88a0-3ec6ee22a01b	11000.00	20	f	2026-10-10 19:42:50.688	24
cmv9y4ew6003e0qojzetqllqv	d34d3f47-b0e8-4337-93e5-4a2369a796de	22500.00	30	f	2026-10-07 19:42:50.688	24
cmv9y4ew6003f0qoj9rrtnza9	4856d72d-f4fc-4a25-b894-a317a62eafc2	22500.00	30	f	2026-10-05 19:42:50.688	24
cmv9y4ew6003g0qojzcpk879k	7ba5f726-aa02-4854-b529-e2bc026b42c6	18750.00	25	f	2026-10-07 19:42:50.689	72
cmv9y4ew6003h0qojoelvcfrl	f7ad5392-fb90-452c-8d93-a0bd1b219826	18750.00	25	f	2026-10-09 19:42:50.689	72
cmv9y4ew6003i0qojporrns9o	5b421db3-c355-45a3-8d20-5346f1b78229	18000.00	30	f	2026-10-03 19:42:50.689	24
cmv9y4ew6003j0qojcn3wl29m	5d74d040-8296-4727-b70d-f470fcf7c297	22500.00	30	f	2026-10-03 19:42:50.689	24
cmv9y4ew6003k0qojvlp24n1c	5699f1b5-5cce-4efd-85a8-d3b9992841b1	22500.00	30	f	2026-10-03 19:42:50.69	24
cmv9y4ew6003l0qoj6hufkzoj	5453450e-d604-4d3b-b17b-e0fb37c533c6	18000.00	30	f	2026-10-04 19:42:50.69	24
cmv9y4ew6003m0qojgeqgd2x5	dc99040c-fb1e-4a4a-9993-6791a0ce63c2	22500.00	30	f	2026-10-04 19:42:50.69	24
cmv9y4ew6003n0qojgh423d4v	71efd0a7-c614-480d-a9ac-d3168459ead7	18000.00	30	f	2026-10-05 19:42:50.691	24
cmv9y4ew6003o0qojy35k4isj	72c913ac-d063-4df7-bd77-5780020a2def	18000.00	30	f	2026-10-06 19:42:50.691	24
cmv9y4ew6003p0qojg2r43ydh	e1b65499-1cef-43fd-a84e-77d5f6753ac1	18000.00	30	f	2026-10-06 19:42:50.691	24
cmv9y4ew6003q0qoj4qh2sonk	93c4681f-f9df-4f2b-ad58-1dac2a585a6e	22500.00	30	f	2026-10-08 19:42:50.692	24
cmv9y4ew6003r0qojnm1f6y10	e3b75be7-6f70-455e-9eda-39446c01022e	22500.00	30	f	2026-10-10 19:42:50.692	24
cmv9y4ew6003s0qojixr2yncs	9fae317c-63a2-48a0-8d55-5e1e3b9d457f	18000.00	30	f	2026-10-12 19:42:50.692	24
cmv9y4ew6003t0qojbr1kw3g1	68892466-8851-4ddb-a315-0eef59749120	18000.00	30	f	2026-10-13 19:42:50.692	24
cmv9y4ew6003u0qojnjbc8ywz	7fff8e95-d77d-4a42-baed-be7d4f1f1c32	18000.00	30	t	2026-10-13 19:42:50.693	24
cmv9y4ew6003v0qojyj23xw2x	b2a55666-2de6-4cc4-9ef5-23328b8f7c2b	18000.00	30	f	2026-10-13 19:42:50.693	24
cmv9y4ew6003w0qoj9i6j2v4z	ef009a21-ccdb-431c-89b2-75aad41754d4	22500.00	30	f	2026-10-13 19:42:50.693	24
cmv9y4ew6003x0qojzkpt6vop	64471feb-87a5-4420-987d-9323118e4ff2	22500.00	30	f	2026-10-13 19:42:50.693	24
cmv9y4ew6003y0qojqj3xi6mz	c774c8fc-b400-4f4b-ac6a-139bdfc31f55	22500.00	30	f	2026-10-13 19:42:50.693	24
cmv9y4ew6003z0qojslz40yya	e1104ada-6542-47e2-b781-3a011d81d537	18000.00	30	f	2026-10-13 19:42:50.693	24
cmv9y4ew600400qoju3i98cx8	fac9e418-9e13-442f-a9a9-9e0aa296a91c	22500.00	30	f	2026-10-05 19:42:50.694	24
cmv9y4ew600410qojej133sv8	a61e5c7d-f0a9-4df9-832a-21b6356ae769	22500.00	30	f	2026-10-05 19:42:50.694	24
cmv9y4ew600420qojo9mgv3s4	61f6803d-d165-407f-86b7-f2902164cb20	22500.00	30	f	2026-10-06 19:42:50.694	24
cmv9y4ew600430qoj8dtxftxs	d63e18dd-b4e6-4e7f-8459-a2d394c41b81	18000.00	30	f	2026-10-07 19:42:50.694	24
cmv9y4ew600440qojkium47qd	18f90326-b711-4cde-a911-f8da84a76718	22500.00	30	f	2026-10-10 19:42:50.695	24
cmv9y4ew600450qojq84qm29n	e0df9f25-c541-4a3a-9986-9ea01dafc115	22500.00	30	f	2026-10-04 19:42:50.696	24
cmv9y4ew600460qojr3avydmp	9fa2293d-69b1-4dfe-93c2-e3f0604edafb	22500.00	30	f	2026-10-05 19:42:50.696	24
cmv9y4ew600470qojopqbx9ll	79911ceb-28bf-4da3-8689-b84bdf950233	22500.00	30	f	2026-10-06 19:42:50.696	24
cmv9y4ew600480qoje2cr0xxn	d77ff558-9437-4527-9d73-494dafc14c38	22500.00	30	f	2026-10-06 19:42:50.696	24
cmv9y4ew600490qojzjcrnan3	07dc35d1-ed9b-4b0c-95a1-0ae4a80f78e1	18000.00	30	f	2026-10-07 19:42:50.696	24
cmv9y4ew6004a0qojk277wswz	2c9b9674-6fd8-411e-94fc-b5e10ed13727	18000.00	30	f	2026-10-08 19:42:50.697	24
cmv9y4ew6004b0qojrbmt5l1c	91f99899-8f9c-46e9-aa3e-dd2c3b8a1697	22500.00	30	f	2026-10-11 19:42:50.697	24
cmv9y4ew6004c0qojnqtkf2dc	e9d72026-b394-4be1-a643-dfc3e7098006	18000.00	30	f	2026-10-13 19:42:50.697	24
cmv9y4ew6004d0qojbvrwiv2b	af0b4ade-4879-4bf6-8ada-f02868e894a8	22500.00	30	f	2026-10-13 19:42:50.697	24
cmv9y4ew6004e0qojevfpwndw	96ee9d41-0eb4-4675-aff9-1b0d864ada89	22500.00	30	f	2026-10-13 19:42:50.698	24
cmv9y4ew6004f0qojcx1604nn	4af0f597-8908-4f3d-b1dd-b2082af3e8d8	27000.00	30	f	2026-10-03 19:42:50.698	24
cmv9y4ew6004g0qoj8jf9j6rf	9219650b-53d5-4a23-9ae7-4b1853dcbef1	27000.00	30	f	2026-10-05 19:42:50.698	24
cmv9y4ew6004h0qojpkdhru72	500e7941-cc26-44a8-a7d9-0ea489948ff9	27000.00	30	f	2026-10-07 19:42:50.699	24
cmv9y4ew6004i0qojrhez2zcp	4504c1f8-ac20-433a-91fa-5fdf04c8741d	33000.00	30	f	2026-10-07 19:42:50.699	24
cmv9y4ew6004j0qoj5ufux54a	2288d2eb-c2e8-44a0-8014-747eee6b4ae4	33000.00	30	f	2026-10-08 19:42:50.7	24
cmv9y4ew6004k0qojl08vc6ao	07a1d3bc-321b-4a8c-a009-b14309675a03	27000.00	30	f	2026-10-09 19:42:50.7	24
cmv9y4ew6004l0qojdbypppyr	55b80eed-180e-417b-94cd-d18b4d7719fb	27000.00	30	f	2026-10-12 19:42:50.7	24
cmv9y4ew6004m0qojqi7gh4sz	92fe5a8e-03fa-423d-90a9-b487c3512142	33000.00	30	f	2026-10-12 19:42:50.7	24
cmv9y4ew6004n0qojj939l8bn	060b4ea9-349e-4574-b501-6593c41ccb84	33000.00	30	f	2026-10-12 19:42:50.7	24
cmv9y4ew6004o0qojl493niwn	85bb8b04-96d0-4fa3-979f-c38f269a4e3c	27000.00	30	f	2026-10-13 19:42:50.701	24
cmv9y4ew6004p0qojo9ymjvk7	c1893c25-49a5-4ce3-9c8f-9e4d22776dc9	27000.00	30	f	2026-10-13 19:42:50.701	24
cmv9y4ew6004q0qoj737ykun2	72067873-6bf2-494e-9437-3ee76419a0b1	33000.00	30	f	2026-10-13 19:42:50.701	24
cmv9y4ew6004r0qojtn5jnkvq	5bdf7758-6a9b-4b4c-857f-c2f0bd62c914	33000.00	30	f	2026-10-13 19:42:50.701	24
cmv9y4ew6004s0qojxi37itrq	22e602dc-21cb-469b-935a-0ca5cbad2b01	33000.00	30	f	2026-10-13 19:42:50.701	24
cmv9y4ew6004t0qojwqmghcsj	0dfc6a3d-3e9c-4df3-b412-19ddee72e07f	18000.00	30	f	2026-10-03 19:42:50.702	12
cmv9y4ew6004u0qojheirdcru	b7022b5e-12e3-4b56-a857-f69af78a1951	18000.00	30	f	2026-10-03 19:42:50.702	12
cmv9y4ew6004v0qojdb68exev	96c5da01-9f51-4805-aaf9-c57da54408a1	22500.00	30	f	2026-10-03 19:42:50.702	12
cmv9y4ew6004w0qojiw2d5hud	87111345-8fb0-447a-b7e8-25dd4fe4757d	22500.00	30	f	2026-10-05 19:42:50.702	12
cmv9y4ew6004x0qoj5xl881ki	3f3a8125-d414-41ae-b848-49e529966ecb	22500.00	30	f	2026-10-07 19:42:50.702	12
cmv9y4ew6004y0qoj4rfllcm7	b9e92adb-d37b-41a2-9f7e-4f52f1deeca2	22500.00	30	f	2026-10-11 19:42:50.703	12
cmv9y4ew6004z0qoj6y5g41hs	0541271c-377d-4480-a425-a505d2f8393e	18000.00	30	f	2026-10-12 19:42:50.703	12
cmv9y4ew600500qojp7nrucmn	d317dc5e-0900-4eb4-b64a-001f3b733c5f	18000.00	30	f	2026-10-13 19:42:50.703	12
cmv9y4ew600510qoj3eb6z6r4	b2e8f960-85fd-428e-b91a-4abcd1f1c8a8	22500.00	30	f	2026-10-13 19:42:50.703	12
cmv9y4ew600520qoj1d1oiw3h	ed3e6a8b-8fc3-4008-9748-a8beceeb8b12	22500.00	30	f	2026-10-13 19:42:50.703	12
cmv9y4ew600530qojly2xwgug	8a843ad3-37ae-4956-9412-8e2169c15ded	18000.00	30	t	2026-10-13 19:42:50.703	12
cmv9y4ew600540qoj3wusa18t	3808ab97-7428-49b4-84f4-668caddb8e5e	18000.00	30	f	2026-10-13 19:42:50.704	12
cmv9y4ew600550qojsnt7fkep	49338658-9ca1-4fe4-8ca3-0992334a541a	22500.00	30	f	2026-10-13 19:42:50.704	12
cmv9y4ew600560qoj0510m7s0	03651ea3-95d7-4c6f-bc1c-b28e11348fe6	18000.00	30	f	2026-10-13 19:42:50.704	12
cmv9y4ew600570qojbi3bufdc	82f4cc3a-28f5-4b01-922f-b5bc46910421	18000.00	30	f	2026-10-04 19:42:50.704	12
cmv9y4ew600580qojkon1khnz	48a4340e-1c0e-4b04-a7b1-29d5bbc7e574	22500.00	30	f	2026-10-06 19:42:50.704	12
cmv9y4ew600590qoj7bmuls98	86ce0e3c-1812-464b-85d5-fbb3e169b95e	22500.00	30	f	2026-10-06 19:42:50.704	12
cmv9y4ew6005a0qojrp6mit19	4606023a-8547-4b6a-99ce-75a0dc4844b4	22500.00	30	f	2026-10-07 19:42:50.705	12
cmv9y4ew6005b0qojwur3baql	db1588b5-3ea8-485a-88e1-485ab2cf590d	18000.00	30	f	2026-10-09 19:42:50.705	12
cmv9y4ew6005c0qojgud4ep68	6483d4e0-2d50-42ec-821b-13341faaac74	22500.00	30	f	2026-10-09 19:42:50.705	12
cmv9y4ew6005d0qoj5isqzapg	1938a6ea-dea8-4f5e-b64b-aa44b4ff9521	18000.00	30	t	2026-10-12 19:42:50.705	12
cmv9y4ew6005e0qojgtjpbuy6	0905f655-18c6-4495-ab7e-58fdb94d242a	22500.00	30	f	2026-10-13 19:42:50.706	12
cmv9y4ew6005f0qojli7nh5yi	7b7a1022-4281-4c9d-a0d1-572859b357fd	18000.00	30	f	2026-10-13 19:42:50.706	12
cmv9y4ew6005g0qojf9ip2fmn	2174a5f8-5b8c-42d2-9ce3-5c0b7a478122	24000.00	50	f	2026-10-03 19:42:50.706	12
cmv9y4ew6005h0qoj2kcpoywf	ed9aaf66-bcee-4186-bf13-fca268326dcf	20000.00	50	f	2026-10-04 19:42:50.706	12
cmv9y4ew6005i0qojbkrhl5j5	9574e93a-4505-451f-836f-44a7483bdf9c	13333.34	50	f	2026-10-04 19:42:50.706	12
cmv9y4ew6005j0qoj7a1crbc9	2150b71b-79ee-4bbe-ab6a-452c26291973	20000.00	50	f	2026-10-05 19:42:50.707	12
cmv9y4ew6005k0qojm1r9c0ty	d66145d2-482f-49ea-bb17-879343f9e396	13333.34	50	f	2026-10-11 19:42:50.707	12
cmv9y4ew6005l0qoj4wjvnbbu	2f278932-2da0-42f6-b481-427e58c1375a	24000.00	50	f	2026-10-12 19:42:50.707	12
cmv9y4ew6005m0qojqhwt97uo	a90870c1-52c5-4a7c-a971-df3fccc96667	24000.00	50	f	2026-10-13 19:42:50.707	12
cmv9y4ew6005n0qoj4rh9d9tg	7f46b8f7-e127-4e71-82b6-edae3e1915e9	20000.00	50	f	2026-10-13 19:42:50.707	12
cmv9y4ew6005o0qojxi87795f	1a5f1d91-8858-43a5-b290-a66e1a0a0aea	20000.00	50	f	2026-10-13 19:42:50.708	12
cmv9y4ew6005p0qojbg98rrlv	1da01233-2e1e-4f68-a318-7adfe0bc07de	24000.00	50	f	2026-10-13 19:42:50.708	12
cmv9y4ew6005q0qoj5nxis7gp	4b708359-0123-435b-8287-837f1a452bf2	24000.00	50	f	2026-10-13 19:42:50.708	12
cmv9y4ew6005r0qojs7gfr05p	7fea0584-4eee-4ca1-aa38-8f93b10db64e	18750.00	25	f	2026-10-04 19:42:50.708	72
cmv9y4ew6005s0qoj578y1wrg	6f47e56c-2be8-4b5b-8707-9ec63f0dedc4	18750.00	25	f	2026-10-06 19:42:50.708	72
cmv9y4ew6005t0qojhse4xaiz	773354f9-bc9d-460f-b373-7f68283876da	18750.00	25	f	2026-10-11 19:42:50.709	72
cmv9y4ew6005u0qojgalifa4a	da308708-bce7-4545-b655-29421422b1a7	18750.00	25	f	2026-10-12 19:42:50.709	72
cmv9y4ew6005v0qojh1lkkpfo	e6b13541-8082-4640-b900-556c4d488402	15000.00	25	f	2026-10-13 19:42:50.71	72
cmv9y4ew6005w0qojro16djl6	f6166c20-afa1-4d2f-b376-8eff2f3987ec	18750.00	25	f	2026-10-13 19:42:50.71	72
cmv9y4ew6005x0qoj8a920oab	425153ce-85b9-4f9b-9641-9a228ae288d3	15000.00	25	f	2026-10-13 19:42:50.71	72
cmv9y4ew6005y0qojyewppn5p	cccab1c8-6968-4944-bad7-fc1c8f81773f	15000.00	25	f	2026-10-13 19:42:50.71	72
cmv9y4ew6005z0qojamxk42rf	286330c9-af37-49bf-91ee-b61bb03d9ecb	18750.00	25	f	2026-10-13 19:42:50.71	72
cmv9y4ew600600qojnlblgns5	7ef7e737-a3da-4257-aaf0-19168f1a0fd9	18750.00	25	f	2026-10-13 19:42:50.711	72
cmv9y4ew600610qojr2f09ltm	713d2c6a-c8ea-452b-817a-e806ad35facd	15000.00	25	f	2026-10-13 19:42:50.711	72
cmv9y4ew600620qojgza2swfy	54003fcb-7fc0-4d10-97f3-527aa4ec683f	18750.00	25	t	2026-10-13 19:42:50.711	72
cmv9y4ew600630qojpa1gv7fd	3b3147b4-51a2-4587-85ac-7f1b87edc130	18750.00	25	f	2026-10-03 19:42:50.711	72
cmv9y4ew600640qoj04wszr6t	2df651f8-134b-4993-a9c0-4f53ba578dfb	18750.00	25	t	2026-10-04 19:42:50.711	72
cmv9y4ew600650qojmp0lly5i	dd10d3ed-e591-4953-8121-a1823ec0ad30	15000.00	25	f	2026-10-05 19:42:50.711	72
cmv9y4ew600660qoje9wgq1c0	e8535b3c-e0b3-45b5-9af9-69615b5b8832	15000.00	25	f	2026-10-07 19:42:50.711	72
cmv9y4ew600670qojai2dy4ef	a1217dec-b5bb-4667-be1c-b3faa5f43c59	18750.00	25	f	2026-10-08 19:42:50.711	72
cmv9y4ew600680qojzksl0jre	a1dc6dd6-94be-49f6-b523-219d715fdf97	15000.00	25	f	2026-10-13 19:42:50.712	72
cmv9y4ew600690qojfvt2dbkj	f597ca4d-398e-4587-b3cb-4dd38657e89b	18750.00	25	f	2026-10-13 19:42:50.712	72
cmv9y4ew6006a0qojjyy2y0dz	4a1a8ab8-586a-446a-84a0-5c3beca50b71	18750.00	25	f	2026-10-13 19:42:50.712	72
cmv9y4ew6006b0qoja7x3ccan	470fc81e-fc51-4259-be38-388e4c22c255	15000.00	25	f	2026-10-13 19:42:50.712	72
cmv9y4ew6006c0qojnrrpeo0b	6fe76479-c57a-4523-b819-16f2c394b7bc	18750.00	25	f	2026-10-13 19:42:50.712	72
cmv9y4ew6006d0qojrzid7jep	9ed0cb51-f21c-455c-8a85-6b7d3f30564a	72000.00	40	f	2026-10-09 19:42:50.713	48
cmv9y4ew6006e0qojz5obc2x2	3a0ec837-45c5-433a-9ad6-2a269854e889	72000.00	40	f	2026-10-11 19:42:50.713	48
cmv9y4ew6006f0qoj6cp6kgv9	22c0e63c-c209-441f-ab55-6c17e8719b30	72000.00	40	f	2026-10-12 19:42:50.713	48
cmv9y4ew6006g0qojssq2heqa	27679b9f-cac9-4412-845d-cc5517444404	72000.00	40	f	2026-10-13 19:42:50.713	48
cmv9y4ew6006h0qojl4wuo7xx	117d7ee6-86b7-4b9e-89e0-4da2a99952ba	36000.00	40	f	2026-10-03 19:42:50.713	48
cmv9y4ew6006i0qojm2dscael	4fa19a79-5788-476d-82bc-5ce9759730ae	36000.00	40	f	2026-10-04 19:42:50.713	48
cmv9y4ew6006j0qojcew52h34	faa66f38-12e9-4784-b387-0ba071476deb	36000.00	40	f	2026-10-05 19:42:50.713	48
cmv9y4ew6006k0qoj40adgfw5	935e106b-45b8-4ed8-a787-e7eb0362ea76	44000.00	40	f	2026-10-05 19:42:50.714	48
cmv9y4ew6006l0qojrgltz070	d33262f5-fc16-4d12-ae2b-5b0b522417a5	44000.00	40	f	2026-10-05 19:42:50.714	48
cmv9y4ew6006m0qojt3rolbbi	bd5b26e3-f57b-42a2-973b-627778acafdd	44000.00	40	f	2026-10-06 19:42:50.714	48
cmv9y4ew6006n0qojtjgha7bg	43cc90ed-bb77-4b90-ae43-79f28c42cdd9	36000.00	40	f	2026-10-08 19:42:50.714	48
cmv9y4ew6006o0qoj97ffhjyu	ab52d3ac-ac5e-4169-a6f6-c89cef86e416	44000.00	40	f	2026-10-08 19:42:50.714	48
cmv9y4ew6006p0qoj9o8q6g2m	1ac0bdbe-59a1-4844-8a8b-1da239b57b3d	36000.00	40	f	2026-10-11 19:42:50.714	48
cmv9y4ew6006q0qoj27eim5wk	b281898a-1f63-41a7-a823-eb2abe1cc6ce	44000.00	40	f	2026-10-11 19:42:50.714	48
cmv9y4ew6006r0qojkvi38brg	ecaba87b-0315-43ea-8f6d-119a436ff4f9	44000.00	40	f	2026-10-13 19:42:50.714	48
cmv9y4ew6006s0qojf4hvnb91	5616d86a-2bc4-4ad9-9571-a66164142e5c	44000.00	40	f	2026-10-13 19:42:50.715	48
cmv9y4ew6006t0qojgq7ep81r	505630ca-80de-49e0-9c3a-3d4f9b45a389	44000.00	40	f	2026-10-13 19:42:50.715	48
cmv9y4ew6006u0qojrh5w0448	5044de49-29b5-4a65-a19e-838d322dafe3	44000.00	40	t	2026-10-13 19:42:50.715	48
cmv9y4ew6006v0qoji8hr9gqo	9bf615ea-d309-4324-8ce0-d2066c44e52e	44000.00	40	f	2026-10-13 19:42:50.715	48
cmv9y4ew6006w0qojaieaay70	2beb04f7-e113-4f4e-96be-e2271037cc3b	12000.00	40	f	2026-10-03 19:42:50.715	48
cmv9y4ew6006x0qojfzj33iyz	4bc0f0d1-e7b4-47a1-aea2-22f9c45677a6	12000.00	40	f	2026-10-06 19:42:50.715	48
cmv9y4ew6006y0qojmksgw0bd	7aae1d9b-9741-4427-aa2f-fc292a0a4b95	12000.00	40	f	2026-10-07 19:42:50.715	48
cmv9y4ew6006z0qojthq0p690	1351e4d3-6413-49bc-8c3b-f8863f51a12e	14400.00	40	f	2026-10-08 19:42:50.715	48
cmv9y4ew600700qojvlxgyixk	182ae847-ddc7-4ee8-a52b-d75df64c1bab	12000.00	40	f	2026-10-13 19:42:50.716	48
cmv9y4ew600710qojebl8zqtw	60aaf0d3-9f9d-42a5-b3e2-8123d0f7d9e6	12000.00	40	f	2026-10-03 19:42:50.716	48
cmv9y4ew600720qojd5zpjj7b	aa1c2045-6d20-4a3d-bbca-d96e1eb1a786	12000.00	40	f	2026-10-04 19:42:50.716	48
cmv9y4ew600730qoj0lyac5xj	995af89e-7fa0-4a6e-b305-b5d909e01555	12000.00	40	f	2026-10-05 19:42:50.716	48
cmv9y4ew600740qojrp5o387r	87c0a571-b9c1-452c-8afd-094afcaa5349	12000.00	40	f	2026-10-06 19:42:50.716	48
cmv9y4ew600750qojj88ivp5s	e2a2c6ae-6758-4d55-92e3-990dfe8edc12	12000.00	40	f	2026-10-06 19:42:50.716	48
cmv9y4ew600760qoj4tz737j1	869e79c7-6dbf-418a-a3a8-a5f089a94e12	12000.00	40	f	2026-10-06 19:42:50.717	48
cmv9y4ew600770qojsbvxvivx	8edcb4e9-afe7-4c0f-9c12-1fbc38c750d3	12000.00	40	f	2026-10-07 19:42:50.717	48
cmv9y4ew600780qojsh1wy846	d1a50908-d230-4aa0-8804-73e879f8cfb5	12000.00	40	f	2026-10-13 19:42:50.717	48
cmv9y4ew600790qojjc7jymnx	dac1b563-2f57-4440-a544-3c90b25eb7b5	12000.00	40	f	2026-10-13 19:42:50.718	48
cmv9y4ew6007a0qojg7k8e8ym	1d0a1856-407d-4ead-825f-6274db1fc1fe	12000.00	40	f	2026-10-13 19:42:50.718	48
cmv9y4ew6007b0qojohfrmm7l	638e1caf-87d1-4cc6-afb7-e8300a45a50b	12000.00	40	f	2026-10-13 19:42:50.718	48
cmv9y4ew6007c0qoj2u43b832	de5f2c31-e80e-40a7-994f-e93b4e6d8e46	12000.00	40	t	2026-10-13 19:42:50.718	48
cmv9y4ew6007d0qojrsba7ivr	2cc05906-2612-4d96-8066-84d6d01bb911	15200.00	40	f	2026-10-06 19:42:50.718	48
cmv9y4ew6007e0qojwz9ljhi5	833ad051-ff88-4f86-a4e1-a09e2fb2d50c	15200.00	40	f	2026-10-06 19:42:50.718	48
cmv9y4ew6007f0qoju5d9uvvi	6aa44b50-9674-4f1f-9c5f-423e0af2dc3b	15200.00	40	f	2026-10-07 19:42:50.718	48
cmv9y4ew6007g0qojjpbhewlg	dec63235-6290-449e-8a8d-23cead61dc2c	14400.00	40	t	2026-10-09 19:42:50.719	48
cmv9y4ew6007h0qojhr122g57	1e210de5-91f8-4cad-a6ad-2385499d4c14	15200.00	40	f	2026-10-10 19:42:50.719	48
cmv9y4ew6007i0qoj27o19smj	9f1e73f2-29e6-47e8-83f4-0b8812271775	15200.00	40	f	2026-10-10 19:42:50.719	48
cmv9y4ew6007j0qojsthg3fp1	52d9e9d7-58b4-4364-9c6c-78e54092e26e	15200.00	40	f	2026-10-10 19:42:50.719	48
cmv9y4ew6007k0qojfw20arq8	fa584297-1162-4d22-9eb9-41188b35b7f8	15200.00	40	t	2026-10-12 19:42:50.719	48
cmv9y4ew6007l0qojjmw3w1do	861bc07f-fc8f-49f6-8678-0f8b7fb2dd6c	15200.00	40	f	2026-10-12 19:42:50.719	48
cmv9y4ew6007m0qoj0y4pnvc0	5741f6e3-005a-4674-872c-f2a17f4797fe	15200.00	40	f	2026-10-13 19:42:50.719	48
cmv9y4ew6007n0qojf29nezur	fbc003f1-f146-42ff-8e87-5b5f351e3314	14400.00	40	f	2026-10-13 19:42:50.719	48
cmv9y4ew6007o0qojzvw1h798	e355d969-7038-439e-be2e-2721036beb50	14400.00	40	f	2026-10-13 19:42:50.719	48
cmv9y4ew6007p0qoj9ibsemaz	f3a07334-1362-4f6b-bc3f-262c8b644472	15200.00	40	t	2026-10-13 19:42:50.719	48
cmv9y4ew6007q0qoj1tshtjqz	d6e70f26-9d88-4110-8127-7a674f5944cb	15200.00	40	f	2026-10-13 19:42:50.719	48
cmv9y4ew6007r0qojte9d7gfe	72dee478-4b33-4cb5-979f-97afdb25cf45	22500.00	30	f	2026-10-03 19:42:50.72	24
cmv9y4ew6007s0qojoxgus9l2	0e7af7d7-298e-49ab-89b1-1e9fb6bfc9f7	18000.00	30	f	2026-10-04 19:42:50.72	24
cmv9y4ew6007t0qojaenprros	597d9c39-14ef-4a25-b61f-a53dcd406e2c	22500.00	30	f	2026-10-05 19:42:50.72	24
cmv9y4ew6007u0qoj4cmks3ho	6171db35-d20c-48ae-8a4e-52ef3bd55281	22500.00	30	t	2026-10-06 19:42:50.72	24
cmv9y4ew6007v0qoj1d5a0m2u	c2306340-b4ad-42b2-9b2f-0b3fa1488a60	22500.00	30	f	2026-10-08 19:42:50.72	24
cmv9y4ew6007w0qojd5hotixf	26732c2b-6a41-4c5b-bb7b-10dd043008c1	18000.00	30	f	2026-10-09 19:42:50.72	24
cmv9y4ew6007x0qojoy7aa7cb	23ece219-2304-4490-8fb9-b0059c654b44	18000.00	30	f	2026-10-10 19:42:50.72	24
cmv9y4ew6007y0qojk4jho03u	e1c4aa35-ba03-4157-9c89-90fb92c20a00	22500.00	30	f	2026-10-10 19:42:50.72	24
cmv9y4ew6007z0qoj74f15330	a5330774-3bd8-4341-a4c5-1817962bb31e	18000.00	30	t	2026-10-12 19:42:50.721	24
cmv9y4ew600800qoj3xzfud83	af769c28-62fb-4669-bd58-6ef64cda8aeb	22500.00	30	f	2026-10-13 19:42:50.721	24
cmv9y4ew600810qojgb8lh7nj	4ef59ed4-c4f8-4fb6-ba51-be0e7aab9312	18000.00	30	f	2026-10-13 19:42:50.721	24
cmv9y4ew600820qojc8ojervd	bf2c3c21-4cd1-4fb6-92f3-55e73f8aa542	22500.00	30	t	2026-10-13 19:42:50.721	24
cmv9y4ew600830qojoj9bunr6	eb4ba03c-6621-418e-a6d1-72a94beafeb0	18000.00	30	f	2026-10-13 19:42:50.721	24
cmv9y4ew600840qojetzuqgbr	85bc479e-a47d-402c-9b26-d2dbf27503d8	18000.00	30	f	2026-10-13 19:42:50.721	24
cmv9y4ew600850qojqk6ha3zh	5e954ba3-75fd-44b1-99ca-0d6134fac00b	22500.00	30	f	2026-10-13 19:42:50.721	24
cmv9y4ew600860qoj5qi7kwir	1bad2bfc-6689-4204-a9cc-66d3eb68f4db	18000.00	30	f	2026-10-03 19:42:50.721	24
cmv9y4ew600870qojq15s1x8i	a0d8dd0e-95ca-4ea3-b643-d683f1f51828	22500.00	30	f	2026-10-04 19:42:50.721	24
cmv9y4ew600880qojqe89l8cu	b6e7bf59-a712-4637-9b33-4b5e9f6d7147	22500.00	30	f	2026-10-05 19:42:50.721	24
cmv9y4ew600890qojvaor0hsw	3b8a0b62-d1cf-4077-acb0-0be2e26ae146	22500.00	30	f	2026-10-08 19:42:50.722	24
cmv9y4ew6008a0qoj51uobhj0	4815ef67-8a1f-4025-8f54-582497f24c92	22500.00	30	f	2026-10-13 19:42:50.722	24
cmv9y4ew6008b0qojwj5bsv0j	a1df8112-5942-468b-9ac7-8656bd6a3e9c	18000.00	30	f	2026-10-13 19:42:50.722	24
cmv9y4ew6008c0qojp2ekc412	39c66850-1336-4bc5-be9e-fb4a943549b5	22500.00	30	f	2026-10-13 19:42:50.722	24
cmv9y4ew6008d0qojischsq5t	f8ebf483-36f5-442c-86f0-b64efff71f5a	13500.00	30	f	2026-10-03 19:42:50.722	24
cmv9y4ew6008e0qojtqnx2qmu	8cf3fd58-e75d-4b56-9052-fb9a7c2957e5	16500.00	30	f	2026-10-03 19:42:50.722	24
cmv9y4ew6008f0qojt1lgz3k0	66c29ee8-4963-472e-8db7-6c8f8c8ebde7	16500.00	30	f	2026-10-04 19:42:50.722	24
cmv9y4ew6008g0qojdvm7vb34	890f6490-94e6-437d-bfc4-f08aaca502f0	16500.00	30	f	2026-10-05 19:42:50.722	24
cmv9y4ew6008h0qojuektno5f	26f31f90-7fe5-4f50-a5e3-326a84cc5756	16500.00	30	f	2026-10-09 19:42:50.723	24
cmv9y4ew6008i0qojqw99urso	13ca4460-4768-414a-96ca-aa28fc1dd876	16500.00	30	f	2026-10-10 19:42:50.723	24
cmv9y4ew6008j0qojzq0qawd1	41a1de0c-0522-4d77-8654-e5caf75e3787	16500.00	30	f	2026-10-11 19:42:50.723	24
cmv9y4ew6008k0qoj32uuvxfs	da994a6d-de53-47e1-b081-e7a485d9c13c	13500.00	30	t	2026-10-13 19:42:50.723	24
cmv9y4ew6008l0qoj0hejw587	41ab4547-dec0-4ec8-88cb-794145c43a7a	13500.00	30	f	2026-10-13 19:42:50.723	24
cmv9y4ew6008m0qojmhtrra60	39f894c6-cad2-4a31-9e55-37468534d94c	13500.00	30	t	2026-10-13 19:42:50.723	24
cmv9y4ew6008n0qojkqh8wyrb	ae1e3488-0eea-4dcb-91be-0676f6d435d6	16500.00	30	f	2026-10-13 19:42:50.723	24
cmv9y4ew6008o0qojqgwsrcte	d4b21062-5e23-495b-b40c-cb992edd0615	16500.00	30	t	2026-10-13 19:42:50.723	24
cmv9y4ew6008p0qojj4lwkh1k	90444207-30a2-4cf2-ab53-ae54f9401ebf	13500.00	30	f	2026-10-13 19:42:50.723	24
cmv9y4ew6008q0qojm3asffq2	a41c6e82-626e-431a-8772-288ff3ca0471	16500.00	30	f	2026-10-13 19:42:50.723	24
cmv9y4ew6008r0qoj8huyuy8r	371387c2-e862-4cbe-85b2-4206fb454e34	54000.00	30	f	2026-10-08 19:42:50.724	24
cmv9y4ew6008s0qojf5fvkddt	315c6eda-9428-441e-8dca-24bdb71685d2	54000.00	30	f	2026-10-11 19:42:50.724	24
cmv9y4ew6008t0qojlu32640w	a1054b4d-7f74-4de6-b78a-9b056a42aa84	54000.00	30	f	2026-10-13 19:42:50.724	24
cmv9y4ew6008u0qojaqh12ay7	79faa451-5c9a-4a99-9940-cc3840e9f04d	54000.00	30	t	2026-10-13 19:42:50.724	24
cmv9y4ew6008v0qojq6sk2gg9	1cd6d6a6-99d8-4176-b17e-66960606bd76	11000.00	20	f	2026-10-04 19:42:50.725	24
cmv9y4ew6008w0qojre2wmzca	d20d559a-012e-4102-abf8-aa3a278fe75c	11000.00	20	f	2026-10-06 19:42:50.725	24
cmv9y4ew6008x0qojgw96cr0m	f2b1d349-5ef7-4925-9759-6b05c62d56d4	11000.00	20	f	2026-10-09 19:42:50.725	24
cmv9y4ew6008y0qojv58paqhu	ccf1e5c6-3961-4dc3-865a-16c7087d0951	9000.00	20	f	2026-10-09 19:42:50.725	24
cmv9y4ew6008z0qojpwyc11rd	94a90532-359c-4125-8dc1-154e2848032f	11000.00	20	f	2026-10-10 19:42:50.725	24
cmv9y4ew600900qoj3e3efwry	b56da0fd-cfbf-46bd-83a6-de0114524c52	9000.00	20	f	2026-10-10 19:42:50.725	24
cmv9y4ew600910qoj6fwrhz1w	82ae9177-d462-4a44-9f38-4d356cf42e89	9000.00	20	t	2026-10-13 19:42:50.726	24
cmv9y4ew600920qojdeu0add8	9f86be32-ba16-4e37-bf05-7702893d39de	11000.00	20	f	2026-10-13 19:42:50.726	24
cmv9y4ew600930qojesk8x90v	aa81f0d0-554e-43a8-b58a-fde9966b433e	11000.00	20	f	2026-10-13 19:42:50.726	24
cmv9y4ew600940qojgquxpxna	3c2a1576-007c-4d80-9e26-aedcdd82b38b	11000.00	20	f	2026-10-13 19:42:50.726	24
cmv9y4ew600950qojheh70kku	162246cf-6a11-4491-837b-ae1d972d4e03	9000.00	20	f	2026-10-13 19:42:50.726	24
cmv9y4ew600960qoj8n51sd82	87415e7c-bb61-4b14-84ab-c04c830c20cb	11000.00	20	t	2026-10-13 19:42:50.726	24
cmv9y4ew600970qojur3b0rc2	ed31227e-6738-4cee-b511-4b79130fd482	9000.00	20	f	2026-10-13 19:42:50.726	24
cmv9y4ew600980qoj7p1auqts	c971cf8b-9bee-4b9f-8ab5-2a7f0611d47f	11000.00	20	f	2026-10-13 19:42:50.726	24
cmv9y4ew600990qojgti28fgo	b6a97aec-30a4-4cee-b7c6-696dd650a6c3	9000.00	20	f	2026-10-03 19:42:50.726	24
cmv9y4ew6009a0qojgchq0xtf	aab4f583-e16b-4b7b-851d-4b6f4cd0a2c2	11000.00	20	f	2026-10-06 19:42:50.726	24
cmv9y4ew6009b0qojjmx3v6b4	6e238d3b-ccb6-4fec-aec0-7b92c3635110	9000.00	20	f	2026-10-07 19:42:50.726	24
cmv9y4ew6009c0qojdun1fh5j	04302e07-945c-45bd-bd8e-4df7f7f65a9d	9000.00	20	f	2026-10-08 19:42:50.727	24
cmv9y4ew6009d0qoje10pxojx	c893ca95-24d4-465d-849e-eb550dae7586	11000.00	20	f	2026-10-08 19:42:50.727	24
cmv9y4ew6009e0qojgur9p1jc	901f11b2-1598-4da1-bf96-94bcbdd89b53	11000.00	20	f	2026-10-09 19:42:50.727	24
cmv9y4ew6009f0qojav9ary99	36bc4d37-6c49-430b-b82a-22b9d8ac3338	9000.00	20	t	2026-10-13 19:42:50.727	24
cmv9y4ew6009g0qoj8spwr23l	12431351-c2c1-459d-8a30-d434375eb0ee	11000.00	20	f	2026-10-13 19:42:50.727	24
cmv9y4ew6009h0qojun7si8h0	fb00662e-37f4-423c-bbee-f69b279d54ea	11000.00	20	f	2026-10-13 19:42:50.727	24
cmv9y4ew6009i0qojpu03evlu	c259f648-3d0c-4497-9bb4-2a87de61ae9c	33000.00	30	f	2026-10-04 19:42:50.727	24
cmv9y4ew6009j0qojkm9ck88y	1569e5fd-9404-4965-9a3a-992deeabeea2	33000.00	30	f	2026-10-04 19:42:50.727	24
cmv9y4ew6009k0qojwmrkq2hd	1a11366e-f92c-4654-b2c0-0537b1208b68	33000.00	30	f	2026-10-05 19:42:50.727	24
cmv9y4ew6009l0qoj9va05qc4	f9734c0d-c3a2-4317-89f4-aa37ee30120d	27000.00	30	f	2026-10-08 19:42:50.728	24
cmv9y4ew6009m0qojg7vo2p2h	ed0e977e-384f-4f88-b159-6b291c84f21e	27000.00	30	f	2026-10-08 19:42:50.728	24
cmv9y4ew6009n0qojvluygmhx	466a8020-8808-4cfc-8545-f444b0d69bc8	33000.00	30	f	2026-10-08 19:42:50.728	24
cmv9y4ew6009o0qojmmazap9a	d63cd051-d670-4de8-bbe8-2a67cd415516	27000.00	30	f	2026-10-09 19:42:50.728	24
cmv9yohv40001zkvxcmmacbjo	cmv9yof1j0000zkvxxbmmdhyi	18000.00	30	f	2026-10-15 19:58:27.952	24
cmvyjai7p000108l4h7tu4ugu	cmvyjaexe000008l41sitkxms	15000.00	25	f	2026-11-02 00:41:55.381	72
cmvylwkcf000107jqtna8p8df	cmvylwi5r000007jquxkhesqo	72000.00	40	f	2026-11-02 01:55:03.807	48
cmvy8avhs000108l2515a367c	cmvy8arqy000008l2qoad4gcr	18750.00	25	f	2026-11-01 19:34:16.816	72
cmw0zd1o7000107l5n781whd0	cmw0zczj9000007l5ouosr1w0	15000.00	25	f	2026-11-03 17:47:20.119	72
cmw0zggpd000407l52x82a0nz	cmw0zgez7000307l577e5b5r7	72000.00	40	f	2026-11-03 17:49:59.569	48
cmw3w6gft00018ovx63hp34z1	cmw3w5dwi00008ovxjhtkj3qz	54000.00	30	f	2026-11-05 18:41:32.345	24
\.


--
-- Data for Name: ParticipanteReserva; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public."ParticipanteReserva" (id, "reservaId", "jugadorId", jugadores) FROM stdin;
cmvyky778000008l6li3z7xzu	cmvyjaexe000008l41sitkxms	cmvy8e1yn000308l2dlpy1pk6	2
\.


--
-- Data for Name: PrecioEspecial; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public."PrecioEspecial" (id, "canchaId", "diaSemana", "horaInicio", "horaFin", precio, activo) FROM stdin;
cmv9y3u8f000m0qoj2y8jlr0s	cmv9y3u48000l0qojbbexppnx	\N	19:00	23:00	75000.00	t
cmv9y3ut5000o0qojfjgr6mpm	cmv9y3up0000n0qojqox1v48h	\N	19:00	23:00	75000.00	t
cmv9y3vdw000q0qojni005eli	cmv9y3v9q000p0qoje92yxhhb	\N	19:00	23:00	75000.00	t
cmv9y3vys000s0qojxqeu6wee	cmv9y3vul000r0qoj4fcusk83	\N	19:00	23:00	110000.00	t
cmv9y3x4e000y0qojq0a2fq1z	cmv9y3x03000x0qojhcburx5q	\N	19:00	23:00	75000.00	t
cmv9y3xp600100qojg9gc0yrb	cmv9y3xkz000z0qojgw63jxbr	\N	19:00	23:00	75000.00	t
cmv9y3ya200120qojyvxw0lor	cmv9y3y5v00110qoj06j7gamb	\N	19:00	23:00	48000.00	t
cmv9y3zfm00170qojcgpepipd	cmv9y3zbh00160qojicf22704	\N	19:00	23:00	75000.00	t
cmv9y401300190qojxkok317v	cmv9y3zwx00180qojsiga3msk	\N	19:00	23:00	75000.00	t
cmv9y40lt001b0qojdsqoq1g2	cmv9y40hn001a0qojfeqy3uv3	\N	19:00	23:00	75000.00	t
cmv9y427x001i0qojccabzlfq	cmv9y423r001h0qojg031afv4	\N	19:00	23:00	110000.00	t
cmv9y42sq001k0qojawriudtj	cmv9y42ok001j0qojgq2urx3u	6	\N	\N	36000.00	t
cmv9y42sq001l0qojj2w2gba1	cmv9y42ok001j0qojgq2urx3u	0	\N	\N	36000.00	t
cmv9y43df001n0qojg7098p0v	cmv9y439a001m0qoj59p1vghu	6	\N	\N	36000.00	t
cmv9y43df001o0qojwbhfxo1a	cmv9y439a001m0qoj59p1vghu	0	\N	\N	36000.00	t
cmv9y43z9001q0qojkrtky666	cmv9y43v4001p0qoj46n3rpid	6	\N	\N	36000.00	t
cmv9y43z9001r0qoj077ely0i	cmv9y43v4001p0qoj46n3rpid	0	\N	\N	36000.00	t
cmv9y455f001w0qojudtikd1k	cmv9y4519001v0qoj6xbxi3u0	\N	19:00	23:00	75000.00	t
cmv9y45q8001y0qojubuc15cs	cmv9y45m1001x0qoj7bqi6uqa	\N	19:00	23:00	75000.00	t
cmv9y46b300200qoja6kwjy7c	cmv9y466y001z0qojnhsqll8i	\N	19:00	23:00	55000.00	t
cmv9y47xn00250qojt3vih55w	cmv9y47ti00240qojcus2yb4r	\N	19:00	23:00	55000.00	t
cmv9y48ie00270qojoqkcsz4t	cmv9y48e700260qojl7xc5mlm	\N	19:00	23:00	55000.00	t
cmv9y49ny002b0qoj6bvoq3w0	cmv9y49jp002a0qojcih9lzk6	\N	19:00	23:00	110000.00	t
cmv9y4atj002f0qoj4xer52ok	cmv9y4apc002e0qojpw11z6wo	\N	19:00	23:00	75000.00	t
cmv9y4bz2002k0qojtfl4ucut	cmv9y4bux002j0qojebbzbn0i	\N	19:00	23:00	75000.00	t
cmv9y4cjs002m0qojdhnd967b	cmv9y4cfm002l0qoj29bixa3h	\N	19:00	23:00	75000.00	t
cmv9y4dld002p0qojxppthpi2	cmv9y4dh7002o0qojo1s1fg7s	\N	19:00	23:00	75000.00	t
cmv9y4e62002r0qojws2flv7f	cmv9y4e1x002q0qoj95cad4a5	\N	19:00	23:00	75000.00	t
\.


--
-- Data for Name: Reserva; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public."Reserva" (id, "canchaId", "jugadorId", fecha, "horaInicio", "horaFin", estado, "createdAt", "updatedAt", "precioTurno", asistio, "asistenciaMarcadaEn", jugadores, descuento) FROM stdin;
196feb14-f611-4013-8f3d-a5e920a7e4f6	cmv9y42ok001j0qojgq2urx3u	cmv9y3s4e00060qoj7eq8hk4u	2026-10-02	10:00	11:00	CONFIRMADA	2026-09-30 19:42:50.681	2026-10-15 19:42:50.763	30000.00	f	2026-10-03 15:00:00	\N	0.00
0e90795e-da8d-4117-9726-345ba70fe30f	cmv9y4519001v0qoj6xbxi3u0	cmv9y3s4e00060qoj7eq8hk4u	2026-10-03	21:00	22:00	CONFIRMADA	2026-10-01 19:42:50.683	2026-10-15 19:42:50.763	75000.00	t	2026-10-04 15:00:00	\N	0.00
648b6d95-194a-499a-89ae-a7e9a3fefa25	cmv9y3u48000l0qojbbexppnx	cmv9y3s4e00060qoj7eq8hk4u	2026-10-04	20:00	21:00	CONFIRMADA	2026-10-02 19:42:50.683	2026-10-15 19:42:50.763	75000.00	f	2026-10-05 15:00:00	\N	0.00
d4dde501-9398-42be-a714-efe5c259d241	cmv9y3y5v00110qoj06j7gamb	cmv9y3s4e00060qoj7eq8hk4u	2026-10-05	20:00	21:30	CONFIRMADA	2026-10-03 19:42:50.684	2026-10-15 19:42:50.763	48000.00	t	2026-10-06 15:00:00	\N	0.00
f6bbb4a5-24fd-49c1-9485-7bbdfe6b4987	cmv9y3zbh00160qojicf22704	cmv9y3s4e00060qoj7eq8hk4u	2026-10-06	21:00	22:00	CANCELADA	2026-10-04 19:42:50.684	2026-10-15 19:42:50.763	75000.00	\N	\N	\N	0.00
5f3769d4-ee0d-48ee-83bd-2010a7295dd6	cmv9y49jp002a0qojcih9lzk6	cmv9y3s4e00060qoj7eq8hk4u	2026-10-07	21:00	22:00	CONFIRMADA	2026-10-05 19:42:50.684	2026-10-15 19:42:50.763	110000.00	t	2026-10-08 15:00:00	\N	0.00
59cbe979-73cb-493e-a54b-11cf6794b0ed	cmv9y3vul000r0qoj4fcusk83	cmv9y3s4e00060qoj7eq8hk4u	2026-10-08	20:00	21:00	CONFIRMADA	2026-10-06 19:42:50.685	2026-10-15 19:42:50.763	110000.00	t	2026-10-09 15:00:00	\N	0.00
f94262e1-3735-4d56-a513-c5ffdb5853f1	cmv9y423r001h0qojg031afv4	cmv9y3s4e00060qoj7eq8hk4u	2026-10-10	19:00	20:00	CANCELADA	2026-10-08 19:42:50.685	2026-10-15 19:42:50.763	110000.00	\N	\N	\N	0.00
1881be43-80fd-4c7a-9deb-1c5f065bc897	cmv9y4519001v0qoj6xbxi3u0	cmv9y3s4e00060qoj7eq8hk4u	2026-10-11	20:00	21:00	CONFIRMADA	2026-10-09 19:42:50.685	2026-10-15 19:42:50.763	75000.00	f	2026-10-12 15:00:00	\N	0.00
7eb3d650-9ace-4306-ab53-2c9e4485a638	cmv9y3v9q000p0qoje92yxhhb	cmv9y3s4e00060qoj7eq8hk4u	2026-10-12	21:00	22:00	CONFIRMADA	2026-10-10 19:42:50.686	2026-10-15 19:42:50.763	75000.00	t	2026-10-13 15:00:00	\N	0.00
22045420-07ec-4d86-b2f1-22807287cb84	cmv9y3xkz000z0qojgw63jxbr	cmv9y3s4e00060qoj7eq8hk4u	2026-10-13	20:00	21:00	CONFIRMADA	2026-10-11 19:42:50.686	2026-10-15 19:42:50.763	75000.00	f	2026-10-14 15:00:00	\N	0.00
d4b805eb-acf1-4c77-a432-adfa53e930f3	cmv9y3u48000l0qojbbexppnx	cmv9y3s4e00060qoj7eq8hk4u	2026-10-14	21:00	22:00	CONFIRMADA	2026-10-12 19:42:50.686	2026-10-15 19:42:50.763	75000.00	\N	\N	\N	0.00
1287217f-4070-4ee9-826b-ffc29e33c947	cmv9y3u48000l0qojbbexppnx	cmv9y3s4e00060qoj7eq8hk4u	2026-10-16	21:00	22:00	CONFIRMADA	2026-10-13 19:42:50.687	2026-10-15 19:42:50.763	75000.00	\N	\N	\N	0.00
a42b124d-e38e-4a44-914e-11f5d2fa9842	cmv9y439a001m0qoj59p1vghu	cmv9y3s4e00060qoj7eq8hk4u	2026-10-17	18:00	19:00	CANCELADA	2026-10-13 19:42:50.688	2026-10-15 19:42:50.763	36000.00	\N	\N	\N	0.00
363835f0-bafd-4b94-bdca-e33f264a3b5c	cmv9y3y5v00110qoj06j7gamb	cmv9y3s4e00060qoj7eq8hk4u	2026-10-18	20:00	21:30	CONFIRMADA	2026-10-13 19:42:50.688	2026-10-15 19:42:50.763	48000.00	\N	\N	\N	0.00
ac49a942-4e84-4ec5-84dc-3a54e9f36c72	cmv9y47ti00240qojcus2yb4r	cmv9y3s4e00060qoj7eq8hk4u	2026-10-19	19:00	20:00	CANCELADA	2026-10-13 19:42:50.688	2026-10-15 19:42:50.763	55000.00	\N	\N	\N	0.00
1b4c72d8-930e-4087-8dea-217ae1453b96	cmv9y4519001v0qoj6xbxi3u0	cmv9y3s4e00060qoj7eq8hk4u	2026-10-20	21:00	22:00	CONFIRMADA	2026-10-13 19:42:50.688	2026-10-15 19:42:50.763	75000.00	\N	\N	\N	0.00
f6e56665-3fb0-430d-b8b3-a7e057c8a640	cmv9y42ok001j0qojgq2urx3u	cmv9y3s4e00060qoj7eq8hk4u	2026-10-21	10:00	11:00	CONFIRMADA	2026-10-13 19:42:50.688	2026-10-15 19:42:50.763	30000.00	\N	\N	\N	0.00
cmvy8arqy000008l2qoad4gcr	cmv9y3zbh00160qojicf22704	cmv9y3s4e00060qoj7eq8hk4u	2026-11-01	20:00	21:00	CONFIRMADA	2026-11-01 19:34:11.962	2026-11-01 19:34:16.806	75000.00	\N	\N	8	0.00
ce56e0f6-7fe5-4324-88a0-3ec6ee22a01b	cmv9y47ti00240qojcus2yb4r	cmv9y3sl6000a0qojzojr1f1e	2026-10-12	21:00	22:00	CONFIRMADA	2026-10-10 19:42:50.688	2026-10-15 19:42:50.763	55000.00	f	2026-10-13 15:00:00	\N	0.00
d34d3f47-b0e8-4337-93e5-4a2369a796de	cmv9y3u48000l0qojbbexppnx	cmv9y3tag000g0qoj8s6cgum5	2026-10-09	19:00	20:00	CONFIRMADA	2026-10-07 19:42:50.688	2026-10-15 19:42:50.763	75000.00	t	2026-10-10 15:00:00	\N	0.00
4856d72d-f4fc-4a25-b894-a317a62eafc2	cmv9y45m1001x0qoj7bqi6uqa	cmv9y3tag000g0qoj8s6cgum5	2026-10-07	20:00	21:00	CONFIRMADA	2026-10-05 19:42:50.688	2026-10-15 19:42:50.763	75000.00	f	2026-10-08 15:00:00	\N	0.00
7ba5f726-aa02-4854-b529-e2bc026b42c6	cmv9y40hn001a0qojfeqy3uv3	cmv9y3sct00080qoj4aw8dtds	2026-10-09	20:00	21:00	CONFIRMADA	2026-10-07 19:42:50.689	2026-10-15 19:42:50.763	75000.00	t	2026-10-10 15:00:00	\N	0.00
f7ad5392-fb90-452c-8d93-a0bd1b219826	cmv9y40hn001a0qojfeqy3uv3	cmv9y3sgz00090qojk4g6d84d	2026-10-11	21:00	22:00	CONFIRMADA	2026-10-09 19:42:50.689	2026-10-15 19:42:50.763	75000.00	t	2026-10-12 15:00:00	\N	0.00
5b421db3-c355-45a3-8d20-5346f1b78229	cmv9y3u48000l0qojbbexppnx	cmv9y3stj000c0qojpn896377	2026-10-05	16:00	17:00	CONFIRMADA	2026-10-03 19:42:50.689	2026-10-15 19:42:50.763	60000.00	t	2026-10-06 15:00:00	\N	0.00
5d74d040-8296-4727-b70d-f470fcf7c297	cmv9y3u48000l0qojbbexppnx	cmv9y3t69000f0qoj3mszpys3	2026-10-05	21:00	22:00	CONFIRMADA	2026-10-03 19:42:50.689	2026-10-15 19:42:50.763	75000.00	t	2026-10-06 15:00:00	\N	0.00
5699f1b5-5cce-4efd-85a8-d3b9992841b1	cmv9y3u48000l0qojbbexppnx	cmv9y3sct00080qoj4aw8dtds	2026-10-05	22:00	23:00	CONFIRMADA	2026-10-03 19:42:50.69	2026-10-15 19:42:50.763	75000.00	t	2026-10-06 15:00:00	\N	0.00
5453450e-d604-4d3b-b17b-e0fb37c533c6	cmv9y3u48000l0qojbbexppnx	cmv9y3t69000f0qoj3mszpys3	2026-10-06	15:00	16:00	CONFIRMADA	2026-10-04 19:42:50.69	2026-10-15 19:42:50.763	60000.00	t	2026-10-07 15:00:00	\N	0.00
dc99040c-fb1e-4a4a-9993-6791a0ce63c2	cmv9y3u48000l0qojbbexppnx	cmv9y3t69000f0qoj3mszpys3	2026-10-06	22:00	23:00	CONFIRMADA	2026-10-04 19:42:50.69	2026-10-15 19:42:50.763	75000.00	t	2026-10-07 15:00:00	\N	0.00
71efd0a7-c614-480d-a9ac-d3168459ead7	cmv9y3u48000l0qojbbexppnx	cmv9y3sgz00090qojk4g6d84d	2026-10-07	23:00	00:00	CONFIRMADA	2026-10-05 19:42:50.691	2026-10-15 19:42:50.763	60000.00	t	2026-10-08 15:00:00	\N	0.00
72c913ac-d063-4df7-bd77-5780020a2def	cmv9y3u48000l0qojbbexppnx	cmv9y3sct00080qoj4aw8dtds	2026-10-08	11:00	12:00	CONFIRMADA	2026-10-06 19:42:50.691	2026-10-15 19:42:50.763	60000.00	t	2026-10-09 15:00:00	\N	0.00
e1b65499-1cef-43fd-a84e-77d5f6753ac1	cmv9y3u48000l0qojbbexppnx	cmv9y3stj000c0qojpn896377	2026-10-08	23:00	00:00	CONFIRMADA	2026-10-06 19:42:50.691	2026-10-15 19:42:50.763	60000.00	f	2026-10-09 15:00:00	\N	0.00
93c4681f-f9df-4f2b-ad58-1dac2a585a6e	cmv9y3u48000l0qojbbexppnx	cmv9y3sxq000d0qojg4gcrl5t	2026-10-10	22:00	23:00	CONFIRMADA	2026-10-08 19:42:50.692	2026-10-15 19:42:50.763	75000.00	t	2026-10-11 15:00:00	\N	0.00
e3b75be7-6f70-455e-9eda-39446c01022e	cmv9y3u48000l0qojbbexppnx	cmv9y3sl6000a0qojzojr1f1e	2026-10-12	20:00	21:00	CONFIRMADA	2026-10-10 19:42:50.692	2026-10-15 19:42:50.763	75000.00	t	2026-10-13 15:00:00	\N	0.00
9fae317c-63a2-48a0-8d55-5e1e3b9d457f	cmv9y3u48000l0qojbbexppnx	cmv9y3spc000b0qojzzl7f1z4	2026-10-14	10:00	11:00	CONFIRMADA	2026-10-12 19:42:50.692	2026-10-15 19:42:50.763	60000.00	\N	\N	\N	0.00
68892466-8851-4ddb-a315-0eef59749120	cmv9y3u48000l0qojbbexppnx	cmv9y3spc000b0qojzzl7f1z4	2026-10-15	16:00	17:00	CONFIRMADA	2026-10-13 19:42:50.692	2026-10-15 19:42:50.763	60000.00	\N	\N	\N	0.00
7fff8e95-d77d-4a42-baed-be7d4f1f1c32	cmv9y3u48000l0qojbbexppnx	cmv9y3t20000e0qojqflv5812	2026-10-15	23:00	00:00	CANCELADA	2026-10-13 19:42:50.693	2026-10-15 19:42:50.763	60000.00	\N	\N	\N	0.00
b2a55666-2de6-4cc4-9ef5-23328b8f7c2b	cmv9y3u48000l0qojbbexppnx	cmv9y3spc000b0qojzzl7f1z4	2026-10-16	14:00	15:00	CONFIRMADA	2026-10-13 19:42:50.693	2026-10-15 19:42:50.763	60000.00	\N	\N	\N	0.00
ef009a21-ccdb-431c-89b2-75aad41754d4	cmv9y3u48000l0qojbbexppnx	cmv9y3sxq000d0qojg4gcrl5t	2026-10-17	19:00	20:00	CONFIRMADA	2026-10-13 19:42:50.693	2026-10-15 19:42:50.763	75000.00	\N	\N	\N	0.00
64471feb-87a5-4420-987d-9323118e4ff2	cmv9y3u48000l0qojbbexppnx	cmv9y3sxq000d0qojg4gcrl5t	2026-10-17	20:00	21:00	CONFIRMADA	2026-10-13 19:42:50.693	2026-10-15 19:42:50.763	75000.00	\N	\N	\N	0.00
c774c8fc-b400-4f4b-ac6a-139bdfc31f55	cmv9y3u48000l0qojbbexppnx	cmv9y3sgz00090qojk4g6d84d	2026-10-18	22:00	23:00	CONFIRMADA	2026-10-13 19:42:50.693	2026-10-15 19:42:50.763	75000.00	\N	\N	\N	0.00
e1104ada-6542-47e2-b781-3a011d81d537	cmv9y3u48000l0qojbbexppnx	cmv9y3spc000b0qojzzl7f1z4	2026-10-19	23:00	00:00	CONFIRMADA	2026-10-13 19:42:50.693	2026-10-15 19:42:50.763	60000.00	\N	\N	\N	0.00
fac9e418-9e13-442f-a9a9-9e0aa296a91c	cmv9y3up0000n0qojqox1v48h	cmv9y3sxq000d0qojg4gcrl5t	2026-10-07	20:00	21:00	CONFIRMADA	2026-10-05 19:42:50.694	2026-10-15 19:42:50.763	75000.00	t	2026-10-08 15:00:00	\N	0.00
a61e5c7d-f0a9-4df9-832a-21b6356ae769	cmv9y3up0000n0qojqox1v48h	cmv9y3s8m00070qojs71grz9j	2026-10-07	21:00	22:00	CONFIRMADA	2026-10-05 19:42:50.694	2026-10-15 19:42:50.763	75000.00	t	2026-10-08 15:00:00	\N	0.00
61f6803d-d165-407f-86b7-f2902164cb20	cmv9y3up0000n0qojqox1v48h	cmv9y3t20000e0qojqflv5812	2026-10-08	20:00	21:00	CONFIRMADA	2026-10-06 19:42:50.694	2026-10-15 19:42:50.763	75000.00	f	2026-10-09 15:00:00	\N	0.00
cbdee8ea-efbe-4099-9868-f62e25adcb91	cmv9y3v9q000p0qoje92yxhhb	cmv9y3s4e00060qoj7eq8hk4u	2026-10-15	16:00	17:00	CONFIRMADA	2026-10-13 19:42:50.687	2026-10-15 22:29:23.1	60000.00	f	2026-10-15 22:29:23.099	\N	0.00
d63e18dd-b4e6-4e7f-8459-a2d394c41b81	cmv9y3up0000n0qojqox1v48h	cmv9y3sl6000a0qojzojr1f1e	2026-10-09	09:00	10:00	CONFIRMADA	2026-10-07 19:42:50.694	2026-10-15 19:42:50.763	60000.00	t	2026-10-10 15:00:00	\N	0.00
18f90326-b711-4cde-a911-f8da84a76718	cmv9y3up0000n0qojqox1v48h	cmv9y3spc000b0qojzzl7f1z4	2026-10-12	20:00	21:00	CONFIRMADA	2026-10-10 19:42:50.695	2026-10-15 19:42:50.763	75000.00	t	2026-10-13 15:00:00	\N	0.00
e0df9f25-c541-4a3a-9986-9ea01dafc115	cmv9y3v9q000p0qoje92yxhhb	cmv9y3sxq000d0qojg4gcrl5t	2026-10-06	21:00	22:00	CONFIRMADA	2026-10-04 19:42:50.696	2026-10-15 19:42:50.763	75000.00	t	2026-10-07 15:00:00	\N	0.00
9fa2293d-69b1-4dfe-93c2-e3f0604edafb	cmv9y3v9q000p0qoje92yxhhb	cmv9y3sct00080qoj4aw8dtds	2026-10-07	21:00	22:00	CONFIRMADA	2026-10-05 19:42:50.696	2026-10-15 19:42:50.763	75000.00	t	2026-10-08 15:00:00	\N	0.00
79911ceb-28bf-4da3-8689-b84bdf950233	cmv9y3v9q000p0qoje92yxhhb	cmv9y3sl6000a0qojzojr1f1e	2026-10-08	19:00	20:00	CONFIRMADA	2026-10-06 19:42:50.696	2026-10-15 19:42:50.763	75000.00	t	2026-10-09 15:00:00	\N	0.00
d77ff558-9437-4527-9d73-494dafc14c38	cmv9y3v9q000p0qoje92yxhhb	cmv9y3s8m00070qojs71grz9j	2026-10-08	21:00	22:00	CONFIRMADA	2026-10-06 19:42:50.696	2026-10-15 19:42:50.763	75000.00	t	2026-10-09 15:00:00	\N	0.00
07dc35d1-ed9b-4b0c-95a1-0ae4a80f78e1	cmv9y3v9q000p0qoje92yxhhb	cmv9y3sgz00090qojk4g6d84d	2026-10-09	23:00	00:00	CONFIRMADA	2026-10-07 19:42:50.696	2026-10-15 19:42:50.763	60000.00	t	2026-10-10 15:00:00	\N	0.00
2c9b9674-6fd8-411e-94fc-b5e10ed13727	cmv9y3v9q000p0qoje92yxhhb	cmv9y3stj000c0qojpn896377	2026-10-10	23:00	00:00	CONFIRMADA	2026-10-08 19:42:50.697	2026-10-15 19:42:50.763	60000.00	t	2026-10-11 15:00:00	\N	0.00
91f99899-8f9c-46e9-aa3e-dd2c3b8a1697	cmv9y3v9q000p0qoje92yxhhb	cmv9y3stj000c0qojpn896377	2026-10-13	19:00	20:00	CONFIRMADA	2026-10-11 19:42:50.697	2026-10-15 19:42:50.763	75000.00	\N	\N	\N	0.00
e9d72026-b394-4be1-a643-dfc3e7098006	cmv9y3v9q000p0qoje92yxhhb	cmv9y3sct00080qoj4aw8dtds	2026-10-15	18:00	19:00	CONFIRMADA	2026-10-13 19:42:50.697	2026-10-15 19:42:50.763	60000.00	\N	\N	\N	0.00
af0b4ade-4879-4bf6-8ada-f02868e894a8	cmv9y3v9q000p0qoje92yxhhb	cmv9y3s8m00070qojs71grz9j	2026-10-15	19:00	20:00	CONFIRMADA	2026-10-13 19:42:50.697	2026-10-15 19:42:50.763	75000.00	\N	\N	\N	0.00
96ee9d41-0eb4-4675-aff9-1b0d864ada89	cmv9y3v9q000p0qoje92yxhhb	cmv9y3s8m00070qojs71grz9j	2026-10-19	21:00	22:00	CONFIRMADA	2026-10-13 19:42:50.698	2026-10-15 19:42:50.763	75000.00	\N	\N	\N	0.00
4af0f597-8908-4f3d-b1dd-b2082af3e8d8	cmv9y3vul000r0qoj4fcusk83	cmv9y3spc000b0qojzzl7f1z4	2026-10-05	23:00	00:00	CONFIRMADA	2026-10-03 19:42:50.698	2026-10-15 19:42:50.763	90000.00	t	2026-10-06 15:00:00	\N	0.00
9219650b-53d5-4a23-9ae7-4b1853dcbef1	cmv9y3vul000r0qoj4fcusk83	cmv9y3sl6000a0qojzojr1f1e	2026-10-07	23:00	00:00	CONFIRMADA	2026-10-05 19:42:50.698	2026-10-15 19:42:50.763	90000.00	t	2026-10-08 15:00:00	\N	0.00
500e7941-cc26-44a8-a7d9-0ea489948ff9	cmv9y3vul000r0qoj4fcusk83	cmv9y3sxq000d0qojg4gcrl5t	2026-10-09	18:00	19:00	CONFIRMADA	2026-10-07 19:42:50.699	2026-10-15 19:42:50.763	90000.00	t	2026-10-10 15:00:00	\N	0.00
4504c1f8-ac20-433a-91fa-5fdf04c8741d	cmv9y3vul000r0qoj4fcusk83	cmv9y3t69000f0qoj3mszpys3	2026-10-09	22:00	23:00	CONFIRMADA	2026-10-07 19:42:50.699	2026-10-15 19:42:50.763	110000.00	t	2026-10-10 15:00:00	\N	0.00
2288d2eb-c2e8-44a0-8014-747eee6b4ae4	cmv9y3vul000r0qoj4fcusk83	cmv9y3sct00080qoj4aw8dtds	2026-10-10	22:00	23:00	CONFIRMADA	2026-10-08 19:42:50.7	2026-10-15 19:42:50.763	110000.00	t	2026-10-11 15:00:00	\N	0.00
07a1d3bc-321b-4a8c-a009-b14309675a03	cmv9y3vul000r0qoj4fcusk83	cmv9y3stj000c0qojpn896377	2026-10-11	12:00	13:00	CONFIRMADA	2026-10-09 19:42:50.7	2026-10-15 19:42:50.763	90000.00	t	2026-10-12 15:00:00	\N	0.00
55b80eed-180e-417b-94cd-d18b4d7719fb	cmv9y3vul000r0qoj4fcusk83	cmv9y3sct00080qoj4aw8dtds	2026-10-14	17:00	18:00	CONFIRMADA	2026-10-12 19:42:50.7	2026-10-15 19:42:50.763	90000.00	\N	\N	\N	0.00
92fe5a8e-03fa-423d-90a9-b487c3512142	cmv9y3vul000r0qoj4fcusk83	cmv9y3t69000f0qoj3mszpys3	2026-10-14	19:00	20:00	CONFIRMADA	2026-10-12 19:42:50.7	2026-10-15 19:42:50.763	110000.00	\N	\N	\N	0.00
060b4ea9-349e-4574-b501-6593c41ccb84	cmv9y3vul000r0qoj4fcusk83	cmv9y3stj000c0qojpn896377	2026-10-14	21:00	22:00	CONFIRMADA	2026-10-12 19:42:50.7	2026-10-15 19:42:50.763	110000.00	\N	\N	\N	0.00
85bb8b04-96d0-4fa3-979f-c38f269a4e3c	cmv9y3vul000r0qoj4fcusk83	cmv9y3sgz00090qojk4g6d84d	2026-10-15	17:00	18:00	CONFIRMADA	2026-10-13 19:42:50.701	2026-10-15 19:42:50.763	90000.00	\N	\N	\N	0.00
c1893c25-49a5-4ce3-9c8f-9e4d22776dc9	cmv9y3vul000r0qoj4fcusk83	cmv9y3t69000f0qoj3mszpys3	2026-10-17	13:00	14:00	CONFIRMADA	2026-10-13 19:42:50.701	2026-10-15 19:42:50.763	90000.00	\N	\N	\N	0.00
72067873-6bf2-494e-9437-3ee76419a0b1	cmv9y3vul000r0qoj4fcusk83	cmv9y3t20000e0qojqflv5812	2026-10-18	21:00	22:00	CONFIRMADA	2026-10-13 19:42:50.701	2026-10-15 19:42:50.763	110000.00	\N	\N	\N	0.00
5bdf7758-6a9b-4b4c-857f-c2f0bd62c914	cmv9y3vul000r0qoj4fcusk83	cmv9y3t20000e0qojqflv5812	2026-10-18	22:00	23:00	CONFIRMADA	2026-10-13 19:42:50.701	2026-10-15 19:42:50.763	110000.00	\N	\N	\N	0.00
22e602dc-21cb-469b-935a-0ca5cbad2b01	cmv9y3vul000r0qoj4fcusk83	cmv9y3sxq000d0qojg4gcrl5t	2026-10-20	22:00	23:00	CONFIRMADA	2026-10-13 19:42:50.701	2026-10-15 19:42:50.763	110000.00	\N	\N	\N	0.00
0dfc6a3d-3e9c-4df3-b412-19ddee72e07f	cmv9y3x03000x0qojhcburx5q	cmv9y3sxq000d0qojg4gcrl5t	2026-10-05	09:00	10:00	CONFIRMADA	2026-10-03 19:42:50.702	2026-10-15 19:42:50.763	60000.00	f	2026-10-06 15:00:00	\N	0.00
b7022b5e-12e3-4b56-a857-f69af78a1951	cmv9y3x03000x0qojhcburx5q	cmv9y3stj000c0qojpn896377	2026-10-05	15:00	16:00	CONFIRMADA	2026-10-03 19:42:50.702	2026-10-15 19:42:50.763	60000.00	t	2026-10-06 15:00:00	\N	0.00
96c5da01-9f51-4805-aaf9-c57da54408a1	cmv9y3x03000x0qojhcburx5q	cmv9y3s8m00070qojs71grz9j	2026-10-05	21:00	22:00	CONFIRMADA	2026-10-03 19:42:50.702	2026-10-15 19:42:50.763	75000.00	t	2026-10-06 15:00:00	\N	0.00
87111345-8fb0-447a-b7e8-25dd4fe4757d	cmv9y3x03000x0qojhcburx5q	cmv9y3sl6000a0qojzojr1f1e	2026-10-07	20:00	21:00	CONFIRMADA	2026-10-05 19:42:50.702	2026-10-15 19:42:50.763	75000.00	t	2026-10-08 15:00:00	\N	0.00
3f3a8125-d414-41ae-b848-49e529966ecb	cmv9y3x03000x0qojhcburx5q	cmv9y3sct00080qoj4aw8dtds	2026-10-09	22:00	23:00	CONFIRMADA	2026-10-07 19:42:50.702	2026-10-15 19:42:50.763	75000.00	t	2026-10-10 15:00:00	\N	0.00
b9e92adb-d37b-41a2-9f7e-4f52f1deeca2	cmv9y3x03000x0qojhcburx5q	cmv9y3spc000b0qojzzl7f1z4	2026-10-13	19:00	20:00	CONFIRMADA	2026-10-11 19:42:50.703	2026-10-15 19:42:50.763	75000.00	\N	\N	\N	0.00
0541271c-377d-4480-a425-a505d2f8393e	cmv9y3x03000x0qojhcburx5q	cmv9y3sxq000d0qojg4gcrl5t	2026-10-14	09:00	10:00	CONFIRMADA	2026-10-12 19:42:50.703	2026-10-15 19:42:50.763	60000.00	\N	\N	\N	0.00
d317dc5e-0900-4eb4-b64a-001f3b733c5f	cmv9y3x03000x0qojhcburx5q	cmv9y3spc000b0qojzzl7f1z4	2026-10-16	16:00	17:00	CONFIRMADA	2026-10-13 19:42:50.703	2026-10-15 19:42:50.763	60000.00	\N	\N	\N	0.00
b2e8f960-85fd-428e-b91a-4abcd1f1c8a8	cmv9y3x03000x0qojhcburx5q	cmv9y3sct00080qoj4aw8dtds	2026-10-17	19:00	20:00	CONFIRMADA	2026-10-13 19:42:50.703	2026-10-15 19:42:50.763	75000.00	\N	\N	\N	0.00
ed3e6a8b-8fc3-4008-9748-a8beceeb8b12	cmv9y3x03000x0qojhcburx5q	cmv9y3s8m00070qojs71grz9j	2026-10-17	21:00	22:00	CONFIRMADA	2026-10-13 19:42:50.703	2026-10-15 19:42:50.763	75000.00	\N	\N	\N	0.00
8a843ad3-37ae-4956-9412-8e2169c15ded	cmv9y3x03000x0qojhcburx5q	cmv9y3sct00080qoj4aw8dtds	2026-10-18	18:00	19:00	CANCELADA	2026-10-13 19:42:50.703	2026-10-15 19:42:50.763	60000.00	\N	\N	\N	0.00
3808ab97-7428-49b4-84f4-668caddb8e5e	cmv9y3x03000x0qojhcburx5q	cmv9y3t20000e0qojqflv5812	2026-10-19	13:00	14:00	CONFIRMADA	2026-10-13 19:42:50.704	2026-10-15 19:42:50.763	60000.00	\N	\N	\N	0.00
49338658-9ca1-4fe4-8ca3-0992334a541a	cmv9y3x03000x0qojhcburx5q	cmv9y3t69000f0qoj3mszpys3	2026-10-19	22:00	23:00	CONFIRMADA	2026-10-13 19:42:50.704	2026-10-15 19:42:50.763	75000.00	\N	\N	\N	0.00
03651ea3-95d7-4c6f-bc1c-b28e11348fe6	cmv9y3x03000x0qojhcburx5q	cmv9y3spc000b0qojzzl7f1z4	2026-10-20	23:00	00:00	CONFIRMADA	2026-10-13 19:42:50.704	2026-10-15 19:42:50.763	60000.00	\N	\N	\N	0.00
82f4cc3a-28f5-4b01-922f-b5bc46910421	cmv9y3xkz000z0qojgw63jxbr	cmv9y3sxq000d0qojg4gcrl5t	2026-10-06	13:00	14:00	CONFIRMADA	2026-10-04 19:42:50.704	2026-10-15 19:42:50.763	60000.00	t	2026-10-07 15:00:00	\N	0.00
48a4340e-1c0e-4b04-a7b1-29d5bbc7e574	cmv9y3xkz000z0qojgw63jxbr	cmv9y3spc000b0qojzzl7f1z4	2026-10-08	20:00	21:00	CONFIRMADA	2026-10-06 19:42:50.704	2026-10-15 19:42:50.763	75000.00	t	2026-10-09 15:00:00	\N	0.00
86ce0e3c-1812-464b-85d5-fbb3e169b95e	cmv9y3xkz000z0qojgw63jxbr	cmv9y3stj000c0qojpn896377	2026-10-08	22:00	23:00	CONFIRMADA	2026-10-06 19:42:50.704	2026-10-15 19:42:50.763	75000.00	t	2026-10-09 15:00:00	\N	0.00
4606023a-8547-4b6a-99ce-75a0dc4844b4	cmv9y3xkz000z0qojgw63jxbr	cmv9y3sl6000a0qojzojr1f1e	2026-10-09	20:00	21:00	CONFIRMADA	2026-10-07 19:42:50.705	2026-10-15 19:42:50.763	75000.00	t	2026-10-10 15:00:00	\N	0.00
db1588b5-3ea8-485a-88e1-485ab2cf590d	cmv9y3xkz000z0qojgw63jxbr	cmv9y3s8m00070qojs71grz9j	2026-10-11	09:00	10:00	CONFIRMADA	2026-10-09 19:42:50.705	2026-10-15 19:42:50.763	60000.00	t	2026-10-12 15:00:00	\N	0.00
6483d4e0-2d50-42ec-821b-13341faaac74	cmv9y3xkz000z0qojgw63jxbr	cmv9y3sgz00090qojk4g6d84d	2026-10-11	22:00	23:00	CONFIRMADA	2026-10-09 19:42:50.705	2026-10-15 19:42:50.763	75000.00	t	2026-10-12 15:00:00	\N	0.00
1938a6ea-dea8-4f5e-b64b-aa44b4ff9521	cmv9y3xkz000z0qojgw63jxbr	cmv9y3stj000c0qojpn896377	2026-10-14	23:00	00:00	CANCELADA	2026-10-12 19:42:50.705	2026-10-15 19:42:50.763	60000.00	\N	\N	\N	0.00
0905f655-18c6-4495-ab7e-58fdb94d242a	cmv9y3xkz000z0qojgw63jxbr	cmv9y3t20000e0qojqflv5812	2026-10-16	20:00	21:00	CONFIRMADA	2026-10-13 19:42:50.706	2026-10-15 19:42:50.763	75000.00	\N	\N	\N	0.00
7b7a1022-4281-4c9d-a0d1-572859b357fd	cmv9y3xkz000z0qojgw63jxbr	cmv9y3s8m00070qojs71grz9j	2026-10-19	16:00	17:00	CONFIRMADA	2026-10-13 19:42:50.706	2026-10-15 19:42:50.763	60000.00	\N	\N	\N	0.00
2174a5f8-5b8c-42d2-9ce3-5c0b7a478122	cmv9y3y5v00110qoj06j7gamb	cmv9y3sct00080qoj4aw8dtds	2026-10-05	21:30	23:00	CONFIRMADA	2026-10-03 19:42:50.706	2026-10-15 19:42:50.763	48000.00	f	2026-10-06 15:00:00	\N	0.00
ed9aaf66-bcee-4186-bf13-fca268326dcf	cmv9y3y5v00110qoj06j7gamb	cmv9y3t20000e0qojqflv5812	2026-10-06	17:00	18:30	CONFIRMADA	2026-10-04 19:42:50.706	2026-10-15 19:42:50.763	40000.00	t	2026-10-07 15:00:00	\N	0.00
9574e93a-4505-451f-836f-44a7483bdf9c	cmv9y3y5v00110qoj06j7gamb	cmv9y3sxq000d0qojg4gcrl5t	2026-10-06	23:00	00:00	CONFIRMADA	2026-10-04 19:42:50.706	2026-10-15 19:42:50.763	26666.67	t	2026-10-07 15:00:00	\N	0.00
2150b71b-79ee-4bbe-ab6a-452c26291973	cmv9y3y5v00110qoj06j7gamb	cmv9y3spc000b0qojzzl7f1z4	2026-10-07	12:30	14:00	CONFIRMADA	2026-10-05 19:42:50.707	2026-10-15 19:42:50.763	40000.00	t	2026-10-08 15:00:00	\N	0.00
d66145d2-482f-49ea-bb17-879343f9e396	cmv9y3y5v00110qoj06j7gamb	cmv9y3sgz00090qojk4g6d84d	2026-10-13	23:00	00:00	CONFIRMADA	2026-10-11 19:42:50.707	2026-10-15 19:42:50.763	26666.67	\N	\N	\N	0.00
2f278932-2da0-42f6-b481-427e58c1375a	cmv9y3y5v00110qoj06j7gamb	cmv9y3spc000b0qojzzl7f1z4	2026-10-14	20:00	21:30	CONFIRMADA	2026-10-12 19:42:50.707	2026-10-15 19:42:50.763	48000.00	\N	\N	\N	0.00
a90870c1-52c5-4a7c-a971-df3fccc96667	cmv9y3y5v00110qoj06j7gamb	cmv9y3sgz00090qojk4g6d84d	2026-10-16	21:30	23:00	CONFIRMADA	2026-10-13 19:42:50.707	2026-10-15 19:42:50.763	48000.00	\N	\N	\N	0.00
7f46b8f7-e127-4e71-82b6-edae3e1915e9	cmv9y3y5v00110qoj06j7gamb	cmv9y3sgz00090qojk4g6d84d	2026-10-18	18:30	20:00	CONFIRMADA	2026-10-13 19:42:50.707	2026-10-15 19:42:50.763	40000.00	\N	\N	\N	0.00
1a5f1d91-8858-43a5-b290-a66e1a0a0aea	cmv9y3y5v00110qoj06j7gamb	cmv9y3stj000c0qojpn896377	2026-10-19	11:00	12:30	CONFIRMADA	2026-10-13 19:42:50.708	2026-10-15 19:42:50.763	40000.00	\N	\N	\N	0.00
1da01233-2e1e-4f68-a318-7adfe0bc07de	cmv9y3y5v00110qoj06j7gamb	cmv9y3sxq000d0qojg4gcrl5t	2026-10-19	20:00	21:30	CONFIRMADA	2026-10-13 19:42:50.708	2026-10-15 19:42:50.763	48000.00	\N	\N	\N	0.00
4b708359-0123-435b-8287-837f1a452bf2	cmv9y3y5v00110qoj06j7gamb	cmv9y3sgz00090qojk4g6d84d	2026-10-20	20:00	21:30	CONFIRMADA	2026-10-13 19:42:50.708	2026-10-15 19:42:50.763	48000.00	\N	\N	\N	0.00
7fea0584-4eee-4ca1-aa38-8f93b10db64e	cmv9y3zbh00160qojicf22704	cmv9y3sgz00090qojk4g6d84d	2026-10-06	19:00	20:00	CONFIRMADA	2026-10-04 19:42:50.708	2026-10-15 19:42:50.763	75000.00	f	2026-10-07 15:00:00	\N	0.00
6f47e56c-2be8-4b5b-8707-9ec63f0dedc4	cmv9y3zbh00160qojicf22704	cmv9y3sct00080qoj4aw8dtds	2026-10-08	22:00	23:00	CONFIRMADA	2026-10-06 19:42:50.708	2026-10-15 19:42:50.763	75000.00	t	2026-10-09 15:00:00	\N	0.00
773354f9-bc9d-460f-b373-7f68283876da	cmv9y3zbh00160qojicf22704	cmv9y3stj000c0qojpn896377	2026-10-13	21:00	22:00	CONFIRMADA	2026-10-11 19:42:50.709	2026-10-15 19:42:50.763	75000.00	\N	\N	\N	0.00
da308708-bce7-4545-b655-29421422b1a7	cmv9y3zbh00160qojicf22704	cmv9y3s8m00070qojs71grz9j	2026-10-14	22:00	23:00	CONFIRMADA	2026-10-12 19:42:50.709	2026-10-15 19:42:50.763	75000.00	\N	\N	\N	0.00
e6b13541-8082-4640-b900-556c4d488402	cmv9y3zbh00160qojicf22704	cmv9y3stj000c0qojpn896377	2026-10-16	15:00	16:00	CONFIRMADA	2026-10-13 19:42:50.71	2026-10-15 19:42:50.763	60000.00	\N	\N	\N	0.00
f6166c20-afa1-4d2f-b376-8eff2f3987ec	cmv9y3zbh00160qojicf22704	cmv9y3stj000c0qojpn896377	2026-10-16	19:00	20:00	CONFIRMADA	2026-10-13 19:42:50.71	2026-10-15 19:42:50.763	75000.00	\N	\N	\N	0.00
425153ce-85b9-4f9b-9641-9a228ae288d3	cmv9y3zbh00160qojicf22704	cmv9y3spc000b0qojzzl7f1z4	2026-10-16	23:00	00:00	CONFIRMADA	2026-10-13 19:42:50.71	2026-10-15 19:42:50.763	60000.00	\N	\N	\N	0.00
cccab1c8-6968-4944-bad7-fc1c8f81773f	cmv9y3zbh00160qojicf22704	cmv9y3s8m00070qojs71grz9j	2026-10-17	14:00	15:00	CONFIRMADA	2026-10-13 19:42:50.71	2026-10-15 19:42:50.763	60000.00	\N	\N	\N	0.00
286330c9-af37-49bf-91ee-b61bb03d9ecb	cmv9y3zbh00160qojicf22704	cmv9y3t69000f0qoj3mszpys3	2026-10-17	19:00	20:00	CONFIRMADA	2026-10-13 19:42:50.71	2026-10-15 19:42:50.763	75000.00	\N	\N	\N	0.00
7ef7e737-a3da-4257-aaf0-19168f1a0fd9	cmv9y3zbh00160qojicf22704	cmv9y3sl6000a0qojzojr1f1e	2026-10-17	20:00	21:00	CONFIRMADA	2026-10-13 19:42:50.711	2026-10-15 19:42:50.763	75000.00	\N	\N	\N	0.00
713d2c6a-c8ea-452b-817a-e806ad35facd	cmv9y3zbh00160qojicf22704	cmv9y3sgz00090qojk4g6d84d	2026-10-19	23:00	00:00	CONFIRMADA	2026-10-13 19:42:50.711	2026-10-15 19:42:50.763	60000.00	\N	\N	\N	0.00
54003fcb-7fc0-4d10-97f3-527aa4ec683f	cmv9y3zbh00160qojicf22704	cmv9y3spc000b0qojzzl7f1z4	2026-10-20	19:00	20:00	CANCELADA	2026-10-13 19:42:50.711	2026-10-15 19:42:50.763	75000.00	\N	\N	\N	0.00
3b3147b4-51a2-4587-85ac-7f1b87edc130	cmv9y3zwx00180qojsiga3msk	cmv9y3t69000f0qoj3mszpys3	2026-10-05	22:00	23:00	CONFIRMADA	2026-10-03 19:42:50.711	2026-10-15 19:42:50.763	75000.00	t	2026-10-06 15:00:00	\N	0.00
2df651f8-134b-4993-a9c0-4f53ba578dfb	cmv9y3zwx00180qojsiga3msk	cmv9y3stj000c0qojpn896377	2026-10-06	19:00	20:00	CANCELADA	2026-10-04 19:42:50.711	2026-10-15 19:42:50.763	75000.00	\N	\N	\N	0.00
dd10d3ed-e591-4953-8121-a1823ec0ad30	cmv9y3zwx00180qojsiga3msk	cmv9y3sxq000d0qojg4gcrl5t	2026-10-07	23:00	00:00	CONFIRMADA	2026-10-05 19:42:50.711	2026-10-15 19:42:50.763	60000.00	t	2026-10-08 15:00:00	\N	0.00
e8535b3c-e0b3-45b5-9af9-69615b5b8832	cmv9y3zwx00180qojsiga3msk	cmv9y3spc000b0qojzzl7f1z4	2026-10-09	10:00	11:00	CONFIRMADA	2026-10-07 19:42:50.711	2026-10-15 19:42:50.763	60000.00	t	2026-10-10 15:00:00	\N	0.00
a1217dec-b5bb-4667-be1c-b3faa5f43c59	cmv9y3zwx00180qojsiga3msk	cmv9y3t20000e0qojqflv5812	2026-10-10	19:00	20:00	CONFIRMADA	2026-10-08 19:42:50.711	2026-10-15 19:42:50.763	75000.00	t	2026-10-11 15:00:00	\N	0.00
a1dc6dd6-94be-49f6-b523-219d715fdf97	cmv9y3zwx00180qojsiga3msk	cmv9y3stj000c0qojpn896377	2026-10-16	10:00	11:00	CONFIRMADA	2026-10-13 19:42:50.712	2026-10-15 19:42:50.763	60000.00	\N	\N	\N	0.00
f597ca4d-398e-4587-b3cb-4dd38657e89b	cmv9y3zwx00180qojsiga3msk	cmv9y3t20000e0qojqflv5812	2026-10-16	21:00	22:00	CONFIRMADA	2026-10-13 19:42:50.712	2026-10-15 19:42:50.763	75000.00	\N	\N	\N	0.00
4a1a8ab8-586a-446a-84a0-5c3beca50b71	cmv9y3zwx00180qojsiga3msk	cmv9y3sgz00090qojk4g6d84d	2026-10-17	22:00	23:00	CONFIRMADA	2026-10-13 19:42:50.712	2026-10-15 19:42:50.763	75000.00	\N	\N	\N	0.00
470fc81e-fc51-4259-be38-388e4c22c255	cmv9y3zwx00180qojsiga3msk	cmv9y3sgz00090qojk4g6d84d	2026-10-17	23:00	00:00	CONFIRMADA	2026-10-13 19:42:50.712	2026-10-15 19:42:50.763	60000.00	\N	\N	\N	0.00
6fe76479-c57a-4523-b819-16f2c394b7bc	cmv9y3zwx00180qojsiga3msk	cmv9y3t69000f0qoj3mszpys3	2026-10-20	22:00	23:00	CONFIRMADA	2026-10-13 19:42:50.712	2026-10-15 19:42:50.763	75000.00	\N	\N	\N	0.00
9ed0cb51-f21c-455c-8a85-6b7d3f30564a	cmv9y41n7001g0qojm2z84sy9	cmv9y3sct00080qoj4aw8dtds	2026-10-11	19:00	20:30	CONFIRMADA	2026-10-09 19:42:50.713	2026-10-15 19:42:50.763	180000.00	t	2026-10-12 15:00:00	\N	0.00
3a0ec837-45c5-433a-9ad6-2a269854e889	cmv9y41n7001g0qojm2z84sy9	cmv9y3sgz00090qojk4g6d84d	2026-10-13	20:30	22:00	CONFIRMADA	2026-10-11 19:42:50.713	2026-10-15 19:42:50.763	180000.00	\N	\N	\N	0.00
22c0e63c-c209-441f-ab55-6c17e8719b30	cmv9y41n7001g0qojm2z84sy9	cmv9y3sgz00090qojk4g6d84d	2026-10-14	20:30	22:00	CONFIRMADA	2026-10-12 19:42:50.713	2026-10-15 19:42:50.763	180000.00	\N	\N	\N	0.00
27679b9f-cac9-4412-845d-cc5517444404	cmv9y41n7001g0qojm2z84sy9	cmv9y3stj000c0qojpn896377	2026-10-16	20:30	22:00	CONFIRMADA	2026-10-13 19:42:50.713	2026-10-15 19:42:50.763	180000.00	\N	\N	\N	0.00
117d7ee6-86b7-4b9e-89e0-4da2a99952ba	cmv9y423r001h0qojg031afv4	cmv9y3t20000e0qojqflv5812	2026-10-05	10:00	11:00	CONFIRMADA	2026-10-03 19:42:50.713	2026-10-15 19:42:50.763	90000.00	t	2026-10-06 15:00:00	\N	0.00
4fa19a79-5788-476d-82bc-5ce9759730ae	cmv9y423r001h0qojg031afv4	cmv9y3sct00080qoj4aw8dtds	2026-10-06	18:00	19:00	CONFIRMADA	2026-10-04 19:42:50.713	2026-10-15 19:42:50.763	90000.00	t	2026-10-07 15:00:00	\N	0.00
faa66f38-12e9-4784-b387-0ba071476deb	cmv9y423r001h0qojg031afv4	cmv9y3t69000f0qoj3mszpys3	2026-10-07	18:00	19:00	CONFIRMADA	2026-10-05 19:42:50.713	2026-10-15 19:42:50.763	90000.00	t	2026-10-08 15:00:00	\N	0.00
935e106b-45b8-4ed8-a787-e7eb0362ea76	cmv9y423r001h0qojg031afv4	cmv9y3sct00080qoj4aw8dtds	2026-10-07	19:00	20:00	CONFIRMADA	2026-10-05 19:42:50.714	2026-10-15 19:42:50.763	110000.00	t	2026-10-08 15:00:00	\N	0.00
d33262f5-fc16-4d12-ae2b-5b0b522417a5	cmv9y423r001h0qojg031afv4	cmv9y3t69000f0qoj3mszpys3	2026-10-07	22:00	23:00	CONFIRMADA	2026-10-05 19:42:50.714	2026-10-15 19:42:50.763	110000.00	t	2026-10-08 15:00:00	\N	0.00
bd5b26e3-f57b-42a2-973b-627778acafdd	cmv9y423r001h0qojg031afv4	cmv9y3t69000f0qoj3mszpys3	2026-10-08	20:00	21:00	CONFIRMADA	2026-10-06 19:42:50.714	2026-10-15 19:42:50.763	110000.00	t	2026-10-09 15:00:00	\N	0.00
43cc90ed-bb77-4b90-ae43-79f28c42cdd9	cmv9y423r001h0qojg031afv4	cmv9y3t20000e0qojqflv5812	2026-10-10	16:00	17:00	CONFIRMADA	2026-10-08 19:42:50.714	2026-10-15 19:42:50.763	90000.00	t	2026-10-11 15:00:00	\N	0.00
ab52d3ac-ac5e-4169-a6f6-c89cef86e416	cmv9y423r001h0qojg031afv4	cmv9y3t20000e0qojqflv5812	2026-10-10	22:00	23:00	CONFIRMADA	2026-10-08 19:42:50.714	2026-10-15 19:42:50.763	110000.00	t	2026-10-11 15:00:00	\N	0.00
1ac0bdbe-59a1-4844-8a8b-1da239b57b3d	cmv9y423r001h0qojg031afv4	cmv9y3spc000b0qojzzl7f1z4	2026-10-13	17:00	18:00	CONFIRMADA	2026-10-11 19:42:50.714	2026-10-15 19:42:50.763	90000.00	\N	\N	\N	0.00
b281898a-1f63-41a7-a823-eb2abe1cc6ce	cmv9y423r001h0qojg031afv4	cmv9y3sxq000d0qojg4gcrl5t	2026-10-13	21:00	22:00	CONFIRMADA	2026-10-11 19:42:50.714	2026-10-15 19:42:50.763	110000.00	\N	\N	\N	0.00
ecaba87b-0315-43ea-8f6d-119a436ff4f9	cmv9y423r001h0qojg031afv4	cmv9y3s8m00070qojs71grz9j	2026-10-15	20:00	21:00	CONFIRMADA	2026-10-13 19:42:50.714	2026-10-15 19:42:50.763	110000.00	\N	\N	\N	0.00
5616d86a-2bc4-4ad9-9571-a66164142e5c	cmv9y423r001h0qojg031afv4	cmv9y3stj000c0qojpn896377	2026-10-16	21:00	22:00	CONFIRMADA	2026-10-13 19:42:50.715	2026-10-15 19:42:50.763	110000.00	\N	\N	\N	0.00
505630ca-80de-49e0-9c3a-3d4f9b45a389	cmv9y423r001h0qojg031afv4	cmv9y3sct00080qoj4aw8dtds	2026-10-16	22:00	23:00	CONFIRMADA	2026-10-13 19:42:50.715	2026-10-15 19:42:50.763	110000.00	\N	\N	\N	0.00
5044de49-29b5-4a65-a19e-838d322dafe3	cmv9y423r001h0qojg031afv4	cmv9y3sct00080qoj4aw8dtds	2026-10-17	21:00	22:00	CANCELADA	2026-10-13 19:42:50.715	2026-10-15 19:42:50.763	110000.00	\N	\N	\N	0.00
9bf615ea-d309-4324-8ce0-d2066c44e52e	cmv9y423r001h0qojg031afv4	cmv9y3spc000b0qojzzl7f1z4	2026-10-18	20:00	21:00	CONFIRMADA	2026-10-13 19:42:50.715	2026-10-15 19:42:50.763	110000.00	\N	\N	\N	0.00
2beb04f7-e113-4f4e-96be-e2271037cc3b	cmv9y42ok001j0qojgq2urx3u	cmv9y3s8m00070qojs71grz9j	2026-10-05	17:00	18:00	CONFIRMADA	2026-10-03 19:42:50.715	2026-10-15 19:42:50.763	30000.00	t	2026-10-06 15:00:00	\N	0.00
4bc0f0d1-e7b4-47a1-aea2-22f9c45677a6	cmv9y42ok001j0qojgq2urx3u	cmv9y3spc000b0qojzzl7f1z4	2026-10-08	21:00	22:00	CONFIRMADA	2026-10-06 19:42:50.715	2026-10-15 19:42:50.763	30000.00	t	2026-10-09 15:00:00	\N	0.00
7aae1d9b-9741-4427-aa2f-fc292a0a4b95	cmv9y42ok001j0qojgq2urx3u	cmv9y3sct00080qoj4aw8dtds	2026-10-09	12:00	13:00	CONFIRMADA	2026-10-07 19:42:50.715	2026-10-15 19:42:50.763	30000.00	t	2026-10-10 15:00:00	\N	0.00
1351e4d3-6413-49bc-8c3b-f8863f51a12e	cmv9y42ok001j0qojgq2urx3u	cmv9y3stj000c0qojpn896377	2026-10-10	20:00	21:00	CONFIRMADA	2026-10-08 19:42:50.715	2026-10-15 19:42:50.763	36000.00	t	2026-10-11 15:00:00	\N	0.00
182ae847-ddc7-4ee8-a52b-d75df64c1bab	cmv9y42ok001j0qojgq2urx3u	cmv9y3s8m00070qojs71grz9j	2026-10-20	20:00	21:00	CONFIRMADA	2026-10-13 19:42:50.716	2026-10-15 19:42:50.763	30000.00	\N	\N	\N	0.00
60aaf0d3-9f9d-42a5-b3e2-8123d0f7d9e6	cmv9y439a001m0qoj59p1vghu	cmv9y3sct00080qoj4aw8dtds	2026-10-05	18:00	19:00	CONFIRMADA	2026-10-03 19:42:50.716	2026-10-15 19:42:50.763	30000.00	t	2026-10-06 15:00:00	\N	0.00
aa1c2045-6d20-4a3d-bbca-d96e1eb1a786	cmv9y439a001m0qoj59p1vghu	cmv9y3sxq000d0qojg4gcrl5t	2026-10-06	20:00	21:00	CONFIRMADA	2026-10-04 19:42:50.716	2026-10-15 19:42:50.763	30000.00	t	2026-10-07 15:00:00	\N	0.00
995af89e-7fa0-4a6e-b305-b5d909e01555	cmv9y439a001m0qoj59p1vghu	cmv9y3sgz00090qojk4g6d84d	2026-10-07	19:00	20:00	CONFIRMADA	2026-10-05 19:42:50.716	2026-10-15 19:42:50.763	30000.00	t	2026-10-08 15:00:00	\N	0.00
87c0a571-b9c1-452c-8afd-094afcaa5349	cmv9y439a001m0qoj59p1vghu	cmv9y3sxq000d0qojg4gcrl5t	2026-10-08	12:00	13:00	CONFIRMADA	2026-10-06 19:42:50.716	2026-10-15 19:42:50.763	30000.00	t	2026-10-09 15:00:00	\N	0.00
e2a2c6ae-6758-4d55-92e3-990dfe8edc12	cmv9y439a001m0qoj59p1vghu	cmv9y3t20000e0qojqflv5812	2026-10-08	13:00	14:00	CONFIRMADA	2026-10-06 19:42:50.716	2026-10-15 19:42:50.763	30000.00	t	2026-10-09 15:00:00	\N	0.00
869e79c7-6dbf-418a-a3a8-a5f089a94e12	cmv9y439a001m0qoj59p1vghu	cmv9y3sl6000a0qojzojr1f1e	2026-10-08	14:00	15:00	CONFIRMADA	2026-10-06 19:42:50.717	2026-10-15 19:42:50.763	30000.00	t	2026-10-09 15:00:00	\N	0.00
8edcb4e9-afe7-4c0f-9c12-1fbc38c750d3	cmv9y439a001m0qoj59p1vghu	cmv9y3sl6000a0qojzojr1f1e	2026-10-09	21:00	22:00	CONFIRMADA	2026-10-07 19:42:50.717	2026-10-15 19:42:50.763	30000.00	t	2026-10-10 15:00:00	\N	0.00
d1a50908-d230-4aa0-8804-73e879f8cfb5	cmv9y439a001m0qoj59p1vghu	cmv9y3spc000b0qojzzl7f1z4	2026-10-15	19:00	20:00	CONFIRMADA	2026-10-13 19:42:50.717	2026-10-15 19:42:50.763	30000.00	\N	\N	\N	0.00
dac1b563-2f57-4440-a544-3c90b25eb7b5	cmv9y439a001m0qoj59p1vghu	cmv9y3sxq000d0qojg4gcrl5t	2026-10-16	16:00	17:00	CONFIRMADA	2026-10-13 19:42:50.718	2026-10-15 19:42:50.763	30000.00	\N	\N	\N	0.00
1d0a1856-407d-4ead-825f-6274db1fc1fe	cmv9y439a001m0qoj59p1vghu	cmv9y3sct00080qoj4aw8dtds	2026-10-19	21:00	22:00	CONFIRMADA	2026-10-13 19:42:50.718	2026-10-15 19:42:50.763	30000.00	\N	\N	\N	0.00
638e1caf-87d1-4cc6-afb7-e8300a45a50b	cmv9y439a001m0qoj59p1vghu	cmv9y3s8m00070qojs71grz9j	2026-10-20	16:00	17:00	CONFIRMADA	2026-10-13 19:42:50.718	2026-10-15 19:42:50.763	30000.00	\N	\N	\N	0.00
de5f2c31-e80e-40a7-994f-e93b4e6d8e46	cmv9y439a001m0qoj59p1vghu	cmv9y3t20000e0qojqflv5812	2026-10-20	21:00	22:00	CANCELADA	2026-10-13 19:42:50.718	2026-10-15 19:42:50.763	30000.00	\N	\N	\N	0.00
2cc05906-2612-4d96-8066-84d6d01bb911	cmv9y43v4001p0qoj46n3rpid	cmv9y3spc000b0qojzzl7f1z4	2026-10-08	12:00	13:00	CONFIRMADA	2026-10-06 19:42:50.718	2026-10-15 19:42:50.763	38000.00	t	2026-10-09 15:00:00	\N	0.00
833ad051-ff88-4f86-a4e1-a09e2fb2d50c	cmv9y43v4001p0qoj46n3rpid	cmv9y3s8m00070qojs71grz9j	2026-10-08	20:00	21:00	CONFIRMADA	2026-10-06 19:42:50.718	2026-10-15 19:42:50.763	38000.00	t	2026-10-09 15:00:00	\N	0.00
6aa44b50-9674-4f1f-9c5f-423e0af2dc3b	cmv9y43v4001p0qoj46n3rpid	cmv9y3s8m00070qojs71grz9j	2026-10-09	20:00	21:00	CONFIRMADA	2026-10-07 19:42:50.718	2026-10-15 19:42:50.763	38000.00	t	2026-10-10 15:00:00	\N	0.00
dec63235-6290-449e-8a8d-23cead61dc2c	cmv9y43v4001p0qoj46n3rpid	cmv9y3sgz00090qojk4g6d84d	2026-10-11	20:00	21:00	CANCELADA	2026-10-09 19:42:50.719	2026-10-15 19:42:50.763	36000.00	\N	\N	\N	0.00
1e210de5-91f8-4cad-a6ad-2385499d4c14	cmv9y43v4001p0qoj46n3rpid	cmv9y3sgz00090qojk4g6d84d	2026-10-12	08:00	09:00	CONFIRMADA	2026-10-10 19:42:50.719	2026-10-15 19:42:50.763	38000.00	f	2026-10-13 15:00:00	\N	0.00
9f1e73f2-29e6-47e8-83f4-0b8812271775	cmv9y43v4001p0qoj46n3rpid	cmv9y3sxq000d0qojg4gcrl5t	2026-10-12	20:00	21:00	CONFIRMADA	2026-10-10 19:42:50.719	2026-10-15 19:42:50.763	38000.00	f	2026-10-13 15:00:00	\N	0.00
52d9e9d7-58b4-4364-9c6c-78e54092e26e	cmv9y43v4001p0qoj46n3rpid	cmv9y3sgz00090qojk4g6d84d	2026-10-12	21:00	22:00	CONFIRMADA	2026-10-10 19:42:50.719	2026-10-15 19:42:50.763	38000.00	t	2026-10-13 15:00:00	\N	0.00
fa584297-1162-4d22-9eb9-41188b35b7f8	cmv9y43v4001p0qoj46n3rpid	cmv9y3spc000b0qojzzl7f1z4	2026-10-14	13:00	14:00	CANCELADA	2026-10-12 19:42:50.719	2026-10-15 19:42:50.763	38000.00	\N	\N	\N	0.00
861bc07f-fc8f-49f6-8678-0f8b7fb2dd6c	cmv9y43v4001p0qoj46n3rpid	cmv9y3spc000b0qojzzl7f1z4	2026-10-14	19:00	20:00	CONFIRMADA	2026-10-12 19:42:50.719	2026-10-15 19:42:50.763	38000.00	\N	\N	\N	0.00
5741f6e3-005a-4674-872c-f2a17f4797fe	cmv9y43v4001p0qoj46n3rpid	cmv9y3sct00080qoj4aw8dtds	2026-10-15	20:00	21:00	CONFIRMADA	2026-10-13 19:42:50.719	2026-10-15 19:42:50.763	38000.00	\N	\N	\N	0.00
fbc003f1-f146-42ff-8e87-5b5f351e3314	cmv9y43v4001p0qoj46n3rpid	cmv9y3sxq000d0qojg4gcrl5t	2026-10-17	15:00	16:00	CONFIRMADA	2026-10-13 19:42:50.719	2026-10-15 19:42:50.763	36000.00	\N	\N	\N	0.00
e355d969-7038-439e-be2e-2721036beb50	cmv9y43v4001p0qoj46n3rpid	cmv9y3sxq000d0qojg4gcrl5t	2026-10-18	12:00	13:00	CONFIRMADA	2026-10-13 19:42:50.719	2026-10-15 19:42:50.763	36000.00	\N	\N	\N	0.00
f3a07334-1362-4f6b-bc3f-262c8b644472	cmv9y43v4001p0qoj46n3rpid	cmv9y3sct00080qoj4aw8dtds	2026-10-20	19:00	20:00	CANCELADA	2026-10-13 19:42:50.719	2026-10-15 19:42:50.763	38000.00	\N	\N	\N	0.00
d6e70f26-9d88-4110-8127-7a674f5944cb	cmv9y43v4001p0qoj46n3rpid	cmv9y3t20000e0qojqflv5812	2026-10-20	20:00	21:00	CONFIRMADA	2026-10-13 19:42:50.719	2026-10-15 19:42:50.763	38000.00	\N	\N	\N	0.00
72dee478-4b33-4cb5-979f-97afdb25cf45	cmv9y4519001v0qoj6xbxi3u0	cmv9y3t20000e0qojqflv5812	2026-10-05	22:00	23:00	CONFIRMADA	2026-10-03 19:42:50.72	2026-10-15 19:42:50.763	75000.00	t	2026-10-06 15:00:00	\N	0.00
0e7af7d7-298e-49ab-89b1-1e9fb6bfc9f7	cmv9y4519001v0qoj6xbxi3u0	cmv9y3sxq000d0qojg4gcrl5t	2026-10-06	09:00	10:00	CONFIRMADA	2026-10-04 19:42:50.72	2026-10-15 19:42:50.763	60000.00	t	2026-10-07 15:00:00	\N	0.00
597d9c39-14ef-4a25-b61f-a53dcd406e2c	cmv9y4519001v0qoj6xbxi3u0	cmv9y3sxq000d0qojg4gcrl5t	2026-10-07	19:00	20:00	CONFIRMADA	2026-10-05 19:42:50.72	2026-10-15 19:42:50.763	75000.00	t	2026-10-08 15:00:00	\N	0.00
6171db35-d20c-48ae-8a4e-52ef3bd55281	cmv9y4519001v0qoj6xbxi3u0	cmv9y3stj000c0qojpn896377	2026-10-08	19:00	20:00	CANCELADA	2026-10-06 19:42:50.72	2026-10-15 19:42:50.763	75000.00	\N	\N	\N	0.00
c2306340-b4ad-42b2-9b2f-0b3fa1488a60	cmv9y4519001v0qoj6xbxi3u0	cmv9y3sl6000a0qojzojr1f1e	2026-10-10	21:00	22:00	CONFIRMADA	2026-10-08 19:42:50.72	2026-10-15 19:42:50.763	75000.00	t	2026-10-11 15:00:00	\N	0.00
26732c2b-6a41-4c5b-bb7b-10dd043008c1	cmv9y4519001v0qoj6xbxi3u0	cmv9y3t20000e0qojqflv5812	2026-10-11	23:00	00:00	CONFIRMADA	2026-10-09 19:42:50.72	2026-10-15 19:42:50.763	60000.00	t	2026-10-12 15:00:00	\N	0.00
23ece219-2304-4490-8fb9-b0059c654b44	cmv9y4519001v0qoj6xbxi3u0	cmv9y3spc000b0qojzzl7f1z4	2026-10-12	13:00	14:00	CONFIRMADA	2026-10-10 19:42:50.72	2026-10-15 19:42:50.763	60000.00	t	2026-10-13 15:00:00	\N	0.00
e1c4aa35-ba03-4157-9c89-90fb92c20a00	cmv9y4519001v0qoj6xbxi3u0	cmv9y3s8m00070qojs71grz9j	2026-10-12	21:00	22:00	CONFIRMADA	2026-10-10 19:42:50.72	2026-10-15 19:42:50.763	75000.00	f	2026-10-13 15:00:00	\N	0.00
a5330774-3bd8-4341-a4c5-1817962bb31e	cmv9y4519001v0qoj6xbxi3u0	cmv9y3t69000f0qoj3mszpys3	2026-10-14	13:00	14:00	CANCELADA	2026-10-12 19:42:50.721	2026-10-15 19:42:50.763	60000.00	\N	\N	\N	0.00
af769c28-62fb-4669-bd58-6ef64cda8aeb	cmv9y4519001v0qoj6xbxi3u0	cmv9y3sgz00090qojk4g6d84d	2026-10-16	19:00	20:00	CONFIRMADA	2026-10-13 19:42:50.721	2026-10-15 19:42:50.763	75000.00	\N	\N	\N	0.00
4ef59ed4-c4f8-4fb6-ba51-be0e7aab9312	cmv9y4519001v0qoj6xbxi3u0	cmv9y3stj000c0qojpn896377	2026-10-16	23:00	00:00	CONFIRMADA	2026-10-13 19:42:50.721	2026-10-15 19:42:50.763	60000.00	\N	\N	\N	0.00
bf2c3c21-4cd1-4fb6-92f3-55e73f8aa542	cmv9y4519001v0qoj6xbxi3u0	cmv9y3spc000b0qojzzl7f1z4	2026-10-17	20:00	21:00	CANCELADA	2026-10-13 19:42:50.721	2026-10-15 19:42:50.763	75000.00	\N	\N	\N	0.00
eb4ba03c-6621-418e-a6d1-72a94beafeb0	cmv9y4519001v0qoj6xbxi3u0	cmv9y3spc000b0qojzzl7f1z4	2026-10-17	23:00	00:00	CONFIRMADA	2026-10-13 19:42:50.721	2026-10-15 19:42:50.763	60000.00	\N	\N	\N	0.00
85bc479e-a47d-402c-9b26-d2dbf27503d8	cmv9y4519001v0qoj6xbxi3u0	cmv9y3sxq000d0qojg4gcrl5t	2026-10-19	11:00	12:00	CONFIRMADA	2026-10-13 19:42:50.721	2026-10-15 19:42:50.763	60000.00	\N	\N	\N	0.00
5e954ba3-75fd-44b1-99ca-0d6134fac00b	cmv9y4519001v0qoj6xbxi3u0	cmv9y3stj000c0qojpn896377	2026-10-20	20:00	21:00	CONFIRMADA	2026-10-13 19:42:50.721	2026-10-15 19:42:50.763	75000.00	\N	\N	\N	0.00
1bad2bfc-6689-4204-a9cc-66d3eb68f4db	cmv9y45m1001x0qoj7bqi6uqa	cmv9y3t69000f0qoj3mszpys3	2026-10-05	17:00	18:00	CONFIRMADA	2026-10-03 19:42:50.721	2026-10-15 19:42:50.763	60000.00	t	2026-10-06 15:00:00	\N	0.00
a0d8dd0e-95ca-4ea3-b643-d683f1f51828	cmv9y45m1001x0qoj7bqi6uqa	cmv9y3spc000b0qojzzl7f1z4	2026-10-06	22:00	23:00	CONFIRMADA	2026-10-04 19:42:50.721	2026-10-15 19:42:50.763	75000.00	t	2026-10-07 15:00:00	\N	0.00
b6e7bf59-a712-4637-9b33-4b5e9f6d7147	cmv9y45m1001x0qoj7bqi6uqa	cmv9y3sl6000a0qojzojr1f1e	2026-10-07	19:00	20:00	CONFIRMADA	2026-10-05 19:42:50.721	2026-10-15 19:42:50.763	75000.00	t	2026-10-08 15:00:00	\N	0.00
3b8a0b62-d1cf-4077-acb0-0be2e26ae146	cmv9y45m1001x0qoj7bqi6uqa	cmv9y3t69000f0qoj3mszpys3	2026-10-10	20:00	21:00	CONFIRMADA	2026-10-08 19:42:50.722	2026-10-15 19:42:50.763	75000.00	t	2026-10-11 15:00:00	\N	0.00
4815ef67-8a1f-4025-8f54-582497f24c92	cmv9y45m1001x0qoj7bqi6uqa	cmv9y3stj000c0qojpn896377	2026-10-15	21:00	22:00	CONFIRMADA	2026-10-13 19:42:50.722	2026-10-15 19:42:50.763	75000.00	\N	\N	\N	0.00
a1df8112-5942-468b-9ac7-8656bd6a3e9c	cmv9y45m1001x0qoj7bqi6uqa	cmv9y3sl6000a0qojzojr1f1e	2026-10-16	23:00	00:00	CONFIRMADA	2026-10-13 19:42:50.722	2026-10-15 19:42:50.763	60000.00	\N	\N	\N	0.00
39c66850-1336-4bc5-be9e-fb4a943549b5	cmv9y45m1001x0qoj7bqi6uqa	cmv9y3t69000f0qoj3mszpys3	2026-10-20	20:00	21:00	CONFIRMADA	2026-10-13 19:42:50.722	2026-10-15 19:42:50.763	75000.00	\N	\N	\N	0.00
f8ebf483-36f5-442c-86f0-b64efff71f5a	cmv9y466y001z0qojnhsqll8i	cmv9y3stj000c0qojpn896377	2026-10-05	13:00	14:00	CONFIRMADA	2026-10-03 19:42:50.722	2026-10-15 19:42:50.763	45000.00	t	2026-10-06 15:00:00	\N	0.00
8cf3fd58-e75d-4b56-9052-fb9a7c2957e5	cmv9y466y001z0qojnhsqll8i	cmv9y3spc000b0qojzzl7f1z4	2026-10-05	22:00	23:00	CONFIRMADA	2026-10-03 19:42:50.722	2026-10-15 19:42:50.763	55000.00	t	2026-10-06 15:00:00	\N	0.00
66c29ee8-4963-472e-8db7-6c8f8c8ebde7	cmv9y466y001z0qojnhsqll8i	cmv9y3t20000e0qojqflv5812	2026-10-06	22:00	23:00	CONFIRMADA	2026-10-04 19:42:50.722	2026-10-15 19:42:50.763	55000.00	t	2026-10-07 15:00:00	\N	0.00
890f6490-94e6-437d-bfc4-f08aaca502f0	cmv9y466y001z0qojnhsqll8i	cmv9y3spc000b0qojzzl7f1z4	2026-10-07	19:00	20:00	CONFIRMADA	2026-10-05 19:42:50.722	2026-10-15 19:42:50.763	55000.00	t	2026-10-08 15:00:00	\N	0.00
26f31f90-7fe5-4f50-a5e3-326a84cc5756	cmv9y466y001z0qojnhsqll8i	cmv9y3sgz00090qojk4g6d84d	2026-10-11	19:00	20:00	CONFIRMADA	2026-10-09 19:42:50.723	2026-10-15 19:42:50.763	55000.00	t	2026-10-12 15:00:00	\N	0.00
13ca4460-4768-414a-96ca-aa28fc1dd876	cmv9y466y001z0qojnhsqll8i	cmv9y3sct00080qoj4aw8dtds	2026-10-12	21:00	22:00	CONFIRMADA	2026-10-10 19:42:50.723	2026-10-15 19:42:50.763	55000.00	t	2026-10-13 15:00:00	\N	0.00
41a1de0c-0522-4d77-8654-e5caf75e3787	cmv9y466y001z0qojnhsqll8i	cmv9y3stj000c0qojpn896377	2026-10-13	20:00	21:00	CONFIRMADA	2026-10-11 19:42:50.723	2026-10-15 19:42:50.763	55000.00	\N	\N	\N	0.00
da994a6d-de53-47e1-b081-e7a485d9c13c	cmv9y466y001z0qojnhsqll8i	cmv9y3sl6000a0qojzojr1f1e	2026-10-15	11:00	12:00	CANCELADA	2026-10-13 19:42:50.723	2026-10-15 19:42:50.763	45000.00	\N	\N	\N	0.00
41ab4547-dec0-4ec8-88cb-794145c43a7a	cmv9y466y001z0qojnhsqll8i	cmv9y3sxq000d0qojg4gcrl5t	2026-10-16	15:00	16:00	CONFIRMADA	2026-10-13 19:42:50.723	2026-10-15 19:42:50.763	45000.00	\N	\N	\N	0.00
39f894c6-cad2-4a31-9e55-37468534d94c	cmv9y466y001z0qojnhsqll8i	cmv9y3stj000c0qojpn896377	2026-10-16	17:00	18:00	CANCELADA	2026-10-13 19:42:50.723	2026-10-15 19:42:50.763	45000.00	\N	\N	\N	0.00
ae1e3488-0eea-4dcb-91be-0676f6d435d6	cmv9y466y001z0qojnhsqll8i	cmv9y3t20000e0qojqflv5812	2026-10-16	19:00	20:00	CONFIRMADA	2026-10-13 19:42:50.723	2026-10-15 19:42:50.763	55000.00	\N	\N	\N	0.00
d4b21062-5e23-495b-b40c-cb992edd0615	cmv9y466y001z0qojnhsqll8i	cmv9y3t20000e0qojqflv5812	2026-10-16	22:00	23:00	CANCELADA	2026-10-13 19:42:50.723	2026-10-15 19:42:50.763	55000.00	\N	\N	\N	0.00
90444207-30a2-4cf2-ab53-ae54f9401ebf	cmv9y466y001z0qojnhsqll8i	cmv9y3sct00080qoj4aw8dtds	2026-10-19	23:00	00:00	CONFIRMADA	2026-10-13 19:42:50.723	2026-10-15 19:42:50.763	45000.00	\N	\N	\N	0.00
a41c6e82-626e-431a-8772-288ff3ca0471	cmv9y466y001z0qojnhsqll8i	cmv9y3t20000e0qojqflv5812	2026-10-20	19:00	20:00	CONFIRMADA	2026-10-13 19:42:50.723	2026-10-15 19:42:50.763	55000.00	\N	\N	\N	0.00
371387c2-e862-4cbe-85b2-4206fb454e34	cmv9y46ro00210qojkgj7tqdi	cmv9y3sxq000d0qojg4gcrl5t	2026-10-10	19:00	20:30	CONFIRMADA	2026-10-08 19:42:50.724	2026-10-15 19:42:50.763	180000.00	t	2026-10-11 15:00:00	\N	0.00
315c6eda-9428-441e-8dca-24bdb71685d2	cmv9y46ro00210qojkgj7tqdi	cmv9y3sxq000d0qojg4gcrl5t	2026-10-13	20:30	22:00	CONFIRMADA	2026-10-11 19:42:50.724	2026-10-15 19:42:50.763	180000.00	\N	\N	\N	0.00
a1054b4d-7f74-4de6-b78a-9b056a42aa84	cmv9y46ro00210qojkgj7tqdi	cmv9y3sct00080qoj4aw8dtds	2026-10-19	14:30	16:00	CONFIRMADA	2026-10-13 19:42:50.724	2026-10-15 19:42:50.763	180000.00	\N	\N	\N	0.00
79faa451-5c9a-4a99-9940-cc3840e9f04d	cmv9y46ro00210qojkgj7tqdi	cmv9y3sl6000a0qojzojr1f1e	2026-10-20	20:30	22:00	CANCELADA	2026-10-13 19:42:50.724	2026-10-15 19:42:50.763	180000.00	\N	\N	\N	0.00
1cd6d6a6-99d8-4176-b17e-66960606bd76	cmv9y47ti00240qojcus2yb4r	cmv9y3s8m00070qojs71grz9j	2026-10-06	20:00	21:00	CONFIRMADA	2026-10-04 19:42:50.725	2026-10-15 19:42:50.763	55000.00	t	2026-10-07 15:00:00	\N	0.00
d20d559a-012e-4102-abf8-aa3a278fe75c	cmv9y47ti00240qojcus2yb4r	cmv9y3t69000f0qoj3mszpys3	2026-10-08	19:00	20:00	CONFIRMADA	2026-10-06 19:42:50.725	2026-10-15 19:42:50.763	55000.00	t	2026-10-09 15:00:00	\N	0.00
f2b1d349-5ef7-4925-9759-6b05c62d56d4	cmv9y47ti00240qojcus2yb4r	cmv9y3t69000f0qoj3mszpys3	2026-10-11	22:00	23:00	CONFIRMADA	2026-10-09 19:42:50.725	2026-10-15 19:42:50.763	55000.00	t	2026-10-12 15:00:00	\N	0.00
ccf1e5c6-3961-4dc3-865a-16c7087d0951	cmv9y47ti00240qojcus2yb4r	cmv9y3t69000f0qoj3mszpys3	2026-10-11	23:00	00:00	CONFIRMADA	2026-10-09 19:42:50.725	2026-10-15 19:42:50.763	45000.00	t	2026-10-12 15:00:00	\N	0.00
94a90532-359c-4125-8dc1-154e2848032f	cmv9y47ti00240qojcus2yb4r	cmv9y3sgz00090qojk4g6d84d	2026-10-12	20:00	21:00	CONFIRMADA	2026-10-10 19:42:50.725	2026-10-15 19:42:50.763	55000.00	t	2026-10-13 15:00:00	\N	0.00
b56da0fd-cfbf-46bd-83a6-de0114524c52	cmv9y47ti00240qojcus2yb4r	cmv9y3spc000b0qojzzl7f1z4	2026-10-12	23:00	00:00	CONFIRMADA	2026-10-10 19:42:50.725	2026-10-15 19:42:50.763	45000.00	t	2026-10-13 15:00:00	\N	0.00
82ae9177-d462-4a44-9f38-4d356cf42e89	cmv9y47ti00240qojcus2yb4r	cmv9y3stj000c0qojpn896377	2026-10-15	23:00	00:00	CANCELADA	2026-10-13 19:42:50.726	2026-10-15 19:42:50.763	45000.00	\N	\N	\N	0.00
9f86be32-ba16-4e37-bf05-7702893d39de	cmv9y47ti00240qojcus2yb4r	cmv9y3spc000b0qojzzl7f1z4	2026-10-16	19:00	20:00	CONFIRMADA	2026-10-13 19:42:50.726	2026-10-15 19:42:50.763	55000.00	\N	\N	\N	0.00
aa81f0d0-554e-43a8-b58a-fde9966b433e	cmv9y47ti00240qojcus2yb4r	cmv9y3spc000b0qojzzl7f1z4	2026-10-17	19:00	20:00	CONFIRMADA	2026-10-13 19:42:50.726	2026-10-15 19:42:50.763	55000.00	\N	\N	\N	0.00
3c2a1576-007c-4d80-9e26-aedcdd82b38b	cmv9y47ti00240qojcus2yb4r	cmv9y3sgz00090qojk4g6d84d	2026-10-18	19:00	20:00	CONFIRMADA	2026-10-13 19:42:50.726	2026-10-15 19:42:50.763	55000.00	\N	\N	\N	0.00
162246cf-6a11-4491-837b-ae1d972d4e03	cmv9y47ti00240qojcus2yb4r	cmv9y3sxq000d0qojg4gcrl5t	2026-10-18	23:00	00:00	CONFIRMADA	2026-10-13 19:42:50.726	2026-10-15 19:42:50.763	45000.00	\N	\N	\N	0.00
87415e7c-bb61-4b14-84ab-c04c830c20cb	cmv9y47ti00240qojcus2yb4r	cmv9y3sct00080qoj4aw8dtds	2026-10-19	22:00	23:00	CANCELADA	2026-10-13 19:42:50.726	2026-10-15 19:42:50.763	55000.00	\N	\N	\N	0.00
ed31227e-6738-4cee-b511-4b79130fd482	cmv9y47ti00240qojcus2yb4r	cmv9y3t69000f0qoj3mszpys3	2026-10-19	23:00	00:00	CONFIRMADA	2026-10-13 19:42:50.726	2026-10-15 19:42:50.763	45000.00	\N	\N	\N	0.00
c971cf8b-9bee-4b9f-8ab5-2a7f0611d47f	cmv9y47ti00240qojcus2yb4r	cmv9y3sct00080qoj4aw8dtds	2026-10-20	22:00	23:00	CONFIRMADA	2026-10-13 19:42:50.726	2026-10-15 19:42:50.763	55000.00	\N	\N	\N	0.00
b6a97aec-30a4-4cee-b7c6-696dd650a6c3	cmv9y48e700260qojl7xc5mlm	cmv9y3t69000f0qoj3mszpys3	2026-10-05	09:00	10:00	CONFIRMADA	2026-10-03 19:42:50.726	2026-10-15 19:42:50.763	45000.00	t	2026-10-06 15:00:00	\N	0.00
aab4f583-e16b-4b7b-851d-4b6f4cd0a2c2	cmv9y48e700260qojl7xc5mlm	cmv9y3stj000c0qojpn896377	2026-10-08	21:00	22:00	CONFIRMADA	2026-10-06 19:42:50.726	2026-10-15 19:42:50.763	55000.00	t	2026-10-09 15:00:00	\N	0.00
6e238d3b-ccb6-4fec-aec0-7b92c3635110	cmv9y48e700260qojl7xc5mlm	cmv9y3sct00080qoj4aw8dtds	2026-10-09	17:00	18:00	CONFIRMADA	2026-10-07 19:42:50.726	2026-10-15 19:42:50.763	45000.00	t	2026-10-10 15:00:00	\N	0.00
04302e07-945c-45bd-bd8e-4df7f7f65a9d	cmv9y48e700260qojl7xc5mlm	cmv9y3s8m00070qojs71grz9j	2026-10-10	17:00	18:00	CONFIRMADA	2026-10-08 19:42:50.727	2026-10-15 19:42:50.763	45000.00	t	2026-10-11 15:00:00	\N	0.00
c893ca95-24d4-465d-849e-eb550dae7586	cmv9y48e700260qojl7xc5mlm	cmv9y3spc000b0qojzzl7f1z4	2026-10-10	19:00	20:00	CONFIRMADA	2026-10-08 19:42:50.727	2026-10-15 19:42:50.763	55000.00	t	2026-10-11 15:00:00	\N	0.00
901f11b2-1598-4da1-bf96-94bcbdd89b53	cmv9y48e700260qojl7xc5mlm	cmv9y3sct00080qoj4aw8dtds	2026-10-11	20:00	21:00	CONFIRMADA	2026-10-09 19:42:50.727	2026-10-15 19:42:50.763	55000.00	t	2026-10-12 15:00:00	\N	0.00
36bc4d37-6c49-430b-b82a-22b9d8ac3338	cmv9y48e700260qojl7xc5mlm	cmv9y3t69000f0qoj3mszpys3	2026-10-16	18:00	19:00	CANCELADA	2026-10-13 19:42:50.727	2026-10-15 19:42:50.763	45000.00	\N	\N	\N	0.00
12431351-c2c1-459d-8a30-d434375eb0ee	cmv9y48e700260qojl7xc5mlm	cmv9y3t20000e0qojqflv5812	2026-10-19	21:00	22:00	CONFIRMADA	2026-10-13 19:42:50.727	2026-10-15 19:42:50.763	55000.00	\N	\N	\N	0.00
fb00662e-37f4-423c-bbee-f69b279d54ea	cmv9y48e700260qojl7xc5mlm	cmv9y3sgz00090qojk4g6d84d	2026-10-20	19:00	20:00	CONFIRMADA	2026-10-13 19:42:50.727	2026-10-15 19:42:50.763	55000.00	\N	\N	\N	0.00
c259f648-3d0c-4497-9bb4-2a87de61ae9c	cmv9y49jp002a0qojcih9lzk6	cmv9y3sl6000a0qojzojr1f1e	2026-10-06	19:00	20:00	CONFIRMADA	2026-10-04 19:42:50.727	2026-10-15 19:42:50.763	110000.00	t	2026-10-07 15:00:00	\N	0.00
1569e5fd-9404-4965-9a3a-992deeabeea2	cmv9y49jp002a0qojcih9lzk6	cmv9y3sct00080qoj4aw8dtds	2026-10-06	20:00	21:00	CONFIRMADA	2026-10-04 19:42:50.727	2026-10-15 19:42:50.763	110000.00	t	2026-10-07 15:00:00	\N	0.00
1a11366e-f92c-4654-b2c0-0537b1208b68	cmv9y49jp002a0qojcih9lzk6	cmv9y3stj000c0qojpn896377	2026-10-07	19:00	20:00	CONFIRMADA	2026-10-05 19:42:50.727	2026-10-15 19:42:50.763	110000.00	t	2026-10-08 15:00:00	\N	0.00
f9734c0d-c3a2-4317-89f4-aa37ee30120d	cmv9y49jp002a0qojcih9lzk6	cmv9y3stj000c0qojpn896377	2026-10-10	12:00	13:00	CONFIRMADA	2026-10-08 19:42:50.728	2026-10-15 19:42:50.763	90000.00	t	2026-10-11 15:00:00	\N	0.00
ed0e977e-384f-4f88-b159-6b291c84f21e	cmv9y49jp002a0qojcih9lzk6	cmv9y3t20000e0qojqflv5812	2026-10-10	17:00	18:00	CONFIRMADA	2026-10-08 19:42:50.728	2026-10-15 19:42:50.763	90000.00	t	2026-10-11 15:00:00	\N	0.00
466a8020-8808-4cfc-8545-f444b0d69bc8	cmv9y49jp002a0qojcih9lzk6	cmv9y3sct00080qoj4aw8dtds	2026-10-10	20:00	21:00	CONFIRMADA	2026-10-08 19:42:50.728	2026-10-15 19:42:50.763	110000.00	t	2026-10-11 15:00:00	\N	0.00
d63cd051-d670-4de8-bbe8-2a67cd415516	cmv9y49jp002a0qojcih9lzk6	cmv9y3t69000f0qoj3mszpys3	2026-10-11	14:00	15:00	CONFIRMADA	2026-10-09 19:42:50.728	2026-10-15 19:42:50.763	90000.00	t	2026-10-12 15:00:00	\N	0.00
cmv9yof1j0000zkvxxbmmdhyi	cmv9y4519001v0qoj6xbxi3u0	cmv9y3s4e00060qoj7eq8hk4u	2026-10-17	14:00	15:00	CONFIRMADA	2026-10-15 19:58:24.295	2026-10-15 19:58:27.791	60000.00	\N	\N	\N	0.00
cmvyjaexe000008l41sitkxms	cmv9y3zbh00160qojicf22704	cmv9y3s4e00060qoj7eq8hk4u	2026-11-02	13:00	14:00	CONFIRMADA	2026-11-02 00:41:51.122	2026-11-02 01:28:48.714	60000.00	\N	\N	10	0.00
cmw0zczj9000007l5ouosr1w0	cmv9y3zbh00160qojicf22704	cmv9y3s4e00060qoj7eq8hk4u	2026-11-03	18:00	19:00	CONFIRMADA	2026-11-03 17:47:17.349	2026-11-03 17:49:23.583	60000.00	\N	\N	9	3000.00
cmw0zgez7000307l577e5b5r7	cmv9y41n7001g0qojm2z84sy9	cmv9y3sxq000d0qojg4gcrl5t	2026-11-04	16:00	17:30	CONFIRMADA	2026-11-03 17:49:57.331	2026-11-03 17:49:59.559	180000.00	\N	\N	\N	18000.00
cmvylwi5r000007jquxkhesqo	cmv9y41n7001g0qojm2z84sy9	cmv9y3s4e00060qoj7eq8hk4u	2026-11-03	11:30	13:00	CONFIRMADA	2026-11-02 01:55:00.975	2026-11-02 16:04:48.088	180000.00	\N	\N	15	0.00
cmw3w5dwi00008ovxjhtkj3qz	cmv9y46ro00210qojkgj7tqdi	cmv9y3s4e00060qoj7eq8hk4u	2026-11-06	16:00	17:30	CONFIRMADA	2026-11-05 18:40:42.403	2026-11-05 18:41:32.171	180000.00	\N	\N	4	9000.00
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
cmv9y3rec00000qojezt8jfku	Admin TocaYJuga	admin@tocayjuga.com	$argon2id$v=19$m=65536,p=4,t=3$qrJvPiMokXJqI+CoM7L+Dw$1bDFSm5orphyged81Z+7UfkIMO0nTr/xVNluEx7laME	\N	\N	ADMIN	t	2026-10-15 19:42:20.532	2026-10-15 19:42:20.532	\N
cmv9y3rin00010qoj7laj7yi0	Martín Gómez	dueno@tocayjuga.com	$argon2id$v=19$m=65536,p=4,t=3$qrJvPiMokXJqI+CoM7L+Dw$1bDFSm5orphyged81Z+7UfkIMO0nTr/xVNluEx7laME	30111000	11 6000-1000	DUENIO	t	2026-10-15 19:42:20.687	2026-10-15 19:42:20.687	N
cmv9y3rmx00020qojj6dx0o5r	Laura Fernández	laura.fernandez@tocayjuga.com	$argon2id$v=19$m=65536,p=4,t=3$qrJvPiMokXJqI+CoM7L+Dw$1bDFSm5orphyged81Z+7UfkIMO0nTr/xVNluEx7laME	30111001	11 6000-1001	DUENIO	t	2026-10-15 19:42:20.841	2026-10-15 19:42:20.841	N
cmv9y3rr500030qoj79b4qxzf	Diego Sosa	diego.sosa@tocayjuga.com	$argon2id$v=19$m=65536,p=4,t=3$qrJvPiMokXJqI+CoM7L+Dw$1bDFSm5orphyged81Z+7UfkIMO0nTr/xVNluEx7laME	30111002	11 6000-1002	DUENIO	t	2026-10-15 19:42:20.993	2026-10-15 19:42:20.993	N
cmv9y3rvu00040qoj727mo1cb	Sofía Paz	sofia.paz@tocayjuga.com	$argon2id$v=19$m=65536,p=4,t=3$qrJvPiMokXJqI+CoM7L+Dw$1bDFSm5orphyged81Z+7UfkIMO0nTr/xVNluEx7laME	30111003	11 6000-1003	DUENIO	t	2026-10-15 19:42:21.162	2026-10-15 19:42:21.162	N
cmv9y3s0400050qojogu76dkr	Carlos Vega	carlos.vega@tocayjuga.com	$argon2id$v=19$m=65536,p=4,t=3$qrJvPiMokXJqI+CoM7L+Dw$1bDFSm5orphyged81Z+7UfkIMO0nTr/xVNluEx7laME	30111004	11 6000-1004	DUENIO	f	2026-10-15 19:42:21.316	2026-10-15 19:42:21.316	N
cmv9y3s8m00070qojs71grz9j	Lucas Martínez	lucas.martinez@tocayjuga.com	$argon2id$v=19$m=65536,p=4,t=3$qrJvPiMokXJqI+CoM7L+Dw$1bDFSm5orphyged81Z+7UfkIMO0nTr/xVNluEx7laME	30111006	11 6000-1006	JUGADOR	t	2026-10-15 19:42:21.622	2026-10-15 19:42:21.622	N
cmv9y3sct00080qoj4aw8dtds	Agustina Romero	agustina.romero@tocayjuga.com	$argon2id$v=19$m=65536,p=4,t=3$qrJvPiMokXJqI+CoM7L+Dw$1bDFSm5orphyged81Z+7UfkIMO0nTr/xVNluEx7laME	30111007	11 6000-1007	JUGADOR	t	2026-10-15 19:42:21.773	2026-10-15 19:42:21.773	N
cmv9y3sgz00090qojk4g6d84d	Tomás Álvarez	tomas.alvarez@tocayjuga.com	$argon2id$v=19$m=65536,p=4,t=3$qrJvPiMokXJqI+CoM7L+Dw$1bDFSm5orphyged81Z+7UfkIMO0nTr/xVNluEx7laME	30111008	11 6000-1008	JUGADOR	t	2026-10-15 19:42:21.923	2026-10-15 19:42:21.923	N
cmv9y3sl6000a0qojzojr1f1e	Valentina Torres	valentina.torres@tocayjuga.com	$argon2id$v=19$m=65536,p=4,t=3$qrJvPiMokXJqI+CoM7L+Dw$1bDFSm5orphyged81Z+7UfkIMO0nTr/xVNluEx7laME	30111009	11 6000-1009	JUGADOR	t	2026-10-15 19:42:22.074	2026-10-15 19:42:22.074	N
cmv9y3spc000b0qojzzl7f1z4	Nicolás Benítez	nicolas.benitez@tocayjuga.com	$argon2id$v=19$m=65536,p=4,t=3$qrJvPiMokXJqI+CoM7L+Dw$1bDFSm5orphyged81Z+7UfkIMO0nTr/xVNluEx7laME	30111010	11 6000-1010	JUGADOR	t	2026-10-15 19:42:22.224	2026-10-15 19:42:22.224	N
cmv9y3stj000c0qojpn896377	Martina Acosta	martina.acosta@tocayjuga.com	$argon2id$v=19$m=65536,p=4,t=3$qrJvPiMokXJqI+CoM7L+Dw$1bDFSm5orphyged81Z+7UfkIMO0nTr/xVNluEx7laME	30111011	11 6000-1011	JUGADOR	t	2026-10-15 19:42:22.375	2026-10-15 19:42:22.375	N
cmv9y3sxq000d0qojg4gcrl5t	Federico Díaz	federico.diaz@tocayjuga.com	$argon2id$v=19$m=65536,p=4,t=3$qrJvPiMokXJqI+CoM7L+Dw$1bDFSm5orphyged81Z+7UfkIMO0nTr/xVNluEx7laME	30111012	11 6000-1012	JUGADOR	t	2026-10-15 19:42:22.526	2026-10-15 19:42:22.526	N
cmv9y3t20000e0qojqflv5812	Santiago Herrera	santiago.herrera@tocayjuga.com	$argon2id$v=19$m=65536,p=4,t=3$qrJvPiMokXJqI+CoM7L+Dw$1bDFSm5orphyged81Z+7UfkIMO0nTr/xVNluEx7laME	30111013	11 6000-1013	JUGADOR	t	2026-10-15 19:42:22.68	2026-10-15 19:42:22.68	\N
cmv9y3t69000f0qoj3mszpys3	Julieta Medina	julieta.medina@tocayjuga.com	$argon2id$v=19$m=65536,p=4,t=3$qrJvPiMokXJqI+CoM7L+Dw$1bDFSm5orphyged81Z+7UfkIMO0nTr/xVNluEx7laME	30111014	11 6000-1014	JUGADOR	t	2026-10-15 19:42:22.833	2026-10-15 19:42:22.833	\N
cmv9y3tag000g0qoj8s6cgum5	Pablo Suárez	pablo.suarez@tocayjuga.com	$argon2id$v=19$m=65536,p=4,t=3$qrJvPiMokXJqI+CoM7L+Dw$1bDFSm5orphyged81Z+7UfkIMO0nTr/xVNluEx7laME	30111015	11 6000-1015	JUGADOR	f	2026-10-15 19:42:22.984	2026-10-15 19:42:22.984	N
cmv9y3s4e00060qoj7eq8hk4u	Juan Pérez	jugador@tocayjuga.com	$argon2id$v=19$m=65536,p=4,t=3$ELTfI1o1pCFJbtzjFivlHA$fW1Bb4PJkeJNjRvL6lMSNqEF1qS2KX1PWMTuipDc0gU	30111005	11 6000-1005	JUGADOR	t	2026-10-15 19:42:21.47	2026-10-15 19:42:21.47	N
cmvy8e1yn000308l2dlpy1pk6	Pipe Marino	pipe@tocayjuga.com	$argon2id$v=19$m=65536,p=4,t=3$7gwwuZEpEGgLzYhEfKW8dg$3y5+DGEPs4TaP5Xe9LB28ottWzn8IjRQRe9xgQAAhvI	\N	\N	JUGADOR	t	2026-11-01 19:36:45.167	2026-11-01 19:36:45.167	\N
\.


--
-- Data for Name: _prisma_migrations; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public._prisma_migrations (id, checksum, finished_at, migration_name, logs, rolled_back_at, started_at, applied_steps_count) FROM stdin;
0775319b-2c6d-4f05-ad6c-b4a6c7b85eb7	27ae642e8cf967a8ebb186e54e8433b5f51f039f67abeecde37ef8f8df2b6ec8	2026-09-11 00:05:09.177885+00	20260911000504_init	\N	\N	2026-09-11 00:05:04.899451+00	1
e6f4df05-5ea7-4bc8-9af6-e6ee885d2103	631485502e5002e012f233f2fa50798d296c1fe8ea506c62bd07d29b359ce890	2026-11-05 06:35:38.425831+00	20261105063534_agregar_etiquetas_y_tickets	\N	\N	2026-11-05 06:35:35.462184+00	1
f20dc894-9164-4cb9-9211-d34ce48f6fe0	de7c2dacf05ca22392e24608e209c3b606cf45e00d3829ae8c0aa294f7c6759e	2026-09-16 22:37:43.439175+00	20260916033927_add_nombre_cancha	\N	\N	2026-09-16 22:37:42.66468+00	1
aace8ebd-1672-4ad5-ad8e-bd4e872c749f	4083cb0a566e85e1d802a93bf1349cc6c2118ac8e319a9e35b9297cc1e359583	2026-10-01 16:23:50.379967+00	20261001162003_reserva_activa_unica	\N	\N	2026-10-01 16:23:49.403017+00	1
7223a71e-92cc-4a2f-a045-0d7f401d1328	128e2b596b90c8b240a0682621da1da65723dae20789f4c43a62a05f71c2217a	2026-09-17 10:22:37.171088+00	20260917102213_baja_logica	\N	\N	2026-09-17 10:22:36.099135+00	1
c6a164a3-1508-40f6-8f1b-d708918f0bcc	f006cb431c0ab1413bbf51d2f4d91f648d1fba0f5c757a75369b899714c26fc7	2026-09-17 19:31:48.426826+00	20260917193146_agregar_tenis_padel_y_polvo_de_ladrillo	\N	\N	2026-09-17 19:31:47.22145+00	1
23a15a74-e5a9-4383-ac48-5568f7c3a757	7215209e957317b516a52cc71c9c506def2fe88d672521abed399625e5325cb8	2026-11-02 00:38:30.862884+00	20261102003828_sumarse_a_reserva	\N	\N	2026-11-02 00:38:29.068526+00	1
45f416aa-5f66-41e0-8e97-e36ebebaee29	91fe8bf6bfa1ff5e7a0d10a6797ed483c7bcf91441ee88fa7a4ee8066bbe46af	2026-09-24 19:47:34.813663+00	20260924194730_sprint2_precios_sena	\N	\N	2026-09-24 19:47:31.590194+00	1
8339a409-fa47-4bec-a900-9a8e41b15079	412f436d35f8f15ec9b4e3f6b5f51756012b44784f689cae997b1dd17a97f4fe	2026-10-05 23:17:37.782705+00	20261005231735_rol_admin	\N	\N	2026-10-05 23:17:36.86422+00	1
bb2c35f5-32b5-45b6-bacd-e3c75d8aeb46	e46ae33c796f8a3935287c41ed72d7710d25fb5aaa6539820e79acc317071a03	2026-09-24 20:20:05.853365+00	20260924202001_pago_cascade_on_reserva_delete	\N	\N	2026-09-24 20:20:03.470905+00	1
3e3da142-62a7-40ab-8132-869dc7cfc92e	167760a8e4933358205cbd2bbff7a1d1e4023ebd2d4e1d359ac57b34efa85009	2026-09-24 23:06:44.981891+00	20260924230642_add_block	\N	\N	2026-09-24 23:06:43.758213+00	1
98e5367c-fa22-4c20-8128-9187b283e638	ec78b1ab71943cf078e374f464cec3b08bbfe70e80206be7eaf2c9cfd367000f	2026-09-29 22:05:38.653203+00	20260929220535_sacar_completada_de_estado_reserva	\N	\N	2026-09-29 22:05:36.457847+00	1
034d7361-6c70-4f82-957d-44c59c18d468	6d3de9da744b74744168f0ea10292980efa0a11ac1688babfb21986757ce82f8	2026-10-05 23:53:34.900734+00	20261005235333_intentos	\N	\N	2026-10-05 23:53:33.9484+00	1
8ea1b98e-585b-4122-8b1f-87ae9abb4c77	3239d2c2d9eca544f0e2d7122a9b9012497f1a7af9bdfd321cd2ced6c603b424	2026-09-30 07:36:22.090309+00	20260930073618_asistencia_en_reserva	\N	\N	2026-09-30 07:36:19.771155+00	1
4d3f6e59-52c8-489e-94c5-afdf1f856af9	cec8edc038ec19ba7fccca292c0279e4a58bb8b90a17a4bcc668583199d90002	2026-09-30 19:06:28.388693+00	20260930190626_anticipacion_minima	\N	\N	2026-09-30 19:06:27.336853+00	1
bff14449-11d9-41aa-8e56-1fae8d0ee5ad	2ebf9e0b4023a8f6c9dc22b97bccfb29358b62d5ff56ece8823d61ca40662e80	2026-09-30 21:20:12.422222+00	20260930212010_anticipacion_default_3_horas	\N	\N	2026-09-30 21:20:11.538928+00	1
c0ad611d-a23a-4a08-b91f-6e19270c73ac	4aaf1dd8898aee70212634cf87a599e81bfd9ad420f8289f6dc2acd869483d18	2026-10-11 01:15:17.961675+00	20261011011514_schema_scrum_58	\N	\N	2026-10-11 01:15:15.973036+00	1
301d6cb6-111f-4fd7-96fc-22cc1b775a4a	7586f24456e7f1d1d41acd5641b1faeaea75ef032d48cbff8ebee74ea8f7f9aa	2026-10-01 03:01:26.718444+00	20261001030124_agregar_basquet_como_deporte	\N	\N	2026-10-01 03:01:25.852049+00	1
7bdadf91-fab6-48c4-8bee-b13221c62e20	73de643cedca89b07e2b3e4cb159190a38f872c0b29376e8044cb52daa59bc30	2026-10-01 07:42:37.516014+00	20261001074235_politica_cancelacion	\N	\N	2026-10-01 07:42:36.599858+00	1
254c546c-8c1d-4fb9-9060-010ef0951abb	6ebb6bac03d60ad93c41166a2462365440733a1a6cdadc2fb9bed079a3bf1531	2026-11-02 01:17:32.459814+00	20261102011730_participante_salirse	\N	\N	2026-11-02 01:17:31.437383+00	1
3bfc1341-829c-4e66-a77a-4487b57f6dfe	68e7f53c3cb1941f49483fb37db29b7f3e54496807aebf0b52f5f29ef9e9b708	2026-10-12 11:29:25.390137+00	20261012000000_evidencia_y_marca_de_asistencia	\N	\N	2026-10-12 11:29:23.631708+00	1
a47e062a-1260-4f48-a36c-ba5132706ab9	05b22a68c001f40acba07227c7b7f2f6d5183a41752f396dd9a8b0b23cdac78d	2026-10-14 02:52:39.651755+00	20261014025129_aprobacion_de_complejos	\N	\N	2026-10-14 02:52:38.483307+00	1
6b6b4eb9-948c-4f97-9a10-d7f31d5beb67	2c74979af56ad2320bc7d0756ddb71d5fbd147bedfed9a3ae6877ad6ad409933	2026-10-15 02:59:48.297837+00	20261014120000_agregar_imagen_a_usuario		\N	2026-10-15 02:59:48.297837+00	0
df8082cc-7f9c-4f87-96b2-b20c51845765	d52a8909ad8e41463e40719293b089c98314a921eb959ebf1e17a44cee3fb954	2026-11-02 20:03:28.980564+00	20261102160000_descuento_por_nivel	\N	\N	2026-11-02 20:03:28.168308+00	1
12734f46-7db3-4f84-bf8e-2d272f6f776b	3320f8294b1f1ca5067dfb10ca22aa34a8c6cff56e32b040fbc3f86e079acde5	2026-11-01 19:28:20.028344+00	20261101192817_reservas_parciales	\N	\N	2026-11-01 19:28:19.009772+00	1
c9df4a8a-2055-48ce-9e80-7d4c226e5f62	d416eb165ac05734ffa41ab9ab29e382919f4395d0827525ac8bc840127fe894	2026-11-03 18:17:36.282392+00	20261103160000_capacidad_de_canchas	\N	\N	2026-11-03 18:17:35.482798+00	1
b9783b87-6dc7-46e4-8b33-5c96d14abe88	9d3bdce25866fa5ad738312ab22d5237141b0d069b408733ca4baba309ea43d5	2026-11-04 18:25:48.068665+00	20261104182133_calificaciones	\N	\N	2026-11-04 18:25:46.259143+00	1
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


