
# Step 7: Installing Uptime Kuma k3s on Kumrui MiniPCs

## Introduction
Uptime Kuma is a self hosted monitoring tool that tracks the uptime, performance, and availability of your services with a clean, modern dashboard.
It offers flexible checks, alerts, and integrations, making it an ideal open source tool for your home lab.

## Prerequisites
- Kubernetes (K3s) cluster with `kubectl` configured.
- Helm 3 installed.
- Traefik installed and configured.

## Installation Steps
1. Add the Uptime Kuma chart repository and update:
   ```bash
   helm repo add uptime-kuma https://helm.irsigler.cloud
   helm repo update
   ```
2. Create kuma-values.yaml:  

```yaml
## Use local-path storage (default in K3s)
storage:
  enabled: true
  storageClassName: local-path
  size: 2Gi

ingress:
  enabled: true
  className: traefik
  hosts:
    - host: uptime.home.arpa  # <--- Change this to your preferred local domain
      paths:
        - path: /
          pathType: ImplementationSpecific
```
3. Create the `uptime kuma` namespace and install Uptime Kuma:
```bash
 helm upgrade --install uptime-kuma uptime-kuma/uptime-kuma --namespace monitoring --create-namespace -f kuma-values.yaml
```  
4. Check the service:
   ```bash
   kubectl get pods -n monitoring
      NAME                           READY   STATUS    RESTARTS   AGE
      uptime-kuma-678978b8d9-sm68m   1/1     Running   0          17m

   kubectl get svc -n monitoring
      NAME          TYPE        CLUSTER-IP     EXTERNAL-IP   PORT(S)    AGE
      uptime-kuma   ClusterIP   10.43.183.79   <none>        3001/TCP   17m

   ```
   
5. Expose Uptime Kuma using Traefik Ingress: kuma-ingress.yaml
```yaml
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: uptime-kuma
  namespace: monitoring
  annotations:
    # This tells the K3s Traefik controller to pick up this rule
    kubernetes.io/ingress.class: traefik
spec:
  rules:
  - host: uptime.home.lan
    http:
      paths:
      - path: /
        pathType: Prefix
        backend:
          service:
            name: uptime-kuma
            port:
              number: 3001

```
Apply it:
```bash
kubectl apply -f kuma-values.yaml
```



[Back](../readme.md)

