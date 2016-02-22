/**
 * ##Overview
 * The User model. All count volunteers are *Users*.  This includes anyone 
 * with login access to the app itself.
 */
Ext.define('PIT_CP.model.User', {
    extend: 'Ext.data.Model',
    
    fields: [
        /**
         * @property {number} user_id The primary key of the User
         */
        { name: 'user_id', type: 'int' },
        /**
         * @property {string} fname The first name of the User
         */
        { name: 'fname', type: 'string' },
        /**
         * @property {string} lname The last name of the User
         */
        { name: 'lname', type: 'string' },
        /**
         * @property {string} email The email address of the User
         */
        { name: 'email', type: 'string' },
        /**
         * @property {string} phone The phone number of the User
         */
        { name: 'phone', type: 'string' },
        /**
         * @property {string} password The password of the user. *This should only
         * be present when password is being changed. This isn't returned from the 
         * server*
         */
        { name: 'password', type: 'string' },
        /**
         * @property {Date} datecreated The date the User was created
         */
        { name: 'datecreated', type: 'date' },
        /**
         * @property {Date} dateupdated The date the User was last updated
         */
        { name: 'dateupdated', type: 'date' }

    ]
});
