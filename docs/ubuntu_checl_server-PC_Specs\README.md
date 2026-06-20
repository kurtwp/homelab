# Ubuntu Check Server/PC Specs
Below is what can be considered some of the best overall commands to list out server and PC on Ubuntu.

## Comprehensive Hardware Overviews
`sudo lshw -short`:  Generates a clean, compact list of your hardware paths, classes, and descriptions in a table format.  
`sudo lshw -html > hardware.html`: Exports your server’s entire hardware configuration into an easy-to-read HTML report.  
`sudo dmidecode`: : Dumps the raw Desktop Management Interface (DMI/SMBIOS) data directly from your server's BIOS, which is ideal for gathering motherboards and hardware component details.  

## Target Specific Server Components
| Componet | Command | Desciption |
| --- | --- | --- |
| CPU | lscpu | Complete architecture details, core counts, and speeds.|
| RAM| sudo dmidecode -t memory | Exact stick size, type, maximum supported capacity, and slot layout. |
| Storage | lsblk | A hierarchical layout of all attached physical drives and partitions.|
| PCI Devices | lspci | Graphics cards, NVMe controllers, and physical network adapters. |
| USB Devices | lsusb | All connected USB controllers and external peripherals |
 
## Third-Party Diagnostics  

If you need highly descriptive, color-coded summaries, you can install the inxi utility.  
Run `sudo apt update && sudo apt install inxi -y`  
Excute `inxi -Fxz`  to see a full, filtered overview that masks secure data like MAC and IP addresses.  
To see more option for the **inxi** command run `man inxi` on the command line. 
