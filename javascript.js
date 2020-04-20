
	mapboxgl.accessToken = 'pk.eyJ1Ijoic3ZlbnRleSIsImEiOiJjazk1djAzZ2IwMmQ2M2Z0YzlocjFwNGh0In0.9HbUhvs2jWClA1vkLYutzg';
    var map = new mapboxgl.Map({
        style: 'mapbox://styles/mapbox/light-v10',
        center: [4.656162, 52.435437],
        zoom: 17.5,
        pitch: 45,
        bearing: -17.6,
        container: 'map',
        antialias: true
    });

    // The 'building' layer in the mapbox-streets vector source contains building-height
    // data from OpenStreetMap.
    map.on('load', function() {
        // Insert the layer beneath any symbol layer.
        var layers = map.getStyle().layers;

        var labelLayerId;
        for (var i = 0; i < layers.length; i++) {
            if (layers[i].type === 'symbol' && layers[i].layout['text-field']) {
                labelLayerId = layers[i].id;
                break;
            }
        }

        map.addLayer(
            {
                'id': '3d-buildings',
                'source': 'composite',
                'source-layer': 'building',
                'filter': ['==', 'extrude', 'true'],
                'type': 'fill-extrusion',
                'minzoom': 15,
                'paint': {
                    'fill-extrusion-color': '#aaa',

                    // use an 'interpolate' expression to add a smooth transition effect to the
                    // buildings as the user zooms in
                    'fill-extrusion-height': [
                        'interpolate',
                        ['linear'],
                        ['zoom'],
                        15,
                        0,
                        15.05,
                        ['get', 'height']
                    ],
                    'fill-extrusion-base': [
                        'interpolate',
                        ['linear'],
                        ['zoom'],
                        15,
                        0,
                        15.05,
                        ['get', 'min_height']
                    ],
                    'fill-extrusion-opacity': 0.6
                }
            },
            labelLayerId
        );
    });

map.on('load', function() {
        map.loadImage( 'https://github.com/18121837/Challenge-3/blob/master/images/marker.png',
            function(error, image) {
                if (error) throw error;
                map.addImage('landing', image);
                map.addSource('point', {
                    'type': 'geojson',
                    'data': {
                        'type': 'FeatureCollection',
                        'features': [
                            {
                                'type': 'Feature',
                                'geometry': {
                                    'type': 'Point',
                                    'coordinates': [4.656162, 52.435437]
                                }
                            }
                        ]
                    }
                });
                map.addLayer({
                    'id': 'points',
                    'type': 'symbol',
                    'source': 'point',
                    'layout': {
                        'icon-image': 'landing',
                        'icon-size': 0.25
                    }
                });
            }
        );
    });

//Nieuwe api komt hierna//

var input = document.querySelector(".inputTekst");
var knop = document.querySelector(".knop");
var temperatuur = document.querySelector(".temperatuur");
var beschrijving = document.querySelector(".beschrijving");
var locatie = document.querySelector(".locatie");
var icoon = document.querySelector(".icoon");

knop.addEventListener('click',function(name){
    fetch('https://api.openweathermap.org/data/2.5/weather?q='+input.value+'&appid=1a9097c4be951774bbb2ad59ca2ea69f')
    .then(response => response.json())
    .then(data => {
        var locatieValue = data['name'];
        var temperatuurValue = data['main']['temp'];
        var beschrijvingValue = data['weather'][0]['description'];
        var icoonValue = data['weather'][0]['icon'];
    
        locatie.innerHTML = locatieValue;
        temperatuur.innerHTML = Math.round(temperatuurValue - 272.15) + " -° C";
        beschrijving.innerHTML = beschrijvingValue;
        icoon.innerHTML = `<img src="icons/${icoonValue}.png"/>`;
    
    })

    .catch(err => alert("Stad niet herkend."))

})