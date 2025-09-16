-- Drop tables in correct order (respecting foreign keys)
DROP TABLE IF EXISTS donation_product;
DROP TABLE IF EXISTS stock;
DROP TABLE IF EXISTS basket_request;
DROP TABLE IF EXISTS request;
DROP TABLE IF EXISTS donation;
DROP TABLE IF EXISTS product;
DROP TABLE IF EXISTS user_model;
DROP TABLE IF EXISTS category;
DROP TABLE IF EXISTS municipality;

-- Drop types
DROP TYPE IF EXISTS user_type;
DROP TYPE IF EXISTS request_type;
DROP TYPE IF EXISTS request_status;

-- Create enums
CREATE TYPE user_type AS ENUM ('donor', 'beneficiary', 'admin');
CREATE TYPE request_type AS ENUM ('BASIC', 'HYGIENE');
CREATE TYPE request_status AS ENUM ('PENDING', 'APPROVED', 'REJECTED', 'COMPLETED');

-- Create tables
CREATE TABLE municipality
(
    id           SERIAL       NOT NULL,
    name         VARCHAR(100),
    street       VARCHAR(200),
    number       VARCHAR(20),
    neighborhood VARCHAR(100),
    city         VARCHAR(100) NOT NULL,
    zip_code     VARCHAR(50),
    PRIMARY KEY (id)
);

CREATE TABLE category
(
    id          SERIAL       NOT NULL,
    name        VARCHAR(50),
    description VARCHAR(100) NOT NULL,
    PRIMARY KEY (id)
);

CREATE TABLE user_model
(
    id              SERIAL         NOT NULL,
    name            VARCHAR(100)   NOT NULL,
    email           VARCHAR(100)   NOT NULL UNIQUE,
    password        VARCHAR(255)   NOT NULL,
    phone           VARCHAR(50),
    user_type       user_type      NOT NULL,
    family_income   DOUBLE PRECISION DEFAULT 0.0,
    people_quantity INTEGER        DEFAULT 1,
    municipality_id INTEGER,
    has_children    BOOLEAN        DEFAULT FALSE,
    number_of_children INTEGER     DEFAULT 0,
    documents       TEXT[],
    images          TEXT[],
    able            BOOLEAN        DEFAULT NULL,
    PRIMARY KEY (id),
    FOREIGN KEY (municipality_id) REFERENCES municipality(id)
);

CREATE TABLE product
(
    id               SERIAL           NOT NULL,
    name             VARCHAR(100)     NOT NULL,
    product_type     VARCHAR(50),
    category_id      INTEGER,
    unit_quantity    DOUBLE PRECISION DEFAULT 1.0,
    unit_type        VARCHAR(10)      DEFAULT 'KG',
    measure_type     VARCHAR(10),
    options_donation DOUBLE PRECISION[],
    PRIMARY KEY (id),
    FOREIGN KEY (category_id) REFERENCES category(id)
);

CREATE TABLE donation
(
    id            SERIAL      NOT NULL,
    donation_date VARCHAR(50) NOT NULL,
    user_id       INTEGER     NOT NULL,
    PRIMARY KEY (id),
    FOREIGN KEY (user_id) REFERENCES user_model(id)
);

CREATE TABLE request
(
    id           SERIAL         NOT NULL,
    request_date VARCHAR(50)    NOT NULL,
    request_type request_type   NOT NULL,
    status       request_status NOT NULL DEFAULT 'PENDING',
    user_id      INTEGER        NOT NULL,
    PRIMARY KEY (id),
    FOREIGN KEY (user_id) REFERENCES user_model(id)
);

CREATE TABLE donation_product
(
    id              SERIAL           NOT NULL,
    quantity        DOUBLE PRECISION NOT NULL DEFAULT 1.0,
    expiration_date VARCHAR(50),
    unit            VARCHAR(10)      NOT NULL DEFAULT 'KG',
    donation_id     INTEGER          NOT NULL,
    product_id      INTEGER          NOT NULL,
    PRIMARY KEY (id),
    FOREIGN KEY (donation_id) REFERENCES donation(id),
    FOREIGN KEY (product_id) REFERENCES product(id)
);

CREATE TABLE stock
(
    id              SERIAL           NOT NULL,
    product_id      INTEGER          NOT NULL,
    donation_option DOUBLE PRECISION NOT NULL,
    actual_stock    INTEGER          NOT NULL DEFAULT 0,
    PRIMARY KEY (id),
    FOREIGN KEY (product_id) REFERENCES product(id)
);

CREATE TABLE basket_request
(
    id              SERIAL         NOT NULL,
    user_id         INTEGER        NOT NULL,
    request_date    VARCHAR(50)    NOT NULL,
    basket_type     VARCHAR(20)    NOT NULL,
    status          VARCHAR(20)    NOT NULL DEFAULT 'pending',
    people_quantity INTEGER,
    has_children    BOOLEAN,
    calculated_items JSONB,
    PRIMARY KEY (id),
    FOREIGN KEY (user_id) REFERENCES user_model(id)
);


