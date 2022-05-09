import requests
from requests.structures import CaseInsensitiveDict

url = "https://jkanime.net/gsplay/redirect_post.php"

headers = CaseInsensitiveDict()
headers["Referer"] = "https://jkanime.net/um2.php?e=b1NQUjJnU2lZOFFRS2NKZzJxR2RJZVEwVmFzSkVlS09kN2lKSmRxRVd6dXZVSFBtaEoxeGdFQkZWZlRYeUF1cWNuamcxY0NNVG15d3VXOExKTkszdmc9PTo62CfiFSa07.Cb0a9a7p308w--"
headers["Content-Type"] = "application/x-www-form-urlencoded"

data = "data=MU4zdWk2dlpNTVZOb2RMalN2cUxJMm1BdE9ES1hPMFRBZEZZTVJqL0hxQ00weWtuUFB5T0hKdjg3dlRvd29mRw"


resp = requests.post(url, headers=headers, data=data)

print(resp.status_code)