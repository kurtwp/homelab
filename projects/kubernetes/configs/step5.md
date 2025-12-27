# Setting up Adguard
## create namespace:
```bash
kubectl create namespace adguard --dry-run=client -o yaml | kubectl apply -f -

```
