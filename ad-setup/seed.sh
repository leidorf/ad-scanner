#!/bin/bash

set +e 

SEED_FLAG="/var/lib/samba/.seeded"
LDAP_HOST="ad-server"
LDAPS_PORT="636"

DOMAIN_UPPER="${DOMAIN^^}"
DOMAIN_LOWER="${DOMAIN,,}"
ADMIN_PASS="${DOMAINPASS:-Password123!}"
BASE_DN=$(echo $DOMAIN | sed 's/\./,DC=/g' | sed 's/^/DC=/')

export LDAPTLS_REQCERT=never

echo "==================================="
echo "AD Seeder Başlatılıyor"
echo "==================================="
echo "Hedef: $LDAP_HOST (Port 636)"

# 1. OU (Organizational Unit) OLUŞTURMA
echo "--> 1. OU'lar oluşturuluyor..."

cat > /tmp/structure.ldif <<EOF
dn: OU=Departments,$BASE_DN
changetype: add
objectClass: top
objectClass: organizationalUnit
ou: Departments

dn: OU=IT,OU=Departments,$BASE_DN
changetype: add
objectClass: top
objectClass: organizationalUnit
ou: IT

dn: OU=HR,OU=Departments,$BASE_DN
changetype: add
objectClass: top
objectClass: organizationalUnit
ou: HR

dn: OU=Finance,OU=Departments,$BASE_DN
changetype: add
objectClass: top
objectClass: organizationalUnit
ou: Finance

dn: OU=Marketing,OU=Departments,$BASE_DN
changetype: add
objectClass: top
objectClass: organizationalUnit
ou: Marketing

dn: OU=Computers,OU=Departments,$BASE_DN
changetype: add
objectClass: top
objectClass: organizationalUnit
ou: Computers

dn: OU=Workstations,OU=Computers,OU=Departments,$BASE_DN
changetype: add
objectClass: top
objectClass: organizationalUnit
ou: Workstations

dn: OU=Servers,OU=Computers,OU=Departments,$BASE_DN
changetype: add
objectClass: top
objectClass: organizationalUnit
ou: Servers
EOF

ldapadd -x -H ldaps://$LDAP_HOST -D "Administrator@$DOMAIN_UPPER" -w "$ADMIN_PASS" -f /tmp/structure.ldif

if [ $? -eq 0 ]; then
    echo "   ✔ OU yapısı başarıyla oluşturuldu."
else
    echo "   ❌ OU OLUŞTURMA HATASI! Logları kontrol edin. (Bağlantı veya Yetki Sorunu)"
fi

# =================================================================
# 2. GRUPLARI OLUŞTURMA
# =================================================================
echo "--> 2. Gruplar oluşturuluyor..."

cat > /tmp/groups.ldif <<EOF
dn: CN=IT-Admins,CN=Users,$BASE_DN
changetype: add
objectClass: top
objectClass: group
cn: IT-Admins
sAMAccountName: IT-Admins

dn: CN=All-Employees,CN=Users,$BASE_DN
changetype: add
objectClass: top
objectClass: group
cn: All-Employees
sAMAccountName: All-Employees
EOF

ldapadd -x -H ldaps://$LDAP_HOST -D "Administrator@$DOMAIN_UPPER" -w "$ADMIN_PASS" -f /tmp/groups.ldif >/dev/null 2>&1
echo "   ...Gruplar tamamlandı."

# =================================================================
# 3. KULLANICILARI OLUŞTURMA
# =================================================================
echo "--> 3. Kullanıcılar oluşturuluyor..."

create_user_ldap() {
    local username=$1
    local firstname=$2
    local lastname=$3
    local dept=$4
    local title=$5
    
    local user_dn="CN=$firstname $lastname,OU=$dept,OU=Departments,$BASE_DN"
    
    cat > /tmp/user_$username.ldif <<EOF
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
department: $dept
userAccountControl: 514
EOF

    ldapadd -x -H ldaps://$LDAP_HOST -D "Administrator@$DOMAIN_UPPER" -w "$ADMIN_PASS" -f /tmp/user_$username.ldif
    
    if [ $? -eq 0 ]; then
        ldappasswd -H ldaps://$LDAP_HOST -x -D "Administrator@$DOMAIN_UPPER" -w "$ADMIN_PASS" -s "Password123!" "$user_dn" >/dev/null 2>&1
        cat > /tmp/enable_$username.ldif <<EOF
dn: $user_dn
changetype: modify
replace: userAccountControl
userAccountControl: 512
EOF
        ldapmodify -x -H ldaps://$LDAP_HOST -D "Administrator@$DOMAIN_UPPER" -w "$ADMIN_PASS" -f /tmp/enable_$username.ldif >/dev/null 2>&1
        cat > /tmp/group_add_$username.ldif <<EOF
dn: CN=All-Employees,CN=Users,$BASE_DN
changetype: modify
add: member
member: $user_dn
EOF
        ldapmodify -x -H ldaps://$LDAP_HOST -D "Administrator@$DOMAIN_UPPER" -w "$ADMIN_PASS" -f /tmp/group_add_$username.ldif >/dev/null 2>&1
        echo "   ✔ $username eklendi."
    else
        echo "   ❌ $username EKLENEMEDİ."
    fi
}

create_user_ldap "john.doe" "John" "Doe" "IT" "System Administrator"
create_user_ldap "mike.brown" "Mike" "Brown" "IT" "Network Engineer"
create_user_ldap "alice.williams" "Alice" "Williams" "IT" "DevOps Engineer"
create_user_ldap "jane.smith" "Jane" "Smith" "HR" "HR Manager"
create_user_ldap "bob.johnson" "Bob" "Johnson" "Finance" "Financial Analyst"
create_user_ldap "lisa.taylor" "Lisa" "Taylor" "Marketing" "Marketing Manager"

# =================================================================
# 4. BİLGİSAYARLAR
# =================================================================
echo "--> 4. Bilgisayarlar oluşturuluyor..."
cat > /tmp/computers.ldif <<EOF
dn: CN=WS-IT-001,OU=Workstations,OU=Computers,OU=Departments,$BASE_DN
changetype: add
objectClass: top
objectClass: computer
cn: WS-IT-001
sAMAccountName: WS-IT-001$
userAccountControl: 4096

dn: CN=SRV-APP-001,OU=Servers,OU=Computers,OU=Departments,$BASE_DN
changetype: add
objectClass: top
objectClass: computer
cn: SRV-APP-001
sAMAccountName: SRV-APP-001$
userAccountControl: 4096
EOF

ldapadd -x -H ldaps://$LDAP_HOST -D "Administrator@$DOMAIN_UPPER" -w "$ADMIN_PASS" -f /tmp/computers.ldif >/dev/null 2>&1
echo "   ...Bilgisayarlar tamamlandı."

touch "$SEED_FLAG"
echo "==================================="
echo "✔ SEEDING TAMAMLANDI!"
echo "==================================="