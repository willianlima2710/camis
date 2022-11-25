var conhistmov = new Ext.extend(Ext.Panel,{	
    title         : 'Historico de movimentação' 
   ,border        : true
   ,frame         : false   
   ,collapsible   : false
   ,layout        : 'form'
   ,labelAlign    : 'left'	   
   ,labelWidth    : 90
   
   ,initComponent: function(){
	     
		var txtbusca = '';
		var txtfield = '';
		
		//combo dos campos de pesquisa
		this.comboFld = new Ext.form.ComboBox({	
			 xtype			: 'combo'
			,fieldLabel     : 'Filtrar'	 
			,hiddenName		: 'fld'				
			,triggerAction	: 'all'
			,valueField		: 'id'
			,displayField	: 'field'
			,emptyText		: 'Selecione'
			,allowBlank		: false
            ,selecOnFocus   : true
            ,forceSelection : true				
			,editable       : false
			,autocomplete   : true
			,typeAhead      : true
			,mode           : 'local'
		    ,store          : new Ext.data.ArrayStore({
		    	id     : 'locatario_desc'
			   ,fields : ['id','field']
			   ,data   : [['locatario_desc','Locatario'],
			              ['obito_falecido','Falecido'],
			              ['jazigo_codigo','Jazigo']]
		    })			
		})
		
		// campo de pesquisa
		this.txtSrch = new Ext.form.TextField({
			type       : 'textfield'
		   ,minLength  : 1
		   ,scope	   : this
		   ,store      : this.store
		   ,allowBlank : false
		   ,width 	   : 300
		   ,fireKey: function(e){				   
			   if (e.getKey()==e.ENTER){
				   txtbusca = this.scope.txtSrch.getValue(); 
				   txtfield = this.scope.comboFld.getValue(); 
				   if(txtbusca.length>1){
					   this.scope.store.reload({
						   params: {
							   value : txtbusca
							  ,field : txtfield
						   }
					   });
				   }
			    }				   
		    }				
		});
	   
	   this.formPanel = new Ext.form.FormPanel({		   
		   bodyStyle	: 'padding:10px;'
		  ,border		: false
		  ,id           : 'frmRelate01'
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
	         ,items      : [
                 this.comboFld
             ]}
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
       
	   conhistmov.superclass.initComponent.apply(this, arguments);
   }
   ,show: function()
   {	   
	   conhistmov.superclass.show.apply(this,arguments);
   }
   ,_onDestroy: function()
   {
	   conhistmov.superclass.onDestroy.apply(this,arguments);			
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
           ,url           : 'conhistmov/analitico'
           ,params        : {
        	   inordem : this.comboOrdem.getValue()
           }        	   
           ,success       : function(f,a) {        	   
        	   var p = new Ext.ux.MediaWindow({       		      
        		   title        : 'RELATÓRIO DE OBITOS - ANALITICO' 	   
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
Ext.reg('e-conhistmov',conhistmov);