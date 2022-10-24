#!/bin/sh

cd $(dirname "$0")

namespace="kanban-auth"
kubectl create namespace $namespace

tls_dir="../../auth/config.dev/tls"
for tls_subdir in $tls_dir/*; do
  config_map="$(basename "$tls_subdir" | cut -d. -f1)"
  opts="create configmap $config_map-tls -n $namespace --from-file $tls_subdir"
  kubectl $opts || kubectl $opts -o yaml --dry-run=client | kubectl replace -f -
done

env_dir="../../auth/config.dev/env"
for config_env_file in $env_dir/*.config; do
  config_map="$(basename "$config_env_file" | cut -d. -f1)"
  opts="create configmap $config_map -n $namespace --from-env-file $config_env_file"

  kubectl $opts || kubectl $opts -o yaml --dry-run=client | kubectl replace -f -
done
for secrets_env_file in $env_dir/*.secrets; do
  secret="$(basename "$secrets_env_file" | cut -d. -f1)"
  opts="create secret generic $secret -n $namespace --from-env-file $secrets_env_file"

  kubectl $opts || kubectl $opts -o yaml --dry-run=client | kubectl replace -f -
done

kubectl apply \
  -f auth.yaml \
  -f database.yaml
