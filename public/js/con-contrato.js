var concontrato = Ext.extend(Ext.grid.GridPanel,{	
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
				   ,data   : [['locatario_desc','Locatario'],
				              ['contrato_numero','Numero'],				              
					          ['contrato_id','Identificador']]				   
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
				 url			: 'contrato/listar'
				,root			: 'rows'					
				,idProperty		: 'contrato_id'
				,totalProperty	: 'totalCount'
				,autoLoad		: true
				,autoDestroy	: true
				,remoteSort     : true
				,baseParams		: {
					 action	: 'contrato/listar'
					,limit	: 30
				}				
				,fields:[
					 {name:'contrato_id'	         ,type:'int'}
					,{name:'contrato_numero'         ,type:'int'}
					,{name:'locatario_desc'	         ,type:'string'}
					,{name:'tpcontrato_desc'         ,type:'string'}
					,{name:'contrato_data_cadastro'  ,type:'date',dateFormat: 'Y-m-d'}
					,{name:'contrato_proximo_vencto' ,type:'date',dateFormat: 'Y-m-d'}
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
				,bbar: new Ext.PagingToolbar({ //paginação
					 store		: this.store
					,pageSize	: 30
					,displayInfo: true					
		            ,displayMsg : 'Mostrando resultados {0} - {1} até {2}'
		            ,emptyMsg   : "Não há resultados"
				})
				,tbar:[new Ext.Toolbar.TextItem('Alterações,click duplo no registro'),{xtype:'tbseparator'},{
					 text	: 'Novo'	//botão para adicionar novo registro
					,iconCls: 'silk-add'
					,scope	: this
					,handler: this._onBtnNovoClick 
				},{
					 text	: 'Excluir Selecionados'
					,iconCls: 'silk-delete'
					,scope	: this
					,handler: this._onBtnExcluirSelecionadosClick 
				},{xtype:'tbseparator'},'Buscar',{xtype:'tbseparator'},this.comboFld,{xtype:'tbseparator'},this.txtSrch]
				,columns:[{
					dataIndex : 'contrato_id'
				   ,header	  : 'Identificador'
				   ,width     : 70	
				   ,sortable  : true
				},{
					dataIndex : 'contrato_numero'
				   ,header	  : 'Numero'
				   ,width     : 70	
				   ,sortable  : true			    
				},{
					dataIndex : 'locatario_desc'
				   ,header	  : 'Locatario'
				   ,width     : 300	
				   ,sortable  : true	
				},{
					dataIndex : 'tpcontrato_desc'
				   ,header	  : 'Tipo do contrato'
				   ,width     : 200
				   ,sortable  : true	
				},{
					dataIndex : 'contrato_data_cadastro'
				   ,header	  : 'Data'
				   ,width     : 80
				   ,sortable  : true
				   ,renderer  : Ext.util.Format.dateRenderer('d/m/Y')				
				},{
					dataIndex : 'contrato_proximo_vencto'
				   ,header	  : 'Proximo vencimento'
				   ,width     : 80
				   ,sortable  : true
				   ,renderer  : Ext.util.Format.dateRenderer('d/m/Y')				
				}]
			})			
			
			//super
			concontrato.superclass.initComponent.call(this);
		}
		
		,initEvents: function()
		{
			//super
			concontrato.superclass.initEvents.call(this);
			
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
			concontrato.superclass.onDestroy.apply(this,arguments);
			
			//destrói a janela de usuário e limpa sua referência	
			Ext.destroy(this._winContrato)
			this._winContrato = null;
		}	
		,_onBtnNovoClick: function()		
		{
			Ext.require('cad-contrato',function(){
				var winContrato = new cadcontrato();
				winContrato.setContratoID(0);
				winContrato.show();				
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
					
				var contratoID = [];
				for( var i = 0 ; i < arrSelecionados.length ; i++ )
				{
					contratoID.push( arrSelecionados[i].get('contrato_id') );
				}
				
				this.el.mask('Excluindo usuários');
				
				Ext.Ajax.request({
					 url	: 'contrato/excluir'
					,params	: {
						 action	         : 'excluir'
						,'contrato_id[]' : contratoID
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
			var contratoID = record.get('contrato_id');
			
			Ext.require('cad-contrato',function(){
				var winContrato = new cadcontrato();
				winContrato.setContratoID(contratoID);
				winContrato.show();
			},contratoID);
		}
		,_onCadastroContratoSalvarExcluir: function()
		{
			//recarrega grid
			this.store.reload();
		}	
});

Ext.reg('e-concontrato',concontrato);