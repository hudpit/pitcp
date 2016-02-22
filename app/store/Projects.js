/**
 * ##Overview
 * A store to hold {@link PIT_CP.model.Project}.
 */
Ext.define('PIT_CP.store.Projects',{
    extend:'Ext.data.Store',
    model:'PIT_CP.model.Project',
    storeId:'ProjectStore',
    autoLoad:false   
});