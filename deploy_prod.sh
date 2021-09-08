#!/bin/bash

# cd /root/srv/app

#build docker container
docker build -t cdrbeta .


# stop existing container
docker stop cdrbeta  && docker rm cdrbeta 

# delete existing container

# delete existing image

# run new image 
docker run  -d -p 5010:4000  --name cdrbeta  cdrbeta 
