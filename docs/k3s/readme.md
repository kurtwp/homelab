# ☸️ k3s CLI Cheat Sheet

A concise reference guide for managing your Kubernetes cluster. When using these commands, remember to replace placeholders like `<ns>`, `<pod>`, and `<name>` with your actual values.

> **Tip:** If `kubectl` isn't in your PATH on your k3s node, prepend `k3s` (e.g., `k3s kubectl get nodes`).

---

## 📂 Table of Contents
1. [Basics](#basics)
2. [Workloads and Status](#workloads-and-status)
3. [Logs and Debugging](#logs-and-debugging)
4. [Resource Usage](#resource-usage)
5. [Services and Networking](#services-and-networking)
6. [Health Probes](#health-probes)
7. [Storage](#storage)
8. [System Diagnostics](#system-diagnostics)
9. [Namespace Quick Checks](#namespace-quick-checks)
10. [Efficiency Tips (Aliases)](#efficiency-tips-aliases)

---

## <a id="basics"></a> Basics
* **Cluster Info**: `kubectl cluster-info` — Shows control plane endpoints and basic cluster info.
* **Version**: `kubectl version --short` — Prints client/server Kubernetes versions in short form.
* **Node Details**: `kubectl get nodes -o wide` — Lists nodes with extra details like IP, OS, kernel, and roles.
* **Namespaces**: `kubectl get ns` — Lists all namespaces.

## <a id="workloads-and-statu"></a> Workloads and Status
* **All Pods**: `kubectl get pods -A` — Lists all pods across all namespaces.
* **System Pods**: `kubectl get pods -n kube-system -o wide` — Lists kube-system pods with node IP and name.
* **Resources**: `kubectl get deploy,ds,sts -A` — Lists Deployments, DaemonSets, and StatefulSets across all namespaces.
* **Pod Details**: `kubectl describe pod <pod> -n <ns>` — Detailed info and events; useful for debugging pending or crashloop issues.
* **Rollout Status**: `kubectl rollout status deploy/<name> -n <ns>` — Watches rollout progress until completion or failure.
* **Recent Events**: `kubectl get events -A --sort-by=.lastTimestamp` — Shows recent cluster events ordered by time.

## <a id="logs-and-debugging"></a> Logs and Debugging
* **Standard Logs**: `kubectl logs <pod> -n <ns>` — Prints logs from the first container in a pod.
* **Stream Logs**: `kubectl logs -f <pod> -n <ns>` — Streams logs (follow) for live troubleshooting.
* **Specific Container**: `kubectl logs <pod> -n <ns> -c <container>` — Gets logs from a specific container in a multi-container pod.
* **Interactive Shell**: `kubectl exec -it <pod> -n <ns> -- sh` — Opens an interactive shell inside the container.

## <a id="resources-usage"></a> Resource Usage (metrics-server)
* **Node Usage**: `kubectl top nodes` — Shows CPU/memory usage per node.
* **Pod Usage**: `kubectl top pods -A` — Shows CPU/memory usage per pod across all namespaces.

## Services and Networking
* **List Services**: `kubectl get svc -A` — Lists Services in all namespaces (ClusterIP, NodePort, LoadBalancer).
* **Service Details**: `kubectl describe svc <svc> -n <ns>` — Detailed Service info including selectors, ports, and endpoints.
* **Pod IPs**: `kubectl get endpoints -A` — Shows the pod IPs behind Services.
* **Ingress**: `kubectl get ingress -A` — Lists Ingress resources (host rules and backends).

## Health Probes (API Server)
* **Readiness**: `kubectl get --raw /readyz` — Raw readiness check of the API server (OK if ready).
* **Liveness**: `kubectl get --raw /livez` — Raw liveness check of the API server (OK if alive).
* **Health**: `kubectl get --raw /healthz` — General health endpoint of the API server.

## Storage
* **PVCs**: `kubectl get pvc -A` — Lists PersistentVolumeClaims across namespaces.
* **PVs**: `kubectl get pv` — Lists PersistentVolumes available/used in the cluster.
* **PVC Details**: `kubectl describe pvc <name> -n <ns>` — Detailed PVC info including requested size and bound PV.

## System Diagnostics
* **Node Info**: `kubectl describe node <node>` — Detailed node info (capacity, conditions, taints).
* **CoreDNS Placement**: `kubectl get pods -n kube-system -o wide | grep coredns` — Finds CoreDNS pods and their node placement.
* **K3s Server Logs**: `sudo journalctl -u k3s -f` — Follows logs for the k3s server service on the control plane.
* **K3s Agent Logs**: `sudo journalctl -u k3s-agent -f` — Follows logs for the k3s agent service on worker nodes.

## Namespace Quick Checks
### MetalLB
* **Resources**: `kubectl get pods,svc -n metallb-system`.
* **IP Pools**: `kubectl get ipaddresspool,l2advertisement -n metallb-system`.
* **Controller Logs**: `kubectl logs -n metallb-system deploy/controller`.
* **Speaker Logs**: `kubectl logs -n metallb-system ds/speaker`.

### AdGuard
* **Resources**: `kubectl get pods,svc,pvc -n adguard`.
* **LB Service**: `kubectl get svc adguard-lb -n adguard -o wide` — Shows the external IP assigned by MetalLB.

## Efficiency Tips (Aliases)
Add these to your `~/.bashrc` or `~/.zshrc` file to speed up your workflow:

```bash
# Basic alias
alias k='kubectl'

# Common context aliases
alias kgp='kubectl get pods'
alias kgs='kubectl get svc'
alias kgd='kubectl get deploy'
alias kdes='kubectl describe'
alias klog='kubectl logs'

# Auto-completion (Highly recommended)
source <(kubectl completion bash)
complete -F __start_kubectl k
