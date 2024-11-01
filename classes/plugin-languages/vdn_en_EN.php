<?php
class vdn_en_EN {
    // Class constants
    const VDN_LANGUAGE_LIB = array(
        'basicConfig' => array(
            'basicConfiguration'  => 'Basic Configuration',
            'autoTimeoutDuration' => 'Auto timeout duration (in seconds) to end mic listening. Enter value between 8 - 20',
            'selectLanguage'      => 'Select Voice',  
            'dialogType'          => array(
                'genericDialog' => 'Generic Dialog', 
                'customDialog'  => 'Custom Dialog'
            ),
            'licenseKey'          =>  'License Key',
            'googleAnalytics' => 'Send user query and Simon/Simone response to your Google Analytics account.',
            'gaInfo' => array(
                'general' => 'You must have Google Analytics active account and tracking code snippet installed on your web page to be able to see conversation between user and Simon/Simone in your Google Analytics account.',
                'location' => 'Conversation log will appear in your Google Analytics account at'
            ),
            'nativeSearch'        => 'Disable AI search <i>(While search being made by pressing Enter key / Submit button / search button)</i>',
            'disableSearchMic'    => 'Disable mic on search fields',
            'disableFormsMic'     => 'Disable mic on forms',
            'userSearchableHints' => 'User Searchable Hints',
            'NoteSearchableHints' => array(
                'pleaseEnter'        => 'Please Enter',
                'semicolonSeparated' => '(Semicolon) separated list of statement as hints to the end user. A statement without ending with ', 
                'semicolonWillBe'    => '(Semicolon) will be considered as a only hint. One of these statements will appear randomly as a hint whenever a user clicks on the mic or move the mouse over the mic to make a user aware how he/she can use mic feature for voice search.'
            ),
            'saveSettings'        => 'Save Settings',
            'endpointURL'         => 'Endpoint URL',
            'copyYourLicenseKey'  => 'Copy your license key here. You can subscribe at speak2web.com/wp',
            'enterYourCustom'     => 'Enter your custom endpoint URL',
            'enterSeparated'      => "Enter ' ; ' separated list of searchable hints for user",
            'floatingMicOptions'  => 'Floating Mic Options',
            'selectFloatingMicPosition' => 'Floating Mic Position',
            'floatingButtonIconLabel' => 'Floating button icon',
            'gaErrorMessage' => "Your Google Analytics tracking ID format is invalid."
        ),

        'dialogConfig' => array(
            'dialogConfiguration'   => 'Dialog Configuration',
            'eachCheckbox'          => 'Each checkbox before dialog name will enable/disable that dialog for AI based search. Disabling will fire native search for it.',
            'aboutYourCompany'      => 'About your Company',
            'contactUs'             => 'Contact Us',
            'openingHours'          => 'Opening Hours',
            'blog'                  => 'Blog',
            'news'                  => 'News',
            'services'              => 'Services',
            'overview'              => 'Overview',
            'gallery'               => 'Gallery',
            'address'               => 'Address',
            'products'              => 'Products',
            'solutions'             => 'Solutions',
            'team'                  => 'Team',
            'plans'                 => 'Plans',
            'pricesCost'            => 'Prices / Cost',
            'whereToBuy'            => 'Where to buy',
            'myAccount'             => 'My Account', 
            'howToPay'              => 'How to Pay' , 
            'returns'               => 'Returns' ,
            'support'               => 'Support',
            'downloads'             => 'Downloads',
            'referencesCustomers'   => 'References / Customers',
            'videos'                => 'Videos',
            'productDocumentation'  => 'Product Documentation',
            'scheduleAppointment'   => 'Schedule Appointment',
            'requestDemo'           => 'Request Demo',
            'howDoesTtWork'         => 'How does it work',
            'pressCoverage'         => 'Press Coverage',
            'cancelMyAccount'       => 'Cancel My Account',
            'enterYourResponseHere' => 'Enter Your Response here',
            'urlInfo'               => array(
                'isPreconfigured' => 'is preconfigured generic URL for', 
                'dialog'          => ' dialog.', 
                'ifYouWantTo'     => 'If you want to provide different one then configure it in URL field below.'
            ),
            'uncheckingThisBox'    => 'Unchecking this box will let search to be native rather than AI',
            'dialogSaveButton'     => 'Configure ',
            'audioUnavailableText' => "<b>Note:</b> Audio response is not configured for this dialog. Change response text and click 'Configure' button to generate audio response."
            // 'notConfigure'      => 'You have not configured any dialog yet. You can configure '
        ),
        'other' =>  array(
            'notConfigureAnyDialog' => array(
                'notConfigure'      => 'You have not configured any dialog yet. You can configure ',
                'here'              => 'here ',
                'desiredResponse'   => 'the desired response to be played as audio and an URL which navigates user to the desired page.'
            ),
            'licenseKeyInvalid'  => array(
                'yourLicenseKeyInvalid' => 'Your license key is invalid or expired. Checkout our plans ',
                'here'                  => 'here',
                'toBuyOrRenew'          => 'to buy or renew your license. A valid license is must needed to avail plugin features.'
            ),
            'trialNotice' => array(
                'expired' => array(
                    'str1' => 'period has been',
                    'str2' => 'over',
                ),
                'underTrial' => array(
                    'str1' => 'period valid until',
                    'str2' => 'Day(s) to go'
                ),
                'lastDay' => array(
                    'str1' => 'expires',
                    'str2' => 'today'
                ),
                'common' => array(
                    'str1'        => 'Free trial',
                    'fullLicense' => 'to get the full license.',
                    'mailUs'      => 'or mail us at'
                )
            ),
            'common' => array(
                'str1' => 'Click',
                'str2' => 'here'
            ),
            'videoHelp' => ' to learn how to configure the plugin',
            'nonHttpsNotice' => "Not secure! You are on non-HTTPS site which restricts microphone access.",
            'synthesizingMessage' => "Please stand by while we convert your dialogs text into audio speech.",
            'synthesizingHeader' => "Synthesizing...",
            'audioRegenerateNotice' => array(
                'noticeText' => ' Generic dialogs missing audio speech.',
                'buttonText' => 'Click to generate speech'
            )
        ),
    );
}

