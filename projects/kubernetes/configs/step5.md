# Setting up Adguard
## create namespace:
```bash
kubectl create namespace adguard --dry-run=client -o yaml | kubectl apply -f -



sudo mkdir -p /var/lib/adguard/work /var/lib/adguard/conf
sudo chmod -R 777 /var/lib/adguard

```
