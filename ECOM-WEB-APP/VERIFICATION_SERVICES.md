# Vérification Rapide des Services

## ⚠️ Erreur: Cannot connect to server at localhost:8088/api/bills/generate

### ✅ Checklist de Vérification

#### 1. Vérifier Eureka Dashboard
**Ouvrez:** http://localhost:8761

**Vérifiez que ces services sont UP (vert):**
- ✅ CUSTOMER-SERVICE
- ✅ INVENTORY-SERVICE  
- ✅ **BILLING-SERVICE** ⚠️ **CRITIQUE**
- ✅ GATEWAY-SERVICE

**Si BILLING-SERVICE n'est pas dans la liste ou n'est pas UP:**
→ Le gateway ne peut pas le trouver!
→ **Solution:** Redémarrez le Billing Service

#### 2. Tester le Gateway
Ouvrez un terminal et testez:
```bash
# Test 1: Le gateway répond-il?
curl http://localhost:8088/api/customers

# Test 2: Le billing via gateway fonctionne-t-il?
curl http://localhost:8088/api/bills
```

**Si ces commandes échouent:**
→ Le Gateway Service n'est pas démarré
→ **Solution:** Démarrez le Gateway Service

#### 3. Tester directement le Billing Service
```bash
# Test direct (sans gateway)
curl -X POST http://localhost:8083/bills/generate \
  -H "Content-Type: application/json"
```

**Si ça fonctionne directement mais pas via le gateway:**
→ Le problème vient du gateway ou de l'enregistrement Eureka
→ **Solution:** Vérifiez Eureka et redémarrez le gateway

### 🚀 Solution Rapide

**Démarrez les services dans cet ordre:**

1. **Discovery Service** (Eureka)
   ```bash
   cd Discovery-service
   mvn spring-boot:run
   ```
   Attendez: "Started DiscoveryServiceApplication"

2. **Customer Service**
   ```bash
   cd customer-service
   mvn spring-boot:run
   ```

3. **Inventory Service**
   ```bash
   cd Inventory-service
   mvn spring-boot:run
   ```

4. **Billing Service** ⚠️
   ```bash
   cd Billing-service
   mvn spring-boot:run
   ```
   Attendez: "Started BillingServiceApplication"

5. **Gateway Service** ⚠️ **EN DERNIER**
   ```bash
   cd Gateway-service
   mvn spring-boot:run
   ```
   Attendez: "Started GatewayServiceApplication"

### 🔍 Diagnostic dans la Console du Navigateur

Ouvrez la console (F12) et regardez:
- **Status 0** = Connexion refusée → Service non démarré
- **Status 404** = Service non trouvé → Service non enregistré dans Eureka
- **Status 503** = Service indisponible → Service en cours de démarrage

### ✅ Après Redémarrage

1. Vérifiez Eureka: http://localhost:8761
2. Tous les services doivent être **UP**
3. Réessayez le bouton "Generate Bills"

