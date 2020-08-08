var ACTIVE_PANEL;
var app = {
    // Application Constructor
    initialize: function () {
        window.__root__ = "*.myadr.ro";
        document.addEventListener('deviceready', this.onDeviceReady, false);
    },

    // deviceready Event Handler
    onDeviceReady: function () {
        app.receivedEvent('deviceready');
        app.device_adaptations();
        Q("#app_title").html = __root__;
        app.init_buttons();
        app.init_panels();
        //Q("#settings_btn").click();
    },
    // Update DOM on a Received Event
    receivedEvent: function (id) {
        var parentElement = document.getElementById(id);
        var listeningElement = parentElement.querySelector('.listening');
        var receivedElement = parentElement.querySelector('.received');

        listeningElement.setAttribute('style', 'display:none;');
        receivedElement.setAttribute('style', 'display:block;margin:0 !important');
        console.log('Received Event: ' + id);
    },
    // initializare butoane  se executa dupa deviceready  event 
    init_buttons: function () {
        qr_scaner_btn.on({ click: scan_qr });
        settings_btn.on({
            "click": () => show_funtional_panel(settings_panel)
        });

        domain_select_btn.on({
            change: function (ev) {
                app_title.html = "https://<m style='color:#4bff00'>" + (/^\S/.test(this.value) ? this.value + "." : "") + "</m>myadr.ro/"
            }
        });
        tel_setting_btn.on({
            click: function (ev) {
                zzz();
                navigator.notification.prompt("TEL asociated to user", function (rez) {
                    if (rez.buttonIndex === 1) { // on OK
                        LS.tel = rez.input1;
                        tel_setting_btn.find("code")[0].html = rez.input1;
                    }
                }, "SETTINGS", null, LS.tel || "");
            }
        });
        token_setting_btn.on({
            click: function (ev) {
                zzz();
                navigator.notification.prompt("your TOKEN is!", function (rez) {
                    if (rez.buttonIndex === 1) { // on OK
                        LS.token = rez.input1;
                        token_setting_btn.find("code")[0].html = "******";
                    }
                }, "SETTINGS");
            }
        });
        sms_token_btn.on({
            click: function () {
                navigator.notification.confirm("SEND TOKEN VIA SMS !?", function (rez) {
                    +rez === 1 && ask("qra.send_token", { email: LS.email, tel: LS.tel }, function (r) { dn(r); });
                })
            }
        });
        inappbrowser_btn.on("click", ev => {
            ref = cordova.InAppBrowser.open('https://ne.myadr.ro/test.php', '_blank', 'location=no');
            ref.addEventListener('loadstop', onload_inappbrowser);
            ref.show();
        });
        back_btn.on({ click: hide_functional_panel });
    },


    old_init_buttons() {


        Q("#qr_scaner_btn").addEventListener("click", ev => {
            scan_qr();
        });


        return;
        // BUT_1
        document.getElementById("but1").addEventListener("click", ev => {
            zzz();
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






        function displayContents(err, text) {
            if (err) {
                // an error occurred, or the scan was canceled (error code `6`)
            } else {
                // The scan completed, display the contents of the QR code:
                alert(text);
            }
        }



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

    },

    device_adaptations: function () {
        var platform_style = _E('link').setA({
            rel: "stylesheet",
            href: "css/" + (PLATFORM === 'Android' ? "android_fix" : "ios_fix") + ".css"
        });
        body._(platform_style);
        console.log(PLATFORM, browser);
    },

    init_panels: function () {
        // SETTINGS
        //domain_select_btn.find("code")[0].html = LS.email;
        tel_setting_btn.find("code")[0].html = LS.tel;
        token_setting_btn.find("code")[0].html = LS.token ? "******" : "EXPIRED !!!";

    }
}

function show_funtional_panel(panel) {
    panel.__txy = [0, 0];
    MAIN.scrollTop = 0;
    MAIN.css("overflow:hidden");
    ACTIVE_PANEL = panel;
    back_btn.remA("hidden");
}
function hide_functional_panel() {
    ACTIVE_PANEL.__txy = [0, -1000];
    MAIN.css("overflow:auto");
    back_btn.setA("hidden");
    zzz();
}
function update_known_subdomins(domain) {
    var sd = domain.split(".")[0];
    var sub_doms = (LS.sub_doms || '["&nbsp;"]').parsed;
    if (!sub_doms.indexOf(sd)) {
        sub_doms.push(sd);
        LS.sub_doms = JSON.stringify(sub_doms.sort());
        //refac selectorul de subdomenii
        domain_select_btn.html = "";
        sub_doms.map(e => {
            domain_select_btn._(_E("option", e));
        });
    }
    domain_select_btn.value = sd;
    domain_select_btn.fire('change');
}
function scan_qr() {
    cordova.plugins.barcodeScanner.scan(
        function (result) {
            if (result.cancelled === false) {
                window.__root__ = "https://ne.myadr.ro/";
                try {
                    var data = atob(result.text).parsed;
                    console.log(data.domain);
                    update_known_subdomins(data.domain);
                } catch (error) {

                }

                ask("qra.validate_token", {
                    text: result.text,
                    email: LS.email,
                    token: LS.token,
                    tel: LS.tel
                }).then(dn);
            } else {
                console.log("canceled")
            }
        },
        function (error) {
            alert("Scanning failed: " + error);
        },
        {
            _preferFrontCamera: true, // iOS and Android
            _showFlipCameraButton: true, // iOS and Android
            _showTorchButton: true, // iOS and Android
            torchOn: false, // Android, launch with the torch switched on (if available)
            saveHistory: true, // Android, save scan history (default false)
            prompt: "Place a barcode inside the scan area", // Android
            resultDisplayDuration: 500, // Android, display scanned text for X ms. 0 suppresses it entirely, default 1500
            formats: "QR_CODE,PDF_417", // default: all but PDF_417 and RSS_EXPANDED
            _orientation: "landscape", // Android only (portrait|landscape), default unset so it rotates with the device
            _disableAnimations: true, // iOS
            disableSuccessBeep: false, // iOS and Android
            AbortController: true
        }
    );
}

function zzz() {
    window.navigator.vibrate([30, 30]); // Vibrate 'SOS' in Morse.
}