# jsmgclient

Welcome to memgraph's JavaSript WASM based client adapter.

## How to build 

Currently, you can only build jsmgclient on Linux via the following commands:

```
git submodule update --init --recursive
cd mgclient 
mkdir build && cd build
cmake .. -DWASM=ON
make -j${number_of_cores}
```

The result JavaScript/WASM files can be consumed by any platform.

## How to run the tests

```
npm install
npm run test-unit
npm run test-e2e-all
```
