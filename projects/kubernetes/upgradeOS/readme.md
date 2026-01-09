## Updating Ubuntu OS Steps:

Back up your K3s data: As a general safety measure, ensure you have a backup of your K3s cluster data, especially if you are using an external database. 

Consider potential service interruptions: While pods generally continue running even when the K3s API server is briefly unavailable, the manual drain and uncordon process is best for sensitive workloads.

Update one node at a time (if in a multi-node cluster): This ensures high availability of your Kubernetes workloads by allowing the other nodes to handle the traffic while one is being updated.

Drain and cordon the node first: Before applying updates that might cause a restart (like kernel updates), you should gracefully remove the node from the Kubernetes cluster schedule to prevent new pods from being scheduled on it. You can do this with kubectl drain <node-name>.

Perform updates via apt: Standard system updates are applied using the usual Ubuntu package management commands:
```bash
sudo apt update
sudo apt upgrade -y
```

Reboot the node if necessary

Uncordon the node after it comes back up: Once the node is back online and K3s services are running, uncordon it to allow it to accept new pods again: kubectl uncordon <node-name>.
