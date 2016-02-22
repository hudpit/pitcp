component name="udf" 
hint="A component to hold commonly used utility functions"
{
	public component function init() 
	hint="Initializes the component"
	{
		THIS.jsonify = createObject("component","json");
		return THIS;
	}

	public component function getQuery(){
		var query = new query();
		return query;
	}

	public void function error(numeric code, string msg) 
	hint="Handles sending an error response to the client. Will set the
	HTTP Status code."
	{
		if(isdefined("arguments.msg") and arguments.msg neq ""){
			var response = {
				success=false,
				msg = msg
			}

			outputJson(response, code);
		}
		
	}	

	public numeric function createId(string table) 
	hint="Creates a random ID and checks the passed table to make sure the ID
	doesn't already exist"
	{
		var id = 0;
		var loop = 1;
		do{
			id = randrange(1000000000, 9999999999);	
			
			if(isdefined('arguments.table') and arguments.table neq ""){
				var query = new query();
					var prefix = query.execute(sql="
						SELECT #table#_id as count from #table#
						where #table#_id = #id#
						").getprefix();
				if(prefix.recordcount eq 0){
					loop = 0;
				}
			}else{
				loop = 0;
			}
		}while(loop eq 1)
		return id;
	}

	public string function createRandString(numeric strLen, boolean includeNum = false)
	hint="Creates a random string of [strLen] characters. Used for creating the
	set-up keys"
	{
		var lcaseAlpha = 'abcdefghijklmnopqrstuvqxyz';
		var ucaseAlpha = Ucase(lcaseAlpha);
		var num = '0123456789';
		var availChars = lcaseAlpha & ucaseAlpha;
		if(includeNum){
			availChars = availChars & num;
		}
		var str = "";
		for(var i = 1; i lte strLen; i++){
			str &= mid(availChars, randrange(1, len(availChars)), 1);
		}

		return str;
	}

	public string function outputJson(any content, numeric code, string queryFormat="array") 
	hint="Converts the passed content variable to Json and sets the HTTP Status
	code to the passed code"
	{
		if(isdefined("code")){
			getPageContext().getResponse().setStatus(code);
		}
		var json = THIS.jsonify.encode(data=content, queryformat=ARGUMENTS.queryFormat,queryKeyCase="lower")
		writeOutput(json);
	}	
	public any function QueryToStruct(query query, numeric row=0)
	hint="takes a query and converts it to a coldfusion struct. Can optionally 
	just do one row if the row argument is passed"
	{
	        // Define the local scope.
	        var LOCAL = StructNew();
	 
	        // Determine the indexes that we will need to loop over.
	        // To do so, check to see if we are working with a given row,
	        // or the whole record set.
	        if (ARGUMENTS.Row){
	 
	            // We are only looping over one row.
	            LOCAL.FromIndex = ARGUMENTS.Row;
	            LOCAL.ToIndex = ARGUMENTS.Row;
	 
	        } else {
	 
	            // We are looping over the entire query.
	            LOCAL.FromIndex = 1;
	            LOCAL.ToIndex = ARGUMENTS.Query.RecordCount;
	 
	        }
	 
	        // Get the list of columns as an array and the column count.
	        LOCAL.Columns = ListToArray( ARGUMENTS.Query.ColumnList );
	        LOCAL.ColumnCount = ArrayLen( LOCAL.Columns );
	 
	        // Create an array to keep all the objects.
	        LOCAL.DataArray = ArrayNew( 1 );
	 
	        // Loop over the rows to create a structure for each row.
	        for (LOCAL.RowIndex = LOCAL.FromIndex ; LOCAL.RowIndex LTE LOCAL.ToIndex ; LOCAL.RowIndex = (LOCAL.RowIndex + 1)){
	 
	            // Create a new structure for this row.
	            ArrayAppend( LOCAL.DataArray, StructNew() );
	 
	            // Get the index of the current data array object.
	            LOCAL.DataArrayIndex = ArrayLen( LOCAL.DataArray );
	 
	            // Loop over the columns to set the structure values.
	            for (LOCAL.ColumnIndex = 1 ; LOCAL.ColumnIndex LTE LOCAL.ColumnCount ; LOCAL.ColumnIndex = (LOCAL.ColumnIndex + 1)){
	 
	                // Get the column value.
	                LOCAL.ColumnName = LOCAL.Columns[ LOCAL.ColumnIndex ];
	 
	                // Set column value into the structure.
	                LOCAL.DataArray[ LOCAL.DataArrayIndex ][ LOCAL.ColumnName ] = ARGUMENTS.Query[ LOCAL.ColumnName ][ LOCAL.RowIndex ];
	 
	            }
	 
	        }
	 
	 
	        // At this point, we have an array of structure objects that
	        // represent the rows in the query over the indexes that we
	        // wanted to convert. If we did not want to convert a specific
	        // record, return the array. If we wanted to convert a single
	        // row, then return the just that STRUCTURE, not the array.
	        if (ARGUMENTS.Row){
	 
	            // Return the first array item.
	            return( LOCAL.DataArray[ 1 ] );
	 
	        } else {
	 
	            // Return the entire array.
	            return( LOCAL.DataArray );
	 
	        }		
	}
	public void function outputJsonP(any data, string callback)
	hint="Returns data formatted for use with JsonP. 
	See https://en.wikipedia.org/wiki/JSONP for more info"
	{
			result = callback & "(" & serializeJSON(data) & ")";
			getPageContext().getResponse().setContentType('text/javascript');
			writeOutput(result);	
			return	
	}
}