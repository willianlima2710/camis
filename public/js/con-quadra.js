var conquadra = Ext.extend(Ext.grid.GridPanel,{	
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
			    	id     : 'quadra_desc'
				   ,fields : ['id','field']
				   ,data   : [['quadra_codigo','Código'],
				              ['quadra_desc','Descrição'],
				              ['quadra_id','Identificador']]				   
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
				 url			: 'quadra/listar'
				,root			: 'rows'					
				,idProperty		: 'quadra_id'
				,totalProperty	: 'totalCount'
				,autoLoad		: true
				,autoDestroy	: true
				,remoteSort     : true
				,baseParams		: {
					 action	: 'quadra/listar'
					,limit	: 30
				}				
				,fields:[
					 {name:'quadra_id'		 ,type:'int'}
					,{name:'quadra_desc'	 ,type:'string'}
					,{name:'quadra_codigo'	 ,type:'string'}
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
					 text	  : 'Excluir Selecionados'
					,iconCls  : 'silk-delete'
					,scope	  : this
					,disabled : true
					,handler  : this._onBtnExcluirSelecionadosClick 
				},{xtype:'tbseparator'},'Buscar',{xtype:'tbseparator'},this.comboFld,{xtype:'tbseparator'},this.txtSrch]
				,columns:[{
					 dataIndex	: 'quadra_desc'
					,header		: 'Descrição'
					,width      : 200	
					,sortable   : true	
				},{
					 dataIndex	: 'quadra_codigo'
					,header		: 'Código'
					,width      : 70	
					,sortable   : true	
				},{
					 dataIndex	: 'quadra_id'
					,header		: 'Identificador'
					,width      : 70
					,sortable   : true						
				}]
			})
			
			
			//super
			conquadra.superclass.initComponent.call(this);
		}
		
		,initEvents: function()
		{
			//super
			conquadra.superclass.initEvents.call(this);
			
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
			conquadra.superclass.onDestroy.apply(this,arguments);
			
			//destrói a janela de usuário e limpa sua referência	
			Ext.destroy(this._winQuadra)
			this._winQuadra = null;
		}	
		,_onBtnNovoClick: function()		
		{
			Ext.require('cad-quadra',function(){
				var winQuadra = new cadquadra();
				winQuadra.setQuadraID(0);
				winQuadra.show();				
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
					
				var quadraID = [];
				for( var i = 0 ; i < arrSelecionados.length ; i++ )
				{
					quadraID.push( arrSelecionados[i].get('quadra_id') );
				}
				
				this.el.mask('Excluindo usuários');
				
				Ext.Ajax.request({
					 url	: 'quadra/excluir'
					,params	: {
						 action	        : 'excluir'
						,'quadra_id[]'	: quadraID
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
			var quadraID = record.get('quadra_id');
			
			Ext.require('cad-quadra',function(){
				var winQuadra = new cadquadra();
				winQuadra.setQuadraID(quadraID);
				winQuadra.show();
			},quadraID);
		}
		,_onCadastroQuadraSalvarExcluir: function()
		{
			//recarrega grid
			this.store.reload();
		}	
});

Ext.reg('e-conquadra',conquadra);