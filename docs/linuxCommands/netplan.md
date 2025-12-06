
# Netplan Configuration Guide

This guide explains how to configure Netplan with proper indentation, routes, and DNS settings.

## Indentation Rules
- Use **spaces only** (never tabs).
- Each level increases by **2 spaces**.
- Lists (`- item`) are indented under their parent key.

### Visual Hierarchy Diagram
*(Insert diagram here)*

---

## Example Configuration (with YAML syntax highlighting)
```yaml
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
```

---

## Explanation of Sections
- **network:** Root key for Netplan configuration.
- **version:** Netplan config version (always `2`).
- **renderer:** Backend (`networkd` for servers, `NetworkManager` for desktops).
- **ethernets:** Defines Ethernet interfaces.
- **eth0:** Interface name (replace with your actual NIC name).
- **dhcp4/dhcp6:** Enable or disable DHCP for IPv4/IPv6.
- **addresses:** Static IP addresses list.
- **routes:** Routing configuration (default route replaces deprecated `gateway4`).
- **nameservers:** DNS configuration.

---

## How to Apply
```bash
cd /etc/netplan
sudo cp 50-cloud-init.yaml 50-cloud-init.org (backup of the orginal .yaml file)
sudo vi 50-cloud-init.yaml
sudo netplan apply
```

---

## Notes
- Use `to: default` or `to: 0.0.0.0/0` for IPv4 default route.
- For IPv6, use `to: ::/0`.
