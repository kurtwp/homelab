# Ubuntu 26.04 to Synology DS1522+ Rsync Backup Guide
[![Build Status](https://img.shields.io/badge/Status-Operational-brightgreen)](your_ci_link)
[![Version](https://img.shields.io/badge/Version-v1.0-blue)](LICENSE)

<p align="center">
  <img src="img/ub_sys_rsy.png" alt="Image" width="60%">
</p>

## 📜 Overview
This project goes over the scripts and configuration needed to establish a daily backup from a local Ubuntu server (26.04) as the source, to a Synology DS1522+ as the destination. The project uses `rsync` over an SSH tunnel on non standard port such as 8888 to ensure secure, incremental transfer of data.  The automation uses a bash script that is ran by a CRON JOB once a day.  

## ⚙️ Architecture Flow Diagram

```mermaid
graph TD
    A[Ubuntu Server: Source Data] -->|1. SSH Key Auth| B(SSH Tunnel on Port 8888)
    B --> C{Synology NAS (kurtwp)}
    C --> D[Destination Folder]
    style A fill:#eef,stroke:#333,stroke-width:2px
    style C fill:#ffe,stroke:#f99,stroke-width:2px

    subgraph Backup Process
        A -- rsync execution --> B
    end
```
