function updateItemColors(components) {
  const manualMode = components.manualMode.state;

  // Ortak bir fonksiyon: Bir öğenin rengini günceller
  function updateElementColor(id, color) {
    const element = document.getElementById(id);
    if (element) {
      element.setAttribute("fill", color);
    }
  }

  // Ortak bir fonksiyon: Bir öğenin durumuna göre rengini günceller
  function updateItemState(item, state) {
    const color = state ? "green" : "red";
    item.color = color;
    updateElementColor(item.id, color);
  }

  // Kesici (mainCB) için renk güncellemesi
  const mainCBActive = components.mainCB.state;
  kesiciItems.forEach(item => item.id === "kesici-k" ? updateElementColor(item.id, mainCBActive ? "green" : "red") : updateItemState(item, mainCBActive));

  // Manual mode için tüm öğeleri güncelle
  const yakinItems = [
    { id: "yakin-k" },
    { id: "yakin-ag" },
    { id: "yakin-t2" },
    { id: "yakin-t3" },
    { id: "yakin-t4" },
    { id: "yakin-t5" },
    { id: "yakin-t6" },
  ];
  const uzakItems = [
    { id: "uzak-k" },
    { id: "uzak-ag" },
    { id: "uzak-t2" },
    { id: "uzak-t3" },
    { id: "uzak-t4" },
    { id: "uzak-t5" },
    { id: "uzak-t6" }
  ];

  yakinItems.forEach(item => {
    updateElementColor(item.id, manualMode ? "green" : "red");
  });
  uzakItems.forEach(item => {
    updateElementColor(item.id, manualMode ? "red" : "green");
  });

  // Ana Ayırıcı (loadDisconnect) için renk güncellemesi
  const ayiriciItems = [
    { id: "ayirici-k", state: components.loadDisconnect.state },
    { id: "ayirici-ag", state: components.loadDisconnect.state },
    { id: "ayirici-t2", state: components.transformers[0].state },
    { id: "ayirici-t3", state: components.transformers[1].state },
    { id: "ayirici-t4", state: components.transformers[2].state },
    { id: "ayirici-t5", state: components.transformers[3].state },
    { id: "ayirici-t6", state: components.transformers[4].state }
  ];

  ayiriciItems.forEach(item => {
    updateItemState(item, item.state);
  });

  // TransformerItems ve Akım-Gerilim öğelerini güncelle
  function updateRelatedItems(item, state) {
    const color = state ? "green" : "red";

    akimGerilimItems.forEach(akimGerilimItem => {
      if (akimGerilimItem.id === item.id) {
        akimGerilimItem.color = color;
      }
    });

    for (const key in transformerItems) {
      transformerItems[key].forEach(transformerItem => {
        if (transformerItem.id === item.id) {
          transformerItem.color = color;
        }
      });
    }
  }

  ayiriciItems.forEach(item => {
    updateRelatedItems(item, item.state);
  });
}

function toggleMainCB() {
  if (!canToggleComponent("mainCB")) {
    showWarning("Topraklama hattı kapalı olduğu için elektrik verilemiyor!");
    return;
  }
  toggleComponent("mainCB");
}

function updateTransformerDependencies(components) {
  components.transformers.forEach((transformer, i) => {
    transformer.tms.dependencies = components.manualMode.state
      ? [`manualDisconnector${i + 2}`]
      : [`disconnector${i + 2}`];
  });
}

function toggleManualMode() {
  components.manualMode.state = !components.manualMode.state;
  const switchToggle = document.getElementById('switchToggle');
  const button = document.getElementById("manualModeSwitch");
  if (components.manualMode.state) {
    switchToggle.classList.remove('translate-x-1');
    switchToggle.classList.add('translate-x-6');
    button.classList.remove('bg-gray-300');
    button.classList.add('bg-green-500');
  }
  else {
    switchToggle.classList.remove('translate-x-6');
    switchToggle.classList.add('translate-x-1');
    button.classList.remove('bg-green-500');
    button.classList.add('bg-gray-300');
  }

  updateTransformerDependencies(components);
  // Update visual state of all manual disconnectors
  components.transformers.forEach((_, index) => {
    const manualDisc = document.getElementById(`manualDisconnector${index + 2}`);
    const disconnector = document.getElementById(`disconnector${index + 2}`);
    if (manualDisc) {
      manualDisc.style.opacity = components.manualMode.state ? "1" : "0.5";
      disconnector.style.opacity = components.manualMode.state ? "0.5" : "1";
    }
  });


  updateSystemStatus();
}

function showWarning(message) {
  alert(message);
}

function generateCircleText(item) {
  const circle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
  circle.setAttribute("id", item.id);
  circle.setAttribute("cx", item.x - 5);
  circle.setAttribute("cy", item.y + 3);
  circle.setAttribute("r", 5);
  circle.setAttribute("fill", item.color);

  // Create text element
  const text = document.createElementNS("http://www.w3.org/2000/svg", "text");
  text.setAttribute("x", item.x);
  text.setAttribute("y", item.y + 10);
  text.setAttribute("class", "text-sm");
  text.textContent = item.text;
  return { circle, text };
}

function canToggleComponent(componentId, index = -1) {
  // Check topraklama state first
  if (componentId !== "topraklama") {
    if (index >= 0) {
      // Topraklama açıkken elektrik geçemez
      if (components.transformers[index].topraklama.state) {
        return false;
      }
    } else {
      if (components.topraklama.state) {
        return false;
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
    if (dep.startsWith("manualDisconnector")) {
      const tIndex = parseInt(dep.replace("manualDisconnector", "")) - 2;
      return components.transformers[tIndex].manualDisconnector.state;
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
  if (newState) {
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
    components.transformers.forEach(transformer => {
      transformer.state = false;
      transformer.manualDisconnector.state = false;
      transformer.disconnector.state = false;
      transformer.tms.state = false;
      transformer.topraklama.state = false;
    });
  }

  updateSystemStatus();
}

function toggleTransformerTopraklama(index) {
  const transformer = components.transformers[index];
  if (!transformer) return;

  const topraklamaElement = document.getElementById(`topraklama${index + 2}`);
  if (!topraklamaElement) return;

  const currentState = topraklamaElement.classList.contains("energized");
  const newState = !currentState;
  if (newState) {
    showWarning("Topraklama hattı kapalı olacağı için elektrik verilemiyor!");
    return;
  }

  updateTopraklamaVisual(topraklamaElement, newState);
  transformer.topraklama.state = newState;

  updateSystemStatus();
}

function toggleTMSwithEngine() {
  if (!canToggleComponent("TMSwithEngine")) {
    showWarning("Topraklama hattı kapalı olduğu için Akım Trafosu açılamıyor!");
    return;
  }
  const mainBusbar = document.getElementById("mainBusbar");
  if (!mainBusbar) return;
  const currentState = mainBusbar.classList.contains("energized");
  const newState = !currentState;
  if (newState) {
    mainBusbar.classList.remove("de-energized");
    mainBusbar.classList.add("energized");
  } else {
    mainBusbar.classList.remove("energized");
    mainBusbar.classList.add("de-energized");
  }
  components.TMSwithEngine.state = newState;
  components.mainBusbar.state = newState;

  updateSystemStatus();
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

  updateSystemStatus();
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

  updateSystemStatus();
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

    updateSystemStatus();
  }
}

function toggleTMS(index) {
  if (!canToggleComponent("tms", index)) {
    showWarning("Topraklama hattı kapalı olduğu için Trafo açılamıyor!");
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

    updateSystemStatus();
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
      line.setAttribute("transform", newState ? "rotate(90 180 280)" : "");
    }

    if (newState) {
      disconnector.classList.remove("de-energized");
      disconnector.classList.add("energized");
    } else {
      disconnector.classList.remove("energized");
      disconnector.classList.add("de-energized");
    }

    transformer.manualDisconnector.state = newState;

    updateSystemStatus();
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
    // 
    updateSystemStatus();
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
      topraklamaLine.classList.add("closed");
    }
  } else {
    element.classList.remove("energized");
    element.classList.add("de-energized");

    // Update topraklama line
    const topraklamaLine = element.querySelector(".topraklama-line");
    if (topraklamaLine) {
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

  updateSystemStatus();
}

function loadComponentsFromLocalStorage() {
  const savedComponents = localStorage.getItem("components");
  if (savedComponents) {
    Object.assign(components, JSON.parse(savedComponents));

    // Ana bileşenlerin durumunu güncelle
    if (components.manualMode.state) {
      toggleManualMode();
    }
    updateComponentVisual("mainCB", components.mainCB.state);
    updateComponentVisual("loadDisconnect", components.loadDisconnect.state);
    updateComponentVisual("TMSwithEngine", components.TMSwithEngine.state);
    updateComponentVisual("topraklama", components.topraklama.state);
    updateComponentVisual("mainBusbar", components.mainBusbar.state);

    // Trafo bileşenlerini güncelle
    components.transformers.forEach((transformer, index) => {
      updateComponentVisual(`cb${index + 2}`, transformer.state);
      updateComponentVisual(`manualDisconnector${index + 2}`, transformer.manualDisconnector.state);
      updateComponentVisual(`disconnector${index + 2}`, transformer.disconnector.state);
      updateComponentVisual(`tms${index + 2}`, transformer.tms.state);
      updateComponentVisual(`topraklama${index + 2}`, transformer.topraklama.state);
    });
    updateItemColors(components);
  }
}

function updateComponentVisual(id, state) {
  const element = document.getElementById(id);
  if (!element) return;

  if (state) {
    element.classList.remove("de-energized");
    element.classList.add("energized");
  } else {
    element.classList.remove("energized");
    element.classList.add("de-energized");
  }
}