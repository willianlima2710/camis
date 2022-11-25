var confornecedor = Ext.extend(Ext.grid.GridPanel,{	
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
			    	id     : 'fornecedor_desc'
				   ,fields : ['id','field']
				   ,data   : [['fornecedor_desc','Descrição'],
				              ['fornecedor_telefone','Telefone'],
				              ['fornecedor_id','Identificador']]				   
			    })			
			})
			
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
				 url			: 'fornecedor/listar'
				,root			: 'rows'					
				,idProperty		: 'fornecedor_id'
				,totalProperty	: 'totalCount'
				,autoLoad		: true
				,autoDestroy	: true
				,remoteSort     : true
				,baseParams		: {
					 action	: 'fornecedor/listar'
					,limit	: 30
				}				
				,fields:[
					 {name:'fornecedor_id'		 ,type:'int'}
					,{name:'fornecedor_desc'	 ,type:'string'}
					,{name:'fornecedor_telefone' ,type:'string'}
					,{name:'fornecedor_endereco' ,type:'string'}
					,{name:'fornecedor_cidade'   ,type:'string'}
					,{name:'estado_sigla'        ,type:'string'}
					,{name:'fornecedor_cpfcnpj'  ,type:'string'}			
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
		             ,forceFit      : true		             
				     ,enableRowBody : true
				     ,showPreview   : true
				 	,deferEmptyText : false
				 }
				,bbar: new Ext.PagingToolbar({ //paginação
					 store		: this.store
					,pageSize	: 30
					,displayInfo: true					
		            ,displayMsg : 'Mostrando resultados {0} - {1} até {2}'
		            ,emptyMsg   : "Não há resultados"
				})
				,tbar: [new Ext.Toolbar.TextItem('Alterações,click duplo no registro'),{xtype:'tbseparator'},{
					 text	: 'Novo'	//botão para adicionar novo registro
					,iconCls: 'silk-add'
					,scope	: this
					,handler: this._onBtnNovoClick 
				},{
					 text 	  : 'Excluir Selecionados'
					,iconCls  : 'silk-delete'
					,scope	  : this
					,disabled : true
					,handler  : this._onBtnExcluirSelecionadosClick 
				},{xtype:'tbseparator'},'Buscar',{xtype:'tbseparator'},this.comboFld,{xtype:'tbseparator'},this.txtSrch]
				,columns:[{
					 dataIndex	: 'fornecedor_desc'
					,header		: 'Descrição'
					,width      : 200	
					,sortable   : true	
				},{
					 dataIndex	: 'fornecedor_telefone'
					,header		: 'Telefone'
					,width      : 70	
					,sortable   : true	
				},{
					 dataIndex	: 'fornecedor_endereco'
					,header		: 'Endereço'
					,width      : 70	
					,sortable   : true	
				},{
					 dataIndex	: 'fornecedor_cidade'
					,header		: 'Cidade'
					,width      : 70	
					,sortable   : true	
				},{
					 dataIndex	: 'estado_sigla'
					,header		: 'Estado'
					,width      : 20	
					,sortable   : true	
				},{
					 dataIndex	: 'fornecedor_cpfcnpj'
					,header		: 'CPF/CNPJ'
					,width      : 70	
					,sortable   : true	
				},{
					 dataIndex	: 'fornecedor_id'
					,header		: 'Identificador'
					,width      : 70
					,sortable   : true						
				}]
			})
			
			
			//super
			confornecedor.superclass.initComponent.call(this);
		}
		
		,initEvents: function()
		{
			//super
			confornecedor.superclass.initEvents.call(this);
			
			/* Associa um listener para que quando o usuário clique em uma linha do grid
			 * a tela de cadastro do registro selecionado apareça
			 */
			this.on({
			 	 scope		: this
				,rowdblclick: this._onGridRowDblClick
			});
		}	
		,onDestroy: function()
		{
			confornecedor.superclass.onDestroy.apply(this,arguments);
			
			//destrói a janela de usuário e limpa sua referência	
			Ext.destroy(this._winFornecedor)
			this._winFornecedor = null;
		}	
		,_onBtnNovoClick: function()		
		{
			Ext.require('cad-fornecedor',function(){
				var winFornecedor = new cadfornecedor();
				winFornecedor.setFornecedorID(0);
				winFornecedor.show();				
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
					
				var fornecedorID = [];
				for( var i = 0 ; i < arrSelecionados.length ; i++ )
				{
					fornecedorID.push( arrSelecionados[i].get('fornecedor_id') );
				}
				
				this.el.mask('Excluindo usuários');
				
				Ext.Ajax.request({
					 url	: 'fornecedor/excluir'
					,params	: {
						 action	           : 'excluir'
						,'fornecedor_id[]' : fornecedorID
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
			var fornecedorID = record.get('fornecedor_id');
			
			Ext.require('cad-fornecedor',function(){
				var winFornecedor = new cadfornecedor();
				winFornecedor.setFornecedorID(fornecedorID);
				winFornecedor.show();
			},fornecedorID);
		}
		,_onCadastroFornecedorSalvarExcluir: function()
		{
			//recarrega grid
			this.store.reload();
		}	
});

Ext.reg('e-confornecedor',confornecedor);