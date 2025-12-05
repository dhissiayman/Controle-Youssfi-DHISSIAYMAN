# Test des Endpoints Bills

## 🔍 Diagnostic Complet

### 1. Vérifier Eureka (http://localhost:8761)

**Services qui doivent être UP:**
- ✅ CUSTOMER-SERVICE (ou customer-service)
- ✅ INVENTORY-SERVICE (ou Inventory-service)
- ✅ **BILLING-SERVICE (ou Billing-service)** ⚠️ **CRITIQUE**
- ✅ GATEWAY-SERVICE (ou Gateway-service)

**Note:** Eureka normalise les noms en majuscules, donc `Billing-service` devient `BILLING-SERVICE`.

### 2. Tests des Endpoints

#### Test 1: Gateway - Liste des bills
```bash
curl http://localhost:8088/api/bills
```

**Résultat attendu:** Liste JSON des bills ou `[]` si vide

**Si erreur 404:** Le RewritePath ne fonctionne pas
**Si erreur 503:** BILLING-SERVICE non trouvé dans Eureka
**Si erreur 0:** Gateway non démarré

#### Test 2: Gateway - Générer des bills
```bash
curl -X POST http://localhost:8088/api/bills/generate -H "Content-Type: application/json"
```

**Résultat attendu:** 
```json
{
  "success": true,
  "message": "Bills generated successfully!",
  "billsCreated": 1,
  "totalBills": 1,
  "customersCount": 1,
  "productsCount": 1
}
```

#### Test 3: Billing Service Direct (sans gateway)
```bash
curl http://localhost:8083/bills
curl -X POST http://localhost:8083/bills/generate -H "Content-Type: application/json"
```

**Si ça fonctionne directement mais pas via gateway:**
→ Problème de routage Eureka ou RewritePath

### 3. Vérifications de Configuration

#### Gateway application.yml
```yaml
- id: r3
  uri: lb://BILLING-SERVICE
  predicates:
    - Path=/api/bills/**
  filters:
    - RewritePath=/api/bills/?(?<segment>.*), /bills/${segment}
```

**Corrections apportées:**
- ✅ Ajout de `?` après `/bills/` pour rendre le slash optionnel
- ✅ Gère maintenant `/api/bills` ET `/api/bills/xxx`

#### Billing Service Controller
- ✅ Endpoint `/bills` (GET) - Liste tous les bills
- ✅ Endpoint `/bills/{id}` (GET) - Détails d'un bill
- ✅ Endpoint `/bills/generate` (POST) - Génère les bills
- ✅ CORS configuré pour `http://localhost:4200`

### 4. Problèmes Potentiels et Solutions

#### Problème: "Cannot connect to server"
**Cause:** Gateway ou Billing Service non démarré
**Solution:** 
1. Vérifiez Eureka: http://localhost:8761
2. Redémarrez le Billing Service
3. Redémarrez le Gateway Service (en dernier)

#### Problème: "404 Not Found"
**Cause:** RewritePath incorrect ou service non enregistré
**Solution:**
1. Vérifiez le nom du service dans Eureka (doit être `BILLING-SERVICE`)
2. Vérifiez que le RewritePath est correct dans `application.yml`
3. Redémarrez le Gateway après modification

#### Problème: "503 Service Unavailable"
**Cause:** Billing Service non trouvé dans Eureka
**Solution:**
1. Vérifiez que le Billing Service est démarré
2. Vérifiez qu'il est enregistré dans Eureka
3. Attendez quelques secondes après le démarrage (enregistrement Eureka)

#### Problème: Bills vides après génération
**Cause:** Pas de customers ou products
**Solution:**
1. Créez d'abord des customers: http://localhost:4200/customers
2. Créez ensuite des products: http://localhost:4200/products
3. Cliquez sur "Generate Bills"

### 5. Logs à Vérifier

#### Gateway Service Logs
Cherchez:
```
Route matched: r3
```

#### Billing Service Logs
Cherchez:
```
Started BillingServiceApplication
```

#### Eureka Logs
Vérifiez que BILLING-SERVICE apparaît dans les logs d'enregistrement.

### 6. Test Rapide depuis le Navigateur

Ouvrez la console (F12) et exécutez:
```javascript
// Test 1: Liste des bills
fetch('http://localhost:8088/api/bills')
  .then(r => r.json())
  .then(console.log)
  .catch(console.error);

// Test 2: Générer des bills
fetch('http://localhost:8088/api/bills/generate', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' }
})
  .then(r => r.json())
  .then(console.log)
  .catch(console.error);
```

### ✅ Checklist Finale

- [ ] Eureka démarré (port 8761)
- [ ] Customer Service démarré et enregistré
- [ ] Inventory Service démarré et enregistré
- [ ] **Billing Service démarré et enregistré** ⚠️
- [ ] **Gateway Service démarré** ⚠️
- [ ] Tous les services sont UP dans Eureka
- [ ] Test curl `/api/bills` fonctionne
- [ ] Test curl `/api/bills/generate` fonctionne
- [ ] Angular app peut charger les bills
- [ ] Bouton "Generate Bills" fonctionne

