cmake_minimum_required(VERSION 3.15)
project(back_end)

set(CMAKE_CXX_STANDARD 20)

include_directories("C:/npcap-sdk-1.15/Include")
link_directories("C:/npcap-sdk-1.15/Lib/x64")

add_executable(back_end
        main.cpp
        packet_capture.cpp
        packet_parser.cpp
)

target_link_libraries(back_end wpcap)
