#!/bin/bash

if [ ! -d "/usr/src/app/node_modules" ]; then
    yarn install --frozen-lockfile
fi

exec "$@"
