# TP 5 : Application CRUD avec MongoDB, Mongoose et Express.js

## 📋 Description

Ce projet est une application web complète implémentant les opérations CRUD (Create, Read, Update, Delete) en utilisant :

- **Express.js** comme framework backend
- **MongoDB** comme base de données NoSQL
- **Mongoose** comme ODM (Object Document Mapper)
- **EJS** comme moteur de templates
- **Tailwind CSS** pour le design moderne et responsive

## 🚀 Fonctionnalités

### Opérations CRUD complètes
- **Create** : Ajouter de nouveaux produits avec validation
-  **Read** : Visualiser la liste et les détails des produits
-  **Update** : Modifier les informations des produits existants
-  **Delete** : Supprimer des produits avec confirmation

### Fonctionnalités avancées
-  Recherche par nom ou description
-  Filtrage par catégorie
-  Filtrage par plage de prix
-  Filtre "En stock" / "Rupture"
-  Pagination automatique (12 produits par page)

Uploading video demo tp5.mp4…



Uploading video demo tp5.mp4…



Uploading video demo tp5.mp4…


-  Tags et catégorisation des produits
-  Système de notation (0-5 étoiles)
-  Statistiques en temps réel
-  Design responsive (mobile, tablette, desktop)
-  Interface moderne avec animations

### API REST
- `GET /api/products` - Récupérer tous les produits
- `GET /api/products/:id` - Récupérer un produit spécifique
- `GET /api/products/stats` - Obtenir les statistiques
- `POST /api/products` - Créer un produit
- `PUT /api/products/:id` - Mettre à jour un produit
- `DELETE /api/products/:id` - Supprimer un produit

## 🛠️ Technologies utilisées

| Technologie | Version | Description |
|------------|---------|-------------|
| Node.js | ≥ 18.x | Environnement d'exécution JavaScript |
| Express.js | 4.18.x | Framework web pour Node.js |
| MongoDB | ≥ 6.x | Base de données NoSQL |
| Mongoose | 7.5.x | ODM pour MongoDB |
| EJS | 3.1.x | Moteur de templates |
| Tailwind CSS | 3.x | Framework CSS |
| Express Validator | 7.x | Validation des données |
| Express Session | 1.17.x | Gestion des sessions |

## 📁 Structure du projet
```

crud-express-mongodb/
├── 📁

 config/ # Fichiers de configuration
│ └── database.js # Configuration base de données
├── 📁 controllers/ # Contrôleurs de l'application
│ └── productController.js # Logique des produits
├── 📁 db/ # Configuration MongoDB
│ └── mongoose.js # Connexion à MongoDB
├── 📁 middleware/ # Middlewares personnalisés
│ └── validators.js # Validation des données
├── 📁 models/ # Modèles Mongoose
│ └── product.js # Schéma produit
├── 📁 public/ # Fichiers statiques
│ └── css/
│ └── style.css # Styles CSS
├── 📁 routes/ # Routes de l'application
│ ├── productRoutes.js # Routes web
│ └── api/
│ └── productRoutes.js # Routes API
├── 📁 services/ # Logique métier
│ └── productService.js # Services CRUD
├── 📁 views/ # Templates EJS
│ ├── layout.ejs # Layout principal
│ ├── error.ejs # Page d'erreur
│ ├── 📁 partials/ # Partiels réutilisables
│ │ ├── header.ejs # En-tête
│ │ └── footer.ejs # Pied de page
│ └── 📁 products/ # Vues produits
│ ├── index.ejs # Liste des produits
│ ├── details.ejs # Détails produit
│ ├── create.ejs # Formulaire création
│ └── edit.ejs # Formulaire modification
├── .env # Variables d'environnement
├── .gitignore # Fichiers ignorés par Git
├── docker-compose.yml # Configuration Docker
├── package.json # Dépendances Node.js
├── app.js # Point d'entrée
└── README.md # Documentation

```

## 💻 Installation

### Prérequis

- Node.js (v18 ou supérieur)
- npm (v9 ou supérieur)
- MongoDB (local ou cloud)

### Étapes d'installation

1. **Cloner le projet**
```bash
git clone https://github.com/votre-username/crud-express-mongodb.git
cd crud-express-mongodb
```
## 2.Installer les dépendances


```
npm install
```
## 3.Configurer les variables d'environnement
```
cp .env.example .env
```

## 4.Démarrer MongoDB

 ### Option 1 : MongoDB local
 ```
# Windows
net start MongoDB

# Linux
sudo systemctl start mongod

# macOS
brew services start mongodb-community

```
## Option 2 : Docker
```
docker-compose up -d
```
## Option 3 : MongoDB Atlas (Cloud)

- Créez un compte sur MongoDB Atlas

- Créez un cluster gratuit

- Obtenez votre URI de connexion

- Mettez à jour le fichier .env

 ## 5. Démarrer l'application

```
# Mode développement (avec nodemon)
npm run dev


# Mode production
npm start
```

## 6.Accéder à l'application
```
http://localhost:3000
```


## 📖 Utilisation
### Navigation
- Page d'accueil : `/` ou `/products `- Liste tous les produits

- Ajouter un produit : `/products/create `- Formulaire d'ajout

- Détails d'un produit : `/products/:id` - Vue détaillée

- Modifier un produit : `/products/edit/:id` - Formulaire de modification

## API REST
L'application expose une API REST complète :
```
# Récupérer tous les produits
GET /api/products

# Récupérer un produit spécifique
GET /api/products/:id

# Créer un produit
POST /api/products
Content-Type: application/json
{
  "name": "Produit exemple",
  "price": 99.99,
  "category": "Électronique",
  "quantity": 10
}

# Mettre à jour un produit
PUT /api/products/:id

# Supprimer un produit
DELETE /api/products/:id

# Obtenir les statistiques
GET /api/products/stats

```

## Filtres et recherche
L'interface web permet de filtrer les produits selon plusieurs critères :

- Recherche textuelle : Par nom ou description

- Catégorie : Sélection par catégorie

- Prix : Plage de prix minimum et maximum

- Stock : Uniquement les produits en stock

Les paramètres peuvent être combinés et la pagination est automatique


## Catégories disponibles
- Électronique

- Vêtements

- Alimentation

- Livres

- Maison

- Sports

- Autres




  ## 🎥 Démo du Projet














## 👤 Auteur

* **École Normale Supérieure de Marrakech**
  
* **Réalisé par :** SALMA LAKHAL
  
* **Filière  :** CLE_INFO_S5

  
* **Encadré par :** Pr. Mohamed LACHGAR

* **Cours :** `Développement web full-stack avec JavaScript`

