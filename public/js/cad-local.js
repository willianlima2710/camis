var cadlocal = Ext.extend(Ext.Window,{	
		 localID     : 0
		,modal		 : true
		,constrain	 : true
		,maximizable : false
		,resizable   : false
		,width		 : 450
		,height		 : 300
		,title		 : 'Cadastro de Local de falecimento'
		,layout		 : 'fit'
		,buttonAlign : 'center'		
		,closeAction : 'hide'
			
		,setLocalID: function(localID)
		{
			this.localID = localID;
		}
		,constructor: function()
		{
			this.addEvents({
				 salvar	: true
				,excluir: true
			});

			//super
			cadlocal.superclass.constructor.apply(this, arguments);
		}
		
		,initComponent: function()
		{
			//combo dos estados
			this.comboEstado = new Ext.form.ComboBox({
				 fieldLabel		: 'Estado'		
				,xtype			: 'combo'
				,hiddenName		: 'estado_sigla'	
				,triggerAction	: 'all'
				,valueField		: 'estado_sigla'
				,displayField	: 'estado_desc'
				,emptyText		: 'Selecione um Estado'
				,allowBlank		: true
				,readOnly       : false
				,editable       : false
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
			
			//formulário	
			this.formPanel = new Ext.form.FormPanel({
				 bodyStyle	: 'padding:10px;'
				,border		: false
				,autoScroll	: true
				,defaultType: 'textfield'
				,defaults	: {
					anchor: '-19' 	//anchor é um config. option. excelente para formulário. Ele define larguras relativas
									//nesse caso a largura total -19px, que reservei para scroll
				}
				,items:[{
					 xtype      : 'textfield'
					,fieldLabel	: 'Descrição'
					,name		: 'local_desc'
					,allowBlank	: false
					,maxLength	: 60
				},{
					 xtype      : 'textfield'
					,fieldLabel	: 'Endereço'
					,name		: 'local_endereco'
					,allowBlank	: false
					,width		: '20%'					 
					,maxLength	: 60
				},{
					 xtype      : 'textfield'
					,fieldLabel	: 'Complemento'
					,name		: 'local_complem'
					,allowBlank	: true
					,width		: '20%'					 
					,maxLength	: 60					
				},{
					 xtype      : 'textfield'
					,fieldLabel	: 'Bairro'
					,name		: 'local_bairro'
					,allowBlank	: true
					,width		: '20%'					 
					,maxLength	: 40					
				},{
					 xtype      : 'textfield'
					,fieldLabel	: 'Cidade'
					,name		: 'local_cidade'
					,allowBlank	: true
					,width		: '20%'					 
					,maxLength	: 40										
				},{
					 xtype      : 'textfield'
					,fieldLabel	: 'CEP'
					,name		: 'local_cep'
					,allowBlank	: true
					,width		: '20%'					 
					,maxLength	: 9
				},this.comboEstado,{
					 xtype      : 'textfield'
					,fieldLabel	: 'Telefone'
					,name		: 'local_telefone'
					,allowBlank	: true
					,width		: '20%'					 
					,maxLength	: 20
				}]
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
					,disabled : true
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
			cadlocal.superclass.initComponent.call(this);
		}
		,show: function()
		{
			cadlocal.superclass.show.apply(this,arguments);
			if(this.localID !== 0) {				
				this.btnExcluir.show();			
				this.el.mask('Carregando informações..');
				this.formPanel.getForm().load({
					 url     : 'local/buscar'
					,params  : {						
						 action   : 'buscar'
						,local_id : this.localID						
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
			cadlocal.superclass.onDestroy.apply(this,arguments);			
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
				 url	: 'local/salvar'
				,params	: {
					 action	  : 'salvar'
					,local_id : this.localID
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
					 url	: 'local/excluir'
					,params	: {
						 action	  : 'excluir'
					    ,local_id : this.localID
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