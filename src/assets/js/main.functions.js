// Fonction pour récupérer des données du localStorage et les exporter en .json
export const exportToJsonFile = (key) => {
    const jsonData = localStorage.getItem(key);
    if (jsonData) {
        const dataBlob = new Blob([jsonData], { type: 'application/json' });
        const url = URL.createObjectURL(dataBlob);
        
        // Créer un lien temporaire pour le téléchargement
        const a = document.createElement('a');
        a.href = url;
        a.download = "wazo_plugin_template.json"; // Nom du fichier de téléchargement
        document.body.appendChild(a);
        a.click(); // Simuler un clic pour télécharger le fichier
        document.body.removeChild(a); // Nettoyer le DOM
        URL.revokeObjectURL(url); // Libérer l'URL objet
    } else {
        console.log('Aucune donnée trouvée pour la clé spécifiée.');
    }
};

// Fonction pour importer un fichier JSON dans le localStorage
export const importJsonToLocalStorage = (file) => {
    const reader = new FileReader();
    
    // Événement déclenché lorsque le fichier est chargé
    reader.onload = (event) => {
        try {
            const jsonData = event.target.result;
            const data = JSON.parse(jsonData); // Convertir le JSON en objet
            
            // Enregistrer les données dans le localStorage
            const key = 'template_keys'; // Choisissez une clé pour stocker les données
            localStorage.setItem(key, JSON.stringify(data));
            console.log('Données importées avec succès dans le localStorage sous la clé :', key);

            // Rafraîchir la page après l'importation
            location.reload();
        } catch (error) {
            console.error('Erreur lors de l\'importation des données :', error);
        }
    };

    // Lire le fichier en tant que texte
    reader.readAsText(file);
};