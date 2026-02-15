
# Installing Longhorn for k3s on Kumrui MiniPCs
**Longhorn** is a lightweight, open-source, distributed block storage system designed specifically for Kubernetes, often used with K3s to provide persistent, highly available storage for stateful applications. It works by replicating data across multiple nodes in a cluster, enabling pods to move between nodes without data loss. 

Phase 1: Prepare the Nodes (Don't skip this!)
Longhorn will fail to mount volumes if these aren't on every node. Run this on c kcontrol, kwk1, and kwk2:

```Bash
sudo apt update && sudo apt install -y open-iscsi nfs-common
sudo systemctl enable --now iscsid
```

Phase 2: Install Longhorn with a Dedicated IP
We will tell MetalLB to give Longhorn the first available IP (likely .60).

```Bash
# Add and update helm repo
helm repo add longhorn https://charts.longhorn.io
helm repo update

# Install Longhorn
helm install longhorn longhorn/longhorn \
  --namespace longhorn-system \
  --create-namespace \
  --set service.ui.type=LoadBalancer
```
# move Longhorn to .61
```bash
kub@kcontrol:~/.kube$ kubectl get svc -A
NAMESPACE         NAME                         TYPE           CLUSTER-IP      EXTERNAL-IP    PORT(S)                  AGE
default           kubernetes                   ClusterIP      10.43.0.1       <none>         443/TCP                  24m
kube-system       kube-dns                     ClusterIP      10.43.0.10      <none>         53/UDP,53/TCP,9153/TCP   24m
kube-system       metrics-server               ClusterIP      10.43.59.159    <none>         443/TCP                  24m
longhorn-system   longhorn-admission-webhook   ClusterIP      10.43.194.151   <none>         9502/TCP                 81s
longhorn-system   longhorn-backend             ClusterIP      10.43.158.222   <none>         9500/TCP                 81s
longhorn-system   longhorn-frontend            LoadBalancer   10.43.46.128    192.168.2.65   80:30513/TCP             81s
longhorn-system   longhorn-recovery-backend    ClusterIP      10.43.130.48    <none>         9503/TCP                 81s
metallb-system    metallb-webhook-service      ClusterIP      10.43.25.161    <none>         443/TCP                  19m
kub@kcontrol:~/.kube$ kubectl patch svc longhorn-frontend -n longhorn-system -p '{"spec":{"loadBalancerIP": "192.168.2.61"}}'
service/longhorn-frontend patched
kub@kcontrol:~/.kube$ kubectl get svc -A
NAMESPACE         NAME                         TYPE           CLUSTER-IP      EXTERNAL-IP    PORT(S)                  AGE
default           kubernetes                   ClusterIP      10.43.0.1       <none>         443/TCP                  26m
kube-system       kube-dns                     ClusterIP      10.43.0.10      <none>         53/UDP,53/TCP,9153/TCP   25m
kube-system       metrics-server               ClusterIP      10.43.59.159    <none>         443/TCP                  25m
longhorn-system   longhorn-admission-webhook   ClusterIP      10.43.194.151   <none>         9502/TCP                 2m42s
longhorn-system   longhorn-backend             ClusterIP      10.43.158.222   <none>         9500/TCP                 2m42s
longhorn-system   longhorn-frontend            LoadBalancer   10.43.46.128    192.168.2.61   80:30513/TCP             2m42s
longhorn-system   longhorn-recovery-backend    ClusterIP      10.43.130.48    <none>         9503/TCP                 2m42s
metallb-system    metallb-webhook-service      ClusterIP      10.43.25.161    <none>         443/TCP                  20m
kub@kcontrol:~/.kube$
```


Phase 3: Install Traefik with its own IP
Since you removed the default K3s Traefik, we’ll install the official Helm chart. MetalLB will automatically grab the next IP (likely .61).

```Bash
helm repo add traefik https://traefik.github.io/charts
helm repo update

helm install traefik traefik/traefik \
  --namespace traefik \
  --create-namespace
```

Phase 3: Installing AdGuard Home
We will use a YAML file to define the Persistent Volume Claim (PVC) first, then the Deployment.

1. Create the Storage Claim (adguard-pvc.yaml)
This tells the cluster: "Hey Longhorn, give me some space for AdGuard."

```yaml
apiVersion: v1
kind: PersistentVolumeClaim
metadata:
  name: adguard-pvc
  namespace: default
spec:
  accessModes:
    - ReadWriteOnce
  storageClassName: longhorn
  resources:
    requests:
      storage: 5Gi
```

2. Create the Deployment & Service (adguard-app.yaml)
This file does two things:

Deployment: Runs the AdGuard container and plugs in the Longhorn storage.

Service: Tells MetalLB to give it the specific IP 192.168.2.65.

```yaml
apiVersion: v1
kind: Service
metadata:
  name: adguard-home
  namespace: default  # Changed back to default to match your PVC
  annotations:
    metallb.universe.tf/allow-shared-ip: "adguard"
spec:
  selector:
    app: adguard-home
  type: LoadBalancer
  loadBalancerIP: 192.168.2.53  # Your desired IP
  externalTrafficPolicy: Local
  ports:
    - name: dns-tcp
      port: 53
      targetPort: 53
      protocol: TCP
    - name: dns-udp
      port: 53
      targetPort: 53
      protocol: UDP
    - name: http-setup
      port: 3000
      targetPort: 3000
      protocol: TCP
    - name: http-ui
      port: 80
      targetPort: 80
      protocol: TCP
---
apiVersion: apps/v1
kind: Deployment
metadata:
  name: adguard-home
  namespace: default
spec:
  replicas: 1
  strategy:
    type: Recreate
  selector:
    matchLabels:
      app: adguard-home
  template:
    metadata:
      labels:
        app: adguard-home
    spec:
      containers:
        - name: adguard-home
          image: adguard/adguardhome:latest
          ports:
            - containerPort: 53
              protocol: TCP
            - containerPort: 53
              protocol: UDP
            - containerPort: 3000
            - containerPort: 80
          volumeMounts:
            - name: adguard-storage
              mountPath: /opt/adguardhome/work
              subPath: work
            - name: adguard-storage
              mountPath: /opt/adguardhome/conf
              subPath: conf
      volumes:
        - name: adguard-storage
          persistentVolumeClaim:
            claimName: adguard-pvc  # This uses the Longhorn disk we fixed!
```
3. Apply the Files
Run these commands in order:

```bash
kubectl apply -f adguard-pvc.yaml
kubectl apply -f adguard-app.yaml
```

Since your Longhorn storage and MetalLB networking are now officially "dialed in," Uptime-Kuma will be a breeze. We’ll use the same pattern: a Longhorn PVC for the database and a LoadBalancer IP for the dashboard.

1. Create the Uptime-Kuma YAML Save this as uptime-kuma.yaml. I've set the IP to 192.168.2.54 to keep it right next to AdGuard.

```yaml
apiVersion: v1
kind: PersistentVolumeClaim
metadata:
  name: uptime-kuma-pvc
spec:
  accessModes:
    - ReadWriteOnce
  storageClassName: longhorn
  resources:
    requests:
      storage: 2Gi
---
apiVersion: apps/v1
kind: Deployment
metadata:
  name: uptime-kuma
spec:
  replicas: 1
  strategy:
    type: Recreate
  selector:
    matchLabels:
      app: uptime-kuma
  template:
    metadata:
      labels:
        app: uptime-kuma
    spec:
      containers:
      - name: uptime-kuma
        image: louislam/uptime-kuma:1
        ports:
        - containerPort: 3001
        volumeMounts:
        - name: uptime-data
          mountPath: /app/data
      volumes:
      - name: uptime-data
        persistentVolumeClaim:
          claimName: uptime-kuma-pvc
---
apiVersion: v1
kind: Service
metadata:
  name: uptime-kuma-service
spec:
  selector:
    app: uptime-kuma
  type: LoadBalancer
  loadBalancerIP: 192.168.2.62
  ports:
  - port: 80
    targetPort: 3001
    protocol: TCP
```
```bash
kubectl apply -f uptime-kuma.yaml
kubectl get pods,svc -l app=uptime-kuma
```
---
"Self-Healing" setup. If kwk2 (where your pods are likely running) goes offline, Kubernetes will notice, and Longhorn will re-attach that storage to kwk1 or kcontrol, bringing your DNS and Monitoring back online automatically.

## Virual Box -- oonly 

/run/flannel/subnet.env file disappearing after a VirtualBox reboot. To stop this from happening again, need to create a simple script that puts that file back automatically every time the VM starts.

```bash
sudo tee /etc/systemd/system/k3s-network-fix.service <<EOF
[Unit]
Description=Fix Flannel subnet.env for K3s
Before=k3s.service

[Service]
Type=oneshot
ExecStartPre=/usr/bin/mkdir -p /run/flannel
ExecStart=/bin/sh -c 'echo "FLANNEL_NETWORK=10.42.0.0/16\nFLANNEL_SUBNET=10.42.0.1/24\nFLANNEL_MTU=1450\nFLANNEL_IPMASQ=true" > /run/flannel/subnet.env'

[Install]
WantedBy=multi-user.target
EOF

sudo systemctl enable k3s-network-fix
```

(Remember to do the same on kwk1 and kwk2, but change the 0.1/24 to 1.1/24 and 2.1/24 respectively.)
