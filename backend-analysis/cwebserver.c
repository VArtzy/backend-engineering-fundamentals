#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <unistd.h>
#include <sys/socket.h>
#include <netinet/in.h>

#define APP_MAX_BUFFER 1024
#define PORT 8080

int main() {
    int server_fd, client_fd;

    struct sockaddr_in address;
    int address_len = sizeof(address);

    char buffer[APP_MAX_BUFFER] = {0};

    if((server_fd = socket(AF_INET, SOCK_STREAM, 0)) < 0) { // create socket
        perror("Socket failed");
        exit(EXIT_FAILURE);
    }

    address.sin_family = AF_INET;
    address.sin_addr.s_addr = INADDR_ANY;
    address.sin_port = htons(PORT);

    if (bind(server_fd, (struct sockaddr*)&address, sizeof(address)) < 0) { // bind socket
        perror("Bind failed");
        exit(EXIT_FAILURE);
    }

    if (listen(server_fd, 10) < 0) { // listen socket
        perror("Listen failed");
        exit(EXIT_FAILURE);
    }

    while(1) {
        printf("\nWaiting for a connection...\n");
        if ((client_fd = accept(server_fd, (struct sockaddr*)&address, (socklen_t*)&address_len)) < 0) { // accept connection from queue
            perror("Accept failed");
            exit(EXIT_FAILURE);
        }
        read(client_fd, buffer, APP_MAX_BUFFER); // get from read queue
        printf("%s\n", buffer);

        char *http_response = "HTTP/1.1 200 OK\n"
            "Content-Type: text/plain\n"
            "Content-Length: 13\n"
            "Hello world!\n";

        write(client_fd, http_response, strlen(http_response)); // write to send queue

        close(client_fd); // close connection
    }

    return 0;
}
