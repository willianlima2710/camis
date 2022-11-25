var cadcaixa = Ext.extend(Ext.Window,{	
		 caixaID    : 0
		,modal		 : true
		,constrain	 : true
		,maximizable : false
		,resizable   : false
		,width		 : 600
		,height		 : 400
		,title		 : 'Lancamentos de caixa'
		,layout		 : 'fit'
		,buttonAlign : 'center'		
		,closeAction : 'hide'
			
		,setcaixaID: function(caixaID)
		{
			this.caixaID = caixaID;
		}
		,constructor: function()
		{
			this.addEvents({
				 salvar	: true
				,excluir: true
			});

			//super
			cadcaixa.superclass.constructor.apply(this, arguments);
		}
		
		,initComponent: function()
		{
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
			
			//formul�rio	
			this.formPanel = new Ext.form.FormPanel({
				 bodyStyle	: 'padding:10px;'
				,border		: false
				,id         : 'frmCaixa'
				,defaultType: 'textfield'
				,defaults	: {
					anchor: '-5' 	//anchor � um config. option. excelente para formul�rio. Ele define larguras relativas
									//nesse caso a largura total -19px, que reservei para scroll
				}
				,items:[{
					xtype      : 'fieldset'
				   ,autoHeight : true
				   ,labelWidth : 80
				   ,items      : [{
					   xtype       : 'textfield'
					  ,fieldLabel  : 'Identificador'
					  ,name	       : 'caixa_id'
					  ,disabled    : true
				   	  ,allowBlank  : true
					  ,maxLength   : 10  
				   }
				   ,this.comboBanco
				   ,this.comboConta,{
					   xtype       : 'textfield'
					  ,fieldLabel  : 'Documento'
					  ,name		   : 'caixa_documento'
					  ,allowBlank  : true
					  ,width       : '30%'
					  ,anchor      : '30%'
				   },{
				       xtype        : 'combo'							
	 				  ,hiddenName   : 'caixa_intipo'
	 				  ,fieldLabel   : 'Tipo'	
					  ,allowBlank   : true
					  ,readOnly     : false
					  ,editable     : false
					  ,store        : new Ext.data.ArrayStore({
						  fields : ['id','field']
					     ,data   : [['1', 'DEBITO'],['0', 'CREDITO']] 
					  })
					  ,valueField    : 'id'
					  ,displayField  : 'field'
					  ,typeAhead     : true	
					  ,mode          : 'local'	
					  ,width	     : '45%'	
					  ,anchor        : '45%'						   
					  ,triggerAction : 'all'			   
				   },{					   
					   xtype        : 'masktextfield'
					  ,fieldLabel   : 'Valor'
				      ,name	        : 'caixa_valor'
				      ,allowBlank   : false					
				      ,mask         : '9.999.990,00'
				      ,money        : true	
				      ,width	    : '45%'
				      ,anchor       : '45%'
				   },{
					   xtype        : 'datefield'
					  ,fieldLabel   : 'Data'
					  ,name	       : 'caixa_data_movto'
					  ,allowBlank   : false
					  ,width        : '45%'
					  ,anchor       : '45%'
			          ,maxLength    : 10
					  ,format       : 'd/m/Y'  	
					  ,altFormats   : 'd/m/Y|j/n/Y|j/n/y|j/m/y|d/n/y|j/m/Y|d/m/Y|d-m-y|d-m-Y|d/m|d-m|dm|dmy|dmY|d|d-m-Y'
				   },{
			    	   xtype       : 'textfield'
					  ,fieldLabel  : 'Historico'
					  ,name		   : 'caixa_historico'
					  ,allowBlank  : true
					  ,width       : '99%'
					  ,anchor      : '99%'						  
				   },{
					   xtype      : 'textarea'
				      ,fieldLabel : 'Observa��o'
				      ,name	      : 'caixa_obs'
				      ,allowBlank : true
				      ,width	  : '97%'
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
			cadcaixa.superclass.initComponent.call(this);
		}
		,show: function()
		{
			cadcaixa.superclass.show.apply(this,arguments);
			if(this.caixaID !== 0) {				
				this.el.mask('Carregando informa��es..');				
				this.formPanel.getForm().load({					
					url     : 'caixa/buscar'
				   ,params  : {
					   action   : 'buscar'
					  ,caixa_id : this.caixaID						
				   }
				   ,scope   : this
				   ,success : this._onFormLoad
				});				
			}else{
				this.btnExcluir.hide();
				this.formPanel.getForm().reset();				
			}		
			this.formPanel.getForm().reset();				
		}
		,onDestroy: function()
		{
			cadcaixa.superclass.onDestroy.apply(this,arguments);			
			Ext.getCmp('caixa_id')=null;this.formPanel = null;
		}	
		,_onFormLoad: function(form, request)
		{
			var data = request.result.data;
			
			if(data.banco_id){
				this.comboBanco.setValue(data.banco_id);
				this.comboBanco.setRawValue(data.banco_desc);				
			}			
			
			if(data.conta_id){
				this.comboConta.setValue(data.conta_id);
				this.comboConta.setRawValue(data.conta_desc);				
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
				 url	: 'caixa/salvar'
				,params	: {
					action   : 'salvar'
				   ,caixa_id : Ext.getCmp('frmCaixa').getForm().findField('caixa_id').getValue()		
				}
				,scope:this
				,success: function(f,a) //ao terminar de submitar
				{
					this.el.unmask();					
					Ext.getCmp('frmCaixa').getForm().findField('caixa_id').setValue(a.result.id);
				}			
			});
		}		
});