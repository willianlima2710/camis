var relcad01 = new Ext.extend(Ext.Panel,{	
    title         : 'Relatório de jazigos' 
   ,border        : true
   ,frame         : true   
   ,collapsible   : false
   ,layout        : 'form'
   ,labelAlign    : 'left'	   
   ,labelWidth    : 90
   
   ,initComponent: function(){
	   
		//combo dos cemiterios
		this.comboCemiterio = new Ext.form.ComboBox({
			 fieldLabel		: 'Cemiterio'		
			,xtype			: 'combo'
			,hiddenName		: 'cemiterio_id'	
			,triggerAction	: 'all'
			,valueField		: 'cemiterio_id'
			,displayField	: 'cemiterio_desc'
			,emptyText		: 'Selecione um cemiterio'
			,allowBlank		: false
			,readOnly       : false
			,editable       : false
			,width		    : '50%'
			,anchor         : '50%'
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
			,width		    : '50%'
			,anchor         : '50%'			
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
			,width		    : '50%'
			,anchor         : '50%'			
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
			,width		    : '50%'
			,anchor         : '50%'			
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
			,width		    : '50%'
			,anchor         : '50%'			
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
			,width		    : '50%'
			,anchor         : '50%'			
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
		
	  this.comboOrdem = new Ext.form.ComboBox({
		  name        : 'rel_ordem'
	 	 ,fieldLabel  : 'Ordernar por'	
	     ,allowBlank  : false
		 ,readOnly    : false
	  	 ,editable    : false
		 ,store       : new Ext.data.ArrayStore({
			 fields : ['field','ordem']
		    ,data   : [['jazigo_codigo', 'Jazigo'],
			           ['cemiterio_id', 'Cemiterio'],
			           ['lote_codigo', 'Lote'],
			           ['quadra_codigo', 'Quadra'],
			           ['tpterreno_id', 'Tipo de terreno'],
			           ['tpjazigo_id', 'Tipo de jazigo'],			            
			           ['jazigo_disponivel', 'Disponivel']] 
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
		  ,id           : 'frmRelcad01'
		  ,autoScroll	: true
		  ,defaultType: 'textfield'
		  ,defaults	: {
			  anchor: '-19'    //anchor é um config. option. excelente para formulário. Ele define larguras relativas
				  			  //nesse caso a largura total -19px, que reservei para scroll
		  }
		  ,items:[{
			  xtype      : 'fieldset'
             ,title      : 'Geral'
	         ,autoHeight : true			 
	         ,items      : [
	           this.comboCemiterio
	          ,this.comboLote
	          ,this.comboQuadra 
	          ,this.comboAlameda
	          ,this.comboTpterreno
	          ,this.comboTpjazigo
	          ,this.comboOrdem
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
       
	   relcad01.superclass.initComponent.apply(this, arguments);
   }
   ,show: function()
   {	   
	   relcad01.superclass.show.apply(this,arguments);
   }
   ,_onDestroy: function()
   {
	   relcad01.superclass.onDestroy.apply(this,arguments);			
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
           ,url           : 'relcad01/analitico'
           ,params        : {
        	   inordem : this.comboOrdem.getValue()
           }       	   
           ,success       : function(f,a) {
        	   
        	   var p = new Ext.ux.MediaWindow({       		      
        		   title        : 'RELATÓRIO DE JAZIGOS - ANALITICO' 	   
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
Ext.reg('e-relcad01',relcad01);