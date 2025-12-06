


## Step 2: Adding Static IPs to Ubuntu Server on Kumrui MiniPCs

## Overview
In **Step 1**, we installed **Ubuntu Server 24.04.3 LTS** on three Kumrui MiniPCs. Now, in **Step 2**, we’ll configure **static IP addresses** for each node. This ensures consistent networking for our upcoming Kubernetes cluster setup.
> [!Note]
> [Go to Resorces](#resources) below for indepth ionformation pretaiing the the commands being used on this page. 
---

## Why Static IPs?
Kubernetes nodes need predictable IP addresses for:
- Cluster communication
- Node discovery
- Avoiding DHCP changes that break connectivity

---

## Prerequisites
- Ubuntu Server installed on all nodes
- SSH access or physical access to each MiniPC
- IP plan ready (e.g., `192.168.2.8`, `192.168.2.9`, `192.168.2.10`)

---

## Steps to Configure Static IPs

### 1. Identify Network Interface
Run:
```bash
ip addr
````

Look for your primary interface (e.g., `enp1s0`).

***

### 2. Identify Network Default Gateway
Run:
```bash
ip route
````
***

### 3. Edit Netplan Configuration

Open the netplan config file:

```bash
sudo vi /etc/netplan/50-cloud-init.yaml
```

Example configuration:

```yaml
network:
  version: 2
  ethernets:
    enp1s0:
      dhcp4: false
      addresses:
        - 192.168.2.8/24
      gateway4: 192.168.2.254
      nameservers:
        addresses:
          - 8.8.8.8
          - 1.1.1.1
```

***

### 3. Apply Changes

```bash
sudo netplan apply
```

Verify:

```bash
ip a
ping 8.8.8.8
```

***

## Repeat for All Nodes

Assign unique IPs:

*   Node 1: `192.168.2.10`   Worker Node 2
*   Node 2: `192.168.2.9`    Worker Node 1
*   Node 3: `192.168.2.8`    Control Plane

***

## Next Steps

In **Step 3**, we’ll prepare these nodes for Kubernetes by disabling swap, configuring kernel modules, and installing container runtime.

***

## <a id="resources"></a>  Resources

*   Netplan Documentation
*   Ubuntu Networking Guide

***

*Stay tuned for Step 3: Kubernetes prerequisites!*

