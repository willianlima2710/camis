var moventrest = Ext.extend(Ext.Window,{	
		 entrestID   : 0
		,modal		 : false
		,constrain	 : true
		,maximizable : false
		,resizable   : false
		,width		 : 750
		,height		 : 610
		,title		 : 'Entrada do estoque'
		,layout		 : 'fit'
		,buttonAlign : 'center'
		,closeAction : 'hide'		
			
		,setEntrestID: function(entrestID)
		{
			this.entrestID = entrestID;
		}
		,constructor: function()
		{
			this.addEvents({
				 salvar	: true
				,excluir: true
			});

			//super
			moventrest.superclass.constructor.apply(this, arguments);
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
			this.textEntrest_id = new Ext.form.Hidden({
				fieldLabel : 'Numero'
			   ,name	   : 'entrest_id'
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
			this.dateEntrest_data = new Ext.form.DateField({
				xtype      : 'datefield'
			   ,fieldLabel : 'Data'
			   ,name	   : 'entrest_data'
			   ,allowBlank : true
	  	       ,maxLength  : 10	  	        	   
	  		   ,format     : 'd/m/Y'
	  		   ,altFormats : 'd/m/Y|j/n/Y|j/n/y|j/m/y|d/n/y|j/m/Y|d/m/Y|d-m-y|d-m-Y|d/m|d-m|dm|dmy|dmY|d|d-m-Y'
	  		   ,col        : true
			});
			this.dateEntrest_data.setValue(new Date());
			
			this.dateEntrest_emissao = new Ext.form.DateField({
				fieldLabel : 'Data da emissão'
			   ,name	   : 'entrest_emissao'
			   ,allowBlank : true
			   ,maxLength  : 10
		  	   ,format     : 'd/m/Y'
		  	   ,altFormats : 'd/m/Y|j/n/Y|j/n/y|j/m/y|d/n/y|j/m/Y|d/m/Y|d-m-y|d-m-Y|d/m|d-m|dm|dmy|dmY|d|d-m-Y'		  	   	   
			});
			this.textNotafis_numero = new Ext.form.TextField({
				fieldLabel : 'Nº da nota'
			   ,name	   : 'notafis_numero'
	    	   ,width	   : 120
	    	   ,col        : true
			});
			this.textEntrest_serie = new Ext.form.TextField({
				fieldLabel : 'Serie'
			   ,name	   : 'entrest_serie'
	    	   ,width	   : 100	
	    	   ,col        : true	   			   
			});			

			this.comboFornecedor = new Ext.form.ComboBox({
				 fieldLabel		: 'Fornecedor'
				,xtype			: 'combo'
         	    ,idProperty	    : 'fornecedor_id'		
				,hiddenName		: 'fornecedor_id'	
				,triggerAction	: 'all'
				,valueField		: 'fornecedor_id'
				,displayField	: 'fornecedor_desc'
				,emptyText		: 'Selecione uma fornecedor'
				,allowBlank		: false
				,readOnly       : false
				,editable       : false
			    ,width          : 350
				,store			: new Ext.data.JsonStore({
					 url		: 'fornecedor/todo'
					,baseParams	: {
						 action	: 'todo'
						,limit	: 30
					}
					,fields:[
						 {name: 'fornecedor_id'   , type:'int'}
						,{name: 'fornecedor_desc' , type:'string'}
					]
				})			
			})

			this.textEntrestprod_quantidade = new Ext.form.TextField({				
				xtype            : 'numberfield'
  			   ,fieldLabel       : 'Quantidade'
			   ,name	         : 'entrestprod_quantidade'
			   ,DecimalPrecision : 3	   
			   ,allowBlank       : true
			});
			this.textEntrestprod_valor = new Ext.ux.form.MaskTextField({				
  			    fieldLabel : 'Valor'
			   ,name	   : 'entrestprod_valor'
			   ,mask       : '9.999.990,00'
			   ,money      : true						  
			   ,allowBlank : true
			   ,col        : true								
			});			
			this.textTxcv_quantidade = new Ext.form.TextField({				
				xtype            : 'numberfield'
  			   ,fieldLabel       : 'Qt.Conversão'
			   ,name	         : 'txcv_quantidade'
			   ,DecimalPrecision : 3	   
			   ,allowBlank       : true
			});
			this.textTxcv_unitario = new Ext.ux.form.MaskTextField({
  			    fieldLabel : 'Unitário'
			   ,name	   : 'txcv_unitario'
			   ,mask       : '9.999.990,00'
			   ,money      : true						  
			   ,allowBlank : true
			   ,col        : true								
			});		
			this.btnConverteproduto = new Ext.Button({
				iconCls : 'silk-arrow-refresh'
			   ,scope   : this
			   ,handler : this._onBtnConverteprodutoClick
			   ,width   : 30
			   ,col     : true
			});				
			this.textEntrest_observacao = new Ext.form.TextArea({				
			    name	   : 'entrest_observacao'
               ,allowBlank : true
               ,width	   : '90%'
               ,multiline  : true 	  		             
			});			
			this.textEntrest_base_icms = new Ext.ux.form.MaskTextField({				
  			    fieldLabel : 'Base do ICMS'
			   ,name	   : 'entrest_base_icms'
			   ,mask       : '9.999.990,00'
			   ,money      : true						  
			   ,allowBlank : true
			   ,col        : true
			});
			this.textEntrest_valor_icms = new Ext.ux.form.MaskTextField({				
  			    fieldLabel : 'Valor do ICMS'
			   ,name	   : 'entrest_valor_icms'
			   ,mask       : '9.999.990,00'
			   ,money      : true						  
			   ,allowBlank : true
			   ,col        : true
			});	
			this.textEntrest_base_icms_subst = new Ext.ux.form.MaskTextField({				
  			    fieldLabel : 'Base Icms Subst'
			   ,name	   : 'entrest_base_icms_subst'
			   ,mask       : '9.999.990,00'
			   ,money      : true						  
			   ,allowBlank : true
			   ,col        : true
			});	
			this.textEntrest_valor_icms_subst = new Ext.ux.form.MaskTextField({				
  			    fieldLabel : 'Valor Icms Subst'
			   ,name	   : 'entrest_valor_icms_subst'
			   ,mask       : '9.999.990,00'
			   ,money      : true						  
			   ,allowBlank : true
			});	
			this.textEntrest_base_ipi = new Ext.ux.form.MaskTextField({				
  			    fieldLabel : 'Base do IPI'
			   ,name	   : 'entrest_base_ipi'
			   ,mask       : '9.999.990,00'
			   ,money      : true						  
			   ,allowBlank : true
			   ,col        : true
			});	
			this.textEntrest_total_prod = new Ext.ux.form.MaskTextField({				
  			    fieldLabel : 'Total produtos'
			   ,name	   : 'entrest_total_prod'
			   ,mask       : '9.999.990,00'
			   ,money      : true						  
			   ,allowBlank : true
			   ,disabled   : true
			   ,col        : true
			});			
			this.textEntrest_frete = new Ext.ux.form.MaskTextField({				
  			    fieldLabel : 'Frete'
			   ,name	   : 'entrest_frete'
			   ,mask       : '9.999.990,00'
			   ,money      : true						  
			   ,allowBlank : true
			});	
			this.textEntrest_seguro = new Ext.ux.form.MaskTextField({				
  			    fieldLabel : 'Seguro'
			   ,name	   : 'entrest_seguro'
			   ,mask       : '9.999.990,00'
			   ,money      : true						  
			   ,allowBlank : true
			   ,col        : true								
			});	
			this.textEntrest_despesa = new Ext.ux.form.MaskTextField({				
  			    fieldLabel : 'Despesas'
			   ,name	   : 'entrest_despesa'
			   ,mask       : '9.999.990,00'
			   ,money      : true						  
			   ,allowBlank : true
			   ,col        : true
			});
			this.textEntrest_ipi = new Ext.ux.form.MaskTextField({				
  			    fieldLabel : 'Valor IPI'
			   ,name	   : 'entrest_ipi'
			   ,mask       : '9.999.990,00'
			   ,money      : true						  
			   ,allowBlank : true
			});
			this.textEntrest_pis = new Ext.ux.form.MaskTextField({				
  			    fieldLabel : 'Valor PIS'
			   ,name	   : 'entrest_pis'
			   ,mask       : '9.999.990,00'
			   ,money      : true						  
			   ,allowBlank : true
			   ,disabled   : true
			   ,col        : true
			});
			this.textEntrest_cofins = new Ext.ux.form.MaskTextField({				
  			    fieldLabel : 'Valor COFINS'
			   ,name	   : 'entrest_cofins'
			   ,mask       : '9.999.990,00'
			   ,money      : true						  
			   ,allowBlank : true
			   ,disabled   : true			   
			   ,col        : true
			});			
			this.textEntrest_total = new Ext.ux.form.MaskTextField({				
  			    fieldLabel : 'Total nota'
			   ,name	   : 'entrest_total'
			   ,mask       : '9.999.990,00'
			   ,money      : true						  
			   ,allowBlank : true
			   ,disabled   : true
			   ,width	   : 100
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
			
			//combo dos produtos e serviços
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
						   this.textEntrestprod_quantidade.setValue(1);						   
						   this.textEntrestprod_valor.setValue(record.data.produto_valor);					   
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
			
			this.storeEntrestprod = new Ext.data.JsonStore({				
				url			  : 'entrestprod/listar'
			   ,root		  : 'rows'					
			   ,autoLoad	  : false
			   ,autoDestroy	  : true
        	   ,remoteSort    : true
        	   ,scope         : this        	   
			   ,baseParams	  : {
				   action : 'entrestprod/listar'
				  ,limit  : 30
			   }
			   ,fields : [
                    {name: 'entrest_id'	            ,type:'int'}       
                   ,{name: 'entrestprod_id'         ,type:'int'}
				   ,{name: 'prodserv_id'            ,type:'int'}   	   
				   ,{name: 'prodserv_desc'	        ,type:'string'}
				   ,{name: 'entrestprod_quantidade' ,type:'float'}
				   ,{name: 'entrestprod_valor'  	,type:'float'}
				   ,{name: 'entrestprod_desconto'   ,type:'float'}
				   ,{name: 'entrestprod_total'      ,type:'float'}
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
			
			this.gridEntrestprod = new Ext.grid.GridPanel({
			 	 title			  : 'Produtos selecionados'
				,style	 		  : 'margin-top:2px;'
				,autoExpandColumn : 'prodserv_id'
				,height			  : 200
				,store			  : this.storeEntrestprod
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
				   ,width	        : 20					
				},{
					header	        : 'Descrição'			
				   ,dataIndex       : 'prodserv_desc'
				   ,width	        : 360
				},{ 
					header	        : 'Qtde'
				   ,dataIndex       : 'entrestprod_quantidade'
				   ,summaryType     : 'sum'
				   ,width		    : 50
				   ,align		    : 'center'
				},{
					header		    : 'Valor unitário'	
				   ,dataIndex	    : 'entrestprod_valor'		
				   ,width		    : 80
				   ,align		    : 'right'
				   ,summaryType     : 'sum'
				   ,renderer   	    : rendererReal
				},{
					header		    : 'Valor total'		
				   ,dataIndex	    : 'entrestprod_total'		
				   ,align		    : 'right'
				   ,summaryType     : 'sum'
				   ,width		    : 80
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
					    this.textEntrest_id				   
					   ,this.comboEmpresa
					   ,this.dateEntrest_data
					   ,this.dateEntrest_emissao
					   ,this.textNotafis_numero
					   ,this.textEntrest_serie				   
					   ,this.comboFornecedor
				   ]},{					   
						xtype      : 'fieldset'
					   ,autoHeight : true
					   ,width      : 705
					   ,items      : [
					       this.comboProdserv
					      ,this.textEntrestprod_quantidade
					      ,this.textEntrestprod_valor
						  ,this.btnAdicionarproduto
						  ,this.textTxcv_quantidade
						  ,this.textTxcv_unitario
						  ,this.btnConverteproduto	
					      ,this.gridEntrestprod
					   ]
				   },{
					   xtype      : 'fieldset'
 	  				  ,title      : 'Observações'
  					  ,autoHeight : true
  					  ,width      : 705
	  				  ,items      : [
                          this.textEntrest_observacao
                      ]
				   },{
					   xtype      : 'fieldset'
  	  		    	  ,autoHeight : true
  	  		    	  ,width      : 705
 	 	  			  ,items      : [
  			 			  this.textEntrest_base_icms
 	 	  				 ,this.textEntrest_valor_icms 
 	 	  			 	 ,this.textEntrest_base_icms_subst
 	 	  			  	 ,this.textEntrest_valor_icms_subst
 	 	  				 ,this.textEntrest_base_ipi
 	 	  				 ,this.textEntrest_total_prod
                         ,this.textEntrest_frete
                         ,this.textEntrest_seguro
                         ,this.textEntrest_despesa
                         ,this.textEntrest_ipi
             			 ,this.textEntrest_pis
            			 ,this.textEntrest_cofins                         
                         ,this.textEntrest_total
 	 	  		      ]
				   }
				]
			});
			
			/* 
			 * Campos de objeto do formulario faturamento
			 */		
			this.textEntrest_documento = new Ext.form.TextField({
				fieldLabel : 'Nº do documento'
			   ,name	   : 'entrest_documento'
		       ,allowBlank : false				   
	    	   ,width	   : 120	    	   
			});
			this.dateEntrest_vencimento = new Ext.form.DateField({
				xtype      : 'datefield'
			   ,fieldLabel : 'Data de vencimento'
			   ,name	   : 'entrest_vencimento'
	  	       ,maxLength  : 10	  	        	   
	  		   ,format     : 'd/m/Y'
	  		   ,width	   : 120
	  		   ,altFormats : 'd/m/Y|j/n/Y|j/n/y|j/m/y|d/n/y|j/m/Y|d/m/Y|d-m-y|d-m-Y|d/m|d-m|dm|dmy|dmY|d|d-m-Y'
			});			
			this.textEntrest_prestacao = new Ext.ux.form.MaskTextField({				
  			    fieldLabel : 'Valor'
			   ,name	   : 'entrest_prestacao'
			   ,mask       : '9.999.990,00'
			   ,money      : true						  
			   ,width	   : 120
			   ,allowBlank : false
			});				
			
			this.btnAdicionarformarec = new Ext.Button({
				text    : 'Adicionar'	   
 			   ,iconCls : 'silk-money'
			   ,scope   : this
			   ,handler : this._onBtnAdicionarFormarecClick
			});		
			
			this.storeEntrestparc = new Ext.data.ArrayStore({				
			   fields : [
                    {name: 'entrest_documento'	,type:'string'}       
                   ,{name: 'entrest_vencimento' ,type:'int'}
				   ,{name: 'entrest_prestacao'  ,type:'date',dateFormat: 'Y-m-d'}   	   
			   ]
			});	
			
			this.gridEntrestparc = new Ext.grid.GridPanel({
			 	 title	 : 'Forma de parcelamento'
				,style	 : 'margin-top:5px;'
				,height	 : 200
				,store	 : this.storeEntrestparc
				,columns : [{					
					header	  : '&nbsp;'
				   ,align	  : 'center'
				   ,width	  : 30
				   ,fixed	  : true
				   ,renderer  : function()
				   {
					   return '<img src="'+Ext.BLANK_IMAGE_URL+'" width="16" height="16" class="silk-delete" style="cursor:pointer;" />'
				   }		           
				},{
					header	  : 'Nº do documento'
				   ,dataIndex : 'entrest_documento'
				   ,width	  : 100
				   ,align	  : 'center'
			    },{					
					header	  : 'Vencimento'
				   ,dataIndex : 'entrest_vencimento'
				   ,width	  : 80
				   ,align	  : 'center'
				   ,renderer   : Ext.util.Format.dateRenderer('d/m/Y')
				},{
					header	  : 'Valor'	
				   ,dataIndex : 'entrest_prestacao'		
				   ,width	  : 80
				   ,align	  : 'right'
				}]
			});			
			
			//formulário de faturamento	
			this.formFaturamento = new Ext.form.FormPanel({
				 bodyStyle	: 'padding:10px;'
				,border		: true
				,autoScroll	: true	
				,layout     : 'fit'
				,defaultType: 'textfield'									
				,defaults	: {
					anchor: '-2' 	//anchor é um config. option. excelente para formulário. Ele define larguras relativas
									//nesse caso a largura total -19px, que reservei para scroll
				}
				,items:[{
					xtype      : 'fieldset'
				   ,title      : 'Forma de parcelamento'
				   ,autoHeight : true
				   ,labelWidth : 150
				   ,items      : [				                  
                       this.textEntrest_documento
					  ,this.dateEntrest_vencimento
					  ,this.textEntrest_prestacao
					  ,this.btnAdicionarformarec
					  ,this.gridEntrestparc
 	  		       ]
				}]
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
			   },{
				   title : 'Faturamento'
				  ,items : [this.formFaturamento]				   
			   }]			           			                          
            })
			
			Ext.apply(this,{
				 items	: this.tabPanel
				,bbar	: [
			    this.btnLancar = new Ext.Button({
			    	text	: 'Lancar'
				   ,iconCls : 'silk-money-delete'
				   ,scope	: this
				   ,handler : this._onBtnLancarClick
				}),'->'
			    ,this.btnImprimir = new Ext.Button({
			    	text	: 'Imprimir'
				   ,iconCls : 'silk-printer'
				   ,scope	: this
				   ,handler : this._onBtnImprimirClick
				})					     	   
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
			moventrest.superclass.initComponent.call(this);
		}
		,initEvents: function()
		{			
			moventrest.superclass.initEvents.call(this);			
			
			//grid produtos
			this.gridEntrestprod.on({
				 scope		: this
				,cellclick	: this._onGridEntrestprodCellClick
			});
			
			//grid parcela
			this.gridEntrestparc.on({
				 scope		: this
				,cellclick	: this._onGridEntrestparcCellClick
			});			

		}		
		,show: function()
		{			
			moventrest.superclass.show.apply(this,arguments);			
			if(this.entrestID !== 0) {				
				this.btnExcluir.show();			
				this.el.mask('Carregando informações..');			
				
				this.formCadastro.getForm().load({
					 url     : 'entrest/buscar'
					,params  : {						
						 action     : 'buscar'
						,entrest_id : this.entrestID						
					}
				    ,scope   : this
				    ,success : this._onFormLoad
				});				
				
				// recarrega os dados do produto e serviços
				this.storeEntrestprod.reload({
					params: {
						value  : this.entrestID
					   ,field  : 'entrest_id'
				   }
				});
				
				this.btnSalvar.setDisabled(true);
			}else{
				this.btnExcluir.hide();
				this.formCadastro.getForm().reset();
				this.textEntrest_despesa.setValue(0);
				this.textEntrest_frete.setValue(0);
				this.textEntrest_seguro.setValue(0);
			}			
		}
		,onDestroy: function()
		{
			moventrest.superclass.onDestroy.apply(this,arguments);
			Ext.destroy('entrest_id');this.formCadastro = null; this.formFaturamento = null;
		}		
		,_onFormLoad: function(form, request)
		{
			var data = request.result.data;
			
			if(data.empresa_id){
				this.comboEmpresa.setValue(data.empresa_id);
				this.comboEmpresa.setRawValue(data.empresa_desc);
			}			
			if(data.fornecedor_id){
				this.comboFornecedor.setValue(data.fornecedor_id);
				this.comboFornecedor.setRawValue(data.fornecedor_desc);
			}						
			this.el.unmask();			
		}	
		,_onGridEntrestprodCellClick: function(grid, row, col, e)
		{			
			if(col !== 0)
				return;
			
			if(this.entrestID!==0){
				Ext.Msg.alert('Atenção','Operação não permitida,somente consulta!');
				return false;				
			}
				
			//busca registro
			var record = grid.store.getAt(row);
			
			//remove do store
			record.store.remove(record);
			
			this.comboProdserv.focus();
		}
		,_onGridEntrestparcCellClick: function(grid, row, col, e)
		{			
			if(col !== 0)
				return;
			
			if(this.entrestID==0){
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
			this.formFaturamento.getForm().reset();
			this.storeEntrestprod.removeAll();
			this.storeEntrestparc.removeAll();
			this.btnSalvar.setDisabled(false);
			this.btnAdicionarproduto.setDisabled(false);
			this.entrestID = 0;
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
			if(this.gridEntrestprod.store.getCount()===0)
			{
				Ext.Msg.alert('Atenção','É preciso adicionar ao menos um produto!');
				return;
			}
			
			//extrai produtos da nota fiscal
			var entrestprod = [];
			this.gridEntrestprod.store.each(function( record )
			{				
				entrestprod.push( Ext.encode(record.data) );
			})			
			
			//crio uma máscara
			this.el.mask('Salvando informações');			
			
			/*
			 * Submitando formulário
			 */
			form.submit({
				 url	: 'entrest/salvar'
				,params	: {
					action	        : 'salvar'
				   ,entrest_id      : this.entrestID
				   ,fornecedor_id   : this.comboFornecedor.getValue()
				   ,'entrestprod[]' : entrestprod
				}
				,scope:this
				,success: function(f,a) //ao terminar de submitar
				{
					//tirá máscara
					this.el.unmask();
					this.textEntrest_id.setValue(a.result.id);
					this.entrestID = a.result.id;
					this.fireEvent('salvar',this);
					this.btnSalvar.setDisabled(true);
					
					this.formCadastro.getForm().load({
						 url     : 'entrest/buscar'
						,params  : {						
							 action     : 'buscar'
							,entrest_id : this.entrestID						
						}
					    ,scope   : this
					    ,success : this._onFormLoad
					});
				}
				,failure: function(f,a)
				{
					Ext.Msg.alert('Atenção','Erro na gravação da entrest,contate o suporte técnico!');
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
					 url	: 'entrest/excluir'
					,params	: {
						 action	    : 'excluir'
					    ,entrest_id : this.entrestID
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
			if(this.entrestID!==0){
				Ext.Msg.alert('Atenção','Operação não permitida,somente consulta!');
				return false;				
			}

			//busca os dados			
			var id = this.comboProdserv.getValue();
			var qtde = this.textEntrestprod_quantidade.getValue();
			var valor = this.textEntrestprod_valor.getValue();	
			var desc = this.comboProdserv.getRawValue();
			
			var total = (qtde*valor);
			
			if( !id || !qtde )
			{
				Ext.Msg.alert('Atenção','É necessário selecionar um produto e informar uma quantidade');
				return;
			}	

			//cria registro	
			var newRecord = new this.gridEntrestprod.store.recordType({
				 prodserv_id            : id
				,prodserv_desc          : desc				
				,entrestprod_quantidade : qtde
				,entrestprod_valor      : valor
				,entrestprod_total      : total.toFixed(2)
			});
			
			//adiciona
			this.gridEntrestprod.store.add(newRecord);
			
			//reseta
			this.textEntrestprod_quantidade.reset();
			this.textEntrestprod_valor.reset();	
			this.comboProdserv.focus();
		}
		,_onBtnConverteprodutoClick: function() 
		{
			var valor = (this.textTxcv_unitario.getValue()/this.textTxcv_quantidade.getValue());
			this.textEntrestprod_valor.setValue(valor);						
			this.textEntrestprod_quantidade.setValue(this.textTxcv_quantidade.getValue());
			this.textTxcv_quantidade.reset();
			this.textTxcv_unitario.reset();
		}
		,_onBtnAdicionarFormarecClick: function()
		{
			if(this.entrestID==0){
				Ext.Msg.alert('Atenção','Operação não permitida,somente consulta!');
				return false;				
			}
			
			//pego o formulário
			var form = this.formFaturamento.getForm();
			
			//verifico se é valido
			if(!form.isValid())	
			{
				Ext.Msg.alert('Atencao','Preencha corretamente todos os campos!');
				return false;
			}

			//cria registro	
			var newRecord = new this.gridEntrestparc.store.recordType({
				 entrest_documento  : this.textEntrest_documento.getValue()
				,entrest_vencimento : this.dateEntrest_vencimento.getValue()				
				,entrest_prestacao  : this.textEntrest_prestacao.getValue()
			});
			
			//adiciona
			this.gridEntrestparc.store.add(newRecord);
			
			//reseta			
			this.textEntrest_documento.reset();
			this.dateEntrest_vencimento.reset();
			this.textEntrest_prestacao.reset();
		}
		,_onBtnLancarClick: function()
		{			
			//extrai parcelas
			var entrestparc = [];
			this.gridEntrestparc.store.each(function( record )
			{				
				entrestparc.push( Ext.encode(record.data) );
			});			
			
			//busca registro
			this.el.mask('Processando.');
			
			Ext.Ajax.request({
				url	: 'entrest/lancar'
			   ,params	: {
				   action          : 'lancar'
				  ,empresa_id      : this.comboEmpresa.getValue()
				  ,empresa_desc    : this.comboEmpresa.getRawValue()
				  ,fornecedor_id   : this.comboFornecedor.getValue()
				  ,fornecedor_desc : this.comboFornecedor.getRawValue()				  
				  ,'entrestparc[]' : entrestparc 
			   }
			   ,scope	: this
			   ,success : function()
			   {				   
				   this.el.unmask();
				   this.btnLancar.setDisabled(true);
				   
			   }
			});  
	  }		
});