// Locations and their coordinates, change and add apropriate locations
const locations = {
    rbs: {
        latitude: 56.957225,
        longitude: 24.117732
    },
    freedomMonument: {
        latitude: 56.951485,
        longitude: 24.113339
    },
    aizkraukle: {
        latitude: 56.598797,
        longitude: 25.250060
    }
}

// If possible gets the current location
const getCurrentLocation = new Promise((resolve, reject) =>
{
    function success(location)
    {
        resolve(location.coords);
    }

    // Location blocked in browser
    function error()
    {
        reject(2);
    }

    // Checks if location is available on browser
    if (!navigator.geolocation) 
    {
        reject(1);
    }
    else
    {
        navigator.geolocation.getCurrentPosition(success, error, { enableHighAccuracy: true });
    }
});

function atLocation(userLocation)
{
    for (const locationName in locations)
    {
        const location = locations[locationName];
        console.log(locationName);

        if (getDistance(location, userLocation) < 10)
        {
            // Edit this to change what happens when the user IS at the location
            document.getElementById(locationName).style.display = 'block';
        }
        else
        {
            // Edit this to change what happens when the user IS NOT at the location
            document.getElementById(locationName).style.display = 'none';
        }
    }
}

// Returns the distance from current location to the object in km
function getDistance(location, userLocation)
{
    var R = 6371; // Radius of the earth in km
    var dLat = deg2rad(location.latitude - userLocation.latitude);
    var dLon = deg2rad(location.longitude - userLocation.longitude); 

    var a = 
        Math.sin(dLat/2) * Math.sin(dLat/2) +
        Math.cos(deg2rad(userLocation.latitude)) * Math.cos(deg2rad(location.latitude)) * 
        Math.sin(dLon/2) * Math.sin(dLon/2); 

    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
    var d = R * c;
    return d;
}

// Converts degrees to radians
function deg2rad(deg) {
    return deg * (Math.PI/180)
}

// Promise handling
getCurrentLocation
    .then(atLocation)
    .catch((error) => {
        console.log(error);
        // Edit this to change the behavior when geolocation is not available
        alert("Geolocation not available");
    })