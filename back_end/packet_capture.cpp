#include "packet_capture.hpp"
#include <iostream>

PacketCapture::PacketCapture() : handle(nullptr), capturing(false) {}

PacketCapture::~PacketCapture() {
    if (handle) {
        pcap_close(handle);
    }
}

bool PacketCapture::openDevice(const std::string& deviceName, std::string& err) {
    char errbuf[PCAP_ERRBUF_SIZE];
    handle = pcap_open_live(deviceName.c_str(), 65536, 1, 1000, errbuf);
    if (!handle) {
        err = errbuf;
        return false;
    }
    return true;
}

void PacketCapture::startCapture(PacketHandler handler) {
    if (!handle) return;
    capturing = true;
    currentHandler = handler;
    // Lance la capture dans le thread principal (bloquant)
    pcap_loop(handle, 0, packetCallback, reinterpret_cast<u_char*>(this));
}

void PacketCapture::stopCapture() {
    if (capturing && handle) {
        pcap_breakloop(handle);
        capturing = false;
    }
}

void PacketCapture::packetCallback(u_char* user, const struct pcap_pkthdr* h, const u_char* bytes) {
    PacketCapture* self = reinterpret_cast<PacketCapture*>(user);
    if (self->currentHandler) {
        self->currentHandler(bytes, h->len);
    }
}
