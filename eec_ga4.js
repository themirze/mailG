<div style="max-width: 680px; margin: 20px auto; padding: 30px; border: 1px solid #e0e0e0; border-radius: 8px; font-family: Arial, sans-serif; font-size: 16px; line-height: 1.6; color: #333333;">

    <p style="margin-top: 0; margin-bottom: 25px;">
        Merhaba [Müşteri Adı],
    </p>

    <p style="margin-bottom: 25px;">
        Web sitenizdeki e-ticaret ölçümlemelerini (GA4) ve Google Ads dönüşüm takibini en doğru şekilde yapabilmemiz için temel <strong>Veri Katmanı (dataLayer)</strong> yapısını hazırladım. 
    </p>
    <p>
        Reklam performansınızı artıracak olan <strong>Gelişmiş Dönüşümler (Enhanced Conversions)</strong> özelliğinin çalışabilmesi için, özellikle <code>purchase</code> (satın alma) adımında müşteri bilgilerinin (user_data) şifrelenerek gönderilmesi büyük önem taşımaktadır. Yazılım ekibinizin ilgili sayfalara eklemesi gereken dinamik kod yapıları aşağıdadır:
    </p>

    <h3 style="font-weight: normal; color: #d62d20; margin-top: 40px; border-bottom: 1px solid #eeeeee; padding-bottom: 5px;">
        1. Ürün Görüntüleme (view_item)
    </h3>
    <p style="margin-top: 15px; font-size: 14px;">Kullanıcı bir ürün detay sayfasına girdiğinde çalışmalıdır:</p>
    <pre style="background-color: #f4f4f4; padding: 15px; border-radius: 4px; font-family: 'Courier New', Courier, monospace; font-size: 13px; white-space: pre-wrap; word-wrap: break-word;">&lt;script&gt;
window.dataLayer = window.dataLayer || [];
dataLayer.push({ ecommerce: null }); // Önceki veriyi temizle
dataLayer.push({
  event: "view_item",
  ecommerce: {
    currency: "TRY",
    value: 299.99,
    items: [
      {
        item_id: "SKU12345",
        item_name: "Siyah Koşu Ayakkabısı",
        item_brand: "MarkaAdı",
        item_category: "Ayakkabı",
        price: 299.99,
        quantity: 1
      }
    ]
  }
});
&lt;/script&gt;</pre>

    <h3 style="font-weight: normal; color: #d62d20; margin-top: 40px; border-bottom: 1px solid #eeeeee; padding-bottom: 5px;">
        2. Sepete Ekleme (add_to_cart)
    </h3>
    <p style="margin-top: 15px; font-size: 14px;">Kullanıcı "Sepete Ekle" butonuna tıkladığında çalışmalıdır:</p>
    <pre style="background-color: #f4f4f4; padding: 15px; border-radius: 4px; font-family: 'Courier New', Courier, monospace; font-size: 13px; white-space: pre-wrap; word-wrap: break-word;">&lt;script&gt;
window.dataLayer = window.dataLayer || [];
dataLayer.push({ ecommerce: null });
dataLayer.push({
  event: "add_to_cart",
  ecommerce: {
    currency: "TRY",
    value: 299.99,
    items: [
      {
        item_id: "SKU12345",
        item_name: "Siyah Koşu Ayakkabısı",
        item_brand: "MarkaAdı",
        item_category: "Ayakkabı",
        price: 299.99,
        quantity: 1
      }
    ]
  }
});
&lt;/script&gt;</pre>

    <h3 style="font-weight: normal; color: #d62d20; margin-top: 40px; border-bottom: 1px solid #eeeeee; padding-bottom: 5px;">
        3. Ödemeye Başlama (begin_checkout)
    </h3>
    <p style="margin-top: 15px; font-size: 14px;">Kullanıcı sepeti onaylayıp ödeme/adres adımına geçtiğinde çalışmalıdır:</p>
    <pre style="background-color: #f4f4f4; padding: 15px; border-radius: 4px; font-family: 'Courier New', Courier, monospace; font-size: 13px; white-space: pre-wrap; word-wrap: break-word;">&lt;script&gt;
window.dataLayer = window.dataLayer || [];
dataLayer.push({ ecommerce: null });
dataLayer.push({
  event: "begin_checkout",
  ecommerce: {
    currency: "TRY",
    value: 299.99,
    items: [
      {
        item_id: "SKU12345",
        item_name: "Siyah Koşu Ayakkabısı",
        price: 299.99,
        quantity: 1
      }
    ]
  }
});
&lt;/script&gt;</pre>

    <h3 style="font-weight: normal; color: #d62d20; margin-top: 40px; border-bottom: 1px solid #eeeeee; padding-bottom: 5px;">
        4. Satın Alma (purchase) + Gelişmiş Dönüşümler
    </h3>
    <div style="background-color: #e8f0fe; border-left: 4px solid #1a73e8; padding: 15px 20px; margin-top: 15px; margin-bottom: 15px; font-size: 14px; line-height: 1.6;">
        <p style="margin: 0 0 5px 0;"><strong>⚠️ Yazılım Ekibinin Dikkatine:</strong></p>
        <p style="margin: 0;">Bu adım, siparişin başarıyla tamamlandığı "Teşekkürler" sayfasında çalışmalıdır. Google'ın siparişi müşteriyle eşleştirebilmesi için <code>user_data</code> objesi içindeki e-posta adresi küçük harflerle, telefon numarası ise <strong>E.164 formatında (başında + ve ülke kodu ile)</strong> iletilmelidir.</p>
    </div>
    
    <pre style="background-color: #f4f4f4; padding: 15px; border-radius: 4px; font-family: 'Courier New', Courier, monospace; font-size: 13px; white-space: pre-wrap; word-wrap: break-word;">&lt;script&gt;
window.dataLayer = window.dataLayer || [];
dataLayer.push({ ecommerce: null });
dataLayer.push({
  event: "purchase",
  
  // Gelişmiş Dönüşümler (Enhanced Conversions) İçin Müşteri Verisi
  user_data: {
    email: "musteri@ornek.com",        // Dinamik olarak doldurulmalı (küçük harf)
    phone_number: "+905551234567",     // E.164 formatı zorunlu (+90...)
    address: {
      first_name: "Ahmet",
      last_name: "Yılmaz",
      city: "İstanbul",
      country: "TR"
    }
  },

  // Sipariş Detayları
  ecommerce: {
    transaction_id: "Siparis_123456",  // Benzersiz sipariş numarası
    value: 299.99,                     // Ödenen toplam tutar
    tax: 45.76,                        // Vergi tutarı (opsiyonel)
    shipping: 0.00,                    // Kargo tutarı
    currency: "TRY",
    items: [
      {
        item_id: "SKU12345",
        item_name: "Siyah Koşu Ayakkabısı",
        item_brand: "MarkaAdı",
        item_category: "Ayakkabı",
        price: 299.99,
        quantity: 1
      }
    ]
  }
});
&lt;/script&gt;</pre>

    <p style="margin-top: 25px;">
        Yazılım ekibiniz bu kurguyu web sitenize entegre edip test ortamına aldığında bana bilgi verebilirseniz, etiketlerin ve verilerin doğru aktığını kontrol etmekten memnuniyet duyarım.
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
