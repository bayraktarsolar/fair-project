function updateSystemStatus() {
  localStorage.setItem("components", JSON.stringify(components));
  localStorage.setItem("statusUpdateTimestamp", Date.now());
  updateItemColors(components);
}


function updateStatus(components) {
  const statusList = document.getElementById("statusList");
  statusList.innerHTML = "";

  ["mainCB", "loadDisconnect", "TMSwithEngine", "topraklama", "mainBusbar"].forEach(
    (id) => {
      addStatusItem(components[id].name, components[id].state);
    }
  );

  components.transformers.forEach((transformer) => {
    addStatusItem(`${transformer.name} Kesici`, transformer.state);
    addStatusItem(`${transformer.name} Trafo`, transformer.tms.state);
    addStatusItem(`${transformer.name} Ayırıcı`, transformer.disconnector.state);
    addStatusItem(`${transformer.name} Topraklama`, transformer.topraklama.state);
  });

  updateSystemPower(components);
}

function addStatusItem(name, state) {
  const statusList = document.getElementById("statusList");
  const item = document.createElement("div");
  item.className = "flex justify-between items-center p-2 border-b";
  item.innerHTML = `
    <span>${name}</span>
    <span class="${state ? "text-green-600" : "text-red-600"}">
      ${state ? "ENERJİLİ" : "ENERJİSİZ"}
    </span>
  `;
  statusList.appendChild(item);
}

function updateSystemPower(components) {
  const energizedTransformers = components.transformers.filter(
    (t) => t.state && t.tms.state && t.disconnector.state && !t.topraklama.state
  );

  const totalPower = energizedTransformers.reduce((sum, t) => sum + t.rating, 0);
  const voltage = components.mainCB.voltage || 400;
  const totalCurrent = totalPower / (Math.sqrt(3) * voltage);

  document.getElementById("totalPower").textContent = `${totalPower} kVA`;
  document.getElementById("inputCurrent").textContent = `${totalCurrent.toFixed(1)} A`;
}