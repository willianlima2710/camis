var cadlote = Ext.extend(Ext.Window,{	
		 loteID       : 0
		,modal		 : true
		,constrain	 : true
		,maximizable : false
		,resizable   : false
		,width		 : 450
		,height		 : 300
		,title		 : 'Cadastro de lote'
		,layout		 : 'fit'
		,buttonAlign : 'center'		
		,closeAction : 'hide'
			
		,setLoteID: function(loteID)
		{
			this.loteID = loteID;
		}
		,constructor: function()
		{
			this.addEvents({
				 salvar	: true
				,excluir: true
			});

			//super
			cadlote.superclass.constructor.apply(this, arguments);
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
					anchor: '-19' 	//anchor é um config. option. excelente para formulário. Ele define larguras relativas
									//nesse caso a largura total -19px, que reservei para scroll
				}
				,items:[{
					 xtype      : 'textfield'
					,fieldLabel	: 'Descrição'
					,name		: 'lote_desc'
					,allowBlank	: false					
					,maxLength	: 100					
				},{
					 xtype      : 'textfield'
					,fieldLabel	: 'Código'
					,name		: 'lote_codigo'
					,allowBlank	: false
					,width		: '20%'
					,anchor     : '50%'	
					,maxLength	: 10
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
			cadlote.superclass.initComponent.call(this);
		}
		,show: function()
		{
			cadlote.superclass.show.apply(this,arguments);
			if(this.loteID !== 0) {				
				this.btnExcluir.show();			
				this.el.mask('Carregando informações..');				
				this.formPanel.getForm().load({
					 url     : 'lote/buscar'
					,params  : {						
						 action     : 'buscar'
						,lote_id : this.loteID						
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
			cadlote.superclass.onDestroy.apply(this,arguments);			
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
				 url	: 'lote/salvar'
				,params	: {
					 action	    : 'salvar'
					,lote_id	: this.loteID
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
					 url	: 'lote/excluir'
					,params	: {
						 action	 : 'excluir'
					    ,lote_id : this.loteID
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