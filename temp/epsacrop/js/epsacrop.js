Drupal.EPSACrop = {
 api: null,
 preset: null,
 delta: null,
 presets: {},
 init: false,
 dialog: function(type_name, field_name, delta, img, trueSize) {
    $('body').find('#EPSACropDialog').remove().end().append('<div title="'+ Drupal.t("Cropping Image") +'" id="EPSACropDialog"><img src="'+ Drupal.settings.epsacrop.base + Drupal.settings.epsacrop.path +'/img/loading.gif" /></div>');

    // Translatables buttons
    var buttons = {}
    var saveLabel = Drupal.t("Apply crop");
    var cancelLabel = Drupal.t("Cancel");
    buttons[saveLabel] = function(){
      $('#edit-epsacropcoords').val(JSON.stringify(Drupal.EPSACrop.presets));
      var field = field_name.replace('_', '-');
      var welem = $('div[id*="' + field +  '"]').eq(0);
      if(welem.find('.warning').size() == 0) {
        welem.prepend('<div class="warning">' + Drupal.t("Changes made in image crops will not be saved until the form is submitted.") + '</div>');
      }
      $(this).dialog('close');
      $('#EPSACropDialog').remove();
    };
    buttons[cancelLabel] = function () {
      $(this).dialog('close');
      $('#EPSACropDialog').remove();
    }
    
    $('#EPSACropDialog').dialog({
       bgiframe: true,
       height: 600,
       width: 850,
       modal: true,
       draggable: false,
       resizable: false,
       overlay: {
          backgroundColor: '#000',
          opacity: 0.5
       },
       buttons: buttons,
       close: function() {
          $('#EPSACropDialog').remove();
       }
    }).load(Drupal.settings.epsacrop.base +'?q=crop/dialog/' + type_name + '/' + field_name, function(){
       try{
	       var preset = $('.epsacrop-presets-menu a[class=selected]').attr('id'); 
	       var coords = $('.epsacrop-presets-menu a[class=selected]').attr('rel').split('x');
	       Drupal.EPSACrop.preset = preset;
	       Drupal.EPSACrop.delta = delta;
	       if($('#edit-epsacropcoords').val().length > 0 && Drupal.EPSACrop.init == false) {
           Drupal.EPSACrop.presets = eval('(' + $('#edit-epsacropcoords').val() + ')');
           Drupal.EPSACrop.init = true;
	       }
	       if((typeof Drupal.EPSACrop.presets[Drupal.EPSACrop.delta] == 'object') && (typeof Drupal.EPSACrop.presets[Drupal.EPSACrop.delta][Drupal.EPSACrop.preset] == 'object') ) {
	    	   var c = Drupal.EPSACrop.presets[Drupal.EPSACrop.delta][Drupal.EPSACrop.preset];
	       }
	       $('#epsacrop-target').attr({'src': img});
         setTimeout(function(){
           Drupal.EPSACrop.api = $.Jcrop('#epsacrop-target', {
              aspectRatio: (coords[0] / coords[1]),
              //setSelect: (typeof c == 'object') ? [c.x, c.y, c.x2, c.y2] : [0, 0, coords[0], coords[1]],
              trueSize: trueSize,
              onSelect: Drupal.EPSACrop.update,
              keySupport: false
           }); // $.Jcrop
           // animateTo, to avoid one bug from Jcrop I guess,
           // He doesn't calculate the scale with setSelect at the begining, so
           // I add animateTo after initate the API.
           Drupal.EPSACrop.api.animateTo(((typeof c == 'object') ? [c.x, c.y, c.x2, c.y2] : [0, 0, coords[0], coords[1]]));
           Drupal.EPSACrop.init(delta);
          }, 1000); // Sleep 1 second
       }catch(err) {
    	   alert(Drupal.t("Error on load : @error", {'@error': err.message}));
       }
    }); // fin load
 }, // dialog
 init: function ( delta ) {
   // Init the crop settings so than when a user
   // hits save button without adjusting the area
   // those settings (visible for him) will be saved.
   $('.epsacrop-presets-menu a').each(function() {
     var preset = $(this).attr('id');
	   var coords = $(this).attr('rel').split('x');
     if(typeof Drupal.EPSACrop.presets[delta] != 'object') {
     	Drupal.EPSACrop.presets[delta] = {};
     }
     if(typeof Drupal.EPSACrop.presets[delta][preset] != 'object') {
       var c = new Object();
       c.x = 0;
       c.y = 0;
       c.x2 = coords[0];
       c.y2 = coords[1];
       c.w = coords[0];
       c.h = coords[1];
       Drupal.EPSACrop.determineSize(c, $('#epsacrop-target').width(), $('#epsacrop-target').height());
       Drupal.EPSACrop.presets[delta][preset] = c;
     }
   });
 },
 determineSize: function( c, width, height ) {
   // Reduce cropping area (preserving ratio) if at least
   // of the preset dimensions exceeds uploaded image size.
   if (c.y2 > height && c.x2 > width) {
     // Use the dimension that was reduced most and calculate the other.
     if (height / c.y2 < width / c.x2) {
       $ratio = c.x2/c.y2;
       c.y2 = height;
       c.x2 = Math.floor($ratio * c.y2);
     }
     else {
       $ratio = c.y2/c.x2;
       c.x2 = width;
       c.y2 = Math.floor($ratio * c.x2);
     }
   }
   else if (c.y2 > height) {
     // If only height exceed the limit reduce it and calculate width.
     $ratio = c.x2/c.y2;
     c.y2 = height;
     c.x2 = Math.floor($ratio * c.y2);
   }
   else if (c.x2 > width) {
     // If only width exceed the limit reduce it and calculate height.
     $ratio = c.y2/c.x2;
     c.x2 = width;
     c.y2 = Math.floor($ratio * c.x2);
   }
   c.w = c.x2;
   c.h = c.y2;
 },
 crop: function( preset ) {
    $('.epsacrop-presets-menu a').removeClass('selected');
    $('.epsacrop-presets-menu a#'+preset).addClass('selected');
	  var coords = $('.epsacrop-presets-menu a[class=selected]').attr('rel').split('x');
    Drupal.EPSACrop.preset = preset;
    if(typeof Drupal.EPSACrop.presets[Drupal.EPSACrop.delta] == 'object' && typeof Drupal.EPSACrop.presets[Drupal.EPSACrop.delta][Drupal.EPSACrop.preset] == 'object' ) {
       var c = Drupal.EPSACrop.presets[Drupal.EPSACrop.delta][preset];
       Drupal.EPSACrop.api.animateTo([c.x, c.y, c.x2, c.y2]);
    }else{
       Drupal.EPSACrop.api.animateTo([0, 0, coords[0], coords[1]]);
    }
    Drupal.EPSACrop.api.setOptions({aspectRatio: coords[0]/coords[1]});
 },
 update: function( c ) {
    var preset 	= Drupal.EPSACrop.preset;
    var delta 	= Drupal.EPSACrop.delta;
    if(typeof Drupal.EPSACrop.presets[delta] != 'object') {
    	Drupal.EPSACrop.presets[delta] = {};
    }
    Drupal.EPSACrop.presets[delta][preset] = c;
 }
};
