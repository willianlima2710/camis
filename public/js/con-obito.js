var conobito = Ext.extend(Ext.grid.GridPanel,{	
		 border		: false
		,stripeRows	: true	
		,loadMask	: true
        ,autoScroll : true
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
				   ,data   : [['obito_nrobito','Nº Obito'],
				              ['locatario_desc','Locatario'],
				              ['jazigo_codigo','Jazigo'],
				              ['obito_falecido','Falecido'],
				              ['obito_apelido','Apelido']]				   
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
				 url			: 'obito/listar'
				,root			: 'rows'					
				,idProperty		: 'obito_id'
				,totalProperty	: 'totalCount'
				,autoLoad		: true
				,autoDestroy	: true
				,remoteSort     : true
				,baseParams		: {
					 action	: 'obito/listar'
					,limit	: 30
				}				
				,fields:[
					 {name:'obito_id'	            ,type:'int'}
					,{name:'obito_nrobito'          ,type:'string'}
                    ,{name:'obito_lacre'            ,type:'string'}
					,{name:'locatario_id'           ,type:'int'}
					,{name:'locatario_desc'         ,type:'string'}
					,{name:'obito_falecido'         ,type:'string'}
					,{name:'obito_apelido'          ,type:'string'}					
					,{name:'morte_desc'             ,type:'string'}
					,{name:'jazigo_codigo'          ,type:'string'}
					,{name:'obito_data_falecimento' ,type:'date',dateFormat: 'Y-m-d'}
					,{name:'obito_hora'             ,type:'string'}	
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
					  emptyText		 : 'Nenhum registro encontrado'
		             ,forceFit       : false
				     ,enableRowBody  : true
				     ,showPreview    : true
				 	 ,deferEmptyText : false
				 }
				,bbar: new Ext.PagingToolbar({ //pagina��o
					 store		: this.store
					,pageSize	: 30
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
					 text	  : 'Excluir Selecionados'
					,iconCls  : 'silk-delete'
					,scope	  : this
					,handler  : this._onBtnExcluirSelecionadosClick 
				},{xtype:'tbseparator'},'Buscar',{xtype:'tbseparator'},this.comboFld,{xtype:'tbseparator'},this.txtSrch]
				,columns:[{
					 dataIndex	: 'obito_lacre'
					,header		: 'Nº Lacre'
					,width      : 80
					,sortable   : true	
				},{
					 dataIndex	: 'obito_nrobito'
					,header		: 'Nº.Obito'
					,width      : 150
					,sortable   : true	
				},{
					 dataIndex	: 'locatario_id'
					,header		: 'Locatario'
					,width      : 60
					,sortable   : true						
				},{
					 dataIndex	: 'locatario_desc'
					,header		: 'Nome'
					,width      : 250
					,sortable   : true						
				},{
					 dataIndex	: 'obito_falecido'
					,header		: 'Falecido'
					,width      : 250
					,sortable   : true
				},{
					 dataIndex	: 'obito_apelido'
					,header		: 'Apelido'
					,width      : 250
					,sortable   : true					
				},{
					 dataIndex	: 'morte_desc'
					,header		: 'Causa da morte'
					,width      : 250
					,sortable   : true				
				},{
					 dataIndex	: 'jazigo_codigo'
					,header		: 'Jazigo'
					,width      : 100
					,sortable   : true						
				},{
					 dataIndex	: 'obito_data_falecimento'
					,header		: 'Data falecimento'
					,width      : 100
					,sortable   : true	
					,renderer   : Ext.util.Format.dateRenderer('d/m/Y')
				},{
					 dataIndex	: 'obito_hora'
					,header		: 'Hora'
					,width      : 80
					,sortable   : true					
				},{
                     dataIndex	: 'obito_id'
                    ,header		: 'Identificador'
                    ,width      : 80
                    ,sortable   : true
                }]
			})
			
			
			//super
			conobito.superclass.initComponent.call(this);
		}
		
		,initEvents: function()
		{
			//super
			conobito.superclass.initEvents.call(this);
			
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
			conobito.superclass.onDestroy.apply(this,arguments);
			
			//destr�i a janela de usu�rio e limpa sua refer�ncia	
			Ext.destroy(this._winObito)
			this._winObito = null;
		}	
		,_onBtnNovoClick: function()		
		{
			Ext.require('cad-obito',function(){
				var winObito = new cadobito();
				winObito.setObitoID(0);
				winObito.show();				
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
					
				var obitoID = [];
				for( var i = 0 ; i < arrSelecionados.length ; i++ )
				{
					obitoID.push( arrSelecionados[i].get('obito_id') );
				}
				
				this.el.mask('Excluindo');
				
				Ext.Ajax.request({
					 url	: 'obito/excluir'
					,params	: {
						 action	      : 'excluir'
						,'obito_id[]' : obitoID
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
			var obitoID = record.get('obito_id');
			
			Ext.require('cad-obito',function(){				
				var winObito = new cadobito();
				winObito.setObitoID(obitoID);
				winObito.show();
			},obitoID);
		}
		,_onCadastroObitoSalvarExcluir: function()
		{
			//recarrega grid
			this.store.reload();
		}	
});

Ext.reg('e-conobito',conobito);