-- Script para corrigir dados existentes que podem ter sido inseridos incorretamente

-- Corrigir documents que foram inseridos como JSON string ao invés de array
UPDATE user_model 
SET documents = ARRAY[documents::text] 
WHERE documents IS NOT NULL 
  AND array_length(documents, 1) IS NULL 
  AND documents::text LIKE '{%}';

-- Garantir que campos obrigatórios tenham valores padrão
UPDATE user_model 
SET family_income = 0.0 
WHERE family_income IS NULL;

UPDATE user_model 
SET people_quantity = 1 
WHERE people_quantity IS NULL OR people_quantity = 0;

UPDATE user_model 
SET has_children = FALSE 
WHERE has_children IS NULL;

UPDATE user_model 
SET number_of_children = 0 
WHERE number_of_children IS NULL;

-- Garantir que documents seja um array vazio se for NULL
UPDATE user_model 
SET documents = ARRAY[]::TEXT[] 
WHERE documents IS NULL;

-- Garantir que images seja um array vazio se for NULL
UPDATE user_model 
SET images = ARRAY[]::TEXT[] 
WHERE images IS NULL;