#pragma once
#include <cstdint>
#include <string>
#include <pcap.h>
#include <vector>

struct EthernetHeader {
    uint8_t dest[6];
    uint8_t src[6];
    uint16_t type;
};

struct IpHeader {
    uint8_t version_ihl;
    uint8_t tos;
    uint16_t length;
    uint16_t id;
    uint16_t flags_fragment;
    uint8_t ttl;
    uint8_t protocol;
    uint16_t checksum;
    uint32_t src_addr;
    uint32_t dest_addr;
};

struct TcpHeader {
    uint16_t src_port;
    uint16_t dest_port;
    uint32_t seq_num;
    uint32_t ack_num;
    uint8_t data_offset_reserved;
    uint8_t flags;
    uint16_t window;
    uint16_t checksum;
    uint16_t urgent_pointer;
};

class PacketParser {
public:
    static EthernetHeader parseEthernet(const u_char* data);
    static IpHeader parseIp(const u_char* data);
    static TcpHeader parseTcp(const u_char* data);

    static std::string macToString(const uint8_t* mac);
    static std::string ipToString(uint32_t ip);
};
