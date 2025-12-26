# Step 4: Installing MetalLB k3s on Kumrui MiniPCs
 curl -sfL https://get.k3s.io | INSTALL_K3S_EXEC="server --disable traefik --disable servicelb" sh -
```bash
mkdir -p ~/.kube
sudo cp /etc/rancher/k3s/k3s.yaml ~/.kube/config
sudo chown $(id -u):$(id -g) ~/.kube/config
chmod 600 ~/.kube/config
export KUBECONFIG=~/.kube/config
echo "export KUBECONFIG=~/.kube/config" >> ~/.bashrc

curl https://raw.githubusercontent.com/helm/helm/main/scripts/get-helm-3 | bash

helm repo add metallb https://metallb.github.io/metallb
helm repo update
helm install metallb metallb/metallb --namespace metallb-system --create-namespace

kubectl apply -f metallb-config.yaml
kubectl get pods -n metallb-system
kubectl get ipaddresspool -n metallb-system
kubectl get l2advertisement -n metallb-system
```

## Test MetaLB
```bash
kubectl create deployment web-test --image=nginx
kubectl expose deployment web-test --port=80 --type=LoadBalancer
kubectl get svc web-test
kubectl delete service web-test
kubectl delete deployment web-test
kubectl get svc web-test

```

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

## MetalLB .yaml file
```bash
Version: metallb.io/v1beta1
kind: IPAddressPool
metadata:
  name: general-pool
  namespace: metallb-system
spec:
  addresses:
  - 192.168.2.20-192.168.2.29
---
apiVersion: metallb.io/v1beta1
kind: IPAddressPool
metadata:
  name: adguard-pool
  namespace: metallb-system
spec:
  addresses:
  - 192.168.2.53/32  # Specifically for AdGuard
---
apiVersion: metallb.io/v1beta1
kind: L2Advertisement
metadata:
  name: l2-advert
  namespace: metallb-system
spec:
  ipAddressPools:
  - general-pool
  - adguard-pool
```










