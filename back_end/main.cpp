#include "packet_capture.hpp"
#include "packet_parser.hpp"

#include <iostream>
#include <pcap.h>
#include <string>
#include <sstream>

#include <winsock2.h>
#include <ws2tcpip.h>
#pragma comment(lib, "Ws2_32.lib")

// Initialisation Winsock
void initWinsock() {
    WSADATA wsaData;
    int iResult = WSAStartup(MAKEWORD(2, 2), &wsaData);
    if (iResult != 0) {
        std::cerr << "WSAStartup failed: " << iResult << std::endl;
        exit(EXIT_FAILURE);
    }
}

// Création serveur TCP, écoute et accept client
SOCKET setupServerAndAccept(int port) {
    SOCKET listenSocket = INVALID_SOCKET;
    SOCKET clientSocket = INVALID_SOCKET;

    struct sockaddr_in serverAddr;

    listenSocket = socket(AF_INET, SOCK_STREAM, IPPROTO_TCP);
    if (listenSocket == INVALID_SOCKET) {
        std::cerr << "socket failed with error: " << WSAGetLastError() << std::endl;
        WSACleanup();
        exit(EXIT_FAILURE);
    }

    // Bind
    serverAddr.sin_family = AF_INET;
    serverAddr.sin_addr.s_addr = INADDR_ANY;
    serverAddr.sin_port = htons(port);

    if (bind(listenSocket, (SOCKADDR*)&serverAddr, sizeof(serverAddr)) == SOCKET_ERROR) {
        std::cerr << "bind failed with error: " << WSAGetLastError() << std::endl;
        closesocket(listenSocket);
        WSACleanup();
        exit(EXIT_FAILURE);
    }

    if (listen(listenSocket, 1) == SOCKET_ERROR) {
        std::cerr << "listen failed with error: " << WSAGetLastError() << std::endl;
        closesocket(listenSocket);
        WSACleanup();
        exit(EXIT_FAILURE);
    }

    std::cout << "Serveur TCP en écoute sur le port " << port << " ... en attente de client\n";

    clientSocket = accept(listenSocket, NULL, NULL);
    if (clientSocket == INVALID_SOCKET) {
        std::cerr << "accept failed with error: " << WSAGetLastError() << std::endl;
        closesocket(listenSocket);
        WSACleanup();
        exit(EXIT_FAILURE);
    }

    std::cout << "Client connecté au serveur TCP\n";

    closesocket(listenSocket); // plus besoin du socket écoute

    return clientSocket;
}

int main() {
    // Initialisation winsock
    initWinsock();

    pcap_if_t* alldevs;
    char errbuf[PCAP_ERRBUF_SIZE];

    if (pcap_findalldevs(&alldevs, errbuf) == -1) {
        std::cerr << "Erreur recherche interfaces: " << errbuf << std::endl;
        WSACleanup();
        return 1;
    }

    int targetIndex = 4;
    int currentIndex = 0;
    pcap_if_t* selected = alldevs;
    while (selected && currentIndex < targetIndex) {
        selected = selected->next;
        ++currentIndex;
    }

    if (!selected) {
        std::cerr << "Interface à l'index " << targetIndex << " introuvable." << std::endl;
        pcap_freealldevs(alldevs);
        WSACleanup();
        return 1;
    }

    std::cout << "Interface sélectionnée: " << selected->name << std::endl;

    PacketCapture capture;
    std::string err;
    if (!capture.openDevice(selected->name, err)) {
        std::cerr << "Erreur ouverture device: " << err << std::endl;
        pcap_freealldevs(alldevs);
        WSACleanup();
        return 1;
    }

    SOCKET clientSocket = setupServerAndAccept(12345);

    std::cout << "Démarrage capture, Ctrl+C pour arrêter..." << std::endl;

    int packetCount = 1;
    capture.startCapture([&clientSocket, &packetCount](const u_char* data, int length) {
        std::ostringstream oss;

        auto eth = PacketParser::parseEthernet(data);

        oss << "{";
        oss << "\"packetNumber\":" << packetCount++ << ",";
        oss << "\"macSrc\":\"" << PacketParser::macToString(eth.src) << "\",";
        oss << "\"macDest\":\"" << PacketParser::macToString(eth.dest) << "\",";
        oss << "\"ethType\":\"0x" << std::hex << eth.type << std::dec << "\",";

        if (eth.type == 0x0800) {
            auto ip = PacketParser::parseIp(data + 14);
            oss << "\"ipSrc\":\"" << PacketParser::ipToString(ip.src_addr) << "\",";
            oss << "\"ipDest\":\"" << PacketParser::ipToString(ip.dest_addr) << "\",";
            oss << "\"protocol\":" << static_cast<int>(ip.protocol) << ",";
        }

        oss << "\"length\":" << length;
        oss << "}\n";

        std::string jsonStr = oss.str();

        int sent = send(clientSocket, jsonStr.c_str(), (int)jsonStr.size(), 0);
        if (sent == SOCKET_ERROR) {
            std::cerr << "send failed with error: " << WSAGetLastError() << std::endl;
            // Gérer la déconnexion si tu veux
        }
        else {
            std::cout << "Packet envoyé: " << jsonStr;
        }
        });

    closesocket(clientSocket);
    pcap_freealldevs(alldevs);
    WSACleanup();
    return 0;
}
