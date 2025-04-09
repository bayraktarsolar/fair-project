<!DOCTYPE html>
<html lang="tr">
<head>
  <meta charset="UTF-8">
  <title>Alarmlar</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <script src="js/alarms.js"></script>
</head>
<body class="bg-gray-50">
  <?php include 'navbar.php'; ?>
  <div class="max-w-7xl mx-auto p-6">
    <h1 class="text-2xl font-bold mb-6">Alarm Listesi</h1>
    <div class="overflow-x-auto">
      <table class="min-w-full bg-white rounded-lg shadow-md overflow-hidden">
        <thead class="bg-gray-800 text-white text-sm">
          <tr>
            <?php
              $headers = ["Hata ID", "Açıklama", "Başlangıç Zamanı", "Bitiş Zamanı", "Çözüm Süresi"];
              foreach ($headers as $h) {
                echo "<th class='px-4 py-2 text-left'>$h</th>";
              }
            ?>
          </tr>
        </thead>
        <tbody id="alarm-tbody" class="text-sm text-gray-700">
        </tbody>
      </table>
    </div>
  </div>
  <script>
    document.addEventListener("DOMContentLoaded", () => {
      loadAlarms();
    });
  </script>
</body>
</html>
