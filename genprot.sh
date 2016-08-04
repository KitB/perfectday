#!/bin/sh
dir=$(cd -P -- "$(dirname -- "$0")" && pwd -P)
cd $dir
python -m grpc.tools.protoc -I protos --python_out=python/perfectday --grpc_python_out=python/perfectday protos/*.proto
