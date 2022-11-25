var cadobito = Ext.extend(Ext.Window,{	
		 obitoID     : 0
		,modal		 : true
		,constrain	 : true
		,maximizable : false
		,resizable   : false
		,width		 : 700
		,height		 : 550
		,title		 : 'Cadastro de obito'
		,layout		 : 'fit'
		,buttonAlign : 'center'		
		,closeAction : 'hide'
			
		,setObitoID: function(obitoID)
		{
			this.obitoID = obitoID;
		}
		,constructor: function()
		{
			this.addEvents({
				 salvar	: true
				,excluir: true
			});

			//super
			cadobito.superclass.constructor.apply(this, arguments);
		}
		
		,initComponent: function()
		{			
			//combo de ocupa��o do falecido
			this.comboCbo_falecido = new Ext.form.ComboBox({
				 fieldLabel		: 'Ocupação'
				,xtype			: 'combo'
				,hiddenName		: 'cbo_id_falecido'	
				,triggerAction	: 'all'
				,valueField		: 'cbo_id'
				,displayField	: 'cbo_desc'
				,emptyText		: 'Selecione uma ocupação'
				,allowBlank		: true
				,readOnly       : false
				,editable       : false
			    ,width          : '100%'
			    ,anchor         : '100%'				
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
			
			//combo de ocupa��o do declarante
			this.comboCbo_declarante = new Ext.form.ComboBox({
				 fieldLabel		: 'Ocupação'
				,xtype			: 'combo'
				,hiddenName		: 'cbo_id_declarante'	
				,triggerAction	: 'all'
				,valueField		: 'cbo_id'
				,displayField	: 'cbo_desc'
				,emptyText		: 'Selecione uma ocupação'
				,allowBlank		: true
				,readOnly       : false
				,editable       : false
			    ,width          : '100%'
			    ,anchor         : '100%'	
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

			//combo do estado civil do declarante
			this.comboEstcivil_declarante = new Ext.form.ComboBox({
				 fieldLabel		: 'Estado civil'		
				,xtype			: 'combo'
				,hiddenName		: 'estcivil_id_declarante'	
				,triggerAction	: 'all'
				,valueField		: 'estcivil_id'
				,displayField	: 'estcivil_desc'
				,emptyText		: 'Selecione um estado civil'
				,allowBlank		: true
				,readOnly       : false
				,editable       : false
				,typeAhead      : true	
			    ,width          : '100%'
			    ,anchor         : '100%'
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
			
			//combo dos estados do declarante
			this.comboEstado_declarante = new Ext.form.ComboBox({
				 fieldLabel		: 'Estado'		
				,xtype			: 'combo'
				,hiddenName		: 'estado_sigla_declarante'	
				,triggerAction	: 'all'
				,valueField		: 'estado_sigla'
				,displayField	: 'estado_desc'
				,emptyText		: 'Selecione um estado'
				,allowBlank		: true
				,readOnly       : false
				,editable       : false
				,typeAhead      : true				
			    ,width          : '100%'
			    ,anchor         : '100%'				
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
			
			//combo dos estados do declarante
			this.comboCorcurtis = new Ext.form.ComboBox({
				 fieldLabel		: 'Cor da curtis'		
				,xtype			: 'combo'
				,hiddenName		: 'corcurtis_id'	
				,triggerAction	: 'all'
				,valueField		: 'corcurtis_id'
				,displayField	: 'corcurtis_desc'
				,emptyText		: 'Selecione uma cor da curtis'
				,allowBlank		: true
				,readOnly       : false
				,editable       : false
			    ,width          : '100%'
			    ,anchor         : '100%'				
				,store			: new Ext.data.JsonStore({
					 url		: 'corcurtis/todo'
					,baseParams	: {
						 action	: 'todo'
						,limit	: 30
					}
					,fields:[
						 {name: 'corcurtis_id'   , type:'int'}
						,{name: 'corcurtis_desc' , type:'string'}
					]
				})
			})		

			//combo dos locais da morte
			this.comboLocal = new Ext.form.ComboBox({
				 fieldLabel		: 'Local'		
				,xtype			: 'combo'
				,hiddenName		: 'local_id'	
				,triggerAction	: 'all'
				,valueField		: 'local_id'
				,displayField	: 'local_desc'
				,emptyText		: 'Selecione um local'
				,allowBlank		: true
				,readOnly       : false
				,editable       : false
			    ,width          : '100%'
			    ,anchor         : '100%'				
				,store			: new Ext.data.JsonStore({
					 url		: 'local/todo'
					,baseParams	: {
						 action	: 'todo'
						,limit	: 30
					}
					,fields:[
						 {name: 'local_id'   , type:'int'}
						,{name: 'local_desc' , type:'string'}
					]
				})
			})
			
			//combo dos cartorios
			this.comboCartorio = new Ext.form.ComboBox({
				 fieldLabel		: 'Cartorio'		
				,xtype			: 'combo'
				,hiddenName		: 'cartorio_id'	
				,triggerAction	: 'all'
				,valueField		: 'cartorio_id'
				,displayField	: 'cartorio_desc'
				,emptyText		: 'Selecione um cartorio'
				,allowBlank		: true
				,readOnly       : false
				,editable       : false
			    ,width          : '100%'
			    ,anchor         : '100%'				
				,store			: new Ext.data.JsonStore({
					 url		: 'cartorio/todo'
					,baseParams	: {
						 action	: 'todo'
						,limit	: 30
					}
					,fields:[
						 {name: 'cartorio_id'   , type:'int'}
						,{name: 'cartorio_desc' , type:'string'}
					]
				})
			})
			
			//combo das funerarias
			this.comboFuneraria = new Ext.form.ComboBox({
				 fieldLabel		: 'Funeraria'		
				,xtype			: 'combo'
				,hiddenName		: 'funeraria_id'	
				,triggerAction	: 'all'
				,valueField		: 'funeraria_id'
				,displayField	: 'funeraria_desc'
				,emptyText		: 'Selecione uma funeraria'
				,allowBlank		: true
				,readOnly       : false
				,editable       : false
			    ,width          : '100%'
			    ,anchor         : '100%'				
				,store			: new Ext.data.JsonStore({
					 url		: 'funeraria/todo'
					,baseParams	: {
						 action	: 'todo'
						,limit	: 30
					}
					,fields:[
						 {name: 'funeraria_id'   ,type:'int'}
						,{name: 'funeraria_desc' ,type:'string'}
					]
				})
			})	
			
			//combo de causas da morte
			this.comboMorte = new Ext.form.ComboBox({
				 fieldLabel		: 'Causa'		
				,xtype			: 'combo'
				,hiddenName		: 'morte_id'	
				,triggerAction	: 'all'
				,valueField		: 'morte_id'
				,displayField	: 'morte_desc'
				,emptyText		: 'Selecione uma causa da morte'
				,allowBlank		: true
				,readOnly       : false
				,editable       : false
				,typeAhead      : true	
			    ,width          : '100%'
			    ,anchor         : '100%'
				,store			: new Ext.data.JsonStore({
					 url		: 'morte/todo'
					,baseParams	: {
						 action	: 'todo'
						,limit	: 30
					}
					,fields:[
						 {name: 'morte_id'  , type:'int'}
						,{name: 'morte_desc', type:'string'}
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
			
			//store do grid
			this.storeJazigo = new Ext.data.JsonStore({
				 url			: 'jazigo/autocomplete'
				,root			: 'rows'
				,idProperty		: 'jazigo_codigo'					
				,autoLoad		: true
				,autoDestroy	: true
				,remoteSort     : true
				,baseParams		: {
					 action	    : 'jazigo/autocomplete'
					,limit	    : 30
					,disponivel : true
				}				
				,fields:[
					 {name:'jazigo_codigo' ,type:'string'}
					,{name:'jazigo_desc'   ,type:'string'}
				]
			});			
			

			//formul�rio	
			this.formPanel = new Ext.form.FormPanel({
				 bodyStyle	: 'padding:5px;'
				,border		: false
			    ,id         : 'frmObito'
				,autoScroll	: true
				,defaultType: 'textfield'
				,defaults	: {
					anchor: '-6' 	//anchor � um config. option. excelente para formul�rio. Ele define larguras relativas
									//nesse caso a largura total -19px, que reservei para scroll
				}
				,items:[{					
					 xtype      : 'fieldset'
					,title      : 'Geral'
					,autoHeight : true
					,labelWidth	: 80
					,items      : [{
						xtype      : 'textfield'
			    	   ,fieldLabel : 'Numero'
 					   ,name	   : 'obito_nrobito'
					   ,allowBlank : false
	  			       ,width      : '50%'
			           ,anchor     : '50%'  			        		  
					   ,maxLength  : 30					
					},{
						xtype        : 'combo'
					   ,store        : this.storeLocatario
					   ,name         : 'locatario_desc'
				 	   ,fieldLabel   : 'Locatario'
					   ,displayField : 'locatario_desc'
					   ,valueField	 : 'locatario_id'	
					   ,loadingText  : 'Carregando...'				 
					   ,queryParam   : 'value'
					   ,width        : '100%'
				  	   ,anchor       : '100%'
				  	   ,autocomplete : 'on'	   
				  	   ,listeners    : {
				  		   select: {
				  			   fn: function(combo,value){				  				   
				  				  Ext.getCmp('frmObito').getForm().findField('locatario_id').setValue(combo.getValue());				  				 
				  	  	       }
				  	  	   }        		   
				       }
					},{
                        xtype: 'combo',
                        store: this.storeJazigo,
                        name: 'jazigo_codigo',
                        fieldLabel: 'Jazigo',
                        displayField: 'jazigo_desc',
                        valueField: 'jazigo_codigo',
                        loadingText: 'Carregando...',
                        queryParam: 'value',
                        width: '50%',
                        anchor: '50%',
                        autocomplete: 'on'
                    },{
                        xtype      : 'textfield'
                       ,fieldLabel : 'Nº Lacre'
                       ,name	   : 'obito_lacre'
                       ,allowBlank : false
                       ,width      : '50%'
                       ,anchor     : '50%'
                       ,maxLength  : 30
                    },{
						xtype      : 'hidden'
			    	   ,fieldLabel : 'Locatario'
 					   ,name	   : 'locatario_id'
					   ,allowBlank : false
	  			       ,width      : '50%'
			           ,anchor     : '50%'  			        		  
					   ,maxLength  : 30					
					}]},{
				    	xtype      : 'fieldset'
				       ,title      : 'Falecido'
				       ,autoHeight : true
				       ,labelWidth : 80
				       ,items      : [{
				    	   xtype      : 'textfield'
				    	  ,fieldLabel : 'Nome'
						  ,name		  : 'obito_falecido'
						  ,allowBlank : false
  			        	  ,width      : '100%'
		        		  ,anchor     : '100%'  			        		  
						  ,maxLength  : 60
				       },{
				    	   xtype      : 'textfield'
				    	  ,fieldLabel : 'Apelido'
						  ,name		  : 'obito_apelido'
  			        	  ,width      : '100%'
		        		  ,anchor     : '100%'  			        		  
						  ,maxLength  : 60				    	   	  
				       },{
				    	   xtype      : 'combo'							
				 		  ,hiddenName : 'obito_insexo'
					 	  ,fieldLabel : 'Sexo'	
						  ,allowBlank : true
						  ,readOnly   : false
						  ,editable   : false
						  ,store      : new Ext.data.ArrayStore({							  
							  fields   : ['id','field']
							 ,data     : [['0', 'MASCULINO'],['1', 'FEMININO']] 
						  })
						  ,valueField     : 'id'
					  	  ,displayField   : 'field'
						  ,typeAhead      : true	
						  ,mode           : 'local'					
						  ,triggerAction  : 'all'       
				       },{
				    	   xtype      : 'textfield'
				    	  ,fieldLabel : 'Endereço'
						  ,name		  : 'obito_endereco'
						  ,allowBlank : true
  			        	  ,width      : '90%'
		        		  ,anchor     : '90%'  			        		  
						  ,maxLength  : 60				    	   
				       },{
				    	   xtype      : 'textfield'
				    	  ,fieldLabel : 'Complemento'
						  ,name		  : 'obito_complem'
						  ,allowBlank : true
  			        	  ,width      : '90%'
		        		  ,anchor     : '90%'  			        		  
						  ,maxLength  : 60				    	   
				       },{
				    	   xtype      : 'textfield'
				    	  ,fieldLabel : 'Bairro'
						  ,name		  : 'obito_bairro'
						  ,allowBlank : true
  			        	  ,width      : '70%'
		        		  ,anchor     : '70%'  			        		  
						  ,maxLength  : 40		    	   
				       },{
				    	   xtype      : 'textfield'
				    	  ,fieldLabel : 'Cidade'
						  ,name		  : 'obito_cidade'
						  ,allowBlank : true
  			        	  ,width      : '70%'
		        		  ,anchor     : '70%'  			        		  
						  ,maxLength  : 40	    	   
				       },{
				    	   xtype      : 'masktextfield'
				    	  ,fieldLabel : 'CEP'
						  ,name		  : 'obito_cep'
 						  ,mask       : '99999-999'
						  ,money      : false	  
						  ,allowBlank : true
  			        	  ,width      : '40%'
		        		  ,anchor     : '40%'  			        		  
						  ,maxLength  : 9						  
				       },{
				    	   xtype      : 'textfield'
				    	  ,fieldLabel : 'Naturalidade'
				    	  ,name		  : 'obito_naturalidade'
						  ,allowBlank : true
  			        	  ,width      : '100%'
  			        	  ,anchor     : '100%'  			        		  
						  ,maxLength  : 60    	   
				       },{
				    	   xtype      : 'textfield'
				    	  ,fieldLabel : 'Nacionalidade'
				    	  ,name		  : 'obito_nacionalidade'
						  ,allowBlank : true
  			        	  ,width      : '100%'
  			        	  ,anchor     : '100%'  			        		  
						  ,maxLength  : 60				    	   
				       },{
				    	   xtype      : 'datefield'
				    	  ,fieldLabel : 'Nascimento'
				    	  ,name		  : 'obito_data_nascimento'
						  ,allowBlank : false
  			        	  ,width      : '30%'
  			        	  ,anchor     : '30%'
  	        		      ,maxLength  : 10
  						  ,format     : 'd/m/Y'  	
  						  ,altFormats : 'd/m/Y|j/n/Y|j/n/y|j/m/y|d/n/y|j/m/Y|d/m/Y|d-m-y|d-m-Y|d/m|d-m|dm|dmy|dmY|d|d-m-Y'	  
				       },{
				    	   xtype      : 'masktextfield'
				    	  ,fieldLabel : 'CPF'
						  ,name		  : 'obito_cpf'
						  ,mask       : '999.999.999-99'
						  ,money      : false  
						  ,allowBlank : true
		  			      ,width      : '40%'
				          ,anchor     : '40%'  			        		  
						  ,maxLength  : 20	    	   
				       },{
				    	   xtype      : 'textfield'
				    	  ,fieldLabel : 'RG'
						  ,name		  : 'obito_rg'
						  ,allowBlank : true
  			        	  ,width      : '40%'
		        		  ,anchor     : '40%'  			        		  
						  ,maxLength  : 40    	   
				       },
				       this.comboCbo_falecido
				      ,this.comboCorcurtis]
				    },{
				    	xtype      : 'fieldset'
				       ,title      : 'Declarante'
				       ,autoHeight : true
				       ,labelWidth : 80
				       ,items      : [{
				    	   xtype      : 'textfield'
						  ,fieldLabel : 'Declarante'
						  ,name		  : 'obito_declarante'
						  ,allowBlank : true
		  			      ,width      : '100%'
		  			      ,anchor     : '100%'  			        		  
						  ,maxLength  : 60				    	   
				       },{
				    	   xtype      : 'textfield'
						  ,fieldLabel : 'Naturalidade'
						  ,name		  : 'obito_naturalidade_declarante'
						  ,allowBlank : true
		  			      ,width      : '100%'
		  			      ,anchor     : '100%'  			        		  
						  ,maxLength  : 60
				       },
				       this.comboEstcivil_declarante
				      ,this.comboCbo_declarante,{
				    	   xtype      : 'textfield'
						  ,fieldLabel : 'RG'
						  ,name		  : 'obito_rg_declarante'
						  ,allowBlank : true
		  			      ,width      : '40%'
		  			      ,anchor     : '40%'  			        		  
						  ,maxLength  : 20  	   
				       },{
				    	   xtype      : 'textfield'
						  ,fieldLabel : 'Endereço'
						  ,name		  : 'obito_endereco_declarante'
						  ,allowBlank : true
		  			      ,width      : '90%'
		  			      ,anchor     : '90%'  			        		  
						  ,maxLength  : 60		    	   
				       },{
				    	   xtype      : 'textfield'
						  ,fieldLabel : 'Bairro'
						  ,name		  : 'obito_bairro_declarante'
						  ,allowBlank : true
		  			      ,width      : '70%'
		  			      ,anchor     : '70%'  			        		  
						  ,maxLength  : 40   	   
				       },{
				    	   xtype      : 'textfield'
						  ,fieldLabel : 'Cidade'
						  ,name		  : 'obito_cidade_declarante'
						  ,allowBlank : true
		  			      ,width      : '70%'
		  			      ,anchor     : '70%'  			        		  
						  ,maxLength  : 40				    	   
				       },this.comboEstado_declarante,{
						   xtype      : 'masktextfield'
						  ,fieldLabel : 'Telefone' 
						  ,name		  : 'obito_telefone_declarante'
 						  ,mask       : '(99) 9999-9999'
						  ,money      : false		  
						  ,allowBlank : true
					  	  ,width      : '70%'
					  	  ,anchor     : '70%'  			        		  
						  ,maxLength  : 20				      				    	   
				       },{
				    	   xtype      : 'masktextfield'
						  ,fieldLabel : 'Celular' 
						  ,name		  : 'obito_celular_declarante'
 						  ,mask       : '(99) 9999-9999'
						  ,money      : false				  
						  ,allowBlank : true
					  	  ,width      : '70%'
					  	  ,anchor     : '70%'  			        		  
						  ,maxLength  : 20
					   }]				    	
				    },{
				    	xtype      : 'fieldset'
				       ,title      : 'Falecimento'
				       ,autoHeight : true
				       ,labelWidth : 80
				       ,items      : [{
				    	   xtype      : 'textfield'
						  ,fieldLabel : 'Velorio'
						  ,name		  : 'obito_velorio'
						  ,allowBlank : true
				  		  ,width      : '100%'
				  		  ,anchor     : '100%'  			        		  
						  ,maxLength  : 60
				       },this.comboLocal,{
				    	   xtype      : 'datefield'
						  ,fieldLabel : 'Falecimento'
						  ,name	      : 'obito_data_falecimento'
						  ,allowBlank : false
		  			      ,width      : '20%'
		  			      ,anchor     : '40%'
		  	        	  ,maxLength  : 10
		  				  ,format     : 'd/m/Y'
		  				  ,altFormats : 'd/m/Y|j/n/Y|j/n/y|j/m/y|d/n/y|j/m/Y|d/m/Y|d-m-y|d-m-Y|d/m|d-m|dm|dmy|dmY|d|d-m-Y'
				       },{
				    	   xtype      : 'masktextfield'
						  ,fieldLabel : 'Hora'
						  ,name	      : 'obito_hora_falecimento'
						  ,mask       : '99:99'
						  ,money      : false						  
						  ,allowBlank : false
		  			      ,width      : '20%'
		  			      ,anchor     : '40%'
				       },{
				    	   xtype      : 'datefield'
						  ,fieldLabel : 'Sepultamento'
						  ,name	      : 'obito_data_sepultamento'
						  ,allowBlank : true
		  			      ,width      : '20%'
		  			      ,anchor     : '40%'
		  	        	  ,maxLength  : 10
		  				  ,format     : 'd/m/Y'
		  				  ,altFormats : 'd/m/Y|j/n/Y|j/n/y|j/m/y|d/n/y|j/m/Y|d/m/Y|d-m-y|d-m-Y|d/m|d-m|dm|dmy|dmY|d|d-m-Y'
				       },{
				    	   xtype      : 'masktextfield'
						  ,fieldLabel : 'Hora'
						  ,name	      : 'obito_hora_sepultamento'
						  ,mask       : '99:99'
						  ,money      : false						  
						  ,allowBlank : true
		  			      ,width      : '20%'
		  			      ,anchor     : '40%'
				       },{
				    	   xtype      : 'textfield'
						  ,fieldLabel : '1º Medico'
						  ,name		  : 'obito_medico_1'
						  ,allowBlank : true
						  ,width      : '100%'
						  ,anchor     : '100%'  			        		  
						  ,maxLength  : 60    	   
				       },{
				    	   xtype      : 'textfield'
						  ,fieldLabel : '1º CRM'
						  ,name		  : 'obito_medico_crm_1'
						  ,allowBlank : true
						  ,width      : '50%'
						  ,anchor     : '50%'  			        		  
						  ,maxLength  : 20
				       },{
				    	   xtype      : 'textfield'
						  ,fieldLabel : '2º Medico'
						  ,name		  : 'obito_medico_2'
						  ,allowBlank : true
						  ,width      : '100%'
						  ,anchor     : '100%'  			        		  
						  ,maxLength  : 60    	   
				       },{
				    	   xtype      : 'textfield'
						  ,fieldLabel : '2º CRM'
						  ,name		  : 'obito_medico_crm_2'
						  ,allowBlank : true
						  ,width      : '50%'
						  ,anchor     : '50%'  			        		  
						  ,maxLength  : 20				    	   
				       }
				      ,this.comboMorte
				      ,this.comboCartorio
				      ,this.comboFuneraria,{
				    	   xtype      : 'masktextfield'
						  ,fieldLabel : 'Valor total das guia(s)'
						  ,name		  : 'obito_valor'
						  ,mask       : '9.999.990,00'
						  ,money      : true						  
						  ,allowBlank : true
						  ,width      : '30%'
						  ,anchor     : '30%'  			        		  
				       }]  	
				    },{
				    	xtype      : 'fieldset'
				       ,title      : 'Complemento'
				       ,autoHeight : true
				       ,labelWidth : 80
				       ,items      : [{
				    	   xtype      : 'textfield'
						  ,fieldLabel : 'Vias'
						  ,name		  : 'obito_vias'
						  ,allowBlank : true
						  ,width      : '30%'
						  ,anchor     : '30%'			    	   
				       },{
				    	   xtype      : 'checkbox'
				    	  ,fieldLabel : 'Bens ?'
				    	  ,name       : 'obito_possui_bem'
				    	  ,autoWidth  : true
				    	  ,allowBlank : true
				    	  ,inputValue : '1'
				       },{
				    	   xtype      : 'checkbox'
				    	  ,fieldLabel : 'Testamento?'
				    	  ,name       : 'obito_possui_testamento'
				    	  ,autoWidth  : true
				    	  ,allowBlank : true
				    	  ,inputValue : '1',
				       },{			    	   
					       xtype      : 'checkbox'
					      ,fieldLabel : 'Tanato ?'
					      ,name       : 'obito_tanato'
					      ,autoWidth  : true
					      ,allowBlank : true
					      ,inputValue : '1'
				       },{
					       xtype      : 'checkbox'
					      ,fieldLabel : 'Zincado ?'
					      ,name       : 'obito_zincado'
					      ,autoWidth  : true
					      ,allowBlank : true
					      ,inputValue : '1'
				       },{
				    	   xtype      : 'textfield'
				    	  ,fieldLabel : 'GF'
						  ,name		  : 'obito_gf'
						  ,allowBlank : false
						  ,width      : '30%'
						  ,anchor     : '30%'		    	   
				       },{
				    	   xtype      : 'datefield'
						  ,fieldLabel : 'Cadastro'
						  ,name	      : 'obito_data_cadastro'
						  ,disabled   : true	  
						  ,allowBlank : true
				  		  ,width      : '20%'
				  		  ,anchor     : '40%'
				  	      ,maxLength  : 10
				  		  ,format     : 'd/m/Y'
				  		  ,altFormats : 'd/m/Y|j/n/Y|j/n/y|j/m/y|d/n/y|j/m/Y|d/m/Y|d-m-y|d-m-Y|d/m|d-m|dm|dmy|dmY|d|d-m-Y'				    	   
				       }]	
				    }		
			   ]
			})
			
			Ext.apply(this,{
				 items	: this.formPanel
				,bbar	: ['->',{					
					 text   : 'Novo'
					,iconCls: 'silk-add'
					,scope  : this
					,handler: function(){
						this.formPanel.getForm().reset();
						this.formPanel.items.item(0).focus();					
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
					,handler  : this._onBtnDeleteClick
				})
				,{xtype:'tbseparator'},{
					 text	: 'Sair'
					,iconCls: 'silk-cross'
					,scope	: this
					,handler: function(){
						this.hide();
					}
				}]
			})
			
			//super
			cadobito.superclass.initComponent.call(this);
		}
		,show: function()
		{
			cadobito.superclass.show.apply(this,arguments);
			if(this.obitoID !== 0) {				
				this.btnExcluir.show();			
				this.el.mask('Carregando informações..');
				this.formPanel.getForm().load({
					 url     : 'obito/buscar'
					,params  : {						
						 action   : 'buscar'
						,obito_id : this.obitoID						
					}
				    ,scope   : this
				    ,success : this._onFormLoad
				});				
			}else{
				this.btnExcluir.hide();
				this.formPanel.getForm().reset();				
			}			
		}
		,onDestroy: function()
		{
			cadobito.superclass.onDestroy.apply(this,arguments);			
			this.formPanel = null;			
		}	
		,_onFormLoad: function(form, request)
		{
			var data = request.result.data;
			
			if(data.cbo_id_falecido){
				this.comboCbo_falecido.setValue(data.cbo_id_falecido);
				this.comboCbo_falecido.setRawValue(data.cbo_desc_falecido);
			}
			if(data.corcurtis_id){
				this.comboCorcurtis.setValue(data.corcurtis_id);
				this.comboCorcurtis.setRawValue(data.corcurtis_desc);
			}
			if(data.local_id){
				this.comboLocal.setValue(data.local_id);
				this.comboLocal.setRawValue(data.local_desc);
			}
			if(data.estcivil_id_declarante){
				this.comboEstcivil_declarante.setValue(data.estcivil_id_declarante);
				this.comboEstcivil_declarante.setRawValue(data.estcivil_desc_declarante);
			}
			if(data.cbo_id_declarante){
				this.comboCbo_declarante.setValue(data.cbo_id_declarante);
				this.comboCbo_declarante.setRawValue(data.cbo_desc_declarante);
			}
			if(data.cartorio_id){
				this.comboCartorio.setValue(data.cartorio_id);
				this.comboCartorio.setRawValue(data.cartorio_desc);
			}			
			if(data.funeraria_id){
				this.comboFuneraria.setValue(data.funeraria_id);
				this.comboFuneraria.setRawValue(data.funeraria_desc);
			}	
			if(data.morte_id){
				this.comboMorte.setValue(data.morte_id);
				this.comboMorte.setRawValue(data.morte_desc);
			}
			this.comboEstado_declarante.setValue(data.estado_sigla);
			this.comboEstado_declarante.setRawValue(data.estado_desc);
			
			if(data.locatario_id){
				Ext.getCmp('frmObito').getForm().findField('locatario_desc').setDisabled(true);
				Ext.getCmp('frmObito').getForm().findField('obito_nrobito').setDisabled(true);
				Ext.getCmp('frmObito').getForm().findField('jazigo_codigo').focus();
			}else{
				Ext.getCmp('frmObito').getForm().findField('locatario_desc').setDisabled(false);
				Ext.getCmp('frmObito').getForm().findField('obito_nrobito').setDisabled(false);
				Ext.getCmp('frmObito').getForm().findField('obito_nrobito').focus();								
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
				Ext.Msg.alert('Atenção','Preencha corretamente todos os campos!');
				return false;
			}
			
			//crio uma m�scara
			this.el.mask('Salvando informações');
			
			/*
			 * Submitando formul�rio
			 */
			form.submit({
				 url	: 'obito/salvar'
				,params	: {
					 action	  : 'salvar'
					,obito_id : this.obitoID
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
				}
			});
		}		
		,_onBtnDeleteClick: function()
		{
			Ext.Msg.confirm('Confirmação','Deseja mesmo excluir esse registro?',function(opt) {
				if(opt === 'no') {
					return					
				}
				this.el.mask('Excluir');
				
				Ext.Ajax.request({
					 url	: 'obito/excluir'
					,params	: {
						 action	  : 'excluir'
					    ,obito_id : this.obitoID
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
});