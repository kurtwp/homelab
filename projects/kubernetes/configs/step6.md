
# Step 6: Installing Adguard on k3s cluster using Kumrui MiniPCs

AdGuard Home is a network-wide ad blocker and DNS filtering solution. This guide explains how to deploy AdGuard Home on a Kubernetes cluster using **MetalLB** for external IP assignment.

## Adguard DNS List:
https://adguard-dns.io/kb/general/dns-providers
## Adguard Knowledge Base:
https://adguard-dns.io/kb/

***

## ✅ Prerequisites

*   A running Kubernetes cluster (e.g., K3s)
*   `kubectl` configured
*   MetalLB installed and configured with an IP pool
*   Helm (optional for other components)
*   Persistent directories for AdGuard data and config:
    ```bash
    sudo mkdir -p /var/lib/adguard/work /var/lib/adguard/conf
    sudo chmod -R 777 /var/lib/adguard
    ```

***

## ✅ Step 1: Create Namespace

```bash
kubectl create namespace adguard --dry-run=client -o yaml | kubectl apply -f -
```

***

## ✅ Step 2: Create AdGuard Deployment and Service

Create a file named **`adguard.yaml`**:

```yaml
apiVersion: v1
kind: Service
metadata:
  name: adguard-home
  namespace: adguard
  annotations:
    metallb.universe.tf/allow-shared-ip: "adguard"
spec:
  selector:
    app: adguard-home
  type: LoadBalancer
  loadBalancerIP: 192.168.2.53
  externalTrafficPolicy: Local
  ports:
    - name: http
      port: 3000
      targetPort: 3000
      protocol: TCP
    - name: dns-tcp
      port: 53
      targetPort: 53
      protocol: TCP
    - name: dns-udp
      port: 53
      targetPort: 53
      protocol: UDP
---
apiVersion: apps/v1
kind: Deployment
metadata:
  name: adguard-home
  namespace: adguard
spec:
  replicas: 1
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
            - containerPort: 3000
            - containerPort: 53
          volumeMounts:
            - name: adguard-data
              mountPath: /opt/adguardhome/work
            - name: adguard-config
              mountPath: /opt/adguardhome/conf
      volumes:
        - name: adguard-data
          hostPath:
            path: /var/lib/adguard/work
            type: DirectoryOrCreate
        - name: adguard-config
          hostPath:
            path: /var/lib/adguard/conf
            type: DirectoryOrCreate
```

Apply the manifest:

```bash
kubectl apply -f adguard.yaml
```

***

## ✅ Step 3: Verify Deployment

Check pods:

```bash
kubectl get pods -n adguard
```
Expecter output:
```bash
kub@control:~/.kube$ kubectl get pods -n adguard
NAME                            READY   STATUS    RESTARTS      AGE
adguard-home-76db99587d-xk6b2   1/1     Running   2 (21h ago)   23h
```
Check service:

```bash
kubectl get svc -n adguard
```

Expected output:

    NAME           TYPE           CLUSTER-IP      EXTERNAL-IP     PORT(S)                          AGE
    adguard-home   LoadBalancer   10.43.215.24    192.168.2.53    3000:31459/TCP,53:31819/TCP,53:31819/UDP

***

## ✅ Access AdGuard Home

Open in browser:

    http://192.168.2.53:3000

***

## ✅ Common Issues

*   **Volume errors**: Ensure `hostPath` directories exist and have correct permissions.
*   **MetalLB IP assignment**: Verify `loadBalancerIP` is within your MetalLB pool.
*   **Deployment errors**: Use `apps/v1` for Deployment and correct `hostPath` syntax.

***

### � Conclusion

You now have AdGuard Home running on Kubernetes with a static external IP provided by MetalLB. This setup allows DNS filtering and ad-blocking for your entire network.

***
[Back](../readme.md)












***

# Setting up Adguard

## create namespace:
```bash
kubectl create namespace adguard --dry-run=client -o yaml | kubectl apply -f -
```

Before you apply this, run these two commands on your Ubuntu terminal to make sure the folders exist and the Kubernetes pod is allowed to write to them:
```bash
sudo mkdir -p /var/lib/adguard/work /var/lib/adguard/conf
sudo chmod -R 777 /var/lib/adguard
```
## Apply adguard.yaml
```bash
kubectl get svc -n adguard
```
## Confirm Adguard
```bash
kub@kubcontrol:~/.kube$ kubectl get pods -n adguard
NAME                            READY   STATUS    RESTARTS   AGE
adguard-home-76db99587d-ln6cz   1/1     Running   0          20s
kub@kubcontrol:~/.kube$ kubectl get svc -n adguard
NAME           TYPE           CLUSTER-IP     EXTERNAL-IP    PORT(S)                                    AGE
adguard-home   LoadBalancer   10.43.81.117   192.168.2.53   3000:30408/TCP,53:31592/TCP,53:31592/UDP   10m
kub@kubcontrol:~/.kube$
```
## Adguard yaml
```bash
apiVersion: v1
kind: Service
metadata:
  name: adguard-home
  namespace: adguard
  annotations:
    metallb.universe.tf/allow-shared-ip: "adguard"
spec:
  selector:
    app: adguard-home
  type: LoadBalancer
  loadBalancerIP: 192.168.2.53
  externalTrafficPolicy: Local
  ports:
    - name: http
      port: 3000
      targetPort: 3000
      protocol: TCP
    - name: dns-tcp
      port: 53
      targetPort: 53
      protocol: TCP
    - name: dns-udp
      port: 53
      targetPort: 53
      protocol: UDP
---
apiVersion: apps/v1
kind: Deployment
metadata:
  name: adguard-home
  namespace: adguard
spec:
  replicas: 1
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
        - containerPort: 3000
        - containerPort: 53
        volumeMounts:
        - name: adguard-data
          mountPath: /opt/adguardhome/work
        - name: adguard-config
          mountPath: /opt/adguardhome/conf
      volumes:
      - name: adguard-data
        hostPath:
          path: /var/lib/adguard/work
          type: DirectoryOrCreate
      - name: adguard-config
        hostPath:
          path: /var/lib/adguard/conf
          type: DirectoryOrCreate
```
