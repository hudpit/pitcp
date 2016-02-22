/**
 * The Main Viewport. This occupies the entire browser window, and {@link PIT_CP.view.Main} 
 * sits inside this
 */
Ext.define('PIT_CP.view.Viewport', {
    extend: 'Ext.container.Viewport',
    requires:[
        'Ext.layout.container.Fit',
        'PIT_CP.view.Main'
    ],

    layout: {
        type: 'fit'
    },

    items: [{
        xtype: 'mainview'
    }]
});
