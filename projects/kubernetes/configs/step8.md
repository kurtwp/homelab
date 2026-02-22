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
## Optional: <br>
By default, Homepage does not have permission to talk to the Kubernetes API to get node info. You need to create a ClusterRole and ClusterRoleBinding for the service account used by the Helm chart.
Create a new yanl called homepage-rbac.yaml
```yaml
apiVersion: v1
kind: ServiceAccount
metadata:
  name: homepage
  namespace: default
---
apiVersion: rbac.authorization.k8s.io/v1
kind: ClusterRole
metadata:
  name: homepage-read-nodes
rules:
- apiGroups: [""]
  resources: ["nodes", "pods", "namespaces"]
  verbs: ["get", "list", "watch"]
- apiGroups: ["metrics.k8s.io"]
  resources: ["nodes", "pods"]
  verbs: ["get", "list"]
---
apiVersion: rbac.authorization.k8s.io/v1
kind: ClusterRoleBinding
metadata:
  name: homepage-read-nodes-binding
subjects:
- kind: ServiceAccount
  name: homepage
  namespace: default
roleRef:
  kind: ClusterRole
  name: homepage-read-nodes
  apiGroup: rbac.authorization.k8s.io
```
Then apply the new yaml file using the below command

```bash
kubectl apply -f homepage-rbac.yaml
```
4. Adding Adguard and Uptime-Kuma.<br>
Now you need to replace those "My First Group" placeholders with your actual homelab services. Since you have Longhorn storage attached, you can edit these settings by modifying the services.yaml file. You can use this command to edit your services directly from your terminal:
```bash
kubectl exec -it $(kubectl get pod -l app.kubernetes.io/name=homepage -o name) -- vi /app/config/services.yaml
```
Replace the contents of that file with this to see your actual apps:
```yaml
- Infrastructure:
    - AdGuard Home:
        icon: adguard-home
        href: http://192.168.2.53
        widget:
          type: adguard
          url: http://192.168.2.53
    - Uptime Kuma:
        icon: uptime-kuma
        href: http://192.168.2.22:3001
        widget:
          type: uptimekuma
          url: http://192.168.2.22:3001
```
Upon saving the file and if you get the following message:
```test
 /app/config/services.yaml  Read-only file system
```
Update your homepage-values.yaml file **persistence** section with the following:
```yaml
persistence:
  config:
    enabled: true
    type: pvc
    storageClass: "longhorn"
    size: 1Gi
    accessMode: ReadWriteOnce
    # FIX: Explicitly allow writing to the volume
    readOnly: false
    globalMounts:
      - path: /app/config

# Optional: Disabling built-in configmaps ensures it ONLY uses your Longhorn storage
configMaps:
  config:
    enabled: false
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
