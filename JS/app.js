
function Initialize(){
    ko.applyBindings(new Model());
}

function handleError(){
    alert("Google Maps APIs failed to load. Please check your internet connection and try again.");
}