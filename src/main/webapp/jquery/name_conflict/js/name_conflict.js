
jQuery.noConflict(); // Reverts '$' variable back to other JS libraries
jQuery(document).ready( function(){
         //do jQuery stuff when DOM is ready with no conflicts
		 jQuery("label").text("jQuery now can't use $");
		 //$("label").text("jQuery now can use $");
   }); 
 
//or the self executing function way
 jQuery.noConflict();
 (function($) {
    // code using $ as alias to jQuery
	setTimeout(function () {
		$("label").append("<br/>jQuery now can use $ in anonymous function");
    }, 1000);
	// wait 1 second for DOM ready
	
})(jQuery);



