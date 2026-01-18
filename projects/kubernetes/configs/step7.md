
# Step 7: Installing Uptime Kuma k3s on Kumrui MiniPCs

## Introduction
Traefik is a modern, cloud-native reverse proxy and ingress controller. This guide shows how to install Traefik via Helm on a K3s cluster, assign an external IP with MetalLB, and expose the Traefik dashboard.

## Prerequisites
- Kubernetes (K3s) cluster with `kubectl` configured.
- Helm 3 installed.
- MetalLB installed and configured with an `IPAddressPool` (e.g., `general-pool`).

## Installation Steps
1. Add the Traefik chart repository and update:
   ```bash
   helm repo add uptime-kuma https://helm.irsigler.cloud
   helm repo update
   ```
2. Create the `traefik` namespace and install Traefik:
   ```bash
   kubectl create namespace traefik
   helm install traefik traefik/traefik --namespace traefik
   ```
3. Check the service:
   ```bash
   kubectl get svc -n traefik
   # Expect: TYPE LoadBalancer, External IP from MetalLB
   ```
   You should see an IP address assigned to Traefix as depicted below:
   
   ```bash
   kub@kubcontrol:~/.kube$ kubectl get svc -n traefik
   NAME      TYPE           CLUSTER-IP    EXTERNAL-IP    PORT(S)                      AGE
   traefik   LoadBalancer   10.43.41.48   192.168.2.53   80:31325/TCP,443:31885/TCP   95s
   kub@kubcontrol:~/.kube$
   ```
   
4. (Optional) Pin Traefik to a specific MetalLB pool:
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
## Configuration — Expose Traefik Dashboard
Create `dashboard.yaml`:  
> [!Note]
>  Notice in the .yaml file that a domain (traefik.home.arpa) name is being used instead of an IP address.
> This was done on purpose as in Step 6, Adguard will be installed.  Therefor to access Traefik dashboard you will
> need to add the IP address plus the FQDN in your hosts file.   
---
```yaml
apiVersion: traefik.io/v1alpha1
kind: IngressRoute
metadata:
  name: traefik-dashboard
  namespace: traefik
spec:
  entryPoints:
  - web
  routes:
  - match: Host(`traefik.home.arpa`) && (PathPrefix(`/dashboard`) || PathPrefix(`/api`))
    kind: Rule
    services:
    - name: api@internal
      kind: TraefikService
```
Apply it:
```bash
kubectl apply -f dashboard.yaml
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

