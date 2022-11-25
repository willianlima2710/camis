var movvenda = Ext.extend(Ext.Window,{	
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
			
		,setVendaID: function(vendaID)
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
			movvenda.superclass.constructor.apply(this, arguments);
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
					 action	    : 'jazigo/autocomplete'
					,limit	    : 30
				}				
				,fields:[
					 {name:'jazigo_codigo'     ,type:'string'}
					,{name:'jazigo_desc'       ,type:'string'}
					,{name:'jazigo_disponivel' ,type:'int'}
				]
			});
			
			//store do autocomplete dos produtos e servi�os
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
			
			//combo dos produtos e servi�os
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
			    ,listeners      : {			    	
			        scope : this
			       ,select: {			    	   
			    		fn: function(combo,record,value){			    			
			    			if(record.data.formarec_inavista==1){
			    				Ext.getCmp('frmVenda').getForm().findField('venda_rec_data_vencto').setValue(agora);
			    				Ext.getCmp('frmVenda').getForm().findField('venda_rec_data_pagto').setValue(agora);
			    				
			    				//Ext.getCmp('frmVenda').getForm().findField('venda_rec_data_vencto').setDisabled(true);
			    				//Ext.getCmp('frmVenda').getForm().findField('venda_rec_data_pagto').setDisabled(true);
			    				
			    				// verifica o total geral dos produtos 
			    				var total = 0;
			    				this.gridPdsrv.store.each(function( record )
			    				{			    					
			    					total = total + parseFloat(record.data.venda_pdsv_total);
			    				});
			    				Ext.getCmp('frmVenda').getForm().findField('venda_rec_valor').setValue(total);
			    				Ext.getCmp('frmVenda').getForm().findField('venda_rec_pago').setValue(total);
			    				
			    				//Ext.getCmp('frmVenda').getForm().findField('venda_rec_valor').setDisabled(true);
			    				//Ext.getCmp('frmVenda').getForm().findField('venda_rec_pago').setDisabled(true);							    				
			    			}else{
			    				Ext.getCmp('frmVenda').getForm().findField('venda_rec_data_vencto').setValue('');
			    				Ext.getCmp('frmVenda').getForm().findField('venda_rec_data_pagto').setValue('');
			    				
			    				Ext.getCmp('frmVenda').getForm().findField('venda_rec_data_vencto').setDisabled(false);
			    				Ext.getCmp('frmVenda').getForm().findField('venda_rec_data_pagto').setDisabled(false);
			    				Ext.getCmp('frmVenda').getForm().findField('venda_rec_valor').setDisabled(false);
			    				Ext.getCmp('frmVenda').getForm().findField('venda_rec_pago').setDisabled(false);			    				
			    				Ext.getCmp('frmVenda').getForm().findField('venda_rec_valor').setValue(0);
			    				Ext.getCmp('frmVenda').getForm().findField('venda_rec_pago').setValue(0);
			    			}				    
				  	    }
				    }        		   
			    }
			})
			
			//combo de opera��es cemiteriais
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
			       scope : this	
				  ,select: {
					   fn: function(combo,record,value){
						   Ext.getCmp('frmVenda').getForm().findField('venda_infaturar').setValue(record.data.operacao_infaturar);				    

						   if((record.data.operacao_id==2 || record.data.operacao_id==969) && (this.storeJazigo.getAt(0).data.jazigo_disponivel==0)) 
						   {
		   					  Ext.Msg.alert('Atenção','Jazigo não disponivel para venda!');
							  return;				
						   };
				  	   }
				   }        		   
			    }							
			})			
			
			// store do grid produtos e servi�os			
			this.storePdsvGrid = new Ext.data.JsonStore({				
				url			  : 'vendapdsv/listar'
			   ,root		  : 'rows'					
			   ,idProperty	  : 'venda_id'
			   ,totalProperty : 'totalCount'
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
			
			// grid dos produtos e servi�os
			this.gridPdsrv = new Ext.grid.GridPanel({
			 	 title			  : 'Produtos e Serviços selecionados'
				,style	 		  : 'margin-top:10px;'
				,autoExpandColumn : 'prodserv_id'
				,height			  : 200
				,store			  : this.storePdsvGrid
				,autoScroll       : true
				,plugins		  : summary
				,columns		  : [{
					 header		: '&nbsp;'
					,dataIndex	: 'prodserv_id'
					,align		: 'center'
					,width		: 30
					,fixed		: true
					,renderer	: function()
					{
						return '<img src="'+Ext.BLANK_IMAGE_URL+'" width="16" height="16" class="silk-delete" style="cursor:pointer;" />'
					}
				},{
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
			
			// store do grid produtos e servi�os
			this.storeFormarecGrid = new Ext.data.JsonStore({				
				url			  : 'vendarec/listar'
			   ,root		  : 'rows'					
			   ,idProperty	  : 'venda_id'
			   ,totalProperty : 'totalCount'
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
					,{name: 'venda_rec_data_vencto' ,type:'string'}
					,{name: 'venda_rec_valor'	    ,type:'float'}
					,{name: 'venda_rec_pago'	    ,type:'float'}
					,{name: 'venda_rec_data_pagto'  ,type:'string'}
					,{name: 'venda_rec_agencia'     ,type:'string'}
					,{name: 'venda_rec_conta'       ,type:'string'}
					,{name: 'venda_rec_banco'       ,type:'string'}
					,{name: 'venda_rec_cheque'      ,type:'string'}
			  ]
			});
			
			// grid dos produtos e servi�os
			this.gridFormarec = new Ext.grid.GridPanel({
			 	 title				: 'Forma de recebimento'
				,style	 			: 'margin-top:10px;'
				,autoExpandColumn	: 'formarec_id'
				,height				: 200
				,store				: this.storeFormarecGrid
				,columns			: [{
					 header		: '&nbsp;'
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
					,dataIndex	    : 'venda_rec_data_vencto'
					,width		    : 80
					,align		    : 'center'
					,editor         : new Ext.form.DateField({
						format: 'd/m/Y'						
					})
				   ,renderer        : Ext.util.Format.dateRenderer('d/m/Y')
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
				},{
					 header		    : 'Pagamento'
					,dataIndex	    : 'venda_rec_data_pagto'
					,width		    : 80
					,align		    : 'center'
					,editor         : new Ext.form.DateField({
						format: 'd/m/Y'						
					})
				   ,renderer        : Ext.util.Format.dateRenderer('d/m/Y')				
				},{
					 header		    : 'Agencia'	
					,dataIndex	    : 'venda_rec_agencia'		
					,width		    : 80
					,align		    : 'center'
				},{
					 header		    : 'Conta'	
					,dataIndex	    : 'venda_rec_conta'		
					,width		    : 80
					,align		    : 'center'
				},{
					 header		    : 'Banco'	
					,dataIndex	    : 'venda_rec_banco'		
					,width		    : 80
					,align		    : 'center'
				},{
					 header		    : 'Cheque'	
				    ,dataIndex	    : 'venda_rec_cheque'		
				    ,width		    : 80
				    ,align		    : 'center'
				}]
			})			
			
			//formul�rio	
			this.formPanel = new Ext.form.FormPanel({
				 bodyStyle	: 'padding:10px;'
				,border		: false
				,id         : 'frmVenda'
				,autoScroll	: true				
				,defaultType: 'textfield'
				,defaults	: {
					anchor: '-5' 	//anchor � um config. option. excelente para formul�rio. Ele define larguras relativas
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
    						xtype      : 'hidden'
    					   ,labelWidth : 1
    					   ,width      : 1
 	 					   ,col        : true					   
                        },{                      	
                        	xtype      : 'datefield'
 					       ,fieldLabel : 'Vencimento'
 					       ,name	   : 'venda_rec_data_vencto'
						   ,allowBlank : true
 	  	        		   ,maxLength  : 10
 	  					   ,format     : 'd/m/Y'  	
 	  					   ,altFormats : 'd/m/Y|j/n/Y|j/n/y|j/m/y|d/n/y|j/m/Y|d/m/Y|d-m-y|d-m-Y|d/m|d-m|dm|dmy|dmY|d|d-m-Y'
 	  					  // ,minValue   : new Date()	   
 	  				    },{
 	  				        xtype      : 'masktextfield'
 						   ,fieldLabel : 'Valor'
 						   ,name	   : 'venda_rec_valor'
 						   ,mask       : '9.999.990,00'
 						   ,money      : true						  
 						   ,allowBlank : true
 	 					   ,labelWidth : 70
 	 					   ,width      : 100
 	 					   ,col        : true					   
 	  				    },{
 	  				        xtype      : 'masktextfield'
 						   ,fieldLabel : 'Pago'
 						   ,name	   : 'venda_rec_pago'
 						   ,mask       : '9.999.990,00'
 						   ,money      : true						  
 						   ,allowBlank : true
 	  				    },{
 	  				    	 xtype      : 'datefield'
  					        ,fieldLabel : 'Pagamento'
  	 					    ,name	    : 'venda_rec_data_pagto'
  							,allowBlank : true
  	 	  	        		,maxLength  : 10
  	 	  					,format     : 'd/m/Y'  	
  	 	  					,altFormats : 'd/m/Y|j/n/Y|j/n/y|j/m/y|d/n/y|j/m/Y|d/m/Y|d-m-y|d-m-Y|d/m|d-m|dm|dmy|dmY|d|d-m-Y'
 	 					    ,labelWidth : 70
 	 					    ,width      : 100
  	 	 					,col        : true 	  						
 	  				    },{
 	  				    	xtype      : 'textfield'
 					       ,fieldLabel : 'Agencia'
 					       ,name	   : 'venda_rec_agencia'
 						   ,allowBlank : true
 						   ,maxLength  : 20
 	  				    },{
 	  				    	xtype      : 'textfield'
 	 					   ,fieldLabel : 'Conta'
 	 					   ,name	   : 'venda_rec_conta'
 	 					   ,allowBlank : true
 	 					   ,maxLength  : 20
 	 					   ,labelWidth : 70
 	 					   ,width      : 100
 	 					   ,col        : true
 	  				    },{
 	  				    	xtype      : 'textfield'
 	 					   ,fieldLabel : 'Banco'
 	 					   ,name	   : 'venda_rec_banco'
 	 					   ,allowBlank : true
 	 					   ,maxLength  : 40
 	  				    },{
 	  				    	xtype      : 'textfield'
 	 					   ,fieldLabel : 'Cheque'
 	 					   ,name	   : 'venda_rec_cheque'
 	 					   ,allowBlank : true
 	 					   ,maxLength  : 40
 	 					   ,labelWidth : 70
 	 					   ,width      : 100
 	 					   ,col        : true 					   
 	 	  				},{ 	  				    	
 						    xtype	   : 'button'
 	  					   ,text	   : 'Adicionar'
 						   ,iconCls    : 'silk-add'
 						   ,id         : 'btnAdicionarformarec'	   
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
					text   : 'Nota fiscal'					 	 
				   ,iconCls: 'silk-overlays'
				   ,scope  : this
				   ,handler: function(){
					   Ext.Msg.alert('Aten��o','Certificado digital n�o instalado!');
				   }			
				},{
					text   : 'Recibo'					 	 
				   ,iconCls: 'ico_recibo'
				   ,scope  : this
				   ,handler: this._onBtnReciboClick 		
				},{xtype:'tbseparator'},{					
					 text   : 'Novo'
					,iconCls: 'silk-add'
					,scope  : this
					,handler: this._onBtnNovoClick										
				},{
					 text	: 'Salvar'
				    ,id     : 'btnSalvar'						 
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
			movvenda.superclass.initComponent.call(this);
		}
		,initEvents: function(){
			movvenda.superclass.initEvents.call(this);
			
			//grid produtos e servi�os
			this.gridPdsrv.on({
				 scope		: this
				,cellclick	: this._onGridPdsrvCellClick
			})
			
			//grid forma de recebimento
			this.gridFormarec.on({
				 scope		: this
				,cellclick	: this._onGridFormarecCellClick
			})			
		}		
		,show: function()
		{			
			movvenda.superclass.show.apply(this,arguments);		

			if(this.vendaID !== 0) {				
				this.btnExcluir.show();			
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
				
				// recarrega os dados do produto e servi�os
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
				
				Ext.getCmp('btnSalvar').setDisabled(true);
			}else{
				this.btnExcluir.hide();
				this.formPanel.getForm().reset();				
			}		
		}
		,onDestroy: function()
		{
			movvenda.superclass.onDestroy.apply(this,arguments);
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
		,_onGridPdsrvCellClick: function(grid, row, col, e)
		{
			if(col !== 0)
				return;
			
			if(this.vendaID!==0){
				Ext.Msg.alert('Atenção','Operação não permitida,somente consulta!');
				return false;				
			}
				
			//busca registro
			var record = grid.store.getAt(row);
			
			//remove do store
			record.store.remove(record);
			
			this.comboProdserv.focus();
		}
		,_onGridFormarecCellClick: function(grid, row, col, e)
		{
			if(col !== 0)
				return;			

			if(this.vendaID!==0){
				Ext.Msg.alert('Atenção','Operação não permitida,somente consulta!');
				return false;				
			}
			
			//busca registro
			var record = grid.store.getAt(row);
			
			//remove do store
			record.store.remove(record);
			
			this.comboFormarec.focus();
		}
		,_onBtnNovoClick: function()
		{
			this.formPanel.getForm().reset();
			this.storePdsvGrid.removeAll();
			this.storeFormarecGrid.removeAll();
			Ext.getCmp('btnSalvar').setDisabled(false);
			Ext.getCmp('btnAdicionarformarec').setDisabled(false);
			Ext.getCmp('btnAdicionarProdserv').setDisabled(false);
			this.vendaID = 0;
		}		
		,_onBtnSalvarClick: function()
		{
			//pego o formul�rio
			var form = this.formPanel.getForm();
			
			//verifico se � valido
			if(!form.isValid())	
			{
				Ext.Msg.alert('Atencao','Preencha corretamente todos os campos!');
				return false;
			}
			
			//verifico se tem produto ou servi�os
			if(this.gridPdsrv.store.getCount()===0)
			{
				Ext.Msg.alert('Atenção','É preciso adicionar ao menos um produto/serviço');
				return;
			}
			
			//verifico se tem produto ou servi�os
			if(this.gridFormarec.store.getCount()===0)
			{
				Ext.Msg.alert('Atenção','É preciso adicionar ao menos uma forma de recebimento');
				return;
			}
			
			//extrai produtos da nota fiscal
			var pdsv = [];
			this.gridPdsrv.store.each(function( record )
			{				
				pdsv.push( Ext.encode(record.data) );
			})
			
			//extrai forma de recebimento
			var formarec = [];
			this.gridFormarec.store.each(function( record )
			{
				formarec.push( Ext.encode(record.data) );
			})
			
			
			//crio uma m�scara
			this.el.mask('Salvando informações');
			
			/*
			 * Submitando formul�rio
			 */
			form.submit({
				 url	: 'venda/salvar'
				,params	: {
					action	     : 'salvar'
				   ,venda_id     : this.vendaID
				   ,'pdsv[]'     : pdsv
				   ,'formarec[]' : formarec
				}
				,scope:this
				,success: function(f,a) //ao terminar de submitar
				{
					//tir� m�scara
					this.el.unmask();
					Ext.getCmp('venda_id').setValue(a.result.id);
					Ext.getCmp('btnSalvar').setDisabled(true);
					this.fireEvent('salvar',this);
					Ext.Msg.alert('Atenção','Registro gravado com sucesso!');
				}
				,failure: function(f,a)
				{
					Ext.Msg.alert('Atenção','Erro na gravação da venda,contate o suporte técnico!');
				}
			});
		}		
		,_onBtnDeleteClick: function()
		{
			Ext.Msg.confirm('Confirmação','Deseja mesmo excluir esse registro?',function(opt) {
				if(opt === 'no') {
					return					
				}
				this.el.mask('Excluir');
				
				Ext.Ajax.request({
					 url	: 'venda/excluir'
					,params	: {
						 action	  : 'excluir'
					    ,venda_id : this.vendaID
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
		,_onBtnAdicionarProdservClick: function()
		{
			if(this.vendaID!==0){
				Ext.Msg.alert('Atenção','Operação não permitida,somente consulta!');
				return false;				
			}

			//busca os dados			
			var recordProduto = this.comboProdserv.getStore().getById(this.comboProdserv.getValue());
			var qtde = Ext.getCmp('frmVenda').getForm().findField('venda_pdsv_quantidade').getValue();
			var valor = Ext.getCmp('frmVenda').getForm().findField('venda_pdsv_valor').getValue(); 
			
			if( !recordProduto || !qtde )
			{
				Ext.Msg.alert('Atenção','É necessário selecionar um produto e informar uma quantidade');
				return;
			}	

			//cria registro	
			var newRecord = new this.gridPdsrv.store.recordType({
				 prodserv_id           : recordProduto.data.prodserv_id
				,prodserv_desc         : recordProduto.data.prodserv_desc
				,venda_pdsv_quantidade : qtde
				,venda_pdsv_valor      : valor
				,venda_pdsv_total  	   : (qtde * valor).toFixed(2)				
			});	
			
			
			//adiciona
			this.gridPdsrv.store.add(newRecord);
			
			//reseta
			this.comboProdserv.reset();
			Ext.getCmp('frmVenda').getForm().findField('venda_pdsv_quantidade').reset();
			Ext.getCmp('frmVenda').getForm().findField('venda_pdsv_valor').reset();
			this.comboProdserv.focus();
		}
		,_onBtnAdicionarFormarecClick: function()
		{
			if(this.vendaID!==0){
				Ext.Msg.alert('Atenção','Operação não permitida,somente consulta!');
				return false;				
			}

			//pego o formul�rio
			var form = this.formPanel.getForm();
			
			//verifico se � valido
			if(!form.isValid())	
			{
				Ext.Msg.alert('Atencao','Preencha corretamente todos os campos!');
				return false;
			}

			var formarec_id = this.comboFormarec.getValue();
			var formarec_desc = this.comboFormarec.getRawValue();
			var vencto = Ext.getCmp('frmVenda').getForm().findField('venda_rec_data_vencto').getValue();
			var valor = Ext.getCmp('frmVenda').getForm().findField('venda_rec_valor').getValue(); 
			var pago = Ext.getCmp('frmVenda').getForm().findField('venda_rec_pago').getValue();
			var pagto = Ext.getCmp('frmVenda').getForm().findField('venda_rec_data_pagto').getValue();
			var agencia = Ext.getCmp('frmVenda').getForm().findField('venda_rec_agencia').getValue(); 
			var conta = Ext.getCmp('frmVenda').getForm().findField('venda_rec_conta').getValue();
			var banco = Ext.getCmp('frmVenda').getForm().findField('venda_rec_banco').getValue(); 
			var cheque = Ext.getCmp('frmVenda').getForm().findField('venda_rec_cheque').getValue();
			
			if(!formarec_id || !vencto)
			{
				Ext.Msg.alert('Aten��o','� necess�rio selecionar um produto e informar uma quantidade');
				return;
			}	
			
			if(pago<valor && pago!=0)
			{
				Ext.Msg.alert('Atenção','Valor pago menor que o valor do produto/serviço!');
				return;				
			}

			//cria registro	
			var newRecord = new this.gridFormarec.store.recordType({
				 formarec_id           : formarec_id
				,formarec_desc         : formarec_desc
				,venda_rec_data_vencto : vencto
				,venda_rec_valor       : valor
				,venda_rec_pago        : pago
				,venda_rec_data_pagto  : pagto
				,venda_rec_agencia     : agencia
				,venda_rec_conta       : conta
				,venda_rec_banco       : banco
				,venda_rec_cheque      : cheque
			});	
			
			
			//adiciona
			this.gridFormarec.store.add(newRecord);
			
			//reseta
			this.comboFormarec.reset();
			Ext.getCmp('frmVenda').getForm().findField('venda_rec_data_vencto').reset();
			Ext.getCmp('frmVenda').getForm().findField('venda_rec_valor').reset();
			Ext.getCmp('frmVenda').getForm().findField('venda_rec_pago').reset();
			Ext.getCmp('frmVenda').getForm().findField('venda_rec_data_pagto').reset();
			Ext.getCmp('frmVenda').getForm().findField('venda_rec_agencia').reset();
			Ext.getCmp('frmVenda').getForm().findField('venda_rec_conta').reset();
			Ext.getCmp('frmVenda').getForm().findField('venda_rec_banco').reset();			
			Ext.getCmp('frmVenda').getForm().findField('venda_rec_cheque').reset();
			this.comboFormarec.focus();
		}
		,_onBtnReciboClick: function()
		{
			if(!Ext.getCmp('venda_id').getValue())
			{
				Ext.Msg.alert('Atenção','É necessário finalizar a venda');
				return;				
			}
			
			var win = new Ext.Window({
				height      : 600
			   ,width       : 1000
			   ,closeAction : 'close'
			   ,modal		: true
			   ,maximizable : true
			   ,scope	    : this
			   ,maximized   : false
			   ,title		: 'Recibo do locatario'
			   ,layout		: 'fit'
			   ,autoLoad    : {
				   url     : 'venda/recibo'
				  ,params  : {					  
					  value : Ext.getCmp('venda_id').getValue()
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