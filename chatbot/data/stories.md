## story 4
* greet
    - utter_greet
* ask_weather_location
	- action_weather
* goodbye
    - utter_goodbye

## story 5
* greet
    - utter_greet
* ask_temperature
	- action_temp
* goodbye
    - utter_goodbye
  
## Generated Story 1
* greet
    - utter_greet
* ask_weather_location{"location": "Mumbai"}
    - slot{"location": "Mumbai"}
    - action_weather
    - slot{"location": "Mumbai"}
    - utter_did_that_help
* goodbye
    - utter_goodbye

## Generated Story 2
* greet
    - utter_greet
* ask_weather_location{"location": "Delhi"}
    - slot{"location": "Delhi"}
    - action_weather
    - slot{"location": "Delhi"}
    - utter_did_that_help
* goodbye
    - utter_goodbye

## Generated Story 3
* greet
    - utter_greet
* ask_temperature{"location": "Banglore"}
    - slot{"location": "Banglore"}
    - action_temp
    - slot{"location": "Banglore"}
    - utter_did_that_help
* goodbye
    - utter_goodbye

## Generated Story 4
* greet
    - utter_greet
* ask_weather_location{"location": "Pune"}
    - slot{"location": "Pune"}
    - action_weather
    - slot{"location": "Pune"}
    - utter_did_that_help
* goodbye
    - utter_goodbye

## Generated Story 5
* greet
    - utter_greet
* ask_weather_location{"location": "Chennai"}
    - slot{"location": "Chennai"}
    - action_weather
    - slot{"location": "Chennai"}
    - utter_did_that_help
* goodbye
    - utter_goodbye

## Generated Story 6
* greet
    - utter_greet
* ask_weather_location{"location": "Kolkata"}
    - slot{"location": "Kolkata"}
    - action_weather
    - slot{"location": "Kolkata"}
    - utter_did_that_help
* goodbye
    - utter_goodbye

## Generated Story 7
* greet
    - utter_greet
* ask_weather_location{"location": "Jaipur"}
    - slot{"location": "Jaipur"}
    - action_weather
    - slot{"location": "Jaipur"}
    - utter_did_that_help
* ask_weather_location{"location": "Nagpur"}
    - slot{"location": "Nagpur"}
    - action_weather
    - slot{"location": "Nagpur"}
    - utter_did_that_help
* goodbye
    - utter_goodbye

## Generated Story 8
* greet
    - utter_greet
* ask_temperature{"location": "Bhopal"}
    - slot{"location": "Bhopal"}
    - action_temp
    - slot{"location": "Bhopal"}
    - utter_did_that_help
* ask_temperature{"location": "Bhopal"}
    - slot{"location": "Bhopal"}
    - action_temp
    - slot{"location": "Bhopal"}
    - utter_did_that_help
* goodbye
    - utter_goodbye

## Generated Story 9
* greet
    - utter_greet
* ask_weather_location{"location": "Hyderabad"}
    - slot{"location": "Hyderabad"}
    - action_weather
    - utter_did_that_help

## happy path ehr_form
* greet
    - utter_greet
* ask_form
    - utter_form
* ask_ehr_form
    - action_reset_slot
    - ehr_form
    - form{"name": "ehr_form"}
    - form{"name": null}
    - utter_confirm
    - action_upload
    - action_listen
    - action_set_file
* smalltalk_appraisal_thank_you
  - utter_smalltalk_appraisal_thank_you

## unhappy path ehr_form
* greet
    - utter_greet
* ask_form
    - utter_form
* ask_ehr_form
    - action_reset_slot
    - ehr_form
    - form{"name": "ehr_form"}
* smalltalk_greetings_how_are_you
    - utter_smalltalk_greetings_how_are_you
    - ehr_form
    - form{"name": null}
    - utter_confirm
    - action_upload
    - action_listen
    - action_set_file
* smalltalk_appraisal_thank_you
  - utter_smalltalk_appraisal_thank_you

## very unhappy path ehr_form
* greet
    - utter_greet
* ask_form
    - utter_form
* ask_ehr_form
    - action_reset_slot
    - ehr_form
    - form{"name": "ehr_form"}
* smalltalk_agent_chatbot
  - utter_smalltalk_agent_chatbot
    - ehr_form
* smalltalk_greetings_how_are_you
    - utter_smalltalk_greetings_how_are_you
    - ehr_form
    - form{"name": null}
    - utter_confirm
    - action_upload
    - action_listen
    - action_set_file
* smalltalk_appraisal_thank_you
  - utter_smalltalk_appraisal_thank_you

## stop but continue path ehr_form
* greet
    - utter_greet
* ask_form
    - utter_form
* ask_ehr_form
    - action_reset_slot
    - ehr_form
    - form{"name": "ehr_form"}
* smalltalk_confirmation_cancel
    - utter_smalltalk_user_busy
* affirm
    - ehr_form
    - form{"name": null}
    - utter_confirm
    - action_upload
    - action_listen
    - action_set_file
* smalltalk_appraisal_thank_you
  - utter_smalltalk_appraisal_thank_you

## stop and really stop path ehr_form
* greet
    - utter_greet
* ask_form
    - utter_form
* ask_ehr_form
    - action_reset_slot
    - ehr_form
    - form{"name": "ehr_form"}
* smalltalk_confirmation_cancel
    - utter_smalltalk_user_busy
* deny
    - action_deactivate_form
    - form{"name": null}

## chitchat stop but continue path ehr_form
* ask_ehr_form
    - action_reset_slot
    - ehr_form
    - form{"name": "ehr_form"}
* smalltalk_greetings_how_are_you
    - utter_smalltalk_greetings_how_are_you
    - ehr_form
* smalltalk_confirmation_cancel
    - utter_smalltalk_user_busy
* affirm
    - ehr_form
    - form{"name": null}
    - utter_confirm
    - action_upload
    - action_listen
    - action_set_file
* smalltalk_appraisal_thank_you
  - utter_smalltalk_appraisal_thank_you

## stop but continue and chitchat path ehr_form 
* greet
    - utter_greet
* ask_ehr_form
    - action_reset_slot
    - ehr_form
    - form{"name": "ehr_form"}
* smalltalk_confirmation_cancel
    - utter_smalltalk_user_busy
* affirm
    - ehr_form
* smalltalk_greetings_how_are_you
    - utter_smalltalk_greetings_how_are_you
    - ehr_form
    - form{"name": null}
    - utter_confirm
    - action_upload
    - action_listen
    - action_set_file
* smalltalk_appraisal_thank_you
  - utter_smalltalk_appraisal_thank_you

## chitchat stop but continue and chitchat path ehr_form
* greet
    - utter_greet
* ask_ehr_form
    - action_reset_slot
    - ehr_form
    - form{"name": "ehr_form"}
* smalltalk_greetings_how_are_you
    - utter_smalltalk_greetings_how_are_you
    - ehr_form
* smalltalk_confirmation_cancel
    - utter_smalltalk_user_busy
* affirm
    - ehr_form
* smalltalk_greetings_how_are_you
    - utter_smalltalk_greetings_how_are_you
    - ehr_form
    - form{"name": null}
    - utter_confirm
    - action_upload
    - action_listen
    - action_set_file
* smalltalk_appraisal_thank_you
  - utter_smalltalk_appraisal_thank_you

## chitchat stop and really stop path ehr_form
* greet
    - utter_greet
* ask_ehr_form
    - action_reset_slot
    - ehr_form
    - form{"name": "ehr_form"}
* smalltalk_greetings_how_are_you
    - utter_smalltalk_greetings_how_are_you
    - ehr_form
* smalltalk_confirmation_cancel
    - utter_smalltalk_user_busy
* deny
    - action_deactivate_form
    - form{"name": null}

## happy path file_form
* greet
    - utter_greet
* ask_form
    - utter_form
* ask_upload
    - action_reset_slot
    - file_form
    - form{"name": "file_form"}
    - form{"name": null}
    - utter_file
    - action_upload
    - action_listen
    - action_set_file
* smalltalk_appraisal_thank_you
  - utter_smalltalk_appraisal_thank_you

## unhappy path file_form
* greet
    - utter_greet
* ask_form
    - utter_form
* ask_upload
    - action_reset_slot
    - file_form
    - form{"name": "file_form"}
* smalltalk_greetings_how_are_you
    - utter_smalltalk_greetings_how_are_you
    - file_form
    - form{"name": null}
    - utter_file
    - action_upload
    - action_listen
    - action_set_file
* smalltalk_appraisal_thank_you
  - utter_smalltalk_appraisal_thank_you

## very unhappy path file_form
* greet
    - utter_greet
* ask_form
    - utter_form
* ask_upload
    - action_reset_slot
    - file_form
    - form{"name": "file_form"}
* smalltalk_agent_chatbot
  - utter_smalltalk_agent_chatbot
    - file_form
* smalltalk_greetings_how_are_you
    - utter_smalltalk_greetings_how_are_you
    - file_form
    - form{"name": null}
    - utter_file
    - action_upload
    - action_listen
    - action_set_file
* smalltalk_appraisal_thank_you
  - utter_smalltalk_appraisal_thank_you

## stop but continue path file_form
* greet
    - utter_greet
* ask_form
    - utter_form
* ask_upload
    - action_reset_slot
    - file_form
    - form{"name": "file_form"}
* smalltalk_confirmation_cancel
    - utter_smalltalk_user_busy
* affirm
    - file_form
    - form{"name": null}
    - utter_file
    - action_upload
    - action_listen
    - action_set_file
* smalltalk_appraisal_thank_you
  - utter_smalltalk_appraisal_thank_you

## stop and really stop path file_form
* greet
    - utter_greet
* ask_form
    - utter_form
* ask_upload
    - action_reset_slot
    - file_form
    - form{"name": "file_form"}
* smalltalk_confirmation_cancel
    - utter_smalltalk_user_busy
* deny
    - action_deactivate_form
    - form{"name": null}

## chitchat stop but continue path file_form
* ask_upload
    - action_reset_slot
    - file_form
    - form{"name": "file_form"}
* smalltalk_greetings_how_are_you
    - utter_smalltalk_greetings_how_are_you
    - file_form
* smalltalk_confirmation_cancel
    - utter_smalltalk_user_busy
* affirm
    - file_form
    - form{"name": null}
    - utter_file
    - action_upload
    - action_listen
    - action_set_file
* smalltalk_appraisal_thank_you
  - utter_smalltalk_appraisal_thank_you

## stop but continue and chitchat path file_form 
* greet
    - utter_greet
* ask_upload
    - action_reset_slot
    - file_form
    - form{"name": "file_form"}
* smalltalk_confirmation_cancel
    - utter_smalltalk_user_busy
* affirm
    - file_form
* smalltalk_greetings_how_are_you
    - utter_smalltalk_greetings_how_are_you
    - file_form
    - form{"name": null}
    - utter_file
    - action_upload
    - action_listen
    - action_set_file
* smalltalk_appraisal_thank_you
  - utter_smalltalk_appraisal_thank_you

## chitchat stop but continue and chitchat path file_form
* greet
    - utter_greet
* ask_upload
    - action_reset_slot
    - file_form
    - form{"name": "file_form"}
* smalltalk_greetings_how_are_you
    - utter_smalltalk_greetings_how_are_you
    - file_form
* smalltalk_confirmation_cancel
    - utter_smalltalk_user_busy
* affirm
    - file_form
* smalltalk_greetings_how_are_you
    - utter_smalltalk_greetings_how_are_you
    - file_form
    - form{"name": null}
    - utter_file
    - action_upload
    - action_listen
    - action_set_file
* smalltalk_appraisal_thank_you
  - utter_smalltalk_appraisal_thank_you

## chitchat stop and really stop path file_form
* greet
    - utter_greet
* ask_upload
    - action_reset_slot
    - file_form
    - form{"name": "file_form"}
* smalltalk_greetings_how_are_you
    - utter_smalltalk_greetings_how_are_you
    - file_form
* smalltalk_confirmation_cancel
    - utter_smalltalk_user_busy
* deny
    - action_deactivate_form
    - form{"name": null}

## blockchain conform
* conform_yes OR conform_no
  - action_confirmation

## happy path 1
* greet
  - utter_greet
* get_emotion
  - action_get_song
* describe_symptoms
  - action_diagnose_symptoms
  - action_symptoms
* goodbye
  - utter_goodbye

## sad path 1
* greet
  - utter_greet
* get_emotion
  - action_get_song
* affirm
  - utter_ask_howdoing
* describe_symptoms
  - action_diagnose_symptoms
  - action_symptoms
* goodbye
  - utter_goodbye

## sad path 2
* greet
  - utter_greet
* get_emotion
  - action_get_song
* deny
  - utter_goodbye

## story check
* greet
  - utter_greet
* get_emotion
  - action_get_song
* describe_symptoms
  - action_diagnose_symptoms
  - action_symptoms
* show_map
  - action_show_map
* goodbye
  - utter_goodbye

## show map
* greet
  - utter_greet
* show_map
  - action_show_map
* smalltalk_appraisal_thank_you
  - utter_smalltalk_appraisal_thank_you

## story_6
* out_of_scope
  - utter_default

## happy_path
* greet
  - utter_greet
* get_emotion
  - action_get_song
* goodbye
  - utter_goodbye

## joke_path
* greet
  - utter_greet
* telljoke
  - action_get_joke
* smalltalk_user_joking
  - utter_smalltalk_user_joking
* smalltalk_appraisal_thank_you
  - utter_smalltalk_appraisal_thank_you

## quote_path
* greet
  - utter_greet
* tellquote
  - action_get_quote
* smalltalk_appraisal_thank_you
  - utter_smalltalk_appraisal_thank_you

## path_smalltalk_agent_age
* smalltalk_agent_age
  - utter_smalltalk_agent_age

## path_smalltalk_agent_annoying
* smalltalk_agent_annoying
  - utter_smalltalk_agent_annoying

## path_smalltalk_agent_answer_my_question
* smalltalk_agent_answer_my_question
  - utter_smalltalk_agent_answer_my_question

## path_smalltalk_agent_bad
* smalltalk_agent_bad
  - utter_smalltalk_agent_bad

## path_smalltalk_agent_be_clever
* smalltalk_agent_be_clever
  - utter_smalltalk_agent_be_clever

## path_smalltalk_agent_beautiful
* smalltalk_agent_beautiful
  - utter_smalltalk_agent_beautiful

## path_smalltalk_agent_birth_date
* smalltalk_agent_birth_date
  - utter_smalltalk_agent_birth_date

## path_smalltalk_agent_boring
* smalltalk_agent_boring
  - utter_smalltalk_agent_boring

## path_smalltalk_agent_boss
* smalltalk_agent_boss
  - utter_smalltalk_agent_boss

## path_smalltalk_agent_busy
* smalltalk_agent_busy
  - utter_smalltalk_agent_busy

## path_smalltalk_agent_chatbot
* smalltalk_agent_chatbot
  - utter_smalltalk_agent_chatbot

## path_smalltalk_agent_clever
* smalltalk_agent_clever
  - utter_smalltalk_agent_clever

## path_smalltalk_agent_crazy
* smalltalk_agent_crazy
  - utter_smalltalk_agent_crazy

## path_smalltalk_agent_fired
* smalltalk_agent_fired
  - utter_smalltalk_agent_fired

## path_smalltalk_agent_funny
* smalltalk_agent_funny
  - utter_smalltalk_agent_funny

## path_smalltalk_agent_good
* smalltalk_agent_good
  - utter_smalltalk_agent_good

## path_smalltalk_agent_hungry
* smalltalk_agent_hungry
  - utter_smalltalk_agent_hungry

## path_smalltalk_agent_marry_user
* smalltalk_agent_marry_user
  - utter_smalltalk_agent_marry_user

## path_smalltalk_agent_my_friend
* smalltalk_agent_my_friend
  - utter_smalltalk_agent_my_friend

## path_smalltalk_agent_occupation
* smalltalk_agent_occupation
  - utter_smalltalk_agent_occupation

## path_smalltalk_agent_origin
* smalltalk_agent_origin
  - utter_smalltalk_agent_origin

## path_smalltalk_agent_ready
* smalltalk_agent_ready
  - utter_smalltalk_agent_ready

## path_smalltalk_agent_real
* smalltalk_agent_real
  - utter_smalltalk_agent_real

## path_smalltalk_agent_residence
* smalltalk_agent_residence
  - utter_smalltalk_agent_residence

## path_smalltalk_agent_right
* smalltalk_agent_right
  - utter_smalltalk_agent_right

## path_smalltalk_agent_sure
* smalltalk_agent_sure
  - utter_smalltalk_agent_sure

## path_smalltalk_agent_talk_to_me
* smalltalk_agent_talk_to_me
  - utter_smalltalk_agent_talk_to_me

## path_smalltalk_agent_there
* smalltalk_agent_there
  - utter_smalltalk_agent_there

## path_smalltalk_appraisal_bad
* smalltalk_appraisal_bad
  - utter_smalltalk_appraisal_bad

## path_smalltalk_appraisal_good
* smalltalk_appraisal_good
  - utter_smalltalk_appraisal_good

## path_smalltalk_appraisal_no_problem
* smalltalk_appraisal_no_problem
  - utter_smalltalk_appraisal_no_problem

## path_smalltalk_appraisal_welcome
* smalltalk_appraisal_welcome
  - utter_smalltalk_appraisal_welcome

## path_smalltalk_appraisal_well_done
* smalltalk_appraisal_well_done
  - utter_smalltalk_appraisal_well_done

## path_smalltalk_dialog_hold_on
* smalltalk_dialog_hold_on
  - utter_smalltalk_dialog_hold_on

## path_smalltalk_dialog_hug
* smalltalk_dialog_hug
  - utter_smalltalk_dialog_hug

## path_smalltalk_dialog_i_do_not_care
* smalltalk_dialog_i_do_not_care
  - utter_smalltalk_dialog_i_do_not_care

## path_smalltalk_dialog_sorry
* smalltalk_dialog_sorry
  - utter_smalltalk_dialog_sorry

## path_smalltalk_dialog_what_do_you_mean
* smalltalk_dialog_what_do_you_mean
  - utter_smalltalk_dialog_what_do_you_mean

## path_smalltalk_dialog_wrong
* smalltalk_dialog_wrong
  - utter_smalltalk_dialog_wrong

## path_smalltalk_greetings_goodevening
* smalltalk_greetings_goodevening
  - utter_smalltalk_greetings_goodevening

## path_smalltalk_greetings_goodmorning
* smalltalk_greetings_goodmorning
  - utter_smalltalk_greetings_goodmorning

## path_smalltalk_greetings_goodnight
* smalltalk_greetings_goodnight
  - utter_smalltalk_greetings_goodnight

## path_smalltalk_greetings_whatsup
* smalltalk_greetings_whatsup
  - utter_smalltalk_greetings_whatsup

## path_smalltalk_user_back
* smalltalk_user_back
  - utter_smalltalk_user_back

## path_smalltalk_user_bored
* smalltalk_user_bored
  - utter_smalltalk_user_bored

## path_smalltalk_user_busy
* smalltalk_user_busy
  - utter_smalltalk_user_busy

## path_smalltalk_user_can_not_sleep
* smalltalk_user_can_not_sleep
  - utter_smalltalk_user_can_not_sleep

## path_smalltalk_user_does_not_want_to_talk
* smalltalk_user_does_not_want_to_talk
  - utter_smalltalk_user_does_not_want_to_talk

## path_smalltalk_user_excited
* smalltalk_user_excited
  - utter_smalltalk_user_excited

## path_smalltalk_user_going_to_bed
* smalltalk_user_going_to_bed
  - utter_smalltalk_user_going_to_bed

## path_smalltalk_user_good
* smalltalk_user_good
  - utter_smalltalk_user_good

## path_smalltalk_user_has_birthday
* smalltalk_user_has_birthday
  - utter_smalltalk_user_has_birthday

## path_smalltalk_user_here
* smalltalk_user_here
  - utter_smalltalk_user_here

## path_smalltalk_user_likes_agent
* smalltalk_user_likes_agent
  - utter_smalltalk_user_likes_agent

## path_smalltalk_user_looks_like
* smalltalk_user_looks_like
  - utter_smalltalk_user_looks_like

## path_smalltalk_user_loves_agent
* smalltalk_user_loves_agent
  - utter_smalltalk_user_loves_agent

## path_smalltalk_user_misses_agent
* smalltalk_user_misses_agent
  - utter_smalltalk_user_misses_agent

## path_smalltalk_user_needs_advice
* smalltalk_user_needs_advice
  - utter_smalltalk_user_needs_advice

## path_smalltalk_user_sleepy
* smalltalk_user_sleepy
  - utter_smalltalk_user_sleepy

## path_smalltalk_user_testing_agent
* smalltalk_user_testing_agent
  - utter_smalltalk_user_testing_agent

## path_smalltalk_user_tired
* smalltalk_user_tired
  - utter_smalltalk_user_tired

## path_smalltalk_user_waits
* smalltalk_user_waits
  - utter_smalltalk_user_waits

## path_smalltalk_user_wants_to_see_agent_again
* smalltalk_user_wants_to_see_agent_again
  - utter_smalltalk_user_wants_to_see_agent_again

## path_smalltalk_user_wants_to_talk
* smalltalk_user_wants_to_talk
  - utter_smalltalk_user_wants_to_talk

## path_smalltalk_user_will_be_back
* smalltalk_user_will_be_back
  - utter_smalltalk_user_will_be_back

