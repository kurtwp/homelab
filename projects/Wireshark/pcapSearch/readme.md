# Searching though PCAP.

### If you have a few .pcap files that you generated while troubleshooting and need to look for a certain DID you can create a script that uses tshark to sarch it file.  
---
#### The first example sis using a bash script:
```bash
#!/bin/bash

read -p "Enter phone number to be searched: " phoneNumber
captureFiles='*.pcap'

outPutFile='outPutFile.txt'

for file in $captureFiles
do
	echo "Searching file: $file"
	echo " -------- File: $file" >> $outPutFile
	tshark -r $file -Y "sip contains $phoneNumber" >> $outPutFile
done
echo "Search has completed see file $outfile !"
```
