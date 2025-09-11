-- Enable pgcrypto extension for password encryption
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- Insert municipalities
INSERT INTO municipality (name) VALUES ('São Paulo');
INSERT INTO municipality (name) VALUES ('Rio de Janeiro');
INSERT INTO municipality (name) VALUES ('Belo Horizonte');
INSERT INTO municipality (name) VALUES ('Curitiba');

-- Insert categories
INSERT INTO category (name) VALUES ('Alimentos');
INSERT INTO category (name) VALUES ('Higiene');

-- Insert users (simple passwords for testing)
INSERT INTO user_model (name, email, password, user_type, municipality_id) 
VALUES ('Admin FoodCare', 'admin@foodcare.com', 'admin123', 'ADMIN', 1);

INSERT INTO user_model (name, email, password, user_type, family_income, people_quantity, municipality_id, has_children) 
VALUES ('João Doador', 'joao@doador.com', 'senha123', 'DONOR', 5000.0, 3, 1, TRUE);

INSERT INTO user_model (name, email, password, user_type, family_income, people_quantity, municipality_id, has_children) 
VALUES ('Maria Beneficiária', 'maria@beneficiaria.com', 'senha123', 'BENEFICIARY', 800.0, 4, 2, TRUE);

INSERT INTO user_model (name, email, password, user_type, family_income, people_quantity, municipality_id, has_children) 
VALUES ('Carlos Doador', 'carlos@doador.com', 'senha123', 'DONOR', 8000.0, 2, 3, FALSE);

INSERT INTO user_model (name, email, password, user_type, family_income, people_quantity, municipality_id, has_children) 
VALUES ('Ana Beneficiária', 'ana@beneficiaria.com', 'senha123', 'BENEFICIARY', 600.0, 5, 4, TRUE);

-- Insert products
INSERT INTO product (name, product_type, stock, category_id, unit_quantity, unit_type) 
VALUES ('Arroz', 'Alimento', 100.0, 1, 5.0, 'KG');

INSERT INTO product (name, product_type, stock, category_id, unit_quantity, unit_type) 
VALUES ('Feijão', 'Alimento', 80.0, 1, 4.0, 'KG');

INSERT INTO product (name, product_type, stock, category_id, unit_quantity, unit_type) 
VALUES ('Açúcar', 'Alimento', 60.0, 1, 5.0, 'KG');

INSERT INTO product (name, product_type, stock, category_id, unit_quantity, unit_type) 
VALUES ('Café', 'Alimento', 40.0, 1, 500.0, 'G');

INSERT INTO product (name, product_type, stock, category_id, unit_quantity, unit_type) 
VALUES ('Leite', 'Alimento', 50.0, 1, 1.0, 'L');

INSERT INTO product (name, product_type, stock, category_id, unit_quantity, unit_type) 
VALUES ('Farinha', 'Alimento', 70.0, 1, 500.0, 'G');

INSERT INTO product (name, product_type, stock, category_id, unit_quantity, unit_type) 
VALUES ('Macarrão', 'Alimento', 90.0, 1, 500.0, 'G');

INSERT INTO product (name, product_type, stock, category_id, unit_quantity, unit_type) 
VALUES ('Óleo', 'Alimento', 45.0, 1, 900.0, 'ML');

INSERT INTO product (name, product_type, stock, category_id, unit_quantity, unit_type) 
VALUES ('Sabão em pó', 'Higiene', 80.0, 2, 800.0, 'G');

INSERT INTO product (name, product_type, stock, category_id, unit_quantity, unit_type) 
VALUES ('Amaciante', 'Higiene', 60.0, 2, 2.0, 'L');

INSERT INTO product (name, product_type, stock, category_id, unit_quantity, unit_type) 
VALUES ('Detergente', 'Higiene', 100.0, 2, 500.0, 'ML');

INSERT INTO product (name, product_type, stock, category_id, unit_quantity, unit_type) 
VALUES ('Água sanitária', 'Higiene', 70.0, 2, 2.0, 'L');

INSERT INTO product (name, product_type, stock, category_id, unit_quantity, unit_type) 
VALUES ('Desinfetante', 'Higiene', 55.0, 2, 1.0, 'L');

INSERT INTO product (name, product_type, stock, category_id, unit_quantity, unit_type) 
VALUES ('Sabonete', 'Higiene', 200.0, 2, 90.0, 'G');

INSERT INTO product (name, product_type, stock, category_id, unit_quantity, unit_type) 
VALUES ('Creme dental', 'Higiene', 150.0, 2, 90.0, 'G');

INSERT INTO product (name, product_type, stock, category_id, unit_quantity, unit_type) 
VALUES ('Gelatina', 'Alimento', 120.0, 1, 20.0, 'G');

INSERT INTO product (name, product_type, stock, category_id, unit_quantity, unit_type) 
VALUES ('Bolacha recheada', 'Alimento', 80.0, 1, 130.0, 'G');

INSERT INTO product (name, product_type, stock, category_id, unit_quantity, unit_type) 
VALUES ('Biscoito de polvilho', 'Alimento', 60.0, 1, 200.0, 'G');

-- Insert sample donations
INSERT INTO donation (donation_date, user_id) VALUES ('2024-01-15', 2);
INSERT INTO donation (donation_date, user_id) VALUES ('2024-01-20', 4);

-- Insert donation products
INSERT INTO donation_product (quantity, expiration_date, unit, donation_id, product_id) VALUES (10.0, '2024-12-31', 'KG', 1, 1);
INSERT INTO donation_product (quantity, expiration_date, unit, donation_id, product_id) VALUES (5.0, '2024-11-30', 'KG', 1, 2);
INSERT INTO donation_product (quantity, expiration_date, unit, donation_id, product_id) VALUES (20.0, '2024-10-15', 'L', 2, 5);

-- Insert sample requests
INSERT INTO request (request_date, request_type, status, user_id) VALUES ('2024-01-16', 'BASIC', 'PENDING', 3);
INSERT INTO request (request_date, request_type, status, user_id) VALUES ('2024-01-18', 'HYGIENE', 'APPROVED', 5);

-- Insert stock data (feijão with 1kg and 3kg options)
INSERT INTO stock (product_id, donation_option, actual_stock) VALUES (2, 1.0, 50);
INSERT INTO stock (product_id, donation_option, actual_stock) VALUES (2, 3.0, 20);

-- Insert stock data (arroz with 1kg and 5kg options)
INSERT INTO stock (product_id, donation_option, actual_stock) VALUES (1, 1.0, 80);
INSERT INTO stock (product_id, donation_option, actual_stock) VALUES (1, 5.0, 15);

-- Commented encrypted password versions (uncomment to use encryption):
-- INSERT INTO user_model (name, email, password, user_type, is_admin, municipality_id) 
-- VALUES ('Admin FoodCare', 'admin@foodcare.com', crypt('admin123', gen_salt('bf')), 'DONOR', TRUE, 1);
