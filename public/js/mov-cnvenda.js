var movcnvenda = Ext.extend(Ext.Window,{	
		 vendaID     : 0
		,modal		 : true
		,constrain	 : true
		,maximizable : false
		,resizable   : false
		,width		 : 760
		,height		 : 600
		,title		 : 'Movimentação de venda'
		,layout		 : 'fit'
		,buttonAlign : 'center'
		,closeAction : 'hide'		
			
		,setCnvendaID: function(vendaID)
		{
			this.vendaID = vendaID;
		}
		,constructor: function()
		{
			this.addEvents({
				 salvar	: true
				,excluir: true
			});

			//super
			movcnvenda.superclass.constructor.apply(this, arguments);
		}		
		,initComponent: function()
		{
			Ext.form.Field.prototype.msgTarget = 'side';
			Ext.form.FormPanel.prototype.bodyStyle = 'padding:5px';
			Ext.form.FormPanel.prototype.labelAlign = 'right';
			Ext.QuickTips.init();
			
			var agora = new Date();
		
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
			
			//store do autocomplete dos produtos e serviços
			this.storeProdserv = new Ext.data.JsonStore({
				 url			: 'prodserv/autocomplete'
				,root			: 'rows'
				,idProperty		: 'prodserv_id'					
				,autoLoad		: true
				,autoDestroy	: true
				,remoteSort     : true
				,baseParams		: {
					 action	: 'prodserv/autocomplete'
					,limit	: 30
				}				
				,fields:[
					 {name:'prodserv_id'    ,type:'int'}
					,{name:'prodserv_desc'  ,type:'string'}
					,{name:'prodserv_valor' ,type:'float'}
				]
			});			
			
			//combo dos produtos e serviços
			this.comboProdserv = new Ext.form.ComboBox({
				xtype        : 'combo'
			   ,store        : this.storeProdserv
			   ,idProperty	 : 'pdsv_id'
			   ,name         : 'prodserv_desc'
	           ,fieldLabel   : 'Produto/Serviço'
			   ,displayField : 'prodserv_desc'
			   ,valueField	 : 'prodserv_id'	
			   ,loadingText  : 'Carregando...'				 
			   ,queryParam   : 'value'
			   ,width        : 350				   
			   ,listeners    : {
				   select: {
					   fn: function(combo,record,value){
						   var valor = record.data.prodserv_valor;
						   var quantidade = 1;					   
						   				  				 
						   Ext.getCmp('frmVenda').getForm().findField('venda_pdsv_quantidade').setValue(quantidade);
						   Ext.getCmp('frmVenda').getForm().findField('venda_pdsv_valor').setValue(valor);						   
				  	   }
				   }        		   
			   }				
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
						 {name: 'formarec_id'       , type:'int'}
						,{name: 'formarec_desc'     , type:'string'}
						,{name: 'formarec_inavista' , type:'string'}
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
						 {name: 'operacao_id'        ,type:'int'}
						,{name: 'operacao_desc'      ,type:'string'}
						,{name: 'operacao_infaturar' ,type:'int'}						
					]
				})
			    ,listeners    : {
				   select: {
					   fn: function(combo,record,value){
						   Ext.getCmp('frmVenda').getForm().findField('venda_infaturar').setValue(record.data.operacao_infaturar);
				  	   }
				   }        		   
			    }							
			})			
			
			// store do grid produtos e serviços			
			this.storePdsvGrid = new Ext.data.JsonStore({				
				url			  : 'vendapdsv/listar'
			   ,root		  : 'rows'					
			   ,autoLoad	  : false 
			   ,autoDestroy	  : true
        	   ,remoteSort    : true
        	   ,scope         : this        	   
			   ,baseParams	  : {
				   action : 'vendapdsv/listar'
				  ,limit  : 30
			   }
			   ,fields : [	
                    {name: 'venda_id'	           ,type:'int'}   	   
				   ,{name: 'prodserv_id'	       ,type:'int'}   	   
				   ,{name: 'prodserv_desc'	       ,type:'string'}
				   ,{name: 'venda_pdsv_quantidade' ,type:'float'}
				   ,{name: 'venda_pdsv_valor'      ,type:'float'}
				   ,{name: 'venda_pdsv_total'      ,type:'float'}
			   ]
			});					
		
			var rendererReal = function(v)
			{
				return Ext.util.Format.usMoney(v).replace('$','R$');
			}
			
			// utilize custom extension for Group Summary
			var summary = new Ext.ux.grid.GridSummary();			
			
			// grid dos produtos e serviços
			this.gridPdsrv = new Ext.grid.GridPanel({
			 	 title			  : 'Produtos e Serviços selecionados'
				,style	 		  : 'margin-top:10px;'
				,height			  : 200
				,store			  : this.storePdsvGrid
				,autoScroll       : true
				,plugins		  : summary
				,columns		  : [{
					 header		    : 'Id'			
					,dataIndex	    : 'prodserv_id'
					,id			    : 'prodserv_id'
					,width		    : 30					
				},{
					 header		    : 'Descrição'			
					,dataIndex	    : 'prodserv_desc'
					,width		    : 300
				},{
					 header		    : 'Quantidade'
					,dataIndex	    : 'venda_pdsv_quantidade'
					,summaryType    : 'sum'
					,width		    : 80
					,align		    : 'center'
				},{
					 header		    : 'Valor Unitário'	
					,dataIndex	    : 'venda_pdsv_valor'		
					,width		    : 80
					,align		    : 'center'
					,summaryType    : 'sum'
					,renderer	    : rendererReal
				},{
					 header			: 'Valor Total'		
					,dataIndex		: 'venda_pdsv_total'		
					,align			: 'center'
					,id				: 'venda_pdsv_total'
					,summaryType	: 'sum'
					,width			: 80
					,renderer		: rendererReal
      				,summaryRenderer: rendererReal
				}]
			})	
			
			// store do grid produtos e serviços
			this.storeFormarecGrid = new Ext.data.JsonStore({				
				url			  : 'vendarec/listar'
			   ,root		  : 'rows'					
			   ,autoLoad	  : false 
			   ,autoDestroy	  : true
		       ,remoteSort    : true
		       ,scope         : this        	   
			   ,baseParams	  : {
				   action : 'vendarec/listar'
				  ,limit  : 30
			   } 
			   ,fields : [			          	   
					 {name: 'formarec_id'	        ,type:'int'}
					,{name: 'formarec_desc'         ,type:'string'}					 
					,{name: 'venda_rec_valor'	    ,type:'float'}
					,{name: 'venda_rec_pago'	    ,type:'float'}
					,{name: 'venda_rec_agencia'     ,type:'string'}
					,{name: 'venda_rec_conta'       ,type:'string'}
					,{name: 'venda_rec_banco'       ,type:'string'}
					,{name: 'venda_rec_cheque'      ,type:'string'}
					,{name: 'venda_rec_parcela'     ,type:'int'}					
			  ]
			});
			
			// grid dos produtos e serviços
			this.gridFormarec = new Ext.grid.GridPanel({
			 	 title				: 'Forma de recebimento'
				,style	 			: 'margin-top:10px;'
				,height				: 200
				,store				: this.storeFormarecGrid
				,columns			: [{
					 header		    : 'Parcela'		
					,dataIndex	    : 'venda_rec_parcela'
					,width		    : 80					
				},{
					 header		    : 'Descrição'			
					,dataIndex	    : 'formarec_desc'
					,width		    : 300
				},{
					 header		    : 'Valor'	
					,dataIndex	    : 'venda_rec_valor'		
					,width		    : 80
					,align		    : 'right'
				},{
					 header		    : 'Pago'	
					,dataIndex	    : 'venda_rec_pago'		
					,width		    : 80
					,align		    : 'right'
				}]
			})			
			
			//formulário	
			this.formPanel = new Ext.form.FormPanel({
				 bodyStyle	: 'padding:10px;'
				,border		: false
				,id         : 'frmVenda'
				,autoScroll	: true				
				,defaultType: 'textfield'
				,defaults	: {
					anchor: '-5' 	//anchor é um config. option. excelente para formulário. Ele define larguras relativas
									//nesse caso a largura total -19px, que reservei para scroll
				}
				,items:[{
					 xtype      : 'fieldset'
					,title      : 'Locatario'
					,autoHeight : true
					,labelWidth	: 80
					,items      : [{
						xtype        : 'combo'
					   ,store        : this.storeLocatario
					   ,name         : 'locatario_desc'
					   ,fieldLabel   : 'Locatario'
					   ,displayField : 'locatario_desc'
					   ,valueField	 : 'locatario_id'	
					   ,loadingText  : 'Carregando...'				 
					   ,queryParam   : 'value'
					   ,allowBlank   : false
					   ,width        : 350
					   ,listeners    : {
						   select: {
							   fn: function(combo,value){
								   Ext.getCmp('frmVenda').getForm().findField('locatario_id').setValue(combo.getValue());								   
					  	  	   }
					  	    }        		   
					    }
				    },{
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
					   ,col          : true
					},{
						xtype      : 'hidden'
			    	   ,fieldLabel : 'Locatario'
 					   ,name	   : 'locatario_id'
					   ,allowBlank : false
					   ,maxLength  : 30
					   ,labelWidth : 5
				       ,width      : 5
					},this.comboOperacao,{
						xtype      : 'checkbox'
			    	   ,fieldLabel : 'Faturar ?'
 					   ,name	   : 'venda_infaturar'
					   ,allowBlank : false
					   ,disabled   : true
				       ,col        : true
					},{
						xtype      : 'textfield'
			    	   ,fieldLabel : 'Recibo'
 					   ,name	   : 'venda_documento'
 					   ,disabled   : true   
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
					   ,width      : 100
					   ,col        : true
					},{
						xtype      : 'hidden'
					   ,fieldLabel : 'Id'
		 			   ,name	   : 'venda_id'
		 			   ,id         : 'venda_id' 	   
 	 				   ,disabled   : true			   
					   ,allowBlank : false
					   ,maxLength  : 30	
					   ,col        : true
					}]},{
						 xtype      : 'fieldset'
						,title      : 'Produtos e Serviços'
						,autoHeight : true
						,labelWidth	: 80
						,items      : [
						this.comboProdserv,{
    						xtype      : 'hidden'
	    				   ,labelWidth : 1
    	    			   ,width      : 1
    	 	 			   ,col        : true
						},{
							xtype      : 'masktextfield'
						   ,fieldLabel : 'Quantidade'
						   ,name	   : 'venda_pdsv_quantidade'
						   ,mask       : '9.999.990,00'
						   ,money      : true						  
						   ,allowBlank : true
					    },{
				    	    xtype      : 'masktextfield'
						   ,fieldLabel : 'Valor'
						   ,name	   : 'venda_pdsv_valor'
						   ,mask       : '9.999.990,00'
						   ,money      : true						  
						   ,allowBlank : true
						   ,labelWidth : 70
					       ,width      : 100
					       ,col        : true					   
					    },{
					    	xtype	   : 'button'
  						   ,text  	   : 'Adicionar'
						   ,iconCls    : 'silk-add'
  						   ,style	   : 'margin-left:85px;'
   						   ,id         : 'btnAdicionarProdserv'  							   
						   ,scope	   : this
						   ,handler    : this._onBtnAdicionarProdservClick
						   ,labelWidth : 70
					       ,width      : 100
					       ,col        : true
						},this.gridPdsrv]
					},{
						 xtype      : 'fieldset'
						,title      : 'Forma de recebimento'
						,autoHeight : true
						,labelWidth	: 80
						,items      : [
                        this.comboFormarec,{
                        	xtype         : 'combo'							
				 		   ,hiddenName    : 'venda_dia_vencto'
					 	   ,fieldLabel    : 'Dia'	
						   ,allowBlank    : true
						   ,readOnly      : false
						   ,editable      : false
						   ,store         : new Ext.data.ArrayStore({							  
							  fields : ['id','field']
							 ,data   : [['05', '05'],['10', '10'],['15','15'],['20','20'],['28','28']] 
						   })
						   ,valueField    : 'id'
					  	   ,displayField  : 'field'
						   ,typeAhead     : true	
						   ,mode          : 'local'					
						   ,triggerAction : 'all'
						   ,width         : 45
						   ,col           : true
 	  				    },{
 	  				    	xtype      : 'textfield'
 					       ,fieldLabel : 'Nº Parcelas'
 					       ,name	   : 'venda_rec_parcela'
 						   ,allowBlank : true
 						   ,maxLength  : 20
 	  				    },{ 	  				    	
				    	    xtype      : 'masktextfield'
						   ,fieldLabel : 'Entrada'
						   ,name	   : 'venda_rec_entrada'
						   ,mask       : '9.999.990,00'
						   ,money      : true						  
						   ,allowBlank : true
						   ,labelWidth : 70
					       ,width      : 100
					       ,col        : true
 	 	  				},{ 	  				    	
 						    xtype	   : 'button'
 	  					   ,text	   : 'Gerar parcelamento'
 						   ,iconCls    : 'silk-add'
 						   ,id         : 'btnAdicionarformarec'	   
 	  					   ,style	   : 'margin-left:20px;'
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
					 text	: 'Sair'					 	 
					,iconCls: 'silk-cross'
					,scope	: this
					,handler: function(){						
						this.hide();
					}
				}]
			})
			
			//super
			movcnvenda.superclass.initComponent.call(this);
		}
		,initEvents: function(){
			movcnvenda.superclass.initEvents.call(this);			
		}		
		,show: function()
		{			
			movcnvenda.superclass.show.apply(this,arguments);
			this.el.mask('Carregando informações..');				
			this.formPanel.getForm().load({
				 url     : 'venda/buscar'
				,params  : {						
					 action   : 'buscar'
					,venda_id : this.vendaID						
				}
			    ,scope   : this
			    ,success : this._onFormLoad
			});				
			
			// recarrega os dados do produto e serviços
			this.storePdsvGrid.reload({
				params: {
					value  : this.vendaID
				   ,field  : 'venda_id'
			   }
			});
			
			// recarrega os dados da forma de recebimento
			this.storeFormarecGrid.reload({
				params: {
					value  : this.vendaID
				   ,field  : 'venda_id'
			   }
			});		
						
		}
		,onDestroy: function()
		{
			movcnvenda.superclass.onDestroy.apply(this,arguments);
			Ext.destroy('venda_id');this.formPanel = null;
		}		
		,_onFormLoad: function(form, request)
		{
			var data = request.result.data;
			if(data.operacao_id){
				this.comboOperacao.setValue(data.operacao_id);
				this.comboOperacao.setRawValue(data.operacao_desc);
				
				Ext.getCmp('btnAdicionarformarec').setDisabled(true);
				Ext.getCmp('btnAdicionarProdserv').setDisabled(true);				
			}
			this.el.unmask();			
		}				
});