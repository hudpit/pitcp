Geocoder (Region Designation Web Service)
====================

Requirements
-------------
- Railo v4.2.008+ (http://www.getrailo.org/index.cfm/download/)
- PostGreSQL 9.3.5 (http://www.postgresql.org/download/)
- PostGIS extension (http://postgis.net/install/)

Getting Started
------------------

1. Install and set-up all the items listed in Requirements above. Please see each download site for instructions on initial set-up of each requirement.

1. Download the codebase, either by cloning the repo or downloading the zip file. The relevant code is included as part of the Control Panel code. It is located under /rest/geo/

1. Once PostgreSQL is installed and running, with PostGIS enabled, you need to import the shape files. The files included are accurate as of December 2013. These files can be found under /rest/geo/db/1.00/. You will need to extract the gzipped archive, and then import the .sql file into a PostgresSQL database.

1. A separate datasource will need to be created in the Railo administrator. You will need to go to the Datasources page, give it a name, (i.e. "gis"), and then select PostgreSQL in the type dropdown
{@img geocoder-new-datasource.png Create New Datasource}
This will bring you to the datasource settings screen, where you can enter in the settings as they relate to your environment
{@img geocoder-datasource-settings.png Create New Datasource}

1. Be sure to edit the /rest/geo/Application.cfc file and change the line found in the OnApplicationStart function, and change "gis" to whatever you named the datasource
    
    application.GIS_DSN = "gis";
    
1. Finally, you'll need to add a REST service mapping to the Railo Administrator to point to the /rest/geo/ directory. 
{@img geocoder-rest-service.png REST Service}

API
---------

Once set-up, the following endpoints will be available

###Geocode
**/rest/geo/geocode/?lat={latitude}&lng={longitude}**

This endpoint takes the given {latitude} and {longitude} and returns the HUD Geocode it falls within, if any.

###HUD CoC
**/rest/geo/coc/?lat={latitude}&lng={longitude}**

This endpoint takes the given {latitude} and {longitude}and returns the HUD CoC ID number and the CoC name the GPS coordinates fall within, if any.

For further information on the functions provided in the Geocoder API, please see the API Docs, located at the link below:

[Geocoder API Documentation](../api-docs/geocoder)