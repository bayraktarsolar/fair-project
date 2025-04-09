<!DOCTYPE html>
<html lang="tr">
<head>
  <meta charset="UTF-8">
  <title>Sistem Durumu</title>
  <script src="https://cdn.tailwindcss.com"></script>
</head>
<body class="bg-gray-50">
  <?php include 'navbar.php'; ?>

  <div class="status-panel">
        <h2 class="text-xl font-bold mb-4">Sistem Durumu</h2>
        <div class="bg-blue-100 p-3 rounded mb-4">
            <h3 class="font-semibold mb-2">Sistem Güçü</h3>
            <div class="grid grid-cols-2 gap-2">
                <div>Toplam Güç:</div>
                <div id="totalPower">0 kVA</div>
                <div>Giriş Akım:</div>
                <div id="inputCurrent">0 A</div>
                <div>Güç Faktörü:</div>
                <div id="powerFactor">0.95</div>
            </div>
        </div>
        <div id="statusList" class="space-y-2"></div>
    </div>
    <script>
        window.addEventListener("message", function (event) {
    const { type, payload } = event.data || {};
    if (type === "STATUS_UPDATE" && payload) {
      renderStatus(payload);
    }
  });

  function renderStatus(components) {
    const statusList = document.getElementById("statusList");
    statusList.innerHTML = "";

    ["mainCB", "loadDisconnect", "TMSwithEngine", "topraklama", "mainBusbar"].forEach(id => {
      addStatusItem(components[id].name, components[id].state);
    });

    components.transformers.forEach(t => {
      addStatusItem(`${t.name} Kesici`, t.state);
      addStatusItem(`${t.name} Trafo`, t.tms.state);
      addStatusItem(`${t.name} Ayırıcı`, t.disconnector.state);
      addStatusItem(`${t.name} Topraklama`, t.topraklama.state);
    });

    updateSystemPower(components);
  }

  function addStatusItem(name, state) {
    const item = document.createElement("div");
    item.className = "flex justify-between items-center p-2 border-b";
    item.innerHTML = `
      <span>${name}</span>
      <span class="${state ? 'text-green-600' : 'text-red-600'}">
        ${state ? "ENERJİLİ" : "ENERJİSİZ"}
      </span>`;
    document.getElementById("statusList").appendChild(item);
  }

  function updateSystemPower(components) {
    const energizedTransformers = components.transformers.filter(
      (t) => t.state && t.tms.state && t.disconnector.state && !t.topraklama.state
    );

    const totalPower = energizedTransformers.reduce(
      (sum, t) => sum + t.rating,
      0
    );

    const voltage = components.mainCB.voltage || 400;
    const totalCurrent = totalPower / (Math.sqrt(3) * voltage);

    document.getElementById("totalPower").textContent = `${totalPower} kVA`;
    document.getElementById("inputCurrent").textContent = `${totalCurrent.toFixed(1)} A`;
  }
    </script>
</body>
</html>




