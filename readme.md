# 🎓 EduShark - Backend (Windows)

EduShark est une application éducative inspirée de Wireshark. Elle permet de capturer, décoder et afficher des trames réseau de manière simplifiée et pédagogique. Ce dépôt concerne la partie **backend**, développée en **C++** sous **Windows** avec le SDK Npcap.

---

## 🔧 Technologies utilisées

- 🧠 **C++20**
- 🧰 **Npcap SDK 1.15**
- 🖥️ **CLion** avec **MinGW** (compilateur C++)
- ⚙️ **CMake** comme système de build
- 🪟 Fonctionne uniquement sous **Windows**

---

## 📂 Arborescence du projet

back_end/
├── CMakeLists.txt
├── main.cpp # Point d'entrée du programme
├── packet_capture.cpp # Gestion de la capture réseau (Npcap)
├── packet_capture.hpp
├── packet_parser.cpp # Analyse et décodage des paquets IP
├── packet_parser.hpp

## 🚀 Fonctionnement général

### 1. Initialisation

Le programme démarre par `main.cpp` et initialise la **librairie Winsock** (nécessaire sous Windows pour les fonctions réseau comme `ntohs`, `ntohl`, etc.).

```cpp
WSAStartup(MAKEWORD(2, 2), &wsaData);