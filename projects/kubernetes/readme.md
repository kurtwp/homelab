# Kubernetes on Mini PCs: Planning My Home Lab Cluster

When planning my home Kubernetes cluster, I wanted something affordable, power efficient, and capable enough to run a few containers and services reliably. After some research, I landed on three **Kamrui E1** mini PCs, each equipped with an **Intel N150 processor, 16GB of RAM, and a 512GB SSD**. 

Why this setup?

- **Performance**: The Intel N150 offers a good balance of speed and efficiency for lightweight home lab Kubernetes setup.
- **Memory**: 16GB per node gives me room to run multiple pods without hitting resource limits too quickly.
- **Storage**: With 512GB SSDs, I have fast local storage for container images, and logs.
- **Power**: These mini PCs sip power compared to full desktops or servers. The Kamrui mini PCs are great for running Kubernets node 24/7.
- **Cost**: At the time of this article the mini PCs cost $149 each on the Kamrui website, with free shipping and additonal $15 off.    

---
If you're looking to optimize your setup even further, use higher-spec mini PCs such as the Intel N97 or N150 models with 16GB RAM and at least 512GB SSDs for your control plane nodes. These machines handle tasks more efficiently and provide better performance.

For worker nodes, you can save a bit by going with Intel N95 mini PCs that come with 8GB RAM and, ideally, a 512GB SSD. While they’re slightly less powerful, they’re more than capable of running container workloads and the cost savings can add up if you're scaling your cluster.

Of course, there’s also the option to buy used equipment, which can offer more powerful specs such as higher core counts or ECC memory at a similar or even lower price. However, used gear often comes with higher power consumption and potential reliability concerns. For my needs, the Kamrui E1s struck the right balance between performance, efficiency, and cost.
