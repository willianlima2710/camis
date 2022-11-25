var bxapagpar = Ext.extend(Ext.Window,{	
		 pagparID    : 0
		,modal		 : true
		,constrain	 : true
		,maximizable : false
		,resizable   : false
		,width		 : 600
		,height		 : 550
		,title		 : 'Baixa de titulos'
		,layout		 : 'fit'
		,buttonAlign : 'center'		
		,closeAction : 'hide'
			
		,setpagparID: function(pagparID)
		{
			this.pagparID = pagparID;
		}
		,constructor: function()
		{
			this.addEvents({
				 salvar	: true
				,excluir: true
			});

			//super
			bxapagpar.superclass.constructor.apply(this, arguments);
		}
		
		,initComponent: function()
		{			
			Ext.QuickTips.init();
				
			//combo dos locais de pagamento
			this.comboLocpagto = new Ext.form.ComboBox({
				 fieldLabel		: 'Local'
				,xtype			: 'combo'
				,hiddenName		: 'locpagto_id'	
				,triggerAction	: 'all'
				,valueField		: 'locpagto_id'
				,displayField	: 'locpagto_desc'
				,emptyText		: 'Selecione um local de pagamento'
				,allowBlank		: false
				,readOnly       : false
				,editable       : false
			    ,width          : '100%'
			    ,anchor         : '100%'				
				,store			: new Ext.data.JsonStore({
					 url		: 'locpagto/todo'
					,baseParams	: {
						 action	: 'todo'
						,limit	: 30
					}
					,fields:[
						 {name: 'locpagto_id'   , type:'int'}
						,{name: 'locpagto_desc' , type:'string'}
					]
				})
			});
			
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
				,id         : 'frmPagpar'
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
					   xtype      : 'hidden'
			    	  ,fieldLabel : 'Id'
					  ,name       : 'ctapag_id' 	  
					  ,allowBlank : false					  	
          			  ,disabled   : true	  
					  ,maxLength  : 60			   
				   },{
					   xtype      : 'textfield'
			    	  ,fieldLabel : 'Id'
					  ,name       : 'pagpar_id' 	  
					  ,allowBlank : false					  	
          			  ,disabled   : true	  
					  ,maxLength  : 60				   
				   },{
					   xtype      : 'textfield'
			    	  ,fieldLabel : 'Documento'
					  ,name		  : 'ctapag_documento'
					  ,allowBlank : false					  	
		        	  ,width      : '40%'
		        	  ,anchor     : '40%'
          			  ,disabled   : true	  
					  ,maxLength  : 60		   
				   },{
					   xtype      : 'textfield'
					  ,fieldLabel : 'Fornecedor'
					  ,name		  : 'fornecedor_desc'
					  ,allowBlank : false
					  ,width      : '100%'
					  ,anchor     : '100%'
					  ,disabled   : true	  
					  ,maxLength  : 60  
				   },this.comboOperacao,{					   
					   xtype      : 'masktextfield'
					  ,fieldLabel : 'Valor a pagar'
				      ,name	      : 'pagpar_valor'
				      ,allowBlank : true					
				      ,mask       : '9.999.990,00'
				      ,money      : true	
				      ,width	  : '40%'
				      ,anchor     : '40%'
			    	  ,disabled   : true				    	  
				  },{
					  xtype      : 'datefield'
				     ,fieldLabel : 'Vencimento'
			         ,name	     : 'pagpar_data_vencto'
				     ,allowBlank : false
			         ,width      : '40%'
			         ,anchor     : '40%'
	        	     ,maxLength  : 10
				     ,format     : 'd/m/Y'  	
				     ,altFormats : 'd/m/Y|j/n/Y|j/n/y|j/m/y|d/n/y|j/m/Y|d/m/Y|d-m-y|d-m-Y|d/m|d-m|dm|dmy|dmY|d|d-m-Y'
			    	 ,disabled   : true				    	 
				  },{
					  xtype      : 'textfield'
  				     ,fieldLabel : 'Parcela'
				     ,name		 : 'pagpar_parcela'
					 ,allowBlank : false
					 ,width      : '40%'
					 ,anchor     : '40%'
					 ,disabled   : true	  
					 ,maxLength  : 60			    	 
				  }]},{
					  xtype      : 'fieldset'
		             ,title      : 'Dados da baixa'
					 ,autoHeight : true
					 ,labelWidth : 80
					 ,items      : [{
						 xtype      : 'masktextfield'
					    ,fieldLabel : 'Valor pago'
				        ,name	    : 'pagpar_pago'
				        ,allowBlank : false		
				        ,mask       : '9.999.990,00'
				        ,money      : true	
				        ,width	    : '40%'
				        ,anchor     : '40%'                
				     },{
				    	 xtype      : 'datefield'
				        ,fieldLabel : 'Pagamento'
				        ,name	    : 'pagpar_data_pagto'
				        ,allowBlank : false
				        ,width      : '40%'
				        ,anchor     : '40%'
		                ,maxLength  : 10				   		           
				        ,format     : 'd/m/Y'	   
				        ,altFormats : 'd/m/Y|j/n/Y|j/n/y|j/m/y|d/n/y|j/m/Y|d/m/Y|d-m-y|d-m-Y|d/m|d-m|dm|dmy|dmY|d|d-m-Y'				        	
				     }
				     ,this.comboBanco
				     ,this.comboConta
				     ,this.comboLocpagto,{
				    	 xtype      : 'textfield'
					    ,fieldLabel : 'Historico'
					    ,name	    : 'pagpar_historico'
					    ,allowBlank : true
					    ,width      : '100%'
					    ,anchor     : '100%'
					    ,maxLength  : 100	    	 
				     },{
				    	 xtype      : 'textarea'
					    ,fieldLabel : 'Observações'
					    ,name	    : 'pagpar_observacao'
					    ,allowBlank : true
					    ,width	    : '97%'
	        		    ,multiline  : true
				     }
				  ]}
				]
			});
			
			Ext.apply(this,{
				 items	: this.formPanel
				,bbar	: ['->',{
					text	: 'Salvar'
				   ,iconCls: 'icon-save'
				   ,id     : 'btnSalvar'	
				   ,scope	: this					
				   ,handler: this._onBtnBaixarClick
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
			bxapagpar.superclass.initComponent.call(this);
		}
		,show: function()
		{
			bxapagpar.superclass.show.apply(this,arguments);
			if(this.pagparID !== 0) {				
				this.el.mask('Carregando informações..');				
				this.formPanel.getForm().load({
					 url     : 'pagpar/buscar'
					,params  : {						
						 action    : 'buscar'
						,pagpar_id : this.pagparID						
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
			bxapagpar.superclass.onDestroy.apply(this,arguments);			
			Ext.getCmp('pagpar_id')=null;this.formPanel = null;
		}	
		,_onFormLoad: function(form, request)
		{
			var data = request.result.data;
			
			if(data.locpagto_id){
				this.comboLocpagto.setValue(data.locpagto_id);
				this.comboLocpagto.setRawValue(data.locpagto_desc);
			}else{
				this.comboLocpagto.setValue(1);
				this.comboLocpagto.setRawValue('CEMITERIO');				
			}
			
			if(data.banco_id){
				this.comboBanco.setValue(data.banco_id);
				this.comboBanco.setRawValue(data.banco_desc);				
			}			
			
			if(data.conta_id){
				this.comboConta.setValue(data.conta_id);
				this.comboConta.setRawValue(data.conta_desc);				
			}
				
			if(data.operacao_id){
				this.comboOperacao.setValue(data.operacao_id);
				this.comboOperacao.setRawValue(data.operacao_desc);
			}	
			this.el.unmask();			
		}		
		,_onBtnBaixarClick: function()
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
				 url	: 'pagpar/baixar'
				,params	: {
					 action	   : 'baixar'
					,pagpar_id : this.pagparID
					,ctapag_id : Ext.getCmp('frmPagpar').getForm().findField('ctapag_id').getValue()
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