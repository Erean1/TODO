<p align="center"> 
<img src="./www/img/TodoLogo.png" width="200" height="200">
</p>

<h3 align="center">TODO</h3>

## İçindekiler
- [Proje Hakkında](#proje-hakkında)
- [Teknolojiler](#teknolojiler)
- [Özellikler](#özellikler)
- [Kurulum](#kurulum)
- [Kullanım](#kullanım)
- [Lisans](#lisans)
- [İletişim](#iletisim)
- [APIS](#apis)
- [FLOWS](#flows)

## Proje Hakkkında
Bu proje Staj sürem boyunca geliştirdiğim bir Todo Uygulamasıdır.Kullanıcıların görevlerini yönetebileceği,planlayabileceği,takip edebileceği e-posta yoluyla hatırlatma bildirimleri alabileceği bir web uygulamasıdır.SPA mimarisi üzerine kurulmuştur.

## Teknolojiler
Backend: Node-RED,Node.js
Frontend: jQuery,Bootstrap
Veritabanı: MongoDB
Ek Kütüphaneler: SurveyJS,Datatables.js

## Özellikler
Kullanıcı kaydı,girişi ve şifre sıfırlama(OTP ile mail doğrulama) <br>
Access token(30 dk) ve refresh token(7 gün) ile güvenli kimlik doğrulamaz <br>
E-posta doğrulaması olmadan bazı sayfalara erişim engeli <br>
Görev oluşturma,düzenleme,silme,tamamlandı olarak işaraetleme <br>
Schedule(zamanlama) özelliği ile görev takibi<br>
Rollendirme Sistemi(Moderator,admin,user)<br>
Günlük otomatik görev kontrolü ve e-posta ile hatırlatmalar<br>
Dashboard'da kullanıcı ve görev istatistikleri<br>
SPA yapısı ve hash tabanlı navigasyon ile hızlı sayfa geçişleri<br>

## Kurulum
<font color="agenta" size="4px">Projeyi Klonlayın</font><br>
<font color="yellow">git clone </font>https://github.com/Erean1/TODO.git <br>
<font color="yellow">cd </font>todo-projesi<br>
<font size="4px" color="agenta">Bağımlıkları Yükleyin</font><br>
npm install <br>
<font size="4px" color="agenta">Uygulamayı Başlatın</font><br>
npm start


## Kullanım
- Projeyi çalıştırdıktan sonra tarayıcıda `http://127.0.0.1:1880/` adresine gidin.
- Kayıt olarak yeni kullanıcı oluşturabilirsiniz veya mevcut kullanıcı ile giriş yapabilirsiniz.
- Şifrenizi unuttuysanız şifremi unutum diyebilirsiniz.
- Giriş yaptıktan sonra görev ekleyebilir,düzenleyebilir,silebilir ve tamamlanmış olarak işaretleyebilirsiniz.
- Görevlerim tablosunu ve Tamamlanan Görevlerim tablosunu görebilirsiniz
- Ajanda kısmında günlük olarak notlarınızı tutabilirsiniz.
- Profilim ve görevler için zamanlayıcı oluşturmak için sağ üstte bulunan onayla butonundan hesabınızı onaylayıp erişebilirsiniz.
- Her sabah sistem otomatik olarak görevleri kontrol edip ilgili kullanıcılara mail yoluyla bilgilendirme yapar


## Lisans
Bu proje Apache License 2.0 lisansı ile lisanslanmıştır.
Daha fazla bilgi için [LICENSE](LICENSE) dosyasına bakabilirsiniz.

## İletişim
Email : citeren04@gmail.com <br>
Github : github.com/Erean1 <br>
LinkedIn : www.linkedin.com/in/eren-çit

## APIS
- [post] /api/login ---> Login işlemini yapar
- [post] /api/register ---> Register işlemini yapar
- [post] /api/refresh-token ---> Refresh token ile sürekli olarak accessToken oluşturma işlemini yapar
- [post] /api/resetpw ---> Email yoluyla resetOtp alınır
- [post] /api/verifytoken ---> resetOtp kontrol edilir 
- [post] /api/newpassword ---> Yeni şifre oluşturma işlemini yapar
- [get] /api/logout ---> Çıkış işlemini yapar
- [get] /api/myTodos ---> Tamamlanmayan görevleri gösterme işlemini yapar
- [get] /api/completedTodos ---> Tamamlanmayan görevleri gösterme işlemini yapar
- [post] /api/operation/:type ---> Gelen type parametresine göre uygun işlemini yapar
- [get] /api/form/:type ---> Gelen form türüne göre formu getirme işlemini yapar
- [get] /api/table:/type ---> Gelen table türüne göre formu getirme işlemini yapar
- [get] /api/logs ---> Logları Getirme işlemini yapar
- [post] /api/user-operation/:type ---> Gelen type göre kullanıcılara yapılan(ekleme,güncelleme) işlemleri yapar.
- [get] /api/userList ---> Kullanıcı Listesini Getirir
- [get] /api/categoryList ---> Kategori listesini getirir
- [post] /api/category-operation/:type ---> Gelen type parametresine göre kategori işleminlerini yapar
- [post] /api/verifyUser ---> Kullanıcıya mail yoluyla verify linkini yollar
- [get] /api/verify ---> Kullanıcıyı verify eder
- [post] /api/userProfile ---> Kullanıcının profil bilgilerini getirir
- [post] /api/updateBio ---> Kullanıcının biyografisini günceller
- [post] /api/updateLocatoin ---> Kullanıcının loasyonunu günceller
- [post] /api/updateImage ---> Kullanıcının fotoğrafını günceller
- [get] /api/getNotes ---> Kullanıcının notlarını getirir.
- [post] /api/note-operations/:type ---> Kullanıcının notlarıyla işlemleri yapar.
- [get] /api/userStats ---> Kullanıcı istatistiklerini getirir
- [get] /api/todoStats ---> Görevlerin istatistiklerini getirir

## Flows
-<font color="gree">Main Flow</font> Ana sayfa bu flowda bulunur<br>
-<font color="gree">APIS</font> Apiler bu flowda bulunur<br>
-<font color="gree">Partials</font> SPA yapısı için lazım olan sayfalar burada bulunur<br>
-<font color="gree">AUTH</font> AUTH işlemleri flowda bulunur<br>
-<font color="gree">Görev Takip</font> Görevlerin Takibi bu flowda bulunur
-<font color="gree">Dashboard</font> Dashboard apileri bu flowda bulunur<br>
<font size="3px" color="red">SUBFLOWS</font><br>
-<font color="gree">Check User </font> Kullanıcı erişimi bu subflowda kontrol edilir









