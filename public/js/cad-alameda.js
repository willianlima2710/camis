var cadalameda = Ext.extend(Ext.Window,{	
		 alamedaID   : 0
		,modal		 : true
		,constrain	 : true
		,maximizable : false
		,resizable   : false
		,width		 : 450
		,height		 : 300
		,title		 : 'Cadastro de Alameda'
		,layout		 : 'fit'
		,buttonAlign : 'center'		
		,closeAction : 'hide'
			
		,setAlamedaID: function(alamedaID)
		{
			this.alamedaID = alamedaID;
		}
		,constructor: function()
		{
			this.addEvents({
				 salvar	: true
				,excluir: true
			});

			//super
			cadalameda.superclass.constructor.apply(this, arguments);
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
					,name		: 'alameda_desc'
					,allowBlank	: false					
					,maxLength	: 100					
				},{
					 xtype      : 'textfield'
					,fieldLabel	: 'C�digo'
					,name		: 'alameda_codigo'
					,allowBlank	: false
					,width		: '20%'					 
					,maxLength	: 10
					,style      : '{text-align:right;}'
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
			cadalameda.superclass.initComponent.call(this);
		}
		,show: function()
		{
			cadalameda.superclass.show.apply(this,arguments);
			if(this.alamedaID !== 0) {				
				this.btnExcluir.show();			
				this.el.mask('Carregando informa��es..');				
				this.formPanel.getForm().load({
					 url     : 'alameda/buscar'
					,params  : {						
						 action     : 'buscar'
						,alameda_id : this.alamedaID						
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
			cadalameda.superclass.onDestroy.apply(this,arguments);			
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
				 url	: 'alameda/salvar'
				,params	: {
					 action	    : 'salvar'
					,alameda_id	: this.alamedaID
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
					 url	: 'alameda/excluir'
					,params	: {
						 action	    : 'excluir'
					    ,alameda_id : this.alamedaID
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