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
  <script src="js/status.js"></script>
  <script>
    document.addEventListener("DOMContentLoaded", () => {
      const storedComponents = localStorage.getItem("components");
      if (storedComponents) {
        const parsedComponents = JSON.parse(storedComponents);
        updateStatus(parsedComponents);
      }
    });
  </script>
</body>

</html>