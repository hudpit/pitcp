
//Add Datastore button
$('button.btn[name="datastore"]').click(function(event){
	event.preventDefault();
	var data = {};
	$('form#newDSForm').find('input').each(function(){
		data[$(this).attr('name')] = $(this).val()
	})
	data['datastore'] = 'new';
	$.ajax({
		url:'index.cfm',
		method:"POST",
		data:data
	})
});

