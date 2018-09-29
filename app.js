var express = require("express");
var bodyParser = require("body-parser");
var routes = require("./routes/routes.js");
var app = express();
var EncodedStorageElement = class {
    constructor(url, encoded) {
        this.url = '';
        this.encoded = '';
        this.checkIn = 0;
        if (url && typeof url == typeof this.url) this.url = url;
        if (encoded && typeof encoded == typeof this.encoded) this.encoded = encoded;
        this.checkIn = Date.now();
    }
}
var encodedStorage = [];
var encodeUrl = (url) => {
    serialize = Math.floor((Math.random() * 1000000) + 9999999);
    encodedUrl = serialize.toString(16);

    if (encodedStorage.length > 0) {
        let isDuplicate = encodedStorage.find(el => el.encoded == encodeUrl) !== undefined;
        if (isDuplicate) {
            encodeUrl(url);
            return;
        }
    }

    let ese = new EncodedStorageElement(url, encodedUrl);
    if (encodedStorage.length <= 9999999) {
        encodedStorage.push(ese);
        return ese;
    } else return { error: "Infelizmente atingimos o limite de URLs encurtadas!" }
};
var decodeUrl = (encodedUrl) => {
    let notFound = { error: "A url não foi encontrada ou está expirada!" };
    let ese =  encodedStorage.find(el => el.encoded == encodedUrl);
    if (ese) {
        let encodeDate = new Date(ese.checkIn);
        let expireLimit = new Date();
        expireLimit.setDate(expireLimit.getDate() + 5);
        if (encodeDate >= expireLimit) {
            encodedStorage = encodedStorage.slice(ese, 1);
            return notFound;
        } else return ese;
    } else {
        return notFound;
    }
};
var getAll = () => {
    let urls = [];
    if (encodedStorage == 0) {
        return { error: "Nenhuma URL foi encurtada ainda!" };
    }

    encodedStorage.forEach((ese) => {
        urls.push(ese.url);
    }); return urls;
}
var urlTools = { 
    encode: encodeUrl, 
    decode: decodeUrl,
    all: getAll,
};

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));

routes(app, urlTools);

var server = app.listen(3000, () => {
    console.log("app running on port.", server.address().port);
});