var movreqest = Ext.extend(Ext.Window,{	
		 reqestID   : 0
		,modal		 : false
		,constrain	 : true
		,maximizable : false
		,resizable   : false
		,width		 : 750
		,height		 : 610
		,title		 : 'Requisição do estoque'
		,layout		 : 'fit'
		,buttonAlign : 'center'
		,closeAction : 'hide'		
			
		,setReqestID: function(reqestID)
		{
			this.reqestID = reqestID;
		}
		,constructor: function()
		{
			this.addEvents({
				 salvar	: true
				,excluir: true
			});

			//super
			movreqest.superclass.constructor.apply(this, arguments);
		}		
		,initComponent: function()
		{			
			Ext.form.Field.prototype.msgTarget = 'side';
			Ext.form.FormPanel.prototype.bodyStyle = 'padding:2px';
			Ext.form.FormPanel.prototype.labelAlign = 'right';
			Ext.QuickTips.init();
			
			/* 
			 * Campos de objeto do formulario cadastro
			 */			
			this.textreqest_id = new Ext.form.Hidden({
				fieldLabel : 'Numero'
			   ,name	   : 'reqest_id'
			   ,width      : 2
			});	

			this.comboEmpresa = new Ext.form.ComboBox({
				 fieldLabel		: 'Empresa'
				,xtype			: 'combo'
         	    ,idProperty	    : 'empresa_id'		
				,hiddenName		: 'empresa_id'	
				,triggerAction	: 'all'
				,valueField		: 'empresa_id'
				,displayField	: 'empresa_desc'
				,emptyText		: 'Selecione uma empresa'
				,allowBlank		: false
				,readOnly       : false
				,editable       : false
			    ,width          : 350
				,store			: new Ext.data.JsonStore({
					 url		: 'empresa/todo'
					,baseParams	: {
						 action	: 'todo'
						,limit	: 30
					}
					,fields:[
						 {name:'empresa_id'   ,type:'int'}
						,{name:'empresa_desc' ,type:'string'}
					]
				})			
			});				
			this.datereqest_data = new Ext.form.DateField({
				xtype      : 'datefield'
			   ,fieldLabel : 'Data'
			   ,name	   : 'reqest_data'
			   ,allowBlank : true
	  	       ,maxLength  : 10	  	        	   
	  		   ,format     : 'd/m/Y'
	  		   ,altFormats : 'd/m/Y|j/n/Y|j/n/y|j/m/y|d/n/y|j/m/Y|d/m/Y|d-m-y|d-m-Y|d/m|d-m|dm|dmy|dmY|d|d-m-Y'
	  		   ,col        : true
			});
			this.datereqest_data.setValue(new Date());
			
			this.textreqest_desc = new Ext.form.TextField({
				fieldLabel : 'Requisitante'
			   ,name	   : 'reqest_desc'
	    	   ,width	   : 350
			});
			this.textreqestprod_quantidade = new Ext.form.TextField({				
				xtype            : 'numberfield'
  			   ,fieldLabel       : 'Quantidade'
			   ,name	         : 'reqestprod_quantidade'
			   ,DecimalPrecision : 3	   
			   ,allowBlank       : true
			});
			this.textreqestprod_valor = new Ext.ux.form.MaskTextField({				
  			    fieldLabel : 'Valor'
			   ,name	   : 'reqestprod_valor'
			   ,mask       : '9.999.990,00'
			   ,money      : true						  
			   ,allowBlank : true
			   ,col        : true								
			});						
			this.textreqest_observacao = new Ext.form.TextArea({				
			    name	   : 'reqest_observacao'
               ,allowBlank : true
               ,width	   : '90%'
               ,multiline  : true 	  		             
			});			
			this.storeProdserv = new Ext.data.JsonStore({
				 url			: 'prodserv/todo'
				,idProperty		: 'prodserv_id'
				,autoLoad		: true
				,autoDestroy	: true
				,remoteSort     : true
				,baseParams		: {
					 action	 : 'prodserv/todo'
					,invenda : '0' 
					,limit	 : 30
				}				
				,fields:[
					 {name:'prodserv_id'             ,type:'int'}
					,{name:'prodserv_desc'           ,type:'string'}
					,{name:'prodserv_valor'          ,type:'float'}
					,{name:'prodserv_inclassificacao', type:'string'}
				]
			});	
						//combo dos produtos e servi�os
			this.comboProdserv = new Ext.form.ComboBox({
				xtype        : 'combo'
			   ,store        : this.storeProdserv
			   ,idProperty	 : 'pdsv_id'
			   ,name         : 'prodserv_desc'
	           ,fieldLabel   : 'Produto/Serviço'
               ,triggerAction: 'all'
			   ,displayField : 'prodserv_desc'
			   ,valueField	 : 'prodserv_id'	
			   ,loadingText  : 'Carregando...'
               ,emptyText  	 : 'Selecione um produto/serviço'
               ,readOnly     : false
               ,editable     : false
			   ,width        : 350
			   ,listeners    : {				   			   				   	
				   scope  : this 
				  ,select : {					   				  		
					   fn : function(combo,record,value){								   
						   this.textreqestprod_quantidade.setValue(1);						   
			  	  	   }        		   
			  	  }	   
			   }
			});			
			this.btnAdicionarproduto = new Ext.Button({
				iconCls : 'silk-add'
			   ,scope   : this
			   ,handler : this._onBtnAdicionarprodutoClick
			   ,width   : 30
			   ,col     : true
			});
			
			this.storereqestprod = new Ext.data.JsonStore({				
				url			  : 'reqestprod/listar'
			   ,root		  : 'rows'					
			   ,autoLoad	  : false
			   ,autoDestroy	  : true
        	   ,remoteSort    : true
        	   ,scope         : this        	   
			   ,baseParams	  : {
				   action : 'reqestprod/listar'
				  ,limit  : 30
			   }
			   ,fields : [
                    {name: 'reqest_id'	           ,type:'int'}       
                   ,{name: 'reqestprod_id'         ,type:'int'}
				   ,{name: 'prodserv_id'           ,type:'int'}   	   
				   ,{name: 'prodserv_desc'	       ,type:'string'}
				   ,{name: 'reqestprod_quantidade' ,type:'float'}
				   ,{name: 'reqestprod_valor'  	   ,type:'float'}
				   ,{name: 'reqestprod_total'      ,type:'float'}
			   ]
			});			
			
			var rendererReal = function(v)
			{
				return Ext.util.Format.usMoney(v).replace('$','R$');
			}
			
			var rendererNumber = function(v)
			{
				return Ext.util.Format.number(v,'0,000.00');
			}
			
			// utilize custom extension for Group Summary
			var summary = new Ext.ux.grid.GridSummary();
			
			this.gridreqestprod = new Ext.grid.GridPanel({
			 	 title			  : 'Produtos selecionados'
				,style	 		  : 'margin-top:2px;'
				,autoExpandColumn : 'prodserv_id'
				,height			  : 200
				,store			  : this.storereqestprod
				,autoScroll       : true
				,plugins		  : summary
				,columns		  : [{					
					 header	   : '&nbsp;'
					,dataIndex : 'prodserv_id'
					,align	   : 'center'
					,width	   : 30
					,fixed	   : true
					,renderer  : function()
					{
						return '<img src="'+Ext.BLANK_IMAGE_URL+'" width="16" height="16" class="silk-delete" style="cursor:pointer;" />'
					}
				},{					
					header	        : 'Id'			
				   ,dataIndex       : 'prodserv_id'
				   ,id		        : 'prodserv_id'
				   ,width	        : 10					
				},{
					header	        : 'Descrição'			
				   ,dataIndex       : 'prodserv_desc'
				   ,width	        : 300
				},{ 
					header	        : 'Qtde'
				   ,dataIndex       : 'reqestprod_quantidade'
				   ,summaryType     : 'sum'
				   ,width		    : 50
				   ,align		    : 'center'
				},{
					header		    : 'Valor unitário'	
				   ,dataIndex	    : 'reqestprod_valor'		
				   ,width		    : 100
				   ,align		    : 'right'
				   ,summaryType     : 'sum'
				   ,renderer   	    : rendererReal
				},{
					header		    : 'Valor total'		
				   ,dataIndex	    : 'reqestprod_total'		
				   ,align		    : 'right'
				   ,summaryType     : 'sum'
				   ,width		    : 100
      			   ,summaryRenderer : rendererReal					
				}]				
			});
			
			//formulário de cadastro	
			this.formCadastro = new Ext.form.FormPanel({
				 bodyStyle	: 'padding:5px;'
				,border		: true
				,layout     : 'fit'				
				,autoScroll	: true				
				,defaultType: 'textfield'
				,defaults	: {
					anchor: '-5' 	//anchor é um config. option. excelente para formulário. Ele define larguras relativas
									//nesse caso a largura total -19px, que reservei para scroll
				}
				,items:[{
					xtype      : 'fieldset'
				   ,labelWidth : 100
				   ,autoHeight : true	
				   ,width      : 705
				   ,items      : [			 
					    this.textreqest_id				   
					   ,this.comboEmpresa
					   ,this.datereqest_data
					   ,this.textreqest_desc
				   ]},{					   
						xtype      : 'fieldset'
					   ,autoHeight : true
					   ,width      : 705
					   ,items      : [
					       this.comboProdserv
					      ,this.textreqestprod_quantidade
					      ,this.textreqestprod_valor
					      ,this.btnAdicionarproduto
					      ,this.gridreqestprod
					   ]
				   },{
					   xtype      : 'fieldset'
 	  				  ,title      : 'Observações'
  					  ,autoHeight : true
  					  ,width      : 705
	  				  ,items      : [
                          this.textreqest_observacao
                      ]
				   }
				]
			});
			
			
			/* 
			 * Monta as abas e aplica as configurações
			 */
			this.tabPanel = new Ext.TabPanel({
				activeTab      : 0               
               ,border         : false
               ,plain          : true
               ,deferredRender : true
               ,scope          : this
               ,defaults       : {autoScroll: true}
			   ,items:[{
				   title : 'Cadastro'					   
				  ,items : [this.formCadastro]  
			   }]			           			                          
            })
			
			Ext.apply(this,{
				 items	: this.tabPanel
				,bbar	: [				
			    this.btnImprimir = new Ext.Button({
			    	text	: 'Imprimir'
				   ,iconCls : 'silk-printer'
				   ,scope	: this
				   ,handler : this._onBtnImprimirClick
				}),'->'					     	   
				,{xtype:'tbseparator'}
			    ,this.btnNovo = new Ext.Button({
			    	text	: 'Novo'
				   ,iconCls : 'silk-add'
				   ,scope	: this
				   ,handler : this._onBtnNovoClick
				})	     	   
				,this.btnSalvar = new Ext.Button({
					 text	: 'Salvar'
					,iconCls: 'icon-save'
					,scope	: this
					,handler: this._onBtnSalvarClick
				})				
				,this.btnExcluir = new Ext.Button({
					 text	: 'Excluir'
					,iconCls: 'silk-delete'
					,scope	: this
					,handler: this._onBtnDeleteClick
				})
				,{xtype:'tbseparator'}
				,this.btnSair = new Ext.Button({
					 text	: 'Sair'
					,iconCls: 'ico-sair'
					,scope	: this
					,handler: function(){						
						this.destroy();
					}
				})	
				]
			});
			
			//super
			movreqest.superclass.initComponent.call(this);
		}
		,initEvents: function()
		{			
			movreqest.superclass.initEvents.call(this);			
			
			//grid produtos
			this.gridreqestprod.on({
				 scope		: this
				,cellclick	: this._onGridreqestprodCellClick
			});			
		}		
		,show: function()
		{			
			movreqest.superclass.show.apply(this,arguments);			
			if(this.reqestID !== 0) {				
				this.btnExcluir.show();			
				this.el.mask('Carregando informações..');			
				
				this.formCadastro.getForm().load({
					 url     : 'reqest/buscar'
					,params  : {						
						 action     : 'buscar'
						,reqest_id : this.reqestID						
					}
				    ,scope   : this
				    ,success : this._onFormLoad
				});				
				
				// recarrega os dados do produto e serviços
				this.storereqestprod.reload({
					params: {
						value  : this.reqestID
					   ,field  : 'reqest_id'
				   }
				});
				
				this.btnSalvar.setDisabled(true);
			}else{
				this.btnExcluir.hide();
				this.formCadastro.getForm().reset();
			}			
		}
		,onDestroy: function()
		{
			movreqest.superclass.onDestroy.apply(this,arguments);
			Ext.destroy('reqest_id');this.formCadastro = null;
		}		
		,_onFormLoad: function(form, request)
		{
			var data = request.result.data;
			
			if(data.empresa_id){
				this.comboEmpresa.setValue(data.empresa_id);
				this.comboEmpresa.setRawValue(data.empresa_desc);
			}			
			this.el.unmask();			
		}	
		,_onGridreqestprodCellClick: function(grid, row, col, e)
		{			
			if(col !== 0)
				return;
			
			if(this.reqestID!==0){
				Ext.Msg.alert('Atenção','Operação não permitida,somente consulta!');
				return false;				
			}
				
			//busca registro
			var record = grid.store.getAt(row);
			
			//remove do store
			record.store.remove(record);
			
			this.comboProdserv.focus();
		}
		,_onGridreqestparcCellClick: function(grid, row, col, e)
		{			
			if(col !== 0)
				return;
			
			if(this.reqestID==0){
				Ext.Msg.alert('Atenção','Operação não permitida,somente consulta!');
				return false;				
			}
				
			//busca registro
			var record = grid.store.getAt(row);
			
			//remove do store
			record.store.remove(record);			
		}		
		,_onBtnNovoClick: function()
		{
			this.formCadastro.getForm().reset();
			this.storereqestprod.removeAll();
			this.btnSalvar.setDisabled(false);
			this.btnAdicionarproduto.setDisabled(false);
			this.reqestID = 0;
		}		
		,_onBtnSalvarClick: function()
		{
			//pego o formulário
			var form = this.formCadastro.getForm();
			
			//verifico se é valido
			if(!form.isValid())	
			{
				Ext.Msg.alert('Atencao','Preencha corretamente todos os campos!');
				return false;
			}
			
			//verifico se tem produto ou serviços
			if(this.gridreqestprod.store.getCount()===0)
			{
				Ext.Msg.alert('Atenção','É preciso adicionar ao menos um produto!');
				return;
			}
			
			//extrai produtos da nota fiscal
			var reqestprod = [];
			this.gridreqestprod.store.each(function( record )
			{				
				reqestprod.push( Ext.encode(record.data) );
			})			
			
			//crio uma máscara
			this.el.mask('Salvando informações');			
			
			/*
			 * Submitando formulário
			 */
			form.submit({
				 url	: 'reqest/salvar'
				,params	: {
					action         : 'salvar'
				   ,reqest_id      : this.reqestID
				   ,'reqestprod[]' : reqestprod
				}
				,scope:this
				,success: function(f,a) //ao terminar de submitar
				{
					//tirá máscara
					this.el.unmask();
					this.textreqest_id.setValue(a.result.id);
					this.reqestID = a.result.id;
					this.fireEvent('salvar',this);
					this.btnSalvar.setDisabled(true);
					
					this.formCadastro.getForm().load({
						 url     : 'reqest/buscar'
						,params  : {						
							 action    : 'buscar'
							,reqest_id : this.reqestID						
						}
					    ,scope   : this
					    ,success : this._onFormLoad
					});
				}
				,failure: function(f,a)
				{
					Ext.Msg.alert('Atenção','Erro na gravação da reqest,contate o suporte técnico!');
				}
			});
		}		
		,_onBtnDeleteClick: function()
		{
			Ext.Msg.confirm('Confirmação','Deseja mesmo excluir esse registro?',function(opt) {
				if(opt === 'no') {
					return					
				}
				this.el.mask('Excluir informação.');
				
				Ext.Ajax.request({
					 url	: 'reqest/excluir'
					,params	: {
						 action	   : 'excluir'
					    ,reqest_id : this.reqestID
					}
				   ,scope	: this
				   ,success: function()
				   {
					   this.el.unmask();
					   this.hide();
					   this.fireEvent('excluir',this);
					}
				})					
			},this)
		}
		,_onBtnAdicionarprodutoClick: function()
		{
			if(this.reqestID!==0){
				Ext.Msg.alert('Atenção','Operação não permitida,somente consulta!');
				return false;				
			}

			//busca os dados			
			var id = this.comboProdserv.getValue();
			var qtde = this.textreqestprod_quantidade.getValue();
			var valor = this.textreqestprod_valor.getValue();	
			var desc = this.comboProdserv.getRawValue();		

			var total = (qtde*valor);
			
			if( !id || !qtde )
			{
				Ext.Msg.alert('Atenção','É necessário selecionar um produto e informar uma quantidade');
				return;
			}	

			//cria registro	
			var newRecord = new this.gridreqestprod.store.recordType({
				 prodserv_id           : id
				,prodserv_desc         : desc				
				,reqestprod_quantidade : qtde
				,reqestprod_valor      : valor
				,reqestprod_total      : total.toFixed(2)
			});
			
			//adiciona
			this.gridreqestprod.store.add(newRecord);
			
			//reseta
			this.textreqestprod_quantidade.reset();
			this.textEntrestprod_valor.reset();	
			this.comboProdserv.focus();
		}
		,_onBtnImprimirClick: function()
		{
			var form = this.formCadastro.getForm();					
			
			//extrai produtos da nota fiscal
			var reqestprod = [];
			this.gridreqestprod.store.each(function( record )
			{				
				reqestprod.push( Ext.encode(record.data) );
			})						
			
			form.submit({
	    		waitMsgTarget : false	
	  	       ,waitTitle     : 'Por favor aguarde'
			   ,waitMsg       : 'Gerando relatorio...'
			   ,reset         : false       	
	           ,url           : 'reqest/imprimir'
	           ,params        : {
        		   action	     : 'imprimir'
				   ,reqest_id      : this.reqestID
				   ,'reqestprod[]' : reqestprod
	           }
			   ,scope         : this  
	           ,success       : function(f,a) {        	   
	        	   var p = new Ext.ux.MediaWindow({       		      
	        		   title        : 'Imprimir Acordo Comercial' 	   
	        	      ,height       : 550
	        	      ,width        : 1000
	        	      ,maximizable  : true
	        	      ,collapsible  : true
	        	      ,animCollapse : false        	      
	        	      ,layout       : 'fit'
	        	      ,shim         : false
	        	      ,mediaCfg     : {
	        	    	  mediaType       : 'PDF'
	        	         ,url             : a.result.link
	        	         ,unsupportedText : 'Acrobat Viewer não instalado'
	        	         ,params          : {page:1}
	        	      }
	        	   }).show();
	        	   
	           }
	           ,failure: function(f,a){
	                Ext.MessageBox.alert('Atenção',a.result.msg.text);
	           }
	        });	   
	}		

});