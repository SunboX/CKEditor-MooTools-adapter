﻿/*
Copyright (c) 2003-2010, CKSource - Frederico Knabben. All rights reserved.
For licensing, see LICENSE.html or http://ckeditor.com/license
*/

/*
Copyright (c) 2010, CKEditor MooTools adapter - Dipl.-Ing. (FH) André Fiedler <kontakt at visualdrugs dot net>. MIT License.
*/

/**
 * @fileOverview MooTools adapter provides easy use of basic CKEditor functions
 *   and access to internal API. It also integrates some aspects of CKEditor with
 *   MooTools framework.
 *
 * Every element can be converted to working editor.
 * Plugin exposes some of editor's event to MooTools event system.
 *
 * @example
 * <script src="mootools.js"></script>
 * <script src="ckeditor.js"></script>
 * <script src="adapters/mootools.js"></script>
 */

CKEDITOR.config.mootoolsOverrideVal = CKEDITOR.config.mootoolsOverrideVal || true;

// New set/get value method for elements
if (CKEDITOR.config.mootoolsOverrideVal){
	
	CKEDITOR.on('instanceReady', function(event){
		var editor = event.editor;
		(function(){
			if (!editor.element){
				arguments.callee.delay(100);
				return;
			}
			editor.element.fireEvent('ckeditorLoad', editor);
		}).delay(0);
	}, null, null, 9999);
	
	Element.Properties.value = {
		
		set: function(key, value, forceNative){
			var editor = this.get('ckeditor');
			if (this.hasOwnProperty(key) && (forceNative || !editor)) this[key] = value;
			else editor.setData(value);
			return this;
		},
		
		get: function(key, forceNative){
			var editor = this.get('ckeditor');
			if(forceNative || !editor) return this.hasOwnProperty(key) ? this[key] : null;
			return editor.getData();
		}
	};
	
	Element.Properties.ckeditor = {
		
		set: function(config){
			return this.eliminate('ckeditor').store('ckeditor:config', config);	
		},
		
		get: function(config){
			var instanceLock = this.retrieve('ckeditor:lock'),
				element = this;
			
			if (!instanceLock && (config || !this.retrieve('ckeditor'))){
				
				config = config || this.retrieve('ckeditor:config') || {};
				
				// Handle config.autoUpdateElement inside this plugin if desired
				if (config.autoUpdateElement || (!config.autoUpdateElement && CKEDITOR.config.autoUpdateElement))
				{
					config.autoUpdateElementMootools = true;
				}
				
				// Always disable config.autoUpdateElement
				config.autoUpdateElement = false;
				this.store('ckeditor:lock', true);
				this.set('ckeditor', config);
				
				var editor = CKEDITOR.replace(this, config);
				
				// Register callback
				editor.on('instanceReady', function(event){
					var editor = event.editor;
					(function(){
						// Delay bit more if editor is still not ready
						if (!editor.element ){
							arguments.callee.delay(100);
							return;
						}

						// Remove this listener
						event.removeListener('instanceReady', this.callee);

						// Forward setData on dataReady
						editor.on('dataReady', function(){
							element.fireEvent('ckeditorDataReady', editor);
						});

						// Forward getData
						editor.on('getData', function(event){
							element.fireEvent('ckeditorGetData', [editor, event.data]);
						}, 999);

						// Forward destroy event
						editor.on('destroy', function(){
							element.fireEvent('ckeditorDestroy', editor);
						});

						// Integrate with form submit
						var form = element.getParent('form');
						if (editor.config.autoUpdateElementJquery && element.get('tag') == 'textarea' && form){
							var onSubmit = function(){
								editor.updateElement();
							};

							// Bind to submit event
							form.addEvent('submit', onSubmit);

							// Unbind when editor destroyed
							element.addEvent('ckeditorDestroy', function(){
								form.removeEvent('submit', onSubmit);
							});
						}

						// Garbage collect on destroy
						editor.on('destroy', function(){
							element.eliminate('ckeditor');
						});

						// Remove lock
						element.eliminate('ckeditor:lock');

						// Fire ready event
						element.fireEvent('ckeditorReady', editor);
					}).delay(0);
				}, null, null, 9999);
				
				this.store('ckeditor', editor);
			}
			return this.retrieve('ckeditor');
		}
	};
		
	Element.implement({
		ckeditor: function(config){
			this.get('ckeditor', config);
			return this;
		}
	});
}