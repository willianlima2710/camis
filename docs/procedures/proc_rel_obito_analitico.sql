DELIMITER $$
DROP PROCEDURE IF EXISTS `proc_rel_obito_analitico` $$
CREATE PROCEDURE `proc_rel_obito_analitico`(
in inflddata varchar(30),
in invaldataini date,
in invaldatafim date,
in inlocatario varchar(20),
in inordem varchar(30)
)
begin
SET @sql = 
'select a.obito_id,
        a.obito_nrobito,
        a.locatario_id,
        a.obito_falecido,
        a.obito_insexo,
		a.obito_endereco,
		a.obito_complem,
		a.obito_bairro,
		a.obito_cidade,
		a.obito_cep,
		a.obito_naturalidade,
		a.obito_nacionalidade,
		a.obito_data_nascimento,
		a.obito_cpf,
        a.obito_rg,
		a.cbo_id_falecido,
		a.corcurtis_id,
		a.jazigo_codigo,
		a.obito_obs,
		a.obito_data_cadastro,
		a.obito_data_falecimento,
		a.obito_hora_falecimento,
		a.obito_data_sepultamento,
		a.obito_hora_sepultamento,
		a.local_id,
		a.obito_declarante,
		a.obito_naturalidade_declarante,
		a.estcivil_id_declarante,
		a.cbo_id_declarante,
		a.obito_rg_declarante,
		a.obito_endereco_declarante,
		a.obito_bairro_declarante,
		a.obito_cidade_declarante,
		a.estado_sigla_declarante,
		a.obito_telefone_declarante,
		a.obito_celular_declarante,
		a.obito_velorio,
		a.obito_medico_1,
		a.obito_medico_crm_1,
		a.obito_medico_2,
		a.obito_medico_crm_2,
		a.cartorio_id,
		a.obito_valor,
		a.obito_vias,
		a.obito_possui_bem,
		a.obito_possui_testamento,
		a.funeraria_id,
		a.obito_gf,
		a.obito_inclassificacao,
		a.obito_inevento,
		a.obito_tanato,
		a.obito_zincado,
        a.locatario_desc,
		a.usuario_login,
		b.cbo_desc as cbo_desc_falecido,
		c.corcurtis_desc,
		d.local_desc,
		e.estcivil_desc as estcivil_desc_declarante,
		f.cbo_desc as cbo_desc_declarante,
		g.cartorio_desc,
		h.funeraria_desc,
		i.estado_desc
from cad_obito a
left join cad_cbo b on a.cbo_id_falecido=b.cbo_id
left join cad_corcurtis c on a.corcurtis_id=c.corcurtis_id
left join cad_local d on a.local_id=d.local_id
left join cad_estcivil e on a.estcivil_id_declarante=e.estcivil_id
left join cad_cbo f on a.cbo_id_declarante=f.cbo_id
left join cad_cartorio g on a.cartorio_id=g.cartorio_id
left join cad_funeraria h on a.funeraria_id=h.funeraria_id
left join cad_estado i on a.estado_sigla_declarante=i.estado_sigla
where ';

IF(inlocatario!='') THEN
SET @locatario = CONCAT(' and a.locatario_id=',inlocatario);
ELSE
SET @locatario = '';
END IF;

SET @ordem = CONCAT(' order by ',inordem);

SET @periodo = CONCAT(inflddata,' between ',"'",invaldataini,"'",' and ',"'",invaldatafim,"'");	

IF(inlocatario!='') THEN
SET @s = CONCAT(@sql,@periodo,@locatario,@ordem);
ELSE
SET @s = CONCAT(@sql,@periodo,@ordem);
END IF;

PREPARE stmt FROM @s;
EXECUTE stmt;
SELECT @s;
DEALLOCATE PREPARE stmt;
end;
$$