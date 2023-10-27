let geoJsonData = {
    "한국": {
        "type": "Feature",
        "properties": {},
        "geometry": {
            "type": "Polygon",
            "coordinates": [
                
                [
                    [125.78, 37.55],
                    [129.40, 37.43],
                    [129.46, 35.78],
                    [126.11, 34.39],
                    [125.20, 35.15],
                    [125.78, 37.55]
                ]
            ]
        }
    },
    "일본": {
        
        "type": "Feature",
        "properties": {},
        "geometry": {
            "type": "Polygon",
            "coordinates": [
                [129.50, 33.55],
                [135.78, 33.46],
                [135.60, 45.52],
                [129.41, 45.55],
                [129.50, 33.55]
            ]
        }
    },
    "미국": {
        
        "type": "Feature",
        "properties": {},
        "geometry": {
            "type": "Polygon",
            "coordinates": [
                [-125.00, 24.00],
                [-66.00, 24.00],
                [-66.00, 50.00],
                [-125.00, 50.00],
                [-125.00, 24.00]
            ]
        }
    },
    "독일": {
        "type": "Feature",
        "properties": {},
        "geometry": {
            "type": "Polygon",
            "coordinates": [
                [5.87, 47.27],
                [15.02, 47.57],
                [15.20, 54.91],
                [5.87, 54.80],
                [5.87, 47.27]
            ]
        }
    }
};

function getCountryGeoJSON(country) {
    return geoJsonData[country];
}

let rawData = `구분,전체,,한국,,일본,,미국,,독일,
,점수,순위,점수,순위,점수,순위,점수,순위,점수,순위
국회의원,3.7,1,4.21,1,3.88,1,3.15,6,3.54,4
약사,3.68,2,3.76,2,3.57,2,3.7,3,3.71,2
중고교 교사,3.39,6,3.67,3,"3,17",5,3.5,5,3.24,7
중소기업간부,3.4,5,3.35,5,3.09,6,3.57,4,3.6,3
기계공학엔지니어,3.44,4,3.18,7,3.38,4,3.72,2,3.49,5
소프트웨어개발자,3.62,3,3.39,4,3.49,3,3.82,1,3.77,1
은행사무직원,3.17,7,"3,30",6,2.99,7,2.99,7,3.39,6
공장근로자,2.33,8,2.03,8,2.32,8,2.79,9,2.17,9
음식점종업원,2.21,9,1.77,9,2.17,9,2.72,10,2.18,8
건설일용근로자,1.96,10,1.56,10,1.77,10,2.91,8,1.61,10
평균,3.09,-,3.02,,,,,,,
,,,,,,,,,,`;

function parseCSV(data) {
    const rows = data.split("\n").filter(row => row); 
    const countries = ["한국", "일본", "미국", "독일"];
    
    let scores = {};
    
    for(let i=2; i<rows.length-1; i++) {
        let row = rows[i];
        let values = row.match(/("[^"]+"|[^,]+)/g).map(val => val.replace(/"/g, '').trim());

        countries.forEach((country, idx) => {
            if (!scores[country]) scores[country] = [];
            scores[country].push(parseFloat(values[idx * 2 + 2]));
        });
    }

    return scores;
}


let scores = parseCSV(rawData);
let countriesCoordinates = {
    "한국": [37.5665, 126.9780],
    "일본": [35.6895, 139.6917],
    "미국": [37.7749, -122.4194],
    "독일": [52.5200, 13.4050]
};

let heatData = [];

for(let country in scores) {
    let score = scores[country].reduce((acc, val) => acc + val, 0) / scores[country].length;
    let coord = countriesCoordinates[country];
    heatData.push([coord[0], coord[1], score]);
}

let bounds = L.latLngBounds(
    L.latLng(-90, -180), 
    L.latLng(90, 180)    
);



let map = L.map('map', {
    center: [37.5665, 126.9780],
    zoom: 2,
    maxZoom: 6,
    minZoom: 2,
    maxBounds: bounds,
    maxBoundsViscosity: 1.0
});

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19
}).addTo(map);

function getColorForCountry(country) {
    const score = scores[country].reduce((acc, val) => acc + val, 0) / scores[country].length;
    if(score > 3.5) return 'green';
    if(score > 3) return 'yellow';
    return 'red';
}


for(let country in countriesCoordinates) {
    const avgScore = scores[country].reduce((acc, val) => acc + val, 0) / scores[country].length;
    
    let countryGeoJSON = geoJsonData[country]; 
    L.geoJSON(countryGeoJSON, {
        style: function(feature) {
            return {
                color: 'blue',
                weight: 2,
                fillColor: getColorForCountry(country),
                fillOpacity: 0.7
            };
        }
    }).addTo(map);
    
    let marker = L.marker(countriesCoordinates[country]);
    marker.bindTooltip(`Average Score of ${country}: ${avgScore.toFixed(2)}`);
    marker.addTo(map);
}