
# Step 5: Installing Traefik k3s on Kumrui MiniPCs

## Introduction
Traefik is a modern, cloud-native reverse proxy and ingress controller. This guide shows how to install Traefik via Helm on a K3s cluster, assign an external IP with MetalLB, and expose the Traefik dashboard.

## Prerequisites
- Kubernetes (K3s) cluster with `kubectl` configured.
- Helm 3 installed.
- MetalLB installed and configured with an `IPAddressPool` (e.g., `general-pool`).

## Installation Steps
1. Add the Traefik chart repository and update:
   ```bash
   helm repo add traefik https://traefik.github.io/charts
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

## Testing
Open the dashboard in your browser using the MetalLB external IP or DNS:
```
http://192.168.2.20/dashboard/
```
If you configured DNS, use:
```
http://traefik.home.lan/dashboard/
```

## Common Pitfalls

- **Annotations**: If the external IP doesn’t change, verify your MetalLB pools and L2Advertisement.
- **EntryPoints**: The dashboard IngressRoute uses `web` (HTTP). If using TLS, add `websecure` and certificates.

## Conclusion
With Traefik and MetalLB, bare‑metal K3s clusters get production‑style ingress and external IPs. Maintain least privilege and secure access to the dashboard in non‑lab environments.

---







***
## Install Traefix 
```bash
kub@kubcontrol:~/.kube$ helm repo add traefik https://traefik.github.io/charts
helm repo update
"traefik" already exists with the same configuration, skipping
Hang tight while we grab the latest from your chart repositories...
...Successfully got an update from the "metallb" chart repository
...Successfully got an update from the "traefik" chart repository
Update Complete. ⎈Happy Helming!⎈
kub@kubcontrol:~/.kube$ kubectl create namespace traefik
namespace/traefik created
kub@kubcontrol:~/.kube$ helm install traefik traefik/traefik --namespace traefik
NAME: traefik
LAST DEPLOYED: Fri Dec 26 21:51:44 2025
NAMESPACE: traefik
STATUS: deployed
REVISION: 1
TEST SUITE: None
NOTES:
traefik with docker.io/traefik:v3.6.5 has been deployed successfully on traefik namespace!

traefik with docker.io/traefik:v3.6.5 has been deployed successfully on traefik namespace!
kub@kubcontrol:~/.kube$ kubectl get svc -n traefik
NAME      TYPE           CLUSTER-IP    EXTERNAL-IP    PORT(S)                      AGE
traefik   LoadBalancer   10.43.41.48   192.168.2.53   80:31325/TCP,443:31885/TCP   95s
kub@kubcontrol:~/.kube$

# WIll force traefix to use the range of IP.
kubectl annotate service traefik -n traefik metallb.universe.tf/address-pool=general-pool --overwrite
kub@kubcontrol:~/.kube$ kubectl get svc -n traefik
NAME      TYPE           CLUSTER-IP    EXTERNAL-IP    PORT(S)                      AGE
traefik   LoadBalancer   10.43.41.48   192.168.2.20   80:31325/TCP,443:31885/TCP   5m37s
kub@kubcontrol:~/.kube$
kubctl apply -f dashbraod.yaml

```

## Update /etc/hosts file
```bash
192.168.2.20 traefik.home.arpa
```

## Access Traefik
```bash
http://traefik.home.arpa
```

## MetalLB .yaml file

## Traefik dashbroad.yaml
```bash
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
