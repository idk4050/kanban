#!/bin/sh

basedir=$(dirname "$0")
environment="$1"
env_dir="$basedir/../config.$environment/env"
env_file="$basedir/.env"

rm -f "$env_file"
touch "$env_file"

for file in $(find "$env_dir" -type f -iname "api.*" | sort); do
  cat "$file" >> "$env_file"
  echo >> "$env_file"
done
