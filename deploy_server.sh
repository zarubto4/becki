#!/bin/bash

if [ "$EUID" -eq 0 ] ; then
  echo "You cannot run this script as root (sudo)"
  exit
fi

HOSTNAME=$(hostname -s)

if [ "$HOSTNAME" == "portal-stage-byzance" ] ; then
  echo "Environment = portal.stage.byzance.cz"
  echo "== fetch git =="
  git fetch --all --tags --prune
  git checkout .
  git checkout tags/stage
  echo "== install npm dependencies =="
  npm prune --production
  npm install --production
  echo "== build =="
  npm run build
else
  echo "Unknown environment (hostname = $HOSTNAME .. new server?)"
fi