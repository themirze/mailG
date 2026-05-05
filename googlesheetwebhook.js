<div style="max-width: 680px; margin: 20px auto; padding: 30px; border: 1px solid #e0e0e0; border-radius: 8px; font-family: Arial, sans-serif; font-size: 16px; line-height: 1.6; color: #333333;">

    <p style="margin-top: 0; margin-bottom: 25px;">
        Merhaba [Müşteri Adı],
    </p>

    <p style="margin-bottom: 25px;">
        Web sitenizdeki form verilerini (GCLID ve Dönüşüm Zamanı) otomatik olarak Google Sheets’e aktaracak olan <strong>Çevrimdışı Dönüşüm Otomasyonu</strong> için gerekli teknik yol haritasını hazırladım.
    </p>

    <p>
        Bu kurulum, web sitenizin formu gönderdiği anda (Fetch API) Google Sheets tarafında oluşturacağımız bir uç noktaya (Webhook) veriyi saniyeler içinde iletmesi mantığıyla çalışır. İşte adım adım kurulum rehberi:
    </p>

    <h3 style="font-weight: normal; color: #d62d20; margin-top: 40px; border-bottom: 1px solid #eeeeee; padding-bottom: 5px;">
        1. Adım: Google Sheets Webhook Hazırlığı (Backend)
    </h3>
    <p style="margin-top: 20px;">
        Öncelikle verilerin kaydedileceği Google E-Tablo dosyasını bir API alıcısına dönüştürmemiz gerekiyor:
    </p>
    <ol style="padding-left: 20px; margin-top: 10px;">
        <li style="margin-bottom: 10px;">Google Sheets dosyanızı açın ve üst menüden <strong>Uzantılar > Apps Komut Dosyası</strong>'na gidin.</li>
        <li style="margin-bottom: 10px;">Aşağıdaki kodu mevcut editöre yapıştırın:</li>
    </ol>

    <pre style="background-color: #f4f4f4; padding: 15px; border-radius: 4px; font-family: 'Courier New', Courier, monospace; font-size: 13px; white-space: pre-wrap; word-wrap: break-word;">function doPost(e) {
  try {
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    var data = JSON.parse(e.postData.contents);

    // Gelen verileri sütunlara eşliyoruz
    var rowData = [
      new Date(),           // Kayıt Zamanı
      data.gclid,           // Google Click ID
      data.conversion_time, // Dönüşüm Zamanı
      data.email            // Müşteri E-postası (Opsiyonel)
    ];

    sheet.appendRow(rowData);

    return ContentService.createTextOutput(JSON.stringify({"result": "success"}))
                         .setMimeType(ContentService.MimeType.JSON);
  } catch (f) {
    return ContentService.createTextOutput(JSON.stringify({"result": "error", "error": f.toString()}))
                         .setMimeType(ContentService.MimeType.JSON);
  }
}</pre>

    <p style="margin-top: 20px; font-weight: bold;">⚠️ Önemli: Dağıtım (Deployment) Ayarı</p>
    <ul style="padding-left: 20px;">
        <li style="margin-bottom: 5px;">Sağ üstteki <strong>Dağıt > Yeni Dağıtım</strong> butonuna tıklayın.</li>
        <li>Tür olarak <strong>Web Uygulaması</strong> seçin.</li>
        <li>"Erişimi olanlar" kısmını mutlaka <strong>Herkes (Anyone)</strong> olarak işaretleyin.</li>
        <li>Dağıtım sonrası size verilen <strong>Web Uygulaması URL'sini</strong> kopyalayın.</li>
    </ul>

    <h3 style="font-weight: normal; color: #d62d20; margin-top: 40px; border-bottom: 1px solid #eeeeee; padding-bottom: 5px;">
        2. Adım: Web Sitesi Entegrasyonu (Frontend - Fetch API)
    </h3>
    <p style="margin-top: 20px;">
        Yazılım ekibiniz, form başarıyla gönderildiğinde aşağıdaki JavaScript kodunu tetiklemelidir. Bu kod, yakalanan GCLID değerini ve zaman damgasını hazırladığımız Webhook'a gönderir:
    </p>

    <pre style="background-color: #f4f4f4; padding: 15px; border-radius: 4px; font-family: 'Courier New', Courier, monospace; font-size: 13px; white-space: pre-wrap; word-wrap: break-word;">// Form gönderim fonksiyonu içine eklenecek kod
const sendToWebhook = async (gclidValue, userEmail) => {
  const webhookUrl = "BURAYA_KOPYALADIGINIZ_WEB_UYGULAMASI_URL_GELECEK";
  
  const payload = {
    gclid: gclidValue,
    conversion_time: new Date().toISOString().replace('T', ' ').split('.')[0] + "+0300", // Örn: 2026-04-21 14:30:00+0300
    email: userEmail
  };

  try {
    await fetch(webhookUrl, {
      method: 'POST',
      mode: 'no-cors', // Google Apps Script için no-cors gereklidir
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    console.log("Dönüşüm verisi başarıyla aktarıldı.");
  } catch (error) {
    console.error("Hata:", error);
  }
};</pre>

    <h3 style="font-weight: normal; color: #d62d20; margin-top: 40px; border-bottom: 1px solid #eeeeee; padding-bottom: 5px;">
        3. Adım: Veri Doğrulama ve Test
    </h3>
    <p style="margin-top: 20px;">
        Entegrasyon tamamlandıktan sonra şu kontrolleri yapmamız gerekmektedir:
    </p>
    <ul style="padding-left: 20px; margin-top: 10px;">
        <li style="margin-bottom: 10px;"><strong>GCLID Yakalama:</strong> Sitenize bir reklam tıklaması simülasyonu ile (URL sonuna <code>?gclid=test_123</code> ekleyerek) girilmeli ve formdaki gizli alanın bu değeri aldığından emin olunmalıdır.</li>
        <li style="margin-bottom: 10px;"><strong>Zaman Formatı:</strong> Google Sheets'e düşen zaman formatının Google Ads'in kabul ettiği <code>yyyy-mm-dd hh:mm:ss+tz</code> formatında olduğu teyit edilmelidir.</li>
    </ul>

    <p style="margin-top: 30px;">
        Bu adımları tamamladığınızda verileriniz Google Sheets dosyanızda birikmeye başlayacaktır. Bir sonraki aşamada bu tabloyu Google Ads hesabınıza otomatik yükleme (Scheduled Upload) olarak bağlayacağız.
    </p>

    <p style="margin-top: 40px; margin-bottom: 0;">
        Saygılarımızla,
    </p>
    <p style="margin-top: 5px; margin-bottom: 0; font-weight: bold; color: #1a73e8;">
        Mirzagha
    </p>
    <p style="margin-top: 2px; color: #5f6368; line-height: 1.4;">
        Technical Solutions Team<br>
        Cognizant, on behalf of Google
    </p>
</div>
