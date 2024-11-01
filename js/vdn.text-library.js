// *****************************************************************************************************
// *******              speak2web VOICE DIALOG NAVIGATION                                    ***********
// *******               AI Service requires subcriptions                                    ***********
// *******               Get your subscription at                                            ***********
// *******                    https://speak2web.com/plugin#plans                             ***********
// *******               Need support? https://speak2web.com/support                         ***********
// *******               Licensed GPLv2+                                                     ***********
//******************************************************************************************************

/**
 * General constants 
 *
 */
var vdnPathUrl = typeof vdnPath != 'undefined' ? vdnPath : null;
var vdnSelectedLang = 'en-US'; // For utterance/speech
var vdnVoiceAndLanguage = (typeof(vdnConfiguredVoice) != 'undefined' && vdnConfiguredVoice !== null) ? vdnConfiguredVoice.trim() : 'male_en_US';// Configured Voice from settings
var vdnServiceKeys = {
    'iSTT': typeof vdnIsttT != 'undefined' ? vdnIsttT : null
};

var vdnIsSttLangCtx = typeof _vdnSttLanguageContext != 'undefined' && !!_vdnSttLanguageContext && _vdnSttLanguageContext instanceof Object ? true : false;
var vdnSttLanguageContext = {
    'gcp': {
        'stt': null,
        'langCode': null,
        'endPoint': null,
        'key': null,
        'qs': {'key': null}
    }
}

if (vdnIsSttLangCtx === true) {
    //###############################
    // GCP
    //###############################
    let gcp = 'gcp' in _vdnSttLanguageContext && _vdnSttLanguageContext['gcp'] instanceof Object ? _vdnSttLanguageContext['gcp'] : {};
    vdnSttLanguageContext['gcp']['stt'] = 'stt' in gcp && gcp['stt'] == 'Y' ? true : false;

    if (!!vdnSttLanguageContext['gcp']['stt']) {
        vdnSttLanguageContext['gcp']['endPoint'] = 'endPoint' in gcp && typeof gcp['endPoint'] != 'undefined' && !!gcp['endPoint'] ? gcp['endPoint'] : null;
        vdnSttLanguageContext['gcp']['key'] = 'key' in gcp && typeof gcp['key'] != 'undefined' && !!gcp['key'] ? gcp['key'] : null;
        vdnSttLanguageContext['gcp']['langCode'] = 'langCode' in gcp && typeof gcp['langCode'] != 'undefined' && !!gcp['langCode'] ? gcp['langCode'] : null;

        let qs = 'qs' in gcp && gcp['qs'] instanceof Object ? gcp['qs'] : {};
        vdnSttLanguageContext['gcp']['qs']['key'] = 'key' in qs && typeof qs['key'] != 'undefined' && !!qs['key'] ? qs['key'] : null;
    }
}

//####################################
// CLIENT INFO
//####################################
let vdnNavigator = { 'navigatorUserAgent': navigator.userAgent.toLowerCase(), 'navigatorPlatform': navigator.platform };
var vdnClientInfo = {
    'safari': vdnNavigator.navigatorUserAgent.indexOf('safari') > -1,
    'chrome': vdnNavigator.navigatorUserAgent.indexOf('chrome') > -1,
    'firefox': vdnNavigator.navigatorUserAgent.indexOf('firefox') > -1,
    'edge': vdnNavigator.navigatorUserAgent.indexOf('edge') > -1 || vdnNavigator.navigatorUserAgent.indexOf('edg') > -1,
    'ie': vdnNavigator.navigatorUserAgent.indexOf('msie') > -1 || vdnNavigator.navigatorUserAgent.indexOf('trident') > -1,
    'opera': vdnNavigator.navigatorUserAgent.indexOf('opera') > -1 || vdnNavigator.navigatorUserAgent.indexOf('opr') > -1,

    'ios': !!vdnNavigator.navigatorPlatform && /iPad|iPhone|iPod/.test(vdnNavigator.navigatorPlatform),
    'android': vdnNavigator.navigatorUserAgent.indexOf("android") > -1,
    'windows': vdnNavigator.navigatorUserAgent.indexOf("windows") > -1,
    'linux': vdnNavigator.navigatorUserAgent.indexOf("linux") > -1,
    
    'macSafari': vdnNavigator.navigatorUserAgent.indexOf('mac') > -1 && vdnNavigator.navigatorUserAgent.indexOf('safari') > -1 && vdnNavigator.navigatorUserAgent.indexOf('chrome') === -1,
    'iosSafari': this.ios === true && vdnNavigator.navigatorUserAgent.indexOf('safari') > -1,
};

if (vdnClientInfo['chrome'] === true && (vdnClientInfo['opera'] === true || vdnClientInfo['edge'] === true)) {
    vdnClientInfo['chrome'] = false;
}

/**
 * Path map for audio files of short phrases
 * 
 */
var vdnAudioShortPharasesPaths = {
    'root': 'short_phrases/',
    'voice': vdnVoiceAndLanguage + '/',
    'random': 'random/',
    'general': 'general/',
    'getRandomVoicesPath': function() {
        return this.root + this.voice + this.random + vdnVoiceAndLanguage + '_random_';
    },
    'getGeneralVoicesPath': function() {
        return this.root + this.voice + this.general + vdnVoiceAndLanguage;
    }
}

let vdnRandomShortPhrasePath = vdnAudioShortPharasesPaths.getRandomVoicesPath();
let vdnGeneralShortPhrasePath = vdnAudioShortPharasesPaths.getGeneralVoicesPath();
let vdnSilenceSoundPath = vdnAudioShortPharasesPaths.root + 'silence.mp3';

/**
 * Voice validator Object
 * 
 */
var vdnVoiceType = {
    'female': vdnVoiceAndLanguage.indexOf('female_') !== -1 ? true : false,
    'ukEnglish': vdnVoiceAndLanguage.indexOf('en_GB') !== -1 ? true : false,
    'usEnglish': vdnVoiceAndLanguage.indexOf('en_US') !== -1 ? true : false,
    'german': vdnVoiceAndLanguage.indexOf('de_DE') !== -1 ? true : false
};

/**
 * Alternative response audio files to be played/spoken
 *
 */
var vdnAlternativeResponse = {
    /**
     * Text in audio file
     * US and UK English: One moment please.
     * German: Einen Moment bitte.
     */ 
    'basic'  : vdnGeneralShortPhrasePath + "_basic.mp3", 
    /**
     * Text in audio file
     * US and UK English: I am sorry but I am unable to acces your microphone. Please connect a microphone or you can also type your question if needed.
     * German: Es tut mir leid, aber ich kann nicht auf Ihr Mikrofon zugreifen. Bitte schließen Sie ein Mikrofon an oder geben Sie bei Bedarf Ihre Frage ein.
     */ 
    'micConnect' : vdnGeneralShortPhrasePath + "_mic_connect.mp3",
    'randomLib' : [
        /**
         * Text in audio file
         * US and UK English: Just a second please.
         * German: Eine Sekunde bitte.
         */ 
        vdnRandomShortPhrasePath + "0.mp3", 
        /**
         * Text in audio file
         * US and UK English: I am on it.
         * German: Ich bin dabei.
         */ 
        vdnRandomShortPhrasePath + "1.mp3",
        /**
         * Text in audio file
         * US and UK English: No problem.
         * German: Kein Problem.
         */
        vdnRandomShortPhrasePath + "2.mp3",
        /**
         * Text in audio file
         * US and UK English: Just a moment, I need a brief rest.
         * German: Einen Moment, ich brauche eine kurze Pause.
         */
        vdnRandomShortPhrasePath + "3.mp3",
        /**
         * Text in audio file
         * US and UK English: You seem to work too hard. Get your self a coffee, and I will look it up for you.
         * German: Sie scheinen zu hart zu arbeiten. Holen Sie sich einen Kaffee, und ich werde es für Sie nachschlagen.
         */
        vdnRandomShortPhrasePath + "4.mp3",
        /**
         * Text in audio file
         * US and UK English: Coming right up.
         * German: Das haben wir gleich.
         */
        vdnRandomShortPhrasePath + "5.mp3",
        /**
         * Text in audio file
         * US and UK English: I will do my best
         * German: Ich werde mein Bestes geben
         */
        vdnRandomShortPhrasePath + "6.mp3",
        /**
         * Text in audio file
         * US and UK English: Anything for you. I will get right on it.
         * German: Alles für dich. Ich werde gleich darauf eingehen.
         */
        vdnRandomShortPhrasePath + "7.mp3",
        /**
         * Text in audio file
         * US and UK English: Working on it. One moment please.
         * German: Ich arbeite daran. Einen Moment bitte.
         */
        vdnRandomShortPhrasePath + "8.mp3",
        /**
         * Text in audio file
         * US and UK English: Beep - Beep - Beep, just kidding. One moment please
         * German: Beep - Beep - Beep, war nur ein Scherz. Einen Moment bitte.
         */
        vdnRandomShortPhrasePath + "9.mp3"
    ],
    /**
     * Text in audio file
     * US and UK English: Voice navigation is currently unavailable. Please try again after some time.
     * German: Die Sprachnavigation ist derzeit nicht verfügbar. Bitte versuchen Sie es nach einiger Zeit erneut.
     */
    'unavailable' : vdnGeneralShortPhrasePath + "_unavailable.mp3",
    /**
     * Text in audio file
     * US and UK English: Let me search for that.
     * German: Lass mich danach suchen.
     */
    'disabledIntentResponse' : vdnGeneralShortPhrasePath + "_disabled_intent.mp3",
    /**
     * Text in audio file
     * US and UK English: I am unable to hear you
     * German: Ich kann dich nicht hören
     */
    'notAudible': vdnGeneralShortPhrasePath + "_not_audible.mp3",
    /**
     * Text in audio file
     * US and UK English: Hello, my name is Simon. I am your web virtual assistant.
     * German: Hallo, ich heiße Simon. Ich bin Ihr virtueller Webassistent.
     */
    'simonShortIntro': vdnGeneralShortPhrasePath + "_simon_intro.mp3",
    /**
     * Text in audio file
     * US and UK English: I am sorry I was unable to process the request. Please try again.
     * German: Es tut mir leid, dass ich die Anfrage nicht bearbeiten konnte. Bitte versuche es erneut.
     */
    'unableToProcess': vdnGeneralShortPhrasePath + "_unable_to_process.mp3",
    /**
     * Text in audio file
     * US and UK English: Here is what you are looking for.
     * German: Hier ist was Sie suchen.
     */
    'defaultDesc': vdnGeneralShortPhrasePath + "_default_desc.mp3",
};

/**
 * Static text labels
 * For: UK and US English
 *
 */
var vdnMessages = {
    'unableToProcess': ' I am sorry I was unable to process the request. Please try again.',
    'unableToSpeak': 'Unable to speak!',
    'callFailed': 'Call to AI failed.',
    'traditionalSearch': 'I have made a traditional native search for you. Please check native search results.',
    'pageUnavailable': 'Page you are looking for is not available.',
    'micNotAccessible': 'I am unable to access the microphone.',
    'browserDenyMicAccess': "Your browser security doesn't allow me to access the mic.",
    'transcribeText': ' Transcribing ....',
    'unableToHear': 'I am unable to hear you.',
    'ask': ' Say it again ....',
};

/**
 * Static text labels for floating widget
 * For: UK and US English
 *
 */
var vdnWidgetMessages = {
    'you': 'You',
    'simonIntro': {
        'name': "Hello my name is Simon", 
        'intro': ". I am your web virtual assistant. You can ask me what you are looking for in one of the following way."
    },
    'simonGuidelines': "1. Using a microphone at bottom left side.<br/>2. Or type a query in the text box next to the microphone.<br/><br/>Give it a try by asking 'About us'",
    'placeholder': 'Type a question',
    'botName': vdnVoiceType.female === true ? 'Simone' : 'Simon'
};

/**
 * Static error messages library
 * For: UK and US English
 *
 */
var vdnErrorLibrary = {
    'outOfService': vdnWidgetMessages['botName'] + " is out of service. Please try again after some time."
}

/**
 * FOR GERMAN LANGUAGE
 *
 */
if (vdnVoiceType.german) {
    vdnSelectedLang = 'de-DE';

    /**
     * Static text labels
     * For: German
     *
     */
    vdnMessages = {
        'unableToProcess': ' Es tut mir leid, dass ich die Anfrage nicht bearbeiten konnte. Bitte versuche es erneut.',
        'unableToSpeak': 'Nicht in der Lage zu sprechen!',
        'callFailed': 'Anruf bei AI fehlgeschlagen.',
        'traditionalSearch': 'Ich habe eine traditionelle Suche nach Ihnen durchgeführt. Bitte überprüfen Sie die nativen Suchergebnisse.',
        'pageUnavailable': 'Die von Ihnen gesuchte Seite ist nicht verfügbar.',
        'micNotAccessible': 'Ich kann nicht auf das Mikrofon zugreifen.',
        'browserDenyMicAccess': "Ihre Browsersicherheit erlaubt mir nicht, auf das Mikrofon zuzugreifen.",
        'transcribeText': ' Transkribieren ....',
        'unableToHear': 'Ich kann dich nicht hören.',
        'ask': ' Sage es noch einmal ....',
    }

    /**
     * Static text labels for floating widget
     * For: German
     *
     */
    vdnWidgetMessages = {
        'you': 'Sie',
        'simonIntro': {
            'name': "Hallo, mein Name ist Simon", 
            'intro':". Ich bin Ihr virtueller Webassistent. Sie können mich auf eine der folgenden Arten fragen, wonach Sie suchen."
        },
        'simonGuidelines': "1. Mit einem Mikrofon unten links.<br/>2. Oder geben Sie eine Abfrage in das Textfeld neben dem Mikrofon ein.<br/><br/>Probieren Sie es aus, indem Sie nach 'Über uns' fragen.",
        'placeholder': 'Geben Sie eine Frage ein',
        'botName': vdnVoiceType.female === true ? 'Simone' : 'Simon'
    };

    /**
     * Static error messages library
     * For: German
     *
     */
    vdnErrorLibrary = {
        'outOfService': vdnWidgetMessages['botName'] + " ist außer Betrieb. Bitte versuchen Sie es nach einiger Zeit erneut."
    }
}

/**
 * FOR UK ENGLISH LANGUAGE
 *
 */
if (vdnVoiceType.ukEnglish) {
    vdnSelectedLang = 'en-GB';
}
