<?php
if ( !defined('ABSPATH') ) exit;

class voice_dialog_navigation_settings_page 
{
    // Constants for defining default intents
    const INTENT_LABEL_KEY           = 'intent_label';
    const INTENT_URL_PLACEHOLDER_KEY = 'intent_url_placeholder';
    const INTENT_OPTION_NAME_KEY     = 'option_name';
    const INTENT_KEY                 = 'intent';
    const DEFAULT_INTENTS_META_DATA  = array(
        array(
            self::INTENT_KEY                 => 'about',
            self::INTENT_LABEL_KEY           => VDN_LANGUAGE_LIBRARY['dialogConfig']['aboutYourCompany'], 
            self::INTENT_URL_PLACEHOLDER_KEY => '/about-us', 
            self::INTENT_OPTION_NAME_KEY     => 'vd_navigation_about_your_company',
        ),
        array(
            self::INTENT_KEY                 => 'contact',
            self::INTENT_LABEL_KEY           => VDN_LANGUAGE_LIBRARY['dialogConfig']['contactUs'],
            self::INTENT_URL_PLACEHOLDER_KEY => '/contact',
            self::INTENT_OPTION_NAME_KEY     => 'vd_navigation_contact_us',
        ),
        array(
            self::INTENT_KEY                 => 'hours',
            self::INTENT_LABEL_KEY           => VDN_LANGUAGE_LIBRARY['dialogConfig']['openingHours'], 
            self::INTENT_URL_PLACEHOLDER_KEY => '/contact',
            self::INTENT_OPTION_NAME_KEY     => 'vd_navigation_opening_hours',
        ),
        array(
            self::INTENT_KEY                 => 'blog',
            self::INTENT_LABEL_KEY           => VDN_LANGUAGE_LIBRARY['dialogConfig']['blog'], 
            self::INTENT_URL_PLACEHOLDER_KEY => '/blog',
            self::INTENT_OPTION_NAME_KEY     => 'vd_navigation_blog',
        ),
        array(
            self::INTENT_KEY                 => 'news',
            self::INTENT_LABEL_KEY           => VDN_LANGUAGE_LIBRARY['dialogConfig']['news'],
            self::INTENT_URL_PLACEHOLDER_KEY => '/news',
            self::INTENT_OPTION_NAME_KEY     => 'vd_navigation_news',
        ),
        array(
            self::INTENT_KEY                 => 'service',
            self::INTENT_LABEL_KEY           => VDN_LANGUAGE_LIBRARY['dialogConfig']['services'],
            self::INTENT_URL_PLACEHOLDER_KEY => '/service',
            self::INTENT_OPTION_NAME_KEY     => 'vd_navigation_services',
        ),
        array(
            self::INTENT_KEY                 => 'overview',
            self::INTENT_LABEL_KEY           => VDN_LANGUAGE_LIBRARY['dialogConfig']['overview'],
            self::INTENT_URL_PLACEHOLDER_KEY => '/',
            self::INTENT_OPTION_NAME_KEY     => 'vd_navigation_overview',
        ),
        array(
            self::INTENT_KEY                 => 'gallery',
            self::INTENT_LABEL_KEY           => VDN_LANGUAGE_LIBRARY['dialogConfig']['gallery'],
            self::INTENT_URL_PLACEHOLDER_KEY => '/gallery',
            self::INTENT_OPTION_NAME_KEY     => 'vd_navigation_gallery',

        ),
        array(
            self::INTENT_KEY                 => 'address',
            self::INTENT_LABEL_KEY           => VDN_LANGUAGE_LIBRARY['dialogConfig']['address'],
            self::INTENT_URL_PLACEHOLDER_KEY => '/contact',
            self::INTENT_OPTION_NAME_KEY     => 'vd_navigation_address',
        ),
        array(
            self::INTENT_KEY                 => 'products',
            self::INTENT_LABEL_KEY           => VDN_LANGUAGE_LIBRARY['dialogConfig']['products'], 
            self::INTENT_URL_PLACEHOLDER_KEY => '/products',
            self::INTENT_OPTION_NAME_KEY     => 'vd_navigation_products',
        ),
        array(
            self::INTENT_KEY                 => 'solutions',
            self::INTENT_LABEL_KEY           => VDN_LANGUAGE_LIBRARY['dialogConfig']['solutions'], 
            self::INTENT_URL_PLACEHOLDER_KEY => '/solutions',
            self::INTENT_OPTION_NAME_KEY     => 'vd_navigation_solutions',
        ),
        array(
            self::INTENT_KEY                 => 'team',
            self::INTENT_LABEL_KEY           => VDN_LANGUAGE_LIBRARY['dialogConfig']['team'],
            self::INTENT_URL_PLACEHOLDER_KEY => '/team',
            self::INTENT_OPTION_NAME_KEY     => 'vd_navigation_team',
        ),
        array(
            self::INTENT_KEY                 => 'plans',
            self::INTENT_LABEL_KEY           => VDN_LANGUAGE_LIBRARY['dialogConfig']['plans'], 
            self::INTENT_URL_PLACEHOLDER_KEY => '/plans',
            self::INTENT_OPTION_NAME_KEY     => 'vd_navigation_plans',
        ),
        array(
            self::INTENT_KEY                 => 'price',
            self::INTENT_LABEL_KEY           => VDN_LANGUAGE_LIBRARY['dialogConfig']['pricesCost'], 
            self::INTENT_URL_PLACEHOLDER_KEY => '/pricing',
            self::INTENT_OPTION_NAME_KEY     => 'vd_navigation_prices_cost',
        ),
        array(
            self::INTENT_KEY                 => 'reseller',
            self::INTENT_LABEL_KEY           => VDN_LANGUAGE_LIBRARY['dialogConfig']['whereToBuy'],
            self::INTENT_URL_PLACEHOLDER_KEY => '/partners',
            self::INTENT_OPTION_NAME_KEY     => 'vd_navigation_where_to_buy',
        ),
        array(
            self::INTENT_KEY                 => 'account',
            self::INTENT_LABEL_KEY           => VDN_LANGUAGE_LIBRARY['dialogConfig']['myAccount'],
            self::INTENT_URL_PLACEHOLDER_KEY => '/myAccount',
            self::INTENT_OPTION_NAME_KEY     => 'vd_navigation_my_account',
        ),
        array(
            self::INTENT_KEY                 => 'payment_options',
            self::INTENT_LABEL_KEY           => VDN_LANGUAGE_LIBRARY['dialogConfig']['howToPay'],
            self::INTENT_URL_PLACEHOLDER_KEY => '/terms',
            self::INTENT_OPTION_NAME_KEY     => 'vd_navigation_how_to_buy',
        ),
        array(
            self::INTENT_KEY                 => 'returns',
            self::INTENT_LABEL_KEY           => VDN_LANGUAGE_LIBRARY['dialogConfig']['returns'],
            self::INTENT_URL_PLACEHOLDER_KEY => '/terms',
            self::INTENT_OPTION_NAME_KEY     => 'vd_navigation_returns',
        ),
        array(
            self::INTENT_KEY                 => 'support',
            self::INTENT_LABEL_KEY           => VDN_LANGUAGE_LIBRARY['dialogConfig']['support'],
            self::INTENT_URL_PLACEHOLDER_KEY => '/support',
            self::INTENT_OPTION_NAME_KEY     => 'vd_navigation_support',
        ),
        array(
            self::INTENT_KEY                 => 'downloads',
            self::INTENT_LABEL_KEY           => VDN_LANGUAGE_LIBRARY['dialogConfig']['downloads'],
            self::INTENT_URL_PLACEHOLDER_KEY => '/downloads',
            self::INTENT_OPTION_NAME_KEY     => 'vd_navigation_downloads',
        ),
        array(
            self::INTENT_KEY                 => 'reference',
            self::INTENT_LABEL_KEY           => VDN_LANGUAGE_LIBRARY['dialogConfig']['referencesCustomers'],
            self::INTENT_URL_PLACEHOLDER_KEY => '/clients',
            self::INTENT_OPTION_NAME_KEY     => 'vd_navigation_references_customers',
        ),
        array(
            self::INTENT_KEY                 => 'videos',
            self::INTENT_LABEL_KEY           => VDN_LANGUAGE_LIBRARY['dialogConfig']['videos'],
            self::INTENT_URL_PLACEHOLDER_KEY => '/videos',
            self::INTENT_OPTION_NAME_KEY     => 'vd_navigation_videos',
        ),
        array(
            self::INTENT_KEY                 => 'docu',
            self::INTENT_LABEL_KEY           => VDN_LANGUAGE_LIBRARY['dialogConfig']['productDocumentation'],
            self::INTENT_URL_PLACEHOLDER_KEY => '/documentation',
            self::INTENT_OPTION_NAME_KEY     => 'vd_navigation_product_documentation',
        ),
        array(
            self::INTENT_KEY                 => 'appointment',
            self::INTENT_LABEL_KEY           => VDN_LANGUAGE_LIBRARY['dialogConfig']['scheduleAppointment'],
            self::INTENT_URL_PLACEHOLDER_KEY => '/schedule',
            self::INTENT_OPTION_NAME_KEY     => 'vd_navigation_schedule_appointment',
        ),
        array(
            self::INTENT_KEY                 => 'demo',
            self::INTENT_LABEL_KEY           => VDN_LANGUAGE_LIBRARY['dialogConfig']['requestDemo'],
            self::INTENT_URL_PLACEHOLDER_KEY => '/demo',
            self::INTENT_OPTION_NAME_KEY     => 'vd_navigation_request_demo',
        ),
        array(
            self::INTENT_KEY                 => 'how_it_works',
            self::INTENT_LABEL_KEY           => VDN_LANGUAGE_LIBRARY['dialogConfig']['howDoesTtWork'],
            self::INTENT_URL_PLACEHOLDER_KEY => '/overview',
            self::INTENT_OPTION_NAME_KEY     => 'vd_navigation_how_does_it_work',
        ),
        array(
            self::INTENT_KEY                 => 'press',
            self::INTENT_LABEL_KEY           => VDN_LANGUAGE_LIBRARY['dialogConfig']['pressCoverage'],
            self::INTENT_URL_PLACEHOLDER_KEY => '/press',
            self::INTENT_OPTION_NAME_KEY     => 'vd_navigation_press',
        ),
        array(
            self::INTENT_KEY                 => 'cancel',
            self::INTENT_LABEL_KEY           => VDN_LANGUAGE_LIBRARY['dialogConfig']['cancelMyAccount'],
            self::INTENT_URL_PLACEHOLDER_KEY => '/support',
            self::INTENT_OPTION_NAME_KEY     => 'vd_navigation_cancel_my_account',
        ),
    );

    const INTENT_RESPONSE_PLACEHOLDER_TEXT = VDN_LANGUAGE_LIBRARY['dialogConfig']['enterYourResponseHere'];
    const INTENT_URL_LABEL_TEXT = 'URL';
    
    // Holds the values to be used in the fields callbacks
    const BASIC_CONFIG_OPTION_NAMES = array(
        /*'subscription'    => 'vd_navigation_dialog_subscription',*/
        'license_key'            => 'vd_navigation_license_key',
        'dialog_type'            => 'vd_navigation_dialog_type',
        'custom_endpoint'        => 'vd_navigation_custom_endpoint',
        'type_of_search'         => 'vd_navigation_type_of_search',
        'disable_search_mic'     => 'vd_navigation_disable_search_mic',
        'disable_forms_mic'      => 'vd_navigation_disable_forms_mic',
        'searchable_hints'       => 'vd_navigation_searchable_hints',
        'google_analytics_track' => 'vd_navigation_google_analytics_track',
        'ga_tracking_id'         => 'vd_navigation_ga_tracking_id',
        'mic_listening_timeout'  => 'vd_navigation_mic_listening_timeout',
        'voice'                  => 'vd_navigation_voice',
        'floating_mic_position'  => 'vd_navigation_floating_mic_position',
        'floating_button_icon'   => 'vd_navigation_floating_button_icon'
    );

    const DEFAULT_SEARCHABLE_HINTS = 'Ask about our company;Ask for opening hours;';

    private $vd_navigation_dialog_subscription    = false;
    private $vd_navigation_license_key            = '';
    private $vd_navigation_dialog_type            = 'generic';
    private $vd_navigation_custom_endpoint        = '';
    private $vd_navigation_type_of_search         = 'ai';
    private $vd_navigation_disable_search_mic     = '0';
    private $vd_navigation_disable_forms_mic      = '0';
    private $vd_navigation_searchable_hints       = '';
    private $vd_navigation_google_analytics_track = null;
    private $vd_navigation_ga_tracking_id         = '';
    private $vd_navigation_mic_listening_timeout  = null;
    private $vd_navigation_uuid                   = null;
    private $vd_navigation_voice                  = 'male_en_US';
    private $vd_navigation_floating_mic_position  = 'Middle Right';
    private $vd_navigation_floating_button_icon   = 'micIcon';

    public static $vd_navigation_intent_name_map = array();
    
    // ##################################################################################################################################
    // Static property to hold all the intents DB option names which needs to regenerate audios (Specifically at plugin activation time)
    // ##################################################################################################################################
    public static $vd_navigation_regenerate_audio_for_intents = array();
    
    // #####################################################################################################################################
    // Static property to hold all the intents DB option names which having audio files (Not deleted and having path to file or file exist)
    // #####################################################################################################################################
    public static $vd_navigation_intents_with_audios = array();

    /**
     * Start up
     */
    public function __construct()
    {
        add_action( 'admin_menu', array( $this, 'vd_navigation_add_plugin_page' ) );
        add_action( 'admin_init', array( $this, 'vd_navigation_page_init' ) );

        //### THIS FILTERS HOOK INTO A PROCESS BEFORE OPTION GETTING STORED TO DB
        // Register filters for basic config options
        foreach (self::BASIC_CONFIG_OPTION_NAMES as $key => $option) {
            add_filter( 'pre_update_option_'.$option, array($this, 'vdn_pre_update_basic_config'), 10, 3 );
        }
        
        // Register filters for dialog config options
        foreach (self::DEFAULT_INTENTS_META_DATA as $index => $intent) {
            add_filter( 'pre_update_option_'.$intent[self::INTENT_OPTION_NAME_KEY], array($this, 'vdn_pre_update_intent_box'), 10, 3 );
            self::$vd_navigation_intent_name_map[$intent[self::INTENT_OPTION_NAME_KEY]] = $intent[self::INTENT_KEY];
        }

        //### THIS ACTIONS GETS FIRED AFTER STORING DATA TO DB
        // Register actions for basic config options
        add_action( 'add_option_'.self::BASIC_CONFIG_OPTION_NAMES['license_key'], array( $this, 'vdn_post_adding_license_key'), 10, 2 );
        add_action( 'update_option_'.self::BASIC_CONFIG_OPTION_NAMES['license_key'], array( $this, 'vdn_post_update_license_key'), 10, 2 );
    }

    /**
     * Static method to get timestamp from and set timestamp to DB (Timestamp of setting option update)
     *
     * @param $action - string : 'get' or 'set'
     * 
     * $returns vdn_modified_timestamp - string : Time as a Unix timestamp
     */
    public static function vdn_settings_modified_timestamp($action = null)
    {
        $vdn_modified_timestamp = null;

        try {
            if (empty($action)) return $vdn_modified_timestamp;

            if ($action == 'get') {
                $vdn_modified_timestamp = get_option('vd_navigation_settings_updated_timestamp', null);
            } else if ($action == 'set') {
                $vdn_timestamp = time();
                update_option('vd_navigation_settings_updated_timestamp', $vdn_timestamp);
                $vdn_modified_timestamp = $vdn_timestamp;
            }
        } catch (\Exception $ex) {
            $vdn_modified_timestamp = null;
        }

        return $vdn_modified_timestamp;
    }

    /**
     * Method as callback to handle basic config options data before storing to DB
     *
     * @param $old_value - string : Existing Option value from database
     * @param $new_value - string : New Option value to be stored in database
     * @param $option_name - string : Name of the option
     */
    public function vdn_pre_update_basic_config($new_value, $old_value, $option_name) {
        /**
         * Comparing two string values to check if option data modified.
         *
         * Preserve settings updated timestamp 
         */
        if ($old_value != $new_value && get_transient( 'vdn_basic_config_option_updated' ) === false) {
            set_transient( 'vdn_basic_config_option_updated', 1, 5 );
            $vdn_setting_update_ts = self::vdn_settings_modified_timestamp('set');
            unset($vdn_setting_update_ts);
        }

        return $new_value;
    }

    /**
     * Method as callback to handle dialog config options before storing to DB
     *
     * @param $old_value - string : Option value before update
     * @param $new_value - string : Updated Option value
     * @param $option_name - string : Name of the option
     */
    public function vdn_pre_update_intent_box($new_value, $old_value, $option_name)
    {
        /**
         * When $old_value is completely blank/empty it denotes the intent is being stored to DB first time.
         * $old_value later on never becomes completely empty.
         *
         * We are considering completely empty fact to use this filter to serve first time adding option scenario for generating audio for this intent.
         */
        $vdn_intent_adding_first_time = empty($old_value) ? true : false;

        $intent_new_data = is_array($new_value) ? $new_value : (array) $new_value;
        $intent_new_data['intent_name'] = self::$vd_navigation_intent_name_map[$option_name];
        $intent_old_data = is_array($old_value) ? $old_value : (array) $old_value;
        
        if (!array_key_exists('enabled', $intent_new_data)) {
            $new_value['enabled'] = '';
        } else if (trim($intent_new_data['enabled']) != 'enabled') {
            $new_value['enabled'] = '';
        }

        /**
         * Comparing two arrays to check if option data modified
         *
         * Preserve settings updated timestamp 
         */
        if ($old_value != $new_value) {
            $vdn_setting_update_ts = self::vdn_settings_modified_timestamp('set');
            unset($vdn_setting_update_ts);
        }

        return $new_value;
    }

    /**
     * Method as callback post to license key option creation in DB
     *
     * @param $option_name - string : Option name
     * @param $option_value - string : Option value
     */
    public function vdn_post_adding_license_key( $option_name, $option_value)
    {
        try {
            Voice_Dialog_Navigation_Plugin::vdn_get_api_key_from_license_key(trim($option_value), true);
        } catch (\Exception $ex) {
            // Do nothing for now
        }
    }

    /**
     * Method as callback post to license key option update in DB
     *
     * @param $old_value - string : Option value before update
     * @param $new_value - string : Updated Option value
     */
    public function vdn_post_update_license_key( $old_value, $new_value)
    {
        try {
            $option_value = strip_tags(stripslashes($new_value));

            if ($old_value != trim($option_value)) {
                Voice_Dialog_Navigation_Plugin::vdn_get_api_key_from_license_key(trim($option_value), true);
            }
        } catch (\Exception $ex) {
            // Do nothing for now
        }
    }

    /**
     * Add options page
     */
    public function vd_navigation_add_plugin_page()
    {
        // This page will be under "Settings"
        add_submenu_page(
            'options-general.php',// Parent menu as 'settings'
            'Voice Dialog – Navigation',
            'Voice Dialog – Navigation',
            'manage_options',
            'vd-navigation-settings',// Slug for page
            array( $this, 'vd_navigation_settings_create_page')// View 
        );
    }

    /**
     * Options/Settings page callback to create view/html of settings page
     */
    public function vd_navigation_settings_create_page()
    {
        // For dialog subscription
        /*$this->vd_navigation_dialog_subscription = strip_tags(stripslashes(get_option( 
            self::BASIC_CONFIG_OPTION_NAMES['subscription'], false)));
        $this->vd_navigation_dialog_subscription = ($this->vd_navigation_dialog_subscription == 1 
            || $this->vd_navigation_dialog_subscription == true 
            || $this->vd_navigation_dialog_subscription == 'on') ? true : false; */

        // For license key
        $this->vd_navigation_license_key = strip_tags(stripslashes(get_option( self::BASIC_CONFIG_OPTION_NAMES['license_key'], '')));
        $this->vd_navigation_license_key = !empty($this->vd_navigation_license_key) ? $this->vd_navigation_license_key : '';

        if (empty($this->vd_navigation_license_key)) { update_option('vd_navigation_api_system_key', ''); }

        // For dialog type
        $this->vd_navigation_dialog_type = strip_tags(stripslashes(get_option( self::BASIC_CONFIG_OPTION_NAMES['dialog_type'], 'generic')));
        
        // For custom endpoint
        $this->vd_navigation_custom_endpoint = strip_tags(get_option( self::BASIC_CONFIG_OPTION_NAMES['custom_endpoint'], ''));
        $this->vd_navigation_custom_endpoint = !empty($this->vd_navigation_custom_endpoint) ? trim($this->vd_navigation_custom_endpoint) : null;

        // For type of search
        $this->vd_navigation_type_of_search = strip_tags(stripslashes(get_option(self::BASIC_CONFIG_OPTION_NAMES['type_of_search'], '')));

        if (empty($this->vd_navigation_type_of_search)) { 
            update_option(self::BASIC_CONFIG_OPTION_NAMES['type_of_search'], 'ai');
            $this->vd_navigation_type_of_search = 'ai';
        }

        // For disabling search field mic and forms mic
        $this->vd_navigation_disable_search_mic = strip_tags(stripslashes(get_option(self::BASIC_CONFIG_OPTION_NAMES['disable_search_mic'], '0')));
        $this->vd_navigation_disable_forms_mic  = strip_tags(stripslashes(get_option(self::BASIC_CONFIG_OPTION_NAMES['disable_forms_mic'], '0')));

        // For searchable hints
        $this->vd_navigation_searchable_hints = strip_tags(
            stripslashes(
                get_option(self::BASIC_CONFIG_OPTION_NAMES['searchable_hints'], '')
            )
        );

        // if searchable hints are or left blank then always store default examples
        if (empty($this->vd_navigation_searchable_hints)) {
            update_option(self::BASIC_CONFIG_OPTION_NAMES['searchable_hints'], self::DEFAULT_SEARCHABLE_HINTS);
            $this->vd_navigation_searchable_hints = strip_tags(stripslashes(get_option(self::BASIC_CONFIG_OPTION_NAMES['searchable_hints'], '')));
        }

        // For Google Analytics Track
        $this->vd_navigation_google_analytics_track = strip_tags(stripslashes(get_option( 
            self::BASIC_CONFIG_OPTION_NAMES['google_analytics_track'], null)));

        // For Google Analytics Tracking id
        $this->vd_navigation_ga_tracking_id = strip_tags(stripslashes(get_option( self::BASIC_CONFIG_OPTION_NAMES['ga_tracking_id'], '')));
        $this->vd_navigation_ga_tracking_id = !empty($this->vd_navigation_ga_tracking_id) ? $this->vd_navigation_ga_tracking_id : '';

        // For Mic listening auto timeout
        $this->vd_navigation_mic_listening_timeout = strip_tags(stripslashes(get_option( 
            self::BASIC_CONFIG_OPTION_NAMES['mic_listening_timeout'], null)));

        // if voice type is blank then always store voice type as male
        if (empty($this->vd_navigation_mic_listening_timeout) || $this->vd_navigation_mic_listening_timeout < 8) {
            update_option(self::BASIC_CONFIG_OPTION_NAMES['mic_listening_timeout'], 8);
            $this->vd_navigation_mic_listening_timeout = 8;
        } elseif ($this->vd_navigation_mic_listening_timeout > 20) {
            update_option(self::BASIC_CONFIG_OPTION_NAMES['mic_listening_timeout'], 20);
            $this->vd_navigation_mic_listening_timeout = 20;
        }

        // Get UUID of trial license
        $this->vd_navigation_uuid = get_option('vd_navigation_uuid', null); 
        $this->vd_navigation_uuid = empty($this->vd_navigation_uuid) ? null : trim($this->vd_navigation_uuid);

        // For voice and language
        $this->vd_navigation_voice = strip_tags(stripslashes(get_option( 
            self::BASIC_CONFIG_OPTION_NAMES['voice'], null)));

        // if voice and language is blank then always store voice as male Us english
        if (empty($this->vd_navigation_voice)) {
            update_option(self::BASIC_CONFIG_OPTION_NAMES['voice'], 'male_en_US');
            $this->vd_navigation_voice = strip_tags(stripslashes(get_option(self::BASIC_CONFIG_OPTION_NAMES['voice'], 'male_en_US')));
        }

        // For Mic Position
        $this->vd_navigation_floating_mic_position = strip_tags(stripslashes(get_option( 
            self::BASIC_CONFIG_OPTION_NAMES['floating_mic_position'], 'Middle Right')));

        // For Floating button icon
        $this->vd_navigation_floating_button_icon = strip_tags(stripslashes(get_option( 
            self::BASIC_CONFIG_OPTION_NAMES['floating_button_icon'], 'micIcon')));

        $vdn_temp_intents_data = Voice_Dialog_Navigation_Plugin::get_configured_intents_from_DB();
        self::$vd_navigation_regenerate_audio_for_intents = array_key_exists('intents_for_audio_regeneration', $vdn_temp_intents_data) ? $vdn_temp_intents_data['intents_for_audio_regeneration'] : array();

        self::$vd_navigation_intents_with_audios = array_key_exists('intents_with_audios', $vdn_temp_intents_data) ? $vdn_temp_intents_data['intents_with_audios'] : array();

?>
        <div class="wrap">
            <div id="vdNavigationSettingsWrapper">
                <div id="vdNavigationSettingsHeader" class="vd-navigation-row">
                    <div class="vd-navigation-setting-header-column-1"><br>
                        <span id="vdNavigationSettingsPageHeading">Voice Dialog and Navigation Setup |</span>
                        <span id="vdNavigationSettingsPageSubHeading">speak2web AI Dialog</span>
                    </div>
                    <div class="vd-navigation-setting-header-column-2">
                        <a title="Wordpress Plugin - speak2web" target="blank" href="https://speak2web.com/plugin/">
                            <img id="vdNavigationSettingsPageHeaderLogo" 
                            src="<?php echo dirname(plugin_dir_url(__FILE__)).'/images/speak2web_white_logo.svg'?>">
                        </a>
                    </div>
                </div>
                <div class="vdn-configuration-header"><h4 id="vdnBasicConfigHeader"><span><?php echo VDN_LANGUAGE_LIBRARY['basicConfig']['basicConfiguration']; ?></span></h4></div>
                <form id="vdNavigationBasicConfigForm" method="post" action="options.php" onsubmit="vdnBasicFormSubmitHandler(this, event)">
                    <?php
                        // This prints out all hidden setting fields
                        settings_fields( 'vd-navigation-basic-config-settings-group' );
                        do_settings_sections( 'vd-navigation-settings' );

                        // To display errors
                        settings_errors('vd-navigation-settings', true, true);
                    ?>
                    <div id="vdNavigationBasicConfigSection" class='vd-navigation-row vd-navigation-card'>
                        <div class="vd-navigation-setting-basic-config-column">
                            <div id='vdnVideoHelp' class="vd-navigation-basic-config-sub-row">
                                <span id='vdnHashTag'> #timeforvoice</span>
                                <span class="vd-navigation-help" title="https://speak2web.com/video"><?php echo VDN_LANGUAGE_LIBRARY['other']['common']['str1'];?> <a target='blank' href='https://speak2web.com/video'><?php echo VDN_LANGUAGE_LIBRARY['other']['common']['str2'];?></a> <?php echo VDN_LANGUAGE_LIBRARY['other']['videoHelp'];?></span>
                            </div>

                            <div class="vd-navigation-basic-config-sub-row">
                                <div id="vdnVoiceAndLanguage"><?php echo VDN_LANGUAGE_LIBRARY['basicConfig']['selectLanguage']; ?>
                                    <select
                                        data-do-synthesize="false"
                                        data-synth-decider="voice"
                                        data-old-value="<?php echo $this->vd_navigation_voice;?>" 
                                        name="<?php echo self:: BASIC_CONFIG_OPTION_NAMES['voice']; ?>"
                                        onchange="vdnVoiceChange(this)">
                                        <option value="male_en_US" <?php selected('male_en_US', $this->vd_navigation_voice);?>>
                                            Male English (United States)
                                        </option>
                                        <option value="female_en_US" <?php selected('female_en_US', $this->vd_navigation_voice);?>>
                                            Female English (United States)
                                        </option>
                                        <option value="female_en_GB" <?php selected('female_en_GB', $this->vd_navigation_voice);?>>
                                            Female English (United Kingdom)
                                        </option>
                                        <option value="male_de_DE" <?php selected('male_de_DE', $this->vd_navigation_voice);?>>
                                            Male German
                                        </option>
                                        <option value="female_de_DE" <?php selected('female_de_DE', $this->vd_navigation_voice);?>>
                                            Female German
                                        </option>
                                    </select>
                                </div>                            
                            </div>

                            <div class="vd-navigation-basic-config-sub-row">
                                <div class='vd-navigation-basic-config-dialog-type-column-1'>
                                    <label for="vdnGenericDialog">
                                        <input 
                                        id="vdnGenericDialog"
                                        type='radio' 
                                        name="<?php echo self::BASIC_CONFIG_OPTION_NAMES['dialog_type']; ?>" 
                                        value="generic" <?php checked('generic', $this->vd_navigation_dialog_type);?> 
                                        onchange="toggleVdnDialogType('generic')"
                                        ><?php echo VDN_LANGUAGE_LIBRARY['basicConfig']['dialogType']['genericDialog']; ?>

                                    </label>
                                </div>
                                <div class='vd-navigation-basic-config-dialog-type-column-2'>
                                    <label for="vdnCustomDialog">
                                        <input 
                                        id="vdnCustomDialog"
                                        type='radio' 
                                        name="<?php echo self::BASIC_CONFIG_OPTION_NAMES['dialog_type']; ?>" 
                                        value="custom" <?php checked('custom', $this->vd_navigation_dialog_type);?> 
                                        onchange="toggleVdnDialogType('custom')"
                                        ><?php echo VDN_LANGUAGE_LIBRARY['basicConfig']['dialogType']['customDialog']; ?>

                                    </label>
                                </div>
                            </div>

                            <?php if (Voice_Dialog_Navigation_Plugin::$vdn_trial_active === true) { ?>
                            <div class="vd-navigation-basic-config-sub-row">
                                <div id="vdNavigationFreeTrialInfoWrapper">
                                    <?php if (!empty($this->vd_navigation_uuid)) { ?>
                                        <label>
                                            <span id="vdnUuidLabel"> UUID:</span> <?php echo $this->vd_navigation_uuid;?>
                                        </label>
                                    <?php } ?>
                                    
                                    <div class="vd-navigation-free-trial-info"><?php echo Voice_Dialog_Navigation_Plugin::$vdn_trial_notice_msg_ctx;?></div>
                                </div>
                            </div>
                            <?php } ?>

                            <div class="vd-navigation-basic-config-sub-row">
                                <div class="vd-navigation-basic-config-attached-label-column"><?php echo VDN_LANGUAGE_LIBRARY['basicConfig']['licenseKey']; ?></div>
                                <div class="vd-navigation-basic-config-attached-input-column">
                                    <input 
                                    type="text" 
                                    name="<?php echo self::BASIC_CONFIG_OPTION_NAMES['license_key']; ?>" 
                                    id="vdNavigationLicenseKey" 
                                    placeholder="<?php echo VDN_LANGUAGE_LIBRARY['basicConfig']['copyYourLicenseKey']; ?>" 
                                    value="<?php echo $this->vd_navigation_license_key; ?>"/>
                                </div>
                            </div>
                            <div id="vdNavigationCustomEndpointRow" class="vd-navigation-basic-config-sub-row 
                            <?php echo $this->vd_navigation_dialog_type == 'generic' ? 'vd-navigation-hide' : ''; ?>">
                                <div class="vd-navigation-basic-config-attached-label-column"><?php echo VDN_LANGUAGE_LIBRARY['basicConfig']['endpointURL']; ?></div>
                                <div class="vd-navigation-basic-config-attached-input-column">
                                    <input 
                                    type="text" 
                                    name="<?php echo self::BASIC_CONFIG_OPTION_NAMES['custom_endpoint']; ?>" 
                                    id="vdNavigationCustomEndpoint" placeholder="<?php echo VDN_LANGUAGE_LIBRARY['basicConfig']['enterYourCustom']; ?>" 
                                    value="<?php echo $this->vd_navigation_custom_endpoint; ?>"/>
                                </div>
                            </div>
                            <div class="vd-navigation-basic-config-sub-row">
                                <label for="vdnNativeSearch">
                                    <input 
                                    id="vdnNativeSearch"
                                    type='checkbox' 
                                    name="<?php echo self::BASIC_CONFIG_OPTION_NAMES['type_of_search']; ?>" 
                                    value="native" <?php checked('native', $this->vd_navigation_type_of_search);?> 
                                    > <?php echo VDN_LANGUAGE_LIBRARY['basicConfig']['nativeSearch']; ?>
                                </label>
                            </div>
                            <div class="vd-navigation-basic-config-sub-row">
                                <label for="vdnDisableSearchMic">
                                    <input 
                                    id="vdnDisableSearchMic"
                                    type='checkbox' 
                                    name="<?php echo self::BASIC_CONFIG_OPTION_NAMES['disable_search_mic']; ?>" 
                                    value="1" <?php checked('1', $this->vd_navigation_disable_search_mic);?>
                                    > <?php echo VDN_LANGUAGE_LIBRARY['basicConfig']['disableSearchMic']; ?>
                                </label>
                            </div>
                            <div class="vd-navigation-basic-config-sub-row">
                                <label for="vdnDisableFormMic">
                                    <input 
                                    id="vdnDisableFormMic"
                                    type='checkbox' 
                                    name="<?php echo self::BASIC_CONFIG_OPTION_NAMES['disable_forms_mic']; ?>" 
                                    value="1" <?php checked('1', $this->vd_navigation_disable_forms_mic);?>
                                    > <?php echo VDN_LANGUAGE_LIBRARY['basicConfig']['disableFormsMic']; ?>
                                </label>
                            </div>
                            <div class="vd-navigation-basic-config-sub-row">
                                <span class="vdn-autotimeout-label"></span>
                                <?php echo VDN_LANGUAGE_LIBRARY['basicConfig']['autoTimeoutDuration']; ?>
                                <input 
                                    type='number' 
                                    name="<?php echo self::BASIC_CONFIG_OPTION_NAMES['mic_listening_timeout']; ?>" 
                                    min="8"
                                    max="20"
                                    step="1"
                                    onKeyup="vdnResetTimeoutDefaultValue(this, event)"
                                    onKeydown="vdnValidateTimeoutValue(this, event)"
                                    value="<?php echo $this->vd_navigation_mic_listening_timeout; ?>"/> 
                            </div>
                            <div class="vd-navigation-basic-config-sub-row"> 
                                <div class="vdn-dotted-border">
                                    <b> Google Analytics</b><br>
                                    <label for="vdnGoogleAnalytics">
                                        <input 
                                        id="vdnGoogleAnalytics"
                                        type='checkbox' 
                                        onchange="vdnToggleGaTrackingIdField(this)"
                                        name="<?php echo self::BASIC_CONFIG_OPTION_NAMES['google_analytics_track']; ?>" 
                                        value="yes" <?php checked('yes', $this->vd_navigation_google_analytics_track);?> 
                                        > <?php echo VDN_LANGUAGE_LIBRARY['basicConfig']['googleAnalytics']; ?> 
                                    </label>
                                        <br><br>
                                        <span><span class="vdn-important">*</span> <i>
                                            <?php echo VDN_LANGUAGE_LIBRARY['basicConfig']['gaInfo']['general']; ?>
                                            <br><br>
                                            <span class="vdn-important">*</span>
                                            <?php echo VDN_LANGUAGE_LIBRARY['basicConfig']['gaInfo']['location']; ?>:</i>
                                            <br>
                                            'Real-Time > Events' section or 'Behaviour > Events > Overview' section.
                                        </span>
                                    <br>
                                    <div id="vdnGaTrackingIdWrapper" class="<?php echo $this->vd_navigation_google_analytics_track !== 'yes' ? 'vdn-hide-element' : ''?>">
                                        Google Analytics Tracking ID (eg: UA-XXXXXXXX):<br>
                                        <input 
                                            oninput="vdnGaIdChange(this)"
                                            data-error="0"
                                            type="text" 
                                            name="<?php echo self::BASIC_CONFIG_OPTION_NAMES['ga_tracking_id']; ?>" 
                                            id="vdnGaTrackingId" 
                                            placeholder="Please enter your tracking ID" 
                                            value="<?php echo $this->vd_navigation_ga_tracking_id; ?>"/>
                                        <br><span id='vdnGaIdError'><?php echo VDN_LANGUAGE_LIBRARY['basicConfig']['gaErrorMessage']; ?></span>
                                    </div>
                                </div>
                            </div>
                            <div class="vd-navigation-basic-config-sub-row">
                                <div class='vdn-dotted-border'>
                                    <label for="<?php echo self::BASIC_CONFIG_OPTION_NAMES['searchable_hints']; ?>">
                                        <b><?php echo VDN_LANGUAGE_LIBRARY['basicConfig']['userSearchableHints']; ?></b>
                                    </label><br>
                                    <span>
                                        <span class="vdn-important">*</span><i>
                                        <span><?php echo VDN_LANGUAGE_LIBRARY['basicConfig']['NoteSearchableHints']['pleaseEnter']; ?> ' <b class='vdn-url-info-denoter'>;</b> ' <?php echo VDN_LANGUAGE_LIBRARY['basicConfig']['NoteSearchableHints']['semicolonSeparated']; ?> <b class='vdn-url-info-denoter'>' ; ' </b> <?php echo VDN_LANGUAGE_LIBRARY['basicConfig']['NoteSearchableHints']['semicolonWillBe']; ?></span></i> 
                                    </span>
                                    <br><br>
                                    <textarea 
                                    name="<?php echo self::BASIC_CONFIG_OPTION_NAMES['searchable_hints']; ?>" 
                                    placeholder="<?php echo VDN_LANGUAGE_LIBRARY['basicConfig']['enterSeparated']; ?>"
                                    /><?php echo $this->vd_navigation_searchable_hints; ?></textarea>
                                </div>
                            </div>
                            <div class="vd-navigation-basic-config-sub-row">
                                <div class="vdn-dotted-border">
                                    <label for="<?php echo self::BASIC_CONFIG_OPTION_NAMES['floating_mic_position']; ?>">
                                        <b><?php echo VDN_LANGUAGE_LIBRARY['basicConfig']['floatingMicOptions']; ?></b>
                                    </label>
                                    <br>
                                    <div>
                                        <?php echo VDN_LANGUAGE_LIBRARY['basicConfig']['selectFloatingMicPosition']; ?>:
                                        <select id="vdnFloatingMicPosition" name="<?php echo self:: BASIC_CONFIG_OPTION_NAMES['floating_mic_position']; ?>">
                                            <option value="Middle Right" <?php selected('Middle Right', $this->vd_navigation_floating_mic_position);?>>Middle Right</option>
                                            <option value="Middle Left" <?php selected('Middle Left', $this->vd_navigation_floating_mic_position);?>>Middle Left</option>
                                            <option value="Top Right" <?php selected('Top Right', $this->vd_navigation_floating_mic_position);?>>Top Right</option>
                                            <option value="Top Left" <?php selected('Top Left', $this->vd_navigation_floating_mic_position);?>>Top Left</option>
                                            <option value="Bottom Right" <?php selected('Bottom Right', $this->vd_navigation_floating_mic_position);?>>Bottom Right</option>
                                            <option value="Bottom Left" <?php selected('Bottom Left', $this->vd_navigation_floating_mic_position);?>>Bottom Left</option>
                                        </select>
                                    </div>

                                    <div id="vdnFloatingButtonIcon">
                                        <?php echo VDN_LANGUAGE_LIBRARY['basicConfig']['floatingButtonIconLabel'];?>:<br>
                                        <label for="vdnMicIcon">
                                            <input 
                                            type="radio" 
                                            name="<?php echo self::BASIC_CONFIG_OPTION_NAMES['floating_button_icon']; ?>"
                                            id="vdnMicIcon"
                                            value="micIcon" 
                                            <?php checked('micIcon', $this->vd_navigation_floating_button_icon);?>
                                            >
                                            <img src="<?php echo dirname(plugin_dir_url(__FILE__)).'/images/vdn-floating-mic-icon.png'?>">
                                        </label>
                                        <label for="vdnRobotIcon">
                                            <input 
                                            type="radio" 
                                            name="<?php echo self::BASIC_CONFIG_OPTION_NAMES['floating_button_icon']; ?>" 
                                            id="vdnRobotIcon"
                                            value="robotIcon" 
                                            <?php checked('robotIcon', $this->vd_navigation_floating_button_icon);?>>
                                            <img src="<?php echo dirname(plugin_dir_url(__FILE__)).'/images/vdn-floating-robot-icon.png'?>">
                                        </label>
                                    </div>
                                </div>
                            </div>
                            <div class="vd-navigation-basic-config-sub-row">
                                <?php 
                                    $other_attributes = array( 'id' => 'vdNavigationBasicConfigSettingsSave' );
                                    submit_button( VDN_LANGUAGE_LIBRARY['basicConfig']['saveSettings'], 'primary', 'vd-navigation-basic-config-settings-save', false, $other_attributes);
                                ?>
                            </div>
                        </div>
                    </div>
                </form>

                <!-- Dialog Configuration Section -->
                <div
                    id="vdNavigationDialogConfigFormSection" 
                    class="<?php echo $this->vd_navigation_dialog_type == 'custom' ? 'vd-navigation-hide' : ''; ?>"
                    data-intents-with-audios=<?php echo json_encode(self::$vd_navigation_intents_with_audios);?>
                    data-intents-for-audio-regeneration=<?php echo json_encode(self::$vd_navigation_regenerate_audio_for_intents);?>
                    >
                    <div class="vdn-configuration-header" id="vdNavigationDialogConfigSectionTitle" colspan="2">
                        <h4><span><?php echo VDN_LANGUAGE_LIBRARY['dialogConfig']['dialogConfiguration']; ?></span></h4>
                        <span class='vdn-url-info-denoter'><b>*</b></span>
                        <span class="vdn-dialog-accessibility-info"><?php echo VDN_LANGUAGE_LIBRARY['dialogConfig']['eachCheckbox']; ?></span>
                    </div>
                    <div class='vd-navigation-row'>
                        <?php
                            $vdn_default_intents_meta_data_length = count(self::DEFAULT_INTENTS_META_DATA);
                            $vdn_default_audio_response = array('path' => NULL, 'voice' => NULL);
                            
                            for ($index = 0; $index < $vdn_default_intents_meta_data_length; $index++) {
                                $intent = self::DEFAULT_INTENTS_META_DATA[$index];
                                $intent_data = get_option($intent[self::INTENT_OPTION_NAME_KEY], array());
                                $intent_data = is_array($intent_data) ? $intent_data : array();

                                $dialog_url = array_key_exists('url', $intent_data) ? $intent_data['url'] : '';
                                $dialog_url = trim(strip_tags(stripslashes($dialog_url)));
                                $dialog_response = array_key_exists('response', $intent_data) ? $intent_data['response'] : '';
                                $dialog_response = trim(strip_tags(stripslashes($dialog_response)));
                                $dialog_enabled  = array_key_exists('enabled', $intent_data) ? $intent_data['enabled'] : 'disabled';
                                $dialog_enabled  = trim(strip_tags(stripslashes($dialog_enabled)));

                                // For audio response
                                $vdn_audio_response = array_key_exists('intent_audio_response', $intent_data) && is_array($intent_data['intent_audio_response']) 
                                ? $intent_data['intent_audio_response'] : $vdn_default_audio_response;
                                $vdn_audio_file_url = !empty(trim($vdn_audio_response['path'])) ? VDN_PLUGIN['ABS_URL'].trim($vdn_audio_response['path']) : null;
                                $vdn_audio_file_path = !empty(trim($vdn_audio_response['path'])) ? VDN_PLUGIN['ABS_PATH'].trim($vdn_audio_response['path']) : null;
                                $vdn_audio_reponse_file_name = !empty($vdn_audio_file_url) ? $intent[self::INTENT_KEY].'.mp3' : 'No file';

                                if (!empty($vdn_audio_file_path) && !file_exists($vdn_audio_file_path)) {
                                    $vdn_audio_file_path = null;
                                    $vdn_audio_file_url = null;
                                    $vdn_audio_reponse_file_name = 'No file';
                                }

                                $temp_index = $index;
                                $cell_class = 'vd-navigation-dialog-config-table-even-cell';

                                if (($temp_index%2) == 0 ) {
                                    $cell_class = 'vd-navigation-dialog-config-table-odd-cell';
                                    echo "</div><div class='vd-navigation-row'>";
                                }

                                // Intent input names
                                $vdn_intent_response_name    = $intent[self::INTENT_OPTION_NAME_KEY].'[response]';
                                $vdn_intent_url_name         = $intent[self::INTENT_OPTION_NAME_KEY].'[url]';
                                $vdn_intent_save_button_name = 'vd-navigation-dialog-config-settings-save-'.$intent[self::INTENT_KEY];
                                $vdn_response_name           = str_replace(']', '', str_replace('[', '_', $vdn_intent_response_name));
                                $vdn_url_name                = str_replace(']', '', str_replace('[', '_', $vdn_intent_url_name));
                        ?>  
                        <div class="vd-navigation-dialog-conf-column <?php echo $cell_class; ?>">
                            <form
                                method="post"
                                action="options.php"
                                data-intent-option-key="<?php echo $intent[self::INTENT_OPTION_NAME_KEY];?>"
                                onsubmit="vdnDialogFormSubmitHandler(this, event)"
                                data-current-voice="<?php echo $this->vd_navigation_voice;?>"
                                >
                                <?php
                                // This prints out all hidden setting fields
                                settings_fields( 'vd-navigation-dialog-config-settings-'.$intent[self::INTENT_KEY].'-group' );
                                do_settings_sections( 'vd-navigation-settings' );

                                // To display errors
                                settings_errors('vd-navigation-settings', true, true);
                                ?>
                                <table>
                                    <tr>
                                        <td colspan="2">
                                            <div class="vd-navigation-basic-config-section-title vdn-dialog-config-dialog-header">
                                                <label for="vdnIntentAccessibility<?php echo $index; ?>"> 
                                                    <input 
                                                        title="<?php echo VDN_LANGUAGE_LIBRARY['dialogConfig']['uncheckingThisBox']; ?>" 
                                                        class="vdn-intent-accessibility-checkbox" 
                                                        id="vdnIntentAccessibility<?php echo $index; ?>" 
                                                        type="checkbox"
                                                        data-old-value="<?php echo $dialog_enabled;?>"
                                                        value="enabled"
                                                        data-response-name="textarea[data-response-name=<?php echo $vdn_response_name; ?>]"
                                                        data-url-name="input[data-url-name=<?php echo $vdn_url_name; ?>]"
                                                        data-save-button-name="input[name=<?php echo $vdn_intent_save_button_name; ?>]"
                                                        onchange="toggleIntentAccessiblity(this)"
                                                        name="<?php echo $intent[self::INTENT_OPTION_NAME_KEY]; ?>[enabled]"
                                                        <?php checked('enabled', $dialog_enabled);?>
                                                        >
                                                    <?php echo $index + 1 .'. '. $intent[self::INTENT_LABEL_KEY]; ?>
                                                </label>
                                            </div>
                                        </td>
                                    </tr>
                                    <tr class="vd-navigation-card">
                                        <td colspan="2" class="vd-navigation-dialog-config-sub-table-cell">
                                            <textarea
                                            maxlength="1000"
                                            data-old-value="<?php echo $dialog_response; ?>"
                                            name="<?php echo $vdn_intent_response_name; ?>" 
                                            data-response-name="<?php echo $vdn_response_name; ?>"
                                            placeholder="<?php echo self::INTENT_RESPONSE_PLACEHOLDER_TEXT; ?>"
                                            <?php echo ($dialog_enabled != 'enabled') ? ' readonly' : ''; ?>
                                            /><?php echo $dialog_response; ?></textarea>
                                            <input
                                                type="hidden"
                                                name="<?php echo $intent[self::INTENT_OPTION_NAME_KEY]; ?>[intent_name]"
                                                value="<?php echo $intent[self::INTENT_KEY]; ?>"
                                                >
                                            <input
                                                type="hidden"
                                                name="<?php echo $intent[self::INTENT_OPTION_NAME_KEY]; ?>[intent_audio_response][path]"
                                                value="<?php echo $vdn_audio_response['path'];?>"
                                                >
                                            <input
                                                type="hidden"
                                                name="<?php echo $intent[self::INTENT_OPTION_NAME_KEY]; ?>[intent_audio_response][voice]"
                                                value="<?php echo $vdn_audio_response['voice'];?>"
                                                >
                                            <input
                                                type="hidden"
                                                name="<?php echo $intent[self::INTENT_OPTION_NAME_KEY]; ?>[delete_audio_response]"
                                                value="0"
                                                >
                                        </td>
                                    </tr>
                                    <tr class="vd-navigation-card <?php echo empty($vdn_audio_file_url) ? 'vdn-response-audio-unavailable-row' : 'vdn-response-audio-row';?>">
                                        <td colspan="2" class="vd-navigation-dialog-config-sub-table-cell <?php echo empty($vdn_audio_file_url) ? 'vdn-hide-element' : '';?>">
                                            <div class="vdn-audio-wrapper vdn-audio-control-wrapper">
                                                <audio src="<?php echo $vdn_audio_file_url;?>" controls preload="auto">
                                                    Your browser does not support the audio tag.
                                                </audio>
                                            </div>
                                            <div class="vdn-audio-wrapper vdn-audio-file-name-wrapper">
                                                <button
                                                    disabled
                                                    type="button"
                                                    class="button button-secondary"
                                                    style="background-color: transparent !important; background: transparent !important; border: 0 !important;"
                                                    >
                                                    <?php echo $vdn_audio_reponse_file_name;?>
                                                </button>
                                            </div>
                                        </td>
                                        <td
                                            colspan="2"
                                            class="vd-navigation-dialog-config-sub-table-cell <?php echo empty($vdn_audio_file_url) ? '' : 'vdn-hide-element';?>">
                                            <div class="vdn-audio-response-unavailable-wrapper">
                                                <?php echo VDN_LANGUAGE_LIBRARY['dialogConfig']['audioUnavailableText'];?>
                                            </div>
                                        </td>
                                    </tr>
                                    <tr class="vd-navigation-card">
                                        <td colspan="2" class="vd-navigation-dialog-config-sub-table-cell vdn-url-info">
                                            <span class='vdn-url-info-denoter'><b>*</b></span> 
                                            '<b><i><?php echo $intent[self::INTENT_URL_PLACEHOLDER_KEY];?></i></b>'
                                            <?php echo VDN_LANGUAGE_LIBRARY['dialogConfig']['urlInfo']['isPreconfigured']; ?> 
                                            <i>'<?php echo $intent[self::INTENT_LABEL_KEY]; ?>'</i> <?php echo VDN_LANGUAGE_LIBRARY['dialogConfig']['urlInfo']['dialog']; ?></i> <?php echo VDN_LANGUAGE_LIBRARY['dialogConfig']['urlInfo']['ifYouWantTo']; ?>
                                        </td>
                                    </tr>
                                    <tr class="vd-navigation-card">
                                        <td colspan="2" class="vd-navigation-attached-input-cell">
                                            <div class="vd-navigation-basic-config-attached-label-column">
                                                <?php echo self::INTENT_URL_LABEL_TEXT; ?>
                                            </div>
                                            <div class="vd-navigation-basic-config-attached-input-column">
                                                <input 
                                                type="text" 
                                                name="<?php echo $vdn_intent_url_name; ?>"
                                                data-url-name="<?php echo $vdn_url_name; ?>"
                                                placeholder="<?php echo $intent[self::INTENT_URL_PLACEHOLDER_KEY]; ?>" 
                                                value="<?php echo $dialog_url; ?>"
                                                <?php echo ($dialog_enabled != 'enabled') ? ' readonly' : ''; ?>
                                                />
                                            </div>
                                        </td>
                                    </tr>
                                    <tr class="vd-navigation-card">
                                        <td colspan="2" class="vd-navigation-dialog-config-sub-table-cell">
                                            <?php 
                                            $other_attrib = $dialog_enabled != 'enabled' ? array('disabled' => true, 'data-name' => 'vd-navigation-intent-submit') : array('data-name' => 'vd-navigation-intent-submit');
                                            submit_button( 
                                                VDN_LANGUAGE_LIBRARY['dialogConfig']['dialogSaveButton'].$intent[self::INTENT_LABEL_KEY].' Dialog', 
                                                'primary', 
                                                $vdn_intent_save_button_name, 
                                                false,
                                                $other_attrib
                                            );
                                            ?>
                                        </td>
                                    </tr>
                                </table>
                            </form>
                        </div>
                        <?php
                            }
                        ?>
                    </div>
                </div><!-- End of Dialog Configuration Section -->
            </div>
        </div>
        <!-- Loading Popup when text to speech Conversion-->
        <div class="vdn-loader-modal" id="vdnLoaderModal" >
            <div id="vdnLoaderModalContent">
                <b id="vdnSynthesizingProcessHeader"><?php echo VDN_LANGUAGE_LIBRARY['other']['synthesizingHeader'];?>
                    <br>
                    <img id="vdnLoaderModalSpinner" src="<?php echo dirname(plugin_dir_url(__FILE__)).'/images/vdn-process-spinner.gif'?>"/>
                    <!--  ## Do not remove code we might need it if better approach found then cookies -->
                    <span id="vdnTotalSynthResponseSection" style="display:none">
                        <span class="vdn-synthesizing-dialog-indicator" id="vdnCurrentDialog"></span> out of
                        <span class="vdn-synthesizing-dialog-indicator" id="vdnTotalSynthesizableDialogs"></span> dialogs
                    </span>
                </b>
                <br>
                <span id="vdnSynthesizingMessage"><?php echo VDN_LANGUAGE_LIBRARY['other']['synthesizingMessage'];?></span>
            </div> 
        </div>
        <?php
    }

    /**
     * Register and add settings
     */
    public function vd_navigation_page_init()
    {
        //register settings for feilds of 'Basic Configuration' section
        //register_setting('vd-navigation-basic-config-settings-group', self::BASIC_CONFIG_OPTION_NAMES['subscription']);
        register_setting('vd-navigation-basic-config-settings-group', self::BASIC_CONFIG_OPTION_NAMES['license_key']);
        register_setting('vd-navigation-basic-config-settings-group', self::BASIC_CONFIG_OPTION_NAMES['dialog_type']);
        register_setting('vd-navigation-basic-config-settings-group', self::BASIC_CONFIG_OPTION_NAMES['custom_endpoint']);
        register_setting('vd-navigation-basic-config-settings-group', self::BASIC_CONFIG_OPTION_NAMES['type_of_search']);
        register_setting('vd-navigation-basic-config-settings-group', self::BASIC_CONFIG_OPTION_NAMES['disable_search_mic']);
        register_setting('vd-navigation-basic-config-settings-group', self::BASIC_CONFIG_OPTION_NAMES['disable_forms_mic']);
        register_setting('vd-navigation-basic-config-settings-group', self::BASIC_CONFIG_OPTION_NAMES['searchable_hints']);
        register_setting('vd-navigation-basic-config-settings-group', self::BASIC_CONFIG_OPTION_NAMES['google_analytics_track']);
        register_setting('vd-navigation-basic-config-settings-group', self::BASIC_CONFIG_OPTION_NAMES['ga_tracking_id']);
        register_setting('vd-navigation-basic-config-settings-group', self::BASIC_CONFIG_OPTION_NAMES['mic_listening_timeout']);
        register_setting('vd-navigation-basic-config-settings-group', self::BASIC_CONFIG_OPTION_NAMES['voice']);
        register_setting('vd-navigation-basic-config-settings-group', self::BASIC_CONFIG_OPTION_NAMES['floating_mic_position']);
        register_setting('vd-navigation-basic-config-settings-group', self::BASIC_CONFIG_OPTION_NAMES['floating_button_icon']);

        //register settings for fields of 'Dialog Configuration section'
        foreach (self::DEFAULT_INTENTS_META_DATA as $index => $intent) {
            register_setting(
                'vd-navigation-dialog-config-settings-'.$intent[self::INTENT_KEY].'-group', 
                $intent[self::INTENT_OPTION_NAME_KEY]
            );
        }
    }
}

// check user capabilities and hook into 'init' to initialize 'Voice Dialog - Navigation' settings object
add_action('init', 'initialize_vd_navigation_settings_object');

/**
 * Initialize 'Voice Dialog - Navigation' settings object when 'pluggable' files are loaded from '/wp-includes/pluggable'
 * Which contains 'current_user_can' function.
 */
function initialize_vd_navigation_settings_object(){
    if ( !current_user_can( 'manage_options' ) ) return;  

    $voice_dialog_navigation_settings_page = new voice_dialog_navigation_settings_page();
}