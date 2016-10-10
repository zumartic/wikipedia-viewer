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
		'callback': "wikiCallback"});
	
	var wikiRequestTimeout = setTimeout(function(){
		$wikiElem.text("failed to get wikipedia resources");
	}, 8000);
	
	$.ajax({
		url: urlWiki, 
		dataType: "jsonp",
		success: function( response ){
			var sites = response[1];
			var description = response[2];
			var urls = response[3];
			$("#wikipedia-header").html("Wikipedia Links related to " +wSearch);
			$.each(sites, function(index, value){
				$("<li class='wikilink'><h3><a href='" + urls[index] + "' target='_blank'>"  + value + "</a></h3>" + description[index] + "</li>").appendTo("#wikipedia-links");
		   });
		   clearTimeout(wikiRequestTimeout);
		   for(i=0;i<response[1].length;i++) {
				$.ajax({
	            url: "https://en.wikipedia.org/w/api.php",
	            dataType: "jsonp",
	            data: {
	                'action': "query",
	                'format': "json",
					'prop': "pageimages",
	                'titles': response[1][i],
					'formatversion': "2"
	            },
	            success: function(data) {
				var $listItem = $( "li:contains('" +data.query.pages[0].title +"')" );
					if (data.query.pages[0].thumbnail)  {
							for(j=0;j<response[1].length;j++) {
								if(response[1][j]==data.query.pages[0].title){
									$( "li:eq(" +j +")").prepend("<img src='" +data.query.pages[0].thumbnail.source +"' alt='Wiki thumbnail' style='float:left;width:60px;height:60px;'>");
								}
							}	
					}
	            }
		   });
		   }  	   
	   }
	});

	
    return false;
}

$('#searchform').submit(loadData);


$(".text_input").autocomplete({
	    source: function(request, response) {
	        $.ajax({
	            url: "https://en.wikipedia.org/w/api.php",
	            dataType: "jsonp",
	            data: {
	                'action': "opensearch",
	                'format': "json",
	                'search': request.term
	            },
	            success: function(data) {
	                response(data[1]);
	            }
	        });
	    }
	});