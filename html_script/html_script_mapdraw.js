const html_script = `
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
	#geojsontext1 {
		margin-left: auto;
		margin-right: auto;
		margin-top: 5px;
		width: 100%;
		height: 30%;
	}
	// #submit1 {
	// 	background-color: #16a085; /* Green */
	// 	border: none;
	// 	color: white;
	// 	padding: 5px 10px;
	// 	text-align: center;
	// 	text-decoration: none;
	// 	font-size: 20px;
	// }
</style>
<body style="padding: 0; margin: 0">
<script src="https://unpkg.com/leaflet-draw@0.4.0/dist/leaflet.draw.js"></script> 
<script src="https://leaflet.github.io/Leaflet.draw/src/Leaflet.Draw.Event.js"></script> 
<link rel="stylesheet" href="https://unpkg.com/leaflet-draw@0.4.0/dist/leaflet.draw.css"> 
<div id="mapid" style="width: 100%; height: 66%;"></div>
<textarea id="geojsontext1"></textarea>
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

	//Các option cho công cụ vẽ
	var options = {
		position: 'topleft',			//default 'topleft'
		draw: {
			polyline: {
				shapeOptions: {
					color: '#f357a1',
					weight: 5
				},
				metric:true				//default true là met; false là foot
			},
			polygon: {
				shapeOptions: {
					color: '#bada55'
				},
				showArea:true,			//default false
			},
			rectangle: {
				shapeOptions: {
					color: 'green',
					weight:2,
					fillColor:'blue',
					fillOpacity:0.2		//độ mờ, default 0.2
				}
			},
			circle: false, 					
			circlemarker: false, 		// Turns off this drawing tool
		},
		edit: {
			featureGroup: drawnItems,	//REQUIRED!!
			delete:true,
			edit:true
		}
	};
	var drawControl = new L.Control.Draw(options).addTo(mymap);
	let geojson1,geojson2;

	//Khi vẽ thì thêm vào lớp drawnItems
	function showText(e) {	
		var layer = e.layer;
	    layer.addTo(drawnItems);
		//collection dạng object
		var collection = drawnItems.toGeoJSON();	
	   	geojson1 = JSON.stringify(collection, null, 2);	
	   	$("#geojsontext1").val(geojson1);  
	}
	
	//Khi một đối tượng được vẽ
	mymap.on(L.Draw.Event.CREATED, showText);	  

	function editText(e) {
		let layers = e.layers;
		layers.eachLayer(function(layer) {
			layer.addTo(drawnItems);			
		});
		var collection= drawnItems.toGeoJSON();	
	   	geojson1 = JSON.stringify(collection, null, 2);	
	   	$("#geojsontext1").val(geojson1);  
	}

	//Khi xóa thì bớt vào lớp drawnItems
	mymap.on('draw:edited', editText);

	function delText(e) {
		var layers = e.layers;		
		layers.eachLayer(function (layer) {
			drawnItems.removeLayer(layer);
		});
		var collection= drawnItems.toGeoJSON();	
	   	geojson1 = JSON.stringify(collection, null, 2);	
	   	$("#geojsontext1").val(geojson1);  
	}
	//Khi xóa thì bớt vào lớp drawnItems
	mymap.on('draw:deleted', delText);
	
	</script>
</body>
</html>
`;

export default html_script;
