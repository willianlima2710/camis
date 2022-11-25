var movtaxa = Ext.extend(Ext.Window,{	
		 recparID    : 0
		,modal		 : true
		,constrain	 : true
		,maximizable : false
		,resizable   : false
		,width		 : 500
		,height		 : 270
		,title		 : 'Incluir taxas'
		,layout		 : 'fit'
		,buttonAlign : 'center'		
		,closeAction : 'hide'
			
		,setRecparID: function(recparID)
		{
			this.recparID = recparID;
		}
		,constructor: function()
		{
			this.addEvents({
				 salvar	: true
				,excluir: true
			});

			//super
			movtaxa.superclass.constructor.apply(this, arguments);
		}
		
		,initComponent: function()
		{
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
			
			//store do jazigo
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
				}				
				,fields:[
					 {name:'jazigo_codigo' ,type:'string'}
					,{name:'jazigo_desc'   ,type:'string'}
				]
			});
			
			//combo de operações cemiteriais
			this.comboOperacao = new Ext.form.ComboBox({
				 fieldLabel		: 'Operação'
				,xtype			: 'combo'
         	    ,idProperty	    : 'operacao_id'		
				,hiddenName		: 'operacao_id'	
				,triggerAction	: 'all'
				,valueField		: 'operacao_id'
				,displayField	: 'operacao_desc'
				,emptyText		: 'Selecione uma operação'
				,allowBlank		: false
				,readOnly       : false
				,editable       : false
			    ,width          : 350
				,store			: new Ext.data.JsonStore({
					 url		: 'operacao/todo'
					,baseParams	: {
						 action	: 'todo'
						,limit	: 30
					}
					,fields:[
						 {name: 'operacao_id'        ,type:'int'}
						,{name: 'operacao_desc'      ,type:'string'}
						,{name: 'operacao_infaturar' ,type:'int'}						
					]
				})
			});
			
			//combo de forma de recebimento
			this.comboFormarec = new Ext.form.ComboBox({
				 fieldLabel		: 'Recebimento'
				,xtype			: 'combo'
         	    ,idProperty	    : 'formarec_id'		
				,hiddenName		: 'formarec_id'	
				,triggerAction	: 'all'
				,valueField		: 'formarec_id'
				,displayField	: 'formarec_desc'
				,emptyText		: 'Selecione uma forma de recebimento'
				,allowBlank		: true
				,readOnly       : false
				,editable       : false
			    ,width          : 350
				,store			: new Ext.data.JsonStore({
					 url		: 'formarec/todo'
					,baseParams	: {
						 action	: 'todo'
						,limit	: 30
					}
					,fields:[
						 {name: 'formarec_id'       , type:'int'}
						,{name: 'formarec_desc'     , type:'string'}
						,{name: 'formarec_inavista' , type:'string'}
					]
				})
			});
			
			//formulário	
			this.formPanel = new Ext.form.FormPanel({
				 bodyStyle	: 'padding:10px;'
				,border		: false
				,id         : 'frmTaxa'
				,defaultType: 'textfield'
				,defaults	: {
					anchor: '-5' 	//anchor é um config. option. excelente para formulário. Ele define larguras relativas
									//nesse caso a largura total -19px, que reservei para scroll
				}
				,items:[{					
					xtype        : 'combo'
				   ,store        : this.storeLocatario
				   ,name         : 'locatario_desc'
			 	   ,fieldLabel   : 'Locatario'
				   ,displayField : 'locatario_desc'
				   ,valueField	 : 'locatario_id'	
				   ,loadingText  : 'Carregando...'				 
				   ,queryParam   : 'value'
				   ,allowBlank   : false	   
				   ,width        : '100%'
			  	   ,anchor       : '100%'
			  	   ,autocomplete : 'on'	   
			  	   ,listeners    : {
			  		   select: {
			  			   fn: function(combo,value){				  				   
			  				  Ext.getCmp('frmTaxa').getForm().findField('locatario_id').setValue(combo.getValue());				  				 
			  	  	       }
			  	  	   }        		   
			       }
				},{
					xtype        : 'combo'
				   ,store        : this.storeJazigo
				   ,name         : 'jazigo_codigo'
				   ,fieldLabel   : 'Jazigo'
				   ,displayField : 'jazigo_desc'
				   ,valueField	 : 'jazigo_codigo'	
				   ,loadingText  : 'Carregando...'				 
				   ,queryParam   : 'value'
				   ,width        : '50%'
				   ,anchor       : '50%'
				   ,allowBlank   : false	   
				   ,autocomplete : 'on'
				},{
					xtype      : 'hidden'
		    	   ,fieldLabel : 'Locatario'
				   ,name	   : 'locatario_id'
				   ,allowBlank : false
  			       ,width      : '50%'
		           ,anchor     : '50%'  			        		  
				   ,maxLength  : 30
				}
				,this.comboOperacao
				,this.comboFormarec,{
					xtype      : 'masktextfield'
				   ,fieldLabel : 'Valor a pagar'
			       ,name	   : 'recpar_valor'
			       ,allowBlank : false					
			       ,mask       : '9.999.990,00'
			       ,money      : true	
			       ,width	   : '45%'
			       ,anchor     : '45%'
				},{ 	   
			    	xtype      : 'masktextfield'
				   ,fieldLabel : 'Ano'
				   ,name       : 'recpar_ano'
	 			   ,mask       : '9999'
				   ,money      : false	  
				   ,allowBlank : false
	  			   ,width      : '45%'
			       ,anchor     : '45%'  			        		  
				   ,maxLength  : 9			    	   
				},{
					xtype      : 'datefield'
				   ,fieldLabel : 'Vencimento'
			       ,name	   : 'recpar_data_vencto'
				   ,allowBlank : false
			       ,width      : '45%'
			       ,anchor     : '45%'
	        	   ,maxLength  : 10
				   ,format     : 'd/m/Y'  	
				   ,altFormats : 'd/m/Y|j/n/Y|j/n/y|j/m/y|d/n/y|j/m/Y|d/m/Y|d-m-y|d-m-Y|d/m|d-m|dm|dmy|dmY|d|d-m-Y'
				}]
			})
			
			Ext.apply(this,{
				 items	: this.formPanel
				,bbar	: ['->',{
					text	: 'Salvar'
				   ,iconCls: 'icon-save'
				   ,id     : 'btnSalvar'	
				   ,scope	: this					
				   ,handler: this._onBtnSalvarClick
				},{xtype:'tbseparator'},{					
					text	: 'Sair'
				   ,iconCls: 'silk-cross'
				   ,scope	: this
				   ,handler: function(){
					   this.hide();
				   }
				}]
			})
			
			//super
			movtaxa.superclass.initComponent.call(this);
		}
		,show: function()
		{
			movtaxa.superclass.show.apply(this,arguments);
			this.formPanel.getForm().reset();				
		}
		,onDestroy: function()
		{
			movtaxa.superclass.onDestroy.apply(this,arguments);			
			Ext.getCmp('recpar_id')=null;this.formPanel = null;
		}	
		,_onFormLoad: function(form, request)
		{
			var data = request.result.data;			
			this.el.unmask();			
		}		
		,_onBtnSalvarClick: function()
		{
			//pego o formulário
			var form = this.formPanel.getForm();
			
			//verifico se é valido
			if(!form.isValid())	
			{
				Ext.Msg.alert('Atenção','Preencha corretamente todos os campos!');
				return false;
			}
			
			//crio uma máscara
			this.el.mask('Salvando informações');
			
			/*
			 * Submitando formulário
			 */
			form.submit({
				 url	: 'recpar/taxa'
				,params	: {
					action : 'taxa'
				}
				,scope:this
				,success: function() //ao terminar de submitar
				{
					//tirá máscara
					this.el.unmask();
					
					//esconde janela
					//this.hide();
					
					/*
					 * Muito importante! Aqui o evento salvar é disparado. Todos os listeners que foram associados
					 * a esse evento serão notificados, como por exemplo, o listener _onCadastroUsuarioSalvar da
					 * classe UsuarioLista.
					 */
					Ext.getCmp('btnSalvar').setDisabled(true);
					this.fireEvent('salvar',this);
				}
			});
		}		
});