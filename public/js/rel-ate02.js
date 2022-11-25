var relate02 = new Ext.extend(Ext.Panel,{	
    title         : 'Relatório de vendas' 
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
					  Ext.getCmp('frmRelate02').getForm().findField('locatario_id').setValue(combo.getValue());				  				 
			  	  }
			  }        		   
		  }		   
	   });
	   
	   //store do jazigo
	   this.storeJazigo = new Ext.data.JsonStore({
			 url			: 'jazigo/autocomplete'
			,root			: 'rows'
			,idProperty		: 'jazigo_codigo'					
			,autoLoad		: true
			,autoDestroy	: true
			,remoteSort     : true
			,baseParams		: {
				 action	: 'jazigo/autocomplete'
				,limit	: 30
			}				
			,fields:[
				 {name:'jazigo_codigo' ,type:'string'}
				,{name:'jazigo_desc'   ,type:'string'}
			]
		});
	   
	    this.comboJazigo =  new Ext.form.ComboBox({
		   store        : this.storeJazigo
		  ,name         : 'jazigo_codigo'  
		  ,fieldLabel   : 'Jazigo'
		  ,displayField : 'jazigo_codigo'
		  ,valueField	: 'jazigo_codigo'	
		  ,loadingText  : 'Carregando...'				 
		  ,queryParam   : 'value'
		  ,width        : '20%'
		  ,anchor       : '20%'
		  ,autocomplete : 'on'	   
	   });
	    
	   this.comboOrdem = new Ext.form.ComboBox({
		   name        : 'rel_ordem'
		  ,fieldLabel  : 'Ordernar por'	
		  ,allowBlank  : false
		  ,readOnly    : false
		  ,editable    : false
		  ,store       : new Ext.data.ArrayStore({
			  fields : ['field','ordem']
			 ,data   : [['jazigo_codigo', 'Jazigo'],
			            ['venda_id', 'Numero'],
				        ['venda_data', 'Data'],
				        ['venda_documento', 'Documento'],
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
       this.comboOrdem.setValue('jazigo_codigo');
	   
	   this.formPanel = new Ext.form.FormPanel({		   
		   bodyStyle	: 'padding:10px;'
		  ,border		: false
		  ,id           : 'frmRelate02'
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
             }]},{
            	 xtype      : 'fieldset'
	            ,title      : 'Outros'
		        ,autoHeight : true			 
		        ,items      : [this.comboJazigo,this.comboOrdem]
             }
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
       
	   relate02.superclass.initComponent.apply(this, arguments);
   }
   ,show: function()
   {	   
	   relate02.superclass.show.apply(this,arguments);
	   Ext.getCmp('frmRelate02').getForm().findField('data_inicial').focus();
   }
   ,_onDestroy: function()
   {
	   relate02.superclass.onDestroy.apply(this,arguments);			
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
           ,url           : 'relate02/analitico'
           ,params        : {
        	   inordem : this.comboOrdem.getValue()
           }     	   
           ,success       : function(f,a) {        	   
        	   var p = new Ext.ux.MediaWindow({       		      
        		   title        : 'RELATÓRIO DE VENDAS - ANALITICO' 	   
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
Ext.reg('e-relate02',relate02);