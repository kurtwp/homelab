

## Virual Box -- oonly 

/run/flannel/subnet.env file disappearing after a VirtualBox reboot. To stop this from happening again, need to create a simple script that puts that file back automatically every time the VM starts.

```bash
sudo tee /etc/systemd/system/k3s-network-fix.service <<EOF
[Unit]
Description=Fix Flannel subnet.env for K3s
Before=k3s.service

[Service]
Type=oneshot
ExecStartPre=/usr/bin/mkdir -p /run/flannel
ExecStart=/bin/sh -c 'echo "FLANNEL_NETWORK=10.42.0.0/16\nFLANNEL_SUBNET=10.42.0.1/24\nFLANNEL_MTU=1450\nFLANNEL_IPMASQ=true" > /run/flannel/subnet.env'

[Install]
WantedBy=multi-user.target
EOF

sudo systemctl enable k3s-network-fix
```

(Remember to do the same on kwk1 and kwk2, but change the 0.1/24 to 1.1/24 and 2.1/24 respectively.)
