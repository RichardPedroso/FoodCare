-- Enable pgcrypto extension for password encryption
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- Insert municipalities
INSERT INTO municipality (name) VALUES ('São Paulo');
INSERT INTO municipality (name) VALUES ('Rio de Janeiro');
INSERT INTO municipality (name) VALUES ('Belo Horizonte');
INSERT INTO municipality (name) VALUES ('Curitiba');

-- Insert categories
INSERT INTO category (name) VALUES ('Grãos');
INSERT INTO category (name) VALUES ('Laticínios');
INSERT INTO category (name) VALUES ('Carnes');
INSERT INTO category (name) VALUES ('Frutas');
INSERT INTO category (name) VALUES ('Higiene');

-- Insert users (simple passwords for testing)
INSERT INTO user_model (name, email, password, user_type, municipality_id) 
VALUES ('Admin FoodCare', 'admin@foodcare.com', 'admin123', 'ADMIN', 1);

INSERT INTO user_model (name, email, password, user_type, family_income, people_quantity, municipality_id) 
VALUES ('João Doador', 'joao@doador.com', 'senha123', 'DONOR', 5000.0, 3, 1);

INSERT INTO user_model (name, email, password, user_type, family_income, people_quantity, municipality_id) 
VALUES ('Maria Beneficiária', 'maria@beneficiaria.com', 'senha123', 'BENEFICIARY', 800.0, 4, 2);

INSERT INTO user_model (name, email, password, user_type, family_income, people_quantity, municipality_id) 
VALUES ('Carlos Doador', 'carlos@doador.com', 'senha123', 'DONOR', 8000.0, 2, 3);

INSERT INTO user_model (name, email, password, user_type, family_income, people_quantity, municipality_id) 
VALUES ('Ana Beneficiária', 'ana@beneficiaria.com', 'senha123', 'BENEFICIARY', 600.0, 5, 4);

-- Insert products
INSERT INTO product (name, product_type, stock, category_id, unit_quantity, unit_type) 
VALUES ('Arroz 5kg', 'Grão', 100, 1, 5.0, 'KG');

INSERT INTO product (name, product_type, stock, category_id, unit_quantity, unit_type) 
VALUES ('Feijão 1kg', 'Grão', 80, 1, 1.0, 'KG');

INSERT INTO product (name, product_type, stock, category_id, unit_quantity, unit_type) 
VALUES ('Leite 1L', 'Laticínio', 50, 2, 1.0, 'L');

INSERT INTO product (name, product_type, stock, category_id, unit_quantity, unit_type) 
VALUES ('Frango 1kg', 'Carne', 30, 3, 1.0, 'KG');

INSERT INTO product (name, product_type, stock, category_id, unit_quantity, unit_type) 
VALUES ('Sabonete', 'Higiene', 200, 5, 1.0, 'KG');

-- Insert sample donations
INSERT INTO donation (donation_date, user_id) VALUES ('2024-01-15', 2);
INSERT INTO donation (donation_date, user_id) VALUES ('2024-01-20', 4);

-- Insert donation products
INSERT INTO donation_product (quantity, donation_id, product_id) VALUES (10, 1, 1);
INSERT INTO donation_product (quantity, donation_id, product_id) VALUES (5, 1, 2);
INSERT INTO donation_product (quantity, donation_id, product_id) VALUES (20, 2, 5);

-- Insert sample requests
INSERT INTO request (request_date, request_type, status, user_id) VALUES ('2024-01-16', 'BASIC', 'PENDING', 3);
INSERT INTO request (request_date, request_type, status, user_id) VALUES ('2024-01-18', 'HYGIENE', 'APPROVED', 5);

-- Commented encrypted password versions (uncomment to use encryption):
-- INSERT INTO user_model (name, email, password, user_type, is_admin, municipality_id) 
-- VALUES ('Admin FoodCare', 'admin@foodcare.com', crypt('admin123', gen_salt('bf')), 'DONOR', TRUE, 1);
