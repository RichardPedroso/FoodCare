-- Enable pgcrypto extension for password encryption
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- Insert municipalities from db.json
INSERT INTO municipality (street, number, neighborhood, city, zip_code) VALUES ('Rua das Flores', '123', 'Centro', 'Santa Rita do Sapucaí', '37540-000');
INSERT INTO municipality (street, number, neighborhood, city, zip_code) VALUES ('Avenida Brasil', '456', 'Vila Nova', 'Pouso Alegre', '37550-000');
INSERT INTO municipality (street, number, neighborhood, city, zip_code) VALUES ('Rua São José', '789', 'São Vicente', 'Itajubá', '37500-000');
INSERT INTO municipality (street, number, neighborhood, city) VALUES ('Rua Coronel Alfredo', '321', 'Fátima', 'Santa Rita do Sapucaí');
INSERT INTO municipality (street, number, neighborhood, city, zip_code) VALUES ('Abu', '11', 'Abu', 'Santa Rita do Sapucaí', '11111111');
INSERT INTO municipality (street, number, neighborhood, city, zip_code) VALUES ('ze1', '11', 'ze2', 'Pouso Alegre', '12312-12');
INSERT INTO municipality (street, number, neighborhood, city, zip_code) VALUES ('asd', 'asd', 'asdasasdadas', 'Santa Rita do Sapucaí', '37540000');
INSERT INTO municipality (street, number, neighborhood, city, zip_code) VALUES ('quintos dos infermos', '123', 'to nem ai', 'Pouso Alegre', '37540-000');
INSERT INTO municipality (street, number, neighborhood, city, zip_code) VALUES ('Céu', '123', 'Nuvens', 'Pouso Alegre', '');
INSERT INTO municipality (street, number, neighborhood, city, zip_code) VALUES ('dao pedro', '111', 'jorge cabral', 'Santa Rita do Sapucaí', '11111-111');

-- Insert categories from db.json
INSERT INTO category (description) VALUES ('Alimentos Básicos');
INSERT INTO category (description) VALUES ('Produtos de Higiene');
INSERT INTO category (description) VALUES ('Produtos Infantis');

-- Insert users from db.json
INSERT INTO user_model (name, email, password, phone, user_type, municipality_id) 
VALUES ('Admin', 'admin@foodcare.com', 'admin123', '11999999999', 'admin', 1);

INSERT INTO user_model (name, email, password, phone, user_type, municipality_id) 
VALUES ('tiburgus', 'tiburgus@gmail.com', '1234567', '3', 'donor', 1);

INSERT INTO user_model (name, email, password, phone, user_type, municipality_id) 
VALUES ('aroldus', 'aroldus@gmail.com', '1234567', '3', 'donor', 2);

INSERT INTO user_model (name, email, password, phone, user_type, family_income, people_quantity, municipality_id, documents, able) 
VALUES ('tiburgas', 'tiburgas@gmail.com', '12345678', '3', 'beneficiary', 2222.0, 4, 3, ARRAY['data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCdABmX/9k='], FALSE);

INSERT INTO user_model (name, email, password, phone, user_type, family_income, people_quantity, municipality_id, documents, able) 
VALUES ('tiburgos', 'tiburgos@gmail.com', 'pinto123', '3', 'beneficiary', 1234.0, 4, 4, ARRAY['data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCdABmX/9k='], TRUE);

INSERT INTO user_model (name, email, password, phone, user_type, municipality_id) 
VALUES ('Edu du', 'edu@gmail.com', '123456', '12345678902', 'donor', 2);

INSERT INTO user_model (name, email, password, phone, user_type, municipality_id) 
VALUES ('babu a', 'babu@gmail.com', 'asdzxc', '11111111111', 'donor', 5);

INSERT INTO user_model (name, email, password, phone, user_type, family_income, people_quantity, municipality_id, documents, able) 
VALUES ('zezao', 'zezao@gmail.com', '123asd', '12312312312', 'beneficiary', 2000.0, 5, 6, ARRAY['data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCdABmX/9k='], FALSE);

INSERT INTO user_model (name, email, password, phone, user_type, family_income, people_quantity, municipality_id, documents, able) 
VALUES ('pintao', 'pintao@123.mail', 'pintao', '66666666666', 'beneficiary', 1000000.0, 10, 7, ARRAY[]::TEXT[], FALSE);

INSERT INTO user_model (name, email, password, phone, user_type, municipality_id) 
VALUES ('Richard', 'richard123@gmail.com', '24242424', '24924242424', 'donor', 8);

INSERT INTO user_model (name, email, password, phone, user_type, family_income, people_quantity, municipality_id, has_children, documents) 
VALUES ('jubileu', 'jubileu@gmail.com', '123456', '(35) 99988-8888', 'beneficiary', 1200.0, 3, 9, FALSE, ARRAY[]::TEXT[]);

-- Insert products from db.json
INSERT INTO product (name, product_type, category_id, measure_type, options_donation) 
VALUES ('Arroz', 'basic', 1, 'kg', '{1, 5}');

INSERT INTO product (name, product_type, category_id, measure_type, options_donation) 
VALUES ('Feijão', 'basic', 1, 'kg', '{1, 5}');

INSERT INTO product (name, product_type, category_id, measure_type, options_donation) 
VALUES ('Batata-palha', 'basic', 1, 'g', '{100, 500}');

INSERT INTO product (name, product_type, category_id, measure_type) 
VALUES ('Papel-toalha', 'hygiene', 2, 'un');

INSERT INTO product (name, product_type, category_id, measure_type) 
VALUES ('Papel-higiênico', 'hygiene', 2, 'un');

INSERT INTO product (name, product_type, category_id, measure_type) 
VALUES ('Sabonete', 'hygiene', 2, 'un');

INSERT INTO product (name, product_type, category_id, measure_type, options_donation) 
VALUES ('Óleo de Soja', 'basic', 1, 'ml', '{500, 900}');

INSERT INTO product (name, product_type, category_id, measure_type, options_donation) 
VALUES ('Carne', 'basic', 1, 'g', '{500, 1000}');

INSERT INTO product (name, product_type, category_id, measure_type, options_donation) 
VALUES ('Leite', 'basic', 1, 'l', '{1, 2}');

INSERT INTO product (name, product_type, category_id, measure_type, options_donation) 
VALUES ('Farinha de Trigo', 'basic', 1, 'kg', '{1, 5}');

INSERT INTO product (name, product_type, category_id, measure_type, options_donation) 
VALUES ('Batata', 'basic', 1, 'kg', '{1, 3}');

INSERT INTO product (name, product_type, category_id, measure_type, options_donation) 
VALUES ('Tomate', 'basic', 1, 'kg', '{1, 2}');

INSERT INTO product (name, product_type, category_id, measure_type) 
VALUES ('Pão Francês', 'basic', 1, 'un');

INSERT INTO product (name, product_type, category_id, measure_type, options_donation) 
VALUES ('Café em Pó', 'basic', 1, 'g', '{250, 500}');

INSERT INTO product (name, product_type, category_id, measure_type, options_donation) 
VALUES ('Banana', 'basic', 1, 'kg', '{1, 2}');

INSERT INTO product (name, product_type, category_id, measure_type, options_donation) 
VALUES ('Açúcar', 'basic', 1, 'kg', '{1, 5}');

INSERT INTO product (name, product_type, category_id, measure_type, options_donation) 
VALUES ('Manteiga', 'basic', 1, 'g', '{200, 500}');

INSERT INTO product (name, product_type, category_id, measure_type, options_donation) 
VALUES ('Sal', 'basic', 1, 'g', '{500, 1000}');

INSERT INTO product (name, product_type, category_id, measure_type) 
VALUES ('Creme Dental', 'hygiene', 2, 'un');

INSERT INTO product (name, product_type, category_id, measure_type) 
VALUES ('Escova de Dentes', 'hygiene', 2, 'un');

INSERT INTO product (name, product_type, category_id, measure_type) 
VALUES ('Absorvente Higiênico', 'hygiene', 2, 'un');

INSERT INTO product (name, product_type, category_id, measure_type) 
VALUES ('Desodorante', 'hygiene', 2, 'un');

INSERT INTO product (name, product_type, category_id, measure_type) 
VALUES ('Brinquedo', 'infant', 3, 'un');

INSERT INTO product (name, product_type, category_id, measure_type, options_donation) 
VALUES ('Bolacha', 'infant', 3, 'g', '{200, 400}');

INSERT INTO product (name, product_type, category_id, measure_type, options_donation) 
VALUES ('Gelatina', 'infant', 3, 'g', '{85, 170}');

INSERT INTO product (name, product_type, category_id, measure_type, options_donation) 
VALUES ('Biscoitinho', 'infant', 3, 'g', '{150, 300}');

-- Insert donations from db.json
INSERT INTO donation (donation_date, user_id) VALUES ('2025-07-14T18:29:00.381Z', 3);
INSERT INTO donation (donation_date, user_id) VALUES ('2025-07-14T18:29:46.162Z', 3);
INSERT INTO donation (donation_date, user_id) VALUES ('2025-07-14T18:31:43.431Z', 3);
INSERT INTO donation (donation_date, user_id) VALUES ('2025-07-14T18:33:02.826Z', 3);
INSERT INTO donation (donation_date, user_id) VALUES ('2025-07-14T18:37:05.754Z', 3);
INSERT INTO donation (donation_date, user_id) VALUES ('2025-08-05T23:26:25.802Z', 6);
INSERT INTO donation (donation_date, user_id) VALUES ('2025-08-05T23:31:35.112Z', 6);
INSERT INTO donation (donation_date, user_id) VALUES ('2025-09-02T01:36:06.653Z', 6);
INSERT INTO donation (donation_date, user_id) VALUES ('2025-09-02T21:08:55.000Z', 6);
INSERT INTO donation (donation_date, user_id) VALUES ('2025-09-02T21:09:25.419Z', 6);
INSERT INTO donation (donation_date, user_id) VALUES ('2025-09-02T21:09:51.746Z', 6);
INSERT INTO donation (donation_date, user_id) VALUES ('2025-09-02T21:10:59.385Z', 6);
INSERT INTO donation (donation_date, user_id) VALUES ('2025-09-02T21:11:40.133Z', 6);
INSERT INTO donation (donation_date, user_id) VALUES ('2025-09-02T23:22:53.610Z', 6);
INSERT INTO donation (donation_date, user_id) VALUES ('2025-09-04T18:52:34.279Z', 6);
INSERT INTO donation (donation_date, user_id) VALUES ('2025-09-04T18:52:57.644Z', 6);
INSERT INTO donation (donation_date, user_id) VALUES ('2025-09-04T18:53:29.516Z', 6);
INSERT INTO donation (donation_date, user_id) VALUES ('2025-09-04T18:53:54.059Z', 6);
INSERT INTO donation (donation_date, user_id) VALUES ('2025-09-04T18:54:17.514Z', 6);
INSERT INTO donation (donation_date, user_id) VALUES ('2025-09-04T18:54:36.722Z', 6);
INSERT INTO donation (donation_date, user_id) VALUES ('2025-09-04T18:55:11.968Z', 6);
INSERT INTO donation (donation_date, user_id) VALUES ('2025-09-04T18:57:24.048Z', 6);

-- Insert donation products from db.json
INSERT INTO donation_product (quantity, expiration_date, unit, donation_id, product_id) VALUES (5, '2056-03-22T00:00:00.000Z', 'Kg', 1, 2);
INSERT INTO donation_product (quantity, expiration_date, unit, donation_id, product_id) VALUES (3, '2054-05-23T00:00:00.000Z', 'Kg', 2, 1);
INSERT INTO donation_product (quantity, expiration_date, unit, donation_id, product_id) VALUES (3, '2032-05-22T00:00:00.000Z', 'Kg', 3, 2);
INSERT INTO donation_product (quantity, expiration_date, unit, donation_id, product_id) VALUES (3, '2026-10-03T00:00:00.000Z', 'Kg', 4, 3);
INSERT INTO donation_product (quantity, expiration_date, unit, donation_id, product_id) VALUES (8, '2045-04-03T00:00:00.000Z', 'Kg', 5, 2);
INSERT INTO donation_product (quantity, expiration_date, unit, donation_id, product_id) VALUES (2, NULL, 'L', 6, 7);
INSERT INTO donation_product (quantity, expiration_date, unit, donation_id, product_id) VALUES (8, NULL, 'Un', 7, 4);
INSERT INTO donation_product (quantity, expiration_date, unit, donation_id, product_id) VALUES (5, '2025-02-09T03:00:00.000Z', 'Kg', 8, 1);
INSERT INTO donation_product (quantity, expiration_date, unit, donation_id, product_id) VALUES (500, NULL, 'g', 9, 3);
INSERT INTO donation_product (quantity, expiration_date, unit, donation_id, product_id) VALUES (5, NULL, 'kg', 10, 1);
INSERT INTO donation_product (quantity, expiration_date, unit, donation_id, product_id) VALUES (5, NULL, 'kg', 11, 1);
INSERT INTO donation_product (quantity, expiration_date, unit, donation_id, product_id) VALUES (15, NULL, 'kg', 12, 16);
INSERT INTO donation_product (quantity, expiration_date, unit, donation_id, product_id) VALUES (800, '2025-11-09T03:00:00.000Z', 'g', 13, 14);
INSERT INTO donation_product (quantity, expiration_date, unit, donation_id, product_id) VALUES (5, '2025-04-09T03:00:00.000Z', 'kg', 14, 2);
INSERT INTO donation_product (quantity, expiration_date, unit, donation_id, product_id) VALUES (150, '2025-04-09T03:00:00.000Z', 'g', 15, 26);
INSERT INTO donation_product (quantity, expiration_date, unit, donation_id, product_id) VALUES (150, '2025-12-09T03:00:00.000Z', 'g', 16, 26);
INSERT INTO donation_product (quantity, expiration_date, unit, donation_id, product_id) VALUES (400, '2025-12-09T03:00:00.000Z', 'g', 17, 24);
INSERT INTO donation_product (quantity, expiration_date, unit, donation_id, product_id) VALUES (200, '2025-12-09T03:00:00.000Z', 'g', 18, 24);
INSERT INTO donation_product (quantity, expiration_date, unit, donation_id, product_id) VALUES (170, '2025-12-09T03:00:00.000Z', 'g', 19, 25);
INSERT INTO donation_product (quantity, expiration_date, unit, donation_id, product_id) VALUES (170, '2025-12-09T03:00:00.000Z', 'g', 20, 25);
INSERT INTO donation_product (quantity, expiration_date, unit, donation_id, product_id) VALUES (3, NULL, 'un', 21, 23);
INSERT INTO donation_product (quantity, expiration_date, unit, donation_id, product_id) VALUES (1, NULL, 'un', 22, 23);

-- Insert basket requests from db.json
INSERT INTO basket_request (user_id, request_date, basket_type, status) VALUES (4, '2025-08-08T03:00:00.000Z', 'basic', 'pending');
INSERT INTO basket_request (user_id, request_date, basket_type, status) VALUES (4, '2025-08-08T03:00:00.000Z', 'hygiene', 'pending');
INSERT INTO basket_request (user_id, request_date, basket_type, status) VALUES (5, '2025-08-08T03:00:00.000Z', 'basic', 'pending');
INSERT INTO basket_request (user_id, request_date, basket_type, status, people_quantity, has_children, calculated_items) VALUES (5, '2025-09-09T01:18:44.588Z', 'basic', 'pending', 4, FALSE, '[{"productId": 1, "productName": "Arroz", "quantity": 8, "unitQuantity": 2, "unitType": "kg"}, {"productId": 2, "productName": "Feijão", "quantity": 4, "unitQuantity": 1, "unitType": "kg"}]');
INSERT INTO basket_request (user_id, request_date, basket_type, status, calculated_items) VALUES (5, '2025-09-09T01:19:24.161Z', 'hygiene', 'pending', '[{"productId": 4, "productName": "Papel-toalha", "quantity": 1, "unitQuantity": 1, "unitType": "un"}, {"productId": 5, "productName": "Papel-higiênico", "quantity": 1, "unitQuantity": 1, "unitType": "un"}]');

-- Insert stock data with 1000 units for all products and all donation options
-- Basic products
INSERT INTO stock (product_id, donation_option, actual_stock) VALUES (1, 1, 1000);
INSERT INTO stock (product_id, donation_option, actual_stock) VALUES (1, 5, 1000);
INSERT INTO stock (product_id, donation_option, actual_stock) VALUES (2, 1, 1000);
INSERT INTO stock (product_id, donation_option, actual_stock) VALUES (2, 5, 1000);
INSERT INTO stock (product_id, donation_option, actual_stock) VALUES (3, 100, 1000);
INSERT INTO stock (product_id, donation_option, actual_stock) VALUES (3, 500, 1000);
INSERT INTO stock (product_id, donation_option, actual_stock) VALUES (7, 500, 1000);
INSERT INTO stock (product_id, donation_option, actual_stock) VALUES (7, 900, 1000);
INSERT INTO stock (product_id, donation_option, actual_stock) VALUES (8, 500, 1000);
INSERT INTO stock (product_id, donation_option, actual_stock) VALUES (8, 1000, 1000);
INSERT INTO stock (product_id, donation_option, actual_stock) VALUES (9, 1, 1000);
INSERT INTO stock (product_id, donation_option, actual_stock) VALUES (9, 2, 1000);
INSERT INTO stock (product_id, donation_option, actual_stock) VALUES (10, 1, 1000);
INSERT INTO stock (product_id, donation_option, actual_stock) VALUES (10, 5, 1000);
INSERT INTO stock (product_id, donation_option, actual_stock) VALUES (11, 1, 1000);
INSERT INTO stock (product_id, donation_option, actual_stock) VALUES (11, 3, 1000);
INSERT INTO stock (product_id, donation_option, actual_stock) VALUES (12, 1, 1000);
INSERT INTO stock (product_id, donation_option, actual_stock) VALUES (12, 2, 1000);
INSERT INTO stock (product_id, donation_option, actual_stock) VALUES (13, 1, 1000);
INSERT INTO stock (product_id, donation_option, actual_stock) VALUES (14, 250, 1000);
INSERT INTO stock (product_id, donation_option, actual_stock) VALUES (14, 500, 1000);
INSERT INTO stock (product_id, donation_option, actual_stock) VALUES (15, 1, 1000);
INSERT INTO stock (product_id, donation_option, actual_stock) VALUES (15, 2, 1000);
INSERT INTO stock (product_id, donation_option, actual_stock) VALUES (16, 1, 1000);
INSERT INTO stock (product_id, donation_option, actual_stock) VALUES (16, 5, 1000);
INSERT INTO stock (product_id, donation_option, actual_stock) VALUES (17, 200, 1000);
INSERT INTO stock (product_id, donation_option, actual_stock) VALUES (17, 500, 1000);
INSERT INTO stock (product_id, donation_option, actual_stock) VALUES (18, 500, 1000);
INSERT INTO stock (product_id, donation_option, actual_stock) VALUES (18, 1000, 1000);

-- Hygiene products
INSERT INTO stock (product_id, donation_option, actual_stock) VALUES (4, 1, 1000);
INSERT INTO stock (product_id, donation_option, actual_stock) VALUES (5, 1, 1000);
INSERT INTO stock (product_id, donation_option, actual_stock) VALUES (6, 1, 1000);
INSERT INTO stock (product_id, donation_option, actual_stock) VALUES (19, 1, 1000);
INSERT INTO stock (product_id, donation_option, actual_stock) VALUES (20, 1, 1000);
INSERT INTO stock (product_id, donation_option, actual_stock) VALUES (21, 1, 1000);
INSERT INTO stock (product_id, donation_option, actual_stock) VALUES (22, 1, 1000);

-- Infant products
INSERT INTO stock (product_id, donation_option, actual_stock) VALUES (23, 1, 1000);
INSERT INTO stock (product_id, donation_option, actual_stock) VALUES (24, 200, 1000);
INSERT INTO stock (product_id, donation_option, actual_stock) VALUES (24, 400, 1000);
INSERT INTO stock (product_id, donation_option, actual_stock) VALUES (25, 85, 1000);
INSERT INTO stock (product_id, donation_option, actual_stock) VALUES (25, 170, 1000);
INSERT INTO stock (product_id, donation_option, actual_stock) VALUES (26, 150, 1000);
INSERT INTO stock (product_id, donation_option, actual_stock) VALUES (26, 300, 1000);

-- Commented encrypted password versions (uncomment to use encryption):
-- INSERT INTO user_model (name, email, password, user_type, is_admin, municipality_id) 
-- VALUES ('Admin FoodCare', 'admin@foodcare.com', crypt('admin123', gen_salt('bf')), 'DONOR', TRUE, 1);
