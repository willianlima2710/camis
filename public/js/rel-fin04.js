var relfin04 = new Ext.extend(Ext.Panel,{	
    title         : 'Relatório DRE' 
   ,border        : true
   ,frame         : true   
   ,collapsible   : false
   ,layout        : 'form'
   ,labelAlign    : 'left'	   
   ,labelWidth    : 90
   
   ,initComponent: function()
   {	   
		this.comboBanco = new Ext.form.ComboBox({
			 fieldLabel		: 'Banco'
			,xtype			: 'combo'
			,hiddenName		: 'banco_id'	
			,triggerAction	: 'all'
			,valueField		: 'banco_id'
			,displayField	: 'banco_desc'
			,emptyText		: 'Selecione um banco'
			,readOnly       : false
			,editable       : false
		    ,width          : '50%'
		    ,anchor         : '50%'
	    	,allowBlank : false	
			,store			: new Ext.data.JsonStore({
				 url		: 'banco/todo'
				,baseParams	: {
					 action	: 'todo'
					,limit	: 30
				}
				,fields:[
					 {name: 'banco_id'   , type:'int'}
					,{name: 'banco_desc' , type:'string'}
				]
			})
		});
	   
		//combo das contas do caixa
		this.comboConta = new Ext.form.ComboBox({
			 fieldLabel		: 'Conta'
			,xtype			: 'combo'
			,hiddenName		: 'conta_id'	
			,triggerAction	: 'all'
			,valueField		: 'conta_id'
			,displayField	: 'conta_desc'
			,emptyText		: 'Selecione uma conta'
			,readOnly       : false
			,editable       : false
		    ,width          : '50%'
		    ,anchor         : '50%'				
			,store			: new Ext.data.JsonStore({
				 url		: 'conta/todo'
				,baseParams	: {
					 action	: 'todo'
					,limit	: 30
				}
				,fields:[
					 {name: 'conta_id'   , type:'int'}
					,{name: 'conta_desc' , type:'string'}
				]
			})
		});
	   
	   this.formPanel = new Ext.form.FormPanel({		   
		   bodyStyle	: 'padding:10px;'
		  ,border		: false
		  ,id           : 'frmRelfin04'
		  ,autoScroll	: true
		  ,defaultType: 'textfield'
		  ,defaults	: {
			  anchor: '-19'    //anchor é um config. option. excelente para formulário. Ele define larguras relativas
				  			  //nesse caso a largura total -19px, que reservei para scroll
		  }
		  ,items:[{
			  xtype      : 'fieldset'
             ,title      : 'Periodo'
	         ,autoHeight : true			 
	         ,items      : [{
	        	 xtype      : 'datefield'
                ,fieldLabel : 'Data inicial'
	            ,name		: 'caixa_data_movto_ini'			    	 
	            ,allowBlank : false
                ,maxLength  : 10
	            ,format     : 'd/m/Y'
 	            ,value      : new Date()
	            ,altFormats : 'd/m/Y|j/n/Y|j/n/y|j/m/y|d/n/y|j/m/Y|d/m/Y|d-m-y|d-m-Y|d/m|d-m|dm|dmy|dmY|d|d-m-Y'
             },{
            	 xtype      : 'datefield'
                ,fieldLabel : 'Data final'
	            ,name		: 'caixa_data_movto_fim'
	            ,allowBlank : false
	            ,maxLength  : 10
	            ,format     : 'd/m/Y'  
 	            ,value      : new Date() 	 
	            ,altFormats : 'd/m/Y|j/n/Y|j/n/y|j/m/y|d/n/y|j/m/Y|d/m/Y|d-m-y|d-m-Y|d/m|d-m|dm|dmy|dmY|d|d-m-Y'
             }
             ,this.comboBanco
             ,this.comboConta]
		  }]		  
	   });
	   
	   Ext.apply(this,{
		    items      : this.formPanel
	       ,bbar	   : [{
	    	   text    : 'Imrpimir'
	      	  ,iconCls : 'ico_printer'
			  ,scope   : this
			  ,handler : this._onBtnImprimirClick
		   }]
	   });
       
	   relfin04.superclass.initComponent.apply(this, arguments);
   }
   ,show: function()
   {	   
	   relfin04.superclass.show.apply(this,arguments);
	   Ext.getCmp('frmRelfin04').getForm().findField('caixa_data_movto_ini').focus();
   }
   ,_onDestroy: function()
   {
	   relfin04.superclass.onDestroy.apply(this,arguments);			
	   this.formPanel = null;
   }   
   ,_onFormLoad: function(form, request)
   {	   
   }
   ,_onBtnImprimirClick: function()
   {
	   var form = this.formPanel.getForm();
	   
	   //verifico se é valido
	   if(!form.isValid())	
	   {
		   Ext.Msg.alert('Atenção','Preencha corretamente todos os campos!');
		   return false;
	   }
	   
       form.submit({
    		waitMsgTarget : false	
  	       ,waitTitle     : 'Por favor aguarde'
		   ,waitMsg       : 'Gerando relatorio...'
		   ,reset         : false       	
           ,url           : 'relfin04/sintetico'
           ,params        : {        	   
           }     	   
           ,success       : function(f,a) {
        	   
        	   var p = new Ext.ux.MediaWindow({       		      
        		   title        : 'RELATÓRIO DRE' 	   
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
Ext.reg('e-relfin04',relfin04);