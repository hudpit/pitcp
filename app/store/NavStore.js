/**
 * ##Overview
 * A {@link Ext.data.TreeStore} to load the navigation view from the server.
 */
Ext.define('PIT_CP.store.NavStore',{
    extend:'Ext.data.TreeStore',
    config:{
        fields:[
            {name:'text', type:'string'},
            {name:'xtype', type:'string'}
        ],
        root:{
            expanded:true,
            text:'Navigation',
            children:[
                {text:'Regions',xtype:'projects',leaf:true,icon:'resources/images/icons/glyphicons_020_home.png'},
                {text:'Datastores',xtype:'datastores',leaf:true, icon:'resources/images/icons/glyphicons_463_server.png'},
                {text:'Profile',xtype:'profile',leaf:true, icon:'resources/images/icons/glyphicons_003_user.png'}
            ]
        }        
    }    
});