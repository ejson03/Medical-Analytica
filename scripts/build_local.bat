@CALL rasa/Scripts/activate.bat
@start /b /w cmd /c "python -m pip install --upgrade pip && pip3 install -r requirements.txt"
@start /b /w cmd /c "docker-compose up -d --build"
@start /b /w cmd /c "cd QA-engine/Knowledge-Base && python build_medicalgraph.py"
@CALL scripts/runserver.bat

