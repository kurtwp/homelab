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

Phase 3: Install Traefik with its own IP
Since you removed the default K3s Traefik, we’ll install the official Helm chart. MetalLB will automatically grab the next IP (likely .61).

```Bash
helm repo add traefik https://traefik.github.io/charts
helm repo update

helm install traefik traefik/traefik \
  --namespace traefik \
  --create-namespace
```
