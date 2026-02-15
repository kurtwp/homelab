# Step 4: Installing MetalLB k3s on Kumrui MiniPCs
MetalLB is a load balancer implementation for bare-metal Kubernetes clusters. If you’re running **K3s** without a cloud provider, MetalLB gives you the ability to assign external IPs to services of type `LoadBalancer`. This guide walks through installing MetalLB, configuring IP pools, and testing with a sample deployment.
> [!Note]
> [Step 5](projects/kubernetes/configs/step5.md) will illustrate the steps needed to install reinstall **Traefik**.
---
<p>
 <strong>ServiceLB</strong> is the default load balancer that comes pre-installed with K3s, designed for users who want external connectivity without manual configuration. It functions by deploying a "proxy" pod as a daemon set across every node in your cluster; when traffic hits a node's physical IP address on a specific service port, this proxy pod intercepts the request and redirects it to the appropriate application pod. While it offers the major advantage of working immediately out of the box with zero setup, it does not provide unique <strong>Virtual IPs</strong> for your services. Instead, it relies entirely on the existing IP addresses of your nodes, which can be inefficient because it leads to port conflicts. If one service occupies port 80, no other LoadBalancer service can use that same port across the nodes.
</p>
<p>
 <strong>MetalLB</strong> is an advanced alternative to ServiceLB, serving as a dedicated network load balancer that manages a pool of distinct IP addresses. Instead of relying on your cluster's node IPs, MetalLB uses its "Speaker" pods to assign unique virtual IPs to your local network using standard protocols. This allows every service, such as Traefik, Adguard, to have its own dedicated IP address while still using common ports as 80 or 443, effectively mimicking how load balancers behave in a cloud environment. While it requires manual configuration through <strong>IPAddressPools</strong> and <strong>L2Advertisements</strong>, it eliminates the port conflicts inherent in ServiceLB and provides a cleaner, more scalable way to expose services to your local network.
</p>

[![Watch on YouTube](https://img.youtube.com/vi/uDBpPI_tz4Q/maxresdefault.jpg)](https://youtu.be//uDBpPI_tz4Q)

## ✅ Step 1: Install K3s Without Traefik and ServiceLB

Start by installing K3s, disabling the default Traefik and ServiceLB components:

```bash
curl -sfL https://get.k3s.io | INSTALL_K3S_EXEC="server --disable traefik --disable servicelb" sh -
```

 ###v Confirm ServiceLB disabled
 ```bash
kubectl get pods -n kube-system | grep svclb
```
After installation, configure `kubectl`:

```bash
mkdir -p ~/.kube
sudo cp /etc/rancher/k3s/k3s.yaml ~/.kube/config
sudo chown $(id -u):$(id -g) ~/.kube/config
chmod 600 ~/.kube/config
export KUBECONFIG=~/.kube/config
echo "export KUBECONFIG=~/.kube/config" >> ~/.bashrc
```
### Verify your node:

```bash
kubectl get node  # Will return nothing
```

***
Once you have K3s installed on the control node, please take a look at **Step 3** to complete the K3s install on the worker nodes.

---

## ✅ Step 2: Install Helm
MetalLB is deployed via Helm, so install Helm first:

```bash
curl https://raw.githubusercontent.com/helm/helm/main/scripts/get-helm-3 | bash
```

***

## ✅ Step 3: Add MetalLB Helm Repository and Install

Add the MetalLB chart repository and install MetalLB in its own namespace:

```bash
helm repo add metallb https://metallb.github.io/metallb
helm repo update
helm install metallb metallb/metallb --namespace metallb-system --create-namespace
```

Check that the pods are running:

```bash
kubectl get pods -n metallb-system
```
You should see `metallb-controller` and `metallb-speaker` in `Running` state.
```bash
kub@control:~$ kubectl get pods -n metallb-system
NAME                                  READY   STATUS    RESTARTS      AGE
metallb-controller-7bd5848b94-vz5q8   1/1     Running   2 (18h ago)   20h
metallb-speaker-fhpb8                 4/4     Running   8 (18h ago)   20h
```
***

## ✅ Step 4: Configure IP Address Pools and L2 Advertisement

Create a configuration file `metallb-config.yaml`:
```yaml
apiVersion: metallb.io/v1beta1
kind: IPAddressPool
metadata:
  name: general-pool
  namespace: metallb-system
spec:
  addresses:
  - 192.168.2.20-192.168.2.29  #Update with your IP range
---
apiVersion: metallb.io/v1beta1
kind: IPAddressPool
metadata:
  name: adguard-pool
  namespace: metallb-system
spec:
  addresses:
  - 192.168.2.53/32  # Specifically for AdGuard Update with your IP
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
Apply the configuration:
```bash
kubectl apply -f metallb-config.yaml
```
Verify resources:

```bash
kubectl get ipaddresspool -n metallb-system
kubectl get l2advertisement -n metallb-system
```

***
## ✅ Step 5: Test MetalLB With a Sample Deployment

Create a simple NGINX deployment and expose it as a LoadBalancer:

```bash
kubectl create deployment web-test --image=nginx
kubectl expose deployment web-test --port=80 --type=LoadBalancer
```

Check the service:

```bash
kubectl get svc web-test
```

You should see an **EXTERNAL-IP** assigned from your configured pool (e.g., `192.168.2.53`).

Finally, clean up:

```bash
kubectl delete service web-test
kubectl delete deployment web-test
```

***

## ✅ Common Pitfalls

*   **apiVersion errors**: Ensure each resource in `metallb-config.yaml` starts with `apiVersion: metallb.io/v1beta1`.
*   **IP ranges**: Use valid ranges.
*   **Helm re-installation errors**: If you see `cannot re-use a name that is still in use`, the release already exists—use `helm uninstall metallb` before reinstalling.

***

## � Conclusion

With MetalLB configured, your bare-metal Kubernetes cluster can now assign external IPs to services, making it easier to expose workloads without relying on NodePorts or manual ingress setups.

***
[Back](../readme.md)

## Additional Commands
```bash 
kubectl apply -f metallb-config.yaml
kubectl get pods -n metallb-system
**kubectl get ipaddresspool -n metallb-system**
kubectl get l2advertisement -n metallb-system
**kubectl get ipaddresspool -n metallb-system general-pool -o yaml**
kubectl get l2advertisement -n metallb-system
```










