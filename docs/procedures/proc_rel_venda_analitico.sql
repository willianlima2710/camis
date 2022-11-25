DELIMITER $$
DROP PROCEDURE IF EXISTS `proc_rel_venda_analitico` $$
CREATE PROCEDURE `proc_rel_venda_analitico`(
in inflddata varchar(30),
in invaldataini date,
in invaldatafim date,
in inlocatario varchar(20),
in injazigo varchar(20),
in inoperacao varchar(20),
in inordem varchar(30)
)
begin
SET @sql = 
'select a.venda_id,
        a.locatario_id,
        a.jazigo_codigo,
		a.operacao_id,
		a.locatario_desc,
		a.venda_data,
		a.venda_data_vencimento,
		a.venda_documento,
		a.venda_total,
		a.venda_outros,
		a.venda_infaturar,
		b.operacao_desc
from mov_venda a
left join cad_operacao b on a.operacao_id=b.operacao_id
where ';		

IF(inlocatario!='') THEN
SET @locatario = CONCAT(' and a.locatario_id=',inlocatario);
ELSE
SET @locatario = '';
END IF;

IF(injazigo!='') THEN
SET @jazigo = CONCAT(' and a.jazigo_codigo=',"'",injazigo,"'");
ELSE
SET @jazigo = '';
END IF;

IF(inoperacao!='') THEN
SET @operacao = CONCAT(' and a.operacao_id=',inoperacao);
ELSE
SET @operacao = '';
END IF;

SET @ordem = CONCAT(' order by ',inordem);

SET @periodo = CONCAT(inflddata,' between ',"'",invaldataini,"'",' and ',"'",invaldatafim,"'");	

SET @s = CONCAT(@sql,@periodo,@locatario,@jazigo,@operacao,@ordem);

PREPARE stmt FROM @s;
EXECUTE stmt;
SELECT @s;
DEALLOCATE PREPARE stmt;
end;
$$