const url = 'https://covid19-dashboard.ages.at/data/CovidFaelle_Timeline.csv';
const corsFix2 = 'https://cors-anywhere.herokuapp.com/';




// // METHOD 1 --> FÜR CSV FILES!
Papa.parse(corsFix2 + url, {
    download: true,
    header: true,
    complete: function (results, file) {
        console.log('Completed loading the file...');
         // Here starts your real code with this function
        yourMainCode(results.data);
    },
});

//MainCode
  function yourMainCode(remoteData) {
    let data = remoteData;
    console.log('CovidFaelle_Timeline Daten: ',data);
}