# syntax=docker/dockerfile:1

ARG RUBY_VERSION=3.3.4
FROM ruby:$RUBY_VERSION-slim AS base

WORKDIR /rails

RUN apt-get update -qq && \
    apt-get install --no-install-recommends -y \
    curl \
    libjemalloc2 \
    libvips \
    libmariadb-dev \
    build-essential \
    git \
    default-libmysqlclient-dev \
    pkg-config \
    libpq-dev \
    libyaml-dev && \
    rm -rf /var/lib/apt/lists/* /var/cache/apt/archives/*

COPY Gemfile Gemfile.lock ./

RUN bundle install --jobs=10 --retry=3 --path /usr/local/bundle && \
    rm -rf ~/.bundle/ /usr/local/bundle/ruby/*/cache /usr/local/bundle/ruby/*/bundler/gems/*/.git

COPY entrypoint.sh /usr/bin/
RUN chmod +x /usr/bin/entrypoint.sh
ENTRYPOINT ["entrypoint.sh"]

COPY . .

# PORTはapi/config/puma.rbで設定されている
CMD ["bin/rails", "server", "-b", "0.0.0.0"]
