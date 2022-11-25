var conreqest = Ext.extend(Ext.grid.GridPanel,{	
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
				    id     : 'reqest_desc'
				   ,fields : ['id','field']
				   ,data   : [['reqest_desc','Requisitante']]   
			    })			
			})
			this.comboFld.setValue('reqest_desc');
			
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
				 url			: 'reqest/listar'
				,root			: 'rows'					
				,idProperty		: 'reqest_id'
				,totalProperty	: 'totalCount'
				,autoLoad		: true
				,autoDestroy	: true
				,remoteSort     : true
				,baseParams		: {
					 action	: 'reqest/listar'
					,limit	: 100
				}				
				,fields:[
					 {name:'reqest_id'	 ,type:'int'}
					,{name:'reqest_data' ,type:'date',dateFormat: 'Y-m-d'}
					,{name:'reqest_desc' ,type:'string'}
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
				 		 if(record.data.reqest_data_inativo){                    	
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
					,handler: this._onBtnExcluirSelecionadosClick 				
				},{xtype:'tbseparator'},'Buscar',{xtype:'tbseparator'},this.comboFld,{xtype:'tbseparator'},this.txtSrch]
				,columns:[{					
					dataIndex : 'reqest_id'
				   ,header	  : 'Identificador'
				   ,width     : 70	
				   ,sortable  : true	
				},{					
					dataIndex : 'reqest_data'
				   ,header	  : 'Emissão'
				   ,width     : 100
				   ,sortable  : true	
				   ,renderer  : Ext.util.Format.dateRenderer('d/m/Y')				   
				},{					
					dataIndex : 'reqest_desc'
				   ,header	  : 'Requisitante'
				   ,width     : 300	
				   ,sortable  : true					
				}]
			})			
			
			//super
			conreqest.superclass.initComponent.call(this);
		}
		
		,initEvents: function()
		{
			//super
			conreqest.superclass.initEvents.call(this);
			
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
			conreqest.superclass.onDestroy.apply(this,arguments);
			
			Ext.destroy(this._winreqest)
			this._winreqest = null;
		}	
		,_onBtnNovoClick: function()		
		{
			Ext.require('mov-reqest',function(){
				var winreqest = new movreqest();
				winreqest.setReqestID(0);
				winreqest.show();				
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
					
				var reqestID = [];
				for( var i = 0 ; i < arrSelecionados.length ; i++ )
				{
					reqestID.push( arrSelecionados[i].get('reqest_id') );
				}
				
				this.el.mask('Excluindo');
				
				Ext.Ajax.request({
					 url	: 'reqest/excluir'
					,params	: {
						 action	      : 'excluir'
						,'reqest_id' : reqestID
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
			var reqestID = record.get('reqest_id');
			
			Ext.require('mov-reqest',function(){
				var winreqest = new movreqest();
				winreqest.setReqestID(reqestID);
				winreqest.show();
			},reqestID);
		}
		,_onCadastroreqestSalvarExcluir: function()
		{
			//recarrega grid
			this.store.reload();
		}	
});

Ext.reg('e-conreqest',conreqest);
