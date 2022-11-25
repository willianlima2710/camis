DELIMITER $$
DROP PROCEDURE IF EXISTS `proc_rel_caixa_analitico` $$
CREATE PROCEDURE `proc_rel_caixa_analitico`(
in invaldataini date,
in invaldatafim date,
in inbanco varchar(20),
in incontafilho varchar(20),
in incontapai varchar(20)
)
begin
SET @sql = 
"select a.caixa_id,
		a.banco_id,
		a.jazigo_codigo,
        a.empresa_id,
		a.locfor_id,
		a.conta_id,
		a.caixa_historico,
		a.caixa_obs,
		a.caixa_documento,
		a.caixa_data_movto,
		a.caixa_valor,
		a.caixa_intipo,
		a.caixa_mesano,
		a.locfor_desc,
		a.usuario_login,
		a.data_ultima_alteracao,
		if(a.caixa_intipo='0',a.caixa_valor,0) as valor_credito,
		if(a.caixa_intipo='1',a.caixa_valor,0) as valor_debito,
		b.conta_desc,
		b.conta_codigo,
		b.conta_pai		
from mov_caixa a
left join cad_conta b on a.conta_id=b.conta_id
where ";

SET @tipo = "a.caixa_intipo in ('0','1')"; 

IF(inbanco!='') THEN
SET @banco = CONCAT(' and a.banco_id=',inbanco);
ELSE
SET @banco = '';
END IF;

IF(incontapai='') THEN
	IF(incontafilho!='') THEN
	SET @conta = CONCAT(' and a.conta_id=',incontafilho);
	ELSE
	SET @conta = '';
	END IF;
ELSE
	SET @conta = CONCAT(' and b.conta_pai=',incontapai);
END IF;	

SET @ordem = CONCAT(' order by b.conta_pai,a.conta_id,a.caixa_data_movto,a.locfor_desc');

SET @periodo = CONCAT('a.caixa_data_movto between ',"'",invaldataini,"'",' and ',"'",invaldatafim,"'",@banco,@conta);	

SET @s = CONCAT(@sql,@periodo,' and ',@tipo,@ordem);

PREPARE stmt FROM @s;
EXECUTE stmt;
SELECT @s;
DEALLOCATE PREPARE stmt;
end;
$$