var reletq01 = new Ext.extend(Ext.Panel,{	
    title         : 'Relatório de estoque'
   ,border        : true
   ,frame         : true   
   ,collapsible   : false
   ,layout        : 'form'
   ,labelAlign    : 'left'	   
   ,labelWidth    : 90
   
   ,initComponent: function() 
   {
	   this.formPanel = new Ext.form.FormPanel({		   
		   bodyStyle	: 'padding:10px;'
		  ,border		: false
		  ,id           : 'frmreletq01'
		  ,autoScroll	: true
		  ,defaultType: 'textfield'
		  ,defaults	: {
			  anchor: '-19'    //anchor � um config. option. excelente para formul�rio. Ele define larguras relativas
				  			  //nesse caso a largura total -19px, que reservei para scroll
		  }
		  ,items:[{
			  xtype      : 'fieldset'
             ,title      : 'Produto'
	         ,autoHeight : true			 
	         ,items      : [{
	        	 xtype      : 'textfield'
                ,fieldLabel : 'Inicial'
	            ,name		: 'prod_inicial'			    	 
	            ,allowBlank : false
				,maxLength  : 10
				,value      : '1'
             },{
            	 xtype      : 'textfield'
                ,fieldLabel : 'Final'
	            ,name		: 'prod_final'
	            ,allowBlank : false
				,maxLength  : 10
				,value      : '9999'
			 }]	 
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
       
	   reletq01.superclass.initComponent.apply(this, arguments);
   }
   ,show: function()
   {	   
	   reletq01.superclass.show.apply(this,arguments);
   }
   ,_onDestroy: function()
   {
	   reletq01.superclass.onDestroy.apply(this,arguments);			
	   this.formPanel = null;
   }   
   ,_onFormLoad: function(form, request)
   {	   
   }
   ,_onBtnImprimirClick: function()
   {	   
	   var form = this.formPanel.getForm();
	   
	   //verifico se � valido
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
           ,url           : 'prodserv/posestoq'
           ,success       : function(f,a) {        	   
        	   var p = new Ext.ux.MediaWindow({       		      
        		   title        : 'RELATORIO DE POSIÇÃO DO ESTOQUE'
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
Ext.reg('e-reletq01',reletq01);