var cadcontrato = Ext.extend(Ext.Window,{	
		 contratoID  : 0
		,modal		 : true
		,constrain	 : true
		,maximizable : false
		,resizable   : false
		,width		 : 600
		,height		 : 600
		,title		 : 'Cadastro de Contratos'
		,layout		 : 'fit'
		,buttonAlign : 'center'		
		,closeAction : 'hide'
			
		,setContratoID: function(contratoID)
		{
			this.contratoID = contratoID;
		}
		,constructor: function()
		{
			this.addEvents({
				 salvar	: true
				,excluir: true
			});

			//super
			cadcontrato.superclass.constructor.apply(this, arguments);
		}
		
		,initComponent: function()
		{			
			Ext.QuickTips.init();
			
			//combo dos tipos de contratos
			this.comboTpcontrato = new Ext.form.ComboBox({
				 fieldLabel		: 'Tipo do contrato'
				,xtype			: 'combo'
				,hiddenName		: 'tpcontrato_id'	
				,triggerAction	: 'all'
				,valueField		: 'tpcontrato_id'
				,displayField	: 'tpcontrato_desc'
				,emptyText		: 'Selecione um tipo de contrato'
				,allowBlank		: false
				,readOnly       : false
				,editable       : false
       	        ,width          : 220
				,store			: new Ext.data.JsonStore({
					 url		: 'tpcontrato/todo'
					,baseParams	: {
						 action	: 'todo'
						,limit	: 30
					}
					,fields:[
						 {name: 'tpcontrato_id'   , type:'int'}
						,{name: 'tpcontrato_desc' , type:'string'}
					]
				})
			})
			
			//fieldtext contrato_id
			this.contratoIdTextField = new Ext.form.TextField({
				fieldLabel : 'Identificador'
			   ,allowBlank : true
			   ,name       : 'contrato_id'
			   ,maxLength  : 10
			   ,disabled   : true
			});

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
			
			//store jazigos x contratos
			this.storeContratojazigo = new Ext.data.JsonStore({
				 url			: 'contratojazigo/listar'
				,root			: 'rows'					
				,idProperty		: 'contrato_id'
				,totalProperty	: 'totalCount'
				,autoLoad		: false
				,autoDestroy	: true
				,remoteSort     : true
				,baseParams		: {
					 action : 'contratojazigo/listar'
					,field  : 'contrato_id'	 
					,value  : this.contratoID
				}				
				,fields:[
				     {name:'contrato_jazigo_id' ,type:'int'}     
					,{name:'jazigo_codigo'      ,type:'string'}
				]
			});	

			
			// grid dos jazigos
			this.gridJazigo = new Ext.grid.GridPanel({
				 title      : 'Para excluir, click no icone vermelho' 
				,style	 	: 'margin-top: 5px;'
				,height		: 300
				,store		: this.storeContratojazigo
				,columns	: [{					
				    header		: '&nbsp;'
				   ,align		: 'center'
				   ,width		: 60
				   ,fixed		: true
				   ,renderer	: function()
				   {
						return '<img src="'+Ext.BLANK_IMAGE_URL+'" width="16" height="16" class="silk-delete" style="cursor:pointer;" />'
				   }					
				},{
				    header	   : 'Identificador'
				   ,dataIndex  : 'contrato_jazigo_id'
				   ,align	   : 'center'
				   ,width	   : 80
				   ,sortable   : true
				},{
					dataIndex  : 'jazigo_codigo'
				   ,header	   : 'Jazigo'
				   ,width      : 100
				   ,sortable   : true	
				}]
			})
			
			//formulário	
			this.formPanel = new Ext.form.FormPanel({
				 bodyStyle	: 'padding:5px;'
				,border		: false
				,id         : 'frmContrato'
				,autoScroll	: true
				,defaultType: 'textfield'
				,defaults	: {
					anchor: '-5' 	//anchor é um config. option. excelente para formulário. Ele define larguras relativas
									//nesse caso a largura total -19px, que reservei para scroll
				}
				,items:[{					
					xtype      : 'fieldset'
   				   ,title      : 'Geral'
				   ,autoHeight : true
				   ,labelWidth : 80
				   ,items      : [this.contratoIdTextField,{
					   xtype        : 'textfield'
					  ,fieldLabel   : 'Numero'
					  ,name		    : 'contrato_numero'
					  ,allowBlank   : true
					  ,maxLength    : 10
					  ,col          : true
				   },{
				       xtype        : 'combo'
				      ,store        : this.storeLocatario
				      ,name         : 'locatario_desc'
				      ,fieldLabel   : 'Locatario'
				      ,displayField : 'locatario_desc'
			  	      ,valueField   : 'locatario_id'	
				      ,loadingText  : 'Carregando...'				 
				      ,queryParam   : 'value'
				      ,allowBlank   : false
				      ,width        : 400
				      ,listeners    : {
				    	  select: {
				    		  fn: function(combo,value){
				    			  Ext.getCmp('frmContrato').getForm().findField('locatario_id').setValue(combo.getValue());								   
					  	       }
					      }        		   
				      }				    
				   },{					   
				       xtype        : 'hidden'
		    	      ,fieldLabel   : 'Locatario'
				      ,name	        : 'locatario_id'
				      ,allowBlank   : false
				      ,maxLength    : 30
				      ,labelWidth   : 5
			          ,width        : 5
			          ,col          : true
				   }]},{
						xtype      : 'fieldset'
	   				   ,title      : 'Ciclo de faturamento'
					   ,autoHeight : true
					   ,labelWidth : 80
					   ,items      : [this.comboTpcontrato,{
						   xtype         : 'combo'							
				 		  ,hiddenName    : 'contrato_inperiodicidade'
				 		  ,fieldLabel    : 'Periodicidade'	
					      ,allowBlank    : true
						  ,readOnly      : false
						  ,editable      : false
						  ,store         : new Ext.data.ArrayStore({
							  fields : ['id','field']
						     ,data   : [['0', 'MENSAL'],
						                ['1', 'SEMESTRAL'],
						                ['2', 'TRIMESTRAL'],
						                ['3', 'ANUAL']] 
						  })
						  ,valueField    : 'id'
						  ,displayField  : 'field'
						  ,typeAhead     : true	
						  ,mode          : 'local'	
						  ,triggerAction : 'all'
						  ,col           : true	  
					   },{
						   xtype         : 'datefield'
						  ,fieldLabel    : 'Cadastro'
					      ,name	         : 'contrato_data_cadastro'
						  ,allowBlank    : false
					      ,maxLength     : 10
					      ,value         : new Date()
						  ,disabled      : true
						  ,format        : 'd/m/Y'
						  ,altFormats    : 'd/m/Y|j/n/Y|j/n/y|j/m/y|d/n/y|j/m/Y|d/m/Y|d-m-y|d-m-Y|d/m|d-m|dm|dmy|dmY|d|d-m-Y'
					   },{
						   xtype         : 'datefield'
  						  ,fieldLabel    : 'Prox.Vencimento'
						  ,name	         : 'contrato_proximo_vencto'
						  ,allowBlank    : false
						  ,maxLength     : 10
						  ,disabled      : true
						  ,format        : 'd/m/Y'
						  ,altFormats    : 'd/m/Y|j/n/Y|j/n/y|j/m/y|d/n/y|j/m/Y|d/m/Y|d-m-y|d-m-Y|d/m|d-m|dm|dmy|dmY|d|d-m-Y'
						  ,col           : true	  
					   },{
						   xtype         : 'textarea'
  						  ,fieldLabel    : 'Observações'
						  ,name          : 'contrato_observacao'
						  ,width         : 430
					      ,height        : 100						   
					   },{
					       xtype         : 'hidden'
					      ,allowBlank    : false
					      ,name	         : 'separ1'
				          ,col           : true		   
					   }]
				}]				
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
				})]				
			})
			
			// formulário de jazigos	
			this.formJazigo = new Ext.form.FormPanel({
				 bodyStyle	: 'padding:10px;'
				,border		: false
				,id         : 'frmJazigo'
				,autoScroll	: true				
				,defaultType: 'textfield'
				,defaults	: {
					anchor: '-5' 	//anchor é um config. option. excelente para formulário. Ele define larguras relativas
									//nesse caso a largura total -19px, que reservei para scroll
				}
				,items:[{
					 xtype      : 'fieldset'
					,title      : 'Jazigo e Locatario'
					,autoHeight : true
					,labelWidth	: 80
					,items      : [{						
						xtype        : 'combo'
				       ,store        : this.storeJazigo
				       ,name         : 'jazigo_codigo'
				       ,fieldLabel   : 'Jazigo'
				       ,displayField : 'jazigo_desc'
				       ,valueField	 : 'jazigo_codigo'	
				       ,loadingText  : 'Carregando...'				 
				       ,queryParam   : 'value'
				       ,allowBlank   : false
				       ,labelWidth   : 50
				       ,width        : 125
					},{						
						xtype        : 'combo'
					   ,store        : this.storeLocatario
					   ,name         : 'locatario_desc'
					   ,fieldLabel   : 'Locatario'
					   ,displayField : 'locatario_desc'
					   ,valueField	 : 'locatario_id'	
					   ,loadingText  : 'Carregando...'				 
					   ,queryParam   : 'value'
					   ,allowBlank   : false
					   ,width        : 400
					   ,listeners    : {
						   select: {
							   fn: function(combo,value){
								   Ext.getCmp('frmJazigo').getForm().findField('locatario_id').setValue(combo.getValue());								   
					  	  	   }
					  	    }        		   
					    }					
				    },{
						xtype      : 'hidden'
			    	   ,fieldLabel : 'Locatario'
 					   ,name	   : 'locatario_id'
					   ,allowBlank : false
					   ,maxLength  : 30
					   ,labelWidth : 5
				       ,width      : 5
					},{
					 	xtype	   : 'button'
					   ,text  	   : 'Adicionar'
					   ,iconCls    : 'silk-add'
					   ,style	   : 'margin-left:85px;'
					   ,id         : 'btnAdicionarJazigo' 							   
					   ,scope	   : this
					   ,handler    : this._onBtnAdicionarJazigoClick
					   ,labelWidth : 70
				       ,width      : 100
					}]},{
						 xtype      : 'fieldset'
						,autoHeight : true
						,labelWidth	: 80
						,items      : [this.gridJazigo]
					}
				]
			})						
			
			// monta as tabs
			this.tabPanel = new Ext.TabPanel({
				activeTab      : 0               
               ,border         : false
               ,plain          : true
               ,deferredRender : true
               ,scope          : this
               ,defaults       : {autoScroll: true}
			   ,items:[{
				   title : 'Contrato'					   
				  ,items : [this.formPanel]  
			   },{
				   title : 'Jazigos'
				  ,items : [this.formJazigo]						   
			   }]			           			                          
            })
			
			Ext.apply(this,{
				 items	: this.tabPanel
				,bbar	: ['->',{					
					text	: 'Imprimir'
				   ,iconCls : 'icon-print'
				   ,scope	: this
				   ,handler: this._onBtnImprimirClick
				},{xtype:'tbseparator'},{
					text	: 'Sair'
				   ,iconCls : 'silk-cross'
				   ,scope	: this
				   ,handler: function(){
					   this.hide();
				   }
				}]
			})

			//super
			cadcontrato.superclass.initComponent.call(this);
		}
		,initEvents: function()
		{			
			cadcontrato.superclass.initEvents.call(this);
			
			//grid de locatarios adicionais
			this.gridJazigo.on({
				 scope		: this
				,cellclick	: this._onGridJazigoCellClick
			})			
		}		
		,show: function()
		{
			cadcontrato.superclass.show.apply(this,arguments);
			if(this.contratoID !== 0) {				
				this.btnExcluir.show();			
				this.el.mask('Carregando informações..');				
				this.formPanel.getForm().load({
					 url     : 'contrato/buscar'
					,params  : {						
						 action      : 'buscar'
						,contrato_id : this.contratoID						
					}
				    ,scope   : this
				    ,success : this._onFormLoad
				});				
				this.storeContratojazigo.reload({					
					params: {
						contrato_id : this.contratoID
					}
				});
			}else{
				this.btnExcluir.hide();
				this.formPanel.getForm().reset();				
			}			
		}
		,onDestroy: function()
		{
			cadcontrato.superclass.onDestroy.apply(this,arguments);
			this.formPanel = null;
		}	
		,_onFormLoad: function(form, request)
		{
			var data = request.result.data;
			
			if(data.tpcontrato_id){
				this.comboTpcontrato.setValue(data.tpcontrato_id);
				this.comboTpcontrato.setRawValue(data.tpcontrato_desc);
			}
			if(data.contrato_id){
				Ext.getCmp('frmContrato').getForm().findField('locatario_desc').setDisabled(true);
			}else{
				Ext.getCmp('frmContrato').getForm().findField('locatario_desc').setDisabled(false);
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
				 url	: 'contrato/salvar'
				,params	: {
					 action	     : 'salvar'
					,contrato_id : this.contratoID
				}
				,scope: this
				,success: function(f,a) //ao terminar de submitar
				{
					this.contratoIdTextField.setValue(a.result.contrato_id);
					this.contratoID = a.result.contrato_id;					
					
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
					 url	: 'contrato/excluir'
					,params	: {
						 action	     : 'excluir'
					    ,contrato_id : this.contratoID
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
		,_onBtnAdicionarJazigoClick: function()
		{
			//pego o formulário
			var form = this.formJazigo.getForm();
			
			//verifico se é valido
			if(!form.isValid())	
			{
				Ext.Msg.alert('Atenção','Preencha corretamente todos os campos!');
				return false;
			}
			
			/*
			 * Submitando formulário
			*/
			form.submit({				
	    		waitMsgTarget : false	
	   	       ,waitTitle     : 'Por favor aguarde'
	 		   ,waitMsg       : 'Salvando informações'
	 		   ,reset         : false
			   ,url	          : 'contratojazigo/salvar'
			   ,params	      : {
				   action	   : 'salvar'
				  ,contrato_id : this.contratoID	   
			   }
			   ,scope         : this
			   ,success       : function(f,a) {				   
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
				   this.gridJazigo.store.reload();
				   Ext.getCmp('frmJazigo').getForm().findField('locatario_desc').reset();
			   }
	           ,failure: function(f,a) {	        	   
	        	   Ext.MessageBox.alert('Atenção',a.result.msg.text);
	           }
			});		
		}
		,_onGridJazigoCellClick: function(grid, row, col, e)
		{
			//busca registro da linha selecionada
			var record = grid.getStore().getAt(row);

			if(col !== 0)
				return;

			if(this.contratoID==0){
				Ext.Msg.alert('Atenção','Operação não permitida,somente consulta!');
				return false;				
			}
			
			Ext.Msg.confirm('Confirmação','Deseja mesmo excluir esse registro?',function(opt) {				
				if(opt === 'no') {
					return					
				}
				this.el.mask('Excluir informação.');
				
				Ext.Ajax.request({
					url   	: 'contratojazigo/excluir'
				   ,params	: {
						 action             : 'excluir'
					    ,contrato_jazigo_id : record.get('contrato_jazigo_id')
				   }
				   ,scope	: this
				   ,success: function(f,a)
				   {					   
					   //remove do store
					   record.store.remove(record);
					   
					   this.el.unmask();
					   this.fireEvent('excluir',this);
				   }
		           ,failure: function(f,a)
		           {
		        	   this.el.unmask();
		        	   Ext.MessageBox.alert('Atenção',a.result.msg.text);
		           }
				})					
			},this)				
		}
		,_onBtnImprimirClick: function()
		{
			
			Ext.Msg.show({
			     title  : 'Impressão contrato'			   
			    ,msg    : 'Você gostaria de imprimir o contrato ?'
			    ,buttons: {
			         yes    : 'CONCESSÃO'
			        ,no     : 'GRATUITO'
			        ,cancel : 'TEMPORARIO'
			    }
			    ,fn     : function(opcao) {
			        if(opcao=='yes'){
			        	tipo = 'CONTRATO';
			        }else if (opcao=='no'){
			        	tipo = 'GRATUITO';
			        }else if (opcao=='cancel'){
			        	tipo = 'TEMPORARIO';
			        }
					var win = new Ext.Window({
						height      : 600
					   ,width       : 1000
					   ,closeAction : 'close'
					   ,modal		: true
					   ,maximizable : true
					   ,scope	    : this
					   ,maximized   : false
					   ,title		: 'Contrato do locatario'
					   ,layout		: 'fit'
					   ,autoLoad    : {
						   url     : 'contrato/imprimir'
						  ,params  : {
							  value : tipo
						  }	   
					   }
					   ,bbar:['->',{
						   text    : 'Fechar'
		 			      ,iconCls : 'ico-sair'	   
						  ,handler : function(){
							  win.close();
							  Ext.destroy(win);
						  }
					   }]
					}).show();
			    }
			});	
		}		
});