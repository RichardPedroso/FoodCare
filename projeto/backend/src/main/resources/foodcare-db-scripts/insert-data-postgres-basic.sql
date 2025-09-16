CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- Insert municipalities
INSERT INTO municipality (name) VALUES ('São Paulo');
INSERT INTO municipality (name) VALUES ('Rio de Janeiro');
INSERT INTO municipality (name) VALUES ('Belo Horizonte');
INSERT INTO municipality (name) VALUES ('Curitiba');

-- Insert categories
INSERT INTO category (name) VALUES ('Alimentos');
INSERT INTO category (name) VALUES ('Higiene');

-- Insert users (simple passwords for basic profile)
INSERT INTO user_model (name, email, password, user_type, municipality_id) 
VALUES ('Admin FoodCare', 'admin@foodcare.com', 'admin123', 'ADMIN', 1);

INSERT INTO user_model (name, email, password, user_type, family_income, people_quantity, municipality_id, has_children) 
VALUES ('João Doador', 'joao@doador.com', 'senha123', 'DONOR', 5000.0, 3, 1, TRUE);

INSERT INTO user_model (name, email, password, user_type, family_income, people_quantity, municipality_id, has_children, number_of_children, able) 
VALUES ('Maria Beneficiária', 'maria@beneficiaria.com', 'senha123', 'BENEFICIARY', 800.0, 4, 2, TRUE, 2, TRUE);

INSERT INTO user_model (name, email, password, user_type, family_income, people_quantity, municipality_id, has_children) 
VALUES ('Carlos Doador', 'carlos@doador.com', 'senha123', 'DONOR', 8000.0, 2, 3, FALSE);

INSERT INTO user_model (name, email, password, user_type, family_income, people_quantity, municipality_id, has_children, number_of_children, able) 
VALUES ('Ana Beneficiária', 'ana@beneficiaria.com', 'senha123', 'BENEFICIARY', 600.0, 5, 4, TRUE, 3, TRUE);

-- Insert products with options_donation
INSERT INTO product (name, product_type, category_id, unit_quantity, unit_type, options_donation) 
VALUES ('Arroz', 'Alimento', 1, 5.0, 'KG', '{1.0, 5.0}');

INSERT INTO product (name, product_type, category_id, unit_quantity, unit_type, options_donation) 
VALUES ('Feijão', 'Alimento', 1, 4.0, 'KG', '{1.0, 3.0}');

INSERT INTO product (name, product_type, category_id, unit_quantity, unit_type, options_donation) 
VALUES ('Açúcar', 'Alimento', 1, 5.0, 'KG', '{1.0, 2.0}');

-- Insert stock data
INSERT INTO stock (product_id, donation_option, actual_stock) VALUES (1, 1.0, 80);
INSERT INTO stock (product_id, donation_option, actual_stock) VALUES (1, 5.0, 15);
INSERT INTO stock (product_id, donation_option, actual_stock) VALUES (2, 1.0, 50);
INSERT INTO stock (product_id, donation_option, actual_stock) VALUES (2, 3.0, 20);
INSERT INTO stock (product_id, donation_option, actual_stock) VALUES (3, 1.0, 30);
INSERT INTO stock (product_id, donation_option, actual_stock) VALUES (3, 2.0, 25);