# Step 3: Installing k3s on Kumrui MiniPCs

![Step 3 Thumbnail](thumbnail_step3_compressed.jpg)

## Overview
In **Step 2**, we configured static IPs for three Kumrui MiniPCs running **Ubuntu Server 24.04.3 LTS**. Now, in **Step 3**, we’ll install **k3s**, a lightweight Kubernetes distribution ideal for homelabs and edge computing.

---

## Why k3s?
- **Lightweight:** Uses fewer resources than full Kubernetes.
- **Simple:** Single-binary installation and easy node joining.

> Ensure each node has a unique hostname (e.g., `node1`, `node2`, `node3`) and a static IPs.

---

## Prerequisites
- Ubuntu Server installed and updated on all nodes
- Disable Firewall
- Static IPs assigned
- SSH access to each node
- Install Curl 

Update packages on all nodes:
```bash
sudo apt update && sudo apt upgrade -y
```
Install **curl** on all nodes:
```bash
sudo apt install curl
```
Disable Firewall on all nodes:
```bash
sudo ufw disable
```
Confirm Firewall is off
```bash
sudo ufw status
```

Disable swap (required by Kubernetes):
```bash
sudo swapoff -a
sudo sed -i '/ swap / s/^/#/' /etc/fstab
```
Confirm swap is off: 
```bash
sudo swapon --show (No Output should be seen)
```
  ### OR
```bash
sudo free -h
               total        used        free      shared  buff/cache   available
Mem:            15Gi       1.2Gi        12Gi       9.8Mi       2.2Gi        14Gi
Swap:             0B          0B          0B
```
---
## Enable none sudo kubectl for your K3s user (After installing k3s on each node):
By default, you might need sudo to run kubectl commands. To access the cluster without sudo, configure your local kubeconfig.
```bash
mkdir -p ~/.kube
sudo cp /etc/rancher/k3s/k3s.yaml ~/.kube/config
sudo chown $USER:$USER ~/.kube/config
# Test without sudo
kubectl get nodes
```
## Install k3s on the Control Plane (node1)
Run on **node1**:
```bash
curl -sfL https://get.k3s.io | sh -
```

Check status:
```bash
sudo systemctl status k3s
```

Get the join token (needed by worker nodes):
```bash
sudo cat /var/lib/rancher/k3s/server/node-token
```

---

## Join Worker Nodes (node2, node3)
Run on **each worker node** (replace `<CONTROL_NODE_IP>` and `<NODE_TOKEN>`):
```bash
curl -sfL https://get.k3s.io | K3S_URL=https://<CONTROL_NODE_IP>:6443 K3S_TOKEN=<NODE_TOKEN> sh -
```

---

## Verify the Cluster
Run on **node1**:
```bash
sudo k3s kubectl get nodes
```

Expected output:
```
NAME     STATUS   ROLES                  AGE   VERSION
node1    Ready    control-plane,master   10m   v1.33.6+k3s1
node2    Ready    <none>                 5m    v1.33.6+k3s1
node3    Ready    <none>                 5m    v1.33.6+k3s1
```

---

## Troubleshooting Tips
- If a worker node fails to join, verify **network connectivity** and that port **6443** is reachable.
- Ensure the **token** matches the control node’s current `node-token`.
- Check logs:
```bash
journalctl -u k3s -f            # control node
journalctl -u k3s-agent -f      # worker nodes
```

---

## Next Steps
In **Step 4**, deploy initial workloads and explore k3s features like Traefik ingress and Helm charts.

---

*Last updated: 2025-12-20*
