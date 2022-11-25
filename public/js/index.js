Ext.require.moduleUrl = 'public/js/';

Ext.onReady(function (){
	
    Ext.BLANK_IMAGE_URL = '/framework/ext/resources/images/default/s.gif';
    Ext.QuickTips.init();
    
    var abas_arr = new Array();
    
    var titulo = 'Licenciado para:&nbsp&nbsp'+Ext.util.Cookies.get('empresa').toUpperCase();                      

    function addTab(tabId,tabText,tabUrl,tabX) {
    	abas_arr.push(tabId);
    	myTabs.add({
    		id         : tabId
    	   ,title      : tabText
    	   ,closable   : true
    	   ,bodyStyle  : {padding:10}
    	   ,autoScroll : true
    	   ,xtype      : tabX
    	}).show();
    }
    
    var myTabs = new Ext.TabPanel({    	
    	activeTab       : 0
       ,enableTabScroll : true
       ,border          : false
       ,defaults        : {iconCls: 'ico_windows'}
       ,bodyStyle       : {padding:10}
       ,items: [{
    	   autoScroll : true
    	  ,title      : 'informações'
    	  ,contentEI  : 'informa'
       }]
    });
    
    var MyTree = new Ext.tree.TreePanel({
    	region       : 'west'
       ,id           : 'MyTreePanel'
       ,title        : 'Menu'
       ,margins      : '0 0 0 5'
       ,width        : 210
       ,maxWidth     : 260
       ,minWidth     : 210
       ,collapsible  : true
       ,collapseMode : 'mini'
       ,autoScroll   : true
       ,animate      : true
       ,split        : true    	
       ,loader: new Ext.tree.TreeLoader({    	   
    		dataUrl: 'menu/listar'
       })
       ,root: new Ext.tree.AsyncTreeNode()
       ,rootVisible: false
       ,listeners: {    	   
        	click: function (n) {
        		var sn = this.selModel.selNode || {};
        		if (n.leaf && n.id != sn.id) {
        			var tabId = n.id;
        			var tabTit = n.text;
        			var tabUrl = n.attributes.cls;
        			var tabX = n.attributes.eXtype;
        			
        			if (myTabs.findById(tabId)) {
        				myTabs.setActiveTab(tabId);
        			}else{        				
        				Ext.require(tabUrl,function(){
        					addTab(tabId,tabTit,tabUrl,tabX);
        				});        				
        			}
        		}               			
            }       
       }
       ,tbar: new Ext.Toolbar({
    	   items: [{    		   
    		   text: 'Opções'
        	  ,menu: [{        		  
        		  text    : 'Expandir'
        		 ,handler : function(){
        			 MyTree.expandAll();        			   
        		 }
        	  },{
        		  text    : 'Recolher'
        		 ,handler : function() {
        			 MyTree.collapseAll();        			  
        		 }	   
        	  }]	
        	},'-',{        		
        		text    : 'Fechar Abas'
        	   ,handler : function(){        		   
        			for (i=0;i<abas_arr.length;i++) {
        				myTabs.remove(abas_arr[i]);
        			}
        		}
        	},'-',{
        		text    : 'Sair'
      		   ,iconCls : 'ico-sair'		
        	   ,handler : function() {
        		   window.location = 'login/logout';
        	   } 	
        	}]
        })        
    });
    var myTitulo = {
    		xtype   : 'box'
    	   ,region  : 'north'
    	   ,height  : 30
    	   ,applyTo : 'header'
    };
    
    var barra = new Ext.Toolbar({
    	enableOverflow : true				
       ,autoDestroy    : true
	   ,region         : 'south'
	   ,height         : 25 
	   ,items:[{		   
		   xtype : 'tbfill'
	   },'-',{		   
		   xtype : 'tbtext'
		  ,text  : 'Powered by EmpSoft Informática - Todos direitos reservado'
	   },'-',{		   
		   xtype : 'tbtext'
		  ,text  : 'www.empsoft.com.br'			  
	   },'-',{		   
		   xtype : 'tbtext'
		  ,text  : '(41) 3042-0059'			  
	   },'-',{
		   xtype : 'tbtext'
		  ,text  : 'Usu&aacute;rio:&nbsp&nbsp'+ Ext.util.Cookies.get('nome').toLowerCase()
	   },'-',{
		   xtype : 'tbtext'
  	      ,text  : '00:00:00'	   
		  ,id    : 'lblhora'
	   }]
   });
    
   mostrahora = function(){    	
		thistime= new Date();
		hours=thistime.getHours();
		minutes=thistime.getMinutes();
		seconds=thistime.getSeconds();
		if (eval(hours) < 10) { //>
			hours="0"+hours;
		}
		if (eval(minutes) < 10) { //>
			minutes="0"+minutes;
		}
		if (seconds < 10) { //>
			seconds="0"+seconds;
		}
		thistime = hours+":"+minutes+":"+seconds;	
		Ext.getCmp('lblhora').setText(thistime);
		var timer=setTimeout("mostrahora()",1000);
	}
	var timer=setTimeout("mostrahora()",1000);
    
    new Ext.Viewport({
        layout : 'border',
        items: [myTitulo,MyTree,{
            region  : 'center',
            title   : titulo,
            layout  : 'fit',
            border  : true,
            items   : [myTabs]
           },barra]
    });    
});