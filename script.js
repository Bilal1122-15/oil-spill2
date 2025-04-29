document.getElementById("startButton").addEventListener("click", function () {
  document.getElementById("welcome-screen").style.display = "none";
  document.getElementById("main-content").style.display = "block";
});

// عرض حقل إدخال الكثافة عند اختيار "مخصص"
document.getElementById("oilType").addEventListener("change", function() {
  document.getElementById("customDensityContainer").style.display = this.value === "custom" ? "block" : "none";
});

// تحليل الصور والتأكد من أنها تحتوي على بقعة نفط
function processImage() {
  let inputElement = document.getElementById("imageUpload");
  let file = inputElement.files[0];

  if (!file) {
    alert("⚠️ الرجاء رفع صورة للتحليل.");
    return;
  }

  let img = new Image();
  img.src = URL.createObjectURL(file);
  img.onload = function () {
document.getElementById("startButton").addEventListener("click", function () {
  document.getElementById("welcome-screen").style.display = "none";
  document.getElementById("main-content").style.display = "block";
});

// عرض حقل إدخال الكثافة عند اختيار "مخصص"
document.getElementById("oilType").addEventListener("change", function() {
  document.getElementById("customDensityContainer").style.display = this.value === "custom" ? "block" : "none";
});

// تحليل الصور والتأكد من أنها تحتوي على بقعة نفط
function processImage() {
  let inputElement = document.getElementById("imageUpload");
  let file = inputElement.files[0];

  if (!file) {
    alert("⚠️ الرجاء رفع صورة للتحليل.");
    return;
  }

  let img = new Image();
  img.src = URL.createObjectURL(file);
  img.onload = function () {
    let mat = cv.imread(img);
    cv.cvtColor(mat, mat, cv.COLOR_RGBA2GRAY, 0);
    cv.GaussianBlur(mat, mat, new cv.Size(5, 5), 0, 0);
    
    let avgColor = mat.mean(); // تحليل اللون المتوسط للصورة

    // **شروط رفض الصورة** (إذا كانت ألوانها فاتحة جدًا أو لا تحتوي على مناطق داكنة مثل النفط)
    if (avgColor[0] > 180 && avgColor[1] > 180 && avgColor[2] > 180) {
      alert("❌ هذه الصورة لا تبدو كصورة تسرب نفطي! الرجاء رفع صورة صحيحة.");
      return;
    }

    alert("✅ تم قبول الصورة للتحليل.");
  };
}

// حساب الكتلة والمساحة
function calculateOilMass() {
  let depthsInput = document.getElementById("depths").value;
  let droneHeight = parseFloat(document.getElementById("droneHeight").value);
  let oilType = document.getElementById("oilType").value;
  let oilDensity = oilType !== "custom" ? parseFloat(oilType) : parseFloat(document.getElementById("customDensity").value);

  if (!depthsInput || isNaN(droneHeight) || isNaN(oilDensity)) {
    alert("❌ الرجاء إدخال جميع البيانات المطلوبة بشكل صحيح!");
    return;
  }

  // حساب متوسط العمق
  let depthsArray = depthsInput.split(",").map(num => parseFloat(num.trim())).filter(num => !isNaN(num));
  let averageDepth = depthsArray.reduce((sum, value) => sum + value, 0) / depthsArray.length;

  // حساب المساحة بناءً على ارتفاع الدرون (محاكاة)
  let estimatedArea = (droneHeight * 0.2) * (depthsArray.length * 0.5) + 100;

  // حساب الحجم والكتلة
  let volume = (estimatedArea * averageDepth).toFixed(2);
  let mass = (volume * oilDensity).toFixed(2);

  document.getElementById("output").innerHTML = `
    📏 <strong>المساحة المقدرة:</strong> ${estimatedArea.toFixed(2)} م² <br>
    📊 <strong>متوسط العمق:</strong> ${averageDepth.toFixed(2)} م <br>
    📦 <strong>الحجم:</strong> ${volume} م³ <br>
    ⚖️ <strong>الكتلة:</strong> ${mass} كجم
  `;
}