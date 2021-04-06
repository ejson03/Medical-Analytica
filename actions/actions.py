from pymongo import MongoClient
from modules.utils import *
from modules.diagnose import encode_symptom, create_illness_vector, get_diagnosis
from modules.config import * 
import dateparser as ddp
import os, requests, base64, uuid
from os import environ
from sys import getsizeof
from datetime import datetime, date, time, timedelta
from rasa_sdk import Action, Tracker
from rasa_sdk.events import SlotSet, AllSlotsReset, EventType, SessionStarted, ActionExecuted, FollowupAction, BotUttered, Form, EventType, Restarted
from rasa_sdk.forms import FormAction
from rasa_sdk.executor import CollectingDispatcher
from typing import Text, Callable, Dict, List, Any, Optional
from py2neo import Graph,Node,Relationship
import pandas as pd

client = MongoClient(MONGODB_STRING)
disease_file = './assets/disease.txt'
disease_names = [i.strip() for i in open(disease_file, 'r', encoding='UTF-8').readlines()]

try:
    graph = Graph(
            host=NEO4J_STRING,
            http_port=7474,
            user=NEO4J_USERNAME,
            password= NEO4J_PASSWORD)
except Exception as e:
    import sys
    sys.exit(-1)


def retrieve_disease_name(name):
    names = []
    name = '.*' + '.*'.join(list(name)) + '.*'
    import re
    pattern = re.compile(name)
    for i in disease_names:
        candidate = pattern.search(i)
        if candidate:
            names.append(candidate.group())
    return names


def make_button(title, payload):
    return {'title': title, 'payload': payload}

class ActionRestart(Action):
    def name(self):
        return "action_restart"

    async def run(self,dispatcher, tracker, domain):
        return [Restarted(), FollowupAction("action_session_start")]

class ActionSessionStart(Action):
    def name(self):
        return "action_session_start"

    @staticmethod
    def _slot_set_events_from_tracker(tracker):
        return [
            SlotSet(key=event.get("name"), value=event.get("value"),)
            for event in tracker.events
            if event.get("event") == "slot"
        ]

    async def run(self,dispatcher, tracker, domain):
        events = [SessionStarted()]
        events.extend(self._slot_set_events_from_tracker(tracker))
        username = tracker.get_slot('name') if tracker.get_slot("name") else tracker.current_state()["sender_id"]    
        dispatcher.utter_message(text=f"Hello {username}")
        events.append(ActionExecuted("action_listen"))
        return events

class ResetSlot(Action):

    def name(self):
        return "action_reset_slot"

    def run(self, dispatcher, tracker, domain):
        return [SlotSet('filedesc', None)]

class ActionUpload(Action):

    def name (self):
        return "action_upload"

    def run(self, dispatcher, tracker, domain):
        dispatcher.utter_message(json_message={"payload":"fileupload"})

class ActionGetSong(Action):

    def name(self):
        return "action_get_song"

    def run(self, dispatcher, tracker, domain):
        emotion = None
        entities = tracker.latest_message['entities']
        for entity in entities:
            if entity['entity'] == "emotion":
                emotion = entity['value']
        if emotion:
            url = get_music(emotion)
            dispatcher.utter_message("Here is something for your mood.")
            dispatcher.utter_message(json_message={"payload":"video","data":url})
        else:
            dispatcher.utter_message("I couldn't contemplate what you are going thorugh. I'm sorry.")

class ActionGetQuote(Action):
    def name(self):
        return "action_get_quote"

    def run(self, dispatcher, tracker, domain):
        image = get_quotes()
        dispatcher.utter_message(image=image)

class ActionDateRecord(Action):
    def name(self):
        return "action_date_record"

    def run(self, dispatcher, tracker, domain):
        time = None
        username = tracker.sender_id
        entities = tracker.latest_message['entities']
        for entity in entities:
            if entity['entity'] == "time":
                time = entity['value']
        dateform=ddp.parse(time)
        print(time,dateform)
        if time:
            res = requests.post(f"{APP_URL}/chatbot/filter", json={"username" : username, "date" : dateform})
            response = res.json()
            dispatcher.utter_message(json_message={"payload":"listdocuments","data":response})
            dispatcher.utter_message("Got the date")
        else:
            dispatcher.utter_message("I couldn't contemplate what you are going thorugh. I'm sorry.")

class ActionTransferRecord(Action):
    def name(self):
        return "action_transfer_record"

    def run(self, dispatcher, tracker, domain):
        record = None
        doctor = None 
        entities = tracker.latest_message['entities']
        for entity in entities:
            if entity['entity'] == "record":
                record = entity['value']
            if entity['entity'] == "doctor":
                doctor = entity['value']
        print(record,doctor)
        if record and doctor:
            res = requests.post(f"{APP_URL}/chatbot/transfer", json={"doctor" : doctor, "record" : record})
            response = res.json()
            dispatcher.utter_message("Your {} is been tranfered to {} doctor".format(records,doctor))
        else:
            dispatcher.utter_message("I couldn't contemplate what you are going thorugh. I'm sorry.")
        
class ActionFilterRecord(Action):
    def name(self):
        return "action_filter_record"

    def run(self, dispatcher, tracker, domain):
        username = tracker.sender_id
        query = None
        time = None 
        data= {
            "username" : username
        }
        entities = tracker.latest_message['entities']
        for entity in entities:
            if entity['entity'] == "query":
                query = entity['value']
            if entity['entity'] == "time":
                time = entity['value']
                dateform = ddp.parse(time)
                if dateform is not None:
                    data["date"] = str(dateform)
                    print(time,str(dateform),query)
        if query:
            if query.lower()=='height' or query.lower()=='tall':
                data["height"] = 5.8
                header="Height"
            if query.lower()=='weight' or query.lower()=='healthy':
                data["weight"] = 91
                header="Weight"
            if query.lower()=='bp' or query.lower()=='blood pressure' or query.lower()=='systolic' or query.lower()=='diastolic' :
                data["bp"] = 121
                header="Blood Pressure"
            if query.lower()=='symptoms':
                data["symptoms"] = "fever"
                header="Symptoms"
            if query.lower()=='allergies':
                data["allergies"] = "dust"
                header="Allergies"
            if query.lower()=='age':
                data["age"] = 21
                header="Age"
            res = requests.post(f"{APP_URL}/chatbot/filter", json=data)
            response = res.json()
            print(response)
            dispatcher.utter_message(json_message={"payload":"listrecords","head":header,"data":response})
            dispatcher.utter_message("Got the query and doctor")
        else:
            dispatcher.utter_message("I couldn't contemplate what you are going thorugh. I'm sorry.")


class ActionGetJoke(Action):
    def name(self):
        return "action_get_joke"

    def run(self, dispatcher, tracker, domain):
        joke = get_jokes()
        dispatcher.utter_message(f"{joke}")

'''Get "action_weather" data'''
class ActionWeather(Action):
    def name(self):
        return 'action_weather'

    def run(self, dispatcher, tracker, domain):
        base_url = "https://weather.api.here.com/weather/1.0/report.json?" 
 
        location = tracker.get_slot('location')
        Final_url = base_url + "app_id=" + WEATHER_ID + "&app_code=" + WEATHER_KEY + "&product=observation&name=" + location 
        weather_data = requests.get(Final_url).json()

        if (len(weather_data) > 2):
            # JSON data works just similar to python dictionary and you can access the value using [].
            current_temperature =  weather_data['observations']['location'][0]['observation'][0]['temperature']
            wind=weather_data['observations']['location'][0]['observation'][0]['windSpeed']
            desc=weather_data['observations']['location'][0]['observation'][0]['description']

            response = """ It is {} in {} at this moment. The temperature is {} degree and the wind speed is {} m/s. """. format(desc, location, current_temperature, wind)
            dispatcher.utter_message(response)
        else:
            dispatcher.utter_message("City Not Found ")
 

'''Get "action_temp" data'''
class ActionTemperature(Action):
    def name(self):
        return 'action_temp'
      
    def run(self, dispatcher, tracker, domain):
        base_url = "https://weather.api.here.com/weather/1.0/report.json?" 
 
        location = tracker.get_slot('location')
        Final_url = base_url + "app_id=" + WEATHER_ID + "&app_code=" + WEATHER_KEY + "&product=observation&name=" + location 
 
        weather_data = requests.get(Final_url).json()

        if (len(weather_data) > 2):
            # JSON data works just similar to python dictionary and you can access the value using [].
            current_temperature =  weather_data['observations']['location'][0]['observation'][0]['temperature']

            response = """ The temperature in {} is now {} degree currently """. format(location, current_temperature)
            dispatcher.utter_message(response)
        else:
            dispatcher.utter_message("City Not Found ")

class ActionDiagnoseSymptoms(Action):

    def name(self):
        return "action_diagnose_symptoms"

    def run(self, dispatcher, tracker, domain):

        symptoms = tracker.get_slot("symptom")
        encoded_symptoms = [encode_symptom(symptom) for symptom in symptoms]
        illness_vector = create_illness_vector(encoded_symptoms)
        diagnosis_string = get_diagnosis(illness_vector)
        dispatcher.utter_message(text=diagnosis_string)

class EHRForm(FormAction):

    def name(self):
        return "ehr_form"

    @staticmethod
    def required_slots(tracker):
        return["age", "excercise", "height", "smoking", "weight", "bp", "filedesc"]

    def slot_mappings(self):

        return {
            "age": [self.from_entity(entity="age"),
                                    self.from_text()],
            "excercise": [self.from_entity(entity="excercise"), 
                                    self.from_text()],
            "height": [self.from_entity(entity="height"),
                         self.from_text()],
            "smoking": [self.from_entity(entity="smoking"),
                                    self.from_text()],
            "weight": [self.from_entity(entity="weight"),
                         self.from_text()],
            "bp": [self.from_entity(entity="bp"),
                         self.from_text()],
            "filedesc": [self.from_text()]
        }

    @staticmethod 
    def is_float(string):
        try:
            float(string)
            return True
        except ValueError:
            return False

    def validate_height(self, value,  dispatcher, tracker, domain):
        """Validate num_people value."""

        if self.is_float(value) and float(value) > 0 and float(value) < 8.50 :
            return {"height": value}
        else:
            dispatcher.utter_message(template="utter_wrong_height")
            # validation failed, set slot to None
            return {"height": None}

    def validate_weight(self, value,  dispatcher, tracker, domain):
        if(not (value and value.strip())):
            dispatcher.utter_message(text=" Kindly fill in your proper weight")
            return{"weight":None}
        else:
            return{"weight":value}
    
    def validate_filedesc(self, value,  dispatcher, tracker, domain):
        if(not (value and value.strip()) or value==None):
            dispatcher.utter_message(text=" Kindly fill in your proper file description")
            return{"filedesc":None}
        else:
            return{"filedesc":value}

    def validate_age(self, value,  dispatcher, tracker, domain):
        if(not (value and value.strip())):
            dispatcher.utter_message(text=" Kindly fill in your proper age ")
            return{"age":None}
        else:
            return{"age":value}

    def validate_bp(self, value,  dispatcher, tracker, domain):
        if(not (value and value.strip())):
            dispatcher.utter_message(text=" Kindly fill in your proper blood pressure in the given format ")
            return{"bp":None}
        else:
            return{"bp":value}

    def validate_smoking(self, value,  dispatcher, tracker, domain):
        if(not (value and value.strip())):
            dispatcher.utter_message(text=" Kindly fill in your proper smoking details")
            return{"smoking":None}
        else:
            return{"smoking":value}

    def validate_excercise(self, value,  dispatcher, tracker, domain):
        if(not (value and value.strip())):
            dispatcher.utter_message(text=" Kindly fill in your proper excercise details")
            return{"excercise":None}
        else:
            return{"excercise":value}

    def submit(self, dispatcher, tracker, domain ):
        return[]

class FileForm(FormAction):

    def name(self):
        return "file_form"

    @staticmethod
    def required_slots(tracker):
        return["filedesc"]

    def slot_mappings(self):

        return {
            "filedesc": [self.from_text()]
        }

    def validate_filedesc(self, value,  dispatcher, tracker, domain):
        if (not (value and value.strip()) or value==None):
            dispatcher.utter_message(text=" File description cannot be empty ")
            return{"filedesc":None}
        else:
            return{"filedesc":value}

    def submit(self, dispatcher, tracker, domain ):
        return []

class ActionSetFile(Action):

    def name(self):
        return "action_set_file"

    @staticmethod
    def extract_metadata_from_tracker(tracker: Tracker):
        events = tracker.current_state()['events']
        user_events = []
        for e in events:
            if e['event'] == 'user':
                user_events.append(e)
        return user_events[-1]['metadata']

    @staticmethod
    def fetch_slots(tracker):
        slots = {}
        for key in ["age", "excercise", "height", "smoking", "weight", "bp", "filedesc"]:
            if key == "filedesc":
                slots["description"] = tracker.get_slot(key)
            else:
                slots[key] = tracker.get_slot(key)
        return slots


    def run(self, dispatcher, tracker, domain):
        username = tracker.sender_id
        token = self.extract_metadata_from_tracker(tracker)
        url = tracker.latest_message['text']
        date = datetime.now().strftime("%s")
        slots = self.fetch_slots(tracker)
        slots.update({
            "file" : url,
            "username" : username,
            "schema" : "record"
        })
        data = {
            "asset" : slots,
            "token": token
        }
        res = requests.post(f"{APP_URL}/chatbot/upload", json=data)
        print(res.json())
        dispatcher.utter_message(text=f"Your Medical Record is Successfully Uploaded")
        

class ActionConfirmation(Action):

    def name(self):
        return "action_confirmation"

    def run(self, dispatcher, tracker, domain):
        conform = tracker.latest_message
        print(conform)
        dispatcher.utter_message(text="You have entered the bigchaindb part")  

class ActionGetAllRecords(Action):

    def name(self):
        return "action_get_all_records"

    def run(self, dispatcher, tracker, domain):
        username = tracker.sender_id
        if (not username):
            dispatcher.utter_message(text="Found no records for mentioned user")
        res = requests.post(f"{APP_URL}/chatbot/getall", json={"username" : username})
        records = res.json()
        dispatcher.utter_message(json_message={"payload":"listdocuments","data":records})

class ActionSearchTreat(Action):
    def name(self) -> Text:
        return "action_search_treat"

    def run(self,
            dispatcher: CollectingDispatcher,
            tracker: Tracker,
            domain: Dict[Text, Any]):
        disease = tracker.get_slot("disease")
        pre_disease = tracker.get_slot("sure")
        print("pre_disease::::" + str(pre_disease))
        
        possible_diseases = retrieve_disease_name(disease)
        if disease == pre_disease or len(possible_diseases) == 1:
            a = graph.run("match (a:Disease{name: {disease}}) return a", disease=disease).data()[0]['a']
            if "intro" in a:
                intro = a['intro']
                template = "{0}的简介：{1}"
                retmsg = template.format(disease, intro)
            else:
                retmsg = disease + "暂无简介"
            dispatcher.utter_message(retmsg)
            if "treat" in a:
                treat = a['treat']
                template = "{0}的治疗方式有：{1}"
                retmsg = template.format(disease, "、".join(treat))
            else:
                retmsg = disease + "暂无常见治疗方式"
            dispatcher.utter_message(retmsg)
        elif len(possible_diseases) > 1:
            buttons = []
            for d in possible_diseases:
                buttons.append(make_button(d, '/search_treat{{"disease":"{0}", "sure":"{1}"}}'.format(d, d)))
            dispatcher.utter_button_message("Please click to select the disease you want to inquire, if there is nothing you want, please ignore this message", buttons)
        else:
            dispatcher.utter_message("Nothing in the knowledge base {0}".format(disease))
        return []

class ActionSearchSymptom(Action):
    def name(self) -> Text:
        return "action_search_symptom"

    def run(self,
            dispatcher: CollectingDispatcher,
            tracker: Tracker,
            domain: Dict[Text, Any]):
        disease = tracker.get_slot("disease")
        pre_disease = tracker.get_slot("sure")
        print("pre_disease::::" + str(pre_disease))
        
        possible_diseases = retrieve_disease_name(disease)
        if disease == pre_disease or len(possible_diseases) == 1:
            retmsg = [x['s.name'] for x in graph.run("MATCH (p:Disease{name: {disease}})-[r:has_symptom]->\
                                                (s:Symptom) RETURN s.name", disease=disease).data()]
            dispatcher.utter_message(retmsg)
        elif len(possible_diseases) > 1:
            buttons = []
            for d in possible_diseases:
                buttons.append(make_button(d, '/search_symptom{{"disease":"{0}", "sure":"{1}"}}'.format(d, d)))
            dispatcher.utter_button_message("Please click to select the disease you want to inquire, if there is nothing you want, please ignore this message", buttons)
        else:
            dispatcher.utter_message("Nothing in the knowledge base {0} 相关的症状记录".format(disease))

        return []


class ActionSearchCause(Action):
    def name(self) -> Text:
        return "action_search_cause"

    def run(self,
            dispatcher: CollectingDispatcher,
            tracker: Tracker,
            domain: Dict[Text, Any]):
        disease = tracker.get_slot("disease")
        pre_disease = tracker.get_slot("sure")
        print("pre_disease::::" + str(pre_disease))
        
        possible_diseases = retrieve_disease_name(disease)
        if disease == pre_disease or len(possible_diseases) == 1:
            a = graph.run("match (a:Disease{name: {disease}}) return a.cause", disease=disease).data()[0]['a.cause']
            if "treat" in a:
                treat = a['treat']
                template = "{0}的治疗方式有：{1}"
                retmsg = template.format(disease, "、".join(treat))
            else:
                retmsg = disease + "暂无该疾病的病因的记录"
            dispatcher.utter_message(retmsg)
        elif len(possible_diseases) > 1:
            buttons = []
            for d in possible_diseases:
                buttons.append(make_button(d, '/search_cause{{"disease":"{0}", "sure":"{1}"}}'.format(d, d)))
            dispatcher.utter_button_message("Please click to select the disease you want to inquire, if there is nothing you want, please ignore this message", buttons)
        else:
            dispatcher.utter_message("Nothing in the knowledge base {0} 相关的原因记录".format(disease))
        return []


class ActionSearchDiseaseDept(Action):
    def name(self) -> Text:
        return "action_search_disease_dept"

    def run(self,
            dispatcher: CollectingDispatcher,
            tracker: Tracker,
            domain: Dict[Text, Any]):
        disease = tracker.get_slot("disease")
        pre_disease = tracker.get_slot("sure")
        print("pre_disease::::" + str(pre_disease))
        
        possible_diseases = retrieve_disease_name(disease)
        if disease == pre_disease or len(possible_diseases) == 1:
            result = graph.run("match (a:Disease{name: {disease}})-[:belongs_to]->(s:Department) return s.name",
                          disease=disease).data()[0]['s.name']
            template = f"{disease} belongs {result}"
            dispatcher.utter_message(text = template)

        elif len(possible_diseases) > 1:
            buttons = []
            for d in possible_diseases:
                buttons.append(make_button(d, '/search_disease_dept{{"disease":"{0}", "sure":"{1}"}}'.format(d, d)))
            dispatcher.utter_button_message("Please click to select the disease you want to inquire,if there is nothing you want, please ignore this message", buttons)
        else:
            dispatcher.utter_message("Nothing in the knowledge base {0} Disease-related department records".format(disease))
        return []
