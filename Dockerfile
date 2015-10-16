# Dockerfile to create a container to run all supported languages

from	ubuntu:14.04
run     locale-gen en_US.UTF-8
env     LANG=en_US.UTF-8 LANGUAGE=en_US:en LC_ALL=en_US.UTF-8
run     apt-get install software-properties-common -y --force-yes
run     add-apt-repository ppa:brightbox/ruby-ng -y
run	    apt-get update
run     apt-get install python-dev wget build-essential -y --force-yes
run     DEBIAN_FRONTEND=noninteractive apt-get install -qqy ruby2.2 ruby2.2-dev
