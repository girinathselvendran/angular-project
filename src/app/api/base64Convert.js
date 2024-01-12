function imgToBase64(url, callback) {
    if (!window.FileReader) {
        callback(null);
        return;
    }
    var xhr = new XMLHttpRequest();
    xhr.responseType = 'blob';
    xhr.onload = function () {
        var reader = new FileReader();
        reader.onloadend = function () {
            callback(reader.result.replace('text/xml', 'image/jpeg'));
        };
        reader.readAsDataURL(xhr.response);
    };

    xhr.open('GET', url);
    xhr.send();

}
var companyLogo;
var defaultDepoLogo;
imgToBase64("assets/img/iInterchangeLogo.png", function (base64) {
    companyLogo = base64;
});
imgToBase64("assets/img/defaultLogo.jpg", function (base64) {
    defaultDepoLogo = base64;
});
function getBase64Image(logoPath) {
    filePathh = logoPath;
    imgToBase64(filePathh, function (base64) {
        companyLogo = base64;
        return companyLogo;
    });
}
function applicationImage(attachmentPath) {
    if (attachmentPath != null || attachmentPath != '') {
        filePathAppilication = attachmentPath;
        imgToBase64(filePathAppilication, function (base64) {
            cwmsLogo = base64;
        });

    }
}
