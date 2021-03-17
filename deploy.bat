
rem build the project
call mvn clean package

echo "copy files..."

rem install aws cli
rem must have python firstly

rem install pip
rem curl https://bootstrap.pypa.io/get-pip.py | C:\Python370\python

rem install awsCli:
rem pip3 install --upgrade --user awscli --trusted-host pypi.python.org


rem $env:Path = "C:\Program Files\nodejs\;C:\Python370;C:\Python370\Scripts\;"
rem aws s3 ls s3://www.justa999.com/angular/

aws s3 cp  ./target/webUI-1.0/ s3://www.justa999.com/webUI --recursive --exclude "META-INF/*" --exclude "WEB-INF/*"  --exclude "extjs/*" --exclude "test_bower/*"


