var cadbanco = Ext.extend(Ext.Window,{	
		 bancoID     : 0
		,modal		 : true
		,constrain	 : true
		,maximizable : false
		,resizable   : false
		,width		 : 400
		,height		 : 310
		,title		 : 'Cadastro de banco'
		,layout		 : 'fit'
		,buttonAlign : 'center'		
		,closeAction : 'hide'
			
		,setBancoID: function(bancoID)
		{
			this.bancoID = bancoID;
		}
		,constructor: function()
		{
			this.addEvents({
				 salvar	: true
				,excluir: true
			});

			//super
			cadbanco.superclass.constructor.apply(this, arguments);
		}
		
		,initComponent: function()
		{
			//formulário	
			this.formPanel = new Ext.form.FormPanel({
				 bodyStyle	: 'padding:10px;'
				,border		: false
				,autoScroll	: true
				,defaultType: 'textfield'
				,defaults	: {
					anchor: '-2' 	//anchor é um config. option. excelente para formulário. Ele define larguras relativas
									//nesse caso a largura total -19px, que reservei para scroll
				}
				,items:[{
					 xtype      : 'fieldset'
					,autoHeight : true
					,labelWidth	: 80
					,items      : [{
						xtype      : 'textfield'
					   ,fieldLabel : 'Identificador'
					   ,name	   : 'banco_id'
					   ,disabled   : true
				   	   ,allowBlank : true
					   ,maxLength  : 10						
					},{
						xtype       : 'textfield'
					   ,fieldLabel	: 'Descrição'
					   ,name		: 'banco_desc'
					   ,allowBlank	: false					
					   ,maxLength	: 60
				   	   ,width	    : '90%'					   
					},{
						xtype       : 'textfield'
					   ,fieldLabel	: 'Código'
					   ,name		: 'banco_codigo'
					   ,maxLength	: 10
					},{
						xtype       : 'textfield'
					   ,fieldLabel	: 'Agencia'
					   ,name		: 'banco_agencia'
					   ,maxLength	: 10			
					},{
						xtype       : 'textfield'
					   ,fieldLabel	: 'Conta'
					   ,name		: 'banco_conta'
					   ,maxLength	: 20					
					},{
			    	    xtype       : 'masktextfield'
					   ,fieldLabel  : 'Saldo inicial'
					   ,name	    : 'banco_saldo_inicial'
					   ,mask        : '9.999.990,00'
					   ,money       : true						  
					   ,allowBlank  : true
					   ,width       : '60%'
					   ,anchor      : '60%'
					},{
			    	    xtype       : 'masktextfield'
					   ,fieldLabel  : 'Saldo atual'
					   ,name	    : 'banco_saldo_atual'
					   ,mask        : '9.999.990,00'
					   ,money       : true						  
					   ,allowBlank  : true
					   ,width       : '60%'
					   ,anchor      : '60%'						  
					}]
			}]})
			
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
			cadbanco.superclass.initComponent.call(this);
		}
		,show: function()
		{
			cadbanco.superclass.show.apply(this,arguments);
			if(this.bancoID !== 0) {				
				this.btnExcluir.show();			
				this.el.mask('Carregando informações..');				
				this.formPanel.getForm().load({
					 url     : 'banco/buscar'
					,params  : {						
						 action       : 'buscar'
						,banco_id : this.bancoID						
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
			cadbanco.superclass.onDestroy.apply(this,arguments);			
			this.formPanel = null;
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
				 url	: 'banco/salvar'
				,params	: {
					 action	  : 'salvar'
					,banco_id : this.bancoID
				}
				,scope:this
				,success: function() //ao terminar de submitar
				{
					this.el.unmask();					
					Ext.getCmp('formPanel').getForm().findField('banco_id').setValue(a.result.id);
					this.bancoID = a.result.id;
					this.fireEvent('salvar',this);			}
			});
		}		
		,_onBtnDeleteClick: function()
		{
			Ext.Msg.confirm('Confirmação','Deseja mesmo excluir esse registro?',function(opt) {
				if(opt === 'no') {
					return					
				}
				this.el.mask('Excluir informação.');
				
				Ext.Ajax.request({
					 url	: 'banco/excluir'
					,params	: {
						 action	  : 'excluir'
					    ,banco_id : this.bancoID
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