var conrecpar = Ext.extend(Ext.grid.GridPanel,{	
		 border		: false
		,stripeRows	: true	
		,loadMask	: true
		,autoScroll : true
		,initComponent: function()
		{
			var txtbusca = '';
			var txtfield = '';
			
			//combo dos campos de pesquisa
			this.comboFld = new Ext.form.ComboBox({	
				 xtype			: 'combo'
				,hiddenName		: 'fld'	
				,triggerAction	: 'all'
				,valueField		: 'id'
				,displayField	: 'field'
				,emptyText		: 'Selecione'
				,allowBlank		: false
	            ,selecOnFocus   : true
	            ,forceSelection : true				
				,editable       : false
				,autocomplete   : true
				,typeAhead      : true
				,mode           : 'local'
			    ,store          : new Ext.data.ArrayStore({			    	
				    id     : 'recpar_desc'
				   ,fields : ['id','field']
				   ,data   : [['recpar_id','Identificador'],
				              ['jazigo_codigo','Jazigo'],
				              ['locatario_desc','Locatario'],
				              ['ctarec_documento','Documento'],
				              ['recpar_formulario','Formulario'],
				              ['recpar_nosso_num','Nosso numero'],
				              ['recpar_nosso_num_dv','Nosso numero DV']]			   
			    })			
			})
			this.comboFld.setValue('locatario_desc');
			
			// campo de pesquisa
			this.txtSrch = new Ext.form.TextField({
				type       : 'textfield'
			   ,minLength  : 1
			   ,scope	   : this
			   ,store      : this.store
			   ,allowBlank : false
			   ,width 	   : 300
			   ,fireKey: function(e){				   
				   if (e.getKey()==e.ENTER){
					   txtbusca = this.scope.txtSrch.getValue(); 
					   txtfield = this.scope.comboFld.getValue(); 
					   if(txtbusca.length>1){
						   this.scope.store.reload({
							   params: {
								   value : txtbusca
								  ,field : txtfield
							   }
						   });
					   }
				    }				   
			    }				
			})

			//store do grid
			this.store = new Ext.data.JsonStore({
				 url			: 'recpar/listar'
				,root			: 'rows'					
				,idProperty		: 'recpar_id'
				,totalProperty	: 'totalCount'
				,autoLoad		: true
				,autoDestroy	: true
				,remoteSort     : true
				,baseParams		: {
					 action	: 'recpar/listar'
					,limit	: 30
				}				
				,fields:[
					 {name:'recpar_id'		            ,type:'int'}
					,{name:'jazigo_codigo'	            ,type:'string'}
					,{name:'tpjazigo_desc'	            ,type:'string'}					
					,{name:'locatario_id'	            ,type:'int'}
					,{name:'locatario_desc'	            ,type:'string'}
					,{name:'operacao_desc'	            ,type:'string'}
					,{name:'recpar_sacado'	            ,type:'string'}					
					,{name:'formarec_desc'	            ,type:'string'}
					,{name:'ctarec_documento'	        ,type:'int'}					
					,{name:'recpar_formulario'	        ,type:'string'}
					,{name:'recpar_data_emissao'        ,type:'date',dateFormat: 'Y-m-d'}
					,{name:'recpar_data_vencto'         ,type:'date',dateFormat: 'Y-m-d'}
					,{name:'recpar_valor'               ,type:'float'}
					,{name:'recpar_parcela'	            ,type:'int'}
					,{name:'recpar_pago'    	        ,type:'float'}
					,{name:'recpar_data_pagto'	        ,type:'date',dateFormat: 'Y-m-d'}
					,{name:'recpar_juros'    	        ,type:'float'}
					,{name:'recpar_ano'	                ,type:'string'}					
					,{name:'recpar_agencia'	            ,type:'string'}
					,{name:'recpar_conta'	            ,type:'string'}
					,{name:'recpar_banco'		        ,type:'string'}
					,{name:'recpar_cheque'		        ,type:'string'}
					,{name:'recpar_instatus'	        ,type:'string'}
					,{name:'recpar_historico'	        ,type:'string'}
					,{name:'recpar_obs'	                ,type:'string'}
					,{name:'recpar_nosso_num'	        ,type:'string'}
					,{name:'recpar_nosso_num_dv'        ,type:'int'}
					,{name:'ctarec_id'                  ,type:'int'}
					,{name:'identificador_locatario_id' ,type:'int'}				
				]
			});
			
			//passa paramatros depois do load, referente o conteudo escolhido
			this.store.on('beforeload',function(){				
				this.baseParams = {						
						value : txtbusca
					   ,field : txtfield
				}
			});
			
			var sm = new Ext.grid.CheckboxSelectionModel();
			
			//demais atributos do grid
			Ext.apply(this,{
				 viewConfig:{
					  emptyText		: 'Nenhum registro encontrado'
		             ,forceFit      : false		             
				     ,enableRowBody : true
				     ,showPreview   : true
				 	 ,deferEmptyText: false
				 	 ,getRowClass   : function(record){
	                    if(record.data.recpar_instatus=='0'){                    	
	                        return 'aberto';
	                    }
	                 }				 	 
				 }
			    ,sm : sm
				,bbar: new Ext.PagingToolbar({ //pagina��o
					 store		: this.store
					,pageSize	: 30
					,displayInfo: true					
		            ,displayMsg : 'Mostrando resultados {0} - {1} até {2}'
		            ,emptyMsg   : "Não há resultados"
				})				
				,tbar: [new Ext.Toolbar.TextItem('Alterações,click duplo no registro'),{xtype:'tbseparator'},{
					text    : 'Ações'
				   ,iconCls : 'silk-cog'
				   ,scope   : this
				   ,menu    : {
					   items   :[{
						   text    : 'Taxas'
  					      ,iconCls : 'silk-money-add'
					      ,scope   : this
					      ,handler : this._onBtnTaxaClick
					   },{					   	
						   text    : 'Excluir'
						  ,id      : 'btnExcluir' 
  					      ,iconCls : 'silk-delete'
					      ,scope   : this
					      ,handler : this._onBtnExcluirClick
					   },{
						   text	   : 'Estornar titulo'
  					      ,id      : 'btnEstornar' 
						  ,iconCls : 'ico_estorno'
						  ,scope   : this
						  ,handler : this._onBtnEstornoClick					   
					   },'-',{
						   text	   : 'Titulo de concessão'
						  ,iconCls : 'silk-page-component'
						  ,scope   : this
						  ,handler : this._onBtnConcessaoClick	   
					   },'-',{
						   text	   : 'Recibo avulso'
						  ,iconCls : 'silk-application-form'
						  ,scope   : this
						  ,handler : this._onBtnReciboavulsoClick					   
					   },{
						   text	   : 'Atualização de divida'
						  ,iconCls : 'silk-application-form'
						  ,scope   : this
						  ,handler : this._onBtnAtualizadividaClick		   
					   },{						   
						   text	   : 'Emitir boleto'
						  ,iconCls : 'silk-application-form'
						  ,scope   : this
					      ,handler : this._onBtnEmitirboletoClick			   
					   }]
				   }			   
			    },{xtype:'tbseparator'},{		   
					text   : 'Recibo'					 	 
				   ,iconCls: 'ico_recibo'
				   ,scope  : this
				   ,handler: this._onBtnReciboClick 		
				},{xtype:'tbseparator'},{
					text	: 'Baixar titulo'
				   ,iconCls : 'silk-accept'
				   ,scope	: this
				   ,handler : this._onBtnBaixarClick
				},{xtype:'tbseparator'},{					
					text	: 'Extrato'
				   ,iconCls : 'silk-application-view-list'
				   ,scope	: this
				   ,handler : this._onBtnExtratoClick			   				   
				},{xtype:'tbseparator'},'Buscar',{xtype:'tbseparator'},this.comboFld,{xtype:'tbseparator'},this.txtSrch]
				,columns:[sm,{
					dataIndex	: 'recpar_ano'
				   ,header		: 'Ano'
				   ,width       : 50
				   ,sortable    : true
				},{
					 dataIndex	: 'locatario_desc'
					,header		: 'Locatario'
					,width      : 200
					,sortable   : true
				},{
					 dataIndex	: 'recpar_data_emissao'
					,header		: 'Emissão'
					,width      : 80
					,sortable   : true
					,renderer   : Ext.util.Format.dateRenderer('d/m/Y')
				},{
					 dataIndex	: 'recpar_valor'
					,header		: 'Valor'
					,width      : 100
					,sortable   : true
		 			,renderer   : function(v){ 				    	
						return Ext.util.Format.number(v, '0.000,00/i')						
					}
				},{
					 dataIndex	: 'recpar_data_vencto'
					,header		: 'Vencimento'
					,width      : 80
					,sortable   : true
					,renderer   : Ext.util.Format.dateRenderer('d/m/Y')
				},{
					 dataIndex	: 'recpar_parcela'
					,header		: 'Parcela'
					,width      : 50
					,sortable   : true
				},{
					 dataIndex	: 'ctarec_documento'
					,header		: 'Documento'
					,width      : 80
					,sortable   : true
				},{
					 dataIndex	: 'recpar_formulario'
					,header		: 'Formulario'
					,width      : 80
					,sortable   : true			
				},{
					 dataIndex	: 'jazigo_codigo'
					,header		: 'Jazigo'
					,width      : 80
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
					,header		: 'Pagamento'
					,width      : 80
					,sortable   : true
					,renderer   : Ext.util.Format.dateRenderer('d/m/Y')
				},{
					 dataIndex	: 'recpar_juros'
					,header		: 'Valor juros'
					,width      : 100
					,sortable   : true
				 	,renderer   : function(v){ 				    	
						return Ext.util.Format.number(v, '0.000,00/i')						
					}			
				},{
					 dataIndex	: 'tpjazigo_desc'
					,header		: 'Tipo'
					,width      : 120
					,sortable   : true					
				},{
					 dataIndex	: 'operacao_desc'
					,header		: 'Operacao'
					,width      : 200
					,sortable   : true
				},{
					 dataIndex	: 'recpar_sacado'
					,header		: 'Sacado'
					,width      : 200
					,sortable   : true				
				},{
					 dataIndex	: 'formarec_desc'
					,header		: 'Forma de recebimento'
					,width      : 200
					,sortable   : true						
				},{
					 dataIndex	: 'recpar_historico'
					,header		: 'Historico'
					,width      : 200
					,sortable   : true
				},{
					 dataIndex	: 'recpar_obs'
					,header		: 'Observação'
					,width      : 200
					,sortable   : true
				},{
					 dataIndex	: 'recpar_nosso_num'
					,header		: 'Noss Numero'
					,width      : 200
					,sortable   : true
				},{
					 dataIndex	: 'recpar_nosso_num_dv'
					,header		: 'DV'
					,width      : 200
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
					,header		: 'N� Cheque'
					,width      : 80
					,sortable   : true
				},{
					dataIndex	: 'recpar_id'
					,header		: 'Identificador'
					,width      : 80
					,sortable   : true						
				}]
			})
			//super
			conrecpar.superclass.initComponent.call(this);
		}
		
		,initEvents: function()
		{
			//super
			conrecpar.superclass.initEvents.call(this);
			
			/* Associa um listener para que quando o usu�rio clique em uma linha do grid
			 * a tela de cadastro do registro selecionado apare�a
			 */
			
			this.on({
			 	 scope		: this
				,rowdblclick: this._onGridRowDblClick
			});	

		}	
		,show: function()
		{
			conrecpar.superclass.show.apply(this,arguments);	

			if (Ext.util.Cookies.get('nivel') < 3) {
				Ext.getCmp('btnExcluir').setDisabled(true);
				Ext.getCmp('btnEstornar').setDisabled(true);
			}else{
				Ext.getCmp('btnExcluir').setDisabled(false);
				Ext.getCmp('btnEstornar').setDisabled(false);
			}
		}
		,onDestroy: function()
		{
			conrecpar.superclass.onDestroy.apply(this,arguments);
			
			//destr�i a janela de usu�rio e limpa sua refer�ncia	
			Ext.destroy(this._winRecpar)
			this._winRecpar = null;
		}	
		,_onGridRowDblClick: function( grid, rowIndex, e ) 
		{
			//busca registro da linha selecionada
			var record = grid.getStore().getAt(rowIndex);

			if( record.length === 0 )
			{
				Ext.Msg.alert('Atenção','Selecione ao menos um registro!')
				return false;
			}			
			
			//extrai id
			var recparID = record.get('recpar_id');
			
			Ext.require('alt-recpar',function(){				
				var winRecpar = new altrecpar();
				winRecpar.setRecparID(recparID);
				winRecpar.show();
			},recparID);
		}
		,_onBtnBaixarClick: function()
		{
			//busca registro da linha selecionada
			var record = this.getSelectionModel().getSelections();
			
			if( record.length === 0 )
			{
				Ext.Msg.alert('Atenção','Selecione ao menos um registro!')
				return false;
			}
			
			if(record[0].get('recpar_instatus')=='1') {
				Ext.Msg.alert('Atenção','Titulo já foi pago!')
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
		,_onBtnEstornoClick: function()
		{
			//busco selecionados
			var arrSelecionados = this.getSelectionModel().getSelections();
			var hoje = new Date();
			var data = new Date(arrSelecionados[0].get('recpar_data_pagto'));
			
			if(arrSelecionados[0].get('recpar_instatus')=='0')
			{				
				Ext.Msg.alert('Atenção','Titulo em aberto,operação não permitida!')
				return false;								
			} 
			
			if(arrSelecionados.length === 0)
			{
				Ext.Msg.alert('Atenção','Selecione ao menos um registro!')
				return false;
			}	
			
			/*
			if(hoje.getTime()>data.getTime())
			{
				Ext.Msg.alert('Aten��o','Estorno n�o permitido, somente pagamentos realizados hoje!')
				return false;								
			}
			*/
			
			Ext.Msg.confirm('Confirmação','Deseja mesmo estornar o registro selecionado?',function(opt){
				
				if(opt === 'no')
					return;
					
				this.el.mask('Estornando o titulo');
				
				Ext.Ajax.request({
					 url	: 'recpar/estorno'
					,params	: {
						 action	   : 'estorno'
						,recpar_id : arrSelecionados[0].get('recpar_id')
					}
					,scope	: this
					,success: function()
					{
						this.el.unmask();
						this.store.reload();
					}
				});
			},this);
		}
		,_onBtnReciboClick: function()
		{
			//busco selecionados
			var arrSelecionados = this.getSelectionModel().getSelections();
			
			if(arrSelecionados[0].get('recpar_instatus')=='0')
			{				
				Ext.Msg.alert('Atenção','Titulo em aberto,operação não permitida!')
				return false;								
			} 
			
			if(arrSelecionados.length === 0)
			{
				Ext.Msg.alert('Atenção','Selecione ao menos um registro!')
				return false;
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
				   url     : 'recpar/recibo'
				  ,params  : {					  
					  value : arrSelecionados[0].get('recpar_id')
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
		,_onBtnTaxaClick: function()
		{
			Ext.require('mov-taxa',function(){
				var winTaxa = new movtaxa();
				winTaxa.setRecparID(0);
				winTaxa.show();
			});			
		}
		,_onBtnExcluirClick: function()
		{
			//busco selecionados
			var arrSelecionados = this.getSelectionModel().getSelections();
			
			if( arrSelecionados.length === 0 )
			{
				Ext.Msg.alert('Atenção','Selecione ao menos um registro!')
				return false;
			}
			
			Ext.Msg.confirm('Confirmação','Deseja mesmo excluir o(s) registro(s) selecionado(s)?',function(opt) {
				
				if(opt === 'no')
					return;
				
				this.el.mask('Excluindo..');
				
				Ext.Ajax.request({
					 url	 : 'recpar/excluir'
					,params	 : {
						 action	   : 'excluir'
						,recpar_id : arrSelecionados[0].get('recpar_id')
					}
					,scope	 : this
					,success : function()
					{						
						this.el.unmask();
						this.store.reload();
					}
				});
				
			},this);
		}		
		,_onBtnConcessaoClick: function()
		{
			//busco selecionados
			var arrSelecionados = this.getSelectionModel().getSelections();
			
			if(arrSelecionados.length === 0)
			{
				Ext.Msg.alert('Atenção','Selecione ao menos um registro!')
				return false;
			}
			
			var win = new Ext.Window({
				height      : 600
			   ,width       : 1000
			   ,closeAction : 'close'
			   ,modal		: true
			   ,maximizable : true
			   ,scope	    : this
			   ,maximized   : false
			   ,title		: 'Título de concessão'
			   ,layout		: 'fit'
			   ,autoLoad    : {
				   url     : 'recpar/concessao'
				  ,params  : {					  
					  value : arrSelecionados[0].get('recpar_id')
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
		,_onBtnExtratoClick: function()
		{
			var record = this.getSelectionModel().getSelections();
			var locatarioID = 0;
			
			if( record.length==0 )
			{
				Ext.Msg.alert('Atenção','Selecione ao menos um registro!')
				return false;
			}	
			
			if(record[0].get('identificador_locatario_id')==0) {
				locatarioID = record[0].get('locatario_id');
			} else {
				locatarioID = record[0].get('identificador_locatario_id');
			}
			
			Ext.require('con-extrato',function(){
				var winExtrato = new conextrato();
				winExtrato.setLocatarioID(locatarioID);				
				winExtrato.show();
			},locatarioID);						
		}
		,_onBtnAtualizadividaClick: function()
		{
			var getData = this.getSelectionModel().getSelections();
			
			if(getData.length === 0)
			{
				Ext.Msg.alert('Atenção','Selecione ao menos um registro!')
				return false;
			}
			
			var ids = new Array();	
			for (var i = 0 ; i < getData.length ;i++) {
				ids.push(getData[i].get('recpar_id'));
			}
			
			Ext.require('fin-recpar',function(){
				var winFinrecpar = new finrecpar();
				winFinrecpar.setRecparID(ids);
				winFinrecpar.show();
			},ids);
			
			return false;						
		}
		,_onBtnReciboavulsoClick: function()
		{
			Ext.Msg.alert('Atenção','Você não tem acesso!')
			return false;						
		}
		,_onBtnEmitirboletoClick: function()
		{
			//busco selecionados
			var arrSelecionados = this.getSelectionModel().getSelections();
			
			if(arrSelecionados.length === 0)
			{
				Ext.Msg.alert('Atenção','Selecione ao menos um registro!')
				return false;
			}	
			
			if(arrSelecionados[0].get('recpar_instatus')=='1') {
				Ext.Msg.alert('Atenção','Titulo já foi pago!')
				return false;	
			}
			
			Ext.Msg.confirm('Confirmação','Deseja mesmo gerar o boleto ?',function(opt) {
				
				if(opt === 'no')
					return;
				
				window.open('boleto/listar/recpar_id/'+arrSelecionados[0].get('recpar_id'),'_blank');
			},this);						
		}	
});

Ext.reg('e-conrecpar',conrecpar);