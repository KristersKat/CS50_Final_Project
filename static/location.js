// Locations and their coordinates, change and add apropriate locations
const locations = {
    rbs: {
        name: "RBS",
        latitude: 56.95737134876442,
        longitude: 24.11770500117552,
        info: "Tu atrodies Rīgas Biznesa skolā"  
    }, 
    Likteņdārzs: {
        name: "Likteņdārzs",
        latitude: 56.63513293273697,
        longitude: 25.442591268692485,
        info: "Likteņdārzs ir dabā veidots simbols tautas nemitīgai atjaunotnei un izaugsmei te satiekas gan cilvēka, gan valsts pagātne, tagadne un nākotne. Līdzīgi kā Brīvības piemineklis, arī Likteņdārzs tiek veidots, pateicoties ziedojumiem."
    },
    Jāņa_Jaunsudrabiņa_muzejs_Riekstiņi: {
        name: "Jāņa Jaunsudrabiņa muzejs Riekstiņi",
        latitude: 56.196922,
        longitude: 25.380306,
        info:" Muzejs iekārtots senas zemnieku sētas saimniecības ēkā, kas atspoguļo agrāko laiku tradīcijas un amatniecības prasmes Sēlijas novadā, kas ir bagāts ar sadzīves un saimniecības priekšmetiem, kādi raksturīgi sēļu materiālajai kultūrai."
    },
    Neretas_novadpētniecības_muzejs: {
        name: "Neretas novadpētniecības muzejs",
        latitude: 56.199856,
        longitude: 25.313932,
        info: "Muzejā tiek uzkrāti novadpētniecības materiāli par Neretas apkārtni un cilvēkiem. Regulāri tiek veidota kāda novada cilvēka darbu izstāde vai izstādīti eksponāti no novadnieku privātkolekcijām."
    },
    Gricgales_Medņu_krogs:{
        name: "Gricgales Medņu krogs",
        latitude: 56.187351,
        longitude: 25.242300,
        info: "Gricgales muižas krogs, kurš pieder literatūrkritiķei Lūcijai Ķuzānei, glabā liecības par L.Ķuzānes dzimtas un novada vēsturi, tas laipni gaida apmeklētājus, arī individuālos Latvijas apceļotājus."
    },
    Aizkraukles_Vēstures_un_mākslas_muzejs:{
        name: "Aizkraukles Vēstures un mākslas muzejs",
        latitude: 56.615116,
        longitude: 25.224726,
        info: "Ekspozīcija aptver laika periodu no senākajiem laikiem līdz 20.gs. pirmajai pusei. Izstāžu namā tiek rīkotas vēsturiskas un aktuālas izstādes."
    },
    Strobuku_pilskalns:{
        name: "Strobuku pilskalns",
        latitude: 56.195370,
        longitude: 25.156075,
        info:"Pilskalnes Strobuku pilskalns atrodas ap 300 metriem uz rietumiem no Strobuku mājām. Pilskalnu pirmais literatūrā 1882. gadā minēja A.Bīlenšteins. E.Brastiņš Strobuku pilskalnu par īstu pilskalnu neatzina. Izteikta doma, ka Strobuku pilskalns būtu uzskatāms par apmetni."
    },
    Kalnaziedu_pilskalns:{
        name: "Kalnaziedu pilskalns",
        latitude: 56.599735,
        longitude: 25.274021,
        info: "Pilskalns piekļaujas muzeja “Kalna Ziedi” teritorijai. Apdzīvots no 1. g.t. p.m.ē. beigām, iespējams, tas ticis izmantots kā patvēruma pilskalns."
    },
    Kokneses_pilsdrupas:{
        name: "Kokneses pilsdrupas",
        latitude: 56.63829812366905,
        longitude: 25.41759360725397,
        info:"Mūsdienās, atjaunojot sendienu slavu un godu, Kokneses pilsdrupās notiek teatralizēti uzvedumi, koncerti, naudas kalšana, kāzu ceremonijas viduslaiku un senlatviešu stilā un par tradīciju izveidojušies Sama modināšanas svētki."
    },
    Ozienas_pils:{
        name: "Ozienas pils",
        latitude: 56.712337,
        longitude: 25.685585,
        info: "Odzienas muižas pirmsākumi skaitāmi jau no 1455. gada. Pašreizējā muižas pils ēka celta 19. gadsimta vidū Rūdolfa Fridriha Adriana fon Brimmera laikā."
    },
}

// If possible gets the current location

function getCurrentLocation(){ 
    return new Promise((resolve, reject) =>
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
}
function atLocation(userLocation)
{
    for (const locationName in locations)
    {
        const location = locations[locationName];

        if (getDistance(location, userLocation) < 10)
        {
            // Edit this to change what happens when the user IS at the location
            alert("Tu esi sasniedzis " + location.name + "! " + location.info);
            //document.getElementById(locationName).innerHTML = message;
        }
        /*else
        {
            // Edit this to change what happens when the user IS NOT at the location
            document.getElementById(locationName).innerHTML = '';
        }*/
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
function updateLocation(){
    getCurrentLocation()
        .then(atLocation)
        .catch((error) => {
            console.log(error);
            // Edit this to change the behavior when geolocation is not available
            alert("Geolocation not available");
        });
}
    
updateLocation();
// Interval set to update every 1 minute
const updateInterval = 60000;
setInterval(updateLocation, updateInterval); 