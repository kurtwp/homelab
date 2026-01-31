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
