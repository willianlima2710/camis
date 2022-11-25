DELIMITER $$
DROP PROCEDURE IF EXISTS `proc_rel_jazigo_analitico` $$
CREATE PROCEDURE `proc_rel_jazigo_analitico`(
in incemiterio varchar(20),
in inlote varchar(20),
in inquadra varchar(20),
in inalameda varchar(20),
in intpterreno varchar(20),
in intpjazigo varchar(20),
in inordem varchar(30)
)
begin
SET @sql = 
'select a.jazigo_id,
        a.jazigo_codigo,
        a.cemiterio_id,
        a.lote_codigo,
        a.quadra_codigo,
        a.alameda_codigo,
        a.tpterreno_id,
        a.tpjazigo_id,
        a.jazigo_desc,
        a.jazigo_valor,
        a.jazigo_disponivel,
        a.jazigo_gaveta,
        a.jazigo_saldo,
        a.jazigo_incobranca,
		b.cemiterio_desc,
		c.lote_desc,
		d.quadra_desc,
		e.alameda_desc,
		f.tpterreno_desc,
		g.tpjazigo_desc
from cad_jazigo a
left join cad_cemiterio b on a.cemiterio_id=b.cemiterio_id
left join cad_lote c on a.lote_codigo=c.lote_codigo
left join cad_quadra d on a.quadra_codigo=d.quadra_codigo
left join cad_alameda e on a.alameda_codigo=e.alameda_codigo
left join cad_tpterreno f on a.tpterreno_id=f.tpterreno_id
left join cad_tpjazigo g on a.tpjazigo_id=g.tpjazigo_id 
where ';

set @cemiterio = CONCAT('a.cemiterio_id=',incemiterio);

IF(inlote!='') THEN
SET @lote = CONCAT(' and a.lote_codigo=',inlote);
ELSE
SET @lote = '';
END IF;

IF(inquadra!='') THEN
SET @quadra = CONCAT(' and a.quadra_codigo=',inquadra);
ELSE
SET @quadra = '';
END IF;

IF(inalameda!='') THEN
SET @alameda = CONCAT(' and a.alameda_codigo=',inalameda);
ELSE
SET @alameda = '';
END IF;

IF(intpterreno!='') THEN
SET @tpterreno = CONCAT(' and a.tpterreno_id=',intpterreno);
ELSE
SET @tpterreno = '';
END IF;

IF(intpjazigo!='') THEN
SET @tpjazigo = CONCAT(' and a.tpjazigo_id=',intpjazigo);
ELSE
SET @tpjazigo = '';
END IF;

SET @ordem = CONCAT(' order by ',inordem);

SET @s = CONCAT(@sql,@cemiterio,@lote,@quadra,@alameda,@tpterreno,@tpjazigo,@ordem);

PREPARE stmt FROM @s;
EXECUTE stmt;
SELECT @s;
DEALLOCATE PREPARE stmt;
end;
$$