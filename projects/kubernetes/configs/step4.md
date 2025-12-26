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
helm repo add traefik https://traefik.github.io/charts
helm repo update
helm install traefik traefik/traefik   --namespace kube-system   --set service.type=LoadBalancer
kubectl get svc -n kube-system

kubectl annotate service traefik -n kube-system metallb.universe.tf/address-pool=general-pool --overwrite  # WIll force traefix to use the range of IP. 
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










