DELIMITER $$
DROP PROCEDURE IF EXISTS `proc_rel_recpar_analitico` $$
CREATE PROCEDURE `proc_rel_recpar_analitico`(
in inflddata varchar(30),
in invaldataini date,
in invaldatafim date,
in instatus char(1),
in inlocatario varchar(20),
in inusuario varchar(100),
in informarec varchar(20),
in inordem varchar(30)
)
begin
SET @sql = 
'select a.recpar_id,
        a.locatario_id,
        a.jazigo_codigo,
        a.empresa_id,
	    a.ctarec_documento,
	    a.ctarec_id,
	    a.formarec_id,
	    a.locpagto_id,
	    a.operacao_id,
	    a.portador_id,
	    a.carteira_id,
	    a.conta_id,
	    a.recpar_data_emissao,
	    a.recpar_data_vencto,
	    a.recpar_valor,
	    a.recpar_pago,
	    a.recpar_data_pagto,
	    a.recpar_agencia,
	    a.recpar_conta,
        a.recpar_banco,
        a.recpar_cheque,
	    a.recpar_parcela,
	    a.recpar_instatus,
	    a.recpar_ano,
	    a.locatario_desc,
		a.usuario_login,
	    b.operacao_desc,
	    c.formarec_desc,
	    d.locpagto_desc
from mov_recpar a
left join cad_operacao b on a.operacao_id=b.operacao_id
left join cad_formarec c on a.formarec_id=c.formarec_id
left join cad_locpagto d on a.locpagto_id=d.locpagto_id
where ';

CASE instatus
WHEN '0' THEN SET @status = "a.recpar_instatus in ('0')"; 
WHEN '1' THEN SET @status = "a.recpar_instatus in ('1')"; 
WHEN '2' THEN SET @status = "a.recpar_instatus in ('0','1')"; 
END CASE;

IF(inlocatario!='') THEN
SET @locatario = CONCAT(' and a.locatario_id=',inlocatario);
ELSE
SET @locatario = '';
END IF;

IF(informarec!='') THEN
SET @formarec = CONCAT(' and a.formarec_id=',informarec);
ELSE
SET @formarec = '';
END IF;

IF(inusuario!='') THEN
SET @usuario = CONCAT(' and a.usuario_login=',"'",inusuario,"'");
ELSE
SET @usuario = '';
END IF;

SET @ordem = CONCAT(' order by ',inordem);

SET @periodo = CONCAT(inflddata,' between ',"'",invaldataini,"'",' and ',"'",invaldatafim,"'");	

SET @s = CONCAT(@sql,@periodo,' and ',@status,@locatario,@usuario,@formarec,@ordem);

PREPARE stmt FROM @s;
EXECUTE stmt;
SELECT @s;
DEALLOCATE PREPARE stmt;

end