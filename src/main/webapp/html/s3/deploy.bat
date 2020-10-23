
echo "copy files..."

rem install aws cli
rem must have python firstly

rem install pip
rem curl https://bootstrap.pypa.io/get-pip.py | C:\Python370\python

rem install awsCli:
rem pip3 install --upgrade --user awscli --trusted-host pypi.python.org


set path=C:\Python370;%path%
aws s3 ls s3://www.justa999.com/

aws s3 cp  ./root/ s3://www.justa999.com/ --recursive --exclude "another/*"

