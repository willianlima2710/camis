var altrecpar = Ext.extend(Ext.Window,{	
		 recparID    : 0
		,modal		 : true
		,constrain	 : true
		,maximizable : false
		,resizable   : false
		,width		 : 600
		,height		 : 480
		,title		 : 'Alteração de titulos'
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
			altrecpar.superclass.constructor.apply(this, arguments);
		}
		
		,initComponent: function()
		{		

			Ext.QuickTips.init();
			
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
				,allowBlank		: false
				,readOnly       : false
				,editable       : false
			    ,width          : '100%'
			    ,anchor         : '100%'
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
			})
			
			this.comboBanco = new Ext.form.ComboBox({
				 fieldLabel		: 'Banco'
				,xtype			: 'combo'
				,hiddenName		: 'banco_id'	
				,triggerAction	: 'all'
				,valueField		: 'banco_id'
				,displayField	: 'banco_desc'
				,emptyText		: 'Selecione um banco'
				,readOnly       : false
				,editable       : false
			    ,width          : '100%'
			    ,anchor         : '100%'				
				,store			: new Ext.data.JsonStore({
					 url		: 'banco/todo'
					,baseParams	: {
						 action	: 'todo'
						,limit	: 30
					}
					,fields:[
						 {name: 'banco_id'   , type:'int'}
						,{name: 'banco_desc' , type:'string'}
					]
				})
			});
			
			//combo das contas do caixa
			this.comboConta = new Ext.form.ComboBox({
				 fieldLabel		: 'Conta'
				,xtype			: 'combo'
				,hiddenName		: 'conta_id'	
				,triggerAction	: 'all'
				,valueField		: 'conta_id'
				,displayField	: 'conta_desc'
				,emptyText		: 'Selecione uma conta'
				,allowBlank		: false
				,readOnly       : false
				,editable       : false
			    ,width          : '100%'
			    ,anchor         : '100%'				
				,store			: new Ext.data.JsonStore({
					 url		: 'conta/todo'
					,baseParams	: {
						 action	: 'todo'
						,limit	: 30
					}
					,fields:[
						 {name: 'conta_id'   , type:'int'}
						,{name: 'conta_desc' , type:'string'}
					]
				})
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
			    ,disabled       : true	  
				,store			: new Ext.data.JsonStore({
					 url		: 'operacao/todo'
					,baseParams	: {
						 action	: 'todo'
						,limit	: 30
					}
					,fields:[
						 {name: 'operacao_id'   , type:'int'}
						,{name: 'operacao_desc' , type:'string'}
					]
				})			
			});
			
			//formulário	
			this.formPanel = new Ext.form.FormPanel({
				 bodyStyle	: 'padding:10px;'
				,border		: false
				,id         : 'frmRecpar'
				,defaultType: 'textfield'
				,defaults	: {
					anchor: '-5' 	//anchor é um config. option. excelente para formulário. Ele define larguras relativas
									//nesse caso a largura total -19px, que reservei para scroll
				}
				,items:[{
					xtype      : 'fieldset'
             	   ,title      : 'Dados do titulo'
				   ,autoHeight : true
				   ,labelWidth : 80
				   ,items      : [{
					   xtype      : 'textfield'
			    	  ,fieldLabel : 'Id'
					  ,name       : 'recpar_id' 	  
					  ,allowBlank : false					  	
          			  ,disabled   : true	  
					  ,maxLength  : 60				   
				   },{
					   xtype      : 'textfield'
			    	  ,fieldLabel : 'Documento'
					  ,name		  : 'ctarec_documento'
					  ,allowBlank : false					  	
		        	  ,width      : '40%'
		        	  ,anchor     : '40%'
          			  ,disabled   : true	  
					  ,maxLength  : 60		   
				   },{
					   xtype      : 'textfield'
				      ,fieldLabel : 'Jazigo'
					  ,name		  : 'jazigo_codigo'
					  ,allowBlank : false
			          ,width      : '40%'
			          ,anchor     : '40%'
			          ,disabled   : true	  
					  ,maxLength  : 60  
				   },{
					   xtype      : 'textfield'
					  ,fieldLabel : 'Locatario'
					  ,name		  : 'locatario_desc'
					  ,allowBlank : false
					  ,width      : '100%'
					  ,anchor     : '100%'
					  ,disabled   : true	  
					  ,maxLength  : 60  
				   }				   
				   ,this.comboOperacao
				   ,this.comboFormarec
				   ,this.comboBanco
				   ,this.comboConta,{					   
					   xtype      : 'masktextfield'
					  ,fieldLabel : 'Valor a pagar'
				      ,name	      : 'recpar_valor'
				      ,allowBlank : true					
				      ,mask       : '9.999.990,00'
				      ,money      : true	
				      ,width	  : '40%'
				      ,anchor     : '40%'	  
				  },{
					  xtype      : 'datefield'
				     ,fieldLabel : 'Vencimento'
			         ,name	     : 'recpar_data_vencto'
				     ,allowBlank : false
			         ,width      : '40%'
			         ,anchor     : '40%'
	        	     ,maxLength  : 10
				     ,format     : 'd/m/Y'  	
				     ,altFormats : 'd/m/Y|j/n/Y|j/n/y|j/m/y|d/n/y|j/m/Y|d/m/Y|d-m-y|d-m-Y|d/m|d-m|dm|dmy|dmY|d|d-m-Y'
				  },{
					  xtype      : 'datefield'
				     ,fieldLabel : 'Pagamento'
			         ,name	     : 'recpar_data_pagto'
				     ,allowBlank : false
			         ,width      : '40%'
			         ,anchor     : '40%'
	        	     ,maxLength  : 10
				     ,format     : 'd/m/Y'  	
				     ,altFormats : 'd/m/Y|j/n/Y|j/n/y|j/m/y|d/n/y|j/m/Y|d/m/Y|d-m-y|d-m-Y|d/m|d-m|dm|dmy|dmY|d|d-m-Y'			  
				  },{
					  xtype      : 'textfield'
  				     ,fieldLabel : 'Parcela'
				     ,name		 : 'recpar_parcela'
					 ,allowBlank : false
					 ,width      : '40%'
					 ,anchor     : '40%'
					 ,maxLength  : 60			    	 
 		             ,disabled   : true	  
				  },{
				  	  xtype      : 'textfield'
					 ,fieldLabel : 'Historico'
					 ,name		 : 'recpar_historico'
					 ,allowBlank : true
					 ,width      : '100%'
					 ,anchor     : '100%'
					 ,maxLength  : 100 				  	
				  },{
		   			  xtype      : 'textarea'
					 ,fieldLabel : 'Observações'
					 ,name	     : 'recpar_obs'
					 ,allowBlank : true
					 ,width	     : '97%'
	        		 ,multiline  : true
				  }]
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
			altrecpar.superclass.initComponent.call(this);
		}
		,show: function()
		{
			altrecpar.superclass.show.apply(this,arguments);
			if(this.recparID !== 0) {				
				this.el.mask('Carregando informações..');				
				this.formPanel.getForm().load({
					 url     : 'recpar/buscar'
					,params  : {						
						 action    : 'buscar'
						,recpar_id : this.recparID						
					}
				    ,scope   : this
				    ,success : this._onFormLoad
				});				
			}else{
				this.formPanel.getForm().reset();				
			}			
		}
		,onDestroy: function()
		{
			altrecpar.superclass.onDestroy.apply(this,arguments);			
			Ext.getCmp('recpar_id')=null;this.formPanel = null;
		}	
		,_onFormLoad: function(form, request)
		{
			var data = request.result.data;

			if(data.operacao_id){
				this.comboOperacao.setValue(data.operacao_id);
				this.comboOperacao.setRawValue(data.operacao_desc);
			}
			
			if(data.banco_id){
				this.comboBanco.setValue(data.banco_id);
				this.comboBanco.setRawValue(data.banco_desc);				
			}			
			
			if(data.conta_id){
				this.comboConta.setValue(data.conta_id);
				this.comboConta.setRawValue(data.conta_desc);				
			}
			
			if(data.formarec_id) {
				this.comboFormarec.setValue(data.formarec_id);
				this.comboFormarec.setRawValue(data.formarec_desc);
			}
			
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
				 url	: 'recpar/salvar'
				,params	: {
					 action	          : 'salvar'
					,recpar_id        : this.recparID
					,locatario_desc	  : Ext.getCmp('frmRecpar').getForm().findField('locatario_desc').getValue()
					,jazigo_codigo    : Ext.getCmp('frmRecpar').getForm().findField('jazigo_codigo').getValue()				
					,ctarec_documento : Ext.getCmp('frmRecpar').getForm().findField('ctarec_documento').getValue()
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