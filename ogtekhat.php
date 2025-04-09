<!-- og-tek-hat.php -->
<!DOCTYPE html>
<html lang="tr">

<head>
  <meta charset="UTF-8">
  <title>OG Tek Hat</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <link rel="stylesheet" href="js/style.css" />
</head>

<body class="bg-gray-100 m-0 p-2 overflow-hidden">
  <?php include 'navbar.php'; ?>

  <div class="mx-auto">

    <div class="flex flex-col h-full w-full">
      <!-- Manual Mode Switch -->
      <div class="p-4 bg-gray-100">
        <div class="flex items-center">
          <span class="mr-3 font-medium">Uzak / Yakın Modu:</span>
          <button id="manualModeSwitch" onclick="toggleManualMode()"
            class="relative inline-flex items-center h-6 w-11 rounded-full bg-gray-300 transition-colors duration-300">
            <span id="switchToggle"
              class="inline-block w-4 h-4 transform bg-white rounded-full transition-transform duration-300 translate-x-1"></span>
          </button>
        </div>
      </div>

      <!-- Main Content -->
      <div class="flex-1 w-full">
        <!-- SVG Diagram -->
        <svg id="diagram" viewBox="0 150 1200 800" class="w-full block">
          <text x="50" y="170" class="text-sm">Kesicili Giriş Hücresi</text>
          <rect x="60" y="180" width="80" height="300" class="transformer-group-box"></rect>
          <g id="redresorInfo"></g>

          <!-- Main Input Circuit Breaker -->
          <g id="mainCB" class="component breaker de-energized" onclick="toggleMainCB()">
            <line x1="50" y1="200" x2="100" y2="200" stroke-width="2"></line>
            <line x1="100" y1="200" x2="100" y2="250" stroke-width="2"></line>
            <rect x="90" y="250" width="20" height="20" fill="white" stroke-width="2"></rect>
            <text x="70" y="270" class="text-sm">26.4kV, 630A</text>
          </g>

          <g id="loadDisconnect" class="component de-energized" onclick="toggleLoadDisconnect()">
            <line x1="100" y1="270" x2="100" y2="380" stroke-width="2"></line>
            <rect x="90" y="380" width="20" height="20" class="disconnect-box"></rect>
            <line x1="95" y1="390" x2="105" y2="390" class="disconnect-line"></line>
            <text x="10" y="405" class="text-sm">Manuel Ayırıcı</text>
            <g>
              <line x1="100" y1="400" x2="100" y2="440" stroke-width="2"></line>
              <line x1="85" y1="440" x2="220" y2="440" stroke-width="2"></line>
              <line x1="220" y1="440" x2="220" y2="350" stroke-width="2"></line>
              <line x1="220" y1="340" x2="220" y2="200" stroke-width="2"></line>
              <line x1="220" y1="350" x2="220" y2="340" stroke-width="2" id="mainBreaker" class="breaker-line"
                onclick="toggleMainBreaker()"></line>
              <text x="220" y="360" class="text-sm">Main Breaker</text>
            </g>
          </g>

          <!-- Main Topraklama -->
          <g id="topraklama" class="component de-energized" onclick="toggleTopraklama()">
            <line x1="70" y1="440" x2="80" y2="430" stroke-width="2" class="topraklama-line"></line>
            <line x1="70" y1="440" x2="70" y2="450" stroke-width="2"></line>
            <line x1="60" y1="450" x2="80" y2="450" stroke-width="2"></line>
            <line x1="63" y1="455" x2="77" y2="455" stroke-width="2"></line>
            <line x1="66" y1="460" x2="74" y2="460" stroke-width="2"></line>
          </g>
          <g>
            <text x="180" y="170" class="text-sm">Akım Gerilim Hücresi</text>
            <rect x="180" y="180" width="120" height="300" class="transformer-group-box"></rect>
            <g id="akimGerilimInfo"></g>

            <g id="TMSwithEngine" class="component de-energized" onclick="toggleTMSwithEngine()">
              <line x1="220" y1="200" x2="220" y2="220" stroke-width="2"></line>
              <rect x="210" y="220" width="20" height="20" fill="white" stroke-width="2"></rect>
              <circle cx="220" cy="230" r="10" fill="#FFF"></circle>
              <text x="212" y="235" class="text-sm">3P</text>
              <text x="230" y="230" class="text-sm">Akım Trafosu</text>
            </g>
          </g>

          <!-- Main Busbar -->
          <g id="mainBusbar" class="component busbar de-energized">
            <line x1="220" y1="200" x2="1100" y2="200" stroke-width="3"></line>
          </g>

          <!-- Transformer Groups -->
          <g id="transformerGroups">
            <!-- Will be populated by JavaScript -->
          </g>
        </svg>
      </div>
    </div>
  </div>

  <div id="tmsModal" class="modal">
    <div class="modal-content">
      <span class="close-button" onclick="closeModal()">&times;</span>
      <div class="modal-header">
        <h2 id="modalTitle" class="text-xl font-bold">Trafo Bilgileri</h2>
      </div>
      <div class="modal-body">
        <div>
          <strong>Trafo No:</strong>
          <span id="modalTrafoNo"></span>
        </div>
        <div>
          <strong>Durum:</strong>
          <span id="modalStatus"></span>
        </div>
        <div>
          <strong>Gerilim:</strong>
          <span id="modalVoltage"></span>
        </div>
        <div>
          <strong>Akım:</strong>
          <span id="modalCurrent"></span>
        </div>
        <div>
          <strong>Güç:</strong>
          <span id="modalPower"></span>
        </div>
        <div>
          <strong>Güç Faktörü:</strong>
          <span id="modalPowerFactor"></span>
        </div>
      </div>
    </div>
  </div>
  <iframe id="statusIframe" src="status-panel.php" class="w-full h-[600px] border mt-6"></iframe>

  <script src="js/status.js"></script>
  <script src="js/components.js"></script>
  <script src="js/modal.js"></script>
  <script src="js/toggles.js"></script>
  <script src="js/items.js"></script>
  <script>
    // Initialize transformers
    document.addEventListener("DOMContentLoaded", () => {
      
      const redresorInfo = document.getElementById("redresorInfo");
      const akimGerilimInfo = document.getElementById("akimGerilimInfo");

      kesiciItems.forEach((item) => {
        const { circle, text } = generateCircleText(item);
        redresorInfo.appendChild(circle);
        redresorInfo.appendChild(text);
      });
      akimGerilimItems.forEach((item) => {
        const { circle, text } = generateCircleText(item);
        akimGerilimInfo.appendChild(circle);
        akimGerilimInfo.appendChild(text);
      });

      const transformerContainer =
        document.getElementById("transformerGroups");

      let svgContent = "";
      for (let i = 0; i < 5; i++) {
        const xOffset = (i + 1) * 180;

        svgContent += `
            <g class="transformer-unit" transform="translate(${xOffset}, 0)">
              <text x="180" y="170" class="text-sm">Trafo ${i + 1}</text>
              <rect x="160" y="180" width="80" height="300" class="transformer-group-box"></rect>
              
              ${transformerItems
            .map((item) => {
              const { circle, text } = generateCircleText(item);
              return `<g>${circle.outerHTML}${text.outerHTML}</g>`;
            })
            .join("")}


              <!-- Kesici -->
              <g id="cb${i + 2
          }" class="component breaker de-energized" onclick="toggleTransformer(${i})">
                <line x1="200" y1="200" x2="200" y2="220" stroke-width="2"></line>
                <rect x="190" y="220" width="20" height="20" fill="white" stroke-width="2"></rect>
                <line x1="195" y1="230" x2="205" y2="230" class="breaker-line" stroke-width="2"></line>
                <line x1="200" y1="240" x2="200" y2="250" stroke-width="2"></line>
              </g>

              <!-- Manuel Ayırıcı -->
              <g id="manualDisconnector${i + 2
          }" style="opacity: 0.5" class="component breaker de-energized" onclick="toggleManualDisconnector(${i})">
                <line x1="180" y1="250" x2="180" y2="320" stroke-width="2"></line>
                <rect x="170" y="270" width="20" height="20" class="disconnect-box"></rect>
                <line x1="175" y1="280" x2="185" y2="280" class="disconnect-line"></line>
                <line x1="180" y1="290" x2="180" y2="300" stroke-width="2"></line>
                <line x1="180" y1="250" x2="220" y2="250" stroke-width="2"></line>
              </g>

              <!-- Ayırıcı -->
              <g id="disconnector${i + 2
          }" class="component breaker de-energized" onclick="toggleDisconnector(${i})">
                <rect x="210" y="270" width="20" height="20" class="disconnect-box"></rect>
                <line x1="215" y1="280" x2="225" y2="280" class="disconnect-line"></line>
                <line x1="220" y1="250" x2="220" y2="270" stroke-width="2"></line>
                <line x1="220" y1="290" x2="220" y2="320" stroke-width="2"></line>
                <line x1="180" y1="320" x2="220" y2="320" stroke-width="2"></line>
                <line x1="200" y1="320" x2="200" y2="350" stroke-width="2"></line>
              </g>

              <g id="tms${i + 2
          }" class="component breaker de-energized" onclick="toggleTMS(${i})">
                <line x1="200" y1="350" x2="200" y2="360" stroke-width="2"></line>
                <rect x="190" y="360" width="20" height="20" fill="white" stroke-width="2"></rect>
                <circle cx="200" cy="370" r="10" fill="#FFF"></circle>
                <text x="195" y="375" class="text-sm">M</text>
              </g>

              <!-- Topraklama -->
              <g id="topraklama${i + 2
          }" class="component de-energized" onclick="toggleTransformerTopraklama(${i})">
                <line x1="200" y1="380" x2="200" y2="460" stroke-width="2"></line>
                <line x1="190" y1="460" x2="200" y2="460" stroke-width="2"></line>
                <line x1="180" y1="460" x2="190" y2="450" stroke-width="2" class="topraklama-line transformer"></line>
                <line x1="180" y1="460" x2="180" y2="470" stroke-width="2"></line>
                <line x1="170" y1="470" x2="190" y2="470" stroke-width="2"></line>
                <line x1="173" y1="475" x2="187" y2="475" stroke-width="2"></line>
                <line x1="176" y1="480" x2="184" y2="480" stroke-width="2"></line>
              </g>
            </g>
          `;
      }

      transformerContainer.innerHTML = svgContent;
      postStatusToIframe();
    });
  </script>
</body>
</body>

</html>