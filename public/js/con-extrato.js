var conextrato = Ext.extend(Ext.Window,{	
		 locatarioID : 0
		,modal		 : true
		,constrain	 : true
		,maximizable : false
		,resizable   : false
		,width		 : 800
		,height		 : 600
		,title		 : 'Extrato do locatario'
		,layout		 : 'fit'
		,buttonAlign : 'center'			
		,closeAction : 'hide'
			
		,setLocatarioID: function(locatarioID)
		{
			this.locatarioID = locatarioID;
		}
		,constructor: function()
		{
			//super
			conextrato.superclass.constructor.apply(this, arguments);
		}
		
		,initComponent: function()
		{			
			// store dos obitos
			this.storeObito = new Ext.data.JsonStore({
				 url			: 'obito/listar'
				,root			: 'rows'					
				,idProperty		: 'obito_id'
				,totalProperty	: 'totalCount'
				,autoLoad		: false
				,autoDestroy	: true
				,remoteSort     : true
				,baseParams		: {
					 action	: 'obito/listar'
					,limit	: 30
				}				
				,fields:[
					 {name:'obito_id'	            ,type:'int'}
					,{name:'obito_nrobito'          ,type:'string'}
					,{name:'locatario_id'           ,type:'int'}
					,{name:'locatario_desc'         ,type:'string'}
					,{name:'obito_falecido'         ,type:'string'}
					,{name:'jazigo_codigo'          ,type:'string'}
					,{name:'obito_data_falecimento' ,type:'date',dateFormat: 'Y-m-d'}
					,{name:'obito_hora'             ,type:'string'}	
					,{name:'obito_obs'              ,type:'string'}
					,{name:'obito_morte'            ,type:'string'}
				]
			});
			
			// grid dos obitos
			this.gridObito = new Ext.grid.GridPanel({
			 	 title		: 'Obitos selecionados'
				,height		: 510
				,store		: this.storeObito
				,bbar: new Ext.PagingToolbar({ //pagina��o
					store	   : this.storeObito
				   ,pageSize   :	 30
				   ,displayInfo: true					
	               ,displayMsg : 'Mostrando resultados {0} - {1} até {2}'
	               ,emptyMsg   : "Não há resultados"
			    })				
				,columns	: [{
					 header		: '&nbsp;'
					,dataIndex	: 'obito_id'
					,align		: 'center'
					,width		: 60
					,fixed		: true
				},{
				    dataIndex  : 'obito_nrobito'
				   ,header	   : 'N.Obito'
				   ,width      : 100
				   ,sortable   : true	
				},{
				    dataIndex  : 'locatario_id'
				   ,header	   : 'Locatario'
				   ,width      : 100
				   ,sortable   : true						
				},{
				    dataIndex  : 'locatario_desc'
				   ,header	   : 'Nome'
				   ,width      : 300
				   ,sortable   : true						
				},{
				   dataIndex   : 'obito_falecido'
				  ,header	   : 'Falecido'
				  ,width       : 300
				  ,sortable    : true						
				},{
				   dataIndex   : 'jazigo_codigo'
				  ,header	   : 'Jazigo'
				  ,width       : 100
				  ,sortable    : true						
				},{
				   dataIndex   : 'obito_data_falecimento'
				  ,xtype       : 'datecolumn' 	   
				  ,header	   : 'Data falecimento'
				  ,width       : 100
				  ,sortable    : true
				  ,format      : 'd/m/Y'
				},{
				   dataIndex   : 'obito_hora'
				  ,header	   : 'Hora'
				  ,width       : 100
				  ,sortable    : true					
				},{
				   dataIndex   : 'obito_obs'
				  ,header	   : 'Observação'
				  ,width       : 500
				  ,sortable    : true
				},{
				   dataIndex   : 'obito_morte'
				  ,header	   : 'Causa da morte'
				  ,width       : 500
				  ,sortable    : true				  
				}]
			})
			
			//store de vendas
			this.storeVenda = new Ext.data.JsonStore({
				 url			: 'venda/listar'
				,root			: 'rows'					
				,idProperty		: 'venda_id'
				,totalProperty	: 'totalCount'
				,autoLoad		: false
				,autoDestroy	: true
				,remoteSort     : true
				,baseParams		: {
					 action	: 'venda/listar'
					,limit	: 30
				}				
				,fields:[
					 {name:'venda_id'	     ,type:'int'}
					,{name:'locatario_desc'  ,type:'string'}
					,{name:'jazigo_codigo'   ,type:'string'}
					,{name:'venda_documento' ,type:'int'}
					,{name:'venda_data'      ,type:'date',dateFormat: 'Y-m-d'}
					,{name:'venda_vigencia'  ,type:'date',dateFormat: 'Y-m-d'}					
					,{name:'venda_total'     ,type:'float'}
				]
			});			
			
			// grid das vendas
			this.gridVenda = new Ext.grid.GridPanel({
			 	 title		: 'Vendas selecionados'
				,height		: 510
				,store		: this.storeVenda
				,bbar: new Ext.PagingToolbar({ //pagina��o
					store	   : this.storeVenda
				   ,pageSize   : 30
				   ,displayInfo: true					
	               ,displayMsg : 'Mostrando resultados {0} - {1} até {2}'
	               ,emptyMsg   : "Não há resultados"
			    })				
				,columns	: [{
					 header	   : '&nbsp;'
					,dataIndex : 'venda_id'
					,align	   : 'center'
					,width	   : 60
					,fixed	   : true
				},{
				    dataIndex  : 'jazigo_codigo'
				   ,header	   : 'Jazigo'
				   ,width      : 100
				   ,sortable   : true	
				},{
				    dataIndex  : 'locatario_desc'
				   ,header	   : 'Locatario'
				   ,width      : 300
				   ,sortable   : true						
				},{
				    dataIndex  : 'venda_documento'
				   ,header	   : 'Documento'
				   ,width      : 100
				   ,sortable   : true						
				},{
					dataIndex  : 'venda_data'
				   ,xtype      : 'datecolumn'		
				   ,header	   : 'Data'
				   ,width      : 100
				   ,sortable   : true	
				   ,format     : 'd/m/Y'
				},{
					dataIndex  : 'venda_vigencia'
				   ,xtype      : 'datecolumn'		
				   ,header	   : 'Vigencia(A partir de)'
				   ,width      : 180
				   ,sortable   : true	
				   ,format     : 'd/m/Y'				   
				},{
				   dataIndex   : 'venda_total'
				  ,header	   : 'Total'
				  ,width       : 100
				  ,sortable    : true
			      ,renderer    : function(v){ 				    	
						return Ext.util.Format.number(v, '0.000,00/i')						
				  }			  
				}]
			})
			
			
			//store de produtos e servi�os de vendas
			this.storeVendapdsv = new Ext.data.JsonStore({
				 url			: 'vendapdsv/listar'
				,root			: 'rows'					
				,idProperty		: 'venda_pdsv_id'
				,totalProperty	: 'totalCount'
				,autoLoad		: false
				,autoDestroy	: true
				,remoteSort     : true
				,baseParams		: {
					 action	: 'vendapdsv/listar'
					,limit	: 30
				}				
				,fields:[
                     {name:'venda_pdsv_id'         ,type:'int'}				         
					,{name:'venda_id'	           ,type:'int'}
					,{name:'locatario_id'          ,type:'int'}
					,{name:'locatario_desc'        ,type:'string'}
					,{name:'jazigo_codigo'         ,type:'string'}
					,{name:'prodserv_id'           ,type:'int'}
					,{name:'prodserv_desc'         ,type:'string'}					
					,{name:'venda_pdsv_valor'      ,type:'float'}
					,{name:'venda_pdsv_quantidade' ,type:'float'}
					,{name:'venda_pdsv_total'      ,type:'float'}
				]
			});
			
			
			// grid de produtos e servi�os vendas
			this.gridVendapdsv = new Ext.grid.GridPanel({
			 	 title		: 'Produtos e servi�os de vendas selecionados'
				,height		: 510
				,store		: this.storeVendapdsv
				,bbar: new Ext.PagingToolbar({ //pagina��o
					store	   : this.storeVendapdsv
				   ,pageSize   : 30
				   ,displayInfo: true					
	               ,displayMsg : 'Mostrando resultados {0} - {1} até {2}'
	               ,emptyMsg   : "Não há resultados"
			    })
				,columns	: [{
					 header		: '&nbsp;'
					,dataIndex	: 'venda_pdsv_id'
					,align		: 'center'
					,width		: 60
					,fixed		: true
				},{
				    dataIndex  : 'venda_id'
				   ,header	   : 'N Venda'
				   ,width      : 60
				   ,sortable   : true	
				},{
				    dataIndex  : 'jazigo_codigo'
				   ,header	   : 'Jazigo'
				   ,width      : 100
				   ,sortable   : true	
				},{
				    dataIndex  : 'locatario_desc'
				   ,header	   : 'Locatario'
				   ,width      : 300
				   ,sortable   : true						
				},{
				    dataIndex  : 'prodserv_id'
				   ,header	   : 'Identificador'
				   ,width      : 100
				   ,sortable   : true						
				},{
				   dataIndex   : 'prodserv_desc'
				  ,header	   : 'Produto/Servição'
				  ,width       : 300
				  ,sortable    : true
				},{
				   dataIndex   : 'venda_pdsv_valor'
				  ,header	   : 'Valor'
				  ,width       : 100
				  ,sortable    : true
				  ,renderer    : function(v){
					  return Ext.util.Format.number(v, '0.000,00/i')						
				  }			  
				},{
					dataIndex  : 'venda_pdsv_quantidade'
				   ,header	   : 'Quantidade'
				   ,width      : 100
				   ,sortable   : true
				   ,renderer   : function(v){
					   return Ext.util.Format.number(v, '0.000,00/i')						
				   }			  
			    },{
					dataIndex  : 'venda_pdsv_total'
				   ,header	   : 'Total'
				   ,width      : 100
				   ,sortable   : true
				   ,renderer   : function(v){
					   return Ext.util.Format.number(v, '0.000,00/i')						
				   }			  
			    }]
			})
			
			
			//store dos titulos
			this.storeRecpar = new Ext.data.JsonStore({
				 url			: 'recpar/listar'
				,root			: 'rows'					
				,idProperty		: 'recpar_id'
				,totalProperty	: 'totalCount'
				,autoLoad		: false
				,autoDestroy	: true
				,remoteSort     : true
				,baseParams		: {
					 action	: 'recpar/listar'
					,limit	: 30
				}				
				,fields:[
					 {name:'recpar_id'		     ,type:'int'}
					,{name:'jazigo_codigo'	     ,type:'string'}
					,{name:'locatario_desc'	     ,type:'string'}
					,{name:'operacao_desc'	     ,type:'string'}
					,{name:'formarec_desc'	     ,type:'string'}
					,{name:'ctarec_documento'	 ,type:'int'}					
					,{name:'recpar_data_emissao' ,type:'date',dateFormat: 'Y-m-d'}
					,{name:'recpar_data_vencto'  ,type:'date',dateFormat: 'Y-m-d'}
					,{name:'recpar_valor'        ,type:'float'}
					,{name:'recpar_parcela'	     ,type:'int'}
					,{name:'recpar_pago'    	 ,type:'string'}
					,{name:'recpar_data_pagto'	 ,type:'date',dateFormat: 'Y-m-d'}					
					,{name:'recpar_ano'	         ,type:'string'}					
					,{name:'recpar_agencia'	     ,type:'string'}
					,{name:'recpar_conta'	     ,type:'string'}
					,{name:'recpar_banco'		 ,type:'string'}
					,{name:'recpar_cheque'		 ,type:'string'}
					,{name:'recpar_instatus'	 ,type:'string'}
					,{name:'recpar_sacado'   	 ,type:'string'}
					,{name:'recpar_historico'	 ,type:'string'}
					,{name:'recpar_obs'     	 ,type:'string'}
				]
			});
			
			// grid dos titulos
			this.gridRecpar = new Ext.grid.GridPanel({
			 	 title		: 'Titulos selecionados'
				,height		: 510
				,store		: this.storeRecpar
				,viewConfig : {
	                getRowClass: function(record, index) {
				 		 if(record.data.recpar_instatus=='0'){                    	
		                        return 'aberto';
		                 }
	                }
	            }
				,bbar: new Ext.PagingToolbar({ //pagina��o
					store	   : this.storeRecpar
				   ,pageSize   :	 30
				   ,displayInfo: true					
	               ,displayMsg : 'Mostrando resultados {0} - {1} até {2}'
	               ,emptyMsg   : "Não há resultados"
			    })			
			    ,tbar           : [{			    	
			    	text	: 'Baixar titulo'
				   ,iconCls : 'silk-accept'
				   ,scope	: this
				   ,handler : this._onBtnBaixarClick			    	
			    }]         
				,columns		: [{
					 header		: '&nbsp;'
					,dataIndex	: 'recpar_id'
					,align		: 'center'
					,width		: 60
					,fixed		: true
				},{
					 dataIndex	: 'jazigo_codigo'
					,header		: 'Jazigo'
					,width      : 80
					,sortable   : true	
				},{
					 dataIndex	: 'recpar_sacado'
					,header		: 'Sacado'
					,width      : 300
					,sortable   : true	
				},{
					 dataIndex	: 'operacao_desc'
					,header		: 'Operacao'
					,width      : 200
					,sortable   : true						
				},{
					 dataIndex	: 'recpar_historico'
					,header		: 'Historico'
					,width      : 300
					,sortable   : true
				},{
					 dataIndex	: 'recpar_obs'
					,header		: 'Observações'
					,width      : 300
					,sortable   : true					
				},{
					 dataIndex	: 'ctarec_documento'
					,header		: 'Documento'
					,width      : 80
					,sortable   : true						
				},{
					 dataIndex	: 'recpar_data_emissao'
					,xtype      : 'datecolumn' 	   	 
					,header		: 'Emissão'
					,width      : 80
					,sortable   : true
					,format     : 'd/m/Y'
				},{
					 dataIndex	: 'recpar_data_vencto'
 				    ,xtype      : 'datecolumn'		 
					,header		: 'Vencimento'
					,width      : 80
					,sortable   : true
					,format     : 'd/m/Y'
				},{
					 dataIndex	: 'recpar_valor'
					,header		: 'Valor'
					,width      : 100
					,sortable   : true
		 			,renderer   : function(v){ 				    	
						return Ext.util.Format.number(v, '0.000,00/i')						
					}			
				},{
					 dataIndex	: 'recpar_parcela'
					,header		: 'Parcela'
					,width      : 50
					,sortable   : true
				},{
					 dataIndex	: 'recpar_pago'
					,header		: 'Valor pago'
					,width      : 100
					,sortable   : true
				 	,renderer   : function(v){ 				    	
						return Ext.util.Format.number(v, '0.000,00/i')						
					}			
				},{
					 dataIndex	: 'recpar_data_pagto'
				    ,xtype      : 'datecolumn' 	   		 
					,header		: 'Pagamento'
					,width      : 80
					,sortable   : true
					,format     : 'd/m/Y'
				},{
					 dataIndex	: 'recpar_ano'
					,header		: 'Ano'
					,width      : 50
					,sortable   : true						
				},{
					 dataIndex	: 'recpar_agencia'
					,header		: 'Agencia'
					,width      : 80
					,sortable   : true	
				},{
					 dataIndex	: 'recpar_conta'
					,header		: 'Conta'
					,width      : 80
					,sortable   : true
				},{
					 dataIndex	: 'recpar_banco'
					,header		: 'Banco'
					,width      : 80
					,sortable   : true
				},{
					 dataIndex	: 'recpar_cheque'
					,header		: 'N Cheque'
					,width      : 80
					,sortable   : true
				},{
					 dataIndex	: 'recpar_id'
					,header		: 'Identificador'
					,width      : 80
					,sortable   : true						
				}]
			});
			
			//store dos adicionais
			this.storeLocatarioadc = new Ext.data.JsonStore({
				 url			: 'locatarioadc/listar'
				,root			: 'rows'					
				,totalProperty	: 'totalCount'
				,autoLoad		: false
				,autoDestroy	: true
				,remoteSort     : true
				,baseParams		: {
					 action       : 'locatarioadc/listar'
					,locatario_id : this.locatarioID
					,limit	      : 30
				}				
				,fields:[
				     {name:'loctario_id_adc'             ,type:'int'}     
					,{name:'locatario_adc_id'            ,type:'int'}
					,{name:'locatario_adc_desc'          ,type:'string'}
					,{name:'locatario_id'                ,type:'int'}
					,{name:'locatario_adc_intipo_desc'   ,type:'string'}					
					,{name:'locatario_adc_data_cadastro' ,type:'date',dateFormat: 'Y-m-d'}
					,{name:'jazigo_codigo_adc'           ,type:'string'}				
				]
			});	
			
			// grid dos adicionais
			this.gridLocatarioadc = new Ext.grid.GridPanel({
			 	 title		: 'Locatarios adicionais'
				,height		: 510
				,store		: this.storeLocatarioadc
				,columns	: [{
				    header	   : 'Identificador'
				   ,dataIndex  : 'locatario_adc_id'
				   ,align	   : 'center'
				   ,width	   : 80
				   ,sortable   : true
				},{
					dataIndex  : 'locatario_adc_desc'
				   ,header	   : 'Nome'
				   ,width      : 300
				   ,sortable   : true
				},{					
					dataIndex  : 'locatario_adc_intipo_desc'
				   ,header	   : 'Tipo'
				   ,width      : 120
				   ,sortable   : true
				},{					
					dataIndex  : 'jazigo_codigo_adc'
				   ,header	   : 'Jazigo'
				   ,width      : 80
				   ,sortable   : true				   
				},{					
					dataIndex  : 'locatario_adc_data_cadastro'
				   ,header	   : 'Data'
				   ,width      : 100
				   ,sortable   : true					
				   ,renderer   : Ext.util.Format.dateRenderer('d/m/Y')
				}]
			})
			
			//store dos historico
			this.storeHistorico = new Ext.data.JsonStore({
				 url			: 'historico/listar'
			    ,root			: 'rows'					
				,idProperty		: 'historico_id'
				,totalProperty	: 'totalCount'
				,autoLoad		: false
				,autoDestroy	: true
				,remoteSort     : true
				,baseParams		: {
					 action : 'historico/listar'
					,field  : 'locatario_id'
					,value  : this.locatarioID	
					,limit	: 30
				}				
				,fields:[
				     {name:'historico_id'          ,type:'int'}     
					,{name:'locatario_id'          ,type:'int'}
					,{name:'jazigo_codigo'         ,type:'string'}
					,{name:'historico_desc'        ,type:'string'}					
					,{name:'historico_documento'   ,type:'int'}
					,{name:'historico_data'        ,type:'date',dateFormat: 'Y-m-d'}
					,{name:'usuario_login'         ,type:'string'}					
					,{name:'data_ultima_alteracao' ,type:'date',dateFormat: 'Y-m-d'}
				]
			});	
			
			// grid dos historicos
			this.gridHistorico = new Ext.grid.GridPanel({
				 title		: 'Historicos selecionados'
				,height		: 510
				,store		: this.storeHistorico
				
				,bbar: new Ext.PagingToolbar({ //pagina��o
					store	   : this.storeHistorico
				   ,pageSize   :	 30
				   ,displayInfo: true					
	               ,displayMsg : 'Mostrando resultados {0} - {1} até {2}'
	               ,emptyMsg   : "Não há resultados"
			    })
			    ,tbar: [{			    	
			    	text	: 'Novo'
				   ,iconCls : 'silk-add'
				   ,scope	: this
				   ,handler : this._onBtnNovohistoricoClick				   
			    },{
			    	text	: 'Excluir'
				   ,iconCls : 'silk-delete'
  			       ,scope	: this
				   ,handler : this._onBtnExcluirhistoricoClick	    	
			    }]		
				,columns	: [{
				    header	   : 'Identificador'
				   ,dataIndex  : 'historico_id'
				   ,align	   : 'center'
				   ,width	   : 80
				   ,sortable   : true
				},{
					dataIndex  : 'jazigo_codigo'
				   ,header	   : 'Jazigo'
				   ,width      : 100
				   ,sortable   : true				   
				},{
					dataIndex  : 'historico_desc'
				   ,header	   : 'Descrição'
				   ,width      : 650
				   ,sortable   : true
				},{					
					dataIndex  : 'historico_documento'
				   ,header	   : 'Documento'
				   ,width      : 70
				   ,sortable   : true
				},{
					dataIndex  : 'historico_data'
				   ,xtype      : 'datecolumn' 	   		
				   ,header	   : 'Data'
				   ,width      : 100
				   ,sortable   : true	
				   ,format     : 'd/m/Y'
				}]
			});
			
			// monta astabs
			this.tabPanel = new Ext.TabPanel({
				activeTab      : 0               
               ,border         : false
               ,plain          : true
               ,deferredRender : true
               ,scope          : this
               ,defaults       : {autoScroll: true}
			   ,items:[{
				   title : 'Obito(s)'
				  ,items : [this.gridObito]  
			   },{
				   title : 'Venda(s)'
				  ,items : [this.gridVenda]						   
			   },{
				   title : 'Produtos e Serviços'
				  ,items : [this.gridVendapdsv]	   
			   },{
				   title : 'Financeiro'
			      ,items : [this.gridRecpar]					   
			   },{
				   title : 'Adicionais'
			      ,items : [this.gridLocatarioadc]  
			   },{
				   title : 'Historico'
			      ,items : [this.gridHistorico]			   
			   }]			           			                          
            });
			
			Ext.apply(this,{
				 items	: this.tabPanel
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
			conextrato.superclass.initComponent.call(this);
		}
		,show: function()
		{
			conextrato.superclass.show.apply(this,arguments);			
			var locatario_id = this.locatarioID;
			
			// recarrega o obito com os parametros do locatario
			this.storeObito.on('beforeload',function(){				
				this.baseParams = {						
						value : locatario_id
					   ,field : 'locatario_id'
				}
			});
			this.storeObito.reload();
			
			// recarrega as vendas com os parametros do locatario
			this.storeVenda.on('beforeload',function(){				
				this.baseParams = {						
						value : locatario_id
					   ,field : 'locatario_id'
				}
			});
			this.storeVenda.load();
			
			// recarrega os produtos e servi�os com os parametros do locatario
			this.storeVendapdsv.on('beforeload',function(){				
				this.baseParams = {						
						value : locatario_id
					   ,field : 'locatario_id'
				}
			});
			this.storeVendapdsv.load();
			
			// recarrega o financeiro com os parametros do locatario
			this.storeRecpar.on('beforeload',function(){				
				this.baseParams = {						
						value : locatario_id
					   ,field : 'locatario_id'
				}
			});
			this.storeRecpar.load();
			
			this.storeLocatarioadc.on('beforeload',function(){				
				this.baseParams = {
						locatario_id : locatario_id
				}
			});
			this.storeLocatarioadc.load();
			
			// recarrega o historico
			this.storeHistorico.on('beforeload',function(){				
				this.baseParams = {
						field  : 'locatario_id'
					   ,value  : locatario_id
				}
			});
			this.storeHistorico.load();
		}
		,onDestroy: function()
		{
			conextrato.superclass.onDestroy.apply(this,arguments);			
			this.formPanel = null;
		}	
		,_onFormLoad: function(form, request)
		{
			var data = request.result.data;
			this.el.unmask();			
		}
		,_onBtnBaixarClick: function()
		{
			//busca registro da linha selecionada
			var record = this.gridRecpar.getSelectionModel().getSelections();
			
			if( record.length === 0 )
			{
				Ext.Msg.alert('Aten��o','Selecione ao menos um registro!')
				return false;
			}
			
			if(record[0].get('recpar_instatus')=='1') {
				Ext.Msg.alert('Aten��o','Titulo j� foi pago!')
				return false;	
			}
			
			//extrai id
			var recparID = record[0].get('recpar_id');
			
			Ext.require('bxa-recpar',function(){
				var winRecpar = new bxarecpar();
				winRecpar.setRecparID(recparID);
				winRecpar.show();
			},recparID);
		}
		,_onBtnNovohistoricoClick: function()		
		{			
			Ext.require('cad-historico',function(){
				var winHistorico = new cadhistorico();
				winHistorico.setHistoricoID(0);
				winHistorico.show();				
			});
			this.store.reload();
		}
		,_onBtnExcluirhistoricoClick: function()
		{
			//busca registro da linha selecionada
			var record = this.gridHistorico.getSelectionModel().getSelections();
			
			if( record.length === 0 )
			{
				Ext.Msg.alert('Aten��o','Selecione ao menos um registro!')
				return false;
			}		
			
			//extrai id
			var historicoID = record[0].get('historico_id');

			Ext.Msg.confirm('Confirma��o','Deseja mesmo excluir o(s) registro(s) selecionado(s)?',function(opt){
				
				if(opt === 'no')
					return;
				
				Ext.Ajax.request({
					 url	: 'historico/excluir'
					,params	: {
						 action	        : 'excluir'
						,'historico_id' : historicoID
					}
					,scope	: this
					,success: function()
					{
						this.el.unmask();
						this.storeHistorico.reload();
					}
				});
			},this);
		}
				
});