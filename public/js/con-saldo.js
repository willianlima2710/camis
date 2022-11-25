var consaldo = Ext.extend(Ext.grid.GridPanel,{	
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
				    id     : 'saldo_data'
				   ,fields : ['id','field']
				   ,data   : [['saldo_data','Data'],
				              ['saldo_id','Identificador']]				   
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
				 url			: 'saldo/listar'
				,root			: 'rows'					
				,idProperty		: 'saldo_id'
				,totalProperty	: 'totalCount'
				,autoLoad		: true
				,autoDestroy	: true
				,remoteSort     : true
				,baseParams		: {
					 action	: 'saldo/listar'
					,limit	: 30
				}				
				,fields:[
					 {name:'saldo_id'	     ,type:'int'}
					,{name:'conta_desc'	     ,type:'string'}
					,{name:'saldo_data'	     ,type:'string'}
					,{name:'saldo_entrada'   ,type:'float'}
					,{name:'saldo_saida'     ,type:'float'}
					,{name:'saldo_atual'     ,type:'float'}
					,{name:'saldo_acumulado' ,type:'float'}					
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
				,tbar: [new Ext.Toolbar.TextItem('Alterações,click duplo no registro'),
				{xtype:'tbseparator'},'Buscar',{xtype:'tbseparator'},this.comboFld,{xtype:'tbseparator'},this.txtSrch]
				,columns:[{
					 dataIndex	: 'saldo_data'
					,header		: 'Data'
					,width      : 150	
					,sortable   : true	
					,editor     : new Ext.form.DateField({
						format: 'd/m/Y'						
					})
				    ,renderer   : Ext.util.Format.dateRenderer('d/m/Y')							
				},{
					 dataIndex	: 'saldo_entrada'
					,header		: 'Entrada'
					,width      : 100
					,sortable   : true
					,renderer   : function(v){
						return Ext.util.Format.number(v, '0.000,00/i')						
					}	
				},{
					 dataIndex	: 'saldo_saida'
				    ,header		: 'Saida'
				 	,width      : 100
					,sortable   : true
					,renderer   : function(v){
						return Ext.util.Format.number(v, '0.000,00/i')						
					} 										   					
				},{
					 dataIndex	: 'saldo_atual'
					,header		: 'Saldo'
					,width      : 100
					,sortable   : true
					,renderer   : function(v){
						return Ext.util.Format.number(v, '0.000,00/i')						
					} 										   					
				},{
					 dataIndex	: 'saldo_acumulado'
					,header		: 'Acumulado'
					,width      : 100
					,sortable   : true	
					,renderer   : function(v){
						return Ext.util.Format.number(v, '0.000,00/i')						
					} 										   					
				},{
					 dataIndex	: 'saldo_id'
					,header		: 'Identificador'
					,width      : 70
					,sortable   : true						
				}]
			})			
			
			//super
			consaldo.superclass.initComponent.call(this);
		}
		
		,initEvents: function()
		{
			//super
			consaldo.superclass.initEvents.call(this);			
		}	
		,onDestroy: function()
		{
			consaldo.superclass.onDestroy.apply(this,arguments);			
		}		
});

Ext.reg('e-consaldo',consaldo);