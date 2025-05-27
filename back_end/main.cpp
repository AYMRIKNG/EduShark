#include "packet_capture.hpp"
#include "packet_parser.hpp"
#include <iostream>
#include <pcap.h>
#include <string>

int main() {
    // Lister les interfaces réseau
    pcap_if_t* alldevs;
    char errbuf[PCAP_ERRBUF_SIZE];
    if (pcap_findalldevs(&alldevs, errbuf) == -1) {
        std::cerr << "Erreur recherche interfaces: " << errbuf << std::endl;
        return 1;
    }

    std::cout << "Interfaces disponibles:" << std::endl;
    int i = 0;
    for (pcap_if_t* d = alldevs; d != nullptr; d = d->next) {
        std::cout << i++ << ": " << d->name << " - "
                  << (d->description ? d->description : "Pas de description") << std::endl;
    }

    // Choix de l’interface
    int choice;
    std::cout << "Choisir une interface (index): ";
    std::cin >> choice;

    pcap_if_t* selected = alldevs;
    for (int j = 0; j < choice; j++) {
        if (selected->next)
            selected = selected->next;
        else {
            std::cerr << "Index invalide" << std::endl;
            pcap_freealldevs(alldevs);
            return 1;
        }
    }

    PacketCapture capture;
    std::string err;
    if (!capture.openDevice(selected->name, err)) {
        std::cerr << "Erreur ouverture device: " << err << std::endl;
        pcap_freealldevs(alldevs);
        return 1;
    }

    std::cout << "Démarrage capture, Ctrl+C pour arrêter..." << std::endl;

    capture.startCapture([](const u_char* data, int length) {
        auto eth = PacketParser::parseEthernet(data);
        std::cout << "MAC Src: " << PacketParser::macToString(eth.src)
                  << " MAC Dest: " << PacketParser::macToString(eth.dest)
                  << " Type: 0x" << std::hex << eth.type << std::dec << std::endl;

        if (eth.type == 0x0800) { // IPv4
            auto ip = PacketParser::parseIp(data + 14);
            std::cout << "IP Src: " << PacketParser::ipToString(ip.src_addr)
                      << " IP Dest: " << PacketParser::ipToString(ip.dest_addr)
                      << " Protocol: " << static_cast<int>(ip.protocol) << std::endl;
        }
    });

    pcap_freealldevs(alldevs);
    return 0;
}
