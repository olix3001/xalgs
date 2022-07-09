FROM alpine:3.14

# Install python/pip
ENV PYTHONUNBUFFERED=1
RUN apk add --update --no-cache python3 && ln -sf python3 /usr/bin/python
RUN python3 -m ensurepip
RUN pip3 install --no-cache --upgrade pip setuptools

COPY ./requirements.txt .
# Install requirements
RUN pip install -r requirements.txt

COPY . .

ENTRYPOINT ["python3", "main.py"]