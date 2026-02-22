# syntax=docker/dockerfile:1

ARG RUBY_VERSION=3.3.4
FROM ruby:$RUBY_VERSION-slim

WORKDIR /rails

RUN apt-get update -qq && \
    apt-get install --no-install-recommends -y \
    libjemalloc2 \
    libvips \
    build-essential \
    pkg-config \
    libpq-dev \
    libyaml-dev

COPY Gemfile Gemfile.lock ./

RUN bundle install --jobs=4 --retry=3

COPY entrypoint.sh /usr/bin/
RUN chmod +x /usr/bin/entrypoint.sh
ENTRYPOINT ["entrypoint.sh"]

COPY . .

CMD ["bundle", "exec", "puma", "-C", "config/puma.rb"]
