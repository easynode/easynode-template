FROM hujb2000/easynode:6.2.0

MAINTAINER hujb

WORKDIR /usr/src/app

RUN mv /usr/src/easynode/node_modules /usr/src/app


COPY . /usr/src/app

WORKDIR /usr/src/app
RUN source $HOME/.bashrc && \
	babel src -d lib

CMD ["./start.sh"]

