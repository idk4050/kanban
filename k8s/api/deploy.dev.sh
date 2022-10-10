#!/bin/sh

cd $(dirname "$0")

namespace="kanban-api"
kubectl create namespace $namespace

env_dir="../../api/config.dev/env"
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

tls_dir="../../api/config.dev/tls"
for tls_subdir in $tls_dir/*; do
  secret_name="$(basename "$tls_subdir")"
  opts="create secret tls $secret_name-tls -n $namespace"
  opts="$opts --cert=$tls_subdir/$secret_name.crt"
  opts="$opts --key=$tls_subdir/$secret_name.key"
  kubectl $opts || kubectl $opts -o yaml --dry-run=client | kubectl replace -f -
done

kubectl apply \
  -f api.yaml
