# Challenge-3

Welkom bij de pagina van SpaceX - The arrival
Hieronder zal een korte uitleg komen van hoe ik mijn werk heb gerealiseerd.

## Uitleg

Allereerst heb ik uiteraard de html gemaakt met daarin de structuur om mijn webpagina te realiseren. Ik heb ervoor gekozen om een Map en een weer API te gebruiken om duidelijk aan te geven waar geland kan worden.

```HTML
<main>
        <aside id="weather">
            <div class="container">
                <div class="input">
                    <input type="text" class="inputTekst">
                    <input type="submit" class="knop" value="Search"> </div>
                <div class="weathercontainer">
                    <div class="icoon"><img id="weerIcoon" src="icons/unknown.png"></div>
                    <div class="temperatuur">Temperatuur</div>
                    <div class="beschrijving">Beschrijving</div>
                    <div class="locatie">Locatie</div>
                </div>
            </div>
        </aside>
        <div id="map"></div>
</main>
```

Zoals hierboven te zien is ziet u dat ik een simpele html structuur heb gebruikt met een main en daarin een aside en daarnaast een div waarin de map komt te staan.

```JavaScript

mapboxgl.accessToken = 'pk.eyJ1Ijoic3ZlbnRleSIsImEiOiJjazk1djAzZ2IwMmQ2M2Z0YzlocjFwNGh0In0.9HbUhvs2jWClA1vkLYutzg';
var map = new mapboxgl.Map({
    style: 'mapbox://styles/mapbox/light-v10'
    , center: [lang, lat]
    , zoom: 17.5
    , pitch: 45
    , bearing: -17.6
    , container: 'map'
    , antialias: true
});
map.on('load', function () {
    var layers = map.getStyle().layers;
    var labelLayerId;
    for (var i = 0; i < layers.length; i++) {
        if (layers[i].type === 'symbol' && layers[i].layout['text-field']) {
            labelLayerId = layers[i].id;
            break;
        }
    }
    map.addLayer({
        'id': '3d-buildings'
        , 'source': 'composite'
        , 'source-layer': 'building'
        , 'filter': ['==', 'extrude', 'true']
        , 'type': 'fill-extrusion'
        , 'minzoom': 15
        , 'paint': {
            'fill-extrusion-color': '#aaa'
            , 'fill-extrusion-height': [
                        'interpolate'
                        , ['linear']
                        , ['zoom']
                        , 15
                        , 0
                        , 15.05
                        , ['get', 'height']
                    ]
            , 'fill-extrusion-base': [
                        'interpolate'
                        , ['linear']
                        , ['zoom']
                        , 15
                        , 0
                        , 15.05
                        , ['get', 'min_height']
                    ]
            , 'fill-extrusion-opacity': 0.6
        }
    }, labelLayerId);
});

map.on('load', function() {
        map.loadImage( 'images/marker.png',
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
```
Hierboven is te zien hoe ik de map heb gerealiseerd dit is deels gekopieerd van de site van mapbox, daar heb ik een aantal veranderingen in gemaakt zoals waar de map mee moet beginnen, deze is gezet op mijn woonplaats. Ik wou eigenlijk ervoor zorgen dat zodra er een stad wordt opgezocht in het andere api dat de map vervolgens daarop in zoemt maar dat is mij helaas niet gelukt.

```JavaScript

var input = document.querySelector(".inputTekst");
var knop = document.querySelector(".knop");
var temperatuur = document.querySelector(".temperatuur");
var beschrijving = document.querySelector(".beschrijving");
var locatie = document.querySelector(".locatie");
var icoon = document.querySelector(".icoon");
knop.addEventListener('click', function (name) {
    fetch('https://api.openweathermap.org/data/2.5/weather?q=' + input.value + '&appid=1a9097c4be951774bbb2ad59ca2ea69f').then(response => response.json()).then(data => {
        var locatieValue = data['name'];
        var temperatuurValue = data['main']['temp'];
        var beschrijvingValue = data['weather'][0]['description'];
        var icoonValue = data['weather'][0]['icon'];
        //lat = data['latitude'];
        console.log(lat);
        locatie.innerHTML = locatieValue;
        temperatuur.innerHTML = Math.round(temperatuurValue - 272.15) + " -° C";
        beschrijving.innerHTML = beschrijvingValue;
        icoon.innerHTML = `<img src="icons/${icoonValue}.png"/>`;
    }).catch(err => alert("Stad niet herkend."))
})
```
Vervolgens heb ik via een youtube tutorial ervoor gezorgd dat ik via een zoekbalk een stad kan opzoeken en daarbij de gegevens zal krijgen met het weer informatie. Dit is gerealiseerd door de api van openweather te gebruiken.

