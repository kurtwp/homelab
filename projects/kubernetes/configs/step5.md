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
