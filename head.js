// Créer une nouvelle balise script
const script = document.createElement('script');

// Définir les attributs de la balise script
script.defer = true; // Ajouter l'attribut defer
script.setAttribute('data-domain', 'wazo-plugin-deploy.netlify.app');
script.setAttribute('data-api', '/lapetiteroute/api/event');
script.src = '/lapetiteroute/js/script.js'; // Définir le chemin du fichier JavaScript

// Ajouter la balise script dans la section head
document.head.appendChild(script);