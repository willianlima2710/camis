var conexumacao = Ext.extend(Ext.grid.GridPanel,{	
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
			    	id     : 'exumacao_desc'
				   ,fields : ['id','field']
				   ,data   : [['exumacao_falecido','Falecido'],
				              ['jazigo_codigo','Jazigo'],
				              ['exumacao_id','Identificador']]				   
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
				 url			: 'exumacao/listar'
				,root			: 'rows'					
				,idProperty		: 'exumacao_id'
				,totalProperty	: 'totalCount'
				,autoLoad		: true
				,autoDestroy	: true
				,remoteSort     : true
				,baseParams		: {
					 action	: 'exumacao/listar'
					,limit	: 30
				}				
				,fields:[
					 {name:'exumacao_id'	    ,type:'int'}
					,{name:'jazigo_codigo'      ,type:'string'}					
					,{name:'exumacao_falecido'  ,type:'string'}					
					,{name:'exumacao_data'      ,type:'date',dateFormat: 'Y-m-d'}
					,{name:'destino_desc'       ,type:'string'}
					,{name:'jazigo_codigo_dest' ,type:'string'}
                    ,{name:'exumacao_lacre'     ,type:'string'}
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
					,header		: 'Origem'
					,width      : 100	
					,sortable   : true
				},{
					 dataIndex	: 'exumacao_falecido'
					,header		: 'Falecido'
					,width      : 300	
					,sortable   : true
				},{
					 dataIndex	: 'exumacao_data'
					,header		: 'Data'
					,width      : 80
					,sortable   : true
					,renderer   : Ext.util.Format.dateRenderer('d/m/Y')
				},{
					 dataIndex	: 'destino_desc'
					,header		: 'Local'
					,width      : 300	
					,sortable   : true
				},{
					 dataIndex	: 'jazigo_codigo_dest'
					,header		: 'Destino'
					,width      : 100	
					,sortable   : true
                },{
                    dataIndex	: 'exumacao_lacre'
                    ,header		: 'Nº Lacre'
                    ,width      : 100
                    ,sortable   : true
				},{
					 dataIndex	: 'exumacao_id'
					,header		: 'Identificador'
					,width      : 70
					,sortable   : true						
				}]
			})			
			
			//super
			conexumacao.superclass.initComponent.call(this);
		}
		
		,initEvents: function()
		{
			//super
			conexumacao.superclass.initEvents.call(this);
			
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
			conexumacao.superclass.onDestroy.apply(this,arguments);
			
			//destr�i a janela de usu�rio e limpa sua refer�ncia	
			Ext.destroy(this._winExumacao)
			this._winExumacao = null;
		}	
		,_onBtnNovoClick: function()		
		{
			Ext.require('cad-exumacao',function(){
				var winExumacao = new cadexumacao();
				winExumacao.setExumacaoID(0);
				winExumacao.show();				
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
					
				var exumacaoID = [];
				for( var i = 0 ; i < arrSelecionados.length ; i++ )
				{
					exumacaoID.push( arrSelecionados[i].get('exumacao_id') );
				}
				
				this.el.mask('Excluindo usuários');
				
				Ext.Ajax.request({
					 url	: 'exumacao/excluir'
					,params	: {
						 action	         : 'excluir'
						,'exumacao_id[]' : exumacaoID
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
			var exumacaoID = record.get('exumacao_id');
			
			Ext.require('cad-exumacao',function(){
				var winExumacao = new cadexumacao();
				winExumacao.setExumacaoID(exumacaoID);
				winExumacao.show();
			},exumacaoID);
		}
		,_onCadastroExumacaoSalvarExcluir: function()
		{
			//recarrega grid
			this.store.reload();
		}	
});

Ext.reg('e-conexumacao',conexumacao);