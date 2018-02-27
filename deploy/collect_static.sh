export base=$(pwd)
cd $base/deploy/packages/aliyun-python-sdk-core/
echo $(pwd)
pip install .
cd $base/deploy/packages/aliyun-python-sdk-dysmsapi/
echo $(pwd)
pip install .

apt-get update
apt-get install -y nginx
