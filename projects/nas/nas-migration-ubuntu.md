# NAS Migration: Temporary Ubuntu Storage Setup

A guide for temporarily migrating ~2.2TB of NAS data to an Ubuntu 24.04 server with two 2TB drives before rebuilding both NAS systems.

---

## Situation

- **Source:** Two NAS servers with a total of ~2.2 TB of data
- **Temp storage:** Ubuntu 24.04 server with two 2TB drives
- **Goal:** Move data off NAS → rebuild NAS → move data back

---

## Part 1: Installing Ubuntu 24.04 Server

### What You'll Need

- Ubuntu 24.04 LTS Server ISO — download from [ubuntu.com/download/server](https://ubuntu.com/download/server)
- A bootable USB drive (8GB+) — use [Balena Etcher](https://etcher.balena.io/) or `dd` to write the ISO
- The server machine with both 2TB drives installed

---

### Step 1: Boot from USB

1. Insert the USB drive and power on the server
2. Enter the BIOS/UEFI boot menu (usually **F2**, **F11**, **F12**, or **DEL** on boot)
3. Set the USB drive as the first boot device
4. Save and reboot — the Ubuntu installer will load

---

### Step 2: Installer Language & Keyboard

- Select **English** (or your preferred language)
- Choose your keyboard layout
- Select **Ubuntu Server** (not the minimized version)

---

### Step 3: Network Configuration

- The installer will attempt DHCP automatically
- If you want a **static IP** (recommended for a server), select the interface → **Edit IPv4** → change to **Manual** and enter:
  - Subnet (e.g. `192.168.1.0/24`)
  - Address (e.g. `192.168.1.50`)
  - Gateway (e.g. `192.168.1.1`)
  - DNS (e.g. `8.8.8.8` or your router IP)

> 💡 A static IP makes it easier to SSH in and keeps the NAS transfer setup consistent.

---

### Step 4: Storage / Disk Layout

> ⚠️ This is the most important step. You only want Ubuntu on **one** drive — leave the second drive unconfigured for LVM setup later.

1. Select **Custom storage layout**
2. Select the **first drive** (e.g. `/dev/sda`) for the OS
3. Create the following partitions on `/dev/sda`:

| Partition | Size | Format | Mount |
|-----------|------|--------|-------|
| Boot partition | 2 GB | ext4 | `/boot` |
| Root partition | Remaining space | ext4 | `/` |

4. **Leave `/dev/sdb` completely unformatted and unpartitioned** — this will be used for LVM later along with the second drive
5. Confirm and proceed — the installer will warn about formatting, confirm to continue

---

### Step 5: Profile Setup

- Enter your **name**, **server hostname** (e.g. `nas-temp`), **username**, and **password**
- Choose a strong password — this account will have sudo access

---

### Step 6: SSH Setup

- Select **Install OpenSSH server** ✅
- This lets you manage the server remotely without a monitor/keyboard attached

---

### Step 7: Featured Snaps

- Skip all optional snaps — you don't need them for this use case
- Select **Done** and let the installation complete

---

### Step 8: Post-Install First Boot

Once the server reboots, SSH in from another machine:

```bash
ssh youruser@192.168.1.50
```

Then run a full system update:

```bash
sudo apt update && sudo apt upgrade -y
sudo reboot
```

---

### Step 9: Identify Your Drives

After reboot, confirm which drives are which before setting up LVM:

```bash
lsblk
```

Example output:
```
NAME   MAJ:MIN RM  SIZE RO TYPE MOUNTPOINTS
sda    8:0      0  2TB  0  disk

├─sda2          ...      /boot
└─sda3          ...      /
sdb    8:16     0  2TB  0  disk        ← empty, ready for LVM
```

> 💡 If you have a third drive or are unsure of device names, use `sudo fdisk -l` for full detail.

---

## Part 2: Drive Configuration Options

Since I have two 2TB drives and 2.2TB of data, **RAID-1 (mirroring) is not possible** — However mirror was not in the plans
as I am moving 1.1TB from two NAS servers to the temp file server as I rebuild them both.  

### Option A: Two Separate Mount Points
**Prepare Drive B (sdb)**<br>
```bash
# Create the volume group and logical volume
sudo vgcreate backup_vg /dev/sdb
sudo lvcreate -l 100%FREE -n backup_lv backup_vg

# Format it
sudo mkfs.ext4 /dev/backup_vg/backup_lv

# Mount the new drive
sudo mkdir -p /mnt/disk2
sudo mount /dev/backup_vg/backup_lv /mnt/disk2
```
**Create a folder on Drive A (sda3)**
```bash
sudo mkdir -p /mnt/disk1
sudo chown $USER:$USER /mnt/disk1 /mnt/disk2
```
---

## Part 3: Transferring Data from the NAS

**Rsync is the recommended tool:**

```bash
# Basic transfer
rsync -avhP --stats user@nas-ip:/share/ /mnt/nas_backup/

# With checksum verification (slower but confirms integrity)
rsync -avhPc --stats user@nas-ip:/share/ /mnt/nas_backup/
```

### Rsync Flag Reference

| Flag | Meaning |
|------|---------|
| `-a` | Archive mode (preserves permissions, timestamps, symlinks) |
| `-v` | Verbose output |
| `-h` | Human-readable sizes |
| `-P` | Show progress + resumable if interrupted |
| `-c` | Checksum verification (recommended for peace of mind) |

### Mounting the NAS Share First (if rsync isn't available on NAS)

**SMB/Samba:**
```bash
apt install cifs-utils
mount -t cifs //nas-ip/share /mnt/nas_source -o username=youruser
```

**NFS:**
```bash
apt install nfs-common
mount -t nfs nas-ip:/share /mnt/nas_source
```

Then run rsync against the mounted share:
```bash
rsync -avhP /mnt/nas_source/ /mnt/nas_backup/
```

---

## Verify Before You Wipe the NAS

> ⚠️ **Do not skip this step.** Verify data integrity before touching the NAS.

```bash
# Check total size transferred
du -sh /mnt/nas_backup/

# Generate checksums of all files (save this somewhere safe!)
find /mnt/nas_backup -type f -exec md5sum {} \; > /home/youruser/backup_checksums.txt
```

> 💡 Store `backup_checksums.txt` somewhere other than the backup drives — email it to yourself or copy it to a USB stick.

---

## Persist the Mount Across Reboots

Add to `/etc/fstab` so the LVM volume auto-mounts if the server reboots mid-transfer:

```
/dev/backup_vg/backup_lv  /mnt/nas_backup  ext4  defaults  0  2
```

---

## Key Recommendations

1. **Use LVM (Option A)** — the simplicity of a single mount point is worth it for a temporary migration
2. **Run rsync with `-c`** for checksum verification on the initial transfer
3. **Verify `du -sh` totals match** between source and destination before touching the NAS
4. **Don't rush** — let rsync finish completely and verify before rebuilding
5. **Keep the checksum file** somewhere outside the backup drives

---

## Migration Steps Summary

1. Set up LVM → format → mount
2. Mount/connect the NAS share
3. Rsync NAS → Ubuntu temp storage
4. Verify checksums and sizes
5. Rebuild the NAS
6. Rsync Ubuntu → rebuilt NAS
7. Verify again — done!
