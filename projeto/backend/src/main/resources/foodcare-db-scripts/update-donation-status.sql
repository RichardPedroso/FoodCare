-- Script para alterar o tipo da coluna donation_status de BOOLEAN para VARCHAR
-- e migrar os dados existentes

-- 1. Adicionar nova coluna temporária
ALTER TABLE donation ADD COLUMN donation_status_new VARCHAR(20);

-- 2. Migrar dados existentes
UPDATE donation 
SET donation_status_new = CASE 
    WHEN donation_status = true THEN 'Em estoque'
    WHEN donation_status = false THEN 'Pendente'
    ELSE 'Pendente'
END;

-- 3. Remover coluna antiga
ALTER TABLE donation DROP COLUMN donation_status;

-- 4. Renomear nova coluna
ALTER TABLE donation RENAME COLUMN donation_status_new TO donation_status;

-- 5. Definir valor padrão
ALTER TABLE donation ALTER COLUMN donation_status SET DEFAULT 'Pendente';

-- 6. Adicionar constraint para garantir valores válidos
ALTER TABLE donation ADD CONSTRAINT check_donation_status 
CHECK (donation_status IN ('Pendente', 'Em estoque', 'Utilizada', 'Rejeitada'));