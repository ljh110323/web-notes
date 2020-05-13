FROM maptiler/tileserver-gl

WORKDIR /data

COPY mapbox /data

RUN chmod 777 ./run.sh

ENTRYPOINT [ "sh", "./run.sh" ]

EXPOSE 80
#CMD [ "sh", "./run.sh" ]