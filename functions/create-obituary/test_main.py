
from main import *

# def test_get_keys():
#     keys = get_keys("/the-last-show/gpt-key")
#     print(keys)



def test_upload():
    filename = "ctc.png"
    res = upload_to_cloudinary(filename, extra_fields={"eager": "e_art:zorro,e_grayscale"})
    #put this url in dynamodb table
    #send this url back to the front end to be used
    print(res["eager"][0]["secure_url"])


    assert res is not None



def test_gpt():
    prompt = "write an obituary about a fictional character named {name} who was born on {born_year} and died on {died_year}"
    res = ask_gpt(prompt)
    print(res)
    assert len(res) > 0


def test_polly():
    text = "UofC is shitty asf"
    res = read_this(text)

    assert os.path.exists(res)

    #pass this url to the front end
    res = upload_to_cloudinary(res, resource_type="raw")
    print(res["secure_url"])
    assert len(res["secure_url"]) > 0
