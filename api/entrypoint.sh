#!/bin/bash
set -e

rm -f tmp/pids/server.pid

if [ "$RAILS_ENV" = "production" ]; then
  # bundle exec rails db:create
  bundle exec rails db:migrate
  # bundle exec rails db:seed

  # mkdir -p log
  # touch log/production.log
  # chmod 664 log/production.log
fi

exec "$@"
