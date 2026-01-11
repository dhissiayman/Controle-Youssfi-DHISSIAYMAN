# 🔧 Solution Erreur 503 - Service Unavailable

## ⚠️ Problème

**Erreur:** `Failed to load bills (Error 503)`
**Message:** `Service unavailable. The requested service is not available.`

Cela signifie que le **Gateway ne trouve pas le Billing Service** dans Eureka.

## ✅ Solution en 4 Étapes

### Étape 1: Vérifier Eureka Dashboard

1. Ouvrez http://localhost:8761 dans votre navigateur
2. Cherchez **BILLING-SERVICE** dans la liste des applications
3. Vérifiez le statut:
   - ✅ **UP** (vert) = Service disponible
   - ❌ **DOWN** (rouge) = Service indisponible
   - ⚠️ **Absent** = Service non enregistré

**Si BILLING-SERVICE n'est pas dans la liste ou est DOWN:**
→ Le service n'est pas démarré ou n'est pas enregistré
→ **Solution:** Redémarrez le Billing Service

### Étape 2: Vérifier que le Billing Service est Démarré

**Vérifiez les logs du Billing Service.** Vous devriez voir:
```
Started BillingServiceApplication
Registering application BILLING-SERVICE with eureka
DiscoveryClient_BILLING-SERVICE/... - registration status: 204
```

**Si vous ne voyez pas ces messages:**
→ Le service n'est pas démarré
→ **Solution:** Démarrez le Billing Service

### Étape 3: Vérifier le Nom du Service

**Le nom dans Eureka DOIT être exactement:** `BILLING-SERVICE` (en majuscules)

**Vérifiez dans:** `Billing-service/src/main/resources/application.properties`
```properties
spring.application.name=BILLING-SERVICE
```

**Si ce n'est pas le cas:**
→ Modifiez et redémarrez le service

### Étape 4: Vérifier la Configuration du Gateway

**Vérifiez dans:** `Gateway-service/src/main/resources/application.yml`
```yaml
- id: r3
  uri: lb://BILLING-SERVICE  # Doit correspondre au nom dans Eureka
  predicates:
    - Path=/api/bills/**
```

**Si le nom ne correspond pas:**
→ Modifiez et redémarrez le Gateway

## 🚀 Procédure de Redémarrage Complète

### Ordre de Démarrage (IMPORTANT)

1. **Discovery Service (Eureka)** - Port 8761
   ```bash
   cd Discovery-service
   mvn spring-boot:run
   ```
   Attendez: "Started DiscoveryServiceApplication"

2. **Customer Service** - Port 8081
   ```bash
   cd customer-service
   mvn spring-boot:run
   ```
   Attendez: "Registering application CUSTOMER-SERVICE"

3. **Inventory Service** - Port 8082
   ```bash
   cd Inventory-service
   mvn spring-boot:run
   ```
   Attendez: "Registering application INVENTORY-SERVICE"

4. **Billing Service** - Port 8083 ⚠️ **CRITIQUE**
   ```bash
   cd Billing-service
   mvn spring-boot:run
   ```
   Attendez: "Registering application BILLING-SERVICE"

5. **Gateway Service** - Port 8088 ⚠️ **EN DERNIER**
   ```bash
   cd Gateway-service
   mvn spring-boot:run
   ```
   Attendez: "Started GatewayServiceApplication"

### ⏱️ Temps d'Attente

**Attendez 10-15 secondes** après le démarrage de chaque service pour qu'il s'enregistre dans Eureka.

## 🔍 Diagnostic Rapide

### Test 1: Billing Service Direct (sans Gateway)
```bash
curl http://localhost:8083/bills
```

**Si ça fonctionne:**
→ Le Billing Service est OK, le problème vient du Gateway/Eureka

**Si ça ne fonctionne pas:**
→ Le Billing Service n'est pas démarré

### Test 2: Via Gateway
```bash
curl http://localhost:8088/api/bills
```

**Si erreur 503:**
→ Le Gateway ne trouve pas le service dans Eureka

**Si erreur 404:**
→ Le RewritePath ne fonctionne pas

**Si erreur 0:**
→ Le Gateway n'est pas démarré

### Test 3: Vérifier Eureka
```bash
curl http://localhost:8761/eureka/apps
```

**Si vous voyez BILLING-SERVICE dans la réponse:**
→ Le service est enregistré

**Si vous ne le voyez pas:**
→ Le service n'est pas enregistré

## 📋 Checklist Complète

- [ ] Discovery Service démarré (port 8761)
- [ ] Customer Service démarré et UP dans Eureka
- [ ] Inventory Service démarré et UP dans Eureka
- [ ] **Billing Service démarré et UP dans Eureka** ⚠️
- [ ] Gateway Service démarré (port 8088)
- [ ] Nom du service: `BILLING-SERVICE` (majuscules)
- [ ] Configuration Gateway: `lb://BILLING-SERVICE`
- [ ] Attendu 10-15 secondes après démarrage
- [ ] Test curl `/api/bills` fonctionne

## 🆘 Si Ça Ne Fonctionne Toujours Pas

### Vérifiez les Logs du Gateway

Cherchez dans les logs:
```
LoadBalancerClient: No instances available for BILLING-SERVICE
```

**Si vous voyez ce message:**
→ Le Gateway ne trouve pas le service
→ Vérifiez le nom exact dans Eureka
→ Vérifiez que le nom correspond dans `application.yml`

### Vérifiez les Logs du Billing Service

Cherchez:
```
Registering application BILLING-SERVICE with eureka
DiscoveryClient_BILLING-SERVICE/... - registration status: 204
```

**Si vous ne voyez pas "registration status: 204":**
→ Le service ne s'enregistre pas dans Eureka
→ Vérifiez que Eureka est accessible
→ Vérifiez la configuration Eureka dans `application.properties`

### Solution Alternative: Redémarrer Tout

Si rien ne fonctionne, redémarrez **TOUS** les services dans l'ordre:

1. Arrêtez tous les services (Ctrl+C)
2. Redémarrez dans l'ordre: Discovery → Customer → Inventory → Billing → Gateway
3. Attendez 30 secondes après le dernier service
4. Vérifiez Eureka: http://localhost:8761
5. Testez: http://localhost:4200/bills

## 💡 Note Importante

L'erreur 503 signifie que le Gateway a trouvé la route mais ne peut pas trouver une instance du service dans Eureka. C'est différent de:
- **404:** Route non trouvée
- **0:** Connexion refusée (service non démarré)
- **500:** Erreur serveur

La solution est toujours de vérifier que le service est **enregistré dans Eureka** avec le **bon nom**.

