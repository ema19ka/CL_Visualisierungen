//WICHTIG:  
//  Es ist jetzt so das man immer mit dem Lokal Gespeicherten Daten Arbeiten kann --> die sind im LocalStorage Gespeicherten
//  Das automatische Updaten der Daten zu implementieren macht erst Sinn wenn wir die Viz in die App einfügen.. vorher is es denk ich nur unnötiger Aufwand.
 
//  Also im Moment müssen die Daten noch manuell runtergeladen werden! 

//  Was du tun musst: 
//  -) Setz den pathbool auf true und refresh die Seite. Jetzt hast du die Files gedownloaded(Entwicklertools --> Application --> Storage --> Localstorage --> httP//...balabla)
//     Da siehst du jetzt die JSON Datei als "Data". Mit rechtsklick und Delete könnte man sie auch wieder manuell löschen! 
// -)  jetzt setzt du den pathbool wieder auf false damit du nichtmehr ständig auf den Server zugfreifst.
//     So erparrst du dir Ladezeiten und Probleme mit der Cors abfrage. 

// Also immer wenn du mit neuen Daten arbeiten möchtest: setzt einfach den pathbool kurz auf true :) 

//Enjoy :D 
 
 
 
 
 
 const url = 'https://covid19-dashboard.ages.at/data/CovidFaelle_Timeline.csv';
 const corsFix = 'https://cors-anywhere.herokuapp.com/';


let path = corsFix + url;
let pathbool =true;

//let accessBool = false; //checkt of file online geladen werden soll, wenn true = AN
//let pathbool= false; 
let remoteData;
let getSpeicherDatum;

//Damit kannst du arbeiten --> Alle Werte der Datei
let getDatum;
let getBundesland;
let getBundeslandID;
let getAnzEinwohner;
let getAnzahlFaelle;
let getAnzahlFaelleSum;
let getAnzahlFaelle7Tage;
let getSiebenTageInzidenzFaelle;
let getAnzahlTotTaeglich;
let getAnzahlTotSum;
let getAnzahlGeheiltTaeglich;
let getAnzahlGeheiltSum;


//Als Arrays gespeichert
let getDatumArr=[];
let getBundeslandArr=[];
let getBundeslandIDArr=[];
let getAnzEinwohnerArr=[];
let getAnzahlFaelleArr=[];
let getAnzahlFaelleSumArr=[];
let getAnzahlFaelle7TageArr=[];
let getSiebenTageInzidenzFaelleArr=[];
let getAnzahlTotTaeglichArr=[];
let getAnzahlTotSumArr=[];
let getAnzahlGeheiltTaeglichArr=[];
let getAnzahlGeheiltSumArr=[];







yourMainCode(remoteData);


//MainCode
function yourMainCode(remoteData) {
  
read_from_local_storage();
console.log("Array Example:", getDatumArr);


 const stringReplace = JSON.stringify(remoteData);
 const jsonReplace = replaceUmlauts(stringReplace);
 const realData = JSON.parse(jsonReplace);
 let items_json = realData; 


 //Key umbenennen --> Time zu datum
 for (i = 0; i < realData.length; i ++){
const obj = items_json[i];
 const newKeys = { Time: "datum"}; //wenn geändert wird dann unten auch! 
 const renamedObj = renameKeys(obj, newKeys);
 items_json[i] = renamedObj;

 var fulldatesofitems = items_json[i].datum; //auch hier schon "datum"!!!!!
 var dateofitems = fulldatesofitems.split(" ");
 var dateofitem = dateofitems[0]; //[0] = Datum| [1] = 00:00:00
 items_json[i].datum = dateofitem; //Erstetzen des Datum + Urzeit String durch neuen "date" - String
 //console.log(items_json[i]);
 }
 
//Speichern der Daten im Lokal Storage + Speicherdatum dazu fügen (im GMT Format)
var date = new Date();//var updateDate = date.toISOString(); //"2011-12-19T15:28:46.493Z"
var updateDate = date.toGMTString(); // Tue, 17 Nov 2020 14:16:29 GMT --> Gibt mir die jetzige Uhrzeit im Format das lastModiefied Header Request auch hat
var Datatrue = { updateDate: updateDate, items_json };    
localStorage.setItem("Data", JSON.stringify(Datatrue));

//Speichern des ETAGS im LocalStorage (zur Versionsüberprüfung, brauchen wir später)
//var eTag = {eTagResponse};
//localStorage.setItem("ETag", JSON.stringify(eTag));
}


//_______Funktionen________________________________________
function downloadFile(path) {
  if(pathbool==true){ 
    Papa.parse(path, {
      download: true,
      header: true,
      complete: function (results, file) {
          console.log('Completed loading the file...');
           // Here starts your real code with this function
          yourMainCode(results.data);   
      },
    });//wenn ich internet hab und auf die Ampedaten zugreifen darf dann..
}else{ 
  pathbool=false; //verweiere zugriff auf ampeldaten online auch wenn ich internet hab
}
}
  
  //Offline Daten auslesen = Daten vom Local Storage
function read_from_local_storage() { 
  //DATEN
  var items_json = localStorage.getItem("Data");
  if(items_json != null){ //check of es diese Daten im localstorage gibt
    //accessBool = false; 
    items = JSON.parse(items_json); //mit Speicherdatum 
    dataOffline = items.items_json; //Ohne Speicherdatum 
    getSpeicherDatum = items.updateDate; //SpeicherDatum
    
    console.log("Offline Items:" ,items); 
    console.log("Offline Daten:" ,dataOffline); 
    console.log("Die Daten wurden zuletzt im Local Storage gespeichert am (updateDate):" , getSpeicherDatum);

    for (i = 0; i < dataOffline.length; i ++){
    getDatum = dataOffline[i].datum;
    getBundesland = dataOffline[i].Bundesland;
    getBundeslandID = dataOffline[i].BundeslandID;
    getAnzEinwohner = dataOffline[i].AnzEinwohner;
    getAnzahlFaelle = dataOffline[i].AnzahlFaelle;
    getAnzahlFaelleSum = dataOffline[i].AnzahlFaelleSum;
    getAnzahlFaelle7Tage = dataOffline[i].AnzahlFaelle7Tage;
    getSiebenTageInzidenzFaelle = dataOffline[i].SiebenTageInzidenzFaelle;
    getAnzahlTotTaeglich = dataOffline[i].AnzahlTotTaeglich;
    getAnzahlTotSum = dataOffline[i].AnzahlTotSum;
    getAnzahlGeheiltTaeglich = dataOffline[i].AnzahlGeheiltTaeglich;
    getAnzahlGeheiltSum = dataOffline[i].AnzahlGeheiltSum;


  
    //Als Arrays gespeichert
    getDatumArr.push(getDatum);
    getBundeslandArr.push(getBundesland);
    getBundeslandIDArr.push(getBundeslandID);
    getAnzEinwohnerArr.push(getAnzEinwohner);
    getAnzahlFaelleArr.push(getAnzahlFaelle);
    getAnzahlFaelleSumArr.push(getAnzahlFaelleSum);
    getAnzahlFaelle7TageArr.push(getAnzahlFaelle7Tage);
    getSiebenTageInzidenzFaelleArr.push(getSiebenTageInzidenzFaelle);
    getAnzahlTotTaeglichArr.push(getAnzahlTotTaeglich);
    getAnzahlTotSumArr.push(getAnzahlTotSum);
    getAnzahlGeheiltTaeglichArr.push(getAnzahlGeheiltTaeglich);
    getAnzahlGeheiltSumArr.push(getAnzahlGeheiltSum);

 



  }

   
  
} else{
  //accessBool = true; //Wenn es die Daten nicht gibt dann starte den zugriff auf die online-Daten 
  pathbool = true; 
  downloadFile(path);
  //checkForUpdate();
}

//ETag

// if(localStorage.getItem("ETag") != null){
//   var savedETag = localStorage.getItem("ETag");
//   getETagLocalS = JSON.parse(savedETag);
//   console.log('Lokal gespeicherter ETAG',getETagLocalS);
//   }
}

//"Time" zu "date"
function renameKeys(obj, newKeys) {
  const keyValues = Object.keys(obj).map(key => {
    const newKey = newKeys[key] || key;
    return { [newKey]: obj[key] };
  });
  return Object.assign({}, ...keyValues);
}

//Umlaute ersetzen
function replaceUmlauts(value){
       value = value.replace(/\u00e4/g, 'ae');
       value = value.replace(/\u00f6/g, 'oe');
       value = value.replace(/\u00fc/g, 'ue');
       value = value.replace(/\u00c4/g, 'Ae');
       value = value.replace(/\u00d6/g, 'Oe');
       value = value.replace(/\u00dc/g, 'Ue');
       value = value.replace(/\u00df/g, 'ss');
       return value;
}
  









//Wird erst später gebraucht

// function checkForUpdate() {
//     read_from_local_storage(); //Les mir das Objekte vom Lokalstorage aus (brauche "updateDate", "lokalstorageBezirk" )
//     try{
//     console.log('Speicherdatum vom local storage:', getSavedDate);
//     }catch(error){
//     console.log(error);
//   }  
//   //schau ob die lokalen  Speicherdaten geupdated gehören
//   if(accessBool == true){ //wenn der online zugriff auf die daten gestattet dann
//     var client = new XMLHttpRequest(); //mach eine Verbindung zur Resource
//     try{
//     client.open("GET", path2, true);
//     client.send();
//      client.onreadystatechange = function () {
      
//       if (this.readyState == this.HEADERS_RECEIVED) {//gibt mir alle Headers von allen Requests aus
//               var lastModifiedResponse = client.getResponseHeader("Last-Modified");
//         var contentTypeResponse = client.getResponseHeader("Content-Type");
//         if (contentTypeResponse != "application/json") {
//           client.abort();
//         } else {
//           //Wenn es sich um eine JSOn Datei handelt dann gib mir den Last-Modified Header der Web Resource
//           console.log("Zuletzt am Server gspeichert am (Last-Modified):",lastModifiedResponse
//           );
  
//           if (lastModifiedResponse < getSavedDate) {
//             //Wenn der das Speicherdatum der Datei(Lastmodified) älter ist als das letzte Speicherdatum im lokal Storage dann ist es am neusten Stand
//             console.log('your Data is up-to-date');
//             pathbool = false;
//             /*FRAGE: 
//                Datum im Lokal Storage ist doch größer, als Speicherdatum der JSOn Datei. Warum ist es nicht "up - to - date"???
//                */
//           } else {
//             pathbool = true; 
//             console.log(
//               "your Data is not up-to-date, it gets now downloaded from the resource and saved in your local storage"
//            );
//            downloadFile(path);
//           }
//         }
//       }
//     };
//     }catch(error){
//       console.error(error);
//       }
//     }
//     pathbool = false; 
//   }
  





// read_from_local_storage();
// console.log("Pathbool: "+ pathbool);
// console.log("Accessbool: "+ accessBool);

// //checkForUpdate();
 //getData(dataOffline);
