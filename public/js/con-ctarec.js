var conctarec = Ext.extend(Ext.grid.GridPanel,{	
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
				    id     : 'ctarec_desc'
				   ,fields : ['id','field']
				   ,data   : [['ctarec_id','Identificador'],
				              ['jazigo_codigo','Jazigo'],
				              ['locatario_desc','Locatario'],
				              ['ctarec_documento','Documento'],
				              ['ctarec_ano','Ano']]				   
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
				 url			: 'ctarec/listar'
				,root			: 'rows'					
				,idProperty		: 'ctarec_id'
				,totalProperty	: 'totalCount'
				,autoLoad		: true
				,autoDestroy	: true
				,remoteSort     : true
				,baseParams		: {
					 action	: 'ctarec/listar'
					,limit	: 30
				}				
				,fields:[
					 {name:'ctarec_id'		     ,type:'int'}
					,{name:'jazigo_codigo'	     ,type:'string'}
					,{name:'locatario_desc'	     ,type:'string'}
					,{name:'operacao_desc'	     ,type:'string'}
					,{name:'ctarec_documento'    ,type:'int'}
					,{name:'ctarec_data_emissao' ,type:'date',dateFormat: 'Y-m-d'}
					,{name:'ctarec_data_base'    ,type:'date',dateFormat: 'Y-m-d'}
					,{name:'ctarec_ano'	         ,type:'string'}
					,{name:'ctarec_valor'	     ,type:'float'}
					,{name:'ctarec_saldo'	     ,type:'float'}
					,{name:'ctarec_instatus'     ,type:'string'}
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
				 		 if(record.data.ctarec_instatus=='0'){                    	
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
					,disabled : true
					,handler: this._onBtnExcluirSelecionadosClick 
				},{xtype:'tbseparator'},{
					 text	: 'Parcelas'
					,iconCls: 'ico_parcela'
					,scope	: this
					,handler: this._onBtnExtratoRecparClick
				},{xtype:'tbseparator'},'Buscar',{xtype:'tbseparator'},this.comboFld,{xtype:'tbseparator'},this.txtSrch]
				,columns:[{
					 dataIndex	: 'jazigo_codigo'
					,header		: 'Jazigo'
					,width      : 80	
					,sortable   : true	
				},{
					 dataIndex	: 'locatario_desc'
					,header		: 'Locatario'
					,width      : 200
					,sortable   : true	
				},{
					 dataIndex	: 'operacao_desc'
					,header		: 'Operacao'
					,width      : 200
					,sortable   : true						
				},{
					 dataIndex	: 'ctarec_documento'
					,header		: 'Documento'
					,width      : 200
					,sortable   : true						
				},{
					 dataIndex	: 'ctarec_data_emissao'
					,header		: 'Emiss�o'
					,width      : 80
					,sortable   : true
					,renderer   : Ext.util.Format.dateRenderer('d/m/Y')				
				},{
					 dataIndex	: 'ctarec_ano'
					,header		: 'Ano'
					,width      : 80
					,sortable   : true						
				},{
					 dataIndex	: 'ctarec_valor'
					,header		: 'Valor'
					,width      : 100
					,sortable   : true
 				    ,renderer   : function(v){ 				    	
						return Ext.util.Format.number(v, '0.000,00/i')						
					}			
				},{
					 dataIndex	: 'ctarec_saldo'
					,header		: 'Saldo'
					,width      : 100
					,sortable   : true	
				   ,renderer    : function(v){
						return Ext.util.Format.number(v, '0.000,00/i')						
					}
				},{
					 dataIndex	: 'ctarec_data_base'
					,header		: 'Data base'
					,width      : 80
					,sortable   : true
					,renderer   : Ext.util.Format.dateRenderer('d/m/Y')				
				},{
					 dataIndex	: 'ctarec_id'
					,header		: 'Identificador'
					,width      : 80
					,sortable   : true						
				}]
			})
			
			//super
			conctarec.superclass.initComponent.call(this);
		}
		
		,initEvents: function()
		{
			//super
			conctarec.superclass.initEvents.call(this);
			
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
			conctarec.superclass.onDestroy.apply(this,arguments);
			
			//destr�i a janela de usu�rio e limpa sua refer�ncia	
			Ext.destroy(this._winCtarec)
			this._winCtarec = null;
		}	
		,_onBtnNovoClick: function()		
		{
			Ext.require('cad-ctarec',function(){
				var winCtarec = new cadctarec();
				winCtarec.setCtarecID(0);
				winCtarec.show();				
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
					
				var ctarecID = [];
				for( var i = 0 ; i < arrSelecionados.length ; i++ )
				{
					ctarecID.push( arrSelecionados[i].get('ctarec_id') );
				}
				
				this.el.mask('Excluindo o contas a receber');
				
				Ext.Ajax.request({
					 url	: 'ctarec/excluir'
					,params	: {
						 action	       : 'excluir'
						,'ctarec_id[]' : ctarecID
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
			var ctarecID = record.get('ctarec_id');
			
			Ext.require('cad-ctarec',function(){
				var winCtarec = new cadctarec();
				winCtarec.setCtarecID(ctarecID);
				winCtarec.show();
			},ctarecID);
		}
		,_onCadastroCtarecSalvarExcluir: function()
		{
			//recarrega grid
			this.store.reload();
		}	
		,_onBtnExtratoRecparClick: function()
		{
			var record = this.getSelectionModel().getSelections();
			var ctarecID = record[0].get('ctarec_id');
			
			Ext.require('con-extrec',function(){
				var winExtrato = new conextrec();
				winExtrato.setCtarecID(ctarecID);				
				winExtrato.show();
			},ctarecID);						
		}		
		
});

Ext.reg('e-conctarec',conctarec);