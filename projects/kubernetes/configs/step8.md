# 🏠 Homelab Dashboard: Homepage on k3s

This guide covers the deployment of [Homepage](https://gethomepage.dev) on a **k3s** cluster, integrated with **Longhorn** for storage and **MetalLB** for a dedicated static IP.

## 🌐 Environment Overview
The dashboard is configured to monitor and link to the following existing services in the homelab:


| Service | IP Address | Role |
| :--- | :--- | :--- |
| **Traefik** | `192.168.2.20` | Ingress Controller |
| **Longhorn** | `192.168.2.21` | Persistent Storage |
| **Uptime Kuma** | `192.168.2.22` | Service Monitoring |
| **Homepage** | `192.168.2.23` | Dashboard (New) |
| **AdGuard Home** | `192.168.2.53` | Network Ad-blocking |

---

## 🚀 Installation Steps

### 1. Create the Deployment Configuration
We use a single YAML file to handle the PersistentVolumeClaim (PVC), the Deployment, and the LoadBalancer Service.

1. Create a file named `homepage-deployment.yaml`.
2. Apply it to your cluster:
   ```bash
   kubectl apply -f homepage-deployment.yaml
