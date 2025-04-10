### README

# OG Tek Hat ve Sistem Durumu Projesi

Bu proje, OG Tek Hat ve Sistem Durumu izleme ve kontrol sistemi için bir web tabanlı uygulamadır. Proje, kullanıcıların OG sistemindeki bileşenlerin durumlarını görselleştirmesine, kontrol etmesine ve durum değişikliklerini takip etmesine olanak tanır. Ayrıca, sistem bileşenlerinin durumları `localStorage` kullanılarak saklanır ve sayfa yenilendiğinde bile korunur.

---

## Proje Özellikleri

- **OG Tek Hat Görselleştirmesi**:
  - OG sistemindeki bileşenlerin (kesiciler, ayırıcılar, trafolar vb.) durumlarını SVG tabanlı bir arayüzde görselleştirir.
  - Bileşenlerin durumları (aktif/pasif) renklerle ifade edilir (`green` veya `red`).

- **Durum Kontrolü ve Güncelleme**:
  - Kullanıcılar, bileşenlerin durumlarını (örneğin, kesici aç/kapa) kontrol edebilir.
  - Durum değişiklikleri anında görsel olarak yansıtılır.

- **Manuel ve Otomatik Mod**:
  - Manuel modda, kullanıcılar bileşenleri doğrudan kontrol edebilir.
  - Otomatik modda, sistem bileşenleri belirli kurallara göre çalışır.

- **Durum Saklama**:
  - `localStorage` kullanılarak bileşenlerin durumları tarayıcıda saklanır.
  - Sayfa yenilendiğinde bile bileşenlerin durumları korunur.

- **Durum Paneli**:
  - Sistem durumunu özetleyen bir iframe paneli (`status-panel.php`) içerir.

---

## Proje Yapısı

### 1. **Dosya ve Klasör Yapısı**

```
fair-project/
├── js/
│   ├── toggles.js          # Bileşenlerin durumlarını kontrol eden ana JavaScript dosyası
│   ├── items.js            # Bileşenlerin tanımları ve koordinat bilgileri
│   ├── components.js       # Sistem bileşenlerinin durumlarını yöneten yapı
│   ├── status.js           # Durum paneliyle ilgili işlemler
│   ├── modal.js            # Modal pencerelerle ilgili işlemler
├── navbar.php              # Navigasyon çubuğu
├── ogtekhat.php            # OG Tek Hat sayfası
├── status-panel.php        # Sistem Durumu paneli
├── style.css               # Proje için özel CSS stilleri
```

---

### 2. **Ana Dosyalar**

#### **`ogtekhat.php`**
- OG Tek Hat sayfasını oluşturur.
- SVG tabanlı görselleştirme içerir.
- Kullanıcıların bileşenleri kontrol etmesine olanak tanır.

#### **`toggles.js`**
- Bileşenlerin durumlarını kontrol eden ana JavaScript dosyası.
- Fonksiyonlar:
  - `toggleComponent(id)`: Bir bileşenin durumunu değiştirir.
  - `updateItemColors(components)`: Bileşenlerin renklerini günceller.
  - `loadComponentsFromLocalStorage()`: `localStorage`'dan bileşen durumlarını yükler.

#### **`items.js`**
- Bileşenlerin tanımları ve koordinat bilgilerini içerir.
- Örnek:
  ```javascript
  const kesiciItems = [
    { id: "kesici-k", text: "Kesici Konum", color: "green", x: 50, y: 517 },
    { id: "sf6-t3", text: "SF6 Dusuk Basınç", color: "green", x: 160, y: 520 },
  ];
  ```

#### **`status-panel.php`**
- Sistem durumunu özetleyen iframe paneli.
- navbar.php ile entegre çalışır.

---

## Kurulum ve Kullanım

### 1. **Gereksinimler**
- PHP 7.4 veya üzeri
- Modern bir tarayıcı (Google Chrome, Firefox, Edge)
- Yerel bir sunucu (ör. XAMPP, WAMP)

### 2. **Kurulum**
1. Proje dosyalarını bir web sunucusuna yerleştirin.
2. ogtekhat.php dosyasını tarayıcıda açarak projeyi başlatın.

### 3. **Kullanım**
- **OG Tek Hat Sayfası**:
  - Bileşenlerin durumlarını kontrol etmek için SVG üzerindeki öğelere tıklayın.
  - Manuel modu etkinleştirmek için `toggleManualMode()` fonksiyonunu kullanın.
- **Durum Paneli**:
  - Sistem durumunu özetleyen iframe panelini görüntüleyin.

---

## Önemli Fonksiyonlar

### **`updateItemColors(components)`**
- Bileşenlerin renklerini günceller.
- `manualMode` durumuna göre renkleri yeşil (`green`) veya kırmızı (`red`) yapar.

### **`toggleComponent(id)`**
- Bir bileşenin durumunu değiştirir.
- `localStorage`'ı günceller ve görsel durumu yansıtır.

### **`loadComponentsFromLocalStorage()`**
- `localStorage`'dan bileşen durumlarını yükler.
- Sayfa yenilendiğinde bileşenlerin durumlarını korur.

---

## Geliştirme

### 1. **Yeni Bileşen Ekleme**
- `items.js` dosyasına yeni bir bileşen tanımı ekleyin:
  ```javascript
  { id: "yeni-bilesen", text: "Yeni Bileşen", color: "red", x: 200, y: 300 }
  ```
- toggles.js dosyasına gerekli kontrol fonksiyonlarını ekleyin.

### 2. **Durum Panelini Özelleştirme**
- status-panel.php dosyasını düzenleyerek yeni bilgiler ekleyin.

---

## Katkıda Bulunma

1. Bu projeyi forklayın.
2. Yeni bir dal (`feature-branch`) oluşturun.
3. Değişikliklerinizi yapın ve test edin.
4. Pull request gönderin.

---

## Lisans

Bu proje MIT Lisansı ile lisanslanmıştır. Daha fazla bilgi için `LICENSE` dosyasına bakın.

---

## İletişim

Herhangi bir sorunuz veya öneriniz varsa, lütfen [muhsin.kilic@bayraktarsolar.com](mailto:muhsin.kilic@bayraktarsolar.com) adresinden bizimle iletişime geçin.

![image](https://github.com/user-attachments/assets/16b31fca-88fd-46cd-a388-d7f865bf5e74)
![image](https://github.com/user-attachments/assets/638aa0ee-5372-4a7c-8942-f528b09f823e)
