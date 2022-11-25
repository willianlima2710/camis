var cadestado = Ext.extend(Ext.Window,{	
		 estadoID    : 0
		,modal		 : true
		,constrain	 : true
		,maximizable : false
		,resizable   : false
		,width		 : 450
		,height		 : 300
		,title		 : 'Cadastro de Estados'
		,layout		 : 'fit'
		,buttonAlign : 'center'		
		,closeAction : 'hide'
			
		,setEstadoID: function(estadoID)
		{
			this.estadoID = estadoID;
		}
		,constructor: function()
		{
			this.addEvents({
				 salvar	: true
				,excluir: true
			});

			//super
			cadestado.superclass.constructor.apply(this, arguments);
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
					,name		: 'estado_desc'
					,allowBlank	: false
					,maxLength	: 100
				},{
					 xtype      : 'textfield'
				    ,fieldLabel	: 'Sigla'
				    ,autoCreate : {tag: 'input', type: 'text', autocomplete: 'off', maxlength: 2 }	
				    ,name		: 'estado_sigla'
				    ,allowBlank	: false
				    ,maskRe     : '/^[0-9]$/'
				    ,width      : 20	
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
			cadestado.superclass.initComponent.call(this);
		}
		,show: function()
		{
			cadestado.superclass.show.apply(this,arguments);
			if(this.estadoID !== 0) {				
				this.btnExcluir.show();			
				this.el.mask('Carregando informa��es..');
				this.formPanel.getForm().load({
					 url     : 'estado/buscar'
					,params  : {						
						 action    : 'buscar'
						,estado_id : this.estadoID						
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
			cadestado.superclass.onDestroy.apply(this,arguments);			
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
				 url	: 'estado/salvar'
				,params	: {
					 action	   : 'salvar'
					,estado_id : this.estadoID
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
					 url	: 'estado/excluir'
					,params	: {
						 action	   : 'excluir'
					    ,estado_id : this.estadoID
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