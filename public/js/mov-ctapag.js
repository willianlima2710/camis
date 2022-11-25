var movctapag = Ext.extend(Ext.Window,{	
		 ctapagID   : 0
		,modal		 : true
		,constrain	 : true
		,maximizable : false
		,resizable   : false
		,width		 : 760
		,height		 : 600
		,title		 : 'Lançamento de contas a pagar'
		,layout		 : 'fit'
		,buttonAlign : 'center'
		,closeAction : 'hide'		
			
		,setCtapagID: function(ctapagID)
		{
			this.ctapagID = ctapagID;
		}
		,constructor: function()
		{
			this.addEvents({
				 salvar	: true
				,excluir: true
			});

			//super
			movctapag.superclass.constructor.apply(this, arguments);
		}		
		,initComponent: function()
		{
			Ext.form.Field.prototype.msgTarget = 'side';
			Ext.form.FormPanel.prototype.bodyStyle = 'padding:5px';
			Ext.form.FormPanel.prototype.labelAlign = 'right';
			Ext.QuickTips.init();

			//combo de forma de recebimento
			this.comboFornecedor = new Ext.form.ComboBox({
				 fieldLabel		: 'Fornecedor'
				,xtype			: 'combo'
         	    ,idProperty	    : 'fornecedor_id'		
				,hiddenName		: 'fornecedor_id'	
				,triggerAction	: 'all'
				,valueField		: 'fornecedor_id'
				,displayField	: 'fornecedor_desc'
				,emptyText		: 'Selecione uma fornecedor'
				,allowBlank		: false
				,readOnly       : false
				,editable       : false
			    ,width          : 350
				,store			: new Ext.data.JsonStore({
					 url		: 'fornecedor/todo'
					,baseParams	: {
						 action	: 'todo'
						,limit	: 30
					}
					,fields:[
						 {name: 'fornecedor_id'   , type:'int'}
						,{name: 'fornecedor_desc' , type:'string'}
					]
				})			
			})
			
			//combo de operações cemiteriais
			this.comboOperacao = new Ext.form.ComboBox({
				 fieldLabel		: 'Operação'
				,xtype			: 'combo'
         	    ,idProperty	    : 'operacao_id'		
				,hiddenName		: 'operacao_id'	
				,triggerAction	: 'all'
				,valueField		: 'operacao_id'
				,displayField	: 'operacao_desc'
				,emptyText		: 'Selecione uma operação'
				,allowBlank		: false
				,readOnly       : false
				,editable       : false
			    ,width          : 350
				,store			: new Ext.data.JsonStore({
					 url		: 'operacao/todo'
					,baseParams	: {
						 action	: 'todo'
						,limit	: 30
					}
					,fields:[
						 {name: 'operacao_id'   , type:'int'}
						,{name: 'operacao_desc' , type:'string'}
					]
				})			
			})
			
			//combo de forma de recebimento
			this.comboFormarec = new Ext.form.ComboBox({
				 fieldLabel		: 'Recebimento'
				,xtype			: 'combo'
         	    ,idProperty	    : 'formarec_id'		
				,hiddenName		: 'formarec_id'	
				,triggerAction	: 'all'
				,valueField		: 'formarec_id'
				,displayField	: 'formarec_desc'
				,emptyText		: 'Selecione uma forma de recebimento'
				,allowBlank		: true
				,readOnly       : false
				,editable       : false
			    ,width          : 350
				,store			: new Ext.data.JsonStore({
					 url		: 'formarec/todo'
					,baseParams	: {
						 action	: 'todo'
						,limit	: 30
					}
					,fields:[
						 {name: 'formarec_id'   , type:'int'}
						,{name: 'formarec_desc' , type:'string'}
					]
				})
			    ,listeners    : {
				   select: {
					   fn: function(combo,value){
						   Ext.getCmp('frmCtapag').getForm().findField('pagpar_parcela').setValue(1);				  				 
			  	  	   }
			  	    }        		   
			    }
			})			
			
			
			var rendererReal = function(v)
			{
				return Ext.util.Format.usMoney(v).replace('$','R$');
			}			
		
			// store do grid produtos e serviços
			this.storeFormarecGrid = new Ext.data.JsonStore({
				 data	: []
				,fields	: [
					 {name: 'formarec_id'	     ,type:'int'}
					,{name: 'formarec_desc'      ,type:'string'}					 
					,{name: 'pagpar_data_vencto' ,type:'string'}
					,{name: 'pagpar_valor'	     ,type:'float'}
					,{name: 'pagpar_pago'	     ,type:'float'}
					,{name: 'pagpar_data_pagto'  ,type:'string'}
					,{name: 'pagpar_agencia'     ,type:'string'}
					,{name: 'pagpar_conta'       ,type:'string'}
					,{name: 'pagpar_banco'       ,type:'string'}
					,{name: 'pagpar_cheque'      ,type:'string'}
					,{name: 'pagpar_parcela'     ,type:'int'}
				]
			});
			
			// grid dos produtos e serviços
			this.gridFormarec = new Ext.grid.GridPanel({
			 	 title				: 'Forma de recebimento'
				,style	 			: 'margin-top:10px;'
				,autoExpandColumn	: 'formarec_id'
				,height				: 200
				,store				: this.storeFormarecGrid
				,columns			: [{
					 header		: '&nbsp;'
					,dataIndex	: 'formarec_id'
					,align		: 'center'
					,width		: 30
					,fixed		: true
					,renderer	: function()
					{
						return '<img src="'+Ext.BLANK_IMAGE_URL+'" width="16" height="16" class="silk-delete" style="cursor:pointer;" />'
					}
				},{
					 header		    : 'Id'		
					,dataIndex	    : 'formarec_id'
					,id			    : 'formarec_id'
					,width		    : 30					
				},{
					 header		    : 'Descrição'			
					,dataIndex	    : 'formarec_desc'
					,width		    : 300
				},{
					 header		    : 'Vencimento'
					,dataIndex	    : 'pagpar_data_vencto'
					,width		    : 80
					,align		    : 'center'
					,editor         : new Ext.form.DateField({
						format: 'd/m/Y'						
					})
				   ,renderer        : Ext.util.Format.dateRenderer('d/m/Y')
				},{
					 header		    : 'Valor'	
					,dataIndex	    : 'pagpar_valor'		
					,width		    : 80
					,align		    : 'right'
				},{
					 header		    : 'Pago'	
					,dataIndex	    : 'pagpar_pago'		
					,width		    : 80
					,align		    : 'right'
				},{
					 header		    : 'Pagamento'
					,dataIndex	    : 'pagpar_data_pagto'
					,width		    : 80
					,align		    : 'center'
					,editor         : new Ext.form.DateField({
						format: 'd/m/Y'						
					})
				   ,renderer        : Ext.util.Format.dateRenderer('d/m/Y')				
				},{
					 header		    : 'Parcela'	
					,dataIndex	    : 'pagpar_parcela'		
					,width		    : 80
					,align		    : 'center'				
				},{
					 header		    : 'Agencia'	
					,dataIndex	    : 'pagpar_agencia'		
					,width		    : 80
					,align		    : 'center'
				},{
					 header		    : 'Conta'	
					,dataIndex	    : 'pagpar_conta'		
					,width		    : 80
					,align		    : 'center'
				},{
					 header		    : 'Banco'	
					,dataIndex	    : 'pagpar_banco'		
					,width		    : 80
					,align		    : 'center'
				},{
					 header		    : 'Cheque'	
				    ,dataIndex	    : 'pagpar_cheque'		
				    ,width		    : 80
				    ,align		    : 'center'
				}]
			})			
			
			//formulário	
			this.formPanel = new Ext.form.FormPanel({
				 bodyStyle	: 'padding:10px;'
				,border		: false
				,id         : 'frmCtapag'
				,autoScroll	: true				
				,defaultType: 'textfield'
				,defaults	: {
					anchor: '-5' 	//anchor é um config. option. excelente para formulário. Ele define larguras relativas
									//nesse caso a largura total -19px, que reservei para scroll
				}
				,items:[{
					 xtype      : 'fieldset'
					,title      : 'Fornecedor'
					,autoHeight : true
					,labelWidth	: 80
					,items      : [{
						xtype      : 'textfield'
					   ,fieldLabel : 'Identificador'
					   ,name	   : 'ctapag_id'
					   ,disabled   : true
				   	   ,allowBlank : true
					   ,maxLength  : 10						
					}
                    ,this.comboFornecedor
                    ,this.comboOperacao,{
						xtype      : 'textfield'
			    	   ,fieldLabel : 'Documento'
 					   ,name	   : 'ctapag_documento' 					      
					   ,allowBlank : false
					   ,maxLength  : 30	
					},{
			    	    xtype      : 'masktextfield'
					   ,fieldLabel : 'Valor total'
					   ,name	   : 'venda_total'
					   ,mask       : '9.999.990,00'
					   ,money      : true						  
					   ,allowBlank : true
					   ,disabled   : true
					},{						
						xtype      : 'textarea'
					   ,fieldLabel : 'Observações'
					   ,name	   : 'ctapag_observacao'
					   ,allowBlank : true
					   ,width      : '100%'
					   ,anchor     : '100%'  			        		  
				       ,multiline  : true				     					   
					}]},{
						 xtype      : 'fieldset'
						,title      : 'Forma de recebimento'
						,autoHeight : true
						,labelWidth	: 80
						,items      : [
                        this.comboFormarec,{
    						xtype      : 'hidden'
    					   ,labelWidth : 1
    					   ,width      : 1
 	 					   ,col        : true					   
                        },{                      	
                        	xtype      : 'datefield'
 					       ,fieldLabel : 'Vencimento'
 					       ,name	   : 'pagpar_data_vencto'
						   ,allowBlank : true
 	  	        		   ,maxLength  : 10
 	  					   ,format     : 'd/m/Y'  	
 	  					   ,altFormats : 'd/m/Y|j/n/Y|j/n/y|j/m/y|d/n/y|j/m/Y|d/m/Y|d-m-y|d-m-Y|d/m|d-m|dm|dmy|dmY|d|d-m-Y'
 	  					 //,minValue   : new Date()	   
 	  				    },{
 	  				        xtype      : 'masktextfield'
 						   ,fieldLabel : 'Valor'
 						   ,name	   : 'pagpar_valor'
 						   ,mask       : '9.999.990,00'
 						   ,money      : true						  
 						   ,allowBlank : true
 	 					   ,col        : true					   
 	  				    },{
 	  				        xtype      : 'masktextfield'
 						   ,fieldLabel : 'Pago'
 						   ,name	   : 'pagpar_pago'
 						   ,mask       : '9.999.990,00'
 						   ,money      : true						  
 						   ,allowBlank : true
 						   ,col        : true
 	  				    },{
 	  				    	 xtype      : 'datefield'
  					        ,fieldLabel : 'Pagamento'
  	 					    ,name	    : 'pagpar_data_pagto'
  							,allowBlank : true
  	 	  	        		,maxLength  : 10
  	 	  					,format     : 'd/m/Y'  	
  	 	  					,altFormats : 'd/m/Y|j/n/Y|j/n/y|j/m/y|d/n/y|j/m/Y|d/m/Y|d-m-y|d-m-Y|d/m|d-m|dm|dmy|dmY|d|d-m-Y'
 	  				    },{
 	  				    	xtype      : 'textfield'
 					       ,fieldLabel : 'Agencia'
 					       ,name	   : 'pagpar_agencia'
 						   ,allowBlank : true
 						   ,maxLength  : 20
 						   ,col        : true
 	  				    },{
 	  				    	xtype      : 'textfield'
 	 					   ,fieldLabel : 'Conta'
 	 					   ,name	   : 'pagpar_conta'
 	 					   ,allowBlank : true
 	 					   ,maxLength  : 20
 	 					   ,col        : true
 	  				    },{
 	  				    	xtype      : 'textfield'
 	 					   ,fieldLabel : 'Banco'
 	 					   ,name	   : 'pagpar_banco'
 	 					   ,allowBlank : true
 	 					   ,maxLength  : 40
 	  				    },{
 	  				    	xtype      : 'textfield'
 	 					   ,fieldLabel : 'Cheque'
 	 					   ,name	   : 'pagpar_cheque'
 	 					   ,allowBlank : true
 	 					   ,maxLength  : 40
 	 					   ,col        : true
 	  				    },{
 	 	  				   	xtype      : 'textfield'
 	 	 				   ,fieldLabel : 'Parcela'
 	 	 				   ,name	   : 'pagpar_parcela'
 	 	 				   ,allowBlank : true
 	 	 				   ,maxLength  : 10
 	 	 				   ,minValue   : 1 
 	 	  				},{ 	  				    	
 						    xtype	   : 'button'
 	  					   ,text	   : 'Adicionar'
 						   ,iconCls    : 'silk-add'
 	  					   ,style	   : 'margin-left:85px;' 	  						   
 						   ,scope	   : this
 						   ,handler    : this._onBtnAdicionarFormarecClick
 						   ,col        : true
 	  				    },this.gridFormarec]					    
					}			
				]
			})
			
			Ext.apply(this,{
				 items	: this.formPanel
				,bbar	: ['->',{					
					 text   : 'Novo'
					,iconCls: 'silk-add'
					,scope  : this
					,handler: function(){
						this.storeFormarecGrid.removeAll();
						this.formPanel.getForm().reset();
						this.formPanel.items.item(0).focus();
						this.ctapagID = 0;								
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
			movctapag.superclass.initComponent.call(this);
		}
		,initEvents: function(){
			movctapag.superclass.initEvents.call(this);
			
			//grid forma de recebimento
			this.gridFormarec.on({
				 scope		: this
				,cellclick	: this._onGridFormarecCellClick
			})			
		}		
		,show: function()
		{
			movctapag.superclass.show.apply(this,arguments);
			this.btnExcluir.hide();
			this.formPanel.getForm().reset();				
		}
		,onDestroy: function()
		{
			movctapag.superclass.onDestroy.apply(this,arguments);			
			this.formPanel = null;
		}		
		,_onFormLoad: function(form, request)
		{
			var data = request.result.data;
			this.el.unmask();			
		}
		,_onGridFormarecCellClick: function(grid, row, col, e)
		{
			if(col !== 0)
				return;			
				
			//busca registro
			var record = grid.store.getAt(row);
			
			//remove do store
			record.store.remove(record);
			
			this.comboFormarec.focus();
		}				
		,_onBtnSalvarClick: function()
		{
			//pego o formulário
			var form = this.formPanel.getForm();
			
			//verifico se é valido
			if(!form.isValid())	
			{
				Ext.Msg.alert('Atencao','Preencha corretamente todos os campos!');
				return false;
			}
			
			//verifico se tem produto ou serviços
			if(this.gridFormarec.store.getCount()===0)
			{
				Ext.Msg.alert('Atenção','É preciso adicionar ao menos uma forma de recebimento');
				return;
			}
			
			//extrai forma de recebimento
			var formarec = [];
			this.gridFormarec.store.each(function( record )
			{
				formarec.push( Ext.encode(record.data) );
			})
			
			
			//crio uma máscara
			this.el.mask('Salvando informações');			
			
			/*
			 * Submitando formulário
			 */
			form.submit({
				 url	: 'ctapag/salvar'
				,params	: {
					action	        : 'salvar'
				   ,ctapag_id       : this.ctapagID
				   ,'formarec[]'    : formarec
				   ,fornecedor_desc : this.comboFornecedor.getRawValue()
				}
				,scope:this
				,success: function(f,a) //ao terminar de submitar
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
					Ext.getCmp('frmCtapag').getForm().findField('ctapag_id').setValue(a.result.id);
					this.ctapagID = a.result.id;
					this.fireEvent('salvar',this);
				}
				,failure: function(f,a)
				{
					Ext.Msg.alert('Atenção','Erro na gravação da ctapag,contate o suporte técnico!');					
				}
			});
		}		
		,_onBtnAdicionarFormarecClick: function()
		{
			//pego o formulário
			var form = this.formPanel.getForm();
			
			//verifico se é valido
			if(!form.isValid())	
			{
				Ext.Msg.alert('Atencao','Preencha corretamente todos os campos!');
				return false;
			}

			var formarec_id = this.comboFormarec.getValue();
			var formarec_desc = this.comboFormarec.getRawValue();
			var vencto = Ext.getCmp('frmCtapag').getForm().findField('pagpar_data_vencto').getValue();
			var valor = Ext.getCmp('frmCtapag').getForm().findField('pagpar_valor').getValue(); 
			var pago = Ext.getCmp('frmCtapag').getForm().findField('pagpar_pago').getValue();
			var pagto = Ext.getCmp('frmCtapag').getForm().findField('pagpar_data_pagto').getValue();
			var agencia = Ext.getCmp('frmCtapag').getForm().findField('pagpar_agencia').getValue(); 
			var conta = Ext.getCmp('frmCtapag').getForm().findField('pagpar_conta').getValue();
			var banco = Ext.getCmp('frmCtapag').getForm().findField('pagpar_banco').getValue(); 
			var cheque = Ext.getCmp('frmCtapag').getForm().findField('pagpar_cheque').getValue();
			var parcela = Ext.getCmp('frmCtapag').getForm().findField('pagpar_parcela').getValue();
			
			
			if(!formarec_id || !vencto)
			{
				Ext.Msg.alert('Atenção','É necessário selecionar uma forma de recebimento e informar data de vencimento');
				return;
			}	
			if(parcela==0 || parcela==''){
				Ext.Msg.alert('Atenção','É necessário digitar um valor valido na parcela!');
				return;				
			}
			
			if(pago<valor && pago!=0)
			{
				Ext.Msg.alert('Atenção','Valor pago menor que o valor do titulo!');
				return;				
			}

			//cria registro	
			var newRecord = new this.gridFormarec.store.recordType({
				 formarec_id        : formarec_id
				,formarec_desc      : formarec_desc
				,pagpar_data_vencto : vencto
				,pagpar_valor       : valor
				,pagpar_pago        : pago
				,pagpar_data_pagto  : pagto
				,pagpar_agencia     : agencia
				,pagpar_conta       : conta
				,pagpar_banco       : banco
				,pagpar_cheque      : cheque
				,pagpar_parcela     : parcela
			});	
			
			
			//adiciona
			this.gridFormarec.store.add(newRecord);
			
			//reseta
			this.comboFormarec.reset();
			Ext.getCmp('frmCtapag').getForm().findField('pagpar_data_vencto').reset();
			Ext.getCmp('frmCtapag').getForm().findField('pagpar_valor').reset();
			Ext.getCmp('frmCtapag').getForm().findField('pagpar_pago').reset();
			Ext.getCmp('frmCtapag').getForm().findField('pagpar_data_pagto').reset();
			Ext.getCmp('frmCtapag').getForm().findField('pagpar_agencia').reset();
			Ext.getCmp('frmCtapag').getForm().findField('pagpar_conta').reset();
			Ext.getCmp('frmCtapag').getForm().findField('pagpar_banco').reset();			
			Ext.getCmp('frmCtapag').getForm().findField('pagpar_cheque').reset();
  		    Ext.getCmp('frmCtapag').getForm().findField('pagpar_parcela').reset();
			this.comboFormarec.focus();
		}
});