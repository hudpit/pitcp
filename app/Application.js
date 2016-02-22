/**
 * ##Overview
 * The application entry point. This is where you definte all the main views, 
 * controllers and stores
 */
Ext.define('PIT_CP.Application', {
    name: 'PIT_CP',

    extend: 'Ext.app.Application',

    views: [
        'Login',
        'Register',
        'ForgotPw',
        'Main',
        'Project',
        'Datastore',
        'User'
    ],

    controllers: [
        'Main'
    ],

    stores: [
        'NavStore'
    ]
});
