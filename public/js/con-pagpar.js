var conpagpar = Ext.extend(Ext.grid.GridPanel,{	
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
				    id     : 'pagpar_desc'
				   ,fields : ['id','field']
				   ,data   : [['pagpar_id','Identificador'],
				              ['ctapag_documento','Documento'],
				              ['fornecedor_desc','Fornecedor']]			   
			    })			
			})
			this.comboFld.setValue('fornecedor_desc');
			
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
				 url			: 'pagpar/listar'
				,root			: 'rows'					
				,idProperty		: 'pagpar_id'
				,totalProperty	: 'totalCount'
				,autoLoad		: true
				,autoDestroy	: true
				,remoteSort     : true
				,baseParams		: {
					 action	: 'pagpar/listar'
					,limit	: 30
				}				
				,fields:[
					 {name:'pagpar_id'		     ,type:'int'}
					,{name:'jazigo_codigo'	     ,type:'string'}
					,{name:'fornecedor_desc'     ,type:'string'}
					,{name:'operacao_desc'	     ,type:'string'}
					,{name:'formarec_desc'	     ,type:'string'}
					,{name:'ctapag_documento'	 ,type:'int'}					
					,{name:'pagpar_data_emissao' ,type:'date',dateFormat: 'Y-m-d'}
					,{name:'pagpar_data_vencto'  ,type:'date',dateFormat: 'Y-m-d'}
					,{name:'pagpar_valor'        ,type:'float'}
					,{name:'pagpar_parcela'	     ,type:'int'}
					,{name:'pagpar_pago'    	 ,type:'string'}
					,{name:'pagpar_data_pagto'	 ,type:'date',dateFormat: 'Y-m-d'}					
					,{name:'pagpar_ano'	         ,type:'string'}					
					,{name:'pagpar_agencia'	     ,type:'string'}
					,{name:'pagpar_conta'	     ,type:'string'}
					,{name:'pagpar_banco'		 ,type:'string'}
					,{name:'pagpar_cheque'		 ,type:'string'}
					,{name:'pagpar_instatus'	 ,type:'string'}
					,{name:'pagpar_historico'	 ,type:'string'}
					,{name:'pagpar_observacao'	 ,type:'string'}
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
	                    if(record.data.pagpar_instatus=='0'){                    	
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
					 text	: 'Baixar titulo'
					,iconCls: 'silk-accept'
					,scope	: this
					,handler: this._onBtnBaixarClick					
				},{xtype:'tbseparator'},'Buscar',{xtype:'tbseparator'},this.comboFld,{xtype:'tbseparator'},this.txtSrch]
				,columns:[sm,{
				 	 dataIndex	: 'ctapag_documento'
                    ,header		: 'Documento'
	                ,width      : 80
	                ,sortable   : true						
                },{
					 dataIndex	: 'fornecedor_desc'
					,header		: 'Fornecedor'
					,width      : 200
					,sortable   : true	
				},{
					 dataIndex	: 'operacao_desc'
					,header		: 'Operacao'
					,width      : 200
					,sortable   : true						
				},{
					 dataIndex	: 'formarec_desc'
					,header		: 'Forma de recebimento'
					,width      : 200
					,sortable   : true						
				},{
					 dataIndex	: 'pagpar_data_emissao'
					,header		: 'Emissão'
					,width      : 80
					,sortable   : true
					,renderer   : Ext.util.Format.dateRenderer('d/m/Y')				
				},{
					 dataIndex	: 'pagpar_data_vencto'
					,header		: 'Vencimento'
					,width      : 80
					,sortable   : true
					,renderer   : Ext.util.Format.dateRenderer('d/m/Y')				
				},{
					 dataIndex	: 'pagpar_valor'
					,header		: 'Valor'
					,width      : 100
					,sortable   : true
		 			,renderer   : function(v){ 				    	
						return Ext.util.Format.number(v, '0.000,00/i')						
					}			
				},{
					 dataIndex	: 'pagpar_parcela'
					,header		: 'Parcela'
					,width      : 50
					,sortable   : true
				},{
					 dataIndex	: 'pagpar_pago'
					,header		: 'Valor pago'
					,width      : 100
					,sortable   : true
				 	,renderer   : function(v){ 				    	
						return Ext.util.Format.number(v, '0.000,00/i')						
					}			
				},{
					 dataIndex	: 'pagpar_data_pagto'
					,header		: 'Pagamento'
					,width      : 80
					,sortable   : true
					,renderer   : Ext.util.Format.dateRenderer('d/m/Y')				
				},{
					 dataIndex	: 'pagpar_ano'
					,header		: 'Ano'
					,width      : 50
					,sortable   : true
				},{
					 dataIndex	: 'pagpar_historico'
					,header		: 'Historico'
					,width      : 200
					,sortable   : true						
				},{
					 dataIndex	: 'pagpar_observacao'
					,header		: 'Observação'
					,width      : 200
					,sortable   : true					
				},{
					 dataIndex	: 'pagpar_agencia'
					,header		: 'Agencia'
					,width      : 80
					,sortable   : true	
				},{
					 dataIndex	: 'pagpar_conta'
					,header		: 'Conta'
					,width      : 80
					,sortable   : true
				},{
					 dataIndex	: 'pagpar_banco'
					,header		: 'Banco'
					,width      : 80
					,sortable   : true
				},{
					 dataIndex	: 'pagpar_cheque'
					,header		: 'N Cheque'
					,width      : 80
					,sortable   : true
				},{
					dataIndex	: 'pagpar_id'
					,header		: 'Identificador'
					,width      : 80
					,sortable   : true						
				}]
			})
			//super
			conpagpar.superclass.initComponent.call(this);
		}
		
		,initEvents: function()
		{
			//super
			conpagpar.superclass.initEvents.call(this);
			
			/* Associa um listener para que quando o usu�rio clique em uma linha do grid
			 * a tela de cadastro do registro selecionado apare�a
			 */
			
			this.on({
			 	 scope		: this
				,rowdblclick: this._onGridRowDblClick
			});
		}	
		,onDestroy: function()
		{
			conpagpar.superclass.onDestroy.apply(this,arguments);
			
			//destr�i a janela de usu�rio e limpa sua refer�ncia	
			Ext.destroy(this._winPagpar)
			this._winPagpar = null;
		}	
		,_onGridRowDblClick: function( grid, rowIndex, e ) 
		{
			//busca registro da linha selecionada
			var record = grid.getStore().getAt(rowIndex);

			if( record.length === 0 )
			{
				Ext.Msg.alert('Aten��o','Selecione ao menos um registro!')
				return false;
			}			
			
			//extrai id
			var pagparID = record.get('pagpar_id');
			
			Ext.require('alt-pagpar',function(){				
				var winPagpar = new altpagpar();
				winPagpar.setPagparID(pagparID);
				winPagpar.show();
			},pagparID);		
		}
		,_onBtnBaixarClick: function()
		{
			//busca registro da linha selecionada
			var record = this.getSelectionModel().getSelections();
			
			if( record.length === 0 )
			{
				Ext.Msg.alert('Aten��o','Selecione ao menos um registro!')
				return false;
			}
			
			if(record[0].get('pagpar_instatus')=='1') {
				Ext.Msg.alert('Aten��o','Titulo j� foi pago!')
				return false;	
			}
			
			//extrai id
			var pagparID = record[0].get('pagpar_id');
			
			Ext.require('bxa-pagpar',function(){
				var winPagpar = new bxapagpar();
				winPagpar.setpagparID(pagparID);
				winPagpar.show();
			},pagparID);
		}
});

Ext.reg('e-conpagpar',conpagpar);