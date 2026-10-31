# ---------------------------------------------------
# Stage 1: Build binary C++ bằng GCC
# ---------------------------------------------------
FROM gcc:13 AS builder

WORKDIR /app

# Copy toan bo source code backend_cpp
COPY . .

# Bien dich voi C++17 va flags toi uu
RUN g++ -std=c++17 -O2 -Iinclude \
    src/models/*.cpp \
    src/dsa/*.cpp \
    src/storage/*.cpp \
    src/services/*.cpp \
    src/server/*.cpp \
    src/main.cpp \
    -o app -lpthread

# ---------------------------------------------------
# Stage 2: Runtime image Ubuntu gon nhe
# ---------------------------------------------------
FROM ubuntu:22.04

WORKDIR /app

# Cai dat thu vien co ban
RUN apt-get update && apt-get install -y --no-install-recommends \
    ca-certificates \
    && rm -rf /var/lib/apt/lists/*

# Copy file thuc thi va folder data tu builder
COPY --from=builder /app/app .
COPY --from=builder /app/data ./data

# Render su dung bien PORT (mac dinh thuong la 10000)
ENV PORT=10000
EXPOSE 10000

# Chay ung dung
CMD ["./app"]
