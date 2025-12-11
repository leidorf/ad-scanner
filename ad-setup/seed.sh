#!/bin/bash

# Hata olursa durma (bazı eklemeler zaten varsa hata verebilir)
set +e 

SEED_FLAG="/var/lib/samba/.seeded"
LDAP_HOST="ad-server"
NEO4J_HOST="neo4j"
NEO4J_PORT="7474"
NEO4J_USER="neo4j"
NEO4J_PASS="123456789"

DOMAIN_UPPER="${DOMAIN^^}"
DOMAIN_LOWER="${DOMAIN,,}"
ADMIN_PASS="${DOMAINPASS:-Password123!}"
BASE_DN=$(echo $DOMAIN | sed 's/\./,DC=/g' | sed 's/^/DC=/')

export LDAPTLS_REQCERT=never

echo "==================================="
echo "🚀 GELİŞMİŞ AD SEEDER BAŞLATILIYOR"
echo "==================================="

# ---------------------------------------------------------
# FONKSİYON: LDAP ile Kullanıcı Ekleme
# ---------------------------------------------------------
create_user() {
    local username=$1
    local firstname=$2
    local lastname=$3
    local ou=$4
    local title=$5
    
    local user_dn="CN=$firstname $lastname,$ou,$BASE_DN"
    
    # LDIF oluştur
    cat > /tmp/u_$username.ldif <<EOF
dn: $user_dn
changetype: add
objectClass: top
objectClass: person
objectClass: organizationalPerson
objectClass: user
cn: $firstname $lastname
givenName: $firstname
sn: $lastname
displayName: $firstname $lastname
sAMAccountName: $username
userPrincipalName: $username@$DOMAIN_LOWER
title: $title
userAccountControl: 512
pwdLastSet: 0
EOF
    # LDAP'a ekle
    ldapadd -x -H ldaps://$LDAP_HOST -D "Administrator@$DOMAIN_UPPER" -w "$ADMIN_PASS" -f /tmp/u_$username.ldif >/dev/null 2>&1
    
    # Şifre belirle
    ldappasswd -H ldaps://$LDAP_HOST -x -D "Administrator@$DOMAIN_UPPER" -w "$ADMIN_PASS" -s "Password123!" "$user_dn" >/dev/null 2>&1
    
    # Gruba ekle (Opsiyonel)
    cat > /tmp/g_$username.ldif <<EOF
dn: CN=Domain Users,CN=Users,$BASE_DN
changetype: modify
add: member
member: $user_dn
EOF
    ldapmodify -x -H ldaps://$LDAP_HOST -D "Administrator@$DOMAIN_UPPER" -w "$ADMIN_PASS" -f /tmp/g_$username.ldif >/dev/null 2>&1
    
    echo "   👤 $firstname $lastname ($username) oluşturuldu."
}

# ---------------------------------------------------------
# 1. OU YAPISI (Organizational Units)
# ---------------------------------------------------------
echo "--> 1. Departman Yapısı Kuruluyor..."

cat > /tmp/org.ldif <<EOF
dn: OU=Corp,${BASE_DN}
changetype: add
objectClass: organizationalUnit
ou: Corp

dn: OU=IT,OU=Corp,${BASE_DN}
changetype: add
objectClass: organizationalUnit
ou: IT

dn: OU=HR,OU=Corp,${BASE_DN}
changetype: add
objectClass: organizationalUnit
ou: HR

dn: OU=Finance,OU=Corp,${BASE_DN}
changetype: add
objectClass: organizationalUnit
ou: Finance

dn: OU=Executives,OU=Corp,${BASE_DN}
changetype: add
objectClass: organizationalUnit
ou: Executives

dn: OU=R&D,OU=Corp,${BASE_DN}
changetype: add
objectClass: organizationalUnit
ou: R&D

dn: OU=Servers,OU=IT,OU=Corp,${BASE_DN}
changetype: add
objectClass: organizationalUnit
ou: Servers
EOF

ldapadd -x -H ldaps://$LDAP_HOST -D "Administrator@$DOMAIN_UPPER" -w "$ADMIN_PASS" -f /tmp/org.ldif
echo "   ✔ Departmanlar hazır."

# ---------------------------------------------------------
# 2. GRUPLAR
# ---------------------------------------------------------
echo "--> 2. Güvenlik Grupları Oluşturuluyor..."

cat > /tmp/groups_new.ldif <<EOF
dn: CN=IT-Admins,OU=IT,OU=Corp,${BASE_DN}
changetype: add
objectClass: group
sAMAccountName: IT-Admins

dn: CN=HR-Staff,OU=HR,OU=Corp,${BASE_DN}
changetype: add
objectClass: group
sAMAccountName: HR-Staff

dn: CN=Finance-Auditors,OU=Finance,OU=Corp,${BASE_DN}
changetype: add
objectClass: group
sAMAccountName: Finance-Auditors

dn: CN=VPN-Users,OU=IT,OU=Corp,${BASE_DN}
changetype: add
objectClass: group
sAMAccountName: VPN-Users

dn: CN=Legacy-Admins,OU=IT,OU=Corp,${BASE_DN}
changetype: add
objectClass: group
sAMAccountName: Legacy-Admins
EOF
ldapadd -x -H ldaps://$LDAP_HOST -D "Administrator@$DOMAIN_UPPER" -w "$ADMIN_PASS" -f /tmp/groups_new.ldif >/dev/null 2>&1
echo "   ✔ Gruplar hazır."

# ---------------------------------------------------------
# 3. KULLANICILAR (Bolca Veri)
# ---------------------------------------------------------
echo "--> 3. Kullanıcılar Oluşturuluyor..."

# IT Ekibi
create_user "admin.dave" "Dave" "Adminson" "OU=IT,OU=Corp" "IT Director"
create_user "net.sarah" "Sarah" "Network" "OU=IT,OU=Corp" "Network Eng"
create_user "dev.bob" "Bob" "Developer" "OU=IT,OU=Corp" "Senior Dev"
create_user "help.desk" "Help" "Desk" "OU=IT,OU=Corp" "Support Specialist"

# Yöneticiler
create_user "ceo.big" "Mr" "Big" "OU=Executives,OU=Corp" "CEO"
create_user "cfo.money" "Lady" "Money" "OU=Executives,OU=Corp" "CFO"

# İK ve Finans
create_user "hr.alice" "Alice" "Recruiter" "OU=HR,OU=Corp" "HR Specialist"
create_user "hr.intern" "Gary" "Intern" "OU=HR,OU=Corp" "Intern"
create_user "fin.john" "John" "Accountant" "OU=Finance,OU=Corp" "Accountant"

# Ar-Ge (R&D)
create_user "rd.scientist" "Mad" "Scientist" "OU=R&D,OU=Corp" "Lead Researcher"
create_user "rd.lab" "Lab" "Assistant" "OU=R&D,OU=Corp" "Lab Rat"

# Servis Hesapları (Saldırı senaryoları için kritik)
create_user "svc.backup" "Service" "Backup" "OU=IT,OU=Corp" "Service Account"
create_user "svc.sql" "Service" "SQL" "OU=IT,OU=Corp" "Service Account"

# ---------------------------------------------------------
# 4. BİLGİSAYARLAR
# ---------------------------------------------------------
echo "--> 4. Sunucular ve PC'ler Oluşturuluyor..."

cat > /tmp/pc.ldif <<EOF
dn: CN=DC01,OU=Servers,OU=IT,OU=Corp,${BASE_DN}
changetype: add
objectClass: computer
sAMAccountName: DC01$
userAccountControl: 4096

dn: CN=FILE-SRV,OU=Servers,OU=IT,OU=Corp,${BASE_DN}
changetype: add
objectClass: computer
sAMAccountName: FILE-SRV$
userAccountControl: 4096

dn: CN=SQL-PROD,OU=Servers,OU=IT,OU=Corp,${BASE_DN}
changetype: add
objectClass: computer
sAMAccountName: SQL-PROD$
userAccountControl: 4096

dn: CN=CEO-LAPTOP,OU=Executives,OU=Corp,${BASE_DN}
changetype: add
objectClass: computer
sAMAccountName: CEO-LAPTOP$
userAccountControl: 4096
EOF
ldapadd -x -H ldaps://$LDAP_HOST -D "Administrator@$DOMAIN_UPPER" -w "$ADMIN_PASS" -f /tmp/pc.ldif >/dev/null 2>&1

echo "   ✔ Bilgisayarlar hazır."

# ---------------------------------------------------------
# 5. SALDIRI YOLLARI (ACL) - NEO4J ENJEKSİYONU
# ---------------------------------------------------------
# Burası "Fake" ama gerçekçi ACL'leri veritabanına basar.
# Bash ile AD ACL'i düzenlemek zor olduğu için, Dashboard'u test etmek adına
# Neo4j'ye direkt Cypher sorgusu atıyoruz.

echo "--> 5. ACL ve Saldırı Yolları Neo4j'ye İşleniyor..."

# Neo4j'in hazır olmasını bekle
until nc -z $NEO4J_HOST $NEO4J_PORT; do
  echo "   ⏳ Neo4j bekleniyor..."
  sleep 3
done

run_cypher() {
    local query=$1
    # JSON formatına uygun hale getirmek için escape işlemleri
    local json_payload=$(jq -n --arg q "$query" '{statements: [{statement: $q}]}')
    
    curl -s -X POST "http://${NEO4J_HOST}:${NEO4J_PORT}/db/neo4j/tx/commit" \
        -H "Accept: application/json; charset=UTF-8" \
        -H "Content-Type: application/json" \
        -H "Authorization: Basic $(echo -n "${NEO4J_USER}:${NEO4J_PASS}" | base64)" \
        -d "$json_payload" > /dev/null
}

# JQ yoksa basit string replace ile payload oluştururuz (Alpine'da jq olmayabilir)
run_cypher_simple() {
    local query=$1
    # Query içindeki tırnakları escape et
    local clean_query=${query//\"/\\\"}
    
    curl -s -X POST "http://${NEO4J_HOST}:${NEO4J_PORT}/db/neo4j/tx/commit" \
        -H "Content-Type: application/json" \
        -H "Authorization: Basic $(echo -n "${NEO4J_USER}:${NEO4J_PASS}" | base64)" \
        -d "{\"statements\": [{\"statement\": \"$clean_query\"}]}" > /dev/null
}

echo "   🔥 GenericAll İlişkileri Ekleniyor..."
# Senaryo 1: Bob (Dev), CEO'nun hesabını kontrol edebiliyor (GenericAll)
run_cypher_simple "MATCH (s:User), (t:User) WHERE s.DistinguishedName CONTAINS 'Bob' AND t.DistinguishedName CONTAINS 'Big' MERGE (s)-[:GenericAll {isacl:true}]->(t)"

# Senaryo 2: Help Desk, IT-Admins grubuna üye ekleyebiliyor (AddMember)
run_cypher_simple "MATCH (u:User), (g:Group) WHERE u.DistinguishedName CONTAINS 'Help' AND g.DistinguishedName CONTAINS 'IT-Admins' MERGE (u)-[:AddMember {isacl:true}]->(g)"

echo "   🔥 WriteDacl İlişkileri Ekleniyor..."
# Senaryo 3: Backup Service Hesabı, Domain Controller üzerinde yetki değiştirebiliyor (Çok Tehlikeli!)
run_cypher_simple "MATCH (u:User), (c:Computer) WHERE u.DistinguishedName CONTAINS 'backup' AND c.DistinguishedName CONTAINS 'DC01' MERGE (u)-[:WriteDacl {isacl:true}]->(c)"

echo "   🔥 ForceChangePassword İlişkileri Ekleniyor..."
# Senaryo 4: HR Stajyeri Gary, Finans Müdürü John'un şifresini değiştirebiliyor (Hatalı yetkilendirme)
run_cypher_simple "MATCH (s:User), (t:User) WHERE s.DistinguishedName CONTAINS 'Gary' AND t.DistinguishedName CONTAINS 'John' MERGE (s)-[:ForceChangePassword {isacl:true}]->(t)"

echo "   🔥 Owns İlişkileri Ekleniyor..."
# Senaryo 5: Sarah (Network), VPN-Users grubunun sahibi
run_cypher_simple "MATCH (u:User), (g:Group) WHERE u.DistinguishedName CONTAINS 'Sarah' AND g.DistinguishedName CONTAINS 'VPN-Users' MERGE (u)-[:Owns {isacl:true}]->(g)"


echo "==================================="
echo "✅ SEEDING VE GRAF OLUŞTURMA TAMAMLANDI!"
echo "==================================="