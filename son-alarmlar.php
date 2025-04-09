<!DOCTYPE html>
<html lang="tr">
<head>
  <meta charset="UTF-8">
  <title> Son Alarmlar</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <script src="js/alarms.js"></script>
</head>
<body class="bg-gray-50">
  <?php include 'navbar.php'; ?>
  <div class="max-w-7xl mx-auto p-6">
    <h1>Son Alarmlar</h1>
    <div class="bg-white p-6 rounded-lg shadow-lg">
        <h3 class="text-2xl font-semibold text-gray-700 mb-4">Son Alarm Verileri</h3>
        <table class="min-w-full table-auto">
          <thead>
            <tr class="bg-gray-100 text-left">
              <th class="px-4 py-2">Alarm ID</th>
              <th class="px-4 py-2">Açıklama</th>
              <th class="px-4 py-2">Başlangıç Zamanı</th>
              <th class="px-4 py-2">Bitiş Zamanı</th>
              <th class="px-4 py-2">Çözüm Süresi</th>
            </tr>
          </thead>
          <tbody id="son-alarm-tbody">
            <!-- Son alarm verileri buraya yüklenecek -->
          </tbody>
        </table>
      </div>
  </div>
  <script>
    document.addEventListener("DOMContentLoaded", () => {
      loadRecentAlarms();
      setInterval(loadRecentAlarms, 3000);
    });
  </script>
</body>
</html>
