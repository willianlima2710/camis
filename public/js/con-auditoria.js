var conauditoria = Ext.extend(Ext.grid.GridPanel,{	
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
			    	id     : 'auditoria_desc'
				   ,fields : ['id','field']
				   ,data   : [['auditoria_codigo','Identificador'],
				              ['usuario_login','Usuário'],
				              ['auditoria_data','Data']]				   
			    })			
			})
			this.comboFld.setValue('usuario_login');
			
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
				 url			: 'auditoria/listar'
				,root			: 'rows'					
				,idProperty		: 'auditoria_id'
				,totalProperty	: 'totalCount'
				,autoLoad		: true
				,autoDestroy	: true
				,remoteSort     : true
				,baseParams		: {
					 action	: 'auditoria/listar'
					,limit	: 30
				}				
				,fields:[
					 {name:'auditoria_codigo'       ,type:'int'}
					,{name:'usuario_login'          ,type:'string'}
					,{name:'auditoria_reg_anterior' ,type:'string'}
					,{name:'auditoria_reg_novo'     ,type:'string'}
					,{name:'auditoria_acao'         ,type:'string'}
					,{name:'auditoria_tela'         ,type:'string'}
					,{name:'auditoria_data'         ,type:'string',dateFormat: 'Y-m-d'}			
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
		             ,forceFit      : false           
				     ,enableRowBody : true
				     ,showPreview   : true
				 	,deferEmptyText : false
				 }
				,bbar: new Ext.PagingToolbar({ //paginação
					 store		: this.store
					,pageSize	: 30
					,displayInfo: true					
		            ,displayMsg : 'Mostrando resultados {0} - {1} até {2}'
		            ,emptyMsg   : "Não há resultados"
				})
				,tbar: [new Ext.Toolbar.TextItem('Alterações,click duplo no registro'),{xtype:'tbseparator'},'Buscar',{xtype:'tbseparator'},this.comboFld,{xtype:'tbseparator'},this.txtSrch]
				,columns:[{
					 dataIndex	: 'usuario_login'
					,header		: 'Usuário'
					,width      : 150	
					,sortable   : true	
				},{
					 dataIndex	: 'auditoria_reg_anterior'
					,header		: 'Dado anterior'
					,width      : 600
					,sortable   : true						
				},{
					 dataIndex	: 'auditoria_reg_novo'
					,header		: 'Dado modificado'
					,width      : 600
					,sortable   : true		
				},{
					 dataIndex	: 'auditoria_acao'
					,header		: 'Ação'
					,width      : 150
					,sortable   : true			
				},{
					 dataIndex	: 'auditoria_tela'
					,header		: 'Tela'
					,width      : 150
					,sortable   : true				
				},{
					 dataIndex	: 'auditoria_data'
					,header		: 'Data'
					,width      : 150
					,sortable   : true					
				}]
			})
			
			
			//super
			conauditoria.superclass.initComponent.call(this);
		}
		
		,initEvents: function()
		{
			//super
			conauditoria.superclass.initEvents.call(this);			
		}	
		,onDestroy: function()
		{
			conauditoria.superclass.onDestroy.apply(this,arguments);			
		}
});

Ext.reg('e-conauditoria',conauditoria);