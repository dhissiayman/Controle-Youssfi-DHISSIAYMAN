# Debug - Generate Bills Endpoint

## Problème: Cannot connect to server at localhost:8088/api/bills/generate

### Vérifications à faire

#### 1. Vérifier que le Gateway est démarré
```bash
# Testez si le gateway répond
curl http://localhost:8088/api/customers
```

Si ça ne fonctionne pas, le gateway n'est pas démarré.

#### 2. Vérifier que le Billing Service est enregistré dans Eureka
- Ouvrez: http://localhost:8761
- Vérifiez que `BILLING-SERVICE` est dans la liste et qu'il est **UP**

#### 3. Tester directement le Billing Service (sans gateway)
```bash
# Test direct du billing service
curl -X POST http://localhost:8083/bills/generate
```

Si ça fonctionne directement mais pas via le gateway, le problème vient du gateway.

#### 4. Vérifier la configuration du Gateway
Le fichier `Gateway-service/src/main/resources/application.yml` doit contenir:
```yaml
- id: r3
  uri: lb://BILLING-SERVICE
  predicates:
    - Path=/api/bills/**
  filters:
    - RewritePath=/api/bills/(?<segment>.*), /bills/${segment}
```

#### 5. Vérifier les logs du Gateway
Regardez les logs du gateway service. Vous devriez voir des messages de routage.

#### 6. Tester avec curl
```bash
# Test via gateway
curl -X POST http://localhost:8088/api/bills/generate \
  -H "Content-Type: application/json" \
  -H "Origin: http://localhost:4200"
```

### Solutions

1. **Redémarrer le Gateway Service** après avoir modifié `application.yml`
2. **Vérifier Eureka** - Tous les services doivent être enregistrés
3. **Vérifier les ports** - Gateway sur 8088, Billing sur 8083

