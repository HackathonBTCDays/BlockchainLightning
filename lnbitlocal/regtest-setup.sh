#!/bin/sh
# regtest-setup.sh - run manually after docker compose up

set -e

echo "---- Vérifier que les conteneurs tournent ----"
docker compose ps

echo "---- Instructions manuelles pour le jury ----"
echo "1) Créer ou restaurer le wallet LND:"
echo "   docker exec -it lnd lncli --network=regtest create"
echo "2) Déverrouiller le wallet si nécessaire:"
echo "   docker exec -it lnd lncli --network=regtest unlock"
echo "3) Générer une adresse LND:"
echo "   docker exec -it lnd lncli --network=regtest newaddress p2wkh"
echo "4) Miner des blocs pour regtest:"
echo "   docker exec -it bitcoin bitcoin-cli -regtest generatetoaddress 101 <ADRESSE_LND>"
echo ""
echo "Logs disponibles : docker compose logs lnd | bitcoin | lnbits"
