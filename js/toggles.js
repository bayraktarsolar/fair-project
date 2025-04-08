// Toggle functions for components
function toggleMainCB() {
  if (!canToggleComponent("mainCB")) {
    showWarning("Topraklama hattı kapalı olduğu için elektrik verilemiyor!");
    return;
  }
  toggleComponent("mainCB");
}

function toggleManualMode() {
  components.manualMode.state = !components.manualMode.state;
  const manualSwitch = document.getElementById("manualModeSwitch");
  if (manualSwitch) {
    manualSwitch.classList.toggle("bg-green-500");
    manualSwitch.classList.toggle("bg-gray-300");
  }
  
  // Update visual state of all manual disconnectors
  components.transformers.forEach((_, index) => {
    const manualDisc = document.getElementById(`manualDisconnector${index + 2}`);
    if (manualDisc) {
      manualDisc.style.opacity = components.manualMode.state ? "1" : "0.5";
    }
  });
  
  updateStatus();
}

function showWarning(message) {
  alert(message);
}

function canToggleComponent(componentId, index = -1) {
  console.log("Checking dependencies for", componentId, index);
  
  // Check topraklama state first
  if (componentId !== "topraklama") {
    if (index >= 0) {
      // For transformer components
      if (!components.transformers[index].topraklama.state) {
        return false; // Topraklama kapalı (kırmızı) ise elektrik geçemez
      }
    } else {
      // For main components
      if (!components.topraklama.state) {
        return false; // Ana topraklama kapalı (kırmızı) ise elektrik geçemez
      }
    }
  }

  // Check dependencies
  let component;
  if (index >= 0) {
    component = components.transformers[index][componentId];
  } else {
    component = components[componentId];
  }

  if (!component || !component.dependencies) {
    return true;
  }

  // Check if all dependencies are energized
  return component.dependencies.every(dep => {
    if (dep.startsWith("cb")) {
      const tIndex = parseInt(dep.replace("cb", "")) - 2;
      return components.transformers[tIndex].state;
    }
    if (dep.startsWith("disconnector")) {
      const tIndex = parseInt(dep.replace("disconnector", "")) - 2;
      return components.transformers[tIndex].disconnector.state;
    }
    if (dep.startsWith("tms")) {
      const tIndex = parseInt(dep.replace("tms", "")) - 2;
      return components.transformers[tIndex].tms.state;
    }
    return components[dep].state;
  });
}

function toggleTopraklama() {
  const topraklamaElement = document.getElementById("topraklama");
  if (!topraklamaElement) return;

  const currentState = topraklamaElement.classList.contains("energized");
  const newState = !currentState;

  updateTopraklamaVisual(topraklamaElement, newState);
  components.topraklama.state = newState;
  
  // De-energize components when topraklama is activated
  if (!newState) {
    components.mainCB.state = false;
    components.loadDisconnect.state = false;
    components.TMSwithEngine.state = false;
    components.mainBusbar.state = false;
    
    const cb_array = ["cb2", "cb3", "cb4", "cb5", "cb6"];
    const disconnector_array = ["disconnector2", "disconnector3", "disconnector4", "disconnector5", "disconnector6"];
    const tms_array = ["tms2", "tms3", "tms4", "tms5", "tms6"];
    
    // Update visual states
    ["mainCB", "loadDisconnect", "TMSwithEngine", "mainBusbar", ...cb_array, ...disconnector_array, ...tms_array].forEach(id => {
      const element = document.getElementById(id);
      if (element) {
        element.classList.remove("energized");
        element.classList.add("de-energized");
      }
    });
  }
  
  updateStatus();
}

function toggleTransformerTopraklama(index) {
  const transformer = components.transformers[index];
  if (!transformer) return;

  const topraklamaElement = document.getElementById(`topraklama${index + 2}`);
  if (!topraklamaElement) return;

  const currentState = topraklamaElement.classList.contains("energized");
  const newState = !currentState;

  updateTopraklamaVisual(topraklamaElement, newState);
  transformer.topraklama.state = newState;
  updateStatus();
}

function toggleTMSwithEngine() {
  if (!canToggleComponent("TMSwithEngine")) {
    showWarning("Topraklama hattı kapalı olduğu için TMŞ açılamıyor!");
    return;
  }
  const mainBusbar = document.getElementById("mainBusbar");
  if (!mainBusbar) return;
  const currentState = mainBusbar.classList.contains("energized");
  const newState = !currentState;
  if(newState){
    mainBusbar.classList.remove("de-energized");
    mainBusbar.classList.add("energized");
  } else {
    mainBusbar.classList.remove("energized");
    mainBusbar.classList.add("de-energized");
  }
  components.TMSwithEngine.state = newState;
  updateStatus();
  toggleComponent("TMSwithEngine");
  showTMSModal(-1, false);
}

function toggleLoadDisconnect() {
  if (!canToggleComponent("loadDisconnect")) {
    showWarning("Topraklama hattı kapalı olduğu için ayırıcı açılamıyor!");
    return;
  }

  const disconnector = document.getElementById("loadDisconnect");
  if (!disconnector) return;

  const currentState = disconnector.classList.contains("energized");
  const newState = !currentState;

  // Toggle the horizontal/vertical line
  const line = disconnector.querySelector(".disconnect-line");
  if (line) {
    line.setAttribute("transform", newState ? "rotate(90 100 390)" : "");
  }

  if (newState) {
    disconnector.classList.remove("de-energized");
    disconnector.classList.add("energized");
  } else {
    disconnector.classList.remove("energized");
    disconnector.classList.add("de-energized");
  }

  components.loadDisconnect.state = newState;
  updateStatus();
}

function toggleMainBreaker() {
  const mainBreaker = document.getElementById("mainBreaker");
  if (!mainBreaker) return;
  const currentState = mainBreaker.classList.contains("energized");
  const newState = !currentState;

  if (newState) {
    mainBreaker.classList.remove("de-energized");
    mainBreaker.classList.add("energized");
    mainBreaker.setAttribute("transform", "rotate(90 220 350)");
  } else {
    mainBreaker.classList.remove("energized");
    mainBreaker.classList.add("de-energized");
    mainBreaker.setAttribute("transform", "");
  }

  components.mainCB.state = newState;
  updateStatus();
}

function toggleTransformer(index) {
  if (!canToggleComponent("cb", index)) {
    showWarning("Topraklama hattı kapalı olduğu için kesici açılamıyor!");
    return;
  }
  
  if (components.transformers[index]) {
    const transformer = components.transformers[index];
    const breaker = document.getElementById(`cb${index + 2}`);
    
    if (!breaker) return;

    const currentState = breaker.classList.contains("energized");
    const newState = !currentState;

    // Toggle the horizontal/vertical line
    const line = breaker.querySelector(".breaker-line");
    if (line) {
      line.setAttribute("transform", newState ? "rotate(90 200 230)" : "");
    }

    if (newState) {
      breaker.classList.remove("de-energized");
      breaker.classList.add("energized");
    } else {
      breaker.classList.remove("energized");
      breaker.classList.add("de-energized");
    }

    transformer.state = newState;
    updateStatus();
  }
}

function toggleTMS(index) {
  if (!canToggleComponent("tms", index)) {
    showWarning("Topraklama hattı kapalı olduğu için TMŞ açılamıyor!");
    return;
  }

  if (components.transformers[index]) {
    const transformer = components.transformers[index];
    const tms = document.getElementById(`tms${index + 2}`);
    
    if (!tms) return;

    const currentState = tms.classList.contains("energized");
    const newState = !currentState;

    if (newState) {
      tms.classList.remove("de-energized");
      tms.classList.add("energized");
    } else {
      tms.classList.remove("energized");
      tms.classList.add("de-energized");
    }

    transformer.tms.state = newState;
    updateStatus();
    showTMSModal(index, true);
  }
}

function toggleManualDisconnector(index) {
  if (!components.manualMode.state) {
    showWarning("Manuel ayırıcı modu aktif değil!");
    return;
  }
  
  if (!canToggleComponent("manualDisconnector", index)) {
    showWarning("Topraklama hattı kapalı olduğu için manuel ayırıcı açılamıyor!");
    return;
  }

  if (components.transformers[index]) {
    const transformer = components.transformers[index];
    const disconnector = document.getElementById(`manualDisconnector${index + 2}`);
    
    if (!disconnector) return;

    const currentState = disconnector.classList.contains("energized");
    const newState = !currentState;

    // Toggle the horizontal/vertical line
    const line = disconnector.querySelector(".disconnect-line");
    if (line) {
      line.setAttribute("transform", newState ? "rotate(90 175 280)" : "");
    }

    if (newState) {
      disconnector.classList.remove("de-energized");
      disconnector.classList.add("energized");
    } else {
      disconnector.classList.remove("energized");
      disconnector.classList.add("de-energized");
    }

    transformer.manualDisconnector.state = newState;
    updateStatus();
  }
}

function toggleDisconnector(index) {
  if (!canToggleComponent("disconnector", index)) {
    showWarning("Topraklama hattı kapalı olduğu için ayırıcı açılamıyor!");
    return;
  }

  if (components.transformers[index]) {
    const transformer = components.transformers[index];
    const disconnector = document.getElementById(`disconnector${index + 2}`);
    
    if (!disconnector) return;

    const currentState = disconnector.classList.contains("energized");
    const newState = !currentState;

    // Toggle the horizontal/vertical line
    const line = disconnector.querySelector(".disconnect-line");
    if (line) {
      line.setAttribute("transform", newState ? "rotate(90 220 280)" : "");
    }

    if (newState) {
      disconnector.classList.remove("de-energized");
      disconnector.classList.add("energized");
    } else {
      disconnector.classList.remove("energized");
      disconnector.classList.add("de-energized");
    }

    transformer.disconnector.state = newState;
    updateStatus();
  }
}

function updateTopraklamaVisual(element, state) {
  if (state) {
    element.classList.remove("de-energized");
    element.classList.add("energized");
    
    // Update topraklama line
    const topraklamaLine = element.querySelector(".topraklama-line");
    if (topraklamaLine) {
      if (topraklamaLine.classList.contains("transformer")) {
        topraklamaLine.setAttribute("transform", "rotate(45 180 460)");
      } else {
        topraklamaLine.setAttribute("transform", "rotate(45 70 440)");
      }
      topraklamaLine.classList.remove("open");
      console.log("closed");
      topraklamaLine.classList.add("closed");
    }
  } else {
    element.classList.remove("energized");
    element.classList.add("de-energized");
    
    // Update topraklama line
    const topraklamaLine = element.querySelector(".topraklama-line");
    if (topraklamaLine) {
      console.log("open");
      if (topraklamaLine.classList.contains("transformer")) {
        topraklamaLine.setAttribute("transform", "");
      } else {
        topraklamaLine.setAttribute("transform", "");
      }
      topraklamaLine.classList.remove("closed");
      topraklamaLine.classList.add("open");
    }
  }

  // Update all lines within the topraklama group
  const lines = element.getElementsByTagName("line");
  for (let line of lines) {
    if (state) {
      line.classList.remove("de-energized");
      line.classList.add("energized");
    } else {
      line.classList.remove("energized");
      line.classList.add("de-energized");
    }
  }
}

function toggleComponent(id) {
  const element = document.getElementById(id);
  if (!element) return;

  const currentState = element.classList.contains("energized");
  const newState = !currentState;

  if (newState) {
    element.classList.remove("de-energized");
    element.classList.add("energized");
  } else {
    element.classList.remove("energized");
    element.classList.add("de-energized");
  }

  if (id.startsWith("cb")) {
    const index = parseInt(id.replace("cb", "")) - 2;
    components.transformers[index].state = newState;
  } else {
    components[id].state = newState;
  }

  updateStatus();
}
