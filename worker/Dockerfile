FROM alpine:3.14

# Install python/pip
ENV PYTHONUNBUFFERED=1
RUN apk update
RUN apk add --update --no-cache python3 && ln -sf python3 /usr/bin/python
RUN python3 -m ensurepip
RUN pip3 install --no-cache --upgrade pip setuptools

COPY ./requirements.txt .
# Install requirements
RUN pip install -r requirements.txt

# Install clang
RUN apk add --no-cache g++
RUN apk add --no-cache clang

COPY . .

RUN set -ex && apk --no-cache add sudo
USER root

ENTRYPOINT ["python3", "main.py"]