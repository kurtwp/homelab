# Step 4: Installing MetalLB k3s on Kumrui MiniPCs
 curl -sfL https://get.k3s.io | INSTALL_K3S_EXEC="server --disable traefik --disable servicelb" sh -
mkdir -p ~/.kube
   46  sudo cp /etc/rancher/k3s/k3s.yaml ~/.kube/config
   47  sudo chown $(id -u):$(id -g) ~/.kube/config
   48  chmod 600 ~/.kube/config
   49  export KUBECONFIG=~/.kube/config
   50  echo "export KUBECONFIG=~/.kube/config" >> ~/.bashrc











