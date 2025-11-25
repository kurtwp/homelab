# Fix WMIC Error on Windows 11 Mini PC

Are you getting the error:

```
'wmic' is not recognized as an internal or external command,
operable program or batch file.
```

This happens because **WMIC is no longer installed by default on Windows 11**.  
Here’s how to fix it by adding WMIC as an optional feature.

---

## ✅ Steps to Fix WMIC Error

### 1. Confirm the Error
Open **Command Prompt** and run as administrator:
```cmd
wmic path softwareLicensingService get OA3xOriginalProductKey
```
If you see the error above, WMIC is missing.

---

### 2. Open Optional Features
1. Go to **Settings → System → Optional Features**
2. Click **View features** button
3. Search for **WMIC**
4. Select it and click **Next** then  **Add**

Adding **WMIC** will take at least five minitues to install. 

---

### 3. Verify Installation
After installation, open **Command Prompt** again and run ad administrator:
```cmd
wmic
```
You should now see the WMIC prompt.

---

## ✅ Why This Happens
Microsoft deprecated WMIC in Windows 11, but you can still install it manually as an optional feature.

---

## 📺 Watch the Full Tutorial
[![Watch on YouTube](https://img.youtube.com/vi/KpKUy7KOi8M/maxresdefault.jpg)](https://youtu.be/KpKUy7KOi8M)

---

### 🔑 Tags
`wmic error windows 11` `wmic not recognized` `fix wmic command` `windows 11 wmic missing` `how to install wmic` `windows 11 optional features`

---

**Follow me through my Home Lab journey!**
