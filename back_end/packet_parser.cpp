#include "packet_parser.hpp"
#include <sstream>
#include <iomanip>
#pragma comment(lib, "Ws2_32.lib")
#include <winsock2.h>  // ✔ Fichier pour Windows

EthernetHeader PacketParser::parseEthernet(const u_char* data) {
    EthernetHeader eth;
    memcpy(eth.dest, data, 6);
    memcpy(eth.src, data + 6, 6);
    eth.type = ntohs(*(uint16_t*)(data + 12));
    return eth;
}

IpHeader PacketParser::parseIp(const u_char* data) {
    IpHeader ip;
    memcpy(&ip, data, sizeof(IpHeader));
    ip.length = ntohs(ip.length);
    ip.id = ntohs(ip.id);
    ip.flags_fragment = ntohs(ip.flags_fragment);
    ip.checksum = ntohs(ip.checksum);
    ip.src_addr = ntohl(ip.src_addr);
    ip.dest_addr = ntohl(ip.dest_addr);
    return ip;
}

TcpHeader PacketParser::parseTcp(const u_char* data) {
    TcpHeader tcp;
    memcpy(&tcp, data, sizeof(TcpHeader));
    tcp.src_port = ntohs(tcp.src_port);
    tcp.dest_port = ntohs(tcp.dest_port);
    tcp.window = ntohs(tcp.window);
    tcp.checksum = ntohs(tcp.checksum);
    tcp.urgent_pointer = ntohs(tcp.urgent_pointer);
    return tcp;
}

std::string PacketParser::macToString(const uint8_t* mac) {
    std::ostringstream oss;
    for (int i = 0; i < 6; i++) {
        if (i != 0) oss << ":";
        oss << std::hex << std::setw(2) << std::setfill('0') << (int)mac[i];
    }
    return oss.str();
}

std::string PacketParser::ipToString(uint32_t ip) {
    std::ostringstream oss;
    oss << ((ip >> 24) & 0xFF) << "."
        << ((ip >> 16) & 0xFF) << "."
        << ((ip >> 8) & 0xFF) << "."
        << (ip & 0xFF);
    return oss.str();
}
