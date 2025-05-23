#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <sys/socket.h>
#include <sys/types.h>
#include <netinet/in.h>
#include <arpa/inet.h>

#define PORT 8801

int main() {
    int sockfd;
    struct sockaddr_in serverAddr;

    int newSockfd;
    struct sockaddr_in newAddr;

    socklen_t addrSize;
    char buffer[1024];

    sockfd = socket(AF_INET, SOCK_STREAM, 0);
    printf("Server socket created successfully.\n");
    memset(&serverAddr, '\0', sizeof(serverAddr));

    serverAddr.sin_family = AF_INET;
    serverAddr.sin_port = htons(PORT);
    serverAddr.sin_addr.s_addr = inet_addr("127.0.0.1");

    bind(sockfd, (struct sockaddr*)&serverAddr, sizeof(serverAddr));
    printf("[+]Bind to port number: %d.\n", PORT);

    listen(sockfd, 5);
    printf("[+]Listening...\n");

    newSockfd = accept(sockfd, (struct sockaddr*)&newAddr, &addrSize);

    strcpy(buffer, "Hello client!");
    send(newSockfd, buffer, strlen(buffer), 0);
    printf("[+]Closing the connection.\n");

    return 0;
}
