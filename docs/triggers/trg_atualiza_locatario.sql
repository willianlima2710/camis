DELIMITER $$
DROP TRIGGER IF EXISTS `trg_atualiza_locatario` $$
CREATE TRIGGER trg_atualiza_locatario BEFORE UPDATE ON cad_locatario
FOR EACH ROW BEGIN
UPDATE cad_obito SET locatario_desc=NEW.locatario_desc WHERE locatario_id=NEW.locatario_id;
UPDATE mov_venda SET locatario_desc=NEW.locatario_desc WHERE locatario_id=NEW.locatario_id;
UPDATE mov_ctarec SET locatario_desc=NEW.locatario_desc WHERE locatario_id=NEW.locatario_id;
UPDATE mov_recpar SET locatario_desc=NEW.locatario_desc WHERE locatario_id=NEW.locatario_id;
UPDATE mov_caixa SET locfor_desc=NEW.locatario_desc WHERE locfor_id=NEW.locatario_id;
UPDATE cad_locatario_adc set locatario_adc_desc=NEW.locatario_desc where locatario_adc_id=NEW.locatario_id;
UPDATE cad_contrato SET locatario_desc=NEW.locatario_desc WHERE locatario_id=NEW.locatario_id;
END;
$$