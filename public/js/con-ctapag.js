var conctapag = Ext.extend(Ext.grid.GridPanel,{	
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
				    id     : 'ctapag_desc'
				   ,fields : ['id','field']
				   ,data   : [['ctapag_id','Identificador'],
				              ['ctapag_numero','Documento'],
				              ['fornecedor_desc','Fornecedor'],				              
				              ['ctapag_ano','Ano']]				   
			    })			
			})
			this.comboFld.setValue('fornecedor_desc');
			
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
				 url			: 'ctapag/listar'
				,root			: 'rows'					
				,idProperty		: 'ctapag_id'
				,totalProperty	: 'totalCount'
				,autoLoad		: true
				,autoDestroy	: true
				,remoteSort     : true
				,baseParams		: {
					 action	: 'ctapag/listar'
					,limit	: 30
				}				
				,fields:[
					 {name:'ctapag_id'		        ,type:'int'}
					,{name:'fornecedor_id'          ,type:'int'}
					,{name:'fornecedor_desc'	    ,type:'string'}
					,{name:'operacao_desc'	        ,type:'string'}					
					,{name:'ctapag_documento'       ,type:'int'}
					,{name:'ctapag_ano'             ,type:'string'}
					,{name:'ctapag_data_emissao'    ,type:'date',dateFormat: 'Y-m-d'}
					,{name:'ctapag_data_vencimento' ,type:'date',dateFormat: 'Y-m-d'}
					,{name:'ctapag_valor'	        ,type:'float'}
					,{name:'ctapag_data_pagamento'	,type:'date',dateFormat: 'Y-m-d'}
					,{name:'ctapag_valor_pago'	    ,type:'float'}
					,{name:'ctapag_saldo'    	    ,type:'float'}
					,{name:'ctapag_instatus'        ,type:'string'}
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
				 	 ,getRowClass    : function(record){
				 		 if(record.data.ctapag_instatus=='0'){                    	
		                        return 'aberto';
		                 }
		             }			 	 
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
					,id     : 'btnExcluir'
					,handler: this._onBtnExcluirSelecionadosClick 
				},{xtype:'tbseparator'},'Buscar',{xtype:'tbseparator'},this.comboFld,{xtype:'tbseparator'},this.txtSrch]
				,columns:[{
					 dataIndex	: 'ctapag_documento'
					,header		: 'Documento'
					,width      : 100
					,sortable   : true	
				},{
					 dataIndex	: 'fornecedor_desc'
					,header		: 'Fornecedor'
					,width      : 300	
					,sortable   : true	
				},{
					 dataIndex	: 'operacao_desc'
					,header		: 'Operacao'
					,width      : 300
					,sortable   : true						
				},{
					 dataIndex	: 'ctapag_data_emissao'
					,header		: 'Emiss�o'
					,width      : 100
					,sortable   : true
					,renderer   : Ext.util.Format.dateRenderer('d/m/Y')				
				},{
					 dataIndex	: 'ctapag_data_vencimento'
					,header		: 'Vencimento'
					,width      : 100
					,sortable   : true
					,renderer   : Ext.util.Format.dateRenderer('d/m/Y')				
				},{
					 dataIndex	: 'ctapag_ano'
					,header		: 'Ano'
					,width      : 50
					,sortable   : true						
				},{
					 dataIndex	: 'ctapag_valor'
					,header		: 'Valor'
					,width      : 100
					,sortable   : true
 				    ,renderer   : function(v){ 				    	
						return Ext.util.Format.number(v, '0.000,00/i')						
					}			
				},{
					 dataIndex	: 'ctapag_saldo'
					,header		: 'Saldo'
					,width      : 100
					,sortable   : true	
				   ,renderer   : function(v){
						return Ext.util.Format.number(v, '0.000,00/i')						
					}
				},{
					 dataIndex	: 'ctapag_id'
					,header		: 'Identificador'
					,width      : 80
					,sortable   : true						
				}]
			})
			
			//super
			conctapag.superclass.initComponent.call(this);
		}
		
		,initEvents: function()
		{
			//super
			conctapag.superclass.initEvents.call(this);
			
			/* Associa um listener para que quando o usu�rio clique em uma linha do grid
			 * a tela de cadastro do registro selecionado apare�a
			 */
			this.on({
			 	 scope		: this
				,rowdblclick: this._onGridRowDblClick
			});
		}	
		,show: function()
		{
			conctapag.superclass.show.apply(this,arguments);	

			if (Ext.util.Cookies.get('nivel') < 3) {
				Ext.getCmp('btnExcluir').setDisabled(true);
			}else{
				Ext.getCmp('btnExcluir').setDisabled(false);
			}
		}
		,onDestroy: function()
		{
			conctapag.superclass.onDestroy.apply(this,arguments);
			
			//destr�i a janela de usu�rio e limpa sua refer�ncia	
			Ext.destroy(this._winCtapag)
			this._winCtapag = null;
		}	
		,_onBtnNovoClick: function()		
		{
			Ext.require('mov-ctapag',function(){
				var winCtapag = new movctapag();
				winCtapag.setCtapagID(0);
				winCtapag.show();				
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
					
				var ctapagID = [];
				for( var i = 0 ; i < arrSelecionados.length ; i++ )
				{
					ctapagID.push( arrSelecionados[i].get('ctapag_id') );
				}
				
				this.el.mask('Excluindo o contas a pagar');
				
				Ext.Ajax.request({
					 url	: 'ctapag/excluir'
					,params	: {
						 action	       : 'excluir'
						,'ctapag_id[]' : ctapagID
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
			var ctapagID = record.get('ctapag_id');
			
			Ext.require('cad-ctapag',function(){
				var winCtapag = new cadctapag();
				winCtapag.setCtapagID(ctapagID);
				winCtapag.show();
			},ctapagID);
		}
		,_onCadastroCtapagSalvarExcluir: function()
		{
			//recarrega grid
			this.store.reload();
		}	
});

Ext.reg('e-conctapag',conctapag);