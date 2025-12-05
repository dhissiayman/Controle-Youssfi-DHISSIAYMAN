# 🔧 Solution Erreur 503 - Problème LoadBalancer

## ⚠️ Problème Identifié

**Erreur:** `Failed to load bills (Error 503)`
**Situation:** Tous les services sont UP dans Eureka, mais le Gateway ne peut pas résoudre le Billing Service via le load balancer.

**Cause:** Le Gateway a besoin de la dépendance `spring-cloud-starter-loadbalancer` pour résoudre les services via Eureka.

## ✅ Corrections Appliquées

### 1. **Dépendance LoadBalancer Ajoutée** ✅

**Fichier:** `Gateway-service/pom.xml`

Ajout de la dépendance explicite:
```xml
<dependency>
    <groupId>org.springframework.cloud</groupId>
    <artifactId>spring-cloud-starter-loadbalancer</artifactId>
</dependency>
```

### 2. **Configuration Eureka Améliorée** ✅

**Fichier:** `Gateway-service/src/main/resources/application.properties`

Ajout de configurations pour forcer le refresh plus fréquent:
```properties
eureka.client.registry-fetch-interval-seconds=5
eureka.client.initial-instance-info-replication-interval-seconds=5
eureka.instance.lease-renewal-interval-in-seconds=5
eureka.instance.lease-expiration-duration-in-seconds=10
```

## 🚀 Actions Requises

### ⚠️ IMPORTANT: Redémarrer le Gateway Service

**Après ces modifications, vous DEVEZ:**

1. **Arrêter le Gateway Service** (Ctrl+C)

2. **Rebuilder le projet** (pour inclure la nouvelle dépendance):
   ```bash
   cd Gateway-service
   mvn clean install
   ```

3. **Redémarrer le Gateway Service:**
   ```bash
   mvn spring-boot:run
   ```

4. **Attendre 15-20 secondes** après le démarrage pour que le Gateway récupère le registre Eureka

### ✅ Vérification

1. **Vérifiez les logs du Gateway:**
   ```
   Started GatewayServiceApplication
   Fetching registry from eureka server
   ```

2. **Testez l'endpoint:**
   ```bash
   curl http://localhost:8088/api/bills
   ```

3. **Application Angular:**
   - Allez sur http://localhost:4200/bills
   - L'erreur 503 devrait être résolue

## 🔍 Si Ça Ne Fonctionne Toujours Pas

### Vérifier les Logs du Gateway

Cherchez dans les logs:
```
LoadBalancerClient: No instances available for BILLING-SERVICE
```

**Si vous voyez ce message:**
1. Vérifiez que le Gateway a bien récupéré le registre Eureka
2. Attendez 30 secondes après le démarrage du Gateway
3. Vérifiez Eureka Dashboard: http://localhost:8761
4. Vérifiez que BILLING-SERVICE est toujours UP

### Solution Alternative: Redémarrer Tout

Si le problème persiste:

1. **Arrêtez TOUS les services** (Ctrl+C)

2. **Redémarrez dans l'ordre:**
   - Discovery Service (Eureka)
   - Customer Service
   - Inventory Service
   - Billing Service
   - **Gateway Service** (en dernier, après avoir attendu 30 secondes)

3. **Attendez 30 secondes** après le démarrage du Gateway

4. **Testez:** http://localhost:4200/bills

## 💡 Explication Technique

### Pourquoi la Dépendance LoadBalancer?

Avec Spring Cloud 2020+ (et Spring Cloud 2025.0.0), le load balancer est séparé de Eureka Client. Même si `spring-cloud-starter-netflix-eureka-client` inclut normalement le load balancer, il est préférable de l'ajouter explicitement pour garantir la résolution des services.

### Pourquoi le Refresh Fréquent?

Le Gateway doit récupérer le registre Eureka pour connaître les instances disponibles. Avec un refresh plus fréquent (5 secondes au lieu de 30 par défaut), le Gateway découvre les nouveaux services plus rapidement.

## 📋 Checklist Finale

- [ ] Dépendance `spring-cloud-starter-loadbalancer` ajoutée au pom.xml
- [ ] Configuration Eureka améliorée dans application.properties
- [ ] Gateway Service rebuild (`mvn clean install`)
- [ ] Gateway Service redémarré
- [ ] Attendu 15-20 secondes après démarrage
- [ ] Test curl `/api/bills` fonctionne
- [ ] Application Angular fonctionne sans erreur 503

## 🎯 Résultat Attendu

Après redémarrage du Gateway avec la nouvelle dépendance:
- ✅ Le Gateway peut résoudre BILLING-SERVICE via le load balancer
- ✅ Les endpoints `/api/bills` fonctionnent
- ✅ L'application Angular fonctionne sans erreur 503

