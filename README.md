# README TP NODEJS

## PREMIERE UTILISATION:
        A la première utilisation, il vous sera demandé d'ajouter une exception à votre navigateur. Ceci est causé par le certificat qui est auto signé, il n'est donc pas reconnu par votre ordinateur.

## LANCEMENT ET TESTS:
	Pour lancer l'application faites un 'sudo nodemon index.js'
	Pour la tester, allez à l'url http://localhost:8080 (S'il y a une erreur, allez directement à l'url https://localhost:8443)
	Il est également nécessaire d'avoir une base données correctement configurée sur votre poste (Voir paragraphe suivant)
	
## CONFIG BASE DE DONNEES:
        Votre base de données mongoDB doit tourner sur localhost.
        Vous devez aller dans le fichier data/ScriptMongo.txt et suivre ses instructions pour que celle-ci contienne les données nécessaires aux tests
        
## Dossiers :
    data -> contient les données pour la BDD
    controllers -> contient les controllers nodejs
    models -> contient les modèles nodejs pour la liaison avec mongodb via mongoose
    public -> contient les feuilles de style, le javascript client et les images
    node_module -> les modules importés par node
    views -> les vues en jade et leur version compilée en html


