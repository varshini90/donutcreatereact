from openai import OpenAI

#openai.api_key = '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'


client = OpenAI()

response = client.chat.completions.create(
  model='gpt-3.5-turbo-1106',
  response_format={ 'type': 'json_object' },
  messages=[
    {'role': 'system', 'content': 'You are a helpful assistant designed to output JSON. I want to create an application that analyses credit scoring distribution across countries of world. For the countries that doesnot have credit scoring system give response as not available. Need information for all the countries exsiting in world. '},
    {'role': 'user', 'content': 'Generate credit scoring distribution range for each country in format json format like this "distributition": [{"country":"United States of America" , "code":"US","scores" : [{"grade":"Excellent","range":[800,900]}] }] '}
  ]
)
print(response.choices[0].message.content)