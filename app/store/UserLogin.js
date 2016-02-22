/**
 * ##Overview
 * An in-memory store to hold the model of the currently logged-in user.
 */
Ext.define('PIT_CP.store.UserLogin',{
    extend:'Ext.data.Store',
    model:'PIT_CP.model.User',
    autoLoad:false,
    proxy:{
    	type:'memory'
    }
});