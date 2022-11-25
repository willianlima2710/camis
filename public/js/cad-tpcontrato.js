var cadtpcontrato = Ext.extend(Ext.Window,{	
		 tpcontratoID: 0
		,modal		 : true
		,constrain	 : true
		,maximizable : false
		,resizable   : false
		,width		 : 450
		,height		 : 300
		,title		 : 'Cadastro de Tipo de contrato'
		,layout		 : 'fit'
		,buttonAlign : 'center'		
		,closeAction : 'hide'
			
		,setTpcontratoID: function(tpcontratoID)
		{
			this.tpcontratoID = tpcontratoID;
		}
		,constructor: function()
		{
			this.addEvents({
				 salvar	: true
				,excluir: true
			});

			//super
			cadtpcontrato.superclass.constructor.apply(this, arguments);
		}
		
		,initComponent: function()
		{
			//combo das empresa
			this.comboEmpresa = new Ext.form.ComboBox({
				 fieldLabel		: 'Empresa'		
				,xtype			: 'combo'
				,hiddenName		: 'empresa_id'	
				,triggerAction	: 'all'
				,valueField		: 'empresa_id'
				,displayField	: 'empresa_desc'
				,emptyText		: 'Selecione uma empresa'
				,allowBlank		: true
				,readOnly       : false
				,editable       : false
			    ,width          : '100%'
			    ,anchor         : '100%'				
				,store			: new Ext.data.JsonStore({
					 url		: 'empresa/todo'
					,baseParams	: {
						 action	: 'todo'
						,limit	: 30
					}
					,fields:[
						 {name: 'empresa_id'   ,type:'int'}
						,{name: 'empresa_desc' ,type:'string'}
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
				   ,fieldLabel : 'Identificador'
				   ,name	   : 'tpcontrato_id'
				   ,allowBlank : true
				   ,maxLength  : 10
  				   ,width	   : '20%'		
				   ,anchor     : '40%'		
   				   ,disabled   : true
				},{
					xtype      : 'textfield'
				   ,fieldLabel : 'Descrição'
				   ,name	   : 'tpcontrato_desc'
				   ,allowBlank : false					
				   ,maxLength  : 60					
				}
			    ,this.comboEmpresa,{
		        	xtype      : 'radiogroup'
                   ,fieldLabel : 'Tipo de valor'
                   ,items      : [
                       {boxLabel: 'Oneroso',  name: 'tpcontrato_invalor', inputValue: 0,checked: true}
                      ,{boxLabel: 'Gratuito', name: 'tpcontrato_invalor', inputValue: 1}
                   ]
			    },{
		    	    xtype      : 'masktextfield'
				   ,fieldLabel : 'Multa(%)'
				   ,name	   : 'tpcontrato_multa'
				   ,mask       : '99'
				   ,money      : true						  
				   ,allowBlank : true
  				   ,width	   : '20%'		
				   ,anchor     : '40%'	   
			    },{
		    	    xtype      : 'masktextfield'
				   ,fieldLabel : 'Juros(%)'
				   ,name	   : 'tpcontrato_juros'
				   ,mask       : '99'
				   ,money      : true						  
				   ,allowBlank : true
  				   ,width	   : '20%'		
				   ,anchor     : '40%'	   
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
						this.formPanel.items.item(1).focus();		
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
			cadtpcontrato.superclass.initComponent.call(this);
		}
		,show: function()
		{
			cadtpcontrato.superclass.show.apply(this,arguments);
			if(this.tpcontratoID !== 0) {				
				this.btnExcluir.show();			
				this.el.mask('Carregando informações..');				
				this.formPanel.getForm().load({
					 url     : 'tpcontrato/buscar'
					,params  : {						
						 action     : 'buscar'
						,tpcontrato_id : this.tpcontratoID						
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
			cadtpcontrato.superclass.onDestroy.apply(this,arguments);			
			this.formPanel = null;
		}	
		,_onFormLoad: function(form, request)
		{
			var data = request.result.data;
			
			if(data.empresa_id){
				this.comboEmpresa.setValue(data.empresa_id);
				this.comboEmpresa.setRawValue(data.empresa_desc);
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
				 url	: 'tpcontrato/salvar'
				,params	: {
					 action	       : 'salvar'
					,tpcontrato_id : this.tpcontratoID
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
					 url	: 'tpcontrato/excluir'
					,params	: {
						 action	       : 'excluir'
					    ,tpcontrato_id : this.tpcontratoID
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