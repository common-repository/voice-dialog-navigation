<?php
defined( 'WPINC' ) or die;

class Voice_Dialog_Navigation_Plugin extends WP_Stack_Plugin2 {

    /**
     * @var self
     */
    public static $vdn_ios                     = false;
    public static $vdn_url                     = "";
    public static $is_chrome                   = false;
    public static $vdn_type_of_search_flag     = 'ai';
    public static $vdn_license_key             = "";
    public static $vdn_voice                   = "male_en_US";
    public static $vdn_floating_mic_position   = "Middle Right";
    public static $vdn_api_access_key          = null;
    public static $vdn_admin_notice_logo       = "<img style='margin-left: -7px;vertical-align:middle;width:110px; height: 36px;' src='".VDN_PLUGIN['ABS_URL']."images/speak2web_logo.png'/>|<b> Voice Dialog Navigation</b>";
    public static $vdn_admin_notice_white_logo = "<img style='margin-left: -7px;vertical-align:middle;width:140px; height: 50px;' src='".VDN_PLUGIN['ABS_URL']."images/speak2web_white_logo.svg'/>|<b> Voice Dialog Navigation</b>";
    public static $configured_intent_count     = 0;
    public static $configured_settings_from_db = array();
    public static $vdn_dialog_type             = 'generic';
    public static $vdn_file_type               = '';
    //public static $vdn_file_type               = ''; // For debugging
    
    // For Free Trial
    public static $vdn_trial_days_left      = null;
    public static $vdn_trial_valid_until    = "";
    public static $vdn_trial_notice_msg_ctx = "";
    public static $vdn_trial_active         = false;
    public static $vdn_trial_over           = false;
    public static $vdn_site_name            = "";
    public static $vdn_settings_updated_ts  = null;
    
    // For access keys
    public static $vdn_voice_services_access_keys = array(
        'api_url' => "https://yjonpgjqs9.execute-api.us-east-1.amazonaws.com/V2",
        'db_col_name' => 'vd_navigation_voice_services_access_keys',
        'value' => array(
            'g_stt_key'     => null,
            'g_tts_key'     => null,
            'synched_at'    => null
        )
    );

    // For custom dialog response collection
    public static $vdn_custom_dialog_responses = array(
        'db_col_name' => 'vd_navigation_custom_dialog_responses',
        'collection' => array()
    );

    /**
     * Note: This map of language name as value (Eg: 'en_US') maps to value being saved to DB for plugin language option on settings page
     *
     * The keys of map (eg: en_US) are taken into account as of Wordpress version 5.3.2
     */
    public static $vdn_auto_detect_lang_map =  array(
        'en_US' => 'male_en_US',
        'en_GB' => 'female_en_GB',
        'de_DE' => 'male_de_DE'
    );

    /**
     * This is map of voices available at Google Text to Speech service, we are mapping language code we stored in DB  to available voice at Google's TTS service
     *
     * Mapping has been taken into consideration as of 22nd Jan 2020
     */
    public static $vdn_tts_voice_map =  array(
        'male_en_US'   => 'en-US_MichaelV3Voice',
        'female_en_US' => 'en-US_AllisonV3Voice',
        'female_en_GB' => 'en-GB_KateV3Voice',
        'male_de_DE'   => 'de-DE_DieterV3Voice',
        'female_de_DE' => 'de-DE_BirgitV3Voice'
    );

    // For text to speech using Ajax
    public static $vdn_tts_nonce = null;

    // Generic dialog DB option name to intent name map
    public static $vdn_generic_dialog_dboptionname_to_intentname_map = array();

    /**
     * Plugin version.
     */
    const VERSION = '3.2.0';

    /**
     * Constructs the object, hooks in to `plugins_loaded`.
     */
    protected function __construct()
    {
        // Get database values
        self::$vdn_license_key = get_option(voice_dialog_navigation_settings_page::BASIC_CONFIG_OPTION_NAMES['license_key'], null);
        self::$vdn_license_key = self::vdn_sanitize_variable_for_local_script(self::$vdn_license_key);

        self::$vdn_voice = get_option(voice_dialog_navigation_settings_page::BASIC_CONFIG_OPTION_NAMES['voice'], 'male_en_US');
        self::$vdn_voice = self::vdn_sanitize_variable_for_local_script(self::$vdn_voice);

        // Evaluate the status of Free Trial
        self::vdn_evaluate_trial_status();

        // Get API access key.
        self::$vdn_api_access_key = get_option('vd_navigation_api_system_key', null);
        self::$vdn_api_access_key = self::vdn_sanitize_variable_for_local_script(self::$vdn_api_access_key);

        // Get type of search flag config value from DB
        self::$vdn_type_of_search_flag = get_option(voice_dialog_navigation_settings_page::BASIC_CONFIG_OPTION_NAMES['type_of_search'], 'ai');
        self::$vdn_type_of_search_flag = stripslashes(strip_tags(trim(self::$vdn_type_of_search_flag)));
        self::$vdn_type_of_search_flag = self::vdn_sanitize_variable_for_local_script(self::$vdn_type_of_search_flag);
        self::$vdn_type_of_search_flag = self::$vdn_type_of_search_flag == null ? 'ai' : self::$vdn_type_of_search_flag;

        // Get type of dialog from DB
        self::$vdn_dialog_type = get_option(voice_dialog_navigation_settings_page::BASIC_CONFIG_OPTION_NAMES['dialog_type'], 'generic');
        self::$vdn_dialog_type = self::vdn_sanitize_variable_for_local_script(self::$vdn_dialog_type);

        self::$vdn_site_name = isset($_SERVER['HTTP_HOST']) ? $_SERVER['HTTP_HOST'] : $_SERVER['SERVER_NAME'];

        // Detect OS by user agent
        $iPod   = stripos($_SERVER['HTTP_USER_AGENT'],"iPod");
        $iPhone = stripos($_SERVER['HTTP_USER_AGENT'],"iPhone");
        $iPad   = stripos($_SERVER['HTTP_USER_AGENT'],"iPad");
        $chrome_browser = stripos($_SERVER['HTTP_USER_AGENT'],"Chrome");

        if (!($iPod == false && $iPhone == false && $iPad == false)) { /*self::$vdn_ios = true;*/ }

        if ($chrome_browser != false) { self::$is_chrome = true; }

        $this->hook( 'plugins_loaded', 'add_hooks' );
    }

    /**
     * Static method to get third party voice services access keys
     *
     */
    public static function vdn_get_access_keys_from_db()
    {
        $temp_access_keys_from_db = get_option(self::$vdn_voice_services_access_keys['db_col_name'], null);


        if (!!$temp_access_keys_from_db && is_array($temp_access_keys_from_db)) {

            if (array_key_exists('g_stt_key', $temp_access_keys_from_db)) {
                self::$vdn_voice_services_access_keys['value']['g_stt_key'] = $temp_access_keys_from_db['g_stt_key'];
            }

            if (array_key_exists('g_tts_key', $temp_access_keys_from_db)) {
                self::$vdn_voice_services_access_keys['value']['g_tts_key'] = $temp_access_keys_from_db['g_tts_key'];
            }

            if (array_key_exists('synched_at', $temp_access_keys_from_db)) {
                self::$vdn_voice_services_access_keys['value']['synched_at'] = $temp_access_keys_from_db['synched_at'];
            }

            unset($temp_access_keys_from_db);
        }
    }

    /**
     * Static method to evaluate status of trial period 
     *
     */
    public static function vdn_evaluate_trial_status() {
        try {
            if (!(empty(self::$vdn_license_key) === false && trim(self::$vdn_license_key == 'trial'))) {
                self::$vdn_trial_days_left      = null;
                self::$vdn_trial_valid_until    = "";
                self::$vdn_trial_notice_msg_ctx = "";
                self::$vdn_trial_active         = false;
                self::$vdn_trial_over           = false;
                return null;
            };
            
            self::$vdn_trial_valid_until = get_option('vd_navigation_trial_valid_until', "");
            
            if (empty(self::$vdn_trial_valid_until)) {
                self::$vdn_trial_days_left      = null;
                self::$vdn_trial_valid_until    = "";
                self::$vdn_trial_notice_msg_ctx = "";
                self::$vdn_trial_active         = false;
                self::$vdn_trial_over           = false;
                return null;
            }

            // Creates DateTime objects 
            $vdn_valid_until_date = date_create(self::$vdn_trial_valid_until);
            $vdn_current_date = date_create(date('Y/m/d')); 

            // Calculates the difference between DateTime objects 
            $vdn_interval = date_diff($vdn_valid_until_date, $vdn_current_date); 

            // Number of days left
            self::$vdn_trial_days_left = (int) $vdn_interval->format('%a');// Difference (in days) without sign
            $vdn_trial_days_left       = $vdn_interval->format('%R%a');// Difference (in days) with sign (+ or -)
            
            $vdn_trial_notices = VDN_LANGUAGE_LIBRARY['other']['trialNotice'];
            $vdn_other_common  = VDN_LANGUAGE_LIBRARY['other']['common'];
            
            $vdn_trailing_msg_ctx  = " ".$vdn_other_common['str1']." <a target='blank' href='https://speak2web.com/plugin/#plan'>".
            $vdn_other_common['str2']."</a> ".$vdn_trial_notices['common']['fullLicense'];

            $vdn_trailing_msg_ctx1 = " ".$vdn_other_common['str1']." <a target='blank' href='https://speak2web.com/plugin/#plan'>".
            $vdn_other_common['str2']."</a> ".$vdn_trial_notices['common']['mailUs']." <span style='color:#03C;font-style:italic;'>sales@speak2web.com</span> ".$vdn_trial_notices['common']['fullLicense'];


            if ($vdn_trial_days_left > 0) {
                // Expired and exceeded free trial
                self::$vdn_trial_notice_msg_ctx = "<b>".$vdn_trial_notices['common']['str1']."</b> ".$vdn_trial_notices['expired']['str1']." <span style='color:#FF0000'>".$vdn_trial_notices['expired']['str2']."</span>.".$vdn_trailing_msg_ctx1;
                self::$vdn_trial_over = true;
            } else if ($vdn_trial_days_left < 0) {
                // Under trial
                self::$vdn_trial_notice_msg_ctx = "<b>".$vdn_trial_notices['common']['str1']."</b> ".$vdn_trial_notices['underTrial']['str1']." ".self::$vdn_trial_valid_until. " (<span style='color:#FF0000'>".self::$vdn_trial_days_left."</span> ".$vdn_trial_notices['underTrial']['str2'].").".$vdn_trailing_msg_ctx;
            } else if ($vdn_trial_days_left == 0) {//
                // Last day
                self::$vdn_trial_notice_msg_ctx = "<b>".$vdn_trial_notices['common']['str1']."</b> ".$vdn_trial_notices['lastDay']['str1']." <span style='color:#FF0000'>".$vdn_trial_notices['lastDay']['str2']."</span>.".$vdn_trailing_msg_ctx;
            }
        } catch (\Exception $err) {
            self::$vdn_trial_days_left      = null;
            self::$vdn_trial_valid_until    = "";
            self::$vdn_trial_notice_msg_ctx = "";
            self::$vdn_trial_active         = false;
            self::$vdn_trial_over           = false;
        }
    }

    /**
     * Adds hooks.
     */
    public function add_hooks()
    {
        $this->hook( 'init' );

        // Register the STT service call action     
        add_action ( 'wp_ajax_nopriv_'.'vdn_log_service_call', array($this, 'vdn_log_service_call'));
        add_action ( 'wp_ajax_'.'vdn_log_service_call', array($this, 'vdn_log_service_call'));

        // Register the action to refresh voice services token and keys
        add_action ( 'wp_ajax_nopriv_'.'vdn_refresh_access_keys', array($this, 'vdn_refresh_access_keys'));
        add_action ( 'wp_ajax_'.'vdn_refresh_access_keys', array($this, 'vdn_refresh_access_keys'));

        self::$vdn_tts_nonce = wp_create_nonce('js_ajax_tts');

        // Register the action to handle ajax request for text synthesis
        add_action ( 'wp_ajax_'.'vdn_synthesize', array($this, 'vdn_synthsize_text') );
        
        self::$vdn_settings_updated_ts = voice_dialog_navigation_settings_page::vdn_settings_modified_timestamp('get');

        if (self::$vdn_dialog_type !== 'generic') {
            // Register the action to perform TTS process on custom dialog phrase
            add_action ( 'wp_ajax_nopriv_'.'vdn_custom_dialog_text_to_speech', array($this, 'vdn_custom_dialog_text_to_speech'));
            add_action ( 'wp_ajax_'.'vdn_custom_dialog_text_to_speech', array($this, 'vdn_custom_dialog_text_to_speech'));
            
            self::vdn_get_custom_responses_from_db();
        } else {
            // Register the action to perform TTS process of generic dialog by end user
            add_action ( 'wp_ajax_nopriv_'.'vdn_generic_dialog_tts_on_the_fly', array($this, 'vdn_synthsize_text'));
            add_action ( 'wp_ajax_'.'vdn_generic_dialog_tts_on_the_fly', array($this, 'vdn_synthsize_text'));
        }
        
        $this->hook( 'admin_enqueue_scripts', 'enqueue_admin_scripts' );

        // Register action to hook into admin_notices to display dashboard notice for non-HTTPS site
        if (is_ssl() == false) {
            add_action( 'admin_notices', function(){
    ?>
                <div class="notice notice-error is-dismissible">
                    <p> <?php echo self::$vdn_admin_notice_logo; ?>
                        <br/> <?php echo VDN_LANGUAGE_LIBRARY['other']['nonHttpsNotice']; ?>
                    </p>        
                </div>
    <?php
            });
        }

        // Here we are calling this method to get configured intents from DB to determine total number of intents been configured
        $vdn_temp_intents_data = self::get_configured_intents_from_DB();
        self::$configured_settings_from_db = array_key_exists('intents', $vdn_temp_intents_data) ? $vdn_temp_intents_data['intents'] : array();

        if (!empty(self::$vdn_license_key) && !empty(self::$vdn_api_access_key)) {
            if (self::$vdn_license_key != 'trial' || (self::$vdn_license_key == 'trial' && self::$vdn_trial_over === false)) {
                $this->hook( 'wp_enqueue_scripts', 'enqueue_frontend_scripts' );
            }
        } else {
            // Notify when license key is missing or invalid
            // Register action to hook into admin_notices to display dahsboard notice
            add_action( 'admin_notices', array($this, 'invalid_or_expired_license_key_notice'));

            // Register action to hook into 'after_plugin_row_' for displaying inline notice when license key is missing or activation is invalid
            add_action("after_plugin_row_voice-dialog-navigation/voice-dialog-navigation.php", function( $plugin_file, $plugin_data, $status ) {
                echo '<tr class="active">
                    <th style="border-left: 4px solid #FFB908; background-color:#FFF8E5;">&nbsp;</th>
                        <td colspan="2" style="background-color:#FFF8E5;">'.VDN_LANGUAGE_LIBRARY['other']['licenseKeyInvalid']['yourLicenseKeyInvalid'].'<a target="blank" href="https://speak2web.com/plugin/#plan">'.VDN_LANGUAGE_LIBRARY['other']['licenseKeyInvalid']['here'].'</a> '.VDN_LANGUAGE_LIBRARY['other']['licenseKeyInvalid']['toBuyOrRenew'].'
                        </td>
                    </tr>';
            }, 10, 3 );
        }

        // Notify when no intents has been configured
        if (self::$vdn_dialog_type === 'generic') {
            if (self::$configured_intent_count === 0) {
                // Register action to hook into admin_notices to display dashboard notice when no intents been configured
                add_action( 'admin_notices', array($this, 'configure_intent_notice'));

                // Register action to hook into 'after_plugin_row_' for displaying inline notice when there no intents been configured
                add_action("after_plugin_row_voice-dialog-navigation/voice-dialog-navigation.php", function( $plugin_file, $plugin_data, $status ) {
                    echo '<tr class="active">
                            <th style="border-left: 4px solid #FFB908; background-color:#FFF8E5;">&nbsp;</th>
                            <td colspan="2" style="background-color:#FFF8E5;">'.VDN_LANGUAGE_LIBRARY['other']['notConfigureAnyDialog']['notConfigure'].'<a href="options-general.php?page=vd-navigation-settings">'.VDN_LANGUAGE_LIBRARY['other']['notConfigureAnyDialog']['here'].'</a> '.VDN_LANGUAGE_LIBRARY['other']['notConfigureAnyDialog']['desiredResponse'].'
                            </td>
                        </tr>';
                }, 10, 3 );
            }

            $vdn_dialogs_for_audio_regeneration = array_key_exists('intents_for_audio_regeneration', $vdn_temp_intents_data) ? $vdn_temp_intents_data['intents_for_audio_regeneration'] : array();
            
            if (count($vdn_dialogs_for_audio_regeneration) > 0) {
                add_action( 'admin_notices', function() use ($vdn_dialogs_for_audio_regeneration) {
                    ?>
                    <div class="notice notice-info" style="overflow:hidden;position:relative;padding: 15px;background-color: #555555;color: white;border-radius: 5px;">
                        <p style="font-weight: 500"> <?php echo self::$vdn_admin_notice_white_logo; ?>
                        <br/>
                        <div style="margin:5px 0px"><strong style="border:1px solid #FFFFFF; padding:5px 10px; margin:10px 5px;"><?php echo count($vdn_dialogs_for_audio_regeneration); ?></strong><?php echo VDN_LANGUAGE_LIBRARY['other']['audioRegenerateNotice']['noticeText'];?>
                            <a href="<?php echo admin_url( 'options-general.php?page=vd-navigation-settings' );?>" style="display:inline-block;text-decoration:none;border: none;border-radius:5px;margin:10px 0px 0px 5px;padding: 12px 30px;background-color: #00a0d2;color:#FFFFFF;cursor: pointer;" type="button"><?php echo VDN_LANGUAGE_LIBRARY['other']['audioRegenerateNotice']['buttonText'];?></a>
                        </div>
                        <img style="position: absolute;opacity: 0.18;transform: translate(10%,-15%);right:0%;top:50%;" src="<?php echo VDN_PLUGIN['ABS_URL'];?>images/Voice Assistant Bot Icon.png"/>       
                    </div>
                    <?php
                });
            }
        }

        // Check if Free trial is active
        self::$vdn_trial_active = false;

        if (!empty(self::$vdn_license_key) && trim(self::$vdn_license_key) == 'trial' && !empty(self::$vdn_trial_valid_until) 
            && is_int(self::$vdn_trial_days_left)) {
            self::$vdn_trial_active = true;
        }

        // Notify trial license status
        if (self::$vdn_trial_active === true) {
            // Register action to hook into admin_notices to display dashboard notice
            add_action( 'admin_notices', function(){
                ?>
                <div class="notice notice-warning is-dismissible">
                    <p> <?php echo self::$vdn_admin_notice_logo; ?>
                        <br/><?php echo self::$vdn_trial_notice_msg_ctx;?>
                    </p>
                </div>
                <?php
            });

            // Register action to hook into 'after_plugin_row_' for displaying inline notice
            add_action("after_plugin_row_voice-dialog-navigation/voice-dialog-navigation.php", function( $plugin_file, $plugin_data, $status ) {
                echo '<tr class="active">
                        <th style="border-left: 4px solid #FFB908; background-color:#FFF8E5;">&nbsp;</th>
                        <td colspan="2" style="background-color:#FFF8E5;">'.self::$vdn_trial_notice_msg_ctx.'
                        </td>
                    </tr>';
            }, 10, 3 );
        }
    }

    /**
     * Method as action to invoke when license key is invalid or expired
     */
    public function invalid_or_expired_license_key_notice() {
    ?>
        <div class="notice notice-warning is-dismissible">
            <p> <?php echo self::$vdn_admin_notice_logo; ?>
                <br/>  <?php echo VDN_LANGUAGE_LIBRARY['other']['licenseKeyInvalid']['yourLicenseKeyInvalid']; ?> <a target="blank" href="https://speak2web.com/plugin/#plan"><?php echo VDN_LANGUAGE_LIBRARY['other']['licenseKeyInvalid']['here']; ?></a> <?php echo VDN_LANGUAGE_LIBRARY['other']['licenseKeyInvalid']['toBuyOrRenew']; ?>
            </p>
        </div>
    <?php
    }

    /**
     * Method as action to invoke when license key is invalid or expired
     */
    public function configure_intent_notice() {
    ?>
        <div class="notice notice-warning is-dismissible" data-vdn-notice="true">
            <p> <?php echo self::$vdn_admin_notice_logo; ?>
                <br/> <?php echo VDN_LANGUAGE_LIBRARY['other']['notConfigureAnyDialog']['notConfigure']; ?> <a href="options-general.php?page=vd-navigation-settings"><?php echo VDN_LANGUAGE_LIBRARY['other']['notConfigureAnyDialog']['here']; ?></a><?php echo VDN_LANGUAGE_LIBRARY['other']['notConfigureAnyDialog']['desiredResponse']; ?>
            </p>
        </div>
    <?php
    }

    /**
     * Initializes the plugin, registers textdomain, etc.
     * Most of WP is loaded at this stage, and the user is authenticated
     */
    public function init()
    {
        self::$vdn_url = VDN_PLUGIN['ABS_URL'];

        if ( isset($GLOBALS['pagenow']) && $GLOBALS['pagenow'] == 'plugins.php' ) {
            add_filter( 'plugin_row_meta', array(&$this, 'custom_plugin_row_meta'), 10, 2);
        }        
        
        $this->load_textdomain( 'voice-dialog-navigation', '/languages' );

        // Get mic position from DB
        self::$vdn_floating_mic_position = get_option(voice_dialog_navigation_settings_page::BASIC_CONFIG_OPTION_NAMES['floating_mic_position']);

        // Check mic position exist in DB , if not then store default as 'Middle Right'
        if (self::$vdn_floating_mic_position === false) {
            update_option(voice_dialog_navigation_settings_page::BASIC_CONFIG_OPTION_NAMES['floating_mic_position'], 'Middle Right');
            self::$vdn_floating_mic_position = 'Middle Right';
        }

        // load access keys of third party voice services from local DB
        self::vdn_get_access_keys_from_db();

        // Obtain third party voice services token and keys from api
        self::vdn_synch_voice_access_keys();

        foreach (voice_dialog_navigation_settings_page::DEFAULT_INTENTS_META_DATA as $index => $intent) {
            self::$vdn_generic_dialog_dboptionname_to_intentname_map[$intent[voice_dialog_navigation_settings_page::INTENT_OPTION_NAME_KEY]] = $intent[voice_dialog_navigation_settings_page::INTENT_KEY];
        }
    }

    /**
     * Class method to retrieve and get configured intents from DB
     * 
     * @param Boolean $vdn_voice_changed  Flag to denote plugin voice changed when true otherwise false
     *
     * @return Array $configured_settings  A multidimentional array with two sets of intents data,
     * set 'intents' for all intents data from DB and 
     * set 'intents_for_audio_regeneration' for those intents which needs creation or recreation of audio files
     *
     */
    public static function get_configured_intents_from_DB($vdn_voice_changed = false)
    {
        $configured_settings = array(
            'intents' => array(),
            'intents_for_audio_regeneration' => array(),
            'intents_with_audios' => array()
        );
        $vdn_voice_changed_by_admin = !empty($vdn_voice_changed) && $vdn_voice_changed === true ? true : false;
        
        self::$configured_intent_count = 0;
        $vdn_voice = get_option(voice_dialog_navigation_settings_page::BASIC_CONFIG_OPTION_NAMES['voice'], 'male_en_US');

        foreach (voice_dialog_navigation_settings_page::DEFAULT_INTENTS_META_DATA as $key => $intent_meta_data) {
            $intent_from_db = get_option($intent_meta_data[voice_dialog_navigation_settings_page::INTENT_OPTION_NAME_KEY], array());

            if (!is_array($intent_from_db)) {
                $intent_from_db = (array) $intent_from_db;
            }

            // ###############################################
            // Skip the iteration as intent data unavailable
            // ###############################################
            if (empty($intent_from_db)) continue;

            $intent_data_exist = false;

            $intent_response_text = array_key_exists('response', $intent_from_db) ? trim($intent_from_db['response']) : null;
            $intent_have_response_text = !empty($intent_response_text) ? true : false;

            // #####################################
            // Check if response/dialog text exist
            // #####################################
            if ($intent_have_response_text === true) {
                $intent_data_exist = true;
            }

            if ($intent_data_exist === false) {
                $intent_url = array_key_exists('url', $intent_from_db) ? trim($intent_from_db['url']) : null;
                $intent_have_url = !empty($intent_url) ? true : false;

                // ################################
                // Check if url for intent exist
                // ################################
                if ($intent_have_url === true) {
                    $intent_data_exist = true;
                }
            }

            // #################################################################################################################
            // If any of the data exist for intent and 'enabled' key never exist then override intent data to enable the intent
            // This block of code intended to enable intents while upgrading plugin to have 'enabled'feature.
            // #################################################################################################################
            if ($intent_data_exist === true) {
                self::$configured_intent_count += 1;

                if (!array_key_exists('enabled', $intent_from_db)) {
                    $intent_from_db['enabled'] = 'enabled';
                    update_option($intent_meta_data[voice_dialog_navigation_settings_page::INTENT_OPTION_NAME_KEY], $intent_from_db);
                }
            }

            // ##########################################################
            // Append DB option name and a intent name for the intent.
            // ##########################################################
            $intent_from_db['option_name'] = $intent_meta_data[voice_dialog_navigation_settings_page::INTENT_OPTION_NAME_KEY];
            $intent_from_db['intent_name'] = voice_dialog_navigation_settings_page::INTENT_KEY;

            // Intent audio response data
            $intent_audio_response = array_key_exists('intent_audio_response', $intent_from_db) ? $intent_from_db['intent_audio_response'] : array();

            if (!is_array($intent_audio_response)) {
                $intent_audio_response = (array) $intent_audio_response;
            }        

            // ####################################################################
            // Setting this flag to true indicates need of audio file generation
            // ####################################################################
            $vdn_generate_audio = false;

            if (empty($intent_audio_response)) {
                // #########################################################################
                // Intent/dialog data available but 'intent_audio_response' data is missing
                // #########################################################################
                $vdn_generate_audio = true;
            } else {
                $intent_audio_path = array_key_exists('path', $intent_audio_response) ? trim($intent_audio_response['path']) : null;
                $intent_audio_voice = array_key_exists('voice', $intent_audio_response) ? trim($intent_audio_response['voice']) : null;
                $intent_audio_have_path = !empty($intent_audio_path) ? true : false;

                if ($intent_audio_have_path === true) {
                    //##########################################################################
                    // Set audio generation flag to true for below listed scenarios
                    //
                    // 1. Path exist in DB but audio file physically not exist
                    //##########################################################################
                    if (!file_exists(VDN_PLUGIN['ABS_PATH'].$intent_audio_path) || $intent_have_response_text === false) {
                        $intent_from_db['intent_audio_response']['path'] = null;
                        $intent_from_db['intent_audio_response']['voice'] = null;
                        update_option($intent_meta_data[voice_dialog_navigation_settings_page::INTENT_OPTION_NAME_KEY], $intent_from_db);
                        $vdn_generate_audio = true;
                    }

                    // ##########################################################################
                    // Get intents which having path (To generate audio while changing language)
                    // ##########################################################################
                    if ($intent_have_response_text === true && $intent_from_db['enabled'] === 'enabled') {
                        array_push($configured_settings['intents_with_audios'], $intent_meta_data[voice_dialog_navigation_settings_page::INTENT_OPTION_NAME_KEY]);
                    }
                } else {
                    // ######################################
                    // Response text exist but path is empty
                    // ######################################
                    $vdn_generate_audio = true;
                }
            }

            if ($intent_have_response_text === true && $vdn_generate_audio === true && $intent_from_db['enabled'] === 'enabled') {
                array_push($configured_settings['intents_for_audio_regeneration'], $intent_meta_data[voice_dialog_navigation_settings_page::INTENT_OPTION_NAME_KEY]);
            }

            $configured_settings['intents'][$intent_meta_data[voice_dialog_navigation_settings_page::INTENT_KEY]] = $intent_from_db;
        }

        return $configured_settings;
    }

    /**
     * Method to enqueue JS scripts and CSS of Admin for loading 
     */
    public function enqueue_admin_scripts()
    {
        // Enqueue JS: vdn.settings.js
        wp_enqueue_script(
            'vdn.settings',
            self::vdn_get_file_meta_data('url', 'js/settings/vdn.settings', 'js'),
            array(),
            self::vdn_get_file_meta_data('timestamp', 'js/settings/vdn.settings', 'js'),
            true
        );

        wp_localize_script( 'vdn.settings', 'vdnAjaxObj', array(
            'ajax_url' => admin_url( 'admin-ajax.php' ),
            'synthesize_nonce' => self::$vdn_tts_nonce
        ));

        // Enqueue CSS: vdn.settings.css
        wp_enqueue_style(
            'vd_navigation_settings_css',
            self::vdn_get_file_meta_data('url', 'css/settings/vdn.settings', 'css'),
            array(),
            self::vdn_get_file_meta_data('timestamp', 'css/settings/vdn.settings', 'css'),
            'screen'
        );
    }

    /**
     * Static method to get data related to file
     *
     * @param $intent - string : 'url' or 'timestamp'
     * @param $partial_file_path - string : Path of file (Partial and mostly relative path)
     * @param $file_extension - string : 'js' or 'css'
     *
     * $returns $vdn_file_data - string : Time as a Unix timestamp or absolute url to the file
     */
    public static function vdn_get_file_meta_data($intent = "", $partial_file_path = "", $file_extension = "")
    {
        $vdn_file_data = "";

        try {
            if (empty($file_extension) || empty($partial_file_path) || empty($intent)) throw new Exception("VDN: Error while getting file data.", 1);

            $intent = strtolower(trim($intent));
            $file_ext = '.' . str_replace(".", "", trim($file_extension));
            $partial_file_path = trim($partial_file_path);

            if ($intent == 'timestamp') {
                if (!empty(self::$vdn_settings_updated_ts)) {
                    $vdn_file_data = self::$vdn_settings_updated_ts;
                } else {
                    $vdn_file_data = filemtime(VDN_PLUGIN['ABS_PATH'] . $partial_file_path . self::$vdn_file_type . $file_ext);
                }
            } else if ($intent == 'url') {
                $vdn_file_data = VDN_PLUGIN['ABS_URL'] . $partial_file_path . self::$vdn_file_type . $file_ext;
            }
        } catch (\Exception $ex) {
            $vdn_file_data = "";
        }

        return $vdn_file_data;
    }

    /**
     * Method to enqueue JS scripts and CSS for loading at Front end
     */
    public function enqueue_frontend_scripts()
    {
        //################################################################################
        //
        // Enqueue 'voice-dialog-navigation' CSS file to load at front end
        //
        //################################################################################
        wp_enqueue_style(
            'voice-dialog-navigation',
            self::vdn_get_file_meta_data('url', 'css/voice-dialog-navigation', 'css'),
            array(),
            self::vdn_get_file_meta_data('timestamp', 'css/voice-dialog-navigation', 'css'),
            'screen'
        );

        //################################################################################
        //
        // Enqueue 'vdn.text-library' javasctipt file to load at front end
        //
        //################################################################################
        wp_enqueue_script(
            'vdn.text-library',
            self::vdn_get_file_meta_data('url', 'js/vdn.text-library', 'js'),
            array(),
            self::vdn_get_file_meta_data('timestamp', 'js/vdn.text-library', 'js'),
            true
        );

         //##################################################################################################################
        // Determine STT language context for plugin
        //##################################################################################################################
        $vdn_stt_language_context = array(
            'gcp' => array(
                'stt' => 'N',
                'langCode' => null,
                'endPoint' => null,
                'key' => null,
                'qs' => array('key' => null)
            )
        );

        $vdn_langauge_replace = array('female_', 'male_');
        // Remove other strings and get the language code
        $vdn_language_code = !empty(self::$vdn_voice) ? str_replace($vdn_langauge_replace, "", self::$vdn_voice) : "en-US";
        $vdn_language_code = str_replace('_', "-", $vdn_language_code);
        $vdn_gcp_supported = VdnLanguage::gcp_supported($vdn_language_code);
        $vdn_lang_not_supported_by_vendors = false;

        if (VDN_CLIENT['chrome'] === true) {
            if ($vdn_gcp_supported === true) {
                $vdn_stt_language_context['gcp']['stt'] = 'Y';
            } 
            else {
                $vdn_stt_language_context['gcp']['stt'] = 'Y';
                $vdn_lang_not_supported_by_vendors = true;
            }
        } else {
            if ($vdn_gcp_supported === true) {
                $vdn_stt_language_context['gcp']['stt'] = 'Y';
            }
        }

        if ($vdn_stt_language_context['gcp']['stt'] == 'Y') {
            $vdn_gcp_lang_code = VdnLanguage::$gcp_language_set[$vdn_language_code][VdnLanguage::LANG_CODE];
            $vdn_gcp_key = self::$vdn_voice_services_access_keys['value']['g_stt_key'];
            
            $vdn_stt_language_context['gcp']['endPoint'] = 'https://speech.googleapis.com/v1/speech:recognize';
            $vdn_stt_language_context['gcp']['langCode'] = $vdn_gcp_lang_code;
            $vdn_stt_language_context['gcp']['key'] = $vdn_gcp_key;
            $vdn_stt_language_context['gcp']['qs']['key'] = '?key=';
        }

        wp_localize_script( 'vdn.text-library', 'vdnConfiguredVoice', self::$vdn_voice);
        wp_localize_script( 'vdn.text-library', '_vdnSttLanguageContext', $vdn_stt_language_context);
        wp_localize_script( 'vdn.text-library', 'vdnPath', self::$vdn_url);
        wp_localize_script( 'vdn.text-library', 'vdnImagesPath', self::$vdn_url . 'images/');
        
        $vdn_count_nonce = wp_create_nonce( 'service_call_count' );
        $vdn_keys_refresh_nonce = wp_create_nonce( 'keys_refresh' );
        $vdn_custom_dialog_nonce = wp_create_nonce( 'custom_dialog' );

        wp_localize_script( 'vdn.text-library', 'vdnAjaxObj', array(
            'ajax_url' => admin_url( 'admin-ajax.php' ),
            'nonce' => $vdn_count_nonce,
            'keys_nonce' => $vdn_keys_refresh_nonce,
            'custom_dialog_nonce' => $vdn_custom_dialog_nonce,
            'generic_dialog_nonce' => self::$vdn_tts_nonce
        ));

        wp_localize_script( 'vdn.text-library', 'vdnSelectedMicPosition', self::$vdn_floating_mic_position);

        // Localizes a registered script with JS variable for custom endpoint URL       
        $custom_endpoint_url = get_option(voice_dialog_navigation_settings_page::BASIC_CONFIG_OPTION_NAMES['custom_endpoint'], null);
        $custom_endpoint_url = self::vdn_sanitize_variable_for_local_script($custom_endpoint_url);

        // Localizes a registered script with JS variable for Google Analytics Track
        $vdn_google_analytics_track = get_option(voice_dialog_navigation_settings_page::BASIC_CONFIG_OPTION_NAMES['google_analytics_track'], null);
        $vdn_google_analytics_track = self::vdn_sanitize_variable_for_local_script($vdn_google_analytics_track);

        // Localizes a registered script with JS variable for Google Analytics Track
        $vdn_ga_tracking_id = get_option(voice_dialog_navigation_settings_page::BASIC_CONFIG_OPTION_NAMES['ga_tracking_id'], null);
        $vdn_ga_tracking_id = self::vdn_sanitize_variable_for_local_script($vdn_ga_tracking_id);

        wp_localize_script( 'vdn.text-library', 'vdnConfiguredSetting', self::$configured_settings_from_db);
        wp_localize_script( 'vdn.text-library', 'vdnDialogType', self::$vdn_dialog_type );
        wp_localize_script( 'vdn.text-library', 'vdnCustomEndpointUrl', $custom_endpoint_url);
        wp_localize_script( 'vdn.text-library', 'vdnTypeOfSearch', self::$vdn_type_of_search_flag);
        wp_localize_script( 'vdn.text-library', 'vdnGaTrack', $vdn_google_analytics_track);
        wp_localize_script( 'vdn.text-library', 'vdnGaTrackingId', $vdn_ga_tracking_id);

        // Make host name available to 'vdn.speech-handler.js'
        $protocol = (!empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off' 
            || $_SERVER['SERVER_PORT'] == 443) ? "https://" : "http://";
        $domainName = $_SERVER['SERVER_NAME'];
        wp_localize_script( 'vdn.text-library', 'vdnCurrentHostName', $protocol.$domainName);

        $stt_model = '&model=en-US_BroadbandModel';
        $send_dialog_api_url = 'https://t7rhbr6m67.execute-api.us-east-1.amazonaws.com/V1/';

        switch (self::$vdn_voice) {
            case 'male_de_DE':
            case 'female_de_DE':
                $stt_model = '&model=de-DE_BroadbandModel';
                $send_dialog_api_url = 'https://tm7k4xniwg.execute-api.us-east-1.amazonaws.com/V1';
                break;
                
            case 'female_en_GB':
                $stt_model = '&model=en-GB_BroadbandModel';
                break;

            default:
                $stt_model = '&model=en-US_BroadbandModel';
        }

        $web_socket_url = array(
            'url'     => 'wss://stream.watsonplatform.net/speech-to-text/api/v1/recognize',
            'tokenQs' => '?access_token=',
            'otherQs' =>  $stt_model
        );

        wp_localize_script( 'vdn.text-library', 'vdnWebSocketUrl', $web_socket_url);
        wp_localize_script( 'vdn.text-library', 'vdnSendDialogApiUrl', $send_dialog_api_url);
        wp_localize_script( 'vdn.text-library', 'vdnWorkerPath', VDN_PLUGIN['ABS_URL']. 'js/recorderjs/vdn.audio-recorder-worker'.self::$vdn_file_type.'.js');

        wp_localize_script( 'vdn.text-library', 'voice_dialog_navigation', array(
            'button_message' => __( 'Speech Input', 'voice-dialog-navigation' ),
            'talk_message'   => __( 'Start Talking…', 'voice-dialog-navigation' ),
        ));

        // Make disable search mic value to 'voice-dialog-navigation.js'
        $vdn_disable_search_mic = get_option(voice_dialog_navigation_settings_page::BASIC_CONFIG_OPTION_NAMES['disable_search_mic'], '0');
        $vdn_disable_search_mic = self::vdn_sanitize_variable_for_local_script($vdn_disable_search_mic);
        wp_localize_script( 'vdn.text-library', 'vdnDisableSearchMic', $vdn_disable_search_mic);
        
        // Make disable forms mic value to 'voice-dialog-navigation.js'
        $vdn_disable_forms_mic = get_option(voice_dialog_navigation_settings_page::BASIC_CONFIG_OPTION_NAMES['disable_forms_mic'], '0');
        $vdn_disable_forms_mic = self::vdn_sanitize_variable_for_local_script($vdn_disable_forms_mic);
        wp_localize_script( 'vdn.text-library', 'vdnDisableFormsMic', $vdn_disable_forms_mic);

        // Localizes a registered script with JS variable for User Searchable hints
        $searchable_hints_str = get_option(voice_dialog_navigation_settings_page::BASIC_CONFIG_OPTION_NAMES['searchable_hints'], '');

        if (empty($searchable_hints_str)) {
            $searchable_hints_str = voice_dialog_navigation_settings_page::DEFAULT_SEARCHABLE_HINTS;
        }

        $searchable_hints_str = str_replace(array("\n", "\t", "\r"), '', $searchable_hints_str);
        $searchable_hints_arr = array_filter(explode(';', $searchable_hints_str));
        $searchable_hints_arr = array_map('trim', $searchable_hints_arr);
        wp_localize_script( 'vdn.text-library', 'vdnSearchableHints', $searchable_hints_arr);

        $vd_navigation_mic_listening_timeout = get_option(voice_dialog_navigation_settings_page::BASIC_CONFIG_OPTION_NAMES['mic_listening_timeout'], null);
        $vd_navigation_mic_listening_timeout = self::vdn_sanitize_variable_for_local_script($vd_navigation_mic_listening_timeout);

        if (is_null($vd_navigation_mic_listening_timeout)) {
            update_option(voice_dialog_navigation_settings_page::BASIC_CONFIG_OPTION_NAMES['mic_listening_timeout'], '8');
            $vd_navigation_mic_listening_timeout = '8';
        }

        wp_localize_script( 'vdn.text-library', 'vdnMicListenTimeoutDuration', $vd_navigation_mic_listening_timeout);
        
        wp_localize_script( 'vdn.text-library', 'vdnXApiKey', self::$vdn_api_access_key);
        wp_localize_script( 'vdn.text-library', 'vdnSelectedMicPosition', self::$vdn_floating_mic_position);
        
        $vdn_floating_btn_icon = get_option(voice_dialog_navigation_settings_page::BASIC_CONFIG_OPTION_NAMES['floating_button_icon'], 'micIcon');
        wp_localize_script( 'vdn.text-library', 'vdnFloatingButtonIcon', $vdn_floating_btn_icon);

        $vdn_current_value = get_option('vdn_current_value', "0");
        $vdn_last_value    = get_option('vdn_last_value', "0");
        $vdn_last_value_updated_at = get_option('vdn_last_value_updated_at', null);
        $vdn_last_value_updated_at = self::vdn_sanitize_variable_for_local_script($vdn_last_value_updated_at);

        $vdn_service_logs = array(
            'updatedAt' => $vdn_last_value_updated_at,
            'currentValue' => $vdn_current_value,
            'lastValue' => $vdn_last_value,
        );

        wp_localize_script( 'vdn.text-library', 'vdnServiceLogs', $vdn_service_logs);
        wp_localize_script( 'vdn.text-library', 'vdnCustomResponses', self::$vdn_custom_dialog_responses['collection']);
        
        //################################################################################
        //
        // Enqueue 'vdn.speech-handler' javasctipt file to load at front end
        //
        //################################################################################
        wp_enqueue_script(
            'vdn.speech-handler',
            self::vdn_get_file_meta_data('url', 'js/vdn.speech-handler', 'js'),
            array(),
            self::vdn_get_file_meta_data('timestamp', 'js/vdn.speech-handler', 'js'),
            true
        );

        //################################################################################
        //
        // Enqueue 'vdn.audio-input-handler' javasctipt file to load at front end
        //
        //################################################################################
        wp_enqueue_script(
            'vdn.audio-input-handler',
            self::vdn_get_file_meta_data('url', 'js/vdn.audio-input-handler', 'js'),
            array(),
            self::vdn_get_file_meta_data('timestamp', 'js/vdn.audio-input-handler', 'js'),
            true
        );

        //################################################################################
        //
        // Enqueue 'vdn.audio-recorder' javasctipt file to load at front end
        //
        //################################################################################
        wp_enqueue_script(
            'vdn.audio-recorder',
            self::vdn_get_file_meta_data('url', 'js/recorderjs/vdn.audio-recorder', 'js'),
            array(),
            self::vdn_get_file_meta_data('timestamp', 'js/recorderjs/vdn.audio-recorder', 'js'),
            true
        );

        //################################################################################
        //
        // Enqueue 'voice-dialog-navigation' javasctipt file to load at front end
        //
        //################################################################################
        wp_enqueue_script(
            'voice-dialog-navigation',
            self::vdn_get_file_meta_data('url', 'js/voice-dialog-navigation', 'js'),
            array(),
            self::vdn_get_file_meta_data('timestamp', 'js/voice-dialog-navigation', 'js'),
            true
        );
    }

    function custom_plugin_row_meta( $links, $file )
    {

        if ( strpos( $file, 'voice-dialog-navigation.php' ) !== false ) {
            $new_links = array(
                    'settings' => '<a href="' . site_url() . '/wp-admin/admin.php?page=vd-navigation-settings" title="Voice Dialog – Navigation">Settings</a>'
                    );

            $links = array_merge( $links, $new_links );
        }

        return $links;
    }

    /**
     * Function to get REST API access key ('x-api-key') against license key instate to avail plugin (Voice Dialog - Navigation) service
     *
     * @param $convertable_license_key - String : License key customer posses
     */
    public static function vdn_get_api_key_from_license_key($convertable_license_key = null, $license_key_field_changed = false)
    {
        $result = array();

        try {
            // Throw exception when license key is blank or unavailable
            if (!(isset($convertable_license_key) && is_null($convertable_license_key) == false 
                && trim($convertable_license_key) != '')) {
                update_option( 'vd_navigation_api_system_key', '');
                throw new Exception("Error: License key is unavailable or invalid.");
            }

            $vdn_api_system_key = get_option('vd_navigation_api_system_key', null);
            $vdn_api_system_key = isset($vdn_api_system_key) ? trim($vdn_api_system_key) : null;

            if (!empty($vdn_api_system_key) && $license_key_field_changed == false) {
                self::$vdn_api_access_key = $vdn_api_system_key;
            } else {
                if ($license_key_field_changed === true && strtolower(trim($convertable_license_key)) == 'trial') {
                    // Obtain trial license (Re-gain)
                    self::vdn_get_trial_license(true);
                } else {
                    $body = array( 'license' => trim($convertable_license_key) );
                    $args = array(
                        'body'        => json_encode($body),
                        'timeout'     => '60',
                        'headers'     => array(
                            'Content-Type' => 'application/json',
                            'Accept'       => 'application/json',
                            'x-api-key'    => 'jEODHPKy2z7GEIuerFBWk7a0LqVRJ7ER3aDExmbK'
                        )
                    );

                    $response = wp_remote_post( 'https://1kosjp937k.execute-api.us-east-1.amazonaws.com/V1', $args );

                    // Check the response code
                    $response_code = wp_remote_retrieve_response_code( $response );

                    if ($response_code == 200) {
                        $response_body = wp_remote_retrieve_body($response);
                        $result = @json_decode($response_body, true);

                        if (!empty($result) && is_array($result)) {
                            if (array_key_exists('errorMessage', $result)) {
                                update_option( 'vd_navigation_api_system_key', '');
                            } else {
                                $conversion_status_code = !empty($result['statusCode']) ? trim($result['statusCode']) : null;;
                                $conversion_status      = !empty($result['status']) ? trim($result['status']) : null;

                                if (!is_null($conversion_status_code) && !is_null($conversion_status) 
                                    && (int)$conversion_status_code == 200 && strtolower(trim($conversion_status)) == 'success') {
                                    self::$vdn_api_access_key = !empty($result['key']) ? trim($result['key']) : null;
                                    
                                    if (self::$vdn_api_access_key !== null) {
                                        update_option( 'vd_navigation_api_system_key', self::$vdn_api_access_key);
                                    } else {
                                        update_option( 'vd_navigation_api_system_key', '');
                                    }
                                } else {
                                    update_option( 'vd_navigation_api_system_key', '');
                                }
                            }
                        }
                    }
                }
            }
        } catch (\Exception $ex) {
            self::$vdn_api_access_key = null;
        }

        self::$vdn_api_access_key = self::vdn_sanitize_variable_for_local_script(self::$vdn_api_access_key);
    }

    /**
     * Static method to obtain trial license key
     *
     * @param $retrieve_trial_license Boolean 
     */
    public static function vdn_get_trial_license($retrieve_trial_license = false) {
        $vdn_db_field_names = array(
            'license'          => 'vd_navigation_license_key', 
            'aws_key'          => 'vd_navigation_api_system_key', 
            'valid_until'      => 'vd_navigation_trial_valid_until', 
            'first_activation' => 'vd_navigation_first_activation',
            'trial_uuid'       => 'vd_navigation_uuid'
        );

        // Get plugin first activation status and license key from DB 
        $vdn_first_activation = get_option($vdn_db_field_names['first_activation'], null); 
        $vdn_license_key = get_option($vdn_db_field_names['license'], null);

        // Store plugin first activation data in DB
        $is_this_first_activation = false;

        if (empty($vdn_first_activation) && empty(trim($vdn_license_key))) {
            // Mark first activation activity flag in local DB 
            update_option($vdn_db_field_names['first_activation'], true);// Store first activation flag in DB

            // Detect site language and set the plugin language
            $vdn_site_language_code = get_locale();

            if (!empty($vdn_site_language_code) && array_key_exists($vdn_site_language_code, self::$vdn_auto_detect_lang_map)) {
                update_option(
                    voice_dialog_navigation_settings_page::BASIC_CONFIG_OPTION_NAMES['voice'],
                    self::$vdn_auto_detect_lang_map[$vdn_site_language_code]
                );
            }

            // Generate UUID and store in DB
            $vdn_new_uuid = wp_generate_uuid4();

            if (!empty($vdn_new_uuid)) {
                update_option($vdn_db_field_names['trial_uuid'], $vdn_new_uuid);
            }

            $is_this_first_activation = true;
        }

        // Trial license key can be gained in one of the following ways:
        //      1. [Fresh Trial as first activation] -- Plugin is being installed first time.
        //      2. [Retrieve on demand while plugin active] -- License key field at 'settings' changed to 'trial'
        //      3. [Retrieve on each WP plugin activation] -- Plugin is being activated (Activation cycle after first activation) while license key field having value 'trial' at 'settings'
        if ($is_this_first_activation === true || $retrieve_trial_license === true || strtolower(trim($vdn_license_key)) == 'trial') {
            $vdn_uuid = get_option($vdn_db_field_names['trial_uuid'], null);

            // To handle uuid version upgrade
            if (empty($vdn_uuid) && strtolower(trim($vdn_license_key)) === 'trial' && !empty($vdn_first_activation)) {
                // Generate UUID and store in DB
                $vdn_uuid = wp_generate_uuid4();

                if (!empty($vdn_uuid)) {
                    update_option($vdn_db_field_names['trial_uuid'], $vdn_uuid);
                }
            }

            try {
                $body = array(
                    'url'    => !empty($vdn_uuid) ? self::$vdn_site_name.'_'.$vdn_uuid : self::$vdn_site_name,
                    'action' => 'trial',
                    'type'   => 'vdn' 
                );

                $args = array(
                    'body'        => json_encode($body),
                    'timeout'     => '60',
                    'headers'     => array(
                        'Content-Type' => 'application/json',
                        'Accept'       => 'application/json',
                        'x-api-key'    => 'jEODHPKy2z7GEIuerFBWk7a0LqVRJ7ER3aDExmbK'
                    )
                );
                
                $response = wp_remote_post('https://1kosjp937k.execute-api.us-east-1.amazonaws.com/V2/', $args);

                // Check the response code
                $response_code = wp_remote_retrieve_response_code($response);

                if ((int)$response_code === 200) {
                    $response_body = wp_remote_retrieve_body($response);
                    $result = @json_decode($response_body, true);

                    if (!empty($result) && is_array($result)) {
                        if (array_key_exists('errorMessage', $result)) {
                            update_option($vdn_db_field_names['license'], '');
                            update_option($vdn_db_field_names['aws_key'], '');
                            update_option($vdn_db_field_names['valid_until'], '');
                        } else {
                            $vdn_status_code          = !empty($result['statusCode']) ? trim($result['statusCode']) : null;;
                            $vdn_status               = !empty($result['status']) ? trim($result['status']) : null;
                            $vdn_trial_api_access_key = '';
                            $vdn_trial                = '';
                            $vdn_trial_valid_until    = '';

                            if (!is_null($vdn_status_code) && !is_null($vdn_status) && (int)$vdn_status_code == 200 && strtolower($vdn_status) == 'success') {
                                $vdn_trial_api_access_key = array_key_exists('key', $result) && !empty($result['key']) ? trim($result['key']) : '';
                                $vdn_trial_valid_until = array_key_exists('vaild_until', $result) && !empty($result['vaild_until']) ? trim($result['vaild_until']) : '';

                                if (!empty($vdn_trial_api_access_key)) {
                                    $vdn_trial = 'trial';
                                } 
                            } 

                            // Store plugin trial version data to DB
                            update_option($vdn_db_field_names['license'], $vdn_trial);
                            update_option($vdn_db_field_names['aws_key'], $vdn_trial_api_access_key);
                            update_option($vdn_db_field_names['valid_until'], $vdn_trial_valid_until);
                        }
                    }
                }
            } catch (\Exception $ex) {
                // In case of any exception clear DB fields
                update_option($vdn_db_field_names['license'], '');
                update_option($vdn_db_field_names['aws_key'], '');
                update_option($vdn_db_field_names['valid_until'], '');
            }
        }
    }

    /**
     * Function to sanitize empty variables
     *
     * @param $vdn_var - String : Variable to sanitize
     * @return 
     */
    public static function vdn_sanitize_variable_for_local_script($vdn_var = null)
    {
        if (empty($vdn_var)) {
            return null;
        } else {
            return $vdn_var;
        }
    }

    /**
     * Method to log STT service call count to local DB and Cloud
     *
     * @return JSON response obj
     */
    public function vdn_log_service_call()
    {
        check_ajax_referer('service_call_count');

        // Get license key and API key from database
        $vdn_license_key    = get_option('vd_navigation_license_key', null);
        $vdn_api_system_key = get_option('vd_navigation_api_system_key', null);
        $vdn_api_system_key = isset($vdn_api_system_key) ? trim($vdn_api_system_key) : null;
        
        // Get data from DB
        $vdn_uuid = get_option('vd_navigation_uuid', null);
        $vdn_temp_last_value = get_option('vdn_last_value', null); // To check if we are making initial service log call

        // Flag to mark valid license key been detected after trial
        $vdn_valid_license_provided = get_option('vdn_valid_license_provided', false);
        
        // Reset counters if valid license key encountered first time after trial
        if (empty($vdn_valid_license_provided) && $vdn_license_key !== 'trial' && !empty($vdn_api_system_key)) {
            update_option('vdn_valid_license_provided', true);
            update_option('vdn_current_value', 0);
            update_option('vdn_last_value', 0);
        }

        // Get values from database, HTTP request
        $vdn_do_update_last_value  = isset($_REQUEST['updateLastValue']) ? (int) $_REQUEST['updateLastValue'] : 0;
        $vdn_current_value         = (int) get_option('vdn_current_value', 0);
        $vdn_last_value            = (int) get_option('vdn_last_value', 0);
        $vdn_last_value_updated_at = get_option('vdn_last_value_updated_at', null);
        $vdn_current_value_to_log  = ($vdn_do_update_last_value == 1) ? $vdn_current_value : $vdn_current_value + 1;
        
        $vdn_log_result = array(
            'updatedAt'    => $vdn_last_value_updated_at,
            'currentValue' => $vdn_current_value,
            'lastValue'    => $vdn_last_value
        );

        try {
            // We need to reset current value count to 0 if current count log exceeds 25000
            if ($vdn_current_value_to_log > 25000) { update_option('vdn_current_value', 0); }

            // Log service count by calling cloud API if last update was before 24 hours or current count is +50 of last count
            if (is_null($vdn_temp_last_value) || $vdn_do_update_last_value === 1 || ($vdn_current_value_to_log > ($vdn_last_value + 50))) {
                $vdn_log_license_key = $vdn_license_key == "trial" ? 'trial_'.self::$vdn_site_name.'_'.$vdn_uuid : trim($vdn_license_key); 
                
                $vdn_body = array(
                    'license'      => $vdn_log_license_key,
                    'action'       => "logCalls",
                    'currentValue' => $vdn_current_value_to_log,
                    'lastValue'    => $vdn_last_value,
                );

                $vdn_args = array(
                    'body'         => json_encode($vdn_body),
                    'timeout'      => '60',
                    'headers'      => array(
                        'Content-Type' => 'application/json',
                        'Accept'       => 'application/json',
                        'x-api-key'    => 'jEODHPKy2z7GEIuerFBWk7a0LqVRJ7ER3aDExmbK'
                    )
                );

                $vdn_response = wp_remote_post( 'https://1kosjp937k.execute-api.us-east-1.amazonaws.com/V2', $vdn_args );

                // Check the response code
                $vdn_response_code = wp_remote_retrieve_response_code($vdn_response);             

                if ($vdn_response_code == 200) {
                    $vdn_response_body = wp_remote_retrieve_body($vdn_response);
                    $vdn_result = @json_decode($vdn_response_body, true);

                    if (!empty($vdn_result) && is_array($vdn_result)) {
                        $log_status = array_key_exists("status",$vdn_result) ? strtolower($vdn_result['status']) : 'failed';
                        $actual_current_value = array_key_exists("current Value",$vdn_result) ? strtolower($vdn_result['current Value']) : null;
                        $vdn_error = array_key_exists("errorMessage",$vdn_result) ? true : false;

                        if ($log_status == 'success' && is_null($actual_current_value) === false && $vdn_error === false) {
                            // Store updated values to database
                            $vdn_current_timestamp = time(); // epoc 
                            update_option('vdn_current_value', $actual_current_value);
                            update_option('vdn_last_value', $actual_current_value);
                            update_option('vdn_last_value_updated_at', $vdn_current_timestamp);

                            // Prepare response 
                            $vdn_log_result['updatedAt']    = $vdn_current_timestamp;
                            $vdn_log_result['currentValue'] = $actual_current_value;
                            $vdn_log_result['lastValue']    = $actual_current_value;
                        }
                    }
                } 
            } else {
                // Icrease current count locally
                update_option('vdn_current_value', $vdn_current_value_to_log);

                // Prepare response
                $vdn_log_result['currentValue'] = $vdn_current_value_to_log;
            }
        } catch (\Exception $ex) {
            // Do nothing for now
        }

        wp_send_json($vdn_log_result);
    }

    /**
     * Method to obtain audio file using IBM Watson TTS service
     *
     * @param string $vdn_intent_name Name of the intent 
     * @param string $vdn_response_text Response text for intent
     * @param string $vdn_voice Language/voice to be used to generate audio with
     *
     * @return Array $vdn_intent_response_audio Containing audio file related information
     */
    public static function vdn_text_to_speech( $vdn_intent_name = 'response', $vdn_response_text = "", $vdn_voice = "male_en_US", $for_custom_dialog = false)
    {
        $vdn_intent_response_audio = array(
            'path' => null,
            'voice' => null,
            'failed' => false
        );
        
        $vdn_response_text = trim($vdn_response_text);

        // Return default intent audio response for blank response text 
        if (empty($vdn_response_text)) {
            return $vdn_intent_response_audio;
        }

        $temp_audio_dir_name = VDN_PLUGIN['INTENT_AUDIO_DIR_NAME'];
        
        if ($for_custom_dialog === true) {
            $temp_audio_dir_name = VDN_PLUGIN['CUSTOM_DIALOG_AUDIO_DIR_NAME'];
            $vdn_intent_name = md5($vdn_response_text, false);
        }
        
        // Create file path and name
        $vdn_audio_dir_path  = VDN_PLUGIN['ABS_PATH'].$temp_audio_dir_name;
        $vdn_audio_file_name = $vdn_intent_name."_".time().".mp3";
        $vdn_audio_response_file_name_with_path = $vdn_audio_dir_path.$vdn_audio_file_name;

        // Set voice
        $tts_voice = self::$vdn_tts_voice_map["male_en_US"];

        try {
            $tts_voice = self::$vdn_tts_voice_map[$vdn_voice];
        } catch (\Exception $er) {
            $tts_voice = "en-US_MichaelV3Voice";
        }
        
        try {                        
            $vdn_body = array(
                'text' => $vdn_response_text
            );

            $vdn_args = array(
                'body'    => json_encode($vdn_body),
                'timeout' => '90',
                'headers' => array(
                    'Content-Type'  => 'application/json',
                    'Accept'        => 'audio/mp3',
                    'Authorization' => 'Basic '. base64_encode("apikey:".self::$vdn_voice_services_access_keys['value']['g_tts_key'])
                )
            );

            $vdn_response = wp_remote_post( 'https://api.us-south.text-to-speech.watson.cloud.ibm.com/instances/9b97d47c-0e0f-4694-926f-d61a5efa4569/v1/synthesize?voice='.$tts_voice, $vdn_args );

            // Check the response code
            $vdn_response_code = wp_remote_retrieve_response_code($vdn_response);             

            if ($vdn_response_code == 200) {
                $vdn_response_body = wp_remote_retrieve_body($vdn_response);

                /**
                 * Delete existing file(s) for the intent
                 *
                 */
                try {
                    // For PHP 4 and above
                    $vdn_mask = $vdn_intent_name."_*";
                    $vdn_existing_files_of_same_intent = glob($vdn_audio_dir_path.$vdn_mask);
                    
                    if (count($vdn_existing_files_of_same_intent) > 0) {
                        array_map('unlink', $vdn_existing_files_of_same_intent);
                    }

                    unset($vdn_existing_files_of_same_intent);
                } catch (\Exception $ex) {
                    // Do nothing for now
                }

                // Create and open file for writing contents
                $vdn_response_file = fopen($vdn_audio_response_file_name_with_path, "w");

                if ($vdn_response_file) {
                    // Write contents to the file
                    fwrite($vdn_response_file, $vdn_response_body);

                    // Close the file
                    fclose($vdn_response_file);

                    // Returning data 
                    $vdn_intent_response_audio['path'] = trim($temp_audio_dir_name.$vdn_audio_file_name); // Preserve relative path
                    $vdn_intent_response_audio['voice'] = trim($vdn_voice);                    

                    // set permissions of the file
                    chmod($vdn_audio_response_file_name_with_path , 0777);
                } else {
                    throw new Exception("Unable to create file");
                }
            } else {
                $vdn_intent_response_audio['failed'] = true;
            }
        } catch (\Exception $ex) {
            //  Reset returning data
            $vdn_intent_response_audio['path'] = null;
            $vdn_intent_response_audio['voice'] = null;

            // Delere if file created before exception
            if (file_exists($vdn_audio_response_file_name_with_path)) {
                unlink($vdn_audio_response_file_name_with_path);
            }
        }

        return $vdn_intent_response_audio;
    }

    /**
     * Method as HTTP request handler to obtain refreshed voice services token and keys
     *
     * @return JSON $vdn_refreshed_keys Containing IBM Watson STT token for now.
     *
     */
    public function vdn_refresh_access_keys()
    {
        check_ajax_referer('keys_refresh');

        self::vdn_synch_voice_access_keys(true);

        $vdn_refreshed_keys = array(
            'gStt' => self::$vdn_voice_services_access_keys['value']['g_stt_key']
        );

        wp_send_json($vdn_refreshed_keys);
    }

    /**
     * Static method to obtain access keys for Google STT & TTS and IBN Watson token
     *
     * @param boolean $forced_synch To by-pass validation to obtain token and keys from API
     *
     */
    public static function vdn_synch_voice_access_keys($forced_synch = false)
    {
        try {
            $vdn_do_synch = false;
            
            $vdn_synched_at    = self::$vdn_voice_services_access_keys['value']['synched_at'];
            $vdn_g_stt_key     = self::$vdn_voice_services_access_keys['value']['g_stt_key'];
            $vdn_g_tts_key     = self::$vdn_voice_services_access_keys['value']['g_tts_key'];

            if (
                empty($vdn_synched_at) ||
                empty($vdn_g_stt_key) ||
                empty($vdn_g_tts_key) ||
                $forced_synch === true
            ) {
                $vdn_do_synch = true;
            }

            if (!!$vdn_synched_at && $vdn_do_synch === false) {
                $vdn_synched_at_threshold = $vdn_synched_at + (60 * 60 * 6); //Add 6 hours (as epoc) to last synched at time
                $vdn_current_time = time();

                if ($vdn_current_time > $vdn_synched_at_threshold) {
                    $vdn_do_synch = true;
                }
            }

            if ($vdn_do_synch === false) return;

            $vdn_args = array(
                'timeout' => '90',
                'headers' => array(
                    'Content-Type' => 'application/json',
                    'x-api-key' => self::$vdn_api_access_key
                )
            );

            $vdn_response = wp_remote_get( self::$vdn_voice_services_access_keys['api_url'], $vdn_args );

            // Check the response code
            $vdn_response_code = wp_remote_retrieve_response_code($vdn_response);

            if ($vdn_response_code == 200) {
                $vdn_response_body = wp_remote_retrieve_body($vdn_response);
                $vdn_result = @json_decode($vdn_response_body, true);

                if (!empty($vdn_result) && is_array($vdn_result)) {
                    $vdn_google_stt_key = array_key_exists('gSTT', $vdn_result) ? $vdn_result['gSTT'] : null;
                    $vdn_google_tts_key = array_key_exists('TTS', $vdn_result) ? $vdn_result['TTS'] : null;

                    /**
                     * Deliberate separation of if blocks, do not merge them for optimization as 
                     * it would ruin the flexibility and independency of response values (none of them depend on each other anyway).
                     *
                     */
                    $vdn_synchable_local_keys = 0;

                    if (!!$vdn_google_stt_key) {
                        self::$vdn_voice_services_access_keys['value']['g_stt_key'] = $vdn_google_stt_key;
                        $vdn_synchable_local_keys += 1;
                    }

                    if (!!$vdn_google_tts_key) {
                        self::$vdn_voice_services_access_keys['value']['g_tts_key'] = $vdn_google_tts_key;
                        $vdn_synchable_local_keys += 1;
                    }

                    if ($vdn_synchable_local_keys > 0) {
                        self::$vdn_voice_services_access_keys['value']['synched_at'] = time(); //epoc
                        
                        update_option(
                            self::$vdn_voice_services_access_keys['db_col_name'],
                            self::$vdn_voice_services_access_keys['value']
                        );
                    }
                }
            }
        } catch (\Exception $ex) {
            // Nullify keys
            self::$vdn_voice_services_access_keys['value']['g_stt_key'] = null;
            self::$vdn_voice_services_access_keys['value']['g_tts_key'] = null;
            self::$vdn_voice_services_access_keys['value']['synched_at'] = null;
        }
    }

    /**
     * Static method to get custom dialog response metadata from DB
     *
     */
    public static function vdn_get_custom_responses_from_db() {
        $vdn_custom_dialog_collection = get_option(self::$vdn_custom_dialog_responses['db_col_name'], null);

        if (!!$vdn_custom_dialog_collection) {
            //#############################################################################
            // Delete custom response records missing audio file
            //#############################################################################            
            $vdn_filtered_collection = array_filter($vdn_custom_dialog_collection, function($res_obj) {
                $vdn_valid_res_obj = true;
                $vdn_res_path = array_key_exists('path', $res_obj) ? trim($res_obj['path']) : null;
                
                if (isset($vdn_res_path) && !empty($vdn_res_path) && !file_exists(VDN_PLUGIN['ABS_PATH'].$vdn_res_path)) {
                    $vdn_valid_res_obj = false;
                }

                return $vdn_valid_res_obj;
            });
            
            self::$vdn_custom_dialog_responses['collection'] = array_values($vdn_filtered_collection);
            
            // Update database if filtered collection is diverse in length
            if (count($vdn_custom_dialog_collection) !== count(self::$vdn_custom_dialog_responses['collection'])) {
                update_option(self::$vdn_custom_dialog_responses['db_col_name'], self::$vdn_custom_dialog_responses['collection']);
            }

            unset($vdn_custom_dialog_collection, $vdn_filtered_collection);
        }
    }

    /**
     * Method as HTTP request handler to make TTS process for custom dialog phrase
     *
     * @return JSON $vdn_custom_dialog_response_collection
     *
     */
    public function vdn_custom_dialog_text_to_speech()
    {
        $vdn_ajx_response = array(
            'updated_collection' => array(),
            'custom_response' => array('response' => null , 'path' => null, 'voice' => null),
            'status' => false
        );
        
        check_ajax_referer('custom_dialog');

        try {
            $vdn_speech_text = isset($_REQUEST['response_text']) ? trim($_REQUEST['response_text']) : null;

            if (empty($vdn_speech_text)) {
                wp_send_json_error($vdn_ajx_response);
            }

            $vdn_tts_response = self::vdn_text_to_speech('customDialog', $vdn_speech_text, self::$vdn_voice, true);

            if (array_key_exists('failed', $vdn_tts_response) && $vdn_tts_response['failed'] === true) {
                unset($vdn_tts_response['failed']);
                wp_send_json_error($vdn_ajx_response);
            }

            if (
                array_key_exists('path', $vdn_tts_response) &&
                isset($vdn_tts_response['path']) &&
                !empty(trim($vdn_tts_response['path']))
            ) {
                $vdn_ajx_response['custom_response']['response'] = $vdn_speech_text;
                $vdn_ajx_response['custom_response']['path'] = trim($vdn_tts_response['path']);
                $vdn_ajx_response['custom_response']['voice'] = $vdn_tts_response['voice'];
                $vdn_ajx_response['status'] = true;

                //#############################################################################
                // Delete old custom response record with the same phrase
                //#############################################################################
                $vdn_filtered_collection = array_filter(self::$vdn_custom_dialog_responses['collection'], function($res_arr) use ($vdn_speech_text) {
                    $vdn_valid_res_arr = true;
                    $vdn_existing_res = array_key_exists('response', $res_arr) ? trim($res_arr['response']) : null;

                    if ($vdn_existing_res == $vdn_speech_text) {
                        $vdn_valid_res_arr = false;
                        $vdn_res_path = array_key_exists('path', $res_arr) ? trim($res_arr['path']) : null;

                        // If audio file exist for it then delete
                        if (!empty($vdn_res_path) && file_exists(VDN_PLUGIN['ABS_PATH'].$vdn_res_path)) {
                            unlink(VDN_PLUGIN['ABS_PATH'].$vdn_res_path);
                        }
                    }

                    return $vdn_valid_res_arr;
                });

                self::$vdn_custom_dialog_responses['collection'] = array_values($vdn_filtered_collection);

                //################################################################################################################
                // If max slots limit of cache/collection is already reached.
                // ..then delete least used/accessed/played existing custom response to make space for new phrase/custom response
                //################################################################################################################
                if (count(self::$vdn_custom_dialog_responses['collection']) === VDN_PLUGIN['CUSTOM_DIALOG_SLOTS_LIMIT']) {
                    $vdn_older_timestamp = null;
                    $vdn_least_accessed_record_index = null;                    

                    foreach (self::$vdn_custom_dialog_responses['collection'] as $record_index => $res_arr) {
                        $vdn_existing_path = array_key_exists('path', $res_arr) ? VDN_PLUGIN['ABS_PATH'].trim($res_arr['path']) : null;
                        $vdn_file_last_accessed = !empty($vdn_existing_path) ? fileatime($vdn_existing_path) : null;
                        
                        if (
                            $vdn_file_last_accessed !== false &&
                            (empty($vdn_older_timestamp) || ($vdn_file_last_accessed < $vdn_older_timestamp))
                        ) {
                            $vdn_older_timestamp = $vdn_file_last_accessed;
                            $vdn_least_accessed_record_index = $record_index;
                        }
                    }

                    //#############################################################################################
                    // NOTE: 
                    // Case 1: Due to performance issue some platforms like unix do disable 'fileatime' function
                    // Case 2: On windows server 'fileatime' function might return 0 always
                    // 
                    // So file access time would not be always in place.
                    // In such situation we have to make space in collection for new custom response by removing
                    // first record.
                    //#############################################################################################
                    if (empty($vdn_least_accessed_record_index)) {
                        $vdn_least_accessed_record_index = 0;
                    }

                    $vdn_potentially_least_used_record = self::$vdn_custom_dialog_responses['collection'][$vdn_least_accessed_record_index];
                    $vdn_res_path = array_key_exists('path', $vdn_potentially_least_used_record) ? trim($vdn_potentially_least_used_record['path']) : null;

                    // Delete audio file
                    if (!empty($vdn_res_path) && file_exists(VDN_PLUGIN['ABS_PATH'].$vdn_res_path)) {
                        unlink(VDN_PLUGIN['ABS_PATH'].$vdn_res_path);
                    }

                    // Remove record from collection
                    array_splice(self::$vdn_custom_dialog_responses['collection'], $vdn_least_accessed_record_index, 1);
                    unset($vdn_older_timestamp, $vdn_least_accessed_record_index, $vdn_potentially_least_used_record, $vdn_res_path);
                }

                // Push new custom dialog into existing collection
                array_push(self::$vdn_custom_dialog_responses['collection'], $vdn_ajx_response['custom_response']);
                
                // Prepare updated collection to be sent back to client
                $vdn_ajx_response['updated_collection'] = self::$vdn_custom_dialog_responses['collection'];

                // update database
                update_option(self::$vdn_custom_dialog_responses['db_col_name'], self::$vdn_custom_dialog_responses['collection']);
                
                unset($vdn_tts_response, $vdn_filtered_collection);
            }
        } catch(\Exception $ex) {
            $vdn_ajx_response = array(
                'updated_collection' => array(),
                'custom_response' => array('response' => null , 'path' => null, 'voice' => null),
                'status' => false
            );

            wp_send_json_error($vdn_ajx_response);
        }

        wp_send_json_success($vdn_ajx_response);
    }

    /**
     * Method as HTTP request handler to perform TTS process
     *
     * @return JSON response
     *
     */
    public function vdn_synthsize_text()
    {
        check_ajax_referer('js_ajax_tts');

        // For dialog response change
        $vdn_is_end_user = isset($_REQUEST['user']) ? trim($_REQUEST['user']) : null;
        $vdn_dialog_text = isset($_REQUEST['dialog_text']) ? trim($_REQUEST['dialog_text']) : null;
        $vdn_dialog_option_db_name = isset($_REQUEST['dialog_op_name']) ? trim($_REQUEST['dialog_op_name']) : null;
        $vdn_new_voice = isset($_REQUEST['voice_for_synth']) ? trim($_REQUEST['voice_for_synth']) : null;
        
        if (empty($vdn_dialog_text) || empty($vdn_dialog_option_db_name)) {
            wp_send_json_error(array('code'=> 'VDN_ERROR_1', 'error'=> 'Required parameters are missing.'));
        }

        $vdn_is_valid_option_name = array_key_exists($vdn_dialog_option_db_name, self::$vdn_generic_dialog_dboptionname_to_intentname_map);

        if (!$vdn_is_valid_option_name) {
            wp_send_json_error(array('code'=> 'VDN_ERROR_2', 'error'=> 'You are trying to configure dialog which does not exist.'));
        }

        $vdn_intent_name = self::$vdn_generic_dialog_dboptionname_to_intentname_map[$vdn_dialog_option_db_name];
        
        $vdn_intent_audio_response_data = self::vdn_text_to_speech(
            $vdn_intent_name,
            $vdn_dialog_text,
            isset($vdn_new_voice) && !empty($vdn_new_voice) ? $vdn_new_voice : self::$vdn_voice
        );

        // ##################################################################################################
        // If TTS service failed might be due to expired 'key' then we are going to re-obtain it here.
        // 
        // NOTES:
        // * By means of use case this will not generate new audio responses.
        // * Also not going to save new value to DB as we are breaking up the flow.
        // ##################################################################################################
        if (array_key_exists('failed', $vdn_intent_audio_response_data) && $vdn_intent_audio_response_data['failed'] === true) {
            self::vdn_synch_voice_access_keys(true);
            unset($vdn_intent_audio_response_data['failed']);
            wp_send_json_error(array('code'=> 'VDN_ERROR_3', 'error'=> 'Something went wrong. Please try again after the page reload.'));
        }

        $vdn_audio_path = array_key_exists('path', $vdn_intent_audio_response_data) ? trim($vdn_intent_audio_response_data['path']) : null;

        if (!empty($vdn_audio_path) && file_exists(VDN_PLUGIN['ABS_PATH'].$vdn_audio_path)) {
            $vdn_dialog_old_data = get_option($vdn_dialog_option_db_name, array());

            // Store updated dialog data to DB
            $vdn_dialog_old_data['intent_audio_response'] = $vdn_intent_audio_response_data;
            update_option($vdn_dialog_option_db_name, $vdn_dialog_old_data);

            // #########################################################################################################################################
            // To send updated generic dialogs and generic dialog against which new audio been generated in response to end user request from front end
            // #########################################################################################################################################
            if (!empty($vdn_is_end_user)) {
                $vdn_temp_intents_data = self::get_configured_intents_from_DB();
                $vdn_updated_generic_dialogs = array_key_exists('intents', $vdn_temp_intents_data) ? $vdn_temp_intents_data['intents'] : array();
                
                $vdn_intent_audio_response_data['updated_generic_dialogs'] = $vdn_updated_generic_dialogs;

                unset($vdn_temp_intents_data, $vdn_updated_generic_dialogs);
            }

            unset(
                $vdn_dialog_text,
                $vdn_dialog_option_db_name,
                $vdn_intent_name,
                $vdn_audio_path
            );

            wp_send_json_success($vdn_intent_audio_response_data);   
        } else {
            unset(
                $vdn_dialog_text,
                $vdn_dialog_option_db_name,
                $vdn_intent_name,
                $vdn_intent_audio_response_data,
                $vdn_audio_path
            );

            wp_send_json_error(array('code'=> 'VDN_ERROR_4', 'error'=> 'Please try again later.'));
        }
    }


}
