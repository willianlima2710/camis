var caddestino = Ext.extend(Ext.Window,{	
		 destinoID   : 0
		,modal		 : true
		,constrain	 : true
		,maximizable : false
		,resizable   : false
		,width		 : 450
		,height		 : 300
		,title		 : 'Cadastro de destino'
		,layout		 : 'fit'
		,buttonAlign : 'center'		
		,closeAction : 'hide'
			
		,setdestinoID: function(destinoID)
		{
			this.destinoID = destinoID;
		}
		,constructor: function()
		{
			this.addEvents({
				 salvar	: true
				,excluir: true
			});

			//super
			caddestino.superclass.constructor.apply(this, arguments);
		}
		
		,initComponent: function()
		{
			//formul�rio	
			this.formPanel = new Ext.form.FormPanel({
				 bodyStyle	: 'padding:10px;'
				,border		: false
				,autoScroll	: true
				,defaultType: 'textfield'
				,defaults	: {
					anchor: '-19' 	//anchor � um config. option. excelente para formul�rio. Ele define larguras relativas
									//nesse caso a largura total -19px, que reservei para scroll
				}
				,items:[{
					 xtype      : 'textfield'
					,fieldLabel	: 'Descri��o'
					,name		: 'destino_desc'
					,allowBlank	: false
					,maxLength	: 100
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
			caddestino.superclass.initComponent.call(this);
		}
		,show: function()
		{
			caddestino.superclass.show.apply(this,arguments);
			if(this.destinoID !== 0) {				
				this.btnExcluir.show();			
				this.el.mask('Carregando informa��es..');
				this.formPanel.getForm().load({
					 url     : 'destino/buscar'
					,params  : {						
						 action      : 'buscar'
						,destino_id : this.destinoID						
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
			caddestino.superclass.onDestroy.apply(this,arguments);			
			this.formPanel = null;
		}	
		,_onFormLoad: function(form, request)
		{
			var data = request.result.data;
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
				 url	: 'destino/salvar'
				,params	: {
					 action	     : 'salvar'
					,destino_id : this.destinoID
				}
				,scope:this
				,success: function() //ao terminar de submitar
				{
					//tir� m�scara
					this.el.unmask();
					
					//esconde janela
					//this.hide();
					
					/*
					 * Muito importante! Aqui o evento salvar � disparado. Todos os listeners que foram associados
					 * a esse evento ser�o notificados, como por exemplo, o listener _onCadastroUsuarioSalvar da
					 * classe UsuarioLista.
					 */
					this.fireEvent('salvar',this);
				}
			});
		}		
		,_onBtnDeleteClick: function()
		{
			Ext.Msg.confirm('Confirma��o','Deseja mesmo excluir esse registro?',function(opt) {
				if(opt === 'no') {
					return					
				}
				this.el.mask('Excluir informa��o.');
				
				Ext.Ajax.request({
					 url	: 'destino/excluir'
					,params	: {
						 action	    : 'excluir'
					    ,destino_id : this.destinoID
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
		,_onBtnCancelarClick: function()
		{
			Ext.Msg.confirm('Confirma��o','Deseja mesmo cancelar esse cadastro?',function(opt){
				if(opt === 'yes') {
					this.hide();	
				}					
			},this)
		}
});