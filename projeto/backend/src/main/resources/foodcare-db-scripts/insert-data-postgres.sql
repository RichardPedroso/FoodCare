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

INSERT INTO user_model (name, email, password, user_type, family_income, people_quantity, municipality_id, has_children, number_of_children, able) 
VALUES ('Maria Beneficiária', 'maria@beneficiaria.com', 'senha123', 'BENEFICIARY', 800.0, 4, 2, TRUE, 2, TRUE);

INSERT INTO user_model (name, email, password, user_type, family_income, people_quantity, municipality_id, has_children) 
VALUES ('Carlos Doador', 'carlos@doador.com', 'senha123', 'DONOR', 8000.0, 2, 3, FALSE);

INSERT INTO user_model (name, email, password, user_type, family_income, people_quantity, municipality_id, has_children, number_of_children, able) 
VALUES ('Ana Beneficiária', 'ana@beneficiaria.com', 'senha123', 'BENEFICIARY', 600.0, 5, 4, TRUE, 3, TRUE);

-- Beneficiário pendente de aprovação
INSERT INTO user_model (name, email, password, user_type, family_income, people_quantity, municipality_id, has_children, number_of_children, able) 
VALUES ('Pedro Aguardando', 'pedro@aguardando.com', 'senha123', 'BENEFICIARY', 700.0, 3, 1, FALSE, 0, NULL);

-- Insert products with options_donation
INSERT INTO product (name, product_type, category_id, unit_quantity, unit_type, options_donation) 
VALUES ('Arroz', 'Alimento', 1, 5.0, 'KG', '{1.0, 5.0}');

INSERT INTO product (name, product_type, category_id, unit_quantity, unit_type, options_donation) 
VALUES ('Feijão', 'Alimento', 1, 4.0, 'KG', '{1.0, 3.0}');

INSERT INTO product (name, product_type, category_id, unit_quantity, unit_type, options_donation) 
VALUES ('Açúcar', 'Alimento', 1, 5.0, 'KG', '{1.0, 2.0}');

INSERT INTO product (name, product_type, category_id, unit_quantity, unit_type, options_donation) 
VALUES ('Café', 'Alimento', 1, 500.0, 'G', '{250.0, 500.0}');

INSERT INTO product (name, product_type, category_id, unit_quantity, unit_type, options_donation) 
VALUES ('Leite', 'Alimento', 1, 1.0, 'L', '{1.0}');

INSERT INTO product (name, product_type, category_id, unit_quantity, unit_type, options_donation) 
VALUES ('Farinha', 'Alimento', 1, 500.0, 'G', '{500.0, 1000.0}');

INSERT INTO product (name, product_type, category_id, unit_quantity, unit_type, options_donation) 
VALUES ('Macarrão', 'Alimento', 1, 500.0, 'G', '{500.0}');

INSERT INTO product (name, product_type, category_id, unit_quantity, unit_type, options_donation) 
VALUES ('Óleo', 'Alimento', 1, 900.0, 'ML', '{900.0}');

INSERT INTO product (name, product_type, category_id, unit_quantity, unit_type, options_donation) 
VALUES ('Sabão em pó', 'Higiene', 2, 800.0, 'G', '{800.0, 1000.0}');

INSERT INTO product (name, product_type, category_id, unit_quantity, unit_type, options_donation) 
VALUES ('Amaciante', 'Higiene', 2, 2.0, 'L', '{2.0}');

INSERT INTO product (name, product_type, category_id, unit_quantity, unit_type, options_donation) 
VALUES ('Detergente', 'Higiene', 2, 500.0, 'ML', '{500.0}');

INSERT INTO product (name, product_type, category_id, unit_quantity, unit_type, options_donation) 
VALUES ('Água sanitária', 'Higiene', 2, 2.0, 'L', '{1.0, 2.0}');

INSERT INTO product (name, product_type, category_id, unit_quantity, unit_type, options_donation) 
VALUES ('Desinfetante', 'Higiene', 2, 1.0, 'L', '{1.0}');

INSERT INTO product (name, product_type, category_id, unit_quantity, unit_type, options_donation) 
VALUES ('Sabonete', 'Higiene', 2, 90.0, 'G', '{90.0}');

INSERT INTO product (name, product_type, category_id, unit_quantity, unit_type, options_donation) 
VALUES ('Creme dental', 'Higiene', 2, 90.0, 'G', '{90.0}');

INSERT INTO product (name, product_type, category_id, unit_quantity, unit_type, options_donation) 
VALUES ('Gelatina', 'Alimento', 1, 20.0, 'G', '{20.0}');

INSERT INTO product (name, product_type, category_id, unit_quantity, unit_type, options_donation) 
VALUES ('Bolacha recheada', 'Alimento', 1, 130.0, 'G', '{130.0}');

INSERT INTO product (name, product_type, category_id, unit_quantity, unit_type, options_donation) 
VALUES ('Biscoito de polvilho', 'Alimento', 1, 200.0, 'G', '{200.0}');

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

-- Insert stock data for all products
-- Arroz (1kg and 5kg options)
INSERT INTO stock (product_id, donation_option, actual_stock) VALUES (1, 1.0, 80);
INSERT INTO stock (product_id, donation_option, actual_stock) VALUES (1, 5.0, 15);

-- Feijão (1kg and 3kg options)
INSERT INTO stock (product_id, donation_option, actual_stock) VALUES (2, 1.0, 50);
INSERT INTO stock (product_id, donation_option, actual_stock) VALUES (2, 3.0, 20);

-- Açúcar (1kg and 2kg options)
INSERT INTO stock (product_id, donation_option, actual_stock) VALUES (3, 1.0, 30);
INSERT INTO stock (product_id, donation_option, actual_stock) VALUES (3, 2.0, 25);

-- Café (250g and 500g options)
INSERT INTO stock (product_id, donation_option, actual_stock) VALUES (4, 250.0, 40);
INSERT INTO stock (product_id, donation_option, actual_stock) VALUES (4, 500.0, 20);

-- Leite (1L option)
INSERT INTO stock (product_id, donation_option, actual_stock) VALUES (5, 1.0, 60);

-- Farinha (500g and 1kg options)
INSERT INTO stock (product_id, donation_option, actual_stock) VALUES (6, 500.0, 35);
INSERT INTO stock (product_id, donation_option, actual_stock) VALUES (6, 1000.0, 15);

-- Macarrão (500g option)
INSERT INTO stock (product_id, donation_option, actual_stock) VALUES (7, 500.0, 45);

-- Óleo (900ml option)
INSERT INTO stock (product_id, donation_option, actual_stock) VALUES (8, 900.0, 25);

-- Sabão em pó (800g and 1kg options)
INSERT INTO stock (product_id, donation_option, actual_stock) VALUES (9, 800.0, 20);
INSERT INTO stock (product_id, donation_option, actual_stock) VALUES (9, 1000.0, 10);

-- Amaciante (2L option)
INSERT INTO stock (product_id, donation_option, actual_stock) VALUES (10, 2.0, 15);

-- Detergente (500ml option)
INSERT INTO stock (product_id, donation_option, actual_stock) VALUES (11, 500.0, 30);

-- Água sanitária (1L and 2L options)
INSERT INTO stock (product_id, donation_option, actual_stock) VALUES (12, 1.0, 25);
INSERT INTO stock (product_id, donation_option, actual_stock) VALUES (12, 2.0, 15);

-- Desinfetante (1L option)
INSERT INTO stock (product_id, donation_option, actual_stock) VALUES (13, 1.0, 20);

-- Sabonete (90g option)
INSERT INTO stock (product_id, donation_option, actual_stock) VALUES (14, 90.0, 50);

-- Creme dental (90g option)
INSERT INTO stock (product_id, donation_option, actual_stock) VALUES (15, 90.0, 40);

-- Gelatina (20g option)
INSERT INTO stock (product_id, donation_option, actual_stock) VALUES (16, 20.0, 100);

-- Bolacha recheada (130g option)
INSERT INTO stock (product_id, donation_option, actual_stock) VALUES (17, 130.0, 60);

-- Biscoito de polvilho (200g option)
INSERT INTO stock (product_id, donation_option, actual_stock) VALUES (18, 200.0, 35);

-- Commented encrypted password versions (uncomment to use encryption):
-- INSERT INTO user_model (name, email, password, user_type, is_admin, municipality_id) 
-- VALUES ('Admin FoodCare', 'admin@foodcare.com', crypt('admin123', gen_salt('bf')), 'DONOR', TRUE, 1);
