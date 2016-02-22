Ext.data.JsonP.control_panel({"guide":"<h1 id='control_panel-section-pit-control-panel'>PIT Control Panel</h1>\n<div class='toc'>\n<p><strong>Contents</strong></p>\n<ol>\n<li><a href='#!/guide/control_panel-section-api-documentation'>API Documentation</a></li>\n<li><a href='#!/guide/control_panel-section-folder-structure'>Folder Structure</a></li>\n</ol>\n</div>\n\n<h3 id='control_panel-section-by-simtech-solutions-inc'>By Simtech Solutions Inc</h3>\n\n<h2 id='control_panel-section-api-documentation'>API Documentation</h2>\n\n<p>For the full API Documentation, please follow the link below</p>\n\n<p><a href=\"../api-docs/api\">Control Panel API Documentation</a></p>\n\n<h3 id='control_panel-section-release-notes'>Release Notes</h3>\n\n<h3 id='control_panel-section-december-31st-2014'>December 31st 2014</h3>\n\n<h3 id='control_panel-section-version-0.1.05'>Version 0.1.05</h3>\n\n<ul>\n<li>Fixed issues c17, c30, c29, c2, c5 and c55</li>\n<li>Fixed issue where user info wouldn't update until next login</li>\n</ul>\n\n\n<h3 id='control_panel-section-december-31st-2014'>December 31st 2014</h3>\n\n<h3 id='control_panel-section-version-0.1.04'>Version 0.1.04</h3>\n\n<ul>\n<li>Completed the User Info API</li>\n</ul>\n\n\n<h3 id='control_panel-section-december-24th-2014'>December 24th 2014</h3>\n\n<h3 id='control_panel-section-version-0.1.03'>Version 0.1.03</h3>\n\n<ul>\n<li>Fixed error message occuring when adding regions</li>\n</ul>\n\n\n<h3 id='control_panel-section-december-15th-2014'>December 15th 2014</h3>\n\n<h3 id='control_panel-section-version-0.1.02'>Version 0.1.02</h3>\n\n<ul>\n<li>Completed first round of fixes found by Cloudburst</li>\n</ul>\n\n\n<hr />\n\n<h3 id='control_panel-section-requirements'>Requirements</h3>\n\n<ul>\n<li>Railo v4.2.008 (http://www.getrailo.org/index.cfm/download/)</li>\n<li>MySQL 5.6 (https://dev.mysql.com/downloads/mysql/)</li>\n<li>Sencha CMD 5.1.026 (https://www.sencha.com/products/extjs/cmd-download/)</li>\n<li>ExtJS 5.1.1 (https://www.sencha.com/legal/GPL/)</li>\n<li>Web server (IIS, Apache, etc)</li>\n<li>PowerShell</li>\n</ul>\n\n\n<p><p><img src=\"guides/control_panel/control_panel_diagram.png\" alt=\"REST\" width=\"500\" height=\"1416\"></p></p>\n\n<h3 id='control_panel-section-getting-started'>Getting Started</h3>\n\n<ol>\n<li><p>Install and set-up all the items listed in Requirements above. Please see each download site for instructions on initial set-up of each requirement.</p></li>\n<li><p>Download the codebase, either by cloning the repo or downloading the zip file.</p></li>\n<li><p>The directory where the codebase resides on your computer will be referred to as SITE_HOME in these instructions.</p></li>\n<li><p>Set your webserver's webroot to SITE_HOME/build/production/PIT_CP</p></li>\n<li><p>Login to the railo web administrator by browsing to [YOUR_DOMAIN]/railo-context/admin/web.cfm.</p>\n\n<p> Click on \"Rest\" under the \"Archives and Resources\" section in the left hand nav and Set-up a new mapping with the following details:</p>\n\n<pre><code> - Virtual: /pit\n - Physical: /rest/pit\n</code></pre>\n\n<p> <p><img src=\"guides/control_panel/railo_rest.png\" alt=\"REST\" width=\"1047\" height=\"757\"></p></p>\n\n<p> Click on \"Datasource\" in the left hand nav and under \"Create new Datasource\", select MySQL and give it the name \"PITAPI\". Note: if this name is changed for any reason, sure to change the THIS.datasource property in Application.cfc in both /rest/pit and /reset.</p>\n\n<p> Complete the rest of the information required to set-up the datasource, including server address (likely localhost), username, password, database name, etc.</p>\n\n<p> <p><img src=\"guides/control_panel/railo_datas.png\" alt=\"Datasource\" width=\"1049\" height=\"759\"></p></p>\n\n<p> <p><img src=\"guides/control_panel/railo_datas2.png\" alt=\"Datasource\" width=\"1019\" height=\"761\"></p></p></li>\n<li><p>If you are using Windows, run the build.ps1 PowerShell script in your SITE_HOME, if you are using a non-Windows operating system you will need an alternative script or run the commands manually shown below.  To run a PowerShell script, open a PowerShell window by running 'powershell' at your command prompt, navigate to the script directory, type the script's name (with or without the .ps1 extension), and press Enter.</p>\n\n<p> This script will run 'sencha app build production' to produce a production ready package of all the front-end javascript. And it will also copy the backend scripts needed for the API to the proper folder. To do this without using the script, if you are using Linux for example, simply complete the following steps.</p>\n\n<ol>\n<li>Navigate to the SITE_HOME directory</li>\n<li>Run the command <code>sencha app build production</code></li>\n<li>Copy all files from SITE_HOME/rest to SITE_HOME/build/production/PIT_CP/rest. These are all the files required for the backend.</li>\n<li>Copy all files from SITE_HOME/reset to SITE_HOME/build/production/PIT_CP/reset. These are all the files required for a user to reset their password</li>\n<li>Copy version.json to SITE_HOME/build/production/PIT_CP/version.json</li>\n</ol>\n</li>\n</ol>\n\n\n<h2 id='control_panel-section-folder-structure'>Folder Structure</h2>\n\n<p>Below is a description of key folders</p>\n\n<ul>\n<li><p><strong>/app </strong> - All the front-end javascript source files go here. The folder is further broken down into logical subdirectories for controllers, models, stores, and views. Sencha CMD will look in this folder during the build process</p></li>\n<li><p><strong>/ext </strong> - This is the ExtJS Source Folder. Generally speaking, no changes should be needed here. This folder was created automatically by Sencha CMD during the application create process</p></li>\n<li><p><strong>/packages </strong> - All the styling/theming is done in this folder. ExtJS uses the concept of packages to handle themeing, so a new 'pit-theme' package was created that has all the custom styling used for the control panel. See http://docs.sencha.com/extjs/5.1/core_concepts/theming.html for a good introduction to how themeing works in ExtJS</p></li>\n<li><p><strong>/reset </strong> - This folder contains all the code necessary to display the Password Reset page. This is done in a separate folder since it involves different access controls (no login required). It consists of one page that will display the form to reset the password and then will display a confirmation once the password is reset.</p></li>\n<li><p><strong>/resources </strong> - Autogenerated by Sencha CMD as a place to put all required resources, such as images for the front-end.</p></li>\n<li><p><strong>/rest </strong> - All the backend logic goes here. It's in a subfolder called \"pit\" to allow for the possibility of other related by disparate API endpoints to be added. As an example, you may want to keep all functions related to administrator of the app in pit, but then extend this to be able to accept the survey responses, in which case you could add a new folder, \"datastore\" and have the app send all responses to /rest/datastore.\nThe <strong>/rest/pit </strong> directory contains multiple subfolders to keep everything organized</p>\n\n<ul>\n<li><strong>/rest/pit/cfc </strong> - A folder to place the required CFC (ColdFusion Components) that are used throughout the app. The two currently in there are json.cfc, which is used to convert data to JSON strings, and udf.cfc, which has several user-defined utility functions that are used in various places throughout the application.</li>\n<li><strong>/rest/pit/db </strong> - This folder contains the database schema, broken out by version. As opposed to having 1 master database schema file, we separated it out so we could have the inital, base-schema (v1.00), and then any changes that needed to be made after were added to a new versioned file. The intent is that these files can be run in chronological order and the end result will be an exact working replica of the database. This prevents the need from having to start with a completely fresh database each time, as the script should allow in-place updates from any given version to the latest.</li>\n<li><strong>/rest/pit/docs </strong> - A folder containing javadoc like documentation for all the components and methods used for the back-end</li>\n<li><strong>/rest/pit/Application.cfc </strong> - This file serves as an entry point into the Application. It is a requirement of ColdFusion, and is fully documented at <a href=\"http://help.adobe.com/en_US/ColdFusion/9.0/CFMLRef/WSc3ff6d0ea77859461172e0811cbec22c24-74fa.html\" title=\"http://help.adobe.com/en_US/ColdFusion/9.0/CFMLRef/WSc3ff6d0ea77859461172e0811cbec22c24-74fa.html\">http://help.adobe.com/en_US/ColdFusion/9.0/CFMLRef/WSc3ff6d0ea77859461172e0811cbec22c24-74fa.html</a>.</li>\n<li>**/rest/pit/[endpoint].cfc - Each remaining .cfc file in this directory handles all the requests to the endpoint with the matching name. For example, auth.cfc handles all requests sent to /rest/pit/auth/.  Within these files are functions to handle the different request types and sub-paths for each endpoint. For more detail on each file, see the /docs folder</li>\n</ul>\n</li>\n</ul>\n\n","title":"Control Panel"});