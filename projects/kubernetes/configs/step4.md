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










