drop database if exists foodcare;

create database foodcare;

create table municipality (
    id serial primary key,
    street varchar(100) not null,
    number varchar(10) not null,
    neighborhood varchar(50) not null,
    city varchar(50) not null,
    zip_code varchar(10) not null
);

create table user (
    id serial primary key,
    name varchar(100) not null,
    email varchar(100) unique not null,
    password varchar(25) not null,
    phone varchar(20) unique not null,
    user_type varchar(20) not null check (user_type in ('donor', 'beneficiary')),
    is_admin boolean,
    family_income numeric(10,2),
    people_quantity int,
    municipality_id int not null references municipality(id)
);

create table request (
    id serial primary key,
    request_date date not null,
    request_type varchar(20) not null check (request_type in ('basic', 'hygiene')),
    status varchar(20) not null,
    user_id int not null references user_account(id)
);

create table donation (
    id serial primary key,
    donation_date date not null,
    user_id int not null references user_account(id)
);

create table category (
    id serial primary key,
    description varchar(100) unique not null,
    is_active boolean not null
);

create table product (
    id serial primary key,
    name varchar(100) unique not null,
    product_type varchar(20) not null check (product_type in ('basic', 'hygiene')),
    stock int not null,
    is_active boolean not null,
    basket_quantity int not null,
    category_id int not null references category(id)
);

create table donation_product (
    id serial primary key,
    quantity numeric(10,2) not null,
    expiration_date date not null,
    unit varchar(5) not null check (unit in ('kg', 'l')),
    product_id int not null references product(id),
    donation_id int not null references donation(id)
);

