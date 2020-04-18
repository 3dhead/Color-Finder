<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Color Palette</title>
  <link rel="stylesheet" href="source/css/main.css">
  <link rel="stylesheet" href="//code.jquery.com/ui/1.12.1/themes/base/jquery-ui.css">
  <link rel="stylesheet" href="/resources/demos/style.css">
  <link href="https://fonts.googleapis.com/css?family=Fahkwang|Major+Mono+Display" rel="stylesheet">  
  <script src="https://code.jquery.com/jquery-1.12.4.js"></script>
  <script src="https://code.jquery.com/ui/1.12.1/jquery-ui.js"></script>
  <script src="source/js/jquery.ui.touch-punch.min.js"></script>
  <script src="source/js/main.js"></script>
  <script src="source/js/buoy.js"></script>
  <script src="source/js/hi_jerzy.js"></script>
</head>
<body  style="border:0;">
	<canvas id="hiddenTmpCanvas" width="510" height="510"></canvas>
	<input type="hidden" name="color" value="127" id="colorBx" class="colorInputBx"></input>
	<input type="hidden" name="hue" value="0" id="hueBx" class="colorInputBx"></input> 
	<input type="hidden" name="saturation" value="0" id="saturationBx" class="colorInputBx"></input> 
	<input type="hidden" name="lightness" value="0" id="lightnessBx" class="colorInputBx"></input> 

	<div id="headerBx">
		<h1 class="headerH1" onclick="hiJerzy.colorPalette.palette = false; hiJerzy.colorPalette.views();">Color Finder</h1>
		<h3 id="wordForUser" class="headerH3"> choose your color palette</h3>
	</div>

	<div id="bodyBx"></div>	

	<script>
	</script>
</body>
</html>