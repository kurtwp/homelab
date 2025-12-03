## grep

```bash
grep -rni "error" /var/log/ | grep "2025-12-01" 
```
this will search all files under /var/log/ for the word "error" and 
list out to the screen "error" matching on the date "2025-12-01"

```bash
grep -ni "error" /var/log/messages | grep "2025-12-01
```
This will just search the file messages for "error" and list out on the 
matches on the date.  

     r = recursive  
     i = case insensive   
     n = will provide line numbers  
