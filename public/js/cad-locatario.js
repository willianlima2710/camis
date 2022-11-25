var cadlocatario = Ext.extend(Ext.Window,{	
		 locatarioID : 0
		,modal		 : true
		,constrain	 : true
		,maximizable : false
		,resizable   : false
		,width		 : 700
		,height		 : 550
		,title		 : 'Cadastro de locatario & adicionais'
		,layout		 : 'fit'
		,buttonAlign : 'center'		
		,closeAction : 'hide'
			
		,setLocatarioID: function(locatarioID)
		{
			this.locatarioID = locatarioID;
		}
		,constructor: function()
		{
			this.addEvents({
				 salvar	: true
				,excluir: true
			});

			//super
			cadlocatario.superclass.constructor.apply(this, arguments);
		}
		
		,initComponent: function()
		{
			Ext.QuickTips.init();
			
			// funcao de busca de cep
			function getEndereco() {
				
				// Se o campo CEP n�o estiver vazio
				var cep = Ext.getCmp('frmLocatario').getForm().findField('locatario_cep').getValue();

				if($.trim(cep) != ""){
					/* 
						Para conectar no servi�o e executar o json, precisamos usar a fun��o
						getScript do jQuery, o getScript e o dataType:"jsonp" conseguem fazer o cross-domain, os outros
						dataTypes n�o possibilitam esta intera��o entre dom�nios diferentes
						Estou chamando a url do servi�o passando o par�metro "formato=javascript" e o CEP digitado no formul�rio
						http://cep.republicavirtual.com.br/web_cep.php?formato=javascript&cep="+$("#cep").val()
					*/
					$.getScript("http://cep.republicavirtual.com.br/web_cep.php?formato=javascript&cep="+$.trim(cep), function(){
						// o getScript d� um eval no script, ent�o � s� ler!
						//Se o resultado for igual a 1
				  		if(resultadoCEP["resultado"]==1){
							// troca o valor dos elementos
				  			var endereco = unescape(resultadoCEP["tipo_logradouro"])+": "+unescape(resultadoCEP["logradouro"]);
				  			var bairro = unescape(resultadoCEP["bairro"]);
				  			var cidade = unescape(resultadoCEP["cidade"]);
				  			var estado_sigla = unescape(resultadoCEP["uf"]);
				  			
				  			// descri��o do estado
				  			switch(estado_sigla.toUpperCase()){
				  			case 'AL':
				  				var estado_desc = 'ALAGOAS'
				  				break
				  			case 'AM':
				  				var estado_desc = 'AMAZONAS'
				  				break
				  			case 'AP':
				  				var estado_desc = 'AMAPA'
				  				break
				  			case 'BA':
				  				var estado_desc = 'BAHIA'
				  				break
				  			case 'CE':
				  				var estado_desc = 'CEARA'
				  				break
				  			case 'DF':
				  				var estado_desc = 'DISTRITO FEDERAL'
				  				break
				  			case 'ES':
				  				var estado_desc = 'ESPIRITO SANTO'
				  				break
				  			case 'GO':
				  				var estado_desc = 'GOIAS'
				  				break
				  			case 'MA':
				  				var estado_desc = 'MARANHAO'
				  				break
				  			case 'MG':
				  				var estado_desc = 'MINAS GERAIS'
				  				break
				  			case 'MS':
				  				var estado_desc = 'MATO GROSSO DO SUL'
				  				break
				  			case 'MT':
				  				var estado_desc = 'MATO GROSSO'
				  				break
				  			case 'PA':
				  				var estado_desc = 'PARA'
				  				break
				  			case 'PB':
				  				var estado_desc = 'PARAIBA'
				  				break
				  			case 'PE':
				  				var estado_desc = 'PERNANBUCO'
				  				break
				  			case 'PI':
				  				var estado_desc = 'PIAUI'
				  				break
				  			case 'PR':
				  				var estado_desc = 'PARANA'
				  				break
				  			case 'RJ':
				  				var estado_desc = 'RIO DE JANEIRO'
				  				break
				  			case 'RN':
				  				var estado_desc = 'RIO GRANDE DO NORTE'
				  				break				  				
				  			case 'RO':
				  				var estado_desc = 'RONDONIA'
				  				break
				  			case 'RR':
				  				var estado_desc = 'RORAIMA'
				  				break
				  			case 'RS':
				  				var estado_desc = 'RIO GRANDE DO SUL'
				  				break
				  			case 'SC':
				  				var estado_desc = 'SANTA CATARINA'
				  				break
				  			case 'SE':
				  				var estado_desc = 'SERGIPE'
				  				break
				  			case 'SP':
				  				var estado_desc = 'SAO PAULO'
				  				break
				  			case 'TO':
				  				var estado_desc = 'TOCANTINS'
				  				break
				  			}
				  			
				  			Ext.getCmp('frmLocatario').getForm().findField('locatario_endereco').setValue(endereco.toUpperCase());
				  			Ext.getCmp('frmLocatario').getForm().findField('locatario_bairro').setValue(bairro.toUpperCase());
				  			Ext.getCmp('frmLocatario').getForm().findField('locatario_cidade').setValue(cidade.toUpperCase());
				  			Ext.getCmp('frmLocatario').getForm().findField('estado_sigla').setValue(estado_sigla.toUpperCase());
				  			Ext.getCmp('frmLocatario').getForm().findField('estado_sigla').setRawValue(estado_desc.toUpperCase());
						}else{
				  			Ext.getCmp('frmLocatario').getForm().findField('locatario_endereco').setValue('');
				  			Ext.getCmp('frmLocatario').getForm().findField('locatario_bairro').setValue('');
				  			Ext.getCmp('frmLocatario').getForm().findField('locatario_cidade').setValue('');
				  			Ext.getCmp('frmLocatario').getForm().findField('estado_sigla').setValue('');
							Ext.MessageBox.alert('Aten��o','Endere�o n�o encontrado');
						}
					});				
				}				
			}			

			//combo dos estados
			this.comboEstado = new Ext.form.ComboBox({
				 fieldLabel		: 'Estado'		
				,xtype			: 'combo'
				,hiddenName		: 'estado_sigla'	
				,triggerAction	: 'all'
				,valueField		: 'estado_sigla'
				,displayField	: 'estado_desc'
				,emptyText		: 'Selecione um estado'
				,allowBlank		: false
				,readOnly       : false
				,editable       : false
			    ,width	        : '20%'	
			    ,anchor         : '40%'				
				,store			: new Ext.data.JsonStore({
					 url		: 'estado/todo'
					,baseParams	: {
						 action	: 'todo'
						,limit	: 30
					}
					,fields:[
						 {name: 'estado_sigla', type:'string'}
						,{name: 'estado_desc' , type:'string'}
					]
				})
			})
			
			//combo dos paises
			this.comboPais = new Ext.form.ComboBox({
				 fieldLabel		: 'Pais'		
				,xtype			: 'combo'
				,hiddenName		: 'pais_sigla'	
				,triggerAction	: 'all'
				,valueField		: 'pais_sigla'
				,displayField	: 'pais_desc'
				,emptyText		: 'Selecione um país'
				,allowBlank		: false
				,readOnly       : false
				,editable       : false
			    ,width	        : '20%'	
			    ,anchor         : '40%'	
				,store			: new Ext.data.JsonStore({
					 url		: 'pais/todo'
					,baseParams	: {
						 action	: 'todo'
						,limit	: 30
					}
					,fields:[
						 {name: 'pais_sigla', type:'string'}
						,{name: 'pais_desc' , type:'string'}
					]
				})
			})
			this.comboPais.setValue('BRASIL');
			this.comboPais.setRawValue('BRA');
			
			//combo do estado civil
			this.comboEstcivil = new Ext.form.ComboBox({
				 fieldLabel		: 'Estado civil'		
				,xtype			: 'combo'
				,hiddenName		: 'estcivil_id'	
				,triggerAction	: 'all'
				,valueField		: 'estcivil_id'
				,displayField	: 'estcivil_desc'
				,emptyText		: 'Selecione um estado civil'
				,allowBlank		: true
				,readOnly       : false
				,editable       : false
				,typeAhead      : true
			    ,width	        : '20%'	
			    ,anchor         : '40%'
				,store			: new Ext.data.JsonStore({
					 url		: 'estcivil/todo'
					,baseParams	: {
						 action	: 'todo'
						,limit	: 30
					}
					,fields:[
						 {name: 'estcivil_id'   , type:'int'}
						,{name: 'estcivil_desc' , type:'string'}
					]
				})
			})
			
			//combo do atividade
			this.comboCbo = new Ext.form.ComboBox({
				 fieldLabel		: 'Atividade'		
				,xtype			: 'combo'
				,hiddenName		: 'cbo_id'	
				,triggerAction	: 'all'
				,valueField		: 'cbo_id'
				,displayField	: 'cbo_desc'
				,emptyText		: 'Selecione uma ocupação'
				,allowBlank		: true
				,readOnly       : false
				,editable       : false
			    ,width	        : '90%'	
			    ,anchor         : '90%'
				,store			: new Ext.data.JsonStore({
					 url		: 'cbo/todo'
					,baseParams	: {
						 action	: 'todo'
						,limit	: 30
					}
					,fields:[
						 {name: 'cbo_id'   , type:'int'}
						,{name: 'cbo_desc' , type:'string'}
					]
				})			
			})			
			
			//combo de grau de instru��o
			this.comboGrauinstr = new Ext.form.ComboBox({
				 fieldLabel		: 'Grau de instrução'
				,xtype			: 'combo'
				,hiddenName		: 'grauinstr_id'	
				,triggerAction	: 'all'
				,valueField		: 'grauinstr_id'
				,displayField	: 'grauinstr_desc'
				,emptyText		: 'Selecione um grau de instrução'
				,allowBlank		: true
				,forceSelection : true
				,autocomplete   : true
				,selecOnFocus   : true
			    ,width	        : '20%'	
			    ,anchor         : '40%'
				,store			: new Ext.data.JsonStore({
					 url		: 'grauinstr/todo'
					,baseParams	: {
						 action	: 'todo'
						,limit	: 30
					}
					,fields:[
						 {name: 'grauinstr_id'   , type:'int'}
						,{name: 'grauinstr_desc' , type:'string'}
					]
				})
	        })
			
			//combo de religi�o
			this.comboReligiao = new Ext.form.ComboBox({
				 fieldLabel		: 'Religião'
				,xtype			: 'combo'
				,hiddenName		: 'religiao_id'	
				,triggerAction	: 'all'
				,valueField		: 'religiao_id'
				,displayField	: 'religiao_desc'
				,emptyText		: 'Selecione uma religião'
				,allowBlank		: true
				,readOnly       : false
				,editable       : false
			    ,width	        : '20%'	
			    ,anchor         : '40%'
				,store			: new Ext.data.JsonStore({
					 url		: 'religiao/todo'
					,baseParams	: {
						 action	: 'todo'
						,limit	: 30
					}
					,fields:[
						 {name: 'religiao_id'   , type:'int'}
						,{name: 'religiao_desc' , type:'string'}
					]
				})
			})
			
			//store do autocomplete do locatario
			this.storeLocatario = new Ext.data.JsonStore({
				 url			: 'locatario/autocomplete'
				,root			: 'rows'
				,idProperty		: 'locatario_id'					
				,autoLoad		: true
				,autoDestroy	: true
				,remoteSort     : true
				,baseParams		: {
					 action	: 'locatario/autocomplete'
					,limit	: 30
				}				
				,fields:[
					 {name:'locatario_id'	,type:'int'}
					,{name:'locatario_desc' ,type:'string'}
				]
			});
			
			//store dos adicionais
			this.storeLocatarioadc = new Ext.data.JsonStore({
				 url			: 'locatarioadc/listar'
				,root			: 'rows'					
				,idProperty		: 'locatario_adc_id'
				,totalProperty	: 'totalCount'
				,autoLoad		: false
				,autoDestroy	: true
				,remoteSort     : true
				,baseParams		: {
					 action : 'locatarioadc/listar'
					,id     : this.locatarioID
					,limit	: 30
				}				
				,fields:[
				     {name:'loctario_id_adc'             ,type:'int'}     
					,{name:'locatario_adc_id'            ,type:'int'}
					,{name:'locatario_adc_desc'          ,type:'string'}
					,{name:'locatario_id'                ,type:'int'}
					,{name:'locatario_adc_data_cadastro' ,type:'date',dateFormat: 'Y-m-d'}
				]
			});	
			
			// grid dos adicionais
			this.gridLocatarioadc = new Ext.grid.GridPanel({
			 	 title		: 'Locatarios adicionais'
				,style	 	: 'margin-top: 5px;'
				,height		: 300
				,store		: this.storeLocatarioadc
				,columns	: [{					
				    header		: '&nbsp;'
				   ,align		: 'center'
				   ,width		: 60
				   ,fixed		: true
				   ,renderer	: function()
				   {
						return '<img src="'+Ext.BLANK_IMAGE_URL+'" width="16" height="16" class="silk-delete" style="cursor:pointer;" />'
				   }					
				},{
				    header	   : 'Identificador'
				   ,dataIndex  : 'locatario_adc_id'
				   ,align	   : 'center'
				   ,width	   : 80
				   ,sortable   : true
				},{
					dataIndex  : 'locatario_adc_desc'
				   ,header	   : 'Nome'
				   ,width      : 350
				   ,sortable   : true	
				},{					
					dataIndex  : 'locatario_adc_data_cadastro'
				   ,header	   : 'Data'
				   ,width      : 100
				   ,sortable   : true					
				   ,renderer   : Ext.util.Format.dateRenderer('d/m/Y')
				}]
			})

			
			//formul�rio	
			this.formPanel = new Ext.form.FormPanel({
				 bodyStyle	: 'padding:5px;'
				,border		: false
				,id         : 'frmLocatario'
				,autoScroll	: true
				,defaultType: 'textfield'
				,defaults	: {
					anchor: '-5' 	//anchor � um config. option. excelente para formul�rio. Ele define larguras relativas
									//nesse caso a largura total -19px, que reservei para scroll
				}
				,items:[{
					 xtype      : 'fieldset'
					,title      : 'Geral'
					,autoHeight : true
					,labelWidth	: 80
					,items      : [{
						xtype      : 'textfield'
					   ,fieldLabel : 'Identificador'
					   ,name	   : 'locatario_id'
					   ,disabled   : true
				   	   ,allowBlank : true
					   ,maxLength  : 10						
					},{
						xtype      : 'textfield'
					   ,fieldLabel : 'Nome'
					   ,name	   : 'locatario_desc'
				   	   ,allowBlank : false
				   	   ,width	   : '90%'
					   ,maxLength  : 60					
				    },{				    	
					    xtype      : 'masktextfield'
					   ,fieldLabel : 'CEP'
					   ,name	   : 'locatario_cep'
					   ,mask       : '99999-999'
					   ,money      : false										
					   ,allowBlank : false
					   ,width	   : '20%'		
					   ,anchor     : '40%'	
					   ,maxLength  : 9
					   ,listeners:{
						   blur: function(){
							   var flag = getEndereco(this.getValue());
							   return flag; 
						   }
					   }					   
				    },{
				    	xtype      : 'textfield'
					   ,fieldLabel : 'Endereço'
					   ,name	   : 'locatario_endereco'
					   ,allowBlank : false
					   ,width	   : '90%'					 
					   ,maxLength  :  60					
				    },{
				    	xtype      : 'textfield'
					   ,fieldLabel : 'Numero'
					   ,name	   : 'locatario_numero'
					   ,allowBlank : false
					   ,width	   : '20%'		
					   ,anchor     : '40%'	
					   ,maxLength  : 10
					   ,style      : '{text-align:right;}'						
				    },{
				    	xtype      : 'textfield'
					   ,fieldLabel : 'Complemento'
					   ,name	   : 'locatario_complem'
					   ,allowBlank : true
					   ,width	   : '90%'					 
					   ,maxLength  : 60					
				    },{
					    xtype      : 'textfield'
					   ,fieldLabel : 'Bairro'
					   ,name	   : 'locatario_bairro'
				   	   ,allowBlank : false
					   ,width	   : '60%'					 
				  	   ,maxLength  : 40
				    },{
					    xtype      : 'textfield'
					   ,fieldLabel : 'Cidade'
					   ,name	   : 'locatario_cidade'
					   ,allowBlank : false
					   ,width	   : '60%'					 
					   ,maxLength  : 40					
				    },this.comboEstado,this.comboPais,{
					    xtype      : 'masktextfield'
					   ,fieldLabel : 'CPF'
					   ,name	   : 'locatario_cpfcnpj'
					   ,mask       : '999.999.999-99'
					   ,money      : false				
					   ,allowBlank : false
					   ,width	   : '20%'
					   ,anchor     : '40%'						
					   ,maxLength  : 20					
				    },{
					    xtype      : 'textfield'
					   ,fieldLabel : 'RG'
					   ,name	   : 'locatario_rgie'
					   ,allowBlank : true
					   ,width	   : '20%'
					   ,anchor     : '40%'						
					   ,maxLength  : 20					
				    },{
				        xtype         : 'combo'							
	 				   ,hiddenName    : 'locatario_sexo'
	 				   ,fieldLabel	  : 'Sexo'	
					   ,allowBlank    : true
					   ,readOnly      : false
					   ,editable      : false
					   ,store         : new Ext.data.ArrayStore({
						   fields : ['id','field']
					      ,data   : [['0', 'MASCULINO'],['1', 'FEMININO']] 
					   })
					   ,valueField    : 'id'
					   ,displayField  : 'field'
					   ,typeAhead     : true	
					   ,mode          : 'local'	
					   ,width	      : '20%'	
					   ,anchor        : '40%'						   
					   ,triggerAction : 'all'				
				    },{
					    xtype      : 'masktextfield'
					   ,fieldLabel : 'Telefone'
					   ,name	   : 'locatario_telefone'
					   ,mask       : '(99) 9999-9999'
					   ,money      : false			
					   ,allowBlank : false
					   ,width	   : '20%'	
					   ,anchor     : '40%'	
					   ,maxLength  : 20	
				    },{
					    xtype      : 'masktextfield'
					   ,fieldLabel : 'Celular'
					   ,name	   : 'locatario_celular'
					   ,mask       : '(99) 9999-9999'
					   ,money      : false					
					   ,allowBlank : true
					   ,width	   : '20%'
					   ,anchor     : '40%'						
  				       ,maxLength  : 20					
				    },{
					    xtype      : 'datefield'
				       ,fieldLabel : 'Nascimento'
				       ,name	   : 'locatario_data_nascimento'
				       ,allowBlank : true
  			           ,width      : '20%'
  			           ,anchor     : '40%'
  	        	       ,maxLength  : 10
  				       ,format     : 'd/m/Y'
  				       ,altFormats : 'd/m/Y|j/n/Y|j/n/y|j/m/y|d/n/y|j/m/Y|d/m/Y|d-m-y|d-m-Y|d/m|d-m|dm|dmy|dmY|d|d-m-Y'	   
				    },{
					    xtype      : 'textfield'
					   ,fieldLabel : 'Naturalidade'
					   ,name	   : 'locatario_naturalidade'
					   ,allowBlank : true
					   ,width	   : '90%'					 
					   ,maxLength  : 60					
				    }]
				},{
					 xtype      : 'fieldset'
					,title      : 'Pai'
					,autoHeight : true
					,labelWidth	: 80
					,items      : [{						
						xtype      : 'textfield'
					   ,fieldLabel : 'Nome'
			           ,name	   : 'locatario_pai'                    		
			           ,width	   : '90%'
			           ,allowBlank : true
			           ,maxLength  : 60							
					},{
						xtype      : 'masktextfield'
                       ,fieldLabel : 'Telefone'
                       ,name	   : 'locatario_pai_telefone'
       				   ,mask       : '(99) 9999-9999'
       				   ,money      : false                   	   
                       ,width	   : '50%'
                       ,allowBlank : true
                       ,maxLength  : 20	
				    }]					
				},{
					 xtype      : 'fieldset'
					,title      : 'Mãe'
					,autoHeight : true
					,labelWidth	: 80
					,items      : [{
						 xtype      : 'textfield' 
                    	,fieldLabel	: 'Nome'
                        ,name		: 'locatario_mae'                    		
                        ,width		: '90%'
                        ,allowBlank	: true
                        ,maxLength	: 60	
					},{
						 xtype      : 'masktextfield'
                        ,fieldLabel	: 'Telefone'
                        ,name		: 'locatario_mae_telefone'
       				    ,mask       : '(99) 9999-9999'
      				    ,money      : false                        	
                        ,width		: '50%'
                        ,allowBlank	: true
                        ,maxLength	: 20					
					}]			
				},{
					 xtype      : 'fieldset'
					,title      : 'Conjuge'
					,autoHeight : true
					,labelWidth	: 80
					,items      : [{
						xtype       : 'textfield'	
		               ,fieldLabel	: 'Nome'
		               ,name		: 'locatario_conjuge'                    		
		               ,width		: '90%'
		               ,allowBlank	: true
		               ,maxLength	: 60	
					},{
						 xtype      : 'masktextfield'
                        ,fieldLabel	: 'Telefone'
                        ,name		: 'locatario_conjuge_telefone'
      				    ,mask       : '(99) 9999-9999'
       				    ,money      : false                       	
                        ,width		: '50%'
                        ,allowBlank	: true
                        ,maxLength	: 20
					}]
				},{
					xtype      : 'fieldset'
				   ,title      : 'Outros'
				   ,autoHeight : true
				   ,labelWidth : 80
				   ,items      : [{
					   xtype      : 'textfield'
					  ,fieldLabel : 'E-Mail'
					  ,name		  : 'locatario_email'
					  ,allowBlank : true
					  ,width	  : '90%'
					  ,vtype      : 'email'	
				   }
				   ,this.comboEstcivil
				   ,this.comboCbo				
				   ,this.comboGrauinstr
				   ,this.comboReligiao
			   	   ,{
					   xtype      : 'datefield'
				      ,fieldLabel : 'Cadastro'
				      ,name	      : 'locatario_data_cadastro'
				      ,allowBlank : false
  			          ,width      : '20%'
  			          ,anchor     : '40%'
  	        	      ,maxLength  : 10
  	        	      ,value      : new Date()
				      ,disabled   : true
  				      ,format     : 'd/m/Y'
  				      ,altFormats : 'd/m/Y|j/n/Y|j/n/y|j/m/y|d/n/y|j/m/Y|d/m/Y|d-m-y|d-m-Y|d/m|d-m|dm|dmy|dmY|d|d-m-Y'	   
				   },{
					   xtype      : 'textarea'
				      ,fieldLabel : 'Observações'
				      ,name	      : 'locatario_obs'
				      ,allowBlank : true
				      ,width	  : '90%'
        		      ,multiline  : true	
				   }]
				}]
				,bbar	: [{					
					 text   : 'Novo'
					,iconCls: 'silk-add'
					,scope  : this
					,handler: function(){
						this.formPanel.getForm().reset();
						this.formPanel.items.item(1).focus();		
					}					
				},{
					 text	: 'Salvar'
					,iconCls: 'icon-save'
					,scope	: this
					,handler: this._onBtnSalvarClick
				},
				this.btnExcluir = new Ext.Button({
					 text	  : 'Excluir'
					,iconCls  : 'silk-delete'
					,scope	  : this
					,disabled : true
					,handler  : this._onBtnDeleteClick
				})]			
			})
			
			// formul�rio de adicionais	
			this.formAdicional = new Ext.form.FormPanel({
				 bodyStyle	: 'padding:10px;'
				,border		: false
				,id         : 'frmAdicional'
				,autoScroll	: true				
				,defaultType: 'textfield'
				,defaults	: {
					anchor: '-5' 	//anchor � um config. option. excelente para formul�rio. Ele define larguras relativas
									//nesse caso a largura total -19px, que reservei para scroll
				}
				,items:[{
					 xtype      : 'fieldset'
					,title      : 'Locatario'
					,autoHeight : true
					,labelWidth	: 80
					,items      : [{
						xtype        : 'combo'
					   ,store        : this.storeLocatario
					   ,name         : 'locatario_adc_desc'
					   ,fieldLabel   : 'Locatario'
					   ,displayField : 'locatario_desc'
					   ,valueField	 : 'locatario_id'	
					   ,loadingText  : 'Carregando...'				 
					   ,queryParam   : 'value'
					   ,allowBlank   : false
					   ,width        : 350
					   ,listeners    : {
						   select: {
							   fn: function(combo,value){
								   Ext.getCmp('frmAdicional').getForm().findField('locatario_adc_id').setValue(combo.getValue());								   
					  	  	   }
					  	    }        		   
					    }					
				    },{
						xtype      : 'hidden'
			    	   ,fieldLabel : 'Locatario'
 					   ,name	   : 'locatario_adc_id'
					   ,allowBlank : false
					   ,maxLength  : 30
					   ,labelWidth : 5
				       ,width      : 5
					},{
					 	xtype	   : 'button'
					   ,text  	   : 'Adicionar'
					   ,iconCls    : 'silk-add'
					   ,style	   : 'margin-left:85px;'
					   ,id         : 'btnAdicionarLocatario' 							   
					   ,scope	   : this
					   ,handler    : this._onBtnAdicionarLocatarioadcClick
					   ,labelWidth : 70
				       ,width      : 100
					}]},{
						 xtype      : 'fieldset'
						,title      : 'Adicionais'
						,autoHeight : true
						,labelWidth	: 80
						,items      : [this.gridLocatarioadc]
					}
				]
			})			
			
			// monta as abas
			this.tabPanel = new Ext.TabPanel({
				activeTab      : 0               
               ,border         : false
               ,plain          : true
               ,deferredRender : true
               ,scope          : this
               ,defaults       : {autoScroll: true}
			   ,items:[{
				   title : 'Locatario'					   
				  ,items : [this.formPanel]  
			   },{
				   title : 'Adicionais'
				  ,items : [this.formAdicional]						   
			   }]			           			                          
            })
			
			Ext.apply(this,{
				 items	: this.tabPanel
				,bbar	: ['->',{		
					 text	: 'Sair'
					,iconCls: 'silk-cross'
					,scope	: this
					,handler: function(){
						this.hide();
					}
				}]
			})
			
			//super
			cadlocatario.superclass.initComponent.call(this);
		}
		,initEvents: function(){
			cadlocatario.superclass.initEvents.call(this);
			
			//grid de locatarios adicionais
			this.gridLocatarioadc.on({
				 scope		: this
				,cellclick	: this._onGridLocatarioadcCellClick
			})			
		}
		,show: function()
		{			
			cadlocatario.superclass.show.apply(this,arguments);
			if(this.locatarioID !== 0) {				
				this.btnExcluir.show();			
				this.el.mask('Carregando informa��es..');				
				this.formPanel.getForm().load({
					 url     : 'locatario/buscar'
					,params  : {						
						 action       : 'buscar'
						,locatario_id : this.locatarioID						
					}
				    ,scope   : this
				    ,success : this._onFormLoad
				});
				
				this.storeLocatarioadc.reload({					
					params: {
						locatario_id : this.locatarioID
					}
				});				
			}else{
				Ext.getCmp('btnAdicionarLocatario').setDisabled(true);
				this.btnExcluir.hide();
				this.formPanel.getForm().reset();				
			}			
		}
		,onDestroy: function()
		{
			cadlocatario.superclass.onDestroy.apply(this,arguments);			
			this.formPanel = null;
		}	
		,_onFormLoad: function(form, request)
		{
			var data = request.result.data;
			
			if(data.cbo_id){
				this.comboCbo.setValue(data.cbo_id);
				this.comboCbo.setRawValue(data.cbo_desc);
			}
			if(data.estcivil_id){
				this.comboEstcivil.setValue(data.estcivil_id);
				this.comboEstcivil.setRawValue(data.estcivil_desc);
			}
			if(data.grauinstr_id){
				this.comboGrauinstr.setValue(data.grauinstr_id);
				this.comboGrauinstr.setRawValue(data.grauinstr_desc);
			}		
			if(data.religiao_id){
				this.comboReligiao.setValue(data.religiao_id);
				this.comboReligiao.setRawValue(data.religiao_desc);
			}			
			this.comboEstado.setValue(data.estado_sigla);
			this.comboEstado.setRawValue(data.estado_desc);
					
			this.comboPais.setValue(data.pais_sigla);
			this.comboPais.setRawValue(data.pais_desc);
			
			if(data.locatario_id){
				Ext.getCmp('frmLocatario').getForm().findField('locatario_data_cadastro').setDisabled(true);
			}		
			this.el.unmask();			
		}		
		,_onBtnSalvarClick: function()
		{
			//pego o formul�rio
			var form = this.formPanel.getForm();
			
			//verifico se � valido
			if(!form.isValid())	
			{
				Ext.Msg.alert('Aten��o','Preencha corretamente todos os campos!');
				return false;
			}
			
			//crio uma m�scara
			this.el.mask('Salvando informa��es');
			
			/*
			 * Submitando formul�rio
			 */
			form.submit({
				 url	: 'locatario/salvar'
				,params	: {
					 action	      : 'salvar'
					,locatario_id : this.locatarioID
				}
				,scope:this
				,success: function() //ao terminar de submitar
				{
					//tir� m�scara
					this.el.unmask();
					
					//esconde janela
					//this.hide();
					
					/*
					 * Muito importante! Aqui o evento salvar � disparado. Todos os listeners que foram associados
					 * a esse evento ser�o notificados, como por exemplo, o listener _onCadastroUsuarioSalvar da
					 * classe UsuarioLista.
					 */
					this.fireEvent('salvar',this);
					Ext.Msg.alert('Aten��o','Registro gravado com sucesso!');
				}
				,failure: function(f,a)
				{
					Ext.Msg.alert('Aten��o','Erro na grava��o,contate o suporte t�cnico!');					
				}				
			});
		}		
		,_onBtnDeleteClick: function()
		{
			Ext.Msg.confirm('Confirma��o','Deseja mesmo excluir esse registro?',function(opt) {
				if(opt === 'no') {
					return					
				}
				this.el.mask('Excluir informa��o.');
				
				Ext.Ajax.request({
					 url	: 'locatario/excluir'
					,params	: {
						 action	      : 'excluir'
					    ,locatario_id : this.locatarioID
					}
				   ,scope	: this
				   ,success: function()
				   {
					   this.el.unmask();
					   this.hide();
					   this.fireEvent('excluir',this);
					}
				})					
			},this)
		}
		,_onBtnAdicionarLocatarioadcClick: function()
		{
			//pego o formul�rio
			var form = this.formAdicional.getForm();
			
			//verifico se � valido
			if(!form.isValid())	
			{
				Ext.Msg.alert('Aten��o','Preencha corretamente todos os campos!');
				return false;
			}
			
			/*
			 * Submitando formul�rio
			*/
			form.submit({				
	    		waitMsgTarget : false	
	   	       ,waitTitle     : 'Por favor aguarde'
	 		   ,waitMsg       : 'Salvando informa��es'
	 		   ,reset         : false
			   ,url	          : 'locatarioadc/salvar'
			   ,params	      : {
				   action	    : 'salvar'
				  ,locatario_id : this.locatarioID
			   }
			   ,scope         : this
			   ,success       : function(f,a) {				   
				   //tir� m�scara
				   this.el.unmask();
					
				   //esconde janela
				   //this.hide();
					
				   /*
					* Muito importante! Aqui o evento salvar � disparado. Todos os listeners que foram associados
					* a esse evento ser�o notificados, como por exemplo, o listener _onCadastroUsuarioSalvar da
					* classe UsuarioLista.
				   */
				   this.fireEvent('salvar',this);
				   this.gridLocatarioadc.store.reload();
				   Ext.getCmp('frmAdicional').getForm().findField('locatario_adc_desc').reset();
			   }
	           ,failure: function(f,a) {	        	   
	        	   Ext.MessageBox.alert('Aten��o',a.result.msg.text);
	           }
			});		
		}
		,_onGridLocatarioadcCellClick: function(grid, row, col, e)
		{
			//busca registro da linha selecionada
			var record = grid.getStore().getAt(row);

			if(col !== 0)
				return;

			if(this.locatarioID==0){
				Ext.Msg.alert('Aten��o','Opera��o n�o permitida,somente consulta!');
				return false;				
			}
			
			if(this.locatarioID==record.get('locatario_adc_id')){
				Ext.Msg.alert('Aten��o','Opera��o n�o permitida,locatario titular!');
				return false;		
			}
			
			Ext.Msg.confirm('Confirma��o','Deseja mesmo excluir esse registro?',function(opt) {				
				if(opt === 'no') {
					return					
				}
				this.el.mask('Excluir informa��o.');
				
				Ext.Ajax.request({
					url	: 'locatarioadc/excluir'
				   ,params	: {
						 action           : 'excluir'
					    ,locatario_id     : record.get('locatario_id')
					    ,locatario_adc_id : record.get('locatario_adc_id')					    
				   }
				   ,scope	: this
				   ,success: function(f,a)
				   {					   
					   //remove do store
					   record.store.remove(record);
					   
					   this.el.unmask();
					   this.fireEvent('excluir',this);
				   }
		           ,failure: function(f,a)
		           {
		        	   this.el.unmask();
		        	   Ext.MessageBox.alert('Aten��o',a.result.msg.text);
		           }
				})					
			},this)				
		}		
});