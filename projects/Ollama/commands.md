# Ollama commands
| Command | Description | Example |
| --- | --- | --- |
| ollama run |Downloads (if missing) and launches a model in an interactive chat terminal. | ollama run llama3.2 |
| ollama pull | Downloads a specific model from the registry without launching it. | ollama pull gemma3|
| ollama list | Lists all local models saved on your machine (alias: ollama ls). | ollama list |
| ollama ps | Displays which models are currently loaded into memory/VRAM. | ollama ps|
| ollama stop | Unloads a running model from memory to free up resources. | ollama stop llama3.2 |
| ollama rm | Deletes a model file from your local storage to free up disk space. | ollama rm llama3.2 |
| ollama show | Reveals architecture, parameters, and metadata of a specific model. | ollama show llama3.2 |
| ollama serve | Manually boots up the local background server (runs automatically by default). | ollama serve|
| ollama cp |  Duplicates a model locally under a brand-new custom tag name. | ollama cp llama3.2 new_name |

# Interactive Chat Session Shortcuts
- **/bye:**  Exits the active chat session immediately.
- **""":**  Encloses multi-line inputs. Begin text with triple quotes, hit enter to write multiple lines, and close with triple quotes to send.
- **/set parameter:**  Temporarily tweaks generation parameters (e.g., /set parameter temperature 0.7).
- **/? or /help:**  Views all hidden shortcuts available inside the chat environment

