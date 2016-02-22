component restpath="/coc" rest="true" 
hint="This component provides the functionality to conver a lat/lng pair into a HUD CoC. It currently uses the ST_INTERSECTS functionality provided by"
{
	
	remote struct function getCocJson() httpmethod="GET" produces="application/json" 
	hint="Endpoint /rest/geo/coc?lat=[lat]&lng=[lng]
	If either a latitude or a longitude are not provided, an error will be returned in JSON format
	"
	{
		var output = {};
			if(structKeyExists(url, "lat") && structKeyExists(url,"lng")){
				var result = getCoc(url.lat, url.lng);
				
				if(result.recordcount){
					output["success"] = true;
					output["coc_name"] = result.cocname[1];
					output["coc_num"] = result.cocnum[1];
				}else{
					output["success"] = false;
					output["msg"] = "NO GEOCODE FOUND"
				}				
				return output;
			}else{
				return error(400,'REQUIRED: lat and lng');
			}
			
	}

	private query function getCoc(string lat, string lng)
	hint="Retrieves the COC information that the passed lat/lng pair reside in from from the Database"
	{
		
		var query = new query(
			datasource="#application.GIS_DSN#",
			sql="
				SELECT 
					cocname,
					cocnum							
				FROM 
					public.coc
				WHERE
                st_intersects(geom,
                    ST_Transform(
                          ST_GeomFromText('point(#url.lng# #url.lat#)',4326), 3857))
			"
		);
		return query.execute().getResult();
	}

	public struct function error(numeric code, string msg)
	hint="Sets the header STATUS code to the passed code and returns an error struct"{
		var pc = getPageContext().getresponse();
		pc.setStatus(code);
		return {
			"success" = false,
			"msg" = msg
		}
	}

}	