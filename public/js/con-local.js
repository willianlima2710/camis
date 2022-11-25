var conlocal = Ext.extend(Ext.grid.GridPanel,{	
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
			    	id     : 'local_desc'
				   ,fields : ['id','field']
				   ,data   : [['local_desc','Descri��o'],
				              ['local_endereco','Endere�o'],
				              ['local_complem','Complemento'],
				              ['local_bairro','Bairro'],
				              ['local_cidade','Cidade'],
				              ['local_cep','CEP'],
				              ['estado_sigla','Estado'],
				              ['local_telefone','Telefone'],		                
				              ['local_id','Identificador']]				   
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
				 url			: 'local/listar'
				,root			: 'rows'					
				,idProperty		: 'local_id'
				,totalProperty	: 'totalCount'
				,autoLoad		: true
				,autoDestroy	: true
				,remoteSort     : true
				,baseParams		: {
					 action	: 'local/listar'
					,limit	: 30
				}				
				,fields:[
					 {name:'local_id'	    ,type:'int'}
					,{name:'local_desc'	    ,type:'string'}
					,{name:'local_endereco' ,type:'string'}
					,{name:'local_complem'  ,type:'string'}
					,{name:'local_bairro'   ,type:'string'}
					,{name:'local_cidade'   ,type:'string'}
					,{name:'local_cep'      ,type:'string'}
					,{name:'estado_sigla'   ,type:'string'}
					,{name:'local_telefone' ,type:'string'}					
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
					 text	  : 'Excluir Selecionados'
					,iconCls  : 'silk-delete'
					,scope	  : this
					,disabled : true
					,handler  : this._onBtnExcluirSelecionadosClick 
				},{xtype:'tbseparator'},'Buscar',{xtype:'tbseparator'},this.comboFld,{xtype:'tbseparator'},this.txtSrch]
				,columns:[{
					 dataIndex	: 'local_desc'
					,header		: 'Descri��o'
					,width      : 300	
					,sortable   : true	
				},{
					 dataIndex	: 'local_endereco'
					,header		: 'Endere�o'
					,width      : 70	
					,sortable   : true	
				},{				 
					 dataIndex	: 'local_complem'				
					,header		: 'Complemento'
					,width      : 70	
					,sortable   : true
					
				},{				 
					 dataIndex	: 'local_bairro'				
					,header		: 'Bairro'
					,width      : 70	
					,sortable   : true	
				},{
					 dataIndex	: 'local_cidade'
					,header		: 'Cidade'
					,width      : 70
					,sortable   : true						
				},{
					 dataIndex	: 'local_cep'
					,header		: 'CEP'
					,width      : 70
					,sortable   : true						
				},{
					 dataIndex	: 'estado_sigla'
					,header		: 'Estado'
					,width      : 70
					,sortable   : true						
				},{
					 dataIndex	: 'local_telefone'
					,header		: 'Telefone'
					,width      : 70
					,sortable   : true						
				},{
					 dataIndex	: 'local_id'
					,header		: 'Identificador'
					,width      : 70
					,sortable   : true						
				}]
			})
			
			
			//super
			conlocal.superclass.initComponent.call(this);
		}
		
		,initEvents: function()
		{
			//super
			conlocal.superclass.initEvents.call(this);
			
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
			conlocal.superclass.onDestroy.apply(this,arguments);
			
			//destr�i a janela de usu�rio e limpa sua refer�ncia	
			Ext.destroy(this._winLocal)
			this._winLocal = null;
		}	
		,_onBtnNovoClick: function()		
		{
			Ext.require('cad-local',function(){
				var winLocal = new cadlocal();
				winLocal.setLocalID(0);
				winLocal.show();				
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
					
				var localID = [];
				for( var i = 0 ; i < arrSelecionados.length ; i++ )
				{
					localID.push( arrSelecionados[i].get('local_id') );
				}
				
				this.el.mask('Excluindo usu�rios');
				
				Ext.Ajax.request({
					 url	: 'local/excluir'
					,params	: {
						 action	      : 'excluir'
						,'local_id[]' : localID
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
			var localID = record.get('local_id');
			
			Ext.require('cad-local',function(){
				var winLocal = new cadlocal();
				winLocal.setLocalID(localID);
				winLocal.show();
			},localID);
		}
		,_onCadastrolocalSalvarExcluir: function()
		{
			//recarrega grid
			this.store.reload();
		}	
});

Ext.reg('e-conlocal',conlocal);