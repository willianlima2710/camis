var cadprodserv = Ext.extend(Ext.Window,{	
		 prodservID  : 0
		,modal		 : true
		,constrain	 : true
		,maximizable : false
		,resizable   : false
		,width		 : 450
		,height		 : 280
		,title		 : 'Cadastro de produtos e serviços'
		,layout		 : 'fit'
		,buttonAlign : 'center'		
		,closeAction : 'hide'
			
		,setProdservID: function(prodservID)
		{
			this.prodservID = prodservID;
		}
		,constructor: function()
		{
			this.addEvents({
				 salvar	: true
				,excluir: true
			});

			//super
			cadprodserv.superclass.constructor.apply(this, arguments);
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
			
			this.comboConta = new Ext.form.ComboBox({
				 fieldLabel		: 'Conta'
				,xtype			: 'combo'
				,hiddenName		: 'conta_id'	
				,triggerAction	: 'all'
				,valueField		: 'conta_id'
				,displayField	: 'conta_desc'
				,emptyText		: 'Selecione uma conta'
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
			
			//formul�rio	
			this.formPanel = new Ext.form.FormPanel({
				 bodyStyle	: 'padding:10px;'
				,border		: false
				,autoScroll	: true
				,defaultType: 'textfield'
				,defaults	: {
					anchor: '2' 	//anchor � um config. option. excelente para formul�rio. Ele define larguras relativas
									//nesse caso a largura total -19px, que reservei para scroll
				}
				,items      : [{
					xtype          : 'textfield'
				   ,fieldLabel     : 'Identificador'
				   ,name	       : 'prodserv_id'
				   ,disabled       : true
			   	   ,allowBlank     : true
				   ,maxLength      : 10						
				},{
					 xtype         : 'textfield'
					,fieldLabel	   : 'Descrição'
					,name		   : 'prodserv_desc'
					,allowBlank	   : false					
					,maxLength	   : 100					
				},{
					 xtype         : 'masktextfield'
					,fieldLabel    : 'Valor'
					,name	       : 'prodserv_valor'
					,mask          : '9.999.990,00'
					,money         : true						
					,allowBlank    : true
				    ,width		   : '20%'
					,anchor        : '50%'
				},{
					xtype          : 'masktextfield'
				   ,fieldLabel     : 'Saldo'
				   ,name	       : 'prodserv_saldo'
				   ,mask           : '9.999.990,00'
				   ,money          : true						
				   ,allowBlank     : true
				   ,width		   : '20%'
				   ,anchor         : '50%'					
				},{
				     xtype         : 'combo'							
	 				,hiddenName    : 'prodserv_inclassificacao'
	 				,fieldLabel    : 'Classificação'	
					,allowBlank    : false
					,readOnly      : false
					,editable      : false
					,store         : new Ext.data.ArrayStore({
						fields : ['id','field']
					   ,data   : [['0', 'SERVIÇO'],['1', 'PRODUTO']] 
					})
					,valueField    : 'id'
					,displayField  : 'field'
					,typeAhead     : true	
					,mode          : 'local'					
					,triggerAction : 'all'
				    ,width		   : '20%'
					,anchor        : '50%'						
				}
				,this.comboBanco
				,this.comboConta				
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
					 text	: 'Excluir'
					,iconCls: 'silk-delete'
					,scope	: this
					,handler: this._onBtnDeleteClick
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
			cadprodserv.superclass.initComponent.call(this);
		}
		,show: function()
		{
			cadprodserv.superclass.show.apply(this,arguments);
			if(this.prodservID !== 0) {				
				this.btnExcluir.show();			
				this.el.mask('Carregando informações..');				
				this.formPanel.getForm().load({
					 url     : 'prodserv/buscar'
					,params  : {						
						 action      : 'buscar'
						,prodserv_id : this.prodservID						
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
			cadprodserv.superclass.onDestroy.apply(this,arguments);			
			this.formPanel = null;
		}	
		,_onFormLoad: function(form, request)
		{
			var data = request.result.data;
			
			if(data.conta_id) {				
				this.comboConta.setValue(data.conta_id);
				this.comboConta.setRawValue(data.conta_desc);
			}
			if(data.banco_id) {
				this.comboBanco.setValue(data.banco_id);
				this.comboBanco.setRawValue(data.banco_desc);
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
				 url	: 'prodserv/salvar'
				,params	: {
					 action	     : 'salvar'
					,prodserv_id : this.prodservID
				}
				,scope:this
				,success: function() //ao terminar de submitar
				{
					this.el.unmask();					
					Ext.getCmp('formPanel').getForm().findField('prodserv_id').setValue(a.result.id);
					this.prodservID = a.result.id;
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
				this.el.mask('Excluindo');
				
				Ext.Ajax.request({
					 url	: 'prodserv/excluir'
					,params	: {
						 action	     : 'excluir'
					    ,prodserv_id : this.prodservID
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