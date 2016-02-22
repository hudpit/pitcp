Ext.data.JsonP.geocoder({"guide":"<h1 id='geocoder-section-geocoder-%28region-designation-web-service%29'>Geocoder (Region Designation Web Service)</h1>\n<div class='toc'>\n<p><strong>Contents</strong></p>\n<ol>\n<li><a href='#!/guide/geocoder-section-requirements'>Requirements</a></li>\n<li><a href='#!/guide/geocoder-section-getting-started'>Getting Started</a></li>\n<li><a href='#!/guide/geocoder-section-api'>API</a></li>\n</ol>\n</div>\n\n<h2 id='geocoder-section-requirements'>Requirements</h2>\n\n<ul>\n<li>Railo v4.2.008+ (http://www.getrailo.org/index.cfm/download/)</li>\n<li>PostGreSQL 9.3.5 (http://www.postgresql.org/download/)</li>\n<li>PostGIS extension (http://postgis.net/install/)</li>\n</ul>\n\n\n<h2 id='geocoder-section-getting-started'>Getting Started</h2>\n\n<ol>\n<li><p>Install and set-up all the items listed in Requirements above. Please see each download site for instructions on initial set-up of each requirement.</p></li>\n<li><p>Download the codebase, either by cloning the repo or downloading the zip file. The relevant code is included as part of the Control Panel code. It is located under /rest/geo/</p></li>\n<li><p>Once PostgreSQL is installed and running, with PostGIS enabled, you need to import the shape files. The files included are accurate as of December 2013. These files can be found under /rest/geo/db/1.00/. You will need to extract the gzipped archive, and then import the .sql file into a PostgresSQL database.</p></li>\n<li><p>A separate datasource will need to be created in the Railo administrator. You will need to go to the Datasources page, give it a name, (i.e. \"gis\"), and then select PostgreSQL in the type dropdown\n<p><img src=\"guides/geocoder/geocoder-new-datasource.png\" alt=\"Create New Datasource\" width=\"413\" height=\"154\"></p>\nThis will bring you to the datasource settings screen, where you can enter in the settings as they relate to your environment\n<p><img src=\"guides/geocoder/geocoder-datasource-settings.png\" alt=\"Create New Datasource\" width=\"720\" height=\"558\"></p></p></li>\n<li><p>Be sure to edit the /rest/geo/Application.cfc file and change the line found in the OnApplicationStart function, and change \"gis\" to whatever you named the datasource</p>\n\n<p> application.GIS_DSN = \"gis\";</p></li>\n<li><p>Finally, you'll need to add a REST service mapping to the Railo Administrator to point to the /rest/geo/ directory.\n<p><img src=\"guides/geocoder/geocoder-rest-service.png\" alt=\"REST Service\" width=\"953\" height=\"357\"></p></p></li>\n</ol>\n\n\n<h2 id='geocoder-section-api'>API</h2>\n\n<p>Once set-up, the following endpoints will be available</p>\n\n<h3 id='geocoder-section-geocode'>Geocode</h3>\n\n<p><strong>/rest/geo/geocode/?lat={latitude}&amp;lng={longitude}</strong></p>\n\n<p>This endpoint takes the given {latitude} and {longitude} and returns the HUD Geocode it falls within, if any.</p>\n\n<h3 id='geocoder-section-hud-coc'>HUD CoC</h3>\n\n<p><strong>/rest/geo/coc/?lat={latitude}&amp;lng={longitude}</strong></p>\n\n<p>This endpoint takes the given {latitude} and {longitude}and returns the HUD CoC ID number and the CoC name the GPS coordinates fall within, if any.</p>\n\n<p>For further information on the functions provided in the Geocoder API, please see the API Docs, located at the link below:</p>\n\n<p><a href=\"../api-docs/geocoder\">Geocoder API Documentation</a></p>\n","title":"Geocoder"});