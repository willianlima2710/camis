var conextrec = Ext.extend(Ext.Window,{	
		 ctarecID    : 0
		,modal		 : true
		,constrain	 : true
		,maximizable : false
		,resizable   : false
		,width		 : 900
		,height		 : 600
		,title		 : 'Extrato do contas a receber'
		,layout		 : 'fit'
		,buttonAlign : 'center'		
		,closeAction : 'hide'
			
		,setCtarecID: function(ctarecID)
		{
			this.ctarecID = ctarecID;
		}
		,constructor: function()
		{
			//super
			conextrec.superclass.constructor.apply(this, arguments);
		}
		
		,initComponent: function()
		{
			//store dos titulos
			this.storeRecpar = new Ext.data.JsonStore({
				 url			: 'recpar/listar'
				,root			: 'rows'					
				,idProperty		: 'recpar_id'
				,totalProperty	: 'totalCount'
				,autoLoad		: false
				,autoDestroy	: true
				,remoteSort     : true
				,baseParams		: {
					 action	: 'recpar/listar'
					,limit	: 30
				}				
				,fields:[
					 {name:'recpar_id'		     ,type:'int'}
					,{name:'jazigo_codigo'	     ,type:'string'}
					,{name:'locatario_desc'	     ,type:'string'}
					,{name:'operacao_desc'	     ,type:'string'}
					,{name:'formarec_desc'	     ,type:'string'}
					,{name:'ctarec_documento'	 ,type:'int'}					
					,{name:'recpar_data_emissao' ,type:'date',dateFormat: 'Y-m-d'}
					,{name:'recpar_data_vencto'  ,type:'date',dateFormat: 'Y-m-d'}
					,{name:'recpar_valor'        ,type:'float'}
					,{name:'recpar_parcela'	     ,type:'int'}
					,{name:'recpar_pago'    	 ,type:'string'}
					,{name:'recpar_data_pagto'	 ,type:'date',dateFormat: 'Y-m-d'}					
					,{name:'recpar_ano'	         ,type:'string'}					
					,{name:'recpar_agencia'	     ,type:'string'}
					,{name:'recpar_conta'	     ,type:'string'}
					,{name:'recpar_banco'		 ,type:'string'}
					,{name:'recpar_cheque'		 ,type:'string'}
					,{name:'recpar_instatus'	 ,type:'string'}
				]
			});
			
			// grid dos titulos
			this.gridRecpar = new Ext.grid.GridPanel({
			 	 title		: 'Titulos selecionados'
				,style	 	: 'margin-top: 5px;'
				,height		: 500
				,store		: this.storeRecpar
				,viewConfig : {
	                getRowClass: function(record, index) {
				 		 if(record.data.recpar_instatus=='0'){                    	
		                        return 'aberto';
		                 }
	                }
	            }
				,bbar: new Ext.PagingToolbar({ //paginação
					store	   : this.storeRecpar
				   ,pageSize   :	 30
				   ,displayInfo: true					
	               ,displayMsg : 'Mostrando resultados {0} - {1} até {2}'
	               ,emptyMsg   : "Não há resultados"
			    })			
			    ,tbar           : [{			    	
			    	text	: 'Baixar titulo'
				   ,iconCls : 'silk-accept'
				   ,scope	: this
				   ,handler : this._onBtnBaixarClick			    	
			    }]         
				,columns		: [{
					 header		: '&nbsp;'
					,dataIndex	: 'recpar_id'
					,align		: 'center'
					,width		: 60
					,fixed		: true
				},{
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
					 dataIndex	: 'formarec_desc'
					,header		: 'Forma de recebimento'
					,width      : 200
					,sortable   : true						
				},{
					 dataIndex	: 'ctarec_documento'
					,header		: 'Documento'
					,width      : 80
					,sortable   : true						
				},{
					 dataIndex	: 'recpar_data_emissao'
					,header		: 'Emissão'
					,width      : 80
					,sortable   : true
					,renderer   : Ext.util.Format.dateRenderer('d/m/Y')
				},{
					 dataIndex	: 'recpar_data_vencto'
					,header		: 'Vencimento'
					,width      : 80
					,sortable   : true
					,renderer   : Ext.util.Format.dateRenderer('d/m/Y')
				},{
					 dataIndex	: 'recpar_valor'
					,header		: 'Valor'
					,width      : 100
					,sortable   : true
		 			,renderer   : function(v){ 				    	
						return Ext.util.Format.number(v, '0.000,00/i')						
					}			
				},{
					 dataIndex	: 'recpar_parcela'
					,header		: 'Parcela'
					,width      : 50
					,sortable   : true
				},{
					 dataIndex	: 'recpar_pago'
					,header		: 'Valor pago'
					,width      : 100
					,sortable   : true
				 	,renderer   : function(v){ 				    	
						return Ext.util.Format.number(v, '0.000,00/i')						
					}			
				},{
					 dataIndex	: 'recpar_data_pagto'
					,header		: 'Pagamento'
					,width      : 80
					,sortable   : true
					,renderer   : Ext.util.Format.dateRenderer('d/m/Y')
				},{
					 dataIndex	: 'recpar_ano'
					,header		: 'Ano'
					,width      : 50
					,sortable   : true						
				},{
					 dataIndex	: 'recpar_agencia'
					,header		: 'Agencia'
					,width      : 80
					,sortable   : true	
				},{
					 dataIndex	: 'recpar_conta'
					,header		: 'Conta'
					,width      : 80
					,sortable   : true
				},{
					 dataIndex	: 'recpar_banco'
					,header		: 'Banco'
					,width      : 80
					,sortable   : true
				},{
					 dataIndex	: 'recpar_cheque'
					,header		: 'N° Cheque'
					,width      : 80
					,sortable   : true
				},{
					 dataIndex	: 'recpar_id'
					,header		: 'Identificador'
					,width      : 80
					,sortable   : true						
				}]
			})
			
			// monta astabs
			this.tabPanel = new Ext.TabPanel({
				activeTab      : 0               
               ,border         : false
               ,plain          : true
               ,deferredRender : true
               ,scope          : this
               ,defaults       : {autoScroll: true}
			   ,items:[{
				   title : 'Titulos a receber'					   
				  ,items : [this.gridRecpar]  
			   }]			           			                          
            })
            
			Ext.apply(this,{
				 items	: this.tabPanel
				,bbar	: ['->',{		
					 text	: 'Sair'
					,iconCls: 'silk-cross'
					,scope	: this
					,handler: function(){
						this.hide();
					}
				}]
			})
			
			//super
			conextrec.superclass.initComponent.call(this);
		}
		,show: function()
		{
			conextrec.superclass.show.apply(this,arguments);			
			var ctarec_id = this.ctarecID;
			
			// recarrega o financeiro com os parametros do locatario
			this.storeRecpar.on('beforeload',function(){				
				this.baseParams = {						
						value : ctarec_id
					   ,field : 'ctarec_id'
				}
			});
			this.storeRecpar.load();	
		}
		,onDestroy: function()
		{
			conextrec.superclass.onDestroy.apply(this,arguments);			
			this.formPanel = null;
		}	
		,_onFormLoad: function(form, request)
		{
			var data = request.result.data;
			this.el.unmask();			
		}
		,_onBtnBaixarClick: function()
		{
			//busca registro da linha selecionada
			var record = this.gridRecpar.getSelectionModel().getSelections();
			
			if( record.length === 0 )
			{
				Ext.Msg.alert('Atenção','Selecione ao menos um registro!')
				return false;
			}
			
			if(record[0].get('recpar_instatus')=='1') {
				Ext.Msg.alert('Atenção','Titulo já foi pago!')
				return false;	
			}
			
			//extrai id
			var recparID = record[0].get('recpar_id');
			
			Ext.require('bxa-recpar',function(){
				var winRecpar = new bxarecpar();
				winRecpar.setRecparID(recparID);
				winRecpar.show();
			},recparID);
		}
});