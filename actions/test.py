from py2neo import Graph,Node,Relationship
import pandas as pd
from modules.config import * 
import difflib
import random
import time


disease_file = './assets/disease.txt'
fileName = "./assets/medical_kb.csv"
disease_names = [i.strip() for i in open(disease_file, 'r', encoding='UTF-8').readlines()]
df = pd.read_csv(fileName)

try:
    graph = Graph(
            host=NEO4J_STRING,
            http_port=7474,
            user=NEO4J_USERNAME,
            password= NEO4J_PASSWORD)
except Exception as e:
    print(e)
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

def get_disease(disease):
    possible_diseases = list(difflib.get_close_matches(disease, disease_names))
    if len(possible_diseases) == 0:
        possible_diseases = retrieve_disease_name(disease)
    return possible_diseases


def treatment(disease):
    disease = get_disease(disease)
    disease = random.choice(disease)
    a = graph.run("match (a:Disease{name: $disease}) return a", disease=disease).data()[0]['a']
    print(a)
   
def symptom(disease):
    disease = get_disease(disease)
    disease = random.choice(disease)
    a = [x['s.name'] for x in graph.run("MATCH (p:Disease{name: $disease})-[r:has_symptom]->\
                                            (s:Symptom) RETURN s.name", disease=disease).data()]
    a = '\n'.join(a)
    print(a)
    
 
def cause(disease):
    disease = get_disease(disease)
    disease = random.choice(disease)
    a = graph.run("match (a:Disease{name: $disease}) return a.cause", disease=disease).data()[0]['a.cause']
    print(a)
 

def department(disease):
    disease = get_disease(disease)
    disease = random.choice(disease)
    a = graph.run("match (a:Disease{name: $disease})-[:belongs_to]->(s:Department) return s.name",
                        disease=disease).data()[0]['s.name']
 


def csv_query(disease):
    disease = get_disease(disease)
    disease = random.choice(disease)
    result = df.loc[df['name'] == disease]
  
start = time.time()
for i in range(10000):
    csv_query("poisoning")
end = time.time()
print(end - start)

start = time.time()
for i in range(10000):
    department("poisoning")
end = time.time()
print(end - start)


