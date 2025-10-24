# Blockchain Lightning Local Setup (Regtest)

Ce projet contient une configuration Docker pour lancer un environnement **Bitcoin regtest**, **LND** et **LNbits**, avec des scripts d’initialisation pour tester le réseau Lightning localement.

## Contenu du projet

- `docker-compose.yml` – définition des services Docker : Bitcoin, LND, LNbits, Redis  
- `regtest-setup.sh` – script d’initialisation pour le jury ou test local  
- `.env.example` – variables d’environnement  
- `docs/screenshots/` – captures d’écran pour démonstration  

## Prérequis

- Docker et Docker Compose installés  
- Connaissance basique de la ligne de commande  

## Lancement de l’environnement

1. Cloner le dépôt :  
git clone https://github.com/HackathonBTCDays/BlockchainLightning.git
cd lnbitlocal
cp .env.example .env
cp .env.example .env
docker compose ps

## Initialisation de LND

1. Créer ou restaurer le wallet LND :  
docker exec -it lnd lncli --network=regtest create
- Entrer le mot de passe du wallet  
- Utiliser un mnemonic existant ou en créer un nouveau  
- Définir l’**address look-ahead** (par défaut 2500 ou 100)  

2. Déverrouiller le wallet si nécessaire :  
docker exec -it lnd lncli --network=regtest unlock

3. Générer une nouvelle adresse LND :  
docker exec -it lnd lncli --network=regtest newaddress p2wkh

## Minage de blocs Regtest

Pour activer le wallet et les transactions :  
docker exec -it bitcoin bitcoin-cli -regtest generatetoaddress 101 <ADRESSE_LND>
(Remplacer `<ADRESSE_LND>` par l’adresse générée précédemment)  

## Script d’initialisation

Le script `regtest-setup.sh` contient toutes les commandes nécessaires pour le jury et vérifie les conteneurs :  
