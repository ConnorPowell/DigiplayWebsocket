#!/bin/bash

if [ "$EUID" -ne 0 ]
  then echo "Please run as root"
  exit
fi

if ! hash forever 2>/dev/null; then
	sudo npm install -g forever
fi

if ! hash forever-service 2>/dev/null; then
	sudo npm install-service -g forever
fi

sudo forever-service install websocket
sudo service websocket start