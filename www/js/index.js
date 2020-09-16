/* global qr_scaner_btn, settings_btn, settings_panel, Q, domain_select_btn, app_title, tel_setting_btn, LS, token_setting_btn, ask, _E, back_btn, MAIN, PLATFORM, body, browser, but3, sms_token_btn, dn, inappbrowser_btn, onload_inappbrowser, Camera, nf, extra_btn, selected_host, selected_user, device, foo */

var ACTIVE_PANEL, __WHO__, __ACC__, scanning = false;

var app = {
    // Application Constructor
    initialize: function () {
        document.addEventListener('deviceready', this.onDeviceReady, false);
        document.addEventListener("pause", function () {
            app.inBackground = true;
            !scanning && app.saveData();
        }, false);
//        window.addEventListener('load', (event) => {
//            if (window.cordova.platformId==='browser') {
//                app.onDeviceReady();
//            }
//        });
    },
    memorize: ["__ACC__"],
    saveData: function () {
        console.log("SAVING_DATA");
        app.memorize.map(s => {
            LS[s] = JSON.stringify(window[s] || {});
        });
    },
    deviceready_recived: null,
    // deviceready Event Handler
    onDeviceReady: function () {
        app.receivedEvent('deviceready');
        for (var i in device) {
            console.log(i, device[i]);
        }
        app.deviceready_recived = true;
        app.device_adaptations();
        app.init_buttons();
        app.init_panels();
        __ACC__ = (LS.__ACC__ || '[]').parsed;
        __WHO__ = (LS.last_account || '{}').parsed;
        selected_host.html = __WHO__.host || "HOST ...";
        selected_user.html = __WHO__.user || "USER ...";
        screen.orientation.lock('portrait');


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
        foo.addEventListener("click", ev => alert(1));
        qr_scaner_btn.addEventListener("click", ev => scan_qr());
        settings_btn.on({
            "click": () => show_func_panel(settings_panel)
        });
        back_btn.on({click: hide_functional_panel});

        domain_select_btn.on({
            change: function (ev) {
                app_title.html = "https://<m style='color:#4bff00'>" + (/^\S/.test(this.value) ? this.value + "." : "") + "</m>myadr.ro/";
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
                navigator.notification.prompt(__WHO__.user + " \n" + __WHO__.host, function (rez) {
                    if (rez.buttonIndex === 1) { // on OK
                        __WHO__.token = rez.input1;
                        if (ev.cb) {
                            ev.cb();
                        }
                    }
                }, "SET-TOKEN FOR: ");
            }
        });
        sms_token_btn.on({
            click: function () {
                navigator.notification.confirm("SEND TOKEN VIA SMS !?", function (rez) {
                    console.log(JSON.stringify(LS));
                    +rez === 1 && ask("qric.send_token", {email: LS.email, tel: LS.tel}, function (r) {
                        dn(r);
                    });
                });
            }
        });

        inappbrowser_btn.on("click", ev => {
            ref = cordova.InAppBrowser.open('https://ne.myadr.ro/test.php', '_blank', 'location=yes,fullscreen=yes');
            ref.addEventListener('exit', function () {
                screen.orientation.lock('portrait');
            });
            screen.orientation.unlock();
            ref.show();
        });



        extra_btn.on({click: ev => {

                try {
                    sock = getWss(8888);
                    console.log(sock);
                    setTimeout(function () {
                        sock.push({cmd: 'Q.i(session)', users: ["adi@myadr.ro", "nicolaie.burghelea@adrnordest.ro"]});
                        console.log("CACAT");
                    }, 1000);
                } catch (e) {
                    console.log(e);
                }

                ;
                // dn(1)
            }});
    },

    device_adaptations: function () {
        var platform_style = _E('link').setA({
            rel: "stylesheet",
            href: "css/" + (PLATFORM === 'Android' ? "android_fix" : "ios_fix") + ".css"
        });
        body._(platform_style);
    },

    init_panels: function () {
        // SETTINGS
        //domain_select_btn.find("code")[0].html = LS.email;
        tel_setting_btn.find("code")[0].html = LS.tel;
        token_setting_btn.find("code")[0].html = LS.token ? "******" : "EXPIRED !!!";

    }
};

function show_func_panel(panel) {
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

function resolve_scanned_scope(obj) {
    selected_host.html = __WHO__.host;
    selected_user.html = __WHO__.user;
    LS.last_account = JSON.stringify(__WHO__);
    console.log("resolving_scanned_scope", JSON.stringify([__WHO__, obj]));
}
function scan_qr() {
    scanning = true;
    // totul se memoreaza {user:email,host:ne.myadr.ro,port:8888,token:'12A45t'} in LocalStorage  // recuperare obtinere token ????? --  SMS pe un NR asociat mail + CNP
    cordova.plugins.barcodeScanner.scan(
            function (result) {
                scanning = false;
                if (result.cancelled === false) {
                    try {
                        var data = atob(result.text).parsed;
                        if (!data.hasOwnProperty("u") || !data.hasOwnProperty("q")) {
                            dn("NOT A QRIC FORMAT");
                            return;
                        }
                        if (!data.u[0] || !data.u[1] || !data.u[2]) { // trebuie basate  host port user
                            dn("INCOMPLET QRIC DATA");
                            return;
                        }

                        var k = __ACC__.find_obj({host: data.u[0], user: data.u[2]})[0];
                        if (k) {// e un host cunoscut 
                            if (k.port !== data.u[1]) {// verific daca nu s-a schimbat portul 
                                k.port = data.u[1];
                            }
                            __WHO__ = k;
                        }
                        else {
                            //memorez new account
                            __ACC__.push(__WHO__ = {host: data.u[0], port: data.u[1], user: data.u[2]});
                        }

                        if (!__WHO__.token) {
                            // ask for token setting and continue rezolve_scanning_scope 
                            token_setting_btn.fire("click", {cb: function () {
                                    resolve_scanned_scope(data.q);
                                }});
                        }
                        else {
                            resolve_scanned_scope(data.q);
                        }
                        //update_known_subdomins(data.domain);
                    } catch (error) {
                        console.log(error);
                        dn("BAD QR FORMAT");
                    }
                }
                else {
                    console.log("canceled");
                }
            },
            function (error) {
                scanning = false;
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




//    old_init_buttons() {
//
//
//        Q("#qr_scaner_btn").addEventListener("click", ev => {
//            scan_qr();
//        });
//
//
//        return;
//        // BUT_1
//        document.getElementById("but1").addEventListener("click", ev => {
//            zzz();
//            navigator.notification.prompt("esti de acord?", function (rez) {
//                if (rez.buttonIndex === 1) {
//                    alert("ai fost de acord!", "DECI ASA!");
//                }
//                else {
//                    navigator.notification.beep(1);
//                }
//            });
//        });
//
//        function setOptions(srcType) {
//            var options = {
//                // Some common settings are 20, 50, and 100
//                quality: 50,
//                destinationType: Camera.DestinationType.FILE_URI,
//                // In this app, dynamically set the picture source, Camera or photo gallery
//                sourceType: srcType,
//                //encodingType: Camera.EncodingType.JPEG,
//                encodingType: Camera.EncodingType.PNG,
//                mediaType: Camera.MediaType.PICTURE,
//                _allowEdit: true,
//                correctOrientation: true  //Corrects Android orientation quirks
//            };
//            return options;
//        }
//
//        function openCamera(selection) {
//
//
//            var srcType = Camera.PictureSourceType.CAMERA;
//            var options = setOptions(srcType);
//            //var func = createNewFileEntry;
//            console.log("333");
//            if (selection == "camera-thmb") {
//                options.targetHeight = 100;
//                options.targetWidth = 100;
//            }
//            navigator.camera.getPicture(function cameraSuccess(imageUri) {
//                console.log(imageUri);
//                displayImage(imageUri);
//                // You may choose to copy the picture, save it somewhere, or upload.
//                //func(imageUri);
//
//            }, function cameraError(error) {
//                console.debug("Unable to obtain picture: " + error, "app");
//
//            }, options);
//        }
//
//        function displayImage(imgUri) {
//
//            var elem = document.getElementById('myImage');
//            elem.src = imgUri;
//        }
//
//
//
//
//
//
//        function displayContents(err, text) {
//            if (err) {
//                // an error occurred, or the scan was canceled (error code `6`)
//            } else {
//                // The scan completed, display the contents of the QR code:
//                alert(text);
//            }
//        }
//
//
//
//        var ref;
//        but3.addEventListener("click", function (ev) {
//            ref = cordova.InAppBrowser.open('https://ne.myadr.ro/test.php', '_blank', 'location=no');
//            ref.addEventListener('loadstop', onload_inappbrowser);
//            ref.show();
//        });
//
//        function onload_inappbrowser() {
//            ref.removeEventListener("loadstop", onload_inappbrowser);
//            ref.executeScript({ code: "console.log('ttt');" }, function () {
//                console.log("ref:", ref);
//
//            });
//        }
//
//    },