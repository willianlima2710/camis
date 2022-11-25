var concaixaana = Ext.extend(Ext.grid.GridPanel,{	
   	     border		: false
		,stripeRows	: true	
		,loadMask	: true
		,autoScroll : true
		,initComponent: function()
		{
			this.comboBanco = new Ext.form.ComboBox({
				 fieldLabel		: 'Banco'
				,xtype			: 'combo'
				,hiddenName		: 'banco_id'	
				,triggerAction	: 'all'
				,valueField		: 'banco_id'
				,displayField	: 'banco_desc'
				,emptyText		: 'Selecione um banco'
				,readOnly       : false
				,editable       : false
			    ,width          : '100%'
			    ,anchor         : '100%'				
				,store			: new Ext.data.JsonStore({
					 url		: 'banco/todo'
					,baseParams	: {
						 action	: 'todo'
						,limit	: 30
					}
					,fields:[
						 {name: 'banco_id'   , type:'int'}
						,{name: 'banco_desc' , type:'string'}
					]
				})
			});
			
			this.dateCaixa_data_movto_ini = new Ext.form.DateField({
				xtype      : 'datefield'
			   ,fieldLabel : 'Data inicial'
			   ,name	   : 'caixa_data_movto_ini'
			   ,allowBlank : false
	  	       ,maxLength  : 10	  	        	   
	  		   ,format     : 'd/m/Y'
	  		   ,altFormats : 'd/m/Y|j/n/Y|j/n/y|j/m/y|d/n/y|j/m/Y|d/m/Y|d-m-y|d-m-Y|d/m|d-m|dm|dmy|dmY|d|d-m-Y'		
			});
			this.dateCaixa_data_movto_ini.setValue(new Date());

			this.dateCaixa_data_movto_fim = new Ext.form.DateField({
				xtype      : 'datefield'
			   ,fieldLabel : 'Data final'
			   ,name	   : 'caixa_data_movto_fim'
			   ,allowBlank : false
	  	       ,maxLength  : 10	  	        	   
	  		   ,format     : 'd/m/Y'
	  		   ,altFormats : 'd/m/Y|j/n/Y|j/n/y|j/m/y|d/n/y|j/m/Y|d/m/Y|d-m-y|d-m-Y|d/m|d-m|dm|dmy|dmY|d|d-m-Y'		
			});
			this.dateCaixa_data_movto_fim.setValue(new Date());
			
			this.txSaldoAnt =  new Ext.form.NumberField({
			      fieldLabel : 'Saldo anterior'
			     ,name	     : 'saldo_anterior'
		         ,disabled   : true	 
			})
			this.txTotalCred =  new Ext.form.NumberField({
			      fieldLabel : 'Valor Credito'
			     ,name	     : 'valor_credito'
		         ,disabled   : true	 
			})
			this.txTotalDesp =  new Ext.form.NumberField({
			      fieldLabel : 'Valor Debito'
			     ,name	     : 'valor_debito'
		         ,disabled   : true		         
			})
			this.txTotalSald =  new Ext.form.NumberField({
			      fieldLabel : 'Valor Saldo'
			     ,name	     : 'valor_saldo'
		         ,disabled   : true	
			})
			
			//store do grid
			this.store = new Ext.data.JsonStore({
				 url			: 'caixa/listar'
				,root			: 'rows'					
				,autoLoad		: false
				,autoDestroy	: true
				,remoteSort     : true
				,baseParams		: {
					 action	: 'caixa/listar'
					,limit	: 30
				}				
				,fields:[				         
	                 {name:'caixa_id'	      ,type:'int'}
	 				,{name:'banco_id'	      ,type:'int'}					 
	 			    ,{name:'jazigo_codigo'	  ,type:'string'}
	 				,{name:'empresa_id'       ,type:'int'}					
	 				,{name:'locfor_id'        ,type:'int'}
	 				,{name:'conta_id'         ,type:'int'}
	 				,{name:'caixa_historico'  ,type:'string'}
	 				,{name:'caixa_obs'        ,type:'string'}
	 				,{name:'caixa_documento'  ,type:'string'}
	 				,{name:'caixa_data_movto' ,type:'date',dateFormat: 'Y-m-d'}
	 				,{name:'caixa_valor'      ,type:'float'}
	 				,{name:'caixa_intipo'     ,type:'string'}
	 				,{name:'caixa_mesano'     ,type:'string'}
	 				,{name:'locfor_desc'      ,type:'string'}
	 				,{name:'banco_desc'       ,type:'string'}
	 				,{name:'conta_desc'       ,type:'string'}
	 				,{name:'valor_credito'    ,type:'float'}
	 				,{name:'valor_debito'     ,type:'float'}
	 				,{name:'saldo_valor'      ,type:'float'}	 				
	 			]
			});
			
			this.formPesquisar = new Ext.Panel({
				width  : 400
			   ,height : 148
			   ,title  : 'Pesquisar por:'
			   ,bbar   : {
				   items : ['->',{
					   xtype   : 'tbbutton'
					  ,iconCls : 'silk-excel'
	                  ,text    : 'Exportar para Excel'									 
					  ,scope   : this
					  ,handler : this._onBtnExcelClick
	                  ,width   : 80					   
				   },{xtype:'tbseparator'},{   
					   xtype   : 'tbbutton'
					  ,iconCls : 'ico_printer'
	                  ,text    : 'Imprimir'									 
					  ,scope   : this
					  ,handler : this._onBtnImprimirClick
	                  ,width   : 80				   
			   	   },{xtype:'tbseparator'},{
					   xtype   : 'tbbutton'
					  ,iconCls : 'silk-find'
	                  ,text    : 'Pesquisar'									 
					  ,scope   : this
					  ,handler : this._onBtnPesquisarClick
	                  ,width   : 80
				   }]
			   }
			   ,items      : [{
				   xtype      : 'fieldset'
  			      ,autoHeight :true
				  ,items      : [
				      this.dateCaixa_data_movto_ini,
				      this.dateCaixa_data_movto_fim,
				      this.comboBanco
				  ]							  
			   }]
			});
			
			this.formTotais = new Ext.Panel({
				 width  : 400
				,height : 148
			    ,title  : 'Totais:'			    	 	
 			    ,items  : [{
 			    	xtype      : 'fieldset'
 			       ,autoHeight :true
				   ,items      : [this.txSaldoAnt,this.txTotalCred,this.txTotalDesp,this.txTotalSald]							  
			    }]
			});		
			
			var rendererReal = function(v)
			{
				return Ext.util.Format.usMoney(v).replace('$','R$');
			}
			
			var rendererNumber = function(v)
			{
				return Ext.util.Format.number(v,'0,000.00');
			}
			
			// utilize custom extension for Group Summary
			var summary = new Ext.ux.grid.GridSummary();			
			
			//demais atributos do grid
			Ext.apply(this,{
				 plugins		: summary
				 ,viewConfig:{
					  emptyText		 : 'Nenhum registro encontrado'
		             ,forceFit       : true		             
				     ,enableRowBody  : true
				     ,showPreview    : true
				 	 ,deferEmptyText : false
				 }
				,tbar: [this.formPesquisar,{xtype:'tbseparator'},this.formTotais]
				,columns:[{
					 dataIndex   	 : 'caixa_data_movto'
					,header	    	 : 'Movimento'
					,width           : 70
					,sortable        : true
					,renderer        : Ext.util.Format.dateRenderer('d/m/Y')					
				},{
					 dataIndex	     : 'banco_desc'
					,header		     : 'Banco'
					,width           : 70	
					,sortable        : true	
				},{					
					 dataIndex    	 : 'conta_desc'
					,header		     : 'Conta'
					,width           : 150
					,sortable        : true	
				},{
					 dataIndex     	 : 'locfor_desc'
					,header		     : 'Nome'
					,width           : 300
					,sortable        : true						
				},{
					 dataIndex	     : 'caixa_documento'
					,header	      	 : 'Documento'
					,width           : 70
					,sortable        : true						
				},{
					 dataIndex	     : 'valor_credito'
					,header		     : 'Credito'
					,width           : 80
					,sortable        : true
				    ,renderer        : rendererReal
				    ,summaryType     : 'sum'
      			    ,summaryRenderer : rendererReal				
				},{
					 dataIndex	     : 'valor_debito'
					,header		     : 'Debito'
					,width           : 80
					,sortable        : true
				    ,renderer        : rendererReal
				    ,summaryType     : 'sum'
      			    ,summaryRenderer : rendererReal				
				},{
					 dataIndex	     : 'caixa_historico'
					,header		     : 'Historico'
					,width           : 400
					,sortable        : true
				}]
			})			
			
			//super
			concaixaana.superclass.initComponent.call(this);
		}

		,initEvents: function()
		{
			//super
			concaixaana.superclass.initEvents.call(this);
			
			this.store.on('load',function(store) {
				this.txTotalCred.setValue(store.sum('valor_credito').toFixed(2));
				this.txTotalDesp.setValue(store.sum('valor_debito').toFixed(2));
				this.txSaldoAnt.setValue(store.getAt(0).get('saldo_valor').toFixed(2));
			},this);			
		}	
		,onDestroy: function()
		{
			concaixaana.superclass.onDestroy.apply(this,arguments);
		}		
		,_onBtnPesquisarClick: function()
		{			
			this.store.reload({
				scope: this
				,params: {
					banco_id             : this.comboBanco.getValue()
				   ,caixa_data_movto_ini : this.dateCaixa_data_movto_ini.getValue()
				   ,caixa_data_movto_fim : this.dateCaixa_data_movto_fim.getValue()
				}
				,callback: function(records,option,success) {					
					var saldoant = this.txSaldoAnt.getValue();
					var totalCred = this.txTotalCred.getValue();
					var totalDesp = this.txTotalDesp.getValue();
					var totalgeral = (saldoant+totalCred)-totalDesp;
					
					this.txTotalSald.setValue(totalgeral);
				}
			});
		}
		,_onBtnImprimirClick: function()
		{			
			var win = new Ext.Window({
				height      : 600
			   ,width       : 1000
			   ,closeAction : 'close'
			   ,modal		: true
			   ,maximizable : true
			   ,scope	    : this
			   ,maximized   : false
			   ,title		: 'Movimento de caixa - analitico'
			   ,layout		: 'fit'
			   ,autoLoad    : {
				   url     : 'caixa/impanalitico'
				  ,params  : {
					  banco_id             : this.comboBanco.getValue()
 				     ,caixa_data_movto_ini : this.dateCaixa_data_movto_ini.getValue()
					 ,caixa_data_movto_fim : this.dateCaixa_data_movto_fim.getValue()
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

Ext.reg('e-concaixaana',concaixaana);