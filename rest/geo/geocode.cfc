component restpath="/geocode" rest="true"
hint="This component provides the functionality to conver a lat/lng pair into a HUD
Geocode. It currently uses the ST_INTERSECTS functionality provided by the PostGIS for PostgreSQL.
"{

	remote struct function getGeocodeJson() httpmethod="GET" produces="application/json" 
	hint="Endpoint /rest/geo/geocode?lat=[lat]&lng=[lng]
	If either a latitude or a longitude are not provided, an error will be returned in JSON format
	"{
		var output = {};
		if(structKeyExists(url, "lat") && structKeyExists(url,"lng")){
			var result = getGeocode(url.lat, url.lng);

			if(result.recordcount){
				output["success"] = true;
				output["geocode"] = result.geo_code[1];
				output["name"] = result.name[1];
			}else{
				output["success"] = false;
				output["msg"] = "NO GEOCODE FOUND"
			}
		}else{
			return error(400, "REQUIRED: lat and lng OR zip");
		}
		return output;
	}

	private struct function error(numeric code, string msg) 
	hint="Sets the header STATUS code to the passed code and returns an error struct"
	{
		var pc = getPageContext().getresponse();
		pc.setStatus(code);
		
		return {
			"success" = false,
			"msg" = msg
		}
	}	

	private query function getGeocode(string lat, string lng)
	hint="Retrieves the HUD Geocode information that the passed lat/lng pair reside in from from the Database"
	{
		var query = new query(
			datasource="#application.GIS_DSN#",
			sql="
				SELECT 
					name,
					geo_code
				FROM 
					public.geocode
				WHERE
				st_intersects(geom, 
                    ST_Transform(
                          ST_GeomFromText('point(#url.lng# #url.lat#)',4326), 4269))
			"
		);
		return query.execute().getResult();		
	}
}