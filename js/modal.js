// Modal management
function showTMSModal(index, isTransformer = false) {
  const modal = document.getElementById("tmsModal");
  let voltage, current, powerFactor;
  
  if (isTransformer) {
    const transformer = components.transformers[index];
    voltage = components.mainCB.voltage;
    current = transformer.rating / (Math.sqrt(3) * voltage);
    powerFactor = 0.95;
    
    document.getElementById("modalTitle").textContent = `Trafo ${index + 1} Trafo Bilgileri`;
    document.getElementById("modalTrafoNo").textContent = `Trafo ${index + 1}`;
    document.getElementById("modalStatus").textContent = transformer.tms.state ? "ENERJİLİ" : "ENERJİSİZ";
    document.getElementById("modalStatus").className = transformer.tms.state ? "text-green-600" : "text-red-600";
  } else {
    voltage = components.mainCB.voltage;
    current = components.mainCB.current;
    powerFactor = 0.95;
    
    document.getElementById("modalTitle").textContent = "Ana Trafo Bilgileri";
    document.getElementById("modalTrafoNo").textContent = "Ana Trafo";
    document.getElementById("modalStatus").textContent = components.TMSwithEngine.state ? "ENERJİLİ" : "ENERJİSİZ";
    document.getElementById("modalStatus").className = components.TMSwithEngine.state ? "text-green-600" : "text-red-600";
  }

  document.getElementById("modalVoltage").textContent = `${voltage} kV`;
  document.getElementById("modalCurrent").textContent = `${current.toFixed(1)} A`;
  document.getElementById("modalPower").textContent = `${voltage * current * Math.sqrt(3)} kVA`;
  document.getElementById("modalPowerFactor").textContent = powerFactor.toFixed(2);

  modal.style.display = "block";
  startRealTimeUpdates(index, isTransformer);
}

function closeModal() {
  const modal = document.getElementById("tmsModal");
  modal.style.display = "none";
  stopRealTimeUpdates();
}

let updateInterval;

function startRealTimeUpdates(index, isTransformer) {
  if (updateInterval) {
    clearInterval(updateInterval);
  }

  updateInterval = setInterval(() => {
    const component = isTransformer ? components.transformers[index].tms : components.TMSwithEngine;
    if (!component.state) {
      closeModal();
      return;
    }

    const baseVoltage = components.mainCB.voltage;
    const voltage = baseVoltage * (1 + (Math.random() - 0.5) * 0.02);
    const current = (isTransformer ? components.transformers[index].rating : 5000) / (Math.sqrt(3) * voltage) * (1 + (Math.random() - 0.5) * 0.05);
    const powerFactor = 0.95 * (1 + (Math.random() - 0.5) * 0.01);
    const power = Math.sqrt(3) * voltage * current * powerFactor;

    document.getElementById("modalVoltage").textContent = `${voltage.toFixed(1)} kV`;
    document.getElementById("modalCurrent").textContent = `${current.toFixed(1)} A`;
    document.getElementById("modalPower").textContent = `${power.toFixed(1)} kVA`;
    document.getElementById("modalPowerFactor").textContent = powerFactor.toFixed(3);
  }, 1000);
}

function stopRealTimeUpdates() {
  if (updateInterval) {
    clearInterval(updateInterval);
    updateInterval = null;
  }
}

// Click outside modal to close
window.onclick = function(event) {
  const modal = document.getElementById("tmsModal");
  if (event.target == modal) {
    closeModal();
  }
};
