
var app = {
    // Application Constructor
    initialize: function () {
        this.bindEvents();
    },
    // Bind Event Listeners
    //
    // Bind any events that are required on startup. Common events are:
    // 'load', 'deviceready', 'offline', and 'online'.
    bindEvents: function () {
        document.addEventListener('deviceready', this.onDeviceReady, false);
    },
    // deviceready Event Handler
    //
    // The scope of 'this' is the event. In order to call the 'receivedEvent'
    // function, we must explicitly call 'app.receivedEvent(...);'
    onDeviceReady: function () {
        app.receivedEvent('deviceready');
        app.init_buttons();
        console.log(navigator);
    },
    // Update DOM on a Received Event
    receivedEvent: function (id) {
        var parentElement = document.getElementById(id);
        var listeningElement = parentElement.querySelector('.listening');
        var receivedElement = parentElement.querySelector('.received');

        listeningElement.setAttribute('style', 'display:none;');
        receivedElement.setAttribute('style', 'display:block;');

        console.log('Received Event: ' + id);
    },
    init_buttons() { //  se executa dupa deviceready  event 
        var nf = function () { };
        document.getElementById("but1").addEventListener("click", ev => {
            navigator.vibrate(100);
            navigator.notification.prompt("esti de acord?", function (rez) {
                if (rez.buttonIndex === 1) {
                    alert("ai fost de acord!", "DECI ASA!");
                }
                else {
                    navigator.notification.beep(1);
                }
            });
        });

        function setOptions(srcType) {
            var options = {
                // Some common settings are 20, 50, and 100
                quality: 50,
                destinationType: Camera.DestinationType.FILE_URI,
                // In this app, dynamically set the picture source, Camera or photo gallery
                sourceType: srcType,
                //encodingType: Camera.EncodingType.JPEG,
                encodingType: Camera.EncodingType.PNG,
                mediaType: Camera.MediaType.PICTURE,
                _allowEdit: true,
                correctOrientation: true  //Corrects Android orientation quirks
            }
            return options;
        }

        function openCamera(selection) {


            var srcType = Camera.PictureSourceType.CAMERA;
            var options = setOptions(srcType);
            //var func = createNewFileEntry;
            console.log("333")
            if (selection == "camera-thmb") {
                options.targetHeight = 100;
                options.targetWidth = 100;
            }
            navigator.camera.getPicture(function cameraSuccess(imageUri) {
                console.log(imageUri);
                displayImage(imageUri);
                // You may choose to copy the picture, save it somewhere, or upload.
                //func(imageUri);

            }, function cameraError(error) {
                console.debug("Unable to obtain picture: " + error, "app");

            }, options);
        }

        function displayImage(imgUri) {

            var elem = document.getElementById('myImage');
            elem.src = imgUri;
        }





        function scan_qr() {
            cordova.plugins.barcodeScanner.scan(
                function (result) {
                    if (result.cancelled !== true) {
                        alert("We got a barcode\n" +
                            "Result: " + result.text + "\n" +
                            "Format: " + result.format + "\n" +
                            "Cancelled: " + result.cancelled);
                    } else {
                        console.log("canceled")
                    }
                },
                function (error) {
                    alert("Scanning failed: " + error);
                },
                {
                    _preferFrontCamera: true, // iOS and Android
                    showFlipCameraButton: true, // iOS and Android
                    showTorchButton: true, // iOS and Android
                    torchOn: false, // Android, launch with the torch switched on (if available)
                    saveHistory: true, // Android, save scan history (default false)
                    prompt: "Place a barcode inside the scan area", // Android
                    resultDisplayDuration: 500, // Android, display scanned text for X ms. 0 suppresses it entirely, default 1500
                    formats: "QR_CODE,PDF_417", // default: all but PDF_417 and RSS_EXPANDED
                    orientation: "landscape", // Android only (portrait|landscape), default unset so it rotates with the device
                    disableAnimations: true, // iOS
                    disableSuccessBeep: false, // iOS and Android
                    AbortController:true 
                }
            );
        }
        function displayContents(err, text) {
            if (err) {
                // an error occurred, or the scan was canceled (error code `6`)
            } else {
                // The scan completed, display the contents of the QR code:
                alert(text);
            }
        }

        document.getElementById("but2").addEventListener("click", ev => {
            scan_qr();
        });

        var ref;
        but3.addEventListener("click", function (ev) {
            ref = cordova.InAppBrowser.open('https://ne.myadr.ro/test.php', '_blank', 'location=no');
            ref.addEventListener('loadstop', onload_inappbrowser);
            ref.show();
        })

        function onload_inappbrowser() {
            ref.removeEventListener("loadstop", onload_inappbrowser);
            ref.executeScript({ code: "console.log('ttt');" }, function () {
                console.log("ref:", ref);

            });
        }

    }
}
