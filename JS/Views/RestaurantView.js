var RestaurantView = function () {

    this.createView = function (data) {
        console.dir(data)
        if (data) {
            var content = '';
            if(data.url)
                content += '<div><b>Url :</b> <a target="_blank"href="'
                             + data.url + '">' + data.url + "</a></div>";
            content += '<div><b>Name : </b>' + data.name + "</div>";
            content += '<div><b>Type : </b>' + data.categories[0].shortName + "</div>";
            
            if(data.hasMenu)
                content += '<div><b>Menu Link :</b> <a target="_blank" href="' + data.menu.url +
                                             '">Menu' + "</a></div>";
            if(data.contact.formattedPhone) {
                content += '<div><b>Phone :</b> ' + data.contact.formattedPhone + "</div>";
            }
            content += '<div><b>Address : </b>' + data.location.formattedAddress.toString() + "</div>";
            
            return content;
        }

        return 'Nothing can be displayed!';
    }
}