#!/bin/sh
docker rm algo 2> /dev/null || true
docker run -it -p 8000:8000 -v $PWD:/home/Algocynfas algo bash
