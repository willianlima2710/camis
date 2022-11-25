var convenda = Ext.extend(Ext.grid.GridPanel,{	
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
				    id     : 'venda_desc'
				   ,fields : ['id','field']
				   ,data   : [['locatario_desc','Locatario'],
				              ['jazigo_codigo','Jazigo'],
				              ['venda_documento','Documento'],
				              ['venda_id','Identificador']]				   
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
				 url			: 'venda/listar'
				,root			: 'rows'					
				,idProperty		: 'venda_id'
				,totalProperty	: 'totalCount'
				,autoLoad		: true
				,autoDestroy	: true
				,remoteSort     : true
				,baseParams		: {
					 action	: 'venda/listar'
					,limit	: 30
				}				
				,fields:[
					 {name:'venda_id'	     ,type:'int'}
					,{name:'locatario_desc'  ,type:'string'}
					,{name:'jazigo_codigo'   ,type:'string'}
					,{name:'venda_documento' ,type:'int'}
					,{name:'operacao_desc'   ,type:'string'}
					,{name:'venda_data'      ,type:'date',dateFormat: 'Y-m-d'}
					,{name:'venda_total'     ,type:'float'}
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
				,tbar: [new Ext.Toolbar.TextItem('Alterações,click duplo no registro'),{xtype:'tbseparator'},{
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
				},{xtype:'tbseparator'},{
					 text	: 'Recibo'
					,iconCls: 'ico_recibo'
					,scope	: this
					,handler: this._onBtnReciboClick			
				},{xtype:'tbseparator'},'Buscar',{xtype:'tbseparator'},this.comboFld,{xtype:'tbseparator'},this.txtSrch]
				,columns:[{					
					dataIndex : 'locatario_desc'
				   ,header	  : 'Locatario'
				   ,width     : 300	
				   ,sortable  : true	
				},{					
					dataIndex : 'jazigo_codigo'
				   ,header	  : 'Jazigo'
				   ,width     : 70	
				   ,sortable  : true					
				},{
					dataIndex : 'venda_documento'
				   ,header	  :	 'N Recibo'
				   ,width     : 70	
				   ,sortable  : true
				},{
					dataIndex : 'operacao_desc'
				   ,header	  : 'Operação'
				   ,width     : 300	
				   ,sortable  : true
				},{					
					dataIndex : 'venda_data'
				   ,header	  : 'Data'
				   ,width     : 100
				   ,sortable  : true	
				   ,renderer  : Ext.util.Format.dateRenderer('d/m/Y')
				},{
					dataIndex : 'venda_total'
 				   ,header	  : 'Valor total'
				   ,width     : 70	
				   ,sortable  : true
				   ,renderer  : function(v){
						return Ext.util.Format.number(v, '0.000,00/i')						
				   } 										   
				},{
					dataIndex : 'venda_id'
				   ,header	  : 'Identificador'
				   ,width     : 70
				   ,sortable  : true						
				}]
			})
			
			
			//super
			convenda.superclass.initComponent.call(this);
		}
		
		,initEvents: function()
		{
			//super
			convenda.superclass.initEvents.call(this);
			
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
			convenda.superclass.onDestroy.apply(this,arguments);
			
			//destr�i a janela de usu�rio e limpa sua refer�ncia	
			Ext.destroy(this._winVenda)
			this._winVenda = null;
		}	
		,_onBtnNovoClick: function()		
		{
			Ext.require('mov-venda',function(){
				var winVenda = new movvenda();
				winVenda.setVendaID(0);
				winVenda.show();				
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
					
				var vendaID = [];
				for( var i = 0 ; i < arrSelecionados.length ; i++ )
				{
					vendaID.push( arrSelecionados[i].get('venda_id') );
				}
				
				this.el.mask('Excluindo');
				
				Ext.Ajax.request({
					 url	: 'venda/excluir'
					,params	: {
						 action	      : 'excluir'
						,'venda_id[]' : vendaID
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
			var vendaID = record.get('venda_id');
			
			Ext.require('mov-cnvenda',function(){
				var winCnvenda = new movcnvenda();
				winCnvenda.setCnvendaID(vendaID);
				winCnvenda.show();
			},vendaID);
		}
		,_onCadastroVendaSalvarExcluir: function()
		{
			//recarrega grid
			this.store.reload();
		}	
		,_onBtnReciboClick: function()
		{
			var arrSelecionados = this.getSelectionModel().getSelections();
			
			if( arrSelecionados.length === 0 )
			{
				Ext.Msg.alert('Atenção','Selecione ao menos um registro!')
				return false;
			}			
			var win = new Ext.Window({
				height      : 600
			   ,width       : 1000
			   ,closeAction : 'close'
			   ,modal		: true
			   ,maximizable : true
			   ,scope	    : this
			   ,maximized   : false
			   ,title		: 'Recibo do locatario'
			   ,layout		: 'fit'
			   ,autoLoad    : {
				   url     : 'venda/recibo'
				  ,params  : {					  
					  value : arrSelecionados[0].get('venda_id')
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

Ext.reg('e-convenda',convenda);