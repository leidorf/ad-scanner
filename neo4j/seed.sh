#!/bin/bash
set -e

if [ ! -d "/data/databases/neo4j" ]; then
    echo ">> [INIT] Baslangic verisi (initial.dump) yukleniyor..."
    
    neo4j-admin database load neo4j --from-path=/seed --overwrite-destination=true --verbose
    
    echo ">> [INIT] Yukleme tamamlandi."
else
    echo ">> [INIT] Veritabani zaten mevcut, yukleme atlandi."
fi

exec /startup/docker-entrypoint.sh neo4j