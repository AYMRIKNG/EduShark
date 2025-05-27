#pragma once
#include <pcap.h>
#include <string>
#include <functional>

class PacketCapture {
public:
    using PacketHandler = std::function<void(const u_char* data, int length)>;

    PacketCapture();
    ~PacketCapture();

    bool openDevice(const std::string& deviceName, std::string& err);
    void startCapture(PacketHandler handler);
    void stopCapture();

private:
    pcap_t* handle = nullptr;
    bool capturing = false;

    static void packetCallback(u_char* user, const struct pcap_pkthdr* h, const u_char* bytes);
    PacketHandler currentHandler;
};
