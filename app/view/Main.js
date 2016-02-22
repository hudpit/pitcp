/**
 * ##Overview
 * This is the main view that all other views will be rendered within. This view
 * takes up the entire browser viewport and is broken into the following 
 * 4 sections:
 * 
 * - **North:** Holds the header panel with the "Logout" button
 * - **West:** Contains the navigation menu
 * - **Center:** This is where the active sub-view will be rendered
 * - **South:** The footer panel, where the version number is currently displayed
 */
Ext.define('PIT_CP.view.Main', {
    extend: 'Ext.container.Container',
    requires:[
        'Ext.tree.Panel',
        'Ext.layout.container.Border',
        'Ext.data.TreeStore',
        'Ext.form.Label'
    ],
    
    alias: 'widget.mainview',

    layout: {
        type: 'border'
    },

    items: [{
        region:'north',
        height:95,
        itemId:'topBar',
        xtype:'toolbar',
        cls:'topbar',
        items:[{
            xtype:'label',
            html:'<a class="logo"></a><h1>Point in Time Control Panel</h1>'
        },
        '->',
        {
            xtype:'button',
            action:'logout',
            text:'Logout',
            ui:'bootstrap-danger'
        }]
    },{
        region: 'west',
        itemId:'nav',
        title:'Navigation',
        xtype: 'treepanel',
        style:'border-right: solid 2px',
        width: 250,
        store: 'NavStore',
        rootVisible:false
    },{
        region: 'center',
        xtype: 'container',
        itemId:'mainContainer',
        layout:'fit',
        defaults:{
            hidden:true
        },
        items:[
            {xtype:'projects'},
            {xtype:'datastores'},
            {xtype:'profile'}
        ]
    },{
        region:'south',
        height:30,
        itemId:'bottomBar',
        xtype:'toolbar',
        ui:'border',
        border:'2 0 0 0',
        tpl:'v{number}'
    }]
});