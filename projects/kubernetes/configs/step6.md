
# Step 6: Installing Adguard on k3s cluster using Kumrui MiniPCs

AdGuard Home is a network-wide ad blocker and DNS filtering solution. This guide explains how to deploy AdGuard Home on a Kubernetes cluster using **MetalLB** for external IP assignment.

## Adguard DNS List:
https://adguard-dns.io/kb/general/dns-providers
## Adguard Knowledge Base:
https://adguard-dns.io/kb/

***

##  Prerequisites

*   A running Kubernetes cluster (e.g., K3s)
*   `kubectl` configured
*   MetalLB installed and configured with an IP pool
***

##  Step 1: Create AdGuard Deployment and Service

Create a file named **`adguard.yaml`**:

```yaml
apiVersion: v1
kind: Service
metadata:
  name: adguard-home
  namespace: adguard
  annotations:
    metallb.universe.tf/allow-shared-ip: "adguard"
    metallb.universe.tf/address-pool: adguard-pool
spec:
  selector:
    app: adguard-home
  type: LoadBalancer
  loadBalancerIP: 192.168.2.53  #Change to you IP Address
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
  namespace: adguard
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


***
##  Step 2: Create Namespace

```bash
kubectl create namespace adguard
```
## Step 3: Apply .yaml file

```bash
kubectl apply -f adguard.yaml
```

## Step 4: Verify Deployment

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

## Access AdGuard Home

Open in browser:

    http://192.168.2.53:3000

***

## Common Issues

*   **Volume errors**: Ensure `hostPath` directories exist and have correct permissions.
*   **MetalLB IP assignment**: Verify `loadBalancerIP` is within your MetalLB pool.
*   **Deployment errors**: Use `apps/v1` for Deployment and correct `hostPath` syntax.
*   **Persistent directories** for AdGuard data and config:
    ```bash
    sudo mkdir -p /var/lib/adguard/work /var/lib/adguard/conf
    sudo chmod -R 777 /var/lib/adguard
    ```

***

### � Conclusion

You now have AdGuard Home running on Kubernetes with a static external IP provided by MetalLB. This setup allows DNS filtering and ad-blocking for your entire network.

***
[Back](../readme.md)

