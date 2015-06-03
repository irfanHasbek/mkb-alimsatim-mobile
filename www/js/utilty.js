function kisaTarihHesapla(tarih){
    var temp = new Date(tarih);
    var dd = temp.getDate();
    var mm = temp.getMonth()+1; //January is 0!
    var yyyy = temp.getFullYear();
    var hh = temp.getHours();
    var dk = temp.getMinutes();
    if(dd<10) {
        dd='0'+dd
    } 

    if(mm<10) {
        mm='0'+mm
    } 

    temp = mm + '-'+ dd + '-' +yyyy + ", " + hh + ":" + dk;
    return temp;
}