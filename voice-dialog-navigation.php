<?php
/**
 * Plugin Name: Voice Dialog – Navigation
 * Description: Allows visitors to engage into an intelligent dialog with the web page. Visitor can ask questions, get answers and use voice to navigate the web page, both on desktop and mobile.
 * Version:     3.2.0
 * Author:      speak2web
 * Author URI:  https://speak2web.com/
 * Text Domain: voice-dialog-navigation
 * Domain Path: /languages
 */

/**
 * Copyright (c) 2019 speak2web
 *
 * Voice Dialog – Navigation is free software; you can redistribute it and/or modify
 * it under the terms of the GNU General Public License, version 2 or, at
 * your discretion, any later version, as published by the Free
 * Software Foundation.
 *
 * Voice Dialog – Navigation is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with Voice Dialog – Navigation; if not, write to the Free Software
 * Foundation, Inc., 51 Franklin St, Fifth Floor, Boston, MA  02110-1301  USA
 */

defined( 'WPINC' ) or die;

include_once( dirname( __FILE__ ) . '/lib/requirements-check.php' );

$voice_dialog_navigation_requirements_check = new Voice_Dialog_Navigation_Requirements_Check( array(
    'title' => 'Voice Dialog – Navigation',
    'php'   => '5.3',
    'wp'    => '2.6',
    'file'  => __FILE__,
));

if ( $voice_dialog_navigation_requirements_check->passes() ) {
    
    $vdn_client_info = array(
        'chrome' => false,
        'firefox' => false,
        'edge' => false,
        'ie' => false,
        'macSafari' => false,
        'iosSafari' => false,
        'opera' => false
    );

    // Chrome
    if(stripos($_SERVER['HTTP_USER_AGENT'], 'chrome') !== false) {
        $vdn_client_info['chrome'] = true;
    }

    // Firefox
    if(stripos($_SERVER['HTTP_USER_AGENT'], 'firefox') !== false) {
        $vdn_client_info['firefox'] = true;
    }

    // Edge
    if(stripos($_SERVER['HTTP_USER_AGENT'], 'edge') !== false || stripos($_SERVER['HTTP_USER_AGENT'], 'edg') !== false) {
        $vdn_client_info['edge'] = true;
    }

    // IE
    if(stripos($_SERVER['HTTP_USER_AGENT'], 'msie') !== false || stripos($_SERVER['HTTP_USER_AGENT'], 'trident') !== false) {
        $vdn_client_info['ie'] = true;
    }

    // Mac Safari
    if(stripos($_SERVER['HTTP_USER_AGENT'], 'macintosh') !== false && stripos($_SERVER['HTTP_USER_AGENT'], 'chrome') === false && stripos($_SERVER['HTTP_USER_AGENT'], 'safari') !== false) {
        $vdn_client_info['macSafari'] = true;
    }

    // iOS
    if((stripos($_SERVER['HTTP_USER_AGENT'], 'iphone') !== false || stripos($_SERVER['HTTP_USER_AGENT'], 'ipad') !== false || stripos($_SERVER['HTTP_USER_AGENT'], 'ipod') !== false) && stripos($_SERVER['HTTP_USER_AGENT'], 'safari') !== false) {
        $vdn_client_info['iosSafari'] = true;
    }

    // Opera
    if(stripos($_SERVER['HTTP_USER_AGENT'], 'opera') !== false || stripos($_SERVER['HTTP_USER_AGENT'], 'opr') !== false) {
        $vdn_client_info['opera'] = true;
    }

    if ($vdn_client_info['chrome'] === true && ($vdn_client_info['opera'] === true || $vdn_client_info['edge'] === true)) {
        $vdn_client_info['chrome'] = false;
    }

    define('VDN_CLIENT', $vdn_client_info);

    
    // To get all active plugins.
    $vdn_all_active_plugins = (array) null;
    
    // Get voice from DB and load local translation library
    $vdn_voice = get_option( 'vd_navigation_voice', 'male_en_US' );
    $vdn_voice = empty($vdn_voice) ? 'male_en_US' : trim($vdn_voice);
    $vdn_language_file_name = ($vdn_voice === 'male_de_DE' || $vdn_voice === 'female_de_DE') ? 'vdn_de_DE' : 'vdn_en_EN';
    include_once( dirname( __FILE__ ) . '/classes/plugin-languages/'.$vdn_language_file_name.'.php');

    try {
        switch ($vdn_voice) {
            case 'male_de_DE':
            case 'female_de_DE':
                define('VDN_LANGUAGE_LIBRARY', vdn_de_DE::VDN_LANGUAGE_LIB);
                break;
            default:
                define('VDN_LANGUAGE_LIBRARY', vdn_en_EN::VDN_LANGUAGE_LIB);
        }
    } catch (\Exception $e) {
        // Do nothing for now
    }

    define('VDN_PLUGIN', array(
        'ABS_PATH' => plugin_dir_path(__FILE__),
        'ABS_URL' => plugin_dir_url(__FILE__),
        'BASE_NAME' => plugin_basename( __FILE__ ),
        'INTENT_AUDIO_DIR_NAME' => 'generic_dialog_response/',
        'CUSTOM_DIALOG_AUDIO_DIR_NAME' => 'custom_dialog_response/',
        'CUSTOM_DIALOG_SLOTS_LIMIT' => 200,
    ));

    // Pull in the plugin classes and initialize
    include_once( dirname( __FILE__ ) . '/lib/wp-stack-plugin.php' );
    include_once( dirname( __FILE__ ) . '/classes/plugin.php' );
    include_once( dirname( __FILE__ ) . '/classes/settings-page.php' );
    include_once( dirname( __FILE__ ) . '/classes/languages/languages.php');


    Voice_Dialog_Navigation_Plugin::start( __FILE__ );

    // Hook into plugin activation
    register_activation_hook(__FILE__, function() {
        // To burst cache for JS and CSS files
        voice_dialog_navigation_settings_page::vdn_settings_modified_timestamp('set');
        
        // Obtain trial license
        Voice_Dialog_Navigation_Plugin::vdn_get_trial_license();

        // Get access keys from DB before generating audio responses as access keys will not be available from here.
        Voice_Dialog_Navigation_Plugin::vdn_get_access_keys_from_db();

        // Get active plugins
        $vdn_all_active_plugins = get_option('active_plugins');

        // Get lower version active plugin's paths
        $vf_path = vdn_get_active_plugin_path('voice-forms', $vdn_all_active_plugins);
        $vdn_path = vdn_get_active_plugin_path('universal-voice-search', $vdn_all_active_plugins);

        // Deactivate 'Voice Forms' plugin
        if (!empty($vf_path) && is_plugin_active($vf_path)) {
            deactivate_plugins($vf_path);
        }

        // Deactivate 'Universal Voice Search' Plugin
        if (!empty($vdn_path) && is_plugin_active($vdn_path)) {
            deactivate_plugins($vdn_path);
        }
    });

    /**
     * Function to get path of active plugin
     *
     * @param $vdn_plugin_file_name  String  Name of the plugin file (Without extension)
     * @param $vdn_active_plugins  Array  Array of active plugins path
     *
     * @return $vdn_active_plugin_path  String  Path of active plugin otherwise NULL
     *
     */
    function vdn_get_active_plugin_path($vdn_plugin_file_name = "", $vdn_active_plugins = array()) {
        $vdn_active_plugin_path = null;

        try {
            if (!!$vdn_active_plugins && !!$vdn_plugin_file_name) {
                $vdn_plugin_file_name = trim($vdn_plugin_file_name);

                foreach ($vdn_active_plugins as $key => $active_plugin) {
                    $plugin_name_pos = stripos($active_plugin, $vdn_plugin_file_name.".php");

                    if ($plugin_name_pos !== false) {
                        $vdn_active_plugin_path = $active_plugin;
                        break;
                    }
                }
            }
        } catch(\Exception $ex) {
            $vdn_active_plugin_path = null;
        }
        
        return $vdn_active_plugin_path;
    }
}

unset( $voice_dialog_navigation_requirements_check );
