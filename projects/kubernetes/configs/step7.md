
# Step 7: Installing Uptime Kuma k3s on Kumrui MiniPCs

## Introduction
Traefik is a modern, cloud-native reverse proxy and ingress controller. This guide shows how to install Traefik via Helm on a K3s cluster, assign an external IP with MetalLB, and expose the Traefik dashboard.

## Prerequisites
- Kubernetes (K3s) cluster with `kubectl` configured.
- Helm 3 installed.
- MetalLB installed and configured with an `IPAddressPool` (e.g., `general-pool`).

## Installation Steps
1. Add the Uptime Kuma chart repository and update:
   ```bash
   helm repo add uptime-kuma https://helm.irsigler.cloud
   helm repo update
   ```
2. Create the `uptime kuma` namespace and install Uptime Kuma:
```bash
   helm install uptime-kuma uptime-kuma\uptime-kuma --namespace monitoring --creat-namespace
   ```
3. Create kuma-values.yaml:  

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
Apply it:
```bash
kubectl apply -f kuma-values.yaml
```
   ```bash
  
4. Check the service:
   ```bash
   kubectl get pods -n monitoring
   kubectl get svc -n monitoring
  
   ```
   You should see an IP address assigned to Traefix as depicted below:
   
   ```bash
   kub@kubcontrol:~/.kube$ kubectl get svc -n traefik
   NAME      TYPE           CLUSTER-IP    EXTERNAL-IP    PORT(S)                      AGE
   traefik   LoadBalancer   10.43.41.48   192.168.2.53   80:31325/TCP,443:31885/TCP   95s
   kub@kubcontrol:~/.kube$
   ```
   
5. (Optional) Pin Traefik to a specific MetalLB pool:
   ```bash
   kubectl annotate service traefik -n traefik metallb.universe.tf/address-pool=general-pool --overwrite
   ```
After the command issues above Traefix will be assigned a IP from the pool as shown below: 
```bash
   kub@kubcontrol:~/.kube$ kubectl get svc -n traefik
   NAME      TYPE           CLUSTER-IP    EXTERNAL-IP    PORT(S)                      AGE
   traefik   LoadBalancer   10.43.41.48   192.168.2.20   80:31325/TCP,443:31885/TCP   5m37s
   kub@kubcontrol:~/.kube$
```
## Configuration — Uptime Kuma
Create `kuma-values.yaml`:  
> [!Note]
>  
---
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
Apply it:
```bash
kubectl apply -f kuma-values.yaml
```
## Configuration — Uptime Kuma Traefik Ingress
Create `kuma-ingress.yaml`:  
> [!Note]
>  
---
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
  - host: uptime.home.arpa
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
kubectl apply -f kuma-ingress.yaml
```
## Update hosts file on Linux or Windows
```bash
192.168.2.20 traefik.home.arpa
```
#### For Linux the hosts file can be found, in most cases, under /etc
#### For Windows 11 the hosts file is usally found under C:\Windoews\System32\drivers\etc\

## Testing
Open the dashboard in your browser using the MetalLB external IP or DNS:
> [!Note]
>  Make sure you add the closing "/" to the end of dashboard. If not, access to
> Traefik will be denied.  
```
http://192.168.2.20/dashboard/
```
If you configured DNS, use:

```
http://traefik.home.arpa/dashboard/
```

## Conclusion
With Traefik and MetalLB, bare‑metal K3s clusters get production‑style ingress and external IPs. Maintain least privilege and secure access to the dashboard in non‑lab environments.

---

[Back](../readme.md)

