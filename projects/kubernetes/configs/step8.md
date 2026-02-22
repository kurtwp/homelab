---
# 🏠 Homelab Dashboard: Homepage on k3s

This guide covers the deployment of [Homepage](https://gethomepage.dev) on a **k3s** cluster, integrated with **Longhorn** for storage and **MetalLB** for a dedicated static IP.

## 🌐 Environment Overview
The dashboard is configured to monitor and link to the following existing services in the homelab:


| Service | IP Address | Role |
| :--- | :--- | :--- |
| **Traefik** | `192.168.2.20` | Ingress Controller |
| **Longhorn** | `192.168.2.21` | Persistent Storage |
| **Uptime Kuma** | `192.168.2.22` | Service Monitoring |
| **Homepage** | `192.168.2.23` | Dashboard (New) |
| **AdGuard Home** | `192.168.2.53` | Network Ad-blocking |

---
## Install Steps

1. Add the community-maintained Helm repository and update your local charts
```bash
helm repo add jameswynn https://jameswynn.github.io/helm-charts
helm repo update
```
2. Create a Custom values.yaml
To match your specific setup (MetalLB static IP and Longhorn storage), create a file named homepage-values.yaml:
```yaml
env:
  # Option A: List both your old and new IPs (comma-separated, NO SPACES)
    HOMEPAGE_ALLOWED_HOSTS: "192.168.2.23"
  
  # Option B: The "Homelab Fix" - Allow any host to bypass the error
  # HOMEPAGE_ALLOWED_HOSTS: "*"

service:
  main:
    type: LoadBalancer
    annotations:
      # Matches your new desired IP
      metallb.io/loadBalancerIPs: 192.168.2.23
    ports:
      http:
        port: 80
        targetPort: 3000

persistence:
  config:
    enabled: true
    type: pvc
    storageClass: "longhorn"
    size: 1Gi
    accessMode: ReadWriteOnce
    globalMounts:
      - path: /app/config

```
3. Run the Install command
 ```bash
   helm install homepage jameswynn/homepage -f homepage-values.yaml
```
Output:

```bash
kub@kcontrol:~/.kube$ helm install homepage jameswynn/homepage -f homepage-values.yaml
NAME: homepage
LAST DEPLOYED: Sun Feb 22 16:43:51 2026
NAMESPACE: default
STATUS: deployed
REVISION: 1
TEST SUITE: None
kub@kcontrol:~/.kube$ kubectl get svc homepage
NAME       TYPE           CLUSTER-IP    EXTERNAL-IP    PORT(S)        AGE
homepage   LoadBalancer   10.43.12.24   192.168.2.23   80:32191/TCP   9s
kub@kcontrol:~/.kube$

```



---
### 1. Create the Deployment Configuration
We use a single YAML file to handle the PersistentVolumeClaim (PVC), the Deployment, and the LoadBalancer Service.

1. Create a file named `homepage-deployment.yaml`.
2. Apply it to your cluster:
   ```bash
   kubectl apply -f homepage-deployment.yaml
---
🛠️ Deployment YAML (homepage-deployment.yaml)

```yaml
apiVersion: v1
kind: PersistentVolumeClaim
metadata:
  name: homepage-config-pvc
spec:
  accessModes:
    - ReadWriteOnce
  storageClassName: longhorn
  resources:
    requests:
      storage: 1Gi
---
apiVersion: apps/v1
kind: Deployment
metadata:
  name: homepage
spec:
  replicas: 1
  selector:
    matchLabels:
      app: homepage
  template:
    metadata:
      labels:
        app: homepage
    spec:
      containers:
      - name: homepage
        image: ghcr.io/gethomepage/homepage:latest
        ports:
        - containerPort: 3000
        volumeMounts:
        - name: config
          mountPath: /app/config
      volumes:
      - name: config
        persistentVolumeClaim:
          claimName: homepage-config-pvc
---
apiVersion: v1
kind: Service
metadata:
  name: homepage-lb
  annotations:
    metallb.io/loadBalancerIPs: 192.168.2.23
spec:
  type: LoadBalancer
  selector:
    app: homepage
  ports:
  - protocol: TCP
    port: 80
    targetPort: 3000
```
---

2. Configure Your Services
Once the pod is running, Homepage needs to know what to display. Access your configuration files via the Longhorn volume or by exec-ing into the pod:
File: services.yaml

---
```yaml
- Infrastructure:
    - Traefik:
        icon: traefik
        href: http://192.168.2.20
    - Longhorn:
        icon: longhorn
        href: http://192.168.2.21
    - AdGuard Home:
        icon: adguard-home
        href: http://192.168.2.53
    - Uptime Kuma:
        icon: uptime-kuma
        href: http://192.168.2.22:3001
```
