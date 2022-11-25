DELIMITER $$
DROP PROCEDURE IF EXISTS `proc_rel_pagpar_analitico` $$
CREATE PROCEDURE `proc_rel_pagpar_analitico`(
in inflddata varchar(30),
in invaldataini date,
in invaldatafim date,
in instatus char(1),
in infornecedor varchar(20),
in inusuario varchar(100),
in inordem varchar(30)
)
begin
SET @sql = 
'select a.pagpar_id,
        a.fornecedor_id,
        a.empresa_id,
        a.ctapag_documento,
        a.ctapag_id,
        a.formarec_id,
        a.locpagto_id,
        a.operacao_id,
        a.conta_id,
        a.pagpar_data_emissao,
        a.pagpar_data_vencto,
        a.pagpar_valor,
        a.pagpar_pago,
        a.pagpar_data_pagto,
        a.pagpar_agencia,
        a.pagpar_conta,
        a.pagpar_banco,
        a.pagpar_cheque,
        a.pagpar_parcela,
        a.pagpar_instatus,        
        a.pagpar_ano,
		a.usuario_login,
        a.fornecedor_desc,
		b.operacao_desc,
		e.ctapag_observacao
from mov_pagpar a
left join cad_operacao b on a.operacao_id=b.operacao_id
left join cad_formarec c on a.formarec_id=c.formarec_id
left join cad_locpagto d on a.locpagto_id=d.locpagto_id
left join mov_ctapag e on a.ctapag_id=e.ctapag_id
where ';

CASE instatus
WHEN '0' THEN SET @status = "a.pagpar_instatus in ('0')"; 
WHEN '1' THEN SET @status = "a.pagpar_instatus in ('1')"; 
WHEN '2' THEN SET @status = "a.pagpar_instatus in ('0','1')"; 
END CASE;

IF(infornecedor!='') THEN
SET @fornecedor = CONCAT(' and a.fornecedor_id=',infornecedor);
ELSE
SET @fornecedor = '';
END IF;

IF(infornecedor!='') THEN
SET @fornecedor = CONCAT(' and a.fornecedor_id=',infornecedor);
ELSE
SET @fornecedor = '';
END IF;

IF(inusuario!='') THEN
SET @usuario = CONCAT(' and a.usuario_login=',"'",inusuario,"'");
ELSE
SET @usuario = '';
END IF;

SET @ordem = CONCAT(' order by ',inordem);

SET @periodo = CONCAT(inflddata,' between ',"'",invaldataini,"'",' and ',"'",invaldatafim,"'");	

SET @s = CONCAT(@sql,@periodo,' and ',@status,@fornecedor,@usuario,@ordem);

PREPARE stmt FROM @s;
EXECUTE stmt;
SELECT @s;
DEALLOCATE PREPARE stmt;
end;
$$