var conentrest = Ext.extend(Ext.grid.GridPanel,{	
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
				    id     : 'entrest_desc'
				   ,fields : ['id','field']
				   ,data   : [['fornecedor_desc','Nome'],
				              ['notafis_numero','Nota fiscal']]   
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
				 url			: 'entrest/listar'
				,root			: 'rows'					
				,idProperty		: 'entrest_id'
				,totalProperty	: 'totalCount'
				,autoLoad		: true
				,autoDestroy	: true
				,remoteSort     : true
				,baseParams		: {
					 action	: 'entrest/listar'
					,limit	: 100
				}				
				,fields:[
					 {name:'entrest_id'	     ,type:'int'}
					,{name:'fornecedor_desc' ,type:'string'}
					,{name:'notafis_numero'  ,type:'string'}
					,{name:'entrest_data'    ,type:'date',dateFormat: 'Y-m-d'}
					,{name:'entrest_total'   ,type:'float'}
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
					 emptyText		: 'Nenhum registro encontrado'
		            ,forceFit       : true		             
				    ,enableRowBody  : true
				    ,showPreview    : true
				 	,deferEmptyText : false
				 	 ,getRowClass    : function(record){
				 		 if(record.data.entrest_data_inativo){                    	
	                        return 'inativo';
	                     }
		             }

				 }
				,bbar: new Ext.PagingToolbar({ //pagina��o
					 store		: this.store
					,pageSize	: 100
					,displayInfo: true					
		            ,displayMsg : 'Mostrando resultados {0} - {1} até {2}'
		            ,emptyMsg   : "Não há resultados"
				})
				,tbar: [new Ext.Toolbar.TextItem('Alterações,click duplo no registro'),{xtype:'tbseparator'},{
					 text	: 'Novo'	//bot�o para adicionar novo registro
					,iconCls: 'silk-add'
					,scope	: this
					,handler: this._onBtnNovoClick 
				},{
					 text	: 'Excluir'
					,iconCls: 'silk-delete'
					,scope	: this
					,disabled : true
					,handler: this._onBtnExcluirSelecionadosClick 				
				},{xtype:'tbseparator'},'Buscar',{xtype:'tbseparator'},this.comboFld,{xtype:'tbseparator'},this.txtSrch]
				,columns:[{					
					dataIndex : 'entrest_id'
				   ,header	  : 'Identificador'
				   ,width     : 70	
				   ,sortable  : true	
				},{					
					dataIndex : 'fornecedor_desc'
				   ,header	  : 'Fornecedor'
				   ,width     : 300	
				   ,sortable  : true					
				},{
					dataIndex : 'notafis_numero'
				   ,header	  :	 'Nº Nota'
				   ,width     : 70	
				   ,sortable  : true
				},{					
					dataIndex : 'entrest_data'
				   ,header	  : 'Emissão'
				   ,width     : 100
				   ,sortable  : true	
				   ,renderer  : Ext.util.Format.dateRenderer('d/m/Y')
				},{
					dataIndex : 'entrest_total'
 				   ,header	  : 'Valor total'
				   ,width     : 70	
				   ,sortable  : true
				   ,renderer  : function(v){
						return Ext.util.Format.number(v, '0.000,00/i')						
				   } 										   
				}]
			})
			
			
			//super
			conentrest.superclass.initComponent.call(this);
		}
		
		,initEvents: function()
		{
			//super
			conentrest.superclass.initEvents.call(this);
			
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
			conentrest.superclass.onDestroy.apply(this,arguments);
			
			Ext.destroy(this._winentrest)
			this._winentrest = null;
		}	
		,_onBtnNovoClick: function()		
		{
			Ext.require('mov-entrest',function(){
				var winentrest = new moventrest();
				winentrest.setEntrestID(0);
				winentrest.show();				
			});
			this.store.reload();
		}
		,_onBtnExcluirSelecionadosClick: function()
		{
			//busco selecionados
			var arrSelecionados = this.getSelectionModel().getSelections();
			
			if( arrSelecionados.length === 0 )
			{
				Ext.Msg.alert('Atenção','Selecione ao menos um registro!')
				return false;
			}
			
			Ext.Msg.confirm('Confirmação','Deseja mesmo excluir o(s) registro(s) selecionado(s)?',function(opt){
				
				if(opt === 'no')
					return;
					
				var entrestID = [];
				for( var i = 0 ; i < arrSelecionados.length ; i++ )
				{
					entrestID.push( arrSelecionados[i].get('entrest_id') );
				}
				
				this.el.mask('Excluindo');
				
				Ext.Ajax.request({
					 url	: 'entrest/excluir'
					,params	: {
						 action	      : 'excluir'
						,'entrest_id' : entrestID
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
			var entrestID = record.get('entrest_id');
			
			Ext.require('mov-entrest',function(){
				var winentrest = new moventrest();
				winentrest.setEntrestID(entrestID);
				winentrest.show();
			},entrestID);
		}
		,_onCadastroentrestSalvarExcluir: function()
		{
			//recarrega grid
			this.store.reload();
		}	
});

Ext.reg('e-conentrest',conentrest);
