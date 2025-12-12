## Active Directory Scanner

ad-scanner, Active Directory (AD) ortamlarını tarayan, nesneleri ve ACL  ilişkilerini Neo4j Graph Database üzerine aktaran ve bu verileri REST API üzerinden görselleştirilmek üzere sunan tam kapsamlı bir güvenlik analiz platformudur.

### Özellikler
1. ad-scanner(C#): AD ortamındaki User, Computer ve Group objelerini ve yetki ilişkilerini tarar.
2. ad-server(samba): Boş bir AD ortamı sunar.
3. ad-seeder: Test verilerini içeren seed.sh dosyasını çalıştırıp AD server içerisine ekleyerek test ortamı oluşturur.
4. scanner-db(Neo4j): Grafik veri tabanı olarak ilişkisel verileri saklar.
5. scanner-backend(Django): Neo4j veri tabanındaki verileri REST API üzerinden sunar.
6. scanner-frontend(React.js): Kullanıcı arayüzü. dashboard, users, computers ve groups sayfaları ile verileri görselleştirir.

### Kurulum
Proje ana dizininde terminali açın ve şu komutu çalıştırın:
```bash
docker-compose up -d --build
```
### Kullanıcı Kimlik Bilgileri
AD server ve Neo4j veri tabanı için tanımlanmış kullanıcı kimlikleri şu şekildedir:
1. AD Server
	1. local (AD IP adresi)
	2. corp.test.local (AD Domain)
	3. Administrator:Password123!
2. Neo4j DB
	1. neo4j:123456789

### Kullanım
Gerekli kurulumlar yapıldıktan sonra bütün sistem ortalama 1-1.5 dakika sonrasında hazır olacaktır.

#### AD-Scanner (C#):
Docker servisleri hazır olduğunda ad-scanner C# console uygulaması çalıştırılır. Tarayıcı çalıştırıldığında AD servera bağlanmak için gerekli bilgiler girilir. Gerekli bilgiler tarayıcıda parantez içerisinde verilmiştir. 

Bağlantı için girilmesi gerekilen bilgiler sırasıyla şu şekildedir:
1. localhost (AD server IP)
2. corp.test.local (AD Domain)
3. Administrator (AD Username)
4. Password123! (AD Password)

Gerekli bilgiler girildikten sonra ad-scanner AD serverına ve Neo4j veri tabanına bağlanacak, AD içerisindeki tarama gerçekleştirip tarama sonuçlarını veri tabanına yazacaktır.

#### Backend ve Frontend Erişimi:
Tarama tamamlanıp veriler veri tabanına yazıldıktan sonra verilere şu bağlantılardan erişebilirsiniz:
- Frontend (React.js): http://localhost:5173 
- Backend (Django): http://localhost:8000
- DB Browser (Neo4j): http://localhost:7474

Backend endpointleri şu şekildedir:
- /api/v1/users
- /api/v1/users/{objectDistinguishedName}
- /api/v1/computers
- /api/v1/computers/{objectDistinguishedName}
- /api/v1/groups
- /api/v1/groups/{objectDistinguishedName}
- /api/v1/dashboard/stats

---
Bu proje Forestal Full Stack Developer - Challenge yönergeleri doğrultusunda gerçekleştirilmiştir.
