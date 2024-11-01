=== Voice Assistant Dialog Navigation ===
Contributors:      mspanwa2   
Tags:              voice assistant, voice forms, voice survey, virtual assistant, voice dialog, voice, voice navigation, AI, natural language processing, speech, api,  
Requires at least: 2.6  
Tested up to:      5.7.2  
Requires PHP:      5.3
Stable tag:        3.2.0 
License:           GPLv2 or later  
License URI:       http://www.gnu.org/licenses/gpl-2.0.html  


VOICE ENABLE YOUR WEB PAGE!
   * Add a virtual voice assistant to your web page. -- FREE for one month
   * Add voice forms and voice survey to web pages. 
   * Spoken audio response uses high-quality voices to provide consistent experience across devices and browsers.
This plugin will voice enable your entire web experience. 
The virtual assistant allows visitors to search the site using their voice.
The voice forms and voice survey allow users to use their voice to fill out forms and surveys rather than typing.
This plugin support all modern browsers and mobile devices.

== Description ==

This plugin adds voice to your web experience. The voice forms and voice survey feature allows users to dictated all input fields on your page.
The virtual voice assistant allows web page visitors to ask questions, get answers and use their voice to navigate the web page.
In combination this plugin will convert your wordpress web page into a an immersive voice experience. The voice interface is most useful for mobile users.
To customize the virtual AI voice assistant the web page builder can customize the response to a pre defined number of questions the AI understands. For example a user might 
want to know how to contact you. Rather than hunting for the "contact us" link on the web page the user can simply click the microphone 
symbol and ask for it. For example -- "How can I contact you." or "I would like to get in touch" --> the AI will understand the request,
respond verbally with the customized answer and change the page to the customized URL.

By installing this plugin web page builder can add virtual voice assistant - navigation and basic AI dialogs to the Word Press page within minutes.

The plugin utilizes the speak2web API service to access AI services. speak2web offers up to 500 API calls for free. 
In addition speak2web offers customized dialog options for web developers who want more than just the standard dialog. 
You can find more about all the available options on our web page.
Simply go to (https://speak2web.com/plugin#plan) and select your plan. 


== Supported Languages ==

At this time the virtual assistant supports the following languages 
    ** English 
    ** German 
The WordPress admin can switch the language on the plugin settings page.
Depending on the language selected all voice input and verbal responses will be processed in the language selected. 
Changing the language settings will require the WordPress admin to translate the response message configured on the settings page to match the language selected.
If the plugin is set to German, the response message must be entered in German as well.


== Installation ==

= Manual Installation =

1. Upload the entire `/voice-dialog-navigation` directory to the `/wp-content/plugins/` directory.
2. Activate Voice Search through the 'Plugins' menu in WordPress.
3. Sign up for a speak2web service plan to access the AI service required to run this plugin
4. Copy the license key you obtained with your subscription into the settings section of the voice dialog-navigation plugin
5. activate your license key --> this step will call the cloud backend to verify your license and provision cloud resources for your plugin to access the AI
6. Customize your dialogs responses
7. Visit your website and start searching using your voice.

Detailed instructions on how to install and convfigure the plugin can be found here:
[Support Web Page:] (https://speak2web.com/support/) 
[Installation Guide:] (https://speak2web.com/wp-content/uploads/2019/02/WordPress-Voice-Dialog-Navigation-Plugin-1.pdf) 
[How To Videos:] (https://speak2web.com/video/) 

== Screenshots ==
1. Voice added to page - floating mic symbole to the center right
2. Generic dialog configuration screen
3. Voice Input active - user is speaking
4. Config page for custom dialog 
5. Voice Assistant navigated to new page and plays audio response

== Frequently Asked Questions ==

= How do I get a license key =

You can select a plan that fits your budget right here [Plans] (https://speak2web.com/plugin/#plan)
Get started for free with our one month free offer or start with a "pay as you go" plan today.


= Why do I need an licensy key? =

The plugin uses enterprise class AI technology for natural language understanding, speech to text services and more. 
speak2web provides an API service that gives access to a sophisticated virtual assistant that can be used to voice enable your web page.
The first 500 calls per year are free. After that speak2web offers additional API calls for cents per call. 
You can see more details at the speak2web web page [Plugin Details] (https://speak2web.com/plugin/#plan)

= How does the plugin work =
The plugin enables you to have a real spoken dialog with your user. The plugin will add a microphone symbole to your search bar to enable voice input.
The plugin then processes the transcript of the voice input and generates verbal response and automatically navigates the page to the most appropriate 
portion of your word press page or exterenal URL.
You can check out this video for more info: 
[youtube https://youtu.be/VqiZ0XA5TFw]

= Do I need a security certificate for my web page? =

It is highly recommended to have a certificate and use a https  URL. Most web browsers do not allow microphone access unless the URL is secure.


== Example Usage ==
1. The microphone button added to the search form by the plugin.
2. You can see a couple of examples right here: [Videos] (https://speak2web.com/video/) 

=== CLOUD SERVICES USED / CLOUD APIs Called ===
This plugin accesses a number of cloud services to perform the voice dialog functionality. In general the API's accessed are either speak2web cloud services hosted in AWS or IBM Watson Cloud Services. 
The detailed privacy implications can be found below.

== Cloud Calls Issued by the Plugin ==
- During Install / Setup -
The first cloud call will take place when the license key is being entered and activated. This call will invoke a speak2web cloud service to validate the license key and provision cloud resources for the AI 
to be used.

- On loading of the plugin on a page -
Every time the plugin is loaded onto a page, a call is issued to the a speak2web service to retrieve a valid token to access IBM cloud services

- when a voice request is being issued -
When the user clicks the microphone to issue a voice command, additional cloud calls are being placed to IBM Watson Cloud STT to transcribe the recorded audio
To process the request the plugin will call a speak2web cloud service to process the natural language request and prepare a response.


=== COMPLIANCE WITH LOCAL LAWS ===
THE USER OF THIS PLUGIN AND THE ASSOCIATED SERVICE IS RESPONSIBLE TO ENSURE COMPLIANCE WITH APPLICABLE LAWS INCLUDING PRIVACY LAWS.
speak2web is making an effort to ensure privacy of the users of this service. As such, this plugin and the associated service DO NOT correlate IP Addresses or other personal data like browser history etc. to 
the transcript of the voice interaction. The speak2web does NOT store voice recordings, but we do retain anonymous transcript of the dialog in logs for a period of time.
More detail about the service utilized and the privacy statements related to these services can be found below.


=== Terms of Use and usage of 3rd Party Services ===
This plugin invokes a number of cloud services to perform the speech to text function (STT), analyses natural language  requests and perform a natural dialog.
The service are all provided through your speak2web subscription service. By using the speak2web voice dialog-navigation service you also agree to the terms of use and privacy terms of the 
following 3rd party services:

Amazon Web Services:
++++++++++++++++++++
speak2web is hosting its cloud services in AWS infrastructure. We are utilizing services such AWS Gateway API, AWS compute Services, AWS storage and AWS database services.
[AWS Services:]  (https://aws.amazon.com)
[The AWS privacy terms can be reviewed here:] (https://aws.amazon.com/privacy/)  

IBM WATSON Cloud Services:
++++++++++++++++++++++++++
speak2web is utilizing the following IBM Cloud Services as part of this plugin:
[IBM STT:] (https://www.ibm.com/watson/services/speech-to-text/) 
[IBM Assistant:] (https://www.ibm.com/cloud/watson-assistant/) 
[IBM Natural Language Understanding:] (https://www.ibm.com/watson/services/natural-language-understanding/) 

[The Terms of IBM Cloud Services]  (https://cloud.ibm.com/docs/overview/terms-of-use?topic=overview-terms#terms_details)  
[IBM Cloud Service Privacy Statement] (https://cloud.ibm.com/docs/overview/terms-of-use?topic=overview-terms#privacy_policy)  

speak2web Voice Dialog Navigation Service:
++++++++++++++++++++++++++++++++++++++++++
This plugin requires a subscription to the speak2web ["WP Voice Dialog Navigation Service"]  (https://speak2web.com/plugin/#plan)
The subscription give access to the speak2web voice service which is utilizing  the 3rd party services listed above.
By subscribing to this service the user agrees to the privacy terms of speak2web and the 3rd party services listed above.

VOICE RECORDING --- CANNOT BE PERSONALLY IDENTFIED:
+++++++++++++++++++++++++++++++++++++++++++++++++++
The cloud service does stream audio data to the IBM Watson STT service while the recording is active, but we DO NOT keep a copy of the audio recording. 
The transcript of the spoken request is being kept in logs for a period of time but CANNOT BE RELATED to the user it came from. The service DOES NOT track IP addressed or other
personally identifiable data. The transcript remains anonymous in the logs and CAN NOT be associated with the person it came from.

[speak2web terms of use] (https://speak2web.com/voice-dialog-service-terms/)
[speak2web privacy policy] (https://speak2web.com/privacy-policy/)


== Changelog ==

= 1.2.1 =
* Initial version

= 1.2.2 =
* Added Mute to stop replay of voice response
* Improved Loading Performance
* Improved handling of custom search fields

= 1.2.3 =
* Added Tool Tip Message to input field and mouse over event. The message displayed is randomly selected from configrued messages.
* Remove iOS support because of audio Issues
* Improve handling of multiple Microphone buttons on one page

= 1.2.4 =
* Added support for php 7.1 and above.
* Changed Mic access to wait requesting access to the microphone until user clicks on the microphone

= 1.2.5 =
* Added Feature to configure the AI voice as either Male or Female voice on browsers that support both 
* Added support for iOS Safari browsers and reactivate iOS support of the plugin
* Changed iOS behavior to first speak AI response and then redirect current page to result page rather than attempting a pop-up screen

= 1.2.6 =
* Added support for Google Analytics tracking
* Added support for native support engine
* Allow user to turn off unused intents
* Added configurable time out for recoring voice commands
* Bugfix for male / female voice detection

= 1.2.7 =
* Improved time out feature
* Improved custom dialog resposne
* Minor bug fix

= 1.2.8 =
* minor bugfix for Android OS

= 1.2.9 =
* minor bugfix for native search

= 2.0.0 =
* Major upgrade
* Plugin now works without a search bar on the page.
* 	New version will add a "Voice Assistant Window" to the page
*       New "voice Assistant Window" works like a chat window but with voice and built in navigation
* End of speech detection:
*      For most browsers the plugin will automatically detect the end of speech without the need to press the Mic symbol again to end the voice input
* Enhanced tracking and reporting feature
* Added Microphone annimation to attrack the users attention
* Enhanced support of native search

= 2.0.1 =
* Minor bugfix
*    Collapsed voice assistant was blocking links and button close to the mic symbol
*    minor CSS change addresses the issue

= 2.0.2 =
* Minor Improvements and Bug Fixes
*    Fixed CSS issues for overlapping windows
*    Added automatic trial license key activation -- 30 days free trial no longer requires user registration
*    Added WP console alerts

= 2.0.3 =
* Minor Improvements and Bug Fixes
*    Improved the Settings Page -> intents can be entered withtout clicking save after checking the intent checkmark box
*    Added UUID to plugin
*    Added link to useful video assets

= 2.1.0 =
* Major upgrade
*    Plugin will now support German Language Dialogs
*        this version of the plugin allows the web admin to switcht he Plugin to German or English.
*        If the language is selected as German, the plugin will use German language for transcribing the voice input and synthezise the response using
*        German language. The plugin expects the user to define the verbal response in German language. Also the conversational AI will analyse the input expecting German.
*        If the lanuage is set to English, STT, TTS are expecting English input and the dialog is also processing input as English language
*    Performance improvment 
*        Minimized scripts and assests to increase performance
*        Code optimization for additional performance improvement

= 2.2.0 =
* Major upgrade
*      Plugin now adds voice input to forms and surveys on the web page
*      With this improvement, this plugin will allow an entire voice driven experience on the web page. 
*      The plugin now supports:
*              Virtual Voice AI Assistant to assist with requests and navigate the web page
*              Voice Search
*              Voice forms and surveys
*      With this last improvement this plugin allows you to create entirely voice driven experience on the WEB page, great for mobile user experience
= 2.2.0 =
* Major upgrade
*      Plugin now adds voice input to forms and surveys on the web page
*      With this improvement, this plugin will allow an entire voice driven experience on the web page. 
*      The plugin now supports:
*              Virtual Voice AI Assistant to assist with requests and navigate the web page
*              Voice Search
*              Voice forms and surveys
*      With this last improvement this plugin allows you to create entirely voice driven experience on the WEB page, great for mobile user experience

= 2.2.1 =
* Temporary roll back of Voice Forms
*     Temporary rollback of voice forms

= 2.2.2 =
* Fixed sizing issue of voice input fields
* ReActivated the voice forms feature

= 2.2.3 =
* Fixed to address iOS 13 regression on Safari

= 2.2.4 =
* Fixed license activation issue
* Improved Chat Window Appearance 

= 2.2.5 =
* Improved recording for textare fields
* improved end of speech detection for long utterance
* New IBM Securty Model Adjustment

= 2.2.6 =
* Added British English support
* Change name from Simon to Simone for femal voice
* Tested on WP 5.3

= 2.2.7 =
* Improve behaivor for site with Handicap Plugins 
     * Fixed issue with high contrast CSS
     * Fixed issue with gray scale CSS 

= 2.3.0 =
* Allow floating mic and chat window to move into different locations on the page
     * Admin can select window locations from one of 6 pre-defined positions
* Fixed some formatting issues
     * Fixed issues with off center mic and disappearing mic

= 2.4.0 =
* Improved Integration with Google Analytics
     * Now supports multiple versions and implementation of Google Analytics tracking
* Made Voice Forms and Mic and search bar optional
     * To allow more flexible use of voice feature we added the ability to disable the Microphone in search bar and web forms
* Automatic Detection of default language setting
     * At time of installation the plugin will attempt to detect the language settings and default the that language. Language can be changed in the settings page

= 3.0.0 =
* Improved Voice Response
    * With this release the plugin uses a payed service to synthesize the response and stores the audio file on the server.
	* With this change in place the spoken response will play the same high-quality voice regardless of the device or browser used

= 3.0.1 =
* Bug Fix
     * Fixed formatting issues with Mic in Forms Fields
	
= 3.1.0 =
* Improved Speech to Text Recognition AI
* Fixed STT Issue with latest version of Microsoft Edge browser
* Missing Mic issue on text input fields

= 3.2.0 =
* Enhanced chat window to maintain dialog history
* Tested to WP version 5.7.2
