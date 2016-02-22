/**
 * ##Overview
 * The Project model. Note that a Project is another name for a Region.
 *  
 * **Examples:** Boston PIT 2015, NH 2015, etc.
 */
Ext.define('PIT_CP.model.Project', {
    extend: 'Ext.data.Model',
    
    fields: [
        /**
         * @property {number} project_id The primary key of the Project
         */
        { name: 'project_id', type: 'int',useNull:true },
        /**
         * @property {string} project_title The title of the Project
         */
        { name: 'project_title', type: 'string'},
        /**
         * @property {string} setup_key The setup key of the Project. This key 
         * is used to help a user associate themselves to a Project
         */
        { name: 'setup_key', type: 'string' },
        /**
         * @property {number} user_id The id of the {@link PIT_CP.model.User} that 
         * created the Project
         */
        { name: 'user_id', type: 'int' },
        /**
         * @property {number} datastore_id The id of the {@link PIT_CP.model.Datastore}
         * the Project is linked to
         */
        { name: 'datastore_id', type: 'int',useNull:true },
        /**
         * @property {Date} datecreated The date the Project was created
         */
        { name: 'datecreated', type: 'date' },
        /**
         * @property {Date} dateupdated The date the Project was last updated
         */
        { name: 'dateupdated', type: 'date' }

    ],
    idProperty:'project_id',
    sorters:['datecreated']
});

