// *****************************************************************************************************
// *******              speak2web VOICE DIALOG NAVIGATION                                    ***********
// *******               AI Service requires subcriptions                                    ***********
// *******               Get your subscription at                                            ***********
// *******                    https://speak2web.com/plugin#plans                             ***********
// *******               Need support? https://speak2web.com/support                         ***********
// *******               Licensed GPLv2+                                                     ***********
//******************************************************************************************************

var vdnSynthErrorCount = 0;

// ########################################################################
//
// For toggling HTML elements visibility on UI
//
// ########################################################################

/**
 * Function to toggle visibility of intent configuration section
 *
 * @param dialogType - string : Selected dialog type
 */
function toggleVdnDialogType(dialogType = 'generic') {
    try {
        let vdnHideClass = 'vd-navigation-hide';
        let dashboardNoIntentNoticeEl = document.querySelector('div[data-vdn-notice]');

        if (dialogType == 'generic') {
            document.getElementById('vdNavigationDialogConfigFormSection').classList.remove(vdnHideClass);
            document.getElementById('vdNavigationCustomEndpointRow').classList.add(vdnHideClass);
            
            // To display (if hidden) 'No Intent Configured' dashboard notice on settings page.
            if (dashboardNoIntentNoticeEl && dashboardNoIntentNoticeEl !== null) {
                dashboardNoIntentNoticeEl.classList.remove(vdnHideClass);
            }
        } else {
            document.getElementById('vdNavigationDialogConfigFormSection').classList.add(vdnHideClass);
            document.getElementById('vdNavigationCustomEndpointRow').classList.remove(vdnHideClass);
            
            // To hide 'No Intent Configured' dashboard notice on settings page.
            if (dashboardNoIntentNoticeEl && dashboardNoIntentNoticeEl !== null) {
                dashboardNoIntentNoticeEl.classList.add(vdnHideClass);
            }
        }
    } catch(err) {
        // Do nothing for now
    }
}

/**
 * Function to enable/disable intent input behaviour
 * 
 * @param { el: HTML Dom Object } Checkbox been interacted
 */
function toggleIntentAccessiblity(el) {
    try {
        if (el && el !== null) {
            let vdnIntentInputAttributeNames = ['data-response-name', 'data-url-name', 'data-save-button-name'];
            let vdnIntentEnabled = el.checked && el.checked === true ? true : false;
            let vdnAttribNamesLength = vdnIntentInputAttributeNames.length;
            
            for (let i = 0; i < vdnAttribNamesLength; i++) {
                let vdnIntentInputAttributeName = vdnIntentInputAttributeNames[i];
                let vdnIntentInputSelector = el.getAttribute(vdnIntentInputAttributeName);

                if (!(vdnIntentInputSelector && vdnIntentInputSelector !== null)) continue;

                let vdnIntentInput = document.querySelector(vdnIntentInputSelector);

                if (!(vdnIntentInput && vdnIntentInput !== null)) continue;

                // To enable intent save button
                if (vdnIntentInput.type && vdnIntentInput.type === 'submit') {
                    if (vdnIntentEnabled === true) {
                        vdnIntentInput.removeAttribute('disabled');
                    } 

                    continue;
                } 

                // To enable/disable intent response and URL
                if (vdnIntentEnabled === true) {
                    vdnIntentInput.removeAttribute('readonly');
                } else {
                    vdnIntentInput.setAttribute('readonly', vdnIntentEnabled);
                }
            }
        }
    } catch (err) {
        // Do nothing for now
    }
}

/**
 * Function to toggle visibility of 'Google Analytics Tracking ID' input field
 *
 * @param { checkboxObj: DOM Object } Checkbox as DOM Object
 */
function vdnToggleGaTrackingIdField(checkboxObj = null) {
    try {
        if (typeof checkboxObj == 'undefined' || !checkboxObj) return false;

        let vdnGaTrackingIdObj = document.querySelector('div[id=vdnGaTrackingIdWrapper]');
        
        if (vdnGaTrackingIdObj) {
            let vdnGaTrackingIdClasses = vdnGaTrackingIdObj.classList;
            vdnGaTrackingIdClasses.toggle('vdn-hide-element');
        }
    } catch(err) {
        // Do nothing for now
    }
}


// ########################################################################
//
// For handling validation of input elements on UI
//
// ########################################################################
/**
 * Function to reset auto end mic listening timeout
 *
 * @param this- DOMElement Object
 * @param evt - Event 
 */
function vdnResetTimeoutDefaultValue(el, evt) {
    if (typeof(el) == 'undefined') return;
    
    if (el.value.length == 0) {
        el.value = "8";
    } else if (parseInt(el.value) > 20) {
        el.value = "20";
    } else if (parseInt(el.value) < 8) {
        el.value = "8";
    }
}

/**
 * Function to validate length of timeout value
 *
 * @param this- DOMElement Object
 * @param evt - Event 
 */
function vdnValidateTimeoutValue(el, evt) {
    if (typeof(el) == 'undefined') return;

    if (el.value.length == 2 && parseInt(el.value) > 20) {
        evt.preventDefault();
    }
}

// ########################################################################
//
// For handling change events of input elements on UI
//
// ########################################################################
/**
 * Function to handle change event of select voice element/dropdown
 * 
 * @param selectEl - DOMElement Object Select voice element
 *
 */
function vdnVoiceChange(selectEl) {
    let newValue = selectEl.value;
    let oldValue = selectEl.getAttribute('data-old-value');
    let doSynthesize = selectEl.getAttribute('data-do-synthesize');

    if (!!newValue && !!oldValue && oldValue !== newValue) {
        selectEl.setAttribute('data-do-synthesize', true);
    } else if (!!doSynthesize && doSynthesize === "true") {
        selectEl.setAttribute('data-do-synthesize', false);
    }
}

/**
 * Function to handle input text of Google Analytics tracking id
 *
 * @param inputEl - DOMElement Object Google analytics Id input field
 */
function vdnGaIdChange(inputEl) {
    if (!!inputEl) {
        let value = inputEl.value;
        let errorState = inputEl.getAttribute('data-error');

        function vdnToggleError(action = null) {
            if (!action || !(action == 'show' || action == 'hide')) return false;
            
            let vdnGaIdError = document.getElementById('vdnGaIdError');
            let vdnBasicConfSaveButton = document.getElementById('vdNavigationBasicConfigSettingsSave');
            let outline = "";
            let color = "";
            let dataErrorAttr = "";
            let errorDisplay = "";
            
            if (action == 'show') {
                outline = "2px solid #FF0000";
                color = "#FF0000";
                dataErrorAttr = "1";
                errorDisplay = "block";

                if (!!vdnBasicConfSaveButton) {
                    vdnBasicConfSaveButton.setAttribute('disabled', 'disabled');
                }
            } else {
                outline = "";
                color = "#000000";
                dataErrorAttr = "0";
                errorDisplay = "none";

                if (!!vdnBasicConfSaveButton) {
                    vdnBasicConfSaveButton.removeAttribute('disabled');
                }
            }

            inputEl.style.outline = outline;
            inputEl.style.color = color;
            inputEl.setAttribute('data-error', dataErrorAttr);

            if (!!vdnGaIdError) {
                vdnGaIdError.style.display = errorDisplay;
            }
        }

        if (!!value) {
            let val = value.toLowerCase();

            if (((val.length == 1 && val == 'u')
                || (val.length == 2 && val == 'ua')
                || (val.length > 2 && val.substring(0, 3) == 'ua-'))
                && errorState == '1') {
                vdnToggleError('hide');
            }

            if (((val.length == 1 && val != 'u')
                || (val.length == 2 && val != 'ua')
                || (val.length > 2 && val.substring(0, 3) != 'ua-'))
                && errorState == '0') {                
                vdnToggleError('show');
            }
        } else if (errorState == '1') {
            vdnToggleError('hide');
        }
    }
}


// ########################################################################
//
// For Window and Document load and Unload Events
//
// ########################################################################
window.addEventListener('load', function() {
    let data = vdnGetSynthesizableIntents(false);

    // While plugin being activated (Even while upgrade)
    if (!!data && data.length > 0) {
        vdnSynthesizeProcPopup('show', true);
        vdnSynthesizeRecursively(data, null, data.length, null);
    }
});

// To restrict user from navigating away while synthesizing process is on
document.body.addEventListener('load', function() {
    document.body.style.pointerEvents = 'auto';
})

// ########################################################################
//
// For Text Synthsis processs
//
// ########################################################################

/**
 * Function to read option name array of intents (Which require audio file generation) from HTML
 *
 * @param Boolean forVoiceChange  'true' to read array of intents db option names intended for voice/language change
 *
 * @return Array data  Array of intents DB option names based on @param forVoiceChange.
 *
 */
function vdnGetSynthesizableIntents(forVoiceChange) {
    let voiceChanged = typeof forVoiceChange != 'undefined' && forVoiceChange == true ? true : false;
    let attrName = !!forVoiceChange ? 'data-intents-with-audios' : 'data-intents-for-audio-regeneration';
    
    let dialogConfigWrapperEl = document.getElementById('vdNavigationDialogConfigFormSection');
    let vdnIntentsForAudioRegeneration = !!dialogConfigWrapperEl ? dialogConfigWrapperEl.getAttribute(attrName) : null;
    let data = !!vdnIntentsForAudioRegeneration ? JSON.parse(vdnIntentsForAudioRegeneration) : null;

    return data;
}

/**
 * Function to synthesize text of more than one dialogs recursively
 *
 * @param Array intentDbOptionNames  Array of database option name for dialogs/intents
 * @param String voice  Voice/language to be used to synthesize text
 * @param Number totalDialogs  Total number of dialogs to synthesize
 * @param Function cb  Callback function
 *
 */
function vdnSynthesizeRecursively(intentDbOptionNames, voice, totalDialogs, cb) {
    let dbOpNames = typeof intentDbOptionNames != 'undefined' && !!intentDbOptionNames ? intentDbOptionNames : null;
    let changedVoice = typeof voice != 'undefined' && !!voice ? voice : null;
    let totalDialogsCount = typeof totalDialogs != 'undefined' && !!totalDialogs ? totalDialogs : null;

    // ################################################################################
    // Here we are done with text synthesis recursive process as soon as db name options array gets empty
    // Handle the post process complete stuff here
    // ################################################################################
    if (!(!!dbOpNames && dbOpNames.length > 0) || vdnSynthErrorCount > 0) {
        let errCount = vdnSynthErrorCount;
        vdnSynthErrorCount = 0;
        vdnSynthesizeProcPopup('hide', true);

        if (typeof cb == 'function') {
            cb(errCount > 0 ? true : false);
        } else if (errCount == 0) {
            window.location.reload();
        }

        return;
    };

    let dbOptionName = dbOpNames.shift();
    let form = document.querySelector('form[data-intent-option-key='+ dbOptionName +']');
    let inputs = !!form ? form.elements : null;

    if (!(!!inputs)) return;

    let textareaEl = inputs[dbOptionName + '[response]'];
    let textareaText = !!textareaEl ? textareaEl.getAttribute('data-old-value') : null;

    if (!(!!textareaText)) return;

    // Update dialog systhesis counter
    vdnUpdateSynthCounter(totalDialogsCount, (parseInt(totalDialogsCount) - parseInt(dbOpNames.length)))

    // Make AJAX call to local server for text synthesis
    vdnSynthesize(textareaText, dbOptionName, null, changedVoice).then(function(){
        vdnSynthesizeRecursively(dbOpNames, changedVoice, totalDialogsCount, cb);
    }).catch(function(error) {
        let errorObj = typeof error != 'undefined' && !!error ? error : {};
        let errorCode = 'code' in errorObj ? errorObj['code'] : null;
        let errorMsg = 'error' in errorObj ? errorObj['error'] : null;

        if (!!errorMsg) alert(errorMsg);
        
        vdnSynthErrorCount += 1;
        vdnSynthesizeRecursively(dbOpNames, changedVoice, totalDialogsCount, cb);
    });
}

/**
 * Function to synthesize text using AJAX
 *
 * @param String dialogText  Dialog/response text to be synthesized
 * @param String dialogOpName  Database option name for dialog
 * @param HTMLElement form  Form DOM object
 * @param String paramVoice  Voice to be used for synthesizing
 *
 * @return Promise.
 *
 */
function vdnSynthesize(dialogText, dialogOpName, form, paramVoice) {
    let isMulti = typeof isLanguageChange != 'undefined' && !!isLanguageChange && isLanguageChange === true ? true : false;
    let text = typeof dialogText != 'undefined' && !!dialogText ? dialogText : null;
    let optionName = typeof dialogOpName != 'undefined' && !!dialogOpName ? dialogOpName : null;
    let errPrefix = 'Unable to synthesize the dialog. ';

    return new Promise(function(resolve, reject){        
        let formData = new FormData();

        if (!!text && !!optionName) {
            formData.append('dialog_text', text);
            formData.append('dialog_op_name', optionName);

            if (typeof paramVoice != 'undefined' && !!paramVoice) formData.append('voice_for_synth', paramVoice);
        } else {
            reject({'code': 'VDN_ERROR_5', 'error': errPrefix + 'Required parameters are missing.'});
            return;
        }
        
        formData.append("action", "vdn_synthesize");
        formData.append("_ajax_nonce", vdnAjaxObj.synthesize_nonce);

        let xhr = new XMLHttpRequest();

        xhr.onreadystatechange = function () {
            if (this.readyState == 4) {                
                if (this.status === 200) {
                    let res = JSON.parse(this.response);
                    let success = typeof res != 'undefined' && 'success' in res ? res['success'] : null;
                    let data = typeof res != 'undefined' && 'data' in res ? res['data'] : null;
                    
                    if (!!success) {
                        // #####################################################################################################################
                        // On front end hidden fields are used while form submission to store dialog audio data to DB.
                        // To avoid overriding of updated data at DB (Updated by this ajax call) by old data from hidden fields form submission
                        // Here we are updating hidden fields.
                        // #####################################################################################################################
                        if (!!data && typeof form != 'undefined' && !!form) { 
                            let voice = 'voice' in data ? data['voice'] : null;
                            let path = 'path' in data ? data['path'] : null;
                            let inputs = form.elements;

                            if (!!voice && !!path && typeof inputs != 'undefined' && !!inputs) {
                                let audioVoiceHiddenEl = inputs[optionName + "[intent_audio_response][voice]"];
                                let audioPathHiddenEl = inputs[optionName + "[intent_audio_response][path]"];
                                
                                audioVoiceHiddenEl.value = voice;
                                audioPathHiddenEl.value = path;
                            }
                        }

                        resolve();
                    } else {
                        let errorObj = !!data ? data : {};
                        let errorCode = 'code' in data ? data['code'] : null;
                        let errorMsg = 'error' in data ? data['error'] : null;
                        let msg = !!errorMsg ? errPrefix + errorMsg : errPrefix;
                        reject({'code': 'VDN_ERROR_6', 'error': msg});
                    }
                } else {
                    reject({'code': 'VDN_ERROR_7', 'error': errPrefix + 'Technically improper request to the server.'});
                }
            }
        }

        xhr.open("POST", vdnAjaxObj.ajax_url, true); 
        xhr.send(formData);
    });
}

// ########################################################################
//
// For Basic and Dialog Form submission
//
// ########################################################################
/**
 * Function to intercept basic form submission process
 *
 * @param HTMLElement formObj  Form DOM object
 * @param Event evt  Form submission synthetic event object
 *
 */
function vdnBasicFormSubmitHandler(formObj, evt) {
    if (typeof formObj != 'undefined' && !!formObj) {
        let doSynthesize = false;
        let selectVoiceEl = formObj.querySelector('select[data-synth-decider=voice]');
        let synthFlagFromVoice = !!selectVoiceEl ? selectVoiceEl.getAttribute('data-do-synthesize') : null;
        doSynthesize = !!synthFlagFromVoice && synthFlagFromVoice === 'true' ? true : false;

        if (!!doSynthesize) {
            evt.preventDefault();
            let newVoice = selectVoiceEl.value.trim();
            let oldVoice = selectVoiceEl.getAttribute('data-old-value');

            let data = vdnGetSynthesizableIntents(true);

            if (!!data && data.length > 0) {
                vdnSynthesizeProcPopup('show', true);
                vdnSynthesizeRecursively(data, newVoice, data.length, function(errorOccured) {
                    let hadError = typeof errorOccured != 'undefined' && errorOccured === true ? true : false;
                    formObj.submit();
                });
            } else {
                formObj.submit();
            }
        }
    }
}

/**
 * Function to intercept dialog form submission process
 *
 * @param HTMLElement formObj  Form DOM object
 * @param Event evt  Form submission synthetic event object
 *
 */
function vdnDialogFormSubmitHandler(formObj, evt) {
    if (!!formObj) {
        let doSynthesize = false;
        let inputs = formObj.elements;
        let dialogOptionDbName = formObj.getAttribute('data-intent-option-key');
        
        let textarea = inputs[dialogOptionDbName + "[response]"];
        let textareaOldValue = !!textarea ? textarea.getAttribute('data-old-value').trim() : null;
        let textareaNewValue = !!textarea ? textarea.value.trim() : null;

        let checkbox = inputs[dialogOptionDbName + "[enabled]"];
        let checkboxOldValue = !!checkbox ? checkbox.getAttribute('data-old-value').trim() : null;
        let checkboxNewValue = !!checkbox ? checkbox.value.trim() : null;

        if (!!textareaNewValue && textareaOldValue !== textareaNewValue) {
            doSynthesize = true;
        }
        
        let audioVoiceEl = inputs[dialogOptionDbName + "[intent_audio_response][voice]"];
        let audioVoice = !!audioVoiceEl ? audioVoiceEl.value : null;
        let pluginCurrentVoice = formObj.getAttribute('data-current-voice');

        if (
            doSynthesize === false &&
            !!checkboxNewValue &&
            checkboxNewValue == 'enabled' &&
            !!audioVoice &&
            !!pluginCurrentVoice &&
            (audioVoice !== pluginCurrentVoice)
        ) {
            doSynthesize = true;
        }

        if (!!doSynthesize && !!textareaNewValue) {
            evt.preventDefault();
            vdnSynthesizeProcPopup('show', false);
            
            vdnSynthesize(textareaNewValue, dialogOptionDbName, formObj, null).then(function(result) {
                vdnSynthesizeProcPopup('hide', false);
                formObj.submit();
            }).catch(function(error) {
                let errorObj = typeof error != 'undefined' && !!error ? error : {};
                let errorCode = 'code' in errorObj ? errorObj['code'] : null;
                let errorMsg = 'error' in errorObj ? errorObj['error'] : null;

                vdnSynthesizeProcPopup('hide', false);

                if (!!errorMsg) alert(errorMsg);

                formObj.submit();
            });
        }
    }
}

// ########################################################################
//
// For Text synthesis process popup
//
// ########################################################################

/**
 * Function to control visibility of synthesizing process popup
 *
 * @param String action  'show' or 'hide'
 * @param Boolean paramForMulti  Indicating whether the popup being displayed for sythesizing process for more than one dialogs.
 *
 */
function vdnSynthesizeProcPopup(action, paramForMulti) {
    if (typeof action != 'undefined' && !(action == 'show' || action == 'hide')) return;

    let vdnModal = document.getElementById('vdnLoaderModal');

    try {
        if (!vdnModal) return;

        let display = 'none';
        let pointerEvent = 'auto';

        if (action == 'show') {
            display = 'block';
            pointerEvent = 'none';

            let vdnTotalSynthResponseSection = document.getElementById('vdnTotalSynthResponseSection');

            if (!!vdnTotalSynthResponseSection) {
                let forMulti = typeof paramForMulti != 'undefined' && paramForMulti === true ? true : false;
                vdnTotalSynthResponseSection.style.display = (forMulti) ? 'block' : 'none';                            
            }
        }

        vdnModal.style.display = display;
        document.body.style.pointerEvents = pointerEvent;
    } catch(err) {
        if (!!vdnModal) vdnModal.style.display = 'none';

        document.body.style.pointerEvents = 'auto';
    }
}

/**
 * Functiont to update counter information in UI of synthesize process dialog
 * 
 * @param totalDialogs Number  Total number of dialogs to be synthesized
 * @param currentDialog Number  Current dialog being synthesized
 *
 */
function vdnUpdateSynthCounter(totalDialogs, currentDialog) {
    let vdnTotalSynthResponseSection = document.getElementById('vdnTotalSynthResponseSection');
    
    try {
        if (!!vdnTotalSynthResponseSection && vdnTotalSynthResponseSection.style.display == 'block') {
            let current = vdnTotalSynthResponseSection.querySelector('span[id=vdnCurrentDialog]');
            let total = vdnTotalSynthResponseSection.querySelector('span[id=vdnTotalSynthesizableDialogs]');

            if (!!current && !!total) {
                total.innerText = totalDialogs;
                current.innerText = currentDialog;
            }
        }
    } catch(err) {
        if (!!vdnTotalSynthResponseSection) vdnTotalSynthResponseSection.style.display = 'none';
    }
}