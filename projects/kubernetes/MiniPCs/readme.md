
# Kubernetes on Mini PCs: Planning My Home Lab Cluster

When planning my home Kubernetes cluster, I wanted something affordable, power efficient, and capable enough to run a few containers and services reliably. After some research, I landed on three **Kamrui E1** mini PCs, each equipped with an **Intel N150 processor, 16GB of RAM, and a 512GB SSD**. 

Why this setup?

- **Performance**: The Intel N150 isn’t a beast, but it’s plenty for a lightweight Kubernetes running in a home lab.
- **Memory**: 16GB per node gives me room to run multiple pods without hitting resource limits too quickly.
- **Storage**: With 512GB SSDs, I have fast SSD storage for container images, and logs.
- **Power**: These mini PCs sip power compared to full desktops or servers. The Kamrui mini PCs are great for running Kubernets node 24/7.
- **Cost**: $149 each (plus $15 off and free shipping when I bought them). Hard to beat.
  
<p align="center">
   <b>E1 Intel Twin Lake N150 Mini PC</b><br>
  <img src="https://github.com/kurtwp/homelab/blob/984ba311e2f0779b1e2d0f71ec9b41ac99aafa9a/projects/kubernetes/img/E1.png" alt="Kumrui Mini PC" style="width=80%;height=auto">
</p>
---
If you're looking to stay with INTEL CPUs you can tweak your setup even further, using higher spec mini PCs such as the Intel N97 or N150 models with 16GB RAM and at least 512GB SSDs for your control plane nodes. 

For worker nodes, you can save a few bucks by going with Intel N95 mini PCs that come with 8GB RAM and, ideally, a 512GB SSD. While they’re slightly less powerful, they’re more than capable of running container workloads and the cost savings can add up if you're scaling your cluster.

                                         Simialr AMD CPUs
                
            | Intel Model | AMD Equivalent   | Cores/Threads  | TDP       |
            |-------------|------------------|----------------|-----------|
            | N95         | Ryzen 5 5500U    | 6C / 12T       | 10–15 W   |
            | N97         | Ryzen 5 7430U    | 6C / 12T       | 15 W      |
            | N97         | Ryzen 7 5700U    | 8C / 16T       | 15-25 W   |
            | N150        | Ryzen 5 7530U    | 6C / 12T       |  15–28 W  |
            | N150        | Ryzen 7 5825U    | 8C / 16T       | 15–25 W   |

Of course, there’s also the option to buy used equipment, which can offer more powerful specs such as higher core counts or ECC memory at a similar or even lower price. However, used gear often comes with higher power consumption and potential reliability concerns. For my needs, the Kamrui E1s struck the right balance between performance, efficiency, and cost.
