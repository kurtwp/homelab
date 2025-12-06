Ping a range of IPs

for /L %i in (1,1,254) do ping -n 1 192.168.2.%i | find "Reply"

replace the 192.168.2 with your network IP address range
