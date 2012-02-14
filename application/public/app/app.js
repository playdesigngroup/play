
////////// Setup

var speed = 250; 						// main speed
var loadTime = 5000; 					// loading delay
var loopIndex = 0;						// index of image slideshow
var trigger = getTrigger();				// click or touched based on devide
var active = 0;							// flag: page is already active
var playing = false;					// flag: video must play or not

////////// Models

var App = {

	// choose video based on browser
	getPlugin: function(){

		var uagent = navigator.userAgent.toLowerCase();
		if ( (uagent.search('iphone') > -1) || (uagent.search('ipod') > -1) || (uagent.search('android') > -1) || (uagent.search('msie 8.0') > -1)){
			noVideo();
		}		

	},
		
	show: function(){

		// flag
		active = 1;
		
		// show app once loaded
		restyle();
		$('html').css('background','black');
		fx('index');
		
	
	},	
			


	start: function(){

		var video = $('video');
		
		$('#nonvideo').remove();
		
		// video loaded -> show app
		video.get(0).addEventListener('canplaythrough',function(){
		
			if (active == 0){
				video.get(0).play();	
				App.show();	
				active = 1;
				setTimeout(function(){
					if (video.get(0).currentTime > 0){
						playing = 1;				
					}				
				},200);
			}
		},false);			
		
		// if video doesn't start, fire the site
		setTimeout(function(){		
			var activity = active;
		    if (activity == 0){
		    	App.show();		
		    	video.get(0).play();
		    	active = 1;	
				setTimeout(function(){
					if (video.get(0).currentTime > 0){
						playing = 1;				
					}				
				},200);					
		    }
		},loadTime);
	
		// loop 		
		video.on('ended', function(){ this.play();});		
	
	}	
}


///////// Animation plugins (overwrite app)


function noVideo(){
	
	App.start = function(){
		
		$('#video, #butterfly, #playvideo').remove();
		$('body').append('<img src="media/theme/w.jpg" id="altimg">');
		App.show();	
		
		var rotate = function rotate(){
			$('#nonvideo').find('img').not('.active').hide().css('z-index',3).fadeIn(2000,function(){
				$('#nonvideo .active').css('z-index',1).removeClass('active');				
				$(this).css('z-index',2).addClass('active');
			});		
		}		
		setInterval(rotate,6000);			
	};
	
}

////////// Events

// choose animations
App.getPlugin();

$(function(){

	// caches
	var main = document.body;
	var wrap = $('#wrap');
	var header = $('#header');
	var bf = $('#butterfly');
	var video = $('video');

	// dom loaded -> build work
	loadWork();	
	
	// setup video and start app
	App.start();
	
	// click on menu
	header.on(trigger,'h2',function(){
		var target = $(this).attr('rel');
		fx(target);
		video.removeAttr('controls');	
	});	

	// click on menu
	$('#p_index').on(trigger,'h2',function(){
		var target = $(this).attr('rel');
		fx(target);
		video.removeAttr('controls');	
	});	
	
	// click on logo
	header.on(trigger,'img',function(){
		fx('contact');
	});
	
	// click on work
	$('#worklist').on(trigger,'.normalwork',function(){

		var data = $(this).data('work');
		var images = '';
		
		for (key in data.images){
			var url = data.images[key];
			images += '<img src="'+url+'">';
		}		
		
		wrap.html(images);
		
		wrap.find('img').eq(0).loadImage(function(){
			setTimeout(function(){
				wrap.attr('class','loaded');			
			},speed);		
		});					
		
		// resize container
		var number = wrap.find('img').size();
		wrap.removeAttr('class');
		loopIndex = 0;	
		wrap.css({'width':number+'00%','left':0});	
		fx('work');
		
	});		

	// Up
	$('#goright').on(trigger,function(){
		imgUp(main,wrap);	
	});

	// back button (work list)
	$('#lastwork,#lasts').on(trigger,function(){
		fx('index');
	});	

	// back button (all)
	$('#goleft').on(trigger,function(){
		switch ( main.id ){
		case 'work':
			fx('works');
			break;
		default:
			fx('index');
			break;	
		}
	});
	
	// resize window
	$(window).resize(function() {
		restyle();
	});	
	
	// toggle video
	$('#playvideo').on(trigger,function(){
		var vv = video.get(0);
		if (playing == true) {
			vv.pause();
			playing = false;
		}
		else{
			vv.play();
			playing = true;
		}
	});	
	
	// launch butterfly
	bf.on('mouseenter',function(){
	
		$(this).unbind();
	
		window.clearInterval(int);
		
		$('#wing1,#wing2').addClass('open');

		var int2 = setInterval(function(){
			bf.toggleClass('open');
		},200);
		
		bf.addClass('away');
		
		// nornalization
		setTimeout(function(){
			window.clearInterval(int2);
			bf.remove();
		},3100);
				
	});

	var int = setInterval(function(){
		bf.toggleClass('open');
	},2000);


	// ajax form
	$('form').on('submit',function(e){
		e.preventDefault();
		var email = $('#mce-EMAIL');
		var submit = $('#mc-embedded-subscribe');
		var field = $('#mce-MMERGE1').val();
		var company = $('#mce-MMERGE2').val();
		
		if (  email.val().search('@') > -1 ){
			email.removeClass('error');
			submit.val('Subscription completed!').attr("disabled", "disabled");
			$.ajax({
				type: 'POST',
				url:'/newsletter',
				data: 'company='+company+'&field='+field+'&email='+email.val()
			});
		}
		else{
			email.addClass('error');
		}
	});
	
});


///////// Actions

// load works from json
function loadWork(){
		
	var worklist = $('#worklist');
	
	for (key in data_work){
	    var data = data_work[key];
	    var work = $('<li class="normalwork"><img src="'+data.thumb+'"><span><h3>'+data.title+'</h3>'+data.text+'</span></li>');
	    work.data('work',data);
	    work.appendTo(worklist);
	}		
	
	worklist.append('<li id="lastwork"><div></div><li>');
};

// update css
function restyle(){
		
	// window size
	var h = $(window).height();
	var w =  $(window).width();
	var r = h/w;
	var m =  Math.round( h * (0.052) );
		
	// font size
	var font1 = m/4;
	var font2 = m/3;
	var font3 = m/2.2;
	var font4 = m*1.7;
					
	var styles = '#footer{padding-left:'+m+'px; height:'+m+'px;width:'+(w-m)+'px;line-height:'+m+'px;font-size:'+font1+'px}'
	+ '#header{padding-right:'+m+'px; height:'+m+'px;width:'+(w-m)+'px;line-height:'+m+'px;font-size:'+font2+'px}'
	+ '#header h2{margin-left:'+m/2+'px;}'	
	+ '#header img{width:'+m*1.35+'px;left:'+m+'px;top:'+m*0.25+'px}'
	
	+ '#work_content{width:'+(h-m*2)+'px; left:'+ (w - (h-m*2) ) / 2 +'px;height:'+(h-m*2)+'px;}'
	+ '#work_content img{width:'+(h-m*2)+'px;height:'+(h-m*2)+'px;}'
	+ '#p_vision,#p_contact,#p_work,#p_works,#p_index,#p_services{top:'+m+'px;height:'+(h-m*2)+'px}'
	+ '#st1{height:'+m*11.5+'px;right:'+m*3+'px}'
	+ '#worklist,#slist{-webkit-perspective:'+m*6+'px;-moz-perspective:'+m*6+'px;}'
	
	+ '#lastwork > div,#lasts > div{width:'+m*2.8+'px;height:'+m*2.8+'px;margin-left:-'+m*1.4+'px;margin-top:-'+m*1.4+'px;}'
	+ '#goleft,#goright{width:'+m*2.8+'px;height:'+m*2.8+'px}'
	+ '#goleft{left:-'+m*1.4+'px;margin-top:-'+m*1.4+'px}'
	+ '#goright{right:-'+m*1.4+'px;margin-top:-'+m*1.4+'px;}'
	
	+ '#p_contact h2, #p_vision h2, #p_services h2{font-size:'+font4+'px;line-height:'+font4*0.98+'px;letter-spacing:-'+m*0.05+'px;left:'+m*3.5+'px;top:'+m*2+'px}'
	+ '#p_vision p, #p_services p{font-size:'+font3+'px;letter-spacing:'+m*0.05+'px;width:'+m*9.5+'px;left:'+m*3.5+'px;line-height:'+font3*1.2+'px;}'
	+ '#p_services p{top:'+m*10.6+'px;}'
	+ '#mc-embedded-subscribe-form{top:'+m*2+'px;margin-right:'+m*4+'px;font-size:'+font3+'px;height:'+m*9+'px}'
	+ '#mc-embedded-subscribe-form input{padding:'+m*0.5+'px;width:'+((w/2)-(m*6))+'px;margin-bottom:'+m*0.7+'px;margin-top:'+m*0.2+'px;font-size:'+font3+'px}'
	+ '#mc-embedded-subscribe-form #mc-embedded-subscribe{padding-right:'+m*2+'px;padding-top:'+m/11+'px;padding-bottom:'+m/11+'px;}'
	
	+ '#p_vision p{top:'+m*9+'px;}'
	+ '#p_contact p{font-size:'+font3+'px;left:'+w/2+'px;top:'+m*2+'px;line-height:'+font3*1.2+'px;}'
	+ 'p em{margin-bottom:'+m/2+'px;}'
	+ 'p em, p strong{padding-right:'+m*2+'px;padding-top:'+m/11+'px;padding-bottom:'+m/11+'px;margin-top:'+m/11+'px;}'
	+ 'p small{height:'+m*1.5+'px}'
	
	+ '#butterfly{right:'+m*9.8+'px;bottom:'+m*6.5+'px;height:'+m*4+'px;width:'+m*4+'px;-webkit-perspective:'+m*6+'px;-moz-perspective:'+m*6+'px;}'
	+ '#wing1,#wing2{width:'+m*3+'px;height:'+m*3+'px;}'
	+ '#butterfly.away{bottom:'+m*25+'px;-webkit-transform: translate3d(-'+m*3+'px,'+m*1.5+'px,'+m*18+'px) rotate3d(0.6,0.4,0,-90deg);-moz-transform: translate3d(-'+m*3+'px,'+m*1.5+'px,'+m*18+'px) rotate3d(0.6,0.4,0,-90deg);}'
	+ '#worklist span h3,#slist span h3{padding-bottom:'+m/4+'px}'
	+ '#worklist span h3{padding-top:'+m*1.8+'px;font-size:'+m+'px;}'
	+ '#slist span h3,#slist span img{padding-top:'+m*0.5+'px;}'
	+ '#worklist span,#slist span h3{font-size:'+m/2+'px;}'
	
	+ '#p_index h2{font-size:'+m*2.8+'px;padding-left:'+m+'px;top:'+m*2+'px;height:'+m*2.7+'px; letter-spacing:-'+m*0.08+'px;}'
	+ '#playvideo{left:'+m+'px;bottom:'+m*2+'px}';
		
	// if window ratio less wide than video ratio
	if (r >= 0.557){
	    styles += 'video{height:'+h+'px;width:auto}';
	    styles += '#nonvideo img{height:100%;width:auto;}';
	}	

	if (r >= 1){
	    styles += 'body{display:none;}html{color:black;background: url(media/theme/turn.jpg) no-repeat center black!important;}';
	}
		    	
	// element setup
	var css = document.createElement('style');
	css.type = 'text/css';	

	// delete previous style
	$('style').remove();
	
	// append new
	if (css.styleSheet) css.styleSheet.cssText = styles;
	else css.appendChild(document.createTextNode(styles));
	document.getElementsByTagName("head")[0].appendChild(css);
	
};

// transitions
function fx(fx1){

	var vv = $('video').get(0);
	
	if (playing == true){
		if(fx1 == 'works'){
			vv.play();	
			setTimeout(function(){
				vv.pause();
			},speed*2);	
		}	
		else{
			vv.play();
		}
	}
	
	document.body.removeAttribute('id');
	
	setTimeout(function(){
		document.body.id = fx1;
	},speed);
}

// select trigger
function getTrigger(){
	var uagent = navigator.userAgent.toLowerCase();
	if ( (uagent.search('iphone') > -1) ||  (uagent.search('ipad') > -1) || (uagent.search('ipad') > -1) || (uagent.search('android') > -1) ){
		return 'touchstart';
	}
	else{
		return 'click';
	}
}

// image loaded callback
$.fn.loadImage = function(callback){
	if (this.complete) {
   		callback();
   	} else {
   		$(this).load(function() {
       		callback();
    	});
    }
}

// slideshow navigation
function imgUp(id,wrap){
	
	var max = wrap.find('img').size() - 1;
	
	if (loopIndex < max){
	    loopIndex++;
	   	wrap.css('left','-'+loopIndex+'00%');	
	}
	else{
		loopIndex = 0;
		wrap.css('left','0%')
	}
};

