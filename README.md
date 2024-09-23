# Aday Takip Sistemi Server

Bu proje hakkında detaylı bilgilere [Aday Takip Sistemi](https://github.com/Fatihkrty/aday-takip-sistemi) repo adresi üzerinden erişebilirsiniz.

## Özellikler

- RBAC (Role based access control)
- Session yönetimi (Redis)
- Queue sistemi (Bull + Redis)
- Dosya depolama ve servis etme (Minio S3)
- Mail gönderme sistemi (Node Mailer)
- ORM database yönetimi (Prisma)
- İstek verileri doğrulama (Zod)

## Kullanılan Teknolojiler

- Typescript
- Fastify
- Prisma
- Redis
- Minio Object Storage
- Node Mailer
- Bull
- Handlebars
- Zod
- Docker

Geliştirme aşamasında kod stabilizasyonu ve kod içeriği görsel iyileştirmesi ve geliştirme aşamaları için:

- Nodemon
- Eslint
- Perfectionist
- Prettier

kütüphaneleri kullanılmıştır.

### Proje Hakkında

Bu proje `Fastify` üzerinde inşa edilmiştir. Database olarak `Postgresql` kullanıldı. Oturum açmış kullanıcı verileri (session) `Redis` üzerinde saklanır. Kullanıcı dosyaları `Minio Object Storage` üzerinde saklanır. Ayrıca aynı anda yüksek sayıda mail işlemleri için `Bull` kütüphanesi ile `queue` sistemi kullanıldı.Mail gönderimi için `Node Mailer`, mail işlemleri template dosyalarını yorumlamak için `Handlebars` kullanıldı. Gelen data ve query istekleri doğrulaması için `Zod` kütüphanesi kullanıldı.

# Bilgisayarınızda Çalıştırın

Projeyi klonlayın:

```bash
  git clone git@github.com:Fatihkrty/aday-takip-sistemi-server.git
```

Proje dizinine gidin:

```bash
  cd ats-server
```

## Kurulum Kısa Yöntem

Bu yöntemi kendi konfigürasyonunuzu yapmadan direk sistemi denemek için aşağıdaki komutları sırayla girerek hazır hale getirebilirsiniz.

```bash
  yarn initdirs
```

```bash
  yarn pg:up
```

```bash
  yarn redis:up
```

```bash
  yarn minio:up
```

```bash
  yarn prisma:push
```

```bash
  yarn dev
```

## Kurulum Detaylı Yöntem

### Database Yapılandırması

Database yapılandırması için `./ats-server/docker/postgres` dizinine gidin. Bu klasör içindeki `.env` dosyasında database bilgileri (database adı, kullanıcı, şifre, port) mevcuttur. Bu kısımları kendinize göre düzenleyin. Daha sonra posgtres container içerisindeki verileri kendi bilgisayarımızdaki klasöre bağlamak için data klasörü oluşturmamız gerek. Bunun için:

```bash
  mkdir -p $HOME/data/ats/postgres
```

Bu komut ile posgtres verilerini `$HOME/data/ats/posgtres` altına bağlamış olduk. (Bu sayede container silinmiş olsa daha veriler bilgisayarımızda kalacaktır.) Eğer klasör yolunu değiştirmek isterseniz bunu `docker-compose.yml` dosyasındaki volumes seçeneği aldından yapabilirsiniz.

İşlemler bittikten sonra container ayağa kaldırmak için:

```bash
  docker compose up -d
```

komutunu çalıştırın. Eğer bir hata yapmadıysanız container sorunsuz şekilde ayağa kalkacaktır.

Database ayağa kalktıktan sonra `./ats-server` altındaki `.env` dosyasını açın. `DATABASE_URL` içerisindeki bilgileri de database bilgileriniz ile değiştirin.

`postgresql://[DB_USER]:[DB_PASSWORD]@localhost:[DB_PORT]/[DB_NAME]?schema=public`

### Redis Yapılandırması

Redis yapılandırması için `./ats-server/docker/redis` dizinine gidin. Bu klasör içindeki `.env` dosyasında redis bilgileri (port ve şifre) mevcuttur. Bu kısımları kendinize göre düzenleyin. Daha sonra redis container içerisindeki verileri kendi bilgisayarımızdaki klasöre bağlamak için data klasörü oluşturmamız gerek. Bunun için:

```bash
  mkdir -p $HOME/data/ats/redis
```

Bu komut ile redis verilerini `$HOME/data/ats/redis` altına bağlamış olduk. (Bu sayede container silinmiş olsa daha veriler bilgisayarımızda kalacaktır.) Eğer klasör yolunu değiştirmek isterseniz bunu `docker-compose.yml` dosyasındaki volumes seçeneği aldından yapabilirsiniz.

İşlemler bittikten sonra container ayağa kaldırmak için:

```bash
  docker compose up -d
```

komutunu çalıştırın. Eğer bir hata yapmadıysanız container sorunsuz şekilde ayağa kalkacaktır.

Redis ayağa kalktıktan sonra `./ats-server` altındaki `.env` dosyasını açın. `REDIS_PORT` ve `REDIS_PASSWORD` içerisindeki bilgileri de redis bilgileriniz ile değiştirin.

### Minio Yapılandırması

Minio yapılandırması için `./ats-server/docker/minio` dizinine gidin. Bu klasör içindeki `.env` dosyasında minio bilgileri (port, console port, kullanıcı, şifre) mevcuttur. Bu kısımları kendinize göre düzenleyin. Daha sonra minio container içerisindeki verileri kendi bilgisayarımızdaki klasöre bağlamak için data klasörü oluşturmamız gerek. Bunun için:

```bash
  mkdir -p $HOME/data/ats/minio
```

Bu komut ile redis verilerini `$HOME/data/ats/minio` altına bağlamış olduk. (Bu sayede container silinmiş olsa daha veriler bilgisayarımızda kalacaktır.) Eğer klasör yolunu değiştirmek isterseniz bunu `docker-compose.yml` dosyasındaki volumes seçeneği aldından yapabilirsiniz.

İşlemler bittikten sonra container ayağa kaldırmak için:

```bash
  docker compose up -d
```

komutunu çalıştırın. Eğer bir hata yapmadıysanız container sorunsuz şekilde ayağa kalkacaktır.

Minio ayağa kalktıktan sonra `./ats-server` altındaki `.env` dosyasını açın. `MINIO_API_PORT` , `MINIO_ROOT_USER`, `MINIO_ROOT_PASSWORD` içerisindeki bilgileri de redis bilgileriniz ile değiştirin.

### Backend İlk Kurulum

Backend çalıştırmak için `./ats-server` dizinine gidin. Bu dizinde iken <strong>sadece ilk çalıştırma sırasında</strong> prisma verilerini sisteme yüklememiz gerekli. Bunun için:

```bash
  yarn prisma:push
```

komutunu çalıştıralım. Komut başarılı olduktan sonra artık backend için hepsi hazır.

### Backend Çalıştırma

Development modda çalıştırmak için:

```bash
  yarn dev
```

Product modda çalıştırma:

```bash
  yarn build && yarn start
```
