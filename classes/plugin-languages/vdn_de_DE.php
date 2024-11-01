<?php
class vdn_de_DE {
    // Class constants
    const VDN_LANGUAGE_LIB = array(
        'basicConfig' => array(
            'basicConfiguration'  => 'Basic Konfiguration',
            'autoTimeoutDuration' => 'Auto-Timeout-Dauer (in Sekunden) maximum Aufnahmezeit. Geben Sie einen Wert zwischen 8 und 20 ein',
            'selectLanguage'      => 'Stimme auswählen', 
            'dialogType'          => array(
                'genericDialog' => 'Allgemeiner Dialog',
                'customDialog'  => 'Benutzerdefinierter Dialog'
            ),
            'licenseKey'          => 'Lizenz',
            'googleAnalytics'     => 'Senden Sie eine Nutzeranfrage und eine Antwort von Simon / Simone an Ihr Google Analytics-Konto',
            'gaInfo' => array(
                'general' => 'Auf Ihrer Webseite muss ein aktives Google Analytics-Konto und ein Tracking-Code-Snippet installiert sein, damit die Konversation zwischen dem Nutzer und Simon / Simone in Ihrem Google Analytics-Konto angezeigt werden kann.',
                'location' => 'Das Konversationsprotokoll wird in Ihrem Google Analytics-Konto unter angezeigt'
            ),
            'nativeSearch'        => 'Deaktivieren AI suche <i>(Während der Suche durch Drücken der Eingabetaste / einreichen taste / Suche taste)</i>',
            'disableSearchMic'    => 'Mikrofon in Suchfeldern deaktivieren',
            'disableFormsMic'     => 'Deaktivieren Sie das Mikrofon in Formularen',
            'userSearchableHints' => 'Vom Benutzer durchsuchbare Hinweise',
            'NoteSearchableHints' => array(
                'pleaseEnter'        => 'Bitte geben Sie ein',
                'semicolonSeparated' => 'Strichpunkt getrennte Anweisungsliste als Hinweis für den Endbenutzer. Eine Aussage ohne Ende mit', 
                'semicolonWillBe'    => 'Strichpunkt wird als einziger Hinweis betrachtet. Eine dieser Anweisungen wird zufällig als Hinweis angezeigt, wenn ein Benutzer auf das Mikrofon klickt oder die Maus über das Mikrofon bewegt, um einen Benutzer darauf aufmerksam zu machen, wie er die Mikrofoneigenschaft für die Sprachsuche verwenden kann.'
            ),
            'saveSettings'        => 'Speichern',
            'endpointURL'         => 'Endpunkt-URL',
            'copyYourLicenseKey'  => 'Kopieren Sie hier Ihre Lizenz. Sie können sich unter speak2web.com/wp anmelden',
            'enterYourCustom'     => 'Geben Sie Ihre benutzerdefinierte Endpunkt-URL ein',
            'enterSeparated'      => "Eingeben ' ; 'getrennte Liste der durchsuchbaren Hinweise für den Benutzer",
            'floatingMicOptions'  => 'Floating Mic-Optionen',
            'selectFloatingMicPosition' => 'Floating Mic Position',
            'floatingButtonIconLabel' => 'Schwimmende Schaltflächensymbol',
            'gaErrorMessage' => "Ihr Google Analytics-Tracking-ID-Format ist ungültig."
        ),

        'dialogConfig' => array(
            'dialogConfiguration'   => 'Dialog Konfiguration',
            'eachCheckbox'          => 'Jedes Kontrollkästchen vor dem Namen des Dialogfelds aktiviert / deaktiviert dieses Dialogfeld für die AI-basierte Suche. Durch Deaktivieren wird die native Suche danach ausgelöst.',
            'aboutYourCompany'      => 'Über Ihre Firma',
            'contactUs'             => 'Kontaktiere uns',
            'openingHours'          => 'Öffnungszeiten',
            'blog'                  => 'Blog',
            'news'                  => 'Nachrichten',
            'services'              => 'Dienstleistungen',
            'overview'              => 'Überblick',
            'gallery'               => 'Galerie',
            'address'               => 'Adresse',
            'products'              => 'Produkte',
            'solutions'             => 'Lösungen',
            'team'                  => 'Mannschaft',
            'plans'                 => 'Pläne',
            'pricesCost'            => 'Preise / Kosten',
            'whereToBuy'            => 'Wo zu kaufen',
            'myAccount'             => 'Mein Konto',
            'howToPay'              => 'Zahlungsarten',
            'returns'               => 'Rückgabe',
            'support'               => 'Hilfe',
            'downloads'             => 'Downloads',
            'referencesCustomers'   => 'Referenzenkunden',
            'videos'                => 'Videos',
            'productDocumentation'  => 'Produktdokumentation',
            'scheduleAppointment'   => 'Termin vereinbaren',
            'requestDemo'           => 'Demo anfordern' ,
            'howDoesTtWork'         => 'Wie funktioniert es',
            'pressCoverage'         => 'Pressemitteilungen',
            'cancelMyAccount'       => 'Mein Konto kündigen',
            'enterYourResponseHere' => 'Geben Sie hier Ihre Antwort ein',
            'urlInfo'               => array(
                'isPreconfigured' => 'ist eine vorkonfigurierte generische URL für das Dialogfeld',
                'dialog'          => '.',
                'ifYouWantTo'     => 'Wenn Sie ein anderes angeben möchten, konfigurieren Sie es im URL-Feld unten.'
            ),
            'uncheckingThisBox'    => 'Durch Deaktivieren dieses Kontrollkästchens wird die Suche nicht als KI, sondern als native Suche ausgeführt',
            'dialogSaveButton'     => 'Konfigurieren ',
            'audioUnavailableText' => "<b>Hinweis:</b> Die Audioantwort ist für diesen Dialog nicht konfiguriert. Ändern Sie den Antworttext und klicken Sie auf die Schaltfläche 'Konfigurieren', um eine Audioantwort zu generieren."
        ),
        'other' =>  array(
            'notConfigureAnyDialog' => array(
                'notConfigure'      => 'Sie haben noch keinen Dialog konfiguriert. Sie können ',
                'here'              => 'hier ',
                'desiredResponse'   => 'die gewünschte Antwort konfigurieren, die als Audio abgespielt werden soll, und eine URL, die den Benutzer zur gewünschten Seite navigiert.'
            ),
            'licenseKeyInvalid'  => array(
                'yourLicenseKeyInvalid' => 'Ihr Lizenzschlüssel ist ungültig oder abgelaufen. Testen Sie ',
                'here'                  => 'hier',
                'toBuyOrRenew'          => 'unsere Pläne, um Ihre Lizenz zu kaufen oder zu verlängern. Eine gültige Lizenz ist erforderlich, um die Plug-in-Funktionen nutzen zu können.'
            ),
            'trialNotice' => array(
                'expired' => array(
                    'str1' => 'zeitraum hat gewesen',
                    'str2' => 'Über',
                ),
                'underTrial' => array(
                    'str1' => 'zeitraum gültig bis',
                    'str2' => 'verbleibende tage.'
                ),
                'lastDay' => array(
                    'str1' => 'läuft',
                    'str2' => 'heute ab'
                ),
                'common' => array(
                    'str1'        => 'Kostenlose Testversion',
                    'fullLicense' => 'um die vollständige Lizenz zu erhalten.',
                    'mailUs'      => 'oder mailen Sie uns beim'
                ),
            ),
            'common' => array(
                'str1' => 'Klicken sie',
                'str2' => 'hier'
            ),
            'videoHelp' => ', um zu erfahren, wie Sie das Plugin konfigurieren.',
            'nonHttpsNotice' => "Nicht sicher! Sie befinden sich auf einer Nicht-HTTPS-Site, die den Mikrofonzugriff einschränkt.",
            'synthesizingMessage' => "Bitte warten Sie, während wir Ihren Dialogtext in Audio-Sprache umwandeln.",
            'synthesizingHeader' => "synthetisieren...",
            'audioRegenerateNotice' => array(
                'noticeText' => ' Generische dialoge fehlt audio rede.',
                'buttonText' => 'Klicken zu generieren rede'
            )
        )
    );
}