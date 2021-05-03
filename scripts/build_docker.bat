@CALL rasa/Scripts/activate.bat
@start /b /w cmd /c "python -m pip install --upgrade pip && pip3 install python-dotenv py2neo pandas"
@start /b /w cmd /c "docker-compose up -d --build"
@start /b cmd /c "cd QA-engine/Knowledge-Base && python build_medicalgraph.py"

