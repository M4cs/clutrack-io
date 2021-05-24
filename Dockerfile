FROM python:3.9-slim-buster

WORKDIR /usr/src/

RUN apt-get update && apt-get install gcc -y

COPY ./requirements.txt /usr/src/requirements.txt
RUN pip install --upgrade pip setuptools wheel gunicorn
RUN pip install -r requirements.txt

COPY . /usr/src/