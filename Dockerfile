FROM rasa/rasa:1.10.14 as base
WORKDIR /app
COPY ./actions/requirements.txt /app/requirements.txt
USER root
RUN apt-get update && apt-get -y install build-essential python3-dev libffi-dev \
    && python3 -m pip install --upgrade pip wheel \
    && pip3 install -r  /app/requirements.txt \
    && python3 -m spacy download en_core_web_md
USER 1001

FROM base as action
WORKDIR /app
COPY ./actions /app/actions
CMD ["run", "actions"]

FROM base as chatbot
WORKDIR /app
COPY ./chatbot /app
# VOLUME /app
ENV PYTHONPATH "${PYTHONPATH}:/app/custom:/app"
CMD [ "run","--enable-api","--cors","*","--debug" ]
