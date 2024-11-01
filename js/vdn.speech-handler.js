// *****************************************************************************************************
// *******              speak2web VOICE DIALOG NAVIGATION                                    ***********
// *******               AI Service requires subcriptions                                    ***********
// *******               Get your subscription at                                            ***********
// *******                    https://speak2web.com/plugin#plans                             ***********
// *******               Need support? https://speak2web.com/support                         ***********
// *******               Licensed GPLv2+                                                     ***********
//******************************************************************************************************



window.addEventListener('load', function() {
    /**
     * Play any pending playbacks from local stroge and refresh 'context' and 'status'
     * 
     */
    let vdnPendingPlaybackPath = localStorage.getItem('vdnPendingPlaybackPath');

    if (vdnPendingPlaybackPath != null) {
        localStorage.setItem('vdnPendingPlaybackPath', "");
        
        // Play pending playback
        if (typeof vdnPendingPlaybackPath != 'undefined' && vdnPendingPlaybackPath) {
            vdnIntentResponsePlayer.configure(vdnPendingPlaybackPath);
            vdnIntentResponsePlayer.play();
        }
    }

    let vdnApiCtx = localStorage.getItem('vdnCtx');

    if (vdnApiCtx != null) {
        vdnMyContext = JSON.parse(vdnApiCtx);
        localStorage.setItem('vdnCtx', "{}");
    }

    let vdnStatus = localStorage.getItem('vdnStat');

    if (vdnStatus != null) {
        vdnMyStatus = JSON.parse(vdnStatus);
        localStorage.setItem('vdnStat', "{}");
    }
});

// Cross browser 'trim()' function support
if (typeof String.prototype.trim !== 'function') {
    String.prototype.trim = function() {
        return this.replace(/^\s+|\s+$/g, ''); 
    }
}

var vdnRespTimeOut = false;
var vdnErrcnt      = 0;
var vdnMyStatus    = {};
var vdnMyContext   = {};
var vdnWin1        = -1;
var vdnWin2        = -1;
var vdnIsTalking   = false;

// For Google Analytics configuration detection
var vdnIsGtmPresent = false;
let vdnGtagConfigCount = 0;
let vdnGaConfiguredForGtag = false;
let vdnGoogleAnalyticsTrackingId = typeof vdnGaTrackingId != 'undefined' ? vdnGaTrackingId : null;

// Get Google Analytics Tracking id
if (typeof vdnGaTrack != 'undefined' && vdnGaTrack == 'yes') {
    try {
        // Obtain Google analytics tracking id with 'readycallback'
        if (typeof ga === 'function' && !vdnGoogleAnalyticsTrackingId) {
            ga(function(){
                vdnGoogleAnalyticsTrackingId = ga.getAll()[0].get('trackingId');
            });
        }

        if (typeof window.dataLayer != 'undefined') {
            let vdnDataLayerLength = window.dataLayer.length;

            for (let i = 0; i < vdnDataLayerLength; i++) {
                let dlValue = window.dataLayer[i];
                
                // To detect Google Tag Manager being used
                if(typeof dlValue.event != 'undefined' && dlValue.event === "gtm.js") {
                    vdnIsGtmPresent = true;
                    break;
                }

                if (typeof dlValue !== 'object') continue;

                let valuesArr = Object.values(dlValue);

                // To detect 'gtag' command queue configuration for Google Analytics
                valuesArr.forEach(function(item, index){
                    // Check for number of Google product configurations
                    if (item === 'config') {
                        vdnGtagConfigCount = vdnGtagConfigCount + 1;
                    }

                    // check for Google Analytics tracking id
                    if (typeof item.indexOf != 'undefined' && item.indexOf('UA-') !== -1) {
                        vdnGaConfiguredForGtag = true;
                    }
                });
            }
        }
    } catch(err) {
        console.log('VDN Google Analytics support detection error: ' + err.message);
        vdnGtagConfigCount = 0;
        vdnGaConfiguredForGtag = false;
        vdnGoogleAnalyticsTrackingId = null;
    }
}

/**
 * An audio player handler Object
 *
 */
var vdnIntentResponsePlayer = {
    'htmlAudioElement': document.createElement('AUDIO'),
    'lastFilePath': null,
    'antiMuteButtonPlaybacks': [vdnSilenceSoundPath],
    'isAntiMutePlayback': false,
    'configure': function(filePath = null, playbackEndedCallback = null) {
        try {
            let pathOfFile = typeof filePath != 'undefined' && filePath ? filePath : null;

            if (pathOfFile) {
                this.htmlAudioElement.src = vdnPathUrl + pathOfFile;
                this.htmlAudioElement.preload = 'auto';
                this.lastFilePath = pathOfFile;

                if (this.antiMuteButtonPlaybacks.indexOf(pathOfFile) !== -1) {
                    this.isAntiMutePlayback = true;
                } else {
                    this.isAntiMutePlayback = false;
                }
            } else {
                this.htmlAudioElement.src = '';
                this.isAntiMutePlayback = false;
            }

            /**
             * The play event occurs when the audio has been started or is no longer paused.
             */
            this.htmlAudioElement.onplay = function() {
                vdnIsTalking = true;
            }.bind(this);

            /**
             * The ended event occurs when the audio has reached the end.
             */
            this.htmlAudioElement.onended = function() {
                vdnIsTalking = false;
                this.htmlAudioElement.src = ''
                this.muteButton('hide');
                this.isAntiMutePlayback = false;

                // Callback to be executed when video playback ends
                if (pathOfFile && (typeof playbackEndedCallback === "function")) {
                    playbackEndedCallback();
                    playbackEndedCallback = null;
                }
            }.bind(this);

            /**
             * The error event occurs when an error occurred during the loading of an audio
             */
            this.htmlAudioElement.onerror = function() {
                vdnIsTalking = false;
                this.muteButton('hide');
                this.isAntiMutePlayback = false;
            }.bind(this);

            /**
             * The playing event occurs when the audio is playing after having been paused or stopped for buffering.
             */
            this.htmlAudioElement.onplaying = function() {
                vdnIsTalking = true;
                this.muteButton('show');
            }.bind(this);
        } catch (err) {
            this.clear();
            this.isAntiMutePlayback = false;
        }
    },
    'play': function() {
        try {
            if (this.htmlAudioElement && !!this.htmlAudioElement.src) {
                this.htmlAudioElement.play().catch(function(error){
                    console.log('VDN Exception: Failed to play audio.');
                });
            }
        } catch (err) {
            this.clear();
        }
    },
    'stop': function() {
        try {
            this.clear();
        } catch (err) {
            this.clear();
        }
    },
    'clear': function() {
        try {
            if (this.htmlAudioElement) {
                let duration = isNaN(this.htmlAudioElement.duration) ? 0 : this.htmlAudioElement.duration;
                this.htmlAudioElement.currentTime = duration;
            }

            this.lastFilePath = null;
        } catch (err) {
            this.lastFilePath = null;
            this.isAntiMutePlayback = false;
        }

        this.muteButton('hide');
    },
    'muteButton': function(action) {
        try {
            if (
                !!this.isAntiMutePlayback
                || typeof vdnResponseControllerEl == 'undefined'
                || !vdnResponseControllerEl
                || typeof action == 'undefined') return false;

            if (action == 'show') {
                vdnResponseControllerEl.classList.remove('vdn-hide-element');
            } else {
                vdnResponseControllerEl.classList.add('vdn-hide-element');
                
                if (this.isPlaying()) {
                    this.stop();
                }
            }
        } catch(err) {
            // Do nothing for now
        }
    },
    'isPlaying': function() {
        let currentTime = isNaN(this.htmlAudioElement.currentTime) ? 0 : this.htmlAudioElement.currentTime;
        let duration = isNaN(this.htmlAudioElement.duration) ? 0 : this.htmlAudioElement.duration;

        return currentTime < duration;
    }
};

/**
 * Remove if any of the response controller html elements previously avaialble in DOM
 * 
 */
let vdnResponseControllers = document.querySelectorAll('span.vdn-response-controller');// Get response controller element if any

if (typeof(vdnResponseControllers) != 'undefined' && vdnResponseControllers != null && vdnResponseControllers.length > 0) {
    let vdnRespCtrlsLength = vdnResponseControllers.length;

    for (let vdnI = 0; vdnI < vdnRespCtrlsLength; vdnI++) {
        // remove response controller element
        vdnResponseControllers[vdnI].remove();
    }
}

/**
 * Create response controller HTML element and append to body
 * 
 */
var vdnResponseControllerEl = document.createElement('span');
var vdnResponseControllerPositionClass = 'vdn-response-controller-middle-right';
var vdnMicPos = vdnSelectedMicPosition ? vdnSelectedMicPosition.toLowerCase() : 'middle right';

switch (vdnMicPos) {
    case 'middle left':
        vdnResponseControllerPositionClass = 'vdn-response-controller-middle-left';               
        break;
    case 'top right':
        vdnResponseControllerPositionClass = 'vdn-response-controller-top-right';                
        break;
    case 'top left':
        vdnResponseControllerPositionClass = 'vdn-response-controller-top-left';               
        break; 
    case 'bottom right':
        vdnResponseControllerPositionClass = 'vdn-response-controller-bottom-right';               
        break;
    case 'bottom left':
        vdnResponseControllerPositionClass = 'vdn-response-controller-bottom-left';               
        break;
    default:
        vdnResponseControllerPositionClass = 'vdn-response-controller-middle-right';
}

vdnResponseControllerEl.setAttribute('class', 'vdn-response-controller vdn-hide-element '+ vdnResponseControllerPositionClass);

// Create 'mute' button element
let vdnAudioMuteIcon = document.createElement('button');
vdnAudioMuteIcon.setAttribute('type', 'button');
vdnAudioMuteIcon.setAttribute('class', 'vdn-speaker-icon');
vdnAudioMuteIcon.setAttribute('title', 'Mute Simon');
vdnAudioMuteIcon.onclick = function() {
    vdnIntentResponsePlayer.muteButton('hide');   
};

// Append 'mute' button element to response controller element
vdnResponseControllerEl.appendChild(vdnAudioMuteIcon);

// Append response controller element to body
document.body.appendChild(vdnResponseControllerEl);

// Configured settings data
let vdnSettingsData   = typeof(vdnConfiguredSetting) != 'undefined' ? vdnConfiguredSetting : null;
let vdnHostName       = typeof(vdnCurrentHostName) != 'undefined' ? vdnCurrentHostName : null;
let vdnTypeOfDialog   = (typeof(vdnDialogType) != 'undefined' && vdnDialogType !== null) ? vdnDialogType.trim() : 'generic';
let vdnCustomEndpoint = (typeof(vdnCustomEndpointUrl) != 'undefined' && vdnCustomEndpointUrl !== null) ? vdnCustomEndpointUrl : null;

// Handle wrongly type casted string from PHP
if (vdnCustomEndpoint !== null && vdnCustomEndpoint.constructor === Array && vdnCustomEndpoint.length == 1) {
    vdnCustomEndpoint = null;
}

vdnTypeOfSearch = (typeof(vdnTypeOfSearch) != 'undefined' && vdnTypeOfSearch !== null) ? vdnTypeOfSearch : 'native';
let vdnMale = vdnVoiceType.female === false ? true : false;

/**
 * Function to get cookie value
 *
 * @param { cname: String } Name of the cookie
 *
 * @returns string Value of cookie
 */
function vdnGetCookie(cname = null) {
    try {
        if (typeof(cname) == 'undefined' || cname === null) return "";

        let name = cname + "=";
        let decodedCookie = decodeURIComponent(document.cookie);
        let ca = decodedCookie.split(';');
        let caLength = ca.length;

        for (let i = 0; i < caLength; i++) {
            let c = ca[i];

            while (c.charAt(0) == ' ') {
                c = c.substring(1);
            }

            if (c.indexOf(name) == 0) {
                return c.substring(name.length, c.length);
            }
        }
    } catch (err) {
        console.log('Something went wrong while getting cookie.');
    }
  return "";
}

/**
 * Function to check if customer opted to use custom dialog
 *
 */
function vdnIsCustomDialogOpted(){
    let isCustomDialog = false;

    try {
        if (vdnTypeOfDialog == 'custom' && vdnCustomEndpoint !== null && vdnCustomEndpoint.length != 0) {
            isCustomDialog = true;
        }
    } catch (err) {
        console.log('Something went wrong while checking preference of dialog type.');
    }

    return isCustomDialog;
}

/**
 * Function to check if intent is configured in settings and get it
 *
 * @param { intent      : string } Intent string  
 * @param { description : string } Descriptive text about intent
 * @param { url         : string } URL to redirect user on page against intent
 *
 * @returns { vdnSettings: object } Intent data from plugin settings/configurations
 */
function vdnCheckAndGetIntentFromSettings(intent, description = null, url = null){
    let vdnTempSettings = null;
    let vdnSettings     = { 'description':  vdnMessages['unableToProcess'],  'url': '', 'enabled': false };
    vdnTempSettings     = vdnSettings;

    try {
        // If description (custom provided or received from API) is provided then prefer it to return
        if (typeof(description) != 'undefined' && description != null) {
            vdnSettings.description = description;
        }

        // If URL (custom provided or received from API) is provided then prefer it to return
        if (typeof(url) != 'undefined' && url != null && url.length != 0) {
            url = vdnSettings.url = url.trim();
        }

        // check if intent is available in plugin settings
        if (vdnIsCustomDialogOpted() == false && typeof(intent) != 'undefined' 
            && intent.length != 0 && vdnSettingsData != null && (intent in vdnSettingsData)) {
            let vdnIntentFromSettings   = vdnSettingsData[intent];
            let vdnResponseFromSettings = ('response' in vdnIntentFromSettings) ? vdnIntentFromSettings['response'] : null;
            let vdnUrlFromSettings      = ('url' in vdnIntentFromSettings) ? vdnIntentFromSettings['url'] : '';

            // If description is available in settings then prioritize it to return over anything else
            if (typeof(vdnResponseFromSettings) != 'undefined' && vdnResponseFromSettings != null 
                && vdnResponseFromSettings.length != 0) {
                vdnSettings.description = vdnResponseFromSettings;
            }
            
            // If URL is available in settings then prioritize it to return over anything else
            if (typeof(vdnUrlFromSettings) != 'undefined' && vdnUrlFromSettings != null 
                && vdnUrlFromSettings.length != 0) {
                vdnSettings.url = vdnUrlFromSettings.trim();
            }

            // If dialog for intent is enabled or disabled
            let vdnIsDialogEnabled = false;

            if ('enabled' in vdnIntentFromSettings) {
                let vdnDialogStatus = vdnIntentFromSettings['enabled'];
                vdnIsDialogEnabled  = (typeof(vdnDialogStatus) == 'undefined' || vdnDialogStatus === null) ? false : true;
                vdnIsDialogEnabled  = (vdnIsDialogEnabled === true && vdnDialogStatus.trim() == 'enabled') ? true : false;
            }

            vdnSettings.enabled = vdnIsDialogEnabled;
        } 
        if (vdnIsCustomDialogOpted() == true) {
            vdnSettings.enabled = true;
        }
    } catch (err) {
        vdnSettings = vdnTempSettings;
        console.log('Something went wrong while checking settings:' + err.message);
    }

    let isAbsolute = new RegExp('^([a-z]+://|//)', 'i');

    // To handle relative URL
    if (!isAbsolute.test(vdnSettings.url)) {
        if (vdnSettings.url.indexOf('www.') === 0) {
            vdnSettings.url = 'http://' + vdnSettings.url;
        } else {
            vdnSettings.url = (vdnSettings.url.charAt(0) == '/') ? vdnSettings.url : '/' + vdnSettings.url;
            vdnSettings.url = vdnGetCurrentHostURL() + vdnSettings.url;
        }
    }

    vdnSettings.description = vdnSettings.description.trim();
    return vdnSettings;
}

/**
 * Function to get convert speech into text. (For all non-chrome browsers)
 *
 * @param { blob: Blob Object } Blob/frequency data
 * @param { errorRecovery: Boolean } To determine error recovery
 * @param { cb: function } A callback function
 */
function vdnStt(blob, errorRecovery, cb) {
    if (errorRecovery == false) {
        let i = Math.floor(Math.random() * 10); 
        let respPath = vdnAlternativeResponse['randomLib'];
        
        if (vdnRespTimeOut == false) {
            // Play random audio reponse
            vdnIntentResponsePlayer.configure(respPath[i]);
            vdnIntentResponsePlayer.play();

            vdnRespTimeOut = true;

            setTimeout(function () {
                vdnRespTimeOut = false;
            }, 6000);
        }
    }

    let vdnWsURI           = vdnWebSocketUrl.url + vdnWebSocketUrl.tokenQs + vdnServiceKeys['iSTT'] + vdnWebSocketUrl.otherQs;
    let vdnWebsocket       = new WebSocket(vdnWsURI);
    vdnWebsocket.onopen    = function (evt) { vdnWsOnOpen(evt) };
    vdnWebsocket.onclose   = function (evt) { vdnWsOnClose(evt) };
    vdnWebsocket.onmessage = function (evt) { vdnWsOnMessage(evt) };
    vdnWebsocket.onerror   = function (evt) { vdnWsOnError(evt) };

    function vdnWsOnOpen(evt) {
        let vdnWsMessage = {
            'action': 'start',
            'content-type': 'audio/wav',
            'interim_results': false,
            'max_alternatives': 3,
            'smart_formatting': true,            
        };

        vdnWebsocket.send(JSON.stringify(vdnWsMessage));
        vdnWebsocket.send(blob);
        vdnWebsocket.send(JSON.stringify({ 'action': 'stop' }));
        
        // Log service call count
        vdnLogServiceCall();
    }

    function vdnWsOnClose(evt) { /* do nothing for now*/ }

    function vdnWsOnMessage(evt) {
        let vdnWsRes = JSON.parse(evt.data);

        if (vdnWsRes.results != undefined) {
            let vdnWsMsg = "";

            // we have a message coming back :-)
            let vdnWsFoundFinal = false;

            for (let k in vdnWsRes.results) {
                if (vdnWsRes.results[k].final == true) {
                    vdnWsMsg = vdnWsMsg + vdnWsRes.results[k].alternatives[0].transcript;
                    vdnWsFoundFinal = true;
                }
            }

            vdnErrcnt = 0;

            if (vdnWsFoundFinal == true || vdnWsRes.results.length == 0) {
                if (typeof(cb) === 'function') cb(vdnWsMsg);
                vdnWebsocket.close();
            }
        }
    }

    function vdnWsOnError(evt) {
        vdnErrcnt++;
        vdnWebsocket.close();

        if (!(typeof(vdnXApiKey) != 'undefined' && vdnXApiKey !== null)) return;

        if (vdnErrcnt < 2) {
            //$$$$$$$$$$$$$$$ FETCH NEW TOKEN MIGHT HAVE EXPIRED $$$$$$$$$$$$$$$$$$
            vdnRefreshVoiceServicesKeys().then(function(result) {
                vdnServiceKeys['iSTT'] = result;
                vdnStt(blob,true,cb);
            }).catch(function(error) {
                alert(error);
            });
        }
    }
}

/**
 * Function to log query and response conversation of end user & AI to Google Analytics
 *
 * @param { userQuery: String } User query or question or search term.
 * @param { simonResponse: String } An optional parameter as 'response' value 
 */
function vdnLogWithGoogleAnalytics(userQuery, simonResponse) {
    try {
        let vdnTypeOfGaLibrary = null;
        if (typeof(vdnGaTrack) === 'undefined' || vdnGaTrack == null) return;
        
        if (vdnGaTrack == 'yes') {
            let vdnGaEventSent = false;
            let vdnGaEventCategory = 'Voice Dialog Navigation - Conversation Log';
            let vdnGaEventAction = '[ USER QUERY:- ' + userQuery + ' ] [ SIMON RESPONSE:- ' + simonResponse + ' ]';

            // Send event to Google Analytics server using Google Tag Manager
            if(vdnIsGtmPresent) {
                window.dataLayer = window.dataLayer || [];

                // Push event to dataLayer queue to be sent to Google Tag Manager
                window.dataLayer.push({
                    'event': 'VoiceDialogNavigation-QueryResponse',
                    'vdnQueryResponse' : vdnGaEventAction
                });

                vdnGaEventSent = true;
            }

            // Throw error if Google Analytics tracking id is missing or invalid
            if (!(vdnGoogleAnalyticsTrackingId && vdnGoogleAnalyticsTrackingId.indexOf('UA-') !== -1)) {
                throw "Unable to send VDN conversation log to Google Analytics due to unavaibility of the Google Analytics tracking Id.";
            }

            // Send event to Google Analytics server using 'gtag' latest event queue command
            if (!vdnGaEventSent && typeof gtag === 'function' && vdnGtagConfigCount > 0 && vdnGaConfiguredForGtag === true) {
                let vdnGaEventCmdParams = { 'event_category': vdnGaEventCategory };

                // If multiple Google products configured then we need to tell the command queue funciton to whom the event be sent by using 'send_to'.
                if (vdnGtagConfigCount > 1) {
                    if (vdnGoogleAnalyticsTrackingId) {
                        vdnGaEventCmdParams['send_to'] = vdnGoogleAnalyticsTrackingId;
                    } else {
                        throw 'Multiple "gtag" configurations detected but Google Analytics tracking id is missing.';
                    }
                }

                gtag('event', vdnGaEventAction, vdnGaEventCmdParams);
                vdnGaEventSent = true;
            }

            // Send event to Google Analytics server by legacy 'ga' event queue command
            if (!vdnGaEventSent && typeof ga === 'function') {
                ga('send', 'event', vdnGaEventCategory, vdnGaEventAction);
                vdnGaEventSent = true;
            }

            // Throw exception if event is not fired with any of the available GA event mechanism or GA event mechanism is not available
            if (!vdnGaEventSent) {
                throw 'Supported Google Analytics library not available.';
            }
        }
    } catch (err) {
        let errorMessage = typeof err === 'string' ? err : err.message;
        console.log('VDN Google Analytics Log Process Error: ' + errorMessage);
    }
}

/**
 * Function to send dialog to Simon AI
 *
 * @param { msg: String } Question or query
 * @param { cb: function } A callback function
 * @param { widgetElementsObj: Object } Object with properties containing reference to widget DOM objects
 */
function vdnSendDialog(msg, cb, widgetElementsObj = null) {
    if (!(typeof(vdnXApiKey) != 'undefined' && vdnXApiKey !== null)) return;
    
    if (!(typeof(msg) != 'undefined' && msg != null && msg.trim() != '')) return;

    //To support WooCommerce we need to capture the current URL we are on!
    //Lets fetch the entire URL and provide it to Simon AI
    let currentURL = window.location.href;
    console.log("Will send the URL: " + currentURL + " to SimonAI as base URL");
    vdnMyStatus.cUrl = currentURL;

    let vdnBody = {
        // This is where you define the body of the request
        'msg': msg,
        'context': vdnMyContext,        
        'status': vdnMyStatus
    };

    // local function to manipulate widget DOM nodes
    function vdnHandleWidgetElementsObj (response) {
        try {
            if (widgetElementsObj !== null) {
                let vdnChatHistory = null;     //to manage chat hidtory
                vdnChatHistory =  localStorage.getItem('vdnChatHistory');
                if (vdnChatHistory != null) {
                    widgetElementsObj.chatConvoEl.innerHTML = "";    
                }

                widgetElementsObj.userMsgEl.innerHTML = msg;
                widgetElementsObj.simonMsgEl.innerHTML = response;
                widgetElementsObj.userMsgElWrapper.appendChild(widgetElementsObj.userMsgEl);
                widgetElementsObj.chatConvoEl.appendChild(widgetElementsObj.userMsgElWrapper);
                widgetElementsObj.chatConvoEl.appendChild(widgetElementsObj.simonMsgEl);

                if (vdnChatHistory == null) {
                    localStorage.setItem('vdnChatHistory', widgetElementsObj.chatConvoEl.innerHTML);
                }
                else {
                    vdnChatHistory = vdnChatHistory+" "+widgetElementsObj.chatConvoEl.innerHTML;
                    localStorage.setItem('vdnChatHistory', vdnChatHistory);
                    widgetElementsObj.chatConvoEl.innerHTML = vdnChatHistory;
                }                

                // Scroll chat convo to the end
                if (typeof(widgetElementsObj.chatConvoEl.scrollTop) != 'undefined' 
                    && typeof(widgetElementsObj.chatConvoEl.scrollHeight) != 'undefined') {
                    widgetElementsObj.chatConvoEl.scrollTop = widgetElementsObj.chatConvoEl.scrollHeight;
                }

                widgetElementsObj.expandCollapseHandle();
            }
        } catch (err) { /* Do nothing */ }
    }

    let vdnDataStr = JSON.stringify(vdnBody, null, true);
    let vdnXhttpForSendDialog = new XMLHttpRequest();
    let vdnCurrentDate = new Date();
    let vdnCurrentTimestamp = vdnCurrentDate.getTime();
    let vdnWidgetConversation = {'userQuery': "", 'simonResponse': ''};

    vdnXhttpForSendDialog.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            var vdnConversationResult = JSON.parse(this.responseText);

            // handle unexpected search request
            if (!(typeof vdnConversationResult != 'undefined' && !!vdnConversationResult)) {
                cb(vdnAlternativeResponse['unableToProcess']);
                return;
            }

            vdnConversationResult['description'] = vdnConversationResult.description != 'undefined' ? vdnConversationResult.description : "";
            vdnConversationResult['url'] = vdnConversationResult.url != 'undefined' ? vdnConversationResult.url : "";

            // Log user query and AI response to Google Analytics
            vdnLogWithGoogleAnalytics(msg, vdnConversationResult.description);

            // take status object which contians 'intent'
            if (typeof vdnConversationResult.status != undefined) {
                vdnMyStatus = vdnConversationResult.status;
            }

            if (typeof vdnConversationResult.context != undefined) {
                vdnMyContext = vdnConversationResult.context;
            }

            let intentOfUser = typeof vdnMyStatus.intent != 'undefined' ? vdnMyStatus.intent : null;

            // Prefer configured intent from settings page if available
            let vdnJustifiedResult = vdnCheckAndGetIntentFromSettings(
                intentOfUser,
                vdnConversationResult.description,
                vdnConversationResult.url.toLowerCase()
            );
            vdnConversationResult.description = vdnJustifiedResult.description;
            vdnConversationResult.url = vdnJustifiedResult.url;

            // If dialog for intent has been disabled from settings then stop AI search process.
            if (vdnJustifiedResult.enabled == false) {
                cb(vdnAlternativeResponse['disabledIntentResponse'], null, true);

                // For widget
                let resp = vdnMessages['traditionalSearch'];
                vdnHandleWidgetElementsObj(resp);

                vdnWidgetConversation.userQuery = msg;
                vdnWidgetConversation.simonResponse = resp;
                localStorage.setItem('vdnWidgetConversation', JSON.stringify(vdnWidgetConversation, null, true));

                return;
            }

            if (!!vdnConversationResult.description) {
                // For audio file path
                let vdnIntentResponseAudioPath = vdnAlternativeResponse['defaultDesc'];

                //################################################################################################
                //
                // FOR CUSTOM DIALOGS
                //
                //################################################################################################
                if (vdnIsCustomDialogOpted()) {
                    let vdnExistingCdReponse = vdnGetExistingCustomDialogResponse(vdnVoiceAndLanguage, vdnConversationResult.description);

                    if (!!vdnExistingCdReponse) {
                        vdnIntentResponseAudioPath = typeof vdnExistingCdReponse['path'] != 'undefined' && !!vdnExistingCdReponse['path'] ? vdnExistingCdReponse['path'] : vdnAlternativeResponse['defaultDesc'];
                        
                        vdnResAndNavHandler();
                    } else {
                        // Generate new custom dialog response
                        vdnCustomDialogTtsOnTheFly(vdnConversationResult.description).then(function(vdnNewCdReponse) {
                            if (!!vdnNewCdReponse) {
                                vdnIntentResponseAudioPath = typeof vdnNewCdReponse['path'] != 'undefined' && !!vdnNewCdReponse['path'] ? vdnNewCdReponse['path'] : vdnAlternativeResponse['defaultDesc'];
                            }

                            vdnResAndNavHandler();
                        }).catch(function(err){
                            console.log('VDN Error: Something went wrong while TTS process for custom dialog.');

                            vdnResAndNavHandler();
                        });
                    }
                } else {
                    //################################################################################################
                    //
                    // FOR GENERIC DIALOGS (Active/enabled Generic dialogs)
                    //
                    //################################################################################################
                    let tempDialogData  = vdnGetGenericDialog(vdnVoiceAndLanguage, intentOfUser);
                    let dialog = tempDialogData['dialog'];
                    let generateAudio = tempDialogData['generateAudio'];
                    
                    if (!!dialog && generateAudio === true) {
                        //############################################################################################
                        // Generic dialog exist but audio data is invalid (Audio file is missing or language mismatch)
                        //############################################################################################
                        let dbOpName = 'option_name' in dialog && !!dialog['option_name'] ? dialog['option_name'] : null;
                        let dialogText = 'response' in dialog && !!dialog['response'] ? dialog['response'] : null;

                        if (!!dialogText && !!dbOpName) {
                            vdnGenericDialogTtsOnTheFly(dialogText, dbOpName).then(function(result){
                                vdnIntentResponseAudioPath = typeof result != 'undefined' && typeof result['path'] != 'undefined' ? result['path'] : vdnAlternativeResponse['defaultDesc'];
                                vdnResAndNavHandler();
                            }).catch(function(err){
                                console.log('VDN Error: Something went wrong while TTS process for generic dialog.');
                                vdnResAndNavHandler();
                            });
                        }
                    } else {
                        //################################################################################
                        // Generic dialog exist with valid (File exist with matching language) audio data
                        //################################################################################
                        let audioData = !!dialog && typeof dialog['intent_audio_response'] != 'undefined' ? dialog['intent_audio_response'] : {};
                        let audioPath = 'path' in audioData && !!audioData['path'] ? audioData['path'] : null;

                        if (!!audioPath) vdnIntentResponseAudioPath = audioPath;
                        
                        vdnResAndNavHandler();
                    }
                }

                //#######################################################################
                // Function to handle response and navigation URL from conversation API
                //#######################################################################
                function vdnResAndNavHandler(){
                    vdnHandleWidgetElementsObj(vdnConversationResult.description);

                    vdnWidgetConversation.userQuery = msg;
                    vdnWidgetConversation.simonResponse = vdnConversationResult.description;
                    localStorage.setItem('vdnWidgetConversation', JSON.stringify(vdnWidgetConversation, null, true));

                    /**
                     *
                     * All of the three conditions prime intention to overcome issues with 'mic access' and 'audio play' due to browser's 'auto play' security policy
                     * 
                     * # NAVIGATION FLOW
                     * This if block represents slightly different 'navigation' flow than the plugin's prime navigation flow.
                     * Navigtion flow imposed: Read/speak out the response first and then navigate. (Plugin's prime navigation flow does exactly opposite of it)
                     *
                     * # TARGET PLATFORMS
                     * 1st Condition: iOS Safari (Till now Feb 2020 Chrome and Firefox on iOS unable to acquire mic accesss, hence they are obsolete from support for this plugin)
                     * 2nd Condition: Firefox on Android phone to overcome issues caused by browser's 'auto play' security policy
                     * 3rd Condition: Safari on Mac to overcome issues caused by browser's 'auto play' security policy.
                     * 4th Condition: Firefox on Widnows to overcome issues caused by browser's 'auto play' security policy.
                     *
                     */
                    if (
                        vdnClientInfo.ios // For iOS Safari (Till now Feb 2020 Chrome and Firefox unable gain mic access on iOS)
                        || (vdnClientInfo.android && vdnClientInfo.firefox)
                        || (vdnClientInfo.safari && !vdnClientInfo.chrome && !vdnClientInfo.firefox)
                        || (vdnClientInfo.windows && vdnClientInfo.firefox)
                        ) {
                        cb(vdnIntentResponseAudioPath, function() {
                            if (vdnConversationResult.url != undefined && vdnConversationResult.url != "" 
                                && !vdnUrlPointsToCurrentPage(vdnConversationResult.url)) {
                                // If intent result points to current page/url then do not open new window
                                location.assign(vdnConversationResult.url); 
                            } else {
                                localStorage.removeItem('vdnWidgetConversation');
                            }
                        });
                    } else {
                        if (vdnConversationResult.url != undefined && vdnConversationResult.url != "") {
                            let vdnUrlBlongsToCurrentDomain = vdnUrlIsPartOfCurrentDomain(vdnConversationResult.url.toLowerCase());

                            // handle invalid URL 
                            if (vdnUrlBlongsToCurrentDomain == null) {
                                cb(vdnIntentResponseAudioPath);
                                localStorage.removeItem('vdnWidgetConversation'); 
                                alert(vdnMessages['pageUnavailable']);
                                return;
                            }
                            
                            // URL pointing to third party URL
                            if (vdnUrlBlongsToCurrentDomain == false) {
                                try {
                                    if (vdnWin1 != -1) {
                                        vdnWin1.close();
                                    }
                                } catch (err) {
                                    console.log("We had an error. Error " + err.message);
                                }

                                vdnWin1 = window.open(vdnConversationResult.url, vdnConversationResult.url);
                                cb(vdnIntentResponseAudioPath);
                                localStorage.removeItem('vdnWidgetConversation');
                            } else {
                                // URL is associted with current domain
                                let vdnApiRespDesc = vdnConversationResult.description;

                                function vdnChangeURL(vdnUrl) {
                                    var vdnChangeUrlTimer = null;

                                    // If intent result points to current page/url then play the voice only
                                    if (vdnUrlPointsToCurrentPage(vdnUrl)) {
                                        cb(vdnIntentResponseAudioPath);
                                        localStorage.removeItem('vdnWidgetConversation');
                                        return;
                                    }

                                    let vdnRootUrl   = vdnUrl;
                                    let vdnPos       = vdnRootUrl.indexOf('#');
                                    let vdnIsNewPage = false;
                                    
                                    if (vdnPos > -1) {
                                        vdnRootUrl = vdnRootUrl.substring(0, vdnPos);

                                        if (vdnUrlPointsToCurrentPage(vdnRootUrl)) {
                                            console.log("We need to navigate within the same page");
                                        } else {
                                            vdnIsNewPage = true;
                                        }
                                    }

                                    if (vdnUrl.indexOf('#') == -1 || vdnIsNewPage == true) {
                                        if (vdnIsTalking === true) {
                                            var vdnChangeUrlTimer = setTimeout(function () {
                                                vdnChangeURL(vdnUrl);
                                                clearInterval(vdnChangeUrlTimer);
                                            }, 500);
                                            return;
                                        }

                                        localStorage.setItem('vdnPendingPlaybackPath', vdnIntentResponseAudioPath);
                                        localStorage.setItem('vdnCtx', JSON.stringify(vdnMyContext, null, true));
                                        localStorage.setItem("vdnStat", JSON.stringify(vdnMyStatus, null, true));

                                        if (typeof(vdnChangeUrlTimer) != 'undefined' && vdnChangeUrlTimer != null) {
                                            clearInterval(vdnChangeUrlTimer);
                                        }
                                    } else {
                                        cb(vdnIntentResponseAudioPath);
                                        localStorage.removeItem('vdnWidgetConversation');
                                    }

                                    location.assign(vdnUrl);
                                }

                                vdnChangeURL(vdnConversationResult.url.trim());
                            }
                        } else {
                            cb(vdnIntentResponseAudioPath);
                            localStorage.removeItem('vdnWidgetConversation');
                        }
                    }

                    if (vdnConversationResult.url2 != undefined && vdnConversationResult.url2 != "") {
                        try {
                            if (vdnWin2 != -1) {
                                vdnWin2.close();
                            }
                        } catch (err) {
                            console.log("We had an error. Error " + err.message);
                        }

                        vdnWin2 = window.open(vdnConversationResult.url2, vdnConversationResult.url2);
                        localStorage.removeItem('vdnWidgetConversation');
                    }
                }
            }
        } else if (this.readyState == 4 && this.status != 200) {
            // Log AJAX request exception to Google Analytics
            vdnLogWithGoogleAnalytics(msg, vdnMessages['callFailed']);
        }
    };
    
    try {
        var apiUrl = vdnSendDialogApiUrl;

        // Check if custom prefered to use custom dialog
        if (vdnIsCustomDialogOpted()) {
            apiUrl = vdnCustomEndpoint
        }

        vdnXhttpForSendDialog.open("POST", apiUrl, true);
        vdnXhttpForSendDialog.setRequestHeader("Accept", "application/json");
        vdnXhttpForSendDialog.setRequestHeader("Content-type", "application/json");
        vdnXhttpForSendDialog.setRequestHeader("Access-Control-Allow-Origin", "*");
        vdnXhttpForSendDialog.setRequestHeader("x-api-key", vdnXApiKey);
        vdnXhttpForSendDialog.send(vdnDataStr);
    } catch (err) {
        console.log('We had an error. Error:' + err.message);
        localStorage.removeItem('vdnWidgetConversation');
        return;
    }
}

/**
 * Function to get current host/domain full URL
 *
 */
function vdnGetCurrentHostURL() {
    var currentHostUrl = null;
    try {
        if (!(typeof(window.location) != 'undefined' 
            && typeof(window.location.hostname) != 'undefined' 
            && typeof(window.location.protocol) != 'undefined')) {
            return vdnGetHostName();
        }

        var thisProtocol = window.location.protocol;
        var thisHostname = window.location.hostname;

        currentHostUrl = thisProtocol + '//' + thisHostname;
    } catch (err) {
        currentHostUrl = vdnGetHostName();
        console.log('Something went wrong while discovering current domain.');
    }

    return currentHostUrl;
}

/**
 * Function to get current host name from backend.
 */
function vdnGetHostName() {
    return vdnHostName;
}

/**
 * Function to check whether provided URL is associted with current domain/host
 *
 * @param { url:  String } URL to check 
 *
 * @returns { vdnUrlAssociated: Boolean } 'true' if 'url' is within same domain/host otherwise 'false'
 */
function vdnUrlIsPartOfCurrentDomain(url) {
    let vdnUrlAssociated = false;
    try {
        // handle exception
        if (typeof(url) ==  'undefined' || url === null) {
            return null;
        }

        let vdnUrlProtocol = '';

        // get protocol
        if (url.indexOf('http://') === 0) {
            vdnUrlProtocol = 'http://';
        } else if (url.indexOf('https://') === 0) {
            vdnUrlProtocol = 'https://';
        } 

        let vdnStart = (vdnUrlProtocol.length == 0) ? 0 : vdnUrlProtocol.length;
        let vdnDomainNameWithoutProtocol = url.substring(vdnStart);// Removing protocol
        let vdnFirstDomainSuffixTrailingSlashPos = vdnDomainNameWithoutProtocol.indexOf('/');
        let vdnDomainName = vdnDomainNameWithoutProtocol;

        if (vdnFirstDomainSuffixTrailingSlashPos != -1) {
            vdnDomainName = vdnDomainNameWithoutProtocol.substring(0, vdnFirstDomainSuffixTrailingSlashPos);
        }

        vdnDomainName = vdnUrlProtocol + vdnDomainName;

        if (vdnDomainName.indexOf(vdnGetCurrentHostURL()) === 0) {
            vdnUrlAssociated = true;
        }
    } catch (err) {
        vdnUrlAssociated = null;
        console.log('Something went wrong while checking URL.');
    }

    return vdnUrlAssociated;
}

/**
 * Function to check whether response URL pointing to current page/URL
 *
 * @param { vdnUrl: String } URL to check 
 *
 * @returns { vdnUrlPointingToCurrentPage: Boolean } 'true' if 'vdnUrl' is same as current url/page otherwise 'false'
 */
function vdnUrlPointsToCurrentPage(vdnUrl = null) {
    var vdnUrlPointingToCurrentPage = false;
    try {
        if (!(typeof(vdnUrl) != 'undefined' && vdnUrl !== null)) return true;

        var vdnCurrentUrl = window.location.href;
        vdnUrl = vdnUrl.trim();
        var vdnCurrentUrlLastChar = vdnCurrentUrl[vdnCurrentUrl.length - 1];
        vdnCurrentUrlLastChar = (vdnCurrentUrlLastChar == '/') ? vdnCurrentUrlLastChar : null;

        if (vdnUrl.length != 0 && vdnUrl.indexOf('/') == (vdnUrl.length - 1)
            && typeof(vdnCurrentUrlLastChar) != 'undefined' && vdnCurrentUrlLastChar != '/') {
            vdnCurrentUrl += '/';
        }

        // check if given url pointing to current page
        if (vdnCurrentUrl == vdnUrl) {
            vdnUrlPointingToCurrentPage = true;
        }
    } catch (err) {
        vdnUrlPointingToCurrentPage = true;
        console.log('Something went wrong while getting current full URL.');
    }

    return vdnUrlPointingToCurrentPage;
}

/**
 * Function to log STT service call
 *
 * @param {vdnUpdateLastValue - Number} : 0 to not to update last value or 1 to update last value
 */
function vdnLogServiceCall(vdnUpdateLastValue = 0) {   
    try {
        let vdnXhr = new XMLHttpRequest();
       
        vdnXhr.onreadystatechange = function () {
            if (this.readyState == 4 && this.status == 200) {
                let res = JSON.parse(this.responseText);

                // Update localized variables of service log 
                vdnServiceLogs.updatedAt    = res.updatedAt || vdnServiceLogs.updatedAt;
                vdnServiceLogs.currentValue = res.currentValue || vdnServiceLogs.currentValue;
                vdnServiceLogs.lastValue    = res.lastValue || vdnServiceLogs.lastValue;
            }
        };

        vdnXhr.open("POST", vdnAjaxObj.ajax_url , true); 
        vdnXhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
        vdnXhr.send("action=vdn_log_service_call&_ajax_nonce=" + vdnAjaxObj.nonce + "&updateLastValue=" + vdnUpdateLastValue);
    } catch (err) {
        // Do nothing for now
    }
}

/**
 * Function to obtain voice services token and keys
 *
 */
function vdnRefreshVoiceServicesKeys() {   
    return new Promise(function(resolve, reject){
        let vdnXhr = new XMLHttpRequest();
        
        vdnXhr.onreadystatechange = function () {
            if (this.readyState == 4) { 
                if (this.status === 200) {
                    let res = JSON.parse(this.response);
                    let refreshedToken = typeof(res.token) != 'undefined' ? res.token : null;

                    if (!!refreshedToken) {
                        resolve(refreshedToken);
                    } else {

                        if (!!vdnSttLanguageContext['gcp']['stt'] && 'gStt' in res && !!res['gStt']) {
                            resolve(res['gStt']);
                            return;
                        }
                        reject(vdnErrorLibrary['outOfService']);
                    }
                } else {
                    // Handle response errors
                    reject(vdnErrorLibrary['outOfService']);
                }
            }
        };

        let queryString = "?action=vdn_refresh_access_keys&_ajax_nonce=" + vdnAjaxObj.keys_nonce;
        vdnXhr.open("GET", vdnAjaxObj.ajax_url + queryString , true); 

        // Handle parsing or transmission errors
        vdnXhr.onerror = function(error) { reject(vdnErrorLibrary['outOfService']); }
        vdnXhr.send(null);
    });
}

/**
 * Function to convert speech to tect using google stt
 *
 * @param {base64AudioStr - String} : Base 64 audio string
 */
function vdnGcpStt(base64AudioStr) {
    return new Promise(function(resolve, reject){
        if (!(
            !!vdnSttLanguageContext['gcp']['endPoint'] &&
            !!vdnSttLanguageContext['gcp']['key'] &&
            !!vdnSttLanguageContext['gcp']['langCode'] &&
            typeof base64AudioStr != 'undefined' &&
            !!base64AudioStr
            ))
        {
            reject(null);
            return;
        }

        if (vdnErrcnt == 0) {
            let i = Math.floor(Math.random() * 10); 
            let resp = vdnAlternativeResponse['randomLib'];

            // Play 'random' playback
            vdnIntentResponsePlayer.configure(resp[i]);
            vdnIntentResponsePlayer.play();
        }

        let vdnXhr = new XMLHttpRequest();

        vdnXhr.onreadystatechange = function () {
            if (this.readyState == 4) { 
                try {
                    let res = JSON.parse(this.response);
                    
                    if (this.status === 200) {
                        vdnErrcnt = 0;
                        let results = typeof res != 'undefined' && res instanceof Object && 'results' in res ? res['results'] : [];
                        let efficientResult = !!results && results.length > 0 && results[0] instanceof Object ? results[0] : {};
                        let alternatives = 'alternatives' in efficientResult && !!efficientResult['alternatives'] ? efficientResult['alternatives'] : [];
                        let alternativeObj = alternatives.length > 0 && alternatives[0] instanceof Object ? alternatives[0] : {};
                        let transcript = 'transcript' in alternativeObj && !!alternativeObj['transcript'] ? alternativeObj['transcript'] : null;

                        if (typeof transcript != 'undefined' && !!transcript) {
                            resolve(transcript);
                        } else {
                            reject(null);
                        }
                    } else {
                        // Handle response errors
                        let error = 'error' in res ? res['error'] : {};
                        let message = 'message' in error && !!error['message'] ? error['message'].toLowerCase() : '';

                        if (vdnErrcnt < 1 && !!message && message.indexOf('api key') !== -1) {
                            vdnErrcnt++;

                            //$$$$$$$$$$$$$$$ FETCH NEW TOKEN MIGHT HAVE EXPIRED $$$$$$$$$$$$$$$$$$
                            vdnRefreshVoiceServicesKeys().then(function(result) {
                                vdnSttLanguageContext['gcp']['key'] = result;

                                // Try to transcript again with updated key
                                vdnGcpStt().then(function(res){
                                    if (!!res) {
                                        resolve(res);
                                    } else {
                                        vdnErrcnt = 0;
                                        reject(null);
                                    }
                                }).catch(function(err){
                                    vdnErrcnt = 0;
                                    reject(null);
                                })
                            }).catch(function(error) {
                                alert(error);
                                vdnErrcnt = 0;
                                reject(null);
                            });
                        } else {
                            vdnErrcnt = 0;
                            reject(null);
                        }
                    }
                } catch(err) {
                    reject(null);
                }
            }
        }

        // Handle parsing or transmission errors
        vdnXhr.onerror = function(error) { reject(null); }
        
        vdnXhr.open("POST", vdnSttLanguageContext['gcp']['endPoint'] + vdnSttLanguageContext['gcp']['qs']['key'] + vdnSttLanguageContext['gcp']['key'], true); 
        vdnXhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");

        let recognitionConfig = { 
            'config': {
                'encoding': 'ENCODING_UNSPECIFIED',
                'languageCode': vdnSttLanguageContext['gcp']['langCode'],
                'enableWordTimeOffsets': false,
            },
            'audio': {
                'content': base64AudioStr
            },
        };

        vdnXhr.send(JSON.stringify(recognitionConfig, null, true));
    });
}


/**
 * Function to sanitize/smartly format email to avoid text in a place of anticipated symbols
 *
 * @param { emailString: String } Email string to be formatted
 *
 * @returns { formattedEmail: String } Smartly formatted/sanitized email.
 */
function vdnFormatEmail(emailString = null) {
    let formattedEmail = emailString;
    try {
        if (emailString && emailString !== null) {
            let vfEmail = emailString.toLowerCase();
            vfEmail = vfEmail.replace(/dot/gi, ".")
            .replace(/at/gi, "@")
            .replace(/underscore/gi, "_")
            .replace(/dotcom/gi, ".com")
            .replace(/dotorg/gi, ".org")
            .replace(/dotnet/gi, ".net")
            .replace(/dotint/gi, ".int")
            .replace(/dotedu/gi, ".edu")
            .replace(/ /g, "");

            formattedEmail = vfEmail;
        }
    } catch(err) {
        formattedEmail = emailString;
    }

    return formattedEmail;
}

/**
 * Function to get existing custom dialog response.function
 *
 * @param String selectedVoice  voice to check
 * @param String responseText  Speech text to check
 *
 * @return any If found returns object otherwise null
 *
 */
function vdnGetExistingCustomDialogResponse(selectedVoice, responseText) {
    let existingCustomResponse = null;

    try {
        if (typeof vdnCustomResponses != 'undefined' && !!vdnCustomResponses && typeof selectedVoice != 'undefined' && !!selectedVoice) {
            let totalRes  = vdnCustomResponses.length;
            selectedVoice = selectedVoice.trim();
            responseText  = responseText.trim();

            for (let wa = 0; wa < totalRes; wa++) {
                let res = vdnCustomResponses[wa];
                let existingSpeechText = typeof res['response'] != 'undefined' && res['response'] ? res['response'].trim() : null;
                let existingSpeechVoice = typeof res['voice'] != 'undefined' && res['voice'] ? res['voice'].trim() : null;
                
                if (!(!!existingSpeechText && !!existingSpeechVoice)) continue;

                if (existingSpeechText === responseText && selectedVoice === existingSpeechVoice) {
                    existingCustomResponse = JSON.parse(JSON.stringify(res));
                    break;
                }
            }
        }
    } catch(err) {
        existingCustomResponse = null;
    }

    return existingCustomResponse;
}

/**
 * Function to get Generic dialog based on given intent name and get validation flag to determine need of audio generation.
 *
 * @param String selectedVoice  Currently selected voice of plugin  
 * @param String intentName  Name of the intent/dialog
 *
 * @return Object existingDialog  Containing generic dialog object and a boolean flag to denote need of audio generation
 *
 */
function vdnGetGenericDialog(selectedVoice, intentName) {
    this.existingDialog = { 'dialog': {}, 'generateAudio': false };

    try {
        if (
            !(typeof vdnSettingsData != 'undefined' && !!vdnSettingsData &&
            typeof selectedVoice != 'undefined' && !!selectedVoice &&
            typeof intentName != 'undefined' && !!intentName)
        ) {
            throw 'VDN Error: Settings data or parameters are missing while checking generic dialog existence.';
        }

        this.selectedVoice = selectedVoice.trim();
        this.intentName = intentName.trim();
        this.dialog = this.intentName in vdnSettingsData ? vdnSettingsData[this.intentName] : {};

        if (!(!!this.dialog && Object.keys(this.dialog).length > 0)) {
            throw 'VDN Error: Dialog is missing while checking generic dialog existence.';
        }

        this.existingDialog['dialog'] = JSON.parse(JSON.stringify(this.dialog));

        let dialogText = 'response' in this.dialog && !!this.dialog['response'] ? this.dialog['response'].trim() : null;
        let dialogActive = 'enabled' in this.dialog && !!this.dialog['enabled'] ? this.dialog['enabled'].trim() : null;

        let audioData = 'intent_audio_response' in this.dialog && !!this.dialog['intent_audio_response'] ? this.dialog['intent_audio_response'] : {};
        let audioVoice = 'voice' in audioData && !!audioData['voice'] ? audioData['voice'].trim() : null;
        let audioPath = 'path' in audioData && !!audioData['path'] ? audioData['path'].trim() : null;

        if (
            typeof dialogText != 'undefined' && !!dialogText &&
            typeof dialogActive != 'undefined' && !!dialogActive && dialogActive === 'enabled' && 
            (!(typeof audioPath != 'undefined' && !!audioPath) ||
            !(typeof audioVoice != 'undefined' && !!audioVoice && 
            audioVoice === this.selectedVoice))
        ){
            this.existingDialog['generateAudio'] = true;
        }
    } catch(err) {
        this.existingDialog = { 'dialog': {}, 'generateAudio': false };
    }

    return this.existingDialog;
}

/**
 * Function to make AJAX call for generating custom dialog response
 *
 * @param String cdResponseText Spech text
 *
 * @return Promise
 */
function vdnCustomDialogTtsOnTheFly(cdResponseText) {    
    return new Promise(function(resolve, reject) {
        if (!(typeof cdResponseText != 'undefined' && !!cdResponseText)) {
            reject(null);
            return;
        }        

        let formData = new FormData();
        formData.append("response_text", cdResponseText);
        formData.append("action", "vdn_custom_dialog_text_to_speech");
        formData.append("_ajax_nonce", vdnAjaxObj.custom_dialog_nonce);
        
        let vdnXhr = new XMLHttpRequest();

        vdnXhr.onreadystatechange = function () {
            if (this.readyState == 4) { 
                if (this.status === 200) {
                    let res = JSON.parse(this.response);
                    let success = typeof res['success'] != 'undefined' && res.success === true ? true : false; 
                    let data = typeof res['data'] != 'undefined' ? res['data'] : null;
                    
                    if (!!data && success) {
                        let updatedCollection = typeof data['updated_collection'] != 'undefined' ? data['updated_collection'] : null;
                        let customResponse = typeof data['custom_response'] != 'undefined' ? data['custom_response'] : null;

                        if (!!updatedCollection && !!customResponse) {
                            vdnCustomResponses = updatedCollection;
                            resolve(customResponse);
                        } else {
                            reject(null);
                        }
                    } else {
                        reject(null);
                    }
                } else {
                    // Handle response errors
                    reject(null);
                }
            }
        }

        // Handle parsing or transmission errors
        vdnXhr.onerror = function(error) { reject(vdnErrorLibrary['outOfService']); }
        
        let queryString = "?action=vdn_custom_dialog_text_to_speech&_ajax_nonce=" + vdnAjaxObj.custom_dialog_nonce;
        vdnXhr.open("POST", vdnAjaxObj.ajax_url, true); 
        vdnXhr.send(formData);
    });
}

/**
 * Function to make AJAX call for generating generic dialog response
 *
 * @param String gdResponseText Spech text
 *
 * @return Promise
 */
function vdnGenericDialogTtsOnTheFly(gdResponseText, dbOptionName) {    
    return new Promise(function(resolve, reject) {
        if (!(typeof gdResponseText != 'undefined' && !!gdResponseText && typeof dbOptionName != 'undefined' && !!dbOptionName)) {
            reject(null);
            return;
        }        

        let formData = new FormData();
        formData.append("dialog_text", gdResponseText);
        formData.append("dialog_op_name", dbOptionName);
        formData.append("user", "tts");
        formData.append("action", "vdn_generic_dialog_tts_on_the_fly");
        formData.append("_ajax_nonce", vdnAjaxObj.generic_dialog_nonce);
        
        let vdnXhr = new XMLHttpRequest();

        vdnXhr.onreadystatechange = function () {
            if (this.readyState == 4) { 
                if (this.status === 200) {
                    let res = JSON.parse(this.response);
                    let success = typeof res['success'] != 'undefined' && res.success === true ? true : false; 
                    let data = typeof res['data'] != 'undefined' ? res['data'] : null;
                    
                    if (!!data && success) {
                        if (typeof data['path'] != 'undefined' && data['path']) {
                            let updatedGenericDialogs = typeof data['updated_generic_dialogs'] != 'undefined' ? data['updated_generic_dialogs'] : null;
                            
                            if (!!updatedGenericDialogs && Object.keys(updatedGenericDialogs).length > 0) vdnSettingsData = updatedGenericDialogs;
                            
                            resolve(data);
                        } else {
                            reject(null);
                        }
                    } else {
                        reject(null);
                    }
                } else {
                    // Handle response errors
                    reject(null);
                }
            }
        }

        // Handle parsing or transmission errors
        vdnXhr.onerror = function(error) { reject(vdnErrorLibrary['outOfService']); }
        
        vdnXhr.open("POST", vdnAjaxObj.ajax_url, true); 
        vdnXhr.send(formData);
    });
}
