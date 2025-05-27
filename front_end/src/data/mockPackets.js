export const mockPackets = [
  {
    id: 1,
    timestamp: '10:45:01.123456',
    sourceIp: '192.168.1.101',
    destinationIp: '8.8.8.8',
    protocol: 'DNS',
    length: 78,
    info: 'Standard query 0x1234 A example.com',
    technicalDetails: {
      frame: { interfaceId: 0, encapsulationType: 'Ethernet', arrivalTime: '2025-05-25 10:45:01.123456', epochTime: '1748088301.123456', frameNumber: 1, frameLength: 78, captureLength: 78 },
      ethernet: { destinationMac: 'FE:DC:BA:98:76:54', sourceMac: '00:1A:2B:3C:4D:5E', type: 'IPv4 (0x0800)' },
      ip: { version: 4, headerLength: '20 bytes (5)', dscp: '0x00 (CS0)', ecn: '0x00 (Not-ECT)', totalLength: 64, identification: '0xabcd (43981)', flags: '0x00 (Don\'t Fragment)', fragmentOffset: 0, ttl: 64, protocol: 'UDP (17)', headerChecksum: '0x1234 [correct]', source: '192.168.1.101', destination: '8.8.8.8' },
      udp: { sourcePort: 53535, destinationPort: 53, length: 44, checksum: '0x5678 [validation disabled]' },
      dns: { transactionId: '0x1234', flags: '0x0100 (Standard query)', qr: 0, opcode: 0, aa: 0, tc: 0, rd: 1, ra: 0, z: 0, rcode: 0, questions: 1, answerRRs: 0, authorityRRs: 0, additionalRRs: 0, queries: [{ name: 'example.com', type: 'A (Host Address)', class: 'IN (0x0001)' }] },
    },
    beginnerExplanation: "Votre ordinateur (192.168.1.101) demande à un serveur DNS (8.8.8.8) l'adresse IP du site web 'example.com'. C'est comme demander l'adresse d'un ami dans un annuaire.",
    rawDataHex: 'fedcba987654001a2b3c4d5e080045000040abcd000040111234c0a8016508080808d1230035002c5678123401000001000000000000076578616d706c6503636f6d0000010001',
    securityAnalysis: {
      summary: "Cette trame DNS est une requête standard et ne présente pas de menace immédiate. Cependant, les requêtes DNS peuvent être utilisées dans des attaques de type 'DNS Spoofing' ou 'DNS Tunneling'.",
      points: [
        { level: 'info', title: 'Requête DNS standard', description: "Il s'agit d'une requête légitime pour résoudre un nom de domaine en adresse IP.", recommendation: "Surveiller les réponses DNS inattendues ou les requêtes vers des domaines malveillants connus." },
        { level: 'info', title: 'Port UDP 53', description: "Le port 53 est le port standard pour le service DNS.", recommendation: "Assurez-vous que seul un serveur DNS autorisé répond sur ce port." }
      ]
    }
  },
  {
    id: 2,
    timestamp: '10:45:01.567890',
    sourceIp: '192.168.1.102',
    destinationIp: '104.18.32.125',
    protocol: 'TCP',
    length: 66,
    info: '[SYN] 50001 → 443 (HTTPS) Seq=0 Win=64240 Len=0 MSS=1460 WS=256 SACK_PERM=1',
    technicalDetails: {
      frame: { interfaceId: 0, encapsulationType: 'Ethernet', arrivalTime: '2025-05-25 10:45:01.567890', epochTime: '1748088301.567890', frameNumber: 2, frameLength: 66, captureLength: 66 },
      ethernet: { destinationMac: 'EE:DD:CC:BB:AA:00', sourceMac: '00:AA:BB:CC:DD:EE', type: 'IPv4 (0x0800)' },
      ip: { version: 4, headerLength: '20 bytes (5)', dscp: '0x00 (CS0)', ecn: '0x00 (Not-ECT)', totalLength: 52, identification: '0x1234 (4660)', flags: '0x02 (Don\'t Fragment)', fragmentOffset: 0, ttl: 128, protocol: 'TCP (6)', headerChecksum: '0xabcd [correct]', source: '192.168.1.102', destination: '104.18.32.125' },
      tcp: { sourcePort: 50001, destinationPort: '443 (HTTPS)', sequenceNumber: 0, ackNumber: 0, headerLength: '32 bytes (8)', flags: '0x002 (SYN)', windowSize: 64240, checksum: '0xefgh [correct]', urgentPointer: 0, options: { mss: 1460, sackPermitted: true, windowScale: 8 } },
    },
    beginnerExplanation: "Votre appareil (192.168.1.102) essaie d'établir une connexion sécurisée (HTTPS) avec un serveur web (104.18.32.125). C'est comme une poignée de main pour commencer une conversation, en précisant quelques préférences.",
    rawDataHex: 'eeddccbbaa0000aabbccddee080045000034123440008006abcd' + 'c0a801666812207dc3b101bb00000000000000008002faf0efgh0000' + '020405b40402080a000000000000000001030308',
    securityAnalysis: {
      summary: "Un paquet SYN est normal pour initier une connexion TCP. Cependant, un grand nombre de paquets SYN sans réponse (SYN-ACK) peut indiquer une attaque par déni de service (SYN Flood).",
      points: [
        { level: 'info', title: 'Initialisation de connexion TCP (SYN)', description: "Ce paquet initie une connexion TCP vers le port 443 (HTTPS), ce qui est typique pour la navigation web sécurisée.", recommendation: "Aucune action immédiate si c'est une connexion attendue." },
        { level: 'warning', title: 'Potentiel pour SYN Flood', description: "Si de nombreux paquets SYN similaires sont envoyés sans recevoir de SYN-ACK, cela pourrait être une tentative d'attaque SYN Flood visant à épuiser les ressources du serveur.", recommendation: "Corréler avec d'autres paquets. Des outils de détection d'intrusion (IDS) peuvent aider à identifier de telles attaques." }
      ]
    }
  },
  {
    id: 3,
    timestamp: '10:45:02.012345',
    sourceIp: '2001:db8::1',
    destinationIp: '2001:db8::2',
    protocol: 'ICMPv6',
    length: 78,
    info: 'Echo (ping) request id=0x0001, seq=1, hop limit=64',
    technicalDetails: {
      frame: { interfaceId: 1, encapsulationType: 'Ethernet', arrivalTime: '2025-05-25 10:45:02.012345', epochTime: '1748088302.012345', frameNumber: 3, frameLength: 78, captureLength: 78 },
      ethernet: { destinationMac: 'AA:BB:CC:DD:EE:FF', sourceMac: '11:22:33:44:55:66', type: 'IPv6 (0x86DD)' },
      ipv6: { version: 6, trafficClass: '0x00 (DSCP: CS0, ECN: Not-ECT)', flowLabel: '0x00000', payloadLength: 24, nextHeader: 'ICMPv6 (58)', hopLimit: 64, source: '2001:db8::1', destination: '2001:db8::2' },
      icmpv6: { type: '128 (Echo (ping) request)', code: 0, checksum: '0xabcd [correct]', identifier: '0x0001', sequenceNumber: 1, data: '0123456789abcdef0123456789abcdef' },
    },
    beginnerExplanation: "Un appareil (2001:db8::1) envoie un 'ping' à un autre appareil (2001:db8::2) pour vérifier s'il est en ligne et joignable. C'est comme crier 'Es-tu là ?' dans une pièce.",
    rawDataHex: 'aabbccddeeff11223344556686dd6000000000183a4020010db800000000000000000000000120010db80000000000000000000000028000abcd000100010123456789abcdef0123456789abcdef',
    securityAnalysis: {
      summary: "Les requêtes Echo (ping) ICMPv6 sont généralement utilisées pour le diagnostic réseau. Elles peuvent être utilisées pour la reconnaissance du réseau par des attaquants.",
      points: [
        { level: 'info', title: 'Requête Ping (ICMPv6)', description: "Utilisé pour tester la connectivité entre deux hôtes IPv6.", recommendation: "Normal pour le dépannage, mais un trafic ICMP excessif peut indiquer un balayage réseau." },
        { level: 'warning', title: 'Reconnaissance réseau', description: "Les attaquants utilisent souvent des pings pour découvrir les hôtes actifs sur un réseau avant de lancer des attaques plus ciblées.", recommendation: "Bloquer le trafic ICMP entrant depuis des sources non approuvées au niveau du pare-feu si la politique de sécurité le requiert." }
      ]
    }
  },
  {
    id: 4,
    timestamp: '10:45:03.333333',
    sourceIp: '192.168.1.105',
    destinationIp: '192.168.1.255',
    protocol: 'UDP',
    length: 120,
    info: 'Source port: 60000 Destination port: 60001',
    technicalDetails: {
      frame: { interfaceId: 0, encapsulationType: 'Ethernet', arrivalTime: '2025-05-25 10:45:03.333333', epochTime: '1748088303.333333', frameNumber: 4, frameLength: 120, captureLength: 120 },
      ethernet: { destinationMac: 'FF:FF:FF:FF:FF:FF', sourceMac: '00:1B:C5:01:23:45', type: 'IPv4 (0x0800)' },
      ip: { version: 4, headerLength: '20 bytes (5)', dscp: '0x00 (CS0)', ecn: '0x00 (Not-ECT)', totalLength: 106, identification: '0x5678 (22136)', flags: '0x00', fragmentOffset: 0, ttl: 64, protocol: 'UDP (17)', headerChecksum: '0xdef0 [correct]', source: '192.168.1.105', destination: '192.168.1.255 (Broadcast)' },
      udp: { sourcePort: 60000, destinationPort: 60001, length: 86, checksum: '0xef12 [validation disabled]' },
      data: { payload: "Ceci est un exemple de données applicatives pour une diffusion UDP. Il pourrait s'agir d'une découverte de service ou de données de jeu.", payloadHex: "436563692065737420756e206578656d706c6520646520646f6e6ec3a96573206170706c696361746976657320706f757220756e6520646966667573696f6e205544502e20496c20706f75727261697420732761676972206427756e652064c3a9636f7576657274652064652073657276696365206f7520646520646f6e6ec3a96573206465206a65752e" }
    },
    beginnerExplanation: "Un appareil (192.168.1.105) envoie un message à tous les appareils sur le réseau local (192.168.1.255). C'est comme faire une annonce générale dans un bureau, par exemple pour trouver une imprimante.",
    rawDataHex: 'ffffffffffff001bc501234508004500006a567800004011def0c0a80169c0a801ffea60ea610056ef12436563692065737420756e206578656d706c6520646520646f6e6ec3a96573206170706c696361746976657320706f757220756e6520646966667573696f6e205544502e20496c20706f75727261697420732761676972206427756e652064c3a9636f7576657274652064652073657276696365206f7520646520646f6e6ec3a96573206465206a65752e',
    securityAnalysis: {
      summary: "Le trafic de diffusion UDP peut être légitime pour la découverte de services (ex: SSDP, mDNS) ou des applications spécifiques. Cependant, il peut aussi être utilisé dans des attaques d'amplification ou pour la reconnaissance.",
      points: [
        { level: 'info', title: 'Diffusion UDP', description: "La trame est envoyée à tous les appareils sur le segment de réseau local. Ceci est courant pour certains protocoles de découverte.", recommendation: "Vérifier si le service utilisant ces ports (60000, 60001) est attendu et légitime." },
        { level: 'warning', title: 'Risque d\'amplification Smurf (indirect)', description: "Bien que cette trame elle-même ne soit pas une attaque Smurf, les diffusions peuvent être exploitées. Si cette trame était une requête ICMP Echo vers une adresse de diffusion avec une adresse source usurpée, cela pourrait constituer une partie d'une attaque Smurf.", recommendation: "Assurez-vous que les routeurs sont configurés pour ne pas relayer les diffusions dirigées." },
        { level: 'info', title: 'Checksum UDP désactivée/incorrecte', description: "La validation du checksum UDP est souvent désactivée pour des raisons de performance, mais cela signifie que les erreurs de données ne seraient pas détectées au niveau UDP.", recommendation: "Pour les données critiques, s'assurer que la validation du checksum est active ou gérée au niveau applicatif." }
      ]
    }
  },
];