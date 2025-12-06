Ping a range of IPs

for /L %i in (1,1,254) do ping -n 1 192.168.2.%i | find "Reply"

replace the 192.168.2 with your network IP address range

Replace 192.168.1 with the first three octets of your network's IP address range. 
The (1,1,254) part of the command specifies the start, step, and end of the loop, respectively. You can change these to ping a different range. 
ping -n 1 sends a single ping to each address. 
| find "Reply" filters the output to show only the IP addresses that responded. 

