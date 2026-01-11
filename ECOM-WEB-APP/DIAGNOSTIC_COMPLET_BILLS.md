# 🔍 Diagnostic Complet - Problème de Connexion Bills

## ⚠️ Erreurs Observées

1. "Cannot connect to billing service" - lors du chargement de la liste
2. "Cannot connect to server at http://localhost:8088/api/bills/generate" - lors de la génération

## ✅ Checklist de Vérification

### 1. Vérifier Eureka Dashboard
**URL:** http://localhost:8761

**Services qui DOIVENT être UP (vert):**
- ✅ CUSTOMER-SERVICE (ou customer-service)
- ✅ INVENTORY-SERVICE (ou Inventory-service)  
- ✅ **BILLING-SERVICE (ou Billing-service)** ⚠️ **CRITIQUE**
- ✅ GATEWAY-SERVICE (ou Gateway-service)

**⚠️ IMPORTANT:** Notez le nom EXACT du service dans Eureka (majuscules/minuscules)

### 2. Vérifier le Nom du Service dans Eureka

Le Gateway a `lower-case-service-id=true`, ce qui peut causer des problèmes.

**Dans Eureka, cherchez:**
- `BILLING-SERVICE` (majuscules)
- `Billing-service` (avec majuscule B)
- `billing-service` (tout minuscules)

**Le nom dans `application.yml` du Gateway DOIT correspondre exactement au nom dans Eureka.**

### 3. Test Direct des Services

#### Test 1: Gateway répond-il?
```bash
curl http://localhost:8088
```

#### Test 2: Billing Service direct (sans gateway)
```bash
curl http://localhost:8083/bills
```

#### Test 3: Via Gateway - Liste des bills
```bash
curl http://localhost:8088/api/bills
```

#### Test 4: Via Gateway - Générer des bills
```bash
curl -X POST http://localhost:8088/api/bills/generate -H "Content-Type: application/json"
```

### 4. Vérifier les Logs

#### Gateway Service Logs
Cherchez:
- `Route matched: r3` (pour les requêtes `/api/bills/**`)
- `LoadBalancerClient: No instances available for BILLING-SERVICE` (si le service n'est pas trouvé)

#### Billing Service Logs
Cherchez:
- `Started BillingServiceApplication`
- `Registering application BILLING-SERVICE with eureka`

### 5. Problèmes Potentiels et Solutions

#### Problème A: Nom de Service Incorrect
**Symptôme:** `LoadBalancerClient: No instances available for BILLING-SERVICE`

**Cause:** Le nom dans `application.yml` ne correspond pas au nom dans Eureka

**Solution:**
1. Vérifiez le nom exact dans Eureka
2. Modifiez `Gateway-service/src/main/resources/application.yml`:
   ```yaml
   uri: lb://BILLING-SERVICE  # ou Billing-service ou billing-service selon Eureka
   ```

#### Problème B: Gateway Non Démarré
**Symptôme:** `Cannot connect to server at http://localhost:8088`

**Solution:** Démarrez le Gateway Service

#### Problème C: Billing Service Non Enregistré
**Symptôme:** Billing Service n'apparaît pas dans Eureka

**Solution:**
1. Vérifiez que le Billing Service est démarré
2. Vérifiez les logs du Billing Service pour les erreurs d'enregistrement
3. Vérifiez que Eureka est démarré et accessible

#### Problème D: RewritePath Incorrect
**Symptôme:** 404 Not Found sur `/api/bills`

**Solution:** Vérifiez que le RewritePath est correct dans `application.yml`

### 6. Test depuis le Navigateur

Ouvrez la console (F12) et exécutez:

```javascript
// Test 1: Liste des bills
fetch('http://localhost:8088/api/bills')
  .then(r => {
    console.log('Status:', r.status);
    return r.json();
  })
  .then(data => console.log('Data:', data))
  .catch(err => console.error('Error:', err));

// Test 2: Générer des bills
fetch('http://localhost:8088/api/bills/generate', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' }
})
  .then(r => {
    console.log('Status:', r.status);
    return r.json();
  })
  .then(data => console.log('Data:', data))
  .catch(err => console.error('Error:', err));
```

### 7. Ordre de Démarrage Recommandé

1. **Discovery Service (Eureka)** - Port 8761
2. **Customer Service** - Port 8081
3. **Inventory Service** - Port 8082
4. **Billing Service** - Port 8083 ⚠️
5. **Gateway Service** - Port 8088 ⚠️ **EN DERNIER**

**Attendez que chaque service soit complètement démarré avant de démarrer le suivant.**

### 8. Vérification Finale

Après avoir démarré tous les services:

1. ✅ Eureka Dashboard: Tous les services sont UP
2. ✅ Test curl `/api/bills` fonctionne
3. ✅ Test curl `/api/bills/generate` fonctionne
4. ✅ Application Angular peut charger les bills
5. ✅ Bouton "Generate Bills" fonctionne

## 🚨 Solution Rapide

Si rien ne fonctionne, essayez de modifier le nom du service dans le Gateway:

1. Ouvrez Eureka: http://localhost:8761
2. Notez le nom EXACT du Billing Service (ex: `BILLING-SERVICE`, `Billing-service`, ou `billing-service`)
3. Modifiez `Gateway-service/src/main/resources/application.yml`:
   ```yaml
   uri: lb://[NOM_EXACT_DANS_EUREKA]
   ```
4. Redémarrez le Gateway Service

