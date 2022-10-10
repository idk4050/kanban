#!/bin/sh

cd $(dirname "$0")

version="latest"
[ -n "$1" ] && version="$1"

image="registry.kanban.local/api:$version"

echo "Building $image"
echo

podman build -t "$image" \
  -f api.Containerfile \
  --ignorefile api.containerignore \
  ../../api

echo
echo "Pushing $image"
echo

podman push --tls-verify=false "$image"
