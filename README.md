# Radio Warwick Digiplay Websocket

This websocket is a nodeJS server that is designed to run as a service using the nodeJS package forever. The websocket interfaces with [digiplay-laravel](https://github.com/radiowarwick/digiplay-laravel/).

## Installation

1. Clone this repo `git clone https://github.com/ConnorPowell/DigiplayWebsocket`
2. Move into the repo `cd DigiplayWebsocket`
3. Copy the environment `cp .env.example .env`
4. Fill in the environment file with your database credentials
5. Install this server as a Debian daemon `sudo npm run install`

## Removal

To remove the server daemon run `sudo npm run remove` 