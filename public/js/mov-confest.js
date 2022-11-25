var movconfest = Ext.extend(Ext.Window,{	
		 confestID   : 0
		,modal		 : false
		,constrain	 : true
		,maximizable : false
		,resizable   : false
		,width		 : 750
		,height		 : 570
		,title		 : 'Conferência do estoque'
		,layout		 : 'fit'
		,buttonAlign : 'center'
		,closeAction : 'hide'		
			
		,setConfestID: function(confestID)
		{
			this.confestID = confestID;
		}
		,constructor: function()
		{
			this.addEvents({
				 salvar	: true
				,excluir: true
			});

			//super
			movconfest.superclass.constructor.apply(this, arguments);
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
			this.textConfest_id = new Ext.form.TextField({
				fieldLabel : 'Numero'
			   ,name	   : 'confest_id'
			   ,disabled   : true
	    	   ,width	   : 50		   
			   ,col        : true
			});
			this.dateConfest_data = new Ext.form.DateField({
				xtype      : 'datefield'
			   ,fieldLabel : 'Data do cadastro'
			   ,name	   : 'confest_data'
			   ,allowBlank : false
	  	       ,maxLength  : 10	 
	  	       ,width	   : 100
	  		   ,format     : 'd/m/Y'
	  		   ,altFormats : 'd/m/Y|j/n/Y|j/n/y|j/m/y|d/n/y|j/m/Y|d/m/Y|d-m-y|d-m-Y|d/m|d-m|dm|dmy|dmY|d|d-m-Y'
			});
			this.dateConfest_data.setValue(new Date());
			
			this.timeConfest_hora = new Ext.form.TimeField({
				xtype      : 'timeField'
			   ,fieldLabel : 'Hora'
			   ,name	   : 'confest_hora'
			   ,allowBlank : false
	  	       ,maxLength  : 10
	  	       ,width	   : 120
	  	       ,format     : 'H:i:s'
	  	       ,col        : true
			});
			this.timeConfest_hora.setValue(new Date());
			
			this.textConfest_desc = new Ext.form.TextField({
				fieldLabel : 'Descrição'
			   ,name	   : 'confest_desc'
	    	   ,width	   : 350
	    	   ,maxLength  : 100
			});

			this.textConfestprod_quantidade = new Ext.form.TextField({				
				xtype            : 'numberfield'
  			   ,fieldLabel       : 'Quantidade'
			   ,name	         : 'confestprod_quantidade'
			   ,DecimalPrecision : 3	   
			   ,allowBlank       : true
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
				   		 this.textConfestprod_quantidade.setValue(1);
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
			
			this.storeConfestprod = new Ext.data.JsonStore({				
				url			  : 'confestprod/listar'
			   ,root		  : 'rows'					
			   ,autoLoad	  : false 
			   ,autoDestroy	  : true
        	   ,remoteSort    : true
        	   ,scope         : this        	   
			   ,baseParams	  : {
				   action : 'confestprod/listar'
				  ,limit  : 30
			   }
			   ,fields : [
                    {name: 'confestprod_id'	        ,type:'int'}       
                   ,{name: 'confest_id'             ,type:'int'}
				   ,{name: 'prodserv_id'            ,type:'int'}   	   
				   ,{name: 'prodserv_desc'	        ,type:'string'}
				   ,{name: 'confestprod_quantidade' ,type:'float'}
			   ]
			});
			
			// utilize custom extension for Group Summary
			var summary = new Ext.ux.grid.GridSummary();
			
			this.gridConfestprod = new Ext.grid.GridPanel({
			 	 title			  : 'Produtos selecionados'
				,style	 		  : 'margin-top:2px;'
				,autoExpandColumn : 'prodserv_id'
				,height			  : 250
				,store			  : this.storeConfestprod
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
				   ,width	        : 450
				},{ 
					header	        : 'Qtde'
				   ,dataIndex       : 'confestprod_quantidade'
				   ,summaryType     : 'sum'
				   ,width		    : 50
				   ,align		    : 'center'
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
				   ,autoWidth  : true
				   ,items      : [			 
				    this.comboEmpresa
				   ,this.dateConfest_data
				   ,this.timeConfest_hora
				   ,this.textConfest_desc
				   ]},{					   
						xtype      : 'fieldset'
					   ,autoHeight : true
					   ,autoWidth  : true
					   ,items      : [
					       this.comboProdserv
					      ,this.textConfestprod_quantidade
					      ,this.btnAdicionarproduto
					      ,this.gridConfestprod
					   ]
				   }
			   ]
			});		
			
			Ext.apply(this,{
				 items	: this.formCadastro
				,bbar	: ['->',
			     this.btnNovo = new Ext.Button({
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
			movconfest.superclass.initComponent.call(this);
		}
		,initEvents: function()
		{			
			movconfest.superclass.initEvents.call(this);			
			
			//grid produtos
			this.gridConfestprod.on({
				 scope		: this
				,cellclick	: this._onGridConfestprodCellClick
			});			
		}		
		,show: function()
		{			
			movconfest.superclass.show.apply(this,arguments);
			
			if(this.confestID !== 0) {				
				this.btnExcluir.show();			
				this.el.mask('Carregando informações..');			
				
				this.formCadastro.getForm().load({
					 url     : 'confest/buscar'
					,params  : {						
						 action     : 'buscar'
						,confest_id : this.confestID						
					}
				    ,scope   : this
				    ,success : this._onFormLoad
				});						
				
				// recarrega os dados do produto e serviços
				this.storeConfestprod.reload({
					params: {
						value  : this.confestID
					   ,field  : 'confest_id'
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
			movconfest.superclass.onDestroy.apply(this,arguments);
			Ext.destroy('confest_id');this.formCadastro = null;
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
		,_onGridConfestprodCellClick: function(grid, row, col, e)
		{			
			if(col !== 0)
				return;
			
			if(this.confestID!==0){
				Ext.Msg.alert('Atenção','Operação não permitida,somente consulta!');
				return false;				
			}
				
			//busca registro
			var record = grid.store.getAt(row);
			
			//remove do store
			record.store.remove(record);
			
			this.comboProdserv.focus();
		}
		,_onBtnNovoClick: function()
		{
			this.formCadastro.getForm().reset();
			this.storeConfestprod.removeAll();
			this.btnSalvar.setDisabled(false);
			this.btnAdicionarproduto.setDisabled(false);
			this.confestID = 0;
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
			if(this.gridConfestprod.store.getCount()===0)
			{
				Ext.Msg.alert('Atenção','É preciso adicionar ao menos um produto!');
				return;
			}
			
			//extrai produtos da nota fiscal
			var confestprod = [];
			this.gridConfestprod.store.each(function( record )
			{				
				confestprod.push( Ext.encode(record.data) );
			})			
			
			//crio uma máscara
			this.el.mask('Salvando informações');			
			
			/*
			 * Submitando formulário
			 */
			form.submit({
				 url	: 'confest/salvar'
				,params	: {
					action	        : 'salvar'
				   ,'confestprod[]' : confestprod
				}
				,scope:this
				,success: function(f,a) //ao terminar de submitar
				{
					//tirá máscara
					this.el.unmask();
					this.textConfest_id.setValue(a.result.id);
					this.confestID = a.result.id;
					this.fireEvent('salvar',this);
					this.btnSalvar.setDisabled(true);
										
					this.formCadastro.getForm().load({
						 url     : 'confest/buscar'
						,params  : {						
							 action     : 'buscar'
							,confest_id : this.confestID						
						}
					    ,scope   : this
					    ,success : this._onFormLoad
					});
				}
				,failure: function(f,a)
				{
					Ext.Msg.alert('Atenção','Erro na gravação da confest,contate o suporte técnico!');
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
					 url	: 'confest/excluir'
					,params	: {
						 action	    : 'excluir'
					    ,confest_id : this.confestID
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
			if(this.confestID!==0){
				Ext.Msg.alert('Atenção','Operação não permitida,somente consulta!');
				return false;				
			}

			//busca os dados			
			var id = this.comboProdserv.getValue();
			var qtde = this.textConfestprod_quantidade.getValue();
			var desc = this.comboProdserv.getRawValue();
			
			if( !id || !qtde )
			{
				Ext.Msg.alert('Atenção','É necessário selecionar um produto e informar uma quantidade');
				return;
			}	

			//cria registro	
			var newRecord = new this.gridConfestprod.store.recordType({
				 prodserv_id             : id
				,prodserv_desc           : desc				
				,confestprod_quantidade  : qtde
			});
			
			//adiciona
			this.gridConfestprod.store.add(newRecord);
			
			//reseta
			this.textConfestprod_quantidade.reset();
			this.comboProdserv.focus();
		}
});