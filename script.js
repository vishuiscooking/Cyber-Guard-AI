const URL = "./tm-my-image-model/";   // ← exactly matches the folder name
const alertDiv = document.getElementById("alert");
let model, webcam;

const THRESHOLD = 0.8;

async function init() {
  model = await tmImage.load(URL + "model.json", URL + "metadata.json");
  alertDiv.textContent = "✅ Model loaded. Initializing camera...";

  webcam = new tmImage.Webcam(320, 240, true); // flip = true
  await webcam.setup();
  await webcam.play();
  document.getElementById("webcam").srcObject = webcam.webcam.captureStream();

  alertDiv.textContent = "📷 Webcam active. Scanning...";
  window.requestAnimationFrame(loop);
}

async function loop() {
  webcam.update();
  const predictions = await model.predict(webcam.canvas);

  let message = "✅ All clear";
  for (let p of predictions) {
    const label = p.className.toLowerCase();
    const prob = p.probability;

    if (label.includes("stop") && prob > THRESHOLD) {
      message = "✋ STOP gesture detected! Halting activity.";
    }
    if (label.includes("cover") && prob > THRESHOLD) {
      message = "⚠️ Webcam covered – possible tampering!";
    }
  }

  alertDiv.textContent = message;
  window.requestAnimationFrame(loop);
}

init();
