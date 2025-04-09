<!-- index.php -->
<!DOCTYPE html>
<html lang="tr">
<head>
  <meta charset="UTF-8">
  <title>Anasayfa</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
</head>
<body class="bg-gray-50">

  <!-- Navbar -->
  <?php include 'navbar.php'; ?>

  <div class="flex flex-col w-full">

    <!-- Main Content -->
    <div class="flex-1 p-6 w-full">

      <!-- Header -->
      <div class="flex items-center justify-between mb-10 w-full">
        <div>
          <h1 class="text-4xl font-semibold text-gray-800">Hoşgeldiniz, ScadaWatt!</h1>
          <p class="text-lg text-gray-500 mt-2">Bugün, <?php setlocale(LC_TIME, 'tr_TR.UTF-8'); echo strftime('%d %B %Y'); ?> </p>
        </div>
      </div>

      <!-- Dashboard Overview (Stats) -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10 w-full">
        <!-- Stat Card 1 -->
        <div class="bg-white p-6 rounded-lg shadow-lg">
          <h3 class="text-xl font-semibold text-gray-700">Toplam Alarm</h3>
          <p class="text-4xl text-gray-800 font-bold">152</p>
        </div>
        
        <!-- Stat Card 2 -->
        <div class="bg-white p-6 rounded-lg shadow-lg">
          <h3 class="text-xl font-semibold text-gray-700">Aktif Alarm</h3>
          <p class="text-4xl text-gray-800 font-bold">32</p>
        </div>

        <!-- Stat Card 3 -->
        <div class="bg-white p-6 rounded-lg shadow-lg">
          <h3 class="text-xl font-semibold text-gray-700">Çözülen Alarm</h3>
          <p class="text-4xl text-gray-800 font-bold">120</p>
        </div>
      </div>

      <!-- Line Charts -->
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-6 w-full mb-10">

        <!-- Chart 1 -->
        <div class="bg-white p-6 rounded-lg shadow-lg w-full">
          <h3 class="text-2xl font-semibold text-gray-700 mb-4">Alarm Durumu - Haftalık</h3>
          <canvas id="alarmChart1" width="400" height="200"></canvas>
        </div>

        <!-- Chart 2 -->
        <div class="bg-white p-6 rounded-lg shadow-lg w-full">
          <h3 class="text-2xl font-semibold text-gray-700 mb-4">Alarm Durumu - Aylık</h3>
          <canvas id="alarmChart2" width="400" height="200"></canvas>
        </div>

      </div>
    </div>
  </div>

  <script>
    // Chart.js example for "Alarm Durumu - Haftalık"
    var ctx1 = document.getElementById('alarmChart1').getContext('2d');
    var alarmChart1 = new Chart(ctx1, {
      type: 'line',
      data: {
        labels: ['Pazartesi', 'Salı', 'Çarşamba', 'Perşembe', 'Cuma'],
        datasets: [{
          label: 'Aktif Alarm Sayısı',
          data: [12, 19, 3, 5, 2],
          borderColor: '#4CAF50',
          backgroundColor: 'rgba(76, 175, 80, 0.2)',
          fill: true,
          tension: 0.1
        }]
      },
      options: {
        responsive: true,
        plugins: {
          legend: {
            position: 'top',
          },
        },
        scales: {
          y: {
            beginAtZero: true
          }
        }
      }
    });

    // Chart.js example for "Alarm Durumu - Aylık"
    var ctx2 = document.getElementById('alarmChart2').getContext('2d');
    var alarmChart2 = new Chart(ctx2, {
      type: 'line',
      data: {
        labels: ['1. Hafta', '2. Hafta', '3. Hafta', '4. Hafta'],
        datasets: [{
          label: 'Aktif Alarm Sayısı',
          data: [30, 45, 15, 20],
          borderColor: '#FF9800',
          backgroundColor: 'rgba(255, 152, 0, 0.2)',
          fill: true,
          tension: 0.1
        }]
      },
      options: {
        responsive: true,
        plugins: {
          legend: {
            position: 'top',
          },
        },
        scales: {
          y: {
            beginAtZero: true
          }
        }
      }
    });
  </script>
</body>
</html>
