
function Initialize(){
    ko.applyBindings(new Model());
}

function handleError(){
    console.error("Google Maps APIs failed to load. Please check your internet connection and try again.");
}