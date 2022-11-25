var cadjazigo = Ext.extend(Ext.Window,{	
		 jazigoID    : 0
		,modal		 : true
		,constrain	 : true
		,maximizable : false
		,resizable   : false
		,width		 : 450
		,height		 : 390
		,title		 : 'Cadastro de jazigo'
		,layout		 : 'fit'
		,buttonAlign : 'center'		
		,closeAction : 'hide'
			
		,setJazigoID: function(jazigoID)
		{
			this.jazigoID = jazigoID;
		}
		,constructor: function()
		{
			this.addEvents({
				 salvar	: true
				,excluir: true
			});

			//super
			cadjazigo.superclass.constructor.apply(this, arguments);
		}
		
		,initComponent: function()
		{
			//combo dos cemiterios
			this.comboCemiterio = new Ext.form.ComboBox({
				 fieldLabel		: 'Cemiterio'		
				,xtype			: 'combo'
				,hiddenName		: 'cemiterio_id'	
				,triggerAction	: 'all'
				,valueField		: 'cemiterio_id'
				,displayField	: 'cemiterio_desc'
				,emptyText		: 'Selecione um cemiterio'
				,allowBlank		: true
				,readOnly       : false
				,editable       : false
				,store			: new Ext.data.JsonStore({
					 url		: 'cemiterio/todo'
					,baseParams	: {
						 action	: 'todo'
						,limit	: 30
					}
					,fields:[
						 {name: 'cemiterio_id'   , type:'int'}
						,{name: 'cemiterio_desc' , type:'string'}
					]
				})
			})
			
			//combo dos lotes
			this.comboLote = new Ext.form.ComboBox({
				 fieldLabel		: 'Lote'		
				,xtype			: 'combo'
				,hiddenName		: 'lote_codigo'	
				,triggerAction	: 'all'
				,valueField		: 'lote_codigo'
				,displayField	: 'lote_desc'
				,emptyText		: 'Selecione um lote'
				,allowBlank		: true
				,readOnly       : false
				,editable       : false
				,store			: new Ext.data.JsonStore({
					 url		: 'lote/todo'
					,baseParams	: {
						 action	: 'todo'
						,limit	: 30
					}
					,fields:[
						 {name: 'lote_codigo', type:'string'}
						,{name: 'lote_desc'  , type:'string'}
					]
				})
			})
			
			//combo das quadras
			this.comboQuadra = new Ext.form.ComboBox({
				 fieldLabel		: 'Quadra'		
				,xtype			: 'combo'
				,hiddenName		: 'quadra_codigo'	
				,triggerAction	: 'all'
				,valueField		: 'quadra_codigo'
				,displayField	: 'quadra_desc'
				,emptyText		: 'Selecione uma quadra'
				,allowBlank		: true
				,readOnly       : false
				,editable       : false
				,store			: new Ext.data.JsonStore({
					 url		: 'quadra/todo'
					,baseParams	: {
						 action	: 'todo'
						,limit	: 30
					}
					,fields:[
						 {name: 'quadra_codigo', type:'string'}
						,{name: 'quadra_desc'  , type:'string'}
					]
				})
			})
			
			//combo de alameda
			this.comboAlameda = new Ext.form.ComboBox({
				 fieldLabel		: 'Alameda'		
				,xtype			: 'combo'
				,hiddenName		: 'alameda_codigo'	
				,triggerAction	: 'all'
				,valueField		: 'alameda_codigo'
				,displayField	: 'alameda_desc'
				,emptyText		: 'Selecione uma alameda'
				,allowBlank		: true
				,readOnly       : false
				,editable       : false
				,store			: new Ext.data.JsonStore({
					 url		: 'alameda/todo'
					,baseParams	: {
						 action	: 'todo'
						,limit	: 30
					}
					,fields:[
						 {name: 'alameda_codigo', type:'string'}
						,{name: 'alameda_desc'  , type:'string'}
					]
				})
			})

			//combo do tipo de terreno
			this.comboTpterreno = new Ext.form.ComboBox({
				 fieldLabel		: 'Tipo do terreno'		
				,xtype			: 'combo'
				,hiddenName		: 'tpterreno_id'	
				,triggerAction	: 'all'
				,valueField		: 'tpterreno_id'
				,displayField	: 'tpterreno_desc'
				,emptyText		: 'Selecione um tipo de terreno'
				,allowBlank		: true
				,readOnly       : false
				,editable       : false
				,store			: new Ext.data.JsonStore({
					 url		: 'tpterreno/todo'
					,baseParams	: {
						 action	: 'todo'
						,limit	: 30
					}
					,fields:[
						 {name: 'tpterreno_id'   , type:'string'}
						,{name: 'tpterreno_desc' , type:'string'}
					]
				})
			})
			
			//combo do tipo de jazigo
			this.comboTpjazigo = new Ext.form.ComboBox({
				 fieldLabel		: 'Tipo do jazigo'		
				,xtype			: 'combo'
				,hiddenName		: 'tpjazigo_id'	
				,triggerAction	: 'all'
				,valueField		: 'tpjazigo_id'
				,displayField	: 'tpjazigo_desc'
				,emptyText		: 'Selecione um tipo de jazigo'
				,allowBlank		: true
				,readOnly       : false
				,editable       : false
				,store			: new Ext.data.JsonStore({
					 url		: 'tpjazigo/todo'
					,baseParams	: {
						 action	: 'todo'
						,limit	: 30
					}
					,fields:[
						 {name: 'tpjazigo_id'   , type:'string'}
						,{name: 'tpjazigo_desc' , type:'string'}
					]
				})
			})
			
			
			//formul�rio	
			this.formPanel = new Ext.form.FormPanel({
				 bodyStyle	: 'padding:10px;'
				,border		: false
				,autoScroll	: true
				,defaultType: 'textfield'
				,id         : 'frmJazigo'	
				,defaults	: {
					anchor: '-2' 	//anchor � um config. option. excelente para formul�rio. Ele define larguras relativas
									//nesse caso a largura total -19px, que reservei para scroll
				}
				,items:[{					
					xtype       : 'textfield'
				   ,fieldLabel  : 'Identificador'
				   ,name	    : 'jazigo_id'
				   ,disabled    : true
			   	   ,allowBlank  : true
			   	   ,maxLength   : 10
				   ,width		: '60%'
				   ,anchor      : '60%'		   	   
				},{	
					 xtype      : 'textfield'
					,fieldLabel	: 'Código'
					,name		: 'jazigo_codigo'
					,allowBlank	: false					
					,maxLength	: 20
					,width		: '60%'
					,anchor     : '60%'				
				},{
					 xtype      : 'textfield'
					,fieldLabel	: 'Descrição'
					,name		: 'jazigo_desc'
					,allowBlank	: false
					,width		: '20%'					 
					,maxLength	: 60
				}
				,this.comboCemiterio
				,this.comboLote
				,this.comboQuadra
				,this.comboAlameda
				,this.comboTpterreno
				,this.comboTpjazigo,{
					 xtype      : 'masktextfield'
					,fieldLabel : 'Valor'
					,name		: 'jazigo_valor'
					,allowBlank	: true					
					,mask       : '9.999.990,00'
					,money      : true	
					,width		: '20%'
					,anchor     : '40%'                
				},{
					 xtype      : 'numberfield'
					,fieldLabel : 'N.Gavetas'
					,name		: 'jazigo_gaveta'
					,allowBlank	: true
					,width		: '20%'
					,anchor     : '40%'				
					
				},{
					 xtype      : 'checkbox'							
		 			,name       : 'jazigo_incobranca'
		 			,fieldLabel	: 'Gera cobrança?'
 				    ,autoWidth  : true
				    ,allowBlank : true
				    ,inputValue : '1'
				}]
			})
			
			Ext.apply(this,{
				 items	: this.formPanel
				,bbar	: ['->',{					
					 text   : 'Novo'
					,iconCls: 'silk-add'
					,scope  : this
					,handler: function(){
						this.formPanel.getForm().reset();
						this.formPanel.items.item(0).focus();
						this.jazigoID = 0;
					}					
				},{
					 text	: 'Salvar'
					,iconCls: 'icon-save'
					,scope	: this
					,handler: this._onBtnSalvarClick
				},
				this.btnExcluir = new Ext.Button({
					 text	  : 'Excluir'
					,iconCls  : 'silk-delete'
					,scope	  : this
					,disabled : true
					,handler  : this._onBtnDeleteClick
				})
				,{xtype:'tbseparator'},{
					 text	: 'Sair'
					,iconCls: 'silk-cross'
					,scope	: this
					,handler: function(){
						this.hide();
					}
				}]
			})
			
			//super
			cadjazigo.superclass.initComponent.call(this);
		}
		,show: function()
		{
			cadjazigo.superclass.show.apply(this,arguments);
			if(this.jazigoID !== 0) {				
				this.btnExcluir.show();			
				this.el.mask('Carregando informações..');
				this.formPanel.getForm().load({
					 url     : 'jazigo/buscar'
					,params  : {						
						 action    : 'buscar'
						,jazigo_id : this.jazigoID						
					}
				    ,scope   : this
				    ,success : this._onFormLoad
				});				
			}else{
				this.btnExcluir.hide();
				this.formPanel.getForm().reset();				
			}			
		}
		,onDestroy: function()
		{
			cadjazigo.superclass.onDestroy.apply(this,arguments);			
			this.formPanel = null;
		}	
		,_onFormLoad: function(form, request)
		{
			var data = request.result.data;
			
			if(data.cemiterio_id){
				this.comboCemiterio.setValue(data.cemiterio_id);
				this.comboCemiterio.setRawValue(data.cemiterio_desc);
			}
			if(data.lote_codigo){
				this.comboLote.setValue(data.lote_codigo);
				this.comboLote.setRawValue(data.lote_desc);
			}		
			if(data.quadra_codigo){
				this.comboQuadra.setValue(data.quadra_codigo);
				this.comboQuadra.setRawValue(data.quadra_desc);
			}		
			if(data.alameda_codigo){
				this.comboAlameda.setValue(data.alameda_codigo);
				this.comboAlameda.setRawValue(data.alameda_desc);
			}		
			if(data.tpterreno_id){
				this.comboTpterreno.setValue(data.tpterreno_id);
				this.comboTpterreno.setRawValue(data.tpterreno_desc);
			}
			if(data.tpjazigo_id){
				this.comboTpjazigo.setValue(data.tpjazigo_id);
				this.comboTpjazigo.setRawValue(data.tpjazigo_desc);
			}
			this.el.unmask();			
		}		
		,_onBtnSalvarClick: function()
		{
			//pego o formul�rio
			var form = this.formPanel.getForm();
			
			//verifico se � valido
			if(!form.isValid())	
			{
				Ext.Msg.alert('Atenção','Preencha corretamente todos os campos!');
				return false;
			}
			
			//crio uma m�scara
			this.el.mask('Salvando informações');
			
			/*
			 * Submitando formul�rio
			 */
			form.submit({
				 url	: 'jazigo/salvar'
				,params	: {
					 action	    : 'salvar'
					,jazigo_id	: this.jazigoID
				}
				,scope:this
				,success: function(f,a) //ao terminar de submitar
				{
					//tir� m�scara
					this.el.unmask();
					
					Ext.getCmp('frmJazigo').getForm().findField('jazigo_id').setValue(a.result.id);
					this.jazigoID = a.result.id;
					this.fireEvent('salvar',this);
				}
			});
		}		
		,_onBtnDeleteClick: function()
		{
			Ext.Msg.confirm('Confirmação','Deseja mesmo excluir esse registro?',function(opt) {
				if(opt === 'no') {
					return					
				}
				this.el.mask('Excluir');
				
				Ext.Ajax.request({
					 url	: 'jazigo/excluir'
					,params	: {
						 action	   : 'excluir'
					    ,jazigo_id : this.jazigoID
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
});