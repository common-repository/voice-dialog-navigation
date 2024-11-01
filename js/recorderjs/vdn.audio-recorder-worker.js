// *****************************************************************************************************
// *******              speak2web VOICE DIALOG NAVIGATION                                    ***********
// *******               AI Service requires subcriptions                                    ***********
// *******               Get your subscription at                                            ***********
// *******                    https://speak2web.com/plugin#plans                             ***********
// *******               Need support? https://speak2web.com/support                         ***********
// *******               Licensed GPLv2+                                                     ***********
//******************************************************************************************************

var vdnRecLength = 0,
vdnRecBuffersL   = [],
vdnRecBuffersR   = [],
vdnSampleRate;

this.onmessage = function (e) {
    switch (e.data.command) {
        case 'vdnInit':
            vdnInit(e.data.config);
            break;
        case 'vdnRecord':
            vdnRecord(e.data.buffer);
            break;
        case 'vdnExportWAV':
            vdnExportWAV(e.data.type);
            break;
        case 'vdnExportMonoWAV':
            vdnExportMonoWAV(e.data.type);
            break;
        case 'vdnGetBuffers':
            vdnGetBuffers();
            break;
        case 'vdnClear':
            vdnClear();
            break;
    }
};

function vdnInit(config) {
    vdnSampleRate = config.sampleRate;
}

function vdnRecord(inputBuffer) {
    vdnRecBuffersL.push(inputBuffer[0]);
    vdnRecBuffersR.push(inputBuffer[1]);
    vdnRecLength += inputBuffer[0].length;
}

function vdnExportWAV(type) {
    let vdnBufferL     = vdnMergeBuffers(vdnRecBuffersL, vdnRecLength);
    let vdnBufferR     = vdnMergeBuffers(vdnRecBuffersR, vdnRecLength);
    let vdnInterleaved = vdnInterleave(vdnBufferL, vdnBufferR);
    let vdnDataview    = vdnEncodeWAV(vdnInterleaved);
    let vdnAudioBlob   = new Blob([vdnDataview], { 'type': type });

    this.postMessage(vdnAudioBlob);
}

function vdnExportMonoWAV(type) {
    let vdnBufferL   = vdnMergeBuffers(vdnRecBuffersL, vdnRecLength);
    let vdnDataview  = vdnEncodeWAV(vdnBufferL, true);
    let vdnAudioBlob = new Blob([vdnDataview], { 'type': type });

    this.postMessage(vdnAudioBlob);
}

function vdnGetBuffers() {
    let vdnBuffers = [];
    vdnBuffers.push(vdnMergeBuffers(vdnRecBuffersL, vdnRecLength));
    vdnBuffers.push(vdnMergeBuffers(vdnRecBuffersR, vdnRecLength));
    this.postMessage(vdnBuffers);
}

function vdnClear() {
    vdnRecLength   = 0;
    vdnRecBuffersL = [];
    vdnRecBuffersR = [];
}

function vdnMergeBuffers(recBuffers, recLength) {
    let vdnResult = new Float32Array(recLength);
    let vdnOffset = 0;
    let vdnRecBuffersLength = recBuffers.length;

    for (var i = 0; i < vdnRecBuffersLength; i++) {
        vdnResult.set(recBuffers[i], vdnOffset);
        vdnOffset += recBuffers[i].length;
    }
    return vdnResult;
}

function vdnInterleave(inputL, inputR) {
    var vdnLength = inputL.length + inputR.length;
    var vdnResult = new Float32Array(vdnLength);

    var vdnIndex = 0,
        vdnInputIndex = 0;

    while (vdnIndex < vdnLength) {
        vdnResult[vdnIndex++] = inputL[vdnInputIndex];
        vdnResult[vdnIndex++] = inputR[vdnInputIndex];
        vdnInputIndex++;
    }
    return vdnResult;
}

function vdnFloatTo16BitPCM(output, offset, input) {
    let vdnInputLength = input.length;

    for (let i = 0; i < vdnInputLength; i++ , offset += 2) {
        let s = Math.max(-1, Math.min(1, input[i]));
        output.setInt16(offset, s < 0 ? s * 0x8000 : s * 0x7FFF, true);
    }
}

function vdnWriteString(view, offset, string) {
    let vdnStringLength = string.length;
    
    for (var i = 0; i < vdnStringLength; i++) {
        view.setUint8(offset + i, string.charCodeAt(i));
    }
}

function vdnEncodeWAV(samples, mono) {
    let vdnBuffer = new ArrayBuffer(44 + samples.length * 2);
    let vdnView   = new DataView(vdnBuffer);

    /* RIFF identifier */
    vdnWriteString(vdnView, 0, 'RIFF');
    /* file length */
    vdnView.setUint32(4, 32 + samples.length * 2, true);
    /* RIFF type */
    vdnWriteString(vdnView, 8, 'WAVE');
    /* format chunk identifier */
    vdnWriteString(vdnView, 12, 'fmt ');
    /* format chunk length */
    vdnView.setUint32(16, 16, true);
    /* sample format (raw) */
    vdnView.setUint16(20, 1, true);
    /* channel count */
    vdnView.setUint16(22, mono ? 1 : 2, true);
    /* sample rate */
    vdnView.setUint32(24, vdnSampleRate, true);
    /* byte rate (sample rate * block align) */
    vdnView.setUint32(28, vdnSampleRate * 4, true);
    /* block align (channel count * bytes per sample) */
    vdnView.setUint16(32, 4, true);
    /* bits per sample */
    vdnView.setUint16(34, 16, true);
    /* data chunk identifier */
    vdnWriteString(vdnView, 36, 'data');
    /* data chunk length */
    vdnView.setUint32(40, samples.length * 2, true);

    vdnFloatTo16BitPCM(vdnView, 44, samples);

    return vdnView;
}
