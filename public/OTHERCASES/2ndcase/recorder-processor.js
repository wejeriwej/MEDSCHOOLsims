// recorder-processor.js
class RecorderProcessor extends AudioWorkletProcessor {
  process(inputs) {
    const input = inputs[0][0]; // single channel
    if (input) this.port.postMessage(input); // send audio to main thread
    return true;
  }
}

registerProcessor('recorder-processor', RecorderProcessor);
