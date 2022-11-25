var conbanco = Ext.extend(Ext.grid.GridPanel,{	
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
			    	id     : 'banco_desc'
				   ,fields : ['id','field']
				   ,data   : [['banco_desc','Descri��o'],
				              ['banco_codigo','Codigo'],
				              ['banco_id','Identificador']]				   
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
			});
			this.comboFld.setValue('banco_desc');
			
			//store do grid
			this.store = new Ext.data.JsonStore({
				 url			: 'banco/listar'
				,root			: 'rows'					
				,idProperty		: 'banco_id'
				,totalProperty	: 'totalCount'
				,autoLoad		: true
				,autoDestroy	: true
				,remoteSort     : true
				,baseParams		: {
					 action	: 'banco/listar'
					,limit	: 30
				}				
				,fields:[
					 {name:'banco_id'  	         ,type:'int'}
					,{name:'banco_desc'	         ,type:'string'}
					,{name:'banco_codigo'        ,type:'string'}
					,{name:'banco_agencia'       ,type:'string'}
					,{name:'banco_conta'         ,type:'string'}
					,{name:'banco_saldo_inicial' ,type:'float'}
					,{name:'banco_saldo_atual'   ,type:'float'}
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
					,disabled : true
					,handler: this._onBtnExcluirSelecionadosClick 
				},{xtype:'tbseparator'},'Buscar',{xtype:'tbseparator'},this.comboFld,{xtype:'tbseparator'},this.txtSrch]
				,columns:[{
					 dataIndex	: 'banco_desc'
					,header		: 'Descri��o'
					,width      : 300	
					,sortable   : true	
				},{
					 dataIndex	: 'banco_codigo'
					,header		: 'C�digo'
					,width      : 70	
					,sortable   : true
				},{
					 dataIndex	: 'banco_agencia'
					,header		: 'Agencia'
					,width      : 70	
					,sortable   : true	
				},{
					 dataIndex	: 'banco_conta'
					,header		: 'Conta'
					,width      : 70	
					,sortable   : true	
				},{
					 dataIndex	: 'banco_saldo_inicial'
					,header		: 'Saldo inicial'
					,width      : 70	
					,sortable   : true
				    ,renderer   : function(v){
						return Ext.util.Format.number(v, '0.000,00/i')						
					}					
				},{
					 dataIndex	: 'banco_saldo_atual'
					,header		: 'Saldo final'
					,width      : 70	
					,sortable   : true
				    ,renderer   : function(v){
						return Ext.util.Format.number(v, '0.000,00/i')						
					}					
				},{
					 dataIndex	: 'banco_id'
					,header		: 'Identificador'
					,width      : 70
					,sortable   : true						
				}]
			})
			
			
			//super
			conbanco.superclass.initComponent.call(this);
		}
		
		,initEvents: function()
		{
			//super
			conbanco.superclass.initEvents.call(this);
			
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
			conbanco.superclass.onDestroy.apply(this,arguments);
			
			//destr�i a janela de usu�rio e limpa sua refer�ncia	
			Ext.destroy(this._winbanco)
			this._winbanco = null;
		}	
		,_onBtnNovoClick: function()		
		{
			Ext.require('cad-banco',function(){
				var winbanco = new cadbanco();
				winbanco.setBancoID(0);
				winbanco.show();				
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
					
				var bancoID = [];
				for( var i = 0 ; i < arrSelecionados.length ; i++ )
				{
					bancoID.push( arrSelecionados[i].get('banco_id') );
				}
				
				this.el.mask('Excluindo bancos');
				
				Ext.Ajax.request({
					 url	: 'banco/excluir'
					,params	: {
						 action	      : 'excluir'
						,'banco_id[]' : bancoID
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
			var bancoID = record.get('banco_id');
			
			Ext.require('cad-banco',function(){
				var winBanco = new cadbanco();
				winBanco.setBancoID(bancoID);
				winBanco.show();
			},bancoID);
		}
		,_onCadastrobancoSalvarExcluir: function()
		{
			//recarrega grid
			this.store.reload();
		}	
});

Ext.reg('e-conbanco',conbanco);