network:                  # Level 0 (0 spaces)
  version: 2              # Level 1 (2 spaces)
  renderer: networkd      # Level 1
  ethernets:              # Level 1
    eth0:                 # Level 2 (4 spaces)
      dhcp4: false        # Level 3 (6 spaces)
      dhcp6: false        # Level 3
      addresses:          # Level 3
        - 192.168.2.8/24  # Level 4 (8 spaces)
      routes:             # Level 3
        - to: default     # Level 4 (8 spaces)
          via: 192.168.2.254 # Level 5 (10 spaces)
      nameservers:        # Level 3
        addresses:        # Level 4
          - 1.1.1.1       # Level 5 (10 spaces)
