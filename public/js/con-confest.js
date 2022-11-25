var conconfest = Ext.extend(Ext.grid.GridPanel,{	
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
				   ,data   : [['empresa_desc','Nome']]   
			    })			
			})
			this.comboFld.setValue('empresa_desc');
			
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
				 url			: 'confest/listar'
				,root			: 'rows'					
				,idProperty		: 'confest_id'
				,totalProperty	: 'totalCount'
				,autoLoad		: true
				,autoDestroy	: true
				,remoteSort     : true
				,baseParams		: {
					 action	: 'confest/listar'
					,limit	: 30
				}				
				,fields:[
					 {name:'confest_id'    ,type:'int'}
				    ,{name:'confest_data'  ,type:'date',dateFormat: 'Y-m-d'}					 
					,{name:'empresa_id'    ,type:'int'}
					,{name:'empresa_desc'  ,type:'string'}					
					,{name:'confest_hora'  ,type:'string'}
					,{name:'confest_desc'  ,type:'string'}
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
					header	  : 'Identificador'
				   ,dataIndex : 'confest_id'
				   ,align	  : 'center'
				   ,width	  : 70
				   ,fixed	  : true
				},{
				    dataIndex : 'confest_data'
				   ,header	  : 'Data'
				   ,width     : 100
				   ,sortable  : true
				   ,renderer  : Ext.util.Format.dateRenderer('d/m/Y')		   
				},{
				    dataIndex : 'empresa_desc'
				   ,header	  : 'Empresa'
				   ,width     : 300
				   ,sortable  : true
				},{
				    dataIndex : 'confest_hora'
				   ,header	  : 'Hora'
				   ,width     : 70
				   ,sortable  : true
				},{
				    dataIndex : 'confest_desc'
				   ,header	  : 'Descrição'
				   ,width     : 250
				   ,sortable  : true
				}]
			})
			
			
			//super
			conconfest.superclass.initComponent.call(this);
		}
		
		,initEvents: function()
		{
			//super
			conconfest.superclass.initEvents.call(this);
			
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
			conconfest.superclass.onDestroy.apply(this,arguments);
			
			Ext.destroy(this._winconfest)
			this._winconfest = null;
		}	
		,_onBtnNovoClick: function()		
		{
			Ext.require('mov-confest',function(){
				var winconfest = new movconfest();
				winconfest.setConfestID(0);
				winconfest.show();				
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
					 url	: 'confest/excluir'
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
			var confestID = record.get('confest_id');
			
			Ext.require('mov-confest',function(){
				var winconfest = new movconfest();
				winconfest.setConfestID(confestID);
				winconfest.show();
			},confestID);
		}
		,_onCadastroentrestSalvarExcluir: function()
		{
			//recarrega grid
			this.store.reload();
		}	
});

Ext.reg('e-conconfest',conconfest);
