# 🚀 Bienvenue sur le projet

Ce projet utilise **Webpack-cli**, il est pré-build à chaque release, en cas de build volontaire utilises la commande :
```
npm run build
```

Pour lancer le plugin en mode local, utilises la commande :
```
npm run dev
```
L'accès sera http://localhost:3000

Utilises le `manifest.json` à l'adresse http://localhost:3000/manifest.json

# ♥️ Utilisation et installation
Utilises le dossier "public" du projet. 

1. Copies ce dossier dans le répertoire d'accès Web de la stack (`/var/www/html/wazo_plugin_stack`)
2. Accèdes à la page de configuration du plugin depuis Portal : https://portal.wazo.io/#/plugins
3. Saisis l'URL du manifest : https://IP|DNS-de-ta-stack/wazo_plugin_stack/public/manifest.json
4. Cliques sur "Installer"
5. Associes le plugin en activant le.s tenant.s souhaité.s
6. Rends toi dans le tenant souhaité et cliques sur l'onglet "Wizard configuration" du Tableau de Bord

# 🚀 Objectif du projet
Créer un plugin Portal destiné aux tenants de stack EUC Wazo afin d'améliorer le parcours et la rapidité de réglage.
Nous nous appuyons sur la capicité de Portal pour gérer cette configuration : Plugins de Portal => [Documentation officielle](https://wazo-communication.github.io/euc-plugins-js-sdk/docs/plugins/portal/)

# ✅ Configurations proposées
* Réglages du template SIP global du tenant
  * Langue
  * Codecs
  * MOH par défaut
  * Paramètres NAT
 
* Réglages du template SIP WebRTC du tenant
  * Langue
  * Codecs
 
* Ajout/Modification des profils d'applications
  * STUN personnalisé : Application Web & Desktop
  * TURN personnalisé : Application Mobile
 
# ⚠️ Limitations 
* La priorisation de codecs n'est pas prise en charge dans la version <= 1.1.1
* Le Wizard doit être appliqué à chaque tenant de la stack
