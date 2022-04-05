const html_script_mapdraw_linestring = `
<!DOCTYPE html>
<html>
<head>
	
	<title>Quick Start - Leaflet</title>
	<meta charset="utf-8" />
	<meta name="viewport" content="initial-scale=1.0">
	
	<link rel="shortcut icon" type="image/x-icon" href="docs/images/favicon.ico" />
    <link rel="stylesheet" href="https://unpkg.com/leaflet@1.6.0/dist/leaflet.css" integrity="sha512-xwE/Az9zrjBIphAcBb3F6JVqxf46+CDLwfLMHloNu6KEQCAWi6HcDUbeOfBIptF7tcCzusKFjFw2yuvEpDL9wQ==" crossorigin=""/>
    <script src="https://unpkg.com/leaflet@1.6.0/dist/leaflet.js" integrity="sha512-gZwIG9x3wUXg2hdXF6+rVkLF/0Vi9U8D2Ntg4Ga5I5BZpVkVxlJWbSQtXPSiUTtC0TjtGOmxa1AJPuV0CPthew==" crossorigin=""></script>
	<script src="https://unpkg.com/jquery@3.6.0/dist/jquery.js" integrity="sha512-gZwIG9x3wUXg2hdXF6+rVkLF/0Vi9U8D2Ntg4Ga5I5BZpVkVxlJWbSQtXPSiUTtC0TjtGOmxa1AJPuV0CPthew==" crossorigin=""></script>
	<script src="https://ajax.googleapis.com/ajax/libs/jquery/3.2.1/jquery.min.js"></script>
	<script src="https://unpkg.com/leaflet-draw@1.0.2/dist/leaflet.draw.js"></script>
	<link rel="stylesheet" href="https://unpkg.com/leaflet-draw@1.0.2/dist/leaflet.draw.css" />
	<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@4.0.0/dist/css/bootstrap.min.css" integrity="sha384-Gn5384xqQ1aoWXA+058RXPxPg6fy4IWvTNh0E263XmFcJlSAwiGgFAW/dAiS6JXm" crossorigin="anonymous">
</head>
<style>										<!--tạo style cho trang web-->
	html, body {
		height: 100%;
		width: 100%;
		margin: 0;
		padding: 0;
	}
	#map { 
		height: 100%;
		width: 100%;
	}
	html {
		height: 100%;
	}
</style>
<body style="padding: 0; margin: 0">
<script src="https://unpkg.com/leaflet-draw@0.4.0/dist/leaflet.draw.js"></script> 
<script src="https://leaflet.github.io/Leaflet.draw/src/Leaflet.Draw.Event.js"></script> 
<link rel="stylesheet" href="https://unpkg.com/leaflet-draw@0.4.0/dist/leaflet.draw.css"> 
<div id="mapid" style="width: 100%; height: 100%;"></div>
<script>
	var mymap = L.map('mapid').setView([10.030249,105.772097], 17);
	var osm = L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw', {
		maxZoom: 18,
		attribution: 'Map data &copy; OpenStreetMap contributors, ',
		id: 'mapbox/streets-v11'
	})
	osm.addTo(mymap);

	//khai báo featuregroup để vẽ
	var drawnItems = L.featureGroup().addTo(mymap);	
	
	//Định các style cho point, line và polygon
	var lineStyle={color: "blue", weight: 5};
	var polygonStyle={color: "pink", fillColor: "black", weight: 4};
		
	//Các option cho công cụ vẽ
	var options = {
		position: 'topleft',
		draw: {
			polygon: false,
			polyline: true,
			circle:false,
			rectangle:false,
			marker:false,
		},
		edit: {
			featureGroup: drawnItems,	//REQUIRED!!
			delete:true,
			edit:true
		}
	};
    var drawControl = new L.Control.Draw(options).addTo(mymap);
	
	var k=1;
	//Khi vẽ thì thêm vào lớp drawnItems
	function showText(e) {	
		if(k>=2) alert('Chỉ được tạo một điểm !!!');
		else{
			var layer = e.layer;
			layer.addTo(drawnItems);
			sendDataToReactNativeApp();
			k++;
		}
	}

	//Khi một đối tượng được vẽ
	mymap.on(L.Draw.Event.CREATED, showText);	  

	function editText(e) {
		let layers = e.layers;
		layers.eachLayer(function(layer) {
			layer.addTo(drawnItems);			
		});
		sendDataToReactNativeApp();
	}

	//Khi xóa thì bớt vào lớp drawnItems
	mymap.on('draw:edited', editText);

	function delText(e) {
		var layers = e.layers;		
		layers.eachLayer(function (layer) {
			drawnItems.removeLayer(layer);
		});
		sendDataToReactNativeApp();
		k--;
	}
	//Khi xóa thì bớt lớp drawnItems
	mymap.on('draw:deleted', delText);

	const sendDataToReactNativeApp = async () => {
		var collection = drawnItems.toGeoJSON();
		var geojson1 = JSON.stringify(collection, null, 2);	
		window.ReactNativeWebView.postMessage(geojson1);
	};
	</script>
	<script src="https://code.jquery.com/jquery-3.2.1.slim.min.js" integrity="sha384-KJ3o2DKtIkvYIK3UENzmM7KCkRr/rE9/Qpg6aAZGJwFDMVNA/GpGFF93hXpG5KkN" crossorigin="anonymous"></script>
<script src="https://cdn.jsdelivr.net/npm/popper.js@1.12.9/dist/umd/popper.min.js" integrity="sha384-ApNbgh9B+Y1QKtv3Rn7W3mgPxhU9K/ScQsAP7hUibX39j7fakFPskvXusvfa0b4Q" crossorigin="anonymous"></script>
<script src="https://cdn.jsdelivr.net/npm/bootstrap@4.0.0/dist/js/bootstrap.min.js" integrity="sha384-JZR6Spejh4U02d8jOt6vLEHfe/JQGiRRSQQxSfFWpi1MquVdAyjUar5+76PVCmYl" crossorigin="anonymous"></script>
</body>
</html>
`;

export default html_script_mapdraw_linestring;
