# NAS Migration: Temporary Ubuntu Storage Setup

A guide for temporarily migrating ~2.5TB of NAS data to an Ubuntu 24.04 server with two 2TB drives before rebuilding the NAS.

---

## Situation

- **Source:** NAS with ~2.5 TB of data
- **Temp storage:** Ubuntu 24.04 server with two 2TB drives
- **Goal:** Move data off NAS → rebuild NAS → move data back

---

## Drive Configuration Options

Two 2TB drives and 2.5TB of data, **RAID-1 (mirroring) is not possible** — there isn't enough total space:

### Option A: LVM (Logical Volume Manager) — Recommended

Combine both 2TB drives into a single **4TB logical volume**. Simple, flexible, and built into Ubuntu.

```bash
# Install LVM (usually pre-installed)
apt install lvm2

# Create physical volumes
pvcreate /dev/sdb /dev/sdc

# Create a volume group
vgcreate backup_vg /dev/sdb /dev/sdc

# Create a logical volume spanning both drives
lvcreate -l 100%FREE -n backup_lv backup_vg

# Format and mount
mkfs.ext4 /dev/backup_vg/backup_lv
mkdir -p /mnt/nas_backup
mount /dev/backup_vg/backup_lv /mnt/nas_backup
```

**Pro:** Single 4TB mount point, easy to manage.  
**Con:** If one drive fails, you lose everything — but since this is temporary, that's acceptable.

### Option B: Two Separate Mount Points

Mount each drive independently (`/mnt/disk1`, `/mnt/disk2`) and manually split the data across them. More work, but no single point of failure across both drives.

---

## Transferring Data from the NAS

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
