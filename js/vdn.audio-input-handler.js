// *****************************************************************************************************
// *******              speak2web VOICE DIALOG NAVIGATION                                    ***********
// *******               AI Service requires subcriptions                                    ***********
// *******               Get your subscription at                                            ***********
// *******                    https://speak2web.com/plugin#plans                             ***********
// *******               Need support? https://speak2web.com/support                         ***********
// *******               Licensed GPLv2+                                                     ***********
//******************************************************************************************************


window.AudioContext = window.AudioContext || window.webkitAudioContext;

let vdnAudioContext = null;
var vdnAudioInput   = null,
vdnRealAudioInput   = null,
vdnInputPoint       = null,
vdnAudioRecorder    = null;
var vdnRecIndex     = 0;
var vdnInitCB       = null;
let vdnStream       = null;

/**
 * Function to initialize capture audio resources
 * 
 * @param { cb: function } A callback function
 */
function vdnInitAudio(cb) {
    vdnInitCB = cb;

    // Check when last service log was updated
    try {
        let vdnLastUpdatedAtTimestamp = vdnServiceLogs.updatedAt || null;

        if (!!vdnLastUpdatedAtTimestamp) {
            vdnLastUpdatedAtTimestamp = Number(vdnLastUpdatedAtTimestamp);
            let currentUtcTimestamp = Math.round(new Date().getTime()/1000);

            // Add 24 hours to last updated timestamp
            vdnLastUpdatedAtTimestamp = vdnLastUpdatedAtTimestamp + (24 * 3600);

            // Check if last service call log update was older than 24 hours
            if (currentUtcTimestamp >= vdnLastUpdatedAtTimestamp) {
                // Log service call count                
                vdnLogServiceCall(1);
            }
        }
    } catch (err) {
        // do nothing for now
    }

    vdnAudioContext = new AudioContext();
    navigator.mediaDevices.getUserMedia({ "audio": !0 })
        .then(vdnGotStream)
        .catch(function (e) {
            //alert('Error getting audio');
            console.log(e);
        }
    );
}

/**
 * A callback function to obtain audio stream
 * 
 * @param { stream: MediaStream } An audio track 
 */
function vdnGotStream(stream) {
    vdnInputPoint = vdnAudioContext.createGain();
    vdnStream = stream;

    // Create an AudioNode from the stream.
    vdnRealAudioInput = vdnAudioContext.createMediaStreamSource(stream);
    vdnAudioInput     = vdnRealAudioInput;
    vdnAudioInput.connect(vdnInputPoint);
    
    vdnAudioRecorder = new Recorder(vdnInputPoint);
    vdnInitCB(vdnAudioRecorder);
}

/**
 * A callback function to obtain audio stream
 * 
 * @param { buffers: Blob Object }
 * @param { cb: function } A callback function
 */
function vdnGotBuffers(buffers, cb) {
    vdnAudioRecorder.exportWAV(cb);
}

/**
 * Function to stop accessing audio resource
 *
 */
function vdnStopAudio() {
    try {
        vdnStream.getTracks().forEach(function (track) {
            track.stop();
        });

        vdnAudioContext.close();    
        vdnAudioContext = null;
    } catch(err) {
        console.log('VDN Exception: Unable to release audio resource due to: ' + err.message);
    }
}