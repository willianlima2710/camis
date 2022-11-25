var cadtransfer = Ext.extend(Ext.Window,{	
		 transferID  : 0
		,modal		 : true
		,constrain	 : true
		,maximizable : false
		,resizable   : false
		,width		 : 600
		,height		 : 220
		,title		 : 'Transferencia de titularidade'
		,layout		 : 'fit'
		,buttonAlign : 'center'		
		,closeAction : 'hide'
			
		,setTransferID: function(transferID)
		{
			this.transferID = transferID;
		}
		,constructor: function()
		{
			this.addEvents({
				 salvar	: true
			});

			//super
			cadtransfer.superclass.constructor.apply(this, arguments);
		}
		
		,initComponent: function()
		{
			Ext.form.Field.prototype.msgTarget = 'side';
			Ext.form.FormPanel.prototype.bodyStyle = 'padding:5px';
			Ext.form.FormPanel.prototype.labelAlign = 'right';
			Ext.QuickTips.init();
			
			//store do autocomplete do locatario
			this.storeLocatario = new Ext.data.JsonStore({
				 url			: 'locatario/autocomplete'
				,root			: 'rows'
				,idProperty		: 'locatario_id'					
				,autoLoad		: true
				,autoDestroy	: true
				,remoteSort     : true
				,baseParams		: {
					 action	: 'locatario/autocomplete'
					,limit	: 30
				}				
				,fields:[
					 {name:'locatario_id'	,type:'int'}
					,{name:'locatario_desc' ,type:'string'}
				]
			});
			
			//store do autocomplete do jazigo
			this.storeJazigo = new Ext.data.JsonStore({
				 url			: 'jazigo/autocomplete'
				,root			: 'rows'
				,idProperty		: 'jazigo_codigo'					
				,autoLoad		: true
				,autoDestroy	: true
				,remoteSort     : true
				,baseParams		: {
					 action	: 'jazigo/autocomplete'
					,limit	: 30
				}				
				,fields:[
					 {name:'jazigo_codigo' ,type:'string'}
					,{name:'jazigo_desc'   ,type:'string'}
				]
			});
			
			//formulário	
			this.formPanel = new Ext.form.FormPanel({
				 bodyStyle	: 'padding:10px;'
				,border		: false
				,autoScroll	: true
				,id         : 'formPanel'
				,defaultType: 'textfield'
				,defaults	: {
					anchor: '-19' 	//anchor é um config. option. excelente para formulário. Ele define larguras relativas
									//nesse caso a largura total -19px, que reservei para scroll
				}
				,items:[{
					xtype      : 'fieldset'
				   ,autoHeight : true
				   ,labelWidth : 150
				   ,border     : false
				   ,items      : [{
					   xtype        : 'combo'
					  ,store        : this.storeLocatario
					  ,name         : 'locatario_desc_antigo'
					  ,fieldLabel   : 'Locatario atual'
					  ,displayField : 'locatario_desc'
					  ,valueField	: 'locatario_id'	
					  ,loadingText  : 'Carregando...'				 
					  ,queryParam   : 'value'
					  ,allowBlank   : false
					  ,width        : 350
					  ,listeners    : {
						  select: {
							  fn: function(combo,value){
								  Ext.getCmp('formPanel').getForm().findField('locatario_id_antigo').setValue(combo.getValue());								   
					  	      }
					  	  }        		   
					  }
			       },{
			    	   xtype        : 'combo'
					  ,store        : this.storeJazigo
					  ,name         : 'jazigo_codigo'
					  ,fieldLabel   : 'Jazigo'
					  ,displayField : 'jazigo_desc'
					  ,valueField	: 'jazigo_codigo'	
					  ,loadingText  : 'Carregando...'				 
					  ,queryParam   : 'value'
					  ,allowBlank   : false
					  ,labelWidth   : 50
					  ,width        : 125
			       },{			    	   
					   xtype        : 'combo'
					  ,store        : this.storeLocatario
					  ,name         : 'locatario_desc_novo'
					  ,fieldLabel   : 'Novo locatario'
					  ,displayField : 'locatario_desc'
					  ,valueField	: 'locatario_id'	
					  ,loadingText  : 'Carregando...'				 
					  ,queryParam   : 'value'
					  ,allowBlank   : false
					  ,width        : 350
					  ,listeners    : {
						  select: {
							  fn: function(combo,value){
								  Ext.getCmp('formPanel').getForm().findField('locatario_id_novo').setValue(combo.getValue());								   
					  	      }
					  	  }        		   
					  }	
			       },{
                   	   xtype      : 'datefield'
					  ,fieldLabel : 'Data'
					  ,name	      : 'transfer_data'
					  ,allowBlank : true
	  	        	  ,maxLength  : 10
	  				  ,format     : 'd/m/Y'  	
	  				  ,altFormats : 'd/m/Y|j/n/Y|j/n/y|j/m/y|d/n/y|j/m/Y|d/m/Y|d-m-y|d-m-Y|d/m|d-m|dm|dmy|dmY|d|d-m-Y'			    	   
				   },{
					   xtype      : 'hidden'
			    	  ,fieldLabel : 'Locatario'
					  ,name	      : 'locatario_id_antigo'
					  ,allowBlank : false
					  ,maxLength  : 30
					  ,labelWidth : 5
				      ,width      : 5
				   },{
					   xtype      : 'hidden'
			    	  ,fieldLabel : 'Locatario'
					  ,name	      : 'locatario_id_novo'
					  ,allowBlank : false
					  ,maxLength  : 30
					  ,labelWidth : 5
				      ,width      : 5				      
				  }]
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
						this.btnSalvar.setDisabled(false);
				    }					
				},
			    this.btnSalvar = new Ext.Button({
					 text	: 'Salvar'
					,iconCls: 'icon-save'
					,scope	: this
					,handler: this._onBtnSalvarClick
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
			cadtransfer.superclass.initComponent.call(this);
		}
		,show: function()
		{
			cadtransfer.superclass.show.apply(this,arguments);
			if(this.transferID !== 0) {				
				this.el.mask('Carregando informações..');
				this.formPanel.getForm().load({
					 url     : 'transfer/buscar'
					,params  : {						
						 action      : 'buscar'
						,transfer_id : this.transferID						
					}
				    ,scope   : this
				    ,success : this._onFormLoad
				});
			}else{
				this.formPanel.getForm().reset();				
			}
		}
		,onDestroy: function()
		{
			cadtransfer.superclass.onDestroy.apply(this,arguments);			
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
				 url	: 'transfer/salvar'
				,params	: {
					 action	     : 'salvar'
					,transfer_id : this.transferID
				}
				,scope:this
				,success: function() //ao terminar de submitar
				{
					//tirá máscara
					this.el.unmask();
					
					//esconde janela
					this.btnSalvar.setDisabled(true);
					
					/*
					 * Muito importante! Aqui o evento salvar é disparado. Todos os listeners que foram associados
					 * a esse evento serão notificados, como por exemplo, o listener _onCadastroUsuarioSalvar da
					 * classe UsuarioLista.
					 */
					this.fireEvent('salvar',this);
				}
			});
		}		
});