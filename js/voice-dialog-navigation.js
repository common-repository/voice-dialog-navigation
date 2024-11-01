// *****************************************************************************************************
// *******              speak2web VOICE DIALOG NAVIGATION                                    ***********
// *******               AI Service requires subcriptions                                    ***********
// *******               Get your subscription at                                            ***********
// *******                    https://speak2web.com/plugin#plans                             ***********
// *******               Need support? https://speak2web.com/support                         ***********
// *******               Licensed GPLv2+                                                     ***********
//******************************************************************************************************

window.onload = (event) => {
(function () {
    'use strict';

    let vdnMicEventToListen = 'click';
    let vdnDisableSearchFieldMic = typeof vdnDisableSearchMic != 'undefined' && vdnDisableSearchMic == '1' ? true : false;
    let vdnDisableFormsFieldsMic = typeof vdnDisableFormsMic != 'undefined' && vdnDisableFormsMic == '1' ? true : false; 

    /**
     * Function to clear mic reset timeout
     *
     */
    function vdnClearMicResetTimeout() {
        try {
            if (window.vdnMicTimeoutIdentifier) {
                clearTimeout(window.vdnMicTimeoutIdentifier);
                window.vdnMicTimeoutIdentifier = null;
            }    
        } catch(err) {
            // Do nothing for now
        }
    }

    /**
     * Function to clear mic stop display timeout
     *
     */
    function vdnClearIosMicStopDisplayTimeout() {
        try {
            if (vdnClientInfo.ios === false) return false;

            if (window.vdnIosMicTimeoutIdentifier) {
                clearTimeout(window.vdnIosMicTimeoutIdentifier);
                window.vdnIosMicTimeoutIdentifier = null;
            }
        } catch(err) {
            // Do nothing for now
        }
    }

    /**
     * Function to display/hide mic and stop icons
     *
     * @param { micIcon: DOM Object } Mic icon element
     * @param { stopIcon: DOM Object } Stop icon element
     * @param { showStopIcon: Boolean } To display/hide stop button in a place of mic icon
     */
    function vdnMicButtonImageSwitch(micIcon, stopIcon, showStopIcon = false) {
        try {
            let micIconClasses = micIcon.classList || null;
            let stopIconClasses = stopIcon.classList || null;

            if (!(micIconClasses && stopIconClasses)) return false;

            if (showStopIcon === true) {
                micIconClasses.add('vdn-hide-element');
                stopIconClasses.remove('vdn-hide-element');
            } else {
                micIconClasses.remove('vdn-hide-element');
                stopIconClasses.add('vdn-hide-element');
            }
        } catch(err) {
            // do nothing for now
        }
    }

    // Clear any pre-existing timeouts
    vdnClearMicResetTimeout();
    vdnClearIosMicStopDisplayTimeout();    

    // Localized variables
    vdnTypeOfSearch = (typeof(vdnTypeOfSearch) != 'undefined' && vdnTypeOfSearch !== null) ? vdnTypeOfSearch : 'native';

    let vdnDefaultSearchableHints = ['Ask about our company', 'Ask for opening hours'];
    vdnSearchableHints = (typeof(vdnSearchableHints) != 'undefined' && vdnSearchableHints !== null) ? vdnSearchableHints : vdnDefaultSearchableHints;

    // Ensure vdnSearchableHints to be array only
    if (vdnSearchableHints.constructor !== Array) { vdnSearchableHints = []; }

    // If vdnSearchableHints an empty array then populate it with default searchable hints
    if (vdnSearchableHints.length == 0) { vdnSearchableHints = vdnDefaultSearchableHints; }

    // Auto timeout duration to stop listening Mic
    let vdnOtherInputTimeoutDuration = null;
    let vdnTextareaTimeoutDuration = 20 * 1000;

    let vdnTimerID = 0;

    if (typeof(vdnMicListenTimeoutDuration) != 'undefined' && vdnMicListenTimeoutDuration !== null) {
        vdnOtherInputTimeoutDuration = parseInt(vdnMicListenTimeoutDuration);
        vdnOtherInputTimeoutDuration = isNaN(vdnOtherInputTimeoutDuration) ? 8 : vdnOtherInputTimeoutDuration;
    } else {
        vdnOtherInputTimeoutDuration = 8;
    }


    // Handle mic listening timeout exceptions
    vdnOtherInputTimeoutDuration = (vdnOtherInputTimeoutDuration < 8) ? 8 : vdnOtherInputTimeoutDuration;
    vdnOtherInputTimeoutDuration = (vdnOtherInputTimeoutDuration > 20) ? 20 : vdnOtherInputTimeoutDuration;
    vdnOtherInputTimeoutDuration = vdnOtherInputTimeoutDuration * 1000;

    /**
     * Function to clear mic listening timeout interval
     *
     * @param { timerInstance: var } The name of the timer 
     */
    function vdnClearTimer(timerInstance) {
        try {
            if (typeof (timerInstance) != 'undefined' && timerInstance !== null && timerInstance != false) {
                clearInterval(timerInstance);
            }
        } catch (err) {/* do nothing for now*/ }
    }

    /**
     * Function to sanitize alpha-numeric css values to get numeric value
     *
     * @param { number: Any } Any value
     *
     * @returns Number
     */
    function getNumber(number) {
        number = parseInt(number, 10);
        return isNaN(number) || number === null || typeof (number) === 'undefined' ? 0 : number;
    }

    /**
     * Function to check if any of the VDN mic listening
     *
     * @param { vdnExceptionBtnId: String } Id of mic which needs to be excluded from check
     * @param { vdnWidgetMicEl: DOM Object } Widget mic element
     *
     * @returns { vdnOneOfMicListening: Boolean } 'true' if any mic listening otherwise false
     */
    function vdnAnyOtherMicListening(vdnExceptionBtnId = null, vdnWidgetMicEl = null) {
        let vdnOneOfMicListening = false;
        try {
            let vdnAllMicButtons = document.querySelectorAll('button.voice-dialog-navigation-button');

            if (typeof(vdnAllMicButtons) == 'undefined' 
                || vdnAllMicButtons === null 
                || vdnExceptionBtnId == null) return vdnOneOfMicListening;

            let vdnAllMicButtonsLength = vdnAllMicButtons.length;

            for (let vdnI = 0; vdnI < vdnAllMicButtonsLength; vdnI++) {
                let vdnClassNames = vdnAllMicButtons[vdnI].className;
                let vdnBtnId = vdnAllMicButtons[vdnI].getAttribute('id');

                if (!(typeof(vdnClassNames) != 'undefined' && vdnClassNames.trim() != '')) continue;

                if (vdnClassNames.indexOf('listening') != -1 && vdnExceptionBtnId != vdnBtnId) {
                    vdnOneOfMicListening = true;
                    break;
                }
            }

            if (vdnOneOfMicListening == false) {                
                if (vdnWidgetMicEl === null) {
                    let widgetMicEl = document.querySelector('#vdnWidgetMic');

                    if (widgetMicEl !== null && widgetMicEl.className.indexOf('listening') != -1) {
                        vdnOneOfMicListening = true;
                    }
                } 
            }
        } catch (err) {
            vdnOneOfMicListening = false;
        }

        return vdnOneOfMicListening;
    }

    /**
     * Function to get random searchable hint text
     *
     * @returns { vdnHint: String } Random search hint text
     */
    function vdnGetRandomSearchHint(){
        let vdnHint = 'Ask about us.';
        try {
            let vdnTotalHints = vdnSearchableHints.length;
            let vdnRandomIndex = Math.floor(Math.random() * vdnTotalHints); 
            let tempHint = vdnSearchableHints[vdnRandomIndex];
            
            if (typeof(tempHint) != 'undefined' && tempHint.trim() != '') { vdnHint = tempHint;}
        } catch (err) {
            vdnHint = 'Ask about us.';
        }

        return vdnHint;
    }

    let recordTimer = null;

    // Add custom identity markup to top search bar and mobile menu search bar
    let topSearchBarInput = document.querySelector('div#search-outer form input[type=text]');
    let mobileSearchBarInput = document.querySelector('div#mobile-menu form input[type=text]');
    
    if (topSearchBarInput !== null) { topSearchBarInput.setAttribute('data-vdn-top-search-bar', 'true');}

    if (mobileSearchBarInput !== null) { mobileSearchBarInput.setAttribute('data-vdn-mobile-search-bar', 'true');}

    let speechInputWrappers = document.querySelectorAll('form');// Get all forms on a page
    let typeOfInputFieldsToSeek = ['text', 'email', 'search'];// For normal forms
    let formElementForWidget = null;
    let formInputElementForWidget = null;

    [].forEach.call(speechInputWrappers, function (speechInputWrapper, index) {
        try {
            // Try to show the form temporarily so we can calculate the sizes
            let speechInputWrapperStyle = speechInputWrapper.getAttribute('style');
            let havingInlineStyle = (typeof(speechInputWrapperStyle) != 'undefined' 
                && speechInputWrapperStyle !== null && speechInputWrapperStyle.trim() != '') ? true : false;
            speechInputWrapperStyle = (havingInlineStyle) ? speechInputWrapperStyle + ';' : '';
            speechInputWrapper.setAttribute('style', speechInputWrapperStyle + 'display: block !important');
            //speechInputWrapper.classList.add('voice-dialog-navigation-wrapper');
            speechInputWrapper.classList.add('vdn-sanitize-form-wrapper');

            let isSearchForm = false;
            var recognizing = false;
            let roleOfForm = speechInputWrapper.getAttribute('role') || "";
            let classesOfForm = speechInputWrapper.classList || "";
            let allInputElements = speechInputWrapper.querySelectorAll('input:not([type=hidden]):not([id=vdnWidgetSearch]):not([style*="none"]), button[type=submit], textarea:not([style*="none"])');

            if (roleOfForm.toLowerCase() === 'search' || classesOfForm.contains('searchform') 
                || classesOfForm.contains('search_form') || classesOfForm.contains('search-form') 
                || classesOfForm.contains('searchForm')) {
                isSearchForm = true;
            }

            // Preserve first form on page and it's input element for widget
            if (isSearchForm && !formElementForWidget) {
                formElementForWidget = speechInputWrapper;
            }

            [].forEach.call(allInputElements, function (inputElement, inputIndex) {
                let inputEl = null;
                let inputType = inputElement.getAttribute('type') || "";
                let classesOfInput = inputElement.className || "";
                let idOfInputElement = inputElement.getAttribute('id') || null;
                let tagNameOfInputElement = inputElement.tagName;

                if (idOfInputElement && idOfInputElement !== null) {
                    idOfInputElement = idOfInputElement.toLowerCase();
                }

                if (classesOfInput && classesOfInput !== null) {
                    classesOfInput = classesOfInput.toLowerCase();
                }

                // Check if input marked with keywords related to date
                let isDateField = false;

                // Check for search form
                if (classesOfInput.indexOf('datepicker') !== -1 
                    || classesOfInput.indexOf('date') !== -1 
                    || idOfInputElement === 'datepicker' 
                    || idOfInputElement === 'date') {
                    isDateField = true;
                }

                // check if input field is intented for date picking
                if (classesOfInput.indexOf('datepicker') === -1 
                    && idOfInputElement !== 'datepicker' 
                    && classesOfInput.search(/validat|candidat/ig) !== -1) {
                    isDateField = false;
                }

                // check if text field is intended for email
                if (inputType === 'text' && classesOfInput.search(/email/ig) !== -1) {
                    inputType = 'email';
                }

                // Check textarea/large input box
                let isTextArea = (tagNameOfInputElement.toLowerCase() === 'textarea') ? true : false;

                if ((typeOfInputFieldsToSeek.includes(inputType) && isDateField == false) || isTextArea == true) {                    
                    inputEl = inputElement;
                } else if (inputType.toLowerCase() == 'submit' && (!vdnDisableSearchFieldMic || !vdnDisableFormsFieldsMic)) {
                    // Remove any overlapping icon from submit button of search form
                    if (isSearchForm && !vdnDisableSearchFieldMic) {
                        let submitButtonChildNodes = inputElement.querySelectorAll('img, svg');
                        
                        for (let j = 0; j < submitButtonChildNodes.length; j++) {
                            let submitBtnChildNode = submitButtonChildNodes[j];
                            submitBtnChildNode.classList.add('vdn-hide-element');
                        }
                    }

                    speechInputWrapper.addEventListener('submit', function(evt) {
                        // Restrict form submission if mic is recording
                        if (recognizing == true) {
                            evt.preventDefault();
                            return false;
                        }

                        // Handle submission of search form
                        if (isSearchForm === true && !vdnDisableSearchFieldMic) {
                            try {
                                // Engage speak2web AI if native search is not configured 
                                if (vdnTypeOfSearch != 'native') {
                                    // Prevent default text search
                                    evt.preventDefault();

                                    // If API system key is unavailable then acknowledge service unavailability and stop voice navigation.
                                    if (!(typeof(vdnXApiKey) != 'undefined' && vdnXApiKey !== null)) {
                                        // Play feature unavailable playback
                                        vdnIntentResponsePlayer.configure(vdnAlternativeResponse['unavailable']);
                                        vdnIntentResponsePlayer.play();

                                        return false;
                                    }

                                    if (!vdnClientInfo.android) {
                                        // Play basic aknowledgement playback
                                        vdnIntentResponsePlayer.configure(vdnAlternativeResponse['basic']);
                                        vdnIntentResponsePlayer.play();

                                        // Get value of text box in search form's context
                                        let vdnSearchBox = this.querySelector('input.vd-navigation-mic-band');
                                        let vdnSearchBoxValue = vdnSearchBox ? vdnSearchBox.value : "";

                                        // Send input to speech.js
                                        vdnSendDialog(vdnSearchBoxValue, function (playbackPath, navigationCbAfterAudioPlay = null, isNativeSearch = false) {
                                            if (typeof navigationCbAfterAudioPlay !== 'function') {
                                                navigationCbAfterAudioPlay = function() {
                                                    // If dialog for intent is disabled in settings then fire native search
                                                    if (isNativeSearch === true) {
                                                        try { speechInputWrapper.submit(); } 
                                                        catch (err) { console.log('VDN: Something went wrong while submitting a form for native search.'); }
                                                    }
                                                }
                                            }

                                            // Play intent response playback
                                            vdnIntentResponsePlayer.configure(playbackPath, navigationCbAfterAudioPlay);
                                            vdnIntentResponsePlayer.play();
                                        });
                                    }
                                }
                            } catch(err) {
                                console.log('VDN Exception: Unable to submit the form due to: ' + err.message);
                            }
                        }
                    }, false);
                }

                // If search input field not found then continue
                if (null === inputEl) { return true; }

                // Preserve first form on page and it's input element for widget
                if (isSearchForm) {
                    if (!formInputElementForWidget) {
                        formInputElementForWidget = inputEl;
                    }

                    // Not to attach mic to search fields if disabled from settings
                    if (vdnDisableSearchFieldMic) {
                        return false;
                    }
                }
                // Not to attach mic to form fields if disabled from settings 
                else if (vdnDisableFormsFieldsMic) {
                    return false;
                }

                // Add some markup as a button to the search form
                let micBtn = document.createElement('button');
                micBtn.setAttribute('type', 'button');
                micBtn.setAttribute('class', 'voice-dialog-navigation-button');
                micBtn.setAttribute('id', 'voice-dialog-navigation-button' + index + '' + inputIndex);

                // Add mic image icon
                let vdnMicIcon = document.createElement('img');
                vdnMicIcon.setAttribute('src', vdnImagesPath + 'vdn-mic.svg');
                vdnMicIcon.setAttribute('class', 'vdn-mic-image');
                vdnMicIcon.setAttribute('id', 'vdn-mic-img' + index + '' + inputIndex);
                micBtn.appendChild(vdnMicIcon);

                let vdnMicStopIcon = document.createElement('img');

                if (vdnClientInfo.ios === true) {
                    vdnMicStopIcon.setAttribute('src', vdnImagesPath + 'vdn-mic-stop.svg');
                    vdnMicStopIcon.setAttribute('class', 'vdn-stop-alert vdn-hide-element');
                    vdnMicStopIcon.setAttribute('id', 'vdn-mic-stop' + index + '' + inputIndex);
                    micBtn.appendChild(vdnMicStopIcon);
                }
                
                let inputHeight = getNumber(inputEl.offsetHeight);// Get search input height

                // Sanitize operands of calculation for search input's with custom identification markup
                let topSearchBarCustomId = inputEl.getAttribute('data-vdn-top-search-bar');
                let mobileSearchBarCustomId = inputEl.getAttribute('data-vdn-mobile-search-bar');
                let isTopSearchBar = false, isMobileSearchBar = false;

                if (typeof(topSearchBarCustomId) != 'undefined' && topSearchBarCustomId !== null && topSearchBarCustomId.trim() != '') {
                    isTopSearchBar = true;

                    if (inputHeight == 0) { inputHeight = 59; } // Manually consider height of search input if not available
                }

                if (typeof(mobileSearchBarCustomId) != 'undefined' 
                    && mobileSearchBarCustomId !== null 
                    && mobileSearchBarCustomId.trim() != '') { isMobileSearchBar = true; }

                let buttonSize = getNumber(0.8 * inputHeight);

                // Set default mic button size to 35px when button size calculated to 0 or unknown
                if (getNumber(buttonSize) == 0) { inputHeight = buttonSize = 35; }

                let micbtnPositionTop = getNumber(0.1 * inputHeight);

                // Calculate position of mic button for search input field with custom identification markup
                if (isMobileSearchBar == true || isTopSearchBar == true) { micbtnPositionTop = micbtnPositionTop + 20; }
                
                // For textarea/large input
                if (isTextArea === true) {
                    micbtnPositionTop = 10;
                    buttonSize = 35;
                }

                // Size and position of complete mic button
                let inlineStyle = 'top: ' + micbtnPositionTop + 'px; ';
                inlineStyle += 'height: ' + buttonSize + 'px !important; ';
                inlineStyle += 'width: ' + buttonSize + 'px !important; ';
                inlineStyle += 'z-index: 999 !important; margin-left: 3px !important; border-radius: 50% !important; border: 2px solid #ffff !important;';
                micBtn.setAttribute('style', inlineStyle);

                // Create Wrapper to wrap around input search field like a elastic band
                let wrapper = document.createElement('div');
                wrapper.setAttribute('style', speechInputWrapperStyle + 'display: inline-block !important');

                let inputCurrentStyle = window.getComputedStyle(inputEl);
                wrapper.setAttribute('class', 'vd-navigation-mic-band');
                wrapper.setAttribute('onclick', 'return false');
                wrapper.style.width = inputCurrentStyle.width;

                inputEl.insertAdjacentElement('beforebegin', wrapper);// Place wrapper before input search field

                // Set parent element's (parent of inputEl) display stack order higher 
                // To handle overlapped submit button on mic icon
                let parentEl = inputEl.parentNode.nodeName;

                if (typeof(parentEl) != 'undefined' && parentEl !== null && parentEl.length != 0) {
                    parentEl = parentEl.toLowerCase();

                    if (parentEl != 'form') {
                        inputEl.parentNode.style.zIndex = 1;
                    }
                }

                // Append search input field element inside a wrapper band
                wrapper.appendChild(inputEl);

                // Place mic button/icon exact before search input field element
                inputEl.insertAdjacentElement('beforebegin', micBtn);
                inputEl.setAttribute('style', speechInputWrapperStyle + 'width: 100% !important');

                inputEl.classList.add('vd-navigation-mic-band');

                // Reset form style again
                speechInputWrapper.setAttribute('style', speechInputWrapperStyle);      
                
                // Setup recognition
                let finalTranscript  = '';
                let final_transcript = "";
                let ignore_onend;

                // To By-pass focus out/blur of search input field to cause disappearance of top search bar
                if (isTopSearchBar == true) {
                    micBtn.addEventListener('mousedown', function(evt){
                        evt.preventDefault();
                        return true;
                    }, false);
                }

                if ('webkitSpeechRecognition' in window && vdnClientInfo['chrome'] === true) {
                    let recognition = new webkitSpeechRecognition();
                    recognition.continuous = true;
                    recognition.interimResults = true;

                    recognition.onstart = function () {
                        recognizing = true;
                    };

                    recognition.onerror = function (event) {
                        micBtn.classList.remove('listening');
                        recognizing = false;

                        if (event.error == 'no-speech') {
                            inputEl.placeholder = vdnMessages['unableToHear'];

                            // Play not audible playback
                            vdnIntentResponsePlayer.configure(vdnAlternativeResponse['notAudible']);
                            vdnIntentResponsePlayer.play();

                            ignore_onend = true;
                        }
                        if (event.error == 'audio-capture') {
                            inputEl.placeholder = vdnMessages['micNotAccessible'];
                            ignore_onend = true;
                        }
                        if (event.error == 'not-allowed') {
                            inputEl.placeholder = vdnMessages['browserDenyMicAccess'];
                            micBtn.style.setProperty("color", "white");
                            ignore_onend = true;
                        }
                    };

                    function processEnd() {
                        recognizing = false;

                        if (ignore_onend) {
                            return;
                        }

                        micBtn.classList.remove('listening');
                        micBtn.style.setProperty("color", "white");

                        function vdnHandleTextualResponse() {
                            if (typeof(finalTranscript) != 'undefined' && finalTranscript.length != 0) {
                                let transcribedText = finalTranscript;

                                // Sanitize email before putting transcribed text in input field
                                if (inputType === 'email') {
                                    transcribedText = vdnFormatEmail(transcribedText);
                                }

                                let newChromeTranscribedText = transcribedText && transcribedText !== null ? transcribedText : finalTranscript;

                                if (isTextArea === true) {
                                    // Preserve previous input value for textarea and append new value
                                    inputEl.value += ' ' + newChromeTranscribedText;
                                } else {
                                    inputEl.value = newChromeTranscribedText;
                                }
                                
                                if (isSearchForm === true) {
                                    vdnSendDialog(finalTranscript, function (playbackPath, navigationCbAfterAudioPlay = null, isNativeSearch = false) {
                                        if (typeof navigationCbAfterAudioPlay !== 'function') { 
                                            navigationCbAfterAudioPlay = function(){
                                                // If dialog for intent is disabled in settings then fire native search
                                                if (isNativeSearch === true) {
                                                    try { speechInputWrapper.submit(); } 
                                                    catch (err) { console.log('Something went wrong while submitting a form for native search.'); }
                                                }
                                            };
                                        }

                                        // Play intent response playback
                                        vdnIntentResponsePlayer.configure(playbackPath, navigationCbAfterAudioPlay);
                                        vdnIntentResponsePlayer.play();
                                    });
                                }
                            } else {
                                inputEl.placeholder = vdnMessages['ask'];
                            }
                        }

                        if (isSearchForm === true) {
                            let i = Math.floor(Math.random() * 10);
                            let resp = vdnAlternativeResponse['randomLib'];

                            // Play random response playback
                            vdnIntentResponsePlayer.configure(resp[i], function () { vdnHandleTextualResponse(); });
                            vdnIntentResponsePlayer.play();
                        } else {
                            vdnHandleTextualResponse();
                        }
                    };

                    recognition.onend = function () {
                        if (vdnClientInfo.android) {
                            processEnd();
                        }
                    };

                    recognition.onresult = function (event) {
                        let interim_transcript = '';
                        
                        if (typeof (event.results) == 'undefined') {
                            recognition.onend = null;
                            recognition.stop();
                            inputEl.placeholder = vdnMessages['unableToHear'];

                            // Play mic connect issue playback
                            vdnIntentResponsePlayer.configure(vdnAlternativeResponse['micConnect']);
                            vdnIntentResponsePlayer.play();

                            return;
                        }

                        let evtResultsLength = event.results.length;

                        for (let i = event.resultIndex; i < evtResultsLength; ++i) {
                            if (event.results[i].isFinal) {
                                finalTranscript = event.results[i][0].transcript;

                                if (vdnClientInfo.android == false) {
                                    processEnd();
                                    recognition.stop();
                                }                        
                            } else {
                                if (isTextArea === false) {
                                    interim_transcript += event.results[i][0].transcript;
                                    inputEl.value = interim_transcript;
                                }                                
                            }
                        }
                    };

                    micBtn.addEventListener(vdnMicEventToListen, function (event) {
                        // micBtn.onclick = function (event) {
                        if (vdnAnyOtherMicListening(micBtn.getAttribute('id')) === true) return;

                        // If API system key is unavailable then acknowledge service unavailability and stop voice navigation.
                        if (!(typeof (vdnXApiKey) != 'undefined' && vdnXApiKey !== null)) {
                            // Play feature unavailable playback
                            vdnIntentResponsePlayer.configure(vdnAlternativeResponse['unavailable']);
                            vdnIntentResponsePlayer.play();

                            return;
                        }

                        if (recognizing) {
                            // To clear pre-existing mic reset timeout if any. (Based on duration from settings)
                            vdnClearMicResetTimeout();

                            // Need to stop the recording
                            if (isSearchForm === true) { inputEl.placeholder = vdnGetRandomSearchHint(); }
                            
                            if (vdnClientInfo.android == false) {
                                processEnd();
                                recognition.stop();
                            }
                        } else {
                            if (isSearchForm === true) { inputEl.placeholder = vdnGetRandomSearchHint(); }

                            micBtn.classList.add('listening');
                            event.preventDefault();

                            // Stop ongoing playback if nay
                            if (vdnIntentResponsePlayer.isPlaying()) {
                                vdnIntentResponsePlayer.stop();
                            }

                            finalTranscript = '';
                            
                            if (isTextArea === false) {
                                inputEl.value = '';
                            }
                            
                            recognizing = true;
                            recognition.lang = vdnSelectedLang;
                            recognition.start();
                            ignore_onend = false;

                            // To clear pre-existing mic reset timeout if any. (Based on duration from settings)
                            vdnClearMicResetTimeout();

                            // To set new mic reset timeout. (Based on duration from settings)
                            window.vdnMicTimeoutIdentifier = setTimeout(function(){
                                let updatedClassList = micBtn.classList;

                                if (updatedClassList && updatedClassList.contains('listening')) {
                                    micBtn.click();
                                }
                            }, inputEl.tagName.toLowerCase() == 'textarea' ? vdnTextareaTimeoutDuration : vdnOtherInputTimeoutDuration);
                        }
                    });
                } else {
                    //CODE FOR BROWSERS THAT DO NOT SUPPORT STT NATIVLY
                    // MUST USE THE BUILT IN MICROPHONE
                    micBtn.addEventListener(vdnMicEventToListen, function (event) {
                        /**
                         * Audio element's play method must be invoked in exact influence of user gesture to avoid auto play restriction
                         * 
                         */
                        if (
                            vdnClientInfo.ios === true
                            || (vdnClientInfo.safari && !vdnClientInfo.chrome && !vdnClientInfo.firefox)
                            || (vdnClientInfo.windows && vdnClientInfo.firefox)
                        ) {
                            vdnIntentResponsePlayer.configure(vdnSilenceSoundPath);
                            vdnIntentResponsePlayer.play();
                        }

                        if (vdnAnyOtherMicListening(micBtn.getAttribute('id')) === true) return;

                        // Deny recording if microphone is not accessible
                        if (!vdnAudioRecorder || !vdnAudioContext) {
                            vdnInitAudio(function (a) {
                                if (!vdnAudioRecorder || !vdnAudioContext) {
                                    alert(vdnMessages['micNotAccessible']);
                                    return false;
                                } else {
                                    listenEvent();
                                }
                            });
                        } else {
                            listenEvent();
                        }

                        function listenEvent() {
                            // If API system key is unavailable then acknowledge service unavailability and stop voice navigation.
                            if (!(typeof (vdnXApiKey) != 'undefined' && vdnXApiKey !== null)) {
                                // Play feature unavailable playback
                                vdnIntentResponsePlayer.configure(vdnAlternativeResponse['unavailable']);
                                vdnIntentResponsePlayer.play();

                                return false;
                            }

                            // User ending recording by clicking back mic
                            if (recognizing) {
                                // To clear pre-existing mic reset timeout if any. (Based on duration from settings)
                                vdnClearMicResetTimeout();

                                // For iOS only
                                if (vdnClientInfo.ios === true) {
                                    // To clear pre-existing mic stop display timeout if any.
                                    vdnClearIosMicStopDisplayTimeout();

                                    let micIconClasses = vdnMicIcon.classList;
                                
                                    if (micIconClasses.contains('vdn-hide-element')) {
                                        // To reset/display mic icon back
                                        vdnMicButtonImageSwitch(vdnMicIcon, vdnMicStopIcon);
                                    }
                                }

                                // Stop recorder
                                vdnAudioRecorder.stop();

                                // Stop access to audio resource
                                vdnStopAudio();

                                // Stop ongoing playback if nay
                                if (vdnIntentResponsePlayer.isPlaying()) {
                                    vdnIntentResponsePlayer.stop();
                                }

                                //replace recording with mic icon
                                micBtn.classList.remove('listening');

                                micBtn.style.setProperty("color", "white");
                                inputEl.placeholder = vdnMessages['transcribeText'];

                                vdnAudioRecorder.getBuffers(function (buffers) {
                                    if (!!vdnSttLanguageContext['gcp']['stt']) {
                                        vdnAudioRecorder.exportMonoWAV(function (blob) {
                                            vdnAudioRecorder.convertBlobToBase64(blob).then(function(resultedBase64){
                                                vdnGcpStt(resultedBase64).then(function(transcriptResult){
                                                    if (typeof(transcriptResult) != 'undefined' && transcriptResult.length != 0) {
                                                        let transcribedText = transcriptResult;

                                                        // Sanitize email before putting transcribed text in input field
                                                        if (inputType === 'email') {
                                                            transcribedText = vdnFormatEmail(transcribedText);
                                                        }
                                                        
                                                        let newNonChromeTranscribedText = transcribedText && transcribedText !== null ? transcribedText : transcriptResult;

                                                        if (isTextArea === true) {
                                                            // Preserve previous input value for textarea and append new value
                                                            inputEl.value += ' ' + newNonChromeTranscribedText;
                                                        } else {
                                                            inputEl.value = newNonChromeTranscribedText;
                                                        }

                                                        if (isSearchForm === true) {
                                                            vdnSendDialog(transcriptResult, function (playbackPath, navigationCbAfterAudioPlay = null, isNativeSearch = false) {
                                                                if (typeof navigationCbAfterAudioPlay !== 'function') { 
                                                                    navigationCbAfterAudioPlay = function(){
                                                                        // If dialog for intent is disabled in settings then fire native search
                                                                        if (isNativeSearch === true) {
                                                                            try { speechInputWrapper.submit(); } 
                                                                            catch (err) { console.log('Something went wrong while submitting a form for native search.'); }
                                                                        }
                                                                    };
                                                                }
                                                                
                                                                // Play intent response playback
                                                                vdnIntentResponsePlayer.configure(playbackPath, navigationCbAfterAudioPlay);
                                                                vdnIntentResponsePlayer.play();
                                                            });
                                                        }
                                                    } else {
                                                        // Play not audible playback
                                                        vdnIntentResponsePlayer.configure(vdnAlternativeResponse['notAudible']);
                                                        vdnIntentResponsePlayer.play();

                                                        inputEl.placeholder = vdnMessages['ask'];
                                                    }
                                                });
                                            }).catch(function(error){
                                                // Play not audible playback
                                                vdnIntentResponsePlayer.configure(vdnAlternativeResponse['notAudible']);
                                                vdnIntentResponsePlayer.play();

                                                inputEl.placeholder = vdnMessages['ask'];
                                            });
                                        });
                                    }
                                });

                                recognizing = false;
                                return;

                            } else {// User started recording by clicking mic
                                if (isSearchForm === true) { inputEl.placeholder = vdnGetRandomSearchHint(); } 

                                micBtn.classList.add('listening');
                                event.preventDefault();

                                // Stop ongoing playback if nay
                                if (vdnIntentResponsePlayer.isPlaying()) {
                                    vdnIntentResponsePlayer.stop();
                                }

                                finalTranscript = '';

                                if (isTextArea === false) {
                                    inputEl.value = '';
                                }

                                recognizing = true;
                                vdnAudioRecorder.clear();
                                vdnAudioRecorder.record(micBtn, inputEl.tagName);

                                // For iOS only
                                if (vdnClientInfo.ios === true) {
                                    // To clear pre-existing mic stop display timeout if any.
                                    vdnClearIosMicStopDisplayTimeout();

                                    let micIconClasses = vdnMicIcon.classList;

                                    if (!micIconClasses.contains('vdn-hide-element')) {
                                        // To set new mic stop display timeout.
                                        window.vdnIosMicTimeoutIdentifier = setTimeout(function(){
                                            // To display mic stop icon
                                            vdnMicButtonImageSwitch(vdnMicIcon, vdnMicStopIcon, true);
                                        }, 4000);
                                    }
                                }

                                // To clear pre-existing mic reset timeout if any. (Based on duration from settings)
                                vdnClearMicResetTimeout();

                                // To set new mic reset timeout. (Based on duration from settings)
                                window.vdnMicTimeoutIdentifier = setTimeout(function(){
                                    let updatedClassList = micBtn.classList;

                                    if (updatedClassList && updatedClassList.contains('listening')) {
                                        micBtn.click();
                                    }
                                }, inputEl.tagName.toLowerCase() == 'textarea' ? vdnTextareaTimeoutDuration : vdnOtherInputTimeoutDuration);
                            }
                        }
                    }, false); 
                }

                // Attach event of mouse over to mic button
                micBtn.addEventListener('mouseover', function (event) {
                    // Randomize text of mic tool-tip
                    if (isSearchForm === true) { micBtn.title = vdnGetRandomSearchHint(); }
                });
            });
        } catch(err) {
            // Do nothing for now.
        }
    });

    //############################# Voice Dialog Navigation - Widget ###################################
    //let vdnDocFragment = document.createDocumentFragment();
    // Create root/widget wrapper
    let vdnWidgetWrapper = document.createElement('div');
    let vdnWrapperMicPositionClass = 'vdn-widget-wrapper-middle-right';
    let vdnChatWrapperMicPositionClass = 'vdn-widget-chat-wrapper-middle-right';
    let vdnMicPosition = vdnSelectedMicPosition ? vdnSelectedMicPosition.toLowerCase() : 'middle right';
    let vdnChatWrapperCollapseClass = 'vdn-widget-chat-wrapper-middle-right-collapse';
    
    switch (vdnMicPosition) {
        case 'middle left':
            vdnWrapperMicPositionClass = 'vdn-widget-wrapper-middle-left';
            vdnChatWrapperMicPositionClass = 'vdn-widget-chat-wrapper-middle-left';
            vdnChatWrapperCollapseClass = 'vdn-widget-chat-wrapper-middle-left-collapse';
            break;
        case 'top right':
            vdnWrapperMicPositionClass = 'vdn-widget-wrapper-top-right';
            vdnChatWrapperMicPositionClass = 'vdn-widget-chat-wrapper-top-right';
            vdnChatWrapperCollapseClass = 'vdn-widget-chat-wrapper-top-right-collapse';
            break;
        case 'top left':
            vdnWrapperMicPositionClass = 'vdn-widget-wrapper-top-left';
            vdnChatWrapperMicPositionClass = 'vdn-widget-chat-wrapper-top-left';
            vdnChatWrapperCollapseClass = 'vdn-widget-chat-wrapper-top-left-collapse';
            break; 
        case 'bottom right':
            vdnWrapperMicPositionClass = 'vdn-widget-wrapper-bottom-right';
            vdnChatWrapperMicPositionClass = 'vdn-widget-chat-wrapper-bottom-right';
            vdnChatWrapperCollapseClass = 'vdn-widget-chat-wrapper-bottom-right-collapse';
            break;
        case 'bottom left':
            vdnWrapperMicPositionClass = 'vdn-widget-wrapper-bottom-left';
            vdnChatWrapperMicPositionClass = 'vdn-widget-chat-wrapper-bottom-left';
            vdnChatWrapperCollapseClass = 'vdn-widget-chat-wrapper-bottom-left-collapse';
            break;
        default:
            vdnWrapperMicPositionClass = 'vdn-widget-wrapper-middle-right';
            vdnChatWrapperMicPositionClass = 'vdn-widget-chat-wrapper-middle-right';
            vdnChatWrapperCollapseClass = 'vdn-widget-chat-wrapper-middle-right-collapse';
    }

    vdnWidgetWrapper.setAttribute('class', 'vdn-widget-wrapper '+ vdnWrapperMicPositionClass);

    // Create chat wrapper
    let vdnWidgetChatWrapper = document.createElement('div');
    vdnWidgetChatWrapper.setAttribute('class', 'vdn-widget-chat-wrapper '+ vdnChatWrapperCollapseClass);

    // ################################## Widget Header ##################################
    // Create widget header
    let vdnWidgetChatHeader = document.createElement('div');
    vdnWidgetChatHeader.setAttribute('class', 'vdn-widget-chat-header');

    // Create widget header options
    let vdnWidgetChatOption = document.createElement('div');
    let headerVoiceAssitantName = (vdnVoiceType.female) ? 'Simone' : 'Simon';
    vdnWidgetChatOption.setAttribute('class', 'vdn-widget-chat-option');
    vdnWidgetChatOption.innerHTML = '<div>' +
    '<img class="vdn-widget-chat-option-bot-icon" src="' + vdnImagesPath + 'Voice Assistant Bot Icon.png"/>'+
    '</div>' + 
    '<span class="vdn-widget-agent-name">' + headerVoiceAssitantName + '</b></span>' + 
    '<br>' +
    '<span class="vdn-widget-agent">Web Virtual Assistant</span>';

    let vdnExpandCollapseHandle = document.createElement('span');
    vdnExpandCollapseHandle.setAttribute('class', 'vdn-expand-window vdn-expand-collapse-handle');
    vdnExpandCollapseHandle.addEventListener('click', function() {
        vdnTogggleExpandCollapse();
    }, false)

    vdnWidgetChatOption.appendChild(vdnExpandCollapseHandle);

    // Append widget header options to widget header
    vdnWidgetChatHeader.appendChild(vdnWidgetChatOption);

    // ################################ Widget Chat Conversation #########################
    // Create widget chat conversation
    let vdnWidgetChatConvo = document.createElement('div');
    vdnWidgetChatConvo.setAttribute('id', 'vdnWidgetChatConvo');
    vdnWidgetChatConvo.setAttribute('class', 'vdn-widget-chat-convo vdn-hide-element');

    // Create widget user chat wrapper 
    let vdnWidgetChatMsgItemUserWrapper = document.createElement('span');
    vdnWidgetChatMsgItemUserWrapper.setAttribute('class', 'vdn-widget-chat-msg-item vdn-widget-chat-msg-item-user');

    // Create widget user chat avatar
    let vdnWidgetChatAvatar = document.createElement('div');
    vdnWidgetChatAvatar.setAttribute('class', 'vdn-widget-chat-avatar');
    vdnWidgetChatAvatar.innerHTML = "<center><b>" + vdnWidgetMessages['you'] + "</b></center>";
    vdnWidgetChatMsgItemUserWrapper.appendChild(vdnWidgetChatAvatar);

    // Create widget chat - user request msg
    let vdnWidgetChatMsgItemUser = document.createElement('span');
    vdnWidgetChatMsgItemUserWrapper.appendChild(vdnWidgetChatMsgItemUser);

    // Create widget chat - Simon response msg
    let vdnWidgetChatMsgItemSimon = document.createElement('span');
    vdnWidgetChatMsgItemSimon.setAttribute('class', 'vdn-widget-chat-msg-item vdn-widget-chat-msg-item-simon');

    let vdnWidgetChatMsgError = document.createElement('span');
    vdnWidgetChatMsgError.setAttribute('class', 'vdn-widget-chat-msg-item vdn-widget-chat-msg-error');

    // Create widget chat - Simon intro
    let tempSimonName = (vdnVoiceType.female) ? vdnWidgetMessages['simonIntro']['name'] + 'e' : vdnWidgetMessages['simonIntro']['name'];
    let simonIntroMsg  = tempSimonName + vdnWidgetMessages['simonIntro']['intro'] + "<br/><br/>";
    let simonGuidlines = vdnWidgetMessages['simonGuidelines'];
    
    let vdnWidgetChatIntroMsgItemSimon = document.createElement('span');
    vdnWidgetChatIntroMsgItemSimon.setAttribute('class', 'vdn-widget-chat-msg-item vdn-widget-chat-msg-item-simon');
    vdnWidgetChatIntroMsgItemSimon.innerHTML = simonIntroMsg + simonGuidlines;

    // Append user request and Simon response msg to widget chat conversation
    vdnWidgetChatConvo.appendChild(vdnWidgetChatIntroMsgItemSimon);

    // ############################ Widget Fields (Input section) ############################
    // Create widget text field and mic (Input Section)
    let vdnWidgetField = document.createElement('div');
    vdnWidgetField.setAttribute('class', 'vdn-widget-field');

    // Create mic icon wrapper
    let vdnWidgetMic = document.createElement('a');
    vdnWidgetMic.setAttribute('id', 'vdnWidgetMic');
    vdnWidgetMic.setAttribute('class', 'vdn-widget-button');

    // Create and append mic icon/image to mic wrapper
    let vdnWidgetMicImg = document.createElement('img');
    vdnWidgetMicImg.setAttribute('id', 'vdn-widget-mic-img');
    vdnWidgetMicImg.setAttribute('src', vdnImagesPath + 'vdn-widget-mic-black.svg');
    vdnWidgetMic.appendChild(vdnWidgetMicImg);

    let vdnWidgetMicStopIcon = document.createElement('img');
    
    if (vdnClientInfo.ios === true) {
        vdnWidgetMicStopIcon.setAttribute('src', vdnImagesPath + 'vdn-mic-stop.svg');
        vdnWidgetMicStopIcon.setAttribute('class', 'vdn-stop-alert vdn-hide-element');
        vdnWidgetMicStopIcon.setAttribute('id', 'vdn-mic-stop');
        vdnWidgetMic.appendChild(vdnWidgetMicStopIcon);
    }

    // Create button wrapper next to input text field
    let vdnWidgetSearchBtn = document.createElement('a');
    vdnWidgetSearchBtn.setAttribute('id', 'vdnWidgetSearchBtn');

    // Create and append search button to button wrapper
    let vdnWidgetSearchBtnEl = document.createElement('button');
    vdnWidgetSearchBtnEl.setAttribute('class', 'vdn-widget-form-submit-btn');
    vdnWidgetSearchBtnEl.setAttribute('type', 'submit');
    vdnWidgetSearchBtnEl.setAttribute('alt', 'Go');
    vdnWidgetSearchBtnEl.setAttribute('title', 'Search');
    vdnWidgetSearchBtn.appendChild(vdnWidgetSearchBtnEl);

    // Create form for widget
    let vdnWidgetForm = document.createElement('form');
    vdnWidgetForm.setAttribute("class", "vdn-widget-form");

    if (formElementForWidget !== null) {
        vdnWidgetForm.action = formElementForWidget.action;
        vdnWidgetForm.method = formElementForWidget.method;
    } else {
        vdnWidgetForm.action = vdnGetCurrentHostURL() + '/';
        vdnWidgetForm.method = "get";
    }

    // Create input text field 
    let vdnWidgetSearch = document.createElement('input');
    vdnWidgetSearch.setAttribute('id', 'vdnWidgetSearch');
    vdnWidgetSearch.setAttribute('class', 'vdn-widget-search vdn-widget-search-text');
    vdnWidgetSearch.setAttribute('name', 'vdn-widget-search');
    vdnWidgetSearch.setAttribute('placeholder', vdnWidgetMessages['placeholder']);
    vdnWidgetSearch.setAttribute('name', 's');

    // Widget form submit event listener
    vdnWidgetForm.addEventListener('submit', function(event){
            try { vdnWidgetChatConvo.removeChild(vdnWidgetChatMsgItemUserWrapper); } catch(err) { /*Do nothing */}
            try { vdnWidgetChatConvo.removeChild(vdnWidgetChatMsgItemSimon);} catch(err) { /*Do nothing */}
            try { vdnWidgetChatConvo.removeChild(vdnWidgetChatMsgError);} catch(err) { /*Do nothing */}

            // Engage speak2web AI if native search is not configured 
            if (vdnTypeOfSearch != 'native') {
                // Prevent default text search
                event.preventDefault();

                // If API system key is unavailable then acknowledge service unavailability and stop voice navigation.
                if (!(typeof(vdnXApiKey) != 'undefined' && vdnXApiKey !== null)) {
                    // Play feature unavailble playback
                    vdnIntentResponsePlayer.configure(vdnAlternativeResponse['unavailable']);
                    vdnIntentResponsePlayer.play();

                    return false;
                }

                if (vdnWidgetSearch.value.length != 0) {
                    // Play basic acknowledgement playback
                    vdnIntentResponsePlayer.configure(vdnAlternativeResponse['basic']);
                    vdnIntentResponsePlayer.play();
                    
                    // Send input to vdn.speech-handler.js
                    vdnSendDialog(vdnWidgetSearch.value, function (playbackPath, navigationCbAfterAudioPlay = null, isNativeSearch = false) {
                        if (typeof navigationCbAfterAudioPlay !== 'function') {
                            navigationCbAfterAudioPlay = function() {
                                // If dialog for intent is disabled in settings then fire native search
                                if (isNativeSearch === true) {
                                    try { vdnWidgetForm.submit(); } 
                                    catch (err) { console.log('Something went wrong while submitting a form for native search.'); }
                                }
                            }
                        }
                        
                        // Play intent response playback
                        vdnIntentResponsePlayer.configure(playbackPath, navigationCbAfterAudioPlay);
                        vdnIntentResponsePlayer.play();
                    }, vdnGetWidgetElementsObj());
                }
            }
    }, false);

    vdnWidgetForm.appendChild(vdnWidgetSearch);
    vdnWidgetForm.appendChild(vdnWidgetSearchBtn);

    // Append mic, button (hidden) and input text elements to widget text field and mic section (input section)
    vdnWidgetField.appendChild(vdnWidgetMic);
    vdnWidgetField.appendChild(vdnWidgetForm);

    // Append chat header, chat conversation and input fields to widget chat wrapper
    vdnWidgetChatWrapper.appendChild(vdnWidgetChatHeader);
    vdnWidgetChatWrapper.appendChild(vdnWidgetChatConvo);
    vdnWidgetChatWrapper.appendChild(vdnWidgetField);

    // ################################ Widget Toggle button #########################
    // Create a widget toggle button wrapper
    let vdnWidgetToggleButton = document.createElement('a');
    vdnWidgetToggleButton.setAttribute('id', 'vdnWidgetToggleButton');
    vdnWidgetToggleButton.setAttribute('class', 'vdn-widget-button vdn-blink-widget-toggle-button');

    // Create toggle button icon element
    let vdnToggleButtonIconClass = vdnFloatingButtonIcon && vdnFloatingButtonIcon == 'robotIcon' ? 'vdn-toggle-btn-robot' : 'vdn-toggle-btn-mic';
    let vdnWidgetIcon = document.createElement('div');
    vdnWidgetIcon.setAttribute('class', 'vdn-widget-icon vdn-widget-toggle-button ' + vdnToggleButtonIconClass);

    // Append toggle button icon to toggle button wrapper
    vdnWidgetToggleButton.appendChild(vdnWidgetIcon);

    // Append chat wrapper and toggle button to widget wrapper
    vdnWidgetWrapper.appendChild(vdnWidgetChatWrapper);
    vdnWidgetWrapper.appendChild(vdnWidgetToggleButton);

    // Append widget to html
    //vdnDocFragment.appendChild(vdnWidgetWrapper);
    document.body.insertAdjacentElement('afterend', vdnWidgetWrapper);

    // Attach event of mouse over to mic button
    vdnWidgetMic.addEventListener('mouseover', function (event) {
        // Randomize text of mic tool-tip
        vdnWidgetMic.title = vdnGetRandomSearchHint();
    });

    // Listen event to show/hide widget
    vdnWidgetToggleButton.addEventListener('click', function(event){
        vdnToggleWidgetElements();
    });

    document.body.onload = function(){
        let vdnPreservedWidgetConversation = localStorage.getItem('vdnWidgetConversation');

        if (vdnPreservedWidgetConversation !== null) {
            let parsedWidgetConvo = JSON.parse(vdnPreservedWidgetConversation);
            let userQuery = parsedWidgetConvo.userQuery || null;
            let simonResponse = parsedWidgetConvo.simonResponse || null;
            
            if (userQuery !== null && simonResponse !== null) {
                vdnWidgetToggleButton.classList.remove('vdn-blink-widget-toggle-button');
                vdnWidgetChatMsgItemUser.innerHTML = userQuery;
                vdnWidgetChatMsgItemSimon.innerHTML = simonResponse;
                vdnWidgetChatConvo.appendChild(vdnWidgetChatMsgItemUserWrapper);
                vdnWidgetChatConvo.appendChild(vdnWidgetChatMsgItemSimon);
                
                if (vdnClientInfo.ios === false) vdnWidgetToggleButton.click();
            }

            vdnTogggleExpandCollapse('expand');
        }

        localStorage.removeItem('vdnWidgetConversation');
    };

    /*############################# Widget mic handling ################################*/
    // Setup recognition
    let widgetFinalTranscript = '';
    let widgetRecognizing     = false;
    let widget_final_transcript = "";
    let widget_ignore_onend;

    if ('webkitSpeechRecognition' in window && vdnClientInfo['chrome'] === true) {
        let widgetRecognition = new webkitSpeechRecognition();
        widgetRecognition.continuous = true;
        widgetRecognition.interimResults = true;

        widgetRecognition.onstart = function () { 
            widgetRecognizing = true; 
        };

        widgetRecognition.onerror = function (event) {
            vdnWidgetMic.classList.remove('listening');
            widgetRecognizing = false;

            if (event.error == 'no-speech') {
                // Play not audible playback
                vdnIntentResponsePlayer.configure(vdnAlternativeResponse['notAudible']);
                vdnIntentResponsePlayer.play();

                widget_ignore_onend = true;
                vdnWidgetChatMsgError.innerHTML = vdnMessages['unableToHear'];
                vdnWidgetChatConvo.appendChild(vdnWidgetChatMsgError);
            }

            if (event.error == 'audio-capture') {
                widget_ignore_onend = true;
                vdnWidgetChatMsgError.innerHTML = vdnMessages['micNotAccessible'];
                vdnWidgetChatConvo.appendChild(vdnWidgetChatMsgError);
            }

            if (event.error == 'not-allowed') {
                widget_ignore_onend = true;
                vdnWidgetChatMsgError.innerHTML = vdnMessages['browserDenyMicAccess'];
                vdnWidgetChatConvo.appendChild(vdnWidgetChatMsgError);
            }
        };

        function widgetProcessEnd() {
            widgetRecognizing = false;

            if (widget_ignore_onend) { return; }

            widgetFinalTranscript = widget_final_transcript;   
            vdnWidgetMic.classList.remove('listening');

            let i = Math.floor(Math.random() * 10);
            let resp = vdnAlternativeResponse['randomLib'];

            // Play random response playback
            vdnIntentResponsePlayer.configure(resp[i], function () {
                if (typeof(widgetFinalTranscript) != 'undefined' && widgetFinalTranscript.length != 0) {
                    vdnWidgetChatMsgItemUser.innerHTML = widgetFinalTranscript;
                    vdnWidgetChatConvo.appendChild(vdnWidgetChatMsgItemUserWrapper);
                    vdnWidgetSearch.value = widgetFinalTranscript;
                    
                    vdnSendDialog(widgetFinalTranscript, function (playbackPath, navigationCbAfterAudioPlay = null, isNativeSearch = false) {
                        if (typeof navigationCbAfterAudioPlay !== 'function') { 
                            navigationCbAfterAudioPlay = function(){
                                // If dialog for intent is disabled in settings then fire native search
                                if (isNativeSearch === true) {
                                    try { vdnWidgetForm.submit(); } 
                                    catch (err) { console.log('Something went wrong while submitting a form for native search.'); }
                                }
                            };
                        }

                        // Play intent response playback
                        vdnIntentResponsePlayer.configure(playbackPath, navigationCbAfterAudioPlay);
                        vdnIntentResponsePlayer.play();
                    }, vdnGetWidgetElementsObj());
                } else {
                    vdnWidgetSearch.placeholder = vdnMessages['ask'];
                }
            });
            vdnIntentResponsePlayer.play();
        }

        widgetRecognition.onend = function () { 
            if (vdnClientInfo.android) { widgetProcessEnd(); }
        };

        widgetRecognition.onresult = function (event) {
            let interim_transcript = '';

            if (typeof (event.results) == 'undefined') {
                widgetRecognition.onend = null;
                widgetRecognition.stop();
                vdnWidgetSearch.placeholder = vdnMessages['unableToProcess'];

                // Play mic connect issue playback
                vdnIntentResponsePlayer.configure(vdnAlternativeResponse['unableToProcess']);
                vdnIntentResponsePlayer.play();

                return;
            }

            let eventResultsLength = event.results.length;

            for (let i = event.resultIndex; i < eventResultsLength; ++i) {
                if (event.results[i].isFinal) {
                    widget_final_transcript = event.results[i][0].transcript;

                    if (vdnClientInfo.android == false) {
                        widgetProcessEnd();
                        widgetRecognition.stop();
                    }                        
                } else {
                    interim_transcript += event.results[i][0].transcript;
                }
            }
        };

        vdnWidgetMic.addEventListener(vdnMicEventToListen, function (event) {
            if (vdnAnyOtherMicListening(vdnWidgetMic.getAttribute('id'), vdnWidgetMic) === true) return;

            // If API system key is unavailable then acknowledge service unavailability and stop voice navigation.
            if (!(typeof (vdnXApiKey) != 'undefined' && vdnXApiKey !== null)) {
                // Play feature unavailable playback
                vdnIntentResponsePlayer.configure(vdnAlternativeResponse['unavailable']);
                vdnIntentResponsePlayer.play();

                return;
            }

            if (widgetRecognizing) {
                // To clear pre-existing mic reset timeout if any. (Based on duration from settings)
                vdnClearMicResetTimeout();

                // Need to stop the recording
                vdnWidgetSearch.placeholder = vdnGetRandomSearchHint();

                if (vdnClientInfo.android == false) {
                    widgetProcessEnd();
                    widgetRecognition.stop();
                }
            } else {
                try { vdnWidgetChatConvo.removeChild(vdnWidgetChatMsgItemUserWrapper); } catch(err) { /*Do nothing */}
                try { vdnWidgetChatConvo.removeChild(vdnWidgetChatMsgItemSimon);} catch(err) { /*Do nothing */}
                try { vdnWidgetChatConvo.removeChild(vdnWidgetChatMsgError);} catch(err) { /*Do nothing */}
                
                vdnWidgetSearch.placeholder = vdnGetRandomSearchHint();
                vdnWidgetMic.classList.add('listening');
                event.preventDefault();

                // Stop ongoing playback if nay
                if (vdnIntentResponsePlayer.isPlaying()) {
                    vdnIntentResponsePlayer.stop();
                }

                vdnWidgetChatMsgItemUser.innerHTML = widgetFinalTranscript = '';
                widgetRecognizing = true;
                widgetRecognition.lang = vdnSelectedLang;
                widgetRecognition.start();
                widget_ignore_onend = false;

                // To clear pre-existing mic reset timeout if any. (Based on duration from settings)
                vdnClearMicResetTimeout();

                // To set new mic reset timeout. (Based on duration from settings)
                window.vdnMicTimeoutIdentifier = setTimeout(function(){
                    let updatedClassList = vdnWidgetMic.classList;

                    if (updatedClassList && updatedClassList.contains('listening')) {
                        vdnWidgetMic.click();
                    }
                }, vdnOtherInputTimeoutDuration);
            }
        });
    } else {
        //CODE FOR BROWSERS THAT DO NOT SUPPORT STT NATIVLY
        // MUST USE THE BUILT IN MICROPHONE
        vdnWidgetMic.addEventListener(vdnMicEventToListen, function (event) {
            /**
             * Audio element's play method must be invoked in exact influence of user gesture to avoid auto play restriction
             * 
             */
            if (
                vdnClientInfo.ios === true
                || (vdnClientInfo.safari && !vdnClientInfo.chrome && !vdnClientInfo.firefox)
                || (vdnClientInfo.windows && vdnClientInfo.firefox)
            ) {
                vdnIntentResponsePlayer.configure(vdnSilenceSoundPath);
                vdnIntentResponsePlayer.play();
            }

            if (vdnAnyOtherMicListening(vdnWidgetMic.getAttribute('id'), vdnWidgetMic) === true) return;

            // Deny recording if microphone is not accessible
            if (!vdnAudioRecorder || !vdnAudioContext) {
                vdnInitAudio(function (a) {
                    if (!vdnAudioRecorder || !vdnAudioContext) {

                        try { vdnWidgetChatConvo.removeChild(vdnWidgetChatMsgError);} catch(err) { /*Do nothing */}
                        
                        vdnWidgetChatMsgError.innerHTML = vdnMessages['micNotAccessible'];
                        vdnWidgetChatConvo.appendChild(vdnWidgetChatMsgError);
                        return false;
                    } else {
                        widgetListenEvent();
                    }
                });
            } else {
                widgetListenEvent();
            }

            function widgetListenEvent() {
                // If API system key is unavailable then acknowledge service unavailability and stop voice navigation.
                if (!(typeof (vdnXApiKey) != 'undefined' && vdnXApiKey !== null)) {
                    // Play feature unavailable playback
                    vdnIntentResponsePlayer.configure(vdnAlternativeResponse['unavailable']);
                    vdnIntentResponsePlayer.play();

                    return false;
                }

                // User ending recording by clicking back mic
                if (widgetRecognizing) {
                    // To clear pre-existing mic reset timeout if any. (Based on duration from settings)
                    vdnClearMicResetTimeout();

                    // For iOS only
                    if (vdnClientInfo.ios === true) {
                        // To clear pre-existing mic stop display timeout if any.
                        vdnClearIosMicStopDisplayTimeout();
                        
                        let widgetMicImgClasses = vdnWidgetMicImg.classList;
                        
                        if (widgetMicImgClasses.contains('vdn-hide-element')) {
                            // To reset/display mic icon back
                            vdnMicButtonImageSwitch(vdnWidgetMicImg, vdnWidgetMicStopIcon);
                        }
                    }

                    // Stop recorder
                    vdnAudioRecorder.stop();

                    // Stop access to audio resource
                    vdnStopAudio();

                    // Stop ongoing playback if nay
                    if (vdnIntentResponsePlayer.isPlaying()) {
                        vdnIntentResponsePlayer.stop();
                    }

                    //replace recording with mic icon
                    vdnWidgetMic.classList.remove('listening');

                    vdnWidgetSearch.placeholder = vdnMessages['transcribeText'];

                    vdnAudioRecorder.getBuffers(function (buffers) {
                        if (!!vdnSttLanguageContext['gcp']['stt']) {
                            vdnAudioRecorder.exportMonoWAV(function (blob) {
                                vdnAudioRecorder.convertBlobToBase64(blob).then(function(resultedBase64){
                                    vdnGcpStt(resultedBase64).then(function(transcriptResult){
                                        if (typeof(transcriptResult) != 'undefined' && transcriptResult.length != 0) {
                                            vdnWidgetChatMsgItemUser.innerHTML = transcriptResult;
                                            vdnWidgetChatConvo.appendChild(vdnWidgetChatMsgItemUserWrapper);
                                            vdnWidgetSearch.value = transcriptResult;
                                            
                                            vdnSendDialog(transcriptResult, function (playbackPath, navigationCbAfterAudioPlay = null, isNativeSearch = false) {
                                                if (typeof navigationCbAfterAudioPlay !== 'function') { 
                                                    navigationCbAfterAudioPlay = function(){
                                                        // If dialog for intent is disabled in settings then fire native search
                                                        if (isNativeSearch === true) {
                                                            try { vdnWidgetForm.submit(); } 
                                                            catch (err) { console.log('Something went wrong while submitting a form for native search.'); }
                                                        }
                                                    };
                                                }

                                                // Play intent response playback
                                                vdnIntentResponsePlayer.configure(playbackPath, navigationCbAfterAudioPlay);
                                                vdnIntentResponsePlayer.play();
                                            }, vdnGetWidgetElementsObj());
                                        } else {
                                            // Play not audible playback
                                            vdnIntentResponsePlayer.configure(vdnAlternativeResponse['notAudible']);
                                            vdnIntentResponsePlayer.play();

                                            vdnWidgetSearch.placeholder = vdnMessages['ask'];
                                        }
                                    });
                                }).catch(function(error){
                                    // Play 'notAudible' playback
                                    vdnIntentResponsePlayer.configure(vdnAlternativeResponse['notAudible']);
                                    vdnIntentResponsePlayer.play();

                                    vdnWidgetSearch.placeholder = vdnMessages['ask'];
                                });
                            });
                        }
                    });

                    widgetRecognizing = false;
                    return;

                } else {// User started recording by clicking mic
                    try { vdnWidgetChatConvo.removeChild(vdnWidgetChatMsgItemUserWrapper); } catch(err) { /*Do nothing */}
                    try { vdnWidgetChatConvo.removeChild(vdnWidgetChatMsgItemSimon);} catch(err) { /*Do nothing */}
                    try { vdnWidgetChatConvo.removeChild(vdnWidgetChatMsgError);} catch(err) { /*Do nothing */}

                    vdnWidgetSearch.placeholder = vdnGetRandomSearchHint();
                    vdnWidgetMic.classList.add('listening');
                    event.preventDefault();

                    // Stop ongoing playback if nay
                    if (vdnIntentResponsePlayer.isPlaying()) {
                        vdnIntentResponsePlayer.stop();
                    }

                    widgetFinalTranscript = '';
                    widgetRecognizing = true;
                    vdnAudioRecorder.clear();
                    vdnAudioRecorder.record(vdnWidgetMic);

                    // For iOS only
                    if (vdnClientInfo.ios === true) {
                        // To clear pre-existing mic stop display timeout if any.
                        vdnClearIosMicStopDisplayTimeout();

                        let widgetMicImgClasses = vdnWidgetMicImg.classList;

                        if (!widgetMicImgClasses.contains('vdn-hide-element')) {
                            // To set new mic stop display timeout.
                            window.vdnIosMicTimeoutIdentifier = setTimeout(function(){
                                // To display mic stop icon
                                vdnMicButtonImageSwitch(vdnWidgetMicImg, vdnWidgetMicStopIcon, true);
                            }, 4000);
                        }
                    }

                    // To clear pre-existing mic reset timeout if any. (Based on duration from settings)
                    vdnClearMicResetTimeout();

                    // To set new mic reset timeout. (Based on duration from settings)
                    window.vdnMicTimeoutIdentifier = setTimeout(function(){
                        let updatedClassList = vdnWidgetMic.classList;

                        if (updatedClassList && updatedClassList.contains('listening')) {
                            vdnWidgetMic.click();
                        }
                    }, vdnOtherInputTimeoutDuration);
                }
            }
        }, false); 
    }

    // Attach event of mouse over to mic button
    vdnWidgetMic.addEventListener('mouseover', function (event) {
        // Randomize text of mic tool-tip
        vdnWidgetMic.title = vdnGetRandomSearchHint();
    });
    /*###############################################################################*/

    /**
     * Function to get widget elements in an object
     *
     */
    function vdnGetWidgetElementsObj() {
        return {
            'chatConvoEl': vdnWidgetChatConvo, 
            'userMsgElWrapper': vdnWidgetChatMsgItemUserWrapper,
            'userMsgEl': vdnWidgetChatMsgItemUser,
            'simonMsgEl': vdnWidgetChatMsgItemSimon,
            'errorMsgEl': vdnWidgetChatMsgError,
            'expandCollapseHandle': function() { vdnTogggleExpandCollapse('expand'); }
        };
    }

    /**
     * Function to toggle class of the HTML element
     *
     * @param {elmSelector - String} : CSS Selector
     * @param {nameOfClass - String} : Class name to add/remove
     */
    function vdnToggleClass(elmSelector, nameOfClass) {
        if (!(typeof(elmSelector) != 'undefined' && elmSelector != null && elmSelector.length != 0)) return false;

        let element = document.querySelector(elmSelector);

        if (element.classList) { 
            element.classList.toggle(nameOfClass);
        } else {
            // For IE9

            let classes = element.className.split(" ");
            let i = classes.indexOf(nameOfClass);

            if (i >= 0) {
                classes.splice(i, 1);
            } else {
                classes.push(nameOfClass);
                element.className = classes.join(" "); 
            }
        }
    }

    /**
     * Function to handle expand and collapse behavior of Chat window
     *
     * @param { action: String } 'expand' to expand
     */
    function vdnTogggleExpandCollapse(action = null) {
        try {            
            if (!vdnWidgetChatConvo) return false;

            let vdnWidgetChatConvoClasses = vdnWidgetChatConvo.classList;
            let vdnExpandCollapseHandleClasses = vdnExpandCollapseHandle.classList;
            let vdnWidgetChatWrapperClasses = vdnWidgetChatWrapper.classList;

            if (action == 'expand') {
                if (vdnWidgetChatConvoClasses.contains('vdn-hide-element')) {
                    vdnWidgetChatConvoClasses.remove('vdn-hide-element');
                }

                if (vdnExpandCollapseHandleClasses.contains('vdn-expand-window')) {
                    vdnExpandCollapseHandleClasses.add('vdn-collapse-window');
                    vdnExpandCollapseHandleClasses.remove('vdn-expand-window');
                }

                if (vdnWidgetChatWrapperClasses.contains(vdnChatWrapperCollapseClass)) {
                    vdnWidgetChatWrapperClasses.remove(vdnChatWrapperCollapseClass);
                    vdnWidgetChatWrapperClasses.add(vdnChatWrapperMicPositionClass);
                }
            } else {
                vdnWidgetChatConvoClasses.toggle('vdn-hide-element');
                vdnExpandCollapseHandleClasses.toggle('vdn-expand-window');
                vdnExpandCollapseHandleClasses.toggle('vdn-collapse-window');
                vdnWidgetChatWrapperClasses.toggle(vdnChatWrapperMicPositionClass);
                vdnWidgetChatWrapperClasses.toggle(vdnChatWrapperCollapseClass);
            }
            vdnWidgetChatConvo.scrollTop = vdnWidgetChatConvo.scrollHeight;
        } catch(err) {
           console.log('VDN Error: something went wrong while expanding/collapsing a chat window.');
        }
    }

    /**
     * Function to toggle chat and links
     */
    function vdnToggleWidgetElements() {
        let isSimonIntroduced = localStorage.getItem('vdnSimonIntroduced');

        if (isSimonIntroduced === null) {
            // Play simon intro playbac
            vdnIntentResponsePlayer.configure(vdnAlternativeResponse['simonShortIntro']);
            vdnIntentResponsePlayer.play();

            localStorage.setItem('vdnSimonIntroduced', 'yes');
        } else if(vdnWidgetIcon.className.indexOf(vdnToggleButtonIconClass) != -1) {
            vdnWidgetChatIntroMsgItemSimon.innerHTML = simonGuidlines;

            // Scroll chat convo to the end
            if (typeof(vdnWidgetChatConvo.scrollTop) != 'undefined' 
                && typeof(vdnWidgetChatConvo.scrollHeight) != 'undefined') {
                vdnWidgetChatConvo.scrollTop = vdnWidgetChatConvo.scrollHeight;
            }
        }

        vdnToggleClass('.vdn-widget-toggle-button', vdnToggleButtonIconClass);
        vdnToggleClass('.vdn-widget-toggle-button', 'vdn-toggle-btn-close');
        vdnToggleClass('.vdn-widget-toggle-button', 'vdn-widget-active');
        vdnToggleClass('.vdn-widget-toggle-button', 'vdn-widget-visible');
        vdnToggleClass('#vdnWidgetToggleButton', 'vdn-widget-float');
        vdnToggleClass('.vdn-widget-chat-wrapper', 'vdn-widget-visible');
        vdnToggleClass('.vdn-widget-button', 'vdn-widget-visible');

        //To set the chat history and expand the chat box 
        if ( localStorage.getItem('vdnChatHistory') !== null ) {
            document.getElementById('vdnWidgetChatConvo').innerHTML = localStorage.getItem('vdnChatHistory');            
        }
        vdnTogggleExpandCollapse();
    }
})();
};
