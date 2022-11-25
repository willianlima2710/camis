var conlocatario = Ext.extend(Ext.grid.GridPanel,{	
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
				   ,data   : [['locatario_desc','Nome'],
					          ['locatario_telefone','Telefone'],
					          ['locatario_celular','Celular'],
					          ['locatario_endereco','Endere�o'],
					          ['locatario_numero','Numero'],
					          ['locatario_bairro','Bairro'],
					          ['locatario_cidade','Cidade'],
					          ['estado_sigla','Estado'],
					          ['locatario_cpfcnpj','CPF/CNPJ'],
					          ['locatario_id','Identificador']]				   
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
				 url			: 'locatario/listar'
				,root			: 'rows'					
				,idProperty		: 'locatario_id'
				,totalProperty	: 'totalCount'
				,autoLoad		: true
				,autoDestroy	: true
				,remoteSort     : true
				,scope	        : this
				,baseParams		: {
					 action	: 'locatario/listar'
					,limit	: 30
				}				
				,fields:[
					 {name:'locatario_id'	    ,type:'int'}
					,{name:'locatario_desc'	    ,type:'string'}
					,{name:'locatario_cpfcnpj'  ,type:'string'}
					,{name:'locatario_telefone' ,type:'string'}
					,{name:'locatario_celular'  ,type:'string'}
					,{name:'locatario_endereco' ,type:'string'}
					,{name:'locatario_numero'   ,type:'string'}					
					,{name:'locatario_bairro'   ,type:'string'}
					,{name:'locatario_cidade'   ,type:'string'}
					,{name:'estado_sigla'       ,type:'string'}					
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
				},{xtype:'tbseparator'},{
					 text	: 'Extrato'
					,iconCls: 'silk-application-view-list'
					,scope	: this
					,handler: this._onBtnExtratoClick
				},{xtype:'tbseparator'},'Buscar',{xtype:'tbseparator'},this.comboFld,{xtype:'tbseparator'},this.txtSrch]
				,columns:[{
					 dataIndex	: 'locatario_desc'
					,header		: 'Nome'
					,width      : 150	
					,sortable   : true	
				},{
					 dataIndex	: 'locatario_cpfcnpj'
					,header		: 'CPF/CNPJ'
					,width      : 50	
					,sortable   : true	
				},{
					 dataIndex	: 'locatario_telefone'
					,header		: 'Telefone'
					,width      : 50	
					,sortable   : true	
				},{
					 dataIndex	: 'locatario_Celular'
					,header		: 'Celular'
					,width      : 70
					,sortable   : true						
				},{
					 dataIndex	: 'locatario_endereco'
					,header		: 'Endereço'
					,width      : 90
					,sortable   : true						
				},{
					 dataIndex	: 'locatario_numero'
					,header		: 'Numero'
					,width      : 40
					,sortable   : true						
				},{
					 dataIndex	: 'locatario_bairro'
					,header		: 'Bairro'
					,width      : 70
					,sortable   : true						
				},{
					 dataIndex	: 'locatario_cidade'
					,header		: 'Cidade'
					,width      : 70
					,sortable   : true						
				},{
					 dataIndex	: 'estado_sigla'
					,header		: 'Estado'
					,width      : 20
					,sortable   : true						
				},{
					 dataIndex	: 'locatario_id'
					,header		: 'Identificador'
					,width      : 70
					,sortable   : true						
				}]
			})
			
			
			//super
			conlocatario.superclass.initComponent.call(this);
		}
		
		,initEvents: function()
		{
			//super
			conlocatario.superclass.initEvents.call(this);
			
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
			conlocatario.superclass.onDestroy.apply(this,arguments);
			
			//destr�i a janela de usu�rio e limpa sua refer�ncia	
			Ext.destroy(this._winLocatario)
			this._winLocatario = null;
		}	
		,_onBtnNovoClick: function()		
		{
			Ext.require('cad-locatario',function(){
				var winLocatario = new cadlocatario();
				winLocatario.setLocatarioID(0);
				winLocatario.show();				
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
					
				var locatarioID = [];
				for( var i = 0 ; i < arrSelecionados.length ; i++ )
				{
					locatarioID.push( arrSelecionados[i].get('locatario_id') );
				}
				
				this.el.mask('Excluindo usu�rios');
				
				Ext.Ajax.request({
					 url	: 'locatario/excluir'
					,params	: {
						 action	          : 'excluir'
						,'locatario_id[]' : locatarioID
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
			var locatarioID = record.get('locatario_id');
			
			Ext.require('cad-locatario',function(){
				var winLocatario = new cadlocatario();
				winLocatario.setLocatarioID(locatarioID);				
				winLocatario.show();
			},locatarioID);
		}
		,_onCadastrolocatarioSalvarExcluir: function()
		{
			//recarrega grid
			this.store.reload();
		}	
		,_onBtnExtratoClick: function()
		{
			var record = this.getSelectionModel().getSelections();
			var locatarioID = record[0].get('locatario_id');
			
			Ext.require('con-extrato',function(){
				var winExtrato = new conextrato();
				winExtrato.setLocatarioID(locatarioID);				
				winExtrato.show();
			},locatarioID);						
		}		
});

Ext.reg('e-conlocatario',conlocatario);