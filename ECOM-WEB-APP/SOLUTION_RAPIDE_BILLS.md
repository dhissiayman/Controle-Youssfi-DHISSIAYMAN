# 🚀 Solution Rapide - Problème de Connexion Bills

## ⚡ Solution en 3 Étapes

### Étape 1: Vérifier Eureka Dashboard
1. Ouvrez http://localhost:8761 dans votre navigateur
2. Cherchez le **Billing Service** dans la liste
3. **Notez le nom EXACT** (majuscules/minuscules):
   - `BILLING-SERVICE` ?
   - `Billing-service` ?
   - `billing-service` ?

### Étape 2: Vérifier/Corriger le Nom dans le Gateway

**Fichier:** `Gateway-service/src/main/resources/application.yml`

**Ligne 14 doit correspondre EXACTEMENT au nom dans Eureka:**

```yaml
uri: lb://BILLING-SERVICE  # Remplacez par le nom exact dans Eureka
```

**Exemples:**
- Si dans Eureka c'est `BILLING-SERVICE` → `uri: lb://BILLING-SERVICE`
- Si dans Eureka c'est `Billing-service` → `uri: lb://Billing-service`
- Si dans Eureka c'est `billing-service` → `uri: lb://billing-service`

### Étape 3: Redémarrer le Gateway Service

**⚠️ IMPORTANT:** Après toute modification de `application.yml`, vous DEVEZ redémarrer le Gateway Service.

1. Arrêtez le Gateway Service (Ctrl+C)
2. Redémarrez-le:
   ```bash
   cd Gateway-service
   mvn spring-boot:run
   ```

## 🔍 Vérification

Après redémarrage, testez:

```bash
# Test 1: Liste des bills
curl http://localhost:8088/api/bills

# Test 2: Générer des bills
curl -X POST http://localhost:8088/api/bills/generate -H "Content-Type: application/json"
```

Ou utilisez le script PowerShell:
```powershell
cd ECOM-WEB-APP
.\test-bills-endpoints.ps1
```

## 📋 Checklist Complète

- [ ] Eureka Dashboard accessible (http://localhost:8761)
- [ ] Billing Service visible dans Eureka et **UP** (vert)
- [ ] Nom du service noté dans Eureka
- [ ] `application.yml` du Gateway utilise le même nom
- [ ] Gateway Service redémarré après modification
- [ ] Test curl `/api/bills` fonctionne
- [ ] Test curl `/api/bills/generate` fonctionne
- [ ] Application Angular peut charger les bills

## 🆘 Si Ça Ne Fonctionne Toujours Pas

1. **Vérifiez l'ordre de démarrage:**
   - Discovery Service (Eureka) - Port 8761
   - Customer Service - Port 8081
   - Inventory Service - Port 8082
   - Billing Service - Port 8083
   - Gateway Service - Port 8088 (en dernier)

2. **Vérifiez les logs du Gateway:**
   - Cherchez "Route matched: r3"
   - Cherchez "LoadBalancerClient: No instances available"

3. **Vérifiez les logs du Billing Service:**
   - Cherchez "Registering application ... with eureka"
   - Cherchez "Started BillingServiceApplication"

4. **Testez directement le Billing Service:**
   ```bash
   curl http://localhost:8083/bills
   ```
   Si ça fonctionne directement mais pas via le gateway, le problème vient du routage.

## 💡 Astuce

Le Gateway a `lower-case-service-id=true` dans `application.properties`, mais cela ne s'applique qu'au DiscoveryLocator, pas aux routes statiques. Les routes dans `application.yml` doivent utiliser le nom exact tel qu'enregistré dans Eureka.

