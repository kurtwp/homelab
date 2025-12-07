Private Code Base


# Kubernetes Homelab on Kumrui MiniPCs (Using k3s)

> **Series — [Step 1](configs/step1.md):** Install Ubuntu Server 24.04.3 on three Kumrui MiniPCs<br>
> **Series — [Step 2](configs/step2.md):** Adding Static IPs to Ubuntu Server on Kumrui MiniPCs
> 
![Thumbnail](thumbnail_compressed.jpg)

## 📚 Project Overview
This repository documents the process of building a small **Kubernetes cluster** using **three Kumrui MiniPCs** and **k3s**, a lightweight Kubernetes distribution. The series starts with installing **Ubuntu Server 24.04.3 LTS** on each node and progresses through networking, k3s installation, and deploying workloads.

## 🧩 Repository Structure
```
.
├── images/                # Screenshots, diagrams
├── scripts/               # Helper scripts for setup
├── configs/               # Netplan configs, k3s configs
└── README.md              # You are here
```

## ✅ Goals
- Learn and document a reproducible home lab Kubernetes setup using k3s
- Keep costs and power usage low using MiniPCs
- Use Ubuntu Server LTS for stability and support

## 🖥️ Hardware
- **3× Kumrui MiniPCs** (model and specs: _add details_)
- **Network:** Gigabit switch/router, DHCP (or static IPs)
- **Storage:** Built-in SSDs (recommend ≥ 256 GB)
- **USB drive:** 8 GB+ for Ubuntu installer

## 🔧 Software
- **OS:** Ubuntu Server **24.04.3 LTS**
- **Tools:** Rufus (Windows) or Balena Etcher (macOS/Linux) to create boot media
- **Kubernetes:** k3s (lightweight Kubernetes)

## 📝 Prerequisites
- BIOS access on each MiniPC (USB boot enabled; Secure Boot off if needed)
- Network connectivity to your LAN
- Admin access on your workstation to create a bootable USB

## 🚀 Quick Start
### 1) Install Ubuntu Server on each node
```bash
# Example steps (high-level)
# 1. Download ISO from ubuntu.com
# 2. Create bootable USB with Rufus/Etcher
# 3. Boot MiniPC from USB, follow installer
# 4. Set unique hostname per node (e.g., node1, node2, node3)
# 5. Configure static IPs or DHCP reservations
```

### 2) Configure Static IPs
```yaml
# Example netplan config
network:
  version: 2
  renderer: networkd
  ethernets:
    enp3s0:
      dhcp4: no
      addresses:
        - 192.168.1.101/24
      gateway4: 192.168.1.1
      nameservers:
        addresses:
          - 8.8.8.8
          - 1.1.1.1
```
Apply changes:
```bash
sudo netplan apply
```

### 3) Install k3s on Control Node
```bash
curl -sfL https://get.k3s.io | sh -
```
Check status:
```bash
sudo systemctl status k3s
```
Get join token:
```bash
sudo cat /var/lib/rancher/k3s/server/node-token
```

### 4) Join Worker Nodes
```bash
curl -sfL https://get.k3s.io | K3S_URL=https://<CONTROL_NODE_IP>:6443 K3S_TOKEN=<NODE_TOKEN> sh -
```

### 5) Verify Cluster
```bash
sudo k3s kubectl get nodes
```

## 📒 Documentation Index
- **Step 1:** OS install — _docs/step-01-install-ubuntu.md_
- **Step 2:** Static IPs — _docs/step-02-static-ips.md_
- **Step 3:** k3s setup — _docs/step-03-k3s-setup.md_
- **Step 4:** Deploy workloads — _docs/step-04-workloads.md_

## 🧪 Testing
- Ping between nodes
- SSH into each node
- Verify hostname, IP, and k3s cluster status

## 📦 Assets
- Thumbnail: `thumbnail_compressed.jpg` (YouTube and docs)
- Photos: _add your setup images to `images/`_
- Diagrams: _cluster architecture (forthcoming)_

## 🏷️ Tags
Ubuntu Server, 24.04.3, Kumrui MiniPC, k3s, Kubernetes, homelab, Linux, server

## 🔗 Useful Links
- Ubuntu Server download: https://ubuntu.com/download/server
- k3s docs: https://docs.k3s.io/

## 🤝 Contributing
Issues and PRs are welcome! Please follow conventional commit messages and include reproducible steps.

## 📄 License
MIT — see `LICENSE`.

---
*Last updated: 2025-12-06*

