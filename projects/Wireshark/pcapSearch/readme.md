# Searching though PCAP.

### To automate searching for a specific DID across all .pcap files generated during troubleshooting, you can create a script that calls tshark to process each file in the script's execution directory.
---
The first example uses a bash script: 
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
The second example uses a Python script:
```python
	import os
	import subprocess
	
	outPut = "outFile.txt"
	
	# Get phone number to search
	phoneNumber = input("Enter phone number to be searched: ")
	
	
	
	for x in os.listdir():
	        if x == outPut:
	                print("Found file outFile.txt and removing:", x)
	                os.remove("outFile.txt")
	i = 0
	with open(outPut, 'w') as f:
	        for line in os.listdir():
	                if line.endswith(".pcap"):
	                        print(f"Searching file: {line}")
	                        f.write(f"------------------ File: {line}\n")
	                        command = ["tshark", "-r", line, "-Y", f"sip contains {phoneNumber}"]
	                        result = subprocess.run(command, capture_output=True, text=True)
	                        f.write(result.stdout)
	                        i += 1
	print(f"{i} File Searched!")
	print("Calls can be found in file: " + outPut)
```
---
The above examples demonstrate searching for DIDs in PCAP files using tshark (which requires installation on your system) via Bash and Python. As an alternative, users without tshark can achieve similar results by combining **tcpdump** with **grep**. 

``` 
tcpdump -r <file> -A 'udp port 5060' | grep -i '<phoneNumber>
```
---
See if you can incorporate the tcpdump command into the scripts above.

**NOTE**: The tshark command uses **CONTAINs**, which acts like a wildcard search. When running either this Python script or the bash script, the **CONTAINs** parameter will allow the command to search across most SIP fields. Not just DIDs.  
