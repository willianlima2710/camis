var concaixa = Ext.extend(Ext.grid.GridPanel,{	
		 border		: false
		,stripeRows	: true	
		,loadMask	: true
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
			    	id     : 'locatario_desc'
				   ,fields : ['id','field']
				   ,data   : [['caixa_mesano','MesAno'],
				              ['locfor_desc','Locatario/Fornecedor'],
				              ['caixa_documento','Documento'],
				              ['caixa_historico','Historico']]				   
			    })			
			})
			this.comboFld.setValue('locfor_desc');
			
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
				 url			: 'caixa/listar2'
				,root			: 'rows'					
				,idProperty		: 'caixa_id'
				,totalProperty	: 'totalCount'
				,autoLoad		: true
				,autoDestroy	: true
				,remoteSort     : true
				,baseParams		: {
					 action	: 'caixa/listar2'
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
			
			//passa paramatros depois do load, referente o conteudo escolhido
			this.store.on('beforeload',function(){
				this.baseParams = {
						value : txtbusca
					   ,field : txtfield
				}
			});
			
			//demais atributos do grid
			Ext.apply(this,{
				 viewConfig:{
					  emptyText		 : 'Nenhum registro encontrado'
		             ,forceFit       : false		             
				     ,enableRowBody  : true
				     ,showPreview    : true
				 	 ,deferEmptyText : false
				 }
				,bbar: new Ext.PagingToolbar({ //pagina��o
					 store		: this.store
					,pageSize	: 30
					,displayInfo: true					
		            ,displayMsg : 'Mostrando resultados {0} - {1} at� {2}'
		            ,emptyMsg   : "N�o h� resultados"
				})
				,tbar: [new Ext.Toolbar.TextItem('Altera��es,click duplo no registro'),{xtype:'tbseparator'},{
					 text	: 'Novo'	//bot�o para adicionar novo registro
					,iconCls: 'silk-add'
					,scope	: this
					,handler: this._onBtnNovoClick 
				},{
					 text	: 'Excluir Selecionados'
					,iconCls: 'silk-delete'
					,scope	: this
					,disabled: true
					,handler: this._onBtnExcluirSelecionadosClick 
				},{xtype:'tbseparator'},'Buscar',{xtype:'tbseparator'},this.comboFld,{xtype:'tbseparator'},this.txtSrch]
				,columns:[{
					 dataIndex	: 'caixa_data_movto'
					,header		: 'Movimento'
					,width      : 70
					,sortable   : true
					,renderer   : Ext.util.Format.dateRenderer('d/m/Y')					
				},{
					 dataIndex	: 'banco_desc'
					,header		: 'Banco'
					,width      : 100
					,sortable   : true	
				},{					
					 dataIndex	: 'conta_desc'
					,header		: 'Conta'
					,width      : 250
					,sortable   : true	
				},{
					 dataIndex	: 'locfor_desc'
					,header		: 'Nome'
					,width      : 300
					,sortable   : true						
				},{
					 dataIndex	: 'caixa_documento'
					,header		: 'Documento'
					,width      : 70
					,sortable   : true						
				},{
					 dataIndex	: 'valor_credito'
					,header		: 'Credito'
					,width      : 80
					,sortable   : true
				},{
					 dataIndex	: 'valor_debito'
					,header		: 'Debito'
					,width      : 80
					,sortable   : true
				},{
					 dataIndex	: 'caixa_historico'
					,header		: 'Historico'
					,width      : 400
					,sortable   : true
				}]					
			})
			
			
			//super
			concaixa.superclass.initComponent.call(this);
		}
		
		,initEvents: function()
		{
			//super
			concaixa.superclass.initEvents.call(this);
			
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
			concaixa.superclass.onDestroy.apply(this,arguments);
			
			//destr�i a janela de usu�rio e limpa sua refer�ncia	
			Ext.destroy(this._wincaixa)
			this._wincaixa = null;
		}	
		,_onBtnNovoClick: function()		
		{
			Ext.require('cad-caixa',function(){
				var winCaixa = new cadcaixa();
				winCaixa.setcaixaID(0);
				winCaixa.show();				
			});
			this.store.reload();
		}
		,_onBtnExcluirSelecionadosClick: function()
		{
			//busco selecionados
			var arrSelecionados = this.getSelectionModel().getSelections();
			
			if( arrSelecionados.length === 0 )
			{
				Ext.Msg.alert('Aten��o','Selecione ao menos um registro!')
				return false;
			}
			
			Ext.Msg.confirm('Confirma��o','Deseja mesmo excluir o(s) registro(s) selecionado(s)?',function(opt){
				
				if(opt === 'no')
					return;
					
				var caixaID = [];
				for( var i = 0 ; i < arrSelecionados.length ; i++ )
				{
					caixaID.push( arrSelecionados[i].get('caixa_id') );
				}
				
				this.el.mask('Excluindo usu�rios');
				
				Ext.Ajax.request({
					 url	: 'caixa/excluir'
					,params	: {
						 action	      : 'excluir'
						,'caixa_id[]' : caixaID
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
		,_onGridRowDblClick: function( grid, rowIndex, e ) 
		{
			//busca registro da linha selecionada
			var record = grid.getStore().getAt(rowIndex);
			
			//extrai id
			var caixaID = record.get('caixa_id');
			
			Ext.require('cad-caixa',function(){				
				var wincaixa = new cadcaixa();
				wincaixa.setcaixaID(caixaID);
				wincaixa.show();
			},caixaID);
		}
		,_onCadastroCaixaSalvarExcluir: function()
		{
			//recarrega grid
			this.store.reload();
		}	
});

Ext.reg('e-concaixa',concaixa);