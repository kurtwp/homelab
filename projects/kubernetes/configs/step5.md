## Install Traefix 
```bash
kub@kubcontrol:~/.kube$ helm repo add traefik https://traefik.github.io/charts
helm repo update
"traefik" already exists with the same configuration, skipping
Hang tight while we grab the latest from your chart repositories...
...Successfully got an update from the "metallb" chart repository
...Successfully got an update from the "traefik" chart repository
Update Complete. ⎈Happy Helming!⎈
kub@kubcontrol:~/.kube$ kubectl create namespace traefik
namespace/traefik created
kub@kubcontrol:~/.kube$ helm install traefik traefik/traefik --namespace traefik
NAME: traefik
LAST DEPLOYED: Fri Dec 26 21:51:44 2025
NAMESPACE: traefik
STATUS: deployed
REVISION: 1
TEST SUITE: None
NOTES:
traefik with docker.io/traefik:v3.6.5 has been deployed successfully on traefik namespace!

traefik with docker.io/traefik:v3.6.5 has been deployed successfully on traefik namespace!
kub@kubcontrol:~/.kube$ kubectl get svc -n traefik
NAME      TYPE           CLUSTER-IP    EXTERNAL-IP    PORT(S)                      AGE
traefik   LoadBalancer   10.43.41.48   192.168.2.53   80:31325/TCP,443:31885/TCP   95s
kub@kubcontrol:~/.kube$

# WIll force traefix to use the range of IP.
kubectl annotate service traefik -n traefik metallb.universe.tf/address-pool=general-pool --overwrite
kub@kubcontrol:~/.kube$ kubectl get svc -n traefik
NAME      TYPE           CLUSTER-IP    EXTERNAL-IP    PORT(S)                      AGE
traefik   LoadBalancer   10.43.41.48   192.168.2.20   80:31325/TCP,443:31885/TCP   5m37s
kub@kubcontrol:~/.kube$
kubctl apply -f dashbraod.yaml

```

## Update /etc/hosts file
```bash
192.168.2.20 traefik.home.arpa
```

## Access Traefik
```bash
http://traefik.home.arpa
```

## MetalLB .yaml file

## Traefik dashbroad.yaml
```bash
apiVersion: traefik.io/v1alpha1
kind: IngressRoute
metadata:
  name: traefik-dashboard
  namespace: traefik
spec:
  entryPoints:
    - web
  routes:
    - match: Host(`traefik.home.arpa`) && (PathPrefix(`/dashboard`) || PathPrefix(`/api`))
      kind: Rule
      services:
        - name: api@internal
          kind: TraefikService
```
