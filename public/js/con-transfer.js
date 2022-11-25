var contransfer = Ext.extend(Ext.grid.GridPanel,{	
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
			    	id     : 'transfer_desc'
				   ,fields : ['id','field']
				   ,data   : [['locatario_desc_antigo','Locatario antigo'],
				              ['locatario_desc_novo','Locatario novo'],
				              ['transfer_id','Identificador']]				   
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
				 url			: 'transfer/listar'
				,root			: 'rows'					
				,idProperty		: 'transfer_id'
				,totalProperty	: 'totalCount'
				,autoLoad		: true
				,autoDestroy	: true
				,remoteSort     : true
				,baseParams		: {
					 action	: 'transfer/listar'
					,limit	: 30
				}				
				,fields:[
					 {name:'transfer_id'	       ,type:'int'}
 				    ,{name:'locatario_id_antigo'   ,type:'int'} 
					,{name:'locatario_desc_antigo' ,type:'string'}					
					,{name:'locatario_id_novo'     ,type:'int'}
					,{name:'locatario_desc_novo'   ,type:'string'}
					,{name:'jazigo_codigo'         ,type:'string'}					
					,{name:'transfer_data'         ,type:'date',dateFormat: 'Y-m-d'}
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
				 }
				,bbar: new Ext.PagingToolbar({ //pagina��o
					 store		: this.store
					,pageSize	: 30
					,displayInfo: true					
		            ,displayMsg : 'Mostrando resultados {0} - {1} at� {2}'
		            ,emptyMsg   : "N�o h� resultados"
				})
				,tbar:[new Ext.Toolbar.TextItem('Altera��es,click duplo no registro'),{xtype:'tbseparator'},{
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
					 dataIndex	: 'locatario_desc_antigo'
					,header		: 'Antigo locatario'
					,width      : 300	
					,sortable   : true
				},{
					 dataIndex	: 'locatario_desc_novo'
					,header		: 'Novo locatario'
					,width      : 300	
					,sortable   : true
				},{
					 dataIndex	: 'jazigo_codigo'
					,header		: 'Jazigo'
					,width      : 100	
					,sortable   : true					
				},{
					 dataIndex	: 'transfer_data'
					,header		: 'Data'
					,width      : 80
					,sortable   : true
					,renderer   : Ext.util.Format.dateRenderer('d/m/Y')				
				},{
					 dataIndex	: 'transfer_id'
					,header		: 'Identificador'
					,width      : 70
					,sortable   : true						
				}]
			})			
			
			//super
			contransfer.superclass.initComponent.call(this);
		}
		
		,initEvents: function()
		{
			//super
			contransfer.superclass.initEvents.call(this);
			
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
			contransfer.superclass.onDestroy.apply(this,arguments);
			
			//destr�i a janela de usu�rio e limpa sua refer�ncia	
			Ext.destroy(this._winTransfer)
			this._winTransfer = null;
		}	
		,_onBtnNovoClick: function()		
		{
			Ext.require('cad-transfer',function(){
				var winTransfer = new cadtransfer();
				winTransfer.setTransferID(0);
				winTransfer.show();				
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
					
				var transferID = [];
				for( var i = 0 ; i < arrSelecionados.length ; i++ )
				{
					transferID.push( arrSelecionados[i].get('transfer_id') );
				}
				
				this.el.mask('Excluindo usu�rios');
				
				Ext.Ajax.request({
					 url	: 'transfer/excluir'
					,params	: {
						 action	         : 'excluir'
						,'transfer_id[]' : transferID
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
			var transferID = record.get('transfer_id');
			
			Ext.require('cad-transfer',function(){
				var winTransfer = new cadtransfer();
				winTransfer.setTransferID(transferID);
				winTransfer.show();
			},transferID);
		}
		,_onCadastroTransferSalvarExcluir: function()
		{
			//recarrega grid
			this.store.reload();
		}	
});

Ext.reg('e-contransfer',contransfer);