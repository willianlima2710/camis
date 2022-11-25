DELIMITER $$
DROP TRIGGER IF EXISTS `trg_atualiza_fornecedor` $$
CREATE TRIGGER trg_atualiza_fornecedor BEFORE UPDATE ON cad_fornecedor
FOR EACH ROW BEGIN
UPDATE mov_ctapag SET fornecedor_desc=NEW.fornecedor_desc WHERE fornecedor_id=NEW.fornecedor_id;
UPDATE mov_pagpar SET fornecedor_desc=NEW.fornecedor_desc WHERE fornecedor_id=NEW.fornecedor_id;
UPDATE mov_caixa SET locfor_desc=NEW.fornecedor_desc WHERE locfor_id=NEW.fornecedor_id;
END;
$$