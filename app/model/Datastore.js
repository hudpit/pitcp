/**
 * ##Overview
 * The datastore model. A datastore is a publicly accessible application that 
 * will receive the data from the app.
 */
Ext.define('PIT_CP.model.Datastore', {
    extend: 'Ext.data.Model',
    
    fields: [
    	/**
    	 * @property {number} datastore_id Primary Key for the Datastore
    	 */
        { name: 'datastore_id', type: 'int',useNull:true},
        /**
         * @property {string} datastore_title Title of the datastore
         */
        { name: 'datastore_title', type: 'string'},
        /**
         * @property {string} datastore_url The url to send the data to
         */
        { name: 'datastore_url', type: 'string'},
        /**
         * @property {number} user_id The user_id of the user who created it
         * @type {String}
         */
        { name: 'user_id', type: 'int' }

    ],
    idProperty:'datastore_id'
});
