@CALL rasa/Scripts/activate.bat
@CALL scripts/env.bat
@start /b cmd /c "cd actions && rasa run actions"
@start /b cmd /c "cd chatbot && rasa run -m models --endpoint endpoints.yml --credentials credentials.yml --enable-api --debug"
@start /b cmd /c "cd server && npm start"
