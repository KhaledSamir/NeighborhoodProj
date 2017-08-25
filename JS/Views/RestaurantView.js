var RestaurantView = function () {

    this.createView = function (data) {
        console.dir(data)
        if (data) {
            var content = '';
            if(data.url)
                content += '<div class="content"><b>Url :</b> <a href="' + data.url + '">' + data.url + "</a></div>";
            content += '<div class="content"><b>Name : </b>' + data.name + "</div>";
            content += '<div class="content"><b>Type : </b>' + data.categories[0].shortName + "</div>";
            
            if(data.hasMenu)
                content += '<div class="content"><b>Menu Link :</b> <a href="' + data.menu.url + '">Menu' + "</a></div>";
            if(data.contact.formattedPhone) {
                content += '<div class="content"><b>Phone :</b> ' + data.contact.formattedPhone + "</div>";
            }
            content += '<div class="content"><b>Address : </b>' + data.location.formattedAddress.toString() + "</div>";
            
            return content;
        }

        return 'Nothing can be displayed!';
    }
}