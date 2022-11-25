var relfin03 = new Ext.extend(Ext.Panel,{	
    title         : 'Relatório de fluxo de caixa' 
   ,border        : true
   ,frame         : true   
   ,collapsible   : false
   ,layout        : 'form'
   ,labelAlign    : 'left'	   
   ,labelWidth    : 90
   
   ,initComponent: function(){
	   
	   //combo de operações cemiteriais
	   this.comboOperacao = new Ext.form.ComboBox({
			 fieldLabel		: 'Operação'
			,xtype			: 'combo'
    	    ,idProperty	    : 'operacao_id'		
			,hiddenName		: 'operacao_id'	
			,triggerAction	: 'all'
			,valueField		: 'operacao_id'
			,displayField	: 'operacao_desc'
			,emptyText		: 'Selecione uma operação'
			,allowBlank		: true
			,readOnly       : false
			,editable       : false
		    ,width          : 350
			,store			: new Ext.data.JsonStore({
				 url		: 'operacao/todo'
				,baseParams	: {
					 action	: 'todo'
					,limit	: 30
				}
				,fields:[
					 {name: 'operacao_id'        ,type:'int'}
					,{name: 'operacao_desc'      ,type:'string'}
					,{name: 'operacao_infaturar' ,type:'int'}						
				]
			})
	   })

	   this.comboOrdem = new Ext.form.ComboBox({		   
		   name        : 'rel_ordem'
 	      ,fieldLabel  : 'Ordernar por'	
		  ,allowBlank  : false
		  ,readOnly    : false
  	      ,editable    : false
		  ,store       : new Ext.data.ArrayStore({			  
			  fields : ['field','ordem']
			 ,data   : [['jazigo_codigo', 'Jazigo'],
			            ['caixa_documento', 'Documento'],
			            ['caixa_data_movto', 'Movimento'],
			            ['caixa_data_vencto', 'Vencimento'],
			            ['caixa_data_pagto', 'Pagamento'],
			            ['locfor_desc', 'Locatario']] 
		  })
		  ,valueField     : 'field'
		  ,displayField   : 'ordem'
		  ,typeAhead      : true	
		  ,mode           : 'local'	
		  ,width	      : '20%'	
		  ,anchor         : '20%'						   
		  ,triggerAction  : 'all'				
	   }); 
	   this.comboOrdem.setValue('caixa_data_movto');
	   
	   this.formPanel = new Ext.form.FormPanel({		   
		   bodyStyle	: 'padding:10px;'
		  ,border		: false
		  ,id           : 'frmRelfin03'
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
	            ,name		: 'data_inicial'			    	 
	            ,allowBlank : false
                ,maxLength  : 10
	            ,format     : 'd/m/Y'
 	            ,value      : new Date()
	            ,altFormats : 'd/m/Y|j/n/Y|j/n/y|j/m/y|d/n/y|j/m/Y|d/m/Y|d-m-y|d-m-Y|d/m|d-m|dm|dmy|dmY|d|d-m-Y'
             },{
            	 xtype      : 'datefield'
                ,fieldLabel : 'Data final'
	            ,name		: 'data_final'
	            ,allowBlank : false
	            ,maxLength  : 10
	            ,format     : 'd/m/Y'  
 	            ,value      : new Date() 	 
	            ,altFormats : 'd/m/Y|j/n/Y|j/n/y|j/m/y|d/n/y|j/m/Y|d/m/Y|d-m-y|d-m-Y|d/m|d-m|dm|dmy|dmY|d|d-m-Y'
             },this.comboOperacao]},{
            	 xtype      : 'fieldset'
	            ,title      : 'Outros'
		        ,autoHeight : true			 
		        ,items      : [{
		        	xtype      : 'radiogroup'
                   ,fieldLabel : 'Por data de'
                   ,items      : [
                       {boxLabel: 'Movimento',  name: 'rb-data', inputValue: 0}
                      ,{boxLabel: 'Vencimento', name: 'rb-data', inputValue: 1, checked: true}
                      ,{boxLabel: 'Conciliação',name: 'rb-data', inputValue: 2}
                   ]
             },{
            	 xtype      : 'radiogroup'
                ,fieldLabel : 'Tipo'
                ,items      : [
                    {boxLabel: 'Receber', name: 'rb-tipo', inputValue: 0}
                   ,{boxLabel: 'Pagar',   name: 'rb-tipo', inputValue: 1}
                   ,{boxLabel: 'Ambos',   name: 'rb-tipo', inputValue: 2, checked: true}
                ]	        	  
             },this.comboOrdem]}
          ]		  
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
       
	   relfin03.superclass.initComponent.apply(this, arguments);
   }
   ,show: function()
   {	   
	   relfin03.superclass.show.apply(this,arguments);
	   Ext.getCmp('frmRelfin03').getForm().findField('data_inicial').focus();
   }
   ,_onDestroy: function()
   {
	   relfin03.superclass.onDestroy.apply(this,arguments);			
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
           ,url           : 'relfin03/analitico'
           ,params        : {
        	   inordem : this.comboOrdem.getValue()
           }     	   
           ,success       : function(f,a) {
        	   
        	   var p = new Ext.ux.MediaWindow({       		      
        		   title        : 'RELATÓRIO DE FLUXO DE CAIXA - ANALITICO' 	   
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
Ext.reg('e-relfin03',relfin03);