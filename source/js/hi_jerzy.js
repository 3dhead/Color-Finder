(function (root, factory) {
  
  // Adding dependencies: buoy
  if ( typeof define === 'function' && define.amd ) {
    define(['buoy'], factory(root));
  } else if ( typeof exports === 'object' ) {
    module.exports = factory(require('buoy'));
  } else {
    root.hiJerzy = factory(root, root.buoy);
  }
  
})(
    typeof global !== "undefined" ? global : this.window || this.global, function (root) {

  'use strict';
  
  //
  // Protected Variables
  //
  var size = 43;
  
  var hiJerzy = {
      page : { x : 0, y : 0, scroll : {x : 0, y : 0}, window : {x : 0, y : 0}, orientation: false },
      // ColorPallet : Object
      colorPalette : {
        palettes : [
          {name : 'red', description: 'Red', contentBxCss: 'width: 100px'},
          {name : 'red_green-blue', description: 'Red + green, blue', contentBxCss: 'width: 200px'},
          {name : 'red_green', description: 'Red + green', contentBxCss: 'width: 100px'},
          {name : 'red_blue', description: 'Red + blue'},
          {name : 'red_cyan', description: 'Red + cyan'},
          {name : 'green', description: 'Green'},
          {name : 'green_red-blue', description: 'Green + red, blue'},
          {name : 'green_red', description: 'Green + red'},
          {name : 'green_blue', description: 'Green + blue'},
          {name : 'green_magenta', description: 'Green + magenta'},
          {name : 'blue', description: 'Blue'},
          {name : 'blue_red-green', description: 'Blue + red, green'},
          {name : 'blue_red', description: 'Blue + red'},
          {name : 'blue_green', description: 'Blue + green'},
          {name : 'blue_yellow', description: 'Blue + yellow'},
          {name : 'greyscale', description: 'Greyscale'}
        ],
        palette : false,
        paletteSizes : {
          size : 'desktop',
          mobile: {
            canvasBxWidthSize: 297,
            canvasSize: 255,
            drawPixelSize: 1
          },
          desktop: {
            canvasBxWidthSize: 552,
            canvasSize: 510,
            drawPixelSize: 2
          },
        },
        
        colorsMemory : {
        	mem: [],
        	check: function(pColor){
        		var chk = false;
        		for(var c in this.mem){
        			if(this.mem[ c ] == pColor) chk = true;
        		}
        		return chk;
        	},
        	add: function( pColor ){
        		if(this.check( pColor ) === false){
        			this.mem.unshift( pColor );
        		}
        	},
        	remove: function(pColor){
        		var tmpMem = [];
        		for(var c in this.mem){
        			if(this.mem[ c ] != pColor) tmpMem.push( this.mem[ c ] );
        		}
        		this.mem = tmpMem;
        	}
        },
        
        adjustHueBy : 0,
        adjustSaturationBy : 0,
        adjustLightnessBy : 0,
        switchAdjustColorContentBx : 'block',
        cntMemoryOfColors: 0,

        zoomInColor : function(pColor){
          var bx = document.getElementById('zoomInColor');
          bx.style.backgroundColor = pColor;
          bx.innerHTML = pColor; 
        },

        clearColor : function( pColor ){
          var bx = document.getElementById( pColor );
          bx.innerHTML = '';
          bx.style.cssText = 'display: none;';
          var color = pColor.split('_');
          color = color[1];
          this.colorsMemory.remove( color );
        },
        
        tpl: {
        	colorInMemoryBx : function( pColor, pCntMemoryOfColors ){
                var colorMemoryBx = document.createElement('div');
                colorMemoryBx.style.cssText = 'background-color: '+pColor;
                colorMemoryBx.setAttribute('id', 'C'+ pCntMemoryOfColors +'_'+pColor);
                colorMemoryBx.setAttribute('class', 'colorInMemory');
               
      	          var clearColorMemoryBx = document.createElement('div');
      	          clearColorMemoryBx.style.cssText = 'float: right; padding: 4px 9px; cursor: pointer;';
      	          clearColorMemoryBx.setAttribute('onclick', 'hiJerzy.colorPalette.clearColor(\''+'C'+ pCntMemoryOfColors +'_'+pColor+'\')');
      	
      	          var img = document.createElement('img');
      	          img.setAttribute('src', 'source/img/close.png');
      	          clearColorMemoryBx.appendChild( img );
      	          colorMemoryBx.appendChild( clearColorMemoryBx );
               
                var colorCodeMemoryBx = document.createElement('div');
                colorCodeMemoryBx.style.cssText = 'float: right; padding: 9px 9px; font-family: "Major Mono Display", monospace;';
                var colorCode = document.createTextNode( pColor );
                colorCodeMemoryBx.appendChild( colorCode );
                colorMemoryBx.appendChild( colorCodeMemoryBx );
                
                return colorMemoryBx;
        	}
        },
        
        //rememberColor : function(pColor, pPixelData){
        rememberColor : function(pColor){
          var colorMemoryBx = this.tpl.colorInMemoryBx( pColor, this.cntMemoryOfColors );	
          
          var colorsMemBx = document.getElementById('mySetOfColors');
          colorsMemBx.insertBefore(colorMemoryBx, colorsMemBx.childNodes[0]);
          
          this.cntMemoryOfColors++;
          
          this.colorsMemory.add( pColor );
        },

        showPalette : function(pOpt){
          var z = 127;
          var title = '';
          var defCanvasId = 'myCanvas';
          var useCanvas = ( pOpt && pOpt.canvasId != undefined )? pOpt.canvasId : defCanvasId;
            
          // Set palette
          var paletteDropDown = document.getElementById("pallette");
          var setPalette = ( pOpt && pOpt.setPalette != undefined )? pOpt.setPalette : paletteDropDown.options[paletteDropDown.selectedIndex].value;
          // var setPaletteTxt =
          // paletteDropDown.options[paletteDropDown.selectedIndex].text;
          switch(setPalette){
              case 'red': z = false; break;
              case 'red_green-blue': z = document.getElementById( 'colorBx' ).value; break;
              case 'red_green': z = document.getElementById( 'colorBx' ).value; break;
              case 'red_blue': z = document.getElementById( 'colorBx' ).value; break;
              case 'red_cyan': z = false; break;
              case 'green': z = false; break;
              case 'green_red-blue': z = document.getElementById( 'colorBx' ).value; break;
              case 'green_red': z = document.getElementById( 'colorBx' ).value; break;
              case 'green_blue': z = document.getElementById( 'colorBx' ).value; break;
              case 'green_magenta': z = false; break;
              case 'blue': z = false; break;
              case 'blue_red-green': z = document.getElementById( 'colorBx' ).value; break;
              case 'blue_red': z = document.getElementById( 'colorBx' ).value; break;
              case 'blue_green': z = document.getElementById( 'colorBx' ).value; break;
              case 'blue_yellow': z = false; break;
          }
          
          var canvas = document.getElementById( useCanvas );
          if( canvas ){
              var ctx = canvas.getContext("2d");
              var posX = 0;
              var posY = 0;
              // ctx.globalAlpha = 0.99;
              // console.log('z: '+ z+' use palette: '+setPalette);

              // Prepare palette in size:
              var palettePixelSize = (this.paletteSizes.size == 'desktop')? this.paletteSizes.desktop.drawPixelSize : this.paletteSizes.mobile.drawPixelSize; 
              if(pOpt && pOpt.getPaletteImgInSize){
            	  //console.log('pOpt.getPaletteImgInSize : in action');
            	  palettePixelSize = this.paletteSizes[ pOpt.getPaletteImgInSize ].drawPixelSize 
              }
              //console.log('showPalette(): palettePixelSize = '+palettePixelSize);
              
              //document.getElementById('mainColorSliderTitle').innerHTML = 'Red';
              
              for(var y = 0; y <= 255; y++){
                for(var x = 0; x <= 255; x++){
                  var color = {r: 255, g: 255, b: 255}; 
                    switch(setPalette){
                        case 'red':       color = {r: 255, g: x, b: x}; break;
                        case 'red_green-blue':  color = {r: z, g: x, b: y}; break;
                        case 'red_green':     color = {r: z, g: x, b: 0}; break;
                        case 'red_blue':    color = {r: z, g: 0, b: x}; break;
                        case 'red_cyan':    color = {r: y, g: x, b: x}; break;
                        case 'green':       color = {r: x, g: 255, b: x}; break;
                        case 'green_red-blue':  color = {r: x, g: z, b: y}; break;
                        case 'green_red':   color = {r: x, g: z, b: 0}; break;
                        case 'green_blue':    color = {r: 0, g: z, b: x}; break;
                        case 'green_magenta': color = {r: x, g: y, b: x}; break;
                        case 'blue':      color = {r: x, g: x, b: 255}; break;
                        case 'blue_red-green':  color = {r: x, g: y, b: z}; break;
                        case 'blue_red':    color = {r: x, g: 0, b: z}; break;
                        case 'blue_green':    color = {r: 0, g: y, b: z}; break;
                        case 'blue_yellow':   color = {r: x, g: x, b: y}; break; // xxy
                        case 'greyscale':     color = {r: y, g: y, b: y}; break;
                    }
          
                    // Adjust Linghtness & Saturations
                    color = this.adjustColor( color );
                    ctx.fillStyle = 'rgb('+color.r+','+color.g+','+color.b+')';   
                    //ctx.fillRect(posX, posY, 2, 2);
                    ctx.fillRect(posX, posY, palettePixelSize, palettePixelSize);
                    //posX += 2; 
                    posX += palettePixelSize; 
                }
                posX = 0; 
                //posY += 2; 
                posY += palettePixelSize; 
              }
              
              canvas.onmousemove = function(event) { hiJerzy.colorPalette.zoomInCanvasColor(event) };
              canvas.onclick = function(event) { hiJerzy.colorPalette.rememberCanvasColor(event) };
              
              if(pOpt && pOpt.setPalette && pOpt.getPaletteImg){
                var img = new Image();
                img.id = "pic";
                img.setAttribute('title', setPalette);
                img.style.cssText = 'width: 100%; height: 100%';
                img.src = canvas.toDataURL();
                return img;
              }else if(pOpt && pOpt.setPalette && pOpt.getPaletteImgSrc){
                return canvas.toDataURL();
              }
          } 
        },

        adjustColor : function( pColor ){
          var adjColor = { r: 255, g: 255, b: 255 };
          var hsv = this.convert_rgb_hsv( pColor );
          // adjust hue: hue
          if(this.adjustHueBy != 0){
              hsv.hue = hsv.hue + this.adjustHueBy;
          }
            // adjust saturation: sat
          if(this.adjustSaturationBy != 0){
              hsv.sat = hsv.sat + this.adjustSaturationBy;
          }
          // adjust lightnes: val
          if(this.adjustLightnessBy != 0){
              hsv.val = hsv.val + this.adjustLightnessBy;
          }
          
          var colorOb = this.convert_hsv_rgb([hsv.hue, hsv.sat, hsv.val]);
          if(colorOb !== undefined){
              adjColor = { r: Math.round(colorOb[0]), g: Math.round(colorOb[1]), b: Math.round(colorOb[2]) };
          }
          return adjColor;
        },
        
        getCanvasPixedData : function(e){
          var canvas = document.getElementById("myCanvas");
          var pixelData = canvas.getContext('2d').getImageData(e.offsetX, e.offsetY, 1, 1).data;
          document.getElementById('canvasPixelData').innerHTML = 'R: ' + pixelData[0] + ', G: ' + pixelData[1] + ', B: ' + pixelData[2] + ', A: ' + pixelData[3];
          
          return pixelData;
        },
        
        componentToHex : function(c) {
          var hex = c.toString(16);
          return hex.length == 1 ? "0" + hex : hex;
        },

        rgbToHex : function(r, g, b) {
          return "#" + this.componentToHex(r) + this.componentToHex(g) + this.componentToHex(b);
        },
        
        zoomInCanvasColor : function(e){
          var pixelData = this.getCanvasPixedData(e);
          this.zoomInColor( this.rgbToHex( pixelData[0], pixelData[1], pixelData[2] ));
        },
        
        rememberCanvasColor : function(e){
          var pixelData = this.getCanvasPixedData(e);
          this.rememberColor( this.rgbToHex( pixelData[0], pixelData[1], pixelData[2] ), pixelData);
        },
        
        checkSpaceForCanvas : function(){
          var tmpSize = this.paletteSizes.size;
          this.paletteSizes.size = (hiJerzy.page.x < 600)? 'mobile' : 'desktop';
          var needRefresh = (tmpSize != this.paletteSizes.size)?  true : false;
          return needRefresh; 
        },
        
        switchAdjustColorContentDisplay : function(){
          var switchContentBx = document.getElementById('adjustColorContentBx');
          this.switchAdjustColorContentBx = (this.switchAdjustColorContentBx == 'block')? 'none' : 'block';
          switchContentBx.style.display = this.switchAdjustColorContentBx;
          // Switch adjust icon
          document.getElementById('adjustSwitchIcon').src = (this.switchAdjustColorContentBx == 'block')? 'source/img/display_off.png' : 'source/img/display_on.png';
        },
        
        view : {
          loaded : false,
          loadedContent : {
              gallery : false,
              colorPalette : false
          },
          wordForUserBxId : 'wordForUser', 
          wordForUser : 'choose your color palette',
          refreshWordForUser : function(){
            document.getElementById( this.wordForUserBxId ).innerHTML = this.wordForUser;
          }
        },
        
        views : function(){
          var viewBx = document.getElementById('bodyBx');
          
          if(this.palette == false){
            // View of: selecting a palette
            viewBx.innerHTML = ''; // clear content
            
            // Set word for user
            this.view.wordForUser = 'choose color palette';
            this.view.refreshWordForUser();
            
            // Loading view
            if(this.view.loaded == 'gallery'){
            	viewBx.appendChild( this.view.loadedContent.gallery );
            }else{
            	// Create gallery
            	var gallery = document.createElement('div');
	            for(var p in this.palettes){
		              var paletteIcoBx = document.createElement('div');
		              paletteIcoBx.className = 'paletteBx';
		              paletteIcoBx.setAttribute('title', this.palettes[ p ].description);
		              paletteIcoBx.setAttribute('onclick', 'hiJerzy.colorPalette.palette = "'+this.palettes[ p ].name+'"; hiJerzy.colorPalette.views();');
		                var paletteIcoBxContent = document.createElement('div');
		                paletteIcoBxContent.className = 'paletteBxContent';
		                
		                // Get palette image
		                var img = this.showPalette({
		                  setPalette: this.palettes[ p ].name,
		                  getPaletteImg: true,
		                  getPaletteImgSrc: false,
		                  getPaletteImgInSize: 'desktop',
		                  canvasId: 'hiddenTmpCanvas'
		                  });
		                paletteIcoBxContent.appendChild( img );
		
		                // Name
		                var namePaletteBx = document.createElement('div');
		                namePaletteBx.style.cssText = 'padding: 5px 0px; text-align: right';
		                namePaletteBx.appendChild( document.createTextNode( this.palettes[ p ].description ) );
		                paletteIcoBxContent.appendChild( namePaletteBx );
		                
		              paletteIcoBx.appendChild( paletteIcoBxContent );
		              gallery.appendChild( paletteIcoBx );
		       }
	           
	           // Insert gallery in to view box 
	           viewBx.appendChild( gallery );
	            
	           // Store created gallery for the future
	           this.view.loaded = 'gallery';
	           this.view.loadedContent.gallery = gallery;
            }
            
          }else{
              // View of: selected palette
            viewBx.innerHTML = '';
            
            // Set word for user
            this.view.wordForUser = 'click on color palette ...';
            this.view.refreshWordForUser();

            var paletteCanvasBxWidthSize = (this.paletteSizes.size == 'desktop')? this.paletteSizes.desktop.canvasBxWidthSize : this.paletteSizes.mobile.canvasBxWidthSize;
            var paletteCanvasSize = (this.paletteSizes.size == 'desktop')? this.paletteSizes.desktop.canvasSize : this.paletteSizes.mobile.canvasSize;
            var selectedPaletteBx = document.createElement('div');
            selectedPaletteBx.className = 'selectedPaletteBx';
                var canvasBx = document.createElement('div');
                canvasBx.className = 'myCanvasBx';
                canvasBx.style.cssText = 'width: '+paletteCanvasBxWidthSize+'px';
                  var canvas = document.createElement('canvas');
                  canvas.setAttribute('id', 'myCanvas');
                  canvas.setAttribute('width', paletteCanvasSize);
                  canvas.setAttribute('height', paletteCanvasSize);
                  canvasBx.appendChild( canvas );
                selectedPaletteBx.appendChild( canvasBx );

                // Adjust color box
                var adjustColorBx = document.createElement('div');
                adjustColorBx.setAttribute('id', 'adjustColorBx');
                
                	var adjustSwitchBx = document.createElement('div');
                	adjustSwitchBx.className = 'titleBx-underline';
                	adjustSwitchBx.setAttribute('onclick', 'hiJerzy.colorPalette.switchAdjustColorContentDisplay()');
                	adjustSwitchBx.appendChild( document.createTextNode('Adjust color settings') );
                	var iconSwitch = (this.switchAdjustColorContentBx == 'none')? 'on' : 'off';
                  var adjustSwitchIcon = document.createElement('img');
                	adjustSwitchIcon.style.cssText = 'float: right';
                	adjustSwitchIcon.setAttribute('id', 'adjustSwitchIcon');
                	adjustSwitchIcon.setAttribute('src', 'source/img/display_'+iconSwitch+'.png');
                	adjustSwitchBx.appendChild( adjustSwitchIcon );
                	adjustColorBx.appendChild( adjustSwitchBx );
                
                	var adjustColorContentBx = document.createElement('div');
                	adjustColorContentBx.setAttribute('id', 'adjustColorContentBx');
                	adjustColorContentBx.style.display = this.switchAdjustColorContentBx;
                	
                		// Main color
                	    
                	    var mainColor = '...';
                	    adjustColorContentBx.appendChild( document.createTextNode('Main color '+ mainColor) );
                	    var mainColorName = document.createElement('span');
                	    mainColorName.setAttribute( 'id', 'mainColorSliderTitle' );
                	    mainColorName.appendChild( document.createTextNode( mainColor ) );
                	    adjustColorContentBx.appendChild( mainColorName );
    	                var color = document.createElement('div');
    	                color.setAttribute('id', 'color');
    	                adjustColorContentBx.appendChild( color )
    	                
    	                adjustColorContentBx.appendChild( document.createTextNode('Hue') );
    	                var hue = document.createElement('div');
    	                hue.setAttribute('id', 'hue');
    	                adjustColorContentBx.appendChild( hue )
    	                  
    	                adjustColorContentBx.appendChild( document.createTextNode('Saturation') );
    	                var saturation = document.createElement('div');
    	                saturation.setAttribute('id', 'saturation');
    	                adjustColorContentBx.appendChild( saturation )
    	
    	                adjustColorContentBx.appendChild( document.createTextNode('Lightness') );
    	                var lightness = document.createElement('div');
    	                lightness.setAttribute('id', 'lightness');
    	                adjustColorContentBx.appendChild( lightness )
    	                
    	                adjustColorBx.appendChild( adjustColorContentBx )
	                
	                selectedPaletteBx.appendChild( adjustColorBx )
                
              viewBx.appendChild( selectedPaletteBx );
              
            var selectedPaletteMenuBx = document.createElement('div');
            selectedPaletteMenuBx.className = 'selectedPaletteMenuBx';
                
            	var selectedPaletteMenuHeaderBx = document.createElement('div');
            	selectedPaletteMenuHeaderBx.setAttribute('id', 'selectedPaletteMenuHeaderBx');
	            	var back = document.createElement('img');
	                back.setAttribute('onclick','hiJerzy.colorPalette.palette = false; hiJerzy.colorPalette.views();');
	                back.setAttribute('src','source/img/appbar.tiles.nine.png');
	                back.style.cssText = 'float:right; margin-bottom:17px; cursor: pointer';
	                selectedPaletteMenuHeaderBx.appendChild( back );
	              
	                  var title = document.createElement('div');
	                title.className = 'titlePaletteMenu';
	                title.appendChild( document.createTextNode( 'Palette:' ) );
	                selectedPaletteMenuHeaderBx.appendChild( title );
	            selectedPaletteMenuBx.appendChild( selectedPaletteMenuHeaderBx );

                var select = document.createElement('select');
                select.className = 'selectPalette';
                select.setAttribute('id', 'pallette');
                select.setAttribute('onchange', 'hiJerzy.colorPalette.showPalette()');
                // Build list of paletts
                for(var p in this.palettes){
                  var opt = document.createElement('option');
                  opt.setAttribute('value', this.palettes[ p ].name );
                  if(this.palette == this.palettes[ p ].name) opt.setAttribute('selected', true );
                  opt.appendChild( document.createTextNode( this.palettes[ p ].description ) );
                  select.appendChild( opt );
                }
                selectedPaletteMenuBx.appendChild( select );

                var zoomInBx = document.createElement('div');
                zoomInBx.setAttribute('id', 'zoomInColor');
                selectedPaletteMenuBx.appendChild( zoomInBx )
                
                var mySetOfColors = document.createElement('div');
                mySetOfColors.setAttribute('id', 'mySetOfColors');
                    // Get colors from the user memory
	                if(this.colorsMemory.mem.length){
	                	for(var c in this.colorsMemory.mem){
		                	var tplColorMemoryBx = this.tpl.colorInMemoryBx( this.colorsMemory.mem[ c ], c );
		                	mySetOfColors.appendChild( tplColorMemoryBx );
		                }
	                }
                selectedPaletteMenuBx.appendChild( mySetOfColors )

                var canvasPixelData = document.createElement('div');
                canvasPixelData.setAttribute('id', 'canvasPixelData');
                selectedPaletteMenuBx.appendChild( canvasPixelData )
                
              viewBx.appendChild( selectedPaletteMenuBx );

            // Init: sliders and palette
                $( function() {
                  function hexFromRGB(r, g, b) {
                    var hex = [
                      r.toString( 16 ),
                      g.toString( 16 ),
                      b.toString( 16 )
                    ];
                    $.each( hex, function( nr, val ) {
                      if ( val.length === 1 ) {
                        hex[ nr ] = "0" + val;
                      }
                    });
                    return hex.join( "" ).toUpperCase();
                  }

                  function refreshColor() {
                      var color = $( "#color" ).slider( "value" );  
                      $( "#colorBx" ).val( color );  

                      // Refresh palette
                      hiJerzy.colorPalette.showPalette();
                  }

                  function refreshHue() {
                      var hue = $( "#hue" ).slider( "value" );  
                      $( "#hueBx" ).val( hue );
                      hiJerzy.colorPalette.adjustHueBy = hue;

                      // Refresh palette
                      hiJerzy.colorPalette.showPalette();
                  }

                  function refreshSaturation() {
                      var saturation = $( "#saturation" ).slider( "value" );  
                      $( "#saturationBx" ).val( saturation );
                      hiJerzy.colorPalette.adjustSaturationBy = saturation;  

                      // Refresh palette
                      hiJerzy.colorPalette.showPalette();
                  }

                  function refreshLightness() {
                    var lightness = $( "#lightness" ).slider( "value" );  
                    $( "#lightnessBx" ).val( lightness );
                    hiJerzy.colorPalette.adjustLightnessBy = lightness;  

                    // Refresh palette
                    hiJerzy.colorPalette.showPalette();
                  }

                  
                    $( "#color" ).slider({ 
                      orientation: "horizontal",
                      range: "min",
                      max: 255,
                      value: 127,
                      slide: refreshColor,
                      change: refreshColor
                    });
                    $( "#color" ).slider( "value", 127 );

                    $( "#hue" ).slider({ 
                      orientation: "horizontal",
                      range: "min",
                      min: 0,
                      max: 360,
                      value: 0,
                      slide: refreshHue,
                      change: refreshHue
                    });
                    $( "#hue" ).slider( "value", 0 );

                    $( "#saturation" ).slider({ 
                        orientation: "horizontal",
                        // range: "min",
                        min: -100,
                        max: 100,
                        value: 0,
                        slide: refreshSaturation,
                        change: refreshSaturation
                    });
                    $( "#saturation" ).slider( "value", 0 );
                    
                    $( "#lightness" ).slider({ 
                        orientation: "horizontal",
                        // range: "min",
                        min: -100,
                        max: 100,
                        value: 0,
                        slide: refreshLightness,
                        change: refreshLightness
                    });
                    $( "#lightness" ).slider( "value", 0 );
                } );
                  
                      
            }
        },        
        
        /*
         * Copyright (c) 2011-2016 Heather Arthur <fayearthur@gmail.com>
         * 
         * Permission is hereby granted, free of charge, to any person obtaining a copy
         * of this software and associated documentation files (the "Software"), to deal
         * in the Software without restriction, including without limitation the rights
         * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
         * copies of the Software, and to permit persons to whom the Software is
         * furnished to do so, subject to the following conditions:
         * 
         * The above copyright notice and this permission notice shall be included in
         * all copies or substantial portions of the Software.
         * 
         * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
         * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
         * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
         * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
         * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
         * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
         * SOFTWARE.
         * 
         * Functions: convert_hsv_rgb(), convert_rgb_hsv().
         */
         convert_rgb_hsv : function( color ) {
                let rdif;
                let gdif;
                let bdif;
                let h;
                let s;
                const r = color.r / 255;
                const g = color.g / 255;
                const b = color.b / 255;
                const v = Math.max(r, g, b);
                const diff = v - Math.min(r, g, b);
                const diffc = function (c) {
                  return (v - c) / 6 / diff + 1 / 2;
                };
                if (diff === 0) {
                  h = 0;
                  s = 0;
                } else {
                  s = diff / v;
                  rdif = diffc(r);
                  gdif = diffc(g);
                  bdif = diffc(b);
                  if (r === v) {
                    h = bdif - gdif;
                  } else if (g === v) {
                    h = (1 / 3) + rdif - bdif;
                  } else if (b === v) {
                    h = (2 / 3) + gdif - rdif;
                  }
                  if (h < 0) {
                    h += 1;
                  } else if (h > 1) {
                    h -= 1;
                  }
                }
                return {
                 hue: h * 360,
                 sat: s * 100,
                 val: v * 100
                };
         },
  
         convert_hsv_rgb : function(hsv) {
              const h = hsv[0] / 60;
              const s = hsv[1] / 100;
              let   v = hsv[2] / 100;
              const hi = Math.floor(h) % 6;
              const f = h - Math.floor(h);
              const p = 255 * v * (1 - s);
              const q = 255 * v * (1 - (s * f));
              const t = 255 * v * (1 - (s * (1 - f)));
              v *= 255;
              switch (hi) {
                case 0:
                  return [v, t, p];
                case 1:
                  return [q, v, p];
                case 2:
                  return [p, v, t];
                case 3:
                  return [p, q, v];
                case 4:
                  return [t, p, v];
                case 5:
                  return [v, p, q];
              }
         }  
        
      },
      // ColorPallet : Object - ends
      
      testScreenDomId: 'testScreen'
    }; // Object for public APIs
    
    var supports = !!document.querySelector && !!root.addEventListener; // Feature test
    var settings; // Placeholder variables

    // Default settings
    var defaults = {
      prop: 1,
      initClass: 'js-hiJerzy',
      callbackBefore: function () {},
      callbackAfter: function () {}
    };


    //
    // Methods
    //

    /**
     * Handle events
     * @private
     */
    var clickEventHandler = function (event) {
      // Do something on event
      //alert(' you clicked ');
      return true;
    };
    
    var resizeEventHandler = function (event){
      // Do something on event
      hiJerzy.checkPageSize();
      hiJerzy.displayPageSize();
      
      var chkResizeNeeded = hiJerzy.colorPalette.checkSpaceForCanvas();
      if( chkResizeNeeded ){  
        hiJerzy.colorPalette.views();
      }

    }

    /**
     * Destroy the current initialization.
     * @public
     */
    hiJerzy.destroy = function () {

      // If plugin isn't already initialized, stop
      if ( !settings ) return;

      // Remove init class for conditional CSS
      document.documentElement.classList.remove( settings.initClass );

      // @todo Undo any other init functions...

      // Remove event listeners
      document.removeEventListener('click', clickEventHandler, false);

      // Reset variables
      settings = null;

    };
    
    hiJerzy.checkPageSize = function(){
        if(window.innerHeight && window.scrollMaxY){
          hiJerzy.page.scroll.x = window.innerWidth + window.scrollMaxX;
          hiJerzy.page.scroll.y = window.innerHeight + window.scrollMaxY;
        }else if(document.body.scrollHeight > document.body.offsetHeight){ // all but Explorer, Mac
          hiJerzy.page.scroll.x = document.body.scrollWidth;
          hiJerzy.page.scroll.y = document.body.scrollHeight;
        }else{ // Explorer Mac...would also work in Explorer 6 Strict, Mozilla and Safari
          hiJerzy.page.scroll.x = document.body.offsetWidth;
          hiJerzy.page.scroll.y = document.body.offsetHeight;
        }

        if(self.innerHeight){ // all except Explorer
          hiJerzy.page.window.x = (document.documentElement.clientWidth)? document.documentElement.clientWidth : self.innerWidth;
          hiJerzy.page.window.y = self.innerHeight;
        }else if(document.documentElement && document.documentElement.clientHeight){ // Explorer 6 Strict Mode
          hiJerzy.page.window.x = document.documentElement.clientWidth;
          hiJerzy.page.window.y = document.documentElement.clientHeight;
        }else if(document.body){ // other Explorers
          hiJerzy.page.window.x = document.body.clientWidth;
          hiJerzy.page.window.y = document.body.clientHeight;
        }

        // for small pages with total height less then height of the viewport
        hiJerzy.page.y = (hiJerzy.page.scroll.y < hiJerzy.page.window.y)? hiJerzy.page.window.y : hiJerzy.page.scroll.y;

        // for small pages with total width less then width of the viewport
        hiJerzy.page.x = (hiJerzy.page.scroll.x < hiJerzy.page.window.x)? hiJerzy.page.scroll.x : hiJerzy.page.window.x;
        
        hiJerzy.page.orientation = (hiJerzy.page.y < hiJerzy.page.x)? 'landscape' : 'portrait';
    }

    /**
     * Initialize Plugin
     * @public
     * @param {Object} options User settings
     */
    hiJerzy.init = function ( options ) {

      // feature test
      if ( !supports ) return;

      // Destroy any existing initializations
      hiJerzy.destroy();

      // Merge user options with defaults
      settings = buoy.extend( defaults, options || {} );

      // Add class to HTML element to activate conditional CSS
      document.documentElement.classList.add( settings.initClass );

      // Start doing things
      hiJerzy.checkPageSize();
      hiJerzy.colorPalette.checkSpaceForCanvas();
      hiJerzy.colorPalette.views();
      

      // Listen for click events
      document.addEventListener('click', clickEventHandler, true);

      // Listen for click events
      window.addEventListener('resize', resizeEventHandler, true);

    };
    
    //
    // Public APIs
    //
    hiJerzy.getMyProtectedVar = function(){
      return myProtectedVar;
    }
    
    hiJerzy.displayPageSize = function(){
      var screen = document.getElementById( hiJerzy.testScreenDomId );
      //console.log('Looking for test screin ID: '+hiJerzy.testScreenDomId );
      if(screen){
        screen.innerHTML = '<br>hiJerzy.page = '+hiJerzy.page.x + ', '+hiJerzy.page.y
        +'<br>hiJerzy.page.scroll = '+hiJerzy.page.scroll.x + ', '+hiJerzy.page.scroll.y
        +'<br>hiJerzy.page.window = '+hiJerzy.page.window.x + ', '+hiJerzy.page.window.y
        +'<br>hiJerzy.page.orientation = '+hiJerzy.page.orientation;
      }else{
        /*console.log('Test screen is not defined');
        console.log('hiJerzy.page = '+hiJerzy.page.x + ', '+hiJerzy.page.y);
        console.log('hiJerzy.page.scroll = '+hiJerzy.page.scroll.x + ', '+hiJerzy.page.scroll.y);
        console.log('hiJerzy.page.window = '+hiJerzy.page.window.x + ', '+hiJerzy.page.window.y);
        console.log('hiJerzy.page.orientation = '+hiJerzy.page.orientation);
        */
      }
    }

    return hiJerzy;

})