var cadexumacao = Ext.extend(Ext.Window,{	
		 exumacaoID  : 0
		,modal		 : true
		,constrain	 : true
		,maximizable : false
		,resizable   : false
		,width		 : 700
		,height		 : 450
		,title		 : 'Exumação'
		,layout		 : 'fit'
		,buttonAlign : 'center'		
		,closeAction : 'hide'
			
		,setExumacaoID: function(exumacaoID)
		{
			this.exumacaoID = exumacaoID;
		}
		,constructor: function()
		{
			this.addEvents({
				 salvar	: true
			});

			//super
			cadexumacao.superclass.constructor.apply(this, arguments);
		}
		
		,initComponent: function()
		{
			Ext.form.Field.prototype.msgTarget = 'side';
			Ext.form.FormPanel.prototype.bodyStyle = 'padding:5px';
			Ext.form.FormPanel.prototype.labelAlign = 'right';
			Ext.QuickTips.init();		
			
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
                }
                ,fields:[
                     {name:'locatario_id'	,type:'int'}
                    ,{name:'locatario_desc' ,type:'string'}
                ]
            });
			
			//combo de causas da morte
			this.comboDestino = new Ext.form.ComboBox({
				 fieldLabel		: 'Local'
				,xtype			: 'combo'
				,hiddenName		: 'destino_id'	
				,triggerAction	: 'all'
				,valueField		: 'destino_id'
				,displayField	: 'destino_desc'
				,emptyText		: 'Selecione um destino'
				,allowBlank		: true
				,readOnly       : false
				,editable       : false
				,typeAhead      : true	
			    ,width          : '98%'
			    ,anchor         : '98%'
				,store			: new Ext.data.JsonStore({
					 url		: 'destino/todo'
					,baseParams	: {
						 action	: 'todo'
						,limit	: 30
					}
					,fields:[
						 {name: 'destino_id'  , type:'int'}
						,{name: 'destino_desc', type:'string'}
					]
				})
			    ,listeners    : {			    	
			    	select: {			    		
			    		fn: function(combo,record,value){
			    			if ((record.data.destino_id==3) || (record.data.destino_id==1)) {
			    				Ext.getCmp('formPanel').getForm().findField('jazigo_codigo_dest').setVisible(true);
			    			}else{
			    				Ext.getCmp('formPanel').getForm().findField('jazigo_codigo_dest').setVisible(false);
			    			}
				  	    }
				    }        		   
			    }		
			})

            //store do autocomplete do locatario
            this.storeObito = new Ext.data.JsonStore({
                url			: 'obito/todo'
                ,autoLoad		: false
                ,autoDestroy	: false
                ,remoteSort     : false
                ,baseParams		: {
                    action	: 'obito/todo'
                    ,limit	: 30
                }
                ,fields:[
                     {name:'obito_id'       ,type:'int'}
                    ,{name:'jazigo_codigo'  ,type:'string'}
                    ,{name:'obito_falecido' ,type:'string'}
                    ,{name:'locatario_desc' ,type:'string'}
                ]
            });

            this.comboObitofalecido = new Ext.form.ComboBox({
                fieldLabel		: 'Falecido'
                ,xtype			: 'combo'
                ,hiddenName		: 'obito_id'
                ,triggerAction	: 'all'
                ,valueField		: 'obito_id'
                ,displayField	: 'obito_falecido'
                ,emptyText		: 'Selecione um falecido'
                ,allowBlank		: false
                ,editable       : false
                ,width          : '98%'
                ,anchor         : '98%'
                ,store			: this.storeObito
                ,mode			: 'local'
                ,listeners    : {
                    select: {
                        fn: function(combo,record,value){
                            Ext.getCmp('formPanel').getForm().findField('locatario_desc').setValue(record.data.locatario_desc);
                        }
                    }
                }

            });

            //formul�rio
			this.formPanel = new Ext.form.FormPanel({
				 bodyStyle	: 'padding:10px;'
				,border		: false
				,autoScroll	: true
				,id         : 'formPanel'
				,defaultType: 'textfield'
				,defaults	: {
					anchor: '-19' 	//anchor � um config. option. excelente para formul�rio. Ele define larguras relativas
									//nesse caso a largura total -19px, que reservei para scroll
				}
				,items:[{
					xtype      : 'fieldset'
				   ,autoHeight : true
				   ,labelWidth : 80
				   ,border     : false
				   ,items      : [{
                       xtype        : 'combo'
                      ,store        : this.storeJazigo
                      ,name         : 'jazigo_codigo'
                      ,fieldLabel   : 'Origem'
                      ,displayField : 'jazigo_desc'
                      ,valueField	: 'jazigo_codigo'
                      ,loadingText  : 'Carregando...'
                      ,queryParam   : 'value'
                      ,allowBlank   : false
                      ,labelWidth   : 50
                      ,width        : 125
                      ,listeners    : {
                          select: {
                              scope: this, fn: function (combo, value) {
                                  this.comboObitofalecido.store.reload({
                                      params: {
                                          jazigo_codigo: combo.getValue()
                                      }
                                  });
                              }
                          }
                      }
                    },{
                   	   xtype      : 'datefield'
					  ,fieldLabel : 'Data'
					  ,name	      : 'exumacao_data'
					  ,allowBlank : true
	  	        	  ,maxLength  : 10
                      ,width      : 125
	  				  ,format     : 'd/m/Y'  	
	  				  ,altFormats : 'd/m/Y|j/n/Y|j/n/y|j/m/y|d/n/y|j/m/Y|d/m/Y|d-m-y|d-m-Y|d/m|d-m|dm|dmy|dmY|d|d-m-Y'			    	   
				  }
                  ,this.comboObitofalecido
                  ,{
                       xtype      : 'textfield'
                      ,fieldLabel : 'Locatario'
                      ,name	      : 'locatario_desc'
                      ,allowBlank : false
                      ,width	  : '98%'
                      ,maxLength  : 60
                      ,disabled   : true
                  },this.comboDestino,{
					   xtype        : 'combo'
					  ,store        : this.storeJazigo
					  ,name         : 'jazigo_codigo_dest'
					  ,fieldLabel   : 'Destino'
					  ,displayField : 'jazigo_desc'
					  ,valueField	: 'jazigo_codigo'	
					  ,loadingText  : 'Carregando...'				 
					  ,queryParam   : 'value'
					  ,allowBlank   : true
					  ,labelWidth   : 50
					  ,width        : 125
				  },{
                       xtype      : 'textfield'
                      ,fieldLabel : 'Nº Lacre'
                      ,name		  : 'exumacao_lacre'
                      ,allowBlank : false
                      ,width      : '50%'
                      ,anchor     : '50%'
                      ,maxLength  : 30
                    },{
					   xtype      : 'textarea'
				      ,fieldLabel : 'Observações'
				      ,name	      : 'exumacao_obs'
				      ,allowBlank : true
				      ,width	  : '96%'
        		      ,multiline  : true				  
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
			cadexumacao.superclass.initComponent.call(this);
		}
		,show: function()
		{
			cadexumacao.superclass.show.apply(this,arguments);
			if(this.exumacaoID !== 0) {				
				this.el.mask('Carregando informa��es..');
				this.formPanel.getForm().load({
					 url     : 'exumacao/buscar'
					,params  : {						
						 action      : 'buscar'
						,exumacao_id : this.exumacaoID						
					}
				    ,scope   : this
				    ,success : this._onFormLoad
				});
			}else{
				this.formPanel.getForm().reset();
				Ext.getCmp('formPanel').getForm().findField('jazigo_codigo_dest').setVisible(false);
			}
		}
		,onDestroy: function()
		{
			cadexumacao.superclass.onDestroy.apply(this,arguments);			
			this.formPanel = null;
		}	
		,_onFormLoad: function(form, request)
		{
			var data = request.result.data;
			
			if(data.destino_id){
				this.comboDestino.setValue(data.destino_id);
				this.comboDestino.setRawValue(data.destino_desc);
			}
			
			if (data.destino_id==3){
				Ext.getCmp('formPanel').getForm().findField('jazigo_codigo_dest').setVisible(true);
			}else{
				Ext.getCmp('formPanel').getForm().findField('jazigo_codigo_dest').setVisible(false);
			}			
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
				 url	: 'exumacao/salvar'
				,params	: {
					 action	     : 'salvar'
					,exumacao_id : this.exumacaoID
				}
				,scope:this
				,success: function() //ao terminar de submitar
				{
					//tir� m�scara
					this.el.unmask();
					
					//esconde janela
					this.btnSalvar.setDisabled(true);
					
					/*
					 * Muito importante! Aqui o evento salvar � disparado. Todos os listeners que foram associados
					 * a esse evento ser�o notificados, como por exemplo, o listener _onCadastroUsuarioSalvar da
					 * classe UsuarioLista.
					 */
					this.fireEvent('salvar',this);
				}
			});
		}		
});