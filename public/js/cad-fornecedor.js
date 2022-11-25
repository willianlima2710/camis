var cadfornecedor = Ext.extend(Ext.Window,{	
		 fornecedorID : 0
		,modal		  : true
		,constrain	  : true
		,maximizable  : false
		,resizable    : false
		,width		  : 450
		,height		  : 400
		,title		  : 'Cadastro de fornecedor'
		,layout		  : 'fit'
		,buttonAlign  : 'center'		
		,closeAction  : 'hide'
			
		,setFornecedorID: function(fornecedorID)
		{
			this.fornecedorID = fornecedorID;
		}
		,constructor: function()
		{
			this.addEvents({
				 salvar	: true
				,excluir: true
			});

			//super
			cadfornecedor.superclass.constructor.apply(this, arguments);
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
				,emptyText		: 'Selecione um estado'
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
			
			//combo dos paises
			this.comboPais = new Ext.form.ComboBox({
				 fieldLabel		: 'Pais'		
				,xtype			: 'combo'
				,hiddenName		: 'pais_sigla'	
				,triggerAction	: 'all'
				,valueField		: 'pais_sigla'
				,displayField	: 'pais_desc'
				,emptyText		: 'Selecione um país'
				,allowBlank		: true
				,readOnly       : false
				,editable       : false
				,store			: new Ext.data.JsonStore({
					 url		: 'pais/todo'
					,baseParams	: {
						 action	: 'todo'
						,limit	: 30
					}
					,fields:[
						 {name: 'pais_sigla', type:'string'}
						,{name: 'pais_desc' , type:'string'}
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
					,fieldLabel	: 'Nome'
					,name		: 'fornecedor_desc'
					,allowBlank	: false					
					,maxLength	: 60					
				},{
					 xtype      : 'textfield'
					,fieldLabel	: 'Endereço'
					,name		: 'fornecedor_endereco'
					,allowBlank	: true
					,width		: '20%'					 
					,maxLength	: 60					
				},{
					 xtype      : 'textfield'
					,fieldLabel	: 'Numero'
					,name		: 'fornecedor_numero'
					,allowBlank	: true
					,width		: '20%'
					,anchor     : '40%'
					,maxLength	: 10					
				},{
					 xtype      : 'textfield'
					,fieldLabel	: 'Complemento'
					,name		: 'fornecedor_complem'
					,allowBlank	: true
					,width		: '20%'					 
					,maxLength	: 60					
				},{
					 xtype      : 'textfield'
					,fieldLabel	: 'Bairro'
					,name		: 'fornecedor_bairro'
					,allowBlank	: true
					,width		: '20%'					 
					,maxLength	: 40					
				},{
					 xtype      : 'textfield'
					,fieldLabel	: 'Cidade'
					,name		: 'fornecedor_cidade'
					,allowBlank	: true
					,width		: '20%'					 
					,maxLength	: 40					
				},{
					 xtype      : 'masktextfield'
					,fieldLabel	: 'CEP'
					,name		: 'fornecedor_cep'
					,mask       : '99999-999'
					,money      : false						
					,allowBlank	: true
					,width		: '50%'		
					,anchor     : '50%'	
					,maxLength	: 9					
				}
				,this.comboEstado
				,this.comboPais,{
					 xtype      : 'textfield'
					,fieldLabel	: 'CPF/CNPJ'
					,name		: 'fornecedor_cpfcnpj'
					,allowBlank	: true
					,width		: '60%'		
					,anchor     : '60%'						
					,maxLength	: 20					
				},{
					 xtype      : 'masktextfield'
					,fieldLabel	: 'Telefone'
					,name		: 'fornecedor_telefone'
					,mask       : '(99) 9999-9999'
					,money      : false						
					,allowBlank	: true
					,width		: '50%'		
					,anchor     : '50%'	
					,maxLength	: 20					
				},{
					 xtype      : 'textfield'
					,fieldLabel	: 'Contato'
					,name		: 'fornecedor_contato'
					,allowBlank	: true
					,width		: '20%'					 
					,maxLength	: 40					
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
			cadfornecedor.superclass.initComponent.call(this);
		}
		,show: function()
		{
			cadfornecedor.superclass.show.apply(this,arguments);
			if(this.fornecedorID !== 0) {				
				this.btnExcluir.show();			
				this.el.mask('Carregando informações..');				
				this.formPanel.getForm().load({
					 url     : 'fornecedor/buscar'
					,params  : {						
						 action        : 'buscar'
						,fornecedor_id : this.fornecedorID						
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
			cadfornecedor.superclass.onDestroy.apply(this,arguments);			
			this.formPanel = null;
		}	
		,_onFormLoad: function(form, request)
		{
			var data = request.result.data;
			
			this.comboEstado.setValue(data.estado_sigla);
			this.comboEstado.setRawValue(data.estado_desc);
					
			this.comboPais.setValue(data.pais_sigla);
			this.comboPais.setRawValue(data.pais_desc);			
			
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
				 url	: 'fornecedor/salvar'
				,params	: {
					 action	       : 'salvar'
					,fornecedor_id : this.fornecedorID
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
					 url	: 'fornecedor/excluir'
					,params	: {
						 action	       : 'excluir'
					    ,fornecedor_id : this.fornecedorID
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