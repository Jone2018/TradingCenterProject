FROM python:2.7

ENV PYTHONUNBUFFERED 1

RUN mkdir /app

ADD . /app/

WORKDIR /app/deploy/packages/aliyun-python-sdk-core

RUN pip install .

WORKDIR /app/deploy/packages/aliyun-python-sdk-dysmsapi

RUN pip install .

WORKDIR /app

RUN pip install -r deploy/requirements.txt

RUN python src/manage.py collectstatic --no-input

CMD ["gunicorn", "-b", ":8000", "--chdir", "src", "-k", "gevent", "TradingCenter.wsgi"]
