CREATE DATABASE car_rent;

GRANT ALL PRIVILEGES ON DATABASE car_rent TO postgres;

\c car_rent;

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE cars (
    id uuid NOT NULL DEFAULT uuid_generate_v4(),
    number character varying(9) NOT NULL
);

ALTER TABLE ONLY public.cars
    ADD CONSTRAINT "PK_Accesses_by_cars_type_Id" PRIMARY KEY (id);

INSERT INTO public.cars("number") VALUES ('A111AA196');
INSERT INTO public.cars("number") VALUES ('A222AA196');
INSERT INTO public.cars("number") VALUES ('A333AA196');
INSERT INTO public.cars("number") VALUES ('A444AA196');
INSERT INTO public.cars("number") VALUES ('A555AA196');

CREATE TABLE "cars-rent" (
    id uuid NOT NULL DEFAULT uuid_generate_v4(),
    created timestamp(0) without time zone DEFAULT now() NOT NULL, 
    "carId" uuid NOT NULL,
    "from" timestamp(0) without time zone NOT NULL,
    "to" timestamp(0) without time zone NOT NULL,
    days integer NOT NULL,
    cost integer NOT NULL
);

CREATE VIEW RENT_REPORT_VIEW AS WITH GEN_TABLE AS (
    SELECT ID,
        GENERATE_SERIES("from", "to", interval '1 day')::date AS OBSERVED
    FROM "cars-rent"
    GROUP BY OBSERVED,
        ID
    ORDER BY OBSERVED
),
SUMMARY_TABLE AS (
    SELECT C."carId",
        COUNT(DATE_PART('day', G.OBSERVED)) AS "numberDays",
        DATE_PART('month', G.OBSERVED) AS "month",
        DATE_PART(
            'days',
            (
                DATE_TRUNC('month', G.OBSERVED) + interval '1 month - 1 day'
            )
        ) AS "daysOfWeek"
    FROM "cars-rent" C
        LEFT JOIN GEN_TABLE G ON C.ID = G.ID
    GROUP BY "carId",
        DATE_PART('month', G.OBSERVED),
        DATE_PART(
            'days',
            (
                DATE_TRUNC('month', G.OBSERVED) + interval '1 month - 1 day'
            )
        )
),
RESULT_TABLE AS (
    SELECT s."carId",
        c.number as "carNumber",
        s."numberDays",
        s."month",
        s."daysOfWeek",
        ROUND(
            (s."numberDays" / s."daysOfWeek" * 100)::numeric,
            2
        ) AS AVERAGE
    FROM SUMMARY_TABLE s
    LEFT JOIN cars c ON c.id = s."carId"
)
SELECT "carId",
    "carNumber",
    "month",
    AVERAGE
FROM RESULT_TABLE