// Component state management
components = {
  manualMode: {
    state: false,
    name: "Manuel Ayırıcı Modu"
  },
  mainCB: {
    state: false,
    name: "Ana Giriş Kesici",
    dependencies: [],
    voltage: 26.4,
    current: 25.2,
    power: 0,
  },
  loadDisconnect: {
    state: false,
    name: "Manuel Ayırıcı",
    dependencies: ["mainCB"],
  },
  TMSwithEngine: {
    state: false,
    name: "Akım Trafosu",
    dependencies: ["loadDisconnect"],
  },
  topraklama: {
    state: false,
    name: "Ana Topraklama",
    dependencies: ["loadDisconnect"],
  },
  mainBusbar: {
    state: false,
    name: "Ana Bara",
    dependencies: ["TMSwithEngine"],
  },
  transformers: Array(5)
    .fill()
    .map((_, i) => ({
      state: false,
      name: `Trafo ${i + 1}`,
      dependencies: ["mainBusbar"],
      rating: 1600,
      current: 0,
      power: 0,
      manualDisconnector: {
        state: false,
        name: `Manuel Ayırıcı ${i + 1}`,
        dependencies: [`cb${i + 2}`]
      },
      disconnector: {
        state: false,
        name: `Ayırıcı ${i + 1}`,
        dependencies: [`cb${i + 2}`]
      },
      tms: { 
        state: false, 
        name: `Trafo ${i + 1}`,
        dependencies: [`disconnector${i + 2}`]
      },
      topraklama: {
        state: false,
        name: `Topraklama ${i + 1}`,
        dependencies: [`tms${i + 2}`]
      }
    })
  ),
};
