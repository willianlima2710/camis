var cadconta = Ext.extend(Ext.Window,{	
		 contaID     : 0
		,modal		 : true
		,constrain	 : true
		,maximizable : false
		,resizable   : false
		,width		 : 500
		,height		 : 320
		,title		 : 'Cadastro de planos de contas'
		,layout		 : 'fit'
		,buttonAlign : 'center'		
		,closeAction : 'hide'
			
		,setContaID: function(contaID)
		{
			this.contaID = contaID;
		}
		,constructor: function()
		{
			this.addEvents({
				 salvar	: true
				,excluir: true
			});

			//super
			cadconta.superclass.constructor.apply(this, arguments);
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
					,labelWidth	: 100
					,items      : [{
						xtype      : 'textfield'
					   ,fieldLabel : 'Identificador'
					   ,name	   : 'conta_id'
					   ,disabled   : true
				   	   ,allowBlank : true
					   ,maxLength  : 10						
					},{
						xtype       : 'textfield'
					   ,fieldLabel	: 'Descrição'
					   ,name		: 'conta_desc'
					   ,allowBlank	: false					
					   ,maxLength	: 60
				   	   ,width	    : '90%'					   
					},{
						xtype       : 'textfield'
					   ,fieldLabel	: 'Código'
					   ,name		: 'conta_codigo'
					   ,maxLength	: 10
					},{
						xtype       : 'textfield'
					   ,fieldLabel	: 'PAI'
					   ,name		: 'conta_pai'
					   ,maxLength	: 10			
					},{
						xtype       : 'textfield'
					   ,fieldLabel	: 'Ordem'
					   ,name		: 'conta_ordem'
					   ,maxLength	: 20
					},{
						xtype       : 'textfield'
					   ,fieldLabel	: 'Nivel'
					   ,name		: 'conta_nivel'
					   ,maxLength	: 20				
					},{
						xtype       : 'textfield'
					   ,fieldLabel	: 'Código reduzido'
					   ,name		: 'conta_reduzido'
					   ,maxLength	: 20				   
					},{
				        xtype         : 'combo'							
	 				   ,hiddenName    : 'conta_intipo'
	 				   ,fieldLabel	  : 'Tipo'	
					   ,allowBlank    : true
					   ,readOnly      : false
					   ,editable      : false
					   ,store         : new Ext.data.ArrayStore({
						   fields : ['id','field']
					      ,data   : [['1', 'DEBITO'],['0', 'CREDITO']] 
					   })
					   ,valueField    : 'id'
					   ,displayField  : 'field'
					   ,typeAhead     : true	
					   ,mode          : 'local'	
					   ,width	      : '50%'	
					   ,anchor        : '50%'						   
					   ,triggerAction : 'all'					
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
			cadconta.superclass.initComponent.call(this);
		}
		,show: function()
		{
			cadconta.superclass.show.apply(this,arguments);
			if(this.contaID !== 0) {				
				this.btnExcluir.show();			
				this.el.mask('Carregando informações..');				
				this.formPanel.getForm().load({
					 url     : 'conta/buscar'
					,params  : {						
						 action       : 'buscar'
						,conta_id : this.contaID						
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
			cadconta.superclass.onDestroy.apply(this,arguments);			
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
				 url	: 'conta/salvar'
				,params	: {
					 action	  : 'salvar'
					,conta_id : this.contaID
				}
				,scope:this
				,success: function() //ao terminar de submitar
				{
					this.el.unmask();					
					Ext.getCmp('formPanel').getForm().findField('conta_id').setValue(a.result.id);
					this.contaID = a.result.id;
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
					 url	: 'conta/excluir'
					,params	: {
						 action	  : 'excluir'
					    ,conta_id : this.contaID
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