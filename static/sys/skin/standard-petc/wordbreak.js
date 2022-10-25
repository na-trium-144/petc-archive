$(function(){
    var $targetElement = '.basic-list li span, .basic-text';
    if($.browser.msie) {
        $($targetElement).css('word-break', 'break-all');
    } else {
		if ( navigator.userAgent.indexOf('Nintendo DSi') == -1 && navigator.userAgent.indexOf('Nintendo 3DS') == -1 && navigator.userAgent.indexOf('PlayStation') == -1 && navigator.userAgent.indexOf('PLAYSTATION') == -1 )
		{
	        $($targetElement).each(function(){
	            if(navigator.userAgent.indexOf('Firefox') != -1) {
	                $(this).html($(this).text().split('').join('<wbr />'));
	            } else {
	                $(this).html($(this).text().split('').join(String.fromCharCode(8203)));
	            }
			});
        }
    }
});