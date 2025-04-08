function updateStatus() {
  const statusList = document.getElementById("statusList");
  statusList.innerHTML = "";

  // Update main components
  ["mainCB", "loadDisconnect", "TMSwithEngine", "topraklama", "mainBusbar"].forEach(
    (id) => {
      addStatusItem(components[id].name, components[id].state);
    }
  );

  // Update transformers
  components.transformers.forEach((transformer, index) => {
    addStatusItem(`${transformer.name} Kesici`, transformer.state);
    addStatusItem(`${transformer.name} TMŞ`, transformer.tms.state);
    addStatusItem(`${transformer.name} Ayırıcı`, transformer.disconnector.state);
    addStatusItem(`${transformer.name} Topraklama`, transformer.topraklama.state);
  });

  updateSystemPower();
}

function addStatusItem(name, state) {
  const statusList = document.getElementById("statusList");
  const item = document.createElement("div");
  item.className = "flex justify-between items-center p-2 border-b";
  item.innerHTML = `
    <span>${name}</span>
    <span class="${
      state ? "text-green-600" : "text-red-600"
    }">${state ? "ENERJİLİ" : "ENERJİSİZ"}</span>
  `;
  statusList.appendChild(item);
}

function updateSystemPower() {
  console.log("System Power Update")
  const energizedTransformers = components.transformers.filter(
    (t) => t.state && t.tms.state && t.disconnector.state && t.topraklama.state
  );

  const totalPower = energizedTransformers.reduce(
    (sum, t) => sum + t.rating,
    0
  );
  const totalCurrent = totalPower / (Math.sqrt(3) * components.mainCB.voltage);
  console.log("Total current:",totalCurrent)
  document.getElementById("totalPower").textContent = `${totalPower} kVA`;
  document.getElementById("inputCurrent").textContent = `${totalCurrent.toFixed(
    1
  )} A`;
}
