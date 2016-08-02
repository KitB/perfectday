#!/bin/sh
python -m grpc.tools.protoc -I protos --python_out=python/perfectday --grpc_python_out=python/perfectday protos/*.proto
