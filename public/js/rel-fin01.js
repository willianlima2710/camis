var relfin01 = new Ext.extend(Ext.Panel,{	
    title         : 'Relatório de titulos a receber' 
   ,border        : true
   ,frame         : true   
   ,collapsible   : false
   ,layout        : 'form'
   ,labelAlign    : 'left'	   
   ,labelWidth    : 90
   
   ,initComponent: function(){
	   	   
	   //store do autocomplete do locatario
	   this.storeLocatario = new Ext.data.JsonStore({
			 url			: 'locatario/autocomplete'
			,root			: 'rows'
			,idProperty		: 'locatario_id'					
			,autoLoad		: true
			,autoDestroy	: true
			,remoteSort     : true
			,baseParams		: {
				 action	: 'locatario/autocomplete'
				,limit	: 30
			}				
			,fields:[
				 {name:'locatario_id'	,type:'int'}
				,{name:'locatario_desc' ,type:'string'}
			]
	   });
		
	   this.comboLocatario =  new Ext.form.ComboBox({
		   store        : this.storeLocatario
		  ,name         : 'locatario_desc'  
		  ,fieldLabel   : 'Locatario'
		  ,displayField : 'locatario_desc'
		  ,valueField	: 'locatario_id'	
		  ,loadingText  : 'Carregando...'				 
		  ,queryParam   : 'value'
		  ,width        : '50%'
		  ,anchor       : '50%'
		  ,autocomplete : 'on'	   
		  ,listeners    : {
			  select: {
				  fn: function(combo,value){
					  Ext.getCmp('frmRelfin01').getForm().findField('locatario_id').setValue(combo.getValue());				  				 
			  	  }
			  }        		   
		  }		   
	   });
	   
		//combo dos cartorios
		this.comboUsuario = new Ext.form.ComboBox({
			 fieldLabel		: 'Usuario'		
			,xtype			: 'combo'
			,hiddenName		: 'usuario_id'	
			,triggerAction	: 'all'
			,valueField		: 'usuario_id'
			,displayField	: 'usuario_nome'
			,emptyText		: 'Selecione um usuario'
			,allowBlank		: true
			,readOnly       : false
			,editable       : false
			,width          : '50%'
		    ,anchor         : '50%'
			,store			: new Ext.data.JsonStore({
				 url		: 'usuario/todo'
				,baseParams	: {
					 action	: 'todo'
					,limit	: 30
				}
				,fields:[
					 {name: 'usuario_id'   , type:'int'}
					,{name: 'usuario_nome' , type:'string'}
				]
			})
		})
		
		this.comboFormarec = new Ext.form.ComboBox({
			 fieldLabel		: 'Recebimento'
			,xtype			: 'combo'
    	    ,idProperty	    : 'formarec_id'		
			,hiddenName		: 'formarec_id'	
			,triggerAction	: 'all'
			,valueField		: 'formarec_id'
			,displayField	: 'formarec_desc'
			,emptyText		: 'Selecione uma forma de recebimento'
			,allowBlank		: true
			,readOnly       : false
			,editable       : false
			,width          : '50%'
		    ,anchor         : '50%'
			,store			: new Ext.data.JsonStore({
				 url		: 'formarec/todo'
				,baseParams	: {
					 action	: 'todo'
					,limit	: 30
				}
				,fields:[
					 {name: 'formarec_id'       , type:'int'}
					,{name: 'formarec_desc'     , type:'string'}
					,{name: 'formarec_inavista' , type:'string'}
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
			            ['ctarec_documento', 'Documento'],
			            ['recpar_data_emissao', 'Emissão'],
			            ['recpar_data_vencto', 'Vencimento'],
			            ['recpar_data_pagto', 'Pagamento'],
			            ['locatario_desc', 'Locatario']] 
		  })
		  ,valueField     : 'field'
		  ,displayField   : 'ordem'
		  ,typeAhead      : true	
		  ,mode           : 'local'	
		  ,width	      : '20%'	
		  ,anchor         : '20%'						   
		  ,triggerAction  : 'all'				
	   }); 
	   this.comboOrdem.setValue('recpar_data_emissao');
	   
	   this.formPanel = new Ext.form.FormPanel({		   
		   bodyStyle	: 'padding:10px;'
		  ,border		: false
		  ,id           : 'frmRelfin01'
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
             }
             ,this.comboLocatario,{
            	 xtype      : 'hidden'
			    ,fieldLabel : 'Locatario'
				,name	    : 'locatario_id'
				,allowBlank : false
	  			,width      : '50%'
			    ,anchor     : '50%'  			        		  
				,maxLength  : 30
             }
             ,this.comboUsuario,this.comboFormarec]},{
            	 xtype      : 'fieldset'
	            ,title      : 'Outros'
		        ,autoHeight : true			 
		        ,items      : [{
		        	xtype      : 'radiogroup'
                   ,fieldLabel : 'Por data de'
                   ,items      : [
                       {boxLabel: 'Emissão',    name: 'rb-data', inputValue: 0}
                      ,{boxLabel: 'Vencimento', name: 'rb-data', inputValue: 1, checked: true}
                      ,{boxLabel: 'Pagamento',  name: 'rb-data', inputValue: 2}
                   ]
             },{
            	 xtype      : 'radiogroup'
                ,fieldLabel : 'Status'
                ,items      : [
                    {boxLabel: 'Abertos', name: 'rb-status', inputValue: 0}
                   ,{boxLabel: 'Pagos',   name: 'rb-status', inputValue: 1}
                   ,{boxLabel: 'Ambos',   name: 'rb-status', inputValue: 2, checked: true}
                ]	        	  
             },this.comboOrdem]}
          ]		  
	   });
	   
	   Ext.apply(this,{
		    items      : this.formPanel
	       ,bbar	   : [{	    	   
	    	   text    : 'Exportar para Excel'
	    	  ,iconCls : 'silk-excel'
             ,scope   : this
             ,handler : this._onBtnExcelClick
	       },{
	    	   text    : 'Imrpimir'
	      	  ,iconCls : 'ico_printer'
			  ,scope   : this
			  ,handler : this._onBtnImprimirClick
		   }]
	   });
       
	   relfin01.superclass.initComponent.apply(this, arguments);
   }
   ,show: function()
   {	   
	   relfin01.superclass.show.apply(this,arguments);
	   Ext.getCmp('frmRelfin01').getForm().findField('data_inicial').focus();
   }
   ,onDestroy: function()
   {
	   relfin01.superclass.onDestroy.apply(this,arguments);			
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
           ,url           : 'relfin01/analitico'
           ,params        : {
        	   inordem : this.comboOrdem.getValue()
           }	   
           ,success       : function(f,a) {        	   
        	   var p = new Ext.ux.MediaWindow({       		      
        		   title        : 'RELATÓRIO DE TITULOS A RECEBER - ANALITICO' 	   
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
   ,_onBtnExcelClick: function()
   {
	   var form = this.formPanel.getForm();
	   
	   form.submit({
		   waitMsgTarget : false	
	      ,waitTitle     : 'Por favor aguarde'
		  ,waitMsg       : 'Gerando relatorio...'
		  ,reset         : false       	
	      ,url           : 'relfin01/analiticoexcel'
	      ,params        : {
	    	  inordem : this.comboOrdem.getValue()
	      }	   
	      ,success       : function(f,a) {
	    	  window.open(a.result.link);
		  }	   
	      ,failure: function(f,a){
	    	  Ext.MessageBox.alert('Atenção',a.result.msg.text);
	      }
	   });			
   }
   
});
Ext.reg('e-relfin01',relfin01);