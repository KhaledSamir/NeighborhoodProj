
function Initialize(){
    var app = new ViewModel();
    app.startApp();
    ko.applyBindings(new Model());
}

function HandleError(){
    console.log('Error happened!!!')
}