var cadoperacao = Ext.extend(Ext.Window,{	
		 operacaoID  : 0
		,modal		 : true
		,constrain	 : true
		,maximizable : false
		,resizable   : false
		,width		 : 450
		,height		 : 300
		,title		 : 'Cadastro de operações cemiteriais'
		,layout		 : 'fit'
		,buttonAlign : 'center'		
		,closeAction : 'hide'
			
		,setOperacaoID: function(operacaoID)
		{
			this.operacaoID = operacaoID;
		}
		,constructor: function()
		{
			this.addEvents({
				 salvar	: true
				,excluir: true
			});

			//super
			cadoperacao.superclass.constructor.apply(this, arguments);
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
			
			//formulário	
			this.formPanel = new Ext.form.FormPanel({
				 bodyStyle	: 'padding:10px;'
				,border		: false
				,autoScroll	: true
				,defaultType: 'textfield'
				,defaults	: {
					anchor: '-5' 	//anchor é um config. option. excelente para formulário. Ele define larguras relativas
									//nesse caso a largura total -19px, que reservei para scroll
				}
				,items:[{					
					xtype       : 'textfield'
				   ,fieldLabel  : 'Identificador'
				   ,name	    : 'operacao_id'
				   ,disabled    : true
			   	   ,allowBlank  : true
				   ,maxLength   : 10						
			    },{
			    	xtype       : 'textfield'
				   ,fieldLabel	: 'Descrição'
				   ,name		: 'operacao_desc'
				   ,allowBlank	: false					
				   ,maxLength	: 100					
				},{
			        xtype       : 'checkbox'
				   ,fieldLabel  : 'Faturar ?'
				   ,name        : 'operacao_infaturar'
				   ,autoWidth   : true
				   ,allowBlank  : true
				   ,inputValue  : '1'					
				},{
		    	    xtype      : 'textfield'
				   ,fieldLabel : 'Tempo(Anos)'
				   ,name	   : 'operacao_tempo'
				   ,allowBlank : true
				   ,width      : '30%'
				   ,anchor     : '30%'					
				}
				,this.comboBanco
				,this.comboConta]
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
			cadoperacao.superclass.initComponent.call(this);
		}
		,show: function()
		{
			cadoperacao.superclass.show.apply(this,arguments);
			if(this.operacaoID !== 0) {				
				this.btnExcluir.show();			
				this.el.mask('Carregando informações..');				
				this.formPanel.getForm().load({
					 url     : 'operacao/buscar'
					,params  : {						
						 action      : 'buscar'
						,operacao_id : this.operacaoID						
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
			cadoperacao.superclass.onDestroy.apply(this,arguments);			
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
				 url	: 'operacao/salvar'
				,params	: {
					 action	     : 'salvar'
					,operacao_id : this.operacaoID
				}
				,scope:this
				,success: function(f,a) //ao terminar de submitar
				{
					this.el.unmask();					
					Ext.getCmp('formPanel').getForm().findField('operacao_id').setValue(a.result.id);
					this.operacaoID = a.result.id;
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
				this.el.mask('Excluir informação.');
				
				Ext.Ajax.request({
					 url	: 'operacao/excluir'
					,params	: {
						 action	     : 'excluir'
					    ,operacao_id : this.operacaoID
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