var concbo = Ext.extend(Ext.grid.GridPanel,{	
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
				    id     : 'cbo_desc'
				   ,fields : ['id','field']
				   ,data   : [['cbo_codigo','Código'],
				              ['cbo_desc','Descrição'],
				              ['cbo_id','Identificador']]				   
			    })			
			})
			this.comboFld.setValue('cbo_desc');
			
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
				 url			: 'cbo/listar'
				,root			: 'rows'					
				,idProperty		: 'cbo_id'
				,totalProperty	: 'totalCount'
				,autoLoad		: true
				,autoDestroy	: true
				,remoteSort     : true
				,baseParams		: {
					 action	: 'cbo/listar'
					,limit	: 30
				}				
				,fields:[
					 {name:'cbo_id'		 ,type:'int'}
					,{name:'cbo_desc'	 ,type:'string'}
					,{name:'cbo_codigo'	 ,type:'string'}
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
					 emptyText	    : 'Nenhum registro encontrado'
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
				,tbar: [new Ext.Toolbar.TextItem('Alterações,click duplo no registro'),{xtype:'tbseparator'},{
					 text	: 'Novo'	//botão para adicionar novo registro
					,iconCls: 'silk-add'
					,scope	: this
					,handler: this._onBtnNovoClick 
				},{
					 text	  : 'Excluir Selecionados'
					,iconCls  : 'silk-delete'
					,scope 	  : this
					,disabled : true
					,handler  : this._onBtnExcluirSelecionadosClick 
				},{
					 text	: 'Imprimir'
					,iconCls: 'ico_printer'
					,scope	: this
					,handler: this._onBtnImprimirClick		
				},{xtype:'tbseparator'},'Buscar',{xtype:'tbseparator'},this.comboFld,{xtype:'tbseparator'},this.txtSrch]
				,columns:[{
					 dataIndex	: 'cbo_desc'
					,header		: 'Descrição'
					,width      : 300	
					,sortable   : true	
				},{
					 dataIndex	: 'cbo_codigo'
					,header		: 'Código'
					,width      : 70	
					,sortable   : true	
				},{
					 dataIndex	: 'cbo_id'
					,header		: 'Identificador'
					,width      : 70
					,sortable   : true						
				}]
			})
			
			
			//super
			concbo.superclass.initComponent.call(this);
		}
		
		,initEvents: function()
		{
			//super
			concbo.superclass.initEvents.call(this);
			
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
			concbo.superclass.onDestroy.apply(this,arguments);
			
			//destrói a janela de usuário e limpa sua referência	
			Ext.destroy(this._winCbo)
			this._winCbo = null;
		}	
		,_onBtnNovoClick: function()		
		{
			Ext.require('cad-cbo',function(){
				var winCbo = new cadcbo();
				winCbo.setCboID(0);
				winCbo.show();				
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
					
				var cboID = [];
				for( var i = 0 ; i < arrSelecionados.length ; i++ )
				{
					cboID.push( arrSelecionados[i].get('cbo_id') );
				}
				
				this.el.mask('Excluindo usuários');
				
				Ext.Ajax.request({
					 url	: 'cbo/excluir'
					,params	: {
						 action	    : 'excluir'
						,'cbo_id[]'	: cboID
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
			var cboID = record.get('cbo_id');
			
			Ext.require('cad-cbo',function(){
				var winCbo = new cadcbo();
				winCbo.setCboID(cboID);
				winCbo.show();
			},cboID);
		}
		,_onCadastroCboSalvarExcluir: function()
		{
			//recarrega grid
			this.store.reload();
		}	
		,_onBtnImprimirClick: function()
		{
			var win = new Ext.Window({
				height      : 600
			   ,width       : 1000
			   ,closeAction : 'close'
			   ,modal		: true
			   ,maximizable : true
			   ,scope	    : this
			   ,maximized   : false
			   ,title		: 'Relatorio de ocupações'
			   ,layout		: 'fit'
			   ,autoLoad    : {
				   url     : 'cbo/pdf'
				  ,params  : {					  
					  value : this.txtSrch.getValue()
					 ,field : this.comboFld.getValue()
				  }	   
			   }
			   ,bbar:['->',{
				   text    : 'Fechar'
 			      ,iconCls : 'ico-sair'	   
				  ,handler : function(){
					  win.close();
					  Ext.destroy(win);
				  }
			   }]
			}).show();
		}		
});

Ext.reg('e-concbo',concbo);