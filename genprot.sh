#!/bin/sh
python -m grpc.tools.protoc -I . --python_out=perfectday --grpc_python_out=perfectday protos/*.proto
