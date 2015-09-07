FROM ubuntu

MAINTAINER cindyy

RUN perl -p -i.orig -e 's/archive.ubuntu.com/mirrors.aliyun.com\/ubuntu/' /etc/apt/sources.list
RUN apt-get update
RUN apt-get install -y build-essential git
RUN apt-get install -y python python-dev libpq-dev python-distribute python-pip python-setuptools
RUN apt-get install -y nginx supervisor
RUN easy_install pip

# install uwsgi now because it takes a little while
RUN pip install uwsgi

# install nginx
RUN apt-get install -y software-properties-common python-software-properties
RUN apt-get update
RUN add-apt-repository -y ppa:nginx/stable

# install our code
ADD src/app /src/app
ADD src/nginx /src/nginx

RUN echo "daemon off;" >> /etc/nginx/nginx.conf
RUN rm /etc/nginx/sites-enabled/default
RUN ln -s /src/nginx/nginx-app.conf /etc/nginx/sites-enabled/
RUN ln -s /src/nginx/supervisor-app.conf /etc/supervisor/conf.d/

ENV PYTHONPATH /src/app

RUN pip install -r /src/app/requirements.txt

EXPOSE 80
CMD ["supervisord", "-n"]