#!/bin/sh
# wait-for-services.sh

set -e

# List of services to check
SERVICES="http://user-service:4001 http://profile-service:4002 http://availability-service:4003 http://matching-service:4004 http://session-service:4005 http://notification-service:4006 http://messaging-service:4007"

# Function to check a single service
wait_for_service() {
  url=$1
  echo "Waiting for $url"
  # We use wget and accept 400 Bad Request because Apollo Server 
  # returns 400 when missing a query.
  until wget --spider --quiet -S "$url" 2>&1 | grep -E "HTTP/1.1 (200|400)" > /dev/null; do
    echo "Service $url is unavailable - sleeping"
    sleep 1
  done
  echo "Service $url is up"
}

# Wait for all services
for service in $SERVICES; do
  # Extract the base URL for the health check (remove potential /graphql paths)
  base_url=$(echo "$service" | sed -e 's/\/graphql//')
  wait_for_service "$base_url"
done

echo "All services are up - executing command"
exec "$@"
