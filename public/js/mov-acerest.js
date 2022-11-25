var movacerest = Ext.extend(Ext.Window,{		
		 acerestID  : 0
		,width      : 505
		,height     : 160
		,closable   : false
		,hidden     : false
		,draggable  : true
		,closeAction: 'hide'
		,constrain  : true
		,maximizable: true
        ,layout: {
        	type: 'vbox',
			align: 'center'
		}
		,constructor: function()
		{
			this.addEvents({
				 salvar	: true
				,excluir: true
			});

			//super
			movacerest.superclass.constructor.apply(this, arguments);
		}		
		,initComponent: function()
		{			
			
			/* 
			 * Campos de objeto do formulario cadastro
			 */
			this.textacerestprod_quantidade = new Ext.form.TextField({				
				xtype            : 'numberfield'
  			   ,fieldLabel       : 'Quantidade'
			   ,name	         : 'acerest_quantidade'
			   ,DecimalPrecision : 3	   
			   ,allowBlank       : true
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
				   		 this.textacerestprod_quantidade.setValue(1);
			  	  	   }        		   
			  	  }	   
			   }
			});			

			// Tipo da pessoa( Fisica ou Juridica )
	    	this.comboTipo = new Ext.form.ComboBox({
	    		fieldLabel	  : 'Tipo'		
			   ,hiddenName	  : 'acerest_intipo'	
			   ,triggerAction : 'all'
			   ,typeAhead     : true	
  			   ,mode          : 'local'					
			   ,valueField	  : 'id'
			   ,displayField  : 'field'
			   ,emptyText	  : 'Selecione o tipo'
			   ,allowBlank	  : false
			   ,readOnly      : false
			   ,editable      : false
			   ,width	      : 90
			   ,store		  : new Ext.data.ArrayStore({
				   fields : ['id','field']
				  ,data   : [['0', 'ENTRADA'],['1', 'SAIDA']] 
			   })
	    	   ,col           : true
	    	})
			this.comboTipo.setValue('0');
			
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
			           this.comboProdserv
				      ,this.textacerestprod_quantidade
				      ,this.comboTipo
				   ]
				}]
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
			movacerest.superclass.initComponent.call(this);
		}
		,initEvents: function()
		{			
			movacerest.superclass.initEvents.call(this);			
		}		
		,show: function()
		{			
			movacerest.superclass.show.apply(this,arguments);
			this.formCadastro.getForm().reset();
		}
		,onDestroy: function()
		{
			movacerest.superclass.onDestroy.apply(this,arguments);
			this.formCadastro = null;
		}		
		,_onFormLoad: function(form, request)
		{
			this.el.unmask();			
		}	
		,_onBtnNovoClick: function()
		{
			this.formCadastro.getForm().reset();
			this.btnSalvar.setDisabled(false);			
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
			
			//crio uma máscara
			this.el.mask('Salvando informações');			
			
			/*
			 * Submitando formulário
			 */
			form.submit({
				 url	: 'acerest/salvar'
				,params	: {					
					action        : 'salvar'
				   ,prodserv_id   : this.comboProdserv.getValue()
				   ,prodserv_desc : this.comboProdserv.getRawValue()
				}
				,scope:this
				,success: function(f,a) //ao terminar de submitar
				{
					//tirá máscara
					this.el.unmask();
					Ext.Msg.alert('Atencao','Atualização realizada com sucesso!');
					this.destroy();					
				}
				,failure: function(f,a)
				{
					Ext.Msg.alert('Atenção','Erro na gravação da acerest,contate o suporte técnico!');
				}
			});
		}
});
Ext.reg('e-movacerest',movacerest);