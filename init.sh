#!/bin/bash

if [ "$EUID" -ne 0 ]
  then echo "Please run as root"
  exit
fi

sudo npm install -g forever
sudo npm install -g forever-service
sudo forever-service install websocket