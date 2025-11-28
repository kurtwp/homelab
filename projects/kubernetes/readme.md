# Kubernetes Home Lab on Kumrui MiniPCs

> **Series — Step 1:** Install Ubuntu Server 24.04.3 on three Kumrui MiniPCs

## � Project Overview
This repository documents the process of building a small **Kubernetes cluster** using **three Kumrui MiniPCs**. The series starts with installing **Ubuntu Server 24.04.3 LTS** on each node and progresses through cluster prerequisites, Kubernetes installation, and deploying workloads.

## 📺 Watch the Full Tutorial
[![Watch on YouTube](https://i9.ytimg.com/vi_webp/UzL1Ee14wzo/mqdefault.webp?v=692a0ae6&sqp=CNCaqMkG&rs=AOn4CLCTwT-_7LBw2Ie8iUXdMlib9kUOxw)](https://youtu.be/UzL1Ee14wzo)

## � Repository Structure
```
.
├── images/                # Screenshots, diagrams
├── scripts/               # Helper scripts for setup
├── configs/               # Cloud-init, netplan, kube configs
├── MiniPC/                # Brief overview of the MiniPC Kumrui
└── README.md              # You are here
```

## ✅ Goals
- Learn and document a reproducible home lab Kubernetes setup
- Keep costs and power usage low using MiniPCs
- Use Ubuntu Server LTS for stability and support

## �️ Hardware
- **3× Kumrui MiniPCs** (E1 Intel 150, 16 GB, 512 GB)
- **Network:** Inital install DHCP then changing to Static IPs
- **Storage:** Built-in SSDs (recommend ≥ 256 GB)
- **USB drive:** 8 GB+ for Ubuntu installer (Using Ventoy)

## � Software
- **OS:** Ubuntu Server **24.04.3 LTS**
- **Tools:** Using Ventoy but you can use Rufus (Windows) or Balena Etcher (macOS/Linux) to create boot media
- **Kubernetes:** Kubeadm (planned), container runtime (containerd)
<!--
## � Prerequisites
- BIOS access on each MiniPC (USB boot enabled; Secure Boot off if needed)
- Network connectivity to your LAN
- Admin access on your workstation to create a bootable USB

## � Quick Start
### 1) Install Ubuntu Server on each node
```bash
# Example steps (high-level)
# 1. Download ISO from ubuntu.com
# 2. Create bootable USB with Rufus/Etcher
# 3. Boot MiniPC from USB, follow installer
# 4. Set unique hostname per node (e.g., node1, node2, node3)
# 5. Configure static IPs or DHCP reservations
```

### 2) Basic post-install
```bash
# Update packages
sudo apt update && sudo apt upgrade -y

# Install essentials
sudo apt install -y net-tools curl git

# (Optional) set static IP via netplan
sudo nano /etc/netplan/01-netcfg.yaml
sudo netplan apply
```

### 3) Prep for Kubernetes (coming in Step 2)
```bash
# Disable swap (required by kubeadm)
sudo swapoff -a
sudo sed -i '/ swap / s/^/#/' /etc/fstab

# Load necessary modules
cat <<'EOF' | sudo tee /etc/modules-load.d/k8s.conf
overlay
br_netfilter
EOF
sudo modprobe overlay
sudo modprobe br_netfilter

# Sysctl settings
cat <<'EOF' | sudo tee /etc/sysctl.d/99-kubernetes-cri.conf
net.bridge.bridge-nf-call-iptables = 1
net.ipv4.ip_forward = 1
net.bridge.bridge-nf-call-ip6tables = 1
EOF
sudo sysctl --system
```

## � Documentation Index
- **Step 1:** OS install — _this README_
- **Step 2:** Kubernetes prerequisites — _docs/step-02-prereqs.md_ (TBD)
- **Step 3:** Initialize control plane — _docs/step-03-control-plane.md_ (TBD)
- **Step 4:** Join worker nodes — _docs/step-04-workers.md_ (TBD)
- **Step 5:** Deploy sample workload — _docs/step-05-workloads.md_ (TBD)

## � Testing
- Ping between nodes
- SSH into each node
- Verify hostname, IP, and package updates
-->
## � Assets
- Thumbnail: `thumbnail_compressed.jpg` (YouTube and docs)
- Photos: _add your setup images to `images/`_
- Diagrams: _cluster architecture (forthcoming)_

## �️ Tags
Ubuntu Server, 24.04.3, Kumrui MiniPC, Kubernetes, kubeadm, home lab, Linux, server, containerd

## � Useful Links
- Ubuntu Server download: https://ubuntu.com/download/server
- Kumrui MiniPC Specs: https://kamrui.store/products/kamrui-e1-twin-lake-n150
- Kubernetes docs: https://docs.k3s.io/

## � Contributing
Issues and PRs are welcome! Please follow conventional commit messages and include reproducible steps.

## � License
MIT — see `LICENSE`.

---
*Last updated: 2025-11-28*

