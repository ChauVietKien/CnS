CXX = g++
CXXFLAGS = -std=c++17 -Wall -Wextra -Iinclude

SRCS = src/models/*.cpp \
       src/dsa/*.cpp \
       src/storage/*.cpp \
       src/services/*.cpp \
       src/server/*.cpp \
       src/main.cpp

TEST_SRCS = src/dsa/*.cpp \
            src/models/*.cpp \
            tests/test_dsa.cpp

TARGET = build/server_app
TEST_TARGET = build/test_runner

all: $(TARGET)

$(TARGET): $(wildcard src/*/*.cpp) src/main.cpp
	mkdir -p build
	$(CXX) $(CXXFLAGS) $(wildcard src/*/*.cpp) src/main.cpp -o $(TARGET)

run: $(TARGET)
	./$(TARGET)

test: $(TEST_TARGET)
	./$(TEST_TARGET)

$(TEST_TARGET): $(wildcard src/dsa/*.cpp) $(wildcard src/models/*.cpp) tests/test_dsa.cpp
	mkdir -p build
	$(CXX) $(CXXFLAGS) $(wildcard src/dsa/*.cpp) $(wildcard src/models/*.cpp) tests/test_dsa.cpp -o $(TEST_TARGET)

clean:
	rm -rf build/*.o build/server_app build/test_runner
