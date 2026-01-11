# Diagnostic - Page Bills Vide

## 🔍 Pourquoi la page Bills n'affiche rien ?

La page Bills peut être vide pour plusieurs raisons :

### 1. **Pas de données dans la base de données**

Les bills sont créés automatiquement **seulement si** :
- ✅ Il y a des **customers** dans le customer-service
- ✅ Il y a des **products** dans l'inventory-service
- ✅ Le billing-service peut accéder à ces services

**Solution :** Créez d'abord des customers et des products via l'interface Angular.

### 2. **Services non démarrés dans le bon ordre**

Le billing-service doit démarrer **après** customer-service et inventory-service.

**Ordre de démarrage :**
1. Discovery Service (Eureka) - Port 8761
2. Customer Service - Port 8081
3. Inventory Service - Port 8082
4. **Billing Service - Port 8083** ⚠️
5. Gateway Service - Port 8088

### 3. **Base de données vide**

La base de données H2 est en mémoire, donc elle est vidée à chaque redémarrage.

**Solution :** Redémarrez le billing-service après avoir créé des customers et products.

## ✅ Vérifications à faire

### Étape 1 : Vérifier qu'il y a des customers
```bash
curl http://localhost:8088/api/customers
```
Ou via l'interface Angular : Allez sur la page Customers

### Étape 2 : Vérifier qu'il y a des products
```bash
curl http://localhost:8088/api/products
```
Ou via l'interface Angular : Allez sur la page Products

### Étape 3 : Vérifier les bills
```bash
curl http://localhost:8088/api/bills
```
Devrait retourner une liste de bills (même vide `[]`)

### Étape 4 : Vérifier les logs du billing-service

Regardez la console où le billing-service tourne. Vous devriez voir :
- `✅ Successfully created X bills.` si tout va bien
- `⚠️ No customers found...` si pas de customers
- `⚠️ No products found...` si pas de products
- `❌ Error creating bills: ...` en cas d'erreur

## 🚀 Solution Rapide

1. **Créez des customers** via l'interface Angular (page Customers → New Customer)
2. **Créez des products** via l'interface Angular (page Products → New Product)
3. **Redémarrez le billing-service** pour qu'il crée automatiquement les bills

## 🔧 Test Manuel

Pour tester si l'endpoint fonctionne :

```bash
# Test direct du billing service
curl http://localhost:8083/bills

# Test via gateway
curl http://localhost:8088/api/bills
```

Si vous obtenez `[]` (tableau vide), c'est normal - il n'y a juste pas de données.

Si vous obtenez une erreur, vérifiez que :
- Le billing-service est démarré
- Le gateway est démarré
- Les services sont enregistrés dans Eureka

## 📝 Créer des données de test

Si vous voulez créer des bills manuellement, vous pouvez :

1. Créer des customers et products via l'interface
2. Redémarrer le billing-service (il créera automatiquement les bills)
3. Ou attendre que le CommandLineRunner s'exécute au prochain démarrage

## ⚠️ Note Importante

La base de données H2 est **en mémoire** (`jdbc:h2:mem:bills-db`), donc :
- Les données sont perdues à chaque redémarrage
- Il faut recréer les bills après chaque redémarrage du billing-service

