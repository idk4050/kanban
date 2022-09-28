#!/bin/sh

registry_hostname="registry.kanban.local"
registry_subnet="10.46.0.0/16"
registry_ip="10.46.0.2"
registry_port="80"

kanban_dir="$HOME/.local/share/containers/kanban"

# network
sudo podman stop registry-kanban
sudo podman rm registry-kanban

sudo podman network rm kanban
sudo podman network create --subnet="$registry_subnet" kanban

# registry
registry_dir="$kanban_dir/registry"
mkdir -p "$registry_dir"

sudo podman run --detach --restart always \
  -v "$registry_dir":/var/lib/registry \
  -e "REGISTRY_HTTP_ADDR=0.0.0.0:$registry_port" \
  --network kanban --hostname "$registry_hostname" --ip "$registry_ip" -p "$registry_port:5000" \
  --name registry-kanban \
  docker.io/registry:2

if [ -z "$(grep $registry_ip /etc/hosts)" ]; then
  echo "$registry_ip  $registry_hostname" | sudo tee -a /etc/hosts
fi

# k3s setup
if [ -d /etc/rancher/k3s ]; then
  echo "
mirrors:
  $registry_hostname:
    endpoint:
      - \"http://$registry_hostname:$registry_port\"
" | sudo tee /etc/rancher/k3s/registries.yaml
fi
