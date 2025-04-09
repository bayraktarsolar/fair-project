// Alarm severity levels
const severityLevels = ['low', 'medium', 'high'];

function getSolutionTime(min=false) {
    if (min) {
        const randomSeconds = Math.floor(Math.random() * 60) + 1; // 1 to 60 seconds
        const randomMins = Math.floor(Math.random() * 60) + 1; // 1 to 60 minutes
        return randomMins + " min" + randomSeconds + ' sn';
    }
    const randomSeconds = Math.floor(Math.random() * 60) + 1; // 1 to 60 seconds
    return randomSeconds + ' sn';
}

function randomId(){
    return Math.floor(Math.random() * 1000000);
}

// Function to generate random alarm data
function generateAlarms(numAlarms, min=false) {
  const alarms = [];
  const baseTime = new Date(); // Starting point for timestamps
  
  for (let i = 0; i < numAlarms; i++) {
    const alarmId = randomId();
    const description = getRandomDescription();
    const startTime = new Date(baseTime.getTime() + (i * 35 * 1000)); // 35 seconds interval
    const endTime = new Date(startTime.getTime() + 2000); // 2 seconds after start
    const severity = severityLevels[Math.floor(Math.random() * severityLevels.length)];
    const solutionTime = getSolutionTime(min);
    
    alarms.push([
      alarmId,
      description,
      startTime.toISOString().slice(0, 19).replace('T', ' '),
      endTime.toISOString().slice(0, 19).replace('T', ' '),
      solutionTime,
      severity
    ]);
  }

  return alarms;
}

// Example function to get random alarm description
function getRandomDescription() {
  const descriptions = [
    'Şebeke Frekansı Yüksek',
    'Inverter Üretim Yapmıyor',
    'FAZ HATASI',
    'Ekipman Arızası',
    'Aşırı Sıcaklık',
    'Düşük Gerilim'
  ];
  return descriptions[Math.floor(Math.random() * descriptions.length)];
}

// Function to get color based on severity level
function getColorBySeverity(severity) {
  switch (severity) {
    case 'high':
      return 'bg-red-600 text-white';
    case 'medium':
      return 'bg-yellow-500 text-white';
    case 'low':
      return 'bg-green-600 text-white';
    default:
      return 'bg-gray-300 text-black';
  }
}
function loadRecentAlarms() {
    const tbody = document.getElementById('son-alarm-tbody');
    tbody.innerHTML = ''; // Clear existing content

    const recentAlarms = generateAlarms(10); // Generate 10 most recent alarms

    recentAlarms.forEach(alarm => {
      const row = document.createElement('tr');
      const colorClass = getColorBySeverity(alarm[5]);

      alarm.slice(0, 5).forEach(value => {
        const cell = document.createElement('td');
        cell.className = 'px-4 py-2';
        cell.textContent = value;
        row.appendChild(cell);
      });

      row.classList.add('border-b', 'hover:bg-gray-100');
      row.classList.add(...colorClass.split(' '));
      tbody.appendChild(row);
    });
  }

  // Function to load all past alarms (Geçmiş Alarmlar)
  function loadAlarms() {
    const tbody = document.getElementById('alarm-tbody');
    tbody.innerHTML = ''; // Clear existing content

    const alarmData = generateAlarms(100, min=true); // Generate 100 alarms for past records

    alarmData.forEach(alarm => {
      const row = document.createElement('tr');
      const colorClass = getColorBySeverity(alarm[5]);

      alarm.slice(0, 5).forEach(value => {
        const cell = document.createElement('td');
        cell.className = 'px-4 py-2';
        cell.textContent = value;
        row.appendChild(cell);
      });

      row.classList.add('border-b', 'hover:bg-gray-100');
      row.classList.add(...colorClass.split(' '));
      tbody.appendChild(row);
    });
  }