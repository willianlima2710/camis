var conjazigo = Ext.extend(Ext.grid.GridPanel,{	
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
			    	id       : 'jazigo_desc'
				   ,fields   : ['id','field']
				   ,data     : [['jazigo_codigo','Código'],
					            ['jazigo_desc','Descrição'],
					            ['jazigo_id','Identificador']]		
			    })
			})
			this.comboFld.setValue('jazigo_codigo');
			
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
				 url			: 'jazigo/listar'
				,root			: 'rows'					
				,idProperty		: 'jazigo_id'
				,totalProperty	: 'totalCount'
				,autoLoad		: true
				,autoDestroy	: true
				,remoteSort     : true
				,baseParams		: {
					 action	: 'jazigo/listar'
					,limit	: 30
				}				
				,fields:[
                     {name:'jazigo_id'   	 ,type:'int'}
					,{name:'jazigo_codigo'	 ,type:'string'}
					,{name:'jazigo_desc'	 ,type:'string'}
					,{name:'lote_codigo'	 ,type:'string'}
					,{name:'quadra_codigo'	 ,type:'string'}
					,{name:'cemiterio_desc'	 ,type:'string'}
					
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
		            ,displayMsg : 'Mostrando resultados {0} - {1} até {2}'
		            ,emptyMsg   : "Não há resultados"
				})
				,tbar:[new Ext.Toolbar.TextItem('Alterações,click duplo no registro'),{xtype:'tbseparator'},{
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
					 dataIndex	: 'jazigo_codigo'
					,header		: 'Código'
					,width      : 20	
					,sortable   : true	
				},{
					 dataIndex	: 'jazigo_desc'
					,header		: 'Descrição'
					,width      : 20	
					,sortable   : true	
				},{
					 dataIndex	: 'cemiterio_desc'
					,header		: 'Cemiterio'
					,width      : 40
					,sortable   : true						
				},{
					 dataIndex	: 'lote_codigo'
					,header		: 'Lote'
					,width      : 20
					,sortable   : true						
				},{
					 dataIndex	: 'quadra_codigo'
					,header		: 'Quadra'
					,width      : 20
					,sortable   : true						
				},{
					 dataIndex	: 'jazigo_id'
					,header		: 'Identificador'
					,width      : 20
					,sortable   : true						
				}]
			})
			
			
			//super
			conjazigo.superclass.initComponent.call(this);
		}
		
		,initEvents: function()
		{
			//super
			conjazigo.superclass.initEvents.call(this);
			
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
			conjazigo.superclass.onDestroy.apply(this,arguments);
			
			//destr�i a janela de usu�rio e limpa sua refer�ncia	
			Ext.destroy(this._winJazigo)
			this._winJazigo = null;
		}	
		,_onBtnNovoClick: function()		
		{
			Ext.require('cad-jazigo',function(){
				var winJazigo = new cadjazigo();
				winJazigo.setJazigoID(0);
				winJazigo.show();				
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
					
				var jazigoID = [];
				for( var i = 0 ; i < arrSelecionados.length ; i++ )
				{
					jazigoID.push( arrSelecionados[i].get('jazigo_id') );
				}
				
				this.el.mask('Excluindo usu�rios');
				
				Ext.Ajax.request({
					 url	: 'jazigo/excluir'
					,params	: {
						 action	       : 'excluir'
						,'jazigo_id[]' : jazigoID
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
			var jazigoID = record.get('jazigo_id');
			
			Ext.require('cad-jazigo',function(){
				var winJazigo = new cadjazigo();
				winJazigo.setJazigoID(jazigoID);
				winJazigo.show();
			},jazigoID);
		}
		,_onCadastroJazigoSalvarExcluir: function()
		{
			//recarrega grid
			this.store.reload();
		}	
});

Ext.reg('e-conjazigo',conjazigo);