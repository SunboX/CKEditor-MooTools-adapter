CKEditor MooTools adapter
===

MooTools adapter for the famous [CKEditor](http://ckeditor.com/) provides easy use of basic CKEditor functions and access to internal API. It also integrates some aspects of CKEditor with MooTools framework.

Every element can be converted to working editor.
Plugin exposes some of editor's event to MooTools event system.


Example
---

 <script src="mootools.js"></script>
 <script src="ckeditor.js"></script>
 <script src="adapters/mootools.js"></script>
 <script type="text/javascript">
 
 window.addEvent('domready', function(){
	
	$('mootools_ckeditor').addEvent('ckeditorReady', function(editor){
		alert('CKEditor loaded');
	});
		
	// Initialize the editor.
	$('mootools_ckeditor').ckeditor();
	
 });
 
 </script>


License
---

See [license](http://github.com/SunboX/mootools-fx-text/blob/master/license) file.