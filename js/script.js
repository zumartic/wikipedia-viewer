function loadData() {

    var $body = $('body');
    var $wikiElem = $('#wikipedia-links');
    //var $greeting = $('#greeting');
	var urlWiki = "https://en.wikipedia.org/w/api.php?action=opensearch&";
	var wSearch = $('#wikiSearch').val();
	$('#wikiSearch').val("");
	$("input").blur();
	
    // clear out old data before new request
    $wikiElem.text("");
    
	
	// Wiki AJAX function
	urlWiki += $.param({
		'search': wSearch, 
		'format': "json",
		/*'prop': "pageimages",*/
		'callback': "wikiCallback"});
		//console.log(urlWiki);

		//'format': "jsonfm"});
	
	var wikiRequestTimeout = setTimeout(function(){
		$wikiElem.text("failed to get wikipedia resources");
	}, 8000);
	
	$.ajax({
		url: urlWiki, 
		dataType: "jsonp",
		success: function( response ){
			console.log(response);
			var sites = response[1];
			var description = response[2];
			var urls = response[3];
			$("#wikipedia-header").html("Relevant Wikipedia Links related to " +wSearch);
			//$("#inner").removeClass("container4");
			$.each(sites, function(index, value){
				$("<li class='wikilink'> " + "<h3><a href='" + urls[index] + "' target='_blank'>"  + value + "</a></h3>" + description[index] + "</li>").appendTo("#wikipedia-links");		
		   });
		   clearTimeout(wikiRequestTimeout);
	   }
	});

    return false;
}

$('#searchform').submit(loadData);

/*
function randomWiki() {
    console.log("Hello World");
	location.href = "https://en.wikipedia.org/wiki/Special:Random target='_blank'";
}*/

$(".text_input").autocomplete({
	    source: function(request, response) {
			console.log("haabla");
	        $.ajax({
	            url: "http://en.wikipedia.org/w/api.php",
	            dataType: "jsonp",
	            data: {
	                'action': "opensearch",
	                'format': "json",
	                'search': request.term
	            },
	            success: function(data) {
	                response(data[1]);
					console.log(data);
	            }
	        });
	    }
	});